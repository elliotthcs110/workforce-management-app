import express, { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest, requireRole } from "../middleware/auth.js";

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all employees (for employee log)
router.get("/employees", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const employees = await prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        employeeProfile: {
          select: {
            employeeId: true,
            department: { select: { id: true, name: true } },
            hireDate: true,
            employmentStatus: true,
          },
        },
      },
    });

    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Get user profile
router.get("/profile", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        employeeProfile: {
          select: {
            employeeId: true,
            department: { select: { id: true, name: true } },
            hireDate: true,
            employmentStatus: true,
          },
        },
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Get all departments for a user
router.get("/:userId/departments", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const departments = await prisma.departmentMember.findMany({
      where: { userId },
      select: {
        department: true,
        isPrimary: true,
      },
    });

    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

export default router;
