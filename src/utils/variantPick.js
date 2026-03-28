/**
 * Variantes A/B/C determinísticas: misma entrada → mismo texto siempre.
 * @param {string} seed
 * @param {number} [count=3]
 * @returns {number} 0 .. count-1
 */
export function variantIndex(seed, count = 3) {
  if (!seed) return 0;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0) % count;
}

/**
 * @template T
 * @param {T[]} variants
 * @param {string} seed
 * @returns {T}
 */
export function pickVariant(variants, seed) {
  if (!variants?.length) return undefined;
  return variants[variantIndex(seed, variants.length)];
}

/**
 * Acepta string o array de variantes.
 * @param {string|string[]|undefined} entry
 * @param {string} seed
 * @returns {string}
 */
export function resolveTextVariant(entry, seed) {
  if (entry == null) return '';
  if (Array.isArray(entry)) return pickVariant(entry, seed) ?? '';
  return entry;
}
