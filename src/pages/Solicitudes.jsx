// src/pages/Solicitudes.jsx

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function Solicitudes() {
  const [solicitudesList, setSolicitudesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para formatear fechas a un formato legible
  const formatFecha = (timestamp) => {
    // Firestore guarda las fechas como un objeto Timestamp, necesitamos convertirlo
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "N/A";
  };

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      // Referencia a la colección 'solicitudes'
      const solicitudesRef = collection(db, "solicitudes");

      // Creamos una consulta (query) para ordenar por fecha más reciente
      const q = query(solicitudesRef, orderBy("fechaSolicitud", "desc"));

      const snapshot = await getDocs(q);

      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSolicitudesList(lista);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      toast.error("Error al cargar las solicitudes de la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  return (
    <div className="container">
      <section className="hero">
        <h1>Historial de Solicitudes</h1>
        <p>
          Aquí puedes consultar todas las solicitudes guardadas en Firestore.
        </p>
      </section>

      <div
        className="simulator"
        style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}
      >
        {loading && (
          <p style={{ textAlign: "center", fontSize: "1.2em" }}>
            Cargando solicitudes...
          </p>
        )}

        {!loading && solicitudesList.length === 0 && (
          <p style={{ textAlign: "center", fontSize: "1.2em" }}>
            No hay solicitudes guardadas aún. Envía una desde el formulario.
          </p>
        )}

        {!loading && solicitudesList.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4" }}>
                <th
                  style={{
                    padding: "10px",
                    borderBottom: "2px solid #ccc",
                    textAlign: "left",
                  }}
                >
                  Fecha
                </th>
                <th
                  style={{
                    padding: "10px",
                    borderBottom: "2px solid #ccc",
                    textAlign: "left",
                  }}
                >
                  Solicitante
                </th>
                <th
                  style={{
                    padding: "10px",
                    borderBottom: "2px solid #ccc",
                    textAlign: "left",
                  }}
                >
                  Crédito
                </th>
                <th
                  style={{
                    padding: "10px",
                    borderBottom: "2px solid #ccc",
                    textAlign: "right",
                  }}
                >
                  Monto
                </th>
                <th
                  style={{
                    padding: "10px",
                    borderBottom: "2px solid #ccc",
                    textAlign: "left",
                  }}
                >
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {solicitudesList.map((solicitud) => (
                <tr key={solicitud.id}>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #eee" }}
                  >
                    {formatFecha(solicitud.fechaSolicitud)}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #eee" }}
                  >
                    {solicitud.nombre}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #eee" }}
                  >
                    {solicitud.tipoCredito.toUpperCase()}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                      textAlign: "right",
                    }}
                  >
                    $
                    {solicitud.monto ? solicitud.monto.toLocaleString() : "N/A"}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #eee" }}
                  >
                    {solicitud.estado}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
