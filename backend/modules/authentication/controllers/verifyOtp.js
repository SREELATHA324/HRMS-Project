const pool = require('../../../db');
const { generateResetToken } = require('../utils/auth');
const { validateOTPInput } = require('../utils/validators');

async function verifyOTP(req, res) {
    const { email, otp } = req.body;

    const validation = validateOTPInput(email, otp);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validation.errors
        });
    }

    try {
        const userResult = await pool.query(
            'SELECT id FROM users WHERE email = $1 AND is_active = true',
            [email.toLowerCase().trim()]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        const userId = userResult.rows[0].id;

        const otpResult = await pool.query(
            `SELECT id, expires_at FROM password_reset_tokens
             WHERE user_id = $1
             AND token = $2
             AND used_at IS NULL
             ORDER BY created_at DESC LIMIT 1`,
            [userId, otp]
        );

        if (otpResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        const otpRecord = otpResult.rows[0];

        if (new Date() > otpRecord.expires_at) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Request a new one.'
            });
        }

        await pool.query(
            'UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = $1',
            [otpRecord.id]
        );

        const resetToken = generateResetToken(userId);

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            resetToken: resetToken
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = verifyOTP;