import api from "./api";
import type { Evento } from "../types/evento";

export const getEventos = async (): Promise<Evento[]> => {
  const response = await api.get("/eventos");
  return response.data;
};

export const getEventoById = async (id: number): Promise<Evento> => {
  const response = await api.get(`/eventos/${id}`);
  return response.data;
};

export const createEvento = async (evento: Partial<Evento>): Promise<Evento> => {
  const response = await api.post("/eventos", evento);
  return response.data;
};

export const updateEvento = async (
  id: number,
  evento: Partial<Evento>
): Promise<Evento> => {
  const response = await api.put(`/eventos/${id}`, evento);
  return response.data;
};

export const deleteEvento = async (id: number): Promise<void> => {
  await api.delete(`/eventos/${id}`);
};