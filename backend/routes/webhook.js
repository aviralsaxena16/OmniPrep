import express from "express";
import {
  storeInterviewResult,
  debugStoreWebhook,
  normalizeResult
} from "./store.js";
import Interview from "../models/Interview.js";

const router = express.Router();

/* ======================================================
   ✅ Omnidimension Webhook (Create New Entry Per Interview)
====================================================== */
router.post("/omnidimension", async (req, res) => {
  console.log("--- Raw Webhook Body Received ---");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("---------------------------------");

  try {
    const payload = req.body;
    const callId = payload.call_id || payload.callId;
    const clerkId = payload.clerkId; // ✅ Ensure you pass this when starting the interview

    // ✅ Always debug-store raw payload
    await debugStoreWebhook(callId || `unknown_${Date.now()}`, payload);

    if (!clerkId || !callId) {
      console.error("❌ Missing clerkId or callId in webhook payload");
      return res.status(400).json({ error: "Missing clerkId or callId" });
    }

    // ✅ Normalize data for storage
    const normalized = normalizeResult(payload);

    // ✅ CREATE a new entry (not update)
    const newInterview = await Interview.create({
      clerkId,
      callId,
      ...normalized,
      createdAt: new Date()
    });

    // ✅ (Optional: old local storage)
    storeInterviewResult(callId, normalized);

    console.log(`✅ Interview saved for Clerk ID: ${clerkId}, Call ID: ${callId}`);
    res.status(201).json({ message: "✅ Interview saved successfully!", entry: newInterview });
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    res.status(500).json({ error: "Internal server error while processing webhook" });
  }
});

export default router;
