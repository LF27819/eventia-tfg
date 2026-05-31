import api from "./api";
import type { Entrada, EstadoEntrada, TipoEntrada } from "../types/entrada";

export const getEntradas = async (): Promise<Entrada[]> => {
  const response = await api.get("/entradas");
  return response.data;
};

export const getEntradaById = async (id: number): Promise<Entrada> => {
  const response = await api.get(`/entradas/${id}`);
  return response.data;
};

export const getEntradasByReserva = async (
  idReserva: number
): Promise<Entrada[]> => {
  const response = await api.get(`/entradas?reserva=${idReserva}`);
  return response.data;
};

export const getEntradasByEvento = async (
  idEvento: number
): Promise<Entrada[]> => {
  const response = await api.get(`/entradas?evento=${idEvento}`);
  return response.data;
};

export const validarEntrada = async (codigoQr: string): Promise<Entrada> => {
  const response = await api.patch(`/entradas/validar/${codigoQr}`);
  return response.data;
};

export const cancelarEntrada = async (id: number): Promise<Entrada> => {
  const response = await api.patch(`/entradas/${id}/cancelar`);
  return response.data;
};

export const actualizarTipoEntrada = async (
  id: number,
  tipoEntrada: TipoEntrada,
  precio: number
): Promise<Entrada> => {
  const response = await api.patch(
    `/entradas/${id}/tipo?tipoEntrada=${tipoEntrada}&precio=${precio}`
  );
  return response.data;
};

export const getEntradasByEstado = async (
  estado: EstadoEntrada
): Promise<Entrada[]> => {
  const response = await api.get(`/entradas?estado=${estado}`);
  return response.data;
};