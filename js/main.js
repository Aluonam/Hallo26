import { getLang, setLang, t } from "./i18n.js";
import * as fx from "./fx.js";
import * as hero from "./sections/hero.js";
import * as route from "./sections/route.js";
import * as party from "./sections/party.js";
import * as kids from "./sections/kids.js";
import * as rules from "./sections/rules.js";
import * as contact from "./sections/contact.js";

// Orden de las secciones. Añadir/quitar/reordenar = tocar esta lista.
const sections = [hero, route, party, kids, rules, contact];

const app = document.getElementById("app");
const langBtn = document.getElementById("lang");

function render() {
  app.innerHTML = sections.map((s) => s.render()).join("");
  sections.forEach((s) => s.mount?.());
  langBtn.textContent = t("switchTo");
}

langBtn.addEventListener("click", () => {
  setLang(getLang() === "es" ? "en" : "es");
  render();
});

setLang(getLang());
fx.init();
render();
// Datos externos (hojas de Google): cuando llegan, se repinta todo una vez.
Promise.all(sections.map((s) => s.load?.())).then(render);
