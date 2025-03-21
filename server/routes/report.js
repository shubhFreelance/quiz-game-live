import express from 'express';
import { getAgentReport, getSessionReport, getDailyReport } from '../controllers/reportController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get agent-specific report
router.get('/agent/:agentId', auth(['superadmin']), getAgentReport);

// Get session-specific report
router.get('/session/:sessionId', auth(['superadmin']), getSessionReport);

// Get daily report
router.get('/daily/:date', auth(['superadmin']), getDailyReport);

export default router;