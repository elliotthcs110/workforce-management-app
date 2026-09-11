import express, { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Clock in
router.post("/in", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { departmentId, teamId, shiftId, notes } = req.body;
    const userId = req.user.id;

    // Check if user is already clocked in
    const activeClockLog = await prisma.clockLog.findFirst({
      where: {
        userId,
        clockOutTime: null,
      },
    });

    if (activeClockLog) {
      return res.status(400).json({ error: "User is already clocked in" });
    }

    const clockLog = await prisma.clockLog.create({
      data: {
        userId,
        departmentId,
        teamId,
        shiftId,
        clockInTime: new Date(),
        notes,
      },
    });

    res.status(201).json(clockLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to clock in" });
  }
});

// Clock out
router.post("/out", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { notes } = req.body;
    const userId = req.user.id;

    // Find active clock log
    const activeClockLog = await prisma.clockLog.findFirst({
      where: {
        userId,
        clockOutTime: null,
      },
    });

    if (!activeClockLog) {
      return res.status(400).json({ error: "No active clock in found" });
    }

    // Calculate duration
    const duration = Math.round(
      (new Date().getTime() - activeClockLog.clockInTime.getTime()) / (1000 * 60)
    );

    const clockLog = await prisma.clockLog.update({
      where: { id: activeClockLog.id },
      data: {
        clockOutTime: new Date(),
        duration,
        notes: notes || activeClockLog.notes,
      },
    });

    res.json(clockLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to clock out" });
  }
});

// Transfer to different job (clock out of one, clock in to another)
router.post("/transfer", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { newDepartmentId, newTeamId, newShiftId, notes } = req.body;
    const userId = req.user.id;

    // Find active clock log
    const activeClockLog = await prisma.clockLog.findFirst({
      where: {
        userId,
        clockOutTime: null,
      },
    });

    if (!activeClockLog) {
      return res.status(400).json({ error: "No active clock in found" });
    }

    // Calculate duration for current job
    const duration = Math.round(
      (new Date().getTime() - activeClockLog.clockInTime.getTime()) / (1000 * 60)
    );

    // Clock out of current job
    await prisma.clockLog.update({
      where: { id: activeClockLog.id },
      data: {
        clockOutTime: new Date(),
        duration,
        notes: `Transferred to another job. ${notes || ""}`,
      },
    });

    // Clock in to new job
    const newClockLog = await prisma.clockLog.create({
      data: {
        userId,
        departmentId: newDepartmentId,
        teamId: newTeamId,
        shiftId: newShiftId,
        clockInTime: new Date(),
        notes: `Transferred from previous job`,
      },
    });

    res.status(201).json({
      message: "Successfully transferred to new job",
      previousClockLog: activeClockLog,
      newClockLog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to transfer" });
  }
});

// Get current status (who's clocked in)
router.get("/status/current", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const activeClockLog = await prisma.clockLog.findFirst({
      where: {
        userId: req.user.id,
        clockOutTime: null,
      },
      include: {
        department: { select: { id: true, name: true } },
      },
    });

    if (!activeClockLog) {
      return res.json({ status: "CLOCKED_OUT", clockLog: null });
    }

    const elapsedMinutes = Math.round(
      (new Date().getTime() - activeClockLog.clockInTime.getTime()) / (1000 * 60)
    );

    res.json({
      status: "CLOCKED_IN",
      clockLog: activeClockLog,
      elapsedMinutes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

// Get all clock logs for user
router.get("/user/logs", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const clockLogs = await prisma.clockLog.findMany({
      where: {
        userId: req.user.id,
        ...(startDate && endDate && {
          clockInTime: { gte: new Date(startDate as string), lte: new Date(endDate as string) },
        }),
      },
      include: {
        department: { select: { id: true, name: true } },
      },
      orderBy: { clockInTime: "desc" },
    });

    res.json(clockLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch clock logs" });
  }
});

// Get all active clock logs (who's currently on shift)
router.get("/active/all", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const activeLogs = await prisma.clockLog.findMany({
      where: { clockOutTime: null },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        department: { select: { id: true, name: true } },
      },
      orderBy: { clockInTime: "asc" },
    });

    res.json(activeLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch active clock logs" });
  }
});

export default router;
