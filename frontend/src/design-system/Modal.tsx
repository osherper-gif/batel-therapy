import { ReactNode, useEffect } from "react";
import { Icon } from "./Icon";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number | string;
}

export function Modal({ open, onClose, title, children, footer, width }: Props) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="ds-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="ds-modal"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className="ds-card__header">
            <h3 className="ds-card__title">{title}</h3>
            <button
              onClick={onClose}
              className="ds-btn ds-btn--ghost ds-btn--sm ds-btn--icon-only"
              aria-label="סגור"
            >
              <Icon name="x" size={18} />
            </button>
          </div>
        ) : null}
        <div className="ds-card__body">{children}</div>
        {footer ? <div className="ds-card__footer">{footer}</div> : null}
      </div>
    </div>
  );
}
