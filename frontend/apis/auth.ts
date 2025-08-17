import api, { normalizeAxiosError } from "@/lib/axios";
import { LoginDataType, RegisterDataType } from "@/types/auth";

export const registerUser = async (regsterData: RegisterDataType) => {
  try {
    const response = await api.post("/auth/register", regsterData);
    return response.data;
  } catch (error: any) {
    throw normalizeAxiosError(error, "Failed to register");
  }
};

export const loginUser = async (loginData: LoginDataType) => {
  try {
    const response = await api.post("/auth/login", loginData);
    return response.data;
  } catch (error: any) {
    throw normalizeAxiosError(error, "Failed to login");
  }
};

export const logoutUser = async () => {
  try {
    await api.get("/auth/logout");
  } catch (error: any) {
    throw normalizeAxiosError(error, "Failed to login");
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await api.get("/auth/refresh");
    return response.data;
  } catch (error: any) {
    throw normalizeAxiosError(error, "Failed to refresh the token");
  }
};
