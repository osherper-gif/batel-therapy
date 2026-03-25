import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authRouter } from "./routes/auth.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { patientsRouter } from "./routes/patients.js";
import { stakeholdersRouter } from "./routes/stakeholders.js";
import { sessionsRouter } from "./routes/sessions.js";
import { filesRouter } from "./routes/files.js";
import { uploadsPath } from "./uploads.js";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", requireAuth, express.static(uploadsPath));

app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/dashboard", requireAuth, dashboardRouter);
app.use("/api/patients", requireAuth, patientsRouter);
app.use("/api/stakeholders", requireAuth, stakeholdersRouter);
app.use("/api/sessions", requireAuth, sessionsRouter);
app.use("/api/files", requireAuth, filesRouter);

app.use(errorHandler);
