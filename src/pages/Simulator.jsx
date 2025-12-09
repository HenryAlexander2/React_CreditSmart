import { useState } from "react";
import { creditos } from "../data/creditos";

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

    // 1. Validación de campos obligatorios
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

    // 2. Validación de rangos de monto y plazo
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

    // 3. Cálculo de cuota
    const i = credito.tasa;
    const n = cuotasNum;

    // Fórmula de la Cuota Fija (Método Francés/Alemán)
    // C = (P * i) / (1 - (1 + i)^-n)
    let cuotaMensual = 0;
    if (i > 0) {
      // Uso de Math.pow para potencia
      cuotaMensual = (montoNum * i) / (1 - Math.pow(1 + i, -n));
    } else {
      // Si el interés es 0 (no recomendado en apps reales, pero es una protección)
      cuotaMensual = montoNum / n;
    }

    // ------------------------------
    //   TABLA DE AMORTIZACIÓN
    // ------------------------------
    let saldo = montoNum;
    const filas = [];
    let totalInteresesCalculado = 0;

    for (let mes = 1; mes <= cuotasNum; mes++) {
      const interesMes = saldo * i;
      let abonoCapital = cuotaMensual - interesMes;
      let saldoFinal = saldo - abonoCapital;

      // Ajuste para la última cuota para evitar saldos negativos por redondeo
      if (mes === cuotasNum) {
        abonoCapital = saldo; // El abono a capital es el saldo restante
        cuotaMensual = abonoCapital + interesMes; // Se ajusta la cuota final
        saldoFinal = 0; // El saldo final es cero
      }

      filas.push({
        mes,
        saldoInicial: saldo,
        interesMes,
        abonoCapital,
        saldoFinal,
        cuotaMensual: cuotaMensual, // Se agrega la cuota real de este mes
      });

      saldo = saldoFinal;
      totalInteresesCalculado += interesMes;
    }

    // Cierre del cálculo
    const totalPagar = montoNum + totalInteresesCalculado;

    setResultado({
      nombre: credito.nombre,
      monto: montoNum,
      cuotas: cuotasNum,
      tasa: credito.tasa,
      interesTotal: totalInteresesCalculado, // Nuevo cálculo
      totalPagar: totalPagar, // Nuevo cálculo
      cuotaMensual: cuotaMensual, // Nuevo cálculo (cuota fija inicial)
    });

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
        <div
          className="card"
          style={{ maxWidth: "550px", margin: "30px auto" }}
        >
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
              <strong>Tasa mensual:</strong> {(resultado.tasa * 100).toFixed(2)}
              %
            </li>
            <li>
              <strong>Total intereses:</strong> $
              {resultado.interesTotal.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </li>
            <li>
              <strong>Total a pagar:</strong> $
              {resultado.totalPagar.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </li>
            <li>
              <strong>Cuota mensual inicial:</strong> $
              {resultado.cuotaMensual.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
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
                <th>Cuota Fija</th>{" "}
                {/* Nuevo campo para mostrar la cuota real de ese mes */}
                <th>Saldo inicial</th>
                <th>Interés</th>
                <th>Abono capital</th>
                <th>Saldo final</th>
              </tr>
            </thead>
            <tbody>
              {/* tabla Amortizacion */}
              {tabla.map((fila) => (
                <tr key={fila.mes}>
                  <td>{fila.mes}</td>
                  <td>
                    $
                    {fila.cuotaMensual.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td>
                    $
                    {fila.saldoInicial.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td>
                    $
                    {fila.interesMes.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td>
                    $
                    {fila.abonoCapital.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td>
                    $
                    {fila.saldoFinal.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
