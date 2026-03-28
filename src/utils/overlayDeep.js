import { HOUSE_LEXICON, PLANET_LEXICON } from './overlayLexicon.js';
import { buildOverlayAngleBridge } from './overlayAngleBridge.js';
import { getVariantEcho } from './overlayVariantEcho.js';

/**
 * @param {string} planetKey
 * @param {number} house 1-12
 * @param {string} nameFrom
 * @param {string} nameTo
 * @param {object} [chartFrom] carta de quien aporta el planeta
 * @param {object} [chartTo] carta de quien aporta casas/ángulos
 */
export function buildDeepOverlay(planetKey, house, nameFrom, nameTo, chartFrom, chartTo) {
  const P = PLANET_LEXICON[planetKey];
  const H = HOUSE_LEXICON[house];
  if (!P || !H) return null;

  const variantSeed = `${nameFrom}|${nameTo}|${planetKey}|${house}`;
  const label = P.label;
  const title = `${P.emoji} ${label} de ${nameFrom} en la Casa ${house} de ${nameTo}`;

  const planetLine = `${label} → ${P.representa}`;
  const houseLine = `Casa ${house} → ${H.representa}`;

  const core =
    planetKey === 'marte' && house === 7
      ? deepMarte7(nameFrom, nameTo, P, H)
      : planetKey === 'marte'
        ? deepMarteOther(house, nameFrom, nameTo, P, H)
        : planetKey === 'venus'
          ? deepVenus(house, nameFrom, nameTo, P, H)
          : planetKey === 'sol'
            ? deepSol(house, nameFrom, nameTo, P, H)
            : planetKey === 'luna'
              ? deepLuna(house, nameFrom, nameTo, P, H)
              : planetKey === 'mercurio'
                ? deepMercurio(house, nameFrom, nameTo, P, H)
                : planetKey === 'jupiter'
                  ? deepJupiter(house, nameFrom, nameTo, P, H)
                  : planetKey === 'saturno'
                    ? deepSaturno(house, nameFrom, nameTo, P, H)
                    : deepOuter(planetKey, house, nameFrom, nameTo, P, H);

  const pursuitDynamic = buildPursuitDynamic(planetKey, house, nameFrom, nameTo, P, H);

  const lon = chartFrom?.planets?.[planetKey]?.longitude;
  const angleBridge =
    lon != null && chartTo
      ? buildOverlayAngleBridge(planetKey, lon, chartTo, nameFrom, nameTo, variantSeed)
      : '';

  const variantEcho = getVariantEcho(planetKey, house, variantSeed);

  return {
    title,
    introTitle: 'Primero, qué representa cada cosa',
    planetLine,
    houseLine,
    entoncesTitle: `Entonces, cuando el ${label} de ${nameFrom} cae en la Casa ${house} de ${nameTo}, suele significar que`,
    ...core,
    pursuitDynamic,
    angleBridge: angleBridge || undefined,
    variantEcho,
  };
}

function buildPursuitDynamic(planetKey, house, nameFrom, nameTo, P, H) {
  const extraMars =
    planetKey === 'marte' && house === 7
      ? `\n\nCon Marte en la casa 7 del otro, muchas parejas notan un patrón cinematográfico: **${nameFrom}** a menudo “acelera” la relación (propone, confronta, desea, empuja el encuentro) y **${nameTo}** siente que su mundo de pareja se enciende: más pasión, más franqueza… y a veces más roce. Quien **reacciona** con más intensidad en el momento suele ser quien siente que su eje de “nosotros” quedó tocado — acá, ${nameTo}. Quien **mete la marcha** primero en la dinámica suele ser ${nameFrom}, porque el impulso es de su Marte.`
      : '';

  return (
    `**Dinámica “quién impulsa / quién reacciona”**\n\n` +
    `El planeta siempre es energía de **${nameFrom}**. La casa es terreno de la vida de **${nameTo}** según su mapa.\n\n` +
    `En la práctica, **${nameFrom}** ${P.pursuitVerb}. **${nameTo}** ${H.reactionPhrase} en el tema “${H.temaCorto}”.\n\n` +
    `No es una ley absoluta de personalidades: contexto, madurez y límites cambian todo. Pero describe un **tono** que mucha gente reconoce en overlays: uno trae el “motor” del planeta y el otro lo vive en un área concreta de su vida.` +
    extraMars
  );
}

