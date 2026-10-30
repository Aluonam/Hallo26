// Panel del gestor: enciende y apaga las puertas que reparten y guarda js/data/doors.js en GitHub.
// Solo puede guardar quien tenga un token de GitHub con permiso de escritura en este repositorio.
// El token se guarda cifrado en este dispositivo con una contraseña (AES-GCM); sin ella no se puede leer.
import { config } from "./config.js";
import { ALLERGY, esc } from "./sections/ui.js";

const REPO = "Aluonam/Hallo26";
const FILE = "js/data/doors.js";
const BRANCH = "main";
const STORE = "hallo26-gestor";
const TAGS = { gluten: "sin gluten", nuts: "sin frutos secos", lactose: "sin lactosa", egg: "sin huevo" };
const NEW_TOKEN = "https://github.com/settings/personal-access-tokens/new";

const root = document.getElementById("admin");
let token = "";      // solo en memoria: al recargar se vuelve a pedir la contraseña
let original = {};   // puertas guardadas en GitHub: { id: [tags] }
let doors = {};      // copia de trabajo
let sha = "";        // versión del archivo (evita pisar cambios hechos desde otro sitio)
let prefix = "";     // comentarios de cabecera del archivo, se conservan tal cual
let selected = null;
let status = "";
let busy = false;

// ---------- Cifrado del token en este dispositivo ----------

const enc = new TextEncoder();
const b64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const unb64 = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

async function keyFrom(password, salt) {
  const base = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 310000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

async function lock(secret, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await keyFrom(password, salt), enc.encode(secret));
  return { salt: b64(salt), iv: b64(iv), data: b64(data) };
}

async function unlock(box, password) {
  const key = await keyFrom(password, unb64(box.salt));
  const data = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(box.iv) }, key, unb64(box.data));
  return new TextDecoder().decode(data);
}

function saved() {
  try { return JSON.parse(localStorage.getItem(STORE)); } catch { return null; }
}

// ---------- GitHub ----------

async function github(path, options = {}) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...options,
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", ...(options.headers || {}) },
  });
  if (res.status === 401) throw new Error("El token no es válido o ha caducado. Crea uno nuevo.");
  if (res.status === 409 || res.status === 422) throw new Error("conflict");
  if (!res.ok) throw new Error(`GitHub respondió ${res.status}.`);
  return res.json();
}

async function checkToken() {
  const repo = await github("");
  if (!repo.permissions?.push) throw new Error("Ese token no tiene permiso para escribir en Hallo26.");
}

const fromBase64 = (text) => new TextDecoder().decode(unb64(text.replace(/\s/g, "")));
const toBase64 = (text) => b64(enc.encode(text));

// Lee doors.js de GitHub (la versión más reciente, no la publicada en caché).
async function load() {
  const file = await github(`/contents/${FILE}?ref=${BRANCH}`);
  const text = fromBase64(file.content);
  sha = file.sha;
  prefix = text.slice(0, text.indexOf("export const doors"));
  original = {};
  // Solo la lista (la cabecera trae un ejemplo en un comentario que no es una puerta).
  for (const m of text.slice(prefix.length).matchAll(/\{\s*id:\s*"(\d+-\d+[A-Z])"\s*(?:,\s*tags:\s*\[([^\]]*)\])?\s*\}/g)) {
    const tags = [...(m[2] || "").matchAll(/"(\w+)"/g)].map((x) => x[1]);
    original[m[1]] = Object.keys(TAGS).filter((t) => tags.includes(t)); // orden fijo
  }
  doors = structuredClone(original);
}

// ---------- Puertas ----------

const parse = (id) => {
  const [, portal, floor, letter] = id.match(/^(\d+)-(\d+)([A-Z])$/);
  return { portal: +portal, floor: +floor, letter };
};
const floorName = (f) => (f ? `${f}º` : "Bajo");
const doorName = (id) => {
  const { portal, floor, letter } = parse(id);
  return `Portal ${portal} · ${floor ? `${floor}º ${letter}` : `Bajo ${letter}`}`;
};
const sorted = (ids) => ids.sort((a, b) => {
  const x = parse(a);
  const y = parse(b);
  return x.portal - y.portal || x.floor - y.floor || x.letter.localeCompare(y.letter);
});

// El archivo con el mismo formato que se escribe a mano: agrupado por portal.
function fileText() {
  const lines = [];
  for (let p = 1; p <= config.portals; p++) {
    const ids = sorted(Object.keys(doors).filter((id) => parse(id).portal === p));
    if (!ids.length) continue;
    lines.push(`  // Portal ${p}`);
    for (const id of ids) {
      const tags = doors[id].length ? `, tags: [${doors[id].map((t) => `"${t}"`).join(", ")}]` : "";
      lines.push(`  { id: "${id}"${tags} },`);
    }
  }
  return `${prefix}export const doors = [\n${lines.join("\n")}\n];\n`;
}

