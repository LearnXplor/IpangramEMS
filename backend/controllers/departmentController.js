const Department = require('../models/Department');
const { validateSalary } = require('../utils/validate');



const getDepartments = async (req, res) => {
   const { page = 1, limit = 100 } = req.query;
   try {
      const departments = await Department.find()
         .populate('assignedEmployees', 'firstName lastName')
         .limit(limit * 1)
         .skip((page - 1) * limit);
      
      const count = await Department.countDocuments();

      const departmentsWithAlias = departments.map(department => {
         const { assignedEmployees, ...departmentData } = department.toObject();
         return {
            ...departmentData,
            employees: assignedEmployees
         };
      });

      res.json({
         departments: departmentsWithAlias,
         totalPages: Math.ceil(count / limit),
         currentPage: page
      });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};


const getDepartmentsById = async (req, res) => {
   const { page = 1, limit = 5 } = req.query;
   const { id } = req.params;

   try {
      const departments = await Department.findById({_id:id})
         .populate('assignedEmployees', 'firstName lastName')
         .limit(limit * 1)
         .skip((page - 1) * limit);
      const count = await Department.countDocuments();
      res.json({ departments, totalPages: Math.ceil(count / limit), currentPage: page });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};


const createDepartment = async (req, res) => {
   if (req.role !== 'Manager') return res.status(403).json({ message: 'Access denied.' });
   const { departmentName, categoryName, location, salary } = req.body;

   // Validate salary
   if (!validateSalary(salary)) {
      return res.status(400).json({ message: 'Salary must be a positive number!' });
   }

   try {
      const newDepartment = await Department.create({ departmentName, categoryName, location, salary:Number(salary) });
      res.status(201).json(newDepartment);
   } catch (error) {
      res.status(500).json({ message: 'Failed to create department.', error });
   }
}

const assignEmployee = async (req, res) => {
   if (req.role !== 'Manager') return res.status(403).json({ message: 'Access denied.' });

   const { id } = req.params;
   const { employeeIds } = req.body;

   try {
      const updatedDepartment = await Department.findByIdAndUpdate(
         id,
         { $addToSet: { assignedEmployees: { $each: employeeIds } } },
         { new: true }
      ).populate('assignedEmployees', 'firstName lastName email');

      res.status(200).json(updatedDepartment);
   } catch (error) {
      res.status(500).json({ message: 'Failed to assign employees.', error });
   }
}



const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { departmentName, categoryName, location, salary, employeeIDs } = req.body;

  try {
    if (salary && !validateSalary(salary)) {
      return res.status(400).json({ message: 'Salary must be a positive number!' });
    }

    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found!' });
    }

    // Update department fields
    if (departmentName) department.departmentName = departmentName;
    if (categoryName) department.categoryName = categoryName;
    if (location) department.location = location;
    if (salary) department.salary = salary;

    // Assign employees to the department
    if (employeeIDs && Array.isArray(employeeIDs)) {
      const employees = await User.find({ _id: { $in: employeeIDs }, role: 'Employee' });
      if (employees.length !== employeeIDs.length) {
        return res
          .status(400)
          .json({ message: 'Some employee IDs are invalid or do not exist.' });
      }

      // Update employee department assignments
      await User.updateMany(
        { _id: { $in: employeeIDs } },
        { $set: { departmentID: department._id } }
      );

      department.assignedEmployees = employeeIDs; 
    }

    // Save the updated department
    await department.save();

    res.status(200).json({ message: 'Department updated successfully!', department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
   const { id } = req.params; 
   
   try {
     const department = await Department.findByIdAndDelete({_id:id});
     if (!department) {
       return res.status(404).json({ message: 'Department not found!' });
     }
     res.status(200).json({ message: 'Department deleted!', department });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 };



module.exports = {
   getDepartments,
   createDepartment,
   assignEmployee,
   updateDepartment,
   deleteDepartment,
   getDepartmentsById
}