/** Marte casa 7 — lectura extendida (estilo consultoría popular). */
function deepMarte7(nf, nt, P, H) {
  return {
    entoncesHighlight: `${nf} activa fuertemente en ${nt} la energía de relación y confrontación directa.`,
    feelTitle: '💫 ¿Cómo se suele sentir esto?',
    feelBullets: [
      `👉 ${nf} enciende en ${nt} el eje de la pareja: poco “meh”, mucho “prendido”.`,
      `💫 Suele haber atracción, urgencia o ganas de definir qué son entre los dos.`,
    ],
    sections: [
      {
        n: 1,
        title: 'Mucha atracción y movimiento en la relación',
        body:
          `La presencia de ${nf} puede hacer que ${nt} la perciba intensa o estimulante, sienta ganas de acercarse rápido y viva la relación con más pasión o urgencia. Es un contacto que rara vez se siente del todo “neutral”.`,
      },
      {
        n: 2,
        title: 'La relación despierta reacciones fuertes',
        body:
          `${P.label} no es solo pasión: también es acción. Puede generar discusiones más directas, sinceridad sin filtro y necesidad de resolver cosas cara a cara. No necesariamente peleas “malas”: muchas veces es energía dinámica que pide honestidad.`,
      },
      {
        n: 3,
        title: '“Atracción peleona”: qué significa de verdad',
        body:
          `No habla automáticamente de toxicidad ni conflicto eterno. Suele significar que el desafío puede ser estimulante, que debatir o confrontar ideas aumenta la conexión y que hay chispa cuando ninguno es totalmente pasivo. A veces el vínculo crece porque el otro te mueve de tu zona cómoda.`,
      },
      {
        n: 4,
        title: 'El aprendizaje del overlay',
        body:
          `La clave suele ser aprender a diferenciar confrontar para construir vs confrontar para ganar. Bien canalizado, este contacto puede traer pasión, honestidad y crecimiento en pareja. Desregulado, suma reacciones impulsivas o discusiones que escalan rápido.`,
      },
    ],
    learningTitle: '⚔️ Para llevarlo a tierra',
    learningGood: [
      'Pasión y presencia real en el vínculo',
      'Honestidad que construye en lugar de herir',
      'Crecimiento en pareja cuando la confrontación ordena el vínculo',
    ],
    learningHard: [
      'Reacciones impulsivas o discusiones que escalan rápido',
      'Competir por la razón en lugar de reparar la conexión',
      'Interpretar franqueza como falta de amor',
    ],
    summary:
      `"${P.label} de ${nf} en la Casa 7 de ${nt}" indica un vínculo muy vivo: ${nf} despierta en ${nt} ganas de vincularse con intensidad, con pasión y con movimiento. Puede generar tanta atracción como confrontación constructiva. Es difícil de ignorar: la relación pide presencia real.`,
  };
}

function houseMarteFlavor(house, nf, nt) {
  const m = {
    1: `${nt} siente que ${nf} le “entra” al cuerpo y a la imagen que da al mundo: más valentía… o más roce por el timón personal.`,
    2: `${nt} nota el impulso de ${nf} en plata, valores y placeres: acelerar conquistas o discutir prioridades materiales.`,
    3: `sube el volumen mental: debates, ironía, prisa en mensajes y ganas de “cerrar el tema ya”.`,
    4: `la casa y la familia se prenden: protección feroz del hogar o discusiones domésticas con carga emocional.`,
    5: `romance y deseo con color deportivo: coqueteo intenso, risas, riesgo lúdico y ganas de pasar a la acción.`,
    6: `la rutina se acelera: tareas, trabajo, salud; útil si reparten roles; pesado si compiten por quién “hace más”.`,
    8: `intimidad fuerte: todo-o-nada, tabúes, celos o sexo transformador; pide honestidad radical y límites claros.`,
    9: `viajes, creencias y peleas de principios: ${nf} empuja horizontes; ${nt} redefine qué cree y hacia dónde va.`,
    10: `carrera e imagen: empuje competitivo, presión para brillar o apoyo marcial para lograr metas.`,
    11: `amigos y causas: activismo, grupo, polarización con la tribu o pasión compartida por un futuro.`,
    12: `cansancio, fantasía o rescate silencioso: la irritación puede ser difusa; el deporte y el descanso a solas ayudan.`,
  };
  return m[house] || `${nt} percibe el impulso de ${nf} en su ${HOUSE_LEXICON[house].temaCorto}.`;
}

function deepMarteOther(house, nf, nt, P, H) {
  const flav = houseMarteFlavor(house, nf, nt);
  return {
    entoncesHighlight: `${nf} mete coraje, deseo y ganas de actuar en el territorio de “${H.temaCorto}” en la vida de ${nt}.`,
    feelTitle: '💫 ¿Cómo se suele sentir esto?',
    feelBullets: [
      `👉 ${nf} hace que el tema de la casa ${house} se sienta más urgente para ${nt}.`,
      `💫 ${flav.charAt(0).toUpperCase() + flav.slice(1)}`,
    ],
    sections: [
      {
        n: 1,
        title: 'Movimiento y claridad',
        body: `Suele haber menos vueltas y más “vamos a hacerlo”. ${nt} puede sentirse estimulado/a o presionado/a según el respeto al ritmo del otro.`,
      },
      {
        n: 2,
        title: 'Reacción fuerte en esa área',
        body: `Porque la casa ${house} habla de ${H.temaCorto}, ${nt} no suele quedar indiferente: o se prende o se defiende. ${flav}`,
      },
      {
        n: 3,
        title: 'Cuándo suma y cuándo resta',
        body: `Suma cuando el impulso sirve para resolver, proteger o construir juntos. Resta cuando gana la competencia por mandar o cuando la franqueza se confunde con desprecio.`,
      },
      {
        n: 4,
        title: 'Aprendizaje',
        body: `Acordar señales de “pausa”, diferenciar enojo de deseo de contacto, y usar el cuerpo (caminata, deporte) para bajar la tensión antes de hablar.`,
      },
    ],
    learningTitle: '⚔️ Para llevarlo a tierra',
    learningGood: ['Canalizar la energía en proyectos compartidos', 'Reglas claras de respeto en discusiones'],
    learningHard: ['Escalar por orgullo', 'Evitar el tema hasta que explota'],
    summary: `"${P.label} de ${nf} en la Casa ${house} de ${nt}" activa ${H.temaCorto} con fuego: ${nf} trae iniciativa; ${nt} reacciona con intensidad en esa esfera. Es dinámico, poco pasivo y muy “real life”.`,
  };
}

