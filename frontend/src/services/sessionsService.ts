import { apiFetch } from "../lib/api";
import type { Session } from "../types";
import { mockSessions } from "../mocks";

export async function listSessions(): Promise<Session[]> {
  try {
    return await apiFetch<Session[]>("/sessions");
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
