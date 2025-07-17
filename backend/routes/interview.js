import express from "express";
import Interview from "../models/Interview.js";

const router = express.Router();

/* ======================================================
   ✅ 1. Fetch Latest Interview for a User (Clerk Based)
====================================================== */
router.get("/latest/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;

    const latestEntry = await Interview.findOne({ clerkId }).sort({ createdAt: -1 });

    if (!latestEntry) {
      return res.status(404).json({ success: false, message: "No interview found" });
    }

    res.status(200).json({ success: true, entry: latestEntry });
  } catch (error) {
    console.error("❌ Error fetching latest interview:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ======================================================
   ✅ 2. Save Interview (Used After Call Completion)
====================================================== */
router.post("/save", async (req, res) => {
  try {
    const { clerkId, interviewData } = req.body;

    if (!clerkId || !interviewData) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newEntry = await Interview.create({
      clerkId,
      ...interviewData, // directly spread AI-generated interview results
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, entry: newEntry });
  } catch (error) {
    console.error("❌ Error saving interview:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ======================================================
   ✅ 3. Fetch All Interviews (Admin/Debugging)
====================================================== */
router.get("/all", async (req, res) => {
  try {
    const allEntries = await Interview.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, entries: allEntries });
  } catch (error) {
    console.error("❌ Error fetching all interviews:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
