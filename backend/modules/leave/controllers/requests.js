const pool = require('../../../db');
const { getEmployeeByUserId, getEmployeeById } = require('../services/leaveService');

async function applyLeave(req, res) {
    const { leave_type_id, start_date, end_date, total_days, reason, attachments } = req.body;

    try {
        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        
        const overlapCheck = await pool.query(
            `SELECT id FROM leave_requests 
             WHERE employee_id = $1 
               AND status IN ('Pending', 'Approved')
               AND (($2 BETWEEN start_date AND end_date) OR ($3 BETWEEN start_date AND end_date) OR (start_date BETWEEN $2 AND $3))
               AND deleted_at IS NULL`,
            [employee.id, start_date, end_date]
        );

        if (overlapCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You already have a leave request for these dates'
            });
        }

        
        const balanceCheck = await pool.query(
            `SELECT closing_balance FROM leave_balances 
             WHERE employee_id = $1 AND leave_type_id = $2 AND year = $3`,
            [employee.id, leave_type_id, new Date().getFullYear()]
        );

        if (balanceCheck.rows.length > 0 && parseFloat(balanceCheck.rows[0].closing_balance) < total_days) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient leave balance'
            });
        }

        const result = await pool.query(
            `INSERT INTO leave_requests (
                employee_id, leave_type_id, start_date, end_date, total_days, 
                reason, status, applied_date, attachments
            ) VALUES ($1, $2, $3, $4, $5, $6, 'Pending', CURRENT_TIMESTAMP, $7)
             RETURNING *`,
            [employee.id, leave_type_id, start_date, end_date, total_days, reason, attachments || []]
        );

        
        await pool.query(
            `INSERT INTO leave_history (leave_request_id, employee_id, action, new_status, remarks)
             VALUES ($1, $2, 'Applied', 'Pending', 'Leave applied')`,
            [result.rows[0].id, employee.id]
        );

        res.status(201).json({
            success: true,
            message: 'Leave applied successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Apply leave error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function getLeaveRequests(req, res) {
    const { status, fromDate, toDate, employeeId } = req.query;

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
            SELECT lr.*, 
                   lt.name as leave_type_name,
                   lt.color as leave_type_color,
                   e."firstName" as employee_first_name,
                   e."lastName" as employee_last_name,
                   e."employeeCode" as employee_code,
                   CONCAT(a."firstName", ' ', a."lastName") as approver_name
            FROM leave_requests lr
            JOIN leave_types lt ON lr.leave_type_id = lt.id
            JOIN employees e ON lr.employee_id = e.id
            LEFT JOIN employees a ON lr.approved_by = a.id
            WHERE lr.deleted_at IS NULL
        `;
        const params = [];
        let paramCount = 1;

        if (role === 'admin' || role === 'hr') {
            if (employeeId) {
                query += ` AND lr.employee_id = $${paramCount}`;
                params.push(employeeId);
                paramCount++;
            }
        } else if (role === 'manager') {
            query += ` AND (e."reportingManagerId" = $${paramCount} OR lr.employee_id = $${paramCount})`;
            params.push(loggedInEmployee.id);
            paramCount++;
        } else {
            query += ` AND lr.employee_id = $${paramCount}`;
            params.push(loggedInEmployee.id);
            paramCount++;
        }

        if (status && status !== 'All') {
            query += ` AND lr.status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        if (fromDate) {
            query += ` AND lr.start_date >= $${paramCount}`;
            params.push(fromDate);
            paramCount++;
        }

        if (toDate) {
            query += ` AND lr.end_date <= $${paramCount}`;
            params.push(toDate);
            paramCount++;
        }

        query += ` ORDER BY lr.applied_date DESC`;

        const result = await pool.query(query, params);

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get leave requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function getLeaveRequestById(req, res) {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT lr.*, 
                    lt.name as leave_type_name,
                    lt.color as leave_type_color,
                    e."firstName" as employee_first_name,
                    e."lastName" as employee_last_name,
                    e."employeeCode" as employee_code,
                    CONCAT(a."firstName", ' ', a."lastName") as approver_name
             FROM leave_requests lr
             JOIN leave_types lt ON lr.leave_type_id = lt.id
             JOIN employees e ON lr.employee_id = e.id
             LEFT JOIN employees a ON lr.approved_by = a.id
             WHERE lr.id = $1 AND lr.deleted_at IS NULL`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Get leave request error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function approveLeave(req, res) {
    const { id } = req.params;
    const { remarks } = req.body;

    try {
        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const role = req.user.role ? req.user.role.toLowerCase() : '';
        if (role !== 'admin' && role !== 'hr' && role !== 'manager') {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions to approve leave'
            });
        }

        const leaveRes = await pool.query(
            'SELECT * FROM leave_requests WHERE id = $1 AND status = $2 AND deleted_at IS NULL',
            [id, 'Pending']
        );

        if (leaveRes.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found or already processed'
            });
        }

        const leave = leaveRes.rows[0];

        await pool.query('BEGIN');

        await pool.query(
            `UPDATE leave_requests SET 
                status = 'Approved', 
                approved_by = $1, 
                approved_date = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [employee.id, id]
        );

        await pool.query(
            `INSERT INTO leave_history (leave_request_id, employee_id, action, old_status, new_status, remarks, performed_by)
             VALUES ($1, $2, 'Approved', 'Pending', 'Approved', $3, $4)`,
            [id, leave.employee_id, remarks || '', employee.id]
        );

        await pool.query(
            `UPDATE leave_balances SET 
                used_balance = used_balance + $1,
                closing_balance = closing_balance - $1,
                updated_at = CURRENT_TIMESTAMP
             WHERE employee_id = $2 AND leave_type_id = $3 AND year = $4`,
            [leave.total_days, leave.employee_id, leave.leave_type_id, new Date().getFullYear()]
        );

        await pool.query('COMMIT');

        res.status(200).json({
            success: true,
            message: 'Leave approved successfully'
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Approve leave error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function rejectLeave(req, res) {
    const { id } = req.params;
    const { remarks } = req.body;

    try {
        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const role = req.user.role ? req.user.role.toLowerCase() : '';
        if (role !== 'admin' && role !== 'hr' && role !== 'manager') {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions to reject leave'
            });
        }

        const leaveRes = await pool.query(
            'SELECT * FROM leave_requests WHERE id = $1 AND status = $2 AND deleted_at IS NULL',
            [id, 'Pending']
        );

        if (leaveRes.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found or already processed'
            });
        }

        const leave = leaveRes.rows[0];

        await pool.query(
            `UPDATE leave_requests SET 
                status = 'Rejected', 
                rejected_by = $1, 
                rejected_date = CURRENT_TIMESTAMP,
                rejection_reason = $2,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $3`,
            [employee.id, remarks || '', id]
        );

        await pool.query(
            `INSERT INTO leave_history (leave_request_id, employee_id, action, old_status, new_status, remarks, performed_by)
             VALUES ($1, $2, 'Rejected', 'Pending', 'Rejected', $3, $4)`,
            [id, leave.employee_id, remarks || '', employee.id]
        );

        res.status(200).json({
            success: true,
            message: 'Leave rejected successfully'
        });

    } catch (error) {
        console.error('Reject leave error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function cancelLeave(req, res) {
    const { id } = req.params;
    const { remarks } = req.body;

    try {
        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const leaveRes = await pool.query(
            'SELECT * FROM leave_requests WHERE id = $1 AND status IN ($2, $3) AND deleted_at IS NULL',
            [id, 'Pending', 'Approved']
        );

        if (leaveRes.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Leave request not found or cannot be cancelled'
            });
        }

        const leave = leaveRes.rows[0];

        if (leave.employee_id !== employee.id) {
            const role = req.user.role ? req.user.role.toLowerCase() : '';
            if (role !== 'admin' && role !== 'hr') {
                return res.status(403).json({
                    success: false,
                    message: 'You can only cancel your own leave requests'
                });
            }
        }

        await pool.query(
            `UPDATE leave_requests SET 
                status = 'Cancelled', 
                cancelled_by = $1, 
                cancelled_date = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [employee.id, id]
        );

        await pool.query(
            `INSERT INTO leave_history (leave_request_id, employee_id, action, old_status, new_status, remarks, performed_by)
             VALUES ($1, $2, 'Cancelled', $3, 'Cancelled', $4, $5)`,
            [id, leave.employee_id, leave.status, remarks || '', employee.id]
        );

        if (leave.status === 'Approved') {
            await pool.query(
                `UPDATE leave_balances SET 
                    used_balance = used_balance - $1,
                    closing_balance = closing_balance + $1,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE employee_id = $2 AND leave_type_id = $3 AND year = $4`,
                [leave.total_days, leave.employee_id, leave.leave_type_id, new Date().getFullYear()]
            );
        }

        res.status(200).json({
            success: true,
            message: 'Leave cancelled successfully'
        });

    } catch (error) {
        console.error('Cancel leave error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    applyLeave,
    getLeaveRequests,
    getLeaveRequestById,
    approveLeave,
    rejectLeave,
    cancelLeave
};