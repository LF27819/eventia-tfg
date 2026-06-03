import { useEffect, useMemo, useState } from "react";
import { getRecintos } from "../services-api/recintoService";
import { getEventos } from "../services-api/eventoService";
import type { Recinto } from "../types/recinto";
import type { Evento } from "../types/evento";
import Loading from "../components/ui/Loading";
import SummaryCard from "../components/dashboard/SummaryCard";
import VenueCard from "../components/venues/VenueCard";

function OrganizerVenuesPage() {
  const [recintos, setRecintos] = useState<Recinto[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [soloConEventos, setSoloConEventos] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [recintosData, eventosData] = await Promise.all([
          getRecintos(),
          getEventos(),
        ]);

        setRecintos(recintosData);
        setEventos(eventosData);
      } catch (error) {
        console.error("Error al cargar recintos:", error);
        setError("No se pudieron cargar los recintos.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const contarEventosPorRecinto = (recintoId: number): number => {
    return eventos.filter((evento) => evento.recinto?.id === recintoId).length;
  };

  const recintosFiltrados = useMemo(() => {
    return recintos.filter((recinto) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        recinto.nombre.toLowerCase().includes(texto) ||
        recinto.ciudad.toLowerCase().includes(texto) ||
        recinto.provincia.toLowerCase().includes(texto);

      const eventosProgramados = contarEventosPorRecinto(recinto.id);

      const coincideActividad =
        !soloConEventos || eventosProgramados > 0;

      return coincideBusqueda && coincideActividad;
    });
  }, [recintos, eventos, busqueda, soloConEventos]);

  const recintosConEventos = recintos.filter(
    (recinto) => contarEventosPorRecinto(recinto.id) > 0
  ).length;

  const aforoTotal = recintos.reduce(
    (total, recinto) => total + recinto.aforo,
    0
  );

  if (cargando) {
    return (
      <section className="page">
        <div className="container">
          <Loading text="Cargando recintos" />
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
              RECINTOS <span className="page-title-accent">ORGANIZADOR</span>
            </h2>

            <p className="page-subtitle">
              Consulta los espacios disponibles y su actividad programada.
            </p>
          </div>
        </div>

        {error && <div className="msg-error">⚠ {error}</div>}

        <div className="summary-grid">
          <SummaryCard title="Recintos" value={recintos.length} />

          <SummaryCard
            title="Con eventos"
            value={recintosConEventos}
            accentColor="var(--neon-acid)"
          />

          <SummaryCard
            title="Aforo total"
            value={aforoTotal.toLocaleString()}
            accentColor="var(--neon-magenta)"
          />
        </div>

        <div className="filters-bar" style={{ marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Buscar por recinto, ciudad o provincia..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="form-input"
          />

          <button
            type="button"
            className={soloConEventos ? "btn btn-acid" : "btn btn-secondary"}
            onClick={() => setSoloConEventos((actual) => !actual)}
          >
            {soloConEventos ? "Mostrando activos" : "Solo con eventos"}
          </button>
        </div>

        <div className="venues-grid">
          {recintosFiltrados.map((recinto) => (
            <VenueCard
              key={recinto.id}
              recinto={recinto}
              eventosProgramados={contarEventosPorRecinto(recinto.id)}
            />
          ))}
        </div>

        {recintosFiltrados.length === 0 && (
          <p className="page-subtitle" style={{ marginTop: 32 }}>
            No hay recintos que coincidan con los filtros.
          </p>
        )}
      </div>
    </section>
  );
}

export default OrganizerVenuesPage;