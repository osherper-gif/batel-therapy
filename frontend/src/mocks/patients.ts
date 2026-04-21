import type { Patient } from "../types";

/**
 * Mock patient data used while backend endpoints are still under construction.
 * All records use fictional names.
 */
export const mockPatients: Patient[] = [
  {
    id: "p-001",
    fullName: "נועה אברמוב",
    dateOfBirth: "2015-03-12",
    age: 11,
    educationalFramework: "בית ספר שלווה",
    frameworkType: "חינוך מיוחד",
    treatmentFramework: "פרטני בקליניקה",
    mainConcerns: "חרדה חברתית, קושי בהבעה רגשית",
    treatmentGoals: "פיתוח אוצר רגשי, חיזוק ביטחון עצמי דרך יצירה",
    status: "active",
    createdAt: "2025-09-02T08:15:00Z",
    updatedAt: "2026-04-17T10:30:00Z"
  },
  {
    id: "p-002",
    fullName: "דניאל כהן",
    dateOfBirth: "2016-07-20",
    age: 9,
    educationalFramework: "גן תקשורת 'שלום'",
    frameworkType: "גן תקשורת",
    treatmentFramework: "במסגרת חינוכית",
    mainConcerns: "קשב וריכוז, קושי בהרגעה עצמית",
    treatmentGoals: "ויסות רגשי, חיזוק כישורי ויסות סנסורי",
    status: "active",
    createdAt: "2025-10-05T09:00:00Z",
    updatedAt: "2026-04-12T14:20:00Z"
  },
  {
    id: "p-003",
    fullName: "מיה רוזנטל",
    dateOfBirth: "2013-11-04",
    age: 12,
    educationalFramework: "חטיבת ביניים עמק",
    frameworkType: "חינוך רגיל",
    treatmentFramework: "פרטני בקליניקה",
    mainConcerns: "התמודדות עם גירושי הורים",
    treatmentGoals: "עיבוד רגשי, יצירת סיפור אישי חדש",
    status: "active",
    createdAt: "2026-01-14T10:45:00Z",
    updatedAt: "2026-04-18T08:40:00Z"
  },
  {
    id: "p-004",
    fullName: "איתי פרץ",
    dateOfBirth: "2017-02-01",
    age: 9,
    educationalFramework: "בית ספר ברקת",
    frameworkType: "חינוך רגיל",
    treatmentFramework: "פרטני בקליניקה",
    mainConcerns: "נסיגה חברתית, ביישנות קיצונית",
    treatmentGoals: "יצירת קשר טיפולי בטוח, עידוד הבעה",
    status: "onboarding",
    createdAt: "2026-03-22T11:10:00Z",
    updatedAt: "2026-04-03T12:00:00Z"
  },
  {
    id: "p-005",
    fullName: "שירה לוי",
    dateOfBirth: "2012-05-25",
    age: 13,
    educationalFramework: null,
    frameworkType: null,
    treatmentFramework: "פרטני בקליניקה",
    mainConcerns: "דימוי גוף, תחילת התבגרות",
    treatmentGoals: "חיזוק דימוי עצמי, עיבוד שינויים",
    status: "on_hold",
    createdAt: "2025-11-30T15:00:00Z",
    updatedAt: "2026-03-01T09:00:00Z"
  },
  {
    id: "p-006",
    fullName: "יונתן ברוך",
    dateOfBirth: "2018-09-08",
    age: 7,
    educationalFramework: "גן אופק",
    frameworkType: "חינוך רגיל",
    treatmentFramework: "פרטני בקליניקה",
    mainConcerns: "התפרצויות זעם, קושי בהחזקת תסכול",
    treatmentGoals: "פיתוח כלים לוויסות, בניית חוויה של הצלחה",
    status: "active",
    createdAt: "2025-09-18T08:30:00Z",
    updatedAt: "2026-04-19T16:45:00Z"
  }
];
