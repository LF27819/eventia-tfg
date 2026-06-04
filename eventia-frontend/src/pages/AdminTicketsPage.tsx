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

function MsgError({ msg }: { msg: string }) {
  return <div className="admin-entradas-error">⚠ {msg}</div>;
}

function DataBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-entradas-data-block">
      <p className="admin-entradas-data-label">{label}</p>
      {children}
    </div>
  );
}

// ── Modal gestión de entrada ───────────────────────────
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
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState("");
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

  const handleValidar = () => ejecutar(() => validarEntrada(entrada.codigoQr));

  const handleCancelar = () => ejecutar(() => cancelarEntrada(entrada.id));

  const handleGuardarTipo = async () => {
    const precio = parseFloat(nuevoPrecio);

    if (isNaN(precio) || precio < 0) {
      setError("Precio inválido.");
      return;
    }

    setCargando(true);
    setError("");

    try {
      const actualizada = await actualizarTipoEntrada(
        entrada.id,
        nuevoTipo,
        precio
      );
      onActualizada(actualizada);
      setEditandoTipo(false);
    } catch {
      setError("No se pudo actualizar el tipo/precio.");
    } finally {
      setCargando(false);
    }
  };

  const handleCancelarEdicion = () => {
    setEditandoTipo(false);
    setNuevoTipo(entrada.tipoEntrada);
    setNuevoPrecio(entrada.precio.toString());
    setError("");
  };

  const handleDescargarPdf = async () => {
    setDescargando(true);
    setError("");

    try {
      await descargarPdfEntrada(entrada.id);
    } catch {
      setError("No se pudo descargar el PDF.");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="admin-entradas-modal-overlay" onClick={onClose}>
      <div
        className="admin-entradas-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-entradas-modal-header">
          <div>
            <h3 className="admin-entradas-modal-title">ENTRADA #{entrada.id}</h3>

            <div className="admin-entradas-tags-row">
              <span className={`tag ${estadoTag[entrada.estado]}`}>
                {entrada.estado}
              </span>
              <span className={`tag ${tipoTag[entrada.tipoEntrada]}`}>
                {entrada.tipoEntrada}
              </span>
            </div>
          </div>

          <button className="admin-entradas-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <DataBlock label="Usuario">
          <p className="admin-entradas-main-text">
            {entrada.reserva?.usuario
              ? `${entrada.reserva.usuario.nombre} ${entrada.reserva.usuario.apellidos}`
              : "Usuario desconocido"}
          </p>
          <p className="admin-entradas-muted-mono">
            {entrada.reserva?.usuario?.email ?? "—"}
          </p>
        </DataBlock>

        <div className="admin-entradas-block-spacing">
          <DataBlock label="Reserva">
            <p className="admin-entradas-cyan-code">
              {entrada.reserva?.codigoReserva ?? "—"}
            </p>
          </DataBlock>
        </div>

        <div className="admin-entradas-block-spacing">
          <DataBlock label="Evento">
            <p className="admin-entradas-main-text">
              {entrada.evento?.nombre ?? "Desconocido"}
            </p>
            <p className="admin-entradas-muted-mono">
              {entrada.evento?.fechaInicio
                ? formatFecha(entrada.evento.fechaInicio)
                : "—"}
              {entrada.evento?.recinto?.nombre
                ? ` · ${entrada.evento.recinto.nombre}`
                : ""}
            </p>
          </DataBlock>
        </div>

        <div className="admin-entradas-modal-grid">
          <DataBlock label="Precio">
            <p className="admin-entradas-price-big">
              {entrada.precio.toFixed(2)}€
            </p>
          </DataBlock>

          <DataBlock label="Generada">
            <p className="admin-entradas-date-text">
              {formatFecha(entrada.fechaGeneracion)}
            </p>

            {entrada.fechaUso && (
              <p className="admin-entradas-used-date">
                Usada: {formatFecha(entrada.fechaUso)}
              </p>
            )}
          </DataBlock>
        </div>

        <DataBlock label="Código QR">
          <p className="admin-entradas-qr-code">{entrada.codigoQr}</p>
        </DataBlock>

        {editandoTipo && (
          <div className="admin-entradas-edit-box">
            <p className="admin-entradas-edit-title">Editar tipo y precio</p>

            <div className="admin-entradas-edit-grid">
              <div>
                <label className="admin-entradas-form-label">Tipo</label>

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
                <label className="admin-entradas-form-label">Precio (€)</label>

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

            <div className="admin-entradas-edit-actions">
              <button
                className="btn btn-acid btn-sm admin-entradas-flex-btn"
                disabled={cargando}
                onClick={handleGuardarTipo}
              >
                {cargando ? "Guardando..." : "Guardar"}
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={handleCancelarEdicion}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="admin-entradas-error-spacing">
            <MsgError msg={error} />
          </div>
        )}

        {!editandoTipo && (
          <div className="admin-entradas-modal-actions">
            {entrada.estado === "VALIDA" && (
              <button
                className="btn btn-acid btn-sm admin-entradas-flex-btn"
                disabled={cargando}
                onClick={handleValidar}
              >
                ✓ Validar acceso
              </button>
            )}

            {entrada.estado !== "CANCELADA" && (
              <button
                className="btn btn-danger btn-sm admin-entradas-flex-btn"
                disabled={cargando}
                onClick={handleCancelar}
              >
                ✕ Cancelar entrada
              </button>
            )}

            <button
              className="btn btn-secondary btn-sm admin-entradas-flex-btn"
              disabled={cargando}
              onClick={() => {
                setEditandoTipo(true);
                setError("");
              }}
            >
              ✎ Tipo / Precio
            </button>

            <button
              className="btn btn-sm admin-entradas-pdf-btn"
              disabled={descargando}
              onClick={handleDescargarPdf}
            >
              {descargando ? "Descargando..." : "↓ PDF"}
            </button>
          </div>
        )}
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
  const [entradaSeleccionada, setEntradaSeleccionada] =
    useState<Entrada | null>(null);

  useEffect(() => {
    getEntradas()
      .then(setEntradas)
      .catch(() => setError("No se pudieron cargar las entradas."))
      .finally(() => setCargando(false));
  }, []);

  const entradasFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return entradas.filter((entrada) => {
      const coincide =
        entrada.codigoQr.toLowerCase().includes(texto) ||
        entrada.evento?.nombre?.toLowerCase().includes(texto) ||
        entrada.reserva?.codigoReserva?.toLowerCase().includes(texto) ||
        entrada.reserva?.usuario?.nombre?.toLowerCase().includes(texto) ||
        entrada.reserva?.usuario?.apellidos?.toLowerCase().includes(texto) ||
        entrada.reserva?.usuario?.email?.toLowerCase().includes(texto) ||
        String(entrada.id).includes(texto);

      const coincideEstado =
        filtroEstado === "" || entrada.estado === filtroEstado;

      const coincideTipo =
        filtroTipo === "" || entrada.tipoEntrada === filtroTipo;

      return coincide && coincideEstado && coincideTipo;
    });
  }, [entradas, busqueda, filtroEstado, filtroTipo]);

  const validas = entradas.filter((entrada) => entrada.estado === "VALIDA").length;
  const usadas = entradas.filter((entrada) => entrada.estado === "USADA").length;
  const canceladas = entradas.filter(
    (entrada) => entrada.estado === "CANCELADA"
  ).length;
  const vip = entradas.filter((entrada) => entrada.tipoEntrada === "VIP").length;

  const resumen = [
    {
      label: "Total entradas",
      value: entradas.length,
      className: "admin-entradas-stat-cyan",
    },
    {
      label: "Válidas",
      value: validas,
      className: "admin-entradas-stat-acid",
    },
    {
      label: "Usadas",
      value: usadas,
      className: "admin-entradas-stat-cyan",
    },
    {
      label: "Canceladas",
      value: canceladas,
      className: "admin-entradas-stat-magenta",
    },
    {
      label: "VIP",
      value: vip,
      className: "admin-entradas-stat-purple",
    },
  ];

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
        <div className="admin-entradas-page-header">
          <h2 className="page-title">
            GESTIÓN <span className="page-title-accent">ENTRADAS</span>
          </h2>

          <p className="page-subtitle">
            Valida accesos, cancela entradas, actualiza tipo y precio, descarga PDFs.
          </p>
        </div>

        {error && <MsgError msg={error} />}

        <div className="summary-grid">
          {resumen.map(({ label, value, className }) => (
            <div key={label} className="admin-entradas-stat-card">
              <p className="admin-entradas-stat-label">{label}</p>
              <p className={`admin-entradas-stat-value ${className}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="filters-bar admin-entradas-filters">
          <input
            type="text"
            placeholder="Buscar por ID, QR, evento, usuario o reserva..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="form-input"
          />

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="form-select admin-entradas-filter-select"
          >
            <option value="">Todos los estados</option>
            <option value="VALIDA">Válidas</option>
            <option value="USADA">Usadas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="form-select admin-entradas-filter-select"
          >
            <option value="">Todos los tipos</option>
            <option value="GENERAL">General</option>
            <option value="VIP">VIP</option>
            <option value="BACKSTAGE">Backstage</option>
          </select>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Reserva</th>
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
                  <td colSpan={9} className="admin-entradas-empty-cell">
                    — Sin resultados
                  </td>
                </tr>
              ) : (
                entradasFiltradas.map((entrada) => (
                  <tr key={entrada.id}>
                    <td>
                      <span className="admin-entradas-id-text">#{entrada.id}</span>
                    </td>

                    <td>
                      <p className="admin-entradas-table-main-text">
                        {entrada.reserva?.usuario
                          ? `${entrada.reserva.usuario.nombre} ${entrada.reserva.usuario.apellidos}`
                          : "Usuario desconocido"}
                      </p>

                      <p className="admin-entradas-table-muted-text">
                        {entrada.reserva?.usuario?.email ?? "—"}
                      </p>
                    </td>

                    <td>
                      <span className="admin-entradas-table-code">
                        {entrada.reserva?.codigoReserva ?? "—"}
                      </span>
                    </td>

                    <td>
                      <p className="admin-entradas-table-main-text">
                        {entrada.evento?.nombre ?? "Desconocido"}
                      </p>

                      {entrada.evento?.recinto?.nombre && (
                        <p className="admin-entradas-table-muted-text">
                          {entrada.evento.recinto.nombre}
                        </p>
                      )}
                    </td>

                    <td>
                      <span className={`tag ${tipoTag[entrada.tipoEntrada]}`}>
                        {entrada.tipoEntrada}
                      </span>
                    </td>

                    <td>
                      <span className="admin-entradas-table-price">
                        {entrada.precio.toFixed(2)}€
                      </span>
                    </td>

                    <td>
                      <span className={`tag ${estadoTag[entrada.estado]}`}>
                        {entrada.estado}
                      </span>
                    </td>

                    <td>
                      <span className="admin-entradas-table-date">
                        {formatFecha(entrada.fechaGeneracion)}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEntradaSeleccionada(entrada)}
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

        <p className="admin-entradas-results-count">
          {entradasFiltradas.length} de {entradas.length} entradas
        </p>
      </div>

      {entradaSeleccionada && (
        <ModalEntrada
          entrada={entradaSeleccionada}
          onClose={() => setEntradaSeleccionada(null)}
          onActualizada={(actualizada) => {
            setEntradas((prev) =>
              prev.map((entrada) =>
                entrada.id === actualizada.id ? actualizada : entrada
              )
            );
            setEntradaSeleccionada(actualizada);
          }}
        />
      )}
    </section>
  );
}

export default AdminEntradasPage;
