import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "../../types/event";
import { useAuth } from "../../context/AuthContext";
import { createReserva } from "../../api/bookingService";
import { Link } from "react-router-dom";

interface EventCardProps {
  evento: Event;
}

function EventCard({ evento }: EventCardProps) {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [reservando, setReservando] = useState(false);
  const [error, setError] = useState("");

  const handleReservar = async () => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    const precioTotal = evento.precioEntrada;

    if (user.saldoCuenta < precioTotal) {
      setError("Saldo insuficiente. Añade saldo en tu perfil.");
      return;
    }

    setReservando(true);
    setError("");

    try {
      await createReserva({
        fechaReserva: new Date().toISOString().slice(0, 19),
        cantidadEntradas: 1,
        precioTotal,
        metodoPago: "TARJETA",
        codigoReserva: `RES-${Date.now()}`,
        confirmada: true,
        usuario: { id: user.id },
        evento: { id: evento.id },
      });

      updateUser({
        saldoCuenta: user.saldoCuenta - precioTotal,
      });

      navigate("/mis-reservas");
    } catch (error) {
      console.error("Error al reservar:", error);
      setError("No se pudo realizar la reserva");
    } finally {
      setReservando(false);
    }
  };

  return (
    <article className="card event-card">
      <span className="event-category">{evento.categoria}</span>

      <h3 className="title-events">
        <Link to={`/eventos/${evento.id}`}>{evento.nombre}</Link>
      </h3>

      <p>{evento.descripcion}</p>

      <p>
        <strong>Fecha:</strong>{" "}
        {new Date(evento.fechaEvento).toLocaleDateString("es-ES")}
      </p>

      <p>
        <strong>Hora:</strong> {evento.horaEvento.slice(0, 5)}
      </p>

      <p>
        <strong>Precio:</strong> {evento.precioEntrada} €
      </p>

      <p>
        <strong>Entradas disponibles:</strong> {evento.entradasDisponibles}
      </p>

      <p>
        <strong>Estado:</strong> {evento.cancelado ? "Cancelado" : "Activo"}
      </p>

      {user?.rol === "CLIENTE" && (
        <div className="event-actions">
          <button
            className="reserve-button"
            onClick={handleReservar}
            disabled={reservando}
          >
            {reservando ? "Reservando..." : "Reservar"}
          </button>
        </div>
      )}

      {error && <p className="event-message">{error}</p>}
    </article>
  );
}

export default EventCard;