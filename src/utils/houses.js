/**
 * Casa plácida: arco desde cúspide i hasta i+1 en sentido zodiacal.
 * @param {number} longitude
 * @param {number[]} cusps12 - longitudes cúspide casa 1..12
 * @returns {number|null} 1..12
 */
export function houseForLongitude(longitude, cusps12) {
  if (!cusps12 || cusps12.length !== 12) return null;
  const p = ((longitude % 360) + 360) % 360;
  for (let i = 0; i < 12; i++) {
    const start = ((cusps12[i] % 360) + 360) % 360;
    const end = ((cusps12[(i + 1) % 12] % 360) + 360) % 360;
    if (start <= end) {
      if (p >= start && p < end) return i + 1;
    } else {
      if (p >= start || p < end) return i + 1;
    }
  }
  return 12;
}

export const HOUSE_TITLE = {
  1: 'Casa 1 — Yo, presencia, cuerpo',
  2: 'Casa 2 — Recursos, valores, placeres sensoriales',
  3: 'Casa 3 — Comunicación, entorno, hermanos, estudios cortos',
  4: 'Casa 4 — Hogar, raíces, intimidad privada',
  5: 'Casa 5 — Romance, creatividad, diversión, deseo de brillar',
  6: 'Casa 6 — Rutina, salud, servicio, trabajo cotidiano',
  7: 'Casa 7 — Pareja, acuerdos, el “tú” frente a frente',
  8: 'Casa 8 — Intimidad profunda, fusiones, tabúes, crisis compartidas',
  9: 'Casa 9 — Sentido, viajes largos, creencias, horizonte',
  10: 'Casa 10 — Carrera, imagen pública, metas visibles',
  11: 'Casa 11 — Amistades, proyectos colectivos, futuro deseado',
  12: 'Casa 12 — Inconsciente, retiro, compasión, lo que se diluye',
};
