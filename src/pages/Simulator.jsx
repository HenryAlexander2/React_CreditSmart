// src/pages/Simulator.jsx
import { useState } from "react";
import { creditos } from "../data/credits";

export default function Simulator() {
  const [tipo, setTipo] = useState("");
  const [monto, setMonto] = useState("");
  const [cuotas, setCuotas] = useState("");
  const [resultado, setResultado] = useState(null);
  const [tabla, setTabla] = useState([]);

  // ------------------------------
  //   FUNCIÓN PRINCIPAL
  // ------------------------------
  const calcular = (e) => {
    e.preventDefault();

    if (!tipo || !monto || !cuotas) {
      alert("Completa todos los campos del simulador.");
      return;
    }

    const credito = creditos.find((c) => c.id === tipo);

    if (!credito) {
      alert("Selecciona un crédito válido.");
      return;
    }

    const montoNum = Number(monto);
    const cuotasNum = Number(cuotas);

    if (montoNum < credito.montoMin || montoNum > credito.montoMax) {
      alert(
        `El monto debe estar entre $${credito.montoMin.toLocaleString()} y $${credito.montoMax.toLocaleString()}`
      );
      return;
    }

    if (cuotasNum < 1 || cuotasNum > credito.plazoMax) {
      alert(`El máximo de cuotas es ${credito.plazoMax}`);
      return;
    }

    const interesTotal = montoNum * credito.tasa * cuotasNum;
    const totalPagar = montoNum + interesTotal;
    const cuotaMensual = totalPagar / cuotasNum;

    setResultado({
      nombre: credito.nombre,
      monto: montoNum,
      cuotas: cuotasNum,
      tasa: credito.tasa,
      interesTotal,
      totalPagar,
      cuotaMensual,
    });

    // ------------------------------
    //   TABLA DE AMORTIZACIÓN
    // ------------------------------
    let saldo = montoNum;
    const filas = [];

    for (let mes = 1; mes <= cuotasNum; mes++) {
      const interesMes = saldo * credito.tasa;
      const abonoCapital = cuotaMensual - interesMes;
      const saldoFinal = saldo - abonoCapital;

      filas.push({
        mes,
        saldoInicial: saldo,
        interesMes,
        abonoCapital,
        saldoFinal,
      });

      saldo = saldoFinal;
    }

    setTabla(filas);
  };

  return (
    <div className="container">
      {/* Encabezado */}
      <section className="hero">
        <h1>Simulador de Créditos</h1>
        <p>Calcula tu cuota mensual de forma rápida y sencilla.</p>
      </section>

      {/* FORMULARIO */}
      <div className="simulator">
        <form className="simulator__form" onSubmit={calcular}>
          <select
            className="simulator__select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Seleccionar crédito</option>
            {creditos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <input
            className="simulator__input"
            type="number"
            placeholder="Monto solicitado"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />

          <input
            className="simulator__input"
            type="number"
            placeholder="Número de cuotas"
            value={cuotas}
            onChange={(e) => setCuotas(e.target.value)}
          />

          <button className="simulator__button" type="submit">
            Calcular
          </button>
        </form>
      </div>

      {/* RESULTADO */}
      {resultado && (
        <div className="card" style={{ maxWidth: "550px", margin: "30px auto" }}>
          <div className="card__icon">💰</div>
          <h3 className="card__title">Resultado</h3>
          <ul className="card__details">
            <li>
              <strong>Crédito:</strong> {resultado.nombre}
            </li>
            <li>
              <strong>Monto:</strong> ${resultado.monto.toLocaleString()}
            </li>
            <li>
              <strong>Cuotas:</strong> {resultado.cuotas}
            </li>
            <li>
              <strong>Tasa mensual:</strong>{" "}
              {(resultado.tasa * 100).toFixed(2)}%
            </li>
            <li>
              <strong>Total intereses:</strong>{" "}
              ${resultado.interesTotal.toLocaleString()}
            </li>
            <li>
              <strong>Total a pagar:</strong>{" "}
              ${resultado.totalPagar.toLocaleString()}
            </li>
            <li>
              <strong>Cuota mensual:</strong>{" "}
              ${resultado.cuotaMensual.toLocaleString()}
            </li>
          </ul>
        </div>
      )}

      {/* TABLA DE AMORTIZACIÓN */}
      {tabla.length > 0 && (
        <div style={{ overflowX: "auto", marginBottom: "40px" }}>
          <h3 style={{ textAlign: "center", marginTop: "20px" }}>
            Tabla de Amortización
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "12px",
            }}
          >
            <thead>
              <tr style={{ background: "#00a36c", color: "white" }}>
                <th>Mes</th>
                <th>Saldo inicial</th>
                <th>Interés</th>
                <th>Abono capital</th>
                <th>Saldo final</th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((fila) => (
                <tr key={fila.mes}>
                  <td>{fila.mes}</td>
                  <td>${fila.saldoInicial.toLocaleString()}</td>
                  <td>${fila.interesMes.toFixed(0)}</td>
                  <td>${fila.abonoCapital.toFixed(0)}</td>
                  <td>${fila.saldoFinal.toLocaleString()}
