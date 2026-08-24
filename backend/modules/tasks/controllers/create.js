const pool = require('../../../db');
const {
    getEmployeeByUserId,
    getEmployeeById,
    createTask
} = require('../services/taskService');

async function createTaskController(req, res) {
    const { title, description, assigned_to, priority, due_date } = req.body;

    try {
        const loggedInEmployee = await getEmployeeByUserId(req.user.id);
        if (!loggedInEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const role = req.user.role ? req.user.role.toLowerCase() : '';

        if (role === 'employee') {
            return res.status(403).json({
                success: false,
                message: 'Employees cannot create tasks'
            });
        }

        const assignedEmployee = await getEmployeeById(assigned_to);
        if (!assignedEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Assigned employee not found'
            });
        }

        if (role === 'manager') {
            if (assignedEmployee.reportingManagerId !== loggedInEmployee.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only assign tasks to employees reporting to you'
                });
            }
        }

        const task = await createTask({
            title: title.trim(),
            description: description ? description.trim() : null,
            assigned_to,
            assigned_by: loggedInEmployee.id,
            priority: priority || 'medium',
            due_date: due_date || null
        });

        const taskWithDetails = await pool.query(
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
             WHERE t.id = $1`,
            [task.id]
        );

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: taskWithDetails.rows[0]
        });

    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = createTaskController;