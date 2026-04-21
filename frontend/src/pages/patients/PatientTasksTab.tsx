import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Badge } from "../../design-system/Badge";
import { Button } from "../../design-system/Button";
import { Icon } from "../../design-system/Icon";
import { EmptyState } from "../../design-system/EmptyState";
import { usePatientContext } from "../../layouts/PatientWorkspace";
import { mockTasks } from "../../mocks";

export function PatientTasksTab() {
  const { patient } = usePatientContext();
  const tasks = mockTasks.filter((t) => t.patientId === patient.id);

  return (
    <div className="ds-col">
      <Card>
        <CardHeader
          title="משימות ותזכורות"
          subtitle="המשימות הקשורות למטופל/ת — פולו-אפ, תיאומים ועוד."
          actions={
            <Button iconStart={<Icon name="plus" size={16} />}>משימה חדשה</Button>
          }
        />
        <CardBody>
          {tasks.length === 0 ? (
            <EmptyState
              icon="tasks"
              title="אין משימות פתוחות"
              description="אפשר להוסיף משימה כשעולה צורך — תזכורת, תיאום, או פולו-אפ."
            />
          ) : (
            <div className="ds-col ds-col--sm">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: "var(--space-3) var(--space-4)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-md)"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={t.status === "done"}
                    onChange={() => {}}
                    style={{
                      width: 18,
                      height: 18,
                      accentColor: "var(--sage-500)",
                      cursor: "pointer"
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong
                      style={{
                        fontSize: "var(--text-base)",
                        textDecoration: t.status === "done" ? "line-through" : "none",
                        color: t.status === "done" ? "var(--text-muted)" : "var(--text-strong)"
                      }}
                    >
                      {t.title}
                    </strong>
                    {t.notes ? (
                      <p className="ds-t-sm ds-t-muted" style={{ marginTop: 2 }}>
                        {t.notes}
                      </p>
                    ) : null}
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        marginTop: 6
                      }}
                    >
                      <Badge
                        tone={
                          t.priority === "high"
                            ? "danger"
                            : t.priority === "medium"
                              ? "warning"
                              : "muted"
                        }
                        dot
                      >
                        {t.priority === "high"
                          ? "דחוף"
                          : t.priority === "medium"
                            ? "בינוני"
                            : "נמוך"}
                      </Badge>
                      <span className="ds-t-xs ds-t-muted">
                        <Icon name="clock" size={12} style={{ verticalAlign: "-2px" }} />{" "}
                        עד {new Date(t.dueDate).toLocaleDateString("he-IL")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
