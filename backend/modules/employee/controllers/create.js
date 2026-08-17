const pool = require('../../../db');
const { hashPassword } = require('../../authentication/utils/auth');
const { sendWelcomeEmail } = require('../../authentication/services/emailService');

function generateTempPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function generateEmployeeCode() {
    const prefix = 'EMP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return prefix + timestamp + random;
}

async function getRoleIdByName(roleName) {
    try {
        const result = await pool.query(
            'SELECT id FROM roles WHERE LOWER(name) = LOWER($1)',
            [roleName]
        );
        if (result.rows.length > 0) {
            return result.rows[0].id;
        }
        const defaultRole = await pool.query(
            'SELECT id FROM roles WHERE LOWER(name) = $1',
            ['employee']
        );
        return defaultRole.rows[0]?.id || 4;
    } catch (error) {
        return 4;
    }
}

async function createEmployee(req, res) {
    const {
        employeeCode, firstName, lastName, email, phone,
        dateOfBirth, gender, address, city, state, country,
        pincode, departmentId, designationId, reportingManagerId,
        joiningDate, employmentType, status, role, jobLocation
    } = req.body;

    try {
        const finalEmployeeCode = employeeCode || generateEmployeeCode();

        const existing = await pool.query(
            'SELECT id FROM employees WHERE email = $1 OR "employeeCode" = $2',
            [email, finalEmployeeCode]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Employee with this email or code already exists'
            });
        }

        const userExists = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        let userId = null;
        let isNewUser = false;

        if (userExists.rows.length > 0) {
            userId = userExists.rows[0].id;
        } else {
            isNewUser = true;
            const tempPassword = generateTempPassword();
            const hashedPassword = await hashPassword(tempPassword);

            const userRole = role || 'employee';
            const roleId = await getRoleIdByName(userRole);

            const userResult = await pool.query(
                `INSERT INTO users (email, password_hash, name, role_id, is_active, is_email_verified)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id`,
                [email, hashedPassword, `${firstName} ${lastName || ''}`.trim(), roleId, true, false]
            );

            userId = userResult.rows[0].id;

            await sendWelcomeEmail(email, firstName || 'Employee', tempPassword);
        }

        const finalStatus = status || 'Active';
        const finalRole = role || 'employee';
        const finalJobLocation = jobLocation || 'onsite';
        const finalEmploymentType = employmentType || 'Full-time';

        const result = await pool.query(
            `INSERT INTO employees (
                "userId", "employeeCode", "firstName", "lastName", email, phone,
                "dateOfBirth", gender, address, city, state, country,
                pincode, "departmentId", "designationId", "reportingManagerId",
                "joiningDate", "employmentType", status, role, "jobLocation"
            ) VALUES ($1, $2, $3, $4, $5, $6, 
                      $7, $8, $9, $10, $11, $12,
                      $13, $14, $15, $16, $17, $18, $19, $20, $21)
             RETURNING *`,
            [userId, finalEmployeeCode, firstName, lastName || '', email, phone || '',
             dateOfBirth || null, gender || null, address || '', city || '', state || '', country || '',
             pincode || '', departmentId || null, designationId || null, reportingManagerId || null,
             joiningDate || new Date(), finalEmploymentType, finalStatus,
             finalRole, finalJobLocation]
        );

        await pool.query(
            `INSERT INTO employee_history ("employeeId", "changeType", "oldValue", "newValue", "effectiveDate", remarks)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [result.rows[0].id, 'Created', 'New', JSON.stringify(result.rows[0]), new Date(), 'Employee created with user account']
        );

        res.status(201).json({
            success: true,
            message: isNewUser
                ? 'Employee created successfully. Welcome email sent with login credentials.'
                : 'Employee created successfully and linked to existing user',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
}

module.exports = createEmployee;