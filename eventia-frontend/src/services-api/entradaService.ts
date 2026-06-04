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
  reservaId: number
): Promise<Entrada[]> => {
  const response = await api.get(`/entradas?reservaId=${reservaId}`);
  return response.data;
};

export const getEntradasByEvento = async (
  eventoId: number
): Promise<Entrada[]> => {
  const response = await api.get(`/entradas?eventoId=${eventoId}`);
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

export async function deleteEntrada(id: number): Promise<void> {
  await api.delete(`/entradas/${id}`);
}

//Funcion descargar PDF
export const descargarPdfEntrada = async (id: number): Promise<void> => {
  const response = await api.get(`/entradas/${id}/pdf`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", `entrada-eventia-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};