export interface Recinto {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  aforo: number;
  descripcion?: string;
  imagenUrl?: string;
  latitud?: number;
  longitud?: number;
  googlePlaceId?: string;
}