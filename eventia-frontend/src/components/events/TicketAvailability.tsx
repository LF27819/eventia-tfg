interface TicketAvailabilityProps {
    aforoTotal: number;
    entradasDisponibles: number;
}

function TicketAvailability({
    aforoTotal,
    entradasDisponibles,
}: TicketAvailabilityProps) {
    const porcentajeDisponible =
        aforoTotal > 0 ? (entradasDisponibles / aforoTotal) * 100 : 0;

    let tagClass = "tag-acid";
    let titulo = "Entradas disponibles";
    let mensaje = "Todavía hay buena disponibilidad para este evento.";

    if (entradasDisponibles === 0) {
        tagClass = "tag-cyan";
        titulo = "AGOTADO";
        mensaje = "No quedan entradas disponibles para este evento.";
    } else if (porcentajeDisponible <= 20) {
        tagClass = "tag-magenta";
        titulo = "Últimas entradas";
        mensaje = "Quedan muy pocas entradas. Si quieres ir, no lo dejes mucho.";
    } else if (porcentajeDisponible <= 50) {
        tagClass = "tag-orange";
        titulo = "Quedan pocas";
        mensaje = "La disponibilidad empieza a bajar.";
    }

    return (
        <div className="availability-panel">
            <div>
                <span className={`tag ${tagClass}`}>{titulo}</span>
                <p>{mensaje}</p>
            </div>

            <div className="availability-number">
                <strong>{entradasDisponibles}</strong>
                <span>entradas</span>
            </div>
        </div>
    );
}

export default TicketAvailability;