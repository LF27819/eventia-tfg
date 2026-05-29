import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    } catch (err) {
      console.error("Error en login:", err);
      setError("Credenciales incorrectas");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="page">
      <div className="container">
        <div className="card login-card">
          <h2>Login</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="filter-input"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="filter-input"
            />

            <button type="submit" className="login-button" disabled={cargando}>
              {cargando ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </section>
  );
}

export default LoginPage;