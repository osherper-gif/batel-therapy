import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  CORS_ORIGINS: z.string().optional(),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters long"),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(8),
  DATABASE_URL: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().url().optional(),
  GOOGLE_ALLOWED_EMAILS: z.string().optional(),
  GOOGLE_ALLOWED_DOMAIN: z.string().optional(),
  GOOGLE_DEFAULT_ROLE: z.string().default("admin")
});

export const env = envSchema.parse(process.env);
export const isProduction = process.env.NODE_ENV === "production";
export const corsOrigins = (env.CORS_ORIGINS || env.CLIENT_URL)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
