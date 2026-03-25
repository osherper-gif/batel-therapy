const API_URL = "http://localhost:3000/api";
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

function isLoginPage() {
  return window.location.pathname === "/login";
}

function redirectToLogin() {
  if (!isLoginPage()) {
    window.location.assign("/login");
  }
}

export async function apiFetch<T>(path: string, init?: ApiFetchOptions): Promise<T> {
  const requiresAuth = init?.requiresAuth ?? true;
  const token = getToken();
  const headers = new Headers(init?.headers);
  const isAuthRequest = path.startsWith("/auth");

  if (!(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (requiresAuth && !token && !isAuthRequest) {
    redirectToLogin();
    throw new Error("Authentication required.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });

  if ((response.status === 401 || response.status === 403) && !isAuthRequest) {
    setToken(null);
    redirectToLogin();
    throw new Error("Authentication required.");
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
  return `http://localhost:3000/${filePath.replace(/^\/+/, "")}${token ? `?token=${encodeURIComponent(token)}` : ""}`;
}