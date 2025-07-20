// import axios from 'axios';
// import express from 'express';
// import cors from 'cors';
// import cron from 'node-cron';
// import { connectDB, closeDB } from './db.js';
// import { requireAuth } from "@clerk/express";
// import userRoutes from './routes/user.js';
// import webhookRoutes from './routes/webhook.js';
// import interviewRoutes from './routes/interview.js';
// import User from './models/User.js';
// import Interview from './models/Interview.js';

// const app = express();

// /* ======================================================
//    ✅ Middleware & Config
// ====================================================== */
// app.use(
//   express.json({
//     verify: (req, res, buf) => {
//       if (req.originalUrl.includes('/api/webhooks/omnidimension')) {
//         req.rawBody = buf.toString();
//       }
//     },
//   })
// );
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// connectDB();

// /* ======================================================
//    🔔 Interview Reminder Logic
// ====================================================== */
// const activeNotifications = new Map();
// cron.schedule('* * * * *', async () => {
//   try {
//     const users = await User.find({});
//     const now = new Date();
//     for (const user of users) {
//       for (const interview of user.upcomingInterviews) {
//         if (interview.done) continue;
//         const interviewDateTime = new Date(
//           `${interview.interviewDate.toISOString().split('T')[0]}T${interview.interviewTime}:00`
//         );
//         const timeDiff = interviewDateTime - now;
//         const twoMinutes = 2 * 60 * 1000;
//         if (timeDiff > twoMinutes - 30000 && timeDiff < twoMinutes + 30000) {
//           const notificationId = `${user.email}-${interview._id}`;
//           if (!activeNotifications.has(notificationId)) {
//             activeNotifications.set(notificationId, {
//               email: user.email,
//               interview,
//               timestamp: now,
//             });
//             console.log(`🔔 Reminder for ${user.email}: ${interview.company} - ${interview.jobRole}`);
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error checking interviews:', error);
//   }
// });

// app.get('/api/notifications/:email', (req, res) => {
//   const { email } = req.params;
//   const userNotifications = [];
//   for (const [notificationId, data] of activeNotifications) {
//     if (data.email === email) {
//       userNotifications.push({
//         id: notificationId,
//         interview: data.interview,
//         timestamp: data.timestamp,
//       });
//     }
//   }
//   res.json(userNotifications);
// });

// app.delete('/api/notifications/:notificationId', (req, res) => {
//   activeNotifications.delete(req.params.notificationId);
//   res.json({ success: true });
// });

// /* ======================================================
//    ✅ Routes
// ====================================================== */
// app.use('/', userRoutes);
// app.use('/api/interviews', interviewRoutes);
// app.use('/api/webhooks', webhookRoutes);

// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'OK',
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//     env: process.env.NODE_ENV || 'development',
//   });
// });

// /* ======================================================
//    ✅ Start OmniDimension Call (Simplified for Clerk ID flow)
// ====================================================== */
// app.post('/api/start-omnidimension-call', async (req, res) => {
//   try {
//     const { callId,name, education, experience, job_role, company_name } = req.body;

    

//     if (!process.env.OMNIDIMENSION_API_KEY || !process.env.OMNIDIMENSION_SECRET_KEY) {
//       return res.status(500).json({ error: 'OmniDimension credentials are missing' });
//     }

//     // const callId = `call_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

//     const omniRes = await axios.post(
//       'https://api.omnidim.io/api/v1/call/start',
//       {
//         secret_key: process.env.OMNIDIMENSION_SECRET_KEY,
//         call_type: 'web_call',
//         custom_data: { call_id: callId ,name, education, experience, job_role, company_name },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OMNIDIMENSION_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

    

//     res.status(200).json({
//       success: true,
//       message: 'OmniDimension call started successfully',
//       data: omniRes.data,
//     });
//   } catch (error) {
//     console.error('❌ Error starting OmniDimension call:', error?.response?.data || error.message);
//     res.status(error?.response?.status || 500).json({
//       success: false,
//       error: error?.response?.data?.error || 'Unknown error',
//       message: error.message,
//     });
//   }
// });

// /* ======================================================
//    ✅ Error Handler
// ====================================================== */
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json({
//     error: 'Internal server error',
//     message: err.message,
//     timestamp: new Date().toISOString(),
//   });
// });

// /* ======================================================
//    ✅ Start Server
// ====================================================== */
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`✅ Health check: http://localhost:${PORT}/health`);
// });

// const shutdown = () => {
//   console.log('🛑 Shutdown signal received, closing server');
//   server.close(() => {
//     console.log('✅ Server closed');
//     closeDB();
//     process.exit(0);
//   });
// };

// process.on('SIGTERM', shutdown);
// process.on('SIGINT', shutdown);

// export default app;
import axios from 'axios';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { connectDB, closeDB } from './db.js';
import userRoutes from './routes/user.js';
import webhookRoutes from './routes/webhook.js';
import interviewRoutes from './routes/interview.js';
import User from './models/User.js';
import Resume from './routes/resume.js';
import dotenv from 'dotenv';
dotenv.config();
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
   📧 Email Configuration
====================================================== */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Add to your .env
    pass: process.env.EMAIL_PASS  // Add to your .env (use app password for Gmail)
  }
});

