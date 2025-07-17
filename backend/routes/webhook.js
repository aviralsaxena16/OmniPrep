// routes/webhook.js
import express from 'express';
import {
  storeInterviewResult,
  debugStoreWebhook,
  normalizeResult
} from './store.js';

const router = express.Router();

router.post('/omnidimension', async (req, res) => {
  console.log('--- Raw Webhook Body Received ---');
  console.log(JSON.stringify(req.body, null, 2));
  console.log('---------------------------------');

  try {
    const payload = req.body;
    const callId = payload.call_id || payload.callId;

    // ✅ Always debug-store the raw payload for reference
    debugStoreWebhook(callId || `unknown_${Date.now()}`, payload);

    if (!callId) {
      console.error('❌ Missing call_id in webhook payload');
      return res.status(400).json({ error: 'Missing call_id in request body' });
    }

    // ✅ Normalize and store
    const normalized = normalizeResult(payload);
    storeInterviewResult(normalized.callId, normalized);

    console.log(`✅ Successfully stored interview result for callId: ${normalized.callId}`);
    res.status(200).json({ message: '✅ Webhook processed successfully!' });
  } catch (err) {
    console.error('❌ Webhook processing error:', err);
    res.status(500).json({ error: 'Internal server error while processing webhook' });
  }
});

export default router;
