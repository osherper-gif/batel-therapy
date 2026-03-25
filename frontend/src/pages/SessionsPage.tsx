import { FormEvent, useState } from "react";
import { EntityTable } from "../components/EntityTable";
import { SectionCard } from "../components/SectionCard";
import { StatusMessage } from "../components/StatusMessage";
import { useAsync } from "../hooks/useAsync";
import { apiFetch } from "../lib/api";
import { mapErrorToHebrew } from "../lib/ui-text";
import type { Patient, Session } from "../types";

const emptySession = {
  id: "",
  patientId: "",
  date: "",
  startTime: "",
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
};

export function SessionsPage() {
  const sessionsQuery = useAsync(() => apiFetch<{ sessions: Session[] }>("/sessions"));
  const patientsQuery = useAsync(() => apiFetch<{ patients: Patient[] }>("/patients"));
  const [form, setForm] = useState(emptySession);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [quickMode, setQuickMode] = useState(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError(null);
      const method = form.id ? "PUT" : "POST";
      const path = form.id ? `/sessions/${form.id}` : "/sessions";
      await apiFetch(path, {
        method,
        body: JSON.stringify(form)
      });
      setForm(emptySession);
      setShowForm(false);
      await sessionsQuery.reload();
    } catch (submitError) {
      setError(mapErrorToHebrew(submitError, "לא הצלחנו לשמור את המפגש. אפשר לנסות שוב."));
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("למחוק את המפגש?")) {
      return;
    }

    await apiFetch(`/sessions/${id}`, { method: "DELETE" });
    await sessionsQuery.reload();
  }

  function handleEdit(session: Session) {
    setShowForm(true);
    setQuickMode(false);
    setForm({
      id: session.id,
      patientId: session.patientId,
      date: session.date.slice(0, 10),
      startTime: session.startTime,
      durationMinutes: session.durationMinutes,
      sessionType: session.sessionType,
      frameworkType: session.frameworkType || "",
      location: session.location || "",
      attendees: session.attendees || "",
      goal: session.goal || "",
      sessionDescription: session.sessionDescription || "",
      materialsUsed: session.materialsUsed || "",
      behaviorNotes: session.behaviorNotes || "",
      clinicalImpression: session.clinicalImpression || "",
      followUpNotes: session.followUpNotes || ""
    });
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Sessions</p>
          <h1>מפגשים</h1>
          <p className="muted">גישה מהירה לתיעוד מפגש חדש או מעבר לטופס המלא.</p>
        </div>
        <button type="button" onClick={() => setShowForm((current) => !current)}>
          {showForm ? "סגירת טופס" : "מפגש חדש"}
        </button>
      </header>

      <div className="two-column wide-left">
        <SectionCard title="יומן מפגשים">
          {sessionsQuery.isLoading ? <StatusMessage message="טוען מפגשים..." /> : null}
          {sessionsQuery.error ? (
            <StatusMessage
              message={mapErrorToHebrew(new Error(sessionsQuery.error), "לא הצלחנו לטעון את רשימת המפגשים.")}
              tone="error"
            />
          ) : null}
          {sessionsQuery.data ? (
            <EntityTable
              rows={sessionsQuery.data.sessions}
              emptyText="אין מפגשים."
              columns={[
                { key: "patient", header: "מטופל", render: (row) => row.patient?.fullName || "-" },
                {
                  key: "date",
                  header: "תאריך",
                  render: (row) => new Date(row.date).toLocaleDateString("he-IL")
                },
                { key: "time", header: "שעה", render: (row) => row.startTime },
                { key: "type", header: "סוג", render: (row) => row.sessionType },
                { key: "goal", header: "מטרה", render: (row) => row.goal || "-" },
                {
                  key: "actions",
                  header: "",
                  render: (row) => (
                    <div className="table-actions">
                      <button className="ghost-button" type="button" onClick={() => handleEdit(row)}>
                        עריכה
                      </button>
                      <button className="ghost-button" type="button" onClick={() => void handleDelete(row.id)}>
                        מחיקה
                      </button>
                    </div>
                  )
                }
              ]}
            />
          ) : null}
        </SectionCard>

        <SectionCard
          title={form.id ? "עריכת מפגש" : "מפגש חדש"}
          subtitle="אפשר להתחיל במצב מהיר ורק אם צריך לפתוח את כל השדות."
          actions={
            showForm ? (
              <button className="ghost-button" type="button" onClick={() => setQuickMode((current) => !current)}>
                {quickMode ? "מעבר לטופס מלא" : "חזרה למצב מהיר"}
              </button>
            ) : null
          }
        >
          {showForm ? (
            <form className={quickMode ? "quick-session-form" : "form-grid"} onSubmit={handleSubmit}>
              <label>
                מטופל
                <select
                  value={form.patientId}
                  onChange={(event) => setForm({ ...form, patientId: event.target.value })}
                >
                  <option value="">בחרי מטופל</option>
                  {patientsQuery.data?.patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.fullName}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                תאריך
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm({ ...form, date: event.target.value })}
                />
              </label>

              <label>
                שעת התחלה
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(event) => setForm({ ...form, startTime: event.target.value })}
                />
              </label>

              <label>
                משך בדקות
                <input
                  type="number"
                  value={form.durationMinutes}
                  onChange={(event) => setForm({ ...form, durationMinutes: Number(event.target.value) })}
                />
              </label>

              <label>
                סוג מפגש
                <input
                  value={form.sessionType}
                  onChange={(event) => setForm({ ...form, sessionType: event.target.value })}
                />
              </label>

              <label className="full-width">
                מטרה קצרה
                <input value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value })} />
              </label>

              {quickMode ? null : (
                <>
                  <label>
                    מיקום
                    <input
                      value={form.location}
                      onChange={(event) => setForm({ ...form, location: event.target.value })}
                    />
                  </label>

                  <label className="full-width">
                    תיאור מפגש
                    <textarea
                      value={form.sessionDescription}
                      onChange={(event) => setForm({ ...form, sessionDescription: event.target.value })}
                    />
                  </label>

                  <label className="full-width">
                    התרשמות קלינית
                    <textarea
                      value={form.clinicalImpression}
                      onChange={(event) =>
                        setForm({ ...form, clinicalImpression: event.target.value })
                      }
                    />
                  </label>
                </>
              )}

              {error ? <StatusMessage message={error} tone="error" /> : null}

              <div className="button-row full-width">
                <button type="submit">{form.id ? "עדכון מפגש" : quickMode ? "שמירה מהירה" : "שמירת מפגש"}</button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    setForm(emptySession);
                    setShowForm(false);
                    setQuickMode(true);
                  }}
                >
                  ביטול
                </button>
              </div>
            </form>
          ) : (
            <p className="muted">לחצי על "מפגש חדש" כדי לפתוח תיעוד מהיר.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
