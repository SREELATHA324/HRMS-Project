const pool = require('../../../db');
const { comparePassword, generateToken } = require('../utils/auth');
const { validateLoginInput } = require('../utils/validators');

async function login(req, res) {
    const { email, password } = req.body;

    const validation = validateLoginInput(email, password);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validation.errors
        });
    }

    try {
        const result = await pool.query(
            `SELECT u.id, u.email, u.password_hash, u.is_active, r.name as role
             FROM users u
             LEFT JOIN roles r ON u.role_id = r.id
             WHERE u.email = $1`,
            [email.toLowerCase().trim()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = result.rows[0];

        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Account deactivated. Contact HR.'
            });
        }

        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        await pool.query(
            'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        await pool.query(
            `INSERT INTO login_history (user_id, login_status, ip_address, user_agent)
             VALUES ($1, $2, $3, $4)`,
            [user.id, 'success', req.ip || req.connection.remoteAddress, req.headers['user-agent']]
        );

        const token = generateToken({ id: user.id, role: user.role });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = login;