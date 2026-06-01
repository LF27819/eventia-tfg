import type { Reserva } from "../../types/reserva";

interface BookingsDashboardTableProps {
  reservas: Reserva[];
}

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function estadoTag(estado: string): string {
  switch (estado) {
    case "CONFIRMADA":
      return "tag-cyan";
    case "PENDIENTE":
      return "tag-orange";
    case "CANCELADA":
      return "tag-magenta";
    default:
      return "tag-muted";
  }
}

function BookingsDashboardTable({ reservas }: BookingsDashboardTableProps) {
  if (reservas.length === 0) {
    return (
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.82rem",
          color: "var(--text-dim)",
          letterSpacing: "0.1em",
          padding: "32px 0",
          textAlign: "center",
        }}
      >
        // SIN RESERVAS
      </p>
    );
  }

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Evento</th>
            <th>Fecha reserva</th>
            <th>Entradas</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td style={{ fontFamily: "var(--font-mono)", color: "var(--neon-cyan)" }}>
                {reserva.codigoReserva}
              </td>

              <td>{reserva.evento?.nombre ?? "—"}</td>

              <td style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                {formatFecha(reserva.fechaReserva)}
              </td>

              <td>{reserva.cantidadEntradas}</td>

              <td style={{ fontFamily: "var(--font-display)", color: "var(--neon-acid)" }}>
                {reserva.precioTotal}€
              </td>

              <td>
                <span className={`tag ${estadoTag(reserva.estado)}`}>
                  {reserva.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingsDashboardTable;