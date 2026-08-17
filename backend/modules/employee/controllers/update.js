const pool = require('../../../db');

async function updateEmployee(req, res) {
    const { id } = req.params;
    const {
        employeeCode, firstName, lastName, phone, dateOfBirth, gender,
        address, city, state, country, pincode,
        departmentId, designationId, reportingManagerId,
        employmentType, status, role, jobLocation
    } = req.body;

    try {
        const existing = await pool.query(
            'SELECT * FROM employees WHERE id = $1 AND deleted_at IS NULL',
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const oldData = existing.rows[0];

        const updateFields = [];
        const updateParams = [];
        let paramCount = 1;

        if (employeeCode !== undefined) {
            updateFields.push(`"employeeCode" = $${paramCount}`);
            updateParams.push(employeeCode);
            paramCount++;
        }
        if (firstName !== undefined) {
            updateFields.push(`"firstName" = $${paramCount}`);
            updateParams.push(firstName);
            paramCount++;
        }
        if (lastName !== undefined) {
            updateFields.push(`"lastName" = $${paramCount}`);
            updateParams.push(lastName);
            paramCount++;
        }
        if (phone !== undefined) {
            updateFields.push(`phone = $${paramCount}`);
            updateParams.push(phone);
            paramCount++;
        }
        if (dateOfBirth !== undefined) {
            updateFields.push(`"dateOfBirth" = $${paramCount}`);
            updateParams.push(dateOfBirth || null);
            paramCount++;
        }
        if (gender !== undefined) {
            updateFields.push(`gender = $${paramCount}`);
            updateParams.push(gender || null);
            paramCount++;
        }
        if (address !== undefined) {
            updateFields.push(`address = $${paramCount}`);
            updateParams.push(address || '');
            paramCount++;
        }
        if (city !== undefined) {
            updateFields.push(`city = $${paramCount}`);
            updateParams.push(city || '');
            paramCount++;
        }
        if (state !== undefined) {
            updateFields.push(`state = $${paramCount}`);
            updateParams.push(state || '');
            paramCount++;
        }
        if (country !== undefined) {
            updateFields.push(`country = $${paramCount}`);
            updateParams.push(country || '');
            paramCount++;
        }
        if (pincode !== undefined) {
            updateFields.push(`pincode = $${paramCount}`);
            updateParams.push(pincode || '');
            paramCount++;
        }
        if (departmentId !== undefined) {
            updateFields.push(`"departmentId" = $${paramCount}`);
            updateParams.push(departmentId || null);
            paramCount++;
        }
        if (designationId !== undefined) {
            updateFields.push(`"designationId" = $${paramCount}`);
            updateParams.push(designationId || null);
            paramCount++;
        }
        if (reportingManagerId !== undefined) {
            updateFields.push(`"reportingManagerId" = $${paramCount}`);
            updateParams.push(reportingManagerId || null);
            paramCount++;
        }
        if (employmentType !== undefined) {
            updateFields.push(`"employmentType" = $${paramCount}`);
            updateParams.push(employmentType);
            paramCount++;
        }
        if (status !== undefined) {
            updateFields.push(`status = $${paramCount}`);
            updateParams.push(status);
            paramCount++;
        }
        if (role !== undefined) {
            updateFields.push(`role = $${paramCount}`);
            updateParams.push(role);
            paramCount++;
        }
        if (jobLocation !== undefined) {
            updateFields.push(`"jobLocation" = $${paramCount}`);
            updateParams.push(jobLocation);
            paramCount++;
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        updateParams.push(id);

        const query = `UPDATE employees SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await pool.query(query, updateParams);

        if (oldData.status !== status && status) {
            await pool.query(
                `INSERT INTO employee_status_history ("employeeId", "oldStatus", "newStatus", "effectiveDate", reason)
                 VALUES ($1, $2, $3, $4, $5)`,
                [id, oldData.status, status, new Date(), 'Status changed']
            );
        }

        await pool.query(
            `INSERT INTO employee_history ("employeeId", "changeType", "oldValue", "newValue", "effectiveDate", remarks)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [id, 'Updated', JSON.stringify(oldData), JSON.stringify(result.rows[0]), new Date(), 'Employee updated']
        );

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