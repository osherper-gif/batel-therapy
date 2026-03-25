import { Router } from "express";
import { prisma } from "../db.js";

export const dashboardRouter = Router();

dashboardRouter.get("/", async (_request, response) => {
  const [patientsCount, sessionsCount, stakeholdersCount, documentsCount, imagesCount, recentSessions, recentPatients] =
    await Promise.all([
      prisma.patient.count(),
      prisma.session.count(),
      prisma.contact.count(),
      prisma.document.count(),
      prisma.image.count(),
      prisma.session.findMany({
        orderBy: { date: "desc" },
        take: 5,
        include: {
          patient: {
            select: {
              id: true,
              fullName: true
            }
          }
        }
      }),
      prisma.patient.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5
      })
    ]);

  return response.json({
    stats: {
      patientsCount,
      sessionsCount,
      stakeholdersCount,
      documentsCount,
      imagesCount
    },
    recentSessions,
    recentPatients
  });
});
