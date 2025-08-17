import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "@/apis/auth";
import { ApiError, LoginDataType, RegisterDataType } from "@/types/auth";
import { create } from "zustand";
import async from "../app/page";

type Status = "idle" | "loading" | "authenticated" | "error";
type Role = "user" | "admin" | "";
type Response = { accessToken: string; name: string; role: Role };

interface AuthStore {
  token: string;
  name: string;
  role: Role;
  status: Status;
  error?: ApiError;

  register: (formData: RegisterDataType) => Promise<void>;
  login: (formData: LoginDataType) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: "",
  name: "",
  role: "",
  status: "idle",
  error: undefined,
  async register(formData) {
    set({ status: "loading", error: undefined });
    try {
      const data: Response = await registerUser(formData);
      set({
        token: data.accessToken,
        name: data.name,
        role: data.role,
        status: "authenticated",
        error: undefined,
      });
    } catch (e) {
      set({ status: "error", error: e as ApiError });
    }
  },

  async login(formData) {
    set({ status: "loading", error: undefined });
    try {
      const data: Response = await loginUser(formData);
      set({
        token: data.accessToken,
        name: data.name,
        role: data.role,
        status: "authenticated",
        error: undefined,
      });
    } catch (e) {
      set({ status: "error", error: e as ApiError });
    }
  },

  async checkAuth() {
    set({ status: "loading", error: undefined });
    try {
      const data: Response = await refreshAccessToken();
      set({
        token: data.accessToken,
        name: data.name,
        role: data.role,
        status: "authenticated",
        error: undefined,
      });
    } catch (e) {
      set({ status: "error", error: e as ApiError });
    }
  },

  async logout() {
    await logoutUser();
    set({ token: "", name: "", role: "", status: "idle", error: undefined });
  },
}));
