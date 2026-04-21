import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useParams,
  useLocation
} from "react-router-dom";
import { Icon, IconName } from "../design-system/Icon";
import { Button, IconButton } from "../design-system/Button";
import { Avatar } from "../design-system/Avatar";
import { Badge } from "../design-system/Badge";
import { Skeleton } from "../design-system/Skeleton";
import { Breadcrumb } from "./AppShell";
import { getPatient } from "../services/patientsService";
import type { PatientDetails } from "../types";

interface TabDef {
  to: string;
  label: string;
  icon: IconName;
}

const tabs: TabDef[] = [
  { to: "", label: "סקירה", icon: "dashboard" },
  { to: "intake", label: "אינטייק", icon: "clipboard" },
  { to: "treatment", label: "תכנית טיפול", icon: "target" },
  { to: "tala", label: "TALA", icon: "palette" },
  { to: "sessions", label: "מפגשים", icon: "calendar" },
  { to: "documents", label: "מסמכים", icon: "folder" },
  { to: "reports", label: "דוחות", icon: "fileText" },
  { to: "ai", label: "תובנות AI", icon: "sparkles" },
  { to: "tasks", label: "משימות", icon: "tasks" },
  { to: "contacts", label: "אנשי קשר", icon: "users" }
];

interface PatientContextValue {
  patient: PatientDetails;
}

export function PatientWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    getPatient(id)
      .then((p) => alive && setPatient(p))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="patient-workspace">
        <Skeleton height={140} />
        <Skeleton height={52} />
        <Skeleton height={400} />
      </div>
    );
  }
  if (!patient) {
    return (
      <div className="patient-workspace">
        <p>המטופל לא נמצא.</p>
      </div>
    );
  }

  const statusTone =
    patient.status === "active"
      ? "success"
      : patient.status === "onboarding"
        ? "info"
        : "muted";

  return (
    <div className="patient-workspace">
      <Breadcrumb
        items={[
          { label: "מטופלים", to: "/patients" },
          { label: patient.fullName }
        ]}
      />

      <div className="patient-header">
        <div className="patient-header__main">
          <Avatar name={patient.fullName} size="xl" />
          <div className="patient-header__body">
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <h1 className="patient-header__name">{patient.fullName}</h1>
              <Badge tone={statusTone as "success" | "info" | "muted"}>
                {statusLabel(patient.status)}
              </Badge>
            </div>
            <div className="patient-header__meta">
              <span>
                <Icon name="user" size={14} style={{ verticalAlign: "-2px" }} /> גיל {patient.age}
              </span>
              <span>·</span>
              <span>
                <Icon name="compass" size={14} style={{ verticalAlign: "-2px" }} />{" "}
                {patient.treatmentFramework}
              </span>
              {patient.educationalFramework ? (
                <>
                  <span>·</span>
                  <span>
                    <Icon name="bookmark" size={14} style={{ verticalAlign: "-2px" }} />{" "}
                    {patient.educationalFramework}
                  </span>
                </>
              ) : null}
              <span>·</span>
              <span>
                עודכן{" "}
                {new Date(patient.updatedAt).toLocaleDateString("he-IL", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>
          </div>
        </div>
        <div className="patient-header__actions">
          <Button
            variant="secondary"
            iconStart={<Icon name="fileText" size={16} />}
            onClick={() => navigate(`/patients/${patient.id}/reports`)}
          >
            הפקת דוח
          </Button>
          <Button
            iconStart={<Icon name="plus" size={16} />}
            onClick={() =>
              navigate(`/sessions/new?patientId=${patient.id}`)
            }
          >
            מפגש חדש
          </Button>
          <IconButton aria-label="עוד">
            <Icon name="more" size={18} />
          </IconButton>
        </div>
      </div>

      <nav className="patient-tabs-wrap">
        <div className="ds-tabs" role="tablist">
          {tabs.map((t) => {
            const fullPath = `/patients/${patient.id}${t.to ? `/${t.to}` : ""}`;
            const isActive = t.to === ""
              ? location.pathname === `/patients/${patient.id}`
              : location.pathname.startsWith(fullPath);
            return (
              <NavLink
                key={t.to}
                to={fullPath}
                end={t.to === ""}
                className={["ds-tab", isActive ? "ds-tab--active" : ""].filter(Boolean).join(" ")}
                role="tab"
              >
                <Icon name={t.icon} size={16} />
                {t.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <Outlet context={{ patient } satisfies PatientContextValue} />
    </div>
  );
}

function statusLabel(s: string) {
  return s === "active" ? "פעיל" : s === "onboarding" ? "בהצטרפות" : s === "on_hold" ? "מוקפא" : s;
}

// Helper so sub-pages can type the outlet context
import { useOutletContext } from "react-router-dom";
export function usePatientContext() {
  return useOutletContext<PatientContextValue>();
}
