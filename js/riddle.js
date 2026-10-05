// Acertijos del juego. Se generan a partir del id de la puerta ("3-4A" → portal 3, piso 4, letra A).
// Los textos están en i18n: floorClues (uno por planta) y letterWords (cosa terrorífica por letra).
import { t } from "./i18n.js";

export function parseId(id) {
  const [p, rest] = id.split("-");
  return { portal: Number(p), floor: Number(rest.slice(0, -1)), letter: rest.slice(-1) };
}

// Puertas ordenadas por portal, luego planta y luego letra.
export const byRoute = (doors) => [...doors].sort((a, b) => {
  const x = parseId(a.id), y = parseId(b.id);
  return x.portal - y.portal || x.floor - y.floor || x.letter.localeCompare(y.letter);
});

export function riddle(id) {
  const { portal, floor, letter } = parseId(id);
  const [, clue] = t("letterWords")[letter] || [letter, letter];
  return [
    t("riddlePortal", { n: portal }),
    t("floorClues")[floor] || t("riddleFloor", { ghosts: "👻".repeat(floor) }),
    t("riddleLetter", { clue }),
  ];
}
