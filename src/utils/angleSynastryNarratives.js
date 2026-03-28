import { pickVariant } from './variantPick.js';

/**
 * Textos revisados: planeta de una carta en aspecto mayor al Asc o MC de la otra.
 * Tres matices por celda (A/B/C vía seed).
 */
const DEF = {
  Conjunción: [
    'Fusión fuerte entre la energía del planeta y la “puerta” angular: se siente inevitable, inmediato y muy presente en la interacción.',
    'Contacto angular directo: lo del planeta y lo del ángulo se mezclan; cuesta separar primera impresión de vínculo real.',
    'Intensidad en el encuentro: el planeta “aterriza” en el eje visible del otro; suele marcar memoria y estilo de relación.',
  ],
  Trigono: [
    'Facilidad natural: el planeta apoya el ángulo sin forzar; conviene no dar por sentado ese apoyo.',
    'Sintonía fluida en lo que el ángulo representa: menos fricción, más comprensión espontánea.',
    'Cooperación angular: el planeta afina la forma en que el otro se muestra o proyecta metas.',
  ],
  Sextil: [
    'Puerta abierta: hace falta un poco de intención, pero el ángulo recibe oportunidades del planeta.',
    'Pequeños ajustes que suman: gestos concretos del planeta estabilizan la vida angular del otro.',
    'Oportunidad práctica: buen momento para acordar hábitos que sostengan ese eje.',
  ],
  Cuadratura: [
    'Fricción creativa: el planeta pone en tensión el ángulo; pide negociación y respeto al ritmo del otro.',
    'Roce visible: lo que el planeta pide choca con cómo el otro se presenta o con sus metas externas.',
    'Desafío útil si se nombra: el ángulo se ve presionado a crecer; sin diálogo puede sentirse juicio.',
  ],
  Oposición: [
    'Polaridad marcada: atracción de contrarios o tira y afloja entre necesidad del planeta y eje angular del otro.',
    'Espejo fuerte: lo que uno muestra en el planeta responde a lo que el otro proyecta en el ángulo.',
    'Equilibrio buscado: requiere turnarse y no “ganarle” al otro en la escena pública o en la carrera.',
  ],
  default: [
    'Contacto angular perceptible: el planeta colorea la forma en que el otro encara ese eje de vida.',
    'Tono definido en el cruce: se nota en la interacción aunque no sea el único factor del vínculo.',
    'Matiz angular a tener en cuenta junto con casas y otros aspectos.',
  ],
};

const SOL_ASC = {
  Conjunción: [
    'El Sol de quien mira se confunde con la “máscara” del otro: reconocimiento inmediato, o sensación de que “así es” esa persona.',
    'Identidad y primera impresión fundidas: fuerte sensación de destino o de competencia por el protagonismo, según madurez.',
    'Brillo sobre el Asc: el núcleo vital de uno ilumina cómo el otro sale al mundo; muy visible para terceros.',
  ],
  Trigono: [
    'Validación natural: el Sol de uno hace sentir al otro bien visto al salir a la escena social.',
    'Apoyo al estilo del otro: menos necesidad de explicarse; el brillo de uno afina la presencia del otro.',
    'Orgullo compartido en lo visible: buen tono para presentarse juntos sin eclipsarse.',
  ],
  Cuadratura: [
    'El Sol de uno puede sentirse incómodo con el “modo” del otro al salir; el otro puede sentirse evaluado en su imagen.',
    'Choque identidad–máscara: conviene separar “no me gusta cómo actúa en público” de “no me importa”.',
    'Fricción de estilos vitales: pide humor y acuerdos sobre espacios donde cada uno lidera.',
  ],
  Oposición: [
    'Polaridad identidad–encuentro: lo que uno irradia se ve reflejado o contrastado con cómo el otro se muestra.',
    'Atracción por contraste de estilo de vida; riesgo de compararse en redes, familia o escena social.',
    'Equilibrio entre “yo soy así” y “vos te mostrás así”: negociar escenarios sin competir por la mirada ajena.',
  ],
};

