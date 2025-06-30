// store.js
const interviewResultsStore = {};

export const storeInterviewResult = (callId, data) => {
  interviewResultsStore[callId] = data;
  console.log(`✅ Stored result for callId: ${callId}`);
};

export const getInterviewResult = (callId) => interviewResultsStore[callId];
export const getAllInterviewResults = () => Object.values(interviewResultsStore);

// Optionally export the store for admin/debugging
export { interviewResultsStore };
