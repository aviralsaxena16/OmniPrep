// models/User.js
import mongoose from "mongoose";

const upcomingInterviewSchema = new mongoose.Schema({
  company: { type: String, required: true },
  jobRole: { type: String, required: true },
  interviewDate: { type: Date, required: true },
  interviewTime: { type: String, required: true }, // Store as string (e.g., "14:00") or Date if you prefer
  jobLink: { type: String },
  location: { type: String },
  jobDescription: { type: String },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  done: { type: Boolean, default: false }
}, { _id: true }); 

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
  upcomingInterviews: [upcomingInterviewSchema],
});

export default mongoose.models.User || mongoose.model("User", userSchema);