function deepVenus(house, nf, nt, P, H) {
  return {
    entoncesHighlight: `${nf} acerca ternura, gusto y deseo de vínculo en ${H.temaCorto} de ${nt}.`,
    feelTitle: '💫 ¿Cómo se suele sentir esto?',
    feelBullets: [
      `👉 ${nt} a menudo siente que “se le suaviza” o se le prende el lado estético/afectivo en ${H.temaCorto}.`,
      `💫 Hay búsqueda de reciprocidad: Venus pide que el cariño vuelva en alguna forma concreta.`,
    ],
    sections: [
      {
        n: 1,
        title: 'Atracción y placer compartido',
        body: `${nf} regala detalles, halagos o propuestas placenteras; ${nt} recibe eso en el lugar de la vida donde necesita sentirse deseado/a o en armonía.`,
      },
      {
        n: 2,
        title: 'Expectativas y acuerdos',
        body: `Si ${H.temaCorto} es sensible (pareja, hogar, plata), aparecen conversaciones sobre “qué es amor para vos” y “qué es justo para mí”.`,
      },
      {
        n: 3,
        title: 'Cuando duele',
        body: `Si hay desigualdad de entrega o silencio, Venus sufre: puede haber distanciamiento elegante, indirectas o prueba de atención.`,
      },
      {
        n: 4,
        title: 'Aprendizaje',
        body: `Pedir cariño sin drama, responder con gestos pequeños y celebrar lo que ya funciona en lugar de solo corregir lo que falta.`,
      },
    ],
    learningTitle: '💗 Para llevarlo a tierra',
    learningGood: ['Rituales de ternura breves y frecuentes', 'Acuerdos explícitos en temas de valores'],
    learningHard: ['Dar por sentado el afecto', 'Competir por quién ama “más”'],
    summary: `"${P.label} de ${nf} en la Casa ${house} de ${nt}" pone belleza y vínculo en ${H.temaCorto}: ${nf} seduce y armoniza; ${nt} aprende a recibir y a negociar el amor ahí.`,
  };
}

/**
 * Lectura del Sol distinta por casa (antes casi todo era idéntico salvo temaCorto).
 * @param {number} house
 * @param {string} nf
 * @param {string} nt
 * @param {{ temaCorto: string }} H
 */
