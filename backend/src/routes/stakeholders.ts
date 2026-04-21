import { Prisma, type PrismaClient } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../db.js";
import {
  contactSchema,
  createLinkedContactSchema,
  patientContactSchema
} from "../validation/stakeholder.js";

export const stakeholdersRouter = Router();

stakeholdersRouter.get("/", async (_request, response) => {
  const contacts = await prisma.contact.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      patientContacts: {
        include: {
          patient: {
            select: {
              id: true,
              fullName: true
            }
          }
        },
        orderBy: {
          patient: {
            fullName: "asc"
          }
        }
      }
    }
  });

  return response.json({ contacts });
});

stakeholdersRouter.post("/", async (request, response) => {
  const payload = contactSchema.parse(request.body);

  const contact = await prisma.contact.create({
    data: {
      fullName: payload.fullName,
      role: payload.role,
      phone: payload.phone || null,
      email: payload.email || null,
      address: payload.address || null,
      preferredLanguage: payload.preferredLanguage || null,
      generalNotes: payload.generalNotes || null
    }
  });

  return response.status(201).json({ contact });
});

stakeholdersRouter.put("/:id", async (request, response) => {
  const payload = contactSchema.parse(request.body);

  const contact = await prisma.contact.update({
    where: { id: request.params.id },
    data: {
      fullName: payload.fullName,
      role: payload.role,
      phone: payload.phone || null,
      email: payload.email || null,
      address: payload.address || null,
      preferredLanguage: payload.preferredLanguage || null,
      generalNotes: payload.generalNotes || null
    }
  });

  return response.json({ contact });
});

stakeholdersRouter.delete("/:id", async (request, response) => {
  await prisma.contact.delete({
    where: { id: request.params.id }
  });

  return response.status(204).send();
});

stakeholdersRouter.post("/links", async (request, response) => {
  const payload = patientContactSchema.parse(request.body);

  const link = await prisma.patientContact.create({
    data: {
      patientId: payload.patientId,
      contactId: payload.contactId,
      relationshipToPatient: payload.relationshipToPatient || null,
      involvementStatus: payload.involvementStatus || null,
      sharingConsent: payload.sharingConsent,
      notes: payload.notes || null
    },
    include: {
      contact: true,
      patient: {
        select: {
          id: true,
          fullName: true
        }
      }
    }
  });

  return response.status(201).json({ link });
});

stakeholdersRouter.post("/create-and-link", async (request, response) => {
  const payload = createLinkedContactSchema.parse(request.body);

  const result = await prisma.$transaction(
    async (transaction: Prisma.TransactionClient) => {
      const contact = await transaction.contact.create({
        data: {
          fullName: payload.fullName,
          role: payload.role,
          phone: payload.phone || null,
          email: payload.email || null,
          address: payload.address || null,
          preferredLanguage: payload.preferredLanguage || null,
          generalNotes: payload.generalNotes || null
        }
      });

      const link = await transaction.patientContact.create({
        data: {
          patientId: payload.patientId,
          contactId: contact.id,
          relationshipToPatient: payload.relationshipToPatient || null,
          involvementStatus: payload.involvementStatus || null,
          sharingConsent: payload.sharingConsent,
          notes: payload.notes || null
        },
        include: {
          contact: true,
          patient: {
            select: {
              id: true,
              fullName: true
            }
          }
        }
      });

      return { contact, link };
    }
  );

  return response.status(201).json(result);
});

stakeholdersRouter.put("/links/:id", async (request, response) => {
  const payload = patientContactSchema
    .partial({
      patientId: true,
      contactId: true
    })
    .parse(request.body);

  const link = await prisma.patientContact.update({
    where: { id: request.params.id },
    data: {
      relationshipToPatient: payload.relationshipToPatient || null,
      involvementStatus: payload.involvementStatus || null,
      sharingConsent: payload.sharingConsent ?? false,
      notes: payload.notes || null
    },
    include: {
      contact: true,
      patient: {
        select: {
          id: true,
          fullName: true
        }
      }
    }
  });

  return response.json({ link });
});

stakeholdersRouter.delete("/links/:id", async (request, response) => {
  await prisma.patientContact.delete({
    where: { id: request.params.id }
  });

  return response.status(204).send();
});
