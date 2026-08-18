const pool = require('../../../db');
const { getEmployeeByUserId, getEmployeeById } = require('../services/attendanceService');

async function createShift(req, res) {
    const { name, start_time, end_time, break_minutes, grace_minutes, working_hours, is_overnight, status } = req.body;

    try {
        const role = req.user.role ? req.user.role.toLowerCase() : '';
        if (role !== 'admin' && role !== 'hr') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Insufficient permissions to create shifts'
            });
        }

        const result = await pool.query(
            `INSERT INTO shifts (
                name, start_time, end_time, break_minutes, grace_minutes, 
                working_hours, is_overnight, status, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING *`,
            [
                name,
                start_time,
                end_time,
                break_minutes || 0,
                grace_minutes || 0,
                working_hours || 8.0,
                is_overnight || false,
                status || 'Active'
            ]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create shift error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function getShifts(req, res) {
    try {
        const result = await pool.query('SELECT * FROM shifts ORDER BY id ASC');
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get shifts error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function getShiftById(req, res) {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM shifts WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Shift not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Get shift by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function updateShift(req, res) {
    const { id } = req.params;
    const { name, start_time, end_time, break_minutes, grace_minutes, working_hours, is_overnight, status } = req.body;

    try {
        const role = req.user.role ? req.user.role.toLowerCase() : '';
        if (role !== 'admin' && role !== 'hr') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Insufficient permissions to update shifts'
            });
        }

        const shiftRes = await pool.query('SELECT * FROM shifts WHERE id = $1', [id]);
        if (shiftRes.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Shift not found'
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
        if (start_time !== undefined) {
            updateFields.push(`start_time = $${paramCount}`);
            params.push(start_time);
            paramCount++;
        }
        if (end_time !== undefined) {
            updateFields.push(`end_time = $${paramCount}`);
            params.push(end_time);
            paramCount++;
        }
        if (break_minutes !== undefined) {
            updateFields.push(`break_minutes = $${paramCount}`);
            params.push(break_minutes);
            paramCount++;
        }
        if (grace_minutes !== undefined) {
            updateFields.push(`grace_minutes = $${paramCount}`);
            params.push(grace_minutes);
            paramCount++;
        }
        if (working_hours !== undefined) {
            updateFields.push(`working_hours = $${paramCount}`);
            params.push(working_hours);
            paramCount++;
        }
        if (is_overnight !== undefined) {
            updateFields.push(`is_overnight = $${paramCount}`);
            params.push(is_overnight);
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
        params.push(id);

        const query = `UPDATE shifts SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await pool.query(query, params);

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update shift error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function deleteShift(req, res) {
    const { id } = req.params;

    try {
        const role = req.user.role ? req.user.role.toLowerCase() : '';
        if (role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Only admin can delete shifts'
            });
        }

        const checkInUse = await pool.query(
            'SELECT id FROM employee_shifts WHERE shift_id = $1 LIMIT 1',
            [id]
        );

        if (checkInUse.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete shift as it is currently assigned to employees'
            });
        }

        const result = await pool.query('DELETE FROM shifts WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Shift not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Shift deleted successfully'
        });

    } catch (error) {
        console.error('Delete shift error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function assignShift(req, res) {
    const { employee_id, shift_id, effective_from, effective_to, status } = req.body;

    try {
        const role = req.user.role ? req.user.role.toLowerCase() : '';
        if (role !== 'admin' && role !== 'hr') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Insufficient permissions to assign shifts'
            });
        }

        const emp = await getEmployeeById(employee_id);
        if (!emp) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const shift = await pool.query('SELECT * FROM shifts WHERE id = $1', [shift_id]);
        if (shift.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Shift not found'
            });
        }

        const result = await pool.query(
            `INSERT INTO employee_shifts (
                employee_id, shift_id, effective_from, effective_to, status, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING *`,
            [employee_id, shift_id, effective_from, effective_to || null, status || 'Active']
        );

        res.status(201).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Assign shift error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function getEmployeeShifts(req, res) {
    const { employeeId } = req.params;

    try {
        const loggedInEmployee = await getEmployeeByUserId(req.user.id);
        if (!loggedInEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const role = req.user.role ? req.user.role.toLowerCase() : '';
        if (employeeId != loggedInEmployee.id && role !== 'admin' && role !== 'hr') {
            if (role === 'manager') {
                const targetEmp = await getEmployeeById(employeeId);
                if (!targetEmp || targetEmp.reportingManagerId != loggedInEmployee.id) {
                    return res.status(403).json({
                        success: false,
                        message: 'Forbidden: Cannot access shift details for this employee'
                    });
                }
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: Cannot access shift details for this employee'
                });
            }
        }

        const result = await pool.query(
            `SELECT es.*, s.name as shift_name, s.start_time, s.end_time
             FROM employee_shifts es
             JOIN shifts s ON es.shift_id = s.id
             WHERE es.employee_id = $1
             ORDER BY es.effective_from DESC`,
            [employeeId]
        );

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error('Get employee shifts error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

async function updateEmployeeShift(req, res) {
    const { employeeId } = req.params;
    const { shift_id, effective_from, effective_to, status } = req.body;

    try {
        const role = req.user.role ? req.user.role.toLowerCase() : '';
        if (role !== 'admin' && role !== 'hr') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Insufficient permissions to update employee shifts'
            });
        }

        const activeShift = await pool.query(
            `SELECT * FROM employee_shifts 
             WHERE employee_id = $1 AND status = 'Active' 
             ORDER BY effective_from DESC LIMIT 1`,
            [employeeId]
        );

        if (activeShift.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No active shift assignment found to update'
            });
        }

        const assignmentId = activeShift.rows[0].id;
        const updateFields = [];
        const params = [];
        let paramCount = 1;

        if (shift_id !== undefined) {
            updateFields.push(`shift_id = $${paramCount}`);
            params.push(shift_id);
            paramCount++;
        }
        if (effective_from !== undefined) {
            updateFields.push(`effective_from = $${paramCount}`);
            params.push(effective_from);
            paramCount++;
        }
        if (effective_to !== undefined) {
            updateFields.push(`effective_to = $${paramCount}`);
            params.push(effective_to);
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
        params.push(assignmentId);

        const query = `UPDATE employee_shifts SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        const result = await pool.query(query, params);

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update employee shift error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    createShift,
    getShifts,
    getShiftById,
    updateShift,
    deleteShift,
    assignShift,
    getEmployeeShifts,
    updateEmployeeShift
};