function solDeepByHouse(house, nf, nt, H) {
  /** @type {Record<number, { feel: [string, string], sections: { title: string, body: string }[], good: string[], hard: string[], summaryBody: string }>} */
  const m = {
    1: {
      feel: [
        `👉 ${nt} percibe la identidad de ${nf} como algo que “le entra” al cuerpo y a la primera impresión: presencia fuerte.`,
        `💫 Puede sentirse inspirado/a a mostrarse más… o incómodo/a si siente que le marcan el paso.`,
      ],
      sections: [
        {
          title: 'Presencia y timón personal',
          body: `El Sol pide ser visto. En casa 1, ${nt} asocia a ${nf} con valentía, estilo o forma de encarar la vida — no tanto con un tema abstracto, sino con “cómo se da” ${nf}.`,
        },
        {
          title: 'Sombra posible',
          body: `Competencia por el protagonismo, críticas veladas a la imagen del otro o sensación de que solo uno puede mandar en la relación.`,
        },
        {
          title: 'Regalo del overlay',
          body: `Motivación para autodefinirse con más orgullo: ${nf} puede ser espejo de coraje sin que ${nt} deba copiarlo al pie de la letra.`,
        },
        {
          title: 'Aprendizaje',
          body: `Celebrar dos estilos válidos de “yo”; acordar señales cuando uno necesita brillar y el otro, bajar el ritmo sin sentirse menos.`,
        },
      ],
      good: ['Elogios a la autenticidad del otro', 'Espacio para que cada uno lidere en algo distinto'],
      hard: ['Peleas de ego por quién manda la narrativa', 'Confundir amor con controlar la imagen del otro'],
      summaryBody: `mezcla identidades visibles: ${nf} irradia presencia; ${nt} siente el impacto en cómo se muestra al mundo.`,
    },
    2: {
      feel: [
        `👉 ${nt} vincula a ${nf} con plata, valores, placeres o autoestima material: “qué merezco” y “con qué me cuido”.`,
        `💫 Puede sentirse más seguro en lo tangible… o presionado si chocan prioridades de gasto o dignidad.`,
      ],
      sections: [
        {
          title: 'Valor y sustento',
          body: `En casa 2, el brillo de ${nf} toca lo que ${nt} considera propio: recursos, cuerpo-placer, límites de “esto sí / esto no”.`,
        },
        {
          title: 'Sombra posible',
          body: `Juicios sobre gastos, regalos como prueba de amor, o sensación de que alguien “mide” el valor del otro.`,
        },
        {
          title: 'Regalo del overlay',
          body: `Claridad sobre prioridades compartidas y orgullo sano por lo construido en común.`,
        },
        {
          title: 'Aprendizaje',
          body: `Hablar de plata sin vergüenza; separar estatus de afecto; acordar metas financieras sin infantilizar al otro.`,
        },
      ],
      good: ['Conversaciones breves y frecuentes sobre prioridades', 'Reconocer aportes no solo monetarios'],
      hard: ['Competir por quién “aporta más”', 'Silent treatment en temas de valores'],
      summaryBody: `conecta identidad con valores y recursos: ${nf} pone foco en el “qué sostengo”; ${nt} reacciona en su zona de merecimiento.`,
    },
    3: {
      feel: [
        `👉 Mucho ida y vuelta mental: mensajes, chistes, planes del día a día y forma de nombrar las cosas.`,
        `💫 ${nt} puede sentir que ${nf} “prende” la curiosidad… o que la charla se vuelve debate permanente.`,
      ],
      sections: [
        {
          title: 'Diálogo y entorno',
          body: `En casa 3, ${nt} asocia a ${nf} con la forma de hablar, escuchar y moverse en el entorno cercano.`,
        },
        {
          title: 'Sombra posible',
          body: `Ironía mal leída, prisa al corregir, o sensación de intelectualizar el afecto.`,
        },
        {
          title: 'Regalo del overlay',
          body: `Humor compartido, planes concretos y honestidad liviana que descomprime.`,
        },
        {
          title: 'Aprendizaje',
          body: `Pausa antes de “ganar” la discusión; reformular; no usar la palabra como arma en público.`,
        },
      ],
      good: ['Check-ins cortos sin pantallas', 'Humor que une, no que pincha'],
      hard: ['Corregir en frente de terceros', 'Interpretar silencio como desprecio'],
      summaryBody: `mezcla identidad con charla y entorno: ${nf} modela cómo se dice y se piensa el día a día; ${nt} lo vive en lo cercano.`,
    },
    4: {
      feel: [
        `👉 ${nt} conecta a ${nf} con hogar, familia o necesidad de refugio: donde se baja la guardia.`,
        `💫 Puede sentirse más arropado… o expuesto si el orgullo de ${nf} pisa temas sensibles del nido.`,
      ],
      sections: [
        {
          title: 'Raíces y pertenencia',
          body: `En casa 4, el Sol de ${nf} ilumina la vida privada de ${nt}: hogar, historia familiar, necesidad de base segura.`,
        },
        {
          title: 'Sombra posible',
          body: `Disputas por espacio, visitas o “cómo debe ser” la casa; heridas familiares que se prenden fácil.`,
        },
        {
          title: 'Regalo del overlay',
          body: `Orgullo por construir un hogar emocional real, no solo una fachada.`,
        },
        {
          title: 'Aprendizaje',
          body: `Respetar tiempos de intimidad; no usar el hogar como tribuna de juicio; nombrar necesidades sin culpa.`,
        },
      ],
      good: ['Rituales en casa que no compitan con la familia de origen', 'Reconocer vulnerabilidad como fortaleza'],
      hard: ['Arrastrar lealtades familiares sin negociar', 'Criticar el refugio del otro'],
      summaryBody: `mezcla identidad con hogar y raíces: ${nf} pone luz en lo privado; ${nt} siente el vínculo en la pertenencia.`,
    },
    5: {
      feel: [
        `👉 ${nt} asocia a ${nf} con romance, creatividad, deseo de brillar o espacio lúdico.`,
        `💫 Hay color y teatro emocional: puede ser muy divertido… o muy dramático si compiten por atención.`,
      ],
      sections: [
        {
          title: 'Brillo y deseo',
          body: `En casa 5, ${nf} aparece ligado al placer de crear, coquetear y sentirse vivo en el vínculo.`,
        },
        {
          title: 'Sombra posible',
          body: `Celos escénicos, comparación de “quién es más interesante”, o heridas por no ser elegido en el escenario afectivo.`,
        },
        {
          title: 'Regalo del overlay',
          body: `Pasión con nombre propio: salidas, proyectos creativos, risas que devuelven la magia.`,
        },
        {
          title: 'Aprendizaje',
          body: `Turnarse el foco; celebrar el talento del otro; no medir el amor solo con aplausos externos.`,
        },
      ],
      good: ['Citaciones que no sean solo “lo serio”', 'Elogios por creatividad y no solo por utilidad'],
      hard: ['Monopolizar la atención social', 'Mezclar romance con competencia'],
      summaryBody: `mezcla identidad con romance y creatividad: ${nf} enciende el juego; ${nt} lo vive en el deseo de brillar juntos.`,
    },
    6: {
      feel: [
        `👉 ${nf} entra al calendario y al cuerpo de ${nt}: horarios, tareas, salud, trabajo cotidiano — no al escenario público.`,
        `💫 Puede sentirse apoyo motivador para ordenar la vida… o sensación de que alguien “manda” en la rutina.`,
      ],
      sections: [
        {
          title: 'Orgullo en lo cotidiano',
          body: `En casa 6 el “escenario” del Sol es el día a día: ${nt} asocia a ${nf} con hábitos, cuidados, laburo diario y cómo se organiza la vida real.`,
        },
        {
          title: 'Sombra posible',
          body: `Micromanaging, críticas al cuerpo o al rendimiento, competencia por quién aguanta más o “hace más” por el otro.`,
        },
        {
          title: 'Regalo del overlay',
          body: `Dignidad en lo pequeño: compañía que mejora el descanso, la salud y la repartición justa de tareas.`,
        },
        {
          title: 'Aprendizaje',
          body: `Negociar estándares sin tono de superioridad; agradecer el cuidado mutuo; no convertir la salud ni la productividad en juicio moral.`,
        },
      ],
      good: ['Reparto explícito de tareas y descanso', 'Reconocer el cuidado como afecto, no como control'],
      hard: ['“Solo quiero lo mejor para vos” que suena a orden', 'Competir por el cansancio o el mérito'],
      summaryBody: `mezcla identidad con rutina y salud: ${nf} pone foco en el día a día; ${nt} lo siente en hábitos, servicio y cuerpo.`,
    },
    7: {
      feel: [
        `👉 ${nt} proyecta en ${nf} mucho de lo que busca en pareja: reconocimiento, espejo, acuerdos cara a cara.`,
        `💫 El vínculo uno a uno se siente central: poco neutral, mucho “definamos qué somos”.`,
      ],
      sections: [
        {
          title: 'Reconocimiento en el espejo',
          body: `En casa 7, ${nt} ve a ${nf} como figura de contrato afectivo visible: pareja, aliado cercano, “el otro” frente a frente.`,
        },
        {
          title: 'Sombra posible',
          body: `Competencia por tener la razón en la relación, idealización o devaluación según el día, sensación de examen.`,
        },
        {
          title: 'Regalo del overlay',
          body: `Honestidad adulta en acuerdos y orgullo compartido por construir un “nosotros” con nombre.`,
        },
        {
          title: 'Aprendizaje',
          body: `Turnarse la palabra en conflictos; separar proyección de datos; celebrar al otro sin perderse.`,
        },
      ],
      good: ['Acuerdos explícitos de necesidades', 'Elogios por cómo se negocia el vínculo'],
      hard: ['Llevar el ego de pareja a las redes o a la familia', 'Medir amor solo con entrega total'],
      summaryBody: `mezcla identidad con pareja: ${nf} pone foco en el contrato emocional; ${nt} lo vive en el espejo del otro.`,
    },
    8: {
      feel: [
        `👉 Temas de confianza profunda: plata compartida, intimidad, tabúes, crisis que no se ignoran.`,
        `💫 ${nt} puede sentirse más expuesto… o más vivo si hay coraje para la verdad.`,
      ],
      sections: [
        {
          title: 'Intensidad y confianza',
          body: `En casa 8, ${nf} ilumina lo que ${nt} no suele mostrar en la vitrina: fusiones, miedos, sexo, herencias emocionales.`,
        },
        {
          title: 'Sombra posible',
          body: `Poder encubierto, celos, secretos, o usar la vulnerabilidad como moneda de cambio.`,
        },
        {
          title: 'Regalo del overlay',
          body: `Transformación honesta: menos máscara, más vínculo que aguanta la oscuridad.`,
        },
        {
          title: 'Aprendizaje',
          body: `Límites claros en lo compartido; terapia o diálogo profundo; no “ganar” con el dolor del otro.`,
        },
      ],
      good: ['Conversaciones programadas sobre límites y plata', 'Nombrar miedos sin juicio'],
      hard: ['Pruebas de lealtad tóxicas', 'Fusionarse sin aire propio'],
      summaryBody: `mezcla identidad con intimidad profunda: ${nf} enciende temas tabú; ${nt} reacciona con todo o nada.`,
    },
    9: {
      feel: [
        `👉 Horizontes: creencias, viajes, estudios, sentido de “para dónde vamos”.`,
        `💫 ${nt} puede sentirse expandido… o cuestionado en sus certezas cuando ${nf} brilla ahí.`,
      ],
      sections: [
        {
          title: 'Sentido y futuro',
          body: `En casa 9, ${nt} asocia a ${nf} con la filosofía de vida, la fe (sea religiosa o secular) y los planes grandes.`,
        },
        {
          title: 'Sombra posible',
          body: `Predicar, convertir al otro, o competir por quién tiene la visión más noble.`,
        },
        {
          title: 'Regalo del overlay',
          body: `Inspiración compartida: aprender juntos, viajar con propósito, reírse de lo mismo.`,
        },
        {
          title: 'Aprendizaje',
          body: `Respetar dos mapas del mundo; acordar valores sin borrar al otro; viajar con flexibilidad.`,
        },
      ],
      good: ['Un proyecto de aprendizaje compartido', 'Debatir ideas sin atacar identidad'],
      hard: ['Moralizar el estilo de vida del otro', 'Usar la “verdad” como arma'],
      summaryBody: `mezcla identidad con sentido y horizonte: ${nf} abre la cabeza; ${nt} siente el impacto en sus creencias y planes.`,
    },
    10: {
      feel: [
        `👉 ${nt} suele asociar a ${nf} con reputación, oficio, metas visibles o “cómo lo ven afuera” — no solo con el romance privado.`,
        `💫 Aparece el tema del estatus: admiración e inspiración… o comparación si el ego compite por el podio.`,
      ],
      sections: [
        {
          title: 'Visibilidad y carrera',
          body: `El Sol busca reconocimiento. En casa 10, ${nt} vincula a ${nf} con imagen pública, responsabilidad social, trayectoria o autoridad percibida.`,
        },
        {
          title: 'Sombra posible',
          body: `Competencia por brillar, sensación de opacidad (“me eclipsa”), o usar la pareja como cartel de logros personales.`,
        },
        {
          title: 'Regalo del overlay',
          body: `Motivación para defender la propia vocación con orgullo y apoyarse mutuamente en etapas de exposición real.`,
        },
        {
          title: 'Aprendizaje',
          body: `Elogiar logros sin infantilizar; acordar qué se comparte en redes o en familia sobre la carrera de cada uno; dos protagonistas, dos caminos.`,
        },
      ],
      good: ['Elogios públicos sinceros cuando hay exposición real', 'Metas con roles claros (quién apoya a quién y cuándo)'],
      hard: ['Usar la relación como tarjeta de presentación', 'Comparar trayectorias o sueldos como prueba de valor'],
      summaryBody: `mezcla identidad con carrera e imagen: ${nf} ilumina el escenario visible de ${nt}; ${nt} siente el impacto en estatus y metas.`,
    },
    11: {
      feel: [
        `👉 Amigos, causas, redes: ${nf} aparece ligado al futuro colectivo que ${nt} imagina con otros.`,
        `💫 Puede sentirse más conectado al grupo… o celoso del tiempo social del otro.`,
      ],
      sections: [
        {
          title: 'Tribu y proyectos',
          body: `En casa 11, ${nt} asocia a ${nf} con amistades, ideal compartido y lugar en el colectivo.`,
        },
        {
          title: 'Sombra posible',
          body: `Polarización con el grupo, presión ideológica o sentirse segundo frente a la “causa”.`,
        },
        {
          title: 'Regalo del overlay',
          body: `Alianzas sanas: amigos en común que suman y sueños que no anulan la intimidad.`,
        },
        {
          title: 'Aprendizaje',
          body: `Acordar tiempo para pareja vs tribu; no usar al grupo para evitar el vínculo uno a uno.`,
        },
      ],
      good: ['Invitar al otro al mundo social sin obligar', 'Proyectos con amigos con límites claros'],
      hard: ['Hacer política de pareja en el grupo', 'Descuidar la intimidad por la tribu'],
      summaryBody: `mezcla identidad con amigos y futuro colectivo: ${nf} marca el lugar en la red; ${nt} ajusta lealtades.`,
    },
    12: {
      feel: [
        `👉 Lo privado, lo simbólico: sueños, cansancio, compasión o cosas que cuesta nombrar en voz alta.`,
        `💫 ${nt} puede sentirse comprendido en lo frágil… o invadido si no hay delicadeza.`,
      ],
      sections: [
        {
          title: 'Inconsciente y cierre',
          body: `En casa 12, ${nf} toca el retiro, la espiritualidad práctica o los finales de ciclo en la vida de ${nt}.`,
        },
        {
          title: 'Sombra posible',
          body: `Confusión, rescate sin pedido, o usar la “sensibilidad” para evitar acuerdos claros.`,
        },
        {
          title: 'Regalo del overlay',
          body: `Compasión madura y descanso compartido sin drama: menos performance, más presencia silenciosa.`,
        },
        {
          title: 'Aprendizaje',
          body: `Respetar el silencio del otro; diferenciar empatía de fusión; pedir ayuda profesional si el tema es pesado.`,
        },
      ],
      good: ['Rituales de descanso sin culpa', 'Espacio acordado para procesar en solitario'],
      hard: ['Salvador/a compulsivo', 'Evadir conflictos con “lo espiritual”'],
      summaryBody: `mezcla identidad con inconsciente y cierre: ${nf} ilumina lo difuso; ${nt} procesa en privado.`,
    },
  };

  const pack = m[house];
  if (!pack) {
    return {
      feel: [
        `👉 ${nt} puede admirar, compararse o sentirse iluminado/a por ${nf} en ${H.temaCorto}.`,
        `💫 Hay foco en cómo cada uno se muestra en esa área concreta de la vida.`,
      ],
      sections: [
        {
          title: 'Reconocimiento y orgullo',
          body: `El Sol busca ser visto con respeto. En casa ${house}, ${nt} asocia a ${nf} con algo visible de su vida (${H.temaCorto}).`,
        },
        {
          title: 'Sombra posible',
          body: `Si hay competencia, ${nt} puede sentirse eclipsado/a o criticado/a en lo que más le importa de esa área.`,
        },
        {
          title: 'Regalo del overlay',
          body: `Motivación, dirección y honestidad adulta si hay espacio para dos protagonistas.`,
        },
        {
          title: 'Aprendizaje',
          body: `Turnarse el protagonismo y separar “quién brilla hoy” de “quién vale más”.`,
        },
      ],
      good: ['Elogios específicos al esfuerzo del otro', 'Metas con roles claros'],
      hard: ['Monopolizar la narrativa', 'Mezclar ego con amor'],
      summaryBody: `mezcla identidad y ${H.temaCorto}: ${nf} aporta dirección; ${nt} siente el impacto ahí.`,
    };
  }
  return pack;
}

