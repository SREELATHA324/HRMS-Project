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


async function createLeaveBalancesForEmployee(employeeId) {
    try {
        const leaveTypes = await pool.query(
            'SELECT * FROM leave_types WHERE is_active = true'
        );

        if (leaveTypes.rows.length === 0) {
            console.log(' No leave types found. Please insert leave types first.');
            return;
        }

        const currentYear = new Date().getFullYear();

        for (const lt of leaveTypes.rows) {
            const defaultDays = lt.max_days_per_year || 0;

            await pool.query(
                `INSERT INTO leave_balances (
                    employee_id, 
                    leave_type_id, 
                    year, 
                    opening_balance, 
                    closing_balance,
                    created_at,
                    updated_at
                ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT (employee_id, leave_type_id, year) 
                DO UPDATE SET 
                    opening_balance = EXCLUDED.opening_balance,
                    closing_balance = EXCLUDED.closing_balance,
                    updated_at = CURRENT_TIMESTAMP`,
                [employeeId, lt.id, currentYear, defaultDays, defaultDays]
            );
        }

        console.log(`leave balances created for employee ${employeeId}`);
    } catch (error) {
        console.error('Error creating leave balances:', error);
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
        const finalJobLocation = jobLocation || 'onsite';
        const finalEmploymentType = employmentType || 'Full-time';

        const result = await pool.query(
            `INSERT INTO employees (
                "userId", "employeeCode", "firstName", "lastName", email, phone,
                "dateOfBirth", gender, address, city, state, country,
                pincode, "departmentId", "designationId", "reportingManagerId",
                "joiningDate", "employmentType", status, "jobLocation"
            ) VALUES ($1, $2, $3, $4, $5, $6, 
                      $7, $8, $9, $10, $11, $12,
                      $13, $14, $15, $16, $17, $18, $19, $20)
             RETURNING *`,
            [userId, finalEmployeeCode, firstName, lastName || '', email, phone || '',
             dateOfBirth || null, gender || null, address || '', city || '', state || '', country || '',
             pincode || '', departmentId || null, designationId || null, reportingManagerId || null,
             joiningDate || new Date(), finalEmploymentType, finalStatus, finalJobLocation]
        );

        await pool.query(
            `INSERT INTO employee_history ("employeeId", "changeType", "oldValue", "newValue", "effectiveDate", remarks)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [result.rows[0].id, 'Created', 'New', JSON.stringify(result.rows[0]), new Date(), 'Employee created with user account']
        );

        
        await createLeaveBalancesForEmployee(result.rows[0].id);

        res.status(201).json({
            success: true,
            message: isNewUser
                ? 'Employee created successfully. Welcome email sent with login credentials. Leave balances auto-created.'
                : 'Employee created successfully and linked to existing user. Leave balances auto-created.',
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