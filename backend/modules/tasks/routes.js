const express = require('express');
const router = express.Router();

const auth = require('../authentication/middleware/auth');
const roleCheck = require('../authentication/middleware/roleCheck');
const { validateTask, validateTaskStatus } = require('./middleware/validation');

const createTask = require('./controllers/create');
const getAllTasks = require('./controllers/getAll');
const getTaskById = require('./controllers/getById');
const updateTask = require('./controllers/update');
const updateTaskStatus = require('./controllers/updateStatus');
const deleteTask = require('./controllers/delete');

router.use(auth);

router.post('/', validateTask, createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.put('/:id', validateTask, updateTask);
router.put('/:id/status', validateTaskStatus, updateTaskStatus);
router.delete('/:id', deleteTask);

module.exports = router;