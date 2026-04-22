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
import { showPlaceholderMessage } from "../../lib/uiActions";

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
        subtitle="פרופיל, התראות, עדפות AI, פרטיות, צוות ותיעוד שינויים."
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
              <TextInput defaultValue="מטפלת באמנות, M.A." />
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
              <TextArea rows={3} defaultValue={"בטאל כהן, מטפלת באמנות\nרישום משרד הבריאות 4287"} />
            </Field>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => showPlaceholderMessage("ביטול שינויים מקומיים עדיין לא ממומש.")}>
              ביטול
            </Button>
            <Button
              iconStart={<Icon name="save" size={16} />}
              onClick={() => showPlaceholderMessage("שמירת פרופיל מלאה תתווסף בהמשך. כרגע זה מסך תצורה בלבד.")}
            >
              שמירה
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="תמונת פרופיל" />
        <CardBody compact>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingBlock: 12 }}>
            <Avatar name="בטאל כהן" size="xl" />
            <Button
              variant="secondary"
              iconStart={<Icon name="upload" size={14} />}
              onClick={() =>
                showPlaceholderMessage("החלפת תמונת פרופיל עדיין לא נתמכת. אין כרגע העלאה אמיתית לתמונת משתמש.")
              }
            >
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
  const items = [
    "תזכורת למפגש קרוב",
    "משימה דחופה",
    "הודעה מהורה",
    "תובנה חדשה מ-BATEL AI"
  ];
  return (
    <Card>
      <CardHeader title="התראות" subtitle="מתי ואיך המערכת תעדכן אותך על פעילות." />
      <CardBody>
        <div className="ds-col ds-col--sm">
          {items.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "var(--space-3) var(--space-4)",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--radius-md)"
              }}
            >
              <div style={{ flex: 1 }}>
                <strong>{item}</strong>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => showPlaceholderMessage("ניהול granular של התראות עדיין לא מחובר לשרת הגדרות אמיתי.")}
              >
                הגדרה
              </Button>
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
        אפשר לשלוט מה המודל רואה, מה הוא מציע, ומתי הוא יוצר תובנות. כל שינוי כאן ייכנס כהגדרה אמיתית רק אחרי חיבור backend.
      </Callout>
      <Card>
        <CardHeader title="רגישות תובנות" subtitle="מתי להציג תובנות ובאיזו ודאות." />
        <CardBody>
          <div className="ds-form-grid ds-form-grid--2">
            <Field label="סף ודאות מינימלי">
              <SelectInput defaultValue="medium">
                <option value="low">נמוך</option>
                <option value="medium">בינוני</option>
                <option value="high">גבוה</option>
              </SelectInput>
            </Field>
            <Field label="מספר מפגשים לפני תובנה">
              <TextInput type="number" defaultValue={3} min={1} max={10} />
            </Field>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <Button onClick={() => showPlaceholderMessage("שמירת הגדרות AI עדיין לא זמינה בצד השרת.")}>שמירת הגדרות AI</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function TeamSection() {
  const team = [
    { name: "בטאל כהן", role: "מטפלת ראשית (מנהלת)", status: "active" },
    { name: "שיר ועד", role: "מטפלת באמנות", status: "active" },
    { name: "ד״ר איריס לב", role: "מפקחת מקצועית", status: "invited" }
  ];

  return (
    <Card>
      <CardHeader
        title="חברי צוות"
        subtitle="ניהול הרשאות והזמנת מטפלות נוספות למרחב."
        actions={
          <Button iconStart={<Icon name="plus" size={16} />} onClick={() => showPlaceholderMessage("הזמנת משתמשים נוספים עדיין לא מחוברת ל-flow הרשאות אמיתי.")}>
            הזמנת מטפלת
          </Button>
        }
      />
      <CardBody compact>
        <div className="ds-col ds-col--sm">
          {team.map((member) => (
            <div key={member.name} className="ds-list-row" style={{ padding: "var(--space-4)", border: "1px solid var(--border-soft)" }}>
              <Avatar name={member.name} size="md" />
              <div style={{ flex: 1 }}>
                <strong>{member.name}</strong>
                <div className="ds-t-xs ds-t-muted">{member.role}</div>
              </div>
              <Badge tone={member.status === "active" ? "success" : "warning"}>
                {member.status === "active" ? "פעיל" : "ממתין"}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => showPlaceholderMessage("עריכת חבר צוות עדיין לא זמינה.")}>
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
        המידע נשמר מוצפן בצד שרת. גישה לדוחות חיצוניים דורשת אישור דו-שלבי. לעולם לא נשתמש במידע טיפולי ללא אישור מפורש.
      </Callout>
      <div className="ds-grid ds-grid--2">
        <Card>
          <CardHeader title="אחסון" subtitle="נפח שימוש נוכחי." />
          <CardBody>
            <Progress value={62} />
            <div className="ds-t-xs ds-t-muted" style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}>
              <span>12.4 GB מתוך 20 GB</span>
              <span>62%</span>
            </div>
            <Button
              variant="secondary"
              style={{ marginTop: 12 }}
              iconStart={<Icon name="upload" size={14} />}
              block
              onClick={() => showPlaceholderMessage("שדרוג חבילה עדיין לא זמין בגרסה המקומית הזו.")}
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
              onClick={() => showPlaceholderMessage("הורדת גיבוי עדיין לא נתמכת מתוך המסך הזה.")}
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
          {items.map((item) => (
            <div
              key={item.name}
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
                <Icon name={item.icon} size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <strong>{item.name}</strong>
                <div className="ds-t-xs">
                  <Badge tone={item.tone}>{item.status}</Badge>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  showPlaceholderMessage(item.status === "מחובר" ? "ניהול חיבור זה עדיין לא זמין." : "חיבור האינטגרציה הזו עדיין לא מומש.")
                }
              >
                {item.status === "מחובר" ? "ניהול" : "חיבור"}
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
    { when: "2026-04-18 18:05", actor: "BATEL AI", action: "תובנה חדשה — 'שפה רגשית חדשה' אצל יונתן" }
  ];

  return (
    <Card>
      <CardHeader
        title="יומן שינויים (Audit log)"
        subtitle="תיעוד מלא של פעולות אחרונות — לצורכי שקיפות ובטיחות."
        actions={
          <Button
            variant="secondary"
            iconStart={<Icon name="download" size={14} />}
            onClick={() => showPlaceholderMessage("ייצוא Audit log מלא עדיין לא זמין מתוך המסך הזה.")}
          >
            ייצוא
          </Button>
        }
      />
      <CardBody compact>
        <div className="ds-timeline" style={{ marginInlineStart: 8 }}>
          {items.map((item) => (
            <div key={`${item.when}-${item.actor}`} className="ds-timeline__item">
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
                <strong style={{ fontSize: "var(--text-sm)" }}>{item.actor}</strong>
                <span className="ds-t-xs ds-t-muted">{item.when}</span>
              </div>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text)", margin: 0 }}>{item.action}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
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
