const pool = require('../../../db');

async function getLeaveBalance(req, res) {
    const employeeId = req.params.employeeId || req.user.employeeId;
    const year = req.query.year || new Date().getFullYear();

    try {
        const result = await pool.query(
            `SELECT 
                lt.id as leave_type_id,
                lt.name as leave_type_name,
                lt.code as leave_type_code,
                lt.color,
                COALESCE(lb.opening_balance, 0) as opening_balance,
                COALESCE(lb.earned_balance, 0) as earned_balance,
                COALESCE(lb.used_balance, 0) as used_balance,
                COALESCE(lb.closing_balance, 0) as closing_balance
             FROM leave_types lt
             LEFT JOIN leave_balances lb ON lt.id = lb.leave_type_id AND lb.employee_id = $1 AND lb.year = $2
             WHERE lt.is_active = true
             ORDER BY lt.name`,
            [employeeId, year]
        );

        const totalLeaves = result.rows.reduce((sum, r) => sum + parseFloat(r.closing_balance || 0), 0);
        const usedLeaves = result.rows.reduce((sum, r) => sum + parseFloat(r.used_balance || 0), 0);

        res.status(200).json({
            success: true,
            data: {
                leaveTypes: result.rows,
                totalAvailable: totalLeaves,
                totalUsed: usedLeaves,
                year: parseInt(year)
            }
        });
    } catch (error) {
        console.error('Get leave balance error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    getLeaveBalance
};