import type { RolUsuario } from "./usuario";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
  fechaNacimiento?: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  rol: RolUsuario;
  nombre: string;
}