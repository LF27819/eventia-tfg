import { useEffect, useMemo, useState } from "react";
import {
  getReservas,
  confirmarReserva,
  cancelarReserva,
  deleteReserva,
} from "../services-api/reservaService";
import type { Reserva, EstadoReserva } from "../types/reserva";
import Loading from "../components/ui/Loading";
import { getEntradas, deleteEntrada } from "../services-api/entradaService";
import type { Entrada, EstadoEntrada, TipoEntrada } from "../types/entrada";

// ── Utilidades ─────────────────────────────────────────
function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const estadoTag: Record<EstadoReserva, string> = {
  CONFIRMADA: "tag-acid",
  PENDIENTE: "tag-orange",
  CANCELADA: "tag-magenta",
};

const estadoEntradaTag: Record<EstadoEntrada, string> = {
  VALIDA: "tag-acid",
  USADA: "tag-cyan",
  CANCELADA: "tag-magenta",
};

const tipoEntradaTag: Record<TipoEntrada, string> = {
  GENERAL: "tag-muted",
  VIP: "tag-acid",
  BACKSTAGE: "tag-magenta",
};

// ── Modal detalle / acciones ───────────────────────────
function ModalReserva({
  reserva,
  onClose,
  onActualizada,
  onEliminada,
}: {
  reserva: Reserva;
  onClose: () => void;
  onActualizada: (r: Reserva) => void;
  onEliminada: (id: number) => void;
}) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

  const [entradasReserva, setEntradasReserva] = useState<Entrada[]>([]);
  const [cargandoEntradas, setCargandoEntradas] = useState(true);
  const [errorEntradas, setErrorEntradas] = useState("");

  useEffect(() => {
    setCargandoEntradas(true);
    setErrorEntradas("");

    getEntradas()
      .then((entradas) => {
        setEntradasReserva(
          entradas.filter(
            (entrada) => entrada.reserva?.id === reserva.id
          )
        );
      })
      .catch(() => setErrorEntradas("No se pudieron cargar las entradas."))
      .finally(() => setCargandoEntradas(false));
  }, [reserva.id]);

  const accion = async (fn: () => Promise<Reserva>) => {
    setCargando(true);
    setError("");

    try {
      const actualizada = await fn();
      onActualizada(actualizada);
    } catch {
      setError("No se pudo completar la operación.");
    } finally {
      setCargando(false);
    }
  };

  const eliminarReservaConEntradas = async () => {
    setCargando(true);
    setError("");

    try {
      const entradas = await getEntradas();

      const entradasAsociadas = entradas.filter(
        (entrada) => entrada.reserva?.id === reserva.id
      );

      await Promise.all(
        entradasAsociadas.map((entrada) => deleteEntrada(entrada.id))
      );

      await deleteReserva(reserva.id);

      onEliminada(reserva.id);
    } catch {
      setError(
        "No se pudo eliminar la reserva completa. Revisa que las entradas asociadas se puedan eliminar correctamente."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="admin-reservas-modal-overlay" onClick={onClose}>
      <div
        className="admin-reservas-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="admin-reservas-modal-header">
          <div>
            <h3 className="admin-reservas-modal-title">
              RESERVA #{reserva.id}
            </h3>

            <span className="admin-reservas-code">{reserva.codigoReserva}</span>
          </div>

          <div className="admin-reservas-modal-status">
            <span className={`tag ${estadoTag[reserva.estado]}`}>
              {reserva.estado}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="admin-reservas-close-btn"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Datos */}
        <div className="admin-reservas-detail-grid">
          {/* Usuario */}
          <div className="admin-reservas-detail-card">
            <p className="admin-reservas-detail-label">Usuario</p>

            <p className="admin-reservas-detail-main">
              {reserva.usuario?.nombre} {reserva.usuario?.apellidos}
            </p>

            <p className="admin-reservas-detail-muted">
              {reserva.usuario?.email}
            </p>
          </div>

          {/* Evento */}
          <div className="admin-reservas-detail-card">
            <p className="admin-reservas-detail-label">Evento</p>

            <p className="admin-reservas-detail-main">
              {reserva.evento?.nombre ?? "Desconocido"}
            </p>

            <p className="admin-reservas-detail-muted">
              {reserva.evento?.fechaInicio
                ? formatFecha(reserva.evento.fechaInicio)
                : "—"}
            </p>
          </div>

          {/* Entradas */}
          <div className="admin-reservas-detail-card">
            <p className="admin-reservas-detail-label">Entradas</p>

            <p className="admin-reservas-detail-number admin-reservas-detail-number-cyan">
              {reserva.cantidadEntradas}
            </p>
          </div>

          {/* Total */}
          <div className="admin-reservas-detail-card">
            <p className="admin-reservas-detail-label">Total</p>

            <p className="admin-reservas-detail-number admin-reservas-detail-number-acid">
              {reserva.precioTotal.toFixed(2)}€
            </p>
          </div>
        </div>

        {/* Fecha reserva */}
        <p className="admin-reservas-date">
          Reservada el {formatFecha(reserva.fechaReserva)}
        </p>

        <div className="admin-reservas-entradas-box">
          <p className="admin-reservas-detail-label">
            Entradas asociadas
          </p>

          {cargandoEntradas ? (
            <p>Cargando entradas...</p>
          ) : errorEntradas ? (
            <p>⚠ {errorEntradas}</p>
          ) : entradasReserva.length === 0 ? (
            <p>— No hay entradas asociadas</p>
          ) : (
            <div>
              {entradasReserva.map((entrada) => (
                <div
                  key={entrada.id}
                  className="admin-reservas-entrada-card"
                >
                  <div>
                    <strong>Entrada #{entrada.id}</strong>

                    <div>{entrada.codigoQr}</div>

                    <div>
                      {entrada.precio.toFixed(2)}€
                    </div>
                  </div>

                  <div>
                    <span
                      className={`tag ${tipoEntradaTag[entrada.tipoEntrada]}`}
                    >
                      {entrada.tipoEntrada}
                    </span>

                    <span
                      className={`tag ${estadoEntradaTag[entrada.estado]}`}
                    >
                      {entrada.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <div className="admin-reservas-error">⚠ {error}</div>}

        {/* Acciones según estado */}
        {!confirmarEliminar ? (
          <div className="admin-reservas-actions">
            {reserva.estado === "PENDIENTE" && (
              <button
                type="button"
                className="btn btn-acid btn-sm admin-reservas-action-btn"
                disabled={cargando}
                onClick={() => accion(() => confirmarReserva(reserva.id))}
              >
                ✓ Confirmar
              </button>
            )}

            {reserva.estado !== "CANCELADA" && (
              <button
                type="button"
                className="btn btn-danger btn-sm admin-reservas-action-btn"
                disabled={cargando}
                onClick={() => accion(() => cancelarReserva(reserva.id))}
              >
                ✕ Cancelar reserva
              </button>
            )}

            <button
              type="button"
              className="btn btn-sm admin-reservas-delete-outline admin-reservas-action-btn"
              disabled={cargando}
              onClick={() => setConfirmarEliminar(true)}
            >
              🗑 Eliminar reserva
            </button>
          </div>
        ) : (
          <div>
            <div className="admin-reservas-delete-warning">
              <p className="admin-reservas-delete-warning-title">
                ¿Eliminar esta reserva y sus entradas?
              </p>

              <p className="admin-reservas-delete-warning-text">
                Esta acción borrará primero todas las entradas asociadas a la
                reserva y después eliminará la reserva. No se puede deshacer.
              </p>
            </div>

            <div className="admin-reservas-confirm-actions">
              <button
                type="button"
                className="btn btn-danger btn-sm admin-reservas-action-btn"
                disabled={cargando}
                onClick={eliminarReservaConEntradas}
              >
                {cargando ? "Eliminando..." : "Sí, eliminar todo"}
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm admin-reservas-action-btn"
                disabled={cargando}
                onClick={() => setConfirmarEliminar(false)}
              >
                No, volver
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Página principal ───────────────────────────────────
function AdminReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [reservaSeleccionada, setReservaSeleccionada] =
    useState<Reserva | null>(null);

  useEffect(() => {
    getReservas()
      .then(setReservas)
      .catch(() => setError("No se pudieron cargar las reservas."))
      .finally(() => setCargando(false));
  }, []);

  const reservasFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return reservas.filter((r) => {
      const coincide =
        r.codigoReserva.toLowerCase().includes(texto) ||
        r.usuario?.nombre?.toLowerCase().includes(texto) ||
        r.usuario?.apellidos?.toLowerCase().includes(texto) ||
        r.usuario?.email?.toLowerCase().includes(texto) ||
        r.evento?.nombre?.toLowerCase().includes(texto);

      const coincideEstado = filtroEstado === "" || r.estado === filtroEstado;

      return coincide && coincideEstado;
    });
  }, [reservas, busqueda, filtroEstado]);

  const confirmadas = reservas.filter((r) => r.estado === "CONFIRMADA").length;
  const pendientes = reservas.filter((r) => r.estado === "PENDIENTE").length;
  const ingresos = reservas
    .filter((r) => r.estado === "CONFIRMADA")
    .reduce((acc, r) => acc + r.precioTotal, 0);

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
        {/* Cabecera */}
        <div className="admin-reservas-page-header">
          <h2 className="page-title">
            GESTIÓN <span className="page-title-accent">RESERVAS</span>
          </h2>

          <p className="page-subtitle">
            Revisa, confirma, cancela y elimina reservas. Consulta el usuario y
            el evento asociado.
          </p>
        </div>

        {error && <div className="admin-reservas-page-error">⚠ {error}</div>}

        {/* Summary */}
        <div className="summary-grid">
          {[
            {
              label: "Total reservas",
              value: reservas.length,
              color: "var(--neon-cyan)",
              className: "admin-reservas-summary-value-cyan",
            },
            {
              label: "Confirmadas",
              value: confirmadas,
              color: "var(--neon-acid)",
              className: "admin-reservas-summary-value-acid",
            },
            {
              label: "Pendientes",
              value: pendientes,
              color: "var(--neon-orange)",
              className: "admin-reservas-summary-value-orange",
            },
            {
              label: "Ingresos confirmados",
              value: `${ingresos.toFixed(2)}€`,
              color: "var(--neon-magenta)",
              className: "admin-reservas-summary-value-magenta",
            },
          ].map(({ label, value, className }) => (
            <div key={label} className="admin-reservas-summary-card">
              <p className="admin-reservas-summary-label">{label}</p>

              <p className={`admin-reservas-summary-value ${className}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="filters-bar admin-reservas-filters">
          <input
            type="text"
            placeholder="Buscar por código, usuario o evento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="form-input"
          />

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="form-select admin-reservas-filter-select"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="CONFIRMADA">Confirmadas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Usuario</th>
                <th>Evento</th>
                <th>Entradas</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {reservasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="admin-reservas-empty-cell">
                    — Sin resultados
                  </td>
                </tr>
              ) : (
                reservasFiltradas.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span className="admin-reservas-table-code">
                        {r.codigoReserva}
                      </span>
                    </td>

                    <td>
                      <div>
                        <p className="admin-reservas-table-main">
                          {r.usuario?.nombre} {r.usuario?.apellidos}
                        </p>

                        <p className="admin-reservas-table-muted">
                          {r.usuario?.email}
                        </p>
                      </div>
                    </td>

                    <td>
                      <span className="admin-reservas-table-main">
                        {r.evento?.nombre ?? "—"}
                      </span>
                    </td>

                    <td>
                      <span className="admin-reservas-table-entries">
                        {r.cantidadEntradas}
                      </span>
                    </td>

                    <td>
                      <span className="admin-reservas-table-total">
                        {r.precioTotal.toFixed(2)}€
                      </span>
                    </td>

                    <td>
                      <span className={`tag ${estadoTag[r.estado]}`}>
                        {r.estado}
                      </span>
                    </td>

                    <td>
                      <span className="admin-reservas-table-date">
                        {formatFecha(r.fechaReserva)}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setReservaSeleccionada(r)}
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="admin-reservas-results-count">
          {reservasFiltradas.length} de {reservas.length} reservas
        </p>
      </div>

      {/* Modal detalle */}
      {reservaSeleccionada && (
        <ModalReserva
          reserva={reservaSeleccionada}
          onClose={() => setReservaSeleccionada(null)}
          onActualizada={(actualizada) => {
            setReservas((prev) =>
              prev.map((r) => (r.id === actualizada.id ? actualizada : r))
            );
            setReservaSeleccionada(actualizada);
          }}
          onEliminada={(id) => {
            setReservas((prev) => prev.filter((r) => r.id !== id));
            setReservaSeleccionada(null);
          }}
        />
      )}
    </section>
  );
}

export default AdminReservasPage;
