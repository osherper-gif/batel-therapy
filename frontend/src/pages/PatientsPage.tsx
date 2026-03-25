import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EntityTable } from "../components/EntityTable";
import { SectionCard } from "../components/SectionCard";
import { StatusMessage } from "../components/StatusMessage";
import { useAsync } from "../hooks/useAsync";
import { apiFetch } from "../lib/api";
import { mapErrorToHebrew } from "../lib/ui-text";
import type { Patient } from "../types";

const emptyPatient = {
  id: "",
  fullName: "",
  dateOfBirth: "",
  educationalFramework: "",
  frameworkType: "",
  treatmentFramework: "Matiya",
  mainConcerns: "",
  treatmentGoals: "",
  status: "Active"
};

export function PatientsPage() {
  const { data, error, isLoading, reload } = useAsync(() => apiFetch<{ patients: Patient[] }>("/patients"));
  const [form, setForm] = useState(emptyPatient);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = useMemo(() => {
    const patients = data?.patients ?? [];
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return patients;
    }

    return patients.filter((patient) => patient.fullName.toLowerCase().includes(term));
  }, [data?.patients, searchTerm]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setFormError(null);
      const method = form.id ? "PUT" : "POST";
      const path = form.id ? `/patients/${form.id}` : "/patients";

      await apiFetch(path, {
        method,
        body: JSON.stringify(form)
      });

      setForm(emptyPatient);
      setShowForm(false);
      await reload();
    } catch (submitError) {
      setFormError(mapErrorToHebrew(submitError, "לא הצלחנו לשמור את המטופל. אפשר לנסות שוב."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("למחוק את המטופל ואת כל הנתונים הקשורים אליו?")) {
      return;
    }

    await apiFetch(`/patients/${id}`, { method: "DELETE" });
    await reload();
  }

  function handleEdit(patient: Patient) {
    setShowForm(true);
    setForm({
      id: patient.id,
      fullName: patient.fullName,
      dateOfBirth: patient.dateOfBirth.slice(0, 10),
      educationalFramework: patient.educationalFramework || "",
      frameworkType: patient.frameworkType || "",
      treatmentFramework: patient.treatmentFramework,
      mainConcerns: patient.mainConcerns || "",
      treatmentGoals: patient.treatmentGoals || "",
      status: patient.status
    });
  }

  function handleNewPatient() {
    setForm(emptyPatient);
    setFormError(null);
    setShowForm((current) => !current);
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Patients</p>
          <h1>מטופלים</h1>
          <p className="muted">חיפוש מהיר והוספת מטופל חדש עם טופס קצר.</p>
        </div>
        <button type="button" onClick={handleNewPatient}>
          {showForm ? "סגירת טופס" : "מטופל חדש"}
        </button>
      </header>

      <div className="two-column wide-left">
        <SectionCard
          title="רשימת מטופלים"
          actions={
            <div className="search-box">
              <input
                placeholder="חיפוש לפי שם מטופל"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          }
        >
          {isLoading ? <StatusMessage message="טוען מטופלים..." /> : null}
          {error ? (
            <StatusMessage
              message={mapErrorToHebrew(new Error(error), "לא הצלחנו לטעון את רשימת המטופלים.")}
              tone="error"
            />
          ) : null}
          {data ? (
            <EntityTable
              rows={filteredPatients}
              emptyText={searchTerm ? "לא נמצא מטופל שמתאים לחיפוש." : "עדיין אין מטופלים."}
              columns={[
                {
                  key: "name",
                  header: "שם",
                  render: (patient) => <Link to={`/patients/${patient.id}`}>{patient.fullName}</Link>
                },
                { key: "age", header: "גיל", render: (patient) => patient.age },
                { key: "framework", header: "מסגרת", render: (patient) => patient.treatmentFramework },
                { key: "status", header: "סטטוס", render: (patient) => patient.status },
                {
                  key: "actions",
                  header: "",
                  render: (patient) => (
                    <div className="table-actions">
                      <button className="ghost-button" type="button" onClick={() => handleEdit(patient)}>
                        עריכה
                      </button>
                      <button className="ghost-button" type="button" onClick={() => void handleDelete(patient.id)}>
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
          title={form.id ? "עריכת מטופל" : "טופס מטופל חדש"}
          subtitle="שדות חובה בלבד כדי להתחיל מהר. אפשר להשלים פרטים נוספים בהמשך."
        >
          {showForm ? (
            <form className="compact-form" onSubmit={handleSubmit}>
              <label>
                שם מלא
                <input
                  value={form.fullName}
                  onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                />
              </label>

              <label>
                תאריך לידה
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(event) => setForm({ ...form, dateOfBirth: event.target.value })}
                />
              </label>

              <label>
                מסגרת טיפול
                <select
                  value={form.treatmentFramework}
                  onChange={(event) => setForm({ ...form, treatmentFramework: event.target.value })}
                >
                  <option value="Matiya">Matiya</option>
                  <option value="Private">Private</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </label>

              <label>
                סטטוס
                <input
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                />
              </label>

              {formError ? <StatusMessage message={formError} tone="error" /> : null}

              <div className="button-row">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "שומר..." : form.id ? "עדכון מטופל" : "שמירת מטופל"}
                </button>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    setForm(emptyPatient);
                    setShowForm(false);
                  }}
                >
                  ביטול
                </button>
              </div>
            </form>
          ) : (
            <p className="muted">לחצי על "מטופל חדש" כדי לפתוח טופס קצר ומהיר.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
