import { useState } from "react";
import { PageHeader } from "../../design-system/PageHeader";
import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { Tabs } from "../../design-system/Tabs";
import { Badge } from "../../design-system/Badge";
import { Icon } from "../../design-system/Icon";
import { Field, TextInput, TextArea, SelectInput } from "../../design-system/Field";
import { Callout } from "../../design-system/Callout";

type Section = "landing" | "about" | "forms" | "inquiries" | "design";

export function PublicPagesPage() {
  const [section, setSection] = useState<Section>("landing");

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="הגדרות"
        title="עמודים ציבוריים"
        subtitle="הדף שהורים ומטופלים פוטנציאליים רואים — יצירת קשר, טפסים, מידע על הטיפול."
        actions={
          <>
            <Button variant="secondary" iconStart={<Icon name="eye" size={16} />}>
              תצוגה מקדימה
            </Button>
            <Button iconStart={<Icon name="globe" size={16} />}>
              פרסום
            </Button>
          </>
        }
      />

      <Callout tone="sage" title="כתובת הדף שלך">
        <a
          href="#"
          style={{
            color: "var(--sage-700)",
            fontWeight: 600,
            textDecoration: "underline"
          }}
        >
          batel.art-therapy.co.il
        </a>{" "}
        — ניתן להחליף דומיין בהגדרות המערכת.
      </Callout>

      <Card>
        <CardBody compact>
          <Tabs<Section>
            value={section}
            onChange={setSection}
            items={[
              { value: "landing", label: "דף נחיתה", icon: <Icon name="home" size={14} /> },
              { value: "about", label: "אודות", icon: <Icon name="heart" size={14} /> },
              { value: "forms", label: "טפסים", icon: <Icon name="clipboard" size={14} /> },
              { value: "inquiries", label: "פניות נכנסות", icon: <Icon name="mail" size={14} />, count: 4 },
              { value: "design", label: "עיצוב", icon: <Icon name="palette" size={14} /> }
            ]}
          />
        </CardBody>
      </Card>

      {section === "landing" ? <LandingSection /> : null}
      {section === "about" ? <AboutSection /> : null}
      {section === "forms" ? <FormsSection /> : null}
      {section === "inquiries" ? <InquiriesSection /> : null}
      {section === "design" ? <DesignSection /> : null}
    </div>
  );
}

function LandingSection() {
  return (
    <div className="ds-grid ds-grid--2-1">
      <Card>
        <CardHeader title="כותרת ראשית" subtitle="מה ירגישו בכניסה לאתר שלך." />
        <CardBody>
          <div className="ds-col ds-col--md">
            <Field label="כותרת">
              <TextInput defaultValue="מרחב שקט ליצירה — לילדים, להורים, לצוות." />
            </Field>
            <Field label="תת־כותרת">
              <TextArea
                rows={3}
                defaultValue="טיפול באמנות לילדים ונוער — עבודה עם רגשות, מעברים, והתמודדות דרך יצירה."
              />
            </Field>
            <Field label="כפתור פעולה ראשי (CTA)">
              <TextInput defaultValue="לבדוק התאמה" />
            </Field>
            <Field label="כפתור משני">
              <TextInput defaultValue="לצפות בתהליך" />
            </Field>
          </div>
        </CardBody>
      </Card>

      <Card variant="muted">
        <CardHeader title="תצוגה מקדימה" />
        <CardBody>
          <div
            style={{
              background:
                "linear-gradient(150deg, var(--sage-50), var(--clay-50))",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-8)",
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              gap: 10
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "var(--text-2xl)",
                lineHeight: 1.3,
                margin: 0,
                color: "var(--text-strong)"
              }}
            >
              מרחב שקט ליצירה
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "var(--text-sm)",
                lineHeight: 1.6,
                margin: 0
              }}
            >
              לילדים, להורים, לצוות.
            </p>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: "auto"
              }}
            >
              <Button size="sm">לבדוק התאמה</Button>
              <Button size="sm" variant="ghost">
                לצפות בתהליך
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function AboutSection() {
  return (
    <Card>
      <CardHeader title="אודות" subtitle="מי את, ומה את מציעה." />
      <CardBody>
        <div className="ds-col ds-col--md">
          <Field label="תיאור אישי">
            <TextArea
              rows={6}
              defaultValue="אני בטאל, מטפלת באומנות במשך 11 שנה. עובדת בעיקר עם ילדים ונוער, עם התמחות בתהליכי התפתחות, מעברים, וחוויות אובדן."
            />
          </Field>
          <Field label="התמחויות (מופרד בפסיקים)">
            <TextInput defaultValue="ילדים, נוער, מעברים, טראומה קלה, עבודה עם הורים" />
          </Field>
          <Field label="אישורים מקצועיים">
            <TextArea
              rows={3}
              defaultValue="- M.A. תרפיה באמנות, אוניברסיטת חיפה, 2014&#10;- פיקוח: פרופ' יעל כהן&#10;- חברה באיגוד הישראלי לתרפיה באמנות"
            />
          </Field>
        </div>
      </CardBody>
    </Card>
  );
}

