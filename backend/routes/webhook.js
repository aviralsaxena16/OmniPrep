import express from 'express';
import { storeInterviewResult } from './interview.js';

const router = express.Router();

// OmniDimension webhook endpoint
router.post('/omnidimension-webhook', (req, res) => {
  try {
    console.log('Received Webhook Payload:');
    const payload = req.body;

    const callId = payload.call_id;
    const extractedInfo = payload.extracted_info;
    const fullConversation = payload.full_conversation;

    if (!callId || !extractedInfo) {
      console.warn('Webhook payload missing call_id or extracted_info.');
      return res.status(400).json({ 
        error: 'Missing required fields: call_id or extracted_info' 
      });
    }

    // Store the interview result
    storeInterviewResult(callId, {
      extractedInfo,
      fullConversation,
      timestamp: new Date()
    });

    console.log(`Stored results for callId: ${callId}`);
    res.status(200).json({ message: 'Webhook received successfully!' });

  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

export default router;