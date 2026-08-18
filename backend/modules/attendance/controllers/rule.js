const pool = require('../../../db');

async function getRules(req, res) {
    try {
        const result = await pool.query('SELECT * FROM attendance_rules ORDER BY id ASC');
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get rules error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function updateRules(req, res) {
    const { 
        id, name, grace_period_minutes, late_threshold_minutes, 
        early_checkout_threshold_minutes, half_day_hours, full_day_hours, 
        overtime_threshold_hours, allow_overtime, allow_half_day, status 
    } = req.body;

    try {
        const role = req.user.role ? req.user.role.toLowerCase() : '';
        if (role !== 'admin' && role !== 'hr') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Insufficient permissions to modify rules'
            });
        }

        let targetId = id;

        if (!targetId) {
            const firstRule = await pool.query('SELECT id FROM attendance_rules ORDER BY id ASC LIMIT 1');
            if (firstRule.rows.length > 0) {
                targetId = firstRule.rows[0].id;
            }
        }

        if (!targetId) {
            const result = await pool.query(
                `INSERT INTO attendance_rules (
                    name, grace_period_minutes, late_threshold_minutes, 
                    early_checkout_threshold_minutes, half_day_hours, full_day_hours, 
                    overtime_threshold_hours, allow_overtime, allow_half_day, status, 
                    created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                 RETURNING *`,
                [
                    name || 'Default Rules',
                    grace_period_minutes !== undefined ? grace_period_minutes : 15,
                    late_threshold_minutes !== undefined ? late_threshold_minutes : 120,
                    early_checkout_threshold_minutes !== undefined ? early_checkout_threshold_minutes : 15,
                    half_day_hours !== undefined ? half_day_hours : 4.0,
                    full_day_hours !== undefined ? full_day_hours : 8.0,
                    overtime_threshold_hours !== undefined ? overtime_threshold_hours : 8.0,
                    allow_overtime !== undefined ? allow_overtime : true,
                    allow_half_day !== undefined ? allow_half_day : true,
                    status || 'Active'
                ]
            );
            return res.status(201).json({
                success: true,
                message: 'Rules created successfully',
                data: result.rows[0]
            });
        }

        const updateFields = [];
        const params = [];
        let paramCount = 1;

        if (name !== undefined) {
            updateFields.push(`name = $${paramCount}`);
            params.push(name);
            paramCount++;
        }
        if (grace_period_minutes !== undefined) {
            updateFields.push(`grace_period_minutes = $${paramCount}`);
            params.push(grace_period_minutes);
            paramCount++;
        }
        if (late_threshold_minutes !== undefined) {
            updateFields.push(`late_threshold_minutes = $${paramCount}`);
            params.push(late_threshold_minutes);
            paramCount++;
        }
        if (early_checkout_threshold_minutes !== undefined) {
            updateFields.push(`early_checkout_threshold_minutes = $${paramCount}`);
            params.push(early_checkout_threshold_minutes);
            paramCount++;
        }
        if (half_day_hours !== undefined) {
            updateFields.push(`half_day_hours = $${paramCount}`);
            params.push(half_day_hours);
            paramCount++;
        }
        if (full_day_hours !== undefined) {
            updateFields.push(`full_day_hours = $${paramCount}`);
            params.push(full_day_hours);
            paramCount++;
        }
        if (overtime_threshold_hours !== undefined) {
            updateFields.push(`overtime_threshold_hours = $${paramCount}`);
            params.push(overtime_threshold_hours);
            paramCount++;
        }
        if (allow_overtime !== undefined) {
            updateFields.push(`allow_overtime = $${paramCount}`);
            params.push(allow_overtime);
            paramCount++;
        }
        if (allow_half_day !== undefined) {
            updateFields.push(`allow_half_day = $${paramCount}`);
            params.push(allow_half_day);
            paramCount++;
        }
        if (status !== undefined) {
            updateFields.push(`status = $${paramCount}`);
            params.push(status);
            paramCount++;
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        params.push(targetId);

        const query = `UPDATE attendance_rules SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await pool.query(query, params);

        res.status(200).json({
            success: true,
            message: 'Rules updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update rules error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    getRules,
    updateRules
};
