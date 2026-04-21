import { ReactNode } from "react";

export interface TimelineItem {
  id: string;
  title: ReactNode;
  meta?: ReactNode;
  body?: ReactNode;
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="ds-timeline">
      {items.map((item) => (
        <div className="ds-timeline__item" key={item.id}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 12,
              marginBottom: 4
            }}
          >
            <strong style={{ color: "var(--text-strong)" }}>{item.title}</strong>
            {item.meta ? (
              <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                {item.meta}
              </span>
            ) : null}
          </div>
          {item.body ? (
            <div style={{ fontSize: "var(--text-sm)", color: "var(--text)" }}>{item.body}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
