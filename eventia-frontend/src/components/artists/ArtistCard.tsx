import type { Artista } from "../../types/artista";
import { FaInstagram, FaSpotify } from "react-icons/fa";
import { Link } from "react-router-dom";

interface ArtistCardProps {
  artista: Artista;
}

function ArtistCard({ artista }: ArtistCardProps) {
  return (
    <article className="artist-card">
      <div className="artist-image-wrapper">
        <img
          src={
            artista.imagenUrl ||
            "https://placehold.co/600x800/111111/ffffff?text=ARTISTA"
          }
          alt={artista.nombreArtistico}
          className="artist-image"
        />

        <div className="artist-overlay" />
      </div>

      <div className="artist-content">
        <span className="tag tag-cyan">
          {artista.generoMusical || "ARTISTA"}
        </span>

        <h3>
          <Link
            to={`/artistas/${artista.id}`}
            className="artist-name-link"
          >
            {artista.nombreArtistico}
          </Link>
        </h3>

        {artista.descripcion && (
          <p className="artist-description">
            {artista.descripcion}
          </p>
        )}

        <div className="artist-links">
          {artista.instagram && (
            <a
              href={artista.instagram}
              target="_blank"
              rel="noreferrer"
              className="artist-social artist-social-instagram"
              aria-label={`Instagram de ${artista.nombreArtistico}`}
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
              aria-label={`Spotify de ${artista.nombreArtistico}`}
            >
              <FaSpotify />
              <span>Spotify</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default ArtistCard;