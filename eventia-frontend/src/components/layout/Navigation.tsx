import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { esAdmin, esCliente, esOrganizador } from "../../utils/roles";

function Navigation() {
  const { user, logout, loadingSession } = useAuth();

  if (loadingSession) {
    return (
      <nav className="navigation">
        <div className="container">
          <p>Cargando sesión...</p>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navigation">
      <div className="container nav-container">
        <ul className="nav-list">
          <li>
            <NavLink to="/" className="nav-link">
              Inicio
            </NavLink>
          </li>

          <li>
            <NavLink to="/eventos" className="nav-link">
              Eventos
            </NavLink>
          </li>

          {user && (
            <li>
              <NavLink to="/perfil" className="nav-link">
                Perfil
              </NavLink>
            </li>
          )}

          {user && esAdmin(user.rol) && (
            <li>
              <NavLink to="/admin" className="nav-link">
                Panel admin
              </NavLink>
            </li>
          )}

          {user && esOrganizador(user.rol) && (
            <li>
              <NavLink to="/organizador" className="nav-link">
                Panel organizador
              </NavLink>
            </li>
          )}

          {user && esCliente(user.rol) && (
            <li>
              <NavLink to="/mis-reservas" className="nav-link">
                Mis reservas
              </NavLink>
            </li>
          )}
        </ul>

        <div className="nav-session">
          {user ? (
            <>
              <span className="nav-user">Hola, {user.nombre}</span>

              <button className="logout-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>

              <NavLink to="/register" className="nav-link">
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