import { useEffect, useMemo, useState } from "react";
import {
  getReservas,
  confirmarReserva,
  cancelarReserva,
  deleteReserva,
} from "../services-api/reservaService";
import type { Reserva, EstadoReserva } from "../types/reserva";
import Loading from "../components/ui/Loading";

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

  const accion = async (fn: () => Promise<Reserva | void>, esEliminar = false) => {
    setCargando(true);
    setError("");
    try {
      if (esEliminar) {
        await fn();
        onEliminada(reserva.id);
      } else {
        const actualizada = await (fn() as Promise<Reserva>);
        onActualizada(actualizada);
      }
    } catch {
      setError("No se pudo completar la operación.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(6,6,8,0.88)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid rgba(204,255,0,0.2)",
          borderRadius: "var(--radius-lg)",
          padding: 32,
          width: "100%",
          maxWidth: 540,
          boxShadow: "0 0 40px rgba(204,255,0,0.08)",
          animation: "pageFadeIn 0.2s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                letterSpacing: "0.06em",
                color: "var(--neon-acid)",
                marginBottom: 4,
              }}
            >
              RESERVA #{reserva.id}
            </h3>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                letterSpacing: "0.12em",
              }}
            >
              {reserva.codigoReserva}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className={`tag ${estadoTag[reserva.estado]}`}>
              {reserva.estado}
            </span>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "1.4rem",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Datos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {/* Usuario */}
          <div
            style={{
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Usuario
            </p>
            <p style={{ fontWeight: 500, fontSize: "0.92rem", marginBottom: 2 }}>
              {reserva.usuario?.nombre} {reserva.usuario?.apellidos}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
              }}
            >
              {reserva.usuario?.email}
            </p>
          </div>

          {/* Evento */}
          <div
            style={{
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Evento
            </p>
            <p style={{ fontWeight: 500, fontSize: "0.92rem", marginBottom: 2 }}>
              {reserva.evento?.nombre ?? "Desconocido"}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
              }}
            >
              {reserva.evento?.fechaInicio ? formatFecha(reserva.evento.fechaInicio) : "—"}
            </p>
          </div>

          {/* Entradas */}
          <div
            style={{
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Entradas
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                lineHeight: 1,
                color: "var(--neon-cyan)",
              }}
            >
              {reserva.cantidadEntradas}
            </p>
          </div>

          {/* Total */}
          <div
            style={{
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Total
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                lineHeight: 1,
                color: "var(--neon-acid)",
              }}
            >
              {reserva.precioTotal.toFixed(2)}€
            </p>
          </div>
        </div>

        {/* Fecha reserva */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            marginBottom: 24,
          }}
        >
          Reservada el {formatFecha(reserva.fechaReserva)}
        </p>

        {error && (
          <div
            style={{
              background: "rgba(255,0,170,0.08)",
              border: "1px solid rgba(255,0,170,0.3)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 16px",
              color: "var(--neon-magenta)",
              fontSize: "0.88rem",
              marginBottom: 16,
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Acciones según estado */}
        {!confirmarEliminar ? (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {reserva.estado === "PENDIENTE" && (
              <button
                className="btn btn-acid btn-sm"
                disabled={cargando}
                onClick={() => accion(() => confirmarReserva(reserva.id))}
                style={{ flex: 1 }}
              >
                ✓ Confirmar
              </button>
            )}
            {reserva.estado !== "CANCELADA" && (
              <button
                className="btn btn-danger btn-sm"
                disabled={cargando}
                onClick={() => accion(() => cancelarReserva(reserva.id))}
                style={{ flex: 1 }}
              >
                ✕ Cancelar reserva
              </button>
            )}
            <button
              className="btn btn-sm"
              style={{
                border: "1px solid var(--neon-magenta)",
                color: "var(--neon-magenta)",
                background: "transparent",
                flex: 1,
              }}
              onClick={() => setConfirmarEliminar(true)}
            >
              🗑 Eliminar
            </button>
          </div>
        ) : (
          <div>
            <p style={{ color: "var(--text-muted)", marginBottom: 12, fontSize: "0.9rem" }}>
              ¿Eliminar esta reserva permanentemente?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn btn-danger btn-sm"
                disabled={cargando}
                onClick={() => accion(() => deleteReserva(reserva.id), true)}
                style={{ flex: 1 }}
              >
                {cargando ? "Eliminando..." : "Sí, eliminar"}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setConfirmarEliminar(false)}
                style={{ flex: 1 }}
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
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null);

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

  // Summary
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
        <div style={{ marginBottom: 40 }}>
          <h2 className="page-title">
            GESTIÓN <span className="page-title-accent">RESERVAS</span>
          </h2>
          <p className="page-subtitle">
            Revisa, confirma, cancela y elimina reservas. Consulta el usuario y el evento asociado.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(255,0,170,0.08)",
              border: "1px solid rgba(255,0,170,0.3)",
              borderRadius: "var(--radius-md)",
              padding: "16px 20px",
              color: "var(--neon-magenta)",
              marginBottom: 32,
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Summary */}
        <div className="summary-grid">
          {[
            { label: "Total reservas", value: reservas.length, color: "var(--neon-cyan)" },
            { label: "Confirmadas", value: confirmadas, color: "var(--neon-acid)" },
            { label: "Pendientes", value: pendientes, color: "var(--neon-orange)" },
            {
              label: "Ingresos confirmados",
              value: `${ingresos.toFixed(2)}€`,
              color: "var(--neon-magenta)",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "20px 24px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.2rem",
                  lineHeight: 1,
                  color,
                  filter: `drop-shadow(0 0 8px ${color}66)`,
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="filters-bar" style={{ marginBottom: 24 }}>
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
            className="form-select"
            style={{ maxWidth: 220 }}
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
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      padding: "40px 16px",
                    }}
                  >
                    — Sin resultados
                  </td>
                </tr>
              ) : (
                reservasFiltradas.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          color: "var(--neon-cyan)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {r.codigoReserva}
                      </span>
                    </td>

                    <td>
                      <div>
                        <p style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                          {r.usuario?.nombre} {r.usuario?.apellidos}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {r.usuario?.email}
                        </p>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                        {r.evento?.nombre ?? "—"}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.4rem",
                          color: "var(--neon-cyan)",
                        }}
                      >
                        {r.cantidadEntradas}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.85rem",
                          color: "var(--neon-acid)",
                        }}
                      >
                        {r.precioTotal.toFixed(2)}€
                      </span>
                    </td>

                    <td>
                      <span className={`tag ${estadoTag[r.estado]}`}>{r.estado}</span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {formatFecha(r.fechaReserva)}
                      </span>
                    </td>

                    <td>
                      <button
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

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            marginTop: 16,
            textAlign: "right",
          }}
        >
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
