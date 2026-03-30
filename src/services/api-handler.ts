import { API_URL } from "@/config";
import Storage from "@/util/storage";
import route from "@/util/route";

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const defaultHeaders = Object.freeze({
  Accept: "application/json",
  "Content-Type": "application/json",
});

const createApiClient = () =>
  axios.create({
    baseURL: API_URL,
    headers: defaultHeaders,
  });

export const axiosInstance = createApiClient();

const apiHandler = createApiClient();

function setAuthorizationHeader(config: InternalAxiosRequestConfig) {
  const accessToken = Storage.getCookie("token");

  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
    return config;
  }

  config.headers.delete("Authorization");
  return config;
}

function onRequest(config: InternalAxiosRequestConfig) {
  return setAuthorizationHeader(config);
}

async function onReqErr(error: AxiosError): Promise<AxiosError> {
  return Promise.reject(error);
}

async function onResError(error: AxiosError): Promise<AxiosError> {
  const status = error.response?.status;
  const isAuthError = status === 401 || status === 403;
  const isBrowser = typeof window !== "undefined";

  if (isAuthError && isBrowser && !window.location.pathname.includes(route.auth.login)) {
    window.location.href = route.auth.logout;
  }

  return Promise.reject(error);
}

axiosInstance.interceptors.request.use(onRequest, onReqErr);
apiHandler.interceptors.request.use(onRequest, onReqErr);
apiHandler.interceptors.response.use((response) => response, onResError);

export default apiHandler;
