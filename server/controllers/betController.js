import Bet from '../models/Bet.js';
import Session from '../models/Session.js';
import User from '../models/User.js';

export const placeBet = async (req, res) => {
  const { agentId, numberOrAlphabet, amount, sessionId } = req.body;

  try {
    // Validate input
    if (!agentId || !numberOrAlphabet || !amount || !sessionId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ message: 'Amount must be a number' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status === 'closed') {
      return res.status(400).json({ message: 'This session is closed. Please bet on the latest session.' });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const hasAgentPlacedBet = session.betsByNumber.some((entry) =>
      entry.agents.some((agentEntry) => agentEntry.agentId.toString() === agentId)
    );

    const bet = new Bet({ agentId, numberOrAlphabet, amount: parsedAmount, sessionId });
    await bet.save();

    agent.totalCollected += parsedAmount;

    const sessionCollection = agent.sessionCollections.find(
      (collection) => collection.sessionId.toString() === sessionId
    );

    if (sessionCollection) {
      sessionCollection.amount += parsedAmount;
    } else {
      agent.sessionCollections.push({ sessionId, amount: parsedAmount });
    }

    await agent.save();

    session.totalAmountCollected += parsedAmount;

    if (!hasAgentPlacedBet) {
      session.totalPlayers += 1;
    }

    let numberEntry = session.betsByNumber.find(
      (entry) => entry.numberOrAlphabet === numberOrAlphabet
    );

    if (numberEntry) {
      numberEntry.totalAmount += parsedAmount;

      let agentEntry = numberEntry.agents.find(
        (agentEntry) => agentEntry.agentId.toString() === agentId
      );

      if (agentEntry) {
        agentEntry.amount += parsedAmount;
      } else {
        numberEntry.agents.push({ agentId, amount: parsedAmount });
      }
    } else {
      session.betsByNumber.push({
        numberOrAlphabet,
        totalAmount: parsedAmount,
        agents: [{ agentId, amount: parsedAmount }],
      });
    }

    await session.save();

    res.status(201).json({ message: 'Bet placed successfully', bet });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get all bets for a session
export const getBetsBySession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const bets = await Bet.find({ sessionId });
    res.status(200).json(bets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};