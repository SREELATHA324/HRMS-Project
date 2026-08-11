const pool = require('../../../db');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../utils/auth');
const { validateResetPasswordInput } = require('../utils/validators');

async function resetPassword(req, res) {
    const { password, confirmPassword, resetToken } = req.body;

    if (!resetToken) {
        return res.status(400).json({
            success: false,
            message: 'Reset token is required'
        });
    }

    const validation = validateResetPasswordInput(password, confirmPassword);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validation.errors
        });
    }

    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const userResult = await pool.query(
            'SELECT id FROM users WHERE id = $1 AND is_active = true',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        const hashedPassword = await hashPassword(password);

        await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [hashedPassword, userId]
        );

        await pool.query(
            'UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND used_at IS NULL',
            [userId]
        );

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid reset token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Reset token has expired. Request a new OTP.'
            });
        }
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = resetPassword;