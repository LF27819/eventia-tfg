import { useEffect, useState } from "react";
import { getArtistas } from "../services-api/artistaService";
import type { Artista } from "../types/artista";
import Loading from "../components/ui/Loading";
import ArtistCard from "../components/artists/ArtistCard";

function ArtistsPage() {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarArtistas = async () => {
      try {
        const data = await getArtistas();
        setArtistas(data);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los artistas.");
      } finally {
        setCargando(false);
      }
    };

    cargarArtistas();
  }, []);

  if (cargando) {
    return (
      <section className="page">
        <div className="container">
          <Loading text="Cargando artistas" />
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <h2 className="page-title">
            ARTISTAS <span className="page-title-accent">DESTACADOS</span>
          </h2>

          <p className="page-subtitle">
            Descubre los artistas que forman parte del universo Eventia.
          </p>
        </div>

        {error && (
          <div className="msg-error">
            ⚠ {error}
          </div>
        )}

        <div className="artists-grid">
          {artistas.map((artista) => (
            <ArtistCard
              key={artista.id}
              artista={artista}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArtistsPage;