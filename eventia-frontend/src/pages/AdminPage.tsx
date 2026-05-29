import { useEffect, useMemo, useReducer } from "react";
import { getEventos } from "../api/eventService";
import SummaryCard from "../components/dashboard/SummaryCard";
import DashboardFilters from "../components/dashboard/DashboardFilters";
import EventsDashboardTable from "../components/dashboard/EventsDashboardTable";
import {
  adminDashboardReducer,
  initialAdminDashboardState,
} from "../reducers/adminDashboardReducer";

function AdminPage() {
  const [state, dispatch] = useReducer(
    adminDashboardReducer,
    initialAdminDashboardState
  );

  useEffect(() => {
    const cargarEventos = async () => {
      dispatch({ type: "LOAD_START" });

      try {
        const data = await getEventos();
        dispatch({ type: "LOAD_SUCCESS", payload: data });
      } catch (err) {
        console.error("Error al cargar eventos del dashboard:", err);
        dispatch({
          type: "LOAD_ERROR",
          payload: "No se pudieron cargar los datos del dashboard",
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
  }, [state.eventos, state.search, state.category, state.selectedDate, state.sortMode]);

  const totalEventos = state.eventos.length;
  const eventosActivos = state.eventos.filter((evento) => !evento.cancelado).length;
  const eventosOnline = state.eventos.filter((evento) => !evento.presencial).length;

  return (
    <section className="page">
      <div className="container">
        <h2 className="page-title">Panel de administración</h2>

        {state.cargando && <p>Cargando dashboard...</p>}
        {state.error && <p className="error-message">{state.error}</p>}

        {!state.cargando && !state.error && (
          <>
            <div className="summary-grid">
              <SummaryCard
                title="Total eventos"
                value={totalEventos}
                description="Eventos registrados"
              />
              <SummaryCard
                title="Eventos activos"
                value={eventosActivos}
                description="No cancelados"
              />
              <SummaryCard
                title="Eventos online"
                value={eventosOnline}
                description="Modalidad no presencial"
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

export default AdminPage;