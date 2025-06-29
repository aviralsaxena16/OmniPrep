import express from 'express'
import { connectDB,closeDB } from './db.js';
import userRoutes from './routes/user.js';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // allow your frontend dev server
  credentials: true,               // if using cookies or Clerk JWT (optional but useful)
}));

// connect to DB
connectDB();

// your routes
app.use("/", userRoutes);

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
