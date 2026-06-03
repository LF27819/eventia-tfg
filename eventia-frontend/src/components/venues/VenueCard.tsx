import { Link } from "react-router-dom";
import type { Recinto } from "../../types/recinto";

interface VenueCardProps {
  recinto: Recinto;
  eventosProgramados: number;
}

function VenueCard({ recinto, eventosProgramados }: VenueCardProps) {
  return (
    <article className="venue-card">
      <div className="venue-image-wrapper">
        {recinto.imagenUrl ? (
          <img
            src={recinto.imagenUrl}
            alt={recinto.nombre}
            className="venue-image"
          />
        ) : (
          <div className="venue-placeholder">
            {recinto.nombre}
          </div>
        )}

        <div className="venue-overlay" />
      </div>

      <div className="venue-content">
        <div className="venue-header">
          <span className="tag tag-cyan">RECINTO</span>

          {eventosProgramados > 0 ? (
            <span className="tag tag-acid">
              {eventosProgramados} eventos
            </span>
          ) : (
            <span className="tag tag-muted">
              Sin eventos
            </span>
          )}
        </div>

        <h3>{recinto.nombre}</h3>

        <p className="venue-location">
          {recinto.ciudad}, {recinto.provincia}
        </p>

        <p className="venue-description">
          {recinto.descripcion || "Recinto disponible para nuevos eventos."}
        </p>

        <div className="venue-info-grid">
          <div>
            <span>Aforo</span>
            <strong>{recinto.aforo.toLocaleString()}</strong>
          </div>

          <div>
            <span>Eventos</span>
            <strong>{eventosProgramados}</strong>
          </div>
        </div>

        <div className="venue-footer">
          <span>{recinto.direccion}</span>

          <Link
            to={`/recintos/${recinto.id}`}
            className="btn btn-secondary btn-sm"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}

export default VenueCard;