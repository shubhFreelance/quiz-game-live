import express from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import betRoutes from './routes/bet.js';
import sessionRoutes from './routes/session.js';
import agentRoutes from './routes/agent.js';
import reportRoutes from './routes/report.js';
import resultRoutes from './routes/result.js';
import { calculateDailyCollections, calculateSuperadminDailyCollection } from './controllers/agentController.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bet', betRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/result', resultRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

cron.schedule('59 23 * * *', async () => {
  console.log('Calculating daily collections...');
  await calculateDailyCollections(); // Calculate daily collections for agents
  await calculateSuperadminDailyCollection(); // Calculate daily collection for superadmin
});cd