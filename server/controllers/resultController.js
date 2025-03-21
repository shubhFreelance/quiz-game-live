import Result from '../models/Result.js';

// Get all results
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find().populate('sessionId');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};