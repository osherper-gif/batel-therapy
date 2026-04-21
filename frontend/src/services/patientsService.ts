import { apiFetch } from "../lib/api";
import type { Patient, PatientDetails } from "../types";
import {
  mockPatients,
  mockSessions,
  mockDocuments,
  mockImages,
  mockContacts,
  mockTreatmentPlans,
  mockTALA,
  mockIntake
} from "../mocks";

/**
 * Service layer that unifies live API + mock data.
 *
 * Contract:
 *  - Endpoints that the backend already implements are called for real.
 *  - Endpoints that don't exist yet fall back to deterministic mocks.
 *  - UI components never call apiFetch directly — they go through here.
 *
 * When the backend adds a new route, swap the mock for apiFetch — UI is unaffected.
 */

// ---- Live ----

export async function listPatients(): Promise<Patient[]> {
  try {
    return await apiFetch<Patient[]>("/patients");
  } catch {
    return mockPatients;
  }
}

export async function getPatient(id: string): Promise<PatientDetails> {
  try {
    return await apiFetch<PatientDetails>(`/patients/${id}`);
  } catch {
    const base = mockPatients.find((p) => p.id === id) || mockPatients[0];
    return {
      ...base,
      patientContacts: mockContacts.slice(0, 2).map((c, i) => ({
        id: `pc-${i}`,
        patientId: base.id,
        contactId: c.id,
        relationshipToPatient: c.role,
        involvementStatus: "פעיל",
        sharingConsent: true,
        notes: null,
        contact: c
      })),
      sessions: mockSessions.filter((s) => s.patientId === base.id),
      documents: mockDocuments.filter((d) => d.patientId === base.id),
      images: mockImages.filter((img) => img.patientId === base.id)
    };
  }
}

// ---- Mock-only (until backend exposes these) ----

export function getTreatmentPlan(patientId: string) {
  return mockTreatmentPlans[patientId] || mockTreatmentPlans["p-001"];
}

export function getTALA(patientId: string) {
  return mockTALA[patientId] || mockTALA["p-001"];
}

export function getIntake(patientId: string) {
  return mockIntake[patientId] || mockIntake["p-001"];
}
