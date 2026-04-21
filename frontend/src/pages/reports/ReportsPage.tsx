import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../design-system/PageHeader";
import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { SearchInput } from "../../design-system/SearchInput";
import { Segmented } from "../../design-system/Tabs";
import { Badge } from "../../design-system/Badge";
import { Avatar } from "../../design-system/Avatar";
import { Icon } from "../../design-system/Icon";
import { StatCard } from "../../design-system/StatCard";
import { EmptyState } from "../../design-system/EmptyState";
import { mockReports } from "../../mocks";
import type { TherapyReport } from "../../mocks";

type StatusFilter = "all" | "draft" | "pending_review" | "approved" | "sent";

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

const typeLabel = (t: string) =>
  ({
    quarterly: "רבעוני",
    annual: "שנתי",
    intake_summary: "סיכום אינטייק",
    progress: "התקדמות",
    external_referral: "הפניה חיצונית"
  })[t] || t;

export function ReportsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    return mockReports.filter((r) => {
      const passQ =
        !q ||
        r.title.includes(q) ||
        r.patientName.includes(q) ||
        (r.recipient || "").includes(q);
      const passF = filter === "all" || r.status === filter;
      return passQ && passF;
    });
  }, [query, filter]);

  const stats = {
    total: mockReports.length,
    draft: mockReports.filter((r) => r.status === "draft").length,
    pending: mockReports.filter((r) => r.status === "pending_review").length,
    sent: mockReports.filter((r) => r.status === "sent").length
  };

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="ארכיון"
        title="דוחות"
        subtitle="דוחות רבעוניים, סיכומי תהליך, הפניות — עם מעקב סטטוס ברור."
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
              onClick={() => navigate("/reports/new")}
            >
              דוח חדש
            </Button>
          </>
        }
      />

      <div className="ds-grid ds-grid--4">
        <StatCard label="סה״כ דוחות" value={stats.total} icon="fileText" />
        <StatCard
          label="טיוטות"
          value={stats.draft}
          icon="edit"
          tone="lavender"
        />
        <StatCard
          label="ממתינים לאישור"
          value={stats.pending}
          icon="clock"
          tone="clay"
        />
        <StatCard label="נשלחו" value={stats.sent} icon="send" tone="info" />
      </div>

      <Card>
        <CardBody compact>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >
            <div style={{ flex: 1, minWidth: 240 }}>
              <SearchInput
                placeholder="חיפוש לפי כותרת דוח, מטופל או נמען"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Segmented<StatusFilter>
              value={filter}
              onChange={setFilter}
              items={[
                { value: "all", label: "הכל" },
                { value: "draft", label: "טיוטות" },
                { value: "pending_review", label: "ממתינים" },
                { value: "approved", label: "מאושרים" },
                { value: "sent", label: "נשלחו" }
              ]}
            />
          </div>
        </CardBody>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="fileText"
              title="לא נמצאו דוחות"
              description="אפשר להתחיל מטיוטה אוטומטית או ליצור דוח חדש."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="ds-col ds-col--sm">
          {filtered.map((r) => (
            <ReportRow key={r.id} report={r} onOpen={() => navigate(`/reports/${r.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportRow({
  report,
  onOpen
}: {
  report: TherapyReport;
  onOpen: () => void;
}) {
  return (
    <Card style={{ cursor: "pointer" }} onClick={onOpen}>
      <CardBody compact>
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "flex-start"
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-md)",
              background: "var(--lavender-100)",
              color: "var(--lavender-500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Icon name="fileText" size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 4
              }}
            >
              <strong style={{ fontSize: "var(--text-base)" }}>
                {report.title}
              </strong>
              <Badge tone={statusTone(report.status)}>
                {statusLabel(report.status)}
              </Badge>
              <Badge tone="outline">{typeLabel(report.type)}</Badge>
            </div>
            <p
              className="ds-t-sm ds-t-muted"
              style={{ lineHeight: 1.55, marginBottom: 6 }}
            >
              {report.summary}
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)",
                flexWrap: "wrap"
              }}
            >
              <span
                style={{ display: "inline-flex", gap: 6, alignItems: "center" }}
              >
                <Avatar name={report.patientName} size="sm" />
                {report.patientName}
              </span>
              <span>·</span>
              <span>עודכן {new Date(report.updatedAt).toLocaleDateString("he-IL")}</span>
              {report.recipient ? (
                <>
                  <span>·</span>
                  <span>נמען: {report.recipient}</span>
                </>
              ) : null}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconEnd={<Icon name="chevronLeft" size={14} />}
          >
            פתיחה
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
