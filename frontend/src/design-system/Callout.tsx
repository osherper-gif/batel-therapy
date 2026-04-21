import { ReactNode } from "react";
import { Icon, IconName } from "./Icon";

type Tone = "sage" | "clay" | "warning" | "danger" | "info" | "lavender";

interface Props {
  tone?: Tone;
  title?: ReactNode;
  icon?: IconName;
  children: ReactNode;
  className?: string;
}

const iconByTone: Record<Tone, IconName> = {
  sage: "sparkles",
  clay: "heart",
  warning: "alertTriangle",
  danger: "alertCircle",
  info: "info",
  lavender: "sparkles"
};

export function Callout({ tone = "sage", title, icon, children, className }: Props) {
  const iconName = icon ?? iconByTone[tone];
  return (
    <div
      className={["ds-callout", `ds-callout--${tone}`, className || ""]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="ds-callout__icon">
        <Icon name={iconName} size={20} />
      </span>
      <div className="ds-callout__body">
        {title ? <div className="ds-callout__title">{title}</div> : null}
        {children}
      </div>
    </div>
  );
}
