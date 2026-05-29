import type { Event } from "../types/event";

export type OrganizerSortMode = "fecha" | "precio";

export interface OrganizerDashboardState {
  eventos: Event[];
  cargando: boolean;
  error: string;
  search: string;
  category: string;
  selectedDate: string;
  sortMode: OrganizerSortMode;
}

export type OrganizerDashboardAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; payload: Event[] }
  | { type: "LOAD_ERROR"; payload: string }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_SORT_MODE"; payload: OrganizerSortMode };

export const initialOrganizerDashboardState: OrganizerDashboardState = {
  eventos: [],
  cargando: true,
  error: "",
  search: "",
  category: "",
  selectedDate: "",
  sortMode: "fecha",
};

export function organizerDashboardReducer(
  state: OrganizerDashboardState,
  action: OrganizerDashboardAction
): OrganizerDashboardState {
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
        eventos: action.payload,
        cargando: false,
        error: "",
      };

    case "LOAD_ERROR":
      return {
        ...state,
        cargando: false,
        error: action.payload,
      };

    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload,
      };

    case "SET_CATEGORY":
      return {
        ...state,
        category: action.payload,
      };

    case "SET_DATE":
      return {
        ...state,
        selectedDate: action.payload,
      };

    case "SET_SORT_MODE":
      return {
        ...state,
        sortMode: action.payload,
      };

    default:
      return state;
  }
}