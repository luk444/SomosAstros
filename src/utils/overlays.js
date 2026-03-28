import { houseForLongitude, HOUSE_TITLE } from './houses.js';
import { PLANET_SHORT as PLANET_LABEL } from './overlayLexicon.js';
import { buildDeepOverlay } from './overlayDeep.js';
import { resolveTextVariant } from './variantPick.js';

const OVERLAY_KEYS = ['sol', 'luna', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno', 'urano', 'neptuno', 'pluton'];

const tri = (a, b, c) => [a, b, c];

/**
 * Cuerpo interpretativo: planeta de "from" en casa de "to".
 * Si la plantilla es string[], elige variante A/B/C según seed estable.
 */
function bodyFor(planetKey, house, seed) {
  const P = PLANET_LABEL[planetKey] || planetKey;
  const templates = OVERLAY_TEMPLATES[planetKey];
  const raw = templates?.[house] ?? templates?.default ?? OVERLAY_TEMPLATES._default(P, house);
  return resolveTextVariant(raw, seed);
}

const OVERLAY_TEMPLATES = {
  _default: (P, h) =>
    `activa en el otro el tema de la casa ${h}: se percibe mucha energía de ${P} en esa esfera de vida cuando están juntos.`,

  sol: {
    1: tri(
      'tu identidad y brillo se mezclan con cómo el otro se presenta al mundo: fuerte “te reconozco enseguida” o competencia por el protagonismo.',
      'tu Sol toca el “yo” visible del otro: presencia marcada, reconocimiento rápido o roce por el timón personal.',
      'encendés su forma de salir a la escena: admiración, inspiración o sensación de que alguien te marca el paso.'
    ),
    2: tri(
      'tu sentido de valía y estilo de vida choca o refuerza la seguridad material y afectiva del otro.',
      'tu orgullo vital dialoga con lo que el otro considera “propio”: plata, placeres y autoestima tangible.',
      'valores y recursos entran al relato: acuerdos sobre merecimiento y prioridades marcan el tono.'
    ),
    3: tri(
      'activás conversación, ideas y curiosidad en su día a día; puede haber mucho ida y vuelta mental.',
      'tu Sol prende la charla cercana: mensajes, planes chicos y forma de nombrar las cosas.',
      'movimiento mental constante: humor, debates y entorno inmediato cargan de significado el vínculo.'
    ),
    4: tri(
      'tocás su hogar emocional y raíces: temas de familia, refugio y pertenencia salen a la luz.',
      'tu brillo aterriza en su nido: intimidad, historia familiar y necesidad de base segura.',
      'lo privado se activa: mudanzas, visitas o límites con la familia pueden ser foco.'
    ),
    5: tri(
      'encendés romance, juego y creatividad en el otro; la diversión y el coqueteo son un canal claro.',
      'tu Sol ilumina el deseo de brillar y gozar: coqueteo, risas y riesgo lúdico.',
      'pasión cinematográfica posible: creatividad compartida o competencia leve por atención.'
    ),
    6: tri(
      'aparecés en su rutina, hábitos y cuidados del día a día: convivencia real, a veces micromanaging.',
      'tu identidad se nota en horarios, salud y tareas: el amor pasa por lo cotidiano.',
      'el cuerpo y el calendario del otro te “leen”: útil si hay respeto al ritmo; pesado si hay control disfrazado.'
    ),
    7: tri(
      'sos un imán de pareja en su mapa: el vínculo uno a uno y los acuerdos son el escenario natural.',
      'tu Sol centra la alianza: contrato emocional, espejo y negociación cara a cara.',
      'poco neutral en el “nosotros”: definir qué son suele ser tema recurrente.'
    ),
    8: tri(
      'profundidad, intimidad intensa y temas de confianza/poder: lo que no es superficial se activa.',
      'tu brillo toca tabúes, fusiones y verdad incómoda: todo-o-nada emocional posible.',
      'intensidad compartida: plata del otro, sexo transformador o secretos que no aguantan la liviandad.'
    ),
    9: tri(
      'expandís su horizonte de sentido, viajes o creencias; puede inspirar o cuestionar su visión.',
      'tu Sol mete fe, estudios o planes grandes en la mesa del vínculo.',
      'el futuro y el sentido de la vida se discuten con pasión: acordar respeto a dos mapas del mundo.'
    ),
    10: tri(
      'impactás su imagen pública y metas: te ven ligado a su reputación o carrera.',
      'tu identidad se asocia a su trayectoria visible: trabajo, estatus y responsabilidad social.',
      'el mundo “de afuera” lee el vínculo: logros, exposición y ambición entran al relato de pareja.'
    ),
    11: tri(
      'entras en su red de amigos y proyectos futuros; la relación también es social y de grupo.',
      'tu Sol ilumina tribu, causas y sueños colectivos: amistad y futuro compartido.',
      'la vida en grupo condiciona el clima: lealtades y redes importan tanto como el uno a uno.'
    ),
    12: tri(
      'algo de misterio, curación o confusión: lo inconsciente del otro se remueve; pide honestidad suave.',
      'tu presencia activa retiro, compasión o cansancio simbólico: límites y descanso son clave.',
      'lo difuso pesa: idealización, rescate o final de ciclo; conviene anclar con hechos y calma.'
    ),
    default: tri(
      'tu núcleo vital ilumina esa área de la vida del otro cuando comparten espacio y tiempo.',
      'tu Sol focaliza esa esfera en el mapa del otro: se percibe con claridad en el vínculo.',
      'identidad y esa “habitación” de su vida dialogan con fuerza; el contexto modula el tono.'
    ),
  },

  luna: {
    1: 'tus emociones y humor se pegan a su “yo” visible: se sienten rápido, para bien o para saturación.',
    2: 'necesidades de contención y seguridad dialogan con lo que el otro valora y posee.',
    3: 'charlas, chismes y ambiente cercano: la Luna busca conexión cotidiana ahí.',
    4: 'hogar, familia y calma íntima: muy fuerte para convivir o para tocar heridas familiares.',
    5: 'ternura lúdica y necesidad de cariño expresivo; el romance necesita juego y calidez.',
    6: 'rutinas, comidas, salud emocional: el cuidado práctico es donde se siente el vínculo.',
    7: 'el otro despierta necesidad de pareja en vos o viceversa; la Luna pide reciprocidad cara a cara.',
    8: 'vulnerabilidad profunda, celos o fusiones emocionales; conviene claridad y límites.',
    9: 'idealización o búsqueda de sentido compartido; viajes y conversaciones largas nutren.',
    10: 'sus logros y rol público afectan tu estado de ánimo; apoyo emocional a sus metas.',
    11: 'amistad, pertenencia a un grupo y sueños en común calman o inquietan tu Luna.',
    12: 'empatía, cansancio o confusiones emocionales: hay mucha absorción; descansos solos ayudan.',
    default:
      'tu mundo emocional aterriza en esa casa del otro: ahí se juega buena parte del clima del vínculo.',
  },

  venus: {
    1: 'gusto estético y afecto hacia cómo el otro se muestra; fuerte atracción superficial que puede profundizar.',
    2: 'placeres compartidos, regalos, plata y valores: el amor pasa por lo tangible y lo estable.',
    3: 'palabras dulces, mensajes, humor liviano; el coqueteo es mental y cercano.',
    4: 'hogar acogedor, familia y ternura doméstica; el amor busca refugio.',
    5: 'romance, diversión y chispa erótica-lúdica; muy cinematográfico si hay respeto.',
    6: 'detalles cotidianos, cuidados pequeños y armonía en la rutina son tu idioma de amor.',
    7: 'alianza, equilibrio y “equipo de dos”; Venus pide reciprocidad explícita.',
    8: 'intensidad, celos, intimidad fuerte o secretos afectivos; todo o nada emocional.',
    9: 'idealización, viajes, cultura y filosofía del amor; puede elevar o distorsionar expectativas.',
    10: 'orgullo por el otro o atracción por su estatus; el cariño se mezcla con admiración pública.',
    11: 'amor que también es amistad y proyecto de futuro; redes y causas en común.',
    12: 'amor compasivo, sacrificio o fantasía; límites sanos evitan decepciones.',
    default:
      'tu forma de amar y buscar armonía se proyecta en esa área de la vida del otro.',
  },

  marte: {
    1: tri(
      'incentiva acción y asertividad en el otro; puede encender pasión o roce por el timón.',
      'metés energía en su imagen: coraje compartido o competencia por liderar la escena.',
      'menos neutralidad en la presencia: el otro te percibe intenso/a al salir al mundo.'
    ),
    2: 'disputas por plata/valores o impulso para ganar juntos; energía en lo material.',
    3: 'debates intensos, ironía o prisa en la comunicación; picante mental.',
    4: 'discusiones en casa o defensa feroz del hogar; la ira puede ser “familiar”.',
    5: 'deseo sexual directo, competencia lúdica o riesgos compartidos; mucha chispa.',
    6: 'trabajo a full, tareas y a veces roce en el día a día; conviene repartir responsabilidades.',
    7: tri(
      'atracción peleona o pasión confrontativa en la pareja; el desafío puede ser erótico.',
      'Marte en la casa 7 del otro: pasión, franqueza y roce que rara vez se siente “suave”.',
      'dinámica de pareja viva: deseo de definir el vínculo y confrontar con honestidad.'
    ),
    8: 'crisis, celos, poder o sexo intenso; se necesita honestidad radical.',
    9: 'cruceros, debates de principios o empuje hacia metas grandes juntos.',
    10: tri(
      'empuje competitivo en carrera o imagen; pueden empujarse a crecer o chocar por ambición.',
      'tu Marte calienta metas visibles del otro: drive compartido o presión por resultados.',
      'el trabajo y la reputación son cancha de acción: útil para emprender; pesado si compiten por el podio.'
    ),
    11: 'activismo, amigos en común o peleas ideológicas leves; el grupo mete presión.',
    12: 'irritación difusa, agotamiento o impulso a cuidar al otro en silencio; descargar tensión con deporte.',
    default:
      'tu coraje, deseo y forma de pelear se cruzan con esa esfera del mapa del otro.',
  },

  mercurio: {
    default:
      'conversaciones, planes y chistes aterrizan ahí: el vínculo necesita diálogo en esa área.',
  },

  jupiter: {
    default:
      'optimismo, fe y ganas de más: ampliás esa parte de la vida del otro (a veces en exceso).',
  },

  saturno: {
    default:
      'compromiso, límites y tiempo largo: esa casa pide seriedad y pruebas de confianza.',
  },

  urano: {
    default:
      'sorpresa, libertad y cambios bruscos; lo predecible se rompe en esa área.',
  },

  neptuno: {
    default:
      'idealización, confusión o compasión; conviene anclar expectativas con hechos concretos.',
  },

  pluton: {
    default:
      'transformación intensa, control o renacimiento emocional en ese tema de vida.',
  },
};

/**
 * @returns {{ fromName: string, toName: string, rows: object[], missing: boolean }}
 */
export function buildOverlaySection(chartFrom, chartTo, fromName, toName) {
  const cusps = chartTo.houseCusps;
  if (!cusps) {
    return { fromName, toName, rows: [], missing: true };
  }
  const rows = [];
  for (const key of OVERLAY_KEYS) {
    const lon = chartFrom.planets?.[key]?.longitude;
    if (lon == null) continue;
    const house = houseForLongitude(lon, cusps);
    if (house == null) continue;
    const label = PLANET_LABEL[key];
    const rowSeed = `${fromName}|${toName}|${key}|${house}`;
    rows.push({
      key: `${key}-${house}`,
      label,
      house,
      houseTitle: HOUSE_TITLE[house],
      headline: `${label} de ${fromName} → casa ${house} de ${toName}`,
      detail: bodyFor(key, house, rowSeed),
      deep: buildDeepOverlay(key, house, fromName, toName, chartFrom, chartTo),
    });
  }
  return { fromName, toName, rows, missing: false };
}
