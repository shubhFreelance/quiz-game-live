import express from 'express';
import { body } from 'express-validator';
import { startSession, endSession } from '../controllers/sessionController.js';
import{ validate} from '../utils/validate.js';
import auth from '../middleware/auth.js';
import { getSessionTotalCollection } from '../controllers/sessionController.js';
import {getBetsByNumberForSession} from '../controllers/sessionController.js';
import {getBetsByNumberInSession} from '../controllers/sessionController.js';

const router = express.Router();

// Start a new session
router.post(
  '/start',
  auth(['superadmin']),
  validate([
    body('sessionNumber')
      .isInt({ min: 1, max: 3 })
      .withMessage('Session number must be between 1 and 3'),
  ]),
  startSession
);

// End a session and announce result
router.post(
  '/end',
  auth(['superadmin']),
  validate([
    body('sessionId').notEmpty().withMessage('Session ID is required'),
    body('result')
      .notEmpty()
      .withMessage('Result is required')
      .isIn(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'J', 'Q', 'K', 'Joker'])
      .withMessage('Invalid result'),
  ]),
  endSession
);

router.get('/:sessionId/total', getSessionTotalCollection);

router.get('/:sessionId/bets', getBetsByNumberForSession);
router.get('/:sessionId/number/:numberOrAlphabet', getBetsByNumberInSession);

export default router;

//67d2d8d4b10ed540b158c0a7
//Agent:67d2c7e29703cfeb5c1e4fb2
//SessionId: 67d7c5e5391cd48c285e3c36