// routes/interviewResults.js
import express from 'express';
import {
  storeInterviewResult,
  getInterviewResult,
  getAllInterviewResults
} from './store.js';

const router = express.Router();

// GET single result
router.get('/results/:callId', (req, res) => {
  const { callId } = req.params;
  const result = getInterviewResult(callId);

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Interview results not found for this call ID.' });
  }
});

// GET all results (optional/admin)
router.get('/results', (req, res) => {
  res.json(getAllInterviewResults());
});

// POST new result (webhook)
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

    storeInterviewResult(callId, result);
    res.status(200).json({ message: 'Result stored successfully' });
  } catch (error) {
    console.error('❌ Error storing interview result:', error);
    res.status(500).json({ error: 'Failed to store interview result' });
  }
});

export default router;
