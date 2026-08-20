const pool = require('../../../db');
const { 
    getEmployeeByUserId, 
    getEmployeeById,
    getAssignedShift, 
    getActiveRule, 
    calculateWorkingHours, 
    calculateLateMinutes, 
    calculateEarlyCheckoutMinutes, 
    determineStatus, 
    calculateOvertime 
} = require('../services/attendanceService');

async function requestCorrection(req, res) {
    const { attendance_id, employee_id, date, requested_check_in, requested_check_out, reason } = req.body;
    const client = await pool.connect();

    try {
        const loggedInEmployee = await getEmployeeByUserId(req.user.id);
        if (!loggedInEmployee) {
            client.release();
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const role = req.user.role ? req.user.role.toLowerCase() : '';
        let targetEmployeeId = loggedInEmployee.id;

        if (employee_id && employee_id != loggedInEmployee.id) {
            if (role !== 'admin' && role !== 'hr' && role !== 'manager') {
                client.release();
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You cannot request correction for another employee'
                });
            }
            if (role === 'manager') {
                const targetEmp = await getEmployeeById(employee_id);
                if (!targetEmp || targetEmp.reportingManagerId != loggedInEmployee.id) {
                    client.release();
                    return res.status(403).json({
                        success: false,
                        message: 'Forbidden: You can only request correction for direct reports'
                    });
                }
            }
            targetEmployeeId = employee_id;
        }

        let finalAttendanceId = attendance_id;

        if (!finalAttendanceId) {
            if (!date) {
                client.release();
                return res.status(400).json({
                    success: false,
                    message: 'Either attendance_id or date is required'
                });
            }

            const attendanceRes = await client.query(
                'SELECT id FROM attendance_records WHERE employee_id = $1 AND attendance_date = $2',
                [targetEmployeeId, date]
            );

            if (attendanceRes.rows.length > 0) {
                finalAttendanceId = attendanceRes.rows[0].id;
            } else {
                const shift = await getAssignedShift(targetEmployeeId, date);
                const shiftId = shift ? shift.id : null;

                await client.query('BEGIN');
                const insertRes = await client.query(
                    `INSERT INTO attendance_records (
                        employee_id, attendance_date, status, 
                        is_late, late_minutes, is_early_checkout, early_checkout_minutes,
                        is_half_day, shift_id, working_hours, overtime_hours
                    ) VALUES ($1, $2, 'Absent', false, 0, false, 0, false, $3, 0, 0)
                     RETURNING id`,
                    [targetEmployeeId, date, shiftId]
                );
                finalAttendanceId = insertRes.rows[0].id;
                await client.query('COMMIT');
            }
        }

        const existingPending = await client.query(
            "SELECT id FROM attendance_corrections WHERE attendance_id = $1 AND status = 'Pending'",
            [finalAttendanceId]
        );

        if (existingPending.rows.length > 0) {
            client.release();
            return res.status(400).json({
                success: false,
                message: 'There is already a pending correction request for this attendance record'
            });
        }

        const insertCorrection = await client.query(
            `INSERT INTO attendance_corrections (
                attendance_id, employee_id, requested_check_in, requested_check_out, 
                reason, status, requested_at
            ) VALUES ($1, $2, $3, $4, $5, 'Pending', CURRENT_TIMESTAMP)
             RETURNING *`,
            [
                finalAttendanceId,
                targetEmployeeId,
                requested_check_in || null,
                requested_check_out || null,
                reason
            ]
        );

        client.release();

        res.status(201).json({
            success: true,
            message: 'Correction request submitted successfully',
            data: insertCorrection.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');
        client.release();
        console.error('Request correction error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function getCorrections(req, res) {
    const { status, employeeId } = req.query;

    try {
        const loggedInEmployee = await getEmployeeByUserId(req.user.id);
        if (!loggedInEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const role = req.user.role ? req.user.role.toLowerCase() : '';
        let query = `
            SELECT ac.*, 
                   e."employeeCode", e."firstName", e."lastName",
                   CONCAT(m."firstName", ' ', m."lastName") as reviewer_name,
                   ar.attendance_date, ar.check_in as current_check_in, ar.check_out as current_check_out, ar.status as current_status
            FROM attendance_corrections ac
            JOIN employees e ON ac.employee_id = e.id
            JOIN attendance_records ar ON ac.attendance_id = ar.id
            LEFT JOIN employees m ON ac.reviewed_by = m.id
        `;
        const params = [];
        let paramCount = 1;

        if (role === 'admin' || role === 'hr') {
            if (employeeId) {
                query += ` WHERE ac.employee_id = $${paramCount}`;
                params.push(employeeId);
                paramCount++;
            }
        } else if (role === 'manager') {
            if (employeeId) {
                const targetEmp = await getEmployeeById(employeeId);
                if (!targetEmp || (targetEmp.reportingManagerId != loggedInEmployee.id && targetEmp.id != loggedInEmployee.id)) {
                    return res.status(403).json({
                        success: false,
                        message: 'Forbidden: Cannot access corrections for this employee'
                    });
                }
                query += ` WHERE ac.employee_id = $${paramCount}`;
                params.push(employeeId);
                paramCount++;
            } else {
                query += ` WHERE (e."reportingManagerId" = $${paramCount} OR ac.employee_id = $${paramCount})`;
                params.push(loggedInEmployee.id);
                paramCount++;
            }
        } else {
            query += ` WHERE ac.employee_id = $${paramCount}`;
            params.push(loggedInEmployee.id);
            paramCount++;
        }

        if (status) {
            query += ` AND ac.status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        query += ` ORDER BY ac.requested_at DESC`;

        const result = await pool.query(query, params);

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get corrections error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function reviewCorrection(req, res) {
    const { id } = req.params;
    const { status, review_remarks } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be Approved or Rejected'
        });
    }

    const client = await pool.connect();

    try {
        const loggedInEmployee = await getEmployeeByUserId(req.user.id);
        if (!loggedInEmployee) {
            client.release();
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const role = req.user.role ? req.user.role.toLowerCase() : '';
        if (role !== 'admin' && role !== 'hr' && role !== 'manager') {
            client.release();
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Insufficient permissions to review correction'
            });
        }

        const corrRes = await client.query(
            'SELECT * FROM attendance_corrections WHERE id = $1',
            [id]
        );

        if (corrRes.rows.length === 0) {
            client.release();
            return res.status(404).json({
                success: false,
                message: 'Correction request not found'
            });
        }

        const correction = corrRes.rows[0];

        if (role === 'manager') {
            const emp = await getEmployeeById(correction.employee_id);
            if (!emp || emp.reportingManagerId != loggedInEmployee.id) {
                client.release();
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You can only review corrections for direct reports'
                });
            }
        }

        await client.query('BEGIN');

        await client.query(
            `UPDATE attendance_corrections SET
                status = $1,
                reviewed_by = $2,
                reviewed_at = CURRENT_TIMESTAMP,
                review_remarks = $3
             WHERE id = $4`,
            [status, loggedInEmployee.id, review_remarks || '', id]
        );

        if (status === 'Approved') {
            const attRes = await client.query(
                'SELECT * FROM attendance_records WHERE id = $1',
                [correction.attendance_id]
            );

            if (attRes.rows.length > 0) {
                const att = attRes.rows[0];
                const finalCheckIn = correction.requested_check_in || att.check_in;
                const finalCheckOut = correction.requested_check_out || att.check_out;

                const shift = await getAssignedShift(att.employee_id, att.attendance_date);
                const rule = await getActiveRule();

                let workingHours = 0;
                let isLate = false;
                let lateMinutes = 0;
                let isEarlyCheckout = false;
                let earlyCheckoutMinutes = 0;
                let overtimeHours = 0;
                let finalStatus = 'Absent';
                let isHalfDay = false;

                if (finalCheckIn) {
                    const lateCalc = calculateLateMinutes(
                        finalCheckIn,
                        shift.start_time,
                        shift.grace_minutes,
                        rule.grace_period_minutes
                    );
                    isLate = lateCalc.isLate;
                    lateMinutes = lateCalc.lateMinutes;
                }

                if (finalCheckIn && finalCheckOut) {
                    workingHours = calculateWorkingHours(finalCheckIn, finalCheckOut, shift.break_minutes);
                    
                    const earlyCalc = calculateEarlyCheckoutMinutes(
                        finalCheckIn,
                        finalCheckOut,
                        shift.end_time,
                        shift.is_overnight,
                        rule.early_checkout_threshold_minutes
                    );
                    isEarlyCheckout = earlyCalc.isEarlyCheckout;
                    earlyCheckoutMinutes = earlyCalc.earlyCheckoutMinutes;

                    const statusCalc = determineStatus(workingHours, rule);
                    finalStatus = statusCalc.status;
                    isHalfDay = statusCalc.isHalfDay;

                    overtimeHours = calculateOvertime(workingHours, rule, shift);
                } else if (finalCheckIn) {
                    finalStatus = 'Present';
                }

                await client.query(
                    `UPDATE attendance_records SET
                        check_in = $1,
                        check_out = $2,
                        working_hours = $3,
                        is_late = $4,
                        late_minutes = $5,
                        is_early_checkout = $6,
                        early_checkout_minutes = $7,
                        status = $8,
                        is_half_day = $9,
                        overtime_hours = $10,
                        remarks = $11,
                        updated_at = CURRENT_TIMESTAMP
                     WHERE id = $12`,
                    [
                        finalCheckIn,
                        finalCheckOut,
                        workingHours,
                        isLate,
                        lateMinutes,
                        isEarlyCheckout,
                        earlyCheckoutMinutes,
                        finalStatus,
                        isHalfDay,
                        overtimeHours,
                        correction.reason,
                        att.id
                    ]
                );
            }
        }

        await client.query('COMMIT');
        client.release();

        res.status(200).json({
            success: true,
            message: `Correction request ${status.toLowerCase()} successfully`
        });

    } catch (error) {
        await client.query('ROLLBACK');
        client.release();
        console.error('Review correction error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    requestCorrection,
    getCorrections,
    reviewCorrection
};