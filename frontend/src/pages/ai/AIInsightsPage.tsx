import { useMemo, useState } from "react";
import { PageHeader } from "../../design-system/PageHeader";
import { Card, CardBody, CardHeader } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { SearchInput } from "../../design-system/SearchInput";
import { Segmented } from "../../design-system/Tabs";
import { Badge } from "../../design-system/Badge";
import { Avatar } from "../../design-system/Avatar";
import { Icon } from "../../design-system/Icon";
import { Callout } from "../../design-system/Callout";
import { StatCard } from "../../design-system/StatCard";
import { EmptyState } from "../../design-system/EmptyState";
import { mockInsights, mockAISummary } from "../../mocks";
import type { AIInsight } from "../../mocks";

type TypeFilter = "all" | "pattern" | "warning" | "recommendation" | "material_suggestion";

const toneByType = (t: string) => {
  if (t === "warning") return "warning" as const;
  if (t === "recommendation") return "sage" as const;
  if (t === "pattern") return "info" as const;
  if (t === "material_suggestion") return "clay" as const;
  return "lavender" as const;
};

const labelByType = (t: string) =>
  ({
    warning: "אזהרה",
    recommendation: "המלצה",
    pattern: "דפוס",
    material_suggestion: "חומר מוצע",
    summary: "סיכום"
  })[t] || t;

