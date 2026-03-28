import { pickVariant } from './variantPick.js';

/** Cierre “matiz A/B/C” por overlay; Sol tiene texto específico por casa. */
const POOL_GENERAL = [
  'Matiz: este contacto suele intensificarse en etapas de cambio, mudanza o decisiones grandes; en calma cotidiana baja el voltaje.',
  'Matiz: terceros notan el tono antes que la pareja; conviene afinar acuerdos en privado sin performance social.',
  'Matiz: el humor compartido y los gestos pequeños suavizan lo que el mapa describe como intenso.',
  'Matiz: si aparece roce, suele ser invitación a negociar límites con respeto — no prueba de falta de amor.',
  'Matiz: conviene separar “me pasa con vos” de “soy así con todo el mundo”: el overlay acentúa, no inventa.',
  'Matiz: la lectura gana matices si sumás aspectos exactos y la situación vital real (estrés, trabajo, familia).',
  'Matiz: dos personas maduras leen el mismo aspecto con menos drama; el contexto siempre filtra el mapa.',
  'Matiz: este tipo de contacto a veces se siente “inevitable”: no es destino, es focalización atencional.',
  'Matiz: si uno de los dos necesita pausa, el overlay sigue existiendo pero deja de ser protagonista del día a día.',
  'Matiz: útil preguntarse qué versión de mí aparece cuando el otro está cerca en este tema de vida.',
  'Matiz: lo que el informe llama tensión a veces es energía útil para crecer — si hay escucha mutua.',
  'Matiz: anclá la interpretación en hechos: horarios, dinero, salud y palabras dichas, no solo en intuición.',
];

const SOL_BY_HOUSE = {
  1: [
    'Matiz Sol–casa 1: la relación “se ve” en cómo cada uno se para en el mundo; conviene turnar protagonismo sin puntuar.',
    'Matiz: el orgullo personal está en la mesa; el respeto al estilo del otro evita peleas de ego.',
    'Matiz: encuentros sociales muestran el contacto con claridad; el descanso en pareja lo equilibra.',
  ],
  2: [
    'Matiz Sol–casa 2: plata y valores entran al relato del amor; hablar sin vergüenza ordena la incomodidad.',
    'Matiz: regalos y gestos tangibles pueden ser idioma de cuidado o prueba de amor — aclarar cuál es cuál.',
    'Matiz: la dignidad de cada uno se toca con facilidad; evitar comparar “quién aporta más”.',
  ],
  3: [
    'Matiz Sol–casa 3: mensajes y comentarios pesan; acordar tono en público vs en privado.',
    'Matiz: curiosidad y chisme pueden unir o desgastar; reformular antes de corregir.',
    'Matiz: el entorno cercano (familia, vecinos) mete mano en el vínculo.',
  ],
  4: [
    'Matiz Sol–casa 4: hogar y familia son escenario del orgullo mutuo; límites con terceros ayudan.',
    'Matiz: la vulnerabilidad aparece en lo doméstico; proteger la intimidad evita heridas.',
    'Matiz: mudanzas o cambios de nido activan este overlay con fuerza.',
  ],
  5: [
    'Matiz Sol–casa 5: romance y juego mezclan ego y deseo; celebrar al otro sin competencia escénica.',
    'Matiz: creatividad compartida o hijos (tema lúdico) pueden ser foco del brillo mutuo.',
    'Matiz: celos leves suelen ser miedo a perder el aplauso; nombrarlo baja la carga.',
  ],
  6: [
    'Matiz Sol–casa 6: la rutina es donde se prueba el respeto; micromanaging disfraza de cuidado a veces.',
    'Matiz: salud y descanso entran al vínculo; castigar con productividad erosiona.',
    'Matiz: reparto justo de tareas evita competencia por el cansancio.',
  ],
  7: [
    'Matiz Sol–casa 7: el contrato emocional es visible; acuerdos explícitos reemplazan adivinanzas.',
    'Matiz: proyección sobre el otro es común; diferenciar “lo mío” de “lo suyo”.',
    'Matiz: la pareja como espejo puede inspirar o presionar según el tono.',
  ],
  8: [
    'Matiz Sol–casa 8: tabúes y confianza profunda; honestidad sin humillar es clave.',
    'Matiz: plata compartida o intimidad intensa activan el overlay.',
    'Matiz: transformación mutua posible si no se juega al poder encubierto.',
  ],
  9: [
    'Matiz Sol–casa 9: creencias y futuro entran al debate; respetar dos mapas del mundo.',
    'Matiz: viajes y estudios pueden sellar o tensionar según expectativas.',
    'Matiz: idealización filosófica conviene anclar en hechos cotidianos.',
  ],
  10: [
    'Matiz Sol–casa 10: carrera e imagen pública “absorben” energía de la pareja; acordar tiempo sin agenda.',
    'Matiz: competencia por logros puede herir si se confunde con valor personal.',
    'Matiz: elogios públicos sinceros fortalecen; comparar trayectorias en casa desgasta.',
  ],
  11: [
    'Matiz Sol–casa 11: tribu y amigos influyen; equilibrar vida social con intimidad.',
    'Matiz: causas compartidas unen; presión ideológica separa.',
    'Matiz: proyectos de futuro conviene priorizar sin prometer de más.',
  ],
  12: [
    'Matiz Sol–casa 12: lo invisible pesa — sueños, agotamiento, compasión; límites sanos evitan fusión total.',
    'Matiz: rescate compulsivo cansa; pedir ayuda profesional si el tema es pesado.',
    'Matiz: descanso y silencio compartido pueden ser vínculo tan válido como la fiesta.',
  ],
};

/**
 * @param {string} planetKey
 * @param {number} house
 * @param {string} seed
 */
export function getVariantEcho(planetKey, house, seed) {
  const s = `${planetKey}|${house}|${seed}`;
  if (planetKey === 'sol' && SOL_BY_HOUSE[house]) {
    return pickVariant(SOL_BY_HOUSE[house], s);
  }
  return pickVariant(POOL_GENERAL, s);
}
