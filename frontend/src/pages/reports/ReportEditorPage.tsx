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
import { mockReports, mockPatients } from "../../mocks";
import type { TherapyReport } from "../../mocks";

const TYPES = [
  { value: "quarterly", label: "דוח רבעוני" },
  { value: "annual", label: "דוח שנתי" },
  { value: "intake_summary", label: "סיכום אינטייק" },
  { value: "progress", label: "דוח התקדמות" },
  { value: "external_referral", label: "הפניה חיצונית" }
];

interface Section {
  id: string;
  title: string;
  hint: string;
  body: string;
}

const DEFAULT_SECTIONS: Section[] = [
  {
    id: "sec-1",
    title: "רקע ומטרות הטיפול",
    hint: "סיבת ההפניה, תיאור קצר של התהליך עד כה.",
    body: ""
  },
  {
    id: "sec-2",
    title: "מהלך התהליך",
    hint: "מגמות עיקריות, נושאים מרכזיים ביצירה, חומרים משמעותיים.",
    body: ""
  },
  {
    id: "sec-3",
    title: "הישגים ואתגרים",
    hint: "מה הופנם, מה עדיין רגיש, המלצות מותאמות.",
    body: ""
  },
  {
    id: "sec-4",
    title: "המלצות להמשך",
    hint: "תדירות מפגשים, שילוב מסגרות, נקודות להמשך תיאום.",
    body: ""
  }
];

