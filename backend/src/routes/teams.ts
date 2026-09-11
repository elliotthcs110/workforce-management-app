import express, { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest, requireRole } from "../middleware/auth.js";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all teams
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        department: true,
        members: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        },
      },
    });

    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

// Get team by ID
router.get("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        department: true,
        members: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        },
        shifts: {
          include: {
            shiftType: true,
            assignments: { include: { user: { select: { firstName: true, lastName: true } } } },
          },
        },
      },
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

// Create team
router.post("/", authenticateToken, requireRole(["ADMIN", "MANAGER"]), async (req: AuthRequest, res: Response) => {
  try {
    const { name, departmentId, description } = req.body;

    const team = await prisma.team.create({
      data: { name, departmentId, description },
    });

    res.status(201).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create team" });
  }
});

// Add member to team
router.post("/:teamId/members/:userId", authenticateToken, requireRole(["ADMIN", "MANAGER", "SUPERVISOR"]), async (req: AuthRequest, res: Response) => {
  try {
    const { teamId, userId } = req.params;

    const member = await prisma.teamMember.create({
      data: { teamId, userId },
    });

    res.status(201).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add member to team" });
  }
});

// Remove member from team
router.delete("/:teamId/members/:userId", authenticateToken, requireRole(["ADMIN", "MANAGER", "SUPERVISOR"]), async (req: AuthRequest, res: Response) => {
  try {
    const { teamId, userId } = req.params;

    await prisma.teamMember.deleteMany({
      where: { teamId, userId },
    });

    res.json({ message: "Member removed from team" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove member from team" });
  }
});

export default router;
