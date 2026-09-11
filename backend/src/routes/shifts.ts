import express, { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest, requireRole } from "../middleware/auth.js";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all shift types
router.get("/types", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const shiftTypes = await prisma.shiftType.findMany();
    res.json(shiftTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch shift types" });
  }
});

// Create shift type
router.post("/types", authenticateToken, requireRole(["ADMIN"]), async (req: AuthRequest, res: Response) => {
  try {
    const { name, startTime, endTime, description } = req.body;

    const shiftType = await prisma.shiftType.create({
      data: { name, startTime, endTime, description },
    });

    res.status(201).json(shiftType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create shift type" });
  }
});

// Get all shifts
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate, teamId, departmentId } = req.query;

    const shifts = await prisma.shift.findMany({
      where: {
        ...(startDate && endDate && { date: { gte: new Date(startDate as string), lte: new Date(endDate as string) } }),
        ...(teamId && { teamId: teamId as string }),
        ...(departmentId && { departmentId: departmentId as string }),
      },
      include: {
        team: true,
        department: true,
        shiftType: true,
        assignments: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
      },
      orderBy: { date: "asc" },
    });

    res.json(shifts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch shifts" });
  }
});

// Get shift by ID
router.get("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const shift = await prisma.shift.findUnique({
      where: { id },
      include: {
        team: true,
        department: true,
        shiftType: true,
        assignments: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } },
      },
    });

    if (!shift) {
      return res.status(404).json({ error: "Shift not found" });
    }

    res.json(shift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch shift" });
  }
});

// Create shift
router.post("/", authenticateToken, requireRole(["ADMIN", "MANAGER", "SUPERVISOR"]), async (req: AuthRequest, res: Response) => {
  try {
    const { teamId, departmentId, shiftTypeId, date, minStaff = 1 } = req.body;

    const shift = await prisma.shift.create({
      data: {
        teamId,
        departmentId,
        shiftTypeId,
        date: new Date(date),
        minStaff,
      },
      include: { team: true, department: true, shiftType: true },
    });

    res.status(201).json(shift);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create shift" });
  }
});

// Assign user to shift
router.post("/:shiftId/assign/:userId", authenticateToken, requireRole(["ADMIN", "MANAGER", "SUPERVISOR"]), async (req: AuthRequest, res: Response) => {
  try {
    const { shiftId, userId } = req.params;

    const assignment = await prisma.shiftAssignment.create({
      data: { shiftId, userId },
      include: { shift: true, user: { select: { id: true, firstName: true, lastName: true } } },
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to assign user to shift" });
  }
});

// Remove user from shift
router.delete("/:shiftId/assign/:userId", authenticateToken, requireRole(["ADMIN", "MANAGER", "SUPERVISOR"]), async (req: AuthRequest, res: Response) => {
  try {
    const { shiftId, userId } = req.params;

    await prisma.shiftAssignment.deleteMany({
      where: { shiftId, userId },
    });

    res.json({ message: "User removed from shift" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove user from shift" });
  }
});

// Get shifts for current user
router.get("/user/my-shifts", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const shifts = await prisma.shift.findMany({
      where: {
        assignments: {
          some: { userId: req.user.id },
        },
        ...(startDate && endDate && { date: { gte: new Date(startDate as string), lte: new Date(endDate as string) } }),
      },
      include: {
        team: true,
        department: true,
        shiftType: true,
        assignments: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
      },
      orderBy: { date: "asc" },
    });

    res.json(shifts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user shifts" });
  }
});

export default router;
