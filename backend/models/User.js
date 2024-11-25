const mongoose = require('mongoose');




const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  hobbies: { type: [String], required: true },
  role: { type: String, enum: ['Employee', 'Manager'], required: true },
  departmentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;