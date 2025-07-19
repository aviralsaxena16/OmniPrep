// store.js

// ✅ In-memory stores (consider persisting to DB for production)
const interviewResultsStore = {};
const allWebhooks = {}; // For debugging only

/**
 * ✅ Normalize the raw webhook payload into a clean structure.
 */
export const normalizeResult = (payload) => {
  const callReport = payload.call_report || {};
  return {
    callId: payload.call_id || payload.callId,
    extractedInfo:
      payload.extracted_info ||
      payload.extractedInfo ||
      callReport.extracted_variables ||
      {},
    fullConversation:
      payload.full_conversation ||
      payload.fullConversation ||
      callReport.full_conversation ||
      "",
    summary: payload.summary || callReport.summary || "No summary provided.",
    sentiment: payload.sentiment || callReport.sentiment || "Not available",
    recordingUrl:
      payload.recording_url || callReport.recording_url || "",
    timestamp: payload.timestamp || Date.now(),
  };
};

/**
 * ✅ Store the normalized interview result in memory.
 */
export const storeInterviewResult = (callId, data) => {
  interviewResultsStore[callId] = { ...data };
  console.log(
    `✅ Stored interview result for Call ID: ${callId}`,
    interviewResultsStore[callId]
  );
};

/**
 * ✅ Retrieve a single interview result by Call ID.
 */
export const getInterviewResult = (callId) => interviewResultsStore[callId];

/**
 * ✅ Retrieve all stored interview results (admin/debugging).
 */
export const getAllInterviewResults = () => interviewResultsStore;

/**
 * ✅ Store the raw webhook data for debugging (before normalization).
 */
export const debugStoreWebhook = (callId, rawData) => {
  allWebhooks[callId] = { receivedAt: new Date().toISOString(), rawData };
  console.log(`🔍 Debug: Stored raw webhook for Call ID: ${callId}`);
};

/**
 * ✅ Get all stored raw webhooks (debugging).
 */
export const getAllWebhooks = () => allWebhooks;

//export { interviewResultsStore, allWebhooks };
export default {
  interviewResultsStore,
  allWebhooks,
  normalizeResult,
  storeInterviewResult,
  getInterviewResult,
  getAllInterviewResults,
  debugStoreWebhook,
  getAllWebhooks
};
