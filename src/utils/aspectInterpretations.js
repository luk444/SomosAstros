/**
 * Textos educativos por tipo de aspecto y par (sinastría simplificada, español).
 * Tres matices por celda cuando el valor es string[] (elección determinística por seed).
 */

import { resolveTextVariant } from './variantPick.js';

const ASPECT_TOOLTIPS = {
  Conjunción:
    'Fusión de temas: lo de ambos planetas se mezcla; se siente intenso y a veces difícil de separar.',
  Sextil:
    'Puerta abierta: requiere un poco de voluntad para aprovecharlo, pero facilita cooperación.',
  Cuadratura:
    'Fricción que exige ajuste: tensión creativa si hay respeto; estancamiento si se fuerza tener la razón.',
  Trigono:
    'Flujo natural: se entienden esas energías sin tanto esfuerzo; conviene no darlas por sentadas.',
  Oposición:
    'Polaridad visible: atracción de contrarios o choque de necesidades; el arte está en el equilibrio.',
};

function baseAspectLine(aspectName) {
  return ASPECT_TOOLTIPS[aspectName] || '';
}

/**
 * @param {string} pairId
 * @param {string} aspectName
 * @param {string} [seed] clave estable para variante A/B/C
 */
export function narrativeForPair(pairId, aspectName, seed = '') {
  const base = baseAspectLine(aspectName);
  const block = PAIR_SPECIFIC[pairId];
  if (!block) return base;
  const raw = block[aspectName] ?? block.default;
  const specific = resolveTextVariant(raw, seed);
  if (specific) return `${specific} ${base}`.trim();
  return base;
}

/** @typedef {string | string[]} V */

