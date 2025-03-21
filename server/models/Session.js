import mongoose from 'mongoose';



const sessionSchema = new mongoose.Schema({
  sessionNumber: { type: Number, required: true }, // 1, 2, or 3
  date: { type: Date, default: Date.now }, // Date of the session
  startTime: { type: Date, required: true }, // Session start time
  endTime: { type: Date, required: true }, // Session end time
  result: { type: String }, // Result announced by super admin
  totalAmountCollected: { type: Number, default: 0 }, // Total money collected in the session
  totalPlayers: { type: Number, default: 0 }, // Total players in the session
  status: { type: String, enum: ['open', 'closed'], default: 'open' }, // Session status
  betsByNumber: [
    {
      numberOrAlphabet: { type: String, required: true }, // e.g., "5", "A", "Joker"
      totalAmount: { type: Number, default: 0 }, // Total amount bet on this number/alphabet
      agents: [
        {
          agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Agent ID
          amount: { type: Number, default: 0 }, // Amount bet by this agent on this number/alphabet
        },
      ],
    },
  ],
});





const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

export default Session