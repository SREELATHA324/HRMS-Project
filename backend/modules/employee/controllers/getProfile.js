const pool = require('../../../db');

async function getProfile(req, res) {
    try {
        const userId = req.user.id;

        const result = await pool.query(
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
                CONCAT(m."firstName", ' ', m."lastName") as reporting_manager_name,
                u.is_active as is_user_active,
                u.is_email_verified
             FROM employees e
             LEFT JOIN departments d ON e."departmentId" = d.id
             LEFT JOIN designations des ON e."designationId" = des.id
             LEFT JOIN employees m ON e."reportingManagerId" = m.id
             LEFT JOIN users u ON e."userId" = u.id
             WHERE e."userId" = $1 AND e.deleted_at IS NULL`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        const employee = result.rows[0];
        
        
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

        res.status(200).json({
            success: true,
            data: {
                ...employee,
                lengthOfService
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = getProfile;