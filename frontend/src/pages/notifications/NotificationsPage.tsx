import { useMemo, useState } from "react";
import { PageHeader } from "../../design-system/PageHeader";
import { Card, CardBody } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { Segmented } from "../../design-system/Tabs";
import { Badge } from "../../design-system/Badge";
import { Avatar } from "../../design-system/Avatar";
import { Icon } from "../../design-system/Icon";
import { EmptyState } from "../../design-system/EmptyState";
import type { IconName } from "../../design-system/Icon";

interface NotificationEntry {
  id: string;
  kind: "task" | "message" | "ai" | "system";
  title: string;
  body: string;
  actor?: string;
  when: string;
  read: boolean;
  tone: "sage" | "clay" | "lavender" | "info" | "warning";
  icon: IconName;
}

const data: NotificationEntry[] = [
  {
    id: "n-1",
    kind: "task",
    title: "משימה דחופה",
    body: "חסר סיכום לאם של נועה אברמוב — תאריך יעד היום.",
    actor: "בטאל",
    when: "לפני 12 דק'",
    read: false,
    tone: "clay",
    icon: "flag"
  },
  {
    id: "n-2",
    kind: "ai",
    title: "תובנה חדשה מ-BATEL AI",
    body: "דפוס חוזר בתיאור רגשי — 'שריפה' — בתיעוד של יונתן ברוך. דורש סקירה.",
    actor: "BATEL AI",
    when: "לפני שעה",
    read: false,
    tone: "lavender",
    icon: "sparkles"
  },
  {
    id: "n-3",
    kind: "message",
    title: "הודעה מהורה",
    body: "אלה אברמוב הגיבה על בקשת שיתוף תמונה מהטיפול.",
    actor: "אלה אברמוב",
    when: "לפני 3 שעות",
    read: false,
    tone: "sage",
    icon: "messageCircle"
  },
  {
    id: "n-4",
    kind: "task",
    title: "תזכורת למפגש",
    body: "מפגש עם מיה רוזנטל בעוד 30 דקות.",
    actor: "יומן",
    when: "לפני 3 שעות",
    read: true,
    tone: "info",
    icon: "clock"
  },
  {
    id: "n-5",
    kind: "system",
    title: "גיבוי אוטומטי הושלם",
    body: "הגיבוי של 2026-04-19 נשמר בהצלחה.",
    actor: "מערכת",
    when: "אתמול",
    read: true,
    tone: "info",
    icon: "shield"
  },
  {
    id: "n-6",
    kind: "ai",
    title: "תקציר שבועי מוכן",
    body: "התקציר השבועי שלך מכיל 3 מגמות בולטות ו-2 הצעות לפעולה.",
    actor: "BATEL AI",
    when: "אתמול",
    read: true,
    tone: "lavender",
    icon: "sparkles"
  }
];

type Filter = "all" | "unread" | "task" | "message" | "ai" | "system";

export function NotificationsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [items, setItems] = useState(data);

  const filtered = useMemo(
    () =>
      items.filter((n) => {
        if (filter === "all") return true;
        if (filter === "unread") return !n.read;
        return n.kind === filter;
      }),
    [items, filter]
  );

  const unreadCount = items.filter((i) => !i.read).length;

  const markAllRead = () =>
    setItems((is) => is.map((i) => ({ ...i, read: true })));

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="מרחב עבודה"
        title="התראות"
        subtitle={
          unreadCount > 0
            ? `${unreadCount} התראות חדשות מחכות לך.`
            : "הכל מעודכן — אין התראות חדשות."
        }
        actions={
          <>
            <Button
              variant="secondary"
              iconStart={<Icon name="check" size={16} />}
              onClick={markAllRead}
            >
              סימון הכל כנקרא
            </Button>
            <Button
              iconStart={<Icon name="settings" size={16} />}
            >
              הגדרות התראות
            </Button>
          </>
        }
      />

      <Card>
        <CardBody compact>
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            items={[
              { value: "all", label: "הכל" },
              { value: "unread", label: `חדשות (${unreadCount})` },
              { value: "task", label: "משימות" },
              { value: "message", label: "הודעות" },
              { value: "ai", label: "AI" },
              { value: "system", label: "מערכת" }
            ]}
          />
        </CardBody>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="bell"
              title="אין התראות"
              description="כשיהיה משהו חדש — נודיע לך כאן."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="ds-col ds-col--sm">
          {filtered.map((n) => (
            <NotificationRow key={n.id} n={n} />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationRow({ n }: { n: NotificationEntry }) {
  return (
    <Card
      style={{
        cursor: "pointer",
        borderInlineStart: !n.read
          ? "3px solid var(--sage-500)"
          : "3px solid transparent"
      }}
    >
      <CardBody compact>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--radius-md)",
              background: `var(--${n.tone}-100)`,
              color: `var(--${n.tone}-${n.tone === "info" || n.tone === "warning" ? "700" : n.tone === "lavender" ? "500" : "700"})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Icon name={n.icon} size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 2
              }}
            >
              <strong style={{ fontSize: "var(--text-base)" }}>{n.title}</strong>
              {!n.read ? <Badge tone="sage">חדש</Badge> : null}
            </div>
            <p className="ds-t-sm" style={{ color: "var(--text)", marginBottom: 4 }}>
              {n.body}
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)"
              }}
            >
              {n.actor ? (
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                  <Avatar name={n.actor} size="sm" />
                  {n.actor}
                </span>
              ) : null}
              <span>·</span>
              <span>{n.when}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            פתיחה
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
