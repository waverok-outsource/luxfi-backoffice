import Cookies from "js-cookie";

const Storage = {
  setCookie(key: string, value: string, days: number = 7) {
    if (!value) {
      return;
    }

    Cookies.set(key, value, {
      expires: days,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  },

  getCookie(key: string) {
    const data = Cookies.get(key);
    return data ? data : null;
  },

  removeCookie(key: string) {
    return Cookies.remove(key, { path: "/" });
  },
};

export default Storage;
