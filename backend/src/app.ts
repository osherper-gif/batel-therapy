import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import path from "node:path";
import { corsOrigins, env, isProduction } from "./config.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authRouter } from "./routes/auth.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { patientsRouter } from "./routes/patients.js";
import { stakeholdersRouter } from "./routes/stakeholders.js";
import { sessionsRouter } from "./routes/sessions.js";
import { filesRouter } from "./routes/files.js";
import { publicAssetsRouter } from "./routes/public-assets.js";
import { uploadsPath } from "./uploads.js";

export const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", requireAuth, express.static(uploadsPath));

app.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "batel-api",
    environment: isProduction ? "production" : "development",
    timestamp: new Date().toISOString()
  });
});

app.use("/public", publicAssetsRouter);
app.use("/api/auth", authRouter);
app.use("/api/dashboard", requireAuth, dashboardRouter);
app.use("/api/patients", requireAuth, patientsRouter);
app.use("/api/stakeholders", requireAuth, stakeholdersRouter);
app.use("/api/sessions", requireAuth, sessionsRouter);
app.use("/api/files", requireAuth, filesRouter);

if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.resolve(process.cwd(), "..", "frontend", "dist");
  const frontendIndexPath = path.join(frontendDistPath, "index.html");

  if (fs.existsSync(frontendIndexPath)) {
    app.use(express.static(frontendDistPath));

    app.get(/^(?!\/api|\/uploads).*/, (_request, response) => {
      response.sendFile(frontendIndexPath);
    });
  }
}

app.use(errorHandler);
