import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaInstagram, FaSpotify } from "react-icons/fa";
import { getArtistaById } from "../services-api/artistaService";
import { getEventos } from "../services-api/eventoService";
import { useAuth } from "../context/AuthContext";
import type { Artista } from "../types/artista";
import type { Evento } from "../types/evento";
import Loading from "../components/ui/Loading";

function ArtistDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [artista, setArtista] = useState<Artista | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const puedeVerDatosInternos =
    user?.rol === "ORGANIZADOR" || user?.rol === "ADMIN";

  useEffect(() => {
    const cargarDatos = async () => {
      if (!id) return;

      try {
        const [artistaData, eventosData] = await Promise.all([
          getArtistaById(Number(id)),
          getEventos(),
        ]);

        setArtista(artistaData);
        setEventos(eventosData);
      } catch (error) {
        console.error("Error al cargar artista:", error);
        setError("No se pudo cargar el artista.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  const eventosDelArtista = useMemo(() => {
    if (!artista) return [];

    return eventos.filter((evento) =>
      evento.artistas?.some((a) => a.id === artista.id)
    );
  }, [eventos, artista]);

  if (cargando) {
    return (
      <section className="page">
        <div className="container">
          <Loading text="Cargando artista" />
        </div>
      </section>
    );
  }

  if (error || !artista) {
    return (
      <section className="page">
        <div className="container">
          <div className="msg-error">⚠ {error || "Artista no encontrado"}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div style={{ marginBottom: 24 }}>
          <Link to="/artistas" className="back-link">
            ← Volver a artistas
          </Link>
        </div>

        <div className="artist-detail-hero">
          <div className="artist-detail-image-wrapper">
            {artista.imagenUrl ? (
              <img
                src={artista.imagenUrl}
                alt={artista.nombreArtistico}
                className="artist-detail-image"
              />
            ) : (
              <div className="artist-detail-placeholder">
                {artista.nombreArtistico}
              </div>
            )}
          </div>

          <div className="artist-detail-content">
            <div className="artist-detail-tags">
              <span className="tag tag-cyan">
                {artista.generoMusical || "ARTISTA"}
              </span>

              {puedeVerDatosInternos && (
                <span className={artista.activo ? "tag tag-acid" : "tag tag-muted"}>
                  {artista.activo ? "ACTIVO" : "INACTIVO"}
                </span>
              )}
            </div>

            <h2 className="artist-detail-title">{artista.nombreArtistico}</h2>

            {artista.nombreReal && (
              <p className="artist-detail-real-name">{artista.nombreReal}</p>
            )}

            <p className="artist-detail-description">
              {artista.descripcion ||
                "Artista dentro del universo Eventia, presente en algunos de los eventos más potentes de la plataforma."}
            </p>

            <div className="artist-detail-links">
              {artista.instagram && (
                <a
                  href={artista.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="artist-social artist-social-instagram"
                >
                  <FaInstagram />
                  <span>Instagram</span>
                </a>
              )}

              {artista.spotify && (
                <a
                  href={artista.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="artist-social artist-social-spotify"
                >
                  <FaSpotify />
                  <span>Spotify</span>
                </a>
              )}
            </div>

            {puedeVerDatosInternos && (
              <div className="artist-internal-panel">
                <span className="tag tag-orange">DATOS CONTRATACIÓN</span>

                <div className="artist-internal-grid">
                  <div>
                    <span>Caché</span>
                    <strong>
                      {artista.cache != null
                        ? `${artista.cache.toLocaleString()}€`
                        : "No definido"}
                    </strong>
                  </div>

                  <div>
                    <span>Estado</span>
                    <strong>{artista.activo ? "Activo" : "Inactivo"}</strong>
                  </div>

                  <div>
                    <span>Eventos</span>
                    <strong>{eventosDelArtista.length}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <h3 className="detail-section-title">EVENTOS DONDE ACTÚA</h3>

        {eventosDelArtista.length === 0 ? (
          <p className="page-subtitle">
            Este artista todavía no tiene eventos programados.
          </p>
        ) : (
          <div className="artist-events-grid">
            {eventosDelArtista.map((evento) => (
              <Link
                key={evento.id}
                to={`/eventos/${evento.id}`}
                className="artist-event-card"
              >
                <span className="tag tag-cyan">{evento.tipoEvento}</span>
                <h4>{evento.nombre}</h4>
                <p>
                  {evento.recinto?.nombre}, {evento.recinto?.ciudad}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ArtistDetailPage;