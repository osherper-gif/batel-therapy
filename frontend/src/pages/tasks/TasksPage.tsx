import { useMemo, useState } from "react";
import { PageHeader } from "../../design-system/PageHeader";
import { Card, CardBody } from "../../design-system/Card";
import { Button } from "../../design-system/Button";
import { SearchInput } from "../../design-system/SearchInput";
import { Segmented } from "../../design-system/Tabs";
import { Badge } from "../../design-system/Badge";
import { Avatar } from "../../design-system/Avatar";
import { Icon } from "../../design-system/Icon";
import { EmptyState } from "../../design-system/EmptyState";
import { StatCard } from "../../design-system/StatCard";
import { mockTasks } from "../../mocks";
import type { TaskReminder } from "../../mocks";

type StatusFilter = "all" | "open" | "in_progress" | "done" | "snoozed";

const priorityTone = (p: string) =>
  p === "high" ? "danger" : p === "medium" ? "warning" : "muted";

const priorityLabel = (p: string) =>
  p === "high" ? "דחוף" : p === "medium" ? "בינוני" : "נמוך";

const statusLabel = (s: string) =>
  ({
    open: "פתוח",
    in_progress: "בתהליך",
    done: "הושלם",
    snoozed: "דחוי"
  })[s] || s;

const typeIcon = (t: string) =>
  t === "reminder" ? "bell" : t === "follow_up" ? "activity" : "check";

const daysUntil = (dueIso: string) => {
  const due = new Date(dueIso);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export function TasksPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [tasksState, setTasksState] = useState(mockTasks);

  const filtered = useMemo(() => {
    const q = query.trim();
    return tasksState.filter(
      (t) =>
        (!q || t.title.includes(q) || (t.patientName || "").includes(q)) &&
        (filter === "all" || t.status === filter)
    );
  }, [tasksState, filter, query]);

  const stats = {
    open: tasksState.filter((t) => t.status === "open").length,
    highPriority: tasksState.filter(
      (t) => t.priority === "high" && t.status !== "done"
    ).length,
    overdue: tasksState.filter(
      (t) => daysUntil(t.dueDate) < 0 && t.status !== "done"
    ).length,
    dueToday: tasksState.filter(
      (t) => daysUntil(t.dueDate) === 0 && t.status !== "done"
    ).length
  };

  const toggleDone = (id: string) =>
    setTasksState((ts) =>
      ts.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "done" ? "open" : "done" }
          : t
      )
    );

  return (
    <div className="ds-page">
      <PageHeader
        eyebrow="מרחב עבודה"
        title="משימות ותזכורות"
        subtitle="כל מה שצריך תשומת לב — מסודר לפי דחיפות ותאריך יעד."
        actions={
          <>
            <Button variant="secondary" iconStart={<Icon name="filter" size={16} />}>
              מסננים
            </Button>
            <Button iconStart={<Icon name="plus" size={16} />}>משימה חדשה</Button>
          </>
        }
      />

      <div className="ds-grid ds-grid--4">
        <StatCard label="משימות פתוחות" value={stats.open} icon="tasks" />
        <StatCard label="דחופות" value={stats.highPriority} icon="flag" tone="clay" />
        <StatCard label="באיחור" value={stats.overdue} icon="alertTriangle" tone="lavender" />
        <StatCard label="להיום" value={stats.dueToday} icon="clock" tone="info" />
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
                placeholder="חיפוש משימה, מטופל..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Segmented<StatusFilter>
              value={filter}
              onChange={setFilter}
              items={[
                { value: "all", label: "הכל" },
                { value: "open", label: "פתוחות" },
                { value: "in_progress", label: "בתהליך" },
                { value: "done", label: "הושלמו" },
                { value: "snoozed", label: "דחויות" }
              ]}
            />
          </div>
        </CardBody>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon="tasks"
              title="אין משימות פתוחות"
              description="זמן לנשום. או להוסיף משימה חדשה."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="ds-col ds-col--sm">
          {filtered.map((t) => (
            <TaskRow key={t.id} task={t} onToggle={toggleDone} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskRow({
  task,
  onToggle
}: {
  task: TaskReminder;
  onToggle: (id: string) => void;
}) {
  const days = daysUntil(task.dueDate);
  const dueLabel =
    days === 0
      ? "היום"
      : days === 1
        ? "מחר"
        : days < 0
          ? `באיחור של ${Math.abs(days)} ימים`
          : `בעוד ${days} ימים`;
  const dueColor =
    days < 0
      ? "var(--danger-700)"
      : days === 0
        ? "var(--clay-600)"
        : "var(--text-muted)";

  return (
    <Card>
      <CardBody compact>
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center"
          }}
        >
          <input
            type="checkbox"
            checked={task.status === "done"}
            onChange={() => onToggle(task.id)}
            style={{
              width: 20,
              height: 20,
              accentColor: "var(--sage-500)",
              cursor: "pointer"
            }}
          />
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: "var(--sage-100)",
              color: "var(--sage-700)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Icon name={typeIcon(task.type)} size={16} />
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
              <strong
                style={{
                  fontSize: "var(--text-base)",
                  textDecoration: task.status === "done" ? "line-through" : "none",
                  color:
                    task.status === "done"
                      ? "var(--text-muted)"
                      : "var(--text-strong)"
                }}
              >
                {task.title}
              </strong>
              <Badge tone={priorityTone(task.priority)} dot>
                {priorityLabel(task.priority)}
              </Badge>
              <Badge tone="outline">{statusLabel(task.status)}</Badge>
            </div>
            {task.notes ? (
              <p className="ds-t-sm ds-t-muted" style={{ marginBottom: 4 }}>
                {task.notes}
              </p>
            ) : null}
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
                fontSize: "var(--text-xs)",
                color: "var(--text-muted)"
              }}
            >
              {task.patientName ? (
                <span
                  style={{
                    display: "inline-flex",
                    gap: 5,
                    alignItems: "center"
                  }}
                >
                  <Avatar name={task.patientName} size="sm" />
                  {task.patientName}
                </span>
              ) : null}
              <span style={{ color: dueColor, fontWeight: 600 }}>
                <Icon
                  name="clock"
                  size={12}
                  style={{ verticalAlign: "-1px", marginInlineEnd: 4 }}
                />
                {dueLabel} · {new Date(task.dueDate).toLocaleDateString("he-IL")}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" iconEnd={<Icon name="chevronLeft" size={14} />}>
            פתיחה
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
