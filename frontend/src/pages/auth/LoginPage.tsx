import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../layouts/AuthLayout";
import { Button } from "../../design-system/Button";
import { Field, TextInput } from "../../design-system/Field";
import { Callout } from "../../design-system/Callout";
import { apiFetch, getBackendOrigin, setToken } from "../../lib/api";
import { Icon } from "../../design-system/Icon";
import type { User } from "../../types";

interface LoginResponse {
  token: string;
  user: User;
}

export function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("12345678");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const googleError = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("googleError");
  }, [location.search]);

  useEffect(() => {
    const hash = new URLSearchParams(location.hash.replace(/^#/, ""));
    const token = hash.get("googleToken");
    if (!token) return;

    setToken(token);
    navigate("/", { replace: true });
  }, [location.hash, navigate]);

  useEffect(() => {
    if (googleError) {
      setError(googleError);
    }
  }, [googleError]);

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
      setError(loginError instanceof Error ? loginError.message : "אירעה שגיאה בהתחברות.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleSignIn() {
    setError(null);
    window.location.assign(`${getBackendOrigin()}/api/auth/google/start`);
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
          <div style={{ fontWeight: 700, fontSize: "var(--text-lg)", color: "var(--text-strong)" }}>BATEL</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>ניהול תרפיה באמנות</div>
        </div>
      </div>

      <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: 8 }}>ברוכים הבאים.</h1>
      <p className="ds-t-muted" style={{ marginBottom: 28 }}>
        מערכת פנימית לניהול מטופלים, מפגשים, מסמכים ודוחות.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="שם משתמש" required>
          <TextInput
            id="username"
            value={username}
            autoFocus
            autoComplete="username"
            onChange={(event) => setUsername(event.target.value)}
          />
        </Field>

        <Field label="סיסמה" required>
          <TextInput
            id="password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
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
            onChange={(event) => setRemember(event.target.checked)}
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

        <Button
          type="button"
          block
          size="lg"
          variant="secondary"
          iconStart={<Icon name="globe" size={16} />}
          onClick={handleGoogleSignIn}
        >
          התחבר באמצעות Google
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
          הגישה מאובטחת ומקומית. בכניסה עם Google נדרש להגדיר Client ID, Client Secret ו-Redirect URI בצד השרת.
        </div>
      </form>
    </AuthLayout>
  );
}
