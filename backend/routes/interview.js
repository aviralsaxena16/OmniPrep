import express from 'express';

const router = express.Router();

// In-memory store for interview results
// In a real application, you'd use a database
const interviewResultsStore = {};

// Get interview results by call ID
router.get('/results/:callId', (req, res) => {
  try {
    const callId = req.params.callId;
    const result = interviewResultsStore[callId];

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ 
        error: 'Interview results not found for this call ID.' 
      });
    }
  } catch (error) {
    console.error('Error fetching interview result:', error);
    res.status(500).json({ error: 'Failed to fetch interview result' });
  }
});

// Get all interview results (optional - for admin/debugging)
// Webhook endpoint to receive interview results
router.post('/results', (req, res) => {
  try {
    const { callId, extractedInfo, fullConversation, timestamp } = req.body;

    if (!callId) {
      return res.status(400).json({ error: 'Missing callId in request body' });
    }

    const result = {
      callId,
      extractedInfo,
      fullConversation,
      timestamp: timestamp || new Date().toISOString(),
    };

    interviewResultsStore[callId] = result;
    console.log(`✅ Received interview result for callId: ${callId}`);
    res.status(200).json({ message: 'Result stored successfully' });
  } catch (error) {
    console.error('❌ Error storing interview result:', error);
    res.status(500).json({ error: 'Failed to store interview result' });
  }
});


// Store interview result (used by webhook)
export const storeInterviewResult = (callId, data) => {
  interviewResultsStore[callId] = data;
  console.log(`Successfully stored interview result for callId: ${callId}`);
};

export default router;