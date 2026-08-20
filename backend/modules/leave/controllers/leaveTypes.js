const pool = require('../../../db');

async function getLeaveTypes(req, res) {
    try {
        const result = await pool.query(
            'SELECT * FROM leave_types WHERE is_active = true ORDER BY name'
        );
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get leave types error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function createLeaveType(req, res) {
    const { name, code, description, color, is_paid, is_carry_forward, max_days_per_year, max_continuous_days, requires_approval } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO leave_types (name, code, description, color, is_paid, is_carry_forward, max_days_per_year, max_continuous_days, requires_approval)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [name, code, description, color || '#6366c1', is_paid !== false, is_carry_forward || false, max_days_per_year, max_continuous_days, requires_approval !== false]
        );
        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Create leave type error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    getLeaveTypes,
    createLeaveType
};