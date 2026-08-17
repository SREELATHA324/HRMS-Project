const express = require('express');
const router = express.Router();

const login = require('./controllers/login');
const forgotPassword = require('./controllers/forgotPassword');
const sendOTP = require('./controllers/otp');
const verifyOTP = require('./controllers/verifyOtp');
const resetPassword = require('./controllers/resetPassword');
const auth = require('./middleware/auth');
const roleCheck = require('./middleware/roleCheck');
const changePassword = require('./controllers/changePassword');

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/change-password', auth, changePassword);

router.get('/admin-only', auth, roleCheck('admin'), (req, res) => {
    res.json({
        success: true,
        message: 'Welcome Admin',
        user: req.user
    });
});

router.get('/hr-only', auth, roleCheck('hr', 'admin'), (req, res) => {
    res.json({
        success: true,
        message: 'Welcome HR',
        user: req.user
    });
});

router.get('/me', auth, async (req, res) => {
    try {
        const pool = require('../../../db');
        const result = await pool.query(
            'SELECT id, email, is_active, last_login FROM users WHERE id = $1',
            [req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;