// src/routes/cars.ts
import { Router } from "express";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const carsRouter = Router();

const carSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1886).max(3000),
  price: z.number().nonnegative(),
  mileage: z.number().int().nonnegative(),
  color: z.string().min(1),
  status: z.enum(["available", "sold", "pending"]),
  vin: z.string().min(5), // adjust if you want strict VIN regex
  description: z.string().default(""),
  imageUrl: z.string().url(),
});

carsRouter.get("/", async (_req, res) => {
  const cars = await prisma.car.findMany({ orderBy: { createdAt: "desc" } });
  res.json(cars);
});

carsRouter.get("/:id", async (req, res) => {
  const car = await prisma.car.findUnique({ where: { id: req.params.id } });
  if (!car) return res.status(404).json({ error: "Not found" });
  res.json(car);
});

carsRouter.post("/", async (req, res) => {
  try {
    const parsed = carSchema.parse(req.body);
    const created = await prisma.car.create({ data: parsed });
    res.status(201).json(created);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", issues: err.issues });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      // unique constraint (likely VIN)
      return res.status(409).json({ error: "VIN already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

carsRouter.put("/:id", async (req, res) => {
  try {
    const parsed = carSchema.parse(req.body);
    const updated = await prisma.car.update({
      where: { id: req.params.id },
      data: parsed,
    });
    res.json(updated);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", issues: err.issues });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") return res.status(409).json({ error: "VIN already exists" });
      if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

carsRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.car.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ error: "Not found" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
