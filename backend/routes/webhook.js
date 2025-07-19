import express from "express";
import {
  storeInterviewResult,
  debugStoreWebhook,
  normalizeResult
} from "./store.js";
import Interview from "../models/Interview.js";

const router = express.Router();

/* ======================================================
   ✅ OmniDimension Webhook → Updates or Creates Interview Entry
====================================================== */
router.post("/omnidimension", async (req, res) => {
  console.log("--- Raw Webhook Body Received ---");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("---------------------------------");

  try {
    const payload = req.body;
    const callId = payload.call_id || payload.callId;

    if (!callId) {
      console.error("❌ Missing callId in webhook payload");
      return res.status(400).json({ error: "Missing callId" });
    }

    // ✅ Debug store for inspection
    await debugStoreWebhook(callId, payload);

    // ✅ Normalize AI response for storage
    const normalized = normalizeResult(payload);

    // ✅ Update if exists, else CREATE (important!)
    const updatedInterview = await Interview.findOneAndUpdate(
      { callId },
      {
        $set: {
          interviewData: normalized,
          updatedAt: new Date()
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // ✅ Local debug storage (optional)
    storeInterviewResult(callId, normalized);

    console.log(`✅ Interview saved for Clerk ID: ${updatedInterview.clerkId || "(unknown)"}, Call ID: ${callId}`);
    return res.status(200).json({
      message: "✅ Interview updated (or created) successfully!",
      entry: updatedInterview
    });
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    res.status(500).json({ error: "Internal server error while processing webhook" });
  }
});

export default router;
