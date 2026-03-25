import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    username: string;
    role: string;
  };
}

export function requireAuth(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  const queryToken = typeof request.query.token === "string" ? request.query.token : null;

  if (!header?.startsWith("Bearer ") && !queryToken) {
    return response.status(401).json({ message: "Authentication required." });
  }

  const token = header?.startsWith("Bearer ") ? header.replace("Bearer ", "") : queryToken!;

  try {
    request.user = jwt.verify(token, env.JWT_SECRET) as AuthenticatedRequest["user"];
    return next();
  } catch {
    return response.status(401).json({ message: "Session expired. Please log in again." });
  }
}
