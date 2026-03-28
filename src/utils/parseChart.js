/**
 * Normaliza nombres de signo (español / variantes LosArcanos).
 */
const SIGN_NAMES = [
  'Aries',
  'Tauro',
  'Géminis',
  'Cáncer',
  'Leo',
  'Virgo',
  'Libra',
  'Escorpio',
  'Sagitario',
  'Capricornio',
  'Acuario',
  'Piscis',
];

const SIGN_ALIASES = new Map(
  [
    ['aries', 0],
    ['tauro', 1],
    ['geminis', 2],
    ['géminis', 2],
    ['cancer', 3],
    ['cáncer', 3],
    ['leo', 4],
    ['virgo', 5],
    ['libra', 6],
    ['escorpio', 7],
    ['sagitario', 8],
    ['capricornio', 9],
    ['acuario', 10],
    ['piscis', 11],
    ['scorpio', 7],
    ['capricorn', 9],
    ['aquarius', 10],
    ['pisces', 11],
    ['gemini', 2],
  ].map(([k, v]) => [k.toLowerCase().normalize('NFD').replace(/\p{M}/gu, ''), v])
);

export function signIndexFromName(raw) {
  if (!raw) return null;
  const s = raw
    .trim()
    .split(/[\s,]/)[0]
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
  if (SIGN_ALIASES.has(s)) return SIGN_ALIASES.get(s);
  for (let i = 0; i < SIGN_NAMES.length; i++) {
    const n = SIGN_NAMES[i]
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '');
    if (s === n || s.startsWith(n)) return i;
  }
  return null;
}

export function longitudeFromSignDegree(signName, deg, min = 0) {
  const idx = signIndexFromName(signName);
  if (idx == null) return null;
  return idx * 30 + deg + min / 60;
}

const PLANET_KEYS = [
  'sol',
  'luna',
  'mercurio',
  'venus',
  'marte',
  'jupiter',
  'saturno',
  'urano',
  'neptuno',
  'pluton',
  'ascendente',
  'medioCielo',
];

/** Prefijo opcional: letra tipo Q/W o reticencias … (Plutón en LosArcanos). */
const PLANET_REGEX =
  /(?:^|\n)\s*(?:[A-Z]|…|\.\.\.)?\s*(Sol|Luna|Mercurio|Venus|Marte|Júpiter|Jupiter|Saturno|Urano|Neptuno|Plut[oó]n|Ascendente|Medio\s*Cielo)\s+(\d+)°(\d+)'?\s+([A-Za-záéíóúñÁÉÍÓÚÑüÜ]+)/giu;

function planetKeyFromMatch(name) {
  const n = name.toLowerCase().replace(/\s+/g, '');
  if (n === 'jupiter') return 'jupiter';
  if (n === 'plutón' || n === 'pluton') return 'pluton';
  if (n === 'mediocielo') return 'medioCielo';
  const map = {
    sol: 'sol',
    luna: 'luna',
    mercurio: 'mercurio',
    venus: 'venus',
    marte: 'marte',
    júpiter: 'jupiter',
    saturno: 'saturno',
    urano: 'urano',
    neptuno: 'neptuno',
    ascendente: 'ascendente',
  };
  return map[n] || null;
}

/**
 * @param {string} text
 * @returns {{ name: string, sunSign: string|null, moonSign: string|null, ascSign: string|null, houseCusps: number[]|null, planets: Record<string, { sign: string, degree: number, longitude: number }> }}
 */
export function parseChartText(text) {
  const planets = {};
  let name = 'Persona';
  const titleMatch = text.match(/Carta\s+Astral\s+de\s+(.+?)(?:\n|$)/i);
  if (titleMatch) name = titleMatch[1].trim().replace(/\s+/g, ' ');

  const solar = text.match(/Signo\s+Solar:\s*([^\n]+)/i);
  const lunar = text.match(/Signo\s+Lunar:\s*([^\n]+)/i);
  const asc = text.match(/Signo\s+Ascendente:\s*([^\n]+)/i);

  const sunSign = solar ? firstSignToken(solar[1]) : null;
  const moonSign = lunar ? firstSignToken(lunar[1]) : null;
  const ascSign = asc ? firstSignToken(asc[1]) : null;

  let m;
  const re = new RegExp(PLANET_REGEX.source, 'gi');
  while ((m = re.exec(text)) !== null) {
    const key = planetKeyFromMatch(m[1]);
    if (!key) continue;
    const deg = parseInt(m[2], 10);
    const min = parseInt(m[3], 10);
    const signRaw = m[4].trim();
    const lon = longitudeFromSignDegree(signRaw, deg, min);
    if (lon == null) continue;
    const idx = signIndexFromName(signRaw);
    const signLabel = idx != null ? SIGN_NAMES[idx] : signRaw;
    planets[key] = { sign: signLabel, degree: deg + min / 60, longitude: lon };
  }

  const houseCusps = parseHouseCuspsFromText(text);

  return {
    name,
    sunSign: sunSign || (planets.sol ? planets.sol.sign : null),
    moonSign: moonSign || (planets.luna ? planets.luna.sign : null),
    ascSign: ascSign || (planets.ascendente ? planets.ascendente.sign : null),
    planets,
    houseCusps,
  };
}

/** Tablas Placidus: Casa 1(AC) 5°20' Cancer */
const HOUSE_LINE_REGEX =
  /Casa\s+(\d+)(?:\([^)]*\))?\s+(\d+)°(\d+)'\s*([A-Za-záéíóúñÁÉÍÓÚÑüÜ]+)/gi;

export function parseHouseCuspsFromText(text) {
  const arr = new Array(12).fill(null);
  let m;
  const re = new RegExp(HOUSE_LINE_REGEX.source, 'gi');
  while ((m = re.exec(text)) !== null) {
    const num = parseInt(m[1], 10);
    if (num < 1 || num > 12) continue;
    const deg = parseInt(m[2], 10);
    const min = parseInt(m[3], 10);
    const lon = longitudeFromSignDegree(m[4].trim(), deg, min);
    if (lon == null) continue;
    arr[num - 1] = lon;
  }
  if (arr.some((x) => x == null)) return null;
  return arr;
}

function firstSignToken(line) {
  const part = line.split(/[-–,]/)[0].trim();
  const idx = signIndexFromName(part);
  if (idx != null) return SIGN_NAMES[idx];
  const words = part.split(/\s+/);
  for (const w of words) {
    const i = signIndexFromName(w);
    if (i != null) return SIGN_NAMES[i];
  }
  return null;
}

export { SIGN_NAMES, PLANET_KEYS };
