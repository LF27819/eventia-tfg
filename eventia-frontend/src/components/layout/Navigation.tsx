import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { esAdmin, esUsuario, esOrganizador } from "../../utils/roles";

function Navigation() {
  const { user, logout, loadingSession } = useAuth();

  if (loadingSession) {
    return (
      <nav className="navigation">
        <div className="nav-container">
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "var(--text-dim)",
              letterSpacing: "0.15em",
              animation: "blink 1.2s ease-in-out infinite",
            }}
          >
            CARGANDO SESIÓN...
          </span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        <ul className="nav-list">
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/eventos" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
              Eventos
            </NavLink>
          </li>
          <li>
            <NavLink to="/artistas" className="nav-link">
              Artistas
            </NavLink>
          </li>
          {user && (
            <li>
              <NavLink to="/perfil" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                Perfil
              </NavLink>
            </li>
          )}
          {user && esAdmin(user.rol) && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                Admin
              </NavLink>
            </li>
          )}
          {user && esOrganizador(user.rol) && (
            <li>
              <NavLink to="/organizador" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                Organizador
              </NavLink>
            </li>
          )}
          {user && esUsuario(user.rol) && (
            <li>
              <NavLink to="/mis-reservas" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                Mis reservas
              </NavLink>
            </li>
          )}
          {user && esUsuario(user.rol) && (
            <li>
              <NavLink to="/mis-entradas" className="nav-link">
                Mis entradas
              </NavLink>
            </li>
          )}
        </ul>

        <div className="nav-session">
          {user ? (
            <>
              <span className="nav-user">[ {user.nombre} ]</span>
              <button className="logout-button" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">
                Registro
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
