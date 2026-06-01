import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getReservasByUsuario } from "../services-api/reservaService";
import type { Reserva } from "../types/reserva";
import Loading from "../components/ui/Loading";
import SummaryCard from "../components/dashboard/SummaryCard";

function ProfilePage() {
  const { user } = useAuth();

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarReservas = async () => {
      if (!user?.id) {
        setCargando(false);
        return;
      }

      try {
        const data = await getReservasByUsuario(user.id);
        setReservas(data);
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        setError("No se pudo cargar la información del perfil.");
      } finally {
        setCargando(false);
      }
    };

    cargarReservas();
  }, [user]);

  const iniciales = useMemo(() => {
    if (!user?.nombre) return "EV";

    return user.nombre
      .split(" ")
      .map((parte) => parte[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const gastoTotal = reservas.reduce(
    (total, reserva) => total + reserva.precioTotal,
    0
  );

  const reservasConfirmadas = reservas.filter(
    (reserva) => reserva.estado === "CONFIRMADA"
  ).length;

  const proximaReserva = reservas
    .filter((reserva) => reserva.evento?.fechaInicio)
    .sort(
      (a, b) =>
        new Date(a.evento.fechaInicio).getTime() -
        new Date(b.evento.fechaInicio).getTime()
    )[0];

  if (cargando) {
    return (
      <section className="page">
        <div className="container">
          <Loading text="Cargando perfil" />
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="page">
        <div className="container">
          <div className="msg-error">Debes iniciar sesión para ver tu perfil.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <h2 className="page-title">
            MI <span className="page-title-accent">PERFIL</span>
          </h2>

          <p className="page-subtitle">
            Tu zona privada dentro del universo Eventia.
          </p>
        </div>

        {error && <div className="msg-error">⚠ {error}</div>}

        <div className="summary-grid">
          <SummaryCard
            title="Reservas"
            value={reservas.length}
            description="Experiencias guardadas"
          />

          <SummaryCard
            title="Confirmadas"
            value={reservasConfirmadas}
            accentColor="var(--neon-acid)"
          />

          <SummaryCard
            title="Gastado"
            value={`${gastoTotal.toFixed(2)}€`}
            accentColor="var(--neon-magenta)"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 420px) 1fr",
            gap: 24,
          }}
        >
          <div className="card card-glow-cyan">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginBottom: 28,
              }}
            >
              <div className="profile-avatar">{iniciales}</div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.8rem",
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                  }}
                >
                  {user.nombre}
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: "var(--neon-cyan)",
                    letterSpacing: "0.12em",
                    marginTop: 6,
                  }}
                >
                  {user.rol}
                </div>
              </div>
            </div>

            <div className="profile-row">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user.email}</span>
            </div>

            <div className="profile-row">
              <span className="profile-label">Rol</span>
              <span
                className="profile-value"
                style={{ color: "var(--neon-magenta)" }}
              >
                {user.rol}
              </span>
            </div>
          </div>

          <div className="card card-glow-magenta">
            <span className="tag tag-acid">PRÓXIMA EXPERIENCIA</span>

            {proximaReserva ? (
              <>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    letterSpacing: "0.04em",
                    marginTop: 18,
                    marginBottom: 8,
                  }}
                >
                  {proximaReserva.evento.nombre}
                </h3>

                <p style={{ color: "var(--text-muted)" }}>
                  {proximaReserva.evento.recinto?.nombre},{" "}
                  {proximaReserva.evento.recinto?.ciudad}
                </p>

                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--neon-cyan)",
                    marginTop: 16,
                  }}
                >
                  {new Date(proximaReserva.evento.fechaInicio).toLocaleDateString(
                    "es-ES",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
              </>
            ) : (
              <p style={{ color: "var(--text-muted)", marginTop: 18 }}>
                Todavía no tienes una próxima experiencia reservada.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;