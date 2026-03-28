import { narrativeForPair } from './aspectInterpretations.js';
import { buildOverlaySection } from './overlays.js';
import { computeDimensions, buildScenarios } from './dimensionsScenarios.js';
import { angleDiff, classifyAspect } from './aspectGeometry.js';
import { narrativePlanetToAngle } from './angleSynastryNarratives.js';

/** Ajuste de peso: en sinastría, Venus–Marte en tensión suele asociarse a química, no solo “malo”. */
function adjustAspectWeight(pairId, aspectName, baseWeight) {
  const table = ASPECT_WEIGHT_OVERRIDES[pairId];
  if (table && aspectName in table) return table[aspectName];
  return baseWeight;
}

const ASPECT_WEIGHT_OVERRIDES = {
  'venusA-marteB': { Oposición: 1.2, Cuadratura: 0.3 },
  'marteA-venusB': { Oposición: 1.2, Cuadratura: 0.3 },
};

function typeLabelEs(type) {
  if (type === 'harmonic') return 'armónico';
  if (type === 'tension') return 'tensión';
  return 'neutral';
}

const ELEMENT = {
  Fuego: new Set(['Aries', 'Leo', 'Sagitario']),
  Tierra: new Set(['Tauro', 'Virgo', 'Capricornio']),
  Aire: new Set(['Géminis', 'Libra', 'Acuario']),
  Agua: new Set(['Cáncer', 'Escorpio', 'Piscis']),
};

const MODALITY_OF = {
  Aries: 'cardinal',
  Tauro: 'fijo',
  'Géminis': 'mutable',
  'Cáncer': 'cardinal',
  Leo: 'fijo',
  Virgo: 'mutable',
  Libra: 'cardinal',
  Escorpio: 'fijo',
  Sagitario: 'mutable',
  Capricornio: 'cardinal',
  Acuario: 'fijo',
  Piscis: 'mutable',
};

const MODALITY_LABEL = {
  cardinal: 'Cardinal (inicio, impulso)',
  fijo: 'Fijo (sostén, perseverancia)',
  mutable: 'Mutable (adaptación, cierre)',
};

function modalityOf(signName) {
  if (!signName) return null;
  return MODALITY_OF[signName] || null;
}

function modalityCompatibility(signA, signB) {
  const ma = modalityOf(signA);
  const mb = modalityOf(signB);
  if (!ma || !mb) return null;
  if (ma === mb) {
    return {
      line: `Misma modalidad (${MODALITY_LABEL[ma]}): ritmo parecido para tomar decisiones y encarar cambios.`,
    };
  }
  const mix = new Set([ma, mb]);
  if (mix.has('cardinal') && mix.has('mutable')) {
    return {
      line: 'Cardinal + mutable: uno empuja ideas nuevas, el otro ajusta sobre la marcha; puede funcionar si se reparten roles.',
    };
  }
  if (mix.has('fijo') && mix.has('mutable')) {
    return {
      line: 'Fijo + mutable: tensiones entre “así soy yo” y “cambiemos el plan”; pide acuerdos claros.',
    };
  }
  if (mix.has('cardinal') && mix.has('fijo')) {
    return {
      line: 'Cardinal + fijo: uno inicia, el otro sostiene; buena dupla si no compiten por el timón.',
    };
  }
  return { line: 'Modalidades distintas: combinar impulso, constancia y flexibilidad es el trabajo consciente.' };
}

function elementOf(signName) {
  if (!signName) return null;
  for (const [el, set] of Object.entries(ELEMENT)) {
    if (set.has(signName)) return el;
  }
  return null;
}

function elementCompatibility(a, b) {
  if (!a || !b) return { score: 0, note: '' };
  if (a === b) return { score: 2, note: `Mismo elemento (${a}): ritmo y lenguaje afinados.` };
  const complementary =
    (a === 'Fuego' && b === 'Aire') ||
    (a === 'Aire' && b === 'Fuego') ||
    (a === 'Tierra' && b === 'Agua') ||
    (a === 'Agua' && b === 'Tierra');
  if (complementary)
    return { score: 1, note: `Elementos complementarios (${a} y ${b}): suelen equilibrarse.` };
  return {
    score: -0.5,
    note: `Elementos distintos (${a} y ${b}): más esfuerzo consciente para entenderse (no es “incompatible”, es otro idioma emocional).`,
  };
}

