const pool = require('../../../db');
const { getEmployeeByUserId, getEmployeeById } = require('../services/attendanceService');

async function submitOvertime(req, res) {
    const { attendance_id, overtime_date, start_time, end_time, overtime_hours, remarks } = req.body;

    try {
        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const attendanceRes = await pool.query(
            'SELECT id FROM attendance_records WHERE id = $1 AND employee_id = $2',
            [attendance_id, employee.id]
        );
        if (attendanceRes.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Attendance record not found for this employee'
            });
        }

        const existingOvertime = await pool.query(
            'SELECT id FROM overtime_records WHERE attendance_id = $1',
            [attendance_id]
        );

        let result;
        if (existingOvertime.rows.length > 0) {
            result = await pool.query(
                `UPDATE overtime_records SET
                    overtime_date = $1,
                    start_time = $2,
                    end_time = $3,
                    overtime_hours = $4,
                    remarks = $5,
                    status = 'Pending'
                 WHERE attendance_id = $6
                 RETURNING *`,
                [overtime_date, start_time || null, end_time || null, overtime_hours, remarks || '', attendance_id]
            );
        } else {
            result = await pool.query(
                `INSERT INTO overtime_records (
                    employee_id, attendance_id, overtime_date, 
                    start_time, end_time, overtime_hours, status, remarks
                ) VALUES ($1, $2, $3, $4, $5, $6, 'Pending', $7)
                 RETURNING *`,
                [employee.id, attendance_id, overtime_date, start_time || null, end_time || null, overtime_hours, remarks || '']
            );
        }

        res.status(201).json({
            success: true,
            message: 'Overtime request submitted successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Submit overtime error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function getOvertime(req, res) {
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
            SELECT ot.*, 
                   e."employeeCode", e."firstName", e."lastName",
                   CONCAT(m."firstName", ' ', m."lastName") as manager_name
            FROM overtime_records ot
            JOIN employees e ON ot.employee_id = e.id
            LEFT JOIN employees m ON ot.approved_by = m.id
        `;
        const params = [];
        let paramCount = 1;

        if (role === 'admin' || role === 'hr') {
            if (employeeId) {
                query += ` WHERE ot.employee_id = $${paramCount}`;
                params.push(employeeId);
                paramCount++;
            }
        } else if (role === 'manager') {
            if (employeeId) {
                const targetEmp = await getEmployeeById(employeeId);
                if (!targetEmp || (targetEmp.reportingManagerId != loggedInEmployee.id && targetEmp.id != loggedInEmployee.id)) {
                    return res.status(403).json({
                        success: false,
                        message: 'Forbidden: Cannot access overtime for this employee'
                    });
                }
                query += ` WHERE ot.employee_id = $${paramCount}`;
                params.push(employeeId);
                paramCount++;
            } else {
                query += ` WHERE (e."reportingManagerId" = $${paramCount} OR ot.employee_id = $${paramCount})`;
                params.push(loggedInEmployee.id);
                paramCount++;
            }
        } else {
            query += ` WHERE ot.employee_id = $${paramCount}`;
            params.push(loggedInEmployee.id);
            paramCount++;
        }

        if (status) {
            query += ` AND ot.status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        query += ` ORDER BY ot.overtime_date DESC`;

        const result = await pool.query(query, params);

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get overtime error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function reviewOvertime(req, res) {
    const { id } = req.params;
    const { status, remarks } = req.body;

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
                message: 'Forbidden: Insufficient permissions to review overtime'
            });
        }

        const otRes = await client.query(
            'SELECT * FROM overtime_records WHERE id = $1',
            [id]
        );

        if (otRes.rows.length === 0) {
            client.release();
            return res.status(404).json({
                success: false,
                message: 'Overtime record not found'
            });
        }

        const otRecord = otRes.rows[0];

        if (role === 'manager') {
            const emp = await getEmployeeById(otRecord.employee_id);
            if (!emp || emp.reportingManagerId != loggedInEmployee.id) {
                client.release();
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You can only review overtime for direct reports'
                });
            }
        }

        await client.query('BEGIN');

        await client.query(
            `UPDATE overtime_records SET
                status = $1,
                approved_by = $2,
                approved_at = CURRENT_TIMESTAMP,
                remarks = $3
             WHERE id = $4`,
            [status, loggedInEmployee.id, remarks || '', id]
        );

        if (status === 'Approved') {
            await client.query(
                `UPDATE attendance_records SET
                    overtime_hours = $1,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2`,
                [otRecord.overtime_hours, otRecord.attendance_id]
            );
        } else {
            await client.query(
                `UPDATE attendance_records SET
                    overtime_hours = 0,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2`,
                [otRecord.attendance_id]
            );
        }

        await client.query('COMMIT');
        client.release();

        res.status(200).json({
            success: true,
            message: `Overtime request ${status.toLowerCase()} successfully`
        });

    } catch (error) {
        await client.query('ROLLBACK');
        client.release();
        console.error('Review overtime error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    submitOvertime,
    getOvertime,
    reviewOvertime
};
