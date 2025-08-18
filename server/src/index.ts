import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";

import { carsRouter } from "./routes/cars";
import { analyticsRouter } from "./routes/analytics";

const app = express();

// ---- Config ----
const PORT = Number(process.env.PORT) || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// ---- Middleware ----
app.use(morgan("dev"));
app.use(express.json());

// Allow all origins in dev if CORS_ORIGIN is not set.
// If you want to restrict, set CORS_ORIGIN=http://localhost:5173 in server/.env
app.use(
  cors(
    CORS_ORIGIN
      ? { origin: CORS_ORIGIN }
      : { origin: true } // allow all for local dev
  )
);

// ---- Health / Root ----
app.get("/", (_req, res) => res.json({ ok: true, service: "autotrackr-api" }));
app.get("/health", (_req, res) => res.json({ ok: true }));

// ---- Routes ----
app.use("/cars", carsRouter);
app.use("/analytics", analyticsRouter);

// ---- 404 ----
app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ---- Error Handler ----
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

// ---- Start ----
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
