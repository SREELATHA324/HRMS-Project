const express = require('express');
const router = express.Router();
const auth = require('../authentication/middleware/auth');
const roleCheck = require('../authentication/middleware/roleCheck');
const adminDashboard = require('./controllers/admin');

router.get('/admin', auth, roleCheck('admin'), adminDashboard);

module.exports = router;