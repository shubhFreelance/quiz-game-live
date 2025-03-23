import Session from '../models/Session.js';
import Result from '../models/Result.js';


//original code
// export const startSession = async (req, res) => {
//   try {
//     // Check if there is already an active session
//     const activeSession = await Session.findOne({ status: 'open' });
//     if (activeSession) {
//       return res.status(400).json({
//         message: 'Another session is already active. Please end the current session before starting a new one.',
//       });
//     }

//     // Get the current date (start of the day)
//     const now = new Date();
//     const startOfDay = new Date(now);
//     startOfDay.setHours(0, 0, 0, 0); // Start of the day (00:00:00)
//     const endOfDay = new Date(now);
//     endOfDay.setHours(23, 59, 59, 999); // End of the day (23:59:59.999)

//     // Find the last session for the current day
//     const lastSession = await Session.findOne({
//       date: { $gte: startOfDay, $lt: endOfDay },
//     }).sort({ sessionNumber: -1 }); // Sort by sessionNumber in descending order

//     // Determine the next session number
//     let nextSessionNumber = 1; // Default to session 1
//     if (lastSession) {
//       if (lastSession.sessionNumber === 3) {
//         return res.status(400).json({ message: 'All sessions for the day have already been started.' });
//       }
//       nextSessionNumber = lastSession.sessionNumber + 1; // Increment session number
//     }

//     // Calculate start and end times based on session number
//     const startTime = new Date(now);
//     const endTime = new Date(now);

//     switch (nextSessionNumber) {
//       case 1:
//         startTime.setHours(9, 0, 0, 0); // 9 AM
//         endTime.setHours(12, 0, 0, 0); // 12 PM
//         break;
//       case 2:
//         startTime.setHours(13, 0, 0, 0); // 1 PM
//         endTime.setHours(16, 0, 0, 0); // 4 PM
//         break;
//       case 3:
//         startTime.setHours(17, 0, 0, 0); // 5 PM
//         endTime.setHours(20, 0, 0, 0); // 8 PM
//         break;
//     }

//     // Create a new session
//     const session = new Session({
//       sessionNumber: nextSessionNumber,
//       date: now, // Current date and time
//       startTime,
//       endTime,
//     });

//     await session.save();

//     res.status(201).json({ message: 'Session started successfully', session });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


//for test purposes- 20 sessions
export const startSession = async (req, res) => {
  try {
    // Check if there is already an active session
    const activeSession = await Session.findOne({ status: 'open' });
    if (activeSession) {
      return res.status(400).json({
        message: 'Another session is already active. Please end the current session before starting a new one.',
      });
    }

    // Get the current date (start of the day)
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0); // Start of the day (00:00:00)
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999); // End of the day (23:59:59.999)

    // Find the last session for the current day
    const lastSession = await Session.findOne({
      date: { $gte: startOfDay, $lt: endOfDay },
    }).sort({ sessionNumber: -1 }); // Sort by sessionNumber in descending order

    // Determine the next session number
    let nextSessionNumber = 1; // Default to session 1
    if (lastSession) {
      if (lastSession.sessionNumber === 20) { // Allow up to 20 sessions for testing
        return res.status(400).json({ message: 'All sessions for the day have already been started.' });
      }
      nextSessionNumber = lastSession.sessionNumber + 1; // Increment session number
    }

    // Calculate start and end times based on session number
    const startTime = new Date(now);
    const endTime = new Date(now);

    // For testing, you can reduce the duration of each session or keep the same timing
    const sessionDuration = 30; // 30 minutes per session (for testing)
    startTime.setHours(9, 0, 0, 0); // Start at 9 AM
    startTime.setMinutes(startTime.getMinutes() + (nextSessionNumber - 1) * sessionDuration); // Increment start time
    endTime.setTime(startTime.getTime() + sessionDuration * 60 * 1000); // Add session duration

    // Create a new session
    const session = new Session({
      sessionNumber: nextSessionNumber,
      date: now, // Current date and time
      startTime,
      endTime,
    });

    await session.save();

    res.status(201).json({ message: 'Session started successfully', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// End a session and announce result
export const endSession = async (req, res) => {
  const { result } = req.body; // Only the result is required in the request body

  try {
    // Find the latest active session
    const session = await Session.findOne({ status: 'open' }).sort({ createdAt: -1 }); // Sort by createdAt in descending order

    // If no active session is found, return an error
    if (!session) {
      return res.status(404).json({ message: 'No active session found.' });
    }

    // Validate the result
    const validResults = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'J', 'Q', 'K', 'Joker'];
    if (!validResults.includes(result)) {
      return res.status(400).json({ message: 'Invalid result.' });
    }

    // Update session with result and close it
    session.result = result;
    session.status = 'closed'; // Close the session
    await session.save();

    res.status(200).json({ message: 'Session ended and result announced', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
//End all session forcefully

export const endAllSessions = async (req, res) => {
  try {
    // Find all sessions that are currently open
    const activeSessions = await Session.find({ status: 'open' });

    // If no active sessions are found, return a message
    if (activeSessions.length === 0) {
      return res.status(200).json({ message: 'No active sessions found.' });
    }

    // Update all active sessions to closed
    await Session.updateMany(
      { status: 'open' }, // Filter for active sessions
      { $set: { status: 'closed' } } // Update status to closed
    );

    res.status(200).json({ message: 'All active sessions have been ended.', closedSessions: activeSessions.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



//Get the active session
export const getActiveSession = async (req, res) => {
  try {
    // Find the session that is currently open
    const activeSession = await Session.findOne({ status: 'open' });

    if (!activeSession) {
      return res.status(404).json({ message: 'No active session found' });
    }

    res.status(200).json(activeSession);
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