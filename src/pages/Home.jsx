import CreditCard from "../components/CreditCard";
import { creditos } from "../data/creditos";

export default function Home() {
  return (
    <main>
      <div className="container">
        <section className="hero">
          <h1>Catálogo de Créditos</h1>
          <p>Explora nuestras opciones de financiación disponibles.</p>
        </section>

        <section className="cards-grid">
          {Object.entries(creditos).map(([key, c]) => (
            <CreditCard
              key={key}
              icon={c.icon}
              title={c.nombre}
              monto={`$${c.montoMin.toLocaleString()} - $${c.montoMax.toLocaleString()}`}
              tasa={`${(c.tasa * 100).toFixed(2)}% mensual`}
              plazo={`${c.plazoMax} meses`}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
