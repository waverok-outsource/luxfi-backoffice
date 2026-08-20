import { useState } from "react";
import AuthRoute from "../route/auth.route";
import apiHandler from "../api-handler";
import Storage from "@/util/storage";
import { toast } from "sonner";
import getErrorMessage from "../../util/get-error-message";
import {
  ForgotPasswordType,
  LoginType,
  ResetSchemaType,
  VerifyResetPinType,
} from "@/schema/auth.schema";
import {
  LoginResponseType,
  SetPasswordResponseType,
  VerifyResetPinResponseType,
} from "@/types/auth.type";
import ResetSession from "@/module/auth/shared/reset-session";
import route from "@/util/route";

function extractResetToken(payload: VerifyResetPinResponseType): string | null {
  const candidates: unknown[] = [
    payload.data,
    typeof payload.data === "object" && payload.data !== null
      ? payload.data.resetToken
      : undefined,
    typeof payload.data === "object" && payload.data !== null ? payload.data.token : undefined,
    (payload as VerifyResetPinResponseType & { resetToken?: string }).resetToken,
    (payload as VerifyResetPinResponseType & { token?: string }).token,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.length > 0) {
      return candidate;
    }
  }

  return null;
}

const useAuthFns = () => {
  const [loading, setLoading] = useState({
    LOGIN: false,
    LOGOUT: false,
    FORGOT_PASSWORD: false,
    VERIFY_RESET_PIN: false,
    SET_PASSWORD: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    login: async (data: LoginType, path = route.dashboard.home) => {
      loadingFn("LOGIN", true);

      try {
        const res = await apiHandler.post<LoginResponseType>(AuthRoute.login, data);
        const user = res.data.data;
        const accessToken = user?.token;

        if (!user || !accessToken) {
          throw new Error("Login succeeded but token was not returned");
        }

        const { token, ...profile } = user;
        Storage.setToken(token);
        Storage.setUser(profile);
        toast.success("Login successful!");
        window.location.href = path;
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("LOGIN", false);
      }
    },

    logout: async () => {
      loadingFn("LOGOUT", true);

      const callback = () => {
        Storage.clearAuth();
        window.location.href = route.auth.login;
      };
      callback();
      loadingFn("LOGOUT", false);
    },

    forgotPassword: async (data: ForgotPasswordType, callback?: () => void) => {
      loadingFn("FORGOT_PASSWORD", true);

      try {
        await apiHandler.post(AuthRoute.forgotPassword, data);
        ResetSession.setEmail(data.email.trim());
        toast.success("A reset PIN has been sent to your email.");
        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("FORGOT_PASSWORD", false);
      }
    },

    verifyResetPin: async (data: VerifyResetPinType, callback?: () => void) => {
      loadingFn("VERIFY_RESET_PIN", true);

      try {
        const email = ResetSession.getEmail();

        if (!email) {
          throw new Error("Enter your email to request a reset PIN first.");
        }

        const res = await apiHandler.post<VerifyResetPinResponseType>(AuthRoute.verifyEmail, {
          identity: email,
          otp: data.pin,
        });
        const resetToken = extractResetToken(res.data);

        if (!resetToken) {
          throw new Error("PIN verified but reset token was not returned");
        }

        ResetSession.setResetToken(resetToken);
        toast.success("PIN verified. Set your new password.");
        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("VERIFY_RESET_PIN", false);
      }
    },

    setPassword: async (data: ResetSchemaType, callback?: () => void) => {
      loadingFn("SET_PASSWORD", true);

      try {
        const resetToken = ResetSession.getResetToken();

        if (!resetToken) {
          throw new Error("Verify your reset PIN before setting a new password.");
        }

        await apiHandler.post<SetPasswordResponseType>(AuthRoute.setPassword, {
          resetToken,
          password: data.password,
          confirmPassword: data.confirmPassword,
        });

        ResetSession.clear();
        toast.success("Password reset successful. Please log in.");
        callback?.();
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("SET_PASSWORD", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useAuthFns;
