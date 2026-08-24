function validateTask(req, res, next) {
    const { title, assigned_to, priority, due_date } = req.body;
    const errors = [];

    if (!title || title.trim().length === 0) {
        errors.push('Title is required');
    }
    if (title && title.trim().length < 3) {
        errors.push('Title must be at least 3 characters');
    }
    if (!assigned_to) {
        errors.push('Assigned employee is required');
    }
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
        errors.push('Priority must be low, medium, or high');
    }
    if (due_date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(due_date)) {
            errors.push('Due date must be in YYYY-MM-DD format');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    next();
}

function validateTaskStatus(req, res, next) {
    const { status } = req.body;
    const errors = [];

    if (!status) {
        errors.push('Status is required');
    } else if (!['pending', 'in_progress', 'completed'].includes(status)) {
        errors.push('Status must be pending, in_progress, or completed');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    next();
}

module.exports = {
    validateTask,
    validateTaskStatus
};