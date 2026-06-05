import type { Artista } from "./artista";
import type { Recinto } from "./recinto";
import type { Usuario } from "./usuario";

export type EstadoEvento =
  | "BORRADOR"
  | "PUBLICADO"
  | "CANCELADO"
  | "FINALIZADO";

export type TipoEvento =
  | "FESTIVAL"
  | "CONCIERTO"
  | "SESION";

export interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  tipoEvento: TipoEvento;
  estado: EstadoEvento;

  fechaInicio: string;
  fechaFin: string;

  precioBase: number;
  aforoTotal: number;
  entradasDisponibles: number;
  edadMinima: number;

  imagenUrl?: string;

  recinto: Recinto;
  organizador: Usuario;

  artistas: Artista[];
}

export interface EventoRequest {
  nombre: string;
  descripcion: string;
  tipoEvento: TipoEvento;
  estado: EstadoEvento;
  fechaInicio: string;
  fechaFin: string;
  precioBase: number;
  aforoTotal: number;
  entradasDisponibles: number;
  edadMinima: number;
  imagenUrl?: string;

  recinto: {
    id: number;
  };

  organizador: {
    id: number;
  };

  artistas: {
    id: number;
  }[];
}