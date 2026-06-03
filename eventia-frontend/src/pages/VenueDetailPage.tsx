import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { getRecintoById } from "../services-api/recintoService";
import { getEventos } from "../services-api/eventoService";
import { useAuth } from "../context/AuthContext";
import type { Recinto } from "../types/recinto";
import type { Evento } from "../types/evento";
import Loading from "../components/ui/Loading";

function VenueDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [recinto, setRecinto] = useState<Recinto | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const puedeVerDatosInternos =
    user?.rol === "ORGANIZADOR" || user?.rol === "ADMIN";

  useEffect(() => {
    const cargarDatos = async () => {
      if (!id) return;

      try {
        const [recintoData, eventosData] = await Promise.all([
          getRecintoById(Number(id)),
          getEventos(),
        ]);

        setRecinto(recintoData);
        setEventos(eventosData);
      } catch (error) {
        console.error("Error al cargar recinto:", error);
        setError("No se pudo cargar el recinto.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  const eventosDelRecinto = useMemo(() => {
    if (!recinto) return [];

    return eventos.filter((evento) => evento.recinto?.id === recinto.id);
  }, [eventos, recinto]);

  if (cargando) {
    return (
      <section className="page">
        <div className="container">
          <Loading text="Cargando recinto" />
        </div>
      </section>
    );
  }

  if (error || !recinto) {
    return (
      <section className="page">
        <div className="container">
          <div className="msg-error">⚠ {error || "Recinto no encontrado"}</div>
        </div>
      </section>
    );
  }

  const tieneCoordenadas = recinto.latitud && recinto.longitud;

  return (
    <section className="page">
      <div className="container">
        <div style={{ marginBottom: 24 }}>
          <Link to="/eventos" className="back-link">
            ← Volver a eventos
          </Link>
        </div>

        <div className="venue-detail-hero">
          <div className="venue-detail-image-wrapper">
            {recinto.imagenUrl ? (
              <img
                src={recinto.imagenUrl}
                alt={recinto.nombre}
                className="venue-detail-image"
              />
            ) : (
              <div className="venue-detail-placeholder">{recinto.nombre}</div>
            )}
          </div>

          <div className="venue-detail-content">
            <div className="artist-detail-tags">
              <span className="tag tag-cyan">RECINTO</span>
              <span className="tag tag-magenta">{recinto.ciudad}</span>
              <span className="tag tag-acid">
                {eventosDelRecinto.length} eventos
              </span>
            </div>

            <h2 className="artist-detail-title">{recinto.nombre}</h2>

            <p className="artist-detail-real-name">
              {recinto.ciudad}, {recinto.provincia}
            </p>

            <p className="artist-detail-description">
              {recinto.descripcion ||
                "Espacio disponible dentro del circuito Eventia."}
            </p>

            <div className="venue-detail-grid">
              <div>
                <span>Aforo</span>
                <strong>{recinto.aforo.toLocaleString()}</strong>
              </div>

              <div>
                <span>Eventos</span>
                <strong>{eventosDelRecinto.length}</strong>
              </div>

              <div>
                <span>Provincia</span>
                <strong>{recinto.provincia}</strong>
              </div>
            </div>

            <div className="location-mini-panel">
              <span className="tag tag-magenta">DIRECCIÓN</span>
              <p>{recinto.direccion}</p>
            </div>

            {puedeVerDatosInternos && (
              <div className="artist-internal-panel">
                <span className="tag tag-orange">DATOS ORGANIZACIÓN</span>

                <div className="artist-internal-grid">
                  <div>
                    <span>Aforo total</span>
                    <strong>{recinto.aforo.toLocaleString()}</strong>
                  </div>

                  <div>
                    <span>Eventos activos</span>
                    <strong>{eventosDelRecinto.length}</strong>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>

        {tieneCoordenadas && (
          <>
            <h3 className="detail-section-title">UBICACIÓN</h3>

            <div className="location-panel">
              <div className="location-info">
                <h4>{recinto.nombre}</h4>
                <p>{recinto.direccion}</p>
                <p>
                  {recinto.ciudad}, {recinto.provincia}
                </p>
                <p>Aforo: {recinto.aforo.toLocaleString()} personas</p>
              </div>

              <div className="map-wrapper map-wrapper-neon">
                <MapContainer
                  center={[recinto.latitud!, recinto.longitud!]}
                  zoom={15}
                  className="event-map"
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />

                  <Marker position={[recinto.latitud!, recinto.longitud!]}>
                    <Popup>
                      <strong>{recinto.nombre}</strong>
                      <br />
                      {recinto.direccion}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </>
        )}

        <h3 className="detail-section-title">EVENTOS EN ESTE RECINTO</h3>

        {eventosDelRecinto.length === 0 ? (
          <p className="page-subtitle">
            Todavía no hay eventos programados en este recinto.
          </p>
        ) : (
          <div className="artist-events-grid">
            {eventosDelRecinto.map((evento) => (
              <Link
                key={evento.id}
                to={`/eventos/${evento.id}`}
                className="artist-event-card"
              >
                <span className="tag tag-cyan">{evento.tipoEvento}</span>
                <h4>{evento.nombre}</h4>
                <p>
                  {new Date(evento.fechaInicio).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default VenueDetailPage;