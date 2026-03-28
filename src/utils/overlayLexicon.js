/** Nombres cortos para tablas / headlines */
export const PLANET_SHORT = {
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
};

/**
 * @typedef {{ label: string, emoji: string, representa: string, pursuitVerb: string, recibeVerb: string }} PlanetLex
 */

/** @type {Record<string, PlanetLex>} */
export const PLANET_LEXICON = {
  sol: {
    label: 'Sol',
    emoji: '☀️',
    representa:
      'el núcleo de identidad, el orgullo sano, la vitalidad, “quién soy” cuando nadie me está mirando y cómo brillo cuando sí me miran.',
    pursuitVerb: 'suele mostrar primero quién es, qué quiere y hacia dónde apunta',
    recibeVerb: 'ilumina o pone en escena',
  },
  luna: {
    label: 'Luna',
    emoji: '🌙',
    representa:
      'el mundo emocional, las necesidades de contención, el humor, los hábitos de cuidado y lo que hace sentir “hogar” o inseguridad.',
    pursuitVerb: 'suele expresar antes el clima emocional, el cuidado o la necesidad de contención',
    recibeVerb: 'hace sentir o remueve emocionalmente',
  },
  mercurio: {
    label: 'Mercurio',
    emoji: '💬',
    representa:
      'la mente en acción: cómo hablamos, escuchamos, bromeamos, organizamos planes y resolvemos malentendidos.',
    pursuitVerb: 'suele verbalizar, proponer ideas o acelerar el diálogo primero',
    recibeVerb: 'dispara conversación, curiosidad o ruido mental',
  },
  venus: {
    label: 'Venus',
    emoji: '💗',
    representa:
      'el deseo de gusto, ternura, belleza y acuerdo: cómo seducimos, mimamos, ponemos música suave a la vida y buscamos reciprocidad.',
    pursuitVerb: 'suele acercarse con cariño, estética o propuestas placenteras primero',
    recibeVerb: 'ablanda, atrae o pide armonía en',
  },
  marte: {
    label: 'Marte',
    emoji: '🔥',
    representa:
      'energía, impulso, deseo, iniciativa, coraje y confrontación: cómo alguien actúa, defiende límites y va por lo que quiere cuando algo le importa.',
    pursuitVerb: 'suele impulsar, proponer, confrontar o encender la situación primero',
    recibeVerb: 'activa urgencia, reacción o deseo de responder en',
  },
  jupiter: {
    label: 'Júpiter',
    emoji: '✨',
    representa:
      'fe, expansión, optimismo, ganas de crecer, humor grande y “vamos por más”: visión amplia y sentido de oportunidad.',
    pursuitVerb: 'suele agrandar el panorama, animar o proponer aventuras primero',
    recibeVerb: 'amplía expectativas o genera entusiasmo en',
  },
  saturno: {
    label: 'Saturno',
    emoji: '⏳',
    representa:
      'límites, tiempo, responsabilidad, madurez y pruebas de consistencia: lo que exige estructura y no se regala sin esfuerzo.',
    pursuitVerb: 'suele marcar reglas, plazos o compromisos serios primero',
    recibeVerb: 'pone peso realista, contención o miedo a fallar en',
  },
  urano: {
    label: 'Urano',
    emoji: '⚡',
    representa:
      'libertad, originalidad, cambios bruscos y verdad incómoda: lo impredecible que rompe rutinas y despierta de golpe.',
    pursuitVerb: 'suele traer giro, independencia o verdad inesperada primero',
    recibeVerb: 'desestabiliza o moderniza la forma en que el otro vive',
  },
  neptuno: {
    label: 'Neptuno',
    emoji: '🌊',
    representa:
      'idealización, sensibilidad extrema, compasión, arte y confusión: lo que se diluye, se sueña o se siente sin fronteras claras.',
    pursuitVerb: 'suele envolver con ternura, fantasía o evasión primero',
    recibeVerb: 'suaviza límites o nubla la claridad en',
  },
  pluton: {
    label: 'Plutón',
    emoji: '🜏',
    representa:
      'intensidad profunda, control, transformación y tabúes: lo que no se ignora sin que algo cambie por dentro.',
    pursuitVerb: 'suele ir al fondo, exigir la verdad o intensificar el juego de poder primero',
    recibeVerb: 'fuerza mirar de frente lo oculto o lo intenso en',
  },
};

