const pool = require('../../../db');

async function managerDashboard(req, res) {
    try {
        const userId = req.user.id;

        const managerResult = await pool.query(
            `SELECT e.id, e."firstName", e."lastName", e."employeeCode", e.email
             FROM employees e
             WHERE e."userId" = $1 AND e.deleted_at IS NULL`,
            [userId]
        );

        if (managerResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const manager = managerResult.rows[0];

        const teamResult = await pool.query(
            `SELECT e.id, e."firstName", e."lastName", e."employeeCode", e.email,
                    e.status, e."joiningDate",
                    d.name as department_name, des.name as designation_name
             FROM employees e
             LEFT JOIN departments d ON e."departmentId" = d.id
             LEFT JOIN designations des ON e."designationId" = des.id
             WHERE e."reportingManagerId" = $1 AND e.deleted_at IS NULL`,
            [manager.id]
        );

        const team = teamResult.rows;

        const todayStr = new Date().toISOString().split('T')[0];

        let presentCount = 0;
        let absentCount = 0;
        let lateCount = 0;

        if (team.length > 0) {
            const empIds = team.map(e => e.id);
            const placeholders = empIds.map((_, i) => `$${i + 1}`).join(',');
            
            const attResult = await pool.query(
                `SELECT ar.*, e."firstName", e."lastName"
                 FROM attendance_records ar
                 JOIN employees e ON ar.employee_id = e.id
                 WHERE ar.employee_id IN (${placeholders}) AND ar.attendance_date = $${empIds.length + 1}`,
                [...empIds, todayStr]
            );

            const attMap = {};
            attResult.rows.forEach(a => {
                attMap[a.employee_id] = a;
            });

            team.forEach(emp => {
                const att = attMap[emp.id];
                if (att) {
                    if (att.status === 'Present') presentCount++;
                    else if (att.status === 'Absent') absentCount++;
                    else if (att.status === 'Half-Day') { presentCount += 0.5; absentCount += 0.5; }
                    if (att.is_late) lateCount++;
                } else {
                    absentCount++;
                }
            });
        }

        const pendingResult = await pool.query(
            `SELECT 
                (SELECT COUNT(*) FROM attendance_corrections ac 
                 JOIN employees e ON ac.employee_id = e.id 
                 WHERE e."reportingManagerId" = $1 AND ac.status = 'Pending') as pending_corrections,
                (SELECT COUNT(*) FROM overtime_records ot 
                 JOIN employees e ON ot.employee_id = e.id 
                 WHERE e."reportingManagerId" = $1 AND ot.status = 'Pending') as pending_overtime`,
            [manager.id]
        );

        const pending = pendingResult.rows[0] || {};

        const monthStart = new Date();
        monthStart.setDate(1);
        const monthStartStr = monthStart.toISOString().split('T')[0];

        let teamMonthlyStats = { present: 0, absent: 0, half: 0, late: 0 };
        if (team.length > 0) {
            const empIds = team.map(e => e.id);
            const placeholders = empIds.map((_, i) => `$${i + 1}`).join(',');
            
            const monthlyResult = await pool.query(
                `SELECT 
                    COUNT(CASE WHEN status = 'Present' THEN 1 END) as present,
                    COUNT(CASE WHEN status = 'Absent' THEN 1 END) as absent,
                    COUNT(CASE WHEN status = 'Half-Day' THEN 1 END) as half,
                    COUNT(CASE WHEN is_late = true THEN 1 END) as late
                 FROM attendance_records
                 WHERE employee_id IN (${placeholders}) AND attendance_date >= $${empIds.length + 1}`,
                [...empIds, monthStartStr]
            );

            teamMonthlyStats = monthlyResult.rows[0] || { present: 0, absent: 0, half: 0, late: 0 };
        }

        const newJoinersResult = await pool.query(
            `SELECT COUNT(*) as new_joiners
             FROM employees
             WHERE "reportingManagerId" = $1 
               AND "joiningDate" >= $2 
               AND deleted_at IS NULL`,
            [manager.id, monthStartStr]
        );

        const newJoiners = parseInt(newJoinersResult.rows[0]?.new_joiners) || 0;

        res.status(200).json({
            success: true,
            data: {
                manager: {
                    id: manager.id,
                    name: `${manager.firstName} ${manager.lastName}`.trim(),
                    employeeCode: manager.employeeCode
                },
                team: team.map(emp => ({
                    id: emp.id,
                    name: `${emp.firstName} ${emp.lastName}`.trim(),
                    employeeCode: emp.employeeCode,
                    email: emp.email,
                    department: emp.department_name,
                    designation: emp.designation_name,
                    status: emp.status,
                    joiningDate: emp.joiningDate
                })),
                teamStats: {
                    totalMembers: team.length,
                    activeMembers: team.filter(e => e.status === 'Active').length,
                    presentToday: presentCount,
                    absentToday: absentCount,
                    lateToday: lateCount,
                    newJoiners: newJoiners
                },
                monthlyStats: {
                    present: parseInt(teamMonthlyStats.present) || 0,
                    absent: parseInt(teamMonthlyStats.absent) || 0,
                    half: parseInt(teamMonthlyStats.half) || 0,
                    late: parseInt(teamMonthlyStats.late) || 0
                },
                pendingApprovals: {
                    corrections: parseInt(pending.pending_corrections) || 0,
                    overtime: parseInt(pending.pending_overtime) || 0,
                    total: (parseInt(pending.pending_corrections) || 0) + (parseInt(pending.pending_overtime) || 0)
                }
            }
        });

    } catch (error) {
        console.error('Manager dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = managerDashboard;