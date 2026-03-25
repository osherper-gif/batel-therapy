import { FormEvent, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { EntityTable } from "../components/EntityTable";
import { SectionCard } from "../components/SectionCard";
import { StatusMessage } from "../components/StatusMessage";
import { useAsync } from "../hooks/useAsync";
import { apiFetch, getFileUrl, getToken } from "../lib/api";
import { mapErrorToHebrew } from "../lib/ui-text";
import type { Contact, PatientDetails } from "../types";

const tabs = [
  { id: "basic", label: "פרטים בסיסיים" },
  { id: "stakeholders", label: "אנשי קשר" },
  { id: "sessions", label: "מפגשים" },
  { id: "documents", label: "מסמכים" },
  { id: "images", label: "תמונות" }
] as const;

async function uploadToEndpoint(endpoint: string, formData: FormData) {
  const token = getToken();
  const response = await fetch(`http://localhost:4000/api/files/${endpoint}`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({ message: "Upload failed." }));
    throw new Error(errorPayload.message || "Upload failed.");
  }
}

const emptyNewLinkedContact = {
  fullName: "",
  role: "",
  phone: "",
  email: "",
  address: "",
  preferredLanguage: "Hebrew",
  generalNotes: "",
  relationshipToPatient: "",
  involvementStatus: "Active",
  sharingConsent: false,
  notes: ""
};

const emptyLinkExisting = {
  contactId: "",
  relationshipToPatient: "",
  involvementStatus: "Active",
  sharingConsent: false,
  notes: ""
};

