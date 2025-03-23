import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Custom validation function
const validateRegistration = (username, password, role) => {
  const errors = [];

  if (!username || username.trim() === '') {
    errors.push('Username is required');
  }

  if (!password || password.trim() === '') {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!role || !['superadmin', 'manager', 'agent'].includes(role)) {
    errors.push('Role must be either "superadmin", "manager", or "agent"');
  }

  return errors;
};

// Register a new user
export const register = async (req, res) => {
  const { username, password, role } = req.body;

  // Validate input
  const errors = validateRegistration(username, password, role);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Set the token in a cookie
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Custom validation function for login
const validateLogin = (username, password) => {
  const errors = [];

  if (!username || username.trim() === '') {
    errors.push('Username is required');
  }

  if (!password || password.trim() === '') {
    errors.push('Password is required');
  }

  return errors;
};

// Login a user
export const login = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  const errors = validateLogin(username, password);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Set the token in a cookie
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Return the token, userId, and userRole in the response
    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id,
      userRole: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//logout
// Logout a user
export const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


//Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    // Extract the token from the request headers
    const token = req.headers.authorization?.replace("Bearer ", "");

    // Find the user by ID (from the authenticated request)
    const user = await User.findById(req.userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the user details, token, and role
    res.status(200).json({
      userId: user._id,
      token,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};