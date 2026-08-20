const EMAIL_KEY = "forgot-password-email";
const RESET_TOKEN_KEY = "forgot-password-reset-token";

const ResetSession = {
  setEmail(email: string) {
    sessionStorage.setItem(EMAIL_KEY, email);
  },

  getEmail() {
    return sessionStorage.getItem(EMAIL_KEY);
  },

  setResetToken(token: string) {
    sessionStorage.setItem(RESET_TOKEN_KEY, token);
  },

  getResetToken() {
    return sessionStorage.getItem(RESET_TOKEN_KEY);
  },

  clear() {
    sessionStorage.removeItem(EMAIL_KEY);
    sessionStorage.removeItem(RESET_TOKEN_KEY);
  },
};

export default ResetSession;
