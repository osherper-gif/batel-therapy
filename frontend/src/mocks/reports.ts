export interface TherapyReport {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  type:
    | "quarterly"
    | "annual"
    | "intake_summary"
    | "progress"
    | "external_referral";
  status: "draft" | "pending_review" | "approved" | "sent";
  createdAt: string;
  updatedAt: string;
  authorName: string;
  recipient?: string;
  summary: string;
}

export const mockReports: TherapyReport[] = [
  {
    id: "r-801",
    patientId: "p-001",
    patientName: "נועה אברמוב",
    title: "דוח רבעוני — רבעון ב׳ 2026",
    type: "quarterly",
    status: "draft",
    createdAt: "2026-04-15T09:00:00Z",
    updatedAt: "2026-04-19T11:00:00Z",
    authorName: "בטאל",
    recipient: "אם",
    summary:
      "התהליך הטיפולי של נועה מתאפיין בהעמקה של הקשר הטיפולי והופעת ניצני אוצר רגשי שניתן להיאחז בו ביצירה."
  },
  {
    id: "r-802",
    patientId: "p-002",
    patientName: "דניאל כהן",
    title: "סיכום חציון — דניאל",
    type: "progress",
    status: "pending_review",
    createdAt: "2026-04-12T10:00:00Z",
    updatedAt: "2026-04-18T14:00:00Z",
    authorName: "בטאל",
    recipient: "צוות גן 'שלום'",
    summary:
      "דניאל מראה התקדמות בויסות חושני דרך עבודה עם חומרים כבדים. ממליצה על המשך מפגשים במסגרת החינוכית."
  },
  {
    id: "r-803",
    patientId: "p-003",
    patientName: "מיה רוזנטל",
    title: "סיכום תהליך אינטייק — מיה",
    type: "intake_summary",
    status: "approved",
    createdAt: "2026-02-20T09:00:00Z",
    updatedAt: "2026-02-28T16:00:00Z",
    authorName: "בטאל",
    recipient: "הורים",
    summary:
      "תהליך אינטייק של 4 פגישות הניב הסכמה על מטרות טיפול — עיבוד מעברים וחיזוק זהות אישית."
  },
  {
    id: "r-804",
    patientId: "p-006",
    patientName: "יונתן ברוך",
    title: "הפניה ליועצת חינוכית — יונתן",
    type: "external_referral",
    status: "sent",
    createdAt: "2026-03-30T08:00:00Z",
    updatedAt: "2026-04-02T09:00:00Z",
    authorName: "בטאל",
    recipient: "יועצת חינוכית בית ספר",
    summary:
      "מומלצת הרחבת תמיכה חינוכית במקביל לטיפול."
  }
];
