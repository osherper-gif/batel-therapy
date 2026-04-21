type Tone = "sage" | "clay" | "warning" | "danger";

interface Props {
  value: number; // 0-100
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function Progress({ value, tone = "sage", size = "md", label }: Props) {
  const toneClass = tone !== "sage" ? `ds-progress--${tone}` : "";
  const height = size === "sm" ? 5 : size === "lg" ? 12 : 8;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)"
          }}
        >
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      ) : null}
      <div
        className={["ds-progress", toneClass].filter(Boolean).join(" ")}
        style={{ height }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="ds-progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
