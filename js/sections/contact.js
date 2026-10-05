import { config } from "../config.js";
import { t } from "../i18n.js";
import { button } from "./ui.js";

export const render = () => `
  <section class="card reveal">
    <h2>${t("contactTitle")}</h2>
    <p>${t("contactText")}</p>
    ${button(config.whatsapp, t("joinWhatsapp"), "whatsapp")}
  </section>
  <footer class="epitaph reveal">
    <div class="grave"><b>R.I.P.</b><span>${t("epitaph")}</span><small>31 · 10 · 2026</small></div>
  </footer>`;
