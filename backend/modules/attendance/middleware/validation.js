function validateShift(req, res, next) {
    const { name, start_time, end_time } = req.body;
    const errors = [];

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

    if (!name) errors.push('Shift name is required');
    if (!start_time) errors.push('Start time is required');
    if (!end_time) errors.push('End time is required');

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
    if (start_time && !timeRegex.test(start_time)) {
        errors.push('Start time must be in HH:MM or HH:MM:SS format');
    }
    if (end_time && !timeRegex.test(end_time)) {
        errors.push('End time must be in HH:MM or HH:MM:SS format');
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

function validateShiftAssign(req, res, next) {
    const { employee_id, shift_id, effective_from } = req.body;
    const errors = [];

    if (!employee_id) errors.push('Employee ID is required');
    if (!shift_id) errors.push('Shift ID is required');
    if (!effective_from) errors.push('Effective from date is required');

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (effective_from && !dateRegex.test(effective_from)) {
        errors.push('Effective from must be in YYYY-MM-DD format');
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

function validateRule(req, res, next) {
    const { grace_period_minutes, late_threshold_minutes, early_checkout_threshold_minutes, half_day_hours, full_day_hours, overtime_threshold_hours } = req.body;
    const errors = [];

    if (grace_period_minutes !== undefined && (isNaN(grace_period_minutes) || grace_period_minutes < 0)) {
        errors.push('Grace period minutes must be a non-negative number');
    }
    if (late_threshold_minutes !== undefined && (isNaN(late_threshold_minutes) || late_threshold_minutes < 0)) {
        errors.push('Late threshold minutes must be a non-negative number');
    }
    if (early_checkout_threshold_minutes !== undefined && (isNaN(early_checkout_threshold_minutes) || early_checkout_threshold_minutes < 0)) {
        errors.push('Early checkout threshold minutes must be a non-negative number');
    }
    if (half_day_hours !== undefined && (isNaN(half_day_hours) || half_day_hours < 0)) {
        errors.push('Half day hours must be a non-negative number');
    }
    if (full_day_hours !== undefined && (isNaN(full_day_hours) || full_day_hours < 0)) {
        errors.push('Full day hours must be a non-negative number');
    }
    if (overtime_threshold_hours !== undefined && (isNaN(overtime_threshold_hours) || overtime_threshold_hours < 0)) {
        errors.push('Overtime threshold hours must be a non-negative number');
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

function validateCorrection(req, res, next) {
    const { reason, requested_check_in, requested_check_out } = req.body;
    const errors = [];

    if (!reason) {
        errors.push('Reason is required');
    }

    if (requested_check_in && isNaN(Date.parse(requested_check_in))) {
        errors.push('Requested check-in must be a valid ISO date-time string');
    }
    if (requested_check_out && isNaN(Date.parse(requested_check_out))) {
        errors.push('Requested check-out must be a valid ISO date-time string');
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

function validateOvertime(req, res, next) {
    const { overtime_hours } = req.body;
    const errors = [];

    if (req.method === 'POST') {
        const { attendance_id, overtime_date } = req.body;
        if (!attendance_id) errors.push('Attendance ID is required');
        if (!overtime_date) errors.push('Overtime date is required');
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (overtime_date && !dateRegex.test(overtime_date)) {
            errors.push('Overtime date must be in YYYY-MM-DD format');
        }
    }

    if (overtime_hours !== undefined && (isNaN(overtime_hours) || overtime_hours <= 0)) {
        errors.push('Overtime hours must be a positive number');
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
    validateShift,
    validateShiftAssign,
    validateRule,
    validateCorrection,
    validateOvertime
};