function changes() {
  const added = Object.keys(doors).filter((id) => !original[id]);
  const removed = Object.keys(original).filter((id) => !doors[id]);
  const edited = Object.keys(doors).filter((id) => original[id] && original[id].join() !== doors[id].join());
  return { added: sorted(added), removed: sorted(removed), edited: sorted(edited) };
}
const dirty = () => { const c = changes(); return c.added.length + c.removed.length + c.edited.length > 0; };

function commitMessage() {
  const { added, removed, edited } = changes();
  const parts = [];
  if (added.length) parts.push(`añade ${added.join(", ")}`);
  if (removed.length) parts.push(`quita ${removed.join(", ")}`);
  if (edited.length) parts.push(`cambia ${edited.join(", ")}`);
  return `Gestor: ${parts.join("; ")}`;
}

// ---------- Pantallas ----------

function screen(html) {
  root.innerHTML = html;
  root.querySelector("input")?.focus();
}

function setup(error = "") {
  screen(`
    <section class="card login">
      <h1>🧙 Gestor</h1>
      <p>Primera vez en este dispositivo. Necesitas un <b>token de GitHub</b> que solo pueda escribir en Hallo26:</p>
      <ol class="help">
        <li>Abre <a href="${NEW_TOKEN}" target="_blank" rel="noopener">GitHub → Fine-grained token</a> (con tu cuenta).</li>
        <li>Nombre: <i>Gestor Hallo26</i>. Caducidad: la que quieras (p. ej. 90 días).</li>
        <li><b>Repository access → Only select repositories → Hallo26</b>.</li>
        <li><b>Permissions → Repository → Contents → Read and write</b>. Nada más.</li>
        <li><b>Generate token</b> y pégalo aquí.</li>
      </ol>
      <form id="setup">
        <label>Token de GitHub<input type="password" name="token" required autocomplete="off" placeholder="github_pat_…"></label>
        <label>Contraseña para este dispositivo <small>(mín. 8 caracteres)</small><input type="password" name="pass" required minlength="8" autocomplete="new-password"></label>
        <label>Repite la contraseña<input type="password" name="pass2" required minlength="8" autocomplete="new-password"></label>
        <button class="btn" ${busy ? "disabled" : ""}>${busy ? "Comprobando…" : "Guardar y entrar"}</button>
      </form>
      ${error ? `<p class="error">${esc(error)}</p>` : ""}
      <p class="help">El token se guarda <b>cifrado</b> en este navegador con tu contraseña y solo se envía a GitHub. Sin el token nadie puede cambiar las puertas, aunque abra esta página.</p>
      <p><a href="./">← Volver a la web</a></p>
    </section>`);
}

function login(error = "") {
  screen(`
    <section class="card login">
      <h1>🧙 Gestor</h1>
      <form id="login">
        <label>Contraseña<input type="password" name="pass" required autocomplete="current-password"></label>
        <button class="btn" ${busy ? "disabled" : ""}>${busy ? "Entrando…" : "Entrar"}</button>
      </form>
      ${error ? `<p class="error">${esc(error)}</p>` : ""}
      <p><a href="./">← Volver a la web</a> · <button type="button" class="link" data-act="forget">Olvidar este dispositivo</button></p>
    </section>`);
}

function windowButton(id, l) {
  const tags = doors[id];
  if (!tags) return `<button type="button" class="win" data-door="${id}" aria-label="${doorName(id)}: apagada">${l}</button>`;
  const badge = tags.length ? `<span class="badge">${tags.map((t) => ALLERGY[t]).join("")}</span>` : "";
  const mark = !original[id] ? "new" : original[id].join() !== tags.join() ? "edited" : "";
  return `<button type="button" class="win on ${mark} ${id === selected ? "sel" : ""}" data-door="${id}" aria-label="${doorName(id)}: reparte">🎃<span class="lt">${l}</span>${badge}</button>`;
}

function building(p) {
  const cells = [];
  for (let f = config.floors; f >= 0; f--) {
    cells.push(`<span class="fl">${floorName(f)}</span>`);
    for (const l of config.letters) cells.push(windowButton(`${p}-${f}${l}`, l));
  }
  return `
    <article class="building">
      <div class="roof"><span>Portal ${p}</span></div>
      <div class="facade" style="--cols:${config.letters.length}">${cells.join("")}</div>
    </article>`;
}

function editor() {
  if (!selected || !doors[selected]) return `<p class="help">Toca una ventana para encenderla 🎃 (esa puerta reparte). Toca una encendida para editarla o apagarla.</p>`;
  return `
    <div class="editor">
      <p><b>🎃 ${doorName(selected)}</b></p>
      <div class="tags">${Object.entries(TAGS).map(([tag, label]) => `
        <label class="tag"><input type="checkbox" data-tag="${tag}" ${doors[selected].includes(tag) ? "checked" : ""}> ${ALLERGY[tag]} ${label}</label>`).join("")}
      </div>
      <button type="button" class="btn alt small" data-act="close">Listo</button>
      <button type="button" class="btn danger small" data-act="remove">Apagar esta puerta</button>
    </div>`;
}

