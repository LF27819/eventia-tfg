export interface Artista {
  id: number;
  nombreArtistico: string;
  nombreReal?: string;
  generoMusical?: string;
  descripcion?: string;
  fechaNacimiento?: string;
  paisOrigen?: string;
  instagram?: string;
  spotify?: string;
  imagenUrl?: string;
  cache?: number;
  activo: boolean;
}