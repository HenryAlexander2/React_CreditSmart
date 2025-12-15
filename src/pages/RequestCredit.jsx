// src/pages/RequestCredit.jsx

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Importaciones de Firebase y Firestore
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

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
  const [creditosDisponibles, setCreditosDisponibles] = useState([]); // Estado para tipos de crédito
  const [loadingCreditos, setLoadingCreditos] = useState(true); // Estado de loading

  // FUNCIÓN PARA CARGAR TIPOS DE CRÉDITO DESDE FIRESTORE
  useEffect(() => {
    const cargarTiposCredito = async () => {
      try {
        const creditosCollection = collection(db, "creditos");
        const creditosSnapshot = await getDocs(creditosCollection);

        const creditosList = creditosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCreditosDisponibles(creditosList);
      } catch (error) {
        console.error("Error al cargar tipos de crédito:", error);
        toast.error(
          "Error al cargar opciones de crédito desde la base de datos."
        );
      } finally {
        setLoadingCreditos(false);
      }
    };

    cargarTiposCredito();
  }, []);

  // Lógica de Validación
  const validarCampo = (name, value) => {
    let msg = "";
    if (!value.toString().trim()) {
      msg = "Este campo es obligatorio.";
    } else {
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
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validarCampo(name, value);
  };

  const formIsValid = () => {
    const hasErrors = Object.values(errors).some((e) => e !== "");
    if (hasErrors) return false;

    let allValid = true;
    let newErrors = {};

    Object.keys(form).forEach((key) => {
      // Ignoramos la validación en Plazo y Destino si la aplicas en el formulario.
      // Aquí se valida que no estén vacíos.
      if (!form[key].toString().trim()) {
        newErrors[key] = "Este campo es obligatorio.";
        allValid = false;
      }
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return allValid;
  };

  // FUNCIÓN PARA ENVIAR Y PERSISTIR EN FIRESTORE
  const enviarSolicitud = async () => {
    try {
      const solicitudesCollection = collection(db, "solicitudes");

      const solicitudData = {
        ...form,
        fechaSolicitud: new Date(),
        estado: "Pendiente Revisión",
        monto: Number(form.monto),
        ingresos: Number(form.ingresos),
      };

      await addDoc(solicitudesCollection, solicitudData);

      toast.success("Solicitud enviada y guardada correctamente en la nube 🎉");

      // Limpiar el estado después del envío exitoso
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
    } catch (error) {
      console.error("Error al guardar solicitud:", error);
      toast.error("Error al guardar la solicitud. Intenta nuevamente.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formIsValid()) {
      toast.error("Faltan campos por completar o hay errores de validación.");
      return;
    }

    setShowResumen(true);
    toast.info("Revisa el resumen antes de enviar");
  };

  // Obtener el nombre completo del crédito para el resumen
  const nombreCredito =
    creditosDisponibles.find((c) => c.id === form.tipoCredito)?.nombre ||
    form.tipoCredito;

  return (
    <div className="container">
      <section className="hero">
        <h1>Solicitud de Crédito</h1>
        <p>Completa la información para enviar tu solicitud.</p>
      </section>

      <div
        className="simulator"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          alignItems: "center",
        }}
      >
        {/* FORMULARIO DE ENTRADA (COMPLETO) */}
        {!showResumen && (
          <form
            className="simulator__form"
            onSubmit={handleSubmit}
            style={{ width: "100%", maxWidth: "800px" }}
          >
            <h2 style={{ marginBottom: "20px" }}>Datos Personales</h2>

            {/* FILAS DE INPUTS DE DATOS PERSONALES */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
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
              <div style={{ flex: 1, minWidth: "300px" }}>
                <input
                  className={`simulator__input ${
                    errors.cedula ? "has-error" : ""
                  }`}
                  type="number"
                  name="cedula"
                  placeholder="Cédula *"
                  value={form.cedula}
                  onChange={handleChange}
                />
                {errors.cedula && <ErrorMessage message={errors.cedula} />}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
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
              <div style={{ flex: 1, minWidth: "300px" }}>
                <input
                  className={`simulator__input ${
                    errors.telefono ? "has-error" : ""
                  }`}
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono de contacto *"
                  value={form.telefono}
                  onChange={handleChange}
                />
                {errors.telefono && <ErrorMessage message={errors.telefono} />}
              </div>
            </div>

            <h2 style={{ marginBottom: "20px", marginTop: "30px" }}>
              Detalles de la Solicitud
            </h2>

            {/* FILA 3: TIPO CRÉDITO Y MONTO (Ya estaba bien) */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              {/* TIPO CRÉDITO */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <select
                  className={`simulator__select ${
                    errors.tipoCredito ? "has-error" : ""
                  }`}
                  name="tipoCredito"
                  value={form.tipoCredito}
                  onChange={handleChange}
                  disabled={loadingCreditos}
                >
                  <option value="">
                    {loadingCreditos
                      ? "Cargando opciones..."
                      : "Selecciona el crédito *"}
                  </option>
                  {creditosDisponibles.map((c) => (
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
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              {/* PLAZO */}
              <div style={{ flex: 1, minWidth: "300px" }}>
                <input
                  className={`simulator__input ${
                    errors.plazo ? "has-error" : ""
                  }`}
                  type="number"
                  name="plazo"
                  placeholder="Plazo en meses (ej. 36) *"
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
              Información Laboral y Financiera
            </h2>

            {/* FILA 5: EMPRESA Y CARGO */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
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
                  placeholder="Cargo *"
                  value={form.cargo}
                  onChange={handleChange}
                />
                {errors.cargo && <ErrorMessage message={errors.cargo} />}
              </div>
            </div>

            {/* FILA 6: INGRESOS */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              {/* INGRESOS */}
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
        {/* FIN: FORMULARIO DE ENTRADA */}

        {/* RESUMEN ANTES DE CONFIRMAR (COMPLETO) */}
        {showResumen && (
          <div
            className="resumen"
            style={{
              width: "100%",
              maxWidth: "800px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
              }}
            >
              Resumen de Solicitud
            </h2>

            <p>
              <strong>Tipo de Crédito:</strong> {nombreCredito}
            </p>
            <p>
              <strong>Monto Solicitado:</strong> $
              {Number(form.monto).toLocaleString()}
            </p>
            <p>
              <strong>Plazo:</strong> {form.plazo} meses
            </p>
            <p>
              <strong>Destino:</strong> {form.destino}
            </p>

            <h3
              style={{
                marginTop: "20px",
                marginBottom: "10px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "5px",
              }}
            >
              Datos del Solicitante
            </h3>
            <p>
              <strong>Nombre:</strong> {form.nombre}
            </p>
            <p>
              <strong>Cédula:</strong> {form.cedula}
            </p>
            <p>
              <strong>Email:</strong> {form.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {form.telefono}
            </p>

            <h3
              style={{
                marginTop: "20px",
                marginBottom: "10px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "5px",
              }}
            >
              Información Laboral
            </h3>
            <p>
              <strong>Empresa:</strong> {form.empresa}
            </p>
            <p>
              <strong>Cargo:</strong> {form.cargo}
            </p>
            <p>
              <strong>Ingresos:</strong> $
              {Number(form.ingresos).toLocaleString()}
            </p>

            <button
              className="simulator__button"
              style={{ marginTop: "30px", marginRight: "10px" }}
              onClick={() => setShowResumen(false)} // Permite regresar al formulario
            >
              &larr; Volver al Formulario
            </button>
            <button
              className="simulator__button"
              style={{ marginTop: "30px" }}
              onClick={enviarSolicitud} // Llama a la nueva función asíncrona de guardado
            >
              Confirmar y Enviar Solicitud
            </button>
          </div>
        )}
        {/* FIN: RESUMEN ANTES DE CONFIRMAR */}
      </div>
    </div>
  );
}
