import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Importaciones de Páginas:
import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import RequestCredit from "./pages/RequestCredit";
import Solicitudes from "./pages/Solicitudes"; // Importación esencial para la nueva página

// Importaciones de Toast y ESTILOS:
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./styles/global.css"; // CRÍTICO: Asegura que todos los estilos se carguen

export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* ÚNICA VEZ que se renderiza el Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulador" element={<Simulator />} />
        <Route path="/solicitar" element={<RequestCredit />} />
        <Route path="/solicitudes" element={<Solicitudes />} />{" "}
        {/* RUTA ESENCIAL */}
      </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}
