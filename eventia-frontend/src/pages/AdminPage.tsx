import { useEffect, useState } from "react";
import { getEventos } from "../services-api/eventoService";
import type { Evento } from "../types/evento";
import Loading from "../components/ui/Loading";
import SummaryCard from "../components/dashboard/SummaryCard";

function AdminPage() {
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
        setError("No se pudieron cargar los datos.");
      } finally {
        setCargando(false);
      }
    };

    cargarEventos();
  }, []);

  const publicados = eventos.filter(
    (evento) => evento.estado === "PUBLICADO"
  ).length;

  const cancelados = eventos.filter(
    (evento) => evento.estado === "CANCELADO"
  ).length;

  if (cargando) {
    return <Loading text="Cargando panel admin" />;
  }

  return (
    <section className="page">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <h2 className="page-title">
            PANEL <span className="page-title-accent">ADMIN</span>
          </h2>

          <p className="page-subtitle">
            Supervisión global de la plataforma Eventia.
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
            title="Cancelados"
            value={cancelados}
            accentColor="var(--neon-magenta)"
          />
        </div>

        <div className="card card-glow-cyan">
          <h3
            style={{
              marginBottom: 24,
              fontFamily: "var(--font-display)",
            }}
          >
            Estado del sistema
          </h3>

          <p>
            Eventos registrados: {eventos.length}
          </p>

          <p>
            Eventos publicados: {publicados}
          </p>

          <p>
            Eventos cancelados: {cancelados}
          </p>
        </div>
      </div>
    </section>
  );
}

export default AdminPage;