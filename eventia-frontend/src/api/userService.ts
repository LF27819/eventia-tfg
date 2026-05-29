import api from "./api";
import { getToken } from "./authService";
import type { AuthUser } from "../types/auth";

export const addSaldo = async (
  userId: number,
  cantidad: number
): Promise<AuthUser> => {
  const token = getToken();

  const response = await api.patch(
    `/usuarios/${userId}/saldo`,
    { cantidad },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};