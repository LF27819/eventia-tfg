import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch {
      setError("Credenciales incorrectas");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card">
        <h2 className="auth-title">ACCEDER</h2>
        <p className="auth-subtitle">Accede a tu próxima experiencia.</p>

        <form onSubmit={handleSubmit} className="auth-form">
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
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="msg-error"><span>⚠</span> {error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={cargando}
            style={{ width: "100%", marginTop: 8 }}
          >
            {cargando ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="auth-footer">
          ¿No tienes cuenta?{" "}
          <Link to="/register">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
