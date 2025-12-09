import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Simulator from "./pages/Simulator";
import RequestCredit from "./pages/RequestCredit";

import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulador" element={<Simulator />} />
        <Route path="/solicitar" element={<RequestCredit />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
