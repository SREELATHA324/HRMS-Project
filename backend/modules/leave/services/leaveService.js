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

async function getLeaveBalance(employeeId, leaveTypeId, year) {
    const result = await pool.query(
        'SELECT * FROM leave_balances WHERE employee_id = $1 AND leave_type_id = $2 AND year = $3',
        [employeeId, leaveTypeId, year]
    );
    return result.rows[0] || null;
}

async function updateLeaveBalance(employeeId, leaveTypeId, year, usedDays) {
    await pool.query(
        `UPDATE leave_balances SET 
            used_balance = used_balance + $1,
            closing_balance = closing_balance - $1,
            updated_at = CURRENT_TIMESTAMP
         WHERE employee_id = $2 AND leave_type_id = $3 AND year = $4`,
        [usedDays, employeeId, leaveTypeId, year]
    );
}

module.exports = {
    getEmployeeByUserId,
    getEmployeeById,
    getLeaveBalance,
    updateLeaveBalance
};