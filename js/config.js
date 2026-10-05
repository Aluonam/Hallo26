// Datos del evento. Lo que esté vacío ("" o null) no se muestra o sale como "Por confirmar".
export const config = {
  date: "2026-10-31T18:30",
  routeEnd: null,     // "20:30"
  partyStart: null,   // "19:30"
  partyEnd: null,     // "21:00"
  partyDetails: null, // { es: "Juegos, merienda...", en: "Games, snacks..." }

  whatsapp: "",       // enlace de invitación al grupo
  forms: {
    doors: "",        // Google Form: apunta tu puerta
    kids: "https://docs.google.com/forms/d/e/1FAIpQLSehw0dh-cyYqhNUdXoMXt59MFRU6mgRGkq0HmFi9thiP9II0A/viewform", // Google Form: inscripción niños
    volunteers: "",   // Google Form: voluntarios
  },

  // Hojas de Google publicadas como CSV (ver README). Se leen al abrir la web.
  sheets: {
    kids: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS6PNlVSgxJgmbKd-bNhsU5YdRAieCzU1YF2S_6YY7KW6UwA7m0bWwUlST6dWCNhGoxNBYH_q4Cghzt/pub?output=csv", // respuestas del formulario de peques (CSV publicado)
  },

  posterCredit: "Eva", // autora del cartel

  // Estructura del edificio
  portals: 4,
  floors: 7,          // pisos 1–7, más el bajo
  letters: "ABCDEFGHI",
};
