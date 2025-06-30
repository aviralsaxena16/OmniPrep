import express from 'express';
import { storeInterviewResult } from './store.js'; // Adjust path if needed

const router = express.Router();

// POST /api/webhooks/omnidimension
router.post('/omnidimension', async (req, res) => {
  try {
    let payload;

    // Handle Buffer-wrapped JSON (from some webhook providers)
    if (req.body?.type === 'Buffer' && Array.isArray(req.body.data)) {
      const buffer = Buffer.from(req.body.data);
      payload = JSON.parse(buffer.toString('utf-8'));
    } else {
      payload = req.body;
    }

    console.log('📥 Decoded Webhook Payload:', payload);

    const { call_id, extracted_info, full_conversation } = payload;

    if (!call_id || !extracted_info) {
      return res.status(400).json({ error: 'Missing required fields: call_id or extracted_info' });
    }

    await storeInterviewResult(call_id, {
      extractedInfo: extracted_info,
      fullConversation: full_conversation,
      timestamp: new Date(),
    });

    return res.status(200).json({ message: '✅ Webhook received and stored!' });
  } catch (err) {
    console.error('❌ Webhook processing error:', err);
    return res.status(500).json({ error: 'Failed to process webhook' });
  }
});

export default router;
