import express, { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest, requireRole } from "../middleware/auth.js";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all schedules
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        createdByUser: { select: { firstName: true, lastName: true } },
        entries: true,
      },
      orderBy: { startDate: "desc" },
    });

    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch schedules" });
  }
});

// Get schedule by ID
router.get("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        createdByUser: { select: { firstName: true, lastName: true } },
        entries: true,
      },
    });

    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

// Create schedule
router.post("/", authenticateToken, requireRole(["ADMIN", "MANAGER"]), async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate } = req.body;

    const schedule = await prisma.schedule.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdByUserId: req.user.id,
      },
    });

    res.status(201).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create schedule" });
  }
});

// Add entry to schedule
router.post("/:scheduleId/entries", authenticateToken, requireRole(["ADMIN", "MANAGER"]), async (req: AuthRequest, res: Response) => {
  try {
    const { scheduleId } = req.params;
    const { startTime, endTime, title, description } = req.body;

    const entry = await prisma.scheduleEntry.create({
      data: {
        scheduleId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        title,
        description,
      },
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add schedule entry" });
  }
});

// Update schedule
router.patch("/:id", authenticateToken, requireRole(["ADMIN", "MANAGER"]), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;

    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
      include: {
        createdByUser: { select: { firstName: true, lastName: true } },
        entries: true,
      },
    });

    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update schedule" });
  }
});

// Delete schedule
router.delete("/:id", authenticateToken, requireRole(["ADMIN", "MANAGER"]), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.schedule.delete({ where: { id } });

    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete schedule" });
  }
});

export default router;
