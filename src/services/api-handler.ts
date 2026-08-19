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

let isRedirectingToLogout = false;

function isAuthPage(pathname: string) {
  return (
    pathname.includes(route.auth.login) ||
    pathname.includes(route.auth.logout) ||
    pathname.includes(route.auth.reset)
  );
}

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
  const isBrowser = typeof window !== "undefined";

  if (
    status === 401 &&
    isBrowser &&
    !isRedirectingToLogout &&
    !isAuthPage(window.location.pathname)
  ) {
    isRedirectingToLogout = true;
    window.location.href = route.auth.logout;
  }

  return Promise.reject(error);
}

axiosInstance.interceptors.request.use(onRequest, onReqErr);
apiHandler.interceptors.request.use(onRequest, onReqErr);
apiHandler.interceptors.response.use((response) => response, onResError);

export default apiHandler;
