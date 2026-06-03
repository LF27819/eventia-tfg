import { Link } from "react-router-dom";
import type { Artista } from "../../types/artista";

interface EventLineupProps {
  artistas: Artista[];
}

function EventLineup({ artistas }: EventLineupProps) {
  if (!artistas || artistas.length === 0) {
    return null;
  }

  return (
    <>
      <h3 className="detail-section-title">ARTISTAS</h3>

      <div className="lineup-grid">
        {artistas.map((artista) => (
          <Link
            key={artista.id}
            to={`/artistas/${artista.id}`}
            className="lineup-card"
          >
            <div className="lineup-image-wrapper">
              {artista.imagenUrl ? (
                <img
                  src={artista.imagenUrl}
                  alt={artista.nombreArtistico}
                  className="lineup-image"
                />
              ) : (
                <div className="lineup-placeholder">
                  {artista.nombreArtistico}
                </div>
              )}

              <div className="lineup-overlay" />
            </div>

            <div className="lineup-content">


              <h4>{artista.nombreArtistico}</h4>

            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default EventLineup;