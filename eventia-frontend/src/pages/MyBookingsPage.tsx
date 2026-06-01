import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getReservasByUsuario } from "../services-api/reservaService";
import type { Reserva } from "../types/reserva";
import Loading from "../components/ui/Loading";
import SummaryCard from "../components/dashboard/SummaryCard";
import BookingsDashboardTable from "../components/dashboard/BookingsDashboardTable";

function MyBookingsPage() {
  const { user } = useAuth();

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    const cargarReservas = async () => {
      if (!user?.id) {
        setCargando(false);
        return;
      }

      try {
        const data = await getReservasByUsuario(user.id);
        setReservas(data);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
        setError("No se pudieron cargar tus reservas.");
      } finally {
        setCargando(false);
      }
    };

    cargarReservas();
  }, [user]);

  const reservasFiltradas = useMemo(() => {
    return reservas.filter((reserva) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        reserva.codigoReserva.toLowerCase().includes(texto) ||
        reserva.evento?.nombre?.toLowerCase().includes(texto);

      const coincideEstado = estado === "" || reserva.estado === estado;

      return coincideBusqueda && coincideEstado;
    });
  }, [reservas, busqueda, estado]);

  const gastoTotal = reservas.reduce(
    (total, reserva) => total + reserva.precioTotal,
    0
  );

  const reservasConfirmadas = reservas.filter(
    (reserva) => reserva.estado === "CONFIRMADA"
  ).length;

  if (cargando) {
    return (
      <section className="page">
        <div className="container">
          <Loading text="Cargando reservas" />
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <h2 className="page-title">
            MIS <span className="page-title-accent">RESERVAS</span>
          </h2>

          <p className="page-subtitle">
            Consulta tus entradas, códigos y experiencias reservadas.
          </p>
        </div>

        {error && <div className="msg-error">⚠ {error}</div>}

        {!error && (
          <>
            <div className="summary-grid">
              <SummaryCard
                title="Total reservas"
                value={reservas.length}
                description="Reservas realizadas"
              />

              <SummaryCard
                title="Confirmadas"
                value={reservasConfirmadas}
                accentColor="var(--neon-acid)"
              />

              <SummaryCard
                title="Gasto total"
                value={`${gastoTotal.toFixed(2)}€`}
                accentColor="var(--neon-magenta)"
                description="Importe acumulado"
              />
            </div>

            <div className="filters-bar" style={{ marginBottom: 24 }}>
              <input
                type="text"
                placeholder="Buscar por evento o código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="form-input"
              />

              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="form-select"
                style={{ maxWidth: 220 }}
              >
                <option value="">Todos los estados</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="CONFIRMADA">Confirmadas</option>
                <option value="CANCELADA">Canceladas</option>
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