const LUNA_ASC = {
  Conjunción: [
    'La Luna de uno engancha con la primera impresión del otro: empatía rápida o saturación si los ritmos no se respetan.',
    'Clima emocional visible: se “siente” el estado de ánimo del otro al instante; hogar en el otro o sensibilidad extrema.',
    'Contención y máscara mezcladas: el cuidado emocional se vincula a cómo el otro se presenta.',
  ],
  Trigono: [
    'Seguridad al estar juntos en público: la Luna de uno calma la ansiedad social del otro.',
    'Ternura en lo cotidiano visible: pequeños gestos sostienen la imagen del otro sin drama.',
    'Facilidad para contener la vergüenza o la timidez del otro con presencia suave.',
  ],
  Oposición: [
    'Mundo emocional vs imagen: lo que uno necesita por dentro puede chocar con lo que el otro debe mostrar afuera.',
    'Altibajos en salidas y encuentros: conviene acordar tiempos de exposición social.',
    'Polaridad afectiva fuerte: magnetismo si hay contención; agotamiento si se exige espejo perfecto.',
  ],
};

const VENUS_ASC = {
  Conjunción: [
    'Atracción estética y cariño hacia el “modo” del otro: se ve lindo, se siente gusto rápido.',
    'Venus besa la máscara: coqueteo, armonía o dependencia del reflejo del otro.',
    'Gusto por cómo el otro se ofrece al mundo: fuerte componente de admiración superficial que puede profundizar.',
  ],
  Trigono: [
    'Afecto que afina la presencia del otro: halagos que sí pegan; complicidad social natural.',
    'Placer compartido en salir, vestirse, mostrarse: menos vergüenza, más juego.',
    'Armonía en la forma de relacionarse con terceros cuando están juntos.',
  ],
  Oposición: [
    'Gusto y contraste: lo que a uno le encanta del otro a veces también lo desafía (envidia leve, comparación).',
    'Polaridad erótico-social: la química pasa por cómo cada uno se muestra en escena.',
    'Negociar estética y límites: “me gusta tu estilo” vs “quiero que cambies para salir”.',
  ],
};

const MARTE_ASC = {
  Conjunción: [
    'Impulso directo sobre la imagen del otro: enciende, acelera o fricciona el primer encuentro.',
    'Deseo de empujar al otro a actuar; puede sentirse sexy o invasivo según contexto.',
    'Energía en la “fachada” relacional: menos neutralidad, más chispa y confrontación liviana.',
  ],
  Trigono: [
    'Coraje compartido para salir a la cancha: el Marte de uno anima la presencia del otro.',
    'Pasión deportiva o sexual que se nota en la interacción pública sin escándalo innecesario.',
    'Iniciativa que despierta confianza en el otro para defenderse o pedir lo que quiere.',
  ],
  Cuadratura: [
    'Roce por estilo de asertividad: uno puede sentir que el otro “entra fuerte” en su imagen o límites sociales.',
    'Discusiones en salidas o por impulsividad: canalizar en deporte o proyectos.',
    'Competencia por quién manda la escena: reglas de respeto en público.',
  ],
};

const MERC_ASC = {
  Conjunción: [
    'Curiosidad inmediata por el otro: charla que define el primer contacto; mucha información en poco tiempo.',
    'La mente de uno “lee” al otro al vuelo; riesgo de etiquetar demasiado pronto.',
    'Humor e ironía en la presentación: vínculo que nace por palabras.',
  ],
  Trigono: [
    'Diálogo que afina la imagen del otro: buen feedback, chistes que cierran.',
    'Facilidad para explicarse en sociedad sin malentendidos graves.',
    'Planes cortos y ágiles que sostienen la confianza en el encuentro.',
  ],
  Cuadratura: [
    'Malentendidos en lo dicho vs lo mostrado: corregir en privado, no delante de terceros.',
    'Ironía que pincha la máscara del otro: reformular con ternura.',
    'Prisa mental vs timidez social: acordar ritmos de salida y presentaciones.',
  ],
};

