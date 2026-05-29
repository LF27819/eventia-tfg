import { useEffect, useMemo, useReducer } from "react";
import { getEventos } from "../api/eventService";
import SummaryCard from "../components/dashboard/SummaryCard";
import DashboardFilters from "../components/dashboard/DashboardFilters";
import EventsDashboardTable from "../components/dashboard/EventsDashboardTable";
import {
  initialOrganizerDashboardState,
  organizerDashboardReducer,
} from "../reducers/organizerDashboardReducer";

function OrganizerPage() {
  const [state, dispatch] = useReducer(
    organizerDashboardReducer,
    initialOrganizerDashboardState
  );

  useEffect(() => {
    const cargarEventos = async () => {
      dispatch({ type: "LOAD_START" });

      try {
        const data = await getEventos();
        dispatch({ type: "LOAD_SUCCESS", payload: data });
      } catch (err) {
        console.error("Error al cargar eventos del organizador:", err);
        dispatch({
          type: "LOAD_ERROR",
          payload: "No se pudieron cargar los eventos",
        });
      }
    };

    cargarEventos();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(state.eventos.map((evento) => evento.categoria))];
  }, [state.eventos]);

  const eventosFiltrados = useMemo(() => {
    return state.eventos
      .filter((evento) => {
        const coincideBusqueda = evento.nombre
          .toLowerCase()
          .includes(state.search.toLowerCase());

        const coincideCategoria =
          state.category === "" || evento.categoria === state.category;

        const coincideFecha =
          state.selectedDate === "" ||
          evento.fechaEvento === state.selectedDate;

        return coincideBusqueda && coincideCategoria && coincideFecha;
      })
      .sort((a, b) => {
        if (state.sortMode === "precio") {
          return a.precioEntrada - b.precioEntrada;
        }

        return (
          new Date(a.fechaEvento).getTime() -
          new Date(b.fechaEvento).getTime()
        );
      });
  }, [
    state.eventos,
    state.search,
    state.category,
    state.selectedDate,
    state.sortMode,
  ]);

  const totalEventos = state.eventos.length;
  const activos = state.eventos.filter((evento) => !evento.cancelado).length;
  const totalEntradas = state.eventos.reduce(
    (acc, evento) => acc + evento.entradasDisponibles,
    0
  );

  return (
    <section className="page">
      <div className="container">
        <h2 className="page-title">Panel organizador</h2>

        {state.cargando && <p>Cargando dashboard...</p>}
        {state.error && <p className="error-message">{state.error}</p>}

        {!state.cargando && !state.error && (
          <>
            <div className="summary-grid">
              <SummaryCard title="Eventos" value={totalEventos} />
              <SummaryCard title="Activos" value={activos} />
              <SummaryCard
                title="Entradas disponibles"
                value={totalEntradas}
              />
            </div>

            <DashboardFilters
              search={state.search}
              category={state.category}
              selectedDate={state.selectedDate}
              categories={categories}
              onSearchChange={(value) =>
                dispatch({ type: "SET_SEARCH", payload: value })
              }
              onCategoryChange={(value) =>
                dispatch({ type: "SET_CATEGORY", payload: value })
              }
              onDateChange={(value) =>
                dispatch({ type: "SET_DATE", payload: value })
              }
            />

            <div className="sort-actions">
              <button
                className="login-button"
                onClick={() =>
                  dispatch({ type: "SET_SORT_MODE", payload: "fecha" })
                }
              >
                Ordenar por fecha
              </button>

              <button
                className="login-button"
                onClick={() =>
                  dispatch({ type: "SET_SORT_MODE", payload: "precio" })
                }
              >
                Ordenar por precio
              </button>
            </div>

            <EventsDashboardTable
              eventos={eventosFiltrados}
              onSortByDate={() =>
                dispatch({ type: "SET_SORT_MODE", payload: "fecha" })
              }
              onSortByPrice={() =>
                dispatch({ type: "SET_SORT_MODE", payload: "precio" })
              }
            />
          </>
        )}
      </div>
    </section>
  );
}

export default OrganizerPage;