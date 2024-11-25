exports.validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/;
    return passwordRegex.test(password);
  };
  
  exports.validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Validates a salary: Must be a positive number
exports.validateSalary = (salary) => {
  return typeof salary === 'number' && salary > 0;
};
