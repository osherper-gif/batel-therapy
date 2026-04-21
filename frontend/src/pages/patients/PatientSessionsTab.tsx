import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { Segmented } from "../../design-system/Tabs";
import { SearchInput } from "../../design-system/SearchInput";
import { Icon } from "../../design-system/Icon";
import { EmptyState } from "../../design-system/EmptyState";
import { Badge } from "../../design-system/Badge";
import { usePatientContext } from "../../layouts/PatientWorkspace";

type View = "cards" | "timeline";

export function PatientSessionsTab() {
  const { patient } = usePatientContext();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("cards");
  const [query, setQuery] = useState("");

  const sessions = useMemo(
    () =>
      patient.sessions.filter(
        (s) =>
          !query.trim() ||
          (s.goal && s.goal.includes(query)) ||
          (s.sessionDescription && s.sessionDescription.includes(query))
      ),
    [patient.sessions, query]
  );

  return (
    <div className="ds-col">
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
                placeholder="חיפוש בתוך המפגשים..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Segmented<View>
              value={view}
              onChange={setView}
              items={[
                { value: "cards", label: "כרטיסים" },
                { value: "timeline", label: "ציר זמן" }
              ]}
            />
            <Button
              iconStart={<Icon name="plus" size={16} />}
              onClick={() => navigate(`/sessions/new?patientId=${patient.id}`)}
            >
              מפגש חדש
            </Button>
          </div>
        </CardBody>
      </Card>

      {sessions.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="calendar"
              title="אין מפגשים מתועדים עדיין"
              description="לחצי על 'מפגש חדש' כדי להתחיל לתעד."
            />
          </CardBody>
        </Card>
      ) : view === "cards" ? (
        <div className="ds-grid ds-grid--2">
          {sessions.map((s) => (
            <Card
              key={s.id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/sessions/${s.id}`)}
            >
              <CardHeader
                title={s.goal || s.sessionType}
                subtitle={`${new Date(s.date).toLocaleDateString("he-IL")} · ${s.startTime}`}
                actions={<Badge tone="sage">{s.sessionType}</Badge>}
              />
              <CardBody>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.6,
                    color: "var(--text)",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden"
                  }}
                >
                  {s.sessionDescription || "—"}
                </p>
                {s.materialsUsed ? (
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: "var(--text-xs)",
                      color: "var(--text-muted)"
                    }}
                  >
                    <Icon
                      name="palette"
                      size={14}
                      style={{ verticalAlign: "-2px", marginInlineEnd: 4 }}
                    />
                    חומרים: {s.materialsUsed}
                  </div>
                ) : null}
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody>
            <div className="ds-timeline">
              {sessions.map((s) => (
                <div key={s.id} className="ds-timeline__item">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4
                    }}
                  >
                    <strong>
                      {new Date(s.date).toLocaleDateString("he-IL", {
                        weekday: "long",
                        day: "numeric",
                        month: "short"
                      })}
                    </strong>
                    <Badge tone="sage">{s.sessionType}</Badge>
                  </div>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      lineHeight: 1.6,
                      marginBottom: 6
                    }}
                  >
                    <strong>מטרה: </strong>
                    {s.goal || "—"}
                  </p>
                  <p className="ds-t-sm ds-t-muted">
                    {s.clinicalImpression || s.sessionDescription}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ marginTop: 8 }}
                    iconEnd={<Icon name="chevronLeft" size={14} />}
                    onClick={() => navigate(`/sessions/${s.id}`)}
                  >
                    לצפייה מלאה
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
