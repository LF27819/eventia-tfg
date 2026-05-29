import api from "./api";
import type { AuthResponse, LoginRequest, MeResponse, RegisterRequest} from "../types/auth";

const TOKEN_KEY = "eventia_token";

export const loginRequest = async (
  payload: LoginRequest
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const registerRequest = async (
  payload: RegisterRequest
): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const meRequest = async (token: string): Promise<MeResponse> => {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};