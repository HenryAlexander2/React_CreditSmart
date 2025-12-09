import { useState } from "react";
import { toast } from "react-toastify"; // <-- IMPORTANTE

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

  const validarCampo = (name, value) => {
    let msg = "";

    if (!value.trim()) msg = "Este campo es obligatorio.";

    if (name === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      msg = "Correo inválido.";
    }

    if (name === "cedula" && value.length < 5) {
      msg = "La cédula debe tener mínimo 5 dígitos.";
    }

    if (name === "monto" && value && Number(value) < 1000000) {
      msg = "Monto mínimo: $1.000.000";
    }

    if (name === "ingresos" && value && Number(value) < 1000000) {
      msg = "Ingresos mínimos: $1.000.000";
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validarCampo(name, value);
  };

  const formIsValid = () => {
    const noErrors = Object.values(errors).every((e) => e === "");
    const filled = Object.values(form).every((v) => v.trim() !== "");
    return noErrors && filled;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formIsValid()) {
      toast.error("Faltan campos por completar"); // <--- TOAST ERROR
      return;
    }

    setShowResumen(true);
    toast.info("Revisa el resumen antes de enviar"); // <--- TOAST INFO
  };

  const enviarSolicitud = () => {
    toast.success("Solicitud enviada correctamente 🎉"); // <-- TOAST SUCCESS

    // Limpiar todo después de enviar
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

  return (
    <div className="container">
      <section className="hero">
        <h1>Solicitud de Crédito</h1>
        <p>Completa la información para enviar tu solicitud.</p>
      </section>

      <form className="form" onSubmit={handleSubmit}>
        {/* ... TODO TU FORMULARIO IGUAL ... */}
      </form>

      {/* RESUMEN ANTES DE CONFIRMAR */}
      {showResumen && (
        <div style={{ marginTop: "30px" }}>
          <h2>Resumen de Solicitud</h2>

          {/* SE IMPRIME TODO EL RESUMEN */}
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
          <p>
            <strong>Crédito:</strong> {form.tipoCredito}
          </p>
          <p>
            <strong>Monto:</strong> ${Number(form.monto).toLocaleString()}
          </p>
          <p>
            <strong>Plazo:</strong> {form.plazo}
          </p>
          <p>
            <strong>Empresa:</strong> {form.empresa}
          </p>
          <p>
            <strong>Cargo:</strong> {form.cargo}
          </p>
          <p>
            <strong>Ingresos:</strong> ${Number(form.ingresos).toLocaleString()}
          </p>

          <button
            className="btn-submit"
            style={{ marginTop: "20px" }}
            onClick={enviarSolicitud}
          >
            Enviar Solicitud
          </button>
        </div>
      )}
    </div>
  );
}
