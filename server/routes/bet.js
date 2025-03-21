import express from 'express';
import { body, validationResult } from 'express-validator';
import { placeBet } from '../controllers/betController.js';

const router = express.Router();

// Place a bet with inline validation
router.post(
  '/bet',
  [
    // Validate agentId
    body('agentId')
      .notEmpty()
      .withMessage('Agent ID is required')
      .trim()
      .escape(),

    // Validate numberOrAlphabet
    body('numberOrAlphabet')
      .notEmpty()
      .withMessage('Number or Alphabet is required')
      .isIn(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'J', 'Q', 'K', 'Joker'])
      .withMessage('Invalid number or alphabet')
      .trim()
      .escape(),

    // Validate amount
    body('amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isNumeric()
      .withMessage('Amount must be a number')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be greater than 0')
      .trim()
      .escape(),

    // Validate sessionId
    body('sessionId')
      .notEmpty()
      .withMessage('Session ID is required')
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

    // If no errors, proceed to the placeBet controller
    placeBet(req, res, next);
  }
);

export default router;