import Cookies from "js-cookie";

const TOKEN_KEY = "token";
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

  clearAuth() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
    }

    Cookies.remove(SESSION_COOKIE, { path: "/" });
    Cookies.remove(TOKEN_KEY, { path: "/" });
  },
};

export default Storage;
