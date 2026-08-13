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
                "employeeCode" = COALESCE($1, "employeeCode"),
                "firstName" = COALESCE($2, "firstName"),
                "lastName" = COALESCE($3, "lastName"),
                phone = COALESCE($4, phone),
                "dateOfBirth" = COALESCE($5, "dateOfBirth"),
                gender = COALESCE($6, gender),
                address = COALESCE($7, address),
                city = COALESCE($8, city),
                state = COALESCE($9, state),
                country = COALESCE($10, country),
                pincode = COALESCE($11, pincode),
                "departmentId" = COALESCE($12, "departmentId"),
                "designationId" = COALESCE($13, "designationId"),
                "reportingManagerId" = COALESCE($14, "reportingManagerId"),
                "employmentType" = COALESCE($15, "employmentType"),
                status = COALESCE($16, status),
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

        if (oldData.status !== status && status) {
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