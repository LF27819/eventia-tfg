import { Link } from "react-router-dom";

function AdminPage() {
  return (
    <section className="page">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <h2 className="page-title">
            PANEL <span className="page-title-accent">ADMIN</span>
          </h2>

          <p className="page-subtitle">
            Centro de control para supervisar usuarios, reservas y entradas.
          </p>
        </div>

        <div className="admin-hub-grid">
          <Link to="/admin/usuarios" className="admin-hub-card">
            <span className="tag tag-cyan">USUARIOS</span>

            <h3>Gestionar usuarios</h3>

            <p>
              Crea usuarios, modifica roles, activa o desactiva cuentas y
              controla el acceso a Eventia.
            </p>

            <strong>Entrar →</strong>
          </Link>

          <Link to="/admin/reservas" className="admin-hub-card">
            <span className="tag tag-acid">RESERVAS</span>

            <h3>Gestionar reservas</h3>

            <p>
              Revisa todas las reservas, confirma operaciones pendientes,
              cancela reservas y supervisa ingresos.
            </p>

            <strong>Entrar →</strong>
          </Link>

          <Link to="/admin/entradas" className="admin-hub-card">
            <span className="tag tag-magenta">ENTRADAS</span>

            <h3>Gestionar entradas</h3>

            <p>
              Consulta entradas emitidas, valida accesos, cancela pases y
              descarga PDFs de entrada.
            </p>

            <strong>Entrar →</strong>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AdminPage;