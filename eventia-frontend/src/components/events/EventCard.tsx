import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import type { Evento, TipoEvento, EstadoEvento } from "../../types/evento";

interface EventCardProps {
  evento: Evento;
  style?: CSSProperties;
}

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatHora(fecha: string): string {
  return new Date(fecha).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

function EventCard({ evento, style }: EventCardProps) {
  const ticketsLow =
    evento.entradasDisponibles > 0 && evento.entradasDisponibles < 50;

  return (
    <article className="card card-glow-cyan event-card" style={style}>
      <div className="event-card-header">
        {evento.imagenUrl ? (
          <img
            src={evento.imagenUrl}
            alt={evento.nombre}
            className="event-card-img"
          />
        ) : (
          <div className="event-card-placeholder">{evento.tipoEvento}</div>
        )}

        <div className="event-card-header-overlay" />

        <div
          style={{
            position: "absolute",
            top: 12,
            left: 16,
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <span className={`tag ${tipoEventoTag(evento.tipoEvento)}`}>
            {evento.tipoEvento}
          </span>

          {evento.estado !== "PUBLICADO" && (
            <span className={`tag ${estadoEventoTag(evento.estado)}`}>
              {evento.estado}
            </span>
          )}
        </div>
      </div>

      <div className="event-card-body">
        <div className="event-card-top">
          <Link to={`/eventos/${evento.id}`} className="event-card-title">
            {evento.nombre}
          </Link>

          <span className="event-card-price">
            {evento.precioBase === 0 ? "FREE" : `${evento.precioBase}€`}
          </span>
        </div>

        <div className="event-card-meta">
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--neon-cyan)",
              opacity: 0.85,
            }}
          >
            {formatFecha(evento.fechaInicio)} · {formatHora(evento.fechaInicio)}
          </span>
        </div>

        {evento.recinto && (
          <p className="event-card-venue">
            📍 {evento.recinto.nombre}, {evento.recinto.ciudad}
          </p>
        )}

        {evento.artistas && evento.artistas.length > 0 && (
          <div className="event-card-artists">
            {evento.artistas.slice(0, 4).map((artista) => (
              <span key={artista.id} className="event-card-artist">
                {artista.nombreArtistico}
              </span>
            ))}

            {evento.artistas.length > 4 && (
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "var(--text-dim)",
                }}
              >
                +{evento.artistas.length - 4} más
              </span>
            )}
          </div>
        )}

        <div className="event-card-footer">
          <span className={`event-card-tickets ${ticketsLow ? "low" : ""}`}>
            {evento.entradasDisponibles <= 0
              ? "AGOTADO"
              : `${evento.entradasDisponibles} entradas`}
          </span>

          <Link to={`/eventos/${evento.id}`} className="btn btn-secondary btn-sm">
            Descubrir
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EventCard;