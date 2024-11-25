const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const { validatePassword, validateEmail } = require('../utils/validate');


const createUser = async (req, res) => {

   const { firstName, lastName, email, password, gender, hobbies, role } = req.body;

   if (!validateEmail(email)) {
     return res.status(400).json({ message: 'Invalid email format!' });
   }
 
   if (!validatePassword(password)) {
     return res.status(400).json({
       message:
         'Password must be 8-20 characters long, include at least one letter and one number.',
     });
   }
 
   try {
     const hashedPassword = await bcrypt.hash(password, 10);
     const newUser = await User.create({
      firstName,
      lastName,
      gender,
      hobbies,
      email,
      password: hashedPassword,
      role,
   });

   res.status(201).json({ message: 'User registered successfully!', userId: newUser._id });
   } catch (error) {
     res.status(500).json({ message: 'Something went wrong.', error });
   }
 }

 const login = async (req, res) => {
    const { email, password } = req.body;
 
    try {
       const user = await User.findOne({ email });
       if (!user) return res.status(404).json({ message: 'User not found.' });
 
       const isPasswordCorrect = await bcrypt.compare(password, user.password);
       if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials.' });
 
       // Generate a token
       const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '6h' });
 
       res.status(200).json({ message: 'Login successful!', token, role: user.role });
    } catch (error) {
       res.status(500).json({ message: 'Something went wrong.', error });
    }
 }

 const getAllUsers = async (req, res) => {

   try {
      // Check if the user exists
      const users = await User.find();
      if (!users) return res.status(404).json({ message: 'User not found.' })

      res.status(200).json({ users, message:'all users'});
   } catch (error) {
      res.status(500).json({ message: 'Something went wrong.', error });
   }
}

const getEmployees = async (req, res) => {
  try {
    const users = await User.find({ role: 'Employee' });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No employees found.' });
    }

    res.status(200).json({ users, message: 'All employees retrieved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error });
  }
};


// Get user profile
const getUserProfile = async (req, res) => {
   try {
     const userId = req.userId; 
 
     const user = await User.findById(userId).select('-password');
 
     if (!user) {
       return res.status(404).json({ message: 'User not found' });
     }
 
     res.status(200).json(user);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 };

module.exports = {
    createUser, login, getAllUsers, getUserProfile, getEmployees
 }



