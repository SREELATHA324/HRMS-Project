const pool = require('../../../db');
const { 
    getEmployeeByUserId, 
    getAssignedShift, 
    getActiveRule, 
    calculateWorkingHours, 
    calculateEarlyCheckoutMinutes, 
    determineStatus, 
    calculateOvertime 
} = require('../services/attendanceService');

function getLocalDateString() {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
}

async function checkOut(req, res) {
    const { location, ip_address, device_info } = req.body;
    const client = await pool.connect();

    try {
        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            client.release();
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const todayStr = getLocalDateString();
        const attendanceRes = await client.query(
            `SELECT * FROM attendance_records 
             WHERE employee_id = $1 AND attendance_date = $2`,
            [employee.id, todayStr]
        );

        if (attendanceRes.rows.length === 0) {
            client.release();
            return res.status(400).json({
                success: false,
                message: 'No check-in record found for today. Please check in first.'
            });
        }

        const attendance = attendanceRes.rows[0];

        // ✅ FIXED: Check if check_out is NOT NULL
        if (attendance.check_out !== null && attendance.check_out !== undefined) {
            client.release();
            return res.status(409).json({
                success: false,
                message: 'Already checked out for today'
            });
        }

        const shift = await getAssignedShift(employee.id, todayStr);
        const rule = await getActiveRule();
        const now = new Date();

        const workingHours = calculateWorkingHours(attendance.check_in, now, shift.break_minutes);
        
        const earlyCalc = calculateEarlyCheckoutMinutes(
            attendance.check_in,
            now,
            shift.end_time,
            shift.is_overnight,
            rule.early_checkout_threshold_minutes
        );

        const statusCalc = determineStatus(workingHours, rule);
        const overtimeHours = calculateOvertime(workingHours, rule, shift);

        await client.query('BEGIN');

        const updateRecordQuery = `
            UPDATE attendance_records SET
                check_out = $1,
                working_hours = $2,
                is_early_checkout = $3,
                early_checkout_minutes = $4,
                status = $5,
                is_half_day = $6,
                overtime_hours = $7,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $8
            RETURNING *
        `;

        const recordResult = await client.query(updateRecordQuery, [
            now,
            workingHours,
            earlyCalc.isEarlyCheckout,
            earlyCalc.earlyCheckoutMinutes,
            statusCalc.status,
            statusCalc.isHalfDay,
            overtimeHours,
            attendance.id
        ]);

        const ip = ip_address || req.ip || req.connection.remoteAddress;
        const device = device_info || req.headers['user-agent'] || 'Unknown';

        await client.query(
            `INSERT INTO attendance_checkins (
                employee_id, attendance_id, event_type, event_time, 
                location, ip_address, device_info
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                employee.id,
                attendance.id,
                'check_out',
                now,
                location || 'Unknown',
                ip,
                device
            ]
        );

        if (overtimeHours > 0) {
            const shiftEnd = new Date(`${todayStr}T${shift.end_time}`);
            if (shift.is_overnight) {
                shiftEnd.setDate(shiftEnd.getDate() + 1);
            }

            const existingOvertime = await client.query(
                'SELECT id FROM overtime_records WHERE attendance_id = $1',
                [attendance.id]
            );

            if (existingOvertime.rows.length > 0) {
                await client.query(
                    `UPDATE overtime_records SET
                        overtime_hours = $1,
                        end_time = $2,
                        status = 'Pending'
                     WHERE attendance_id = $3`,
                    [overtimeHours, now, attendance.id]
                );
            } else {
                await client.query(
                    `INSERT INTO overtime_records (
                        employee_id, attendance_id, overtime_date, 
                        start_time, end_time, overtime_hours, status
                    ) VALUES ($1, $2, $3, $4, $5, $6, 'Pending')`,
                    [
                        employee.id,
                        attendance.id,
                        todayStr,
                        shiftEnd,
                        now,
                        overtimeHours
                    ]
                );
            }
        }

        await client.query('COMMIT');
        client.release();

        res.status(200).json({
            success: true,
            message: 'Checked out successfully',
            data: recordResult.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');
        client.release();
        console.error('Check-out error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = checkOut;