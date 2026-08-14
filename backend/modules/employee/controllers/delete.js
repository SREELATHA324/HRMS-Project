const pool = require('../../../db');

async function deleteEmployee(req, res) {
    const { id } = req.params;
    const { type } = req.query; 
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

        if (type === 'permanent' || !type) {
            await pool.query(
                'DELETE FROM employees WHERE id = $1',
                [id]
            );

            return res.status(200).json({
                success: true,
                message: 'Employee deleted permanently'
            });
        }

        if (type === 'soft') {

            const softCheck = await pool.query(
                'SELECT * FROM employees WHERE id = $1 AND deleted_at IS NULL',
                [id]
            );

            if (softCheck.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee already deleted'
                });
            }

            await pool.query(
                'UPDATE employees SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
                [id]
            );

            return res.status(200).json({
                success: true,
                message: 'Employee deleted successfully'
            });
        }

        return res.status(400).json({
            success: false,
            message: 'Invalid delete type. Use "soft" or "permanent"'
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