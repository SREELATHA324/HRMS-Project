const pool = require('../../../db');
const { getEmployeeByUserId, getEmployeeById } = require('../services/attendanceService');

async function getHistory(req, res) {
    const { fromDate, toDate, status, employeeId } = req.query;

    try {
        const loggedInEmployee = await getEmployeeByUserId(req.user.id);
        if (!loggedInEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        let targetEmployeeId = loggedInEmployee.id;

        if (employeeId && employeeId != loggedInEmployee.id) {
            const role = req.user.role ? req.user.role.toLowerCase() : '';
            if (role === 'admin' || role === 'hr') {
                targetEmployeeId = employeeId;
            } else if (role === 'manager') {
                const targetEmp = await getEmployeeById(employeeId);
                if (!targetEmp || targetEmp.reportingManagerId != loggedInEmployee.id) {
                    return res.status(403).json({
                        success: false,
                        message: 'Forbidden: You can only view your own or direct reports history'
                    });
                }
                targetEmployeeId = employeeId;
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You can only view your own history'
                });
            }
        }

        let query = `
            SELECT 
                attendance_date, check_in, check_out, status, 
                working_hours, late_minutes, early_checkout_minutes, 
                overtime_hours, is_late, is_early_checkout, is_half_day, 
                shift_id, remarks
            FROM attendance_records
            WHERE employee_id = $1
        `;
        const params = [targetEmployeeId];
        let paramCount = 2;

        if (fromDate) {
            query += ` AND attendance_date >= $${paramCount}`;
            params.push(fromDate);
            paramCount++;
        }

        if (toDate) {
            query += ` AND attendance_date <= $${paramCount}`;
            params.push(toDate);
            paramCount++;
        }

        if (status) {
            query += ` AND status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        query += ` ORDER BY attendance_date DESC`;

        const result = await pool.query(query, params);

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = getHistory;
