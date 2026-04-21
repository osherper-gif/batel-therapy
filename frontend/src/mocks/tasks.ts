/**
 * Lightweight task/reminder mock. Task backend doesn't exist yet —
 * this represents what the UI expects when the API is wired.
 */
export interface TaskReminder {
  id: string;
  title: string;
  type: "task" | "reminder" | "follow_up";
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "done" | "snoozed";
  patientId?: string;
  patientName?: string;
  dueDate: string;   // ISO date
  createdAt: string; // ISO
  notes?: string;
}

export const mockTasks: TaskReminder[] = [
  {
    id: "t-701",
    title: "סיכום פגישה לאם של נועה",
    type: "follow_up",
    priority: "medium",
    status: "open",
    patientId: "p-001",
    patientName: "נועה אברמוב",
    dueDate: "2026-04-22",
    createdAt: "2026-04-20T10:10:00Z",
    notes: "לשלוח תקציר עבודת 'מפת הרגשות'."
  },
  {
    id: "t-702",
    title: "תיאום פגישה עם צוות גן 'שלום'",
    type: "task",
    priority: "high",
    status: "open",
    patientId: "p-002",
    patientName: "דניאל כהן",
    dueDate: "2026-04-23",
    createdAt: "2026-04-19T12:00:00Z"
  },
  {
    id: "t-703",
    title: "הכנת תכנית רבעון ג' — יונתן",
    type: "task",
    priority: "medium",
    status: "in_progress",
    patientId: "p-006",
    patientName: "יונתן ברוך",
    dueDate: "2026-05-05",
    createdAt: "2026-04-10T08:00:00Z",
    notes: "כולל דגש על כלים לוויסות שריפה."
  },
  {
    id: "t-704",
    title: "חידוש אישור מידע רפואי — שירה",
    type: "reminder",
    priority: "low",
    status: "snoozed",
    patientId: "p-005",
    patientName: "שירה לוי",
    dueDate: "2026-05-12",
    createdAt: "2026-04-01T08:00:00Z"
  },
  {
    id: "t-705",
    title: "רכישה: דפים בגדלים שונים + פסטלים חדשים",
    type: "task",
    priority: "low",
    status: "open",
    dueDate: "2026-04-28",
    createdAt: "2026-04-18T18:00:00Z"
  }
];
