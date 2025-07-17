import express from "express";
import {
  storeInterviewResult,
  debugStoreWebhook,
  normalizeResult
} from "./store.js";
import Interview from "../models/Interview.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

/* ======================================================
   ✅ OmniDimension Webhook → Creates New Interview Entry
====================================================== */
router.post("/omnidimension", requireAuth(), async (req, res) => {
  console.log("--- Raw Webhook Body Received ---");
  console.log(JSON.stringify(req.body, null, 2));
  console.log("---------------------------------");

  try {
    const payload = req.body;
    const callId = payload.call_id || payload.callId;
    const clerkId = req.auth.userId; // ✅ Clerk-provided authenticated user

    // ✅ Debug-store for inspection
    await debugStoreWebhook(callId || `unknown_${Date.now()}`, payload);

    if (!clerkId || !callId) {
      console.error("❌ Missing clerkId or callId in webhook payload");
      return res.status(400).json({ error: "Missing clerkId or callId" });
    }

    // ✅ Normalize AI response for storage
    const normalized = normalizeResult(payload);

    // ✅ CREATE a NEW entry (never update existing)
    const newInterview = await Interview.create({
      clerkId,
      callId,
      interviewData: normalized,
      createdAt: new Date()
    });

    // (Optional local storage for debugging)
    storeInterviewResult(callId, normalized);

    console.log(`✅ Interview saved for Clerk ID: ${clerkId}, Call ID: ${callId}`);
    res.status(201).json({ message: "✅ Interview saved successfully!", entry: newInterview });
  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    res.status(500).json({ error: "Internal server error while processing webhook" });
  }
});

export default router;