export function ReportEditorPage() {
  const params = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNew = !params.id || params.id === "new";

  const existing = useMemo(() => {
    if (isNew) return null;
    return mockReports.find((r) => r.id === params.id) || null;
  }, [isNew, params.id]);

  const [title, setTitle] = useState(existing?.title || "");
  const [type, setType] = useState(existing?.type || "quarterly");
  const [patientId, setPatientId] = useState(
    existing?.patientId || searchParams.get("patientId") || ""
  );
  const [recipient, setRecipient] = useState(existing?.recipient || "");
  const [summary, setSummary] = useState(existing?.summary || "");
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [status, setStatus] = useState<TherapyReport["status"]>(
    existing?.status || "draft"
  );

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setType(existing.type);
      setPatientId(existing.patientId);
      setRecipient(existing.recipient || "");
      setSummary(existing.summary);
      setStatus(existing.status);
    }
  }, [existing]);

  const patient = useMemo(
    () => mockPatients.find((p) => p.id === patientId),
    [patientId]
  );

  const updateSection = (id: string, key: keyof Section, value: string) =>
    setSections((ss) => ss.map((s) => (s.id === id ? { ...s, [key]: value } : s)));

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow={
          <span
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/reports")}
          >
            <Icon name="chevronRight" size={12} /> דוחות
          </span>
        }
        title={isNew ? "דוח חדש" : title || "דוח"}
        subtitle={
          patient
            ? `עבור ${patient.fullName}`
            : "מלאי את פרטי הדוח והסעיפים המרכזיים."
        }
        actions={
          <>
            <Button variant="ghost" onClick={() => navigate("/reports")}>
              ביטול
            </Button>
            <Button
              variant="secondary"
              iconStart={<Icon name="eye" size={16} />}
            >
              תצוגה מקדימה
            </Button>
            <Button iconStart={<Icon name="save" size={16} />}>
              שמירת טיוטה
            </Button>
          </>
        }
      />

      <Callout tone="lavender" title="על דוחות">
        דוחות נכתבים כטיוטה ועוברים למצב "ממתין לאישור" לפני שיוצאים אל הנמען.
        ניתן לבחור טיוטה ראשונית שנוצרת באמצעות BATEL AI — ולערוך אותה חופשי.
      </Callout>

      <div className="ds-grid ds-grid--2-1">
        <div className="ds-col">
          <Card>
            <CardHeader
              title="פרטי דוח"
              eyebrow={<Icon name="fileText" size={14} />}
            />
            <CardBody>
              <div className="ds-form-grid ds-form-grid--2">
                <Field label="שם הדוח" required>
                  <TextInput
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="לדוגמה: דוח רבעון ב׳ 2026"
                  />
                </Field>
                <Field label="סוג דוח">
                  <SelectInput
                    value={type}
                    onChange={(e) => setType(e.target.value as typeof type)}
                  >
                    {TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="מטופל/ת" required>
                  <SelectInput
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  >
                    <option value="">— בחרי מטופל/ת —</option>
                    {mockPatients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="נמען" hint="להורה, למסגרת, ליועצת...">
                  <TextInput
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="לדוגמה: הורים"
                  />
                </Field>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="תקציר מנהלים"
              subtitle="פסקה קצרה שמכילה את עיקרי הדברים. יוצגו בראש הדוח."
            />
            <CardBody>
              <TextArea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="תקציר קצר ומקצועי..."
              />
            </CardBody>
          </Card>

          {sections.map((sec, idx) => (
            <Card key={sec.id}>
              <CardHeader
                title={
                  <span
                    style={{
                      display: "inline-flex",
                      gap: 8,
                      alignItems: "center"
                    }}
                  >
                    <Badge tone="muted">{idx + 1}</Badge>
                    <Field
                      label=""
                      className="ds-field--inline"
                    >
                      <TextInput
                        value={sec.title}
                        onChange={(e) => updateSection(sec.id, "title", e.target.value)}
                        style={{
                          background: "transparent",
                          border: "none",
                          fontSize: "var(--text-lg)",
                          fontWeight: 600,
                          padding: 0
                        }}
                      />
                    </Field>
                  </span>
                }
                subtitle={sec.hint}
                actions={
                  <Button
                    variant="ghost"
                    size="sm"
                    iconStart={<Icon name="sparkles" size={14} />}
                  >
                    הצעת AI
                  </Button>
                }
              />
              <CardBody>
                <TextArea
                  rows={6}
                  value={sec.body}
                  onChange={(e) => updateSection(sec.id, "body", e.target.value)}
                  placeholder="כתיבה חופשית..."
                />
              </CardBody>
            </Card>
          ))}

          <Button
            variant="secondary"
            iconStart={<Icon name="plus" size={16} />}
            onClick={() =>
              setSections((ss) => [
                ...ss,
                {
                  id: `sec-${Date.now()}`,
                  title: "סעיף נוסף",
                  hint: "",
                  body: ""
                }
              ])
            }
          >
            הוספת סעיף
          </Button>
        </div>

        <div className="ds-col">
          <Card variant="muted">
            <CardHeader title="סטטוס" />
            <CardBody compact>
              <Field label="סטטוס נוכחי">
                <SelectInput
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as TherapyReport["status"])
                  }
                >
                  <option value="draft">טיוטה</option>
                  <option value="pending_review">ממתין לאישור</option>
                  <option value="approved">מאושר</option>
                  <option value="sent">נשלח</option>
                </SelectInput>
              </Field>
            </CardBody>
          </Card>

          {patient ? (
            <Card>
              <CardHeader title="מטופל/ת" />
              <CardBody compact>
                <div
                  style={{ display: "flex", gap: 10, alignItems: "center" }}
                >
                  <Avatar name={patient.fullName} size="md" />
                  <div style={{ flex: 1 }}>
                    <strong>{patient.fullName}</strong>
                    <div className="ds-t-xs ds-t-muted">
                      גיל {patient.age} · {patient.educationalFramework || "—"}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : null}

          <Card>
            <CardHeader title="פעולות" />
            <CardBody compact>
              <div className="ds-col ds-col--xs">
                <Button
                  variant="ghost"
                  block
                  iconStart={<Icon name="sparkles" size={14} />}
                >
                  יצירת טיוטה אוטומטית
                </Button>
                <Button
                  variant="ghost"
                  block
                  iconStart={<Icon name="download" size={14} />}
                >
                  ייצוא ל-PDF
                </Button>
                <Button
                  variant="ghost"
                  block
                  iconStart={<Icon name="send" size={14} />}
                >
                  שליחה לנמען
                </Button>
                <Button
                  variant="ghost"
                  block
                  iconStart={<Icon name="printer" size={14} />}
                >
                  הדפסה
                </Button>
              </div>
            </CardBody>
          </Card>

          <Callout tone="warning" title="אישור לפני שליחה">
            דוחות שנשלחים לגורמים חיצוניים דורשים אישור של המטפלת הראשית. ניתן
            להגדיר זרימת אישורים בהגדרות המערכת.
          </Callout>
        </div>
      </div>
    </div>
  );
}
