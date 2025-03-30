import express from 'express';
import {
  getCurrentSessionResult,
  getLast15DaysResults
} from '../controllers/resultController.js';

const router = express.Router();

// Get current session's result
router.get('/current', getCurrentSessionResult);

// Get last 15 days results
router.get('/last-15-days', getLast15DaysResults);

export default router;