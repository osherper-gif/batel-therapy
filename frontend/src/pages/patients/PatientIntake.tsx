import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { Icon } from "../../design-system/Icon";
import { Callout } from "../../design-system/Callout";
import { usePatientContext } from "../../layouts/PatientWorkspace";
import { getIntake } from "../../services/patientsService";

export function PatientIntake() {
  const { patient } = usePatientContext();
  const blocks = getIntake(patient.id);

  return (
    <div className="ds-col">
      <Callout tone="sage" title="שלב הקליטה (Intake)">
        החלק הזה ממפה את נקודת ההתחלה — מה הביא את המטופל לקליניקה, רקע משפחתי, אבחונים ומטרות ראשוניות.
        הוא ישמש נקודת ייחוס קבועה לאורך הטיפול.
      </Callout>

      {blocks.map((block) => (
        <Card key={block.id}>
          <CardHeader
            title={block.title}
            actions={
              <Button
                variant="ghost"
                size="sm"
                iconStart={<Icon name="edit" size={14} />}
              >
                עריכה
              </Button>
            }
          />
          <CardBody>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "var(--space-3)"
              }}
            >
              {block.items.map((it) => (
                <div
                  key={it.label}
                  style={{
                    padding: "var(--space-3)",
                    background: "var(--bg-muted)",
                    borderRadius: "var(--radius-sm)"
                  }}
                >
                  <div className="ds-t-caps">{it.label}</div>
                  <div
                    style={{
                      color: "var(--text-strong)",
                      fontSize: "var(--text-base)",
                      marginTop: 4
                    }}
                  >
                    {it.value}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}

      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "flex-end"
        }}
      >
        <Button variant="secondary" iconStart={<Icon name="printer" size={16} />}>
          ייצוא לאינטייק מודפס
        </Button>
        <Button iconStart={<Icon name="save" size={16} />}>שמור שינויים</Button>
      </div>
    </div>
  );
}
