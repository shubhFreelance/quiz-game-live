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


