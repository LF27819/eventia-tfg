import { useEffect, useMemo, useState } from "react";
import { getEventos } from "../services-api/eventoService";
import type { Evento } from "../types/evento";
import EventCard from "../components/events/EventCard";
import Loading from "../components/ui/Loading";

function EventsPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const data = await getEventos();
        setEventos(data);
      } catch (err) {
        console.error("Error al cargar eventos:", err);
        setError("No se pudieron cargar los eventos");
      } finally {
        setCargando(false);
      }
    };

    cargarEventos();
  }, []);

  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) => {
      const texto = busqueda.toLowerCase();

      const coincideNombre =
        evento.nombre.toLowerCase().includes(texto) ||
        evento.recinto?.ciudad?.toLowerCase().includes(texto) ||
        evento.artistas?.some((artista) =>
          artista.nombreArtistico.toLowerCase().includes(texto)
        );

      const coincideTipo =
        tipoSeleccionado === "" || evento.tipoEvento === tipoSeleccionado;

      return coincideNombre && coincideTipo;
    });
  }, [eventos, busqueda, tipoSeleccionado]);

  return (
    <section className="page">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <h2 className="page-title">
            <span className="page-title-accent">EVENTOS</span>
          </h2>

          <p className="page-subtitle">
            {eventos.length > 0
              ? `${eventosFiltrados.length} eventos encontrados`
              : "Cargando cartel..."}
          </p>
        </div>

        <div className="filters-bar">
          <input
            className="form-input"
            type="text"
            placeholder="Buscar por nombre, ciudad o artista..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select
            className="form-select"
            value={tipoSeleccionado}
            onChange={(e) => setTipoSeleccionado(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="FESTIVAL">Festival</option>
            <option value="CONCIERTO">Concierto</option>
            <option value="SESION">Sesión</option>
            <option value="FIESTA">Fiesta</option>
            <option value="STREAM">Stream</option>
          </select>
        </div>

        {cargando && <Loading text="Cargando eventos" />}

        {error && (
          <div className="msg-error">
            <span>⚠</span> {error}
          </div>
        )}

        {!cargando && !error && (
          <>
            {eventosFiltrados.length === 0 ? (
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.82rem",
                  color: "var(--text-dim)",
                  letterSpacing: "0.1em",
                  padding: "48px 0",
                  textAlign: "center",
                }}
              >
                // NO HAY EVENTOS CON ESE FILTRO
              </p>
            ) : (
              <div className="events-grid">
                {eventosFiltrados.map((evento, index) => (
                  <EventCard
                    key={evento.id}
                    evento={evento}
                    style={{ animationDelay: `${index * 0.04}s` }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default EventsPage;