const pool = require('../../../db');
const { getEmployeeByUserId, getEmployeeById } = require('../services/attendanceService');

function getLocalDateString() {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
}

async function getDailyAttendance(req, res) {
    const { date, employeeId } = req.query;
    const targetDate = date || getLocalDateString();

    try {
        const loggedInEmployee = await getEmployeeByUserId(req.user.id);
        if (!loggedInEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const role = req.user.role ? req.user.role.toLowerCase() : '';

        if (role === 'admin' || role === 'hr') {
            if (employeeId) {
                const result = await pool.query(
                    'SELECT * FROM attendance_records WHERE employee_id = $1 AND attendance_date = $2',
                    [employeeId, targetDate]
                );
                return res.status(200).json({
                    success: true,
                    data: result.rows[0] || null
                });
            } else {
                const result = await pool.query(
                    `SELECT e.id as employee_id, e."employeeCode", e."firstName", e."lastName", e.email as email, d.name as department_name,
                            ar.id as attendance_id, ar.check_in, ar.check_out, ar.status, 
                            ar.working_hours, ar.late_minutes, ar.early_checkout_minutes,
                            ar.overtime_hours, ar.is_late, ar.is_early_checkout, ar.is_half_day,
                            ac_in.location as check_in_location, ac_in.ip_address as check_in_ip, ac_in.device_info as check_in_device,
                            ac_out.location as check_out_location, ac_out.ip_address as check_out_ip, ac_out.device_info as check_out_device
                     FROM employees e
                     LEFT JOIN departments d ON e."departmentId" = d.id
                     LEFT JOIN attendance_records ar ON e.id = ar.employee_id AND ar.attendance_date = $1
                     LEFT JOIN attendance_checkins ac_in ON ac_in.attendance_id = ar.id AND ac_in.event_type = 'check_in'
                     LEFT JOIN attendance_checkins ac_out ON ac_out.attendance_id = ar.id AND ac_out.event_type = 'check_out'
                     WHERE e.deleted_at IS NULL`,
                    [targetDate]
                );
                return res.status(200).json({
                    success: true,
                    data: result.rows
                });
            }
        }

        if (role === 'manager') {
            if (employeeId) {
                if (employeeId == loggedInEmployee.id) {
                    const result = await pool.query(
                        'SELECT * FROM attendance_records WHERE employee_id = $1 AND attendance_date = $2',
                        [loggedInEmployee.id, targetDate]
                    );
                    return res.status(200).json({
                        success: true,
                        data: result.rows[0] || null
                    });
                }
                const targetEmp = await getEmployeeById(employeeId);
                if (!targetEmp || targetEmp.reportingManagerId != loggedInEmployee.id) {
                    return res.status(403).json({
                        success: false,
                        message: 'Forbidden: You can only access your own or direct reports daily attendance'
                    });
                }
                const result = await pool.query(
                    'SELECT * FROM attendance_records WHERE employee_id = $1 AND attendance_date = $2',
                    [employeeId, targetDate]
                );
                return res.status(200).json({
                    success: true,
                    data: result.rows[0] || null
                });
            } else {
                const result = await pool.query(
                    `SELECT e.id as employee_id, e."employeeCode", e."firstName", e."lastName", e.email as email, d.name as department_name,
                            ar.id as attendance_id, ar.check_in, ar.check_out, ar.status, 
                            ar.working_hours, ar.late_minutes, ar.early_checkout_minutes,
                            ar.overtime_hours, ar.is_late, ar.is_early_checkout, ar.is_half_day,
                            ac_in.location as check_in_location, ac_in.ip_address as check_in_ip, ac_in.device_info as check_in_device,
                            ac_out.location as check_out_location, ac_out.ip_address as check_out_ip, ac_out.device_info as check_out_device
                     FROM employees e
                     LEFT JOIN departments d ON e."departmentId" = d.id
                     LEFT JOIN attendance_records ar ON e.id = ar.employee_id AND ar.attendance_date = $1
                     LEFT JOIN attendance_checkins ac_in ON ac_in.attendance_id = ar.id AND ac_in.event_type = 'check_in'
                     LEFT JOIN attendance_checkins ac_out ON ac_out.attendance_id = ar.id AND ac_out.event_type = 'check_out'
                     WHERE e.deleted_at IS NULL AND (e."reportingManagerId" = $2 OR e.id = $2)`,
                    [targetDate, loggedInEmployee.id]
                );
                return res.status(200).json({
                    success: true,
                    data: result.rows
                });
            }
        }

        const result = await pool.query(
            'SELECT * FROM attendance_records WHERE employee_id = $1 AND attendance_date = $2',
            [loggedInEmployee.id, targetDate]
        );
        res.status(200).json({
            success: true,
            data: result.rows[0] || null
        });

    } catch (error) {
        console.error('Get daily attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = getDailyAttendance;
