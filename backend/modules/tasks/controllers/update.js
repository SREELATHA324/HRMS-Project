const {
    getEmployeeByUserId,
    getTaskById,
    updateTask,
    canManagerAccessTask
} = require('../services/taskService');

async function updateTaskController(req, res) {
    const { id } = req.params;
    const { title, description, assigned_to, priority, due_date } = req.body;

    try {
        const loggedInEmployee = await getEmployeeByUserId(req.user.id);
        if (!loggedInEmployee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const task = await getTaskById(id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const role = req.user.role ? req.user.role.toLowerCase() : '';

        if (role === 'employee') {
            return res.status(403).json({
                success: false,
                message: 'Employees cannot update tasks'
            });
        }

        if (role === 'manager') {
            const hasAccess = await canManagerAccessTask(loggedInEmployee.id, id);
            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only update tasks for your team'
                });
            }
        }

        const updatedTask = await updateTask(id, {
            title,
            description,
            assigned_to,
            priority,
            due_date
        });

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or already deleted'
            });
        }

        const taskWithDetails = await getTaskById(id);

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: taskWithDetails
        });

    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = updateTaskController;