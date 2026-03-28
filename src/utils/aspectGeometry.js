/** Geometría angular compartida (evita dependencias circulares con compatibility/overlays). */

export function angleDiff(lon1, lon2) {
  if (lon1 == null || lon2 == null) return null;
  let d = Math.abs(lon1 - lon2) % 360;
  if (d > 180) d = 360 - d;
  return d;
}

export function classifyAspect(d) {
  if (d == null) return null;
  const checks = [
    { type: 'harmonic', name: 'Conjunción', angle: 0, orb: 8, weight: 0 },
    { type: 'harmonic', name: 'Sextil', angle: 60, orb: 6, weight: 1 },
    { type: 'tension', name: 'Cuadratura', angle: 90, orb: 8, weight: -1 },
    { type: 'harmonic', name: 'Trigono', angle: 120, orb: 8, weight: 2 },
    { type: 'tension', name: 'Oposición', angle: 180, orb: 8, weight: -1 },
  ];
  for (const c of checks) {
    if (Math.abs(d - c.angle) <= c.orb) {
      return { ...c, separation: Math.round(d * 10) / 10 };
    }
  }
  return {
    type: 'neutral',
    name: null,
    separation: Math.round(d * 10) / 10,
    weight: 0,
  };
}
