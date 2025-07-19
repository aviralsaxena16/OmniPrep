import express from "express";
import Interview from "../models/Interview.js";

const router = express.Router();

/* ======================================================
   ✅ 1. Fetch Latest Interview (Global Latest Entry)
====================================================== */
router.get("/latest", async (req, res) => {
  try {
    const interview = await Interview.findOne()
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    if (!interview || !interview.interviewData) {
      return res.status(404).json({ error: "No interviews found" });
    }

    const data = interview.interviewData;

    res.status(200).json({
      entry: {
        fullConversation: data.fullConversation || "",
        summary: data.summary || "",
        sentiment: data.sentiment || "Neutral",
        recordingUrl: data.recordingUrl || "",
        timestamp: data.timestamp || interview.updatedAt || interview.createdAt,
        extractedInfo: data.extractedInfo || {}
      }
    });
  } catch (err) {
    console.error("❌ Error fetching latest interview:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ======================================================
   ✅ 2. Save or Update Interview (Using Call ID)
====================================================== */
router.post("/save", async (req, res) => {
  try {
    const { callId, interviewData } = req.body;

    if (!callId || !interviewData) {
      return res
        .status(400)
        .json({ success: false, message: "callId and interviewData are required" });
    }

    const updatedEntry = await Interview.findOneAndUpdate(
      { callId },
      {
        $set: {
          interviewData,
          updatedAt: new Date()
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Interview saved/updated successfully",
      entry: updatedEntry
    });
  } catch (error) {
    console.error("❌ Error saving/updating interview:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ======================================================
   ✅ 3. Fetch All Interviews (For Debug Only)
====================================================== */
router.get("/all", async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ success: false, message: "Forbidden in production" });
    }

    const allEntries = await Interview.find({})
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: allEntries.length,
      entries: allEntries
    });
  } catch (error) {
    console.error("❌ Error fetching all interviews:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
