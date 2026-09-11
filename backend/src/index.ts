import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Import routes (will be created next)
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import departmentRoutes from "./routes/departments.js";
import teamRoutes from "./routes/teams.js";
import shiftRoutes from "./routes/shifts.js";
import clockLogRoutes from "./routes/clockLogs.js";
import timesheetRoutes from "./routes/timesheets.js";
import scheduleRoutes from "./routes/schedules.js";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/clock-logs", clockLogRoutes);
app.use("/api/timesheets", timesheetRoutes);
app.use("/api/schedules", scheduleRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
