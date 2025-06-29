// routes/user.js
import express from "express";
import User from "../models/User.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/store-user", async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    console.error("Missing email or name");
    return res.status(400).json({ message: "Missing email or name" });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name });
      console.log("User created:", user);
    }

    res.status(200).json({ message: "User synced", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
    console.error(err);
  }
});

//add a upcoming interview
router.post("/upcoming-interviews", async (req, res) => {
  try {
    // Get email from frontend (req.body)
    const { email, company, jobRole, interviewDate, interviewTime, jobLink, location, jobDescription, priority } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const newInterview = {
      company,
      jobRole,
      interviewDate,
      interviewTime,
      jobLink,
      location,
      jobDescription,
      priority,
    };

    // Find user by email and push to upcomingInterviews
    const user = await User.findOneAndUpdate(
      { email },
      { $push: { upcomingInterviews: newInterview } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(201).json(user.upcomingInterviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// fetch all the upcoming interviews
router.get("/upcoming-interviews", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email }, "upcomingInterviews");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.upcomingInterviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//mark interview as done 

// router.patch("/mark-done", async (req, res) => {
//   try {
//     const { email, interviewId } = req.body;
//     console.log("Email:", email);
//     console.log("Interview ID:", interviewId);
//     if (!email || !interviewId) return res.status(400).json({ message: "Email and interviewId required" });

//      const objectId = new mongoose.Types.ObjectId(interviewId);

//     const user = await User.findOneAndUpdate(
//       { email, "upcomingInterviews._id": objectId },
//       { $set: { "upcomingInterviews.$.done": true } },
//       { new: true }
//     );
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user.upcomingInterviews);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
router.patch("/mark-done", async (req, res) => {
  try {
    const { email, interviewId } = req.body;
    console.log("interviewId:", interviewId);
    if (!email || !interviewId) {
      return res.status(400).json({ message: "Email and interviewId required" });
    }

    const objectId = new mongoose.Types.ObjectId(interviewId);
    console.log("Email:", email);
    console.log("Converted ObjectId:", objectId);
 
    const user = await User.findOne({ email });
    console.log("User's Interview IDs:", user.upcomingInterviews.map(i => i._id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const interview = user.upcomingInterviews.id(objectId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    interview.done = true;
    await user.save();

    res.json(user.upcomingInterviews);
  } catch (error) {
    console.error("Error marking interview done:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
