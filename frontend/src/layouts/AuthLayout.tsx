import { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__form">
        <div style={{ width: "100%", maxWidth: 420 }}>{children}</div>
      </div>
      <aside className="auth-layout__side">
        <div className="auth-layout__quote">
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              fontSize: "var(--text-xs)",
              color: "var(--sage-700)",
              textTransform: "uppercase",
              marginBottom: 18
            }}
          >
            BATEL · Therapy OS
          </div>
          "האמנות פותחת חדר שקט שבו הילד יכול לפגוש את עצמו."
          <small>— בית משותף לתיעוד, להבנה, ולטיפול רגוע.</small>
        </div>
      </aside>
    </div>
  );
}
