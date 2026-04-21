import { ReactNode } from "react";
import { Icon, IconName } from "./Icon";

interface Props {
  icon?: IconName | ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon = "sparkles", title, description, action, className }: Props) {
  const iconNode =
    typeof icon === "string" ? <Icon name={icon as IconName} size={28} /> : icon;
  return (
    <div className={["ds-empty", className || ""].filter(Boolean).join(" ")}>
      <div className="ds-empty__icon">{iconNode}</div>
      <h3 className="ds-empty__title">{title}</h3>
      {description ? <p className="ds-empty__desc">{description}</p> : null}
      {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
    </div>
  );
}
