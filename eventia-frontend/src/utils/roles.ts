export const ROLES = {
  ADMIN: "ADMIN",
  ORGANIZADOR: "ORGANIZADOR",
  CLIENTE: "CLIENTE",
} as const;

export const esAdmin = (rol?: string): boolean => rol === ROLES.ADMIN;

export const esOrganizador = (rol?: string): boolean =>
  rol === ROLES.ORGANIZADOR;

export const esCliente = (rol?: string): boolean => rol === ROLES.CLIENTE;