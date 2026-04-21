/**
 * Treatment plan + TALA (תפיסת אמנות, למידה, אבחון) mocks.
 * TALA is BATEL's internal framework — here represented as structured blocks.
 */

export interface TreatmentGoal {
  id: string;
  title: string;
  description: string;
  status: "active" | "met" | "paused";
  progress: number; // 0-100
  createdAt: string;
  targetBy: string;
  owner: string;
}

export interface TreatmentPlan {
  patientId: string;
  framework: string;
  frequency: string;
  duration: string;
  goals: TreatmentGoal[];
  theoreticalAnchor: string;
  materialsPreference: string[];
  parentsInvolvement: string;
  clinicalIndications: string[];
  reviewEvery: string;
  lastReviewedAt: string;
}

export const mockTreatmentPlans: Record<string, TreatmentPlan> = {
  "p-001": {
    patientId: "p-001",
    framework: "פרטני בקליניקה — אחת לשבוע",
    frequency: "שבועי, 50 דק'",
    duration: "חצי שנה ראשונית, עם חלון הערכה מחדש",
    goals: [
      {
        id: "g-1",
        title: "פיתוח אוצר רגשי",
        description: "לבנות שפה רגשית פנימית בעזרת צבעים, צורות וסיפור.",
        status: "active",
        progress: 55,
        createdAt: "2025-09-18T00:00:00Z",
        targetBy: "2026-06-30",
        owner: "בטאל"
      },
      {
        id: "g-2",
        title: "חיזוק ביטחון עצמי באמצעות יצירה",
        description: "חוויות חוזרות של הצלחה ובחירה עצמאית בחומרים.",
        status: "active",
        progress: 30,
        createdAt: "2025-09-18T00:00:00Z",
        targetBy: "2026-08-30",
        owner: "בטאל"
      },
      {
        id: "g-3",
        title: "ויסות חרדת מבחנים",
        description: "כלים של מיינדפולנס אמנותי לפני ואחרי אירועי מבחן.",
        status: "active",
        progress: 15,
        createdAt: "2026-02-01T00:00:00Z",
        targetBy: "2026-09-30",
        owner: "בטאל"
      }
    ],
    theoreticalAnchor: "גישה משולבת — פסיכודינמית עם אלמנטים של CBT-Art.",
    materialsPreference: [
      "צבעי מים",
      "פסטל שמן",
      "קולאז'",
      "כרטיסיות רגש"
    ],
    parentsInvolvement: "פגישת תיאום אחת לחודש, תקציר כתוב מדי רבעון.",
    clinicalIndications: [
      "לעקוב אחרי נסיגה חברתית בבית הספר",
      "להקשיב להיבט של חרדה נוכח הרגלי שינה"
    ],
    reviewEvery: "רבעון",
    lastReviewedAt: "2026-04-10T00:00:00Z"
  }
};

export interface TALASection {
  id: string;
  title: string;
  prompt: string;
  content: string;
  lastUpdated: string;
}

export interface TALADocument {
  patientId: string;
  sections: TALASection[];
  summary: string;
  artisticSignature: string;
  updatedAt: string;
}

export const mockTALA: Record<string, TALADocument> = {
  "p-001": {
    patientId: "p-001",
    updatedAt: "2026-04-15T14:00:00Z",
    summary:
      "מתהווה תמונה של ילדה עם רגישות אסתטית גבוהה, שפה רגשית שעדיין בהתהוות, ונטייה להחזקת יציבות דרך בחירה בחומרים מוכרים וחוזרים.",
    artisticSignature:
      "עבודות שכבות, גוונים חמים, מרחב בטוח במרכז הדף, נקודות חום כעוגן.",
    sections: [
      {
        id: "tala-1",
        title: "תפיסה אמנותית",
        prompt: "איך הילד/ה מגיב/ה לחומרי יצירה? מה חוזר?",
        content:
          "נועה מגיבה היטב לצבעי מים ופסטל שמן. חוזרת לשכבות. מעדיפה לעבוד במרכז הדף ונמנעת מקצוות.",
        lastUpdated: "2026-04-10T00:00:00Z"
      },
      {
        id: "tala-2",
        title: "למידה דרך יצירה",
        prompt: "איזה כלים חדשים רכשה דרך התהליך?",
        content:
          "רכשה יכולת לזהות צבע כ'חם' או 'קר' ולקשר אותו לרגש. החלה להשתמש במטאפורת 'מפה' כדי לארגן שבוע.",
        lastUpdated: "2026-04-15T00:00:00Z"
      },
      {
        id: "tala-3",
        title: "אבחון התהוות",
        prompt: "מה עולה דרך החומר מבחינה קלינית?",
        content:
          "אוצר רגשי מצומצם בתחילה, עם שיפור עקבי. מופיעה התמודדות טובה יותר עם חוסר ודאות בתוך יצירה.",
        lastUpdated: "2026-04-15T00:00:00Z"
      }
    ]
  }
};

export interface IntakeBlock {
  id: string;
  title: string;
  items: { label: string; value: string }[];
}

export const mockIntake: Record<string, IntakeBlock[]> = {
  "p-001": [
    {
      id: "b-identity",
      title: "זהות ומסגרת",
      items: [
        { label: "שם מלא", value: "נועה אברמוב" },
        { label: "תאריך לידה", value: "12/03/2015" },
        { label: "גיל", value: "11" },
        { label: "מסגרת חינוכית", value: "בית ספר שלווה" },
        { label: "סוג מסגרת", value: "חינוך מיוחד" }
      ]
    },
    {
      id: "b-reason",
      title: "סיבת הפנייה",
      items: [
        {
          label: "מצוקה מרכזית",
          value: "חרדה חברתית, קושי בהבעה רגשית"
        },
        { label: "גורם מפנה", value: "יועצת חינוכית" },
        { label: "משך המצוקה", value: "כשנה" }
      ]
    },
    {
      id: "b-family",
      title: "משפחה ותמיכה",
      items: [
        { label: "מבנה משפחתי", value: "הורים בקשר, אב משני לבית" },
        { label: "אחים", value: "אח בן 14, שיתוף פעולה טוב" },
        { label: "תמיכה עיקרית", value: "אם מעורבת מאוד, משלימה מיידעים" }
      ]
    },
    {
      id: "b-history",
      title: "רקע קליני",
      items: [
        { label: "אבחונים קודמים", value: "פסיכודידקטי 2024" },
        { label: "טיפולים קודמים", value: "ייעוץ רגשי בבית ספר, הפסקה ב-2024" },
        { label: "תרופות", value: "אין" }
      ]
    },
    {
      id: "b-goals",
      title: "מטרות טיפול ראשוניות",
      items: [
        { label: "בטווח קצר", value: "יצירת קשר טיפולי בטוח" },
        {
          label: "בטווח ארוך",
          value: "פיתוח אוצר רגשי, חיזוק ביטחון עצמי"
        }
      ]
    }
  ]
};
