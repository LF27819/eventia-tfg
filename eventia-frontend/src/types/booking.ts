import type { Event } from "./event";

export interface BookingUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface Booking {
  id: number;
  fechaReserva: string;
  cantidadEntradas: number;
  precioTotal: number;
  metodoPago: string;
  codigoReserva: string;
  confirmada: boolean;
  usuario: BookingUser;
  evento: Event;
}