import Session from '../models/Session.js';
import Result from '../models/Result.js';

export const startSession = async (req, res) => {
  const { sessionNumber } = req.body;

  try {
    // Validate sessionNumber
    if (![1, 2, 3].includes(sessionNumber)) {
      return res.status(400).json({ message: 'Invalid session number. Must be 1, 2, or 3.' });
    }

    // Calculate start and end times based on sessionNumber
    const now = new Date();
    const startTime = new Date(now);
    const endTime = new Date(now);

    switch (sessionNumber) {
      case 1:
        startTime.setHours(9, 0, 0, 0); // 9 AM
        endTime.setHours(12, 0, 0, 0); // 12 PM
        break;
      case 2:
        startTime.setHours(13, 0, 0, 0); // 1 PM
        endTime.setHours(16, 0, 0, 0); // 4 PM
        break;
      case 3:
        startTime.setHours(17, 0, 0, 0); // 5 PM
        endTime.setHours(20, 0, 0, 0); // 8 PM
        break;
    }

    // Create a new session
    const session = new Session({ sessionNumber, startTime, endTime });
    await session.save();

    res.status(201).json({ message: 'Session started successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// End a session and announce result
export const endSession = async (req, res) => {
  const { sessionId, result } = req.body;

  try {
    // Validate result
    if (!['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'J', 'Q', 'K', 'Joker'].includes(result)) {
      return res.status(400).json({ message: 'Invalid result' });
    }

    // Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Update session with result and close it
    session.result = result;
    session.status = 'closed'; // Close the session
    await session.save();

    // Save the result in a separate collection (optional)
    const resultEntry = new Result({ sessionId, result });
    await resultEntry.save();

    res.status(200).json({ message: 'Session ended and result announced', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSessionsByDate = async (req, res) => {
  const { date } = req.params; // Date in YYYY-MM-DD format

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const sessions = await Session.find({
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



//TOtal collection for a session

export const getSessionTotalCollection = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
  
    res.status(200).json({ sessionId, totalAmountCollected: session.totalAmountCollected });
    console.log(session)
    res
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Fetch Total Amount Bet on Each Number in a Session
export const getBetsByNumberForSession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({ sessionId, betsByNumber: session.betsByNumber });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



//etch an agent's bets on each number/alphabet in a session

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

//Fetches total amount placed on a number/alphabet in a session by each agent and overall
export const getBetsByNumberInSession = async (req, res) => {
  const { sessionId, numberOrAlphabet } = req.params;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Find the entry for the specific number/alphabet
    const numberEntry = session.betsByNumber.find(
      (entry) => entry.numberOrAlphabet === numberOrAlphabet
    );

    if (!numberEntry) {
      return res.status(404).json({ message: 'No bets found for this number/alphabet' });
    }

    // Calculate total amount placed on this number/alphabet by all agents
    const totalAmount = numberEntry.agents.reduce(
      (sum, agentEntry) => sum + Number(agentEntry.amount), // Ensure amount is treated as a number
      0
    );

    // Get individual amounts placed by each agent
    const agents = numberEntry.agents.map((agentEntry) => ({
      agentId: agentEntry.agentId,
      amount: Number(agentEntry.amount), // Ensure amount is treated as a number
    }));

    res.status(200).json({
      sessionId,
      numberOrAlphabet,
      totalAmount,
      agents,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};