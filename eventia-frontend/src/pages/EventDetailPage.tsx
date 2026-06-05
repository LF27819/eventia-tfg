import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEventoById } from "../services-api/eventoService";
import type { Evento, EstadoEvento, TipoEvento } from "../types/evento";
import Loading from "../components/ui/Loading";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { createReserva } from "../services-api/reservaService";
import { useAuth } from "../context/AuthContext"
import EventCountdown from "../components/events/EventCountdown";
import TicketAvailability from "../components/events/TicketAvailability";
import EventLineup from "../components/events/EventLineup";

function tipoEventoTag(tipo: TipoEvento): string {
  switch (tipo) {
    case "FESTIVAL":
      return "tag-acid";
    case "CONCIERTO":
      return "tag-cyan";
    case "SESION":
      return "tag-magenta";
    default:
      return "tag-purple";
  }
}

function estadoEventoTag(estado: EstadoEvento): string {
  switch (estado) {
    case "PUBLICADO":
      return "tag-cyan";
    case "BORRADOR":
      return "tag-muted";
    case "CANCELADO":
      return "tag-orange";
    case "FINALIZADO":
      return "tag-purple";
    default:
      return "tag-muted";
  }
}

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatHora(fecha: string): string {
  return new Date(fecha).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [cantidadEntradas, setCantidadEntradas] = useState(1);
  const [reservando, setReservando] = useState(false);
  const [errorReserva, setErrorReserva] = useState("");

  useEffect(() => {
    const cargarEvento = async () => {
      if (!id) {
        setError("Evento no encontrado");
        setCargando(false);
        return;
      }

      try {
        const data = await getEventoById(Number(id));
        setEvento(data);
      } catch (error) {
        console.error("Error al cargar evento:", error);
        setError("No se pudo cargar el evento");
      } finally {
        setCargando(false);
      }
    };

    cargarEvento();
  }, [id]);

  if (cargando) {
    return (
      <section className="page">
        <div className="container">
          <Loading text="Cargando evento" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <div className="container">
          <div className="msg-error">⚠ {error}</div>
        </div>
      </section>
    );
  }

  if (!evento) {
    return (
      <section className="page">
        <div className="container">
          <p style={{ color: "var(--text-dim)" }}>Evento no encontrado.</p>
        </div>
      </section>
    );
  }

  const totalReserva = cantidadEntradas * evento.precioBase;

  const restarEntrada = () => {
    setCantidadEntradas((actual) => Math.max(1, actual - 1));
  };

  const sumarEntrada = () => {
    setCantidadEntradas((actual) =>
      Math.min(evento.entradasDisponibles, actual + 1)
    );
  };

  const handleReservar = async () => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    setReservando(true);
    setErrorReserva("");

    try {
      await createReserva({
        cantidadEntradas,
        usuario: {
          id: user.id,
        },
        evento: {
          id: evento.id,
        },
      });

      navigate("/mis-reservas");
    } catch (error) {
      console.error("Error al reservar:", error);
      setErrorReserva("No puedes reservar este evento porque no cumples la edad mínima requerida.");
    } finally {
      setReservando(false);
    }
  };

  return (
    <section className="page">
      <div className="container">
        <div style={{ marginBottom: 24 }}>
          <Link
            to="/eventos"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.74rem",
              letterSpacing: "0.12em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
            }}
          >
            ← Volver a eventos
          </Link>
        </div>

        <div className="detail-hero">
          {evento.imagenUrl ? (
            <img
              src={evento.imagenUrl}
              alt={evento.nombre}
              className="detail-hero-img"
            />
          ) : (
            <div className="detail-hero-placeholder">
              {evento.tipoEvento} · {evento.nombre.toUpperCase()}
            </div>
          )}

          <div className="detail-content">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className={`tag ${tipoEventoTag(evento.tipoEvento)}`}>
                {evento.tipoEvento}
              </span>

              <span className={`tag ${estadoEventoTag(evento.estado)}`}>
                {evento.estado}
              </span>

              {evento.edadMinima > 0 && (
                <span className="tag tag-orange">+{evento.edadMinima}</span>
              )}
            </div>

            <div className="detail-title-countdown-row">
              <h2 className="detail-title">{evento.nombre}</h2>

              <EventCountdown fechaInicio={evento.fechaInicio} />
            </div>

            <p className="detail-desc">
              {evento.descripcion || "Una experiencia única dentro de Eventia."}
            </p>

            <div className="detail-grid">
              <div className="detail-stat">
                <div className="detail-stat-value">
                  {formatFecha(evento.fechaInicio)}
                </div>
                <div className="detail-stat-label">Fecha inicio</div>
              </div>

              <div className="detail-stat">
                <div
                  className="detail-stat-value"
                  style={{ color: "var(--neon-magenta)" }}
                >
                  {formatHora(evento.fechaInicio)}
                </div>
                <div className="detail-stat-label">Hora</div>
              </div>

              <div className="detail-stat">
                <div
                  className="detail-stat-value"
                  style={{ color: "var(--neon-acid)" }}
                >
                  {evento.precioBase === 0 ? "FREE" : `${evento.precioBase}€`}
                </div>
                <div className="detail-stat-label">Precio</div>
              </div>

              <div className="detail-stat">
                <div
                  className="detail-stat-value"
                  style={{
                    color:
                      evento.entradasDisponibles < 50
                        ? "var(--neon-orange)"
                        : "var(--neon-cyan)",
                  }}
                >
                  {evento.entradasDisponibles}
                </div>
                <div className="detail-stat-label">Entradas disp.</div>
              </div>
            </div>

            <TicketAvailability
              aforoTotal={evento.aforoTotal}
              entradasDisponibles={evento.entradasDisponibles}
            />

            <EventLineup artistas={evento.artistas} />

            {evento.recinto?.latitud && evento.recinto?.longitud && (
              <>
                <h3 className="detail-section-title">UBICACIÓN DEL RECINTO </h3>

                <div className="location-panel">
                  <div className="location-info">
                    <h4>
                      <Link
                        to={`/recintos/${evento.recinto.id}`}
                        className="venue-detail-link"
                      >
                        {evento.recinto.nombre}
                      </Link>
                    </h4>
                    <p>{evento.recinto.direccion}</p>
                    <p>
                      {evento.recinto.ciudad}, {evento.recinto.provincia}
                    </p>
                  </div>

                  <div className="map-wrapper map-wrapper-neon">
                    <MapContainer
                      center={[evento.recinto.latitud, evento.recinto.longitud]}
                      zoom={15}
                      className="event-map"
                    >
                      <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      />

                      <Marker position={[evento.recinto.latitud, evento.recinto.longitud]}>
                        <Popup>
                          <strong>{evento.nombre}</strong>
                          <br />
                          {evento.recinto.nombre}
                          <br />
                          {evento.recinto.direccion}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
                <h3 className="detail-section-title">ENTRADAS</h3>

                <div className="booking-panel">
                  <div>
                    <span className="tag tag-acid">RESERVA</span>

                    <h4>Vive esta experiencia</h4>

                    <p>
                      Elige cuántas entradas quieres reservar. Podrás consultar tus reservas y
                      entradas desde tu zona privada.
                    </p>
                  </div>

                  <div className="booking-box">
                    <div className="booking-row">
                      <span>Precio unitario</span>
                      <strong>{evento.precioBase}€</strong>
                    </div>

                    <div className="booking-row">
                      <span>Entradas disponibles</span>
                      <strong>{evento.entradasDisponibles}</strong>
                    </div>

                    <div className="booking-counter">
                      <button type="button" onClick={restarEntrada} disabled={cantidadEntradas <= 1}>
                        −
                      </button>

                      <span>{cantidadEntradas}</span>

                      <button
                        type="button"
                        onClick={sumarEntrada}
                        disabled={cantidadEntradas >= evento.entradasDisponibles}
                      >
                        +
                      </button>
                    </div>

                    <div className="booking-total">
                      <span>Total</span>
                      <strong>{totalReserva.toFixed(2)}€</strong>
                    </div>

                    {errorReserva && <div className="msg-error">{errorReserva}</div>}

                    <button
                      type="button"
                      className="btn btn-acid"
                      style={{ width: "100%" }}
                      onClick={handleReservar}
                      disabled={reservando || evento.entradasDisponibles <= 0}
                    >
                      {reservando ? "Reservando..." : "Reservar entradas"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventDetailPage;