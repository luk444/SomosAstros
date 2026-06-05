/**
 * Análisis de técnicas astrológicas avanzadas
 * Carta compuesta, Davison, revolución solar, nodos lunares, asteroides, retrógrados, etc.
 */

export function analyzeAdvancedTechniques(chartA, chartB) {
  const sections = [];

  // ============================================
  // 1. INFORMACIÓN SOBRE TÉCNICAS NO INCLUIDAS
  // ============================================
  sections.push({
    id: 'advanced-intro',
    title: '📊 Técnicas Astrológicas Avanzadas',
    subtitle: 'Información y recomendaciones para análisis más profundos',
    content: `
Este cálculo utiliza sinastría clásica (comparación de cartas natales).
Para un análisis astrológico completo y profesional, un astrólogo especializado suele incorporar:
    `.trim(),
  });

  // ============================================
  // 2. CARTA COMPUESTA
  // ============================================
  sections.push({
    id: 'composite-chart',
    title: '🔗 Carta Compuesta (Composite Chart)',
    description: 'Carta del "tercero" que representaría la relación misma',
    details: {
      definition: `
Se calcula promediando los puntos de ambas cartas (Sol, Luna, planetas, ángulos).
El resultado es una carta virtual que representa la energía conjunta de la pareja.
      `.trim(),
      whatItShows: [
        'El "carácter" de la relación como entidad propia',
        'Dinámicas que emergen solo cuando están juntos',
        'Desafíos y potenciales del vínculo (independientes de los individuos)',
        'Ciclos de evolución de la pareja',
      ],
      limitations: 'Requiere herramientas de cálculo específicas (AstroSeek, Co-Star, software profesional)',
      recommendation: 'Ideal para parejas de larga duración o matrimonios. Proporciona insights únicos.',
    },
  });

  // ============================================
  // 3. CARTA DAVISON
  // ============================================
  sections.push({
    id: 'davison-chart',
    title: '⏰ Carta Davison (Davison Relocation Chart)',
    description: 'Carta natal calculada en el punto medio espacio-temporal',
    details: {
      definition: `
Se calcula el punto geográfico exacto entre los lugares de nacimiento
y la hora exacta entre los dos nacimientos. Se genera una carta para ese "lugar y momento".
      `.trim(),
      whatItShows: [
        'La "astrología de la relación" más objetiva que la Composite',
        'Desafíos y recursos compartidos',
        'Potencial de desarrollo conjunto',
      ],
      limitations: 'Menos conocida pero poderosa. Requiere precisión en datos de nacimiento.',
      recommendation: 'Ofrece perspectiva diferente a la Composite. Ambas son complementarias.',
    },
  });

  // ============================================
  // 4. REVOLUCIÓN SOLAR
  // ============================================
  sections.push({
    id: 'solar-revolution',
    title: '☀️ Revolución Solar (Solar Return)',
    description: 'Carta del cumpleaños que rige el año siguiente',
    details: {
      definition: `
Se calcula cuando el Sol retorna a su posición natal (aproximadamente cada 365 días).
Refleja las energías del año próximo.
      `.trim(),
      whatItShows: [
        'Temas y energías predominantes en el próximo año',
        'Desafíos y oportunidades personales anuales',
        'Cómo afectará el ciclo a la relación (si ambos la calculan)',
      ],
      limitations: 'Debe calcularse anualmente. Interpretación requiere experiencia.',
      recommendation: 'Especialmente útil si ambos tienen Revolución Solar activa (eventos o cambios).',
    },
  });

  // ============================================
  // 5. PROGRESIONES
  // ============================================
  sections.push({
    id: 'progressions',
    title: '🌱 Progresiones Secundarias',
    description: 'Evolución personal en el tiempo ("un día = un año")',
    details: {
      definition: `
Se avanzan los planetas natales un día por cada año de vida.
Ejemplo: el progreso a los 30 años usa la carta de 30 días después del nacimiento.
      `.trim(),
      whatItShows: [
        'Ciclos psicológicos y emocionales internos',
        'Cambios en la Luna progresada (emocional, íntimo)',
        'Cambios en el Ascendente progresado (cómo nos perciben)',
        'Cuando alguien "madura" en ciertas áreas',
      ],
      limitations: 'Interpretación subjetiva. Requiere técnica depurada.',
      recommendation: 'Si alguien está en progresión importante, afecta la compatibilidad.',
    },
  });

  // ============================================
  // 6. NODOS LUNARES
  // ============================================
  sections.push({
    id: 'lunar-nodes',
    title: '🌙 Nodos Lunares (Karmic Axis)',
    description: 'Eje del destino evolutivo y patrones kármicos',
    details: {
      definition: `
Puntos donde la órbita lunar cruza la eclíptica. Norte (futuro) y Sur (pasado).
Nodo Sur: talentos ya dominados. Nodo Norte: dirección de crecimiento.
      `.trim(),
      whatItShows: [
        'Propósito de vida individual y kardia de cada persona',
        'Si los Nodos se conectan entre cartas → lección kármica mutua',
        'Nodo de uno sobre planeta del otro → intensidad y crecimiento',
      ],
      connections: {
        'Nodo Norte de A sobre Nodo Norte de B': 'Propósito de vida similar o complementario',
        'Nodo Norte de A sobre Venus/Marte de B': 'Relación con lección evolutiva integrada',
        'Sol de A sobre Nodo Norte de B': 'A ilumina el camino de B',
      },
      limitation: 'Interpretación profunda requiere entender karma y psicología transpersonal.',
      recommendation: 'Crucial para entender el *para qué* de la relación.',
    },
  });

  // ============================================
  // 7. ASTEROIDES
  // ============================================
  sections.push({
    id: 'asteroids',
    title: '💫 Asteroides y Puntos Sensibles',
    description: 'Energías arquetípicas que matiza la compatibilidad',
    details: {
      asteroidList: [
        {
          name: 'Quirón (Chiron)',
          meaning: 'La "herida sanadora". Donde duele pero también sanamos.',
          inSynastry: 'Quirón de A sobre planeta de B → A reconoce/sana la herida de B',
        },
        {
          name: 'Lilith (Black Moon)',
          meaning: 'Poder marginal, sexualidad sin censura, lo prohibido.',
          inSynastry: 'Lilith de A sobre Venus/Marte de B → Atracción magnética intensa (a veces tóxica)',
        },
        {
          name: 'Vértex',
          meaning: '"Destino". Punto de eventos fuertes e inesperados.',
          inSynastry: 'Planetas sobre Vertex del otro → Encuentros "fated", sin libertad consciente',
        },
        {
          name: 'Juno (Hera)',
          meaning: 'Compromiso, lealtad, matrimonio. La esposa cósmica.',
          inSynastry: 'Juno de A sobre Marte/Venus de B → Deseo de compromiso',
        },
        {
          name: 'Eros',
          meaning: 'Eros (sexualidad y deseo). No confundir con Cupido.',
          inSynastry: 'Aspectos tensos con Eros → Fascinación y confusión sexual',
        },
      ],
      howToExplore: 'Calcular en astro.com u otra plataforma. Buscar aspectos con planetas personales.',
      recommendation: 'Añade capas de comprensión a la sinastría clásica.',
    },
  });

  // ============================================
  // 8. PLANETAS RETRÓGRADOS
  // ============================================
  sections.push({
    id: 'retrogrades',
    title: '🔄 Planetas Retrógrados',
    description: 'Energía introspectiva, cuestionadora, a contracorriente',
    details: {
      definition: `
Un planeta "retrógrado" (Rx) parece moverse hacia atrás desde la Tierra.
No es un error: refleja energía que mira hacia adentro, revisa, cuestiona.
      `.trim(),
      whatItShows: [
        'Mercurio Rx (natal): comunicación introspectiva, psicoterapia con palabras',
        'Venus Rx (natal): relaciones complejas, amor poco convencional, karmic love',
        'Marte Rx (natal): rabia introspectiva, sexualidad con hesitación',
        'Saturno Rx (natal): límites internalizados, timidez cósmica',
      ],
      inSynastry: [
        'Si Mercurio de A está Rx y Mercurio de B no → A cuestiona, B directa',
        'Si Venus de ambos está Rx → Relación atípica, no convencional',
        'Retrógrados en ambas cartas sobre áreas similares → Lección común',
      ],
      recommendation: 'Buscar retrógrados en cartas natales. Afecta cómo se expresa cada energía.',
    },
  });

  // ============================================
  // 9. ESTRELLAS FIJAS
  // ============================================
  sections.push({
    id: 'fixed-stars',
    title: '⭐ Estrellas Fijas',
    description: 'Influencias "cósmicas" arcaicas y mitológicas',
    details: {
      definition: `
Estrellas brillantes con mitología antigua (Sirio, Betelgeuse, Regulus, etc.).
Su influencia es complementaria a la astrología planetaria moderna.
      `.trim(),
      whatItShows: [
        'Estrellas de poder: amplificación de temas',
        'Estrellas de advertencia: caution, peligro mitológico',
        'En sinastria: Luna sobre Sirio → Carisma, espiritualidad',
      ],
      limitation: 'Interpretación tradicional y menos científica. Requiere estudios específicos.',
      recommendation: 'Para investigación profunda con astrólogo especializado.',
    },
  });

  // ============================================
  // 10. ASPECTOS MENORES Y ÓRBITAS FINAS
  // ============================================
  sections.push({
    id: 'minor-aspects',
    title: '🎯 Aspectos Menores y Órbitas Finas',
    description: 'Matices sutiles que un astrólogo ajusta a mano',
    details: {
      aspectsList: [
        {
          name: 'Semisextil (30°)',
          meaning: 'Potencial sin presión, sutil, casi imperceptible',
        },
        {
          name: 'Quincuncio (150°)',
          meaning: 'Ajuste constante, incómodo, requiere adaptación continua',
        },
        {
          name: 'Septil (51.43°)',
          meaning: 'Fatum mágico, sincronicidad, destino tejido',
        },
        {
          name: 'Novil (40°)',
          meaning: 'Perfeccionamiento espiritual, refinamiento',
        },
        {
          name: 'Semi-cuadratura (45°)',
          meaning: 'Fricción menor pero constante',
        },
      ],
      orbsNotes: `
Los "orbes" (tolerancia angular) son subjetivos y varían por astrólogo.
Por ejemplo: semisextil puede tener orbe de 1° o 2°, pero algunos lo ignoran.
Un astrólogo experimentado "ajusta a mano" según el contexto.
      `.trim(),
      recommendation: 'Buscar estos aspectos si te interesa micro-sincronicidades.',
    },
  });

  // ============================================
  // 11. TRÁNSITOS Y CICLOS ACTUALES
  // ============================================
  sections.push({
    id: 'transits-cycles',
    title: '🌍 Tránsitos y Ciclos Actuales',
    description: 'Cómo los planetas actuales afectan ambas cartas',
    details: {
      definition: `
Los planetas se mueven constantemente. Un planeta actual transitando un punto natal
puede activar o desactivar energías.
      `.trim(),
      whatItShows: [
        'Tránsito de Saturno sobre Venus de uno → Tiempo de claridad en la relación',
        'Tránsito de Plutón sobre Marte → Transformación de deseos',
        'Retrogradaciones actuales → Revisión de temas relacionados',
      ],
      timing: 'Especialmente importante si buscan casarse, tener hijos, mudarse, cambios mayores.',
      recommendation: 'Consultar con astrólogo si hay tránsitos significativos en el presente.',
    },
  });

  // ============================================
  // 12. CARTAS DE BODA/EVENTO (Event Chart)
  // ============================================
  sections.push({
    id: 'event-chart',
    title: '📅 Carta de Boda y Eventos Clave',
    description: 'Astrología del "primer día" juntos',
    details: {
      definition: `
Se puede calcular la carta para el día, hora y lugar de la boda, primer encuentro,
o evento importante. Esa "carta del evento" reflejará energías de ese momento.
      `.trim(),
      whatItShows: [
        'Energías presentes en un momento clave',
        'Planetas en aspectos natales → Sincronicidad del timing',
        'Cartas de boda se "prgresan" como si fuera una carta natal',
      ],
      recommendation: 'Si están planeando matrimonio, consultar fecha astrológicamente favorable.',
    },
  });

  return sections;
}

