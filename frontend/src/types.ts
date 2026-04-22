export interface User {
  id: string;
  username: string;
  role: string;
  email?: string | null;
  authProvider?: string | null;
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

export type PublicSiteItemType =
  | "landing"
  | "content_page"
  | "contact_page"
  | "form_page"
  | "external_html"
  | "resource_page";

export type PublicSiteItemStatus = "draft" | "published" | "archived";

export interface PublicSiteItem {
  id: string;
  title: string;
  slug: string;
  pageType: PublicSiteItemType;
  status: PublicSiteItemStatus;
  summary: string;
  contentJson: Record<string, unknown> | null;
  htmlContent: string | null;
  externalPath: string | null;
  externalUrl: string | null;
  servedPath?: string | null;
  servedUrl?: string | null;
  sourceType?: "single_html_file" | "html_directory" | "remote_url" | null;
  serveMode?: "backend_route" | "direct_url" | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  updatedAt: string;
  featured?: boolean;
}

export type PublicFormKind = "contact" | "consultation" | "parent_inquiry" | "school_inquiry";

export interface PublicFormDefinition {
  id: string;
  title: string;
  slug: string;
  formType: PublicFormKind;
  status: PublicSiteItemStatus;
  summary: string;
  linkedPageId: string | null;
  destinationLabel: string;
  destinationEmail: string;
  successMessage: string;
  updatedAt: string;
}

export interface PublicNavEntry {
  id: string;
  label: string;
  targetType: "page" | "external" | "form";
  targetId: string;
  isPrimary: boolean;
}

export interface MainWebsiteSettings {
  siteTitle: string;
  siteUrl: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCtaLabel: string;
  primaryCtaTargetId: string | null;
  secondaryCtaLabel: string;
  secondaryCtaTargetId: string | null;
  contactPageId: string | null;
  featuredPageIds: string[];
  navigation: PublicNavEntry[];
  updatedAt: string;
}

export interface PublicSiteManagerState {
  mainWebsite: MainWebsiteSettings;
  items: PublicSiteItem[];
  forms: PublicFormDefinition[];
}
