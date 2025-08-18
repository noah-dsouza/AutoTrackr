import { Router } from "express";
import { prisma } from "../lib/prisma";

export const analyticsRouter = Router();

// Summary metrics
analyticsRouter.get("/summary", async (_req, res) => {
  const [total, available, pending, sold, soldSum] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { status: "available" } }),
    prisma.car.count({ where: { status: "pending" } }),
    prisma.car.count({ where: { status: "sold" } }),
    prisma.car.aggregate({ _sum: { price: true }, where: { status: "sold" } })
  ]);

  const totalRevenue = soldSum._sum.price || 0;
  const avgSellingPrice = sold ? Math.round(totalRevenue / sold) : 0;
  res.json({ totalInventory: total, availableCars: available, pendingCars: pending, soldCars: sold, totalRevenue, avgSellingPrice });
});

// Inventory breakdowns
analyticsRouter.get("/inventory", async (_req, res) => {
  const cars = await prisma.car.findMany({ select: { make: true, status: true } });
  const byMake: Record<string, number> = {};
  const byStatus: Record<string, number> = { available: 0, pending: 0, sold: 0 };

  for (const c of cars) {
    byMake[c.make] = (byMake[c.make] || 0) + 1;
    byStatus[c.status] = (byStatus[c.status] || 0) + 1;
  }
  res.json({ byMake, byStatus });
});

// Time series (YTD monthly)
analyticsRouter.get("/time-series", async (req, res) => {
  const year = Number(req.query.year) || new Date().getFullYear();
  const sold = await prisma.car.findMany({
    where: { status: "sold", soldAt: { gte: new Date(`${year}-01-01`), lt: new Date(`${year + 1}-01-01`) } },
    select: { price: true, soldAt: true }
  });

  const months = Array.from({ length: 12 }, (_, i) => i);
  const series = months.map((m) => ({ month: m + 1, sales: 0, revenue: 0 }));

  for (const s of sold) {
    const m = (s.soldAt as Date).getMonth();
    series[m].sales += 1;
    series[m].revenue += s.price;
  }

  let running = 0;
  const out = series.map((r) => {
    running += r.revenue;
    return { ...r, cumulative: running, avgPrice: r.sales ? Math.round(r.revenue / r.sales) : 0 };
  });

  res.json(out);
});

// Inventory age buckets
analyticsRouter.get("/age-buckets", async (_req, res) => {
  const cars = await prisma.car.findMany({ select: { createdAt: true, status: true } });
  const now = new Date();
  const counts: Record<string, number> = { "<30": 0, "30-60": 0, "60+": 0 };

  for (const c of cars) {
    if (c.status !== "available") continue;
    const days = Math.floor((+now - +c.createdAt) / (1000 * 60 * 60 * 24));
    if (days < 30) counts["<30"]++;
    else if (days < 60) counts["30-60"]++;
    else counts["60+"]++;
  }

  res.json(counts);
});