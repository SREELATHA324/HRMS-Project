const pool = require('../../../db');
const { getEmployeeByUserId } = require('../../attendance/services/attendanceService');

async function getLeaveBalance(req, res) {
    let client;

    try {
        // =====================================================
        // 1. GET ACTUAL EMPLOYEE ID
        // req.user.id is the users table ID.
        // We need the employees table ID for leave_balances.
        // =====================================================

        let employeeId;

        if (req.params.employeeId) {
            // For Admin / HR / Manager viewing a specific employee
            employeeId = req.params.employeeId;
        } else {
            // For logged-in employee
            const employee = await getEmployeeByUserId(req.user.id);

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Employee not found for the logged-in user'
                });
            }

            employeeId = employee.id;
        }

        const year = req.query.year || new Date().getFullYear();

        console.log('Leave Balance User ID:', req.user.id);
        console.log('Leave Balance Employee ID:', employeeId);

        // =====================================================
        // 2. GET DATABASE CONNECTION
        // =====================================================

        client = await pool.connect();

        await client.query('BEGIN');

        // =====================================================
        // 3. GET ALL ACTIVE LEAVE TYPES
        // =====================================================

        const leaveTypesResult = await client.query(`
            SELECT
                id,
                max_days_per_year
            FROM leave_types
            WHERE is_active = true
            ORDER BY name
        `);

        // =====================================================
        // 4. INITIALIZE LEAVE BALANCES
        // Creates records only if they do not already exist.
        // =====================================================

        for (const leaveType of leaveTypesResult.rows) {
            const maxDays =
                parseFloat(leaveType.max_days_per_year) || 0;

            await client.query(
                `
                INSERT INTO leave_balances (
                    employee_id,
                    leave_type_id,
                    year,
                    opening_balance,
                    earned_balance,
                    used_balance,
                    closing_balance
                )
                VALUES ($1, $2, $3, $4, 0, 0, $4)

                ON CONFLICT (
                    employee_id,
                    leave_type_id,
                    year
                )
                DO NOTHING
                `,
                [
                    employeeId,
                    leaveType.id,
                    year,
                    maxDays
                ]
            );
        }

        // =====================================================
        // 5. GET EMPLOYEE LEAVE BALANCES
        // =====================================================

        const result = await client.query(
            `
            SELECT
                lt.id AS leave_type_id,
                lt.name AS leave_type_name,
                lt.code AS leave_type_code,
                lt.color,

                COALESCE(lb.opening_balance, 0)
                    AS opening_balance,

                COALESCE(lb.earned_balance, 0)
                    AS earned_balance,

                COALESCE(lb.used_balance, 0)
                    AS used_balance,

                COALESCE(lb.closing_balance, 0)
                    AS closing_balance

            FROM leave_types lt

            LEFT JOIN leave_balances lb
                ON lt.id = lb.leave_type_id
                AND lb.employee_id = $1
                AND lb.year = $2

            WHERE lt.is_active = true

            ORDER BY lt.name
            `,
            [employeeId, year]
        );

        // =====================================================
        // 6. CALCULATE TOTALS
        // =====================================================

        const totalAvailable = result.rows.reduce(
            (sum, row) =>
                sum + parseFloat(row.closing_balance || 0),
            0
        );

        const totalUsed = result.rows.reduce(
            (sum, row) =>
                sum + parseFloat(row.used_balance || 0),
            0
        );

        await client.query('COMMIT');

        // =====================================================
        // 7. SEND RESPONSE
        // =====================================================

        return res.status(200).json({
            success: true,
            data: {
                leaveTypes: result.rows,
                totalAvailable,
                totalUsed,
                year: parseInt(year)
            }
        });

    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }

        console.error('Get leave balance error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });

    } finally {
        if (client) {
            client.release();
        }
    }
}

module.exports = {
    getLeaveBalance
};