const pool = require('../../../db');

async function getEmployeeByUserId(userId) {
    const result = await pool.query(
        'SELECT * FROM employees WHERE "userId" = $1 AND deleted_at IS NULL',
        [userId]
    );
    return result.rows[0] || null;
}

async function getEmployeeById(employeeId) {
    const result = await pool.query(
        'SELECT * FROM employees WHERE id = $1 AND deleted_at IS NULL',
        [employeeId]
    );
    return result.rows[0] || null;
}

async function getTaskById(taskId) {
    const result = await pool.query(
        `SELECT t.*, 
                assigned_emp."employeeCode" as assigned_to_code,
                assigned_emp."firstName" as assigned_to_first_name,
                assigned_emp."lastName" as assigned_to_last_name,
                assigned_by_emp."employeeCode" as assigned_by_code,
                assigned_by_emp."firstName" as assigned_by_first_name,
                assigned_by_emp."lastName" as assigned_by_last_name
         FROM tasks t
         LEFT JOIN employees assigned_emp ON t.assigned_to = assigned_emp.id
         LEFT JOIN employees assigned_by_emp ON t.assigned_by = assigned_by_emp.id
         WHERE t.id = $1 AND t.deleted_at IS NULL`,
        [taskId]
    );
    return result.rows[0] || null;
}

async function getTasksByEmployee(employeeId, role, managerId) {
    let query = `
        SELECT t.*, 
                assigned_emp."employeeCode" as assigned_to_code,
                assigned_emp."firstName" as assigned_to_first_name,
                assigned_emp."lastName" as assigned_to_last_name,
                assigned_by_emp."employeeCode" as assigned_by_code,
                assigned_by_emp."firstName" as assigned_by_first_name,
                assigned_by_emp."lastName" as assigned_by_last_name
         FROM tasks t
         LEFT JOIN employees assigned_emp ON t.assigned_to = assigned_emp.id
         LEFT JOIN employees assigned_by_emp ON t.assigned_by = assigned_by_emp.id
         WHERE t.deleted_at IS NULL
    `;
    const params = [];
    let paramCount = 1;

    if (role === 'employee') {
        query += ` AND t.assigned_to = $${paramCount}`;
        params.push(employeeId);
        paramCount++;
    } else if (role === 'manager') {
        query += ` AND (t.assigned_to = $${paramCount} OR assigned_emp."reportingManagerId" = $${paramCount})`;
        params.push(managerId);
        paramCount++;
    }

    query += ` ORDER BY t.created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
}

async function createTask(taskData) {
    const { title, description, assigned_to, assigned_by, priority, due_date } = taskData;
    const result = await pool.query(
        `INSERT INTO tasks (title, description, assigned_to, assigned_by, priority, due_date, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [title, description, assigned_to, assigned_by, priority || 'medium', due_date || null]
    );
    return result.rows[0];
}

async function updateTask(taskId, taskData) {
    const { title, description, assigned_to, priority, due_date } = taskData;
    const updateFields = [];
    const params = [];
    let paramCount = 1;

    if (title !== undefined) {
        updateFields.push(`title = $${paramCount}`);
        params.push(title);
        paramCount++;
    }
    if (description !== undefined) {
        updateFields.push(`description = $${paramCount}`);
        params.push(description);
        paramCount++;
    }
    if (assigned_to !== undefined) {
        updateFields.push(`assigned_to = $${paramCount}`);
        params.push(assigned_to);
        paramCount++;
    }
    if (priority !== undefined) {
        updateFields.push(`priority = $${paramCount}`);
        params.push(priority);
        paramCount++;
    }
    if (due_date !== undefined) {
        updateFields.push(`due_date = $${paramCount}`);
        params.push(due_date);
        paramCount++;
    }

    if (updateFields.length === 0) {
        return null;
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(taskId);

    const query = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = $${paramCount} AND deleted_at IS NULL RETURNING *`;
    const result = await pool.query(query, params);
    return result.rows[0] || null;
}

async function updateTaskStatus(taskId, status, completedAt) {
    let query = `UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP`;
    const params = [status];
    let paramCount = 2;

    if (status === 'completed') {
        query += `, completed_at = $${paramCount}`;
        params.push(completedAt || new Date());
        paramCount++;
    } else {
        query += `, completed_at = NULL`;
    }

    query += ` WHERE id = $${paramCount} AND deleted_at IS NULL RETURNING *`;
    params.push(taskId);

    const result = await pool.query(query, params);
    return result.rows[0] || null;
}

async function deleteTask(taskId) {
    const result = await pool.query(
        `UPDATE tasks SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
        [taskId]
    );
    return result.rows[0] || null;
}

async function canManagerAccessTask(managerId, taskId) {
    const result = await pool.query(
        `SELECT t.id FROM tasks t
         JOIN employees e ON t.assigned_to = e.id
         WHERE t.id = $1 AND t.deleted_at IS NULL 
         AND (e."reportingManagerId" = $2 OR t.assigned_by = $2)`,
        [taskId, managerId]
    );
    return result.rows.length > 0;
}

module.exports = {
    getEmployeeByUserId,
    getEmployeeById,
    getTaskById,
    getTasksByEmployee,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    canManagerAccessTask
};