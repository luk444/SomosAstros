import { angleDiff, classifyAspect } from './aspectGeometry.js';
import { pickVariant } from './variantPick.js';

/**
 * Matiz extra: planeta de "from" en aspecto al Asc o MC del mapa "to".
 * Complementa la casa sin duplicar el cálculo de overlay.
 */
const BRIDGE = {
  'sol-asc': {
    Conjunción: [
      'Además del tema de la casa, el Sol de quien cae acá refuerza la “cara” pública del otro: lo que se ve al cruzarse suele coincidir con lo vital de quien trae el Sol.',
      'Capa angular: el brillo personal roza la primera impresión del otro; puede amplificar reconocimiento o competencia por protagonismo.',
      'Eje visible: identidad y máscara dialogan con fuerza; terceros suelen notar la química o el contraste.',
    ],
    Trigono: [
      'El Sol afina con naturalidad cómo el otro se presenta: apoyo al estilo sin discursos largos.',
      'Facilidad para salir juntos o presentarse: menos roces de imagen.',
      'Validación del otro “tal como se muestra” sin pedirle que se pliegue.',
    ],
    Cuadratura: [
      'Roce entre “quién soy yo” y “cómo vos te mostrás”: conviene no moralizar el estilo del otro.',
      'El Sol presiona la máscara del otro; el otro puede sentirse juzgado en lo social.',
      'Negociar espacios donde cada uno lidera la escena sin puntuar.',
    ],
    Oposición: [
      'Polaridad identidad–encuentro: lo vital de uno contrasta con la forma en que el otro encara el mundo.',
      'Atracción por estilos distintos de salir a la vida; riesgo de compararse ante terceros.',
      'Equilibrio entre brillo propio y reconocimiento del otro en público.',
    ],
    default: [
      'Matiz angular con el Asc del otro: el planeta Sol colorea la primera impresión que el otro da.',
      'La interacción “de puerta afuera” no es neutra: se nota el contacto con el Asc.',
      'Sumá esto a la lectura por casa para ver imagen + área de vida.',
    ],
  },
  'luna-asc': {
    Conjunción: [
      'La Luna engancha con la máscara del otro: empatía inmediata o saturación si no hay límites.',
      'El humor y las necesidades afectivas se mezclan con cómo el otro se ofrece al mundo.',
      '“Te siento al cruzarte”: fuerte componente emocional en el primer contacto.',
    ],
    Trigono: [
      'La Luna contiene la timidez o el estrés social del otro con gestos cotidianos.',
      'Clima agradable al mostrarse juntos: menos vergüenza, más pertenencia.',
      'Ternura que legitima la imagen del otro sin exigirle performance.',
    ],
    default: [
      'La Luna roza el Asc del otro: el cuidado emocional y la primera impresión van en la misma bolsa.',
      'Altibajos del día a día se notan en cómo el otro sale a la escena.',
      'Eje afectivo–visible: buen foco para acordar tiempos sociales.',
    ],
  },
  'venus-asc': {
    Conjunción: [
      'Gusto inmediato por el “modo” del otro: coqueteo, estética y armonía en la presentación.',
      'Venus besa la máscara: el afecto pasa por cómo el otro se muestra.',
      'Atracción que otros pueden leer como “van bien” aunque el vínculo sea más complejo adentro.',
    ],
    Trigono: [
      'Halagos que pegan en lo visible: el otro se siente deseado tal como se presenta.',
      'Placer compartido en salidas, estilo y detalles.',
      'Menos inseguridad social cuando están juntos.',
    ],
    default: [
      'Venus dialoga con el Asc del otro: el cariño y el gusto se ligan a la imagen pública del otro.',
      'La seducción tiene capa social explícita.',
      'Útil recordar valores además del “nos vemos bien juntos”.',
    ],
  },
  'marte-asc': {
    Conjunción: [
      'Impulso directo sobre la imagen del otro: chispa, prisa o roce en el primer encuentro.',
      'El deseo de actuar choca o enciende cómo el otro se muestra.',
      'Menos neutralidad en la escena social: hay temperatura.',
    ],
    Cuadratura: [
      'Discusiones por asertividad o por “entrar fuerte” en la fachada del otro.',
      'Pasión útil si hay reglas; invasión si no hay respeto al estilo del otro.',
      'Canalizar en deporte o proyectos para no pelear por la imagen.',
    ],
    default: [
      'Marte roza el Asc del otro: iniciativa y confrontación liviana en lo visible.',
      'La relación “se ve” animada o tensa según el contexto.',
      'Combinar con la casa para ver si el roce es social, laboral o de pareja.',
    ],
  },
  'mercurio-asc': {
    default: [
      'Mercurio y Asc: la charla define la primera impresión; curiosidad y etiquetas rápidas.',
      'Humor e ironía en cómo el otro se presenta; cuidado con corregir en público.',
      'Planes y palabras acompañan la imagen del otro.',
    ],
  },
  'sol-mc': {
    Conjunción: [
      'El Sol ilumina vocación y metas visibles del otro: orgullo cruzado o presión por resultados.',
      'La identidad de uno se asocia a la trayectoria pública del otro.',
      '“Nos ven” ligados a logros o responsabilidades externas.',
    ],
    Trigono: [
      'Apoyo natural a la carrera del otro sin robar cámara.',
      'Dirección compartida en proyectos ambiciosos.',
      'Elogios profesionales que sostienen la confianza mutua.',
    ],
    default: [
      'Sol y MC del otro: el brillo personal toca la carrera o imagen profesional.',
      'Metas externas entran al relato del vínculo.',
      'Combinar con la casa para ver si es más privado o más público el impacto.',
    ],
  },
  'luna-mc': {
    default: [
      'Luna y MC: el ánimo de uno se engancha con el estrés u orgullo laboral del otro.',
      'Cuidado emocional cuando el otro está expuesto profesionalmente.',
      'Celebrar logros del otro sin compararse.',
    ],
  },
  'venus-mc': {
    default: [
      'Venus y MC: gusto, estética o ternura ligados a la imagen profesional del otro.',
      'El cariño pasa por apoyar ambiciones visibles.',
      'Cuidado con idealizar el estatus.',
    ],
  },
  'marte-mc': {
    default: [
      'Marte y MC: empuje, competencia o pasión sobre metas públicas del otro.',
      'Útil para emprender juntos; pesado si compiten por el mismo podio.',
      'Pausas y roles claros en trabajo visible.',
    ],
  },
  'jupiter-asc': {
    default: [
      'Júpiter y Asc: optimismo que agranda la presencia del otro; o exageración de expectativas sobre “cómo debería mostrarse”.',
      'Fe y humor en el encuentro social.',
      'Moderar promesas y planes grandilocuentes.',
    ],
  },
  'saturno-asc': {
    default: [
      'Saturno y Asc: seriedad, tiempo o sensación de examen sobre la imagen del otro.',
      'Estructura útil si es respetuosa; frío si es crítica permanente.',
      'Compromiso visible: lo que dura, se construye.',
    ],
  },
  _default: {
    default: [
      'Contacto angular perceptible con el Asc o MC del otro: suma capa visible al significado de la casa.',
      'El planeta colorea cómo el otro se muestra o qué metas externas defiende.',
      'Leé esto junto con el overlay por casa para una lectura más completa.',
    ],
  },
};

