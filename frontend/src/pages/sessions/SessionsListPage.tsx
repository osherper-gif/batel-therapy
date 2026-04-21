import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../design-system/PageHeader";
import { Card, CardBody } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { SearchInput } from "../../design-system/SearchInput";
import { Segmented } from "../../design-system/Tabs";
import { Avatar } from "../../design-system/Avatar";
import { Badge } from "../../design-system/Badge";
import { Icon } from "../../design-system/Icon";
import { EmptyState } from "../../design-system/EmptyState";
import { SkeletonRows } from "../../design-system/Skeleton";
import { listSessions } from "../../services/sessionsService";
import type { Session } from "../../types";

type View = "cards" | "list";

export function SessionsListPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [view, setView] = useState<View>("cards");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    listSessions()
      .then((s) => alive && setSessions(s))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const q = query.trim();
    const filtered = sessions.filter(
      (s) =>
        !q ||
        (s.patient?.fullName && s.patient.fullName.includes(q)) ||
        (s.goal && s.goal.includes(q))
    );
    const map = new Map<string, Session[]>();
    filtered.forEach((s) => {
      const key = s.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [sessions, query]);

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="מרחב עבודה"
        title="מפגשים"
        subtitle="תיעוד מפגשים מהיום ומהימים האחרונים."
        actions={
          <>
            <Button
              variant="secondary"
              iconStart={<Icon name="calendar" size={16} />}
            >
              יומן שבועי
            </Button>
            <Button
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
              flexWrap: "wrap"
            }}
          >
            <div style={{ flex: 1, minWidth: 240 }}>
              <SearchInput
                placeholder="חיפוש לפי שם מטופל או מטרה"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Segmented<View>
              value={view}
              onChange={setView}
              items={[
                { value: "cards", label: "כרטיסים" },
                { value: "list", label: "רשימה" }
              ]}
            />
            <Button variant="ghost" iconStart={<Icon name="filter" size={16} />}>
              מסננים
            </Button>
          </div>
        </CardBody>
      </Card>

      {isLoading ? (
        <Card>
          <CardBody>
            <SkeletonRows count={4} height={72} />
          </CardBody>
        </Card>
      ) : grouped.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="calendar"
              title="לא נמצאו מפגשים"
              description={query ? `אין תוצאות לחיפוש "${query}".` : "התחילי בהוספת מפגש חדש."}
            />
          </CardBody>
        </Card>
      ) : (
        <div className="ds-col">
          {grouped.map(([date, list]) => (
            <section key={date} className="ds-col ds-col--sm">
              <DayHeader date={date} count={list.length} />
              {view === "cards" ? (
                <div className="ds-grid ds-grid--2">
                  {list.map((s) => (
                    <SessionCardView
                      key={s.id}
                      session={s}
                      onClick={() => navigate(`/sessions/${s.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardBody compact>
                    <div className="ds-col ds-col--sm">
                      {list.map((s) => (
                        <div
                          key={s.id}
                          className="ds-list-row"
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate(`/sessions/${s.id}`)}
                        >
                          <Avatar name={s.patient?.fullName} />
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center"
                              }}
                            >
                              <strong>{s.patient?.fullName}</strong>
                              <Badge tone="sage">{s.sessionType}</Badge>
                            </div>
                            <p className="ds-t-sm ds-t-muted">
                              {s.goal || s.sessionDescription || "—"}
                            </p>
                          </div>
                          <div
                            style={{
                              fontSize: "var(--text-xs)",
                              color: "var(--text-muted)"
                            }}
                          >
                            {s.startTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function DayHeader({ date, count }: { date: string; count: number }) {
  const d = new Date(date);
  const isToday = d.toDateString() === new Date().toDateString();
  const label = d.toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingInline: 4
      }}
    >
      <h3
        style={{
          fontSize: "var(--text-md)",
          color: "var(--text-strong)",
          fontWeight: 600
        }}
      >
        {label}
      </h3>
      {isToday ? <Badge tone="sage">היום</Badge> : null}
      <span className="ds-t-xs ds-t-muted">
        {count} מפגש{count !== 1 ? "ים" : ""}
      </span>
    </div>
  );
}

function SessionCardView({ session, onClick }: { session: Session; onClick: () => void }) {
  return (
    <Card style={{ cursor: "pointer" }} onClick={onClick}>
      <CardBody>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <Avatar name={session.patient?.fullName} size="lg" />
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: "var(--text-lg)" }}>
              {session.patient?.fullName}
            </strong>
            <div className="ds-t-sm ds-t-muted">
              {session.startTime} · {session.durationMinutes} דק'
              {session.frameworkType ? ` · ${session.frameworkType}` : ""}
            </div>
          </div>
          <Badge tone="sage">{session.sessionType}</Badge>
        </div>
        <div
          style={{
            background: "var(--bg-muted)",
            padding: "var(--space-3)",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--text-sm)",
            lineHeight: 1.6,
            color: "var(--text)"
          }}
        >
          <strong>מטרה: </strong>
          {session.goal || "—"}
        </div>
        {session.clinicalImpression ? (
          <p
            style={{
              marginTop: 10,
              fontSize: "var(--text-sm)",
              color: "var(--text-muted)",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden"
            }}
          >
            {session.clinicalImpression}
          </p>
        ) : null}
      </CardBody>
    </Card>
  );
}
