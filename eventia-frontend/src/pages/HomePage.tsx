import { Link } from "react-router-dom";
import HomePromoVideo from "../components/home/HomePromoVideo";

const generos = ["Techno", "Hardcore", "Festival", "Concierto", "Reggaetón", "Rap"];

function HomePage() {
  return (
    <section className="page" style={{ padding: 0 }}>
      <div className="hero">
        <div className="hero-bg" />

        <div className="container hero-content">
          <span className="hero-eyebrow">LIVE MUSIC / NEON NIGHTS</span>

          <h2 className="hero-title glitch">
            <span className="line-1">LAS LUCES SE APAGAN</span>
            <br />
            <span className="line-2">LA EXPERIENCIA COMIENZA</span>
          </h2>

          <p className="hero-desc">
            Descubre. Reserva. Vive el festival. Presencial o en directo,
            Eventia te lleva al centro de la experiencia.
          </p>

          <div className="hero-cta">
            <Link to="/eventos" className="btn btn-primary">
              Explorar festivales
            </Link>

            <Link to="/register" className="btn btn-secondary">
              Crear cuenta
            </Link>
          </div>

          <div className="artists-list" style={{ justifyContent: "center", marginTop: 48 }}>
            {generos.map((genero, index) => (
              <span
                key={genero}
                className={`tag ${
                  index % 5 === 0
                    ? "tag-cyan"
                    : index % 5 === 1
                    ? "tag-magenta"
                    : index % 5 === 2
                    ? "tag-acid"
                    : index % 5 === 3
                    ? "tag-purple"
                    : "tag-orange"
                }`}
              >
                {genero}
              </span>
            ))}
          </div>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-value">+30</div>
              <div className="hero-stat-label">Eventos</div>
            </div>

            <div>
              <div className="hero-stat-value" style={{ color: "var(--neon-magenta)" }}>
                +40
              </div>
              <div className="hero-stat-label">Artistas</div>
            </div>

            <div>
              <div className="hero-stat-value" style={{ color: "var(--neon-acid)" }}>
                LIVE
              </div>
              <div className="hero-stat-label">Streaming</div>
            </div>
          </div>
        </div>
      </div>

      <HomePromoVideo />

      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "64px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h3 className="page-title">
            ¿LISTA PARA EL <span className="page-title-accent">CAOS?</span>
          </h3>

          <p className="page-subtitle">
            Monegros, Fabrik, Medusa, Rocanrola y muchas noches más te esperan.
          </p>

          <Link to="/eventos" className="btn btn-acid">
            Entrar en Eventia
          </Link>
        </div>
      </section>
    </section>
  );
}

export default HomePage;