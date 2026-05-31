import type { RolUsuario } from "../types/usuario";

export const esAdmin = (rol?: RolUsuario | string | null): boolean =>
  rol === "ADMIN";

export const esOrganizador = (rol?: RolUsuario | string | null): boolean =>
  rol === "ORGANIZADOR";

export const esUsuario = (rol?: RolUsuario | string | null): boolean =>
  rol === "USUARIO";