function FormsSection() {
  const forms = [
    { title: "טופס פנייה ראשונית", submissions: 14, active: true },
    { title: "טופס הסכמה מדעת", submissions: 8, active: true },
    { title: "שאלון הורים לאינטייק", submissions: 5, active: true },
    { title: "משוב לאחר תהליך", submissions: 2, active: false }
  ];
  return (
    <Card>
      <CardHeader
        title="טפסים ציבוריים"
        subtitle="טפסים שהורים וגורמים חיצוניים יכולים למלא."
        actions={<Button iconStart={<Icon name="plus" size={16} />}>טופס חדש</Button>}
      />
      <CardBody compact>
        <div className="ds-col ds-col--sm">
          {forms.map((f, i) => (
            <div
              key={i}
              className="ds-list-row"
              style={{ border: "1px solid var(--border-soft)" }}
            >
              <Icon name="clipboard" size={22} />
              <div style={{ flex: 1 }}>
                <strong>{f.title}</strong>
                <div className="ds-t-xs ds-t-muted">
                  {f.submissions} פניות מאז ההפעלה
                </div>
              </div>
              <Badge tone={f.active ? "success" : "muted"}>
                {f.active ? "פעיל" : "כבוי"}
              </Badge>
              <Button variant="ghost" size="sm">
                ניהול
              </Button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function InquiriesSection() {
  const items = [
    { name: "אם של ילד בן 8", message: "שלום, רציתי לשאול לגבי התאמה...", when: "היום, 09:12", unread: true },
    { name: "רומי גרין", message: "מחפשת המלצה למטפלת נוספת...", when: "אתמול", unread: true },
    { name: "יועצת בית ספר", message: "אשמח לתאם שיחת הכרות לצוות...", when: "לפני יומיים", unread: false },
    { name: "הוריה של תמר", message: "האם יש מקום לשתי פגישות בשבוע?", when: "לפני 3 ימים", unread: false }
  ];
  return (
    <Card>
      <CardHeader
        title="פניות נכנסות"
        subtitle="הודעות שהגיעו מהדף הציבורי."
      />
      <CardBody compact>
        <div className="ds-col ds-col--sm">
          {items.map((it, i) => (
            <div
              key={i}
              className="ds-list-row"
              style={{
                border: "1px solid var(--border-soft)",
                borderInlineStart: it.unread
                  ? "3px solid var(--clay-500)"
                  : "1px solid var(--border-soft)"
              }}
            >
              <Icon name="mail" size={20} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <strong>{it.name}</strong>
                  {it.unread ? <Badge tone="clay">חדש</Badge> : null}
                </div>
                <p
                  className="ds-t-sm ds-t-muted"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {it.message}
                </p>
              </div>
              <span className="ds-t-xs ds-t-muted">{it.when}</span>
              <Button variant="ghost" size="sm">
                פתיחה
              </Button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function DesignSection() {
  return (
    <div className="ds-grid ds-grid--2">
      <Card>
        <CardHeader title="פלטת צבעים" />
        <CardBody>
          <div className="ds-col ds-col--md">
            <Field label="צבע ראשי">
              <SelectInput defaultValue="sage">
                <option value="sage">ירוק־מרווה (ברירת מחדל)</option>
                <option value="clay">חרסיתי</option>
                <option value="lavender">לבנדר</option>
              </SelectInput>
            </Field>
            <div
              style={{
                display: "flex",
                gap: 8
              }}
            >
              {["sage", "clay", "lavender", "info"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-sm)",
                    background: `var(--${c}-500)`,
                    boxShadow: "var(--shadow-xs)"
                  }}
                />
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="טיפוגרפיה" />
        <CardBody>
          <div className="ds-col ds-col--md">
            <Field label="פונט כותרות">
              <SelectInput defaultValue="frank">
                <option value="frank">Frank Ruhl Libre (מסורתי)</option>
                <option value="assistant">Assistant</option>
                <option value="heebo">Heebo</option>
              </SelectInput>
            </Field>
            <Field label="פונט גוף">
              <SelectInput defaultValue="assistant">
                <option value="assistant">Assistant</option>
                <option value="heebo">Heebo</option>
                <option value="rubik">Rubik</option>
              </SelectInput>
            </Field>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
