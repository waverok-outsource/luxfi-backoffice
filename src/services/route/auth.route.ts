const baseUrl = "/v1/auth";

const AuthRoute = {
  login: `${baseUrl}/login`,
  forgotPassword: `${baseUrl}/forgot-password`,
  verifyEmail: `${baseUrl}/verify-reset-password`,
  setPassword: `${baseUrl}/set-password`,
};

export default AuthRoute;
