const pool = require('../../../db');

async function getEmployeeById(req, res) {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT e.*, 
                    d.name as department_name,
                    des.name as designation_name,
                    CONCAT(m."firstName", ' ', m."lastName") as reporting_manager_name
             FROM employees e
             LEFT JOIN departments d ON e."departmentId" = d.id
             LEFT JOIN designations des ON e."designationId" = des.id
             LEFT JOIN employees m ON e."reportingManagerId" = m.id
             WHERE e.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const employee = result.rows[0];

        const emergencyContacts = await pool.query(
            'SELECT * FROM employee_emergency_contacts WHERE "employeeId" = $1',
            [id]
        );

        const bankAccounts = await pool.query(
            'SELECT * FROM employee_bank_accounts WHERE "employeeId" = $1',
            [id]
        );

        res.status(200).json({
            success: true,
            data: {
                ...employee,
                emergencyContacts: emergencyContacts.rows,
                bankAccounts: bankAccounts.rows
            }
        });

    } catch (error) {
        console.error('Get employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = getEmployeeById;