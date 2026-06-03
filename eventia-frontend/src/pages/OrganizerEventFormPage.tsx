import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createEvento,
  getEventoById,
  updateEvento,
} from "../services-api/eventoService";
import { getRecintos } from "../services-api/recintoService";
import { useAuth } from "../context/AuthContext";
import type { Recinto } from "../types/recinto";
import Loading from "../components/ui/Loading";

function OrganizerEventFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const modoEdicion = Boolean(id);

  const [recintos, setRecintos] = useState<Recinto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoEvento, setTipoEvento] = useState("FESTIVAL");
  const [estado, setEstado] = useState("BORRADOR");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [precioBase, setPrecioBase] = useState(0);
  const [aforoTotal, setAforoTotal] = useState(1000);
  const [entradasDisponibles, setEntradasDisponibles] = useState(1000);
  const [edadMinima, setEdadMinima] = useState(18);
  const [imagenUrl, setImagenUrl] = useState("");
  const [recintoId, setRecintoId] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const recintosData = await getRecintos();
        setRecintos(recintosData);

        if (id) {
          const evento = await getEventoById(Number(id));

          setNombre(evento.nombre);
          setDescripcion(evento.descripcion);
          setTipoEvento(evento.tipoEvento);
          setEstado(evento.estado);
          setFechaInicio(evento.fechaInicio.slice(0, 16));
          setFechaFin(evento.fechaFin.slice(0, 16));
          setPrecioBase(evento.precioBase);
          setAforoTotal(evento.aforoTotal);
          setEntradasDisponibles(evento.entradasDisponibles);
          setEdadMinima(evento.edadMinima);
          setImagenUrl(evento.imagenUrl || "");
          setRecintoId(String(evento.recinto.id));
        }
      } catch (error) {
        console.error("Error al cargar formulario:", error);
        setError("No se pudieron cargar los datos del formulario.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id) {
      navigate("/login");
      return;
    }

    if (!recintoId) {
      setError("Selecciona un recinto.");
      return;
    }

    setGuardando(true);
    setError("");

    const payload = {
      nombre,
      descripcion,
      tipoEvento: tipoEvento as any,
      estado: modoEdicion ? (estado as any) : "BORRADOR",
      fechaInicio,
      fechaFin,
      precioBase,
      aforoTotal,
      entradasDisponibles,
      edadMinima,
      imagenUrl: imagenUrl || undefined,
      recinto: {
        id: Number(recintoId),
      } as any,
      organizador: {
        id: user.id,
      } as any,
      artistas: [],
    };

    try {
      if (modoEdicion && id) {
        await updateEvento(Number(id), payload);
      } else {
        await createEvento(payload);
      }

      navigate("/organizador");
    } catch (error) {
      console.error("Error al guardar evento:", error);
      setError("No se pudo guardar el evento.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <section className="page">
        <div className="container">
          <Loading text="Cargando formulario" />
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <h2 className="page-title">
            {modoEdicion ? "EDITAR" : "CREAR"}{" "}
            <span className="page-title-accent">EVENTO</span>
          </h2>

          <p className="page-subtitle">
            {modoEdicion
              ? "Modifica los datos del evento y guarda los cambios."
              : "El evento se guardará primero como borrador. Después podrás publicarlo desde el panel."}
          </p>
        </div>

        {error && <div className="msg-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit} className="card card-glow-cyan">
          <div className="auth-form">
            <div className="form-field">
              <label className="form-label">Nombre del evento</label>
              <input
                className="form-input"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-input"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={5}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <div className="form-field">
                <label className="form-label">Tipo</label>
                <select
                  className="form-select"
                  value={tipoEvento}
                  onChange={(e) => setTipoEvento(e.target.value)}
                >
                  <option value="FESTIVAL">Festival</option>
                  <option value="CONCIERTO">Concierto</option>
                  <option value="SESION">Sesión</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  disabled={!modoEdicion}
                >
                  <option value="BORRADOR">Borrador</option>
                  <option value="PUBLICADO">Publicado</option>
                  <option value="CANCELADO">Cancelado</option>
                  <option value="FINALIZADO">Finalizado</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Recinto</label>
                <select
                  className="form-select"
                  value={recintoId}
                  onChange={(e) => setRecintoId(e.target.value)}
                  required
                >
                  <option value="">Selecciona recinto</option>
                  {recintos.map((recinto) => (
                    <option key={recinto.id} value={recinto.id}>
                      {recinto.nombre} · {recinto.ciudad}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              <div className="form-field">
                <label className="form-label">Fecha inicio</label>
                <input
                  className="form-input"
                  type="datetime-local"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">Fecha fin</label>
                <input
                  className="form-input"
                  type="datetime-local"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              <div className="form-field">
                <label className="form-label">Precio base</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={precioBase}
                  onChange={(e) => setPrecioBase(Number(e.target.value))}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Aforo total</label>
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={aforoTotal}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setAforoTotal(value);
                    if (!modoEdicion) setEntradasDisponibles(value);
                  }}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Entradas disp.</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={entradasDisponibles}
                  onChange={(e) => setEntradasDisponibles(Number(e.target.value))}
                />
              </div>

              <div className="form-field">
                <label className="form-label">Edad mínima</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={edadMinima}
                  onChange={(e) => setEdadMinima(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Imagen URL</label>
              <input
                className="form-input"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/..."
              />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button type="submit" className="btn btn-acid" disabled={guardando}>
                {guardando
                  ? "Guardando..."
                  : modoEdicion
                  ? "Guardar cambios"
                  : "Guardar borrador"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/organizador")}
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default OrganizerEventFormPage;