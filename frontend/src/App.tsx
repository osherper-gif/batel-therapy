import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layouts/AppShell";
import { PatientWorkspace } from "./layouts/PatientWorkspace";
import { getToken } from "./lib/api";

import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";

import { PatientsListPage } from "./pages/patients/PatientsListPage";
import { PatientOverview } from "./pages/patients/PatientOverview";
import { PatientIntake } from "./pages/patients/PatientIntake";
import { PatientTreatmentPlan } from "./pages/patients/PatientTreatmentPlan";
import { PatientTALA } from "./pages/patients/PatientTALA";
import { PatientSessionsTab } from "./pages/patients/PatientSessionsTab";
import { PatientDocumentsTab } from "./pages/patients/PatientDocumentsTab";
import { PatientReportsTab } from "./pages/patients/PatientReportsTab";
import { PatientAITab } from "./pages/patients/PatientAITab";
import { PatientTasksTab } from "./pages/patients/PatientTasksTab";
import { PatientContactsTab } from "./pages/patients/PatientContactsTab";

import { SessionsListPage } from "./pages/sessions/SessionsListPage";
import { SessionEditorPage } from "./pages/sessions/SessionEditorPage";

import { DocumentsPage } from "./pages/documents/DocumentsPage";

import { ReportsPage } from "./pages/reports/ReportsPage";
import { ReportEditorPage } from "./pages/reports/ReportEditorPage";

import { AIInsightsPage } from "./pages/ai/AIInsightsPage";
import { ContactsPage } from "./pages/contacts/ContactsPage";
import { TasksPage } from "./pages/tasks/TasksPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { NotificationsPage } from "./pages/notifications/NotificationsPage";
import { PublicPagesPage } from "./pages/publicPages/PublicPagesPage";
import { PublicSiteHubPage } from "./pages/publicSite/PublicSiteHubPage";

function ProtectedRoute() {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return <AppShell />;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/site/*" element={<PublicSiteHubPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientsListPage />} />
        <Route path="/patients/:id" element={<PatientWorkspace />}>
          <Route index element={<PatientOverview />} />
          <Route path="intake" element={<PatientIntake />} />
          <Route path="treatment" element={<PatientTreatmentPlan />} />
          <Route path="tala" element={<PatientTALA />} />
          <Route path="sessions" element={<PatientSessionsTab />} />
          <Route path="documents" element={<PatientDocumentsTab />} />
          <Route path="reports" element={<PatientReportsTab />} />
          <Route path="ai" element={<PatientAITab />} />
          <Route path="tasks" element={<PatientTasksTab />} />
          <Route path="contacts" element={<PatientContactsTab />} />
        </Route>
        <Route path="/sessions" element={<SessionsListPage />} />
        <Route path="/sessions/new" element={<SessionEditorPage />} />
        <Route path="/sessions/:id" element={<SessionEditorPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports/new" element={<ReportEditorPage />} />
        <Route path="/reports/:id" element={<ReportEditorPage />} />
        <Route path="/ai" element={<AIInsightsPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/stakeholders" element={<Navigate to="/contacts" replace />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/public-pages" element={<PublicPagesPage />} />
        <Route path="/admin" element={<SettingsPage />} />
        <Route path="/settings" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

