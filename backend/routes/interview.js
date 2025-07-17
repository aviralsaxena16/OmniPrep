// routes/interview.js
import express from "express";
import {
  storeInterviewResult,
  getInterviewResult,
  getAllInterviewResults,
  normalizeResult, // ✅ Reuse global normalizeResult
} from "./store.js";

const router = express.Router();

// ✅ GET single result
// ✅ GET single result
router.get("/results/:callId", (req, res) => {
  let { callId } = req.params;

  // ✅ Convert frontend-style "interview_xxx" to numeric callId
  if (callId.startsWith("interview_")) {
    const parts = callId.split("_");
    if (!isNaN(parts[1])) {
      callId = parts[1]; // Use the numeric part only (e.g., "44324")
    }
  }

  const result = getInterviewResult(callId);

  console.log(`🔍 Fetching results for Call ID: ${callId}`, result);

  if (result) {
    return res.json(result);
  } else {
    return res
      .status(404)
      .json({ error: `Interview results not found for Call ID: ${callId}` });
  }
});

// ✅ GET all results (optional/admin/debugging)
router.get("/results", (req, res) => {
  const allResults = getAllInterviewResults();
  console.log(`📦 Returning all stored interview results:`, allResults);
  res.json(allResults);
});

// ✅ POST new result (webhook/manual input)
router.post("/results", (req, res) => {
  try {
    const normalized = normalizeResult(req.body);

    if (!normalized.callId) {
      return res
        .status(400)
        .json({ error: "Missing callId in request body" });
    }

    storeInterviewResult(normalized.callId, normalized);

    console.log(
      `✅ Stored interview result for Call ID: ${normalized.callId}`,
      normalized
    );

    res.status(200).json({
      message: "Result stored successfully",
      stored: normalized,
    });
  } catch (error) {
    console.error("❌ Error storing interview result:", error);
    res.status(500).json({ error: "Failed to store interview result" });
  }
});

export default router;
