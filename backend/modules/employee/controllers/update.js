const pool = require('../../../db');

async function updateEmployee(req, res) {
    const { id } = req.params;
    const {
        employeeCode, firstName, lastName, phone, dateOfBirth, gender,
        address, city, state, country, pincode,
        departmentId, designationId, reportingManagerId,
        employmentType, status
    } = req.body;

    try {
        const existing = await pool.query(
            'SELECT * FROM employees WHERE id = $1',
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const oldData = existing.rows[0];

        const result = await pool.query(
            `UPDATE employees SET
                "employeeCode" = $1,
                "firstName" = $2,
                "lastName" = $3,
                phone = $4,
                "dateOfBirth" = $5,
                gender = $6,
                address = $7,
                city = $8,
                state = $9,
                country = $10,
                pincode = $11,
                "departmentId" = $12,
                "designationId" = $13,
                "reportingManagerId" = $14,
                "employmentType" = $15,
                status = $16,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $17
             RETURNING *`,
            [employeeCode, firstName, lastName, phone, dateOfBirth, gender,
             address, city, state, country, pincode,
             departmentId, designationId, reportingManagerId,
             employmentType, status, id]
        );

        await pool.query(
            `INSERT INTO employee_history ("employeeId", "changeType", "oldValue", "newValue", "effectiveDate", remarks)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [id, 'Updated', JSON.stringify(oldData), JSON.stringify(result.rows[0]), new Date(), 'Employee updated']
        );

        if (oldData.status !== status) {
            await pool.query(
                `INSERT INTO employee_status_history ("employeeId", "oldStatus", "newStatus", "effectiveDate", reason)
                 VALUES ($1, $2, $3, $4, $5)`,
                [id, oldData.status, status, new Date(), 'Status changed']
            );
        }

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = updateEmployee;