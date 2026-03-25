import bcrypt from "bcryptjs";
import { prisma } from "../db.js";
import { env } from "../config.js";

export async function ensureAdminUser() {
  const existingUser = await prisma.user.findUnique({
    where: {
      username: env.ADMIN_USERNAME
    }
  });

  if (existingUser) {
    return;
  }

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

  await prisma.user.create({
    data: {
      username: env.ADMIN_USERNAME,
      passwordHash,
      role: "admin"
    }
  });

  console.log(`Created admin user: ${env.ADMIN_USERNAME}`);
}
