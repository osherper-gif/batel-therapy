import dotenv from "dotenv";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

async function main() {
  const legacyStakeholders = await prisma.legacyStakeholder.findMany({
    orderBy: { createdAt: "asc" }
  });

  if (!legacyStakeholders.length) {
    console.log("No legacy stakeholder rows found.");
    return;
  }

  let migratedCount = 0;

  for (const legacy of legacyStakeholders) {
    const existingContact = await prisma.contact.findFirst({
      where: {
        fullName: legacy.fullName,
        phone: legacy.phone,
        email: legacy.email
      }
    });

    const contact =
      existingContact ??
      (await prisma.contact.create({
        data: {
          fullName: legacy.fullName,
          role: legacy.role,
          phone: legacy.phone,
          email: legacy.email,
          address: legacy.address,
          preferredLanguage: legacy.preferredLanguage,
          generalNotes: null
        }
      }));

    await prisma.patientContact.upsert({
      where: {
        patientId_contactId: {
          patientId: legacy.patientId,
          contactId: contact.id
        }
      },
      update: {
        relationshipToPatient: legacy.role,
        involvementStatus: legacy.involvementStatus,
        sharingConsent: legacy.sharingConsent,
        notes: legacy.notes
      },
      create: {
        patientId: legacy.patientId,
        contactId: contact.id,
        relationshipToPatient: legacy.role,
        involvementStatus: legacy.involvementStatus,
        sharingConsent: legacy.sharingConsent,
        notes: legacy.notes
      }
    });

    await prisma.document.updateMany({
      where: {
        contactId: legacy.id
      },
      data: {
        contactId: contact.id
      }
    });

    migratedCount += 1;
  }

  console.log(`Migrated ${migratedCount} legacy stakeholder rows into contacts.`);
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
