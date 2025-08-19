import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import type { Prisma } from "@prisma/client";

export const carsRouter = Router();

/** GET /cars - list cars newest first */
carsRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const cars = await prisma.car.findMany({ orderBy: { createdAt: "desc" } });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cars" });
  }
});

/** POST /cars - create a car */
carsRouter.post(
  "/",
  async (req: Request<unknown, unknown, Prisma.CarCreateInput>, res: Response) => {
    try {
      const data = req.body;
      const created = await prisma.car.create({ data });
      res.status(201).json(created);
    } catch (err) {
      res.status(400).json({ error: "Failed to create car" });
    }
  }
);

/** PUT /cars/:id - update a car */
carsRouter.put(
  "/:id",
  async (
    req: Request<{ id: string }, unknown, Prisma.CarUpdateInput>,
    res: Response
  ) => {
    const { id } = req.params;
    try {
      const updated = await prisma.car.update({ where: { id }, data: req.body });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: "Failed to update car" });
    }
  }
);

/** DELETE /cars/:id - delete a car */
carsRouter.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.car.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: "Failed to delete car" });
  }
});