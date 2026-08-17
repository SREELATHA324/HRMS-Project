const pool = require('../../../db');

async function getEmployeeByUserId(userId) {
    const result = await pool.query(
        'SELECT * FROM employees WHERE "userId" = $1 AND deleted_at IS NULL',
        [userId]
    );
    return result.rows[0] || null;
}

async function getEmployeeById(employeeId) {
    const result = await pool.query(
        'SELECT * FROM employees WHERE id = $1 AND deleted_at IS NULL',
        [employeeId]
    );
    return result.rows[0] || null;
}

async function getAssignedShift(employeeId, dateStr) {
    const result = await pool.query(
        `SELECT s.* FROM employee_shifts es
         JOIN shifts s ON es.shift_id = s.id
         WHERE es.employee_id = $1 
           AND es.effective_from <= $2 
           AND (es.effective_to >= $2 OR es.effective_to IS NULL)
           AND es.status = 'Active'
         LIMIT 1`,
        [employeeId, dateStr]
    );
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    const defaultShift = await pool.query(
        "SELECT * FROM shifts WHERE status = 'Active' ORDER BY id ASC LIMIT 1"
    );
    return defaultShift.rows[0] || null;
}

async function getActiveRule() {
    const result = await pool.query(
        "SELECT * FROM attendance_rules WHERE status = 'Active' LIMIT 1"
    );
    if (result.rows.length > 0) {
        return result.rows[0];
    }
    return {
        grace_period_minutes: 15,
        late_threshold_minutes: 120,
        early_checkout_threshold_minutes: 15,
        half_day_hours: 4,
        full_day_hours: 8,
        overtime_threshold_hours: 8,
        allow_overtime: true,
        allow_half_day: true
    };
}

function calculateWorkingHours(checkIn, checkOut, breakMinutes) {
    const diffMs = new Date(checkOut) - new Date(checkIn);
    const rawHours = diffMs / (1000 * 60 * 60);
    const breakHours = (breakMinutes || 0) / 60;
    return Math.max(0, parseFloat((rawHours - breakHours).toFixed(2)));
}

function calculateLateMinutes(checkIn, shiftStartTime, graceMinutes, ruleGraceMinutes) {
    const checkInTime = new Date(checkIn);
    const [shHour, shMin] = shiftStartTime.split(':').map(Number);
    
    const shiftStart = new Date(checkInTime);
    shiftStart.setHours(shHour, shMin, 0, 0);

    const diffMs = checkInTime - shiftStart;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    const graceLimit = graceMinutes !== null && graceMinutes !== undefined ? graceMinutes : (ruleGraceMinutes || 0);
    
    if (diffMins > graceLimit) {
        return {
            isLate: true,
            lateMinutes: diffMins - graceLimit
        };
    }
    return {
        isLate: false,
        lateMinutes: 0
    };
}

function calculateEarlyCheckoutMinutes(checkIn, checkOut, shiftEndTime, isOvernight, earlyThreshold) {
    const checkInTime = new Date(checkIn);
    const checkOutTime = new Date(checkOut);
    const [ehHour, ehMin] = shiftEndTime.split(':').map(Number);

    const shiftEnd = new Date(checkInTime);
    shiftEnd.setHours(ehHour, ehMin, 0, 0);
    if (isOvernight) {
        shiftEnd.setDate(shiftEnd.getDate() + 1);
    }

    const diffMs = shiftEnd - checkOutTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const threshold = earlyThreshold || 0;

    if (diffMins > threshold) {
        return {
            isEarlyCheckout: true,
            earlyCheckoutMinutes: diffMins
        };
    }
    return {
        isEarlyCheckout: false,
        earlyCheckoutMinutes: 0
    };
}

function determineStatus(workingHours, rule) {
    const fullHours = rule.full_day_hours || 8;
    const halfHours = rule.half_day_hours || 4;
    const allowHalf = rule.allow_half_day !== false;

    if (workingHours >= fullHours) {
        return {
            status: 'Present',
            isHalfDay: false
        };
    } else if (allowHalf && workingHours >= halfHours) {
        return {
            status: 'Half-Day',
            isHalfDay: true
        };
    } else {
        return {
            status: 'Absent',
            isHalfDay: false
        };
    }
}

function calculateOvertime(workingHours, rule, shift) {
    if (rule.allow_overtime === false) {
        return 0;
    }
    const threshold = rule.overtime_threshold_hours || shift.working_hours || 8;
    if (workingHours > threshold) {
        return parseFloat((workingHours - threshold).toFixed(2));
    }
    return 0;
}

module.exports = {
    getEmployeeByUserId,
    getEmployeeById,
    getAssignedShift,
    getActiveRule,
    calculateWorkingHours,
    calculateLateMinutes,
    calculateEarlyCheckoutMinutes,
    determineStatus,
    calculateOvertime
};
