import express from 'express';
import { 
  storeInterviewResult, 
  debugStoreWebhook, 
  getAllWebhooks 
} from './store.js';

const router = express.Router();

/**
 * ✅ POST Webhook from OmniDimension
 */
router.post('/omnidimension', async (req, res) => {
  console.log('--- Raw Webhook Body Received ---');
  console.log(JSON.stringify(req.body, null, 2));
  console.log('---------------------------------');

  try {
    const payload = req.body;
    const callId = payload.call_id || payload.callId;

    // ✅ Always store raw webhook for debugging
    debugStoreWebhook(callId || `unknown_${Date.now()}`, payload);

    // ✅ Extract correct fields based on OmniDimension's payload structure
    const callReport = payload.call_report || {};
    const extractedInfo =
      payload.extracted_info || 
      payload.extractedInfo || 
      callReport.extracted_variables || {};

    const fullConversation =
      payload.full_conversation ||
      payload.fullConversation ||
      callReport.full_conversation ||
      '';

    if (!callId) {
      console.error('❌ Webhook payload missing callId.');
      return res.status(400).json({ error: 'Missing callId in payload' });
    }

    // ✅ Store normalized data
    storeInterviewResult(callId, {
      extractedInfo,
      fullConversation,
      timestamp: payload.timestamp || Date.now(),
    });

    console.log(`✅ Successfully stored interview result for callId: ${callId}`);
    res.status(200).json({ message: '✅ Webhook received and processed successfully!' });
  } catch (err) {
    console.error('❌ Webhook processing error:', err);
    res.status(500).json({ error: 'Internal server error while processing webhook' });
  }
});

/**
 * ✅ Debug route to see all raw webhooks
 */
router.get('/debug/webhooks', (req, res) => {
  res.json(getAllWebhooks());
});

export default router;
