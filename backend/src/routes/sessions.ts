import { Router } from "express";
import { prisma } from "../db.js";
import { sessionSchema } from "../validation/session.js";

export const sessionsRouter = Router();

sessionsRouter.get("/", async (_request, response) => {
  const sessions = await prisma.session.findMany({
    orderBy: { date: "desc" },
    include: {
      patient: {
        select: {
          id: true,
          fullName: true
        }
      }
    }
  });

  return response.json({ sessions });
});

sessionsRouter.post("/", async (request, response) => {
  const payload = sessionSchema.parse(request.body);

  const session = await prisma.session.create({
    data: {
      ...payload,
      date: new Date(payload.date),
      frameworkType: payload.frameworkType || null,
      location: payload.location || null,
      attendees: payload.attendees || null,
      goal: payload.goal || null,
      sessionDescription: payload.sessionDescription || null,
      materialsUsed: payload.materialsUsed || null,
      behaviorNotes: payload.behaviorNotes || null,
      clinicalImpression: payload.clinicalImpression || null,
      followUpNotes: payload.followUpNotes || null
    }
  });

  return response.status(201).json({ session });
});

sessionsRouter.put("/:id", async (request, response) => {
  const payload = sessionSchema.parse(request.body);

  const session = await prisma.session.update({
    where: { id: request.params.id },
    data: {
      ...payload,
      date: new Date(payload.date),
      frameworkType: payload.frameworkType || null,
      location: payload.location || null,
      attendees: payload.attendees || null,
      goal: payload.goal || null,
      sessionDescription: payload.sessionDescription || null,
      materialsUsed: payload.materialsUsed || null,
      behaviorNotes: payload.behaviorNotes || null,
      clinicalImpression: payload.clinicalImpression || null,
      followUpNotes: payload.followUpNotes || null
    }
  });

  return response.json({ session });
});

sessionsRouter.delete("/:id", async (request, response) => {
  await prisma.session.delete({
    where: { id: request.params.id }
  });

  return response.status(204).send();
});
