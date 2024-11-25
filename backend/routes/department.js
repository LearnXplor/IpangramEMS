const express = require('express');
const Department = require('../models/Department');
const User = require('../models/User'); 
const auth = require('../middleware/auth');
const { createDepartment, getDepartments, assignEmployee, updateDepartment, deleteDepartment, getDepartmentsById } = require('../controllers/departmentController');

const router = express.Router();

router.post('/', auth, createDepartment);

router.get('/',auth, getDepartments);
router.get('/:id',auth, getDepartmentsById);


// Update a department by ID
router.put('/:id', auth, updateDepartment);

// Delete a department by ID
router.delete('/:id', auth, deleteDepartment);

// Assign employees to a department (Manager-only)
router.put('/:id/assign', auth, assignEmployee);



module.exports = router;
