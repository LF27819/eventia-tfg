import api from "./api";
import { getToken } from "./authService";
import type { Booking } from "../types/booking";

export const getReservas = async (): Promise<Booking[]> => {
    const token = getToken();

    const response = await api.get("/reservas", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

interface CreateReservaPayload {
    fechaReserva: string;
    cantidadEntradas: number;
    precioTotal: number;
    metodoPago: string;
    codigoReserva: string;
    confirmada: boolean;
    usuario: {
        id: number;
    };
    evento: {
        id: number;
    };
}

export const createReserva = async (
    reserva: CreateReservaPayload
): Promise<Booking> => {
    const token = getToken();

    const response = await api.post("/reservas", reserva, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};