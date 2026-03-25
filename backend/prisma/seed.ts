import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { calculateAge } from "../src/utils/date.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME ?? "batel";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: {
      passwordHash,
      role: "admin"
    },
    create: {
      username,
      passwordHash,
      role: "admin"
    }
  });

  const patient = await prisma.patient.upsert({
    where: { id: "seed-patient-noa" },
    update: {},
    create: {
      id: "seed-patient-noa",
      fullName: "Noa Levi",
      dateOfBirth: new Date("2016-05-18"),
      age: calculateAge("2016-05-18"),
      educationalFramework: "Dekalim Elementary School",
      frameworkType: "School",
      treatmentFramework: "Mixed",
      mainConcerns: "Emotional regulation, transitions, and expressing feelings during overload.",
      treatmentGoals: "Support emotional expression, flexibility, and self-soothing skills.",
      status: "Active"
    }
  });

  const contact = await prisma.contact.upsert({
    where: { id: "seed-contact-mother" },
    update: {},
    create: {
      id: "seed-contact-mother",
      fullName: "Michal Levi",
      role: "Mother",
      phone: "050-1234567",
      email: "michal@example.com",
      preferredLanguage: "Hebrew",
      generalNotes: "Usually available in the evening."
    }
  });

  await prisma.patientContact.upsert({
    where: {
      patientId_contactId: {
        patientId: patient.id,
        contactId: contact.id
      }
    },
    update: {},
    create: {
      patientId: patient.id,
      contactId: contact.id,
      relationshipToPatient: "Mother",
      involvementStatus: "Active",
      sharingConsent: true,
      notes: "Primary family contact."
    }
  });

  await prisma.session.upsert({
    where: { id: "seed-session-1" },
    update: {},
    create: {
      id: "seed-session-1",
      patientId: patient.id,
      date: new Date("2026-03-20"),
      startTime: "14:00",
      durationMinutes: 45,
      sessionType: "Art Therapy",
      frameworkType: "School",
      location: "School therapy room",
      attendees: "Patient only",
      goal: "Build trust and assess how safe the room feels for the child.",
      sessionDescription: "Used watercolor materials and chose images related to home and family.",
      materialsUsed: "Watercolors, heavy paper, paint brushes",
      behaviorNotes: "Cooperated after a short hesitation.",
      clinicalImpression: "Separation sensitivity was noticeable alongside curiosity and persistence.",
      followUpNotes: "Continue exploring the theme of a safe place."
    }
  });

  await prisma.document.upsert({
    where: { id: "seed-document-intake" },
    update: {},
    create: {
      id: "seed-document-intake",
      patientId: patient.id,
      contactId: contact.id,
      title: "Intake Summary",
      documentType: "Intake",
      sourceType: "Parent",
      authorName: "Batel",
      tags: "intake,school",
      filePath: "uploads/documents/sample-intake.txt",
      notes: "Sample file linked to the seed data."
    }
  });

  await prisma.image.upsert({
    where: { id: "seed-image-artwork" },
    update: {},
    create: {
      id: "seed-image-artwork",
      patientId: patient.id,
      sessionId: "seed-session-1",
      title: "Opening Artwork",
      description: "Artwork documentation from the first session.",
      imageType: "Artwork",
      filePath: "uploads/images/sample-artwork.txt",
      notes: "Placeholder file until a real image is uploaded."
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
