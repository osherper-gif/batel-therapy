import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import { prisma } from "../db.js";
import { documentSchema, imageSchema } from "../validation/file-record.js";
import { documentUpload, imageUpload, uploadsPath } from "../uploads.js";

export const filesRouter = Router();

filesRouter.get("/documents", async (_request, response) => {
  const documents = await prisma.document.findMany({
    orderBy: { uploadedAt: "desc" },
    include: {
      patient: { select: { id: true, fullName: true } },
      contact: { select: { id: true, fullName: true } }
    }
  });

  return response.json({ documents });
});

filesRouter.get("/images", async (_request, response) => {
  const images = await prisma.image.findMany({
    orderBy: { uploadedAt: "desc" },
    include: {
      patient: { select: { id: true, fullName: true } },
      session: { select: { id: true, date: true } }
    }
  });

  return response.json({ images });
});

filesRouter.post("/documents", documentUpload.single("file"), async (request, response) => {
  if (!request.file) {
    return response.status(400).json({ message: "A document file is required." });
  }

  const payload = documentSchema.parse(request.body);
  const relativeFilePath = path.relative(path.resolve(process.cwd(), "backend"), request.file.path).replaceAll("\\", "/");

  const document = await prisma.document.create({
    data: {
      patientId: payload.patientId,
      contactId: payload.stakeholderId || null,
      title: payload.title,
      documentType: payload.documentType,
      sourceType: payload.sourceType || null,
      authorName: payload.authorName || null,
      tags: payload.tags || null,
      notes: payload.notes || null,
      filePath: relativeFilePath
    }
  });

  return response.status(201).json({ document });
});

filesRouter.post("/images", imageUpload.single("file"), async (request, response) => {
  if (!request.file) {
    return response.status(400).json({ message: "An image file is required." });
  }

  const payload = imageSchema.parse(request.body);
  const relativeFilePath = path.relative(path.resolve(process.cwd(), "backend"), request.file.path).replaceAll("\\", "/");

  const image = await prisma.image.create({
    data: {
      patientId: payload.patientId,
      sessionId: payload.sessionId || null,
      title: payload.title,
      description: payload.description || null,
      imageType: payload.imageType,
      capturedAt: payload.capturedAt ? new Date(payload.capturedAt) : null,
      notes: payload.notes || null,
      filePath: relativeFilePath
    }
  });

  return response.status(201).json({ image });
});

filesRouter.delete("/documents/:id", async (request, response) => {
  const document = await prisma.document.delete({
    where: { id: request.params.id }
  });

  const absolutePath = path.join(path.resolve(process.cwd(), "backend"), document.filePath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }

  return response.status(204).send();
});

filesRouter.delete("/images/:id", async (request, response) => {
  const image = await prisma.image.delete({
    where: { id: request.params.id }
  });

  const absolutePath = path.join(path.resolve(process.cwd(), "backend"), image.filePath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }

  return response.status(204).send();
});

export { uploadsPath };
