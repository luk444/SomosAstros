import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerSrc;

/**
 * Extrae texto plano de un PDF (solo capas de texto; PDF escaneado = vacío).
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function extractTextFromPdfFile(file) {
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocument({ data }).promise;
  const parts = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const line = content.items.map((it) => ('str' in it ? it.str : '')).join(' ');
    parts.push(line);
  }
  return parts.join('\n\n').replace(/\r\n/g, '\n').trim();
}
