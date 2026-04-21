import { CSSProperties } from "react";

interface Props {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  radius?: CSSProperties["borderRadius"];
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ width = "100%", height = 16, radius = 8, className, style }: Props) {
  return (
    <div
      className={["ds-skeleton", className || ""].filter(Boolean).join(" ")}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden
    />
  );
}

interface SkeletonRowsProps {
  count?: number;
  height?: CSSProperties["height"];
  gap?: number;
}

export function SkeletonRows({ count = 3, height = 20, gap = 12 }: SkeletonRowsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height={height} />
      ))}
    </div>
  );
}
