import express from 'express';
import { getAllResults } from '../controllers/resultController.js';

const router = express.Router();

// Get all results
router.get('/results', getAllResults);

export default router;