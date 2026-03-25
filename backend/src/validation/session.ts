import { z } from "zod";

export const sessionSchema = z.object({
  patientId: z.string().min(1, "Patient is required."),
  date: z.string().min(1, "Date is required."),
  startTime: z.string().min(1, "Start time is required."),
  durationMinutes: z.coerce.number().int().positive("Duration must be positive."),
  sessionType: z.string().min(1, "Session type is required."),
  frameworkType: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  attendees: z.string().optional().or(z.literal("")),
  goal: z.string().optional().or(z.literal("")),
  sessionDescription: z.string().optional().or(z.literal("")),
  materialsUsed: z.string().optional().or(z.literal("")),
  behaviorNotes: z.string().optional().or(z.literal("")),
  clinicalImpression: z.string().optional().or(z.literal("")),
  followUpNotes: z.string().optional().or(z.literal(""))
});
