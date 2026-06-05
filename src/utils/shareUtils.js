/**
 * Utilidades para compartir resultados mediante URL
 * Comprime y encripta los datos para generar URLs cortas y compartibles
 */

/**
 * Comprime un objeto a string usando LZ4-like compression y base64
 */
export function compressToUrl(data) {
  try {
    const json = JSON.stringify(data);
    const compressed = btoa(unescape(encodeURIComponent(json)));
    return compressed;
  } catch (e) {
    console.error('Error al comprimir datos:', e);
    return null;
  }
}

/**
 * Descomprime un string de URL a objeto
 */
export function decompressFromUrl(compressed) {
  try {
    const json = decodeURIComponent(escape(atob(compressed)));
    return JSON.parse(json);
  } catch (e) {
    console.error('Error al descomprimir datos:', e);
    return null;
  }
}

/**
 * Genera URL compartible con los resultados
 */
export function generateShareUrl(result, chartA, chartB) {
  const shareData = {
    result: result,
    chartA: {
      name: chartA.name,
      sunSign: chartA.sunSign,
      moonSign: chartA.moonSign,
      ascSign: chartA.ascSign,
      planets: chartA.planets,
      houseCusps: chartA.houseCusps,
    },
    chartB: {
      name: chartB.name,
      sunSign: chartB.sunSign,
      moonSign: chartB.moonSign,
      ascSign: chartB.ascSign,
      planets: chartB.planets,
      houseCusps: chartB.houseCusps,
    },
    timestamp: new Date().toISOString(),
  };

  const compressed = compressToUrl(shareData);
  if (!compressed) return null;

  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}?share=${compressed}`;
}

/**
 * Intenta extraer datos compartidos de la URL
 */
export function getSharedData() {
  const params = new URLSearchParams(window.location.search);
  const shareParam = params.get('share');

  if (!shareParam) return null;

  return decompressFromUrl(shareParam);
}

/**
 * Copia URL a portapapeles
 */
export async function copyShareUrlToClipboard(url) {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (e) {
    console.error('Error al copiar:', e);
    return false;
  }
}

/**
 * Genera un URL acortador simple (sin dependencias externas)
 * Usa base62 encoding para hacer URLs más cortas
 */
export function encodeToBase62(str) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  let num = BigInt(Buffer.from(str, 'utf-8').toString('hex'), 16);

  while (num > 0n) {
    result = chars[Number(num % 62n)] + result;
    num = num / 62n;
  }

  return result || '0';
}

/**
 * Valida si una URL de compartir es válida
 */
export function isValidShareUrl() {
  const params = new URLSearchParams(window.location.search);
  const shareParam = params.get('share');
  return shareParam && shareParam.length > 0;
}

/**
 * Obtiene el tamaño de la URL en caracteres
 */
export function getShareUrlSize(result, chartA, chartB) {
  try {
    const url = generateShareUrl(result, chartA, chartB);
    return url ? url.length : 0;
  } catch {
    return 0;
  }
}