function pending() {
  const { added, removed, edited } = changes();
  if (!dirty()) return "";
  const list = (title, ids) => (ids.length ? `<li>${title}: ${ids.map(doorName).join(" · ")}</li>` : "");
  return `<ul class="pending">${list("➕ Encender", added)}${list("➖ Apagar", removed)}${list("✏️ Cambiar", edited)}</ul>`;
}

function panel() {
  const y = scrollY;
  const n = Object.keys(doors).length;
  root.innerHTML = `
    <header class="admin-head">
      <h1>🧙 Gestor</h1>
      <p><a href="./" target="_blank">Ver la web</a> · <button type="button" class="link" data-act="logout">Salir</button></p>
    </header>
    <section class="card">
      <h2>Quién reparte</h2>
      <p class="count">🎃 ${n} puertas</p>
      ${editor()}
      <div class="buildings admin-buildings">${Array.from({ length: config.portals }, (_, i) => building(i + 1)).join("")}</div>
      ${pending()}
    </section>
    <div class="savebar ${dirty() || status ? "show" : ""}" role="status">
      <span>${status || (dirty() ? "Cambios sin guardar" : "")}</span>
      ${dirty() ? `
        <button type="button" class="btn alt small" data-act="undo" ${busy ? "disabled" : ""}>Deshacer</button>
        <button type="button" class="btn small" data-act="save" ${busy ? "disabled" : ""}>${busy ? "Guardando…" : "💾 Guardar"}</button>` : ""}
    </div>`;
  scrollTo(0, y);
}

// ---------- Acciones ----------

async function enter() {
  root.innerHTML = `<p class="loading">Cargando puertas…</p>`;
  await checkToken();
  await load();
  panel();
}

async function save() {
  busy = true;
  status = "Guardando…";
  panel();
  try {
    await github(`/contents/${FILE}`, {
      method: "PUT",
      body: JSON.stringify({ message: commitMessage(), content: toBase64(fileText()), sha, branch: BRANCH }),
    });
    await load();
    status = "Guardado ✓ La web se actualiza en 1–2 minutos.";
  } catch (e) {
    status = e.message === "conflict"
      ? "Alguien cambió las puertas mientras tanto. Recarga la página y vuelve a hacer tus cambios."
      : e.message;
  }
  busy = false;
  panel();
}

root.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (busy) return;
  const f = new FormData(e.target);
  if (e.target.id === "setup") {
    if (f.get("pass") !== f.get("pass2")) return setup("Las dos contraseñas no coinciden.");
    token = String(f.get("token")).trim();
    busy = true; setup();
    try {
      await checkToken();
      localStorage.setItem(STORE, JSON.stringify(await lock(token, f.get("pass"))));
      busy = false;
      await enter();
    } catch (err) {
      token = "";
      busy = false;
      setup(err.message === "conflict" ? "No se pudo comprobar el token." : err.message);
    }
  }
  if (e.target.id === "login") {
    busy = true; login();
    try {
      token = await unlock(saved(), f.get("pass"));
    } catch {
      await new Promise((r) => setTimeout(r, 800));
      busy = false;
      return login("Contraseña incorrecta.");
    }
    try {
      busy = false;
      await enter();
    } catch (err) {
      login(err.message);
    }
  }
});

root.addEventListener("click", (e) => {
  const act = e.target.closest("[data-act]")?.dataset.act;
  const win = e.target.closest("[data-door]");
  if (busy) return;
  if (win) {
    const id = win.dataset.door;
    if (!doors[id]) doors[id] = [];
    selected = id;
    status = "";
    return panel();
  }
  if (act === "close") { selected = null; return panel(); }
  if (act === "remove") { delete doors[selected]; selected = null; status = ""; return panel(); }
  if (act === "undo") { doors = structuredClone(original); selected = null; status = ""; return panel(); }
  if (act === "save") return save();
  if (act === "logout") { token = ""; return login(); }
  if (act === "forget" && confirm("¿Borrar el token guardado en este dispositivo? Tendrás que pegarlo otra vez.")) {
    localStorage.removeItem(STORE);
    return setup();
  }
});

root.addEventListener("change", (e) => {
  const tag = e.target.dataset.tag;
  if (!tag || !selected) return;
  const list = doors[selected].filter((t) => t !== tag);
  if (e.target.checked) list.push(tag);
  doors[selected] = Object.keys(TAGS).filter((t) => list.includes(t)); // orden fijo
  status = "";
  panel();
});

addEventListener("beforeunload", (e) => { if (token && dirty()) e.preventDefault(); });

if (saved()) login();
else setup();
