import Cookies from "js-cookie";
import type { StoredAuthUserType } from "@/types/auth.type";

const TOKEN_KEY = "token";
const USER_KEY = "auth-user";
const SESSION_COOKIE = "auth-session";

function cookieOptions(): Cookies.CookieAttributes {
  return {
    expires: 7,
    path: "/",
    sameSite: "lax",
    secure: typeof window !== "undefined" && window.location.protocol === "https:",
  };
}

const Storage = {
  setToken(token: string) {
    if (!token || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(TOKEN_KEY, token);
    Cookies.set(SESSION_COOKIE, "1", cookieOptions());
  },

  getToken() {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(TOKEN_KEY);
  },

  setUser(user: StoredAuthUserType) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser(): StoredAuthUserType | null {
    if (typeof window === "undefined") {
      return null;
    }

    const raw = window.localStorage.getItem(USER_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as StoredAuthUserType;
    } catch {
      return null;
    }
  },

  clearAuth() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    }

    Cookies.remove(SESSION_COOKIE, { path: "/" });
    Cookies.remove(TOKEN_KEY, { path: "/" });
  },
};

export default Storage;
