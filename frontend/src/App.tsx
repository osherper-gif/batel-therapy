import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { getToken } from "./lib/api";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { PatientDetailsPage } from "./pages/PatientDetailsPage";
import { PatientsPage } from "./pages/PatientsPage";
import { SessionsPage } from "./pages/SessionsPage";
import { StakeholdersPage } from "./pages/StakeholdersPage";

function ProtectedRoute() {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/:id" element={<PatientDetailsPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/contacts" element={<StakeholdersPage />} />
        <Route path="/stakeholders" element={<StakeholdersPage />} />
      </Route>
    </Routes>
  );
}