function deepSol(house, nf, nt, P, H) {
  const pack = solDeepByHouse(house, nf, nt, H);
  return {
    entoncesHighlight: `${nf} pone su identidad y brillo en el escenario de ${H.temaCorto} en la vida de ${nt}.`,
    feelTitle: '💫 ¿Cómo se suele sentir esto?',
    feelBullets: pack.feel,
    sections: pack.sections.map((s, i) => ({ n: i + 1, title: s.title, body: s.body })),
    learningTitle: '☀️ Para llevarlo a tierra',
    learningGood: pack.good,
    learningHard: pack.hard,
    summary: `"${P.label} de ${nf} en la Casa ${house} de ${nt}" ${pack.summaryBody}`,
  };
}

function deepLuna(house, nf, nt, P, H) {
  return {
    entoncesHighlight: `${nf} toca el sistema emocional de ${nt} justo en ${H.temaCorto}.`,
    feelTitle: '💫 ¿Cómo se suele sentir esto?',
    feelBullets: [
      `👉 ${nt} puede sentirse más sensible, más cuidado/a o más expuesto/a en ese tema cuando está ${nf}.`,
      `💫 El humor del día a día a menudo “engancha” con esta casa.`,
    ],
    sections: [
      {
        n: 1,
        title: 'Contención y pertenencia',
        body: `La Luna pide seguridad. En ${H.temaCorto}, ${nf} busca sentirse a salvo y que ${nt} responda con presencia, no solo con palabras.`,
      },
      {
        n: 2,
        title: 'Altibajos',
        body: `Si la casa es intensa (4, 7, 8, 12), los ciclos emocionales se notan más: nada de fingir que “todo bien” 24/7.`,
      },
      {
        n: 3,
        title: 'Regalo',
        body: `Empatía real, hogar emocional, complicidad en lo cotidiano cuando se respetan los tiempos de cada uno.`,
      },
      {
        n: 4,
        title: 'Aprendizaje',
        body: `Nombrar el estado emocional sin culpar, acordar señales de “necesito espacio” y no leer todo como rechazo.`,
      },
    ],
    learningTitle: '🌙 Para llevarlo a tierra',
    learningGood: ['Rutinas que contengan', 'Escucha sin arreglar todo al instante'],
    learningHard: ['Saturar con consejos cuando el otro solo quiere ser escuchado', 'Evitar temas por miedo al drama'],
    summary: `"${P.label} de ${nf} en la Casa ${house} de ${nt}" conecta emoción con ${H.temaCorto}: ${nf} pide contención; ${nt} siente el clima del vínculo ahí.`,
  };
}

