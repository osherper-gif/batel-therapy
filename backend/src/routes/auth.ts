import crypto from "node:crypto";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";
import { env, isProduction } from "../config.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { loginSchema } from "../validation/auth.js";

export const authRouter = Router();

const GOOGLE_STATE_COOKIE = "batel_google_oauth_state";

function createToken(user: { id: string; username: string; role: string }) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role
    },
    env.JWT_SECRET,
    { expiresIn: "12h" }
  );
}

function redirectToClientLogin(errorMessage?: string, token?: string) {
  const loginUrl = new URL("/login", env.CLIENT_URL);
  if (errorMessage) {
    loginUrl.searchParams.set("googleError", errorMessage);
  }
  if (token) {
    loginUrl.hash = `googleToken=${encodeURIComponent(token)}`;
  }
  return loginUrl.toString();
}

function isGoogleConfigured() {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL);
}

function isAllowedGoogleUser(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const allowedEmails = (env.GOOGLE_ALLOWED_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEmails.length > 0 && allowedEmails.includes(normalizedEmail)) {
    return true;
  }

  if (env.GOOGLE_ALLOWED_DOMAIN) {
    return normalizedEmail.endsWith(`@${env.GOOGLE_ALLOWED_DOMAIN.toLowerCase()}`);
  }

  return allowedEmails.length === 0;
}

async function exchangeGoogleCode(code: string) {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID || "",
      client_secret: env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: env.GOOGLE_CALLBACK_URL || "",
      grant_type: "authorization_code"
    })
  });

  if (!tokenResponse.ok) {
    const payload = await tokenResponse.text();
    throw new Error(`Google token exchange failed: ${payload}`);
  }

  const tokenPayload = (await tokenResponse.json()) as { access_token?: string };
  if (!tokenPayload.access_token) {
    throw new Error("Google token exchange did not return an access token.");
  }

  const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenPayload.access_token}`
    }
  });

  if (!userResponse.ok) {
    const payload = await userResponse.text();
    throw new Error(`Google userinfo lookup failed: ${payload}`);
  }

  const user = (await userResponse.json()) as {
    email?: string;
    name?: string;
  };

  if (!user.email) {
    throw new Error("Google did not return an email address.");
  }

  return user;
}

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

  const token = createToken(user);

  return response.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      authProvider: "local"
    }
  });
});

authRouter.get("/google/start", async (_request, response) => {
  if (!isGoogleConfigured()) {
    return response.redirect(
      redirectToClientLogin(
        "כניסה עם Google עדיין לא הוגדרה. חסרים GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET או GOOGLE_CALLBACK_URL."
      )
    );
  }

  const state = crypto.randomBytes(24).toString("hex");
  response.cookie(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 10 * 60 * 1000
  });

  const authorizeUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizeUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID!);
  authorizeUrl.searchParams.set("redirect_uri", env.GOOGLE_CALLBACK_URL!);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "openid email profile");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("access_type", "offline");
  authorizeUrl.searchParams.set("prompt", "select_account");

  return response.redirect(authorizeUrl.toString());
});

authRouter.get("/google/callback", async (request, response) => {
  try {
    if (!isGoogleConfigured()) {
      return response.redirect(
        redirectToClientLogin(
          "כניסה עם Google עדיין לא הוגדרה. חסרים פרטי client בשרת."
        )
      );
    }

    const code = typeof request.query.code === "string" ? request.query.code : "";
    const state = typeof request.query.state === "string" ? request.query.state : "";
    const cookieState = request.cookies?.[GOOGLE_STATE_COOKIE];

    response.clearCookie(GOOGLE_STATE_COOKIE);

    if (!code) {
      return response.redirect(redirectToClientLogin("Google לא החזיר קוד הרשאה."));
    }

    if (!state || !cookieState || state !== cookieState) {
      return response.redirect(redirectToClientLogin("State לא תקין בכניסה עם Google."));
    }

    const googleUser = await exchangeGoogleCode(code);
    const email = googleUser.email;

    if (!email) {
      return response.redirect(redirectToClientLogin("Google לא החזיר כתובת אימייל תקינה."));
    }

    if (!isAllowedGoogleUser(email)) {
      return response.redirect(
        redirectToClientLogin(`החשבון ${email} אינו מורשה להיכנס דרך Google.`)
      );
    }

    let user = await prisma.user.findUnique({
      where: { username: email.toLowerCase() }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: email.toLowerCase(),
          passwordHash: await bcrypt.hash(crypto.randomUUID(), 10),
          role: env.GOOGLE_DEFAULT_ROLE
        }
      });
    }

    const token = createToken(user);
    return response.redirect(redirectToClientLogin(undefined, token));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Google sign-in failed.";
    return response.redirect(redirectToClientLogin(message));
  }
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
