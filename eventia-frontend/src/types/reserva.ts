import type { Evento } from "./evento";
import type { Usuario } from "./usuario";
import type { Entrada } from "./entrada";

export type EstadoReserva =
  | "PENDIENTE"
  | "CONFIRMADA"
  | "CANCELADA";

export interface Reserva {
  id: number;

  fechaReserva: string;

  cantidadEntradas: number;
  precioTotal: number;

  estado: EstadoReserva;
  codigoReserva: string;

  usuario: Usuario;
  evento: Evento;

  entradas?: Entrada[];
}