import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../design-system/PageHeader";
import { StatCard } from "../../design-system/StatCard";
import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button, IconButton } from "../../design-system/Button";
import { Avatar } from "../../design-system/Avatar";
import { Badge } from "../../design-system/Badge";
import { Callout } from "../../design-system/Callout";
import { Icon } from "../../design-system/Icon";
import { SkeletonRows } from "../../design-system/Skeleton";
import { Progress } from "../../design-system/Progress";
import { getDashboard } from "../../services/dashboardService";
import { mockTasks, mockInsights, mockAISummary } from "../../mocks";
import { showPlaceholderMessage } from "../../lib/uiActions";
import type { DashboardPayload } from "../../types";

export function DashboardPage() {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    getDashboard()
      .then((payload) => {
        if (!active) return;
        setData(payload);
        setError(null);
      })
      .catch((nextError) => {
        if (!active) return;
        setError(nextError instanceof Error ? nextError.message : "לא הצלחנו לטעון את הדשבורד.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const today = new Date().toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  const urgentTasks = mockTasks.filter((task) => task.status !== "done" && task.priority === "high");

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="סקירה יומית"
        title="שלום, בת-אל"
        subtitle={`היום ${today}. ${data ? `${data.recentSessions.length} מפגשים השבוע.` : ""}`}
        actions={
          <>
            <Button variant="secondary" iconStart={<Icon name="calendar" size={16} />} onClick={() => navigate("/sessions")}>
              יומן השבוע
            </Button>
            <Button
              iconStart={<Icon name="plus" size={16} />}
              onClick={() => navigate("/sessions/new")}
              data-testid="dashboard-new-session"
            >
              מפגש חדש
            </Button>
          </>
        }
      />

      {error ? (
        <Callout tone="warning" title="מקור מידע לא זמין">
          {error}. מציגים נתוני דוגמה.
        </Callout>
      ) : null}

      <section className="ds-grid ds-grid--4">
        <StatCard
          label="מטופלים פעילים"
          value={isLoading ? "—" : data!.stats.patientsCount}
          icon="users"
          tone="sage"
          data-testid="dashboard-stat-patients"
          delta={{ value: "+2 החודש", direction: "up" }}
        />
        <StatCard
          label="מפגשים השבוע"
          value={isLoading ? "—" : data!.stats.sessionsCount}
          icon="calendar"
          tone="clay"
          data-testid="dashboard-stat-sessions"
          delta={{ value: "-1 מהשבוע שעבר", direction: "down" }}
        />
        <StatCard
          label="מסמכים במאגר"
          value={isLoading ? "—" : data!.stats.documentsCount}
          icon="folder"
          tone="info"
          data-testid="dashboard-stat-documents"
          hint="כולל מסמכי רקע ודוחות"
        />
        <StatCard
          label="עבודות אמנות"
          value={isLoading ? "—" : data!.stats.imagesCount}
          icon="image"
          tone="lavender"
          data-testid="dashboard-stat-images"
          hint="תמונות מהמפגשים"
        />
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "var(--space-5)"
        }}
        className="dashboard-grid"
      >
        <div className="ds-col">
          <Card>
            <CardHeader
              title="מפגשים אחרונים"
              subtitle="חמשת המפגשים האחרונים שתיעדת."
              actions={
                <Button variant="ghost" size="sm" iconEnd={<Icon name="chevronLeft" size={14} />} onClick={() => navigate("/sessions")}>
                  לכל המפגשים
                </Button>
              }
            />
            <CardBody compact>
              {isLoading ? (
                <SkeletonRows count={4} height={56} />
              ) : (
                <div className="ds-col ds-col--sm">
                  {data!.recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="ds-list-row"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/sessions/${session.id}`)}
                    >
                      <Avatar name={session.patient?.fullName} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <strong>{session.patient?.fullName || "—"}</strong>
                          <Badge tone="sage">{session.sessionType}</Badge>
                        </div>
                        <p
                          className="ds-t-sm ds-t-muted"
                          style={{
                            marginTop: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {session.goal || "—"}
                        </p>
                      </div>
                      <div style={{ textAlign: "start", fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                        {new Date(session.date).toLocaleDateString("he-IL", {
                          weekday: "short",
                          day: "numeric",
                          month: "short"
                        })}
                        <div>{session.startTime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="מטופלים שעודכנו לאחרונה"
              actions={
                <Button variant="ghost" size="sm" iconEnd={<Icon name="chevronLeft" size={14} />} onClick={() => navigate("/patients")}>
                  לכל המטופלים
                </Button>
              }
            />
            <CardBody compact>
              {isLoading ? (
                <SkeletonRows count={3} height={48} />
              ) : (
                <div className="ds-col ds-col--sm">
                  {data!.recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="ds-list-row"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                      <Avatar name={patient.fullName} />
                      <div style={{ flex: 1 }}>
                        <strong>{patient.fullName}</strong>
                        <p className="ds-t-sm ds-t-muted">
                          {patient.treatmentFramework} · גיל {patient.age}
                        </p>
                      </div>
                      <Badge tone={patient.status === "active" ? "success" : "muted"}>{statusLabel(patient.status)}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="ds-col">
          <Card>
            <CardHeader
              title="תובנות השבוע"
              eyebrow="BATEL AI"
              actions={
                <IconButton aria-label="פתיחת מרכז התובנות" onClick={() => navigate("/ai")}>
                  <Icon name="more" size={16} />
                </IconButton>
              }
            />
            <CardBody compact>
              <div className="ds-col ds-col--sm">
                <Callout tone="sage" title="דפוסי עבודה">
                  {mockAISummary.weekly.notableTrends[0]}
                </Callout>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--text)" }}>
                  <strong>מגמות השבוע</strong>
                  <ul style={{ paddingInlineStart: 18, marginTop: 8 }}>
                    {mockAISummary.weekly.notableTrends.map((trend) => (
                      <li key={trend} style={{ marginBottom: 4 }}>
                        {trend}
                      </li>
                    ))}
                  </ul>
                </div>
                <Progress value={72} label="התקדמות מטופלים פעילים (ממוצע)" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="משימות דחופות"
              subtitle={`${urgentTasks.length} פריטים לטיפול`}
              actions={
                <Button variant="ghost" size="sm" iconEnd={<Icon name="chevronLeft" size={14} />} onClick={() => navigate("/tasks")}>
                  לכולם
                </Button>
              }
            />
            <CardBody compact>
              {urgentTasks.length === 0 ? (
                <p className="ds-t-muted ds-t-sm">אין משימות דחופות כרגע.</p>
              ) : (
                <div className="ds-col ds-col--sm">
                  {urgentTasks.map((task) => (
                    <div key={task.id} className="ds-list-row">
                      <Icon name="flag" size={18} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: "var(--text-sm)" }}>{task.title}</strong>
                        <p className="ds-t-xs ds-t-muted">
                          {task.patientName || "כללי"} · עד {new Date(task.dueDate).toLocaleDateString("he-IL")}
                        </p>
                      </div>
                      <Badge tone="danger" dot>
                        דחוף
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card variant="muted">
            <CardBody>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Icon name="sparkles" size={18} />
                <div>
                  <strong style={{ fontSize: "var(--text-sm)" }}>{mockInsights[0].title}</strong>
                  <p className="ds-t-sm" style={{ marginTop: 4 }}>
                    {mockInsights[0].body}
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    <Button size="sm" variant="subtle" onClick={() => navigate("/ai")}>
                      לעוד תובנות
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        showPlaceholderMessage("סימון תובנה מתוך הדשבורד יתווסף בהמשך. כרגע אפשר לפתוח את מרכז ה-AI ולנהל משם.")
                      }
                    >
                      טיפול מאוחר יותר
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <style>{`
        @media (max-width: 1080px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function statusLabel(status: string) {
  if (status === "active") return "פעיל";
  if (status === "onboarding") return "בהצטרפות";
  if (status === "on_hold") return "מוקפא";
  return status;
}
