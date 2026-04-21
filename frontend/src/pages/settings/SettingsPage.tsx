import { useState } from "react";
import { PageHeader } from "../../design-system/PageHeader";
import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { Tabs } from "../../design-system/Tabs";
import { Badge } from "../../design-system/Badge";
import { Avatar } from "../../design-system/Avatar";
import { Icon } from "../../design-system/Icon";
import { Field, TextInput, TextArea, SelectInput } from "../../design-system/Field";
import { Callout } from "../../design-system/Callout";
import { Progress } from "../../design-system/Progress";

type Section =
  | "profile"
  | "notifications"
  | "ai"
  | "team"
  | "privacy"
  | "integrations"
  | "audit";

export function SettingsPage() {
  const [section, setSection] = useState<Section>("profile");

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="הגדרות"
        title="הגדרות המרחב"
        subtitle="פרופיל, התראות, העדפות AI, פרטיות, צוות ותיעוד שינויים."
      />

      <Card>
        <CardBody compact>
          <Tabs<Section>
            value={section}
            onChange={setSection}
            items={[
              { value: "profile", label: "פרופיל", icon: <Icon name="user" size={14} /> },
              { value: "notifications", label: "התראות", icon: <Icon name="bell" size={14} /> },
              { value: "ai", label: "BATEL AI", icon: <Icon name="sparkles" size={14} /> },
              { value: "team", label: "צוות", icon: <Icon name="users" size={14} /> },
              { value: "privacy", label: "פרטיות", icon: <Icon name="shield" size={14} /> },
              { value: "integrations", label: "חיבורים", icon: <Icon name="link" size={14} /> },
              { value: "audit", label: "יומן שינויים", icon: <Icon name="clipboard" size={14} /> }
            ]}
          />
        </CardBody>
      </Card>

      {section === "profile" ? <ProfileSection /> : null}
      {section === "notifications" ? <NotificationsSection /> : null}
      {section === "ai" ? <AISection /> : null}
      {section === "team" ? <TeamSection /> : null}
      {section === "privacy" ? <PrivacySection /> : null}
      {section === "integrations" ? <IntegrationsSection /> : null}
      {section === "audit" ? <AuditSection /> : null}
    </div>
  );
}

