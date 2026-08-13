const pool = require('../../../db');

async function deleteEmployee(req, res) {
    const { id } = req.params;

    try {
        const existing = await pool.query(
            'SELECT * FROM employees WHERE id = $1',
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        await pool.query(
            'DELETE FROM employees WHERE id = $1',
            [id]
        );

        res.status(200).json({
            success: true,
            message: 'Employee deleted successfully'
        });

    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = deleteEmployee;