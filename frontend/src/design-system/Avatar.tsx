import { HTMLAttributes } from "react";

type Size = "sm" | "md" | "lg" | "xl";
type Tone = "sage" | "clay" | "lavender";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string;
  size?: Size;
  tone?: Tone;
}

export function initialsFor(name?: string) {
  if (!name) return "•";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "•";
}

// Deterministic tone from a name — keeps avatars colorful but stable.
export function toneFor(name?: string): Tone {
  if (!name) return "sage";
  const sum = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return (["sage", "clay", "lavender"] as const)[sum % 3];
}

export function Avatar({
  name,
  src,
  size = "md",
  tone,
  className,
  ...rest
}: AvatarProps) {
  const resolvedTone = tone || toneFor(name);
  const sizeCls = size !== "md" ? `ds-avatar--${size}` : "";
  const toneCls = resolvedTone !== "sage" ? `ds-avatar--${resolvedTone}` : "";
  const cls = ["ds-avatar", sizeCls, toneCls, className || ""].filter(Boolean).join(" ");
  return (
    <div className={cls} aria-label={name} {...rest}>
      {src ? (
        <img
          src={src}
          alt={name || ""}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span>{initialsFor(name)}</span>
      )}
    </div>
  );
}
