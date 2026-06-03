import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getEventos, deleteEvento, publicarEvento } from "../services-api/eventoService";
import type { Evento } from "../types/evento";
import SummaryCard from "../components/dashboard/SummaryCard";
import Loading from "../components/ui/Loading";

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function estadoTag(estado: string): string {
  switch (estado) {
    case "PUBLICADO":
      return "tag-acid";
    case "BORRADOR":
      return "tag-cyan";
    case "CANCELADO":
      return "tag-magenta";
    case "FINALIZADO":
      return "tag-purple";
    default:
      return "tag-muted";
  }
}

function OrganizerPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");
  const [orden, setOrden] = useState<"fecha" | "precio">("fecha");

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      const data = await getEventos();
      setEventos(data);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      setError("No se pudieron cargar los eventos.");
    } finally {
      setCargando(false);
    }
  };

  const eventosFiltrados = useMemo(() => {
    return eventos
      .filter((evento) => {
        const texto = busqueda.toLowerCase();

        const coincideBusqueda =
          evento.nombre.toLowerCase().includes(texto) ||
          evento.recinto?.nombre?.toLowerCase().includes(texto) ||
          evento.recinto?.ciudad?.toLowerCase().includes(texto);

        const coincideEstado =
          estado === "" || evento.estado === estado;

        return coincideBusqueda && coincideEstado;
      })
      .sort((a, b) => {
        if (orden === "precio") {
          return a.precioBase - b.precioBase;
        }

        return (
          new Date(a.fechaInicio).getTime() -
          new Date(b.fechaInicio).getTime()
        );
      });
  }, [eventos, busqueda, estado, orden]);

  const publicados = eventos.filter(
    (evento) => evento.estado === "PUBLICADO"
  ).length;

  const entradasDisponibles = eventos.reduce(
    (total, evento) => total + evento.entradasDisponibles,
    0
  );

  const handlePublicar = async (id: number) => {
    try {
      const actualizado = await publicarEvento(id);

      setEventos((actuales) =>
        actuales.map((evento) =>
          evento.id === id ? actualizado : evento
        )
      );
    } catch (error) {
      console.error("Error al publicar evento:", error);
      setError("No se pudo publicar el evento.");
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este evento?"
    );

    if (!confirmar) return;

    try {
      await deleteEvento(id);
      setEventos((actuales) => actuales.filter((evento) => evento.id !== id));
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      setError("No se pudo eliminar el evento.");
    }
  };

  if (cargando) {
    return (
      <section className="page">
        <div className="container">
          <Loading text="Cargando panel organizador" />
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h2 className="page-title">
              PANEL <span className="page-title-accent">ORGANIZADOR</span>
            </h2>

            <p className="page-subtitle">
              Gestiona eventos, controla disponibilidad y prepara nuevas
              experiencias.
            </p>
          </div>

          <Link to="/organizador/eventos/nuevo" className="btn btn-acid">
            Crear evento
          </Link>
        </div>

        {error && <div className="msg-error">⚠ {error}</div>}

        <div className="summary-grid">
          <SummaryCard title="Eventos" value={eventos.length} />

          <SummaryCard
            title="Publicados"
            value={publicados}
            accentColor="var(--neon-acid)"
          />

          <SummaryCard
            title="Entradas disp."
            value={entradasDisponibles.toLocaleString()}
            accentColor="var(--neon-magenta)"
          />
        </div>

        <div className="filters-bar" style={{ marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Buscar por evento, recinto o ciudad..."
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
            <option value="PUBLICADO">Publicados</option>
            <option value="BORRADOR">Borradores</option>
            <option value="CANCELADO">Cancelados</option>
            <option value="FINALIZADO">Finalizados</option>
          </select>

          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as "fecha" | "precio")}
            className="form-select"
            style={{ maxWidth: 180 }}
          >
            <option value="fecha">Ordenar por fecha</option>
            <option value="precio">Ordenar por precio</option>
          </select>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Recinto</th>
                <th>Precio</th>
                <th>Entradas</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {eventosFiltrados.map((evento) => (
                <tr key={evento.id}>
                  <td>
                    <strong>{evento.nombre}</strong>
                  </td>

                  <td>
                    <span className="tag tag-cyan">{evento.tipoEvento}</span>
                  </td>

                  <td>{formatFecha(evento.fechaInicio)}</td>

                  <td>
                    {evento.recinto?.nombre}
                    <br />
                    <span style={{ color: "var(--text-dim)" }}>
                      {evento.recinto?.ciudad}
                    </span>
                  </td>

                  <td style={{ color: "var(--neon-acid)" }}>
                    {evento.precioBase}€
                  </td>

                  <td>{evento.entradasDisponibles}</td>

                  <td>
                    <span className={`tag ${estadoTag(evento.estado)}`}>
                      {evento.estado}
                    </span>
                  </td>

                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/eventos/${evento.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Ver
                      </Link>

                      {/* Si esta en borrador sale boton publicar, sino no */}
                      {evento.estado === "BORRADOR" && (
                        <button
                          type="button"
                          className="btn btn-acid btn-sm"
                          onClick={() => handlePublicar(evento.id)}
                        >
                          Publicar
                        </button>
                      )}

                      <Link
                        to={`/organizador/eventos/${evento.id}/editar`}
                        className="btn btn-primary btn-sm"
                      >
                        Editar
                      </Link>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleEliminar(evento.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {eventosFiltrados.length === 0 && (
          <p className="page-subtitle" style={{ marginTop: 32 }}>
            No hay eventos que coincidan con los filtros.
          </p>
        )}
      </div>
    </section>
  );
}

export default OrganizerPage;