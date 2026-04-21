import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { Badge } from "../../design-system/Badge";
import { Icon } from "../../design-system/Icon";
import { EmptyState } from "../../design-system/EmptyState";
import { usePatientContext } from "../../layouts/PatientWorkspace";
import { mockReports } from "../../mocks";

const statusTone = (s: string) => {
  switch (s) {
    case "draft":
      return "muted" as const;
    case "pending_review":
      return "warning" as const;
    case "approved":
      return "sage" as const;
    case "sent":
      return "success" as const;
    default:
      return "muted" as const;
  }
};
const statusLabel = (s: string) =>
  ({
    draft: "טיוטה",
    pending_review: "ממתין לאישור",
    approved: "מאושר",
    sent: "נשלח"
  })[s] || s;

export function PatientReportsTab() {
  const { patient } = usePatientContext();
  const navigate = useNavigate();
  const reports = mockReports.filter((r) => r.patientId === patient.id);

  return (
    <div className="ds-col">
      <Card>
        <CardHeader
          title="דוחות עבור המטופל"
          subtitle="דוחות רבעוניים, סיכומי תהליך, הפניות חיצוניות."
          actions={
            <>
              <Button
                variant="secondary"
                iconStart={<Icon name="sparkles" size={16} />}
              >
                טיוטה אוטומטית
              </Button>
              <Button
                iconStart={<Icon name="plus" size={16} />}
                onClick={() => navigate(`/reports/new?patientId=${patient.id}`)}
              >
                דוח חדש
              </Button>
            </>
          }
        />
        <CardBody>
          {reports.length === 0 ? (
            <EmptyState
              icon="fileText"
              title="עדיין לא נכתבו דוחות"
              description="אפשר להתחיל בדוח רבעוני או לסיכום תהליך אינטייק."
            />
          ) : (
            <div className="ds-col ds-col--sm">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="ds-list-row"
                  style={{
                    cursor: "pointer",
                    padding: "var(--space-4)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-md)"
                  }}
                  onClick={() => navigate(`/reports/${r.id}`)}
                >
                  <Icon name="fileText" size={22} />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        flexWrap: "wrap"
                      }}
                    >
                      <strong>{r.title}</strong>
                      <Badge tone={statusTone(r.status)}>{statusLabel(r.status)}</Badge>
                    </div>
                    <p className="ds-t-xs ds-t-muted" style={{ marginTop: 4 }}>
                      {r.authorName} · עודכן{" "}
                      {new Date(r.updatedAt).toLocaleDateString("he-IL")}
                      {r.recipient ? ` · נמען: ${r.recipient}` : ""}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" iconEnd={<Icon name="chevronLeft" size={14} />}>
                    פתיחה
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
