const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register user
exports.register = async (req, res) => {
  const { name, email, password, role, company, dob, department, mobile, profilePicture, joiningDate } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    company,
    dob,
    department,
    mobile,
    profilePicture,
    joiningDate
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user)
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// Authenticate user and get token
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Logging in with:', email, password);
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found for email:', email);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      console.log('User found:', user);
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('hasedpass', hashedPassword)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Password mismatch');
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      console.log('Password matched, generating token...');
      const token = generateToken(user);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  

// Get user profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      dob: user.dob,
      department: user.department,
      mobile: user.mobile,
      profilePicture: user.profilePicture,
      joiningDate: user.joiningDate
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.company = req.body.company || user.company;
    user.dob = req.body.dob || user.dob;
    user.department = req.body.department || user.department;
    user.mobile = req.body.mobile || user.mobile;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    user.joiningDate = req.body.joiningDate || user.joiningDate;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser)
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};