// src/pages/Home.jsx

import { useState } from "react";
// Importar creditos (Asumiendo que hemos corregido este archivo a Array de Objetos)
import { creditos } from "../data/creditos";
import CreditCard from "../components/CreditCard";

export default function Home() {
  const [busqueda, setBusqueda] = useState("");
  const [montoFiltro, setMontoFiltro] = useState("");
  const [ordenTasa, setOrdenTasa] = useState(""); // asc | ""

  // ---------------------------------
  //    PROCESAR FILTROS
  // ---------------------------------
  const filtrarCreditos = () => {
    // Si la estructura de datos es grande, puedes inicializar con una copia
    // let lista = [...creditos];
    let lista = creditos;

    // 1. Filtro por búsqueda en nombre
    if (busqueda.trim() !== "") {
      lista = lista.filter((c) =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // 2. Filtro por monto
    if (montoFiltro !== "") {
      const monto = Number(montoFiltro);
      lista = lista.filter((c) => c.montoMin <= monto && c.montoMax >= monto);
    }

    // 3. Orden por tasa (Usando inmutabilidad con [...lista].sort())
    if (ordenTasa === "asc") {
      lista = [...lista].sort((a, b) => a.tasa - b.tasa);
    }

    return lista;
  };

  const listaFinal = filtrarCreditos();

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <h1>CreditSmart</h1>
        <p>Encuentra el crédito ideal de forma rápida y sencilla.</p>
      </section>

      {/* FILTROS --------------------------- */}
      <div className="container" style={{ marginBottom: "25px" }}>
        <h2 style={{ marginBottom: "15px" }}>Búsqueda y Filtros</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {/* BUSCADOR */}
          <input
            type="text"
            placeholder="Buscar crédito por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="simulator__input"
            style={{ flex: 1, minWidth: "220px" }}
          />

          {/* FILTRO DE MONTO */}
          <input
            type="number"
            placeholder="Monto a solicitar"
            value={montoFiltro}
            onChange={(e) => setMontoFiltro(e.target.value)}
            className="simulator__input"
            style={{ flex: 1, minWidth: "180px" }}
          />

          {/* ORDENAR POR TASA */}
          <select
            value={ordenTasa}
            onChange={(e) => setOrdenTasa(e.target.value)}
            className="simulator__select"
            style={{ minWidth: "160px" }}
          >
            <option value="">Ordenar por tasa</option>
            <option value="asc">Menor a mayor (Tasa)</option>
          </select>
        </div>
      </div>

      {/* LISTADO DE TARJETAS --------------------------- */}
      <div className="cards-grid container">
        {listaFinal.length > 0 ? (
          listaFinal.map((credito) => (
            // Key estable y prop 'credit' pasada correctamente
            <CreditCard key={credito.id} credito={credito} />
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            No hay créditos disponibles con los filtros seleccionados.
          </p>
        )}
      </div>
    </div>
  );
}