/** @type {Record<number, { representa: string, temaCorto: string, reactionPhrase: string }>} */
export const HOUSE_LEXICON = {
  1: {
    representa:
      'el “yo” visible, el cuerpo, la primera impresión y la forma de encarar la vida al salir al mundo.',
    temaCorto: 'identidad y presencia',
    reactionPhrase: 'se siente tocado/a en cómo se percibe a sí mismo/a y cómo lo ven',
  },
  2: {
    representa:
      'recursos propios, valores, autoestima ligada a lo tangible, placeres sensoriales y manejo de lo que “es mío”.',
    temaCorto: 'valores y recursos',
    reactionPhrase: 'reacciona en seguridad material, placer y lo que considera digno/a',
  },
  3: {
    representa:
      'comunicación cercana, entorno inmediato, hermanos, vecinos, estudios cortos y la vida mental cotidiana.',
    temaCorto: 'charla y entorno',
    reactionPhrase: 'procesa por el diálogo, los mensajes y el ritmo mental del día a día',
  },
  4: {
    representa:
      'hogar, raíces, familia de origen, intimidad privada y el lugar donde se baja la guardia.',
    temaCorto: 'hogar y raíces',
    reactionPhrase: 'se mueve en temas de pertenencia, familia y refugio emocional',
  },
  5: {
    representa:
      'romance, creatividad, diversión, deseo de brillar, hijos (tema lúdico) y el placer de crear/vibrar.',
    temaCorto: 'romance y creatividad',
    reactionPhrase: 'enciende o protege su espacio de juego, coqueteo y expresión personal',
  },
  6: {
    representa:
      'rutina, trabajo cotidiano, salud, hábitos, servicio y lo que mantenemos “en orden” cada día.',
    temaCorto: 'rutina y cuidados',
    reactionPhrase: 'responde con hábitos, tareas, límites prácticos o agotamiento del día a día',
  },
  7: {
    representa:
      'pareja, vínculos uno a uno, acuerdos, contratos afectivos y el espejo del “otro” frente a frente.',
    temaCorto: 'pareja y acuerdos',
    reactionPhrase: 'vive la relación de igual a igual, la negociación y la proyección sobre el otro',
  },
  8: {
    representa:
      'intimidad profunda, fusiones, tabúes, crisis compartidas, plata del otro, sexo transformador y lo que no se habla en la mesa del comedor.',
    temaCorto: 'intensidad y confianza profunda',
    reactionPhrase: 'reacciona con todo o nada, celos, entrega o defensa frente a lo vulnerable',
  },
  9: {
    representa:
      'sentido de la vida, creencias, viajes largos, estudios superiores y horizontes que amplían la cabeza.',
    temaCorto: 'sentido y horizonte',
    reactionPhrase: 'abre o cierra debates de fe, futuro y “para dónde vamos”',
  },
  10: {
    representa:
      'carrera, imagen pública, reputación, metas visibles y la responsabilidad ante el mundo exterior.',
    temaCorto: 'carrera e imagen',
    reactionPhrase: 'siente el impacto en su trabajo, estatus o responsabilidad social',
  },
  11: {
    representa:
      'amistades, redes, proyectos colectivos y el futuro deseado con otros (tribu, causas, grupo).',
    temaCorto: 'amigos y proyectos',
    reactionPhrase: 'ajusta su lugar en el grupo, la lealtad y los planes compartidos',
  },
  12: {
    representa:
      'inconsciente, retiro, compasión extrema, final de ciclos y todo lo que se diluye o se comprende en silencio.',
    temaCorto: 'inconsciente y cierre',
    reactionPhrase: 'procesa en privado, con sueños, cansancio o necesidad de espacio simbólico',
  },
};
