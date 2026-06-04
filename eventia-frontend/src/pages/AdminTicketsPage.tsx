import { useEffect, useMemo, useState } from "react";
import {
  getEntradas,
  cancelarEntrada,
  validarEntrada,
  actualizarTipoEntrada,
  descargarPdfEntrada,
} from "../services-api/entradaService";
import type { Entrada, EstadoEntrada, TipoEntrada } from "../types/entrada";
import Loading from "../components/ui/Loading";

// ── Utilidades ─────────────────────────────────────────
function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const estadoTag: Record<EstadoEntrada, string> = {
  VALIDA: "tag-acid",
  USADA: "tag-cyan",
  CANCELADA: "tag-magenta",
};

const tipoTag: Record<TipoEntrada, string> = {
  GENERAL: "tag-muted",
  VIP: "tag-acid",
  BACKSTAGE: "tag-magenta",
};

// ── Modal detalle/gestión de entrada ──────────────────
function ModalEntrada({
  entrada,
  onClose,
  onActualizada,
}: {
  entrada: Entrada;
  onClose: () => void;
  onActualizada: (e: Entrada) => void;
}) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [descargando, setDescargando] = useState(false);

  // Editar tipo/precio
  const [editandoTipo, setEditandoTipo] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState<TipoEntrada>(entrada.tipoEntrada);
  const [nuevoPrecio, setNuevoPrecio] = useState(entrada.precio.toString());

  const ejecutar = async (fn: () => Promise<Entrada>) => {
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

  const handleValidar = () =>
    ejecutar(() => validarEntrada(entrada.codigoQr));

  const handleCancelar = () =>
    ejecutar(() => cancelarEntrada(entrada.id));

  const handleGuardarTipo = () => {
    const precio = parseFloat(nuevoPrecio);
    if (isNaN(precio) || precio < 0) {
      setError("Precio inválido.");
      return;
    }
    ejecutar(() => actualizarTipoEntrada(entrada.id, nuevoTipo, precio)).then(
      () => setEditandoTipo(false)
    );
  };

  const handleDescargarPdf = async () => {
    setDescargando(true);
    try {
      await descargarPdfEntrada(entrada.id);
    } catch {
      setError("No se pudo descargar el PDF.");
    } finally {
      setDescargando(false);
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
          border: "1px solid rgba(255,0,170,0.2)",
          borderRadius: "var(--radius-lg)",
          padding: 32,
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 0 40px rgba(255,0,170,0.08)",
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
                color: "var(--neon-magenta)",
                marginBottom: 4,
              }}
            >
              ENTRADA #{entrada.id}
            </h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className={`tag ${estadoTag[entrada.estado]}`}>
                {entrada.estado}
              </span>
              <span className={`tag ${tipoTag[entrada.tipoEntrada]}`}>
                {entrada.tipoEntrada}
              </span>
            </div>
          </div>
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

        {/* Datos del evento */}
        <div
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            marginBottom: 16,
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
          <p style={{ fontWeight: 500, fontSize: "0.95rem", marginBottom: 2 }}>
            {entrada.evento?.nombre ?? "Desconocido"}
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "var(--text-muted)",
            }}
          >
            {entrada.evento?.fechaInicio ? formatFecha(entrada.evento.fechaInicio) : "—"} ·{" "}
            {entrada.evento?.recinto?.nombre ?? ""}
          </p>
        </div>

        {/* Grid datos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Precio
            </p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                lineHeight: 1,
                color: "var(--neon-acid)",
              }}
            >
              {entrada.precio.toFixed(2)}€
            </p>
          </div>

          <div
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "14px 16px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Generada
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
                color: "var(--text-primary)",
              }}
            >
              {formatFecha(entrada.fechaGeneracion)}
            </p>
          </div>
        </div>

        {/* QR code */}
        <div
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Código QR
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              color: "var(--neon-cyan)",
              wordBreak: "break-all",
              letterSpacing: "0.06em",
            }}
          >
            {entrada.codigoQr}
          </p>
        </div>

        {/* Fecha de uso si está usada */}
        {entrada.fechaUso && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              marginBottom: 20,
            }}
          >
            Usada el {formatFecha(entrada.fechaUso)}
          </p>
        )}

        {/* Editar tipo/precio */}
        {editandoTipo ? (
          <div
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid rgba(204,255,0,0.2)",
              borderRadius: "var(--radius-md)",
              padding: "16px",
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "var(--neon-acid)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Editar tipo y precio
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "var(--text-muted)",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Tipo
                </label>
                <select
                  className="form-select"
                  value={nuevoTipo}
                  onChange={(e) => setNuevoTipo(e.target.value as TipoEntrada)}
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="VIP">VIP</option>
                  <option value="BACKSTAGE">BACKSTAGE</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "var(--text-muted)",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Precio (€)
                </label>
                <input
                  className="form-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={nuevoPrecio}
                  onChange={(e) => setNuevoPrecio(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn btn-acid btn-sm"
                disabled={cargando}
                onClick={handleGuardarTipo}
                style={{ flex: 1 }}
              >
                {cargando ? "Guardando..." : "Guardar"}
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setEditandoTipo(false);
                  setNuevoTipo(entrada.tipoEntrada);
                  setNuevoPrecio(entrada.precio.toString());
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : null}

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

        {/* Acciones */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {entrada.estado === "VALIDA" && (
            <button
              className="btn btn-acid btn-sm"
              disabled={cargando}
              onClick={handleValidar}
              title="Marcar como usada"
              style={{ flex: 1 }}
            >
              ✓ Validar
            </button>
          )}

          {entrada.estado !== "CANCELADA" && (
            <button
              className="btn btn-danger btn-sm"
              disabled={cargando}
              onClick={handleCancelar}
              style={{ flex: 1 }}
            >
              ✕ Cancelar
            </button>
          )}

          {!editandoTipo && (
            <button
              className="btn btn-secondary btn-sm"
              disabled={cargando}
              onClick={() => setEditandoTipo(true)}
              style={{ flex: 1 }}
            >
              ✎ Tipo/Precio
            </button>
          )}

          <button
            className="btn btn-sm"
            style={{
              border: "1px solid var(--neon-cyan)",
              color: "var(--neon-cyan)",
              background: "transparent",
              flex: 1,
            }}
            disabled={descargando}
            onClick={handleDescargarPdf}
          >
            {descargando ? "..." : "↓ PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ───────────────────────────────────
function AdminEntradasPage() {
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [entradaSeleccionada, setEntradaSeleccionada] = useState<Entrada | null>(null);

  useEffect(() => {
    getEntradas()
      .then(setEntradas)
      .catch(() => setError("No se pudieron cargar las entradas."))
      .finally(() => setCargando(false));
  }, []);

  const entradasFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return entradas.filter((e) => {
      const coincide =
        e.codigoQr.toLowerCase().includes(texto) ||
        e.evento?.nombre?.toLowerCase().includes(texto) ||
        String(e.id).includes(texto);
      const coincideEstado = filtroEstado === "" || e.estado === filtroEstado;
      const coincideTipo = filtroTipo === "" || e.tipoEntrada === filtroTipo;
      return coincide && coincideEstado && coincideTipo;
    });
  }, [entradas, busqueda, filtroEstado, filtroTipo]);

  // Summary
  const validas = entradas.filter((e) => e.estado === "VALIDA").length;
  const usadas = entradas.filter((e) => e.estado === "USADA").length;
  const canceladas = entradas.filter((e) => e.estado === "CANCELADA").length;
  const vip = entradas.filter((e) => e.tipoEntrada === "VIP").length;

  if (cargando) {
    return (
      <section className="page">
        <div className="container">
          <Loading text="Cargando entradas" />
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
            GESTIÓN <span className="page-title-accent">ENTRADAS</span>
          </h2>
          <p className="page-subtitle">
            Valida accesos, cancela entradas, actualiza tipo y precio, descarga PDFs.
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
            { label: "Total entradas", value: entradas.length, color: "var(--neon-cyan)" },
            { label: "Válidas", value: validas, color: "var(--neon-acid)" },
            { label: "Usadas", value: usadas, color: "var(--neon-cyan)" },
            { label: "Canceladas", value: canceladas, color: "var(--neon-magenta)" },
            { label: "VIP", value: vip, color: "var(--neon-purple)" },
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
            placeholder="Buscar por ID, QR o evento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="form-input"
          />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="form-select"
            style={{ maxWidth: 200 }}
          >
            <option value="">Todos los estados</option>
            <option value="VALIDA">Válidas</option>
            <option value="USADA">Usadas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="form-select"
            style={{ maxWidth: 200 }}
          >
            <option value="">Todos los tipos</option>
            <option value="GENERAL">General</option>
            <option value="VIP">VIP</option>
            <option value="BACKSTAGE">Backstage</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Evento</th>
                <th>Tipo</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Generada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {entradasFiltradas.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
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
                entradasFiltradas.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.78rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        #{e.id}
                      </span>
                    </td>

                    <td>
                      <div>
                        <p style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                          {e.evento?.nombre ?? "Desconocido"}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            color: "var(--text-muted)",
                            marginTop: 2,
                          }}
                        >
                          {e.evento?.recinto?.nombre ?? ""}
                        </p>
                      </div>
                    </td>

                    <td>
                      <span className={`tag ${tipoTag[e.tipoEntrada]}`}>
                        {e.tipoEntrada}
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
                        {e.precio.toFixed(2)}€
                      </span>
                    </td>

                    <td>
                      <span className={`tag ${estadoTag[e.estado]}`}>
                        {e.estado}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        {formatFecha(e.fechaGeneracion)}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEntradaSeleccionada(e)}
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
          {entradasFiltradas.length} de {entradas.length} entradas
        </p>
      </div>

      {/* Modal detalle */}
      {entradaSeleccionada && (
        <ModalEntrada
          entrada={entradaSeleccionada}
          onClose={() => setEntradaSeleccionada(null)}
          onActualizada={(actualizada) => {
            setEntradas((prev) =>
              prev.map((e) => (e.id === actualizada.id ? actualizada : e))
            );
            setEntradaSeleccionada(actualizada);
          }}
        />
      )}
    </section>
  );
}

export default AdminEntradasPage;