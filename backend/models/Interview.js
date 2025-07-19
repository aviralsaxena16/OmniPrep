import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      index: true, // ✅ Fast lookup by clerkId
    },
    callId: {
      type: String,
      required: true,
      unique: true, // ✅ Prevent duplicate webhook updates for same call
      index: true,  // ✅ Speeds up updates via callId
    },
    interviewData: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt
);

// ✅ Compound index for faster "latest interview" queries
InterviewSchema.index({ clerkId: 1, updatedAt: -1 });

const Interview = mongoose.model("Interview", InterviewSchema);
export default Interview;
