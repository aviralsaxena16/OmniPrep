import express from 'express';
import cors from 'cors';
import { connectDB, closeDB } from './db.js';
import userRoutes from './routes/user.js';
import webhookRoutes from './routes/webhook.js';
import interviewRoutes from './routes/interview.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Connect to DB
connectDB();

// Routes - FIX: Make sure these paths are correct
app.use("/api/users", userRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/interviews", interviewRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});