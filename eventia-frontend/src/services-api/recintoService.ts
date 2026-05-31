import api from "./api";
import type { Recinto } from "../types/recinto";

export const getRecintos = async (): Promise<Recinto[]> => {
  const response = await api.get("/recintos");
  return response.data;
};

export const getRecintoById = async (id: number): Promise<Recinto> => {
  const response = await api.get(`/recintos/${id}`);
  return response.data;
};