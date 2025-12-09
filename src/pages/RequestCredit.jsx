import { useState } from "react";
import { toast } from "react-toastify";
import { creditos } from "../data/creditos";

// Componente simple para mostrar mensajes de error
const ErrorMessage = ({ message }) => (
  <p style={{ color: "red", fontSize: "0.8em", margin: "5px 0 10px 0" }}>
    {message}
  </p>
);

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

  const [errors, setErrors] = useState({});
  const [showResumen, setShowResumen] = useState(false);

  // ---------------------------------
  // Lógica de Validación
  // ---------------------------------
  const validarCampo = (name, value) => {
    let msg = "";

    // Validación de campo obligatorio
    if (!value.toString().trim()) {
      msg = "Este campo es obligatorio.";
    } else {
      // Validaciones específicas solo si hay valor
      if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
        msg = "Correo inválido.";
      }
      if (name === "cedula" && value.length < 5) {
        msg = "La cédula debe tener mínimo 5 dígitos.";
      }
      if (
        (name === "monto" || name === "ingresos") &&
        Number(value) < 1000000
      ) {
        msg = `${name === "monto" ? "Monto" : "Ingresos"} mínimos: $1.000.000`;
      }
    }

    // Actualiza solo el error del campo actual
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // 1. Actualiza el estado del formulario
    setForm((prev) => ({ ...prev, [name]: value }));
    // 2. Ejecuta la validación en tiempo real
    validarCampo(name, value);
  };

  const formIsValid = () => {
    // 1. Verificar si hay algún error visible en el estado `errors`
    const hasErrors = Object.values(errors).some((e) => e !== "");
    if (hasErrors) return false;

    // 2. Ejecutar validación final de campos vacíos para todos los campos
    let allValid = true;
    let newErrors = {};

    Object.keys(form).forEach((key) => {
      if (!form[key].toString().trim()) {
        newErrors[key] = "Este campo es obligatorio.";
        allValid = false;
      }
    });

    // Actualizar errores y retornar la validez
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return allValid;
  };

  // ---------------------------------
  // Manejo de Envío y Resumen
  // ---------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formIsValid()) {
      toast.error("Faltan campos por completar o hay errores de validación.");
      return;
    }

    setShowResumen(true);
    toast.info("Revisa el resumen antes de enviar");
  };

  const enviarSolicitud = () => {
    toast.success("Solicitud enviada correctamente 🎉");

    // Limpiar formulario y estados después del envío exitoso
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

    setErrors({});
    setShowResumen(false);
  };

  // Obtener el nombre completo del crédito para el resumen
  const nombreCredito =
    creditos.find((c) => c.id === form.tipoCredito)?.nombre || form.tipoCredito;

  return (
    <div className="container">
      <section className="hero">
        <h1>Solicitud de Crédito</h1>
        <p>Completa la información para enviar tu solicitud.</p>
      </section>

      {/* Contenedor principal centrado */}
      <div
        className="simulator"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          alignItems: "center",
        }}
      >
        {/* FORMULARIO DE ENTRADA (Muestra si NO hay resumen) */}
        {!showResumen && (
          <form
            className="simulator__form"
            onSubmit={handleSubmit}
            style={{ width: "100%", maxWidth: "800px" }}
          >
            <h2 style={{ marginBottom: "20px" }}>Datos Personales</h2>

            {/* FILA 1: NOMBRE Y CÉDULA */}
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {/* NOMBRE */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <input
                  className={`simulator__input ${
                    errors.nombre ? "has-error" : ""
                  }`}
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo *"
                  value={form.nombre}
                  onChange={handleChange}
                />
                {errors.nombre && <ErrorMessage message={errors.nombre} />}
              </div>

              {/* CÉDULA */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <input
                  className={`simulator__input ${
                    errors.cedula ? "has-error" : ""
                  }`}
                  type="number"
                  name="cedula"
                  placeholder="Cédula / ID *"
                  value={form.cedula}
                  onChange={handleChange}
                />
                {errors.cedula && <ErrorMessage message={errors.cedula} />}
              </div>
            </div>

            {/* FILA 2: EMAIL Y TELÉFONO */}
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {/* EMAIL */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <input
                  className={`simulator__input ${
                    errors.email ? "has-error" : ""
                  }`}
                  type="email"
                  name="email"
                  placeholder="Correo electrónico *"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <ErrorMessage message={errors.email} />}
              </div>

              {/* TELÉFONO */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <input
                  className={`simulator__input ${
                    errors.telefono ? "has-error" : ""
                  }`}
                  type="number"
                  name="telefono"
                  placeholder="Teléfono *"
                  value={form.telefono}
                  onChange={handleChange}
                />
                {errors.telefono && <ErrorMessage message={errors.telefono} />}
              </div>
            </div>

            <h2 style={{ marginBottom: "20px", marginTop: "30px" }}>
              Detalles de la Solicitud
            </h2>

            {/* FILA 3: TIPO CRÉDITO Y MONTO */}
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {/* TIPO CRÉDITO */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <select
                  className={`simulator__select ${
                    errors.tipoCredito ? "has-error" : ""
                  }`}
                  name="tipoCredito"
                  value={form.tipoCredito}
                  onChange={handleChange}
                >
                  <option value="">Selecciona el crédito *</option>
                  {creditos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
                {errors.tipoCredito && (
                  <ErrorMessage message={errors.tipoCredito} />
                )}
              </div>

              {/* MONTO */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <input
                  className={`simulator__input ${
                    errors.monto ? "has-error" : ""
                  }`}
                  type="number"
                  name="monto"
                  placeholder="Monto solicitado (Mín. $1.000.000) *"
                  value={form.monto}
                  onChange={handleChange}
                />
                {errors.monto && <ErrorMessage message={errors.monto} />}
              </div>
            </div>

            {/* FILA 4: PLAZO Y DESTINO */}
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {/* PLAZO */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <input
                  className={`simulator__input ${
                    errors.plazo ? "has-error" : ""
                  }`}
                  type="number"
                  name="plazo"
                  placeholder="Plazo en meses *"
                  value={form.plazo}
                  onChange={handleChange}
                />
                {errors.plazo && <ErrorMessage message={errors.plazo} />}
              </div>

              {/* DESTINO */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <input
                  className={`simulator__input ${
                    errors.destino ? "has-error" : ""
                  }`}
                  type="text"
                  name="destino"
                  placeholder="Destino del crédito *"
                  value={form.destino}
                  onChange={handleChange}
                />
                {errors.destino && <ErrorMessage message={errors.destino} />}
              </div>
            </div>

            <h2 style={{ marginBottom: "20px", marginTop: "30px" }}>
              Datos Laborales
            </h2>

            {/* FILA 5: EMPRESA Y CARGO */}
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {/* EMPRESA */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <input
                  className={`simulator__input ${
                    errors.empresa ? "has-error" : ""
                  }`}
                  type="text"
                  name="empresa"
                  placeholder="Empresa donde trabaja *"
                  value={form.empresa}
                  onChange={handleChange}
                />
                {errors.empresa && <ErrorMessage message={errors.empresa} />}
              </div>

              {/* CARGO */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <input
                  className={`simulator__input ${
                    errors.cargo ? "has-error" : ""
                  }`}
                  type="text"
                  name="cargo"
                  placeholder="Cargo que ocupa *"
                  value={form.cargo}
                  onChange={handleChange}
                />
                {errors.cargo && <ErrorMessage message={errors.cargo} />}
              </div>
            </div>

            {/* FILA 6: INGRESOS (Campo único, ocupa todo el ancho) */}
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "300px" }}>
                <input
                  className={`simulator__input ${
                    errors.ingresos ? "has-error" : ""
                  }`}
                  type="number"
                  name="ingresos"
                  placeholder="Ingresos mensuales (Mín. $1.000.000) *"
                  value={form.ingresos}
                  onChange={handleChange}
                />
                {errors.ingresos && <ErrorMessage message={errors.ingresos} />}
              </div>
            </div>

            <button
              className="simulator__button"
              type="submit"
              style={{ marginTop: "20px" }}
            >
              Revisar y Continuar
            </button>
          </form>
        )}

        {/* RESUMEN ANTES DE CONFIRMAR (Muestra solo si showResumen es true) */}
        {showResumen && (
          <div
            className="card"
            style={{ maxWidth: "600px", width: "100%", padding: "20px" }}
          >
            <h2>Resumen de Solicitud</h2>

            <ul
              className="card__details"
              style={{ listStyle: "none", padding: 0 }}
            >
              <li>
                <strong>Nombre:</strong> {form.nombre}
              </li>
              <li>
                <strong>Cédula:</strong> {form.cedula}
              </li>
              <li>
                <strong>Email:</strong> {form.email}
              </li>
              <li>
                <strong>Teléfono:</strong> {form.telefono}
              </li>
              <li>
                <strong>Crédito:</strong> {nombreCredito}
              </li>
              <li>
                <strong>Monto:</strong> ${Number(form.monto).toLocaleString()}
              </li>
              <li>
                <strong>Plazo:</strong> {form.plazo} meses
              </li>
              <li>
                <strong>Destino:</strong> {form.destino}
              </li>
              <li style={{ marginTop: "15px" }}>--- Datos Laborales ---</li>
              <li>
                <strong>Empresa:</strong> {form.empresa}
              </li>
              <li>
                <strong>Ingresos:</strong> $
                {Number(form.ingresos).toLocaleString()}
              </li>
            </ul>

            <button
              className="simulator__button"
              style={{ marginTop: "20px" }}
              onClick={enviarSolicitud}
            >
              Confirmar y Enviar Solicitud
            </button>
            <button
              className="simulator__button"
              style={{ marginTop: "10px", backgroundColor: "#999" }}
              onClick={() => setShowResumen(false)}
            >
              Modificar Datos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
