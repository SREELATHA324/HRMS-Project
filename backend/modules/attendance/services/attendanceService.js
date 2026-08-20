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
    if (!checkIn || !checkOut) {
        return 0;
    }
    
    try {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return 0;
        }
        
        let diffMs = checkOutDate - checkInDate;
        
        if (diffMs < 0) {
            diffMs += 24 * 60 * 60 * 1000;
        }
        
        const rawHours = diffMs / (1000 * 60 * 60);
        
        let breakHours = 0;
        if (rawHours > 6) {
            breakHours = (breakMinutes || 0) / 60;
        }
        
        let result = rawHours - breakHours;
        
        if (result < 0) {
            result = 0;
        }
        
        return parseFloat(result.toFixed(2));
    } catch (error) {
        console.error('Error calculating working hours:', error);
        return 0;
    }
}

function calculateLateMinutes(checkIn, shiftStartTime, graceMinutes, ruleGraceMinutes) {
    if (!checkIn || !shiftStartTime) {
        return { isLate: false, lateMinutes: 0 };
    }
    
    try {
        const checkInDate = new Date(checkIn);
        if (isNaN(checkInDate.getTime())) {
            return { isLate: false, lateMinutes: 0 };
        }
        
        const [shHour, shMin] = shiftStartTime.split(':').map(Number);
        if (isNaN(shHour) || isNaN(shMin)) {
            return { isLate: false, lateMinutes: 0 };
        }
        
        const shiftStart = new Date(checkInDate);
        shiftStart.setHours(shHour, shMin, 0, 0);
        
        const diffMs = checkInDate - shiftStart;
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
    } catch (error) {
        console.error('Error calculating late minutes:', error);
        return { isLate: false, lateMinutes: 0 };
    }
}

function calculateEarlyCheckoutMinutes(checkIn, checkOut, shiftEndTime, isOvernight, earlyThreshold) {
    if (!checkIn || !checkOut || !shiftEndTime) {
        return { isEarlyCheckout: false, earlyCheckoutMinutes: 0 };
    }
    
    try {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return { isEarlyCheckout: false, earlyCheckoutMinutes: 0 };
        }
        
        const [ehHour, ehMin] = shiftEndTime.split(':').map(Number);
        if (isNaN(ehHour) || isNaN(ehMin)) {
            return { isEarlyCheckout: false, earlyCheckoutMinutes: 0 };
        }
        
        const shiftEnd = new Date(checkInDate);
        shiftEnd.setHours(ehHour, ehMin, 0, 0);
        
        if (isOvernight) {
            shiftEnd.setDate(shiftEnd.getDate() + 1);
        }
        
        const diffMs = shiftEnd - checkOutDate;
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
    } catch (error) {
        console.error('Error calculating early checkout minutes:', error);
        return { isEarlyCheckout: false, earlyCheckoutMinutes: 0 };
    }
}

function determineStatus(workingHours, rule) {
    const fullHours = rule?.full_day_hours || 8;
    const halfHours = rule?.half_day_hours || 4;
    const allowHalf = rule?.allow_half_day !== false;
    
    if (workingHours > 0) {
        return {
            status: 'Present',
            isHalfDay: false
        };
    }
    
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
    if (rule?.allow_overtime === false) {
        return 0;
    }
    const threshold = rule?.overtime_threshold_hours || shift?.working_hours || 8;
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