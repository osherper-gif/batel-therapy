import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  role: z.string().min(1, "Role is required."),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email.").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  preferredLanguage: z.string().optional().or(z.literal("")),
  generalNotes: z.string().optional().or(z.literal(""))
});

export const patientContactSchema = z.object({
  patientId: z.string().min(1, "Patient is required."),
  contactId: z.string().min(1, "Contact is required."),
  relationshipToPatient: z.string().optional().or(z.literal("")),
  involvementStatus: z.string().optional().or(z.literal("")),
  sharingConsent: z.boolean().default(false),
  notes: z.string().optional().or(z.literal(""))
});

export const createLinkedContactSchema = contactSchema.extend({
  patientId: z.string().min(1, "Patient is required."),
  relationshipToPatient: z.string().optional().or(z.literal("")),
  involvementStatus: z.string().optional().or(z.literal("")),
  sharingConsent: z.boolean().default(false),
  notes: z.string().optional().or(z.literal(""))
});
