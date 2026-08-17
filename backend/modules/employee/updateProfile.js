const pool = require('../../../db');

const EDITABLE_FIELDS = [
    'firstName', 'lastName', 'phone', 
    'personalEmail', 'personalMobile', 
    'emergencyContact', 'emergencyMobile', 
    'bloodGroup',
    'dateOfBirth', 'gender', 
    'address', 'city', 'state', 'country', 'pincode'
];

async function updateProfile(req, res) {
    const userId = req.user.id;
    const body = req.body;

    try {
        const employeeResult = await pool.query(
            'SELECT id FROM employees WHERE "userId" = $1 AND deleted_at IS NULL',
            [userId]
        );

        if (employeeResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const employeeId = employeeResult.rows[0].id;

        const oldData = await pool.query(
            'SELECT * FROM employees WHERE id = $1',
            [employeeId]
        );

        const updateFields = [];
        const updateParams = [];
        let paramCount = 1;

        EDITABLE_FIELDS.forEach(field => {
            if (body[field] !== undefined) {
                updateFields.push(`"${field}" = $${paramCount}`);
                if (field === 'dateOfBirth' && body[field] === '') {
                    updateParams.push(null);
                } else {
                    updateParams.push(body[field] || '');
                }
                paramCount++;
            }
        });

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No editable fields to update'
            });
        }

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        updateParams.push(employeeId);

        const query = `UPDATE employees SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await pool.query(query, updateParams);

        await pool.query(
            `INSERT INTO employee_history ("employeeId", "changeType", "oldValue", "newValue", "effectiveDate", remarks)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [employeeId, 'Profile Updated', JSON.stringify(oldData.rows[0]), JSON.stringify(result.rows[0]), new Date(), 'Profile updated by employee']
        );

        const updatedProfile = await pool.query(
            `SELECT 
                e.id as employee_id,
                e."employeeCode",
                e."firstName",
                e."lastName",
                e.email,
                e.phone,
                e."personalEmail",
                e."personalMobile",
                e."emergencyContact",
                e."emergencyMobile",
                e."bloodGroup",
                e."dateOfBirth",
                e.gender,
                e.address,
                e.city,
                e.state,
                e.country,
                e.pincode,
                e."joiningDate",
                e."employmentType",
                e.status,
                e.role,
                e."jobLocation",
                d.name as department_name,
                des.name as designation_name,
                CONCAT(m."firstName", ' ', m."lastName") as reporting_manager_name
             FROM employees e
             LEFT JOIN departments d ON e."departmentId" = d.id
             LEFT JOIN designations des ON e."designationId" = des.id
             LEFT JOIN employees m ON e."reportingManagerId" = m.id
             WHERE e.id = $1`,
            [employeeId]
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile.rows[0]
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = updateProfile;