const pool = require('../../../db');
const { getEmployeeByUserId, getEmployeeById } = require('../services/attendanceService');

async function getCalendar(req, res) {
    const { month, year, employeeId } = req.query;

    const now = new Date();
    const targetMonth = month ? parseInt(month) : now.getMonth() + 1;
    const targetYear = year ? parseInt(year) : now.getFullYear();

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
                        message: 'Forbidden: You can only view your own or direct reports calendar'
                    });
                }
                targetEmployeeId = employeeId;
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You can only view your own calendar'
                });
            }
        }

        const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
        const lastDay = new Date(targetYear, targetMonth, 0).getDate();
        const endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        const result = await pool.query(
            `SELECT 
                attendance_date, status, check_in, check_out, 
                working_hours, overtime_hours, is_late, 
                is_early_checkout, is_half_day
             FROM attendance_records
             WHERE employee_id = $1 AND attendance_date >= $2 AND attendance_date <= $3
             ORDER BY attendance_date ASC`,
            [targetEmployeeId, startDate, endDate]
        );

        const calendarData = {};
        result.rows.forEach(r => {
            const dateStr = new Date(r.attendance_date).toISOString().split('T')[0];
            calendarData[dateStr] = {
                attendance_date: dateStr,
                status: r.status,
                check_in: r.check_in,
                check_out: r.check_out,
                working_hours: parseFloat(r.working_hours) || 0,
                overtime_hours: parseFloat(r.overtime_hours) || 0,
                is_late: r.is_late,
                is_early_checkout: r.is_early_checkout,
                is_half_day: r.is_half_day
            };
        });

        res.status(200).json({
            success: true,
            data: calendarData
        });

    } catch (error) {
        console.error('Get calendar error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = getCalendar;
