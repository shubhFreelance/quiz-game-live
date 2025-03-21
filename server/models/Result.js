import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  result: { type: String, required: true }, // Winning number/alphabet
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Result', resultSchema);