import { ReactNode } from "react";
import { Icon, IconName } from "./Icon";

type Tone = "sage" | "clay" | "lavender" | "info";

interface Props {
  label: ReactNode;
  value: ReactNode;
  icon?: IconName;
  tone?: Tone;
  delta?: { value: ReactNode; direction: "up" | "down" | "flat" };
  hint?: ReactNode;
  onClick?: () => void;
}

export function StatCard({ label, value, icon, tone = "sage", delta, hint, onClick }: Props) {
  const toneClass = tone !== "sage" ? `ds-stat--${tone}` : "";
  const clickable = onClick
    ? { role: "button", tabIndex: 0, onClick, style: { cursor: "pointer" } }
    : {};
  return (
    <div className={["ds-stat", toneClass].filter(Boolean).join(" ")} {...clickable}>
      {icon ? (
        <div className="ds-stat__icon">
          <Icon name={icon} size={20} />
        </div>
      ) : null}
      <div className="ds-stat__label">{label}</div>
      <div className="ds-stat__value">{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {delta ? (
          <span
            className={[
              "ds-stat__delta",
              delta.direction === "up"
                ? "ds-stat__delta--up"
                : delta.direction === "down"
                  ? "ds-stat__delta--down"
                  : ""
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {delta.direction === "up" ? "↗" : delta.direction === "down" ? "↘" : "→"}{" "}
            {delta.value}
          </span>
        ) : null}
        {hint ? (
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{hint}</span>
        ) : null}
      </div>
    </div>
  );
}
