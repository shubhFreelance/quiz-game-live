// import express from 'express';
// import { register, login } from '../controllers/authController.js';

// const router = express.Router();

// // Register route
// router.post('/register', register);

// // Login route
// router.post('/login', login);

// export default router;

import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Register route with inline validation
router.post(
  '/register',
  [
    // Validate username
    body('username')
      .notEmpty()
      .withMessage('Username is required')
      .trim()
      .escape(),

    // Validate password
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .trim()
      .escape(),

    // Validate role
    body('role')
      .notEmpty()
      .withMessage('Role is required')
      .isIn(['superadmin', 'manager', 'agent'])
      .withMessage('Role must be either "superadmin", "manager", or "agent"')
      .trim()
      .escape(),
  ],
  async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    // If no errors, proceed to the register controller
    register(req, res, next);
  }
);

// Login route with inline validation
router.post(
  '/login',
  [
    // Validate username
    body('username')
      .notEmpty()
      .withMessage('Username is required')
      .trim()
      .escape(),

    // Validate password
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .trim()
      .escape(),
  ],
  async (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    // If no errors, proceed to the login controller
    login(req, res, next);
  }
);

export default router;