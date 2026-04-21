import type { Contact } from "../types";

export const mockContacts: Contact[] = [
  {
    id: "c-501",
    fullName: "אלה אברמוב",
    role: "אם",
    phone: "050-1234567",
    email: "ella.a@example.com",
    address: "הרצליה",
    preferredLanguage: "עברית",
    generalNotes: "מעודכנת בסיכומי טיפול פעם בחודש.",
    createdAt: "2025-09-02T08:00:00Z",
    updatedAt: "2026-04-18T10:20:00Z"
  },
  {
    id: "c-502",
    fullName: "אורן אברמוב",
    role: "אב",
    phone: "052-7654321",
    email: "oren.a@example.com",
    address: "תל אביב",
    preferredLanguage: "עברית",
    generalNotes: "פגישות תיאום מדי רבעון.",
    createdAt: "2025-09-02T08:05:00Z",
    updatedAt: "2026-03-15T09:00:00Z"
  },
  {
    id: "c-503",
    fullName: "ד\"ר רות שילר",
    role: "פסיכולוגית חינוכית",
    phone: "03-6660000",
    email: "ruth.s@example.org",
    address: null,
    preferredLanguage: "עברית",
    generalNotes: "מלווה את מיה במסגרת חינוכית.",
    createdAt: "2025-10-10T09:00:00Z",
    updatedAt: "2026-02-08T10:00:00Z"
  },
  {
    id: "c-504",
    fullName: "צוות גן 'שלום'",
    role: "מסגרת חינוכית",
    phone: "03-5551234",
    email: "shalom.gan@example.org",
    address: "רחובות",
    preferredLanguage: "עברית",
    generalNotes: "תיאום שוטף פעם ב-3 שבועות.",
    createdAt: "2025-10-12T14:00:00Z",
    updatedAt: "2026-04-05T09:30:00Z"
  },
  {
    id: "c-505",
    fullName: "חני רוזנטל",
    role: "אם",
    phone: "050-9988776",
    email: "hani.r@example.com",
    address: "רמת השרון",
    preferredLanguage: "עברית",
    generalNotes: "מעורבות גבוהה.",
    createdAt: "2026-01-14T11:00:00Z",
    updatedAt: "2026-04-18T10:15:00Z"
  }
];
