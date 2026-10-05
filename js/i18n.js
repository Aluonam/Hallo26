// Diccionario ES/EN. Para añadir un texto, ponlo en los dos idiomas con la misma clave.
const dict = {
  es: {
    switchTo: "EN",
    titleTop: "Fiesta de",
    titleMain: "Halloween",
    tagline: "¡Ven disfrazado y disfruta de una tarde terroríficamente divertida en la urbanización!",
    days: "días", hours: "horas", mins: "min", secs: "seg",
    started: "¡La fiesta ha empezado! 🎉",
    seeRoute: "🎃 Ver el recorrido",
    seePoster: "🖼️ Ver el cartel",
    close: "Cerrar",
    posterAlt: "Cartel de la fiesta de Halloween",
    posterBy: "Gracias a nuestra querida vecina {name} 🧡",
    posterDisclaimer: "⚠️ Aviso: ningún fantasma resultó herido durante el diseño de este cartel. El QR ha sido secuestrado por los murciélagos 🦇: búscalo en el cartel de tu portal.",
    joinWhatsapp: "Únete al grupo de WhatsApp",
    boo: "¡Buuu!",
    laugh: "¡Ja, ja, ja!",
    trickOrTreat: "¿Truco o trato?",
    tbc: "Por confirmar",

    routeTitle: "Truco o trato",
    routeIntro: "Llama solo a las puertas con calabaza 🎃.",
    portal: "Portal {n}",
    floor: "{n}º",
    ground: "Bajo",
    doorCount: "🎃 {n} de {total} puertas encendidas",
    tapHint: "Toca una calabaza para ver los detalles",
    nextPortal: "Siguiente portal →",

    playRiddles: "🔮 Hazlo interactivo: ¡acertijos!",
    riddleStep: "Calabaza {i} de {n}",
    riddlePortal: "📍 Ve al portal {n}",
    riddleFloor: "🏢 Sube tantos pisos como fantasmas: {ghosts}",
    riddleLetter: "🚪 Adivina qué es: {clue} ¡Su primera letra es la de la puerta!",
    // Planta: índice 0 = bajo, 1 = 1º...
    floorClues: [
      "🏢 No subas escaleras: quédate a ras de suelo, donde salen los zombis 🧟",
      "🏢 Sube tantos pisos como narices tiene una bruja 👃",
      "🏢 Sube tantos pisos como colmillos tiene un vampiro 🧛",
      "🏢 Sube tantos pisos como agujeros tiene la cara de una calabaza: dos ojos y una boca 🎃",
      "🏢 Sube tantos pisos como patas tiene un gato negro 🐈‍⬛",
      "🏢 Sube tantos pisos como dedos tiene la mano de un esqueleto 🦴",
      "🏢 Sube tantos pisos como patas tiene un escarabajo 🪲",
      "🏢 Sube tantos pisos como enanitos tiene Blancanieves (la de la bruja y la manzana) 🍎",
    ],
    // Letra: [respuesta, acertijo]
    letterWords: {
      A: ["Araña", "tiene ocho patas y teje telas en las esquinas 🕸️."],
      B: ["Bruja", "vuela en escoba y prepara pociones 🧹."],
      C: ["Calabaza", "es naranja, redonda y en Halloween le brillan los ojos."],
      D: ["Drácula", "es el vampiro más famoso y duerme en un ataúd ⚰️."],
      E: ["Esqueleto", "está hecho solo de huesos y hace clac, clac 🦴."],
      F: ["Fantasma", "es blanco, atraviesa paredes y dice ¡buuu!"],
      G: ["Gato negro", "maúlla y acompaña a las brujas en su escoba 🐾."],
      H: ["Hombre lobo", "aúlla cuando sale la luna llena 🌕."],
      I: ["Invisible", "así es el hombre al que nadie puede ver 👀."],
    },
    hint: "💡 Pista",
    skip: "⏭ Siguiente puerta",
    hintDoor: "💡 Es el {door}",
    exit: "✖ Salir",
    playAgain: "🔁 Otra vez",
    right: "¡Bien! 🎉 ¡Calabaza encontrada!",
    wrong: ["¡Frío, frío! ❄️", "¡Uy, ahí no vive la calabaza!", "¡Casi! Prueba otra vez 👀"],
    allFound: "¡Has encontrado todas las calabazas! 🍬",
    signupDoor: "Apunta tu puerta",
    soon: "Inscripciones próximamente",
    tags: { gluten: "sin gluten", nuts: "sin frutos secos", lactose: "sin lactosa", egg: "sin huevo" },

    partyTitle: "Minifiesta infantil",
    partyPlace: "📍 Sala común",
    partyTime: "🕡 {time}",
    partyMore: "Más detalles en el grupo de WhatsApp.",
    signupKids: "Inscribe a tus peques",
    signupVolunteers: "Quiero ayudar",

    kidsTitle: "Pequeños monstruos",
    kidsIntro: "Apunta a tus peques con un alias terrorífico y su edad. 🔒 Para proteger su identidad, no uses su nombre real: elige uno inspirado en su disfraz o un nombre en clave.",
    kidsCount: "👻 {n} peques inscritos",
    kidsCountOne: "👻 1 peque inscrito",
    kidsAllergies: "Alergias detectadas:",
    age: "{n} años",

    rulesTitle: "Normas del más allá",
    rules: [
      "🎃 Llama solo a las puertas con calabaza.",
      "👨‍👧 Los niños, siempre acompañados de un adulto.",
      "🤫 Respeta a los vecinos que no participan.",
      "🍬 Ni un envoltorio en portales ni escaleras.",
    ],

    contactTitle: "Contacto",
    contactText: "¿Dudas o ideas? Escríbenos en el grupo de WhatsApp de la comunidad.",
    epitaph: "Aquí yace el aburrimiento",
  },
  en: {
    switchTo: "ES",
    titleTop: "Community",
    titleMain: "Halloween",
    tagline: "Come in costume and enjoy a spooktacular afternoon in the neighbourhood!",
    days: "days", hours: "hours", mins: "min", secs: "sec",
    started: "The party has started! 🎉",
    seeRoute: "🎃 See the route",
    seePoster: "🖼️ See the poster",
    close: "Close",
    posterAlt: "Halloween party poster",
    posterBy: "Thanks to our dear neighbour {name} 🧡",
    posterDisclaimer: "⚠️ Disclaimer: no ghosts were harmed in the making of this poster. The QR code was kidnapped by bats 🦇: find it on the poster in your entrance.",
    joinWhatsapp: "Join the WhatsApp group",
    boo: "Boooo!",
    laugh: "Mwahaha!",
    trickOrTreat: "Trick or treat?",
    tbc: "To be confirmed",

    routeTitle: "Trick or treat",
    routeIntro: "Only knock on doors with a pumpkin 🎃.",
    portal: "Block {n}",
    floor: "{n}F",
    ground: "GF",
    doorCount: "🎃 {n} of {total} doors lit up",
    tapHint: "Tap a pumpkin to see the details",
    nextPortal: "Next block →",

    playRiddles: "🔮 Make it interactive: riddles!",
    riddleStep: "Pumpkin {i} of {n}",
    riddlePortal: "📍 Go to block {n}",
    riddleFloor: "🏢 Go up as many floors as ghosts: {ghosts}",
    riddleLetter: "🚪 Guess what it is: {clue} Its first letter is the door!",
    // Floor: index 0 = ground floor, 1 = 1st...
    floorClues: [
      "🏢 No stairs: stay at ground level, where zombies crawl out 🧟",
      "🏢 Go up as many floors as noses on a witch 👃",
      "🏢 Go up as many floors as fangs on a vampire 🧛",
      "🏢 Go up as many floors as holes in a pumpkin face: two eyes and a mouth 🎃",
      "🏢 Go up as many floors as legs on a black cat 🐈‍⬛",
      "🏢 Go up as many floors as fingers on a skeleton hand 🦴",
      "🏢 Go up as many floors as legs on a beetle 🪲",
      "🏢 Go up as many floors as dwarfs in Snow White (the one with the witch and the apple) 🍎",
    ],
    // Letter: [answer, riddle]
    letterWords: {
      A: ["Abracadabra", "the magic word wizards say ✨."],
      B: ["Bat", "it sleeps upside down and flies at night 🌙."],
      C: ["Candy", "what you get when you say trick or treat 🍬."],
      D: ["Dracula", "the most famous vampire, he sleeps in a coffin ⚰️."],
      E: ["Eyeball", "round, slimy and it is looking at you 👁️."],
      F: ["Frankenstein", "a big green monster with bolts in his neck 🔩."],
      G: ["Ghost", "white, goes through walls and says boo!"],
      H: ["Haunted house", "a spooky house full of ghosts 🏚️."],
      I: ["Invisible", "the man nobody can see is the ___ man 👀."],
    },
    hint: "💡 Hint",
    skip: "⏭ Next door",
    hintDoor: "💡 It is {door}",
    exit: "✖ Exit",
    playAgain: "🔁 Play again",
    right: "Yes! 🎉 Pumpkin found!",
    wrong: ["Cold, cold! ❄️", "Oops, no pumpkin lives there!", "Almost! Try again 👀"],
    allFound: "You found all the pumpkins! 🍬",
    signupDoor: "Sign up your door",
    soon: "Sign-ups coming soon",
    tags: { gluten: "gluten-free", nuts: "nut-free", lactose: "lactose-free", egg: "egg-free" },

    partyTitle: "Kids' party",
    partyPlace: "📍 Common room",
    partyTime: "🕡 {time}",
    partyMore: "More details in the WhatsApp group.",
    signupKids: "Sign up your kids",
    signupVolunteers: "I want to help",

    kidsTitle: "Little monsters",
    kidsIntro: "Sign up your kids with a spooky nickname and their age. 🔒 To protect their identity, don't use their real name: pick one inspired by their costume or a code name.",
    kidsCount: "👻 {n} kids signed up",
    kidsCountOne: "👻 1 kid signed up",
    kidsAllergies: "Allergies reported:",
    age: "{n} years",

    rulesTitle: "Rules from beyond",
    rules: [
      "🎃 Only knock on doors with a pumpkin.",
      "👨‍👧 Children must always be with an adult.",
      "🤫 Respect neighbours who are not taking part.",
      "🍬 Not a single wrapper in hallways or stairs.",
    ],

    contactTitle: "Contact",
    contactText: "Questions or ideas? Message us in the community WhatsApp group.",
    epitaph: "Here lies boredom",
  },
};

let lang = "es";
try { lang = localStorage.getItem("lang") || lang; } catch {}

export const getLang = () => lang;

export function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  try { localStorage.setItem("lang", l); } catch {}
}

// t("portal", { n: 2 }) → "Portal 2"
export function t(key, vars = {}) {
  const value = dict[lang][key] ?? key;
  if (typeof value !== "string") return value;
  return value.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}
