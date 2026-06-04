import { useEffect, useMemo, useState } from "react";
import {
  getUsuarios,
  updateUsuario,
  cambiarEstadoUsuario,
  cambiarRolUsuario,
  deleteUsuario,
} from "../services-api/usuarioService";
import { getReservasByUsuario as fetchReservasByUsuario } from "../services-api/reservaService";
import type { Usuario, RolUsuario } from "../types/usuario";
import type { Reserva } from "../types/reserva";
import Loading from "../components/ui/Loading";

// ── Tipos ──────────────────────────────────────────────
type ModalTipo = "editar" | "reservas" | "eliminar" | null;

interface ModalState {
  tipo: ModalTipo;
  usuario: Usuario | null;
}

// ── Utilidades ─────────────────────────────────────────
const estadoColor = (activo: boolean) =>
  activo ? "tag-acid" : "tag-muted";

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Componente modal genérico ──────────────────────────
function Modal({
  titulo,
  onClose,
  accentClass = "modal-accent-cyan",
  children,
}: {
  titulo: string;
  onClose: () => void;
  accentClass?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-user-modal-overlay" onClick={onClose}>
      <div
        className={`admin-user-modal ${accentClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-user-modal-header">
          <h3 className="admin-user-modal-title">{titulo}</h3>
          <button
            onClick={onClose}
            className="admin-user-modal-close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Modal Editar Usuario ───────────────────────────────
function ModalEditarUsuario({
  usuario,
  onClose,
  onGuardado,
}: {
  usuario: Usuario;
  onClose: () => void;
  onGuardado: (u: Usuario) => void;
}) {
  const [form, setForm] = useState({
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    email: usuario.email,
    telefono: usuario.telefono ?? "",
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const handleGuardar = async () => {
    setGuardando(true);
    setError("");
    try {
      const actualizado = await updateUsuario(usuario.id, form);
      onGuardado(actualizado);
    } catch {
      setError("No se pudo actualizar el usuario.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal titulo="EDITAR USUARIO" onClose={onClose} accentClass="modal-accent-cyan">
      <div className="admin-user-modal-form">
        <div className="admin-user-form-grid">
          <div>
            <label className="admin-user-form-label">NOMBRE</label>
            <input
              className="form-input"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-user-form-label">APELLIDOS</label>
            <input
              className="form-input"
              value={form.apellidos}
              onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="admin-user-form-label">EMAIL</label>
          <input
            className="form-input"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="admin-user-form-label">TELÉFONO</label>
          <input
            className="form-input"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            placeholder="Sin teléfono"
          />
        </div>

        {error && (
          <div className="admin-user-error-box">
            ⚠ {error}
          </div>
        )}

        <div className="admin-user-modal-actions admin-user-modal-actions-spaced">
          <button
            className="btn btn-primary admin-user-flex-button"
            onClick={handleGuardar}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Modal Reservas de Usuario ──────────────────────────
function ModalReservasUsuario({
  usuario,
  onClose,
}: {
  usuario: Usuario;
  onClose: () => void;
}) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReservasByUsuario(usuario.id)
      .then(setReservas)
      .catch(() => setError("No se pudieron cargar las reservas."))
      .finally(() => setCargando(false));
  }, [usuario.id]);

  const estadoTag: Record<string, string> = {
    CONFIRMADA: "tag-acid",
    PENDIENTE: "tag-orange",
    CANCELADA: "tag-magenta",
  };

  return (
    <Modal
      titulo={`RESERVAS — ${usuario.nombre.toUpperCase()}`}
      onClose={onClose}
      accentClass="modal-accent-acid"
    >
      {cargando ? (
        <Loading text="Cargando reservas" />
      ) : error ? (
        <p className="admin-user-error-text">⚠ {error}</p>
      ) : reservas.length === 0 ? (
        <p className="admin-user-empty-text">
          — Sin reservas registradas
        </p>
      ) : (
        <div className="admin-user-reservas-list">
          {reservas.map((r) => (
            <div key={r.id} className="admin-user-reserva-card">
              <div>
                <p className="admin-user-reserva-title">
                  {r.evento?.nombre ?? "Evento desconocido"}
                </p>
                <p className="admin-user-reserva-info">
                  {r.codigoReserva} · {r.cantidadEntradas} entrada
                  {r.cantidadEntradas !== 1 ? "s" : ""} · {r.precioTotal.toFixed(2)}€
                </p>
                <p className="admin-user-reserva-date">
                  {formatFecha(r.fechaReserva)}
                </p>
              </div>
              <span className={`tag ${estadoTag[r.estado] ?? "tag-muted"}`}>
                {r.estado}
              </span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// ── Modal Confirmar Eliminación ────────────────────────
function ModalEliminarUsuario({
  usuario,
  onClose,
  onEliminado,
}: {
  usuario: Usuario;
  onClose: () => void;
  onEliminado: (id: number) => void;
}) {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState("");

  const handleEliminar = async () => {
    setEliminando(true);
    setError("");
    try {
      await deleteUsuario(usuario.id);
      onEliminado(usuario.id);
    } catch {
      setError("No se pudo eliminar el usuario.");
      setEliminando(false);
    }
  };

  return (
    <Modal titulo="ELIMINAR USUARIO" onClose={onClose} accentClass="modal-accent-magenta">
      <p className="admin-user-delete-text">
        ¿Estás seguro de que quieres eliminar a{" "}
        <strong className="admin-user-delete-name">
          {usuario.nombre} {usuario.apellidos}
        </strong>
        ? Esta acción es irreversible y eliminará todas sus reservas y entradas.
      </p>

      {error && (
        <p className="admin-user-error-text admin-user-error-text-spaced">⚠ {error}</p>
      )}

      <div className="admin-user-modal-actions">
        <button
          className="btn btn-danger admin-user-flex-button"
          onClick={handleEliminar}
          disabled={eliminando}
        >
          {eliminando ? "Eliminando..." : "Sí, eliminar"}
        </button>
        <button className="btn btn-secondary admin-user-flex-button" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </Modal>
  );
}

// ── Página principal ───────────────────────────────────
function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [modal, setModal] = useState<ModalState>({ tipo: null, usuario: null });

  useEffect(() => {
    getUsuarios()
      .then(setUsuarios)
      .catch(() => setError("No se pudieron cargar los usuarios."))
      .finally(() => setCargando(false));
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return usuarios.filter((u) => {
      const coincideTexto =
        u.nombre.toLowerCase().includes(texto) ||
        u.apellidos.toLowerCase().includes(texto) ||
        u.email.toLowerCase().includes(texto);
      const coincideRol = filtroRol === "" || u.rol === filtroRol;
      const coincideEstado =
        filtroEstado === "" ||
        (filtroEstado === "activo" ? u.activo : !u.activo);
      return coincideTexto && coincideRol && coincideEstado;
    });
  }, [usuarios, busqueda, filtroRol, filtroEstado]);

  const handleToggleEstado = async (u: Usuario) => {
    try {
      const actualizado = await cambiarEstadoUsuario(u.id, !u.activo);
      setUsuarios((prev) => prev.map((x) => (x.id === u.id ? actualizado : x)));
    } catch {
      alert("No se pudo cambiar el estado del usuario.");
    }
  };

  const handleCambiarRol = async (u: Usuario, rol: RolUsuario) => {
    try {
      const actualizado = await cambiarRolUsuario(u.id, rol);
      setUsuarios((prev) => prev.map((x) => (x.id === u.id ? actualizado : x)));
    } catch {
      alert("No se pudo cambiar el rol del usuario.");
    }
  };

  const abrirModal = (tipo: ModalTipo, usuario: Usuario) =>
    setModal({ tipo, usuario });
  const cerrarModal = () => setModal({ tipo: null, usuario: null });

  // Contadores summary
  const totalActivos = usuarios.filter((u) => u.activo).length;
  const totalAdmins = usuarios.filter((u) => u.rol === "ADMIN").length;
  const totalOrganizadores = usuarios.filter((u) => u.rol === "ORGANIZADOR").length;

  if (cargando) {
    return (
      <section className="page">
        <div className="container">
          <Loading text="Cargando usuarios" />
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        {/* ── Cabecera ── */}
        <div className="admin-user-page-header">
          <h2 className="page-title">
            GESTIÓN <span className="page-title-accent">USUARIOS</span>
          </h2>
          <p className="page-subtitle">
            Modifica roles, activa o desactiva cuentas y consulta las reservas de cada usuario.
          </p>
        </div>

        {error && (
          <div className="admin-user-error-box admin-user-page-error">
            ⚠ {error}
          </div>
        )}

        {/* ── Summary cards ── */}
        <div className="summary-grid">
          {[
            { label: "Total usuarios", value: usuarios.length, className: "summary-value-cyan" },
            { label: "Activos", value: totalActivos, className: "summary-value-acid" },
            { label: "Admins", value: totalAdmins, className: "summary-value-magenta" },
            { label: "Organizadores", value: totalOrganizadores, className: "summary-value-purple" },
          ].map(({ label, value, className }) => (
            <div key={label} className="admin-user-summary-card">
              <p className="admin-user-summary-label">
                {label}
              </p>
              <p className={`admin-user-summary-value ${className}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Filtros ── */}
        <div className="filters-bar admin-user-filters-bar">
          <input
            type="text"
            placeholder="Buscar por nombre, apellidos o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="form-input"
          />
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="form-select admin-user-filter-select"
          >
            <option value="">Todos los roles</option>
            <option value="ADMIN">Admin</option>
            <option value="ORGANIZADOR">Organizador</option>
            <option value="USUARIO">Usuario</option>
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="form-select admin-user-filter-select"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>

        {/* ── Tabla ── */}
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-user-table-empty">
                    — Sin resultados
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((u) => (
                  <tr key={u.id}>
                    {/* Nombre */}
                    <td>
                      <div>
                        <p className="admin-user-table-name">
                          {u.nombre} {u.apellidos}
                        </p>
                        <p className="admin-user-table-id">
                          #{u.id}
                        </p>
                      </div>
                    </td>

                    {/* Email */}
                    <td>
                      <span className="admin-user-table-email">
                        {u.email}
                      </span>
                    </td>

                    {/* Rol — select inline */}
                    <td>
                      <select
                        value={u.rol}
                        onChange={(e) =>
                          handleCambiarRol(u, e.target.value as RolUsuario)
                        }
                        className="form-select admin-user-role-select"
                      >
                        <option value="USUARIO">USUARIO</option>
                        <option value="ORGANIZADOR">ORGANIZADOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    {/* Estado toggle */}
                    <td>
                      <button
                        onClick={() => handleToggleEstado(u)}
                        className={`tag ${estadoColor(u.activo)} admin-user-status-button`}
                        title={u.activo ? "Clic para desactivar" : "Clic para activar"}
                      >
                        {u.activo ? "● ACTIVO" : "○ INACTIVO"}
                      </button>
                    </td>

                    {/* Fecha registro */}
                    <td>
                      <span className="admin-user-table-date">
                        {formatFecha(u.fechaRegistro)}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => abrirModal("editar", u)}
                          title="Editar usuario"
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm admin-user-reservas-button"
                          onClick={() => abrirModal("reservas", u)}
                          title="Ver reservas"
                        >
                          Reservas
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => abrirModal("eliminar", u)}
                          title="Eliminar usuario"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="admin-user-results-count">
          {usuariosFiltrados.length} de {usuarios.length} usuarios
        </p>
      </div>

      {/* ── Modales ── */}
      {modal.tipo === "editar" && modal.usuario && (
        <ModalEditarUsuario
          usuario={modal.usuario}
          onClose={cerrarModal}
          onGuardado={(actualizado) => {
            setUsuarios((prev) =>
              prev.map((u) => (u.id === actualizado.id ? actualizado : u))
            );
            cerrarModal();
          }}
        />
      )}

      {modal.tipo === "reservas" && modal.usuario && (
        <ModalReservasUsuario
          usuario={modal.usuario}
          onClose={cerrarModal}
        />
      )}

      {modal.tipo === "eliminar" && modal.usuario && (
        <ModalEliminarUsuario
          usuario={modal.usuario}
          onClose={cerrarModal}
          onEliminado={(id) => {
            setUsuarios((prev) => prev.filter((u) => u.id !== id));
            cerrarModal();
          }}
        />
      )}
    </section>
  );
}

export default AdminUsuariosPage;