const PAIRS = [
  { id: 'sol-sol', a: 'sol', b: 'sol', label: 'Sol — Sol', hint: 'Identidad y propósito vital en conjunto.' },
  {
    id: 'solA-lunaB',
    a: 'sol',
    b: 'luna',
    label: 'Sol (A) — Luna (B)',
    hint: 'Lo que uno irradia y lo que el otro necesita emocionalmente.',
  },
  {
    id: 'lunaA-solB',
    a: 'luna',
    b: 'sol',
    label: 'Luna (A) — Sol (B)',
    hint: 'Reciprocidad emocional con la identidad del otro.',
  },
  {
    id: 'venusA-marteB',
    a: 'venus',
    b: 'marte',
    label: 'Venus (A) — Marte (B)',
    hint: 'Atracción, deseo y estilo de conquista / respuesta.',
  },
  {
    id: 'marteA-venusB',
    a: 'marte',
    b: 'venus',
    label: 'Marte (A) — Venus (B)',
    hint: 'Iniciativa frente al modo de amar del otro.',
  },
  {
    id: 'venus-venus',
    a: 'venus',
    b: 'venus',
    label: 'Venus — Venus',
    hint: 'Gustos, afecto y valores relacionales compartidos.',
  },
  {
    id: 'luna-luna',
    a: 'luna',
    b: 'luna',
    label: 'Luna — Luna',
    hint: 'Hogar, seguridad emocional y hábitos cotidianos.',
  },
  {
    id: 'mercurio-mercurio',
    a: 'mercurio',
    b: 'mercurio',
    label: 'Mercurio — Mercurio',
    hint: 'Diálogo, humor intelectual y resolución de malentendidos.',
  },
  {
    id: 'solA-venusB',
    a: 'sol',
    b: 'venus',
    label: 'Sol (A) — Venus (B)',
    hint: 'Reconocimiento y cariño hacia lo que B valora en el vínculo.',
  },
  {
    id: 'venusA-solB',
    a: 'venus',
    b: 'sol',
    label: 'Venus (A) — Sol (B)',
    hint: 'El amor y el gusto de A proyectados sobre el núcleo identitario de B.',
  },
  {
    id: 'jupiterA-lunaB',
    a: 'jupiter',
    b: 'luna',
    label: 'Júpiter (A) — Luna (B)',
    hint: 'Fe, humor y expansión de A sobre el mundo emocional de B.',
  },
  {
    id: 'lunaA-jupiterB',
    a: 'luna',
    b: 'jupiter',
    label: 'Luna (A) — Júpiter (B)',
    hint: 'Las necesidades afectivas de A frente al optimismo y la visión de B.',
  },
  {
    id: 'saturnoA-solB',
    a: 'saturno',
    b: 'sol',
    label: 'Saturno (A) — Sol (B)',
    hint: 'Límites, tiempo y seriedad de A sobre el proyecto vital de B.',
  },
  {
    id: 'solA-saturnoB',
    a: 'sol',
    b: 'saturno',
    label: 'Sol (A) — Saturno (B)',
    hint: 'La identidad de A encuentra estructura (o prueba) en el mapa de B.',
  },
];

const DISPLAY_PLANET = {
  sol: 'Sol',
  luna: 'Luna',
  mercurio: 'Mercurio',
  venus: 'Venus',
  marte: 'Marte',
  jupiter: 'Júpiter',
  saturno: 'Saturno',
  urano: 'Urano',
  neptuno: 'Neptuno',
  pluton: 'Plutón',
  ascendente: 'Ascendente',
  medioCielo: 'Medio Cielo',
};

function pushCrossAspect(list, title, pairId, asp, seed, angleNarrativeArgs) {
  if (!asp?.name) return;
  const es = typeLabelEs(asp.type);
  const seedKey = `${seed}|${title}|${asp.name}`;
  let narrative = pairId ? narrativeForPair(pairId, asp.name, seedKey) : '';
  if (!narrative && angleNarrativeArgs) {
    narrative = narrativePlanetToAngle({
      ...angleNarrativeArgs,
      aspectName: asp.name,
      seed: `${seedKey}|angle`,
    });
  }
  list.push({
    title,
    aspect: asp.name,
    type: asp.type,
    separation: asp.separation,
    text: `${asp.name} (${es}).`,
    narrative,
  });
}

