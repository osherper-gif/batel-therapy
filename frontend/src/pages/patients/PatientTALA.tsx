import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { Icon } from "../../design-system/Icon";
import { Callout } from "../../design-system/Callout";
import { Badge } from "../../design-system/Badge";
import { usePatientContext } from "../../layouts/PatientWorkspace";
import { getTALA } from "../../services/patientsService";

/**
 * TALA = תפיסה אמנותית, למידה, אבחון.
 * ייחודי ל-BATEL: תיעוד פריזמה אמנותית-רגשית של המטופל/ת.
 */
export function PatientTALA() {
  const { patient } = usePatientContext();
  const tala = getTALA(patient.id);

  return (
    <div className="ds-col">
      <Callout tone="lavender" title="TALA — תפיסה אמנותית, למידה, אבחון">
        התבוננות ייחודית למטפלת, שממפה איך המטופל/ת פוגש/ת את החומר האמנותי ומה המרחב הזה חושף.
        זהו מסמך חי ומתעדכן.
      </Callout>

      <div
        className="ds-grid"
        style={{ gridTemplateColumns: "1.4fr 1fr", gap: "var(--space-5)" }}
      >
        <Card>
          <CardHeader
            title="סיכום נוכחי"
            subtitle={`עודכן לאחרונה: ${new Date(tala.updatedAt).toLocaleDateString("he-IL")}`}
            actions={
              <Button size="sm" iconStart={<Icon name="edit" size={14} />}>
                עדכון
              </Button>
            }
          />
          <CardBody>
            <p style={{ fontSize: "var(--text-base)", lineHeight: 1.7 }}>
              {tala.summary}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="חתימה אמנותית" />
          <CardBody>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "var(--text-lg)",
                lineHeight: 1.7,
                color: "var(--sage-800)"
              }}
            >
              {tala.artisticSignature}
            </p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="רבדים פנימיים"
          subtitle="כל רובד מתאר זווית צפייה אחרת על התהליך."
        />
        <CardBody>
          <div className="ds-col">
            {tala.sections.map((s) => (
              <div
                key={s.id}
                style={{
                  padding: "var(--space-5)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-muted)",
                  border: "1px solid var(--border-soft)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                    flexWrap: "wrap",
                    gap: 8
                  }}
                >
                  <strong style={{ fontSize: "var(--text-lg)" }}>{s.title}</strong>
                  <Badge tone="muted">
                    עודכן {new Date(s.lastUpdated).toLocaleDateString("he-IL")}
                  </Badge>
                </div>
                <p
                  className="ds-t-xs ds-t-muted"
                  style={{ marginBottom: 10, fontStyle: "italic" }}
                >
                  {s.prompt}
                </p>
                <p style={{ lineHeight: 1.7 }}>{s.content}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
