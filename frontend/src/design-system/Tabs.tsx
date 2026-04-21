import { ReactNode } from "react";

export interface TabItem<Value extends string = string> {
  value: Value;
  label: ReactNode;
  icon?: ReactNode;
  count?: number | string;
}

interface TabsProps<V extends string> {
  value: V;
  onChange: (value: V) => void;
  items: TabItem<V>[];
  className?: string;
}

export function Tabs<V extends string>({ value, onChange, items, className }: TabsProps<V>) {
  return (
    <div className={["ds-tabs", className || ""].filter(Boolean).join(" ")} role="tablist">
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            className={["ds-tab", active ? "ds-tab--active" : ""].filter(Boolean).join(" ")}
            onClick={() => onChange(item.value)}
            type="button"
          >
            {item.icon}
            <span>{item.label}</span>
            {item.count !== undefined ? (
              <span
                style={{
                  background: active ? "var(--sage-100)" : "var(--bg-muted)",
                  color: active ? "var(--sage-700)" : "var(--text-muted)",
                  padding: "1px 8px",
                  borderRadius: 999,
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--weight-semibold)",
                  marginInlineStart: 4
                }}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

interface SegmentedProps<V extends string> {
  value: V;
  onChange: (v: V) => void;
  items: { value: V; label: ReactNode }[];
  className?: string;
}

export function Segmented<V extends string>({ value, onChange, items, className }: SegmentedProps<V>) {
  return (
    <div className={["ds-segmented", className || ""].filter(Boolean).join(" ")} role="tablist">
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            className={[
              "ds-segmented__btn",
              active ? "ds-segmented__btn--active" : ""
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
