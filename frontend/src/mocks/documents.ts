import type { DocumentRecord, ImageRecord } from "../types";

export const mockDocuments: DocumentRecord[] = [
  {
    id: "d-201",
    patientId: "p-001",
    contactId: null,
    title: "הסכמה מדעת — אבחון וטיפול",
    documentType: "טופס",
    sourceType: "ידני",
    authorName: "אימא של נועה",
    tags: "הסכמה, חתום",
    filePath: "/uploads/d-201.pdf",
    uploadedAt: "2025-09-02T09:00:00Z",
    notes: "הסכמת אם חתומה בפגישת פתיחה.",
    patient: { id: "p-001", fullName: "נועה אברמוב" }
  },
  {
    id: "d-202",
    patientId: "p-001",
    contactId: null,
    title: "אבחון פסיכודידקטי",
    documentType: "דוח",
    sourceType: "חיצוני",
    authorName: "ד\"ר רות שילר",
    tags: "פסיכודידקטי, 2024",
    filePath: "/uploads/d-202.pdf",
    uploadedAt: "2025-09-10T12:30:00Z",
    notes: "יש להתייחס להמלצות לויסות רגשי.",
    patient: { id: "p-001", fullName: "נועה אברמוב" }
  },
  {
    id: "d-203",
    patientId: "p-002",
    contactId: null,
    title: "דוח רב-מקצועי — גן תקשורת",
    documentType: "דוח",
    sourceType: "חיצוני",
    authorName: "צוות 'שלום'",
    tags: "תקשורת, רב-מקצועי",
    filePath: "/uploads/d-203.pdf",
    uploadedAt: "2025-10-12T14:00:00Z",
    notes: null,
    patient: { id: "p-002", fullName: "דניאל כהן" }
  },
  {
    id: "d-204",
    patientId: "p-003",
    contactId: null,
    title: "סיכום מחצית א' — בית ספר",
    documentType: "דוח",
    sourceType: "חיצוני",
    authorName: "רכזת שכבה",
    tags: "בית ספר",
    filePath: "/uploads/d-204.pdf",
    uploadedAt: "2026-02-08T10:00:00Z",
    notes: null,
    patient: { id: "p-003", fullName: "מיה רוזנטל" }
  },
  {
    id: "d-205",
    patientId: "p-006",
    contactId: null,
    title: "תכנית טיפול — רבעון ב׳",
    documentType: "תכנית",
    sourceType: "ידני",
    authorName: "בטאל (מטפלת)",
    tags: "תכנית, רבעון",
    filePath: "/uploads/d-205.pdf",
    uploadedAt: "2026-04-01T09:20:00Z",
    notes: "אישור אם מתעדכן בגוגל פורמס.",
    patient: { id: "p-006", fullName: "יונתן ברוך" }
  }
];

export const mockImages: ImageRecord[] = [
  {
    id: "i-301",
    patientId: "p-001",
    sessionId: "s-101",
    title: "מפה רגשית — אפריל",
    description: "צבעי מים, ימים חמים וקרים",
    imageType: "יצירה",
    filePath: "/uploads/i-301.jpg",
    capturedAt: "2026-04-20",
    notes: "לבקש אישור להצגה בדוח שנתי",
    uploadedAt: "2026-04-20T10:10:00Z",
    patient: { id: "p-001", fullName: "נועה אברמוב" },
    session: { id: "s-101", date: "2026-04-20" }
  },
  {
    id: "i-302",
    patientId: "p-002",
    sessionId: "s-102",
    title: "מבצר מחימר",
    description: "בנייה והריסה, עבודה חוזרת",
    imageType: "יצירה",
    filePath: "/uploads/i-302.jpg",
    capturedAt: "2026-04-19",
    notes: null,
    uploadedAt: "2026-04-19T11:40:00Z",
    patient: { id: "p-002", fullName: "דניאל כהן" },
    session: { id: "s-102", date: "2026-04-19" }
  },
  {
    id: "i-303",
    patientId: "p-003",
    sessionId: "s-103",
    title: "החדר שלי בבית אבא",
    description: "קולאז' + רישום עיפרון",
    imageType: "יצירה",
    filePath: "/uploads/i-303.jpg",
    capturedAt: "2026-04-18",
    notes: null,
    uploadedAt: "2026-04-18T17:00:00Z",
    patient: { id: "p-003", fullName: "מיה רוזנטל" },
    session: { id: "s-103", date: "2026-04-18" }
  }
];
