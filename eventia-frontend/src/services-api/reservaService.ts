import api from "./api";
import type { Reserva, EstadoReserva } from "../types/reserva";

export interface CrearReservaRequest {
  cantidadEntradas: number;
  usuario: {
    id: number;
  };
  evento: {
    id: number;
  };
}

export const getReservas = async (): Promise<Reserva[]> => {
  const response = await api.get("/reservas");
  return response.data;
};

export const getReservaById = async (id: number): Promise<Reserva> => {
  const response = await api.get(`/reservas/${id}`);
  return response.data;
};

export const getReservasByUsuario = async (
  usuarioId: number
): Promise<Reserva[]> => {
  const response = await api.get(`/reservas?usuarioId=${usuarioId}`);
  return response.data;
};

export const getReservasByEvento = async (
  eventoId: number
): Promise<Reserva[]> => {
  const response = await api.get(`/reservas?eventoId=${eventoId}`);
  return response.data;
};

export const getReservasByEstado = async (
  estado: EstadoReserva
): Promise<Reserva[]> => {
  const response = await api.get(`/reservas?estado=${estado}`);
  return response.data;
};

export const createReserva = async (
  reserva: CrearReservaRequest
): Promise<Reserva> => {
  const response = await api.post("/reservas", reserva);
  return response.data;
};

export const confirmarReserva = async (id: number): Promise<Reserva> => {
  const response = await api.patch(`/reservas/${id}/confirmar`);
  return response.data;
};

export const cancelarReserva = async (id: number): Promise<Reserva> => {
  const response = await api.patch(`/reservas/${id}/cancelar`);
  return response.data;
};

export const deleteReserva = async (id: number): Promise<void> => {
  await api.delete(`/reservas/${id}`);
};