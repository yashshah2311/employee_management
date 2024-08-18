const Employee = require('../models/Employee');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees: ' + error.message });
  }
};

// Get single employee by ID
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee: ' + error.message });
  }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  const { name, email, phone, address, companyName, companyAddress, experience, department, joiningDate } = req.body;

  try {
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    const employee = new Employee({
      name,
      email,
      phone,
      address,
      companyName,
      companyAddress,
      experience,
      department,
      joiningDate
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee: ' + error.message });
  }
};

// Update an existing employee
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, companyName, companyAddress, experience, department, joiningDate } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.phone = phone || employee.phone;
    employee.address = address || employee.address;
    employee.companyName = companyName || employee.companyName;
    employee.companyAddress = companyAddress || employee.companyAddress;
    employee.experience = experience || employee.experience;
    employee.department = department || employee.department;
    employee.joiningDate = joiningDate || employee.joiningDate;

    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee: ' + error.message });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.remove();
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee: ' + error.message });
  }
};