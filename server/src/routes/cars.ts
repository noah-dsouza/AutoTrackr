import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const carsRouter = Router();

const toNum = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/* GET /cars */
carsRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const cars = await prisma.car.findMany({ orderBy: { createdAt: "desc" } });
    res.json(cars);
  } catch (err) {
    console.error("GET /cars failed", err);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

/* POST /cars */
carsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const b = req.body ?? {};
    const created = await prisma.car.create({
      data: {
        make: String(b.make ?? ""),
        model: String(b.model ?? ""),
        year: toNum(b.year),
        price: toNum(b.price),
        mileage: toNum(b.mileage),
        color: String(b.color ?? ""),
        status: (b.status ?? "available") as "available" | "pending" | "sold",
        vin: String(b.vin ?? ""),
        description: String(b.description ?? ""),
        imageUrl: String(b.imageUrl ?? ""),
      },
    });
    res.status(201).json(created);
  } catch (err: any) {
    console.error("POST /cars failed", err);
    res.status(500).json({ error: err?.message || "Failed to create car" });
  }
});

/* PUT /cars/:id */
carsRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const b = req.body ?? {};
    const updated = await prisma.car.update({
      where: { id },
      data: {
        make: b.make,
        model: b.model,
        year: toNum(b.year),
        price: toNum(b.price),
        mileage: toNum(b.mileage),
        color: b.color,
        status: (b.status ?? "available") as "available" | "pending" | "sold",
        vin: b.vin,
        description: b.description,
        imageUrl: b.imageUrl,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error("PUT /cars failed", err);
    res.status(500).json({ error: "Failed to update car" });
  }
});

/* DELETE /cars/:id */
carsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.car.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error("DELETE /cars failed", err);
    res.status(500).json({ error: "Failed to delete car" });
  }
});
