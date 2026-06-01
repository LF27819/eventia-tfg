import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventoById } from "../services-api/eventoService";
import type { Evento, EstadoEvento, TipoEvento } from "../types/evento";
import Loading from "../components/ui/Loading";

function tipoEventoTag(tipo: TipoEvento): string {
  switch (tipo) {
    case "FESTIVAL":
      return "tag-acid";
    case "CONCIERTO":
      return "tag-cyan";
    case "SESION":
      return "tag-magenta";
    default:
      return "tag-purple";
  }
}

function estadoEventoTag(estado: EstadoEvento): string {
  switch (estado) {
    case "PUBLICADO":
      return "tag-cyan";
    case "BORRADOR":
      return "tag-muted";
    case "CANCELADO":
      return "tag-orange";
    case "FINALIZADO":
      return "tag-purple";
    default:
      return "tag-muted";
  }
}

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatHora(fecha: string): string {
  return new Date(fecha).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventDetailPage() {
  const { id } = useParams();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarEvento = async () => {
      if (!id) {
        setError("Evento no encontrado");
        setCargando(false);
        return;
      }

      try {
        const data = await getEventoById(Number(id));
        setEvento(data);
      } catch (error) {
        console.error("Error al cargar evento:", error);
        setError("No se pudo cargar el evento");
      } finally {
        setCargando(false);
      }
    };

    cargarEvento();
  }, [id]);

  if (cargando) {
    return (
      <section className="page">
        <div className="container">
          <Loading text="Cargando evento" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <div className="container">
          <div className="msg-error">⚠ {error}</div>
        </div>
      </section>
    );
  }

  if (!evento) {
    return (
      <section className="page">
        <div className="container">
          <p style={{ color: "var(--text-dim)" }}>Evento no encontrado.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div style={{ marginBottom: 24 }}>
          <Link
            to="/eventos"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.74rem",
              letterSpacing: "0.12em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            ← Volver a eventos
          </Link>
        </div>

        <div className="detail-hero">
          {evento.imagenUrl ? (
            <img
              src={evento.imagenUrl}
              alt={evento.nombre}
              className="detail-hero-img"
            />
          ) : (
            <div className="detail-hero-placeholder">
              {evento.tipoEvento} · {evento.nombre.toUpperCase()}
            </div>
          )}

          <div className="detail-content">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className={`tag ${tipoEventoTag(evento.tipoEvento)}`}>
                {evento.tipoEvento}
              </span>

              <span className={`tag ${estadoEventoTag(evento.estado)}`}>
                {evento.estado}
              </span>

              {evento.edadMinima > 0 && (
                <span className="tag tag-orange">+{evento.edadMinima}</span>
              )}
            </div>

            <h2 className="detail-title">{evento.nombre}</h2>

            <p className="detail-desc">
              {evento.descripcion || "Una experiencia única dentro de Eventia."}
            </p>

            <div className="detail-grid">
              <div className="detail-stat">
                <div className="detail-stat-value">
                  {formatFecha(evento.fechaInicio)}
                </div>
                <div className="detail-stat-label">Fecha inicio</div>
              </div>

              <div className="detail-stat">
                <div
                  className="detail-stat-value"
                  style={{ color: "var(--neon-magenta)" }}
                >
                  {formatHora(evento.fechaInicio)}
                </div>
                <div className="detail-stat-label">Hora</div>
              </div>

              <div className="detail-stat">
                <div
                  className="detail-stat-value"
                  style={{ color: "var(--neon-acid)" }}
                >
                  {evento.precioBase === 0 ? "FREE" : `${evento.precioBase}€`}
                </div>
                <div className="detail-stat-label">Precio</div>
              </div>

              <div className="detail-stat">
                <div
                  className="detail-stat-value"
                  style={{
                    color:
                      evento.entradasDisponibles < 50
                        ? "var(--neon-orange)"
                        : "var(--neon-cyan)",
                  }}
                >
                  {evento.entradasDisponibles}
                </div>
                <div className="detail-stat-label">Entradas disp.</div>
              </div>
            </div>

            {evento.artistas && evento.artistas.length > 0 && (
              <>
                <h3 className="detail-section-title">CARTEL</h3>

                <div className="artists-list">
                  {evento.artistas.map((artista) => (
                    <div key={artista.id} className="artist-chip">
                      <span>{artista.nombreArtistico}</span>

                      {artista.generoMusical && (
                        <span className="artist-chip-genre">
                          {artista.generoMusical}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {evento.recinto && (
              <>
                <h3 className="detail-section-title">RECINTO</h3>

                <div
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "20px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "24px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.2rem",
                        letterSpacing: "0.03em",
                        color: "var(--neon-cyan)",
                        marginBottom: 4,
                      }}
                    >
                      {evento.recinto.nombre}
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.76rem",
                        color: "var(--text-muted)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {evento.recinto.direccion}, {evento.recinto.ciudad}
                    </div>
                  </div>

                  {evento.recinto.aforo > 0 && (
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.2rem",
                          color: "var(--neon-magenta)",
                        }}
                      >
                        {evento.recinto.aforo.toLocaleString()}
                      </div>

                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.68rem",
                          color: "var(--text-dim)",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        }}
                      >
                        Aforo
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventDetailPage;