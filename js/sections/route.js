import { config } from "../config.js";
import { doors } from "../data/doors.js";
import { candy, toast } from "../fx.js";
import { t } from "../i18n.js";
import { byRoute, parseId, riddle } from "../riddle.js";
import { ALLERGY as ICON, button } from "./ui.js";

const portals = Array.from({ length: config.portals }, (_, i) => i + 1);
const letters = [...config.letters];
const total = config.portals * (config.floors + 1) * letters.length; // +1 = bajo
const byId = Object.fromEntries(doors.map((d) => [d.id, d]));
const order = byRoute(doors); // orden del juego: por portal

// Modo acertijos: step = índice de la puerta a encontrar (en "order"), null = modo normal.
let step = null;
let msg = "";

// Piso 0 = bajo
const floorName = (f) => (f ? t("floor", { n: f }) : t("ground"));
const doorName = (f, l) => `${floorName(f)} ${l}`;

function info(p, door, floor, letter) {
  const tags = (door.tags || []).map((tag) => `${ICON[tag] || ""} ${t("tags")[tag] || tag}`);
  return [`🎃 ${t("portal", { n: p })} · ${doorName(floor, letter)}`, ...tags].join(" · ");
}

function litWindow(id, p, f, l) {
  const door = byId[id];
  const badges = (door.tags || []).map((tag) => ICON[tag] || "").join("");
  const text = info(p, door, f, l);
  return `<button type="button" class="win on" data-candy data-info="${text}" aria-label="${text}" style="--d:${(Math.random() * 3).toFixed(2)}s">🎃<span class="lt">${l}</span>${badges ? `<span class="badge">${badges}</span>` : ""}</button>`;
}

function building(p) {
  const playing = step !== null;
  const found = playing ? new Set(order.slice(0, step).map((d) => d.id)) : null;
  const cells = [];
  for (let f = config.floors; f >= 0; f--) {
    cells.push(`<span class="fl">${floorName(f)}</span>`);
    for (const l of letters) {
      const id = `${p}-${f}${l}`;
      const lit = playing ? found.has(id) : byId[id];
      if (lit) cells.push(litWindow(id, p, f, l));
      else if (playing) cells.push(`<button type="button" class="win" data-id="${id}" aria-label="${doorName(f, l)}">${l}</button>`);
      else cells.push(`<span class="win">${l}</span>`);
    }
  }

  return `
    <article class="building" data-portal="${p}">
      <div class="roof"><span>${t("portal", { n: p })}</span></div>
      <div class="facade" style="--cols:${letters.length}">${cells.join("")}</div>
      <div class="entrance" aria-hidden="true"><span>🎃</span><i></i><span>🎃</span></div>
    </article>`;
}

function riddleCard() {
  if (step >= order.length) {
    return `
      <div class="riddle">
        <p class="riddle-title">${t("allFound")}</p>
        <button type="button" class="btn" data-act="play">${t("playAgain")}</button>
        <button type="button" class="btn alt" data-act="exit">${t("exit")}</button>
      </div>`;
  }
  return `
    <div class="riddle">
      ${msg ? `<p class="riddle-msg">${msg}</p>` : ""}
      <p class="riddle-title">🔮 ${t("riddleStep", { i: step + 1, n: order.length })}</p>
      <ul>${riddle(order[step].id).map((line) => `<li>${line}</li>`).join("")}</ul>
      <button type="button" class="btn alt" data-act="hint">${t("hint")}</button>
      <button type="button" class="btn alt" data-act="skip">${t("skip")}</button>
      <button type="button" class="btn alt" data-act="exit">${t("exit")}</button>
      <p class="riddle-hint" aria-live="polite"></p>
    </div>`;
}

function inner() {
  const n = doors.length;
  const top = step === null
    ? `${n ? `<div class="meter" aria-hidden="true"><i style="width:${(n / total) * 100}%"></i></div>
       <p class="count">${t("doorCount", { n, total })}</p>
       <button type="button" class="btn play" data-act="play" data-candy>${t("playRiddles")}</button>` : ""}`
    : riddleCard();

  return `
    <h2>${t("routeTitle")}</h2>
    <p>${t("routeIntro")}</p>
    ${config.routeEnd ? `<p>🕡 ${config.date.slice(11)} – ${config.routeEnd}</p>` : ""}
    ${top}
    <div class="buildings">${portals.map(building).join("")}</div>
    <button type="button" class="btn alt next" hidden>${t("nextPortal")}</button>
    <p class="win-info" aria-live="polite">${n && step === null ? t("tapHint") : ""}</p>
    ${button(config.forms.doors, t("signupDoor"), "", t("soon"))}`;
}

export const render = () => `<section id="route" class="card reveal">${inner()}</section>`;

export function mount() {
  const el = document.getElementById("route");
  const row = () => el.querySelector(".buildings");
  const resize = new ResizeObserver(() => {
    el.querySelector(".next").hidden = row().scrollWidth <= row().clientWidth + 4;
  });

  // Vuelve a pintar la sección conservando el portal que se estaba viendo.
  const refresh = () => {
    const left = row().scrollLeft;
    el.innerHTML = inner();
    resize.disconnect();
    resize.observe(row());
    row().style.scrollBehavior = "auto";
    row().scrollLeft = step !== null && step < order.length ? showPortal(parseId(order[step].id).portal) : left;
    row().style.scrollBehavior = "";
  };
  const showPortal = (p) => row().querySelector(`[data-portal="${p}"]`).offsetLeft - row().offsetLeft;

  el.addEventListener("click", (e) => {
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act === "play") { step = 0; msg = ""; return refresh(); }
    if (act === "exit") { step = null; return refresh(); }
    // Pasa a la siguiente puerta (la saltada queda encendida para ver dónde estaba).
    if (act === "skip") { step++; msg = ""; return refresh(); }
    if (act === "hint") {
      // Dice piso y letra, e ilumina solo esa puerta.
      const { id } = order[step];
      const { floor, letter } = parseId(id);
      el.querySelector(".riddle-hint").textContent = t("hintDoor", { door: doorName(floor, letter) });
      el.querySelector(`[data-id="${id}"]`).classList.add("lit-row");
      return;
    }

    if (e.target.closest(".next")) {
      const [a, b] = row().children;
      const stepW = b.offsetLeft - a.offsetLeft;
      const atEnd = row().scrollLeft + row().clientWidth >= row().scrollWidth - 4;
      return row().scrollTo({ left: atEnd ? 0 : row().scrollLeft + stepW });
    }

    // Modo acertijos: ¿ha tocado la puerta correcta?
    const guess = e.target.closest("[data-id]");
    if (guess && step !== null) {
      if (guess.dataset.id === order[step].id) {
        candy(e.clientX, e.clientY);
        step++;
        msg = t("right");
        return refresh();
      }
      const wrong = t("wrong");
      toast(wrong[Math.floor(Math.random() * wrong.length)]);
      guess.classList.remove("nope");
      void guess.offsetWidth; // reinicia la animación
      guess.classList.add("nope");
      return;
    }

    const win = e.target.closest(".win.on");
    if (win) el.querySelector(".win-info").textContent = win.dataset.info;
  });

  resize.observe(row());
}
