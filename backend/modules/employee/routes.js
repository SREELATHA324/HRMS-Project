const express = require('express');
const router = express.Router();
const auth = require('../authentication/middleware/auth');
const roleCheck = require('../authentication/middleware/roleCheck');
const validateEmployee = require('./middleware/employeeValidation');

const createEmployee = require('./controllers/create');
const getAllEmployees = require('./controllers/getAll');
const getEmployeeById = require('./controllers/getById');
const updateEmployee = require('./controllers/update');
const deleteEmployee = require('./controllers/delete');
const getDepartments = require('./controllers/getDepartments');
const getDesignations = require('./controllers/getDesignations');

router.use(auth);

router.get('/', roleCheck('admin', 'hr'), getAllEmployees);
router.get('/departments', roleCheck('admin', 'hr'), getDepartments);
router.get('/designations', roleCheck('admin', 'hr'), getDesignations);
router.get('/:id', roleCheck('admin', 'hr'), getEmployeeById);
router.post('/', roleCheck('admin', 'hr'), validateEmployee, createEmployee);
router.put('/:id', roleCheck('admin', 'hr'), validateEmployee, updateEmployee);
router.delete('/:id', roleCheck('admin'), deleteEmployee);

module.exports = router;