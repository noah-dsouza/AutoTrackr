import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const analyticsRouter = Router();

/** GET /analytics - simple inventory metrics */
analyticsRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const cars = await prisma.car.findMany();

    const sold = cars.filter((c) => c.status === "sold");
    const available = cars.filter((c) => c.status === "available");
    const pending = cars.filter((c) => c.status === "pending");

    const totalRevenue = sold.reduce((sum, c) => sum + c.price, 0);

    res.json({
      total: cars.length,
      sold: sold.length,
      available: available.length,
      pending: pending.length,
      totalRevenue,
    });
  } catch (_err) {
    res.status(500).json({ error: "Failed to compute analytics" });
  }
});
