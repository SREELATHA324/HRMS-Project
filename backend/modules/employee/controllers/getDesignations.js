const pool = require('../../../db');

async function getDesignations(req, res) {
    try {
        const result = await pool.query(
            `SELECT id, name, description FROM designations WHERE is_active = true ORDER BY name`
        );

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get designations error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = getDesignations;