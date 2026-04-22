import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../../design-system/PageHeader";
import { Card, CardBody } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { SearchInput } from "../../design-system/SearchInput";
import { Segmented } from "../../design-system/Tabs";
import { Badge } from "../../design-system/Badge";
import { Avatar } from "../../design-system/Avatar";
import { Icon } from "../../design-system/Icon";
import { EmptyState } from "../../design-system/EmptyState";
import { Callout } from "../../design-system/Callout";
import { Field, TextInput, TextArea } from "../../design-system/Field";
import { apiFetch } from "../../lib/api";
import { downloadJson } from "../../lib/uiActions";
import type { Contact } from "../../types";

type Filter = "all" | "parent" | "external" | "framework";

const EMPTY_CONTACT_DRAFT = {
  fullName: "",
  role: "",
  phone: "",
  email: "",
  address: "",
  preferredLanguage: "עברית",
  generalNotes: ""
};

const roleFilter = (role: string, filter: Filter) => {
  if (filter === "all") return true;
  if (filter === "parent") return role.includes("אם") || role.includes("אב") || role.includes("הורה");
  if (filter === "framework") return role.includes("מסגרת") || role.includes("גן") || role.includes("בית ספר");
  if (filter === "external") {
    return !role.includes("אם") && !role.includes("אב") && !role.includes("הורה") && !role.includes("מסגרת");
  }
  return true;
};

export function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [draft, setDraft] = useState(EMPTY_CONTACT_DRAFT);
  const [isSubmitting, setSubmitting] = useState(false);

  const isCreateOpen = searchParams.get("new") === "1";

  async function loadContacts() {
    try {
      const response = await apiFetch<{ contacts: Contact[] }>("/stakeholders");
      setContacts(response.contacts);
      setError(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "לא הצלחנו לטעון את אנשי הקשר.");
    }
  }

  useEffect(() => {
    loadContacts().catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim();
    return contacts.filter(
      (contact) =>
        (!normalizedQuery || contact.fullName.includes(normalizedQuery) || contact.role.includes(normalizedQuery)) &&
        roleFilter(contact.role, filter)
    );
  }, [contacts, filter, query]);

  async function handleCreateContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      await apiFetch("/stakeholders", {
        method: "POST",
        body: JSON.stringify({
          ...draft,
          phone: draft.phone || null,
          email: draft.email || null,
          address: draft.address || null,
          preferredLanguage: draft.preferredLanguage || null,
          generalNotes: draft.generalNotes || null
        })
      });
      setDraft(EMPTY_CONTACT_DRAFT);
      setSearchParams({});
      await loadContacts();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "לא הצלחנו ליצור איש קשר חדש.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="ארכיון"
        title="אנשי קשר"
        subtitle="כל ההורים, היועצות, המסגרות והאנשים המעורבים בטיפול."
        actions={
          <>
            <Button
              variant="secondary"
              iconStart={<Icon name="download" size={16} />}
              onClick={() =>
                downloadJson("batel-contacts-export.json", {
                  exportedAt: new Date().toISOString(),
                  contacts: filtered
                })
              }
            >
              ייצוא
            </Button>
            <Button iconStart={<Icon name="plus" size={16} />} onClick={() => setSearchParams({ new: "1" })}>
              איש קשר חדש
            </Button>
          </>
        }
      />

      {isCreateOpen ? (
        <Card>
          <CardBody>
            <form onSubmit={handleCreateContact} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <strong style={{ fontSize: "var(--text-lg)" }}>יצירת איש קשר חדש</strong>
                  <p className="ds-t-sm ds-t-muted" style={{ marginTop: 4 }}>
                    האיש יישמר במאגר הכללי ואפשר יהיה לקשר אותו למטופלים מתוך כרטיס המטופל.
                  </p>
                </div>
                <Button variant="ghost" type="button" onClick={() => setSearchParams({})}>
                  סגירה
                </Button>
              </div>

              <div className="ds-form-grid ds-form-grid--2">
                <Field label="שם מלא" required>
                  <TextInput
                    value={draft.fullName}
                    onChange={(event) => setDraft((current) => ({ ...current, fullName: event.target.value }))}
                  />
                </Field>
                <Field label="תפקיד / קטגוריה" required>
                  <TextInput
                    value={draft.role}
                    onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value }))}
                  />
                </Field>
                <Field label="טלפון">
                  <TextInput
                    value={draft.phone}
                    onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))}
                  />
                </Field>
                <Field label="אימייל">
                  <TextInput
                    type="email"
                    value={draft.email}
                    onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
                  />
                </Field>
                <Field label="שפה מועדפת">
                  <TextInput
                    value={draft.preferredLanguage}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, preferredLanguage: event.target.value }))
                    }
                  />
                </Field>
                <Field label="כתובת">
                  <TextInput
                    value={draft.address}
                    onChange={(event) => setDraft((current) => ({ ...current, address: event.target.value }))}
                  />
                </Field>
                <Field label="הערות כלליות">
                  <TextArea
                    rows={3}
                    value={draft.generalNotes}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, generalNotes: event.target.value }))
                    }
                  />
                </Field>
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Button variant="ghost" type="button" onClick={() => setSearchParams({})} disabled={isSubmitting}>
                  ביטול
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  שמירת איש קשר
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : null}

      {error ? (
        <Callout tone="warning" title="עדכון אנשי קשר">
          {error}
        </Callout>
      ) : null}

      <Card>
        <CardBody compact>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <SearchInput placeholder="חיפוש לפי שם או תפקיד" value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
            <Segmented<Filter>
              value={filter}
              onChange={setFilter}
              items={[
                { value: "all", label: "הכל" },
                { value: "parent", label: "הורים" },
                { value: "framework", label: "מסגרות" },
                { value: "external", label: "אנשי מקצוע" }
              ]}
            />
          </div>
        </CardBody>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="users"
              title="לא נמצאו אנשי קשר"
              description="אפשר להוסיף איש קשר חדש ולקשר אותו למטופל מתוך כרטיס המטופל."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="ds-grid ds-grid--auto">
          {filtered.map((contact) => (
            <Card key={contact.id}>
              <CardBody compact>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                  <Avatar name={contact.fullName} size="md" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ fontSize: "var(--text-base)" }}>{contact.fullName}</strong>
                    <div className="ds-t-xs ds-t-muted">{contact.role}</div>
                  </div>
                  <Badge tone="outline">{contact.preferredLanguage || "—"}</Badge>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    fontSize: "var(--text-sm)",
                    color: "var(--text-muted)",
                    paddingTop: 10,
                    borderTop: "1px dashed var(--border-soft)"
                  }}
                >
                  {contact.phone ? (
                    <div>
                      <Icon name="phone" size={14} style={{ verticalAlign: "-2px", marginInlineEnd: 6 }} />
                      {contact.phone}
                    </div>
                  ) : null}
                  {contact.email ? (
                    <div>
                      <Icon name="mail" size={14} style={{ verticalAlign: "-2px", marginInlineEnd: 6 }} />
                      {contact.email}
                    </div>
                  ) : null}
                  {contact.address ? (
                    <div>
                      <Icon name="globe" size={14} style={{ verticalAlign: "-2px", marginInlineEnd: 6 }} />
                      {contact.address}
                    </div>
                  ) : null}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
