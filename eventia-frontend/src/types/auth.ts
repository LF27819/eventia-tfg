export interface AuthResponse {
  token: string;
  email: string;
  rol: string;
  nombre: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  telefono: string;
}

export interface AuthUser {
  id?: number;
  email: string;
  rol: string;
  nombre: string;
  saldoCuenta: number;
}

export interface MeResponse {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  saldoCuenta: number;
}