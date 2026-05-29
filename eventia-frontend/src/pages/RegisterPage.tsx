import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
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
        password,
      });

      navigate("/perfil");
    } catch (err) {
      console.error("Error en register:", err);
      setError("No se pudo completar el registro");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="page">
      <div className="container">
        <div className="card login-card">
          <h2>Registro</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="filter-input"
            />

            <input
              type="text"
              placeholder="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              className="filter-input"
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="filter-input"
            />

            <input
              type="text"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
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
              {cargando ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;