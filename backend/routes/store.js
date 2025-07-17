const interviewResultsStore = {};
const allWebhooks = {}; // ✅ Stores all raw webhook payloads for debugging

/**
 * ✅ Stores normalized interview results.
 * Assumes data is already normalized by the route handler.
 */
export const storeInterviewResult = (callId, data) => {
  interviewResultsStore[callId] = {
    extractedInfo: data.extractedInfo || {},
    fullConversation: data.fullConversation || '',
    timestamp: data.timestamp || Date.now(),
  };

  console.log(`✅ Stored interview result for Call ID: ${callId}`, interviewResultsStore[callId]);
};

/**
 * ✅ Get a single interview result by Call ID
 */
export const getInterviewResult = (callId) => interviewResultsStore[callId];

/**
 * ✅ Get all stored interview results (key-value pairs for debugging/admin)
 */
export const getAllInterviewResults = () => interviewResultsStore;

/**
 * ✅ Store every raw webhook for debugging (even if invalid)
 */
export const debugStoreWebhook = (callId, rawData) => {
  allWebhooks[callId] = { receivedAt: new Date().toISOString(), rawData };
  console.log(`🔍 Debug: Stored raw webhook for Call ID: ${callId}`);
};

/**
 * ✅ Get all raw webhook payloads (for debugging)
 */
export const getAllWebhooks = () => allWebhooks;

export { interviewResultsStore, allWebhooks };
