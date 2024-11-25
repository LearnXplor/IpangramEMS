const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema(
   {
      departmentName: {
         type: String,
         required: true,
      },
      categoryName: {
         type: String,
         required: true,
      },
      location: {
         type: String,
         required: true,
      },
      salary: {
         type: Number,
         required: true,
      },
      assignedEmployees: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
         }
      ],

   },
   { timestamps: true }
);

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;

