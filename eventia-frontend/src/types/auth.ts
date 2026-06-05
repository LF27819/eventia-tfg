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
  fechaNacimiento: string;
}

export interface AuthUser {
  id: number;
  email: string;
  rol: RolUsuario;
  nombre: string;
  apellidos?: string;
  telefono?: string;
  fechaNacimiento?: string;
  activo?: boolean;
}

export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  rol: RolUsuario;
  nombre: string;
}

export interface MeResponse {
  id: number;
  email: string;
  rol: RolUsuario;
  nombre: string;
  token?: string | null;
}