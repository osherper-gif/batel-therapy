import { z } from "zod";

export const patientSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  educationalFramework: z.string().optional().or(z.literal("")),
  frameworkType: z.string().optional().or(z.literal("")),
  treatmentFramework: z.enum(["Matiya", "Private", "Mixed"]),
  mainConcerns: z.string().optional().or(z.literal("")),
  treatmentGoals: z.string().optional().or(z.literal("")),
  status: z.string().min(1, "Status is required.")
});

export type PatientInput = z.infer<typeof patientSchema>;
