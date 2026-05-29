import type { Event } from "../../types/event";

interface EventsDashboardTableProps {
  eventos: Event[];
  onSortByDate: () => void;
  onSortByPrice: () => void;
}

function EventsDashboardTable({
  eventos,
  onSortByDate,
  onSortByPrice,
}: EventsDashboardTableProps) {
  if (eventos.length === 0) {
    return <p>No hay eventos que coincidan con los filtros.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>
              <button className="table-sort-button" onClick={onSortByDate}>
                Fecha
              </button>
            </th>
            <th>Hora</th>
            <th>
              <button className="table-sort-button" onClick={onSortByPrice}>
                Precio
              </button>
            </th>
            <th>Entradas</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {eventos.map((evento) => (
            <tr key={evento.id}>
              <td>{evento.nombre}</td>
              <td>{evento.categoria}</td>
              <td>{new Date(evento.fechaEvento).toLocaleDateString("es-ES")}</td>
              <td>{evento.horaEvento.slice(0, 5)}</td>
              <td>{evento.precioEntrada} €</td>
              <td>{evento.entradasDisponibles}</td>
              <td>{evento.cancelado ? "Cancelado" : "Activo"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EventsDashboardTable;