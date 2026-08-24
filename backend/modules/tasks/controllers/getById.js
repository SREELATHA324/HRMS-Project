const {
    getEmployeeByUserId,
    getTaskById,
    canManagerAccessTask
} = require('../services/taskService');

async function getTaskByIdController(req, res) {
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
            if (task.assigned_to !== loggedInEmployee.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not authorized to view this task'
                });
            }
        } else if (role === 'manager') {
            const hasAccess = await canManagerAccessTask(loggedInEmployee.id, id);
            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not authorized to view this task'
                });
            }
        }

        res.status(200).json({
            success: true,
            data: task
        });

    } catch (error) {
        console.error('Get task by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = getTaskByIdController;