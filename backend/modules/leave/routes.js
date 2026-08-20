const express = require('express');
const router = express.Router();

const auth = require('../authentication/middleware/auth');
const roleCheck = require('../authentication/middleware/roleCheck');
const { validateLeaveRequest } = require('./middleware/validation');

const { getLeaveTypes, createLeaveType } = require('./controllers/leaveTypes');
const { getLeaveBalance } = require('./controllers/balance');
const {
    applyLeave,
    getLeaveRequests,
    getLeaveRequestById,
    approveLeave,
    rejectLeave,
    cancelLeave
} = require('./controllers/requests');


router.use(auth);


router.get('/types', getLeaveTypes);
router.post('/types', roleCheck('admin', 'hr'), createLeaveType);


router.get('/balance', getLeaveBalance);
router.get('/balance/:employeeId', roleCheck('admin', 'hr', 'manager'), getLeaveBalance);


router.post('/apply', validateLeaveRequest, applyLeave);
router.get('/requests', getLeaveRequests);
router.get('/requests/:id', getLeaveRequestById);
router.put('/requests/:id/approve', roleCheck('admin', 'hr', 'manager'), approveLeave);
router.put('/requests/:id/reject', roleCheck('admin', 'hr', 'manager'), rejectLeave);
router.put('/requests/:id/cancel', cancelLeave);

module.exports = router;