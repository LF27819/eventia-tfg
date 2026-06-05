import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="page">
      <div className="container">
        <div className="notfound-card">
          <span className="notfound-code">404</span>

          <h1 className="notfound-title">
            EL <span className="page-title-accent">AFTER</span> NO ES POR AQUI
          </h1>

          <p className="notfound-text">
            La ruta que buscas no está en el cartel o la página que
            buscas no existe.
          </p>

          <div className="notfound-actions">
            <Link to="/" className="btn btn-acid">
              Volver al inicio
            </Link>

            <Link to="/eventos" className="btn btn-secondary">
              Ver eventos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;