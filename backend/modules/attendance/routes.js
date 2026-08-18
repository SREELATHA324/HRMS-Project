const express = require('express');
const router = express.Router();

const auth = require('../authentication/middleware/auth');
const roleCheck = require('../authentication/middleware/roleCheck');

const {
    validateShift,
    validateShiftAssign,
    validateRule,
    validateCorrection,
    validateOvertime
} = require('./middleware/validation');

const checkIn = require('./controllers/checkIn');
const checkOut = require('./controllers/checkOut');
const getHistory = require('./controllers/history');
const getDailyAttendance = require('./controllers/daily');
const getMonthlyAttendance = require('./controllers/monthly');
const { submitOvertime, getOvertime, reviewOvertime } = require('./controllers/overtime');
const { requestCorrection, getCorrections, reviewCorrection } = require('./controllers/correction');
const {
    createShift,
    getShifts,
    getShiftById,
    updateShift,
    deleteShift,
    assignShift,
    getEmployeeShifts,
    updateEmployeeShift
} = require('./controllers/shift');
const { getRules, updateRules } = require('./controllers/rule');
const getCalendar = require('./controllers/calendar');
const { getDailyReport, getMonthlyReport, getEmployeeReport } = require('./controllers/report');

router.use(auth);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);

router.get('/history', getHistory);
router.get('/daily', getDailyAttendance);
router.get('/monthly', getMonthlyAttendance);
router.get('/calendar', getCalendar);

router.get('/overtime', getOvertime);
router.post('/overtime', validateOvertime, submitOvertime);
router.put('/overtime/:id', roleCheck('admin', 'hr', 'manager'), validateOvertime, reviewOvertime);

router.post('/correction', validateCorrection, requestCorrection);
router.get('/corrections', getCorrections);
router.put('/correction/:id', roleCheck('admin', 'hr', 'manager'), validateCorrection, reviewCorrection);

router.post('/shifts', roleCheck('admin', 'hr'), validateShift, createShift);
router.get('/shifts', getShifts);
router.get('/shifts/:id', getShiftById);
router.put('/shifts/:id', roleCheck('admin', 'hr'), validateShift, updateShift);
router.delete('/shifts/:id', roleCheck('admin'), deleteShift);

router.post('/shifts/assign', roleCheck('admin', 'hr'), validateShiftAssign, assignShift);
router.get('/shifts/employee/:employeeId', getEmployeeShifts);
router.put('/shifts/employee/:employeeId', roleCheck('admin', 'hr'), updateEmployeeShift);

router.get('/rules', getRules);
router.put('/rules', roleCheck('admin', 'hr'), validateRule, updateRules);

router.get('/reports/daily', roleCheck('admin', 'hr', 'manager'), getDailyReport);
router.get('/reports/monthly', roleCheck('admin', 'hr', 'manager'), getMonthlyReport);
router.get('/reports/employee/:employeeId', getEmployeeReport);

module.exports = router;
