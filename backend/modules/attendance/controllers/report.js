const pool = require('../../../db');
const { getEmployeeByUserId, getEmployeeById } = require('../services/attendanceService');

function getLocalDateString() {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
}

async function getDailyReport(req, res) {
    const { date } = req.query;
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
        if (role !== 'admin' && role !== 'hr' && role !== 'manager') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Insufficient permissions to view daily report'
            });
        }

        let empQuery = 'SELECT COUNT(*) FROM employees WHERE deleted_at IS NULL';
        let empParams = [];
        if (role === 'manager') {
            empQuery += ' AND ("reportingManagerId" = $1 OR id = $1)';
            empParams.push(loggedInEmployee.id);
        }

        const empCountRes = await pool.query(empQuery, empParams);
        const totalEmployees = parseInt(empCountRes.rows[0].count) || 0;

        let attQuery = `
            SELECT ar.* FROM attendance_records ar
            JOIN employees e ON ar.employee_id = e.id
            WHERE ar.attendance_date = $1 AND e.deleted_at IS NULL
        `;
        const attParams = [targetDate];
        if (role === 'manager') {
            attQuery += ' AND (e."reportingManagerId" = $2 OR e.id = $2)';
            attParams.push(loggedInEmployee.id);
        }

        const attRes = await pool.query(attQuery, attParams);
        const records = attRes.rows;

        let presentCount = 0;
        let halfDayCount = 0;
        let absentCount = 0;
        let lateArrivals = 0;
        let earlyCheckouts = 0;
        let totalWorkingHours = 0;
        let totalOvertime = 0;

        records.forEach(r => {
            if (r.status === 'Present') presentCount++;
            else if (r.status === 'Half-Day') halfDayCount++;
            else if (r.status === 'Absent') absentCount++;

            if (r.is_late) lateArrivals++;
            if (r.is_early_checkout) earlyCheckouts++;

            totalWorkingHours += parseFloat(r.working_hours) || 0;
            totalOvertime += parseFloat(r.overtime_hours) || 0;
        });

        const unaccounted = Math.max(0, totalEmployees - records.length);
        absentCount += unaccounted;

        let attendancePercentage = 0;
        if (totalEmployees > 0) {
            attendancePercentage = parseFloat((((presentCount + (halfDayCount * 0.5)) / totalEmployees) * 100).toFixed(2));
        }

        res.status(200).json({
            success: true,
            data: {
                date: targetDate,
                totalEmployees,
                presentCount,
                absentCount,
                halfDayCount,
                lateArrivals,
                earlyCheckouts,
                totalWorkingHours: parseFloat(totalWorkingHours.toFixed(2)),
                totalOvertime: parseFloat(totalOvertime.toFixed(2)),
                attendancePercentage
            }
        });

    } catch (error) {
        console.error('Get daily report error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function getMonthlyReport(req, res) {
    const { month, year } = req.query;
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

        const role = req.user.role ? req.user.role.toLowerCase() : '';
        if (role !== 'admin' && role !== 'hr' && role !== 'manager') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Insufficient permissions to view monthly report'
            });
        }

        let empQuery = 'SELECT COUNT(*) FROM employees WHERE deleted_at IS NULL';
        let empParams = [];
        if (role === 'manager') {
            empQuery += ' AND ("reportingManagerId" = $1 OR id = $1)';
            empParams.push(loggedInEmployee.id);
        }

        const empCountRes = await pool.query(empQuery, empParams);
        const totalEmployees = parseInt(empCountRes.rows[0].count) || 0;

        const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
        const lastDay = new Date(targetYear, targetMonth, 0).getDate();
        const endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        let attQuery = `
            SELECT ar.* FROM attendance_records ar
            JOIN employees e ON ar.employee_id = e.id
            WHERE ar.attendance_date >= $1 AND ar.attendance_date <= $2 AND e.deleted_at IS NULL
        `;
        const attParams = [startDate, endDate];
        if (role === 'manager') {
            attQuery += ' AND (e."reportingManagerId" = $3 OR e.id = $3)';
            attParams.push(loggedInEmployee.id);
        }

        const attRes = await pool.query(attQuery, attParams);
        const records = attRes.rows;

        let presentCount = 0;
        let halfDayCount = 0;
        let absentCount = 0;
        let lateArrivals = 0;
        let earlyCheckouts = 0;
        let totalWorkingHours = 0;
        let totalOvertime = 0;

        records.forEach(r => {
            if (r.status === 'Present') presentCount++;
            else if (r.status === 'Half-Day') halfDayCount++;
            else if (r.status === 'Absent') absentCount++;

            if (r.is_late) lateArrivals++;
            if (r.is_early_checkout) earlyCheckouts++;

            totalWorkingHours += parseFloat(r.working_hours) || 0;
            totalOvertime += parseFloat(r.overtime_hours) || 0;
        });

        const totalActiveRecordDays = presentCount + halfDayCount + absentCount;
        let attendancePercentage = 0;
        if (totalActiveRecordDays > 0) {
            attendancePercentage = parseFloat((((presentCount + (halfDayCount * 0.5)) / totalActiveRecordDays) * 100).toFixed(2));
        }

        res.status(200).json({
            success: true,
            data: {
                month: targetMonth,
                year: targetYear,
                totalEmployees,
                presentCount,
                absentCount,
                halfDayCount,
                lateArrivals,
                earlyCheckouts,
                totalWorkingHours: parseFloat(totalWorkingHours.toFixed(2)),
                totalOvertime: parseFloat(totalOvertime.toFixed(2)),
                attendancePercentage
            }
        });

    } catch (error) {
        console.error('Get monthly report error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function getEmployeeReport(req, res) {
    const { employeeId } = req.params;
    const { month, year } = req.query;
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

        const role = req.user.role ? req.user.role.toLowerCase() : '';
        if (employeeId != loggedInEmployee.id && role !== 'admin' && role !== 'hr') {
            if (role === 'manager') {
                const targetEmp = await getEmployeeById(employeeId);
                if (!targetEmp || targetEmp.reportingManagerId != loggedInEmployee.id) {
                    return res.status(403).json({
                        success: false,
                        message: 'Forbidden: Cannot access report for this employee'
                    });
                }
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: Cannot access report for this employee'
                });
            }
        }

        const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
        const lastDay = new Date(targetYear, targetMonth, 0).getDate();
        const endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        const result = await pool.query(
            `SELECT * FROM attendance_records 
             WHERE employee_id = $1 AND attendance_date >= $2 AND attendance_date <= $3`,
            [employeeId, startDate, endDate]
        );

        const records = result.rows;

        let presentCount = 0;
        let halfDayCount = 0;
        let absentCount = 0;
        let lateArrivals = 0;
        let earlyCheckouts = 0;
        let totalWorkingHours = 0;
        let totalOvertime = 0;

        records.forEach(r => {
            if (r.status === 'Present') presentCount++;
            else if (r.status === 'Half-Day') halfDayCount++;
            else if (r.status === 'Absent') absentCount++;

            if (r.is_late) lateArrivals++;
            if (r.is_early_checkout) earlyCheckouts++;

            totalWorkingHours += parseFloat(r.working_hours) || 0;
            totalOvertime += parseFloat(r.overtime_hours) || 0;
        });

        const totalActiveDays = presentCount + halfDayCount + absentCount;
        let attendancePercentage = 0;
        if (totalActiveDays > 0) {
            attendancePercentage = parseFloat((((presentCount + (halfDayCount * 0.5)) / totalActiveDays) * 100).toFixed(2));
        }

        res.status(200).json({
            success: true,
            data: {
                employeeId: parseInt(employeeId),
                month: targetMonth,
                year: targetYear,
                totalActiveDays,
                presentCount,
                absentCount,
                halfDayCount,
                lateArrivals,
                earlyCheckouts,
                totalWorkingHours: parseFloat(totalWorkingHours.toFixed(2)),
                totalOvertime: parseFloat(totalOvertime.toFixed(2)),
                attendancePercentage
            }
        });

    } catch (error) {
        console.error('Get employee report error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    getDailyReport,
    getMonthlyReport,
    getEmployeeReport
};
