const pool = require('../../../db');

async function adminDashboard(req, res) {
    try {
        const totalEmployees = await pool.query('SELECT COUNT(*) FROM employees WHERE deleted_at IS NULL');
        const activeEmployees = await pool.query(
            "SELECT COUNT(*) FROM employees WHERE status = 'Active' AND deleted_at IS NULL"
        );
        const inactiveEmployees = await pool.query(
            "SELECT COUNT(*) FROM employees WHERE status != 'Active' AND deleted_at IS NULL"
        );
        const departments = await pool.query('SELECT COUNT(*) FROM departments WHERE is_active = true');

        const recentEmployees = await pool.query(
            `SELECT e.id, e."employeeCode", e."firstName", e."lastName", e.email, 
                    d.name as department_name, e.status, e."joiningDate"
             FROM employees e
             LEFT JOIN departments d ON e."departmentId" = d.id
             WHERE e.deleted_at IS NULL
             ORDER BY e.created_at DESC LIMIT 5`
        );

        const newEmployeeActivities = await pool.query(
            `SELECT 
                'new_employee' as type,
                e."firstName" || ' ' || e."lastName" as employee_name,
                e.created_at as activity_date,
                'New employee added: ' || e."firstName" || ' ' || e."lastName" as description
             FROM employees e
             WHERE e.deleted_at IS NULL
             ORDER BY e.created_at DESC LIMIT 10`
        );

        const statusChangeActivities = await pool.query(
            `SELECT 
                'status_change' as type,
                e."firstName" || ' ' || e."lastName" as employee_name,
                esh."effectiveDate" as activity_date,
                'Status changed from ' || esh."oldStatus" || ' to ' || esh."newStatus" as description
             FROM employee_status_history esh
             JOIN employees e ON esh."employeeId" = e.id
             WHERE e.deleted_at IS NULL
             ORDER BY esh.created_at DESC LIMIT 10`
        );

        const employeeHistoryActivities = await pool.query(
            `SELECT 
                'employee_update' as type,
                e."firstName" || ' ' || e."lastName" as employee_name,
                eh."effectiveDate" as activity_date,
                'Employee details updated' as description
             FROM employee_history eh
             JOIN employees e ON eh."employeeId" = e.id
             WHERE e.deleted_at IS NULL AND eh."changeType" = 'Updated'
             ORDER BY eh.created_at DESC LIMIT 10`
        );

        const allActivities = [
            ...newEmployeeActivities.rows,
            ...statusChangeActivities.rows,
            ...employeeHistoryActivities.rows
        ];

        allActivities.sort((a, b) => new Date(b.activity_date) - new Date(a.activity_date));

        const recentActivities = allActivities.slice(0, 10);

        const departmentStats = await pool.query(
            `SELECT d.name, COUNT(e.id) as count
             FROM departments d
             LEFT JOIN employees e ON d.id = e."departmentId" AND e.deleted_at IS NULL
             WHERE d.is_active = true
             GROUP BY d.id, d.name
             ORDER BY count DESC`
        );

        res.status(200).json({
            success: true,
            data: {
                totalEmployees: parseInt(totalEmployees.rows[0].count) || 0,
                activeEmployees: parseInt(activeEmployees.rows[0].count) || 0,
                inactiveEmployees: parseInt(inactiveEmployees.rows[0].count) || 0,
                departments: parseInt(departments.rows[0].count) || 0,
                recentEmployees: recentEmployees.rows,
                recentActivities: recentActivities,
                departmentStats: departmentStats.rows
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = adminDashboard;