import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'manager', 'agent'], default: 'agent' },
  totalCollected: { type: Number, default: 0 }, // Total money collected by the agent
  sessionCollections: [
    {
      sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
      amount: { type: Number, default: 0 }, // Amount collected by the agent for this session
    },
  ],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User