import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { getEventoById } from "../api/eventService";
import type { Event } from "../types/event";

const coordenadasRecintos: Record<string, [number, number]> = {
  "WiZink Center": [40.4239, -3.6716],
  "Palau Sant Jordi": [41.3635, 2.1527],
  "Ciudad de las Artes Stage": [39.4548, -0.3505],
  "Cartuja Center": [37.4114, -6.0061],
  "Bilbao Arena": [43.2525, -2.9253],
  "Pabellón Príncipe Felipe": [41.6387, -0.8872],
  "Auditorio Cortijo de Torres": [36.6897, -4.4644],
  "Palacio de Deportes Granada": [37.1526, -3.5962],
  "Plaza de Toros Alicante": [38.3506, -0.4836],
  "Cuartel de Artillería": [37.9834, -1.1287],
};

function EventDetailPage() {
  const { id } = useParams();
  const [evento, setEvento] = useState<Event | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarEvento = async () => {
      if (!id) return;

      try {
        const data = await getEventoById(id);
        setEvento(data);
      } catch (err) {
        console.error("Error al cargar detalle del evento:", err);
        setError("No se pudo cargar el detalle del evento");
      } finally {
        setCargando(false);
      }
    };

    cargarEvento();
  }, [id]);

  if (cargando) return <p>Cargando evento...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!evento) return <p>No se encontró el evento.</p>;

  const recintoNombre = evento.recinto?.nombre ?? "";
  const coords = coordenadasRecintos[recintoNombre];

  return (
    <section className="page">
      <div className="container">
        <div className="card detail-card">
          <span className="event-category">{evento.categoria}</span>

          <h2 className="page-title">{evento.nombre}</h2>

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
            <strong>Modalidad:</strong>{" "}
            {evento.presencial ? "Presencial" : "Online"}
          </p>

          {evento.recinto && (
            <>
              <h3 className="detail-subtitle">Recinto</h3>

              <p>
                <strong>Nombre:</strong> {evento.recinto.nombre}
              </p>

              <p>
                <strong>Dirección:</strong> {evento.recinto.direccion}
              </p>

              <p>
                <strong>Ciudad:</strong> {evento.recinto.ciudad}
              </p>
            </>
          )}

          {coords && (
            <div className="map-wrapper">
              <MapContainer
                center={coords}
                zoom={15}
                className="event-map"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={coords}>
                  <Popup>
                    <strong>{evento.nombre}</strong>
                    <br />
                    {evento.recinto?.nombre}
                    <br />
                    {evento.recinto?.direccion}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default EventDetailPage;