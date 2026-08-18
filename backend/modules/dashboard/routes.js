const express = require('express');
const router = express.Router();
const auth = require('../authentication/middleware/auth');
const roleCheck = require('../authentication/middleware/roleCheck');

const adminDashboard = require('./controllers/admin');
const employeeDashboard = require('./controllers/employee');
const managerDashboard = require('./controllers/manager');

router.get('/admin', auth, roleCheck('admin'), adminDashboard);
router.get('/manager', auth, roleCheck('manager', 'hr'), managerDashboard);
router.get('/employee', auth, employeeDashboard);

module.exports = router;