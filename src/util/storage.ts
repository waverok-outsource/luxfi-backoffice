import Cookies from "js-cookie";

const expireDefault = new Date(new Date().getTime() + 604800 * 1000);

const Storage = {
  setCookie(key: string, value: string, days: number | Date = expireDefault) {
    if (!value) {
      return;
    }

    Cookies.set(key, value, { expires: days, secure: false, sameSite: "strict" });
  },

  getCookie(key: string) {
    const data = Cookies.get(key);
    return data ? data : null;
  },

  removeCookie(key: string) {
    return Cookies.remove(key);
  },
};

export default Storage;
