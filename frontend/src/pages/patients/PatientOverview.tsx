import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { Badge } from "../../design-system/Badge";
import { Callout } from "../../design-system/Callout";
import { Progress } from "../../design-system/Progress";
import { Icon } from "../../design-system/Icon";
import { Timeline } from "../../design-system/Timeline";
import { usePatientContext } from "../../layouts/PatientWorkspace";
import { getTreatmentPlan } from "../../services/patientsService";
import { mockInsights, mockTasks } from "../../mocks";

export function PatientOverview() {
  const { patient } = usePatientContext();
  const navigate = useNavigate();
  const plan = getTreatmentPlan(patient.id);
  const patientInsights = mockInsights.filter((i) => i.patientId === patient.id);
  const patientTasks = mockTasks.filter((t) => t.patientId === patient.id);

  const nextSession = patient.sessions[0];
  const lastSessions = patient.sessions.slice(0, 3);

  return (
    <div
      className="ds-grid"
      style={{ gridTemplateColumns: "2fr 1fr", gap: "var(--space-5)" }}
    >
      <div className="ds-col">
        <Card>
          <CardHeader
            title="תמונת מצב"
            subtitle="סיכום רגשי-קליני תמציתי שמתעדכן עם כל פגישה."
          />
          <CardBody>
            <div className="ds-col ds-col--sm">
              <OverviewRow label="חששות מרכזיים">
                {patient.mainConcerns || "—"}
              </OverviewRow>
              <OverviewRow label="מטרות טיפול">
                {patient.treatmentGoals || "—"}
              </OverviewRow>
              <OverviewRow label="מסגרת טיפול">
                {patient.treatmentFramework}
              </OverviewRow>
              {patient.educationalFramework ? (
                <OverviewRow label="מסגרת חינוכית">
                  {patient.educationalFramework} ({patient.frameworkType})
                </OverviewRow>
              ) : null}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="התקדמות לפי מטרות"
            subtitle="מבט מהיר ללב תכנית הטיפול."
            actions={
              <Button
                variant="ghost"
                size="sm"
                iconEnd={<Icon name="chevronLeft" size={14} />}
                onClick={() => navigate(`/patients/${patient.id}/treatment`)}
              >
                לתכנית המלאה
              </Button>
            }
          />
          <CardBody>
            <div className="ds-col">
              {plan.goals.map((g) => (
                <div key={g.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6
                    }}
                  >
                    <strong style={{ fontSize: "var(--text-base)" }}>{g.title}</strong>
                    <Badge
                      tone={g.status === "met" ? "success" : g.status === "paused" ? "muted" : "sage"}
                    >
                      {g.status === "met" ? "הושג" : g.status === "paused" ? "מושהה" : "פעיל"}
                    </Badge>
                  </div>
                  <p className="ds-t-sm ds-t-muted" style={{ marginBottom: 8 }}>
                    {g.description}
                  </p>
                  <Progress value={g.progress} />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="מפגשים אחרונים"
            actions={
              <Button
                variant="ghost"
                size="sm"
                iconEnd={<Icon name="chevronLeft" size={14} />}
                onClick={() => navigate(`/patients/${patient.id}/sessions`)}
              >
                לכל המפגשים
              </Button>
            }
          />
          <CardBody>
            {lastSessions.length === 0 ? (
              <p className="ds-t-muted">טרם תועדו מפגשים.</p>
            ) : (
              <Timeline
                items={lastSessions.map((s) => ({
                  id: s.id,
                  title: s.goal || s.sessionType,
                  meta: new Date(s.date).toLocaleDateString("he-IL", {
                    day: "numeric",
                    month: "short"
                  }),
                  body: s.clinicalImpression || s.sessionDescription
                }))}
              />
            )}
          </CardBody>
        </Card>
      </div>

      <div className="ds-col">
        {nextSession ? (
          <Card>
            <CardHeader title="המפגש האחרון" />
            <CardBody>
              <div className="ds-col ds-col--sm">
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-muted)"
                  }}
                >
                  {new Date(nextSession.date).toLocaleDateString("he-IL", {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                  })}{" "}
                  · {nextSession.startTime}
                </div>
                <strong>{nextSession.goal || nextSession.sessionType}</strong>
                <p className="ds-t-sm">
                  {nextSession.clinicalImpression || nextSession.sessionDescription}
                </p>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => navigate(`/sessions/${nextSession.id}`)}
                >
                  לפתיחה המלאה
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : null}

        {patientInsights.length > 0 ? (
          <Card>
            <CardHeader
              title="תובנות AI"
              eyebrow="עדכני לרבעון הנוכחי"
            />
            <CardBody compact>
              <div className="ds-col ds-col--sm">
                {patientInsights.slice(0, 2).map((i) => (
                  <Callout
                    key={i.id}
                    tone={i.type === "warning" ? "warning" : "sage"}
                    title={i.title}
                  >
                    {i.body}
                  </Callout>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  iconEnd={<Icon name="chevronLeft" size={14} />}
                  onClick={() => navigate(`/patients/${patient.id}/ai`)}
                >
                  כל התובנות
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : null}

        <Card>
          <CardHeader
            title="משימות קשורות"
            subtitle={`${patientTasks.length} פריטים פתוחים`}
          />
          <CardBody compact>
            {patientTasks.length === 0 ? (
              <p className="ds-t-muted ds-t-sm">אין משימות פעילות.</p>
            ) : (
              <div className="ds-col ds-col--sm">
                {patientTasks.slice(0, 3).map((t) => (
                  <div key={t.id} className="ds-list-row">
                    <Icon
                      name={t.priority === "high" ? "flag" : "bookmark"}
                      size={16}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: "var(--text-sm)" }}>{t.title}</strong>
                      <p className="ds-t-xs ds-t-muted">
                        עד {new Date(t.dueDate).toLocaleDateString("he-IL")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card variant="muted">
          <CardBody>
            <strong style={{ fontSize: "var(--text-sm)" }}>הפרדה בין מקור ל-AI</strong>
            <p className="ds-t-sm" style={{ marginTop: 8 }}>
              כל השדות במסך זה נשמרים כמקור ידני. תובנות AI מופיעות רק בטאב נפרד, ולעולם אינן דורסות מידע.
            </p>
          </CardBody>
        </Card>
      </div>

      <style>{`
        @media (max-width: 1080px) {
          .patient-workspace .ds-grid[style*="grid-template-columns: 2fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function OverviewRow({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "130px 1fr",
        gap: 16,
        paddingBlock: 8,
        borderBottom: "1px solid var(--border-soft)"
      }}
    >
      <div className="ds-t-caps">{label}</div>
      <div style={{ color: "var(--text-strong)", fontSize: "var(--text-base)" }}>
        {children}
      </div>
    </div>
  );
}
