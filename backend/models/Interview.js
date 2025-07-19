import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    callId: { type: String, required: true, unique: true }, // still required for mapping webhook updates
    interviewData: {
      fullConversation: String,
      summary: String,
      sentiment: String,
      recordingUrl: String,
      timestamp: Date,
      extractedInfo: { type: mongoose.Schema.Types.Mixed, default: {} }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
