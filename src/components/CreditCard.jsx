// src/components/CreditCard.jsx
export default function CreditCard({ credito }) {
  return (
    <div className="card">
      <div className="card__icon">{credito.icono}</div>

      <h3 className="card__title">{credito.nombre}</h3>

      <ul className="card__details">
        <li>
          <strong>Tasa mensual:</strong> {(credito.tasa * 100).toFixed(2)}%
        </li>
        <li>
          <strong>Monto mínimo:</strong> ${credito.montoMin.toLocaleString()}
        </li>
        <li>
          <strong>Monto máximo:</strong> ${credito.montoMax.toLocaleString()}
        </li>
        <li>
          <strong>Plazo máximo:</strong> {credito.plazoMax} meses
        </li>
      </ul>

      <button
        className="card__button"
        onClick={() => alert(`Seleccionaste: ${credito.nombre}`)}
      >
        Solicitar
      </button>
    </div>
  );
}
