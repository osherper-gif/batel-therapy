import { Router } from "express";
import { prisma } from "../db.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sessionSchema } from "../validation/session.js";

export const sessionsRouter = Router();

sessionsRouter.get("/", asyncHandler(async (_request, response) => {
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
}));

sessionsRouter.post("/", asyncHandler(async (request, response) => {
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
}));

sessionsRouter.put("/:id", asyncHandler(async (request, response) => {
  const sessionId = String(request.params.id);
  const payload = sessionSchema.parse(request.body);

  const session = await prisma.session.update({
    where: { id: sessionId },
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
}));

sessionsRouter.delete("/:id", asyncHandler(async (request, response) => {
  const sessionId = String(request.params.id);
  await prisma.session.delete({
    where: { id: sessionId }
  });

  return response.status(204).send();
}));
