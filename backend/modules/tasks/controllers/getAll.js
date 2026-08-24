const {
    getEmployeeByUserId,
    getTasksByEmployee
} = require('../services/taskService');

async function getAllTasks(req, res) {
    try {
        const loggedInEmployee = await getEmployeeByUserId(req.user.id);
        if (!loggedInEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const role = req.user.role ? req.user.role.toLowerCase() : '';

        let tasks = [];

        if (role === 'admin' || role === 'hr') {
            const result = await require('../../../db').query(
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
                 WHERE t.deleted_at IS NULL
                 ORDER BY t.created_at DESC`
            );
            tasks = result.rows;
        } else {
            tasks = await getTasksByEmployee(loggedInEmployee.id, role, loggedInEmployee.id);
        }

        res.status(200).json({
            success: true,
            data: tasks,
            count: tasks.length
        });

    } catch (error) {
        console.error('Get all tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = getAllTasks;