const express = require('express');

const { createUser, login, getAllUsers, getUserProfile, getEmployees } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Register a new user
router.post('/signup', createUser);

// Login a user
router.post('/login', login);


// dev use all users
router.get('/users', getAllUsers);
router.get('/profile', auth, getUserProfile);
router.get('/employees', auth, getEmployees);

 
module.exports = router;
