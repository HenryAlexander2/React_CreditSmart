CreditSmart: Plataforma de Gestión y Simulación de Créditos
Por Henry Salazar
Introducción al Proyecto
CreditSmart es una aplicación web moderna construida con React que actúa como una plataforma integral para visualizar, simular y solicitar diferentes tipos de productos crediticios. El proyecto fue desarrollado como una migración desde una estructura HTML/JS tradicional, enfatizando el uso de componentes funcionales, la gestión del estado (React Hooks) y el enrutamiento dinámico.

Este proyecto destaca por la implementación de filtros complejos, una lógica de simulación financiera precisa (amortización) y formularios controlados con validación en tiempo real para una experiencia de usuario profesional.

Tecnologías Utilizadas
Framework Principal: React

Lenguaje: JavaScript (ES6+)

Enrutamiento: react-router-dom

Gestión de Estado: React Hooks (useState)

Notificaciones: react-toastify (para alertas de éxito/error)

Funcionalidades Principales
La aplicación está dividida en tres secciones principales accesibles a través de la navegación:

1. Inicio (Home)
   Listado Dinámico: Muestra todas las opciones de crédito disponibles (creditos.jsx).

Buscador en Tiempo Real: Filtra la lista de créditos por nombre mientras el usuario escribe.

Filtro por Monto: Permite al usuario ver solo los créditos que cubren el monto que desea solicitar.

Ordenación: Permite ordenar los créditos por la tasa de interés más baja (Ascendente), mejorando la experiencia de selección.

2. Simulador de Créditos (Simulator)
   Implementa una robusta lógica financiera para calcular la cuota y la tabla de amortización de un crédito, utilizando el Método Francés/Alemán de cuota fija.

Cálculo Reactivo: La cuota mensual se calcula en base al tipo de crédito seleccionado, el monto y el plazo.

Validaciones de Rango: Valida que el monto y el plazo ingresados se encuentren dentro de los límites del producto crediticio.

Tabla de Amortización: Genera y muestra el desglose completo de pagos (interés vs. capital) para todas las cuotas.

3. Solicitud de Crédito (RequestCredit)
   Formulario avanzado diseñado para una UX limpia y profesional.

Formulario Controlado: Todos los campos están gestionados por el estado de React, garantizando la sincronización de datos.

Validación en Tiempo Real: Muestra mensajes de error debajo del campo tan pronto como el usuario interactúa, utilizando clases condicionales (has-error).

Diseño Profesional: Implementación de un diseño de dos columnas (Flexbox) para campos relacionados, mejorando la estética y la eficiencia.

Flujo de Envío: Muestra un resumen de la solicitud antes del envío final, proporcionando un paso de confirmación crucial.
