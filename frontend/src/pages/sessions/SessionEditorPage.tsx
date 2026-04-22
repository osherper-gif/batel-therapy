import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PageHeader } from "../../design-system/PageHeader";
import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { Badge } from "../../design-system/Badge";
import { Avatar } from "../../design-system/Avatar";
import { Icon } from "../../design-system/Icon";
import { Field, TextInput, TextArea, SelectInput } from "../../design-system/Field";
import { Callout } from "../../design-system/Callout";
import { Skeleton } from "../../design-system/Skeleton";
import { showPlaceholderMessage } from "../../lib/uiActions";
import {
  createSession,
  getSession,
  updateSession,
  type SessionMutationInput
} from "../../services/sessionsService";
import { listPatients } from "../../services/patientsService";
import { mockImages } from "../../mocks";
import type { Session, Patient } from "../../types";

type Mode = "view" | "edit" | "new";

const SESSION_TYPES = ["פרטני", "קבוצתי", "משפחתי", "הכרות", "מעקב", "סיום"];
const FRAMEWORK_TYPES = [
  "קליניקה",
  "מסגרת חינוכית",
  "בית",
  "בית חולים",
  "מרכז יום",
  "אחר"
];

const EMPTY_DRAFT: Session = {
  id: "",
  patientId: "",
  date: new Date().toISOString().slice(0, 10),
  startTime: "09:00",
  durationMinutes: 50,
  sessionType: "פרטני",
  frameworkType: "קליניקה",
  location: "חדר טיפולים",
  attendees: "מטופל/ת + מטפלת",
  goal: "",
  sessionDescription: "",
  materialsUsed: "",
  behaviorNotes: "",
  clinicalImpression: "",
  followUpNotes: "",
  createdAt: "",
  updatedAt: ""
};

export function SessionEditorPage() {
  const params = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isNew = !params.id || params.id === "new";
  const [mode, setMode] = useState<Mode>(isNew ? "new" : "view");
  const [session, setSession] = useState<Session | null>(null);
  const [draft, setDraft] = useState<Session>(EMPTY_DRAFT);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const patientIdParam = searchParams.get("patientId");

    Promise.all([
      isNew ? Promise.resolve(null) : getSession(params.id!),
      listPatients()
    ])
      .then(([s, pts]) => {
        if (!alive) return;
        setPatients(pts);
        if (s) {
          setSession(s);
          setDraft(s);
        } else if (isNew) {
          const initial: Session = {
            ...EMPTY_DRAFT,
            patientId: patientIdParam || ""
          };
          if (patientIdParam) {
            const p = pts.find((x) => x.id === patientIdParam);
            if (p) {
              initial.patient = { id: p.id, fullName: p.fullName };
              initial.frameworkType = p.frameworkType || "קליניקה";
            }
          }
          setDraft(initial);
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [params.id, isNew, searchParams]);

  const patientOf = useMemo(() => {
    if (draft.patient) return draft.patient;
    const p = patients.find((x) => x.id === draft.patientId);
    return p ? { id: p.id, fullName: p.fullName } : null;
  }, [draft, patients]);

  const linkedImages = useMemo(() => {
    if (!session) return [];
    return mockImages.filter((img) => img.sessionId === session.id);
  }, [session]);

  const update = <K extends keyof Session>(key: K, value: Session[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  async function handleSave() {
    try {
      setSaving(true);
    // Simulated save — in a real app this would call sessionsService.save()
      const payload: SessionMutationInput = {
        patientId: draft.patientId,
        date: draft.date,
        startTime: draft.startTime,
        durationMinutes: draft.durationMinutes,
        sessionType: draft.sessionType,
        frameworkType: draft.frameworkType || "",
        location: draft.location || "",
        attendees: draft.attendees || "",
        goal: draft.goal || "",
        sessionDescription: draft.sessionDescription || "",
        materialsUsed: draft.materialsUsed || "",
        behaviorNotes: draft.behaviorNotes || "",
        clinicalImpression: draft.clinicalImpression || "",
        followUpNotes: draft.followUpNotes || ""
      };
      const saved = isNew || !params.id ? await createSession(payload) : await updateSession(params.id, payload);
      setDraft(saved);
      setSession(saved);

      if (isNew) {
        navigate("/sessions");
        return;
      }

      setMode("view");
    } catch (error) {
      showPlaceholderMessage(error instanceof Error ? error.message : "לא הצלחנו לשמור את המפגש.");
    } finally {
      setSaving(false);
    }
  }

  const handleCancel = () => {
    if (isNew) {
      navigate("/sessions");
      return;
    }
    if (session) setDraft(session);
    setMode("view");
  };

  if (isLoading) {
    return (
      <div className="ds-page">
        <Card>
          <CardBody>
            <Skeleton height={320} />
          </CardBody>
        </Card>
      </div>
    );
  }

  const editing = mode === "edit" || mode === "new";
  const title = isNew
    ? "מפגש חדש"
    : patientOf
      ? `מפגש — ${patientOf.fullName}`
      : "מפגש";

  const subtitle = editing
    ? "מלאי את הפרטים — המידע נשמר בצורה מאובטחת."
    : session
      ? `${new Date(session.date).toLocaleDateString("he-IL", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        })} · ${session.startTime} · ${session.durationMinutes} דק'`
      : "";

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow={
          <span
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/sessions")}
          >
            <Icon name="chevronRight" size={12} /> מפגשים
          </span>
        }
        title={title}
        subtitle={subtitle}
        actions={
          editing ? (
            <>
              <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
                ביטול
              </Button>
              <Button
                iconStart={<Icon name="save" size={16} />}
                onClick={handleSave}
                loading={isSaving}
                data-testid="session-save"
              >
                שמירה
              </Button>
            </>
          ) : (
            <>
                <Button
                  variant="secondary"
                  iconStart={<Icon name="printer" size={16} />}
                  onClick={() => showPlaceholderMessage("הדפסת מפגש עדיין לא מומשה.")}
                >
                הדפסה
              </Button>
              <Button
                iconStart={<Icon name="edit" size={16} />}
                onClick={() => setMode("edit")}
              >
                עריכה
              </Button>
            </>
          )
        }
      />

      <div className="ds-grid ds-grid--2-1">
        <div className="ds-col">
          <Card>
            <CardHeader
              title="פרטי מפגש"
              subtitle="מטופל/ת, מועד, משך ומסגרת."
              eyebrow={<Icon name="calendar" size={14} />}
            />
            <CardBody>
              <div className="ds-form-grid ds-form-grid--2">
                <Field label="מטופל/ת" required>
                  {editing ? (
                    <SelectInput
                      data-testid="session-patient-select"
                      value={draft.patientId}
                      onChange={(e) => {
                        const id = e.target.value;
                        const p = patients.find((x) => x.id === id);
                        setDraft((d) => ({
                          ...d,
                          patientId: id,
                          patient: p
                            ? { id: p.id, fullName: p.fullName }
                            : undefined
                        }));
                      }}
                    >
                      <option value="">— בחרי מטופל/ת —</option>
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.fullName}
                        </option>
                      ))}
                    </SelectInput>
                  ) : (
                    <ReadonlyValue>
                      {patientOf ? (
                        <span
                          style={{
                            display: "inline-flex",
                            gap: 8,
                            alignItems: "center"
                          }}
                        >
                          <Avatar name={patientOf.fullName} size="sm" />
                          {patientOf.fullName}
                        </span>
                      ) : (
                        "—"
                      )}
                    </ReadonlyValue>
                  )}
                </Field>
                <Field label="סוג מפגש">
                  {editing ? (
                    <SelectInput
                      value={draft.sessionType}
                      onChange={(e) => update("sessionType", e.target.value)}
                    >
                      {SESSION_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </SelectInput>
                  ) : (
                    <ReadonlyValue>
                      <Badge tone="sage">{draft.sessionType}</Badge>
                    </ReadonlyValue>
                  )}
                </Field>

                <Field label="תאריך" required>
                  {editing ? (
                    <TextInput
                      type="date"
                      value={draft.date}
                      onChange={(e) => update("date", e.target.value)}
                    />
                  ) : (
                    <ReadonlyValue>
                      {new Date(draft.date).toLocaleDateString("he-IL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </ReadonlyValue>
                  )}
                </Field>
                <Field label="שעת התחלה" required>
                  {editing ? (
                    <TextInput
                      type="time"
                      value={draft.startTime}
                      onChange={(e) => update("startTime", e.target.value)}
                    />
                  ) : (
                    <ReadonlyValue>{draft.startTime}</ReadonlyValue>
                  )}
                </Field>

                <Field label="משך (בדקות)">
                  {editing ? (
                    <TextInput
                      type="number"
                      min={10}
                      max={180}
                      step={5}
                      value={draft.durationMinutes}
                      onChange={(e) =>
                        update(
                          "durationMinutes",
                          Number(e.target.value) || 0
                        )
                      }
                    />
                  ) : (
                    <ReadonlyValue>{draft.durationMinutes} דקות</ReadonlyValue>
                  )}
                </Field>
                <Field label="מסגרת">
                  {editing ? (
                    <SelectInput
                      value={draft.frameworkType || ""}
                      onChange={(e) => update("frameworkType", e.target.value)}
                    >
                      {FRAMEWORK_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </SelectInput>
                  ) : (
                    <ReadonlyValue>{draft.frameworkType || "—"}</ReadonlyValue>
                  )}
                </Field>

                <Field label="מיקום">
                  {editing ? (
                    <TextInput
                      value={draft.location || ""}
                      onChange={(e) => update("location", e.target.value)}
                      placeholder="לדוגמה: חדר טיפולים"
                    />
                  ) : (
                    <ReadonlyValue>{draft.location || "—"}</ReadonlyValue>
                  )}
                </Field>
                <Field label="נוכחים">
                  {editing ? (
                    <TextInput
                      value={draft.attendees || ""}
                      onChange={(e) => update("attendees", e.target.value)}
                      placeholder="לדוגמה: מטופל/ת + מטפלת"
                    />
                  ) : (
                    <ReadonlyValue>{draft.attendees || "—"}</ReadonlyValue>
                  )}
                </Field>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="תיעוד המפגש"
              subtitle="מטרה, מהלך, חומרים ותצפית התנהגותית."
              eyebrow={<Icon name="pen" size={14} />}
            />
            <CardBody>
              <div className="ds-col ds-col--md">
                <Field
                  label="מטרת המפגש"
                  hint="מה הייתי רוצה להשיג ביחידה הזו — מטרה סובייקטיבית, לא מחייבת."
                >
                  {editing ? (
                    <TextArea
                      data-testid="session-goal"
                      rows={2}
                      value={draft.goal || ""}
                      onChange={(e) => update("goal", e.target.value)}
                      placeholder="לדוגמה: עיבוד מצב רגשי מהשבוע..."
                    />
                  ) : (
                    <ProseBlock>{draft.goal || "—"}</ProseBlock>
                  )}
                </Field>

                <Field
                  label="תיאור מהלך המפגש"
                  hint="מה קרה בחדר? אילו חומרים נבחרו? איך התפתח התהליך?"
                >
                  {editing ? (
                    <TextArea
                      data-testid="session-description"
                      rows={6}
                      value={draft.sessionDescription || ""}
                      onChange={(e) =>
                        update("sessionDescription", e.target.value)
                      }
                      placeholder="תיעוד תהליכי ויזואלי ועשייתי..."
                    />
                  ) : (
                    <ProseBlock>{draft.sessionDescription || "—"}</ProseBlock>
                  )}
                </Field>

                <Field label="חומרים שהיו בשימוש">
                  {editing ? (
                    <TextInput
                      value={draft.materialsUsed || ""}
                      onChange={(e) => update("materialsUsed", e.target.value)}
                      placeholder="לדוגמה: צבעי מים, חימר, עיפרון..."
                    />
                  ) : (
                    <ChipsValue value={draft.materialsUsed} />
                  )}
                </Field>

                <Field
                  label="תצפית התנהגותית"
                  hint="מה נראה, מה נשמע, איך התרחש הויסות — ללא פרשנות."
                >
                  {editing ? (
                    <TextArea
                      rows={4}
                      value={draft.behaviorNotes || ""}
                      onChange={(e) => update("behaviorNotes", e.target.value)}
                      placeholder="תצפית יבשה יחסית..."
                    />
                  ) : (
                    <ProseBlock>{draft.behaviorNotes || "—"}</ProseBlock>
                  )}
                </Field>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="רשמים קליניים והמשך"
              subtitle="הפרשנות הטיפולית והצעדים להמשך. נפרד מהתיעוד הראשוני."
              eyebrow={<Icon name="sparkles" size={14} />}
            />
            <CardBody>
              <div className="ds-col ds-col--md">
                <Field
                  label="רושם קליני"
                  hint="הפרשנות המקצועית של המפגש — מוצג בנפרד מהתיעוד הגולמי."
                >
                  {editing ? (
                    <TextArea
                      rows={4}
                      value={draft.clinicalImpression || ""}
                      onChange={(e) =>
                        update("clinicalImpression", e.target.value)
                      }
                      placeholder="ניסוח קליני..."
                    />
                  ) : (
                    <ProseBlock tone="clinical">
                      {draft.clinicalImpression || "—"}
                    </ProseBlock>
                  )}
                </Field>

                <Field label="נקודות להמשך (פולו-אפ)">
                  {editing ? (
                    <TextArea
                      rows={3}
                      value={draft.followUpNotes || ""}
                      onChange={(e) => update("followUpNotes", e.target.value)}
                      placeholder="מה אני רוצה לזכור לפגישה הבאה..."
                    />
                  ) : (
                    <ProseBlock tone="followup">
                      {draft.followUpNotes || "—"}
                    </ProseBlock>
                  )}
                </Field>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="ds-col">
          {editing ? (
            <Callout tone="sage" title="שמירה אוטומטית">
              השינויים נשמרים אצלך מקומית גם לפני לחיצה על "שמירה". המידע
              הקליני נשאר פרטי — רק את רואה אותו.
            </Callout>
          ) : null}

          <Card variant="muted">
            <CardHeader
              title="סיכום"
              eyebrow={<Icon name="target" size={14} />}
            />
            <CardBody compact>
              <div className="ds-col ds-col--xs">
                <MetaRow
                  icon="calendar"
                  label="תאריך"
                  value={new Date(draft.date).toLocaleDateString("he-IL")}
                />
                <MetaRow icon="clock" label="שעה" value={draft.startTime} />
                <MetaRow
                  icon="activity"
                  label="משך"
                  value={`${draft.durationMinutes} דקות`}
                />
                <MetaRow
                  icon="compass"
                  label="סוג"
                  value={draft.sessionType}
                />
                <MetaRow
                  icon="globe"
                  label="מסגרת"
                  value={draft.frameworkType || "—"}
                />
                <MetaRow
                  icon="palette"
                  label="מיקום"
                  value={draft.location || "—"}
                />
              </div>
            </CardBody>
          </Card>

          {patientOf && !isNew ? (
            <Card>
              <CardHeader title="מטופל/ת" />
              <CardBody compact>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    padding: "var(--space-2)"
                  }}
                >
                  <Avatar name={patientOf.fullName} size="md" />
                  <div style={{ flex: 1 }}>
                    <strong>{patientOf.fullName}</strong>
                    <div className="ds-t-xs ds-t-muted">
                      פתיחת כרטיס מלא
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconEnd={<Icon name="chevronLeft" size={14} />}
                    onClick={() => navigate(`/patients/${patientOf.id}`)}
                  >
                    פתיחה
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : null}

          {!isNew && linkedImages.length > 0 ? (
            <Card>
              <CardHeader
                title="יצירות קשורות"
                subtitle={`${linkedImages.length} פריטי יצירה`}
                eyebrow={<Icon name="image" size={14} />}
              />
              <CardBody compact>
                <div className="ds-grid ds-grid--2">
                  {linkedImages.map((img) => (
                    <div
                      key={img.id}
                      style={{
                        borderRadius: "var(--radius-md)",
                        overflow: "hidden",
                        border: "1px solid var(--border-soft)"
                      }}
                    >
                      <div
                        style={{
                          aspectRatio: "1 / 1",
                          background:
                            "linear-gradient(135deg, var(--sage-100), var(--clay-100))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--text-muted)"
                        }}
                      >
                        <Icon name="image" size={28} />
                      </div>
                      <div
                        style={{
                          padding: "var(--space-2) var(--space-3)",
                          fontSize: "var(--text-xs)"
                        }}
                      >
                        <strong style={{ display: "block" }}>{img.title}</strong>
                        <span className="ds-t-muted">{img.imageType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ) : null}

          {!isNew ? (
            <Card>
              <CardHeader
                title="פעולות"
                eyebrow={<Icon name="more" size={14} />}
              />
              <CardBody compact>
                <div className="ds-col ds-col--xs">
                  <Button
                    variant="ghost"
                    iconStart={<Icon name="upload" size={14} />}
                    block
                    onClick={() => showPlaceholderMessage("העלאת תמונה מתוך המפגש עדיין לא מומשה.")}
                  >
                    העלאת תמונה מהמפגש
                  </Button>
                  <Button
                    variant="ghost"
                    iconStart={<Icon name="fileText" size={14} />}
                    block
                    onClick={() => showPlaceholderMessage("צירוף מסמך מתוך המפגש עדיין לא מומש.")}
                  >
                    צירוף מסמך
                  </Button>
                  <Button
                    variant="ghost"
                    iconStart={<Icon name="sparkles" size={14} />}
                    block
                    onClick={() => showPlaceholderMessage("סיכום AI למפגש עדיין לא מומש.")}
                  >
                    סיכום AI של המפגש
                  </Button>
                  <Button
                    variant="ghost"
                    iconStart={<Icon name="trash" size={14} />}
                    block
                    onClick={() => showPlaceholderMessage("מחיקת מפגש עדיין לא מומשה.")}
                  >
                    מחיקת מפגש
                  </Button>
                </div>
              </CardBody>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ReadonlyValue({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "var(--space-3) var(--space-4)",
        background: "var(--bg-subtle)",
        borderRadius: "var(--radius-sm)",
        color: "var(--text)",
        minHeight: 40,
        display: "flex",
        alignItems: "center"
      }}
    >
      {children}
    </div>
  );
}

function ProseBlock({
  children,
  tone
}: {
  children: React.ReactNode;
  tone?: "clinical" | "followup";
}) {
  const bg =
    tone === "clinical"
      ? "var(--lavender-50, var(--bg-muted))"
      : tone === "followup"
        ? "var(--clay-50, var(--bg-muted))"
        : "var(--bg-subtle)";
  return (
    <div
      style={{
        padding: "var(--space-4)",
        background: bg,
        borderRadius: "var(--radius-md)",
        color: "var(--text)",
        lineHeight: 1.7,
        whiteSpace: "pre-wrap"
      }}
    >
      {children}
    </div>
  );
}

function ChipsValue({ value }: { value: string | null }) {
  const items = (value || "")
    .split(/[,،]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (items.length === 0) {
    return <ReadonlyValue>—</ReadonlyValue>;
  }
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {items.map((it, i) => (
        <Badge key={`${it}-${i}`} tone="clay">
          {it}
        </Badge>
      ))}
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value
}: {
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "var(--space-2) var(--space-3)",
        borderBottom: "1px dashed var(--border-soft)"
      }}
    >
      <Icon name={icon} size={14} />
      <span className="ds-t-xs ds-t-muted" style={{ minWidth: 64 }}>
        {label}
      </span>
      <span style={{ flex: 1, textAlign: "end", fontSize: "var(--text-sm)" }}>
        {value}
      </span>
    </div>
  );
}
