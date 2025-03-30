import Result from '../models/Result.js';
import Session from '../models/Session.js';


//Get recently closed session result
export const getCurrentSessionResult = async (req, res) => {
  try {
    
    const session = await Session.findOne({ 
      status: 'closed',
      result: { $exists: true, $ne: null } 
    })
    .sort({ 
      date: -1,    
      endTime: -1  
    })
    .select('_id sessionNumber result date endTime');

    if (!session) {
      return res.status(404).json({ 
        success: false,
        message: 'No completed session found' 
      });
    }

    res.status(200).json({
      success: true,
      sessionId: session._id,
      sessionNumber: session.sessionNumber,
      result: session.result,
      date: session.date,
      endTime: session.endTime 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};


export const getLast15DaysResults = async (req, res) => {
  try {
  
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    fifteenDaysAgo.setHours(0, 0, 0, 0);

    
    const sessions = await Session.find({
      status: 'closed',
      result: { $exists: true, $ne: null },
      date: { $gte: fifteenDaysAgo }
    })
    .sort({ 
      date: 1,           
      sessionNumber: 1    
    })
    .select('_id sessionNumber result date')
    .lean();

   
    const resultsByDay = sessions.reduce((acc, session) => {
      const dateStr = session.date.toISOString().split('T')[0];
      
      if (!acc[dateStr]) {
        acc[dateStr] = {
          date: dateStr,
          results: []
        };
      }
      
      
      acc[dateStr].results.push({
        sessionId: session._id,
        sessionNumber: session.sessionNumber,
        result: session.result
      });

      return acc;
    }, {});

   
    const days = Object.values(resultsByDay)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 15);

    res.status(200).json({
      success: true,
      days,
      totalDays: days.length,
      totalSessions: sessions.length
    });
  } catch (error) {
    console.error('Error in getLast15DaysResults:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch results',
      error: error.message 
    });
  }
};