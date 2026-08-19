import { API_URL } from "@/config";
import Storage from "@/util/storage";

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
  const accessToken = Storage.getToken();

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

axiosInstance.interceptors.request.use(onRequest, onReqErr);
apiHandler.interceptors.request.use(onRequest, onReqErr);

export default apiHandler;
