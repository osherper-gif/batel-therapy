export interface User {
  id: string;
  username: string;
  role: string;
}

export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  educationalFramework: string | null;
  frameworkType: string | null;
  treatmentFramework: string;
  mainConcerns: string | null;
  treatmentGoals: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  fullName: string;
  role: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  preferredLanguage: string | null;
  generalNotes: string | null;
  createdAt?: string;
  updatedAt?: string;
  patientContacts?: PatientContact[];
}

export interface PatientContact {
  id: string;
  patientId: string;
  contactId: string;
  relationshipToPatient: string | null;
  involvementStatus: string | null;
  sharingConsent: boolean;
  notes: string | null;
  patient?: Pick<Patient, "id" | "fullName">;
  contact: Contact;
}

export interface Session {
  id: string;
  patientId: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  sessionType: string;
  frameworkType: string | null;
  location: string | null;
  attendees: string | null;
  goal: string | null;
  sessionDescription: string | null;
  materialsUsed: string | null;
  behaviorNotes: string | null;
  clinicalImpression: string | null;
  followUpNotes: string | null;
  createdAt: string;
  updatedAt: string;
  patient?: Pick<Patient, "id" | "fullName">;
}

export interface DocumentRecord {
  id: string;
  patientId: string;
  contactId: string | null;
  title: string;
  documentType: string;
  sourceType: string | null;
  authorName: string | null;
  tags: string | null;
  filePath: string;
  uploadedAt: string;
  notes: string | null;
  patient?: Pick<Patient, "id" | "fullName">;
  contact?: Pick<Contact, "id" | "fullName"> | null;
}

export interface ImageRecord {
  id: string;
  patientId: string;
  sessionId: string | null;
  title: string;
  description: string | null;
  imageType: string;
  filePath: string;
  capturedAt: string | null;
  notes: string | null;
  uploadedAt: string;
  patient?: Pick<Patient, "id" | "fullName">;
  session?: Pick<Session, "id" | "date"> | null;
}

export interface PatientDetails extends Patient {
  patientContacts: PatientContact[];
  sessions: Session[];
  documents: DocumentRecord[];
  images: ImageRecord[];
}

export interface DashboardPayload {
  stats: {
    patientsCount: number;
    sessionsCount: number;
    stakeholdersCount: number;
    documentsCount: number;
    imagesCount: number;
  };
  recentSessions: Session[];
  recentPatients: Patient[];
}