export function PatientDetailsPage() {
  const { id } = useParams();
  const patientQuery = useAsync(() => apiFetch<{ patient: PatientDetails }>(`/patients/${id}`), [id]);
  const contactsQuery = useAsync(() => apiFetch<{ contacts: Contact[] }>("/stakeholders"));
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("basic");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [showQuickSession, setShowQuickSession] = useState(false);
  const [quickSession, setQuickSession] = useState({
    patientId: id || "",
    date: new Date().toISOString().slice(0, 10),
    startTime: "14:00",
    durationMinutes: 45,
    sessionType: "Art Therapy",
    frameworkType: "",
    location: "",
    attendees: "",
    goal: "",
    sessionDescription: "",
    materialsUsed: "",
    behaviorNotes: "",
    clinicalImpression: "",
    followUpNotes: ""
  });
  const [linkExisting, setLinkExisting] = useState(emptyLinkExisting);
  const [newLinkedContact, setNewLinkedContact] = useState(emptyNewLinkedContact);

  const patient = patientQuery.data?.patient;
  const availableContacts = useMemo(() => {
    const allContacts = contactsQuery.data?.contacts ?? [];
    const linkedIds = new Set(patient?.patientContacts.map((link) => link.contactId) ?? []);
    return allContacts.filter((contact) => !linkedIds.has(contact.id));
  }, [contactsQuery.data?.contacts, patient?.patientContacts]);

  async function handleDocumentUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;

    try {
      setUploadError(null);
      await uploadToEndpoint("documents", new FormData(formElement));
      formElement.reset();
      await patientQuery.reload();
    } catch (nextError) {
      setUploadError(mapErrorToHebrew(nextError, "לא הצלחנו להעלות את המסמך."));
    }
  }

  async function handleImageUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;

    try {
      setUploadError(null);
      await uploadToEndpoint("images", new FormData(formElement));
      formElement.reset();
      await patientQuery.reload();
    } catch (nextError) {
      setUploadError(mapErrorToHebrew(nextError, "לא הצלחנו להעלות את התמונה."));
    }
  }

  async function handleDeleteDocument(documentId: string) {
    if (!window.confirm("למחוק את המסמך?")) {
      return;
    }

    await apiFetch(`/files/documents/${documentId}`, { method: "DELETE" });
    await patientQuery.reload();
  }

  async function handleDeleteImage(imageId: string) {
    if (!window.confirm("למחוק את התמונה?")) {
      return;
    }

    await apiFetch(`/files/images/${imageId}`, { method: "DELETE" });
    await patientQuery.reload();
  }

  async function handleQuickSessionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSessionError(null);
      await apiFetch("/sessions", {
        method: "POST",
        body: JSON.stringify(quickSession)
      });
      setShowQuickSession(false);
      setQuickSession({
        ...quickSession,
        date: new Date().toISOString().slice(0, 10),
        startTime: "14:00",
        durationMinutes: 45,
        goal: "",
        clinicalImpression: ""
      });
      await patientQuery.reload();
    } catch (nextError) {
      setSessionError(mapErrorToHebrew(nextError, "לא הצלחנו לשמור את המפגש. אפשר לנסות שוב."));
    }
  }

  async function handleLinkExisting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setContactError(null);
      await apiFetch("/stakeholders/links", {
        method: "POST",
        body: JSON.stringify({
          patientId: patient?.id,
          ...linkExisting
        })
      });
      setLinkExisting(emptyLinkExisting);
      await Promise.all([patientQuery.reload(), contactsQuery.reload()]);
    } catch (nextError) {
      setContactError(mapErrorToHebrew(nextError, "לא הצלחנו לקשר את איש הקשר."));
    }
  }

  async function handleCreateAndLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setContactError(null);
      await apiFetch("/stakeholders/create-and-link", {
        method: "POST",
        body: JSON.stringify({
          patientId: patient?.id,
          ...newLinkedContact
        })
      });
      setNewLinkedContact(emptyNewLinkedContact);
      await Promise.all([patientQuery.reload(), contactsQuery.reload()]);
    } catch (nextError) {
      setContactError(mapErrorToHebrew(nextError, "לא הצלחנו ליצור ולקשר את איש הקשר."));
    }
  }

  async function handleUnlink(linkId: string) {
    if (!window.confirm("לבטל את הקישור של איש הקשר למטופל הזה?")) {
      return;
    }

    await apiFetch(`/stakeholders/links/${linkId}`, { method: "DELETE" });
    await Promise.all([patientQuery.reload(), contactsQuery.reload()]);
  }

  if (patientQuery.isLoading) {
    return <StatusMessage message="טוען פרטי מטופל..." />;
  }

  if (patientQuery.error || !patient) {
    return (
      <StatusMessage
        message={mapErrorToHebrew(new Error(patientQuery.error || ""), "לא הצלחנו לטעון את פרטי המטופל.")}
        tone="error"
      />
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Patient</p>
          <h1>{patient.fullName}</h1>
          <p className="muted">
            גיל {patient.age} | {patient.treatmentFramework} | {patient.status}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setActiveTab("sessions");
            setShowQuickSession((current) => !current);
          }}
        >
          מפגש חדש
        </button>
      </header>

      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "tab active" : "tab"}
            type="button"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "basic" ? (
        <SectionCard title="מידע מקורי">
          <div className="detail-grid">
            <div>
              <strong>תאריך לידה</strong>
              <p>{new Date(patient.dateOfBirth).toLocaleDateString("he-IL")}</p>
            </div>
            <div>
              <strong>מסגרת חינוכית</strong>
              <p>{patient.educationalFramework || "-"}</p>
            </div>
            <div>
              <strong>סוג מסגרת</strong>
              <p>{patient.frameworkType || "-"}</p>
            </div>
            <div>
              <strong>מטרות טיפול</strong>
              <p>{patient.treatmentGoals || "-"}</p>
            </div>
            <div className="full-width">
              <strong>קשיים מרכזיים</strong>
              <p>{patient.mainConcerns || "-"}</p>
            </div>
          </div>
        </SectionCard>
      ) : null}

      {activeTab === "stakeholders" ? (
        <SectionCard title="אנשי קשר" subtitle="איש קשר אחד יכול להיות מקושר לכמה מטופלים">
          {contactError ? <StatusMessage message={contactError} tone="error" /> : null}

          <div className="two-column">
            <section className="nested-panel">
              <h3>קישור איש קשר קיים</h3>
              <form className="compact-form" onSubmit={handleLinkExisting}>
                <label>
                  איש קשר קיים
                  <select
                    value={linkExisting.contactId}
                    onChange={(event) => setLinkExisting({ ...linkExisting, contactId: event.target.value })}
                  >
                    <option value="">בחרי איש קשר</option>
                    {availableContacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.fullName} | {contact.role}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  קשר למטופל
                  <input
                    value={linkExisting.relationshipToPatient}
                    onChange={(event) =>
                      setLinkExisting({ ...linkExisting, relationshipToPatient: event.target.value })
                    }
                  />
                </label>

                <label>
                  סטטוס מעורבות
                  <input
                    value={linkExisting.involvementStatus}
                    onChange={(event) =>
                      setLinkExisting({ ...linkExisting, involvementStatus: event.target.value })
                    }
                  />
                </label>

                <label className="full-width">
                  הערות למטופל הזה
                  <textarea
                    value={linkExisting.notes}
                    onChange={(event) => setLinkExisting({ ...linkExisting, notes: event.target.value })}
                  />
                </label>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={linkExisting.sharingConsent}
                    onChange={(event) =>
                      setLinkExisting({ ...linkExisting, sharingConsent: event.target.checked })
                    }
                  />
                  אישור שיתוף מידע
                </label>

                <button type="submit">קישור איש קשר</button>
              </form>
            </section>

            <section className="nested-panel">
              <h3>יצירה וקישור של איש קשר חדש</h3>
              <form className="form-grid" onSubmit={handleCreateAndLink}>
                <label>
                  שם מלא
                  <input
                    value={newLinkedContact.fullName}
                    onChange={(event) =>
                      setNewLinkedContact({ ...newLinkedContact, fullName: event.target.value })
                    }
                  />
                </label>
                <label>
                  תפקיד / קטגוריה
                  <input
                    value={newLinkedContact.role}
                    onChange={(event) => setNewLinkedContact({ ...newLinkedContact, role: event.target.value })}
                  />
                </label>
                <label>
                  טלפון
                  <input
                    value={newLinkedContact.phone}
                    onChange={(event) => setNewLinkedContact({ ...newLinkedContact, phone: event.target.value })}
                  />
                </label>
                <label>
                  אימייל
                  <input
                    value={newLinkedContact.email}
                    onChange={(event) => setNewLinkedContact({ ...newLinkedContact, email: event.target.value })}
                  />
                </label>
                <label>
                  קשר למטופל
                  <input
                    value={newLinkedContact.relationshipToPatient}
                    onChange={(event) =>
                      setNewLinkedContact({
                        ...newLinkedContact,
                        relationshipToPatient: event.target.value
                      })
                    }
                  />
                </label>
                <label>
                  סטטוס מעורבות
                  <input
                    value={newLinkedContact.involvementStatus}
                    onChange={(event) =>
                      setNewLinkedContact({ ...newLinkedContact, involvementStatus: event.target.value })
                    }
                  />
                </label>
                <label className="full-width">
                  הערות כלליות
                  <textarea
                    value={newLinkedContact.generalNotes}
                    onChange={(event) =>
                      setNewLinkedContact({ ...newLinkedContact, generalNotes: event.target.value })
                    }
                  />
                </label>
                <label className="full-width">
                  הערות למטופל הזה
                  <textarea
                    value={newLinkedContact.notes}
                    onChange={(event) => setNewLinkedContact({ ...newLinkedContact, notes: event.target.value })}
                  />
                </label>
                <label className="checkbox-row full-width">
                  <input
                    type="checkbox"
                    checked={newLinkedContact.sharingConsent}
                    onChange={(event) =>
                      setNewLinkedContact({ ...newLinkedContact, sharingConsent: event.target.checked })
                    }
                  />
                  אישור שיתוף מידע
                </label>
                <button type="submit">יצירה וקישור</button>
              </form>
            </section>
          </div>

          <EntityTable
            rows={patient.patientContacts}
            emptyText="אין עדיין אנשי קשר מקושרים למטופל."
            columns={[
              { key: "name", header: "שם", render: (row) => row.contact.fullName },
              { key: "role", header: "תפקיד", render: (row) => row.contact.role },
              {
                key: "relationship",
                header: "קשר למטופל",
                render: (row) => row.relationshipToPatient || "-"
              },
              {
                key: "status",
                header: "מעורבות",
                render: (row) => row.involvementStatus || "-"
              },
              {
                key: "phone",
                header: "טלפון",
                render: (row) => row.contact.phone || "-"
              },
              {
                key: "actions",
                header: "",
                render: (row) => (
                  <button className="ghost-button" type="button" onClick={() => void handleUnlink(row.id)}>
                    ביטול קישור
                  </button>
                )
              }
            ]}
          />
        </SectionCard>
      ) : null}

      {activeTab === "sessions" ? (
        <SectionCard title="מפגשים" subtitle="מצב תיעוד מהיר לשמירת מפגש בכמה שדות בלבד">
          {showQuickSession ? (
            <form className="quick-session-form" onSubmit={handleQuickSessionSubmit}>
              <label>
                תאריך
                <input
                  type="date"
                  value={quickSession.date}
                  onChange={(event) => setQuickSession({ ...quickSession, date: event.target.value })}
                />
              </label>
              <label>
                שעה
                <input
                  type="time"
                  value={quickSession.startTime}
                  onChange={(event) => setQuickSession({ ...quickSession, startTime: event.target.value })}
                />
              </label>
              <label>
                משך בדקות
                <input
                  type="number"
                  value={quickSession.durationMinutes}
                  onChange={(event) =>
                    setQuickSession({ ...quickSession, durationMinutes: Number(event.target.value) })
                  }
                />
              </label>
              <label>
                סוג מפגש
                <input
                  value={quickSession.sessionType}
                  onChange={(event) => setQuickSession({ ...quickSession, sessionType: event.target.value })}
                />
              </label>
              <label className="full-width">
                מטרת מפגש קצרה
                <input
                  value={quickSession.goal}
                  onChange={(event) => setQuickSession({ ...quickSession, goal: event.target.value })}
                />
              </label>
              <label className="full-width">
                הערה קלינית קצרה
                <textarea
                  value={quickSession.clinicalImpression}
                  onChange={(event) =>
                    setQuickSession({ ...quickSession, clinicalImpression: event.target.value })
                  }
                />
              </label>
              {sessionError ? <StatusMessage message={sessionError} tone="error" /> : null}
              <div className="button-row full-width">
                <button type="submit">שמירת מפגש מהיר</button>
                <button className="secondary-button" type="button" onClick={() => setShowQuickSession(false)}>
                  סגירה
                </button>
              </div>
            </form>
          ) : (
            <div className="inline-empty-state">
              <p className="muted">אפשר לפתוח מצב מהיר ולתעד מפגש חדש בלי לעבור לטופס המלא.</p>
              <button type="button" onClick={() => setShowQuickSession(true)}>
                פתיחת תיעוד מהיר
              </button>
            </div>
          )}

          <EntityTable
            rows={patient.sessions}
            emptyText="אין מפגשים למטופל זה."
            columns={[
              {
                key: "date",
                header: "תאריך",
                render: (row) => new Date(row.date).toLocaleDateString("he-IL")
              },
              { key: "type", header: "סוג", render: (row) => row.sessionType },
              { key: "goal", header: "מטרה", render: (row) => row.goal || "-" },
              { key: "note", header: "התרשמות", render: (row) => row.clinicalImpression || "-" }
            ]}
          />
        </SectionCard>
      ) : null}

      {activeTab === "documents" ? (
        <SectionCard title="מסמכים" subtitle="העלאת קבצים עם מטא-דאטה">
          <form className="form-grid" onSubmit={handleDocumentUpload}>
            <input type="hidden" name="patientId" value={patient.id} />
            <label>
              כותרת
              <input name="title" required />
            </label>
            <label>
              סוג מסמך
              <input name="documentType" required />
            </label>
            <label>
              מקור
              <input name="sourceType" />
            </label>
            <label>
              מחבר
              <input name="authorName" />
            </label>
            <label className="full-width">
              תגיות
              <input name="tags" />
            </label>
            <label className="full-width">
              הערות
              <textarea name="notes" />
            </label>
            <label className="full-width">
              קובץ
              <input type="file" name="file" required />
            </label>
            <button type="submit">העלאת מסמך</button>
          </form>

          {uploadError ? <StatusMessage message={uploadError} tone="error" /> : null}

          <EntityTable
            rows={patient.documents}
            emptyText="אין מסמכים למטופל זה."
            columns={[
              { key: "title", header: "כותרת", render: (row) => row.title },
              { key: "type", header: "סוג", render: (row) => row.documentType },
              { key: "tags", header: "תגיות", render: (row) => row.tags || "-" },
              {
                key: "path",
                header: "קובץ",
                render: (row) => (
                  <a href={getFileUrl(row.filePath)} target="_blank" rel="noreferrer">
                    פתיחה
                  </a>
                )
              },
              {
                key: "actions",
                header: "",
                render: (row) => (
                  <button className="ghost-button" type="button" onClick={() => void handleDeleteDocument(row.id)}>
                    מחיקה
                  </button>
                )
              }
            ]}
          />
        </SectionCard>
      ) : null}

      {activeTab === "images" ? (
        <SectionCard title="תמונות" subtitle="הפרדה ברורה בין תיעוד מקורי לבין אזורי AI עתידיים">
          <form className="form-grid" onSubmit={handleImageUpload}>
            <input type="hidden" name="patientId" value={patient.id} />
            <label>
              כותרת
              <input name="title" required />
            </label>
            <label>
              סוג תמונה
              <input name="imageType" required />
            </label>
            <label>
              תאריך צילום
              <input type="date" name="capturedAt" />
            </label>
            <label className="full-width">
              תיאור
              <textarea name="description" />
            </label>
            <label className="full-width">
              הערות
              <textarea name="notes" />
            </label>
            <label className="full-width">
              תמונה
              <input type="file" name="file" accept=".png,.jpg,.jpeg,.webp" required />
            </label>
            <button type="submit">העלאת תמונה</button>
          </form>

          {uploadError ? <StatusMessage message={uploadError} tone="error" /> : null}

          <div className="image-grid">
            {patient.images.length ? (
              patient.images.map((image) => (
                <article key={image.id} className="image-card">
                  <img src={getFileUrl(image.filePath)} alt={image.title} />
                  <div>
                    <strong>{image.title}</strong>
                    <p className="muted">{image.imageType}</p>
                    <p>{image.description || image.notes || "ללא הערות."}</p>
                    <button className="ghost-button" type="button" onClick={() => void handleDeleteImage(image.id)}>
                      מחיקה
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="muted">אין תמונות למטופל זה.</p>
            )}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