/**
 * Generador de recomendaciones prácticas
 */
export function generateAdvancedRecommendations(chartA, chartB, result) {
  return {
    recommendations: [
      {
        priority: 'Alta',
        action: 'Calcular Carta Compuesta y Davison',
        why: 'Para entender el "tercero" (la relación como entidad propia)',
        platforms: ['AstroSeek.com', 'Cafe Astrology', 'Software profesional (Solar Fire, Sirius)'],
      },
      {
        priority: 'Alta',
        action: 'Revisar Nodos Lunares de ambos',
        why: 'Identificar lecciones kármicas y propósito compartido',
        where: 'Calcular en cualquier generador de cartas',
      },
      {
        priority: 'Media',
        action: 'Buscar Quirón y Lilith en sinastría',
        why: 'Añade profundidad a traumas y atracción magnética',
        platforms: ['astro.com (con opciones de asteroides)', 'Cafe Astrology'],
      },
      {
        priority: 'Media',
        action: 'Revisar Revolución Solar del próximo año',
        why: 'Para prever temas anuales que afectarán la relación',
        timing: 'Calculable días antes del cumpleaños',
      },
      {
        priority: 'Baja',
        action: 'Explorar progresiones secundarias',
        why: 'Entender ciclos psicológicos internos',
        complexity: 'Requiere interpretación experta',
      },
    ],
    nextSteps: [
      '📖 Profundizar en técnicas con un astrólogo profesional',
      '🔍 Comparar los diferentes métodos (Composite vs. Davison vs. Sinastría clásica)',
      '📅 Planear eventos importantes con tránsitos favorables',
      '🌙 Seguir ciclos de retrogradaciones conjuntas',
    ],
  };
}
