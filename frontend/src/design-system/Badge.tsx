import { HTMLAttributes, ReactNode } from "react";

type Tone =
  | "neutral"
  | "sage"
  | "clay"
  | "lavender"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted"
  | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
  icon?: ReactNode;
}

const toneClass: Record<Tone, string> = {
  neutral: "",
  sage: "ds-badge--sage",
  clay: "ds-badge--clay",
  lavender: "ds-badge--lavender",
  success: "ds-badge--success",
  warning: "ds-badge--warning",
  danger: "ds-badge--danger",
  info: "ds-badge--info",
  muted: "ds-badge--muted",
  outline: "ds-badge--outline"
};

export function Badge({ tone = "neutral", dot, icon, children, className, ...rest }: BadgeProps) {
  const cls = ["ds-badge", toneClass[tone], className || ""].filter(Boolean).join(" ");
  return (
    <span className={cls} {...rest}>
      {dot ? <span className="ds-badge__dot" /> : null}
      {icon}
      {children}
    </span>
  );
}
