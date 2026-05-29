import { useEffect, useMemo, useReducer } from "react";
import { useAuth } from "../context/AuthContext";
import { getReservas } from "../api/bookingService";
import SummaryCard from "../components/dashboard/SummaryCard";
import BookingsDashboardTable from "../components/dashboard/BookingsDashboardTable";
import {
  clientDashboardReducer,
  initialClientDashboardState,
} from "../reducers/clientDashboardReducer";

function MyBookingsPage() {
  const { user } = useAuth();

  const [state, dispatch] = useReducer(
    clientDashboardReducer,
    initialClientDashboardState
  );

  useEffect(() => {
    const cargarReservas = async () => {
      dispatch({ type: "LOAD_START" });

      try {
        const data = await getReservas();
        dispatch({ type: "LOAD_SUCCESS", payload: data });
      } catch (err) {
        console.error("Error al cargar reservas:", err);
        dispatch({
          type: "LOAD_ERROR",
          payload: "No se pudieron cargar tus reservas",
        });
      }
    };

    cargarReservas();
  }, []);

  const misReservas = useMemo(() => {
    return state.reservas.filter(
      (reserva) => reserva.usuario?.email === user?.email
    );
  }, [state.reservas, user]);

  const reservasFiltradas = useMemo(() => {
    return misReservas.filter((reserva) => {
      const coincideBusqueda =
        reserva.evento?.nombre
          ?.toLowerCase()
          .includes(state.busqueda.toLowerCase()) ||
        reserva.codigoReserva.toLowerCase().includes(state.busqueda.toLowerCase());

      const coincideEstado =
        state.estado === "" ||
        (state.estado === "confirmada" && reserva.confirmada) ||
        (state.estado === "pendiente" && !reserva.confirmada);

      return coincideBusqueda && coincideEstado;
    });
  }, [misReservas, state.busqueda, state.estado]);

  const totalReservas = misReservas.length;

  const reservasConfirmadas = misReservas.filter(
    (reserva) => reserva.confirmada
  ).length;

  const gastoTotal = misReservas.reduce(
    (acc, reserva) => acc + reserva.precioTotal,
    0
  );

  return (
    <section className="page">
      <div className="container">
        <h2 className="page-title">Mis reservas</h2>

        {state.cargando && <p>Cargando reservas...</p>}
        {state.error && <p className="error-message">{state.error}</p>}

        {!state.cargando && !state.error && (
          <>
            <div className="summary-grid">
              <SummaryCard
                title="Total reservas"
                value={totalReservas}
                description="Reservas realizadas"
              />

              <SummaryCard
                title="Confirmadas"
                value={reservasConfirmadas}
                description="Reservas activas"
              />

              <SummaryCard
                title="Gasto total"
                value={`${gastoTotal} €`}
                description="Importe acumulado"
              />
            </div>

            <div className="filters-bar">
              <input
                type="text"
                placeholder="Buscar por evento o código..."
                value={state.busqueda}
                onChange={(e) =>
                  dispatch({ type: "SET_BUSQUEDA", payload: e.target.value })
                }
                className="filter-input"
              />

              <select
                value={state.estado}
                onChange={(e) =>
                  dispatch({ type: "SET_ESTADO", payload: e.target.value })
                }
                className="filter-select"
              >
                <option value="">Todos los estados</option>
                <option value="confirmada">Confirmadas</option>
                <option value="pendiente">Pendientes</option>
              </select>
            </div>

            <BookingsDashboardTable reservas={reservasFiltradas} />
          </>
        )}
      </div>
    </section>
  );
}

export default MyBookingsPage;