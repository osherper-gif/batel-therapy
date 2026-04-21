import { apiFetch } from "../lib/api";
import type { DashboardPayload } from "../types";
import { mockPatients, mockSessions } from "../mocks";

export async function getDashboard(): Promise<DashboardPayload> {
  try {
    return await apiFetch<DashboardPayload>("/dashboard");
  } catch {
    return {
      stats: {
        patientsCount: mockPatients.length,
        sessionsCount: mockSessions.length,
        stakeholdersCount: 12,
        documentsCount: 34,
        imagesCount: 58
      },
      recentSessions: mockSessions.slice(0, 5),
      recentPatients: mockPatients.slice(0, 4)
    };
  }
}
