import { Link } from "react-router-dom";

const PROMO_VIDEO_URL =
  "https://res.cloudinary.com/duvblfyfl/video/upload/q_auto/f_auto/v1780494117/PixVerse_V6_Image_Text_720P_Ultra_cinematic_el_hmkbf3.mp4";

function HomePromoVideo() {
  return (
    <section className="promo-video-section">
      <div className="container">
        <div className="promo-video-container">
          <video autoPlay muted loop playsInline className="promo-video">
            <source src={PROMO_VIDEO_URL} type="video/mp4" />
          </video>

          <div className="promo-video-overlay">
            <span className="tag tag-acid">EVENTIA LIVE</span>

            <h2>
              El festival
              <br />
              empieza aquí.
            </h2>

            <p>
              Descubre eventos, reserva entradas y vive la experiencia en
              persona o en directo desde cualquier lugar.
            </p>

            <Link to="/eventos" className="btn btn-primary">
              Explorar eventos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePromoVideo;