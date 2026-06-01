import { useEffect, useMemo, useState } from "react";
import { getEventos } from "../api/eventService";
import type { Event } from "../types/event";
import EventCard from "../components/events/EventCard";
import EventFilters from "../components/events/EventFilters";

function EventsPage() {
  const [eventos, setEventos] = useState<Event[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const data = await getEventos();
        setEventos(data);
      } catch (err) {
        console.error("Error al cargar eventos:", err);
        setError("No se pudieron cargar los eventos");
      } finally {
        setCargando(false);
      }
    };

    cargarEventos();
  }, []);

  const categorias = useMemo(() => {
    const categoriasUnicas = eventos.map((evento) => evento.categoria);
    return [...new Set(categoriasUnicas)];
  }, [eventos]);

  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) => {
      const coincideNombre = evento.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const coincideCategoria =
        categoriaSeleccionada === "" ||
        evento.categoria === categoriaSeleccionada;

      return coincideNombre && coincideCategoria;
    });
  }, [eventos, busqueda, categoriaSeleccionada]);

  return (
    <section className="page">
      <div className="container">
        <h2 className="page-title">Eventos</h2>

        <EventFilters
          busqueda={busqueda}
          categoriaSeleccionada={categoriaSeleccionada}
          categorias={categorias}
          onBusquedaChange={setBusqueda}
          onCategoriaChange={setCategoriaSeleccionada}
        />

        {cargando && <p>Cargando eventos...</p>}
        {error && <p className="error-message">{error}</p>}

        {!cargando && !error && (
          <>
            {eventosFiltrados.length === 0 ? (
              <p>No hay eventos que coincidan con los filtros.</p>
            ) : (
              <div className="events-grid">
                {eventosFiltrados.map((evento) => (
                  <EventCard key={evento.id} evento={evento} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default EventsPage;