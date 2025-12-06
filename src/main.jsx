import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // vacío por ahora

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
