// src/components/Navbar.jsx (Versión para el Usuario Final)

import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

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
        <Link to="/" onClick={closeMenu}>
          Inicio
        </Link>
        <Link to="/simulador" onClick={closeMenu}>
          Simulador
        </Link>
        <Link to="/solicitar" onClick={closeMenu}>
          Solicitar Crédito
        </Link>
        {/* ELIMINAMOS EL ENLACE A "/solicitudes" POR SEGURIDAD */}
      </nav>
    </header>
  );
}