export function analyzeCompatibility(chartA, chartB) {
  const seed = `${chartA.name || 'A'}|${chartB.name || 'B'}`;
  const warnings = [];
  if (!chartA.sunSign && !chartA.planets?.sol) warnings.push('Persona A: no se detectó Sol en el texto.');
  if (!chartB.sunSign && !chartB.planets?.sol) warnings.push('Persona B: no se detectó Sol en el texto.');

  const sunEl = elementCompatibility(elementOf(chartA.sunSign), elementOf(chartB.sunSign));
  const moonEl = elementCompatibility(elementOf(chartA.moonSign), elementOf(chartB.moonSign));

  const aspects = [];
  let score = sunEl.score * 1.2 + moonEl.score * 1.5;

  for (const { id, a, b, label, hint } of PAIRS) {
    const la = chartA.planets?.[a]?.longitude;
    const lb = chartB.planets?.[b]?.longitude;
    const asp = classifyAspect(angleDiff(la, lb));
    const aspectName = asp?.name;
    const w =
      aspectName != null
        ? adjustAspectWeight(id, aspectName, asp.weight)
        : asp?.weight ?? 0;
    const mult =
      a === 'venus' || b === 'venus' || a === 'luna' || b === 'luna' || a === 'sol' || b === 'sol'
        ? 1.0
        : 0.65;

    if (aspectName) {
      score += w * mult;
      aspects.push({
        id,
        label,
        hint,
        aspect: aspectName,
        type: asp.type,
        separation: asp.separation,
        weight: w,
        narrative: narrativeForPair(id, aspectName, `${seed}|${id}|${aspectName}`),
      });
    } else if (la != null && lb != null && asp && asp.separation != null) {
      aspects.push({
        id,
        label,
        hint,
        aspect: 'Sin aspecto mayor',
        type: 'neutral',
        separation: asp.separation,
        weight: 0,
        narrative:
          'No cae en órbita clásica de conjunción, sextil, cuadratura, trígono u oposición (o queda fuera de margen). Eso no es “neutralidad emocional”: otros contactos y las casas también cuentan.',
      });
    }
  }

  const ascCross = [];
  const ascA = chartA.planets?.ascendente?.longitude;
  const ascB = chartB.planets?.ascendente?.longitude;
  const mcA = chartA.planets?.medioCielo?.longitude;
  const mcB = chartB.planets?.medioCielo?.longitude;

  const personal = ['sol', 'luna', 'mercurio', 'venus', 'marte'];
  for (const pk of personal) {
    const lonA = chartA.planets?.[pk]?.longitude;
    const lonB = chartB.planets?.[pk]?.longitude;
    if (ascB != null && lonA != null) {
      const asp = classifyAspect(angleDiff(lonA, ascB));
      const label = `${DISPLAY_PLANET[pk]} (${chartA.name || 'A'}) — Ascendente (${chartB.name || 'B'})`;
      const pairSol = pk === 'sol' ? 'ascB-solA' : null;
      pushCrossAspect(ascCross, label, pairSol, asp, seed, {
        planetKey: pk,
        angleKey: 'asc',
        nameFrom: chartA.name || 'A',
        nameTo: chartB.name || 'B',
      });
    }
    if (ascA != null && lonB != null) {
      const asp = classifyAspect(angleDiff(lonB, ascA));
      const label = `${DISPLAY_PLANET[pk]} (${chartB.name || 'B'}) — Ascendente (${chartA.name || 'A'})`;
      const pairSol = pk === 'sol' ? 'ascA-solB' : null;
      pushCrossAspect(ascCross, label, pairSol, asp, seed, {
        planetKey: pk,
        angleKey: 'asc',
        nameFrom: chartB.name || 'B',
        nameTo: chartA.name || 'A',
      });
    }
    if (mcB != null && lonA != null) {
      const asp = classifyAspect(angleDiff(lonA, mcB));
      const label = `${DISPLAY_PLANET[pk]} (${chartA.name || 'A'}) — Medio Cielo (${chartB.name || 'B'})`;
      pushCrossAspect(ascCross, label, null, asp, seed, {
        planetKey: pk,
        angleKey: 'mc',
        nameFrom: chartA.name || 'A',
        nameTo: chartB.name || 'B',
      });
    }
    if (mcA != null && lonB != null) {
      const asp = classifyAspect(angleDiff(lonB, mcA));
      const label = `${DISPLAY_PLANET[pk]} (${chartB.name || 'B'}) — Medio Cielo (${chartA.name || 'A'})`;
      pushCrossAspect(ascCross, label, null, asp, seed, {
        planetKey: pk,
        angleKey: 'mc',
        nameFrom: chartB.name || 'B',
        nameTo: chartA.name || 'A',
      });
    }
  }

  score = Math.max(-10, Math.min(22, score));
  const normalized = Math.round(((score + 10) / 32) * 100);
  const scorePercent = Math.min(92, Math.max(24, normalized));

  const verdict =
    scorePercent >= 74
      ? 'Alta afinidad en los factores que esta app puede ver: buena base simbólica para explorar el vínculo.'
      : scorePercent >= 56
        ? 'Afinidad mixta: conviven zonas fluidas y zonas de fricción útil; el vínculo depende de cómo se nombren las diferencias.'
        : 'Perfil desafiante en los pocos ítems automáticos: suele haber polaridad o ritmos distintos. Eso no mide “amor real” ni permanencia; mide un cruce de reglas simplificado.';

  const summaryLines = [
    `${chartA.name || 'Persona A'}: Sol ${chartA.sunSign || '?'}, Luna ${chartA.moonSign || '?'}, Asc ${chartA.ascSign || '?'}.`,
    `${chartB.name || 'Persona B'}: Sol ${chartB.sunSign || '?'}, Luna ${chartB.moonSign || '?'}, Asc ${chartB.ascSign || '?'}.`,
  ];

  const modalityNotes = [];
  const solMod = modalityCompatibility(chartA.sunSign, chartB.sunSign);
  if (solMod) modalityNotes.push(`Sol–Sol (modalidad): ${solMod.line}`);
  const moonMod = modalityCompatibility(chartA.moonSign, chartB.moonSign);
  if (moonMod) modalityNotes.push(`Luna–Luna (modalidad): ${moonMod.line}`);
  const ascMod = modalityCompatibility(chartA.ascSign, chartB.ascSign);
  if (ascMod) modalityNotes.push(`Asc–Asc (modalidad): ${ascMod.line}`);

  const highlights = buildHighlights(aspects, ascCross);

  const overlayAB = buildOverlaySection(chartA, chartB, chartA.name || 'A', chartB.name || 'B');
  const overlayBA = buildOverlaySection(chartB, chartA, chartB.name || 'B', chartA.name || 'A');
  const dimensions = computeDimensions(chartA, chartB, aspects, overlayAB, overlayBA);
  const scenarios = buildScenarios(chartA, chartB, aspects, dimensions, overlayAB, overlayBA);

  const notIncluded = [
    'Carta compuesta, Davison, revolución solar o progresiones.',
    'Nodos lunares, asteroides (Quiron, Lilith, etc.), vertex.',
    'Planetas retrógrados o estrellas fijas.',
    'Aspectos menores (semisextil, quincuncio) y órbitas finas que un astrólogo ajusta a mano.',
    'Si el pegado no trae las 12 cúspides de casas, los overlays no se pueden calcular.',
  ];

  const scoreExplainer = [
    'El porcentaje resume elementos Sol/Luna y una selección de aspectos entre planetas (con reglas fijas). No es una nota escolar del romance.',
    'Un porcentaje “bajo” puede indicar polaridad fuerte (por ejemplo Venus–Marte en oposición: mucha química, más drama). Mirá el texto de cada fila, no solo el número.',
    'Los textos largos de LosArcanos describen tu carta natal, no la relación: la sinastría es cruzar dos mapas; esta app solo automatiza una parte de ese cruce.',
  ];

  return {
    scorePercent,
    verdict,
    summaryLines,
    elementNotes: [sunEl.note, moonEl.note].filter(Boolean),
    modalityNotes,
    aspects,
    ascCross,
    warnings,
    planetTable: buildPlanetTable(chartA, chartB),
    highlights,
    notIncluded,
    scoreExplainer,
    overlayAB,
    overlayBA,
    dimensions,
    scenarios,
    housesOkA: Boolean(chartA.houseCusps),
    housesOkB: Boolean(chartB.houseCusps),
    promptForAI: buildAIPrompt(chartA, chartB, aspects, ascCross, overlayAB, overlayBA),
  };
}

