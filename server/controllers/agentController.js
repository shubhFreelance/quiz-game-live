import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Get all agents
export const getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' });
    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a specific agent's data
export const getAgentById = async (req, res) => {
  const { id } = req.params;

  try {
    const agent = await User.findById(id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update agent credentials
export const updateAgent = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    const agent = await User.findById(id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    if (username) agent.username = username;
    if (password) agent.password = await bcrypt.hash(password, 10);

    await agent.save();

    res.status(200).json({ message: 'Agent credentials updated', agent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAgentSessionCollection = async (req, res) => {
  const { agentId, sessionId } = req.params;

  try {
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const sessionCollection = agent.sessionCollections.find(
      (collection) => collection.sessionId.toString() === sessionId
    );

    if (!sessionCollection) {
      return res.status(404).json({ message: 'No data found for this session' });
    }

    res.status(200).json({ agentId, sessionId, amount: sessionCollection.amount });
    console.log(agent)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Fetch Agent's Bets on Each Number in a Session
export const getAgentBetsByNumberForSession = async (req, res) => {
  const { agentId, sessionId } = req.params;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const agentBets = session.betsByNumber.map((entry) => {
      const agentEntry = entry.agents.find(
        (agentEntry) => agentEntry.agentId.toString() === agentId
      );

      return {
        numberOrAlphabet: entry.numberOrAlphabet,
        amount: agentEntry ? agentEntry.amount : 0,
      };
    });

    res.status(200).json({ agentId, sessionId, bets: agentBets });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


//calculate daily collection
export const calculateDailyCollections = async () => {
  try {
    // Get the start and end of the current day
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0); // Start of the day (00:00:00)
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999); // End of the day (23:59:59.999)

    // Find all users (agents and superadmins)
    const users = await User.find({ role: { $in: ['agent', 'superadmin'] } });

    // Calculate daily collections for each user
    for (const user of users) {
      // Find all session collections for the current day
      const sessionsForDay = user.sessionCollections.filter((collection) => {
        return collection.sessionId.date >= startOfDay && collection.sessionId.date <= endOfDay;
      });

      // Calculate the total collection for the day
      const totalAmount = sessionsForDay.reduce((sum, collection) => sum + collection.amount, 0);

      // Save the daily collection to the user's dailyCollections array
      user.dailyCollections.push({ date: startOfDay, totalAmount });
      await user.save();
    }

    console.log('Daily collections calculated and saved successfully.');
  } catch (error) {
    console.error('Error calculating daily collections:', error.message);
  }
};

//Get Daily Collections for a superAdmin


