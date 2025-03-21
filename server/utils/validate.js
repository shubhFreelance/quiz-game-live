import { body, validationResult } from 'express-validator';

/**
 * Validation rules for user registration.
 * @returns {Array} - Array of validation rules.
 */
export const registerValidationRules = [
  // Validate username
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim() // Remove leading/trailing whitespace
    .escape(), // Sanitize input to prevent XSS attacks

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
];

/**
 * Validation rules for user login.
 * @returns {Array} - Array of validation rules.
 */
export const loginValidationRules = [
  // Validate username
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .trim() // Remove leading/trailing whitespace
    .escape(), // Sanitize input to prevent XSS attacks

  // Validate password
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .trim()
    .escape(),
];

/**
 * Middleware to validate request data using express-validator.
 * @param {Array} validations - Array of validation rules.
 * @returns {Function} - Express middleware function.
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validation rules
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next(); // No errors, proceed to the next middleware/controller
    }

    // Return validation errors
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(), // Array of validation errors
    });
  };
};