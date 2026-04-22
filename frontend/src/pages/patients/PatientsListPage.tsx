import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "../../design-system/PageHeader";
import { Button } from "../../design-system/Button";
import { SearchInput } from "../../design-system/SearchInput";
import { Segmented } from "../../design-system/Tabs";
import { Card, CardBody } from "../../design-system/Card";
import { Badge } from "../../design-system/Badge";
import { Avatar } from "../../design-system/Avatar";
import { Icon } from "../../design-system/Icon";
import { EmptyState } from "../../design-system/EmptyState";
import { SkeletonRows } from "../../design-system/Skeleton";
import { Callout } from "../../design-system/Callout";
import { Field, SelectInput, TextArea, TextInput } from "../../design-system/Field";
import {
  createPatient,
  listPatients,
  type PatientMutationInput
} from "../../services/patientsService";
import { downloadJson, showPlaceholderMessage } from "../../lib/uiActions";
import type { Patient } from "../../types";

type FilterKey = "all" | "active" | "onboarding" | "on_hold";

const EMPTY_PATIENT_DRAFT: PatientMutationInput = {
  fullName: "",
  dateOfBirth: "",
  educationalFramework: "",
  frameworkType: "",
  treatmentFramework: "קליניקה פרטית",
  mainConcerns: "",
  treatmentGoals: "",
  status: "onboarding"
};

const DEFAULT_PATIENT_DRAFT: PatientMutationInput = {
  ...EMPTY_PATIENT_DRAFT,
  treatmentFramework: "Private"
};

