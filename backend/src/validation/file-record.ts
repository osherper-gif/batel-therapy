import { z } from "zod";

export const documentSchema = z.object({
  patientId: z.string().min(1, "Patient is required."),
  stakeholderId: z.string().optional().or(z.literal("")),
  title: z.string().min(1, "Title is required."),
  documentType: z.string().min(1, "Document type is required."),
  sourceType: z.string().optional().or(z.literal("")),
  authorName: z.string().optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal(""))
});

export const imageSchema = z.object({
  patientId: z.string().min(1, "Patient is required."),
  sessionId: z.string().optional().or(z.literal("")),
  title: z.string().min(1, "Title is required."),
  description: z.string().optional().or(z.literal("")),
  imageType: z.string().min(1, "Image type is required."),
  capturedAt: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal(""))
});
