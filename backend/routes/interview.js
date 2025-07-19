import express from "express";
import Interview from "../models/Interview.js";

const router = express.Router();

/* ======================================================
   ✅ 1. Fetch Latest Interview for a User
====================================================== */
router.get("/latest/:clerkId", async (req, res) => {
  try {
    const { clerkId } = req.params;

    if (!clerkId) {
      return res.status(400).json({ success: false, message: "Clerk ID is required" });
    }

    const latestEntry = await Interview.findOne({ clerkId })
      .sort({ updatedAt: -1, createdAt: -1 });

    if (!latestEntry) {
      return res.status(404).json({
        success: false,
        message: "No interview found",
        entry: null
      });
    }

    res.status(200).json({ success: true, entry: latestEntry });
  } catch (error) {
    console.error("❌ Error fetching latest interview:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ======================================================
   ✅ 2. Debug / Manual Save or Update Interview
====================================================== */
router.post("/save", async (req, res) => {
  try {
    const { clerkId, callId, interviewData } = req.body;

    if (!callId || !interviewData) {
      return res.status(400).json({ success: false, message: "callId and interviewData are required" });
    }

    const updatedEntry = await Interview.findOneAndUpdate(
      { callId },
      {
        $set: {
          ...(clerkId && { clerkId }), // only overwrite if provided
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
   ✅ 3. Fetch All Interviews (Admin/Debug)
====================================================== */
router.get("/all", async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ success: false, message: "Forbidden in production" });
    }

    const { clerkId, callId } = req.query;
    const filter = {};
    if (clerkId) filter.clerkId = clerkId;
    if (callId) filter.callId = callId;

    const allEntries = await Interview.find(filter).sort({ updatedAt: -1, createdAt: -1 });

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
