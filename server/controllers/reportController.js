import Bet from '../models/Bet.js';
import Session from '../models/Session.js';
import User from '../models/User.js';

// Get agent-specific report
export const getAgentReport = async (req, res) => {
  const { agentId } = req.params;

  try {
    const agent = await User.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const bets = await Bet.find({ agentId });

    const agentReport = {
      agentId: agent._id,
      totalMoneyCollected: bets.reduce((acc, bet) => acc + bet.amount, 0),
      totalPlayers: bets.length,
      betsByNumber: bets.reduce((acc, bet) => {
        if (!acc[bet.numberOrAlphabet]) {
          acc[bet.numberOrAlphabet] = { totalAmount: 0, totalPlayers: 0 };
        }
        acc[bet.numberOrAlphabet].totalAmount += bet.amount;
        acc[bet.numberOrAlphabet].totalPlayers += 1;
        return acc;
      }, {}),
    };

    res.status(200).json(agentReport);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get session-specific report
export const getSessionReport = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const bets = await Bet.find({ sessionId });

    const sessionReport = {
      sessionId: session._id,
      totalMoneyCollected: session.totalAmountCollected,
      totalPlayers: session.totalPlayers,
      betsByNumber: bets.reduce((acc, bet) => {
        if (!acc[bet.numberOrAlphabet]) {
          acc[bet.numberOrAlphabet] = { totalAmount: 0, totalPlayers: 0 };
        }
        acc[bet.numberOrAlphabet].totalAmount += bet.amount;
        acc[bet.numberOrAlphabet].totalPlayers += 1;
        return acc;
      }, {}),
    };

    res.status(200).json(sessionReport);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get daily report
export const getDailyReport = async (req, res) => {
  const { date } = req.params;

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const sessions = await Session.find({
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    const dailyReport = {
      totalMoneyCollected: sessions.reduce((acc, session) => acc + session.totalAmountCollected, 0),
      totalPlayers: sessions.reduce((acc, session) => acc + session.totalPlayers, 0),
      sessions: sessions.map((session) => ({
        sessionId: session._id,
        totalMoneyCollected: session.totalAmountCollected,
        totalPlayers: session.totalPlayers,
      })),
    };

    res.status(200).json(dailyReport);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};