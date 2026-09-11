import express, { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest, requireRole } from "../middleware/auth.js";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all departments
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: { select: { employees: true, members: true } },
      },
    });

    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

// Get department by ID
router.get("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        employees: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        },
        members: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        },
        teams: true,
      },
    });

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch department" });
  }
});

// Create department
router.post("/", authenticateToken, requireRole(["ADMIN", "MANAGER"]), async (req: AuthRequest, res: Response) => {
  try {
    const { name, code } = req.body;

    const department = await prisma.department.create({
      data: { name, code },
    });

    res.status(201).json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create department" });
  }
});

// Add user to department
router.post("/:departmentId/members/:userId", authenticateToken, requireRole(["ADMIN", "MANAGER"]), async (req: AuthRequest, res: Response) => {
  try {
    const { departmentId, userId } = req.params;
    const { isPrimary = false } = req.body;

    const member = await prisma.departmentMember.create({
      data: { userId, departmentId, isPrimary },
    });

    res.status(201).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add member to department" });
  }
});

export default router;
