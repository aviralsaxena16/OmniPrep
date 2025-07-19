import axios from 'axios';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { connectDB, closeDB } from './db.js';
import { requireAuth } from "@clerk/express";
import userRoutes from './routes/user.js';
import webhookRoutes from './routes/webhook.js';
import interviewRoutes from './routes/interview.js';
import User from './models/User.js';
import Interview from './models/Interview.js';

const app = express();

/* ======================================================
   ✅ Middleware & Config
====================================================== */
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.includes('/api/webhooks/omnidimension')) {
        req.rawBody = buf.toString();
      }
    },
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

connectDB();

/* ======================================================
   🔔 Interview Reminder Logic
====================================================== */
const activeNotifications = new Map();
cron.schedule('* * * * *', async () => {
  try {
    const users = await User.find({});
    const now = new Date();
    for (const user of users) {
      for (const interview of user.upcomingInterviews) {
        if (interview.done) continue;
        const interviewDateTime = new Date(
          `${interview.interviewDate.toISOString().split('T')[0]}T${interview.interviewTime}:00`
        );
        const timeDiff = interviewDateTime - now;
        const twoMinutes = 2 * 60 * 1000;
        if (timeDiff > twoMinutes - 30000 && timeDiff < twoMinutes + 30000) {
          const notificationId = `${user.email}-${interview._id}`;
          if (!activeNotifications.has(notificationId)) {
            activeNotifications.set(notificationId, {
              email: user.email,
              interview,
              timestamp: now,
            });
            console.log(`🔔 Reminder for ${user.email}: ${interview.company} - ${interview.jobRole}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking interviews:', error);
  }
});

app.get('/api/notifications/:email', (req, res) => {
  const { email } = req.params;
  const userNotifications = [];
  for (const [notificationId, data] of activeNotifications) {
    if (data.email === email) {
      userNotifications.push({
        id: notificationId,
        interview: data.interview,
        timestamp: data.timestamp,
      });
    }
  }
  res.json(userNotifications);
});

app.delete('/api/notifications/:notificationId', (req, res) => {
  activeNotifications.delete(req.params.notificationId);
  res.json({ success: true });
});

/* ======================================================
   ✅ Routes
====================================================== */
app.use('/', userRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/webhooks', webhookRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

/* ======================================================
   ✅ Start OmniDimension Call (Simplified for Clerk ID flow)
====================================================== */
app.post('/api/start-omnidimension-call', async (req, res) => {
  try {
    const { name, education, experience, job_role, company_name, clerkId } = req.body;

    if (!clerkId) {
      return res.status(400).json({ error: 'Clerk ID is required' });
    }

    if (!process.env.OMNIDIMENSION_API_KEY || !process.env.OMNIDIMENSION_SECRET_KEY) {
      return res.status(500).json({ error: 'OmniDimension credentials are missing' });
    }

    const callId = `call_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const omniRes = await axios.post(
      'https://api.omnidim.io/api/v1/call/start',
      {
        secret_key: process.env.OMNIDIMENSION_SECRET_KEY,
        call_type: 'web_call',
        custom_data: { call_id: callId, name, education, experience, job_role, company_name },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OMNIDIMENSION_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    await Interview.create({
      clerkId,
      callId,
      interviewData: {},
    });

    res.status(200).json({
      success: true,
      message: 'OmniDimension call started successfully',
      data: omniRes.data,
    });
  } catch (error) {
    console.error('❌ Error starting OmniDimension call:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      success: false,
      error: error?.response?.data?.error || 'Unknown error',
      message: error.message,
    });
  }
});

/* ======================================================
   ✅ Error Handler
====================================================== */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString(),
  });
});

/* ======================================================
   ✅ Start Server
====================================================== */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});

const shutdown = () => {
  console.log('🛑 Shutdown signal received, closing server');
  server.close(() => {
    console.log('✅ Server closed');
    closeDB();
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
