import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger" | "subtle";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  loading?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: "ds-btn--primary",
  secondary: "ds-btn--secondary",
  ghost: "ds-btn--ghost",
  accent: "ds-btn--accent",
  danger: "ds-btn--danger",
  subtle: "ds-btn--subtle"
};

const sizeClass: Record<Size, string> = {
  sm: "ds-btn--sm",
  md: "",
  lg: "ds-btn--lg"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    block,
    className,
    iconStart,
    iconEnd,
    loading,
    disabled,
    children,
    ...rest
  },
  ref
) {
  const classes = [
    "ds-btn",
    variantClass[variant],
    sizeClass[size],
    block ? "ds-btn--block" : "",
    className || ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} className={classes} disabled={disabled || loading} {...rest}>
      {loading ? (
        <span className="ds-btn__spinner" aria-hidden />
      ) : (
        iconStart
      )}
      {children}
      {iconEnd}
    </button>
  );
});

export function IconButton({
  children,
  className,
  ...rest
}: Omit<ButtonProps, "children"> & { children: ReactNode }) {
  const cls = ["ds-btn--icon-only", className || ""].filter(Boolean).join(" ");
  return (
    <Button variant="ghost" size="md" className={cls} {...rest}>
      {children}
    </Button>
  );
}
