const isLocalDev = window.location.hostname === "localhost";
const API_URL = isLocalDev ? "http://localhost:4000/api" : "/api";
const APP_URL = isLocalDev ? "http://localhost:4000" : "";
const TOKEN_KEY = "batel-admin-token";

interface ApiFetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export function getToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
}

function redirectToLogin() {
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

export async function apiFetch<T>(path: string, init?: ApiFetchOptions): Promise<T> {
  const requiresAuth = init?.requiresAuth ?? true;
  const token = getToken();
  const headers = new Headers(init?.headers);

  if (requiresAuth && !token) {
    redirectToLogin();
    throw new Error("יש להתחבר כדי להמשיך.");
  }

  if (!(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });

  if (response.status === 401 || response.status === 403) {
    setToken(null);
    redirectToLogin();
    throw new Error("ההתחברות פגה. צריך להיכנס שוב.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed." }));
    throw new Error(error.message || "Request failed.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getFileUrl(filePath: string) {
  const token = getToken();
  return `${APP_URL}/${filePath.replace(/^\/+/, "")}${token ? `?token=${encodeURIComponent(token)}` : ""}`;
}