function deepMercurio(house, nf, nt, P, H) {
  return {
    entoncesHighlight: `${nf} activa conversación, ideas y planes en ${H.temaCorto} de ${nt}.`,
    feelTitle: '💫 ¿Cómo se suele sentir esto?',
    feelBullets: [
      `👉 Mucho ida y vuelta mental; humor y chistes o debates.`,
      `💫 Si Mercurio se estresa, aparecen malentendidos justo en ${H.temaCorto}.`,
    ],
    sections: [
      {
        n: 1,
        title: 'Diálogo que abre',
        body: `Buen overlay para hablar de lo que otros callan: ${nf} nombra cosas; ${nt} procesa desde su experiencia de ${H.temaCorto}.`,
      },
      {
        n: 2,
        title: 'Riesgo',
        body: `Ironía mal leída, prisa al responder o “ganar” la discusión intelectual sin reparar el vínculo.`,
      },
      {
        n: 3,
        title: 'Aprendizaje',
        body: `Reformular (“lo que entendí fue…”), mensajes cortos en tensión, y humor solo cuando ambos están en el mismo clima.`,
      },
    ],
    learningTitle: '💬 Para llevarlo a tierra',
    learningGood: ['Check-ins de 10 minutos sin pantallas', 'Humor compartido'],
    learningHard: ['Corregir en público', 'Interpretar silencio como ataque'],
    summary: `"${P.label} de ${nf} en la Casa ${house} de ${nt}" pone la charla en el centro de ${H.temaCorto}: claridad o ruido, según la escucha mutua.`,
  };
}

