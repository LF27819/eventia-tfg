import api from "./api";
import type { Event } from "../types/event";

export const getEventos = async (): Promise<Event[]> => {
  const response = await api.get("/eventos");
  return response.data;
};

export const getEventoById = async (id: string): Promise<Event> => {
  const response = await api.get(`/eventos/${id}`);
  return response.data;
};