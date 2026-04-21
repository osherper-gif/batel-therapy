export interface AIInsight {
  id: string;
  type:
    | "pattern"
    | "warning"
    | "recommendation"
    | "summary"
    | "material_suggestion";
  patientId: string;
  patientName: string;
  title: string;
  body: string;
  generatedAt: string;
  confidence: "low" | "medium" | "high";
  requiresReview: boolean;
}

export const mockInsights: AIInsight[] = [
  {
    id: "ai-901",
    type: "pattern",
    patientId: "p-001",
    patientName: "נועה אברמוב",
    title: "דפוס עבודה עם צבעים חמים",
    body: "בשלושת המפגשים האחרונים, נועה פנתה באופן עקבי לצבעים חמים בתיאור רגעים של בטחון. התובנה הזו עשויה לשמש נקודת עוגן חוזרת בתהליך.",
    generatedAt: "2026-04-19T22:00:00Z",
    confidence: "high",
    requiresReview: false
  },
  {
    id: "ai-902",
    type: "recommendation",
    patientId: "p-002",
    patientName: "דניאל כהן",
    title: "המלצה: עוגנים חזותיים בין פגישות",
    body: "המודל מזהה קשיי מעבר בין מצבים. הוספת כרטיסיית עוגן חזותי חוזרת (לדוג' דמות המבצר) יכולה לסייע לשמר המשכיות.",
    generatedAt: "2026-04-18T22:00:00Z",
    confidence: "medium",
    requiresReview: true
  },
  {
    id: "ai-903",
    type: "warning",
    patientId: "p-006",
    patientName: "יונתן ברוך",
    title: "שכיחות מילים אינטנסיביות בתיאור רגשי",
    body: "בפגישות האחרונות עלתה מטאפורה חוזרת של 'שריפה'. מומלץ להעמיק בהתייעצות.",
    generatedAt: "2026-04-17T22:00:00Z",
    confidence: "medium",
    requiresReview: true
  },
  {
    id: "ai-904",
    type: "material_suggestion",
    patientId: "p-003",
    patientName: "מיה רוזנטל",
    title: "חומרים אפשריים להמשך 'ספר הסיפור'",
    body: "בהתבסס על עבודות קולאז' קודמות ועל שפה רגשית מתפתחת, ניתן להציע שילוב של צילומים משפחתיים עם תחריט רך.",
    generatedAt: "2026-04-18T22:00:00Z",
    confidence: "low",
    requiresReview: true
  }
];

export const mockAISummary = {
  weekly: {
    patientsSeen: 8,
    sessionsCount: 12,
    averageSessionMinutes: 47,
    notableTrends: [
      "עלייה בעבודה עם חומרים חושניים בשבוע האחרון",
      "שיח רגשי עשיר יותר בקרב 3 מטופלים שמלווים מעל חצי שנה",
      "ירידה במספר ביטולים — 1 בלבד השבוע"
    ],
    suggestions: [
      "לשקול הפרדה בטאבים פנימיים בין תכנון פגישות חדשות לבין תיעוד",
      "לעבור על דוחות ממתינים לאישור"
    ]
  }
};
