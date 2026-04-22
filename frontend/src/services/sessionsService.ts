import { apiFetch } from "../lib/api";
import type { Session } from "../types";
import { mockSessions } from "../mocks";

export async function listSessions(): Promise<Session[]> {
  try {
    const response = await apiFetch<{ sessions: Session[] }>("/sessions");
    return response.sessions;
  } catch {
    return mockSessions;
  }
}

export async function getSession(id: string): Promise<Session | undefined> {
  try {
    return await apiFetch<Session>(`/sessions/${id}`);
  } catch {
    return mockSessions.find((s) => s.id === id);
  }
}

export type SessionMutationInput = Pick<
  Session,
  | "patientId"
  | "date"
  | "startTime"
  | "durationMinutes"
  | "sessionType"
  | "frameworkType"
  | "location"
  | "attendees"
  | "goal"
  | "sessionDescription"
  | "materialsUsed"
  | "behaviorNotes"
  | "clinicalImpression"
  | "followUpNotes"
>;

export async function createSession(payload: SessionMutationInput): Promise<Session> {
  const response = await apiFetch<{ session: Session }>("/sessions", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return response.session;
}

export async function updateSession(id: string, payload: SessionMutationInput): Promise<Session> {
  const response = await apiFetch<{ session: Session }>(`/sessions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  return response.session;
}
