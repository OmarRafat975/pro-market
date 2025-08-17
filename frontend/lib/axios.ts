import axios from "axios";
import { refreshAccessToken } from "@/apis/auth";
import { useAuthStore } from "@/stores/authStore";
import { ApiError } from "@/types/auth";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Token on refresh
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh Token after Expire

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const {
          accessToken: newToken,
          name,
          role,
        } = await refreshAccessToken();
        useAuthStore.setState({ token: newToken, name, role });
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (error) {
        useAuthStore.setState({ token: "", name: "", role: "" });
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export function normalizeAxiosError(err: unknown, fallback: string): ApiError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data;

    const msg = data?.message ?? err.message ?? fallback;
    const message = Array.isArray(msg) ? msg.join(", ") : String(msg);

    const fieldErrors = data?.errors ?? data?.fieldErrors;
    return {
      message,
      status,
      fieldErrors: typeof fieldErrors === "object" ? fieldErrors : undefined,
      raw: data,
    };
  }
  return { message: fallback };
}
