const pool = require('../../../db');

async function getDepartments(req, res) {
    try {
        const result = await pool.query(
            `SELECT id, name, description FROM departments WHERE is_active = true ORDER BY name`
        );

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get departments error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = getDepartments;