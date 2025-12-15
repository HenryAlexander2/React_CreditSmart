// VERSIÓN CON FIREBASE

import { useState, useEffect } from "react";
// Importaciones de Firebase
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import CreditCard from "../components/CreditCard";
import { toast } from "react-toastify";

export default function Home() {
  // Estado para guardar los créditos cargados desde Firestore
  const [creditosCargados, setCreditosCargados] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga (Loading)

  // Estados de Filtro/Ordenación (Se mantienen)
  const [busqueda, setBusqueda] = useState("");
  const [montoFiltro, setMontoFiltro] = useState("");
  const [ordenTasa, setOrdenTasa] = useState("");

  // ----------------------------------------------------
  // FUNCIÓN PARA CARGAR DATOS DESDE FIRESTORE
  // ----------------------------------------------------
  const cargarCreditos = async () => {
    setLoading(true); // Inicia la carga
    try {
      // 1. Referencia a la colección 'creditos'
      const creditosCollection = collection(db, "creditos");

      // 2. Obtener los documentos
      const creditosSnapshot = await getDocs(creditosCollection);

      // 3. Mapear los documentos a un array de objetos
      const creditosList = creditosSnapshot.docs.map((doc) => ({
        id: doc.id, // Usamos el ID de Firestore (e.g., 'inversion')
        ...doc.data(), // Obtenemos el resto de los datos (nombre, tasa, montoMin, etc.)
      }));

      setCreditosCargados(creditosList);
    } catch (error) {
      console.error("Error al cargar créditos:", error);
      // Notificación de error si la conexión falla (Manejo de errores)
      toast.error(
        "Error al conectar con la base de datos. Revisa tu conexión a internet."
      );
    } finally {
      setLoading(false); // Finaliza la carga, sin importar el resultado
    }
  };

  // ----------------------------------------------------
  // EFECTO: Cargar créditos al montar el componente
  // ----------------------------------------------------
  useEffect(() => {
    cargarCreditos();
  }, []);

  // ----------------------------------------------------
  // LÓGICA DE FILTRADO Y ORDENACIÓN (Permanece igual)
  // ----------------------------------------------------
  const filtrarCreditos = () => {
    let lista = creditosCargados; // Ahora usa la lista cargada de Firestore

    // 1. Filtro por búsqueda en nombre
    if (busqueda.trim() !== "") {
      lista = lista.filter((c) =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // 2. Filtro por monto
    if (montoFiltro !== "") {
      const monto = Number(montoFiltro);
      // Usa montoMin y montoMax que vienen de Firestore
      lista = lista.filter((c) => c.montoMin <= monto && c.montoMax >= monto);
    }

    // 3. Orden por tasa
    if (ordenTasa === "asc") {
      lista = [...lista].sort((a, b) => a.tasa - b.tasa);
    }

    return lista;
  };

  const listaFinal = filtrarCreditos();

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero">
        <h1>CreditSmart</h1>
        <p>Encuentra el crédito ideal de forma rápida y sencilla.</p>
      </section>

      {/* FILTROS Y CONTROLES */}
      <div className="container" style={{ marginBottom: "25px" }}>
        <h2 style={{ marginBottom: "15px" }}>Búsqueda y Filtros</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {/* BUSCADOR */}
          <input
            type="text"
            placeholder="Buscar crédito por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="simulator__input"
            style={{ flex: 1, minWidth: "220px" }}
          />

          {/* FILTRO DE MONTO */}
          <input
            type="number"
            placeholder="Monto a solicitar"
            value={montoFiltro}
            onChange={(e) => setMontoFiltro(e.target.value)}
            className="simulator__input"
            style={{ flex: 1, minWidth: "220px" }}
          />

          {/* ORDEN POR TASA */}
          <select
            value={ordenTasa}
            onChange={(e) => setOrdenTasa(e.target.value)}
            className="simulator__select"
            style={{ flex: 1, minWidth: "220px" }}
          >
            <option value="">Ordenar por...</option>
            <option value="asc">Tasa más baja</option>
          </select>
        </div>
      </div>

      {/* RENDERIZADO CONDICIONAL DE LA LISTA */}
      <div className="container cards-grid">
        {/* Manejo de Loading */}
        {loading && (
          <p style={{ textAlign: "center", fontSize: "1.2em", width: "100%" }}>
            Cargando productos crediticios...
          </p>
        )}

        {/* Manejo de Sin Resultados */}
        {!loading && listaFinal.length === 0 && (
          <p style={{ textAlign: "center", fontSize: "1.2em", width: "100%" }}>
            No se encontraron créditos que coincidan con los filtros.
          </p>
        )}

        {/* Mapeo de la lista cargada */}
        {!loading &&
          listaFinal.map((credito) => (
            <CreditCard key={credito.id} credito={credito} />
          ))}
      </div>
    </div>
  );
}
