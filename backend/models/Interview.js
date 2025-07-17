import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  interviewData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Interview", interviewSchema);