/**
 * @param {string} planetKey
 * @param {number} planetLon
 * @param {import('./parseChart.js').parseChartText extends object} chartTo
 * @param {string} nf
 * @param {string} nt
 * @param {string} seed
 * @returns {string}
 */
export function buildOverlayAngleBridge(planetKey, planetLon, chartTo, nf, nt, seed) {
  if (planetLon == null || !chartTo?.planets) return '';
  const asc = chartTo.planets.ascendente?.longitude;
  const mc = chartTo.planets.medioCielo?.longitude;
  const parts = [];

  const push = (angleLon, angleLabel, keySuffix) => {
    if (angleLon == null) return;
    const asp = classifyAspect(angleDiff(planetLon, angleLon));
    if (!asp?.name) return;
    const mapKey = `${planetKey}-${keySuffix}`;
    const block = BRIDGE[mapKey] || BRIDGE._default;
    const arr = block[asp.name] || block.default;
    const line = pickVariant(arr, `${seed}|${mapKey}|${asp.name}`);
    if (line) {
      parts.push(
        `📐 **Ángulo (${angleLabel})**: ${line}`
      );
    }
  };

  push(asc, 'Ascendente', 'asc');
  push(mc, 'Medio Cielo', 'mc');

  if (!parts.length) return '';
  return (
    `**Cruce con ángulos del mapa de ${nt}**\n\n` +
    parts.join('\n\n') +
    `\n\n_${nf} aporta el planeta; ${nt} aporta el ángulo y su lectura en mundo real._`
  );
}
