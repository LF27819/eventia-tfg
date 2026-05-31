export type RolUsuario = "ADMIN" | "ORGANIZADOR" | "USUARIO";

export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: string;
  rol: RolUsuario;
  activo: boolean;
  fechaRegistro: string;
}