// server/src/index.ts
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";

import { carsRouter } from "./routes/cars";
import { analyticsRouter } from "./routes/analytics";

const app = express();

/* ----------------------------- Config ----------------------------- */
const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST ?? "0.0.0.0"; // bind explicitly for Render
const CORS_ORIGIN = process.env.CORS_ORIGIN;

/* --------------------------- Middleware --------------------------- */
app.use(morgan("dev"));
app.use(express.json());

// Allow all origins in dev if CORS_ORIGIN is not set.
// If you want to restrict, set CORS_ORIGIN=http://localhost:5173 in server/.env
app.use(
  cors(
    CORS_ORIGIN && CORS_ORIGIN !== "*"
      ? { origin: CORS_ORIGIN }
      : { origin: true } // allow all for local dev / wildcard
  )
);

/* ------------------------- Health / Root -------------------------- */
app.get("/", (_req: Request, res: Response) =>
  res.json({ ok: true, service: "autotrackr-api" })
);
app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

/* ----------------------------- Routes ----------------------------- */
app.use("/cars", carsRouter);
app.use("/analytics", analyticsRouter);

/* ------------------------------ 404 -------------------------------- */
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

/* -------------------------- Error Handler ------------------------- */
app.use(
  (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

/* ----------------------------- Start ------------------------------ */
app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://${HOST}:${PORT}`);
});
