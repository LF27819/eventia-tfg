import type { Booking } from "../../types/booking";

interface BookingsDashboardTableProps {
  reservas: Booking[];
}

function BookingsDashboardTable({ reservas }: BookingsDashboardTableProps) {
  if (reservas.length === 0) {
    return <p>No hay reservas que coincidan con los filtros.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Evento</th>
            <th>Fecha reserva</th>
            <th>Entradas</th>
            <th>Total</th>
            <th>Método</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.codigoReserva}</td>
              <td>{reserva.evento?.nombre ?? "Sin evento"}</td>
              <td>
                {new Date(reserva.fechaReserva).toLocaleDateString("es-ES")}
              </td>
              <td>{reserva.cantidadEntradas}</td>
              <td>{reserva.precioTotal} €</td>
              <td>{reserva.metodoPago}</td>
              <td>{reserva.confirmada ? "Confirmada" : "Pendiente"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingsDashboardTable;