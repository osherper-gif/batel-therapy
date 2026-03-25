import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { setToken } from "../lib/api";

export function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Batel Therapy</p>
          <h1>ניהול טיפולי</h1>
          <p className="muted">מערכת מקומית למטופלים, מפגשים ומסמכים</p>
        </div>

        <nav className="nav">
          <NavLink to="/">
            <span>דף הבית</span>
            <small>סקירה יומית</small>
          </NavLink>
          <NavLink to="/patients">
            <span>מטופלים</span>
            <small>רשימה וחיפוש</small>
          </NavLink>
          <NavLink to="/sessions">
            <span>מפגשים</span>
            <small>ניהול ותיעוד</small>
          </NavLink>
          <NavLink to="/contacts">
            <span>אנשי קשר</span>
            <small>מאגר משותף</small>
          </NavLink>
        </nav>

        <button className="secondary-button" onClick={handleLogout}>
          התנתקות
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
