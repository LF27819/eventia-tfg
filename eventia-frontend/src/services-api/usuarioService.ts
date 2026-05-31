import api from "./api";
import type { Usuario, RolUsuario } from "../types/usuario";

export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await api.get("/usuarios");
  return response.data;
};

export const getUsuarioById = async (id: number): Promise<Usuario> => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
};

export const updateUsuario = async (
  id: number,
  usuario: Partial<Usuario>
): Promise<Usuario> => {
  const response = await api.put(`/usuarios/${id}`, usuario);
  return response.data;
};

export const cambiarEstadoUsuario = async (
  id: number,
  activo: boolean
): Promise<Usuario> => {
  const response = await api.patch(`/usuarios/${id}/estado?activo=${activo}`);
  return response.data;
};

export const cambiarRolUsuario = async (
  id: number,
  rol: RolUsuario
): Promise<Usuario> => {
  const response = await api.patch(`/usuarios/${id}/rol?rol=${rol}`);
  return response.data;
};

export const deleteUsuario = async (id: number): Promise<void> => {
  await api.delete(`/usuarios/${id}`);
};