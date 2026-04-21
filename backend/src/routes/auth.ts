import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";
import { env } from "../config.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { loginSchema } from "../validation/auth.js";

export const authRouter = Router();

authRouter.post("/login", async (request, response) => {
  const payload = loginSchema.parse(request.body);
  const user = await prisma.user.findUnique({
    where: { username: payload.username }
  });

  if (!user) {
    return response.status(401).json({ message: "Invalid username or password." });
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isPasswordValid) {
    return response.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role
    },
    env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  return response.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
});

authRouter.get("/me", requireAuth, async (request: AuthenticatedRequest, response) => {
  const user = await prisma.user.findUnique({
    where: { id: request.user?.userId },
    select: {
      id: true,
      username: true,
      role: true
    }
  });

  return response.json({ user });
});
