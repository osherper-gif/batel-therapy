import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Button } from "../../design-system/Button";
import { Field, TextInput } from "../../design-system/Field";
import { Callout } from "../../design-system/Callout";
import { apiFetch, setToken } from "../../lib/api";
import type { User } from "../../types";

interface LoginResponse {
  token: string;
  user: User;
}

export function LoginPage() {
  const [username, setUsername] = useState("batel");
  const [password, setPassword] = useState("ChangeMe123!");
  const [remember, setRemember] = useState(true);
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
        body: JSON.stringify({ username, password }),
        requiresAuth: false
      });
      setToken(response.token);
      navigate("/");
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "אירעה שגיאה בהתחברות."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "linear-gradient(135deg, var(--sage-400), var(--sage-600))",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 18
          }}
        >
          B
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "var(--text-lg)", color: "var(--text-strong)" }}>
            BATEL
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
            ניהול תרפיה באמנות
          </div>
        </div>
      </div>

      <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: 8 }}>ברוכים השבים.</h1>
      <p className="ds-t-muted" style={{ marginBottom: 28 }}>
        מערכת פנימית לניהול מטופלים, מפגשים, מסמכים ודוחות.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <Field label="שם משתמש" required>
          <TextInput
            id="username"
            value={username}
            autoFocus
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field>

        <Field label="סיסמה" required>
          <TextInput
            id="password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "var(--text-sm)",
            color: "var(--text)",
            marginTop: -4,
            marginBottom: 4,
            cursor: "pointer"
          }}
        >
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "var(--sage-500)" }}
          />
          זכור אותי במכשיר הזה
        </label>

        {error ? (
          <Callout tone="danger" title="לא הצלחנו להתחבר">
            {error}
          </Callout>
        ) : null}

        <Button type="submit" block size="lg" loading={isLoading}>
          {isLoading ? "מתחברת..." : "כניסה למרחב העבודה"}
        </Button>

        <div
          style={{
            textAlign: "center",
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
            marginTop: 16,
            lineHeight: 1.7
          }}
        >
          הגישה מאובטחת ומקומית. בכל קושי — אפשר לפנות לתמיכה.
        </div>
      </form>
    </AuthLayout>
  );
}
