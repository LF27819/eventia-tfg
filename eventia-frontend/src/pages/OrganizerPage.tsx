import { useEffect, useState } from "react";
import { getEventos } from "../services-api/eventoService";
import type { Evento } from "../types/evento";
import Loading from "../components/ui/Loading";
import SummaryCard from "../components/dashboard/SummaryCard";

function OrganizerPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const data = await getEventos();
        setEventos(data);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los eventos.");
      } finally {
        setCargando(false);
      }
    };

    cargarEventos();
  }, []);

  const publicados = eventos.filter(
    (evento) => evento.estado === "PUBLICADO"
  ).length;

  const entradasDisponibles = eventos.reduce(
    (total, evento) => total + evento.entradasDisponibles,
    0
  );

  if (cargando) {
    return <Loading text="Cargando panel organizador" />;
  }

  return (
    <section className="page">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <h2 className="page-title">
            PANEL <span className="page-title-accent">ORGANIZADOR</span>
          </h2>

          <p className="page-subtitle">
            Gestiona tus eventos y controla la actividad.
          </p>
        </div>

        {error && <div className="msg-error">⚠ {error}</div>}

        <div className="summary-grid">
          <SummaryCard
            title="Eventos"
            value={eventos.length}
          />

          <SummaryCard
            title="Publicados"
            value={publicados}
            accentColor="var(--neon-acid)"
          />

          <SummaryCard
            title="Entradas"
            value={entradasDisponibles.toLocaleString()}
            accentColor="var(--neon-magenta)"
          />
        </div>

        <div className="events-grid">
          {eventos.map((evento) => (
            <div key={evento.id} className="event-card">
              <div className="event-card-content">
                <span className="tag tag-cyan">
                  {evento.tipoEvento}
                </span>

                <h3>{evento.nombre}</h3>

                <p>
                  {new Date(evento.fechaInicio).toLocaleDateString("es-ES")}
                </p>

                <p>
                  {evento.recinto?.nombre}
                </p>

                <div style={{ marginTop: 16 }}>
                  <span
                    className={`tag ${
                      evento.estado === "PUBLICADO"
                        ? "tag-acid"
                        : "tag-magenta"
                    }`}
                  >
                    {evento.estado}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OrganizerPage;