export default function CreditCard({ icon, title, monto, tasa, plazo }) {
  return (
    <article className="card">
      <div className="card__icon">{icon}</div>

      <h3 className="card__title">{title}</h3>

      <ul className="card__details">
        <li>
          <strong>Monto:</strong> {monto}
        </li>
        <li>
          <strong>Tasa:</strong> {tasa}
        </li>
        <li>
          <strong>Plazo máximo:</strong> {plazo}
        </li>
      </ul>

      <button className="card__button">Solicitar</button>
    </article>
  );
}
