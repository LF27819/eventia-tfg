import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="header-bg" />
      <div className="header-inner">
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 className="logo glitch">EVENTIA</h1>
          <p className="header-subtitle">Tu festival, donde quieras. La experiencia es tuya.</p>
        </Link>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "1 rem",
            color: "var(--text-dim)",
            letterSpacing: "0.12em",
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span style={{ color: "var(--neon-cyan)", opacity: 0.6 }}>
            ◉ LIVE
          </span>
          <span>
            {new Date().toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
