const pool = require('../../../db');
const { generateOTP, getOTPExpiry } = require('../utils/auth');
const { validateForgotPasswordInput } = require('../utils/validators');
const { sendOTPEmail } = require('../services/emailService');

async function sendOTP(req, res) {
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
            `INSERT INTO password_reset_tokens (user_id, token, expires_at)
             VALUES ($1, $2, $3)`,
            [userId, otp, expiresAt]
        );

        await sendOTPEmail(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            expiresIn: process.env.OTP_EXPIRY_MINUTES || 10
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = sendOTP;