import api from "./api";
import type { Artista } from "../types/artista";

export const getArtistas = async (): Promise<Artista[]> => {
  const response = await api.get("/artistas");
  return response.data;
};

export const getArtistaById = async (id: number): Promise<Artista> => {
  const response = await api.get(`/artistas/${id}`);
  return response.data;
};