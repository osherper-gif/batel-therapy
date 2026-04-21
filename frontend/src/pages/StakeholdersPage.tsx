import { FormEvent, useState } from "react";
import { EntityTable } from "../components/EntityTable";
import { SectionCard } from "../components/SectionCard";
import { StatusMessage } from "../components/StatusMessage";
import { useAsync } from "../hooks/useAsync";
import { apiFetch } from "../lib/api";
import { mapErrorToHebrew } from "../lib/ui-text";
import type { Contact } from "../types";

const emptyContact = {
  id: "",
  fullName: "",
  role: "",
  phone: "",
  email: "",
  address: "",
  preferredLanguage: "Hebrew",
  generalNotes: ""
};

export function StakeholdersPage() {
  const contactsQuery = useAsync(() => apiFetch<{ contacts: Contact[] }>("/stakeholders"));
  const [form, setForm] = useState(emptyContact);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError(null);
      const method = form.id ? "PUT" : "POST";
      const path = form.id ? `/stakeholders/${form.id}` : "/stakeholders";
      await apiFetch(path, {
        method,
        body: JSON.stringify(form)
      });
      setForm(emptyContact);
      await contactsQuery.reload();
    } catch (submitError) {
      setError(mapErrorToHebrew(submitError, "לא הצלחנו לשמור את איש הקשר."));
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("למחוק את איש הקשר מהמאגר המרכזי?")) {
      return;
    }

    await apiFetch(`/stakeholders/${id}`, { method: "DELETE" });
    await contactsQuery.reload();
  }

  function handleEdit(contact: Contact) {
    setForm({
      id: contact.id,
      fullName: contact.fullName,
      role: contact.role,
      phone: contact.phone || "",
      email: contact.email || "",
      address: contact.address || "",
      preferredLanguage: contact.preferredLanguage || "Hebrew",
      generalNotes: contact.generalNotes || ""
    });
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Contacts</p>
          <h1>אנשי קשר</h1>
          <p className="muted">מאגר מרכזי של הורים, מורים, יועצות ואנשי צוות שניתן לקשר לכמה מטופלים.</p>
        </div>
      </header>

      <div className="two-column wide-left">
        <SectionCard title="מאגר אנשי קשר">
          {contactsQuery.isLoading ? <StatusMessage message="טוען אנשי קשר..." /> : null}
          {contactsQuery.error ? (
            <StatusMessage
              message={mapErrorToHebrew(new Error(contactsQuery.error), "לא הצלחנו לטעון את אנשי הקשר.")}
              tone="error"
            />
          ) : null}
          {contactsQuery.data ? (
            <EntityTable
              rows={contactsQuery.data.contacts}
              emptyText="אין עדיין אנשי קשר."
              columns={[
                { key: "name", header: "שם", render: (row) => row.fullName },
                { key: "role", header: "תפקיד", render: (row) => row.role },
                { key: "phone", header: "טלפון", render: (row) => row.phone || "-" },
                { key: "email", header: "אימייל", render: (row) => row.email || "-" },
                {
                  key: "patients",
                  header: "מטופלים מקושרים",
                  render: (row) => row.patientContacts?.map((link) => link.patient?.fullName).filter(Boolean).join(", ") || "-"
                },
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

        <SectionCard title={form.id ? "עריכת איש קשר" : "איש קשר חדש"}>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              שם מלא
              <input
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
              />
            </label>

            <label>
              תפקיד / קטגוריה
              <input value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} />
            </label>

            <label>
              טלפון
              <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </label>

            <label>
              אימייל
              <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>

            <label>
              כתובת
              <input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
            </label>

            <label>
              שפה מועדפת
              <input
                value={form.preferredLanguage}
                onChange={(event) => setForm({ ...form, preferredLanguage: event.target.value })}
              />
            </label>

            <label className="full-width">
              הערות כלליות
              <textarea
                value={form.generalNotes}
                onChange={(event) => setForm({ ...form, generalNotes: event.target.value })}
              />
            </label>

            {error ? <StatusMessage message={error} tone="error" /> : null}

            <div className="button-row full-width">
              <button type="submit">{form.id ? "עדכון איש קשר" : "שמירת איש קשר"}</button>
              {form.id ? (
                <button className="secondary-button" type="button" onClick={() => setForm(emptyContact)}>
                  ביטול עריכה
                </button>
              ) : null}
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
