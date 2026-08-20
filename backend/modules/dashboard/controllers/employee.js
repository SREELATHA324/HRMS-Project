const pool = require('../../../db');

async function employeeDashboard(req, res) {
    try {
        const userId = req.user.id;

        const employeeResult = await pool.query(
            `SELECT e.id, e."firstName", e."lastName", e."employeeCode", e.email, 
                    e."joiningDate", e.status, e.role, e."jobLocation",
                    d.name as department_name, des.name as designation_name
             FROM employees e
             LEFT JOIN departments d ON e."departmentId" = d.id
             LEFT JOIN designations des ON e."designationId" = des.id
             WHERE e."userId" = $1 AND e.deleted_at IS NULL`,
            [userId]
        );

        if (employeeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const employee = employeeResult.rows[0];

        const todayStr = new Date().toISOString().split('T')[0];
        const attendanceResult = await pool.query(
            `SELECT check_in, check_out, status, working_hours, is_late, is_half_day
             FROM attendance_records
             WHERE employee_id = $1 AND attendance_date = $2`,
            [employee.id, todayStr]
        );

        let todayAttendance = {
            check_in: null,
            check_out: null,
            status: 'Not Checked In',
            working_hours: 0,
            is_late: false,
            is_half_day: false
        };

        if (attendanceResult.rows.length > 0) {
            const record = attendanceResult.rows[0];
            todayAttendance = {
                check_in: record.check_in || null,
                check_out: record.check_out || null,
                status: record.status || 'Not Checked In',
                working_hours: parseFloat(record.working_hours) || 0,
                is_late: record.is_late || false,
                is_half_day: record.is_half_day || false
            };
        }

        const monthStart = new Date();
        monthStart.setDate(1);
        const monthStartStr = monthStart.toISOString().split('T')[0];
        const today = new Date();
        const todayStrEnd = today.toISOString().split('T')[0];

        const monthlyResult = await pool.query(
            `SELECT 
                COUNT(*) as total_days,
                COUNT(CASE WHEN status = 'Present' THEN 1 END) as present_days,
                COUNT(CASE WHEN status = 'Absent' THEN 1 END) as absent_days,
                COUNT(CASE WHEN status = 'Half-Day' THEN 1 END) as half_days,
                SUM(working_hours) as total_working_hours,
                SUM(overtime_hours) as total_overtime,
                COUNT(CASE WHEN is_late = true THEN 1 END) as late_days
             FROM attendance_records
             WHERE employee_id = $1 
               AND attendance_date >= $2 
               AND attendance_date <= $3`,
            [employee.id, monthStartStr, todayStrEnd]
        );

        const monthStats = monthlyResult.rows[0] || {};

        const correctionsResult = await pool.query(
            `SELECT COUNT(*) as pending_corrections
             FROM attendance_corrections
             WHERE employee_id = $1 AND status = 'Pending'`,
            [employee.id]
        );

        const pendingCorrections = parseInt(correctionsResult.rows[0]?.pending_corrections) || 0;

        // ✅ FIX: Wrap leave queries in try-catch
        let leaveBalance = {
            totalAvailable: 0,
            totalUsed: 0,
            pendingLeaves: 0,
            leaveTypes: {}
        };

        try {
            const currentYear = new Date().getFullYear();
            const leaveBalanceResult = await pool.query(
                `SELECT 
                    lt.id,
                    lt.name as leave_type_name,
                    lt.code as leave_type_code,
                    COALESCE(lb.closing_balance, 0) as closing_balance,
                    COALESCE(lb.used_balance, 0) as used_balance
                 FROM leave_types lt
                 LEFT JOIN leave_balances lb ON lt.id = lb.leave_type_id 
                    AND lb.employee_id = $1 AND lb.year = $2
                 WHERE lt.is_active = true
                 ORDER BY lt.name`,
                [employee.id, currentYear]
            );

            let totalAvailable = 0;
            let totalUsed = 0;
            const leaveTypes = {};
            
            leaveBalanceResult.rows.forEach(row => {
                const closing = parseFloat(row.closing_balance) || 0;
                const used = parseFloat(row.used_balance) || 0;
                totalAvailable += closing;
                totalUsed += used;
                
                const key = row.code.toLowerCase();
                leaveTypes[key] = {
                    total: closing,
                    used: used,
                    available: closing
                };
            });

            leaveBalance = {
                totalAvailable: totalAvailable,
                totalUsed: totalUsed,
                pendingLeaves: 0,
                leaveTypes: leaveTypes
            };

            const pendingLeavesResult = await pool.query(
                `SELECT COUNT(*) as pending_leaves
                 FROM leave_requests
                 WHERE employee_id = $1 AND status = 'Pending' AND deleted_at IS NULL`,
                [employee.id]
            );
            const pendingLeaves = parseInt(pendingLeavesResult.rows[0]?.pending_leaves) || 0;
            leaveBalance.pendingLeaves = pendingLeaves;

        } catch (leaveErr) {
            console.log('Leave module not fully set up yet');
        }

        let lengthOfService = '';
        if (employee.joiningDate) {
            const joinDate = new Date(employee.joiningDate);
            const now = new Date();
            const diffMs = now - joinDate;
            const diffDate = new Date(diffMs);
            const years = diffDate.getFullYear() - 1970;
            const months = diffDate.getMonth();
            
            if (years === 0 && months === 0) {
                lengthOfService = '< 1 month';
            } else if (years === 0) {
                lengthOfService = `${months} month${months > 1 ? 's' : ''}`;
            } else if (months === 0) {
                lengthOfService = `${years} year${years > 1 ? 's' : ''}`;
            } else {
                lengthOfService = `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
            }
        }

        const attendancePercentage = monthStats.total_days ? 
            parseFloat(((parseInt(monthStats.present_days || 0) + (parseInt(monthStats.half_days || 0) * 0.5)) / parseInt(monthStats.total_days || 1)) * 100).toFixed(2) : 0;

        res.status(200).json({
            success: true,
            data: {
                employee: {
                    id: employee.id,
                    employeeCode: employee.employeeCode,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    department: employee.department_name,
                    designation: employee.designation_name,
                    joiningDate: employee.joiningDate,
                    status: employee.status,
                    role: employee.role,
                    jobLocation: employee.jobLocation,
                    lengthOfService: lengthOfService
                },
                todayAttendance: todayAttendance,
                monthlyStats: {
                    totalDays: parseInt(monthStats.total_days) || 0,
                    presentDays: parseInt(monthStats.present_days) || 0,
                    absentDays: parseInt(monthStats.absent_days) || 0,
                    halfDays: parseInt(monthStats.half_days) || 0,
                    totalWorkingHours: parseFloat(monthStats.total_working_hours) || 0,
                    totalOvertime: parseFloat(monthStats.total_overtime) || 0,
                    lateDays: parseInt(monthStats.late_days) || 0
                },
                leaveBalance: leaveBalance,
                pendingCorrections: pendingCorrections,
                attendancePercentage: parseFloat(attendancePercentage)
            }
        });

    } catch (error) {
        console.error('Employee dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = employeeDashboard;