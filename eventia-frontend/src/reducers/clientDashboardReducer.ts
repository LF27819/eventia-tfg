import type { Booking } from "../types/booking";

export interface ClientDashboardState {
  reservas: Booking[];
  cargando: boolean;
  error: string;
  busqueda: string;
  estado: string;
}

export type ClientDashboardAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: Booking[] }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "SET_BUSQUEDA"; payload: string }
  | { type: "SET_ESTADO"; payload: string };

export const initialClientDashboardState: ClientDashboardState = {
  reservas: [],
  cargando: true,
  error: "",
  busqueda: "",
  estado: "",
};

export function clientDashboardReducer(
  state: ClientDashboardState,
  action: ClientDashboardAction
): ClientDashboardState {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        cargando: true,
        error: "",
      };

    case "LOAD_SUCCESS":
      return {
        ...state,
        reservas: action.payload,
        cargando: false,
        error: "",
      };

    case "LOAD_ERROR":
      return {
        ...state,
        cargando: false,
        error: action.payload,
      };

    case "SET_BUSQUEDA":
      return {
        ...state,
        busqueda: action.payload,
      };

    case "SET_ESTADO":
      return {
        ...state,
        estado: action.payload,
      };

    default:
      return state;
  }
}