function deepJupiter(house, nf, nt, P, H) {
  return {
    entoncesHighlight: `${nf} agranda la fe, el humor y las posibilidades en ${H.temaCorto} de ${nt}.`,
    feelTitle: '💫 ¿Cómo se suele sentir esto?',
    feelBullets: [
      `👉 Optimismo, ganas de más y planes grandes.`,
      `💫 Ojo con prometer de más o gastar energía en mil frentes.`,
    ],
    sections: [
      {
        n: 1,
        title: 'Expansión',
        body: `${nt} puede sentir que la vida en ${H.temaCorto} se vuelve más liviana o prometedora con ${nf}.`,
      },
      {
        n: 2,
        title: 'Exceso',
        body: `Júpiter también exagera: expectativas altas, gastos, viajes o idealización “ya somos almas gemelas”.`,
      },
      {
        n: 3,
        title: 'Aprendizaje',
        body: `Celebrar sin perder el piso: acordar prioridades y decir “sí” a lo que realmente entra en el calendario.`,
      },
    ],
    learningTitle: '✨ Para llevarlo a tierra',
    learningGood: ['Un proyecto grande compartido', 'Risas y ritual de gratitud'],
    learningHard: ['Evadir problemas con “total va a estar bien”', 'Competir por quién es más “positivo”'],
    summary: `"${P.label} de ${nf} en la Casa ${house} de ${nt}" trae amplitud a ${H.temaCorto}: fe, risas y crecimiento — con moderación.`,
  };
}

