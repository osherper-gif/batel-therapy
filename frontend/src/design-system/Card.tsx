import { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "flat" | "raised" | "muted";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export function Card({ variant = "default", className, children, ...rest }: CardProps) {
  const cls = [
    "ds-card",
    variant !== "default" ? `ds-card--${variant}` : "",
    className || ""
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  eyebrow?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, actions, eyebrow, className }: CardHeaderProps) {
  return (
    <header className={["ds-card__header", className || ""].filter(Boolean).join(" ")}>
      <div>
        {eyebrow ? <div className="ds-t-caps" style={{ color: "var(--sage-600)" }}>{eyebrow}</div> : null}
        <h3 className="ds-card__title">{title}</h3>
        {subtitle ? <p className="ds-card__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="ds-row" style={{ gap: 8 }}>{actions}</div> : null}
    </header>
  );
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

export function CardBody({ compact, className, children, ...rest }: CardBodyProps) {
  const cls = ["ds-card__body", compact ? "ds-card__body--compact" : "", className || ""]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <footer className={["ds-card__footer", className || ""].filter(Boolean).join(" ")} {...rest}>
      {children}
    </footer>
  );
}
