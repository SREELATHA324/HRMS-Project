module.exports = function(...allowedRoles) {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role;

            if (!userRole) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: No role found'
                });
            }

            const normalizedRoles = allowedRoles.map(r => r.toLowerCase());
            if (!normalizedRoles.includes(userRole.toLowerCase())) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: Insufficient permissions'
                });
            }

            next();
        } catch (error) {
            console.error('Role check error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };
};