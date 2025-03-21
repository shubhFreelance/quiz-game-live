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

    // Ensure amount is a number
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ message: 'Amount must be a number' });
    }

    // Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Check if the session is closed
    if (session.status === 'closed') {
      return res.status(400).json({ message: 'This session is closed. Please bet on the latest session.' });
    }

    // Find the agent
    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Check if the agent has already placed a bet in this session
    const hasAgentPlacedBet = session.betsByNumber.some((entry) =>
      entry.agents.some((agentEntry) => agentEntry.agentId.toString() === agentId)
    );

    // Create a new bet
    const bet = new Bet({ agentId, numberOrAlphabet, amount: parsedAmount, sessionId });
    await bet.save();

    // Update agent's totalCollected and sessionCollections
    agent.totalCollected += parsedAmount;

    const sessionCollection = agent.sessionCollections.find(
      (collection) => collection.sessionId.toString() === sessionId
    );

    if (sessionCollection) {
      // If the agent already has a collection for this session, update the amount
      sessionCollection.amount += parsedAmount;
    } else {
      // If this is the first bet for this session, add a new entry
      agent.sessionCollections.push({ sessionId, amount: parsedAmount });
    }

    await agent.save();

    // Update session's totalAmountCollected
    session.totalAmountCollected += parsedAmount;

    // Only increment totalPlayers if the agent has not placed a bet in this session before
    if (!hasAgentPlacedBet) {
      session.totalPlayers += 1;
    }

    // Find or create the entry for the number/alphabet in betsByNumber
    let numberEntry = session.betsByNumber.find(
      (entry) => entry.numberOrAlphabet === numberOrAlphabet
    );

    if (numberEntry) {
      // If the number/alphabet already exists, update the total amount
      numberEntry.totalAmount += parsedAmount;

      // Find or create the agent's entry in the numberEntry
      let agentEntry = numberEntry.agents.find(
        (agentEntry) => agentEntry.agentId.toString() === agentId
      );

      if (agentEntry) {
        // If the agent already has an entry, update the amount
        agentEntry.amount += parsedAmount;
      } else {
        // If this is the first bet by the agent on this number/alphabet, add a new entry
        numberEntry.agents.push({ agentId, amount: parsedAmount });
      }
    } else {
      // If the number/alphabet doesn't exist, create a new entry
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