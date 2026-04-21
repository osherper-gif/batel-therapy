import { useState, useEffect, ReactNode } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Icon, IconName } from "../design-system/Icon";
import { IconButton, Button } from "../design-system/Button";
import { SearchInput } from "../design-system/SearchInput";
import { Avatar } from "../design-system/Avatar";
import { Badge } from "../design-system/Badge";
import { setToken } from "../lib/api";

interface NavEntry {
  to: string;
  label: string;
  icon: IconName;
  count?: number | string;
}

interface NavGroup {
  label: string;
  items: NavEntry[];
}

const navGroups: NavGroup[] = [
  {
    label: "מרחב עבודה",
    items: [
      { to: "/", label: "דשבורד", icon: "dashboard" },
      { to: "/patients", label: "מטופלים", icon: "users", count: "24" },
      { to: "/sessions", label: "מפגשים", icon: "calendar" },
      { to: "/tasks", label: "משימות ותזכורות", icon: "tasks", count: "5" }
    ]
  },
  {
    label: "ארכיון",
    items: [
      { to: "/documents", label: "מרכז מסמכים", icon: "folder" },
      { to: "/reports", label: "מרכז דוחות", icon: "fileText" },
      { to: "/contacts", label: "אנשי קשר", icon: "phone" }
    ]
  },
  {
    label: "תובנות",
    items: [
      { to: "/ai", label: "תובנות AI", icon: "sparkles" }
    ]
  },
  {
    label: "הגדרות",
    items: [
      { to: "/public-pages", label: "עמודים ציבוריים", icon: "globe" },
      { to: "/notifications", label: "התראות", icon: "bell" },
      { to: "/admin", label: "ניהול ומערכת", icon: "shield" }
    ]
  }
];

export function AppShell({ user }: { user?: { name: string; role: string } }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  const currentUser = user || { name: "בטאל", role: "מטפלת באמנות" };

  return (
    <div className="app-shell">
      {drawerOpen ? (
        <div
          className="app-drawer-backdrop app-drawer-backdrop--show"
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}

      <aside className={["app-sidebar", drawerOpen ? "app-sidebar--open" : ""].filter(Boolean).join(" ")}>
        <div className="app-sidebar__brand">
          <div className="app-sidebar__logo">B</div>
          <div>
            <div className="app-sidebar__brand-title">BATEL</div>
            <div className="app-sidebar__brand-sub">ניהול תרפיה באמנות</div>
          </div>
        </div>

        <nav className="app-nav" aria-label="ניווט ראשי">
          {navGroups.map((group) => (
            <div key={group.label} style={{ display: "flex", flexDirection: "column" }}>
              <div className="app-nav__group-label">{group.label}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    ["app-nav__item", isActive ? "app-nav__item--active" : ""]
                      .filter(Boolean)
                      .join(" ")
                  }
                >
                  <span className="app-nav__item-icon">
                    <Icon name={item.icon} size={18} />
                  </span>
                  <span>{item.label}</span>
                  {item.count !== undefined ? (
                    <span className="app-nav__item-count">{item.count}</span>
                  ) : null}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="app-sidebar__footer">
          <div className="app-user">
            <Avatar name={currentUser.name} size="sm" tone="sage" />
            <div className="app-user__info">
              <div className="app-user__name">{currentUser.name}</div>
              <div className="app-user__role">{currentUser.role}</div>
            </div>
            <IconButton aria-label="הגדרות חשבון" onClick={() => navigate("/admin")}>
              <Icon name="settings" size={18} />
            </IconButton>
          </div>
          <Button
            variant="ghost"
            size="sm"
            block
            iconStart={<Icon name="logout" size={16} />}
            onClick={handleLogout}
          >
            התנתקות
          </Button>
        </div>
      </aside>

      <div className="app-main">
        <Topbar
          onToggleDrawer={() => setDrawerOpen((v) => !v)}
          onQuickAdd={() => navigate("/patients?new=1")}
        />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function Topbar({
  onToggleDrawer,
  onQuickAdd
}: {
  onToggleDrawer: () => void;
  onQuickAdd?: () => void;
}) {
  return (
    <header className="app-topbar">
      <button
        className="app-topbar__mobile-toggle"
        onClick={onToggleDrawer}
        aria-label="פתיחת תפריט"
      >
        <Icon name="menu" size={20} />
      </button>

      <div className="app-topbar__search">
        <SearchInput placeholder="חיפוש מטופלים, מפגשים, מסמכים..." />
      </div>

      <div className="app-topbar__actions">
        <Button variant="ghost" size="sm" iconStart={<Icon name="calendar" size={16} />}>
          היום
        </Button>
        <IconButton aria-label="התראות" style={{ position: "relative" }}>
          <Icon name="bell" size={18} />
          <span
            style={{
              position: "absolute",
              top: 8,
              insetInlineEnd: 8,
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "var(--clay-500)"
            }}
          />
        </IconButton>
        <Button
          variant="primary"
          size="sm"
          iconStart={<Icon name="plus" size={16} />}
          onClick={onQuickAdd}
        >
          הוספה מהירה
        </Button>
      </div>
    </header>
  );
}

// Small helper used by inner pages — pretty breadcrumb chip
export function Breadcrumb({
  items
}: {
  items: { label: string; to?: string }[];
}) {
  return (
    <nav
      style={{
        display: "flex",
        gap: 6,
        alignItems: "center",
        color: "var(--text-muted)",
        fontSize: "var(--text-sm)"
      }}
    >
      {items.map((it, i) => (
        <span
          key={i}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          {i > 0 ? <Icon name="chevronLeft" size={14} /> : null}
          {it.to ? (
            <NavLink to={it.to} style={{ color: "var(--text-muted)" }}>
              {it.label}
            </NavLink>
          ) : (
            <span style={{ color: "var(--text-strong)" }}>{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// Re-export Badge for convenience elsewhere
export { Badge };
