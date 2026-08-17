const pool = require('../../../db');
const { getEmployeeByUserId, getEmployeeById } = require('../services/attendanceService');

async function getMonthlyAttendance(req, res) {
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
                        message: 'Forbidden: You can only view your own or direct reports monthly attendance'
                    });
                }
                targetEmployeeId = employeeId;
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You can only view your own monthly attendance'
                });
            }
        }

        const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
        const lastDay = new Date(targetYear, targetMonth, 0).getDate();
        const endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        const result = await pool.query(
            `SELECT * FROM attendance_records 
             WHERE employee_id = $1 AND attendance_date >= $2 AND attendance_date <= $3`,
            [targetEmployeeId, startDate, endDate]
        );

        const records = result.rows;

        let presentDays = 0;
        let absentDays = 0;
        let halfDays = 0;
        let totalWorkingHours = 0;
        let totalOvertimeHours = 0;
        let lateArrivals = 0;
        let earlyCheckouts = 0;

        records.forEach(r => {
            if (r.status === 'Present') presentDays++;
            else if (r.status === 'Absent') absentDays++;
            else if (r.status === 'Half-Day') halfDays++;

            totalWorkingHours += parseFloat(r.working_hours) || 0;
            totalOvertimeHours += parseFloat(r.overtime_hours) || 0;

            if (r.is_late) lateArrivals++;
            if (r.is_early_checkout) earlyCheckouts++;
        });

        const totalWorkingDays = presentDays + halfDays + absentDays;
        let attendancePercentage = 0;
        if (totalWorkingDays > 0) {
            attendancePercentage = parseFloat((((presentDays + (halfDays * 0.5)) / totalWorkingDays) * 100).toFixed(2));
        }

        res.status(200).json({
            success: true,
            data: {
                month: targetMonth,
                year: targetYear,
                totalWorkingDays,
                presentDays,
                absentDays,
                halfDays,
                leaveDays: 0,
                totalWorkingHours: parseFloat(totalWorkingHours.toFixed(2)),
                totalOvertimeHours: parseFloat(totalOvertimeHours.toFixed(2)),
                lateArrivals,
                earlyCheckouts,
                attendancePercentage
            }
        });

    } catch (error) {
        console.error('Get monthly attendance error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = getMonthlyAttendance;
