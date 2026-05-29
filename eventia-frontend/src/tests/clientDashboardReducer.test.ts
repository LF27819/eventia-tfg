import { describe, expect, test } from "vitest";
import {
  clientDashboardReducer,
  initialClientDashboardState,
} from "../reducers/clientDashboardReducer";

describe("clientDashboardReducer", () => {
  test("debe iniciar la carga de reservas", () => {
    const result = clientDashboardReducer(initialClientDashboardState, {
      type: "LOAD_START",
    });

    expect(result.cargando).toBe(true);
    expect(result.error).toBe("");
  });

  test("debe guardar reservas al cargar correctamente", () => {
    const reservasMock = [
      {
        id: 1,
        fechaReserva: "2026-04-24T10:00:00",
        cantidadEntradas: 2,
        precioTotal: 90,
        metodoPago: "TARJETA",
        codigoReserva: "RES-1",
        confirmada: true,
        usuario: {
          id: 1,
          nombre: "Lucia",
          email: "lucia@gmail.com",
          rol: "CLIENTE",
        },
        evento: {
          id: 1,
          nombre: "Madrid Urban Fest",
          descripcion: "Festival urbano",
          fechaEvento: "2026-07-15",
          horaEvento: "22:00:00",
          precioEntrada: 45,
          aforoMaximo: 15000,
          entradasDisponibles: 12000,
          cancelado: false,
          presencial: true,
          categoria: "FESTIVAL",
        },
      },
    ];

    const result = clientDashboardReducer(initialClientDashboardState, {
      type: "LOAD_SUCCESS",
      payload: reservasMock,
    });

    expect(result.cargando).toBe(false);
    expect(result.reservas).toHaveLength(1);
    expect(result.reservas[0].codigoReserva).toBe("RES-1");
  });

  test("debe guardar error si falla la carga", () => {
    const result = clientDashboardReducer(initialClientDashboardState, {
      type: "LOAD_ERROR",
      payload: "No se pudieron cargar tus reservas",
    });

    expect(result.cargando).toBe(false);
    expect(result.error).toBe("No se pudieron cargar tus reservas");
  });

  test("debe actualizar filtros de búsqueda y estado", () => {
    const stateWithSearch = clientDashboardReducer(initialClientDashboardState, {
      type: "SET_BUSQUEDA",
      payload: "Madrid",
    });

    const finalState = clientDashboardReducer(stateWithSearch, {
      type: "SET_ESTADO",
      payload: "confirmada",
    });

    expect(finalState.busqueda).toBe("Madrid");
    expect(finalState.estado).toBe("confirmada");
  });
});