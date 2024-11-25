const User = require('../models/User');

// Query: Employees in IT department with location starting with 'A'
exports.getITEmployeesByLocation = async (req, res) => {
  try {
    const employees = await User.find({
      role: 'Employee',
      departmentID: { $exists: true },
    })
      .populate({
        path: 'departmentID',
        match: { departmentName: 'IT', location: /^A/i },
        select: 'departmentName location',
      })
      .select('firstName lastName');

    res.json(employees.filter((e) => e.departmentID !== null));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Query: Employees in Sales department sorted by name descending
exports.getSalesEmployeesSorted = async (req, res) => {
  try {
    const employees = await User.find({
      role: 'Employee',
      departmentID: { $exists: true },
    })
      .populate({
        path: 'departmentID',
        match: { departmentName: 'Sales' },
        select: 'departmentName',
      })
      .select('firstName lastName')
      .sort({ lastName: -1 });

    res.json(employees.filter((e) => e.departmentID !== null));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
