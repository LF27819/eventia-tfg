import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await register({
        nombre,
        apellidos,
        email,
        telefono,
        fechaNacimiento,
        password,
      });

      navigate("/perfil");
    } catch {
      setError("No se pudo completar el registro");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />

      <div className="auth-card" style={{ maxWidth: 480 }}>
        <h2 className="auth-title">REGISTRO</h2>
        <p className="auth-subtitle">Crea tu acceso al universo Eventia.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div className="form-field">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Apellidos</label>
              <input
                type="text"
                placeholder="Tus apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Teléfono</label>
            <input
              type="text"
              placeholder="600 000 000"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Fecha de nacimiento</label>
            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="msg-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-acid"
            disabled={cargando}
            style={{ width: "100%", marginTop: 8 }}
          >
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;