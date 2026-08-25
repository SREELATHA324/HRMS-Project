const {
    getEmployeeByUserId,
    getTaskById,
    updateTaskStatus,
    canManagerAccessTask
} = require('../services/taskService');

async function updateTaskStatusController(req, res) {
    const { id } = req.params;
    const { status } = req.body;

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
            if (task.assigned_to !== loggedInEmployee.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only update status of tasks assigned to you'
                });
            }
        } else if (role === 'manager') {
            const hasAccess = await canManagerAccessTask(loggedInEmployee.id, id);
            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only update status of tasks for your team'
                });
            }
        }

        const completedAt = status === 'completed' ? new Date() : null;
        const updatedTask = await updateTaskStatus(id, status, completedAt);

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or already deleted'
            });
        }

        const taskWithDetails = await getTaskById(id);

        res.status(200).json({
            success: true,
            message: `Task status updated to ${status}`,
            data: taskWithDetails
        });

    } catch (error) {
        console.error('Update task status error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = updateTaskStatusController;