const SOL_MC = {
  Conjunción: [
    'El Sol de uno ilumina la vocación o imagen profesional del otro: orgullo cruzado o presión por brillar.',
    'Metas visibles compartidas: se asocian con la trayectoria del otro de forma pública.',
    'Reconocimiento en el mundo laboral o social: “nos ven” ligados a logros.',
  ],
  Trigono: [
    'Apoyo natural a la carrera del otro: el brillo de uno legitima metas del otro sin robar cámara.',
    'Dirección compartida: buen tono para proyectos ambiciosos en pareja.',
    'Menos celos profesionales si hay elogios explícitos.',
  ],
  Cuadratura: [
    'Choque entre proyecto vital y carrera del otro: agendas que compiten.',
    'Sensación de que el trabajo del otro eclipsa o critica el propio camino.',
    'Negociar visibilidad: quién brilla hoy en lo público sin puntuar.',
  ],
};

const LUNA_MC = {
  Conjunción: [
    'El estado de ánimo de uno se engancha con el estrés o el orgullo profesional del otro.',
    'Hogar emocional ligado a logros externos: celebrar o sufrir según resultados del otro.',
    'Necesidad de contención cuando el otro está expuesto públicamente.',
  ],
  Trigono: [
    'Contención práctica en jornadas intensas del otro: comida, descanso, palabras suaves.',
    'Menos drama cuando hay deadlines: la Luna de uno estabiliza el clima.',
    'Orgullo emocional por los logros del otro sin compararse.',
  ],
};

const VENUS_MC = {
  Conjunción: [
    'Gusto y seducción ligados a la imagen profesional del otro: admiración por lo que hace “afuera”.',
    'Armonía en metas visibles: el cariño pasa también por apoyar la carrera.',
    'Riesgo de idealizar el estatus del otro: anclar con hechos y valores.',
  ],
  Trigono: [
    'Detalles estéticos que mejoran la presentación profesional del otro.',
    'Placer compartido en eventos, networking o proyectos creativos visibles.',
    'Cariño que legitima ambiciones sin hacerlas competencia.',
  ],
};

const MARTE_MC = {
  Conjunción: [
    'Impulso sobre la carrera del otro: empuja a competir, a defenderse o a quemarse.',
    'Pasión por los objetivos del otro; roce si hay presión o comparación.',
    'Energía en metas públicas: útil para emprender; pesado si no hay pausas.',
  ],
  Cuadratura: [
    'Discusiones por prioridades laborales o por quién sacrifica qué.',
    'Impulsividad que afecta decisiones de imagen pública del otro.',
    'Canalizar en deporte o proyectos paralelos para no pelear por el mismo podio.',
  ],
};

/** @type {Record<string, Record<string, string[]>>} */
const TABLE = {
  'sol-asc': { ...DEF, ...SOL_ASC },
  'luna-asc': { ...DEF, ...LUNA_ASC },
  'venus-asc': { ...DEF, ...VENUS_ASC },
  'marte-asc': { ...DEF, ...MARTE_ASC },
  'mercurio-asc': { ...DEF, ...MERC_ASC },
  'sol-mc': { ...DEF, ...SOL_MC },
  'luna-mc': { ...DEF, ...LUNA_MC },
  'venus-mc': { ...DEF, ...VENUS_MC },
  'marte-mc': { ...DEF, ...MARTE_MC },
};

/**
 * @param {object} p
 * @param {string} p.planetKey sol|luna|mercurio|venus|marte
 * @param {'asc'|'mc'} p.angleKey
 * @param {string|null} p.aspectName
 * @param {string} p.nameFrom dueño del planeta
 * @param {string} p.nameTo dueño del ángulo
 * @param {string} p.seed
 */
export function narrativePlanetToAngle(p) {
  const { planetKey, angleKey, aspectName, nameFrom, nameTo, seed } = p;
  const k = `${planetKey}-${angleKey}`;
  const block = TABLE[k] || DEF;
  const arr = (aspectName && block[aspectName]) || block.default;
  const body = pickVariant(arr, seed) || '';
  const angleLabel = angleKey === 'asc' ? 'Ascendente' : 'Medio Cielo';
  return `${body} (lectura simbólica: ${planetKey} de ${nameFrom} en ${aspectName || 'contacto angular'} con el ${angleLabel} de ${nameTo}.)`;
}
