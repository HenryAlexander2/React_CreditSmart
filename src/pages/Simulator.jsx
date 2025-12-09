import { useState } from "react";
import { creditos } from "../data/creditos";

export default function Simulator() {
  const [tipo, setTipo] = useState("");
  const [monto, setMonto] = useState("");
  const [cuotas, setCuotas] = useState("");
  const [resultado, setResultado] = useState(null);
  const [tabla, setTabla] = useState([]);

  const calcular = (e) => {
    e.preventDefault();

    const credito = creditos[tipo];
    if (!credito) return;

    const m = Number(monto);
    const c = Number(cuotas);

    if (m < credito.montoMin || m > credito.montoMax) {
      setResultado({ error: "Monto fuera del rango permitido." });
      setTabla([]);
      return;
    }

    if (c < 1 || c > credito.plazoMax) {
      setResultado({ error: `Cuotas máximas: ${credito.plazoMax}` });
      setTabla([]);
      return;
    }

    const interesTotal = m * credito.tasa * c;
    const totalPagar = m + interesTotal;
    const cuotaMensual = totalPagar / c;

    setResultado({
      nombre: credito.nombre,
      monto: m,
      cuotas: c,
      tasa: credito.tasa,
      interesTotal,
      totalPagar,
      cuotaMensual,
    });

    let saldo = m;
    const filas = [];

    for (let mes = 1; mes <= c; mes++) {
      const interesMes = saldo * credito.tasa;
      const abonoCapital = cuotaMensual - interesMes;
      const saldoFinal = saldo - abonoCapital;

      filas.push({
        mes,
        saldo: saldo,
        interesMes,
        abonoCapital,
        saldoFinal,
      });

      saldo = saldoFinal;
    }

    setTabla(filas);
  };

  return (
    <main>
      <div className="container">
        <section className="hero">
          <h1>Simulador de Créditos</h1>
          <p>Filtra créditos según tus necesidades.</p>
        </section>

        <section className="simulator">
          <form className="simulator__form" onSubmit={calcular}>
            <select
              className="simulator__select"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              <option value="">Seleccionar tipo de crédito</option>
              {Object.entries(creditos).map(([key, c]) => (
                <option key={key} value={key}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="simulator__input"
              placeholder="Monto a solicitar"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
            />

            <input
              type="number"
              className="simulator__input"
              placeholder="Número de cuotas"
              value={cuotas}
              onChange={(e) => setCuotas(e.target.value)}
              required
            />

            <button className="simulator__button">Calcular</button>
          </form>
        </section>

        {/* RESULTADO */}
        {resultado && (
          <section
            className="card"
            style={{ maxWidth: "500px", margin: "20px auto" }}
          >
            {resultado.error ? (
              <p>{resultado.error}</p>
            ) : (
              <>
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
                    <strong>Interés mensual:</strong>{" "}
                    {(resultado.tasa * 100).toFixed(2)}%
                  </li>
                  <li>
                    <strong>Total intereses:</strong> $
                    {resultado.interesTotal.toLocaleString()}
                  </li>
                  <li>
                    <strong>Total a pagar:</strong> $
                    {resultado.totalPagar.toLocaleString()}
                  </li>
                  <li>
                    <strong>Cuota mensual:</strong> $
                    {resultado.cuotaMensual.toLocaleString()}
                  </li>
                </ul>
              </>
            )}
          </section>
        )}

        {/* TABLA */}
        {tabla.length > 0 && (
          <section style={{ marginTop: "20px" }}>
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
              Tabla de amortización
            </h3>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
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
                    <td>${fila.saldo.toLocaleString()}</td>
                    <td>${fila.interesMes.toFixed(0)}</td>
                    <td>${fila.abonoCapital.toFixed(0)}</td>
                    <td>${fila.saldoFinal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </main>
  );
}
