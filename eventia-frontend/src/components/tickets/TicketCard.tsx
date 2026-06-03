import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import type { Entrada } from "../../types/entrada";
import { descargarPdfEntrada } from "../../services-api/entradaService";

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

function formatFecha(fecha?: string): string {
    if (!fecha) return "Fecha pendiente";

    return new Date(fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function TicketCard({ entrada }: TicketCardProps) {
    const evento = entrada.evento;

    return (
        <article className="ticket-card ticket-card-horizontal">
            <div className="ticket-main">
                <div className="ticket-header">
                    <div>
                        <span className="ticket-kicker">EVENTIA PASS</span>
                        <h3>{evento?.nombre ?? "Evento"}</h3>
                    </div>

                    <div className="ticket-tags">
                        <span className={`tag ${estadoTag(entrada.estado)}`}>
                            {entrada.estado}
                        </span>
                        <span className="tag tag-cyan">{entrada.tipoEntrada}</span>
                    </div>
                </div>

                <p className="ticket-location">
                    {evento?.recinto?.nombre ?? "Recinto pendiente"},{" "}
                    {evento?.recinto?.ciudad ?? "Ciudad pendiente"}
                </p>

                <div className="ticket-info-grid">
                    <div>
                        <span>Nº entrada</span>
                        <strong>#{entrada.id}</strong>
                    </div>

                    <div>
                        <span>Fecha</span>
                        <strong>{formatFecha(evento?.fechaInicio)}</strong>
                    </div>

                    <div>
                        <span>Precio</span>
                        <strong>{entrada.precio}€</strong>
                    </div>

                    <div>
                        <span>Código</span>
                        <strong>{entrada.codigoQr}</strong>
                    </div>
                </div>

                <div className="ticket-footer">
                    <span>{entrada.codigoQr}</span>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => descargarPdfEntrada(entrada.id)}
                    >
                        Descargar PDF
                    </button>
                </div>
            </div>

            <div className="ticket-qr-panel">
                <div className="ticket-qr-classic">
                    <QRCodeSVG
                        value={entrada.codigoQr}
                        size={132}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="H"
                        includeMargin
                    />
                </div>

                <span>SCAN TO ENTER</span>
            </div>
        </article>
    );
}

export default TicketCard;