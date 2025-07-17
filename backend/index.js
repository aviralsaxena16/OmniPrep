import axios from 'axios';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { connectDB, closeDB } from './db.js';
import userRoutes from './routes/user.js';
import webhookRoutes from './routes/webhook.js';
import interviewRoutes from './routes/interview.js';
import User from './models/User.js';

const app = express();

// ✅ Raw body only for OmniDimension webhook verification
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

// ✅ CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ Connect to DB
connectDB();

// ✅ Interview Reminder Logic
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

// ✅ Notification Routes
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
  const { notificationId } = req.params;
  activeNotifications.delete(notificationId);
  res.json({ success: true });
});

// ✅ Global Logging (Disable in production)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    if (req.originalUrl.includes('/api/webhooks/omnidimension')) {
      console.log('🔹 Raw Body:', req.rawBody || '(no raw body captured)');
    }
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('🔹 Parsed Body:', JSON.stringify(req.body, null, 2));
    }
    next();
  });
}

// ✅ Routes
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

// ✅ Test API
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
  });
});

// ✅ Start OmniDimension Call
app.post('/api/start-omnidimension-call', async (req, res) => {
  try {
    const { call_id, name, education, experience, job_role, company_name } = req.body;

    if (!process.env.OMNIDIMENSION_API_KEY || !process.env.OMNIDIMENSION_SECRET_KEY) {
      return res.status(500).json({ error: 'OmniDimension credentials are missing in environment variables' });
    }

    if (!call_id || !name) {
      return res.status(400).json({ error: 'call_id and name are required' });
    }

    const omniRes = await axios.post(
      'https://api.omnidim.io/api/v1/call/start',
      {
        secret_key: process.env.OMNIDIMENSION_SECRET_KEY, // ✅ Correct Key
        call_type: 'web_call',
        custom_data: {
          call_id,
          name,
          education,
          experience,
          job_role,
          company_name
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OMNIDIMENSION_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'OmniDimension call started successfully',
      data: omniRes.data
    });
  } catch (error) {
    console.error('❌ Error starting OmniDimension call:', error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      success: false,
      error: error?.response?.data?.error || 'Unknown error',
      message: error.message
    });
  }
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString(),
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});

// ✅ Graceful Shutdown
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
