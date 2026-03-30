import { useState } from "react";
import AuthRoute from "../route/auth.route";
import apiHandler from "../api-handler";
import Storage from "@/util/storage";
import { toast } from "sonner";
import getErrorMessage from "../../util/get-error-message";
import { LoginType } from "@/schema/auth.schema";
import { LoginResponseType } from "@/types/auth.type";
import route from "@/util/route";

const useAuthFns = () => {
  const [loading, setLoading] = useState({
    LOGIN: false,
    LOGOUT: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [state]: value }));
  };

  const fns = {
    login: async (data: LoginType, path = route.dashboard.home) => {
      loadingFn("LOGIN", true);

      try {
        const res = await apiHandler.post<LoginResponseType>(AuthRoute.login, data);
        const accessToken = res.data.data?.token;

        if (!accessToken) {
          throw new Error("Login succeeded but token was not returned");
        }

        Storage.setCookie("token", accessToken);
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
        Storage.removeCookie("token");
        window.location.href = route.auth.login;
      };
      callback();
      loadingFn("LOGOUT", false);
    },
  };

  return { ...fns, loading };
};

export default useAuthFns;
