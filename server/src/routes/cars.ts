import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const carsRouter = Router();

// GET /cars
carsRouter.get("/", async (_req: Request, res: Response) => {
  const cars = await prisma.car.findMany({ orderBy: { createdAt: "desc" } });
  res.json(cars);
});

// POST /cars
carsRouter.post("/", async (req: Request, res: Response) => {
  const data = req.body as any; // shape validated on client
  const created = await prisma.car.create({ data });
  res.status(201).json(created);
});

// PUT /cars/:id
carsRouter.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body as any;
  const updated = await prisma.car.update({ where: { id }, data });
  res.json(updated);
});

// DELETE /cars/:id
carsRouter.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.car.delete({ where: { id } });
  res.status(204).end();
});