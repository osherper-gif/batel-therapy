import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Badge } from "../../design-system/Badge";
import { Button } from "../../design-system/Button";
import { Progress } from "../../design-system/Progress";
import { Icon } from "../../design-system/Icon";
import { Callout } from "../../design-system/Callout";
import { usePatientContext } from "../../layouts/PatientWorkspace";
import { getTreatmentPlan } from "../../services/patientsService";

export function PatientTreatmentPlan() {
  const { patient } = usePatientContext();
  const plan = getTreatmentPlan(patient.id);

  return (
    <div className="ds-col">
      <Card>
        <CardHeader
          title="תכנית טיפול"
          subtitle="ייעוד, תדירות, מטרות, עוגנים. החלק הזה מתעדכן באופן תקופתי ומהווה את הרובד הקליני הראשי."
          actions={
            <>
              <Badge tone="sage" dot>
                פעילה
              </Badge>
              <Button
                variant="secondary"
                size="sm"
                iconStart={<Icon name="refresh" size={14} />}
              >
                הערכה חוזרת
              </Button>
            </>
          }
        />
        <CardBody>
          <div
            className="ds-grid ds-grid--2"
            style={{ gap: "var(--space-5)" }}
          >
            <PlanSummaryRow label="מסגרת">{plan.framework}</PlanSummaryRow>
            <PlanSummaryRow label="תדירות">{plan.frequency}</PlanSummaryRow>
            <PlanSummaryRow label="משך">{plan.duration}</PlanSummaryRow>
            <PlanSummaryRow label="עיגון תיאורטי">
              {plan.theoreticalAnchor}
            </PlanSummaryRow>
            <PlanSummaryRow label="מעורבות הורים">{plan.parentsInvolvement}</PlanSummaryRow>
            <PlanSummaryRow label="תדירות הערכה">{plan.reviewEvery}</PlanSummaryRow>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="מטרות טיפול"
          subtitle="כל מטרה מחוברת למדדים ומתעדכנת עם התקדמות."
          actions={
            <Button size="sm" iconStart={<Icon name="plus" size={14} />}>
              מטרה חדשה
            </Button>
          }
        />
        <CardBody>
          <div className="ds-col">
            {plan.goals.map((g) => (
              <Card key={g.id} variant="flat" style={{ border: "1px solid var(--border-soft)" }}>
                <CardBody compact>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                      marginBottom: 6,
                      flexWrap: "wrap"
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <strong style={{ fontSize: "var(--text-lg)" }}>{g.title}</strong>
                      <p className="ds-t-sm ds-t-muted" style={{ marginTop: 4 }}>
                        {g.description}
                      </p>
                    </div>
                    <div style={{ textAlign: "start", display: "flex", flexDirection: "column", gap: 4 }}>
                      <Badge
                        tone={g.status === "met" ? "success" : g.status === "paused" ? "muted" : "sage"}
                      >
                        {g.status === "met" ? "הושג" : g.status === "paused" ? "מושהה" : "פעיל"}
                      </Badge>
                      <span className="ds-t-xs ds-t-muted">
                        יעד: {new Date(g.targetBy).toLocaleDateString("he-IL")}
                      </span>
                    </div>
                  </div>
                  <Progress value={g.progress} label="התקדמות" />
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      <div
        className="ds-grid"
        style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)" }}
      >
        <Card>
          <CardHeader title="חומרים מועדפים" />
          <CardBody>
            <div className="ds-chips">
              {plan.materialsPreference.map((m) => (
                <Badge key={m} tone="clay">
                  {m}
                </Badge>
              ))}
              <Badge tone="outline" icon={<Icon name="plus" size={12} />}>
                הוספה
              </Badge>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="נקודות להתעכב עליהן" />
          <CardBody>
            <ul
              style={{
                paddingInlineStart: 18,
                margin: 0,
                color: "var(--text)",
                lineHeight: 1.8
              }}
            >
              {plan.clinicalIndications.map((ci) => (
                <li key={ci}>{ci}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Callout tone="info" title="הערכה הבאה">
        ההערכה הרבעונית הבאה מתוכננת ל-{new Date(plan.lastReviewedAt).toLocaleDateString("he-IL")}.
      </Callout>
    </div>
  );
}

function PlanSummaryRow({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="ds-t-caps">{label}</div>
      <div style={{ fontSize: "var(--text-base)", color: "var(--text-strong)", marginTop: 4 }}>
        {children}
      </div>
    </div>
  );
}
