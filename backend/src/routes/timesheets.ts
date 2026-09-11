import express, { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest, requireRole } from "../middleware/auth.js";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get timesheets
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { userId, status, weekStartDate } = req.query;

    const timesheets = await prisma.timesheet.findMany({
      where: {
        ...(userId && { userId: userId as string }),
        ...(status && { status: status as string }),
        ...(weekStartDate && { weekStartDate: new Date(weekStartDate as string) }),
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        entries: true,
        changeRequests: true,
      },
      orderBy: { weekStartDate: "desc" },
    });

    res.json(timesheets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch timesheets" });
  }
});

// Get user's timesheets
router.get("/user/my-timesheets", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    const timesheets = await prisma.timesheet.findMany({
      where: {
        userId: req.user.id,
        ...(status && { status: status as string }),
      },
      include: {
        entries: true,
        changeRequests: true,
      },
      orderBy: { weekStartDate: "desc" },
    });

    res.json(timesheets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch timesheets" });
  }
});

// Get timesheet by ID
router.get("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const timesheet = await prisma.timesheet.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        entries: true,
        changeRequests: true,
      },
    });

    if (!timesheet) {
      return res.status(404).json({ error: "Timesheet not found" });
    }

    res.json(timesheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch timesheet" });
  }
});

// Create timesheet
router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { weekStartDate, weekEndDate } = req.body;

    const timesheet = await prisma.timesheet.create({
      data: {
        userId: req.user.id,
        weekStartDate: new Date(weekStartDate),
        weekEndDate: new Date(weekEndDate),
      },
    });

    res.status(201).json(timesheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create timesheet" });
  }
});

// Add timesheet entry
router.post("/:timesheetId/entries", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { timesheetId } = req.params;
    const { date, startTime, endTime, category, notes } = req.body;

    const entry = await prisma.timesheetEntry.create({
      data: {
        timesheetId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        hours: calculateHours(new Date(startTime), new Date(endTime)),
        category,
        notes,
      },
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add timesheet entry" });
  }
});

// Submit timesheet
router.patch("/:id/submit", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const timesheet = await prisma.timesheet.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      include: { entries: true },
    });

    res.json(timesheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit timesheet" });
  }
});

// Approve timesheet
router.patch("/:id/approve", authenticateToken, requireRole(["ADMIN", "MANAGER", "SUPERVISOR"]), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const timesheet = await prisma.timesheet.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        approvedBy: req.user.id,
      },
    });

    res.json(timesheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to approve timesheet" });
  }
});

// Reject timesheet
router.patch("/:id/reject", authenticateToken, requireRole(["ADMIN", "MANAGER", "SUPERVISOR"]), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    const timesheet = await prisma.timesheet.update({
      where: { id },
      data: {
        status: "REJECTED",
        comments,
      },
    });

    res.json(timesheet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reject timesheet" });
  }
});

// Request change to timesheet
router.post("/:timesheetId/change-requests", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { timesheetId } = req.params;
    const { reason, changedField, oldValue, newValue } = req.body;

    const changeRequest = await prisma.timesheetChangeRequest.create({
      data: {
        timesheetId,
        userId: req.user.id,
        reason,
        changedField,
        oldValue,
        newValue,
      },
    });

    res.status(201).json(changeRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create change request" });
  }
});

// Get change requests
router.get("/:timesheetId/change-requests", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { timesheetId } = req.params;

    const changeRequests = await prisma.timesheetChangeRequest.findMany({
      where: { timesheetId },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
    });

    res.json(changeRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch change requests" });
  }
});

// Approve change request
router.patch("/change-requests/:id/approve", authenticateToken, requireRole(["ADMIN", "MANAGER", "SUPERVISOR"]), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const changeRequest = await prisma.timesheetChangeRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedBy: req.user.id,
        approvedAt: new Date(),
      },
    });

    res.json(changeRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to approve change request" });
  }
});

// Reject change request
router.patch("/change-requests/:id/reject", authenticateToken, requireRole(["ADMIN", "MANAGER", "SUPERVISOR"]), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const changeRequest = await prisma.timesheetChangeRequest.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    res.json(changeRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to reject change request" });
  }
});

function calculateHours(startTime: Date, endTime: Date): number {
  const diff = endTime.getTime() - startTime.getTime();
  return diff / (1000 * 60 * 60);
}

export default router;
