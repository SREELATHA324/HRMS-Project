const {
    getEmployeeByUserId,
    getTaskById,
    deleteTask,
    canManagerAccessTask
} = require('../services/taskService');

async function deleteTaskController(req, res) {
    const { id } = req.params;

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
                message: 'Employees cannot delete tasks'
            });
        }

        if (role === 'manager') {
            const hasAccess = await canManagerAccessTask(loggedInEmployee.id, id);
            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only delete tasks for your team'
                });
            }
        }

        const deletedTask = await deleteTask(id);
        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or already deleted'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });

    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = deleteTaskController;