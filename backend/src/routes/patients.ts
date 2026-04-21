import { Router } from "express";
import { prisma } from "../db.js";
import { calculateAge } from "../utils/date.js";
import { patientSchema } from "../validation/patient.js";

export const patientsRouter = Router();

patientsRouter.get("/", async (_request, response) => {
  const patients = await prisma.patient.findMany({
    orderBy: { updatedAt: "desc" }
  });

  return response.json({ patients });
});

patientsRouter.get("/:id", async (request, response) => {
  const patient = await prisma.patient.findUnique({
    where: { id: request.params.id },
    include: {
      patientContacts: {
        orderBy: {
          contact: {
            fullName: "asc"
          }
        },
        include: {
          contact: true
        }
      },
      sessions: { orderBy: { date: "desc" } },
      documents: { orderBy: { uploadedAt: "desc" } },
      images: { orderBy: { uploadedAt: "desc" } }
    }
  });

  if (!patient) {
    return response.status(404).json({ message: "Patient not found." });
  }

  return response.json({ patient });
});

patientsRouter.post("/", async (request, response) => {
  const payload = patientSchema.parse(request.body);

  const patient = await prisma.patient.create({
    data: {
      ...payload,
      dateOfBirth: new Date(payload.dateOfBirth),
      age: calculateAge(payload.dateOfBirth),
      educationalFramework: payload.educationalFramework || null,
      frameworkType: payload.frameworkType || null,
      mainConcerns: payload.mainConcerns || null,
      treatmentGoals: payload.treatmentGoals || null
    }
  });

  return response.status(201).json({ patient });
});

patientsRouter.put("/:id", async (request, response) => {
  const payload = patientSchema.parse(request.body);

  const patient = await prisma.patient.update({
    where: { id: request.params.id },
    data: {
      ...payload,
      dateOfBirth: new Date(payload.dateOfBirth),
      age: calculateAge(payload.dateOfBirth),
      educationalFramework: payload.educationalFramework || null,
      frameworkType: payload.frameworkType || null,
      mainConcerns: payload.mainConcerns || null,
      treatmentGoals: payload.treatmentGoals || null
    }
  });

  return response.json({ patient });
});

patientsRouter.delete("/:id", async (request, response) => {
  await prisma.patient.delete({
    where: { id: request.params.id }
  });

  return response.status(204).send();
});
