import express from 'express';
import { body } from 'express-validator';
import { startSession, endSession } from '../controllers/sessionController.js';
import { validate } from '../utils/validate.js';
import auth from '../middleware/auth.js';
import {
  getSessionTotalCollection,
  getBetsByNumberForSession,
  getBetsByNumberInSession,
  getActiveSession,
  endAllSessions
} from '../controllers/sessionController.js';

const router = express.Router();

// Start a new session
router.post(
  '/start',
  auth(['superadmin']), // Only superadmin can start a session
  startSession // No validation needed for sessionNumber (it's auto-determined)
);

// End a session and announce result
router.post(
  '/end',
  auth(['superadmin']), // Only superadmin can end a session
  validate([
    body('result')
      .notEmpty()
      .withMessage('Result is required')
      .isIn(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'J', 'Q', 'K', 'Joker'])
      .withMessage('Invalid result'),
  ]),
  endSession
);

// Get total collection for a session
router.get('/:sessionId/total', getSessionTotalCollection);

// Get bets by number/alphabet for a session
router.get('/:sessionId/bets', getBetsByNumberForSession);

router.get('/active', getActiveSession);
router.post('/end-all', endAllSessions);

// Get bets by a specific number/alphabet in a session
router.get('/:sessionId/number/:numberOrAlphabet', getBetsByNumberInSession);

export default router;