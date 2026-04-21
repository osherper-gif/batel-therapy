import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../design-system/PageHeader";
import { Button } from "../../design-system/Button";
import { SearchInput } from "../../design-system/SearchInput";
import { Segmented } from "../../design-system/Tabs";
import { Card, CardBody } from "../../design-system/Card";
import { Badge } from "../../design-system/Badge";
import { Avatar } from "../../design-system/Avatar";
import { Icon } from "../../design-system/Icon";
import { EmptyState } from "../../design-system/EmptyState";
import { SkeletonRows } from "../../design-system/Skeleton";
import { Callout } from "../../design-system/Callout";
import { listPatients } from "../../services/patientsService";
import type { Patient } from "../../types";

type FilterKey = "all" | "active" | "onboarding" | "on_hold";

export function PatientsListPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    listPatients()
      .then((list) => alive && setPatients(list))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    return patients.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      if (q && !p.fullName.includes(q)) return false;
      return true;
    });
  }, [patients, filter, query]);

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="מרחב עבודה"
        title="מטופלים"
        subtitle="המטופלים הפעילים במערכת, ממוינים לפי שינוי אחרון."
        actions={
          <>
            <Button
              variant="secondary"
              iconStart={<Icon name="download" size={16} />}
            >
              ייצוא
            </Button>
            <Button
              iconStart={<Icon name="plus" size={16} />}
              onClick={() => navigate("/patients?new=1")}
            >
              מטופל חדש
            </Button>
          </>
        }
      />

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
                placeholder="חיפוש לפי שם"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Segmented<FilterKey>
              value={filter}
              onChange={setFilter}
              items={[
                { value: "all", label: "הכל" },
                { value: "active", label: "פעילים" },
                { value: "onboarding", label: "בהצטרפות" },
                { value: "on_hold", label: "מוקפאים" }
              ]}
            />
            <Button variant="ghost" iconStart={<Icon name="filter" size={16} />}>
              מסננים מתקדמים
            </Button>
          </div>
        </CardBody>
      </Card>

      {error ? <Callout tone="warning">{error}. מציגים מאגר מקומי.</Callout> : null}

      {isLoading ? (
        <Card>
          <CardBody>
            <SkeletonRows count={4} height={72} />
          </CardBody>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="users"
              title="לא נמצאו מטופלים"
              description={
                query
                  ? `אין התאמה לחיפוש "${query}".`
                  : "אפשר להוסיף את המטופל הראשון דרך כפתור 'מטופל חדש'."
              }
            />
          </CardBody>
        </Card>
      ) : (
        <div className="ds-grid ds-grid--auto">
          {filtered.map((p) => (
            <PatientCard
              key={p.id}
              patient={p}
              onClick={() => navigate(`/patients/${p.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PatientCard({
  patient,
  onClick
}: {
  patient: Patient;
  onClick: () => void;
}) {
  return (
    <Card
      variant="default"
      style={{ cursor: "pointer", transition: "transform 200ms" }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.transform = "")
      }
      onClick={onClick}
    >
      <div
        style={{
          padding: "var(--space-5)",
          display: "flex",
          flexDirection: "column",
          gap: 14
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12
          }}
        >
          <Avatar name={patient.fullName} size="lg" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "var(--text-lg)",
                color: "var(--text-strong)"
              }}
            >
              {patient.fullName}
            </div>
            <div
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-muted)",
                marginTop: 2
              }}
            >
              גיל {patient.age} · {patient.treatmentFramework}
            </div>
          </div>
          <Badge tone={statusTone(patient.status)}>{statusLabel(patient.status)}</Badge>
        </div>

        {patient.mainConcerns ? (
          <div
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text)",
              padding: "var(--space-3)",
              background: "var(--bg-muted)",
              borderRadius: "var(--radius-sm)",
              lineHeight: 1.5
            }}
          >
            {patient.mainConcerns}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)"
          }}
        >
          <span>
            <Icon name="clock" size={12} style={{ verticalAlign: "-2px", marginInlineEnd: 4 }} />
            עודכן{" "}
            {new Date(patient.updatedAt).toLocaleDateString("he-IL", {
              day: "numeric",
              month: "short"
            })}
          </span>
          {patient.educationalFramework ? (
            <Badge tone="muted" icon={<Icon name="compass" size={12} />}>
              {patient.educationalFramework}
            </Badge>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function statusLabel(s: string) {
  return s === "active" ? "פעיל" : s === "onboarding" ? "בהצטרפות" : s === "on_hold" ? "מוקפא" : s;
}
function statusTone(s: string): "success" | "info" | "muted" {
  return s === "active" ? "success" : s === "onboarding" ? "info" : "muted";
}
