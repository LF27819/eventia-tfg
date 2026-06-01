import { Link } from "react-router-dom";
import type { Entrada } from "../../types/entrada";

interface TicketCardProps {
  entrada: Entrada;
}

function estadoTag(estado: string): string {
  switch (estado) {
    case "VALIDA":
      return "tag-acid";
    case "USADA":
      return "tag-cyan";
    case "CANCELADA":
      return "tag-magenta";
    default:
      return "tag-muted";
  }
}

function TicketCard({ entrada }: TicketCardProps) {
  return (
    <article className="ticket-card">
      <div className="ticket-side">
        <span>EVENTIA</span>
      </div>

      <div className="ticket-main">
        <div className="ticket-header">
          <span className={`tag ${estadoTag(entrada.estado)}`}>
            {entrada.estado}
          </span>

          <span className="tag tag-cyan">{entrada.tipoEntrada}</span>
        </div>

        <h3>{entrada.evento?.nombre ?? "Evento"}</h3>

        <p className="ticket-location">
          {entrada.evento?.recinto?.nombre},{" "}
          {entrada.evento?.recinto?.ciudad}
        </p>

        <div className="ticket-grid">
          <div>
            <span>Precio</span>
            <strong>{entrada.precio}€</strong>
          </div>

          <div>
            <span>Entrada</span>
            <strong>#{entrada.id}</strong>
          </div>
        </div>

        <div className="ticket-qr-box">
          <div className="ticket-fake-qr">
            {entrada.codigoQr}
          </div>
        </div>

        <div className="ticket-footer">
          <span>{entrada.codigoQr}</span>

          {entrada.evento?.id && (
            <Link to={`/eventos/${entrada.evento.id}`} className="btn btn-secondary btn-sm">
              Ver evento
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default TicketCard;