function buildHighlights(aspects, ascCross) {
  const lines = [];
  const venusMars = aspects.find(
    (a) => a.id === 'venusA-marteB' || a.id === 'marteA-venusB'
  );
  if (venusMars?.aspect === 'Oposición' || venusMars?.aspect === 'Cuadratura') {
    lines.push(
      `Química / polaridad: ${venusMars.label} en ${venusMars.aspect} suele leerse como atracción intensa y puesta a prueba de límites, no como “falta de amor”.`
    );
  }
  const trines = aspects.filter((a) => a.aspect === 'Trigono' && (a.id.includes('venus') || a.id.includes('luna')));
  if (trines.length) {
    lines.push(
      `Zonas fluidas: ${trines.map((t) => t.label).join(', ')} — suelen costar menos trabajo cotidiano.`
    );
  }
  if (!lines.length) {
    lines.push(
      'No hay un “resumen dramático” automático: revisá oposiciones y cuadraturas entre Sol, Luna, Venus y Marte; ahí suele estar el relato principal del vínculo.'
    );
  }
  if (ascCross.length) {
    const first = ascCross[0];
    lines.push(`Contacto angular: ${first.title} — ${first.aspect} (${first.text})`);
  }
  return lines;
}

function buildAIPrompt(chartA, chartB, aspects, ascCross, overlayAB, overlayBA) {
  const fmt = (c) =>
    `${c.name}: Sol ${c.sunSign || '?'}, Luna ${c.moonSign || '?'}, Asc ${c.ascSign || '?'}`;
  const aspLines = aspects
    .map((a) => `- ${a.label}: ${a.aspect}${a.separation != null ? ` (${a.separation}°)` : ''}`)
    .join('\n');
  const ascLines = ascCross.map((x) => `- ${x.title}: ${x.aspect}`).join('\n');
  const ov = (sec) =>
    sec?.missing || !sec?.rows?.length
      ? ''
      : sec.rows
          .slice(0, 8)
          .map((r) => `- ${r.headline}`)
          .join('\n');
  const ovAB = ov(overlayAB);
  const ovBA = ov(overlayBA);
  return `Actuá como astróloga/o educativa, tono respetuoso y no fatalista.

Contexto: comparación de dos cartas natales (texto pegado de informe LosArcanos).

Persona A: ${fmt(chartA)}
Persona B: ${fmt(chartB)}

Aspectos calculados automáticamente entre cartas:
${aspLines || '(ninguno en órbita mayor)'}

${ascLines ? `Cruces Ascendente / Luna:\n${ascLines}\n` : ''}
${ovAB ? `Overlays: planetas de A en casas de B (muestra):\n${ovAB}\n` : ''}
${ovBA ? `Overlays: planetas de B en casas de A (muestra):\n${ovBA}\n` : ''}

Tareas:
1) Explicá en lenguaje claro qué aporta cada contacto importante entre Sol, Luna, Venus, Marte y Ascendentes.
2) Si hay overlays, contá cómo se vive que un planeta de uno active la casa correspondiente del otro.
3) Proponé 3 temas de conversación para la pareja basados en tensiones armónicas vs tensas.
4) Recordá que la voluntad y el contexto vital no están en el mapa.

No hagas predicciones de fecha ni diagnósticos.`;
}

function buildPlanetTable(chartA, chartB) {
  const keys = ['sol', 'luna', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno', 'urano', 'neptuno', 'pluton'];
  return keys.map((k) => ({
    key: k,
    label: DISPLAY_PLANET[k],
    a: formatPos(chartA.planets?.[k]),
    b: formatPos(chartB.planets?.[k]),
  }));
}

function formatPos(p) {
  if (!p) return '—';
  const d = Math.floor(p.degree);
  const m = Math.round((p.degree - d) * 60);
  return `${p.sign} ${d}°${String(m).padStart(2, '0')}'`;
}

export { elementOf };
export { classifyAspect, angleDiff } from './aspectGeometry.js';
