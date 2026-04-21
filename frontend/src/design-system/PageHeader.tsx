import { ReactNode } from "react";

interface Props {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, subtitle, actions, breadcrumb, className }: Props) {
  return (
    <header className={["ds-page__head", className || ""].filter(Boolean).join(" ")}>
      <div>
        {breadcrumb ? <div style={{ marginBottom: 8 }}>{breadcrumb}</div> : null}
        {eyebrow ? <div className="ds-page__eyebrow">{eyebrow}</div> : null}
        <h1 className="ds-page__title">{title}</h1>
        {subtitle ? <p className="ds-page__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="ds-page__actions">{actions}</div> : null}
    </header>
  );
}
