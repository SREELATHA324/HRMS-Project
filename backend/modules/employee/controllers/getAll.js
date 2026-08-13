const pool = require('../../../db');

async function getAllEmployees(req, res) {
    try {
        const { department, status, search } = req.query;

        let query = `
            SELECT e.*, 
                    d.name as department_name,
                    des.name as designation_name,
                    CONCAT(m."firstName", ' ', m."lastName") as reporting_manager_name
            FROM employees e
            LEFT JOIN departments d ON e."departmentId" = d.id
            LEFT JOIN designations des ON e."designationId" = des.id
            LEFT JOIN employees m ON e."reportingManagerId" = m.id
            WHERE 1=1
        `;

        const params = [];
        let paramCount = 1;

        if (department) {
            query += ` AND e."departmentId" = $${paramCount}`;
            params.push(department);
            paramCount++;
        }

        if (status) {
            query += ` AND e.status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        if (search) {
            query += ` AND (e."firstName" ILIKE $${paramCount} OR e."lastName" ILIKE $${paramCount} OR e.email ILIKE $${paramCount} OR e."employeeCode" ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }

        query += ` ORDER BY e.created_at DESC`;

        const result = await pool.query(query, params);

        res.status(200).json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });

    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = getAllEmployees;