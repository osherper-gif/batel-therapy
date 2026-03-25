import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusMessage } from "../components/StatusMessage";
import { apiFetch, setToken } from "../lib/api";
import type { User } from "../types";

interface LoginResponse {
  token: string;
  user: User;
}

export function LoginPage() {
  const [username, setUsername] = useState("batel");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError(null);
      const response = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });
      setToken(response.token);
      navigate("/");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Phase 1</p>
        <h1>כניסה למערכת Batel</h1>
        <p className="muted">מערכת פנימית לניהול מטופלים, מפגשים, מסמכים ותמונות.</p>

        <label>
          שם משתמש
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>

        <label>
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error ? <StatusMessage message={error} tone="error" /> : null}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "מתחבר..." : "כניסה"}
        </button>
      </form>
    </div>
  );
}
