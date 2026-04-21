import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Callout } from "../../design-system/Callout";
import { Badge } from "../../design-system/Badge";
import { Button } from "../../design-system/Button";
import { Icon } from "../../design-system/Icon";
import { EmptyState } from "../../design-system/EmptyState";
import { usePatientContext } from "../../layouts/PatientWorkspace";
import { mockInsights } from "../../mocks";

const toneByType = (t: string) => {
  if (t === "warning") return "warning";
  if (t === "recommendation") return "sage";
  if (t === "pattern") return "info";
  if (t === "material_suggestion") return "clay";
  return "lavender";
};

const labelByType = (t: string) =>
  ({
    warning: "אזהרה",
    recommendation: "המלצה",
    pattern: "דפוס",
    material_suggestion: "חומר מוצע",
    summary: "סיכום"
  })[t] || t;

export function PatientAITab() {
  const { patient } = usePatientContext();
  const insights = mockInsights.filter((i) => i.patientId === patient.id);

  return (
    <div className="ds-col">
      <Callout tone="lavender" title="תובנות מבית BATEL AI">
        כל תובנה כאן <strong>נפרדת</strong> מהתיעוד המקורי. התובנות מסומנות בבירור,
        תמיד מצוינת רמת הוודאות, ואין דריסה של מידע שתועד ידנית.
      </Callout>

      {insights.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="sparkles"
              title="עדיין אין תובנות זמינות"
              description="תובנות נוצרות באופן אוטומטי לאחר 3 פגישות מתועדות לפחות."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="ds-grid ds-grid--2">
          {insights.map((i) => {
            const tone = toneByType(i.type) as
              | "warning"
              | "sage"
              | "info"
              | "clay"
              | "lavender";
            return (
              <Card key={i.id}>
                <CardHeader
                  title={i.title}
                  eyebrow={labelByType(i.type)}
                  actions={
                    <Badge
                      tone={
                        i.confidence === "high"
                          ? "success"
                          : i.confidence === "medium"
                            ? "warning"
                            : "muted"
                      }
                      dot
                    >
                      {i.confidence === "high"
                        ? "ודאות גבוהה"
                        : i.confidence === "medium"
                          ? "ודאות בינונית"
                          : "ודאות נמוכה"}
                    </Badge>
                  }
                />
                <CardBody>
                  <p style={{ lineHeight: 1.7, fontSize: "var(--text-base)" }}>{i.body}</p>
                  <div
                    style={{
                      marginTop: 14,
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      flexWrap: "wrap"
                    }}
                  >
                    <Badge tone={tone}>{labelByType(i.type)}</Badge>
                    <span className="ds-t-xs ds-t-muted">
                      נוצר {new Date(i.generatedAt).toLocaleDateString("he-IL")}
                    </span>
                    {i.requiresReview ? <Badge tone="warning">דורש סקירה</Badge> : null}
                  </div>
                </CardBody>
                <div className="ds-card__footer">
                  <Button variant="ghost" size="sm" iconStart={<Icon name="x" size={14} />}>
                    התעלמי
                  </Button>
                  <Button variant="subtle" size="sm" iconStart={<Icon name="bookmark" size={14} />}>
                    שמרי לעיון
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
