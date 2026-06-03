import { useEffect, useState } from "react";

interface EventCountdownProps {
  fechaInicio: string;
}

function calcularTiempoRestante(fechaInicio: string) {
  const ahora = new Date().getTime();
  const fechaEvento = new Date(fechaInicio).getTime();
  const diferencia = fechaEvento - ahora;

  if (diferencia <= 0) {
    return null;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  return { dias, horas, minutos, segundos };
}

function EventCountdown({ fechaInicio }: EventCountdownProps) {
  const [tiempo, setTiempo] = useState(() =>
    calcularTiempoRestante(fechaInicio)
  );

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempo(calcularTiempoRestante(fechaInicio));
    }, 1000);

    return () => clearInterval(intervalo);
  }, [fechaInicio]);

  if (!tiempo) {
    return (
      <div className="countdown-panel">
        <span className="tag tag-magenta">EVENTO INICIADO</span>
        <p>La experiencia ya ha comenzado.</p>
      </div>
    );
  }

  return (
    <div className="countdown-panel">

      <div className="countdown-grid">
        <div>
          <strong>{tiempo.dias}</strong>
          <span>Días</span>
        </div>

        <div>
          <strong>{tiempo.horas}</strong>
          <span>Horas</span>
        </div>

        <div>
          <strong>{tiempo.minutos}</strong>
          <span>Min</span>
        </div>

        <div>
          <strong>{tiempo.segundos}</strong>
          <span>Seg</span>
        </div>
      </div>
    </div>
  );
}

export default EventCountdown;