export function PatientsListPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [draft, setDraft] = useState(DEFAULT_PATIENT_DRAFT);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const isCreateOpen = searchParams.get("new") === "1";

  async function loadPatients() {
    setLoading(true);
    try {
      const list = await listPatients();
      setPatients(list);
      setError(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "לא הצלחנו לטעון את רשימת המטופלים.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients().catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim();
    return patients.filter((patient) => {
      if (filter !== "all" && patient.status !== filter) return false;
      if (normalizedQuery && !patient.fullName.includes(normalizedQuery)) return false;
      return true;
    });
  }, [patients, filter, query]);

  async function handleCreatePatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setFormError(null);
      const created = await createPatient({
        ...draft,
        treatmentFramework: draft.treatmentFramework || "Private",
        educationalFramework: draft.educationalFramework || "",
        frameworkType: draft.frameworkType || "",
        mainConcerns: draft.mainConcerns || "",
        treatmentGoals: draft.treatmentGoals || ""
      });
      setPatients((current) => [created, ...current]);
      setDraft(DEFAULT_PATIENT_DRAFT);
      setSearchParams({});
      navigate(`/patients/${created.id}`);
      void loadPatients();
    } catch (nextError) {
      setFormError(nextError instanceof Error ? nextError.message : "לא הצלחנו ליצור מטופל חדש.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="מרחב עבודה"
        title="מטופלים"
        subtitle="רשימת המטופלים הפעילים במערכת, ממוינת לפי שינוי אחרון."
        actions={
          <>
            <Button
              variant="secondary"
              iconStart={<Icon name="download" size={16} />}
              onClick={() =>
                downloadJson("batel-patients-export.json", {
                  exportedAt: new Date().toISOString(),
                  count: filtered.length,
                  patients: filtered
                })
              }
            >
              ייצוא
            </Button>
            <Button iconStart={<Icon name="plus" size={16} />} onClick={() => setSearchParams({ new: "1" })}>
              מטופל חדש
            </Button>
          </>
        }
      />

      {isCreateOpen ? (
        <Card>
          <CardBody>
            <form onSubmit={handleCreatePatient} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap"
                }}
              >
                <div>
                  <strong style={{ fontSize: "var(--text-lg)" }}>יצירת מטופל חדש</strong>
                  <p className="ds-t-sm ds-t-muted" style={{ marginTop: 4 }}>
                    הפתיחה נשמרת מול המערכת הקיימת ומעבירה ישירות לכרטיס המטופל.
                  </p>
                </div>
                <Button variant="ghost" type="button" onClick={() => setSearchParams({})}>
                  סגירה
                </Button>
              </div>

              {formError ? (
                <Callout tone="danger" title="לא הצלחנו ליצור מטופל">
                  {formError}
                </Callout>
              ) : null}

              <div className="ds-form-grid ds-form-grid--2">
                <Field label="שם מלא" required>
                  <TextInput
                    value={draft.fullName}
                    onChange={(event) => setDraft((current) => ({ ...current, fullName: event.target.value }))}
                  />
                </Field>
                <Field label="תאריך לידה" required>
                  <TextInput
                    type="date"
                    value={draft.dateOfBirth}
                    onChange={(event) => setDraft((current) => ({ ...current, dateOfBirth: event.target.value }))}
                  />
                </Field>
                <Field label="מסגרת טיפול" required>
                  <SelectInput
                    value={draft.treatmentFramework}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, treatmentFramework: event.target.value }))
                    }
                  >
                    <option value="Private">קליניקה פרטית</option>
                    <option value="Matiya">מתיא</option>
                    <option value="Mixed">משולב</option>
                  </SelectInput>
                </Field>
                <Field label="סטטוס">
                  <SelectInput
                    value={draft.status}
                    onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))}
                  >
                    <option value="onboarding">בהצטרפות</option>
                    <option value="active">פעיל</option>
                    <option value="on_hold">מוקפא</option>
                  </SelectInput>
                </Field>
                <Field label="מסגרת חינוכית">
                  <TextInput
                    value={draft.educationalFramework || ""}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, educationalFramework: event.target.value }))
                    }
                  />
                </Field>
                <Field label="סוג מסגרת">
                  <TextInput
                    value={draft.frameworkType || ""}
                    onChange={(event) => setDraft((current) => ({ ...current, frameworkType: event.target.value }))}
                  />
                </Field>
                <Field label="קשיים מרכזיים">
                  <TextArea
                    rows={3}
                    value={draft.mainConcerns || ""}
                    onChange={(event) => setDraft((current) => ({ ...current, mainConcerns: event.target.value }))}
                  />
                </Field>
                <Field label="מטרות טיפול">
                  <TextArea
                    rows={3}
                    value={draft.treatmentGoals || ""}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, treatmentGoals: event.target.value }))
                    }
                  />
                </Field>
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <Button variant="ghost" type="button" onClick={() => setSearchParams({})} disabled={isSubmitting}>
                  ביטול
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  שמירת מטופל
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : null}

      <Card>
        <CardBody compact>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >
            <div style={{ flex: 1, minWidth: 240 }}>
              <SearchInput placeholder="חיפוש לפי שם" value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
            <Segmented<FilterKey>
              value={filter}
              onChange={setFilter}
              items={[
                { value: "all", label: "הכל" },
                { value: "active", label: "פעילים" },
                { value: "onboarding", label: "בהצטרפות" },
                { value: "on_hold", label: "מוקפאים" }
              ]}
            />
            <Button
              variant="ghost"
              iconStart={<Icon name="filter" size={16} />}
              onClick={() =>
                showPlaceholderMessage("מסננים מתקדמים עדיין לא מומשו. כרגע אפשר לסנן לפי סטטוס ולחפש לפי שם.")
              }
            >
              מסננים מתקדמים
            </Button>
          </div>
        </CardBody>
      </Card>

      {error ? <Callout tone="warning">{error}. מציגים מאגר מקומי.</Callout> : null}

      {isLoading ? (
        <Card>
          <CardBody>
            <SkeletonRows count={4} height={72} />
          </CardBody>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="users"
              title="לא נמצאו מטופלים"
              description={
                query
                  ? `אין התאמה לחיפוש "${query}".`
                  : "אפשר להוסיף את המטופל הראשון דרך כפתור 'מטופל חדש'."
              }
            />
          </CardBody>
        </Card>
      ) : (
        <div className="ds-grid ds-grid--auto">
          {filtered.map((patient) => (
            <PatientCard key={patient.id} patient={patient} onClick={() => navigate(`/patients/${patient.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

function PatientCard({
  patient,
  onClick
}: {
  patient: Patient;
  onClick: () => void;
}) {
  return (
    <Card
      variant="default"
      style={{ cursor: "pointer", transition: "transform 200ms" }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "";
      }}
      onClick={onClick}
    >
      <div
        style={{
          padding: "var(--space-5)",
          display: "flex",
          flexDirection: "column",
          gap: 14
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12
          }}
        >
          <Avatar name={patient.fullName} size="lg" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "var(--text-lg)",
                color: "var(--text-strong)"
              }}
            >
              {patient.fullName}
            </div>
            <div
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-muted)",
                marginTop: 2
              }}
            >
              גיל {patient.age} · {patient.treatmentFramework}
            </div>
          </div>
          <Badge tone={statusTone(patient.status)}>{statusLabel(patient.status)}</Badge>
        </div>

        {patient.mainConcerns ? (
          <div
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text)",
              padding: "var(--space-3)",
              background: "var(--bg-muted)",
              borderRadius: "var(--radius-sm)",
              lineHeight: 1.5
            }}
          >
            {patient.mainConcerns}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)"
          }}
        >
          <span>
            <Icon name="clock" size={12} style={{ verticalAlign: "-2px", marginInlineEnd: 4 }} />
            עודכן{" "}
            {new Date(patient.updatedAt).toLocaleDateString("he-IL", {
              day: "numeric",
              month: "short"
            })}
          </span>
          {patient.educationalFramework ? (
            <Badge tone="muted" icon={<Icon name="compass" size={12} />}>
              {patient.educationalFramework}
            </Badge>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function statusLabel(status: string) {
  if (status === "active") return "פעיל";
  if (status === "onboarding") return "בהצטרפות";
  if (status === "on_hold") return "מוקפא";
  return status;
}

function statusTone(status: string): "success" | "info" | "muted" {
  if (status === "active") return "success";
  if (status === "onboarding") return "info";
  return "muted";
}
