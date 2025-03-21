import mongoose from 'mongoose';

const betSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  numberOrAlphabet: { type: String, required: true }, // e.g., "5", "A", "Joker"
  amount: { type: Number, required: true }, // Amount bet on the number/alphabet
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Bet', betSchema);