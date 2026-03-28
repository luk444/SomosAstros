/**
 * Puntuaciones por ámbito (heurística, 22–98) y escenarios narrativos para la UI.
 */

function aspScore(aspectRow) {
  if (!aspectRow?.aspect || aspectRow.aspect === 'Sin aspecto mayor') return 0;
  const n = aspectRow.aspect;
  if (n === 'Trigono' || n === 'Sextil') return 2;
  if (n === 'Conjunción') return 1;
  if (n === 'Oposición') return 0;
  if (n === 'Cuadratura') return -1;
  return 0;
}

function findAspect(aspects, id) {
  return aspects.find((x) => x.id === id);
}

function houseOfPlanetInOther(overlaySection, planetKey) {
  if (!overlaySection?.rows?.length) return null;
  const row = overlaySection.rows.find((r) => r.key.startsWith(planetKey + '-'));
  return row?.house ?? null;
}

function clampPct(n) {
  return Math.min(96, Math.max(24, Math.round(n)));
}

export function computeDimensions(chartA, chartB, aspects, ab, ba) {
  const ll = findAspect(aspects, 'luna-luna');
  const sl = findAspect(aspects, 'solA-lunaB');
  const ls = findAspect(aspects, 'lunaA-solB');
  let emo =
    aspScore(ll) * 1.4 +
    aspScore(sl) * 1.1 +
    aspScore(ls) * 1.1;
  const moonH = (ov, pk) => houseOfPlanetInOther(ov, pk);
  const mA7 = moonH(ab, 'luna');
  const mB7 = moonH(ba, 'luna');
  if (mA7 === 4 || mA7 === 8) emo += 0.8;
  if (mB7 === 4 || mB7 === 8) emo += 0.8;
  if (chartA.moonSign && chartB.moonSign && chartA.moonSign === chartB.moonSign) emo += 0.6;

  const vmAB = findAspect(aspects, 'venusA-marteB');
  const mvAB = findAspect(aspects, 'marteA-venusB');
  const vv = findAspect(aspects, 'venus-venus');
  let chem = aspScore(vmAB) * 1.3 + aspScore(mvAB) * 1.3 + aspScore(vv) * 1.1;
  if (vmAB?.aspect === 'Oposición' || mvAB?.aspect === 'Oposición') chem += 1.2;
  if (vmAB?.aspect === 'Cuadratura' || mvAB?.aspect === 'Cuadratura') chem += 0.6;
  const v5 = houseOfPlanetInOther(ab, 'venus') === 5 || houseOfPlanetInOther(ba, 'venus') === 5;
  const mars5 = houseOfPlanetInOther(ab, 'marte') === 5 || houseOfPlanetInOther(ba, 'marte') === 5;
  if (v5) chem += 0.7;
  if (mars5) chem += 0.7;

  const mm = findAspect(aspects, 'mercurio-mercurio');
  let comm = aspScore(mm) * 1.8;
  const merc3 =
    houseOfPlanetInOther(ab, 'mercurio') === 3 ||
    houseOfPlanetInOther(ba, 'mercurio') === 3;
  const merc7 =
    houseOfPlanetInOther(ab, 'mercurio') === 7 ||
    houseOfPlanetInOther(ba, 'mercurio') === 7;
  if (merc3) comm += 0.9;
  if (merc7) comm += 0.7;

  const satS = findAspect(aspects, 'saturnoA-solB');
  const sSat = findAspect(aspects, 'solA-saturnoB');
  let commit = aspScore(satS) * 1.1 + aspScore(sSat) * 1.1;
  if (satS?.aspect === 'Cuadratura' || sSat?.aspect === 'Cuadratura') commit += 0.5;
  if (satS?.aspect === 'Oposición' || sSat?.aspect === 'Oposición') commit += 0.3;
  const sat7 =
    houseOfPlanetInOther(ab, 'saturno') === 7 || houseOfPlanetInOther(ba, 'saturno') === 7;
  if (sat7) commit += 1;

  const jl = findAspect(aspects, 'jupiterA-lunaB');
  const lj = findAspect(aspects, 'lunaA-jupiterB');
  let fun = aspScore(jl) + aspScore(lj);
  const j5 =
    houseOfPlanetInOther(ab, 'jupiter') === 5 || houseOfPlanetInOther(ba, 'jupiter') === 5;
  if (j5) fun += 1.1;

  const moon6 =
    houseOfPlanetInOther(ab, 'luna') === 6 || houseOfPlanetInOther(ba, 'luna') === 6;
  const mars6 =
    houseOfPlanetInOther(ab, 'marte') === 6 || houseOfPlanetInOther(ba, 'marte') === 6;
  let daily = aspScore(ll) * 0.8 + (moon6 ? 1 : 0) + (mars6 ? 0.6 : 0);

  const sun11 =
    houseOfPlanetInOther(ab, 'sol') === 11 || houseOfPlanetInOther(ba, 'sol') === 11;
  const ven11 =
    houseOfPlanetInOther(ab, 'venus') === 11 || houseOfPlanetInOther(ba, 'venus') === 11;
  let social = (sun11 ? 1.2 : 0) + (ven11 ? 1 : 0) + aspScore(vv) * 0.5;

  const map = (raw) => clampPct(52 + raw * 9);

  return [
    {
      id: 'emotional',
      label: 'Mundo emocional',
      emoji: '🌙',
      percent: map(emo),
      blurb: 'Lunas, Sol–Luna cruzado y dónde cae la Luna del otro en tu mapa (hogar, intimidad).',
    },
    {
      id: 'chemistry',
      label: 'Química y deseo',
      emoji: '🔥',
      percent: map(chem),
      blurb: 'Venus–Marte, Venus–Venus y planetas en casa 5: chispa, romance, polaridad.',
    },
    {
      id: 'communication',
      label: 'Diálogo y humor',
      emoji: '💬',
      percent: map(comm),
      blurb: 'Mercurio entre cartas y Mercurio en casas 3 y 7: charla, chistes, malentendidos.',
    },
    {
      id: 'commitment',
      label: 'Compromiso y tiempo',
      emoji: '⏳',
      percent: map(commit),
      blurb: 'Saturno tocando el Sol del otro o cayendo en casa 7: pruebas, deber y duración.',
    },
    {
      id: 'daily',
      label: 'Convivencia diaria',
      emoji: '🏠',
      percent: map(daily),
      blurb: 'Luna en casa 6, Marte en rutinas: reparto de tareas, clima en el día a día.',
    },
    {
      id: 'fun',
      label: 'Diversión y expansión',
      emoji: '✨',
      percent: map(fun),
      blurb: 'Júpiter–Luna y Júpiter en casa 5: risas, planes, fe en el vínculo.',
    },
    {
      id: 'social',
      label: 'Amigos y tribu',
      emoji: '🤝',
      percent: map(social),
      blurb: 'Sol o Venus en casa 11 del otro: vida social compartida y proyectos con amigos.',
    },
  ];
}

export function buildScenarios(chartA, chartB, aspects, dimensions, ab, ba) {
  const na = chartA.name || 'Persona A';
  const nb = chartB.name || 'Persona B';

  const vmOpp =
    findAspect(aspects, 'venusA-marteB')?.aspect === 'Oposición' ||
    findAspect(aspects, 'marteA-venusB')?.aspect === 'Oposición';
  const moonSq =
    findAspect(aspects, 'luna-luna')?.aspect === 'Cuadratura' ||
    findAspect(aspects, 'luna-luna')?.aspect === 'Oposición';
  const mercHard =
    findAspect(aspects, 'mercurio-mercurio')?.aspect === 'Cuadratura' ||
    findAspect(aspects, 'mercurio-mercurio')?.aspect === 'Oposición';
  const emoPct = dimensions.find((d) => d.id === 'emotional')?.percent ?? 50;
  const chemPct = dimensions.find((d) => d.id === 'chemistry')?.percent ?? 50;
  const commPct = dimensions.find((d) => d.id === 'communication')?.percent ?? 50;
  const dailyPct = dimensions.find((d) => d.id === 'daily')?.percent ?? 50;

  const mars4 =
    houseOfPlanetInOther(ab, 'marte') === 4 || houseOfPlanetInOther(ba, 'marte') === 4;
  const moon4 =
    houseOfPlanetInOther(ab, 'luna') === 4 || houseOfPlanetInOther(ba, 'luna') === 4;

  const cards = [];

  cards.push({
    id: 'fight',
    title: 'Si se calienta una discusión',
    hook: mercHard || moonSq ? 'Sube rápido el volumen emocional.' : 'Tienen margen para bajar el tono.',
    text:
      mercHard && moonSq
        ? `${na} y ${nb}: con Mercurio tenso y Luna en tensión, los malentendidos se amplifican. Convén timeouts (“pausa 20 min”) y una sola pregunta: ¿qué necesitás ahora? Eviten ganar la discusión; busquen entender el susto debajo del enojo.`
        : mercHard
          ? `El estilo de hablar choca antes que los fondos. Nombren hechos sin adjetivos (“cuando pasó X me pasó Y”) y eviten mensajes de texto en caliente.`
          : moonSq
            ? `Los humores no están sincronizados: uno necesita espacio y el otro cercanía. Acuerden señales de “necesito una hora” sin interpretarlo como rechazo.`
            : `Tienen vías para dialogar: usen humor suave y turnos de palabra. Si igual escala, es señal de temas más viejos que el hecho puntual.`,
  });

  cards.push({
    id: 'living',
    title: 'Viviendo bajo el mismo techo',
    hook: dailyPct >= 62 ? 'La rutina puede ser aliada.' : 'Habrá que negociar hábitos explícitamente.',
    text:
      moon4 && mars4
        ? `Hogar = zona sensible para ambos: definan espacio propio aunque sea chico y rituales de cierre de día (comida, serie, caminata).`
        : dailyPct >= 58
          ? `La Luna y la casa 6 favorecen repartir tareas concretas en lista visible. Menos “me ayudás” y más “los miércoles yo cocino / vos lavás”.`
          : `Sin mucha Luna en “servicio”, el desorden o los horarios distintos pueden irritar. Acuerden estándar mínimo aceptable y celebración semanal de lo que sí funciona.`,
  });

  cards.push({
    id: 'travel',
    title: 'Viaje largo o mudanza',
    hook: emoPct >= 60 ? 'Se sostienen con flexibilidad.' : 'Planificar descansos emocionales.',
    text: `Los viajes exponen Sol–Luna y Mercurio: si uno planifica todo y el otro improvisa, dividan “días estructura / días libres”. ${vmOpp ? 'La polaridad Venus–Marte puede hacer el viaje más apasionado… y más discutido en el hotel. Rían después.' : 'Armen un presupuesto suave y un “plan B” para cuando falte energía.'}`,
  });

  cards.push({
    id: 'family',
    title: 'Familia del otro / límites externos',
    hook: moon4 ? 'La familia pesa en el clima del vínculo.' : 'Roles sociales claros ayudan.',
    text: `Cuando aparecen suegros o amigos íntimos, ${na} y ${nb} funcionan mejor con reglas previas: qué se comenta en pareja primero, qué es privado, y cuánto tiempo social aguanta cada uno por fin de semana. La casa 4 del otro activada por planetas de uno marca que “el clan” entra en la conversación.`,
  });

  cards.push({
    id: 'money',
    title: 'Plata, trabajo y estrés',
    hook: 'Saturno y casa 2/8 marcan honestidad material.',
    text: `Acuerden visibilidad: cuentas compartidas o no, topes de gasto, y cómo hablan de miedo a la escasez sin culparse. Si Saturno toca el Sol del otro, los logros profesionales pueden sentirse como presión: celebren avances sin comparar trayectorias.`,
  });

  cards.push({
    id: 'intimacy',
    title: 'Intimidad y pasión',
    hook: chemPct >= 65 ? 'Hay tela para cortar en lo erótico.' : 'La ternura explícita suma más que el drama.',
    text: vmOpp
      ? `Oposición Venus–Marte: atracción por contraste, ritmos distintos de deseo. Pidan lo que quieren sin adivinación y acorten la distancia con gestos concretos, no solo con “teoría del amor”.`
      : chemPct >= 58
        ? `Buena mezcla de romance (casa 5 / Venus) y presencia física: variar escenarios y priorizar el “sí” explícito.`
        : `Pueden construir química con curiosidad: qué los excita a cada uno fuera del guion. Menos performance, más honestidad.`,
  });

  cards.push({
    id: 'crisis',
    title: 'Crisis o mal año',
    hook: emoPct >= 55 ? 'Pueden contenerse mutuamente.' : 'Eviten convertir el estrés en señal de “no nos queremos”.',
    text: `En crisis externa (salud, laburo, duelo), el vínculo se prueba en micro-acuerdos: quién cocina, quién llama al médico, quién necesita silencio. ${moonSq ? 'Con Lunas tensas, alternen contención y espacio sin tomarlo personal.' : 'Uno puede ser “el fuerte” esta semana y al revés la próxima.'}`,
  });

  cards.push({
    id: 'friends',
    title: 'Salidas, amigos y redes',
    hook: commPct >= 58 ? 'Brillan en sociabilidad.' : 'Acorden “modo pareja” vs “modo individual”.',
    text: `Si el Sol o Venus de uno cae en casa 11 del otro, los amigos son parte del amor. Si no, igual conviene acordar noches en pareja vs. noches con tribu para que nadie se sienta abandonado o sofocado.`,
  });

  return cards;
}