function ProfileSection() {
  return (
    <div className="ds-grid ds-grid--2-1">
      <Card>
        <CardHeader title="פרטים אישיים" subtitle="השם והפרטים שיופיעו בדוחות." />
        <CardBody>
          <div className="ds-form-grid ds-form-grid--2">
            <Field label="שם מלא">
              <TextInput defaultValue="בטאל כהן" />
            </Field>
            <Field label="תואר מקצועי">
              <TextInput defaultValue="מטפלת באומנות, M.A." />
            </Field>
            <Field label="מספר רישום">
              <TextInput defaultValue="IL-2021-4287" />
            </Field>
            <Field label="דוא״ל">
              <TextInput type="email" defaultValue="batel@example.com" />
            </Field>
            <Field label="טלפון">
              <TextInput defaultValue="050-0000000" />
            </Field>
            <Field label="שפת ממשק">
              <SelectInput defaultValue="he">
                <option value="he">עברית</option>
                <option value="en">English</option>
              </SelectInput>
            </Field>
          </div>
          <div style={{ marginTop: 16 }}>
            <Field label="חתימת דוחות">
              <TextArea
                rows={3}
                defaultValue="בטאל כהן, מטפלת באומנות&#10;רישום משרד הבריאות 4287"
              />
            </Field>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 16,
              justifyContent: "flex-end"
            }}
          >
            <Button variant="ghost">ביטול</Button>
            <Button iconStart={<Icon name="save" size={16} />}>שמירה</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="תמונת פרופיל" />
        <CardBody compact>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              paddingBlock: 12
            }}
          >
            <Avatar name="בטאל כהן" size="xl" />
            <Button variant="secondary" iconStart={<Icon name="upload" size={14} />}>
              החלפת תמונה
            </Button>
            <span className="ds-t-xs ds-t-muted">PNG או JPG עד 2MB</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function NotificationsSection() {
  return (
    <Card>
      <CardHeader
        title="התראות"
        subtitle="מתי ואיך המערכת תעדכן אותך על פעילות."
      />
      <CardBody>
        <div className="ds-col ds-col--sm">
          {[
            {
              title: "תזכורת למפגש קרוב",
              desc: "התראה 30 דקות לפני מפגש מתוכנן",
              on: true
            },
            {
              title: "משימה דחופה",
              desc: "כאשר מופיעה משימה בעדיפות גבוהה",
              on: true
            },
            {
              title: "הודעה מהורה",
              desc: "כאשר הורה מבקש שיחה דרך מרחב הציבורי",
              on: true
            },
            {
              title: "תובנה חדשה מ-BATEL AI",
              desc: "עדכון שבועי תקציר + תובנות דורשות סקירה",
              on: true
            },
            {
              title: "דוח מוכן לסקירה",
              desc: "כאשר טיוטה אוטומטית מוכנה",
              on: false
            },
            {
              title: "עדכון ממערכת חיצונית",
              desc: "סנכרון יומן / מייל / פלטפורמה חיצונית",
              on: false
            }
          ].map((n, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "var(--space-3) var(--space-4)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--radius-md)"
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "var(--radius-md)",
                  background: n.on ? "var(--sage-100)" : "var(--bg-subtle)",
                  color: n.on ? "var(--sage-700)" : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Icon name="bell" size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <strong>{n.title}</strong>
                <p className="ds-t-sm ds-t-muted" style={{ marginTop: 2 }}>
                  {n.desc}
                </p>
              </div>
              <Toggle on={n.on} />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function AISection() {
  return (
    <div className="ds-col">
      <Callout tone="lavender" title="הגדרות BATEL AI">
        אפשר לשלוט מה המודל רואה, מה הוא מציע, ומתי הוא יוצר תובנות. כל שינוי
        כאן תקף למטפלת זו בלבד, ונשמר ביומן הגדרות.
      </Callout>

      <Card>
        <CardHeader title="רגישות תובנות" subtitle="מתי להציג תובנות ובאיזו ודאות." />
        <CardBody>
          <div className="ds-col ds-col--md">
            <Field label="סף ודאות מינימלי להצגת תובנה">
              <SelectInput defaultValue="medium">
                <option value="low">נמוך — להציג כל תובנה</option>
                <option value="medium">בינוני — ברירת מחדל</option>
                <option value="high">גבוה בלבד</option>
              </SelectInput>
            </Field>
            <Field label="מספר מפגשים מינימלי לפני יצירת תובנה">
              <TextInput type="number" defaultValue={3} min={1} max={10} />
            </Field>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="סוגי תובנות פעילים" />
        <CardBody>
          <div className="ds-grid ds-grid--2">
            {[
              { label: "דפוסים חוזרים", desc: "זיהוי מגמות בחומרים, צבעים, נושאים." },
              { label: "המלצות", desc: "הצעות להמשך — חומרים, מסגור, מטרות." },
              { label: "אזהרות", desc: "סימנים של מצוקה, סיכון, או צורך בהתייעצות." },
              { label: "תקצירים שבועיים", desc: "סיכום שבועי של הפעילות שלך." }
            ].map((k, i) => (
              <div
                key={i}
                style={{
                  padding: "var(--space-4)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong>{k.label}</strong>
                  <p className="ds-t-sm ds-t-muted" style={{ marginTop: 2 }}>
                    {k.desc}
                  </p>
                </div>
                <Toggle on={true} />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function TeamSection() {
  const team = [
    { name: "בטאל כהן", role: "מטפלת ראשית (מנהלת)", status: "active" },
    { name: "שיר ועד", role: "מטפלת באומנות", status: "active" },
    { name: "ד״ר איריס לב", role: "מפקחת מקצועית", status: "invited" }
  ];
  return (
    <Card>
      <CardHeader
        title="חברי צוות"
        subtitle="ניהול הרשאות והזמנת מטפלות נוספות למרחב."
        actions={
          <Button iconStart={<Icon name="plus" size={16} />}>הזמנת מטפלת</Button>
        }
      />
      <CardBody compact>
        <div className="ds-col ds-col--sm">
          {team.map((t, i) => (
            <div
              key={i}
              className="ds-list-row"
              style={{
                padding: "var(--space-4)",
                border: "1px solid var(--border-soft)"
              }}
            >
              <Avatar name={t.name} size="md" />
              <div style={{ flex: 1 }}>
                <strong>{t.name}</strong>
                <div className="ds-t-xs ds-t-muted">{t.role}</div>
              </div>
              <Badge tone={t.status === "active" ? "success" : "warning"}>
                {t.status === "active" ? "פעיל" : "ממתין"}
              </Badge>
              <Button variant="ghost" size="sm">
                עריכה
              </Button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function PrivacySection() {
  return (
    <div className="ds-col">
      <Callout tone="sage" title="הגנה על מידע רגיש">
        המידע נשמר מוצפן בצד שרת. גישה לדוחות חיצוניים דורשת אישור דו-שלבי.
        לעולם לא נשתמש במידע טיפולי שלא אושר להכשרת מודלים.
      </Callout>
      <div className="ds-grid ds-grid--2">
        <Card>
          <CardHeader title="אחסון" subtitle="נפח שימוש נוכחי." />
          <CardBody>
            <Progress value={62} />
            <div
              className="ds-t-xs ds-t-muted"
              style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}
            >
              <span>12.4 GB מתוך 20 GB</span>
              <span>62%</span>
            </div>
            <Button
              variant="secondary"
              style={{ marginTop: 12 }}
              iconStart={<Icon name="upload" size={14} />}
              block
            >
              שדרוג חבילה
            </Button>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="גיבוי" subtitle="גיבויים אוטומטיים כל 24 שעות." />
          <CardBody>
            <div className="ds-col ds-col--xs">
              <Row label="גיבוי אחרון" value="היום, 03:00" />
              <Row label="מיקום" value="מוצפן, EU-Central" />
              <Row label="שחזור מהיר" value="זמין 7 ימים אחורה" />
            </div>
            <Button
              variant="secondary"
              style={{ marginTop: 12 }}
              iconStart={<Icon name="download" size={14} />}
              block
            >
              הורדת גיבוי
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function IntegrationsSection() {
  const items = [
    { name: "יומן Google", status: "מחובר", tone: "success" as const, icon: "calendar" as const },
    { name: "Dropbox למסמכים", status: "מחובר", tone: "success" as const, icon: "folder" as const },
    { name: "WhatsApp Business", status: "לא מחובר", tone: "muted" as const, icon: "messageCircle" as const },
    { name: "Zoom", status: "לא מחובר", tone: "muted" as const, icon: "play" as const }
  ];
  return (
    <Card>
      <CardHeader title="חיבורים חיצוניים" />
      <CardBody>
        <div className="ds-grid ds-grid--2">
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "var(--space-4)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--radius-md)"
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Icon name={it.icon} size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <strong>{it.name}</strong>
                <div className="ds-t-xs">
                  <Badge tone={it.tone}>{it.status}</Badge>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                {it.status === "מחובר" ? "ניהול" : "חיבור"}
              </Button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function AuditSection() {
  const items = [
    { when: "2026-04-19 14:22", actor: "בטאל כהן", action: "עדכון דוח — דוח רבעון ב׳ / נועה אברמוב" },
    { when: "2026-04-19 10:50", actor: "בטאל כהן", action: "יצירת משימה — תיאום עם גן 'שלום'" },
    { when: "2026-04-18 18:05", actor: "BATEL AI", action: "תובנה חדשה — 'שפה רגשית חדשה' אצל יונתן" },
    { when: "2026-04-18 09:15", actor: "בטאל כהן", action: "התחברות מדפדפן Chrome" },
    { when: "2026-04-17 21:00", actor: "מערכת", action: "גיבוי אוטומטי הושלם" }
  ];
  return (
    <Card>
      <CardHeader
        title="יומן שינויים (Audit log)"
        subtitle="תיעוד מלא של פעולות אחרונות — לצורכי שקיפות ובטיחות."
        actions={
          <Button variant="secondary" iconStart={<Icon name="download" size={14} />}>
            ייצוא
          </Button>
        }
      />
      <CardBody compact>
        <div className="ds-timeline" style={{ marginInlineStart: 8 }}>
          {items.map((it, i) => (
            <div key={i} className="ds-timeline__item">
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 2
                }}
              >
                <strong style={{ fontSize: "var(--text-sm)" }}>{it.actor}</strong>
                <span className="ds-t-xs ds-t-muted">{it.when}</span>
              </div>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text)",
                  margin: 0
                }}
              >
                {it.action}
              </p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div
      role="switch"
      aria-checked={on}
      style={{
        width: 44,
        height: 26,
        borderRadius: 999,
        background: on ? "var(--sage-500)" : "var(--bg-subtle)",
        padding: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
        transition: "all 160ms ease",
        cursor: "pointer"
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          background: "#fff",
          boxShadow: "var(--shadow-xs)"
        }}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "var(--text-sm)",
        paddingBlock: 6,
        borderBottom: "1px dashed var(--border-soft)"
      }}
    >
      <span className="ds-t-muted">{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
