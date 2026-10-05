import { config } from "../config.js";
import { t } from "../i18n.js";
import { loadCsv } from "../sheet.js";
import { button, esc } from "./ui.js";

// Peques inscritos: llegan solos desde la hoja del Google Form (config.sheets.kids).
export let kids = [];

// Respuestas que significan "sin alergias".
const NONE = /^(|no|ninguna?|nada|none|nope|-+|n\/?a)\.?$/i;

// Las columnas se buscan por su título (el resto, como Observaciones, se ignora).
const COLUMNS = { alias: /alias|nick/i, age: /edad|age/i, allergies: /alerg|allerg|intoler/i };

function toKids(rows) {
  const [header = [], ...data] = rows;
  const col = Object.fromEntries(Object.entries(COLUMNS).map(([k, re]) => [k, header.findIndex((h) => re.test(h))]));
  const cell = (r, k) => (col[k] >= 0 ? r[col[k]] || "" : "").trim();
  return data
    .filter((r) => cell(r, "alias"))
    .map((r) => ({ alias: cell(r, "alias"), age: cell(r, "age"), allergy: NONE.test(cell(r, "allergies")) ? "" : cell(r, "allergies") }));
}

export async function load() {
  if (!config.sheets.kids) return;
  try {
    const rows = await loadCsv(config.sheets.kids);
    kids = toKids(rows);
  } catch (e) {
    console.warn("No se pudo leer la hoja de peques", e);
  }
}

const AVATARS = ["🎃", "👻", "🦇", "🕷️", "🧙", "🧛", "🧟", "💀", "🐈‍⬛", "🦉"];

// "2 - 4 años" se muestra tal cual; "7 - 10" → "7 - 10 años"
const age = (text) => (/[a-zá-ú]/i.test(text) ? esc(text) : t("age", { n: esc(text) }));

// Alergias que han escrito los padres, agrupadas: [["piña", 2], ...]
function allergyList() {
  const groups = {};
  kids.filter((k) => k.allergy).forEach((k) => {
    const key = k.allergy.toLowerCase();
    groups[key] = groups[key] || [k.allergy, 0];
    groups[key][1]++;
  });
  return Object.values(groups);
}

const allergyChips = (list) =>
  `<ul class="allergies">${list.map(([text, n]) => `<li>${esc(text)}${n > 1 ? ` × ${n}` : ""}</li>`).join("")}</ul>`;

function card(k, i) {
  return `
    <li class="kid">
      <span class="avatar" style="--d:-${i * 0.7}s">${AVATARS[i % AVATARS.length]}</span>
      <b>${esc(k.alias)}</b>
      ${k.age ? `<small>${age(k.age)}</small>` : ""}
    </li>`;
}

export function render() {
  const allergies = allergyList();
  return `
    <section id="kids" class="card reveal">
      <h2>${t("kidsTitle")}</h2>
      <p>${t("kidsIntro")}</p>
      ${kids.length ? `<p class="count">${t(kids.length === 1 ? "kidsCountOne" : "kidsCount", { n: kids.length })}</p>` : ""}
      ${allergies.length ? `
        <p>${t("kidsAllergies")}</p>
        ${allergyChips(allergies)}` : ""}
      ${kids.length ? `<ul class="kids">${kids.map(card).join("")}</ul>` : ""}
      ${button(config.forms.kids, t("signupKids"), "", t("soon"))}
    </section>`;
}
