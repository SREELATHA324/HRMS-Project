function validateEmployee(req, res, next) {
    const {
        employeeCode, firstName, email,
        departmentId, designationId, joiningDate
    } = req.body;

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

    if (!employeeCode) errors.push('Employee code is required');
    if (!firstName) errors.push('First name is required');
    if (!email) errors.push('Email is required');
    if (!departmentId) errors.push('Department is required');
    if (!designationId) errors.push('Designation is required');
    if (!joiningDate) errors.push('Joining date is required');

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Valid email is required');
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

module.exports = validateEmployee;