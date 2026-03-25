import { SectionCard } from "../components/SectionCard";
import { StatusMessage } from "../components/StatusMessage";
import { useAsync } from "../hooks/useAsync";
import { apiFetch } from "../lib/api";
import type { DashboardPayload } from "../types";

export function DashboardPage() {
  const { data, error, isLoading } = useAsync(() => apiFetch<DashboardPayload>("/dashboard"));

  if (isLoading) {
    return <StatusMessage message="טוען נתוני דשבורד..." />;
  }

  if (error || !data) {
    return <StatusMessage message={error || "Failed to load dashboard."} tone="error" />;
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">סקירה</p>
          <h1>דשבורד עבודה</h1>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span>מטופלים</span>
          <strong>{data.stats.patientsCount}</strong>
        </div>
        <div className="stat-card">
          <span>מפגשים</span>
          <strong>{data.stats.sessionsCount}</strong>
        </div>
        <div className="stat-card">
          <span>גורמי קשר</span>
          <strong>{data.stats.stakeholdersCount}</strong>
        </div>
        <div className="stat-card">
          <span>מסמכים</span>
          <strong>{data.stats.documentsCount}</strong>
        </div>
        <div className="stat-card">
          <span>תמונות</span>
          <strong>{data.stats.imagesCount}</strong>
        </div>
      </section>

      <div className="two-column">
        <SectionCard title="מפגשים אחרונים">
          {data.recentSessions.map((session) => (
            <div className="list-row" key={session.id}>
              <div>
                <strong>{session.patient?.fullName}</strong>
                <p className="muted">{new Date(session.date).toLocaleDateString("he-IL")}</p>
              </div>
              <span>{session.sessionType}</span>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="מטופלים שעודכנו לאחרונה">
          {data.recentPatients.map((patient) => (
            <div className="list-row" key={patient.id}>
              <div>
                <strong>{patient.fullName}</strong>
                <p className="muted">{patient.status}</p>
              </div>
              <span>{patient.treatmentFramework}</span>
            </div>
          ))}
        </SectionCard>
      </div>

      <SectionCard
        title="הפרדה בין מידע מקורי ל-AI עתידי"
        subtitle="בשלב זה המערכת שומרת רק מידע מקורי ידני."
      >
        <div className="split-note">
          <div>
            <h3>מידע מקורי</h3>
            <p>כל השדות הקליניים, המסמכים והתמונות נשמרים כמקור עבודה ראשי.</p>
          </div>
          <div>
            <h3>טיוטות AI בעתיד</h3>
            <p>ניתן להוסיף בעתיד אזור נפרד לסיכומים והמלצות בלי לדרוס נתונים מקוריים.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
