import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addSaldo } from "../api/userService";

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [cantidad, setCantidad] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  if (!user) {
    return <p>Cargando usuario...</p>;
  }

  const handleRecargarSaldo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");

    const cantidadNumerica = Number(cantidad);

    if (cantidadNumerica <= 0) {
      setMensaje("Introduce una cantidad válida.");
      return;
    }

    if (!user.id) {
      setMensaje("Usuario no válido.");
      return;
    }

    try {
      setCargando(true);

      const usuarioActualizado = await addSaldo(user.id, cantidadNumerica);

      updateUser({
        saldoCuenta: usuarioActualizado.saldoCuenta,
      });

      setCantidad("");
      setMensaje("Saldo actualizado correctamente.");
    } catch (error) {
      console.error("Error al recargar saldo:", error);
      setMensaje("No se pudo actualizar el saldo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="page">
      <div className="container">
        <div className="card profile-card">
          <h2>Mi perfil</h2>

          <p>
            <strong>Nombre:</strong> {user.nombre}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Rol:</strong> {user.rol}
          </p>

          <p>
            <strong>Saldo:</strong> {user.saldoCuenta} €
          </p>

          {user.rol === "CLIENTE" && (
            <form onSubmit={handleRecargarSaldo} className="login-form">
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Cantidad a añadir"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="filter-input"
              />

              <button
                type="submit"
                className="login-button"
                disabled={cargando}
              >
                {cargando ? "Actualizando..." : "Añadir saldo"}
              </button>
            </form>
          )}

          {mensaje && <p className="event-message">{mensaje}</p>}
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;