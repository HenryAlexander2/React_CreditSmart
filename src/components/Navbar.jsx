import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar__logo">CreditSmart</div>

      <button
        className={`hamburger-menu ${open ? "is-open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <nav className={`navbar__links nav-menu ${open ? "is-open" : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>
          Inicio
        </Link>
        <Link to="/simulador" onClick={() => setOpen(false)}>
          Simulador
        </Link>
        <Link to="/solicitar" onClick={() => setOpen(false)}>
          Solicitar Crédito
        </Link>
      </nav>
    </header>
  );
}
