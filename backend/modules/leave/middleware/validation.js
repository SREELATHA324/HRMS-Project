function validateLeaveRequest(req, res, next) {
    const { leave_type_id, start_date, end_date, total_days, reason } = req.body;

    if (req.method === 'PUT') {
        const hasUpdates = Object.keys(req.body).length > 0;
        if (!hasUpdates) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        return next();
    }

    const errors = [];

    if (!leave_type_id) errors.push('Leave type is required');
    if (!start_date) errors.push('Start date is required');
    if (!end_date) errors.push('End date is required');
    if (!total_days || total_days <= 0) errors.push('Total days must be greater than 0');
    if (!reason) errors.push('Reason is required');

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (start_date && !dateRegex.test(start_date)) {
        errors.push('Start date must be in YYYY-MM-DD format');
    }
    if (end_date && !dateRegex.test(end_date)) {
        errors.push('End date must be in YYYY-MM-DD format');
    }

    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
        errors.push('Start date must be before end date');
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
    validateLeaveRequest
};