import express from 'express';
import { body } from 'express-validator';
import { getAllAgents, getAgentById, updateAgent } from '../controllers/agentController.js';
import {validate} from '../utils/validate.js';
import auth from '../middleware/auth.js';
import { getAgentSessionCollection, getDailyCollection, getSuperadminDailyCollection, getOverallCollection } from '../controllers/agentController.js';
import {getAgentBetsByNumberForSession} from '../controllers/agentController.js';
const router = express.Router();

// Get all agents
router.get('/agents', auth(['superadmin']), getAllAgents);

// Get a specific agent's data
router.get('/agent/:id', auth(['superadmin']), getAgentById);

// Update agent credentials
router.put(
  '/agent/:id',
  auth(['superadmin']),
  validate([
    body('username').optional().notEmpty().withMessage('Username cannot be empty'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ]),
  updateAgent
);


router.get('/:agentId/session/:sessionId', getAgentSessionCollection);
router.get('/:agentId/session/:sessionId/bets', getAgentBetsByNumberForSession);

// Get daily collection for a user (agent or superadmin)
router.get('/daily-collection', auth(['agent', 'superadmin']), getDailyCollection);

// Get superadmin's daily collection
router.get('/superadmin/daily-collection', auth(['superadmin']), getSuperadminDailyCollection);

//getOverall collection
router.get('/overall-collection', auth(['superadmin']), getOverallCollection);


//Get current user(agent) id
router.get('/current-agent-id', auth(['agent']), (req, res) => {
  res.status(200).json({ agentId: req.userId });
});


export default router;