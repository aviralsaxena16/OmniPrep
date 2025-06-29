import axios from 'axios'; // Added axios import
import express from 'express';
import cors from 'cors';
import { connectDB, closeDB } from './db.js';
import userRoutes from './routes/user.js';
import webhookRoutes from './routes/webhook.js';
import interviewRoutes from './routes/interview.js';

const app = express();

// Middleware for webhooks (raw body parsing)
app.use('/api/webhooks', express.raw({ type: 'application/json' }));

// Regular JSON middleware for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Removed duplicate express.json()

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Connect to DB
connectDB();

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/interviews", interviewRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// OmniDimension call endpoint
app.post('/api/start-omnidimension-call', async (req, res) => {
  try {
    const {
      call_id,
      name,
      education,
      experience,
      job_role,
      company_name
    } = req.body;

    // Check env variables
    if (!process.env.OMNIDIMENSION_API_KEY || !process.env.OMNIDIMENSION_AGENT_ID) {
      return res.status(500).json({ 
        error: 'OmniDimension credentials are missing in environment variables' 
      });
    }

    // Input validation
    if (!call_id || !name) {
      return res.status(400).json({ error: 'call_id and name are required' });
    }

    // OmniDimension API Request
    const omniRes = await axios.post(
      'https://api.omnidim.io/api/v1/call/start',
      {
        agent_id: process.env.OMNIDIMENSION_AGENT_ID,
        call_type: 'web_call',
        custom_data: {
          name,
          education,
          experience,
          job_role,
          company_name,
          call_id
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
    console.error('Error starting OmniDimension call:', error?.response?.data || error.message);

    const status = error?.response?.status || 500;
    const errorData = error?.response?.data || {};

    res.status(status).json({
      success: false,
      error: errorData.error || 'Unknown error',
      message: error.message,
      status
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
const shutdown = () => {
  console.log('Shutdown signal received, closing server');
  server.close(() => {
    console.log('Server closed');
    closeDB();
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