const PAIR_SPECIFIC = {
  'sol-sol': {
    default: [
      'Dos identidades en diálogo: estilo de vida, prioridades y orgullo sano marcan el tono del vínculo.',
      'Eje “yo–yo”: se negocia cuánto espacio hay para que ambos brillen sin competir por un solo micrófono.',
      'Proyecto vital compartido o choque de caminos: la relación enseña a honrar dos centros distintos.',
    ],
    Conjunción: [
      'Sintonía vital fuerte: reconocimiento inmediato del “motor” del otro; riesgo de competencia si no hay roles claros.',
      'Fusión de propósitos: se sienten muy parecidos en lo esencial; conviene no borrar diferencias útiles.',
      'Intensidad en la identidad mutua: mucha presencia conjunta; el descanso en lo privado ordena el vínculo.',
    ],
    Trigono: [
      'Ritmos y objetivos afines: se entienden sin traducir tanto; apoyo natural al orgullo del otro.',
      'Facilidad para celebrar logros ajenos: menos celos de protagonismo.',
      'Dirección compatible: conviene no dar por sentado el esfuerzo consciente.',
    ],
    Cuadratura: [
      'Maneras distintas de “ser uno mismo”: fricción creativa si hay respeto; choque de egos si no se nombran necesidades.',
      'Impulsos vitales en carriles distintos: negociar calendario, descanso y prioridades.',
      'Desafío útil: el otro te mueve de la zona cómoda identitaria; requiere humor y fairness.',
    ],
    Oposición: [
      'Espejo fuerte: lo que uno proyecta puede ser exactamente lo que el otro integra o rechaza.',
      'Complemento polar: atracción por contraste de estilos de vida; equilibrio en lugar de “ganar”.',
      'Relación visible para terceros: la pareja se lee como “opuestos que se buscan”; conviene intimidad sin audiencia.',
    ],
  },
  'solA-lunaB': {
    default: [
      'Eje identidad (A) / mundo emocional (B): cómo A brilla y cómo B se nutre en el día a día.',
      'A aporta dirección y calor solar; B aporta clima afectivo y necesidad de contención.',
      'Clásico vínculo a trabajar con paciencia: lo vital y lo sensible no siempre hablan el mismo idioma.',
    ],
    Trigono: [
      'A valida el mundo emocional de B con naturalidad: menos explicaciones, más presencia.',
      'B se siente visto sin performar; A se siente útil sin “arreglar” todo.',
      'Ritmo agradable: celebraciones pequeñas sostienen el vínculo.',
    ],
    Sextil: [
      'Gestos concretos de A estabilizan el clima interno de B.',
      'Oportunidad cotidiana: mensajes breves y planes simples que ordenan la inseguridad.',
      'Puerta abierta: hace falta intención, pero el esfuerzo rinde.',
    ],
    Cuadratura: [
      'A puede sentir que “no alcanza”; B puede sentir que no es visto: nombrar necesidades con calma.',
      'Choque entre imagen y estado de ánimo: no tomar el humor del otro como ataque personal.',
      'Fricción útil si baja la velocidad: turnos de palabra y pausas antes de concluir.',
    ],
    Oposición: [
      'Polaridad afectiva intensa: magnetismo con contención; agotamiento si se exige espejo 24/7.',
      'Se buscan y se frustran en espejo: acordar tiempos propios y espacios de regulación.',
      'Gran historia romántica posible si hay límites claros y respeto al ritmo emocional.',
    ],
  },
  'lunaA-solB': {
    default: [
      'Recíproco Sol–Luna: la seguridad emocional de A frente al núcleo identitario de B.',
      'B ilumina con su “yo”; A nutre con su clima interno: equilibrio entre escena y refugio.',
      'Aprendizaje mutuo: identidad sin frialdad; emoción sin perder dirección.',
    ],
    Trigono: [
      'B hace sentir visto el mundo íntimo de A sin exigirle explicaciones constantes.',
      'Contención natural: menos drama, más pertenencia.',
      'Rituales cotidianos que sostienen orgullo y ternura a la vez.',
    ],
    Cuadratura: [
      'El estado de ánimo de A puede chocar con la imagen que B quiere proyectar: paciencia mutua.',
      'B puede sentirse “arrastrado” por altibajos; A puede sentirse evaluado en lo sensible.',
      'Nombrar: “no es que no te ame, es que hoy mi cuerpo pide calma”.',
    ],
    Oposición: [
      'Vivencia emocional en carriles opuestos: se complementan o se agotan según límites.',
      'Intensidad romántica: conviene no usar el ego para invalidar el clima del otro.',
      'Acuerdos sobre exposición social vs tiempo en casa.',
    ],
  },
  'saturnoA-solB': {
    default: [
      'Madurez: A aporta límites o responsabilidad sobre el brillo y las metas de B; ancla o pesa según el respeto.',
      'Tiempo largo y pruebas de consistencia: construcción seria si hay fairness.',
      'B aprende estructura; A aprende calidez sin control.',
    ],
    Trigono: [
      'Realismo que sostiene proyectos compartidos: promesas que se cumplen.',
      'Menos drama, más plan: el Sol de B gana contención.',
      'Reconocimiento del esfuerzo mutuo en metas visibles.',
    ],
    Cuadratura: [
      'Sensación de examen o freno: útil si se traduce en construcción; duro si es crítica permanente.',
      'B puede sentirse contado/a; A puede sentirse “el malo”: humanizar la responsabilidad.',
      'Negociar expectativas sin castigar con silencio.',
    ],
    Oposición: [
      'Polaridad libertad–deber: equilibrio entre compromiso y aire propio.',
      'Tensión creciente si no hay elogios al esfuerzo.',
      'Aprendizaje fuerte sobre límites sanos y promesas realistas.',
    ],
  },
  'solA-saturnoB': {
    default: [
      'El Sol de A tropieza con estructura, miedos o deberes de B: paciencia y respeto al ritmo del otro.',
      'A quiere brillar; B pone tiempo y prueba: vínculo que madura o se enfría.',
      'Tema de autoridad compartida: quién manda en qué área con acuerdos explícitos.',
    ],
    Conjunción: [
      'Mezcla fuerte identidad–responsabilidad: puede durar si hay ternura con las reglas.',
      'Compromiso visible: menos cuento de hadas, más obra en marcha.',
      'Cuidado con mezclar amor y juicio moral.',
    ],
  },
  'jupiterA-lunaB': {
    default: [
      'Fe, humor y aventura de A sobre el mundo emocional de B: alivio o exageración según límites.',
      'B se abre o se satura: moderar “va a estar todo bien” con presencia real.',
      'Expansión del hogar emocional: viajes, risas, nuevos horizontes cotidianos.',
    ],
    Trigono: [
      'Buen clima para reír, viajar y crecer juntos en lo cotidiano.',
      'B se siente menos solo en sus altibajos.',
      'Generosidad de espíritu sin invadir.',
    ],
    Cuadratura: [
      'Promesas o excesos de A que desordenan la necesidad de calma de B.',
      'Riesgo de minimizar el dolor del otro con positividad forzada.',
      'Anclar con hechos: horarios, presencia, seguimiento.',
    ],
  },
  'lunaA-jupiterB': {
    default: [
      'Emociones de A frente a la expansión y creencias de B: generosidad y/o exageración.',
      'Fe en el vínculo que nutre o que nubla expectativas.',
      'Idealización del hogar o del futuro: chequeos suaves de realidad.',
    ],
  },
  'venusA-marteB': {
    default: [
      'Eje afecto–deseo–iniciativa: cómo A ama y cómo B enciende la chispa.',
      'Química y negociación de ritmos en el acercamiento.',
      'Romance con cuerpo y palabra: definir qué es respeto para cada uno.',
    ],
    Oposición: [
      'Muy frecuente en química fuerte: polaridad erótica y estilos que se buscan.',
      'Atracción por contraste: lo que uno da es lo que el otro despierta.',
      'Necesidad de límites claros para que la pasión no se confunda con presión.',
    ],
    Cuadratura: [
      'Choque de ritmos en el acercamiento; con diálogo se vuelve vivo y estimulante.',
      'Discusiones de deseo y disponibilidad: nombrar sin culpa.',
      'Fricción que prende si hay humor y respeto.',
    ],
    Trigono: [
      'Gusto y deseo coordinados sin roles rígidos de perseguidor/perseguida.',
      'Placer compartido con naturalidad.',
      'Coqueteo que sostiene el vínculo en lo cotidiano.',
    ],
    Conjunción: [
      'Romance intenso y directo: límites y expectativas explícitas ayudan.',
      'Fusión erótico-afectiva marcada.',
      'Pasión que pide honestidad sobre ritmos y consentimiento.',
    ],
  },
  'marteA-venusB': {
    default: [
      'Iniciativa de A frente al modo de amar de B: choque o encendido.',
      'Deseo de conquista vs necesidad de ternura: negociar ambos.',
      'Energía sexual y afectiva en el mismo ring: reglas de juego claras.',
    ],
    Oposición: [
      'Atracción por contraste: el impulso de A despierta lo que B valora en el vínculo.',
      'Polaridad cinematográfica si hay contención.',
      'Celos o competencia si el ego manda.',
    ],
    Cuadratura: [
      'Discusiones de “quién manda” en el afecto si no hay acuerdos explícitos.',
      'Pasiones que escalan rápido: pausa y reformulación.',
      'Desafío creativo: el roce puede ser erótico o agotador.',
    ],
  },
  'venus-venus': {
    default: [
      'Valores estéticos, afectivos y de placer compartidos (o en tensión negociable).',
      'Qué es bello, justo y tierno para cada uno: contrato emocional de gusto.',
      'Armonía buscada con honestidad: no solo “evitar conflictos”.',
    ],
    Trigono: [
      'Gustos parecidos y cariño fluido en lo cotidiano.',
      'Placer simple que sostiene el vínculo.',
      'Menos traducción, más disfrute.',
    ],
    Sextil: [
      'Detalles pequeños que suman con el tiempo.',
      'Coqueteo sostenible sin grandilocuencia.',
      'Oportunidades de ternura que hay que tomar.',
    ],
    Cuadratura: [
      'Ritmos de cercanía distintos: negociar qué es cariño para cada uno.',
      'Gustos chocan: humor y curiosidad por el otro.',
      'Evitar silent treatment: pedir con claridad.',
    ],
  },
  'luna-luna': {
    default: [
      'Hogar, humor emocional y estrés en pareja: cómo se regulan juntos.',
      'Necesidad de refugio compartido vs tiempos de espacio.',
      'Memoria afectiva del vínculo: lo que “se siente” día a día.',
    ],
    Trigono: [
      'Se entienden altibajos sin juicio.',
      'Empatía natural en crisis chicas.',
      'Rituales de calma que funcionan.',
    ],
    Cuadratura: [
      'Dos climas emocionales: paciencia con tiempos del otro.',
      'Evitar leer todo como rechazo.',
      'Acordar señales de “necesito espacio” vs “necesito abrazo”.',
    ],
    Oposición: [
      'Intimidad y hogar en carriles opuestos: acuerdos explícitos ayudan.',
      'Polaridad que puede ser complementaria con respeto.',
      'Cuidado con dramatizar diferencias de ritmo.',
    ],
  },
  'mercurio-mercurio': {
    default: [
      'Humor, chistes, discusiones y malentendidos: calidad del diálogo.',
      'Velocidad mental y curiosidad compartida o chocada.',
      'Cómo se repara después de un malentendido.',
    ],
    Trigono: [
      'Misma velocidad mental y curiosidad compartida.',
      'Ideas que fluyen: proyectos y charlas largas.',
      'Menos necesidad de sobreexplicar.',
    ],
    Cuadratura: [
      'Malentendidos por estilo: reformular y escucha activa.',
      'Ironía que pincha: acordar tono en tensión.',
      'Debates que pueden enriquecer si no hay que ganar.',
    ],
  },
  'solA-venusB': {
    default: [
      'Reconocimiento del brillo de A en lo que B considera bello o valioso en el amor.',
      'Aporta orgullo y dirección; B aporta gusto y ternura: elogios que funcionan.',
      'Cuidado con sentirse “evaluado” en la propia imagen.',
    ],
  },
  'venusA-solB': {
    default: [
      'Afecto y gusto de A hacia la identidad visible de B.',
      'B se siente deseado en su núcleo; A busca armonía con quien B es.',
      'Idealización leve posible: anclar con hechos cotidianos.',
    ],
  },
  'ascA-solB': {
    default: [
      'Primera impresión de A frente al núcleo solar de B: reconocimiento rápido o desajuste de expectativas.',
      'Máscara y vitalidad: el encuentro “de afuera” no es neutro.',
      'Terceros leen la química antes que la pareja a veces.',
    ],
    Conjunción: [
      'Fusión visible fuerte: “te vi y te reconocí” es frecuente en la narrativa del vínculo.',
      'Competencia por imagen si no hay ternura.',
      'Encuentro que marca memoria.',
    ],
    Trigono: [
      'Facilidad para mostrarse juntos: apoyo al estilo del otro.',
      'Menos vergüenza social en equipo.',
      'Validación natural de la presencia mutua.',
    ],
  },
  'ascB-solA': {
    default: [
      'Cómo B se presenta al mundo dialoga con el Sol de A: espejo en la escena social.',
      'Encuentro entre máscara y núcleo vital.',
      'Polaridad o sintonía según madurez y contexto.',
    ],
    Conjunción: [
      'Reconocimiento inmediato del estilo vital del otro en lo visible.',
      'Relación que “se ve” con claridad para otros.',
      'Equilibrio entre protagonismos.',
    ],
    Trigono: [
      'Apoyo al brillo del otro sin eclipsarse.',
      'Salidas y presentaciones con fluidez.',
      'Orgullo mutuo en público.',
    ],
  },
};

export { ASPECT_TOOLTIPS };
