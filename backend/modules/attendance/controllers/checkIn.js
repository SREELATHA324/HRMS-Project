const pool = require('../../../db');
const { getEmployeeByUserId, getAssignedShift, getActiveRule, calculateLateMinutes } = require('../services/attendanceService');

function getLocalDateString() {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
}

async function checkIn(req, res) {
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
        const existingRecord = await client.query(
            'SELECT * FROM attendance_records WHERE employee_id = $1 AND attendance_date = $2',
            [employee.id, todayStr]
        );

        await client.query('BEGIN');

        if (existingRecord.rows.length > 0) {
            const record = existingRecord.rows[0];
            if (record.check_out) {
                await client.query('DELETE FROM attendance_checkins WHERE attendance_id = $1', [record.id]);
                await client.query('DELETE FROM overtime_records WHERE attendance_id = $1', [record.id]);
                await client.query('DELETE FROM attendance_corrections WHERE attendance_id = $1', [record.id]);
                await client.query('DELETE FROM attendance_records WHERE id = $1', [record.id]);
            } else {
                await client.query('ROLLBACK');
                client.release();
                return res.status(409).json({
                    success: false,
                    message: 'Already checked in for today'
                });
            }
        }

        const shift = await getAssignedShift(employee.id, todayStr);
        if (!shift) {
            await client.query('ROLLBACK');
            client.release();
            return res.status(400).json({
                success: false,
                message: 'No shift assigned or available'
            });
        }

        const rule = await getActiveRule();
        const now = new Date();
        const lateCalc = calculateLateMinutes(
            now,
            shift.start_time,
            shift.grace_minutes,
            rule.grace_period_minutes,
            todayStr
        );

        const insertRecordQuery = `
            INSERT INTO attendance_records (
                employee_id, attendance_date, check_in, status, 
                is_late, late_minutes, is_early_checkout, early_checkout_minutes,
                is_half_day, shift_id, working_hours, overtime_hours
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `;

        const recordResult = await client.query(insertRecordQuery, [
            employee.id,
            todayStr,
            now,
            'Present',
            lateCalc.isLate,
            lateCalc.lateMinutes,
            false,
            0,
            false,
            shift.id,
            0,
            0
        ]);

        const attendanceRecord = recordResult.rows[0];

        const ip = ip_address || req.ip || req.connection.remoteAddress;
        const device = device_info || req.headers['user-agent'] || 'Unknown';

        await client.query(
            `INSERT INTO attendance_checkins (
                employee_id, attendance_id, event_type, event_time, 
                location, ip_address, device_info
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                employee.id,
                attendanceRecord.id,
                'check_in',
                now,
                location || 'Unknown',
                ip,
                device
            ]
        );

        await client.query('COMMIT');
        client.release();

        res.status(201).json({
            success: true,
            message: 'Checked in successfully',
            data: attendanceRecord
        });

    } catch (error) {
        await client.query('ROLLBACK');
        client.release();
        console.error('Check-in error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = checkIn;
