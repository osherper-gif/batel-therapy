import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../design-system/PageHeader";
import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { Badge } from "../../design-system/Badge";
import { EmptyState } from "../../design-system/EmptyState";
import { Icon } from "../../design-system/Icon";
import { SearchInput } from "../../design-system/SearchInput";
import { Skeleton } from "../../design-system/Skeleton";
import { showPlaceholderMessage } from "../../lib/uiActions";
import { listSessions } from "../../services/sessionsService";
import type { Session } from "../../types";

function formatSessionDate(value: string) {
  return new Date(value).toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export function SessionsListPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    listSessions()
      .then((items) => {
        if (active) {
          setSessions(items);
        }
      })
      .catch(() => {
        if (active) {
          setSessions([]);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredSessions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return sessions;
    }

    return sessions.filter((session) =>
      [
        session.patient?.fullName,
        session.goal,
        session.sessionDescription,
        session.sessionType,
        session.location
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery))
    );
  }, [query, sessions]);

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="יומן טיפולי"
        title="מפגשים"
        subtitle="כל המפגשים במקום אחד, עם חיפוש מהיר וגישה לעריכה."
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => showPlaceholderMessage("מסננים מתקדמים עדיין לא מומשו.")}
            >
              מסננים מתקדמים
            </Button>
            <Button
              data-testid="sessions-new-session"
              iconStart={<Icon name="plus" size={16} />}
              onClick={() => navigate("/sessions/new")}
            >
              מפגש חדש
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
              justifyContent: "space-between",
              flexWrap: "wrap"
            }}
          >
            <div style={{ flex: 1, minWidth: 240 }}>
              <SearchInput
                placeholder="חיפוש לפי מטופל/ת, מטרה, תיאור או סוג מפגש..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Badge tone="sage">{filteredSessions.length} מפגשים</Badge>
          </div>
        </CardBody>
      </Card>

      {isLoading ? (
        <Card>
          <CardBody>
            <Skeleton height={280} />
          </CardBody>
        </Card>
      ) : filteredSessions.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="calendar"
              title="עדיין אין מפגשים להצגה"
              description="אפשר ליצור מפגש חדש או לשנות את החיפוש כדי לראות תוצאות קיימות."
              action={
                <Button
                  data-testid="sessions-new-session"
                  iconStart={<Icon name="plus" size={16} />}
                  onClick={() => navigate("/sessions/new")}
                >
                  מפגש חדש
                </Button>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <div className="ds-grid ds-grid--2">
          {filteredSessions.map((session) => (
            <Card
              key={session.id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/sessions/${session.id}`)}
            >
              <CardHeader
                title={session.goal || session.sessionType}
                subtitle={`${formatSessionDate(session.date)} · ${session.startTime}`}
                eyebrow={session.patient?.fullName || "ללא שיוך"}
                actions={<Badge tone="clay">{session.sessionType}</Badge>}
              />
              <CardBody compact>
                <div className="ds-col ds-col--xs">
                  <div className="ds-t-sm">
                    <strong>מטופל/ת:</strong> {session.patient?.fullName || "לא הוגדר"}
                  </div>
                  <div className="ds-t-sm">
                    <strong>משך:</strong> {session.durationMinutes} דקות
                  </div>
                  <div className="ds-t-sm">
                    <strong>מיקום:</strong> {session.location || "לא צוין"}
                  </div>
                  <div className="ds-t-sm ds-t-muted" style={{ lineHeight: 1.6 }}>
                    {session.sessionDescription || "אין עדיין תיאור מפגש."}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <Badge tone="sage">{session.frameworkType || "מסגרת לא הוגדרה"}</Badge>
                    <Button variant="ghost" size="sm" iconEnd={<Icon name="chevronLeft" size={14} />}>
                      פתיחת מפגש
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
