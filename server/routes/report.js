import express from 'express';
import { getAgentReport, getSessionReport, getDailyReport } from '../controllers/reportController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get agent-specific report
// router.get('/agent/:agentId', auth(['superadmin']), getAgentReport);
router.get('/agent/:agentId', getAgentReport);

// Get session-specific report
router.get('/session/:sessionId', getSessionReport);

// Get daily report
router.get('/daily/:date', getDailyReport);

export default router;