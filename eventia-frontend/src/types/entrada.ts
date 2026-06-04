import type { Evento } from "./evento";
import type { Reserva } from "./reserva";

export type EstadoEntrada =
  | "VALIDA"
  | "USADA"
  | "CANCELADA";

export type TipoEntrada =
  | "GENERAL"
  | "VIP"
  | "BACKSTAGE";

export interface Entrada {
  id: number;

  codigoQr: string;
  pdfUrl?: string | null;

  tipoEntrada: TipoEntrada;
  precio: number;

  estado: EstadoEntrada;

  fechaGeneracion: string;
  fechaUso?: string | null;

  evento: Evento;
  reserva?: Reserva;
}