import { useState } from "react";

export default function RequestCredit() {
  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    email: "",
    telefono: "",
    tipoCredito: "",
    monto: "",
    plazo: "",
    destino: "",
    empresa: "",
    cargo: "",
    ingresos: "",
  });

  const update = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    alert("Solicitud enviada exitosamente");
  };

  const reset = () =>
    setForm({
      nombre: "",
      cedula: "",
      email: "",
      telefono: "",
      tipoCredito: "",
      monto: "",
      plazo: "",
      destino: "",
      empresa: "",
      cargo: "",
      ingresos: "",
    });

  return (
    <main>
      <div className="container">
        <section className="hero">
          <h1>Solicitud de Crédito</h1>
          <p>Completa la información para enviar tu solicitud.</p>
        </section>

        <form className="form" onSubmit={submit} onReset={reset}>
          {/* DATOS PERSONALES */}
          <fieldset className="form-section">
            <legend>Datos Personales</legend>

            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              className="form-input"
              value={form.nombre}
              onChange={update}
              required
            />

            <label htmlFor="cedula">Cédula</label>
            <input
              id="cedula"
              type="number"
              className="form-input"
              value={form.cedula}
              onChange={update}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={form.email}
              onChange={update}
              required
            />

            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              type="tel"
              className="form-input"
              value={form.telefono}
              onChange={update}
              required
            />
          </fieldset>

          {/* DATOS DEL CREDITO */}
          <fieldset className="form-section">
            <legend>Datos del Crédito</legend>

            <label htmlFor="tipoCredito">Tipo de crédito</label>
            <select
              id="tipoCredito"
              className="form-input"
              value={form.tipoCredito}
              onChange={update}
              required
            >
              <option value="">Seleccionar…</option>
              <option>Crédito Libre Inversión</option>
              <option>Crédito Vehículo</option>
              <option>Crédito Vivienda</option>
              <option>Crédito Educativo</option>
              <option>Crédito Empresarial</option>
            </select>

            <label htmlFor="monto">Monto solicitado</label>
            <input
              id="monto"
              type="number"
              className="form-input"
              value={form.monto}
              onChange={update}
              required
            />

            <label htmlFor="plazo">Plazo</label>
            <select
              id="plazo"
              className="form-input"
              value={form.plazo}
              onChange={update}
              required
            >
              <option value="">Seleccionar…</option>
              <option>12 meses</option>
              <option>24 meses</option>
              <option>36 meses</option>
              <option>48 meses</option>
              <option>60 meses</option>
            </select>

            <label htmlFor="destino">Destino del crédito</label>
            <textarea
              id="destino"
              className="form-input"
              value={form.destino}
              onChange={update}
              required
            />
          </fieldset>

          {/* DATOS LABORALES */}
          <fieldset className="form-section">
            <legend>Datos Laborales</legend>

            <label htmlFor="empresa">Empresa donde trabaja</label>
            <input
              id="empresa"
              className="form-input"
              value={form.empresa}
              onChange={update}
              required
            />

            <label htmlFor="cargo">Cargo</label>
            <input
              id="cargo"
              className="form-input"
              value={form.cargo}
              onChange={update}
              required
            />

            <label htmlFor="ingresos">Ingresos mensuales</label>
            <input
              id="ingresos"
              type="number"
              className="form-input"
              value={form.ingresos}
              onChange={update}
              required
            />
          </fieldset>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">
              Enviar solicitud
            </button>
            <button type="reset" className="btn-reset">
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
