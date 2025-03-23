import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'manager', 'agent'], required: true },
  totalCollected: { type: Number, default: 0 }, // Total collection across all sessions
  sessionCollections: [
    {
      sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
      amount: { type: Number, default: 0 },
    },
  ],
  dailyCollections: [
    {
      date: { type: Date, required: true }, // Date of the collection
      totalAmount: { type: Number, default: 0 }, // Total collection for the day
    },
  ],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User