export function AIInsightsPage() {
  const [filter, setFilter] = useState<TypeFilter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    return mockInsights.filter((i) => {
      const passQ =
        !q ||
        i.title.includes(q) ||
        i.body.includes(q) ||
        i.patientName.includes(q);
      const passF = filter === "all" || i.type === filter;
      return passQ && passF;
    });
  }, [query, filter]);

  const counts = {
    total: mockInsights.length,
    warnings: mockInsights.filter((i) => i.type === "warning").length,
    recs: mockInsights.filter((i) => i.type === "recommendation").length,
    review: mockInsights.filter((i) => i.requiresReview).length
  };

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="BATEL AI"
        title="תובנות מבית BATEL"
        subtitle="תובנות המופקות מתיעוד המפגשים — מוצגות תמיד בנפרד מהתיעוד המקורי."
        actions={
          <>
            <Button
              variant="secondary"
              iconStart={<Icon name="refresh" size={16} />}
            >
              חישוב מחדש
            </Button>
            <Button iconStart={<Icon name="settings" size={16} />}>
              הגדרות AI
            </Button>
          </>
        }
      />

      <Callout tone="lavender" title="עקרונות ה-AI שלנו">
        כל תובנה נשמרת בנפרד מהתיעוד הגולמי, מצוינת רמת הוודאות, וכל פעולה
        שתובנה מציעה דורשת את האישור שלך לפני שמתבצעת. המודל לא חותם על דוחות,
        לא שולח אוטומטית, ולא ניגש למידע שלא אישרת.
      </Callout>

      <div className="ds-grid ds-grid--4">
        <StatCard label="סה״כ תובנות" value={counts.total} icon="sparkles" tone="lavender" />
        <StatCard label="אזהרות" value={counts.warnings} icon="alertTriangle" tone="clay" />
        <StatCard label="המלצות" value={counts.recs} icon="heart" />
        <StatCard
          label="ממתינות לסקירה"
          value={counts.review}
          icon="eye"
          tone="info"
        />
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
                placeholder="חיפוש לפי תובנה, מטופל או מילת מפתח"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Segmented<TypeFilter>
              value={filter}
              onChange={setFilter}
              items={[
                { value: "all", label: "הכל" },
                { value: "pattern", label: "דפוסים" },
                { value: "recommendation", label: "המלצות" },
                { value: "warning", label: "אזהרות" },
                { value: "material_suggestion", label: "חומרים" }
              ]}
            />
          </div>
        </CardBody>
      </Card>

      <div className="ds-grid ds-grid--2-1">
        <div className="ds-col">
          {filtered.length === 0 ? (
            <Card>
              <CardBody>
                <EmptyState
                  icon="sparkles"
                  title="אין תובנות תואמות"
                  description="נסי לשנות סינון או לבצע חישוב מחדש."
                />
              </CardBody>
            </Card>
          ) : (
            filtered.map((ins) => <InsightCard key={ins.id} insight={ins} />)
          )}
        </div>

        <div className="ds-col">
          <Card>
            <CardHeader
              title="תקציר שבועי"
              subtitle="סיכום אוטומטי על הפעילות שלך השבוע."
              eyebrow={<Icon name="sparkles" size={14} />}
            />
            <CardBody>
              <div className="ds-col ds-col--sm">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 8
                  }}
                >
                  <MiniStat
                    label="מטופלים"
                    value={mockAISummary.weekly.patientsSeen}
                  />
                  <MiniStat
                    label="מפגשים"
                    value={mockAISummary.weekly.sessionsCount}
                  />
                  <MiniStat
                    label="ממוצע (דק')"
                    value={mockAISummary.weekly.averageSessionMinutes}
                  />
                </div>
                <div style={{ marginTop: 12 }}>
                  <h4
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--text-muted)",
                      marginBottom: 8,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em"
                    }}
                  >
                    מגמות בולטות
                  </h4>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8
                    }}
                  >
                    {mockAISummary.weekly.notableTrends.map((t, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                          fontSize: "var(--text-sm)",
                          color: "var(--text)"
                        }}
                      >
                        <Icon
                          name="activity"
                          size={14}
                          style={{
                            marginTop: 2,
                            color: "var(--sage-600)"
                          }}
                        />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginTop: 12 }}>
                  <h4
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--text-muted)",
                      marginBottom: 8,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em"
                    }}
                  >
                    הצעות לפעולה
                  </h4>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8
                    }}
                  >
                    {mockAISummary.weekly.suggestions.map((s, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                          fontSize: "var(--text-sm)",
                          color: "var(--text)"
                        }}
                      >
                        <Icon
                          name="arrowLeft"
                          size={14}
                          style={{
                            marginTop: 2,
                            color: "var(--clay-600)"
                          }}
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: AIInsight }) {
  const tone = toneByType(insight.type);
  return (
    <Card>
      <CardHeader
        eyebrow={labelByType(insight.type)}
        title={insight.title}
        actions={
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Badge
              tone={
                insight.confidence === "high"
                  ? "success"
                  : insight.confidence === "medium"
                    ? "warning"
                    : "muted"
              }
              dot
            >
              {insight.confidence === "high"
                ? "ודאות גבוהה"
                : insight.confidence === "medium"
                  ? "ודאות בינונית"
                  : "ודאות נמוכה"}
            </Badge>
            {insight.requiresReview ? (
              <Badge tone="warning">דורש סקירה</Badge>
            ) : null}
          </div>
        }
      />
      <CardBody>
        <p style={{ lineHeight: 1.7 }}>{insight.body}</p>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginTop: 14,
            paddingTop: 10,
            borderTop: "1px dashed var(--border-soft)"
          }}
        >
          <Avatar name={insight.patientName} size="sm" />
          <span className="ds-t-sm">{insight.patientName}</span>
          <Badge tone={tone}>{labelByType(insight.type)}</Badge>
          <span
            className="ds-t-xs ds-t-muted"
            style={{ marginInlineStart: "auto" }}
          >
            {new Date(insight.generatedAt).toLocaleDateString("he-IL")}
          </span>
        </div>
      </CardBody>
      <div className="ds-card__footer">
        <Button
          variant="ghost"
          size="sm"
          iconStart={<Icon name="x" size={14} />}
        >
          התעלמי
        </Button>
        <Button
          variant="subtle"
          size="sm"
          iconStart={<Icon name="bookmark" size={14} />}
        >
          שמרי לעיון
        </Button>
      </div>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        padding: "var(--space-3)",
        background: "var(--bg-subtle)",
        borderRadius: "var(--radius-md)",
        textAlign: "center"
      }}
    >
      <div
        style={{
          fontSize: "var(--text-2xl)",
          fontWeight: 700,
          color: "var(--text-strong)"
        }}
      >
        {value}
      </div>
      <div className="ds-t-xs ds-t-muted">{label}</div>
    </div>
  );
}
