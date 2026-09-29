import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenManager } from "../auth/tokenManager";

const BASE_URL = "http://192.168.100.20:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// A separate, plain instance for the refresh call itself. It must NOT go
// through the response interceptor below — otherwise a failed refresh
// would try to refresh itself and loop forever.
const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- 401 handling ---
// If several requests 401 at the same moment (common right after an access
// token expires), only the first should trigger a refresh; the rest wait
// for it and retry with the new token once it lands.

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

function subscribeTokenRefresh(callback: (token: string | null) => void) {
  pendingRequests.push(callback);
}

function onRefreshed(token: string | null) {
  pendingRequests.forEach((callback) => callback(token));
  pendingRequests = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ detail?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isAuthEndpoint =
      originalRequest?.url?.includes("/nurse/login") ||
      originalRequest?.url?.includes("/nurse/signup") ||
      originalRequest?.url?.includes("/nurse/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      const currentRefreshToken = tokenManager.getRefreshToken();

      if (!currentRefreshToken) {
        tokenManager.notifySessionExpired();
        return Promise.reject(new Error("Session expired. Please log in again."));
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (!newToken) {
              reject(new Error("Session expired. Please log in again."));
              return;
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await refreshClient.post("/nurse/refresh", {
          refresh_token: currentRefreshToken,
        });

        await tokenManager.setAccessToken(data.access_token);
        onRefreshed(data.access_token);

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(originalRequest);
      } catch {
        onRefreshed(null);
        await tokenManager.clear();
        tokenManager.notifySessionExpired();
        return Promise.reject(new Error("Session expired. Please log in again."));
      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.detail ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject(new Error(message));
  }
);