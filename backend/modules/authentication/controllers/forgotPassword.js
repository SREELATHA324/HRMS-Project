const pool = require('../../../db');
const { generateOTP, getOTPExpiry } = require('../utils/auth');
const { validateForgotPasswordInput } = require('../utils/validators');
const { sendPasswordResetEmail } = require('../services/emailService');

async function forgotPassword(req, res) {
    const { email } = req.body;

    const validation = validateForgotPasswordInput(email);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validation.errors
        });
    }

    try {
        const result = await pool.query(
            'SELECT id FROM users WHERE email = $1 AND is_active = true',
            [email.toLowerCase().trim()]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Email not found or account is inactive'
            });
        }

        const userId = result.rows[0].id;
        const otp = generateOTP();
        const expiresAt = getOTPExpiry();

        await pool.query(
            'DELETE FROM password_reset_tokens WHERE user_id = $1 AND used_at IS NULL',
            [userId]
        );

        await pool.query(
            `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
             VALUES ($1, $2, $3)`,
            [userId, otp, expiresAt]
        );

        await sendPasswordResetEmail(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email',
            expiresIn: process.env.OTP_EXPIRY_MINUTES || 10
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = forgotPassword;