function deepSaturno(house, nf, nt, P, H) {
  return {
    entoncesHighlight: `${nf} trae seriedad, tiempo y pruebas de consistencia en ${H.temaCorto} de ${nt}.`,
    feelTitle: '💫 ¿Cómo se suele sentir esto?',
    feelBullets: [
      `👉 Menos magia instantánea, más “esto hay que construirlo”.`,
      `💫 Puede sentirse pesado al principio y sólido después.`,
    ],
    sections: [
      {
        n: 1,
        title: 'Compromiso real',
        body: `Saturno no promete cuento de hadas: promete lo que se sostiene con esfuerzo. En ${H.temaCorto}, ${nt} siente la responsabilidad compartida.`,
      },
      {
        n: 2,
        title: 'Miedo a fallar',
        body: `A veces aparece la sensación de examen, frialdad o distancia defensiva. Nombrarlo reduce la vergüenza.`,
      },
      {
        n: 3,
        title: 'Aprendizaje',
        body: `Plazos claros, límites respetados y reconocimiento explícito del esfuerzo mutuo.`,
      },
    ],
    learningTitle: '⏳ Para llevarlo a tierra',
    learningGood: ['Acuerdos escritos en lo importante', 'Paciencia con procesos lentos'],
    learningHard: ['Castigar con silencios largos', 'Confundir límites con desprecio'],
    summary: `"${P.label} de ${nf} en la Casa ${house} de ${nt}" madura ${H.temaCorto}: lo que dura, dura por trabajo — no por suerte.`,
  };
}

function deepOuter(planetKey, house, nf, nt, P, H) {
  const isU = planetKey === 'urano';
  const isN = planetKey === 'neptuno';
  const isP = planetKey === 'pluton';
  return {
    entoncesHighlight: `${nf} introduce un tono ${isU ? 'impredecible y libertario' : isN ? 'difuso e idealista' : 'intenso y transformador'} en ${H.temaCorto} de ${nt}.`,
    feelTitle: '💫 ¿Cómo se suele sentir esto?',
    feelBullets: [
      `👉 Poco convencional: la rutina de ${nt} en ${H.temaCorto} no queda igual.`,
      isU
        ? `💫 Atracción por lo original; riesgo de distanciamientos bruscos si se siente jaula.`
        : isN
          ? `💫 Magia y ternura; riesgo de malentendidos si no hay hechos claros.`
          : `💫 Profundidad extrema; riesgo de juegos de poder si no hay honestidad.`,
    ],
    sections: [
      {
        n: 1,
        title: 'Qué aporta',
        body: isU
          ? `Rompe esquemas y trae aire fresco en ${H.temaCorto}: menos predecible, más honesto/a consigo mismo/a.`
          : isN
            ? `Abre sensibilidad, inspiración y compasión en ${H.temaCorto}; también puede nublar límites.`
            : `Exige verdad, profundidad y cambio real en ${H.temaCorto}; lo superficial no se sostiene.`,
      },
      {
        n: 2,
        title: 'Cuidado',
        body: `${nt} conviene anclar expectativas: ${isN ? 'pedir claridad con amor' : 'acordar límites y tiempos'} para que la intensidad no destruya la confianza.`,
      },
    ],
    learningTitle: '🧭 Para llevarlo a tierra',
    learningGood: [isU ? 'Espacio para individualidad' : isN ? 'Chequeos de realidad suaves' : 'Terapia o diálogo profundo'],
    learningHard: [isU ? 'Sorpresas sin aviso' : isN ? 'Evadir con alcohol/romance' : 'Control encubierto'],
    summary: `"${P.label} de ${nf} en la Casa ${house} de ${nt}" marca ${H.temaCorto} con carga generacional/intensa: conviene madurez y honestidad.`,
  };
}
