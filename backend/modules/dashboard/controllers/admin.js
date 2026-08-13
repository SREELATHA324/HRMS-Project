const pool = require('../../../db');

async function adminDashboard(req, res) {
    try {
        const totalEmployees = await pool.query('SELECT COUNT(*) FROM employees');
        const activeEmployees = await pool.query(
            "SELECT COUNT(*) FROM employees WHERE status = 'Active'"
        );
        const inactiveEmployees = await pool.query(
            "SELECT COUNT(*) FROM employees WHERE status != 'Active'"
        );
        const departments = await pool.query('SELECT COUNT(*) FROM departments');
        const recentEmployees = await pool.query(
            `SELECT e.id, e."employeeCode", e."firstName", e."lastName", e.email, 
                    d.name as department_name, e.status, e."joiningDate"
             FROM employees e
             LEFT JOIN departments d ON e."departmentId" = d.id
             ORDER BY e.created_at DESC LIMIT 5`
        );

        const departmentStats = await pool.query(
            `SELECT d.name, COUNT(e.id) as count
             FROM departments d
             LEFT JOIN employees e ON d.id = e."departmentId"
             WHERE d.is_active = true
             GROUP BY d.id, d.name
             ORDER BY count DESC`
        );

        res.status(200).json({
            success: true,
            data: {
                totalEmployees: parseInt(totalEmployees.rows[0].count),
                activeEmployees: parseInt(activeEmployees.rows[0].count),
                inactiveEmployees: parseInt(inactiveEmployees.rows[0].count),
                departments: parseInt(departments.rows[0].count),
                recentEmployees: recentEmployees.rows,
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