// Test email configuration on startup
transporter.verify()
  .then(() => console.log('✅ Email transporter configured successfully'))
  .catch((error) => console.error('❌ Email configuration error:', error));

/* ======================================================
   🔔 Notification System
====================================================== */
const activeNotifications = new Map();
const emailsSent = new Set(); // Track sent emails to avoid duplicates

// Send email notification
const sendEmailNotification = async (user, interview) => {
  const emailKey = `${user.email}_${interview._id}_30min`;
  if (emailsSent.has(emailKey)) {
    console.log(`📧 Email already sent for ${emailKey}`);
    return;
  }
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `🎯 Interview Reminder - ${interview.company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">🎯 Interview Reminder</h2>
            <p>Hi <strong>${user.name || 'there'}</strong>,</p>
            <p>Your interview with <strong style="color: #007bff;">${interview.company}</strong> for the role of <strong style="color: #28a745;">${interview.jobRole}</strong> is starting in 30 minutes.</p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${new Date(interview.interviewDate).toDateString()}</p>
              <p style="margin: 5px 0;"><strong>🕒 Time:</strong> ${interview.interviewTime}</p>
              <p style="margin: 5px 0;"><strong>📍 Location:</strong> ${interview.location || 'Online'}</p>
            </div>
            
            ${interview.jobLink ? `<p style="text-align: center; margin: 30px 0;"><a href="${interview.jobLink}" style="background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">🔗 Join Interview</a></p>` : ''}
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">You'll receive another notification 2 minutes before the interview starts.</p>
            <p style="margin-top: 20px;">Good luck! 🚀</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px; text-align: center;">This is an automated reminder from VoiceMirror</p>
          </div>
        </div>
      `
    });
    emailsSent.add(emailKey);
    console.log(`📧 Email sent successfully to ${user.email} for ${interview.company} interview`);
  } catch (error) {
    console.error('❌ Error sending email to', user.email, ':', error.message);
  }
};

// Check for upcoming interviews every minute
cron.schedule('* * * * *', async () => {
  try {
    const users = await User.find({});
    const now = new Date();
    console.log(`🔍 Checking interviews at ${now.toISOString()}`);
    
    for (const user of users) {
      for (const interview of user.upcomingInterviews) {
        if (interview.done) continue;
        
        // Create interview datetime
        const interviewDateTime = new Date(
          `${interview.interviewDate.toISOString().split('T')[0]}T${interview.interviewTime}:00`
        );
        const timeDiff = interviewDateTime - now;
        const minutesUntil = Math.round(timeDiff / (1000 * 60)); // Use Math.round instead of Math.floor
        
        console.log(`⏰ Interview: ${interview.company} - ${minutesUntil} minutes until start`);
        
        // 📧 Send email 25-35 minutes before (wider window to catch the 30-minute mark)
        if (minutesUntil >= 25 && minutesUntil <= 35) {
          const emailKey = `${user.email}_${interview._id}_30min`;
          if (!emailsSent.has(emailKey)) {
            console.log(`📧 Sending 30-min email reminder for ${interview.company} (${minutesUntil} min until)`);
            await sendEmailNotification(user, interview);
          }
        }
        
        // 🔔 Browser notification 1-3 minutes before (wider window)
        if (minutesUntil >= 1 && minutesUntil <= 3) {
          const notificationId = `${user.email}-${interview._id}`;
          if (!activeNotifications.has(notificationId)) {
            activeNotifications.set(notificationId, {
              email: user.email,
              interview,
              timestamp: now,
            });
            console.log(`🔔 2-min browser reminder for ${user.email}: ${interview.company} - ${interview.jobRole}`);
          }
        }
        
        // Clean up old notifications (older than 10 minutes)
        if (timeDiff < -600000) { // 10 minutes after interview started
          const notificationId = `${user.email}-${interview._id}`;
          if (activeNotifications.has(notificationId)) {
            activeNotifications.delete(notificationId);
            console.log(`🧹 Cleaned up old notification for ${interview.company}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error in cron job:', error);
  }
});

/* ======================================================
   🔔 Notification API Routes
====================================================== */
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

// Test email endpoint for debugging
app.post('/api/test-email', async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: '🧪 Email Test',
      html: '<h3>Email configuration is working!</h3><p>If you receive this, your email setup is correct.</p>'
    });
    res.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ======================================================
   ✅ Routes
====================================================== */
app.use('/', userRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/resume', Resume);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

/* ======================================================
   🎯 OmniDimension Call API
====================================================== */
app.post('/api/start-omnidimension-call', async (req, res) => {
  try {
    const { callId, name, education, experience, job_role, company_name } = req.body;

    if (!process.env.OMNIDIMENSION_API_KEY || !process.env.OMNIDIMENSION_SECRET_KEY) {
      return res.status(500).json({ error: 'OmniDimension credentials are missing' });
    }

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
  console.log(`🧪 Test email: POST http://localhost:${PORT}/api/test-email`);
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