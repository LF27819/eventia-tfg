import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getReservasByUsuario } from "../services-api/reservaService";
import { getEntradasByReserva } from "../services-api/entradaService";
import type { Entrada } from "../types/entrada";
import Loading from "../components/ui/Loading";
import TicketCard from "../components/tickets/TicketCard";

function MyTicketsPage() {
  const { user } = useAuth();

  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarEntradas = async () => {
      if (!user?.id) {
        setCargando(false);
        return;
      }

      try {
        const reservas = await getReservasByUsuario(user.id);

        const entradasPorReserva = await Promise.all(
          reservas.map((reserva) => getEntradasByReserva(reserva.id))
        );

        setEntradas(entradasPorReserva.flat());
      } catch (error) {
        console.error("Error al cargar entradas:", error);
        setError("No se pudieron cargar tus entradas.");
      } finally {
        setCargando(false);
      }
    };

    cargarEntradas();
  }, [user]);

  if (cargando) {
    return (
      <section className="page">
        <div className="container">
          <Loading text="Cargando entradas" />
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <h2 className="page-title">
            MIS <span className="page-title-accent">ENTRADAS</span>
          </h2>

          <p className="page-subtitle">
            Tus pases digitales para vivir Eventia.
          </p>
        </div>

        {error && <div className="msg-error">⚠ {error}</div>}

        {!error && entradas.length === 0 && (
          <p className="page-subtitle">
            Todavía no tienes entradas. Reserva un evento para generar tus pases.
          </p>
        )}

        <div className="tickets-grid">
          {entradas.map((entrada) => (
            <TicketCard key={entrada.id} entrada={entrada} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default MyTicketsPage;