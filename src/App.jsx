import { Fragment, useMemo, useState } from 'react';
import { parseChartText } from './utils/parseChart';
import { analyzeCompatibility } from './utils/compatibility';
import { analyzeAdvancedTechniques, generateAdvancedRecommendations } from './utils/advancedTechniques';
import { generatePlainText, generateJSON, downloadFile } from './utils/exportUtils';
import './App.css';

/** Convierte **texto** en <strong> para párrafos generados en overlayDeep. */
function boldInline(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*(.+)\*\*$/);
    if (m) return <strong key={i}>{m[1]}</strong>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function OverlayMarkdownParagraphs({ text, className }) {
  if (!text) return null;
  return text.split(/\n\n+/).map((para, i) => (
    <p key={i} className={className}>
      {boldInline(para)}
    </p>
  ));
}

function OverlayRow({ r }) {
  const d = r.deep;
  return (
    <li className="overlay-item">
      <p className="overlay-headline">{r.headline}</p>
      <p className="overlay-sub">{r.houseTitle}</p>
      <p className="overlay-detail">{r.detail}</p>
      {d && (
        <details className="overlay-deep">
          <summary className="overlay-deep-summary">Lectura ampliada (qué representa cada cosa + dinámica)</summary>
          <div className="overlay-deep-body">
            <p className="overlay-deep-hero">{d.title}</p>
            <h4 className="overlay-deep-h">{d.introTitle}</h4>
            <div className="overlay-deep-def">
              <p className="overlay-deep-line">
                <span className="overlay-deep-k">{d.planetLine.split(' → ')[0]}</span>
                <span className="overlay-deep-arrow"> → </span>
                <span>{d.planetLine.split(' → ').slice(1).join(' → ')}</span>
              </p>
              <p className="overlay-deep-line">
                <span className="overlay-deep-k">{d.houseLine.split(' → ')[0]}</span>
                <span className="overlay-deep-arrow"> → </span>
                <span>{d.houseLine.split(' → ').slice(1).join(' → ')}</span>
              </p>
            </div>
            <h4 className="overlay-deep-h">{d.entoncesTitle}</h4>
            <p className="overlay-deep-highlight">👉 {d.entoncesHighlight}</p>
            {d.feelTitle && (
              <>
                <h4 className="overlay-deep-h">{d.feelTitle}</h4>
                <ul className="overlay-deep-bullets">
                  {d.feelBullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </>
            )}
            {d.sections?.map((sec) => (
              <div key={sec.n} className="overlay-deep-section">
                <h5 className="overlay-deep-section-title">
                  <span className="overlay-deep-section-num">{sec.n}</span>
                  {sec.title}
                </h5>
                <p className="overlay-deep-section-body">{sec.body}</p>
              </div>
            ))}
            {d.learningTitle && (
              <>
                <h4 className="overlay-deep-h">{d.learningTitle}</h4>
                <p className="overlay-deep-learn-intro">Cuando se usa bien, suele ayudar:</p>
                <ul className="overlay-deep-bullets overlay-deep-good">
                  {d.learningGood.map((x, i) => (
                    <li key={i}>✅ {x}</li>
                  ))}
                </ul>
                <p className="overlay-deep-learn-intro">Cuando se desregula:</p>
                <ul className="overlay-deep-bullets overlay-deep-hard">
                  {d.learningHard.map((x, i) => (
                    <li key={i}>⚠️ {x}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="overlay-deep-resumen">
              <h4 className="overlay-deep-h">🧠 Resumen corto</h4>
              <p className="overlay-deep-resumen-text">{d.summary}</p>
            </div>
            {d.pursuitDynamic && (
              <div className="overlay-deep-pursuit">
                <OverlayMarkdownParagraphs text={d.pursuitDynamic} className="overlay-deep-para" />
              </div>
            )}
            {d.angleBridge && (
              <div className="overlay-deep-angle">
                <h4 className="overlay-deep-h">📐 Cruce con ángulos del otro</h4>
                <OverlayMarkdownParagraphs text={d.angleBridge} className="overlay-deep-para" />
              </div>
            )}
            {d.variantEcho && <p className="overlay-deep-variant-echo">{d.variantEcho}</p>}
          </div>
        </details>
      )}
    </li>
  );
}

const SAMPLE_PLACEHOLDER =
  'Pega aquí el texto completo de la carta (LosArcanos u otro). Se detectan Signo Solar, Lunar, Ascendente y líneas tipo: Q Sol 28°55\' Cancer 1 o … Pluton 10°23\' Sagitario 5';

export default function App() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [copied, setCopied] = useState(false);
  const [pdfBusyA, setPdfBusyA] = useState(false);
  const [pdfBusyB, setPdfBusyB] = useState(false);
  const [pdfErrA, setPdfErrA] = useState('');
  const [pdfErrB, setPdfErrB] = useState('');

  const result = useMemo(() => {
    const a = textA.trim();
    const b = textB.trim();
    if (a.length < 80 || b.length < 80) return null;
    const chartA = parseChartText(a);
    const chartB = parseChartText(b);
    return analyzeCompatibility(chartA, chartB);
  }, [textA, textB]);

  const chartA = useMemo(() => (textA.trim().length >= 80 ? parseChartText(textA) : null), [textA]);
  const chartB = useMemo(() => (textB.trim().length >= 80 ? parseChartText(textB) : null), [textB]);

  const canAnalyze = textA.trim().length >= 80 && textB.trim().length >= 80;

  const advancedSections = useMemo(() => {
    if (!result || !chartA || !chartB) return null;
    return analyzeAdvancedTechniques(chartA, chartB);
  }, [result, chartA, chartB]);

  const advancedRecommendations = useMemo(() => {
    if (!result || !chartA || !chartB) return null;
    return generateAdvancedRecommendations(chartA, chartB, result);
  }, [result, chartA, chartB]);

  async function copyPrompt() {
    if (!result?.promptForAI) return;
    try {
      await navigator.clipboard.writeText(result.promptForAI);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function downloadResultsTxt() {
    if (!result || !chartA || !chartB) return;
    const content = generatePlainText(result, chartA, chartB);
    const filename = `compatibilidad-astral-${chartA.name}-${chartB.name}-${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(content, filename, 'text/plain');
  }

  function downloadResultsJson() {
    if (!result || !chartA || !chartB) return;
    const content = generateJSON(result, chartA, chartB);
    const filename = `compatibilidad-astral-${chartA.name}-${chartB.name}-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(content, filename, 'application/json');
  }

  async function handlePdf(which, e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || file.type !== 'application/pdf') {
      if (which === 'A') setPdfErrA('Elegí un archivo PDF.');
      else setPdfErrB('Elegí un archivo PDF.');
      return;
    }
    if (which === 'A') {
      setPdfErrA('');
      setPdfBusyA(true);
    } else {
      setPdfErrB('');
      setPdfBusyB(true);
    }
    try {
      const { extractTextFromPdfFile } = await import('./utils/pdfExtract.js');
      const extracted = await extractTextFromPdfFile(file);
      if (!extracted?.trim()) {
        throw new Error('empty');
      }
      const setter = which === 'A' ? setTextA : setTextB;
      setter((prev) => (prev.trim() ? `${prev.trim()}\n\n${extracted}` : extracted));
    } catch {
      if (which === 'A') {
        setPdfErrA(
          'No se pudo extraer texto del PDF (a veces son imágenes escaneadas). Descargá el informe en texto o copiá el contenido desde el visor.'
        );
      } else {
        setPdfErrB(
          'No se pudo extraer texto del PDF (a veces son imágenes escaneadas). Descargá el informe en texto o copiá el contenido desde el visor.'
        );
      }
    } finally {
      if (which === 'A') setPdfBusyA(false);
      else setPdfBusyB(false);
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Sinopsis entre cartas</p>
        <h1>SomosAstros</h1>
        <p className="lede">
          Pegá dos informes completos (LosArcanos u otro con planetas y tablas Placidus). Obtenés
          aspectos entre cartas, overlays (planetas de uno en las casas del otro), puntuaciones por
          ámbitos (emoción, química, charla, etc.) y escenarios tipo "¿cómo seríamos si…?". Es
          entretenimiento y educación astrológica, no adivinación.
        </p>
      </header>

      <details className="guide-box">
        <summary>Cómo leer este informe (y por qué un % "bajo" no es un fracaso)</summary>
        <ul className="guide-list">
          <li>
            <strong>Índice sintético:</strong> mezcla elementos del Sol/Luna de ambos y una lista
            fija de aspectos entre planetas. Es un resumen mecánico, no una nota de examen del amor.
          </li>
          <li>
            <strong>Oposiciones y cuadraturas</strong> entre Venus y Marte suelen asociarse a{' '}
            <em>química y polaridad</em>, no solo a "problemas". Leé la narrativa de cada fila.
          </li>
          <li>
            <strong>"Sin aspecto mayor"</strong> significa que la separación angular no entra en las
            órbitas programadas (conjunción, sextil, cuadratura, trígono, oposición). No implica que
            no haya vínculo: faltan casas, nodos, progresiones, etc.
          </li>
          <li>
            El texto largo del PDF habla de <strong>cada carta por separado</strong>; la compatibilidad
            es <strong>cómo se cruzan</strong> dos mapas. Esta app solo automatiza una parte de ese
            cruce.
          </li>
          <li>
            <strong>Overlays (casas):</strong> "Sol de A en casa 7 de B" = la posición del Sol de A,
            medida con las <em>casas del mapa de B</em> (cúspides del pegado). Así se ve en qué área de
            la vida del otro "aterrizás" con cada planeta.
          </li>
        </ul>
      </details>

      <details className="guide-box guide-steps">
        <summary>Cómo obtener tu carta (LosArcanos u otro sitio) y pegarla acá</summary>
        <ol className="steps-list">
          <li>
            <strong>Generá la carta natal</strong> con fecha, hora y lugar de nacimiento. En{' '}
            <a
              href="https://www.losarcanos.com/carta-astral-2.php"
              target="_blank"
              rel="noopener noreferrer"
              className="steps-link"
            >
              Los Arcanos — Carta natal
            </a>{' '}
            completás el formulario (día, mes, año, hora, minutos, país y ciudad) y calculás el informe. Si no tenés hora
            exacta, el Ascendente y las casas pueden fallar: igual podés ver planetas en signo. Otros sitios sirven si el
            texto del informe trae el mismo tipo de datos.
          </li>
          <li>
            <strong>Descargá o abrí el informe completo.</strong> Buscá la versión que incluya listado de planetas con grados y
            signo (líneas tipo <code>Sol 12°34&apos; Leo</code>) y, si querés overlays, el bloque de{' '}
            <strong>casas Placidus</strong> o tablas de cúspides.
          </li>
          <li>
            <strong>Copiá el texto:</strong> en PDF, seleccioná todo el informe (o desde "ver en HTML" si el sitio lo ofrece) y
            copiá. Si el PDF no deja seleccionar, puede ser imagen: usá la opción de subir PDF abajo o pedí exportar a texto.
          </li>
          <li>
            <strong>Pegá en Persona A o B</strong> y repetí con la otra carta. Necesitamos suficiente texto para leer
            posiciones; si falta la tabla de casas, los overlays marcarán "sin casas completas".
          </li>
        </ol>
      </details>

      <div className="grid-inputs">
        <div className="field">
          <label className="field-label" htmlFor="chart-text-a">
            Persona A
          </label>
          <div className="pdf-row">
            <span className="pdf-label">Opcional: cargar PDF (se añade al cuadro de texto)</span>
            <input
              type="file"
              accept="application/pdf"
              className="pdf-input"
              disabled={pdfBusyA}
              onChange={(e) => handlePdf('A', e)}
            />
            {pdfBusyA && <span className="pdf-status">Leyendo PDF…</span>}
            {pdfErrA && <span className="pdf-error">{pdfErrA}</span>}
          </div>
          <textarea
            id="chart-text-a"
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder={SAMPLE_PLACEHOLDER}
            spellCheck={false}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="chart-text-b">
            Persona B
          </label>
          <div className="pdf-row">
            <span className="pdf-label">Opcional: cargar PDF (se añade al cuadro de texto)</span>
            <input
              type="file"
              accept="application/pdf"
              className="pdf-input"
              disabled={pdfBusyB}
              onChange={(e) => handlePdf('B', e)}
            />
            {pdfBusyB && <span className="pdf-status">Leyendo PDF…</span>}
            {pdfErrB && <span className="pdf-error">{pdfErrB}</span>}
          </div>
          <textarea
            id="chart-text-b"
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder={SAMPLE_PLACEHOLDER}
            spellCheck={false}
          />
        </div>
      </div>

      {!canAnalyze && (
        <p className="hint">
          Necesitamos suficiente texto en ambos cuadros (al menos unas líneas con planetas y signos).
        </p>
      )}

      {chartA && (
        <section className="parsed-preview">
          <h2>Detectado — Persona A</h2>
          <p>
            <strong>{chartA.name}</strong> · Sol {chartA.sunSign || '—'} · Luna {chartA.moonSign || '—'} · Asc{' '}
            {chartA.ascSign || '—'}
            {chartA.houseCusps ? (
              <span className="badge-inline">12 casas leídas</span>
            ) : (
              <span className="badge-inline warn">Sin tablas de casas completas</span>
            )}
          </p>
        </section>
      )}
      {chartB && (
        <section className="parsed-preview">
          <h2>Detectado — Persona B</h2>
          <p>
            <strong>{chartB.name}</strong> · Sol {chartB.sunSign || '—'} · Luna {chartB.moonSign || '—'} · Asc{' '}
            {chartB.ascSign || '—'}
            {chartB.houseCusps ? (
              <span className="badge-inline">12 casas leídas</span>
            ) : (
              <span className="badge-inline warn">Sin tablas de casas completas</span>
            )}
          </p>
        </section>
      )}

      {result && (
        <div className="results">
          {result.warnings.length > 0 && (
            <div className="warnings">
              {result.warnings.map((w) => (
                <p key={w}>{w}</p>
              ))}
            </div>
          )}

          <section className="download-actions">
            <h2>📥 Descargar Resultados</h2>
            <div className="download-buttons">
              <button type="button" className="btn-download btn-download-txt" onClick={downloadResultsTxt}>
                ⬇️ Descargar como TXT
              </button>
              <button type="button" className="btn-download btn-download-json" onClick={downloadResultsJson}>
                ⬇️ Descargar como JSON
              </button>
            </div>
          </section>

          <section className="score-card">
            <div className="score-ring" style={{ '--p': result.scorePercent }}>
              <span className="score-value">{result.scorePercent}%</span>
              <span className="score-caption">índice sintético</span>
            </div>
            <div>
              <h2>Resumen</h2>
              {result.summaryLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p className="verdict">{result.verdict}</p>
              <ul className="score-explainer">
                {result.scoreExplainer.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </section>

          {result.highlights?.length > 0 && (
            <section className="highlights">
              <h2>Lectura rápida</h2>
              <ul className="notes">
                {result.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="dimensions-section">
            <h2>Compatibilidad por ámbitos</h2>
            <p className="subtle">
              Porcentajes orientativos (22–96) según aspectos entre cartas y planetas en casas del
              otro. Son atajos narrativos para compartir o publicar, no veredictos absolutos.
            </p>
            <div className="dimension-grid">
              {result.dimensions.map((d) => (
                <article key={d.id} className="dimension-card">
                  <div className="dimension-top">
                    <span className="dimension-emoji" aria-hidden>
                      {d.emoji}
                    </span>
                    <span className="dimension-pct">{d.percent}%</span>
                  </div>
                  <h3 className="dimension-label">{d.label}</h3>
                  <p className="dimension-blurb">{d.blurb}</p>
                  <div className="dimension-bar" style={{ '--w': d.percent }} />
                </article>
              ))}
            </div>
          </section>

          <section className="overlays-section">
            <h2>Planetas de uno en las casas del otro (overlays)</h2>
            <p className="subtle">
              Usamos las cúspides Placidus del informe pegado. Indica en qué "habitación" del mapa del
              otro se percibe cada planeta tuyo cuando están en vínculo.
            </p>
            <div className="overlay-grid">
              <div className="overlay-column">
                <h3 className="overlay-heading">
                  {result.overlayAB.fromName} en el mapa de {result.overlayAB.toName}
                </h3>
                {result.overlayAB.missing ? (
                  <p className="overlay-missing">
                    No se leyeron las 12 casas en el texto de {result.overlayAB.toName}. Incluí el
                    bloque "Tablas de Casas (Placidus)" completo.
                  </p>
                ) : (
                  <ul className="overlay-list">
                    {result.overlayAB.rows.map((r) => (
                      <OverlayRow key={r.key} r={r} />
                    ))}
                  </ul>
                )}
              </div>
              <div className="overlay-column">
                <h3 className="overlay-heading">
                  {result.overlayBA.fromName} en el mapa de {result.overlayBA.toName}
                </h3>
                {result.overlayBA.missing ? (
                  <p className="overlay-missing">
                    No se leyeron las 12 casas en el texto de {result.overlayBA.toName}. Incluí el
                    bloque "Tablas de Casas (Placidus)" completo.
                  </p>
                ) : (
                  <ul className="overlay-list">
                    {result.overlayBA.rows.map((r) => (
                      <OverlayRow key={r.key} r={r} />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          <section className="scenarios-section">
            <h2>Cómo serían en distintas circunstancias</h2>
            <p className="subtle">
              Mini-escenas para redes o charlas en pareja: mezclan elementos, aspectos y overlays de
              forma heurística.
            </p>
            <div className="scenario-grid">
              {result.scenarios.map((s) => (
                <article key={s.id} className="scenario-card">
                  <h3 className="scenario-title">{s.title}</h3>
                  <p className="scenario-hook">{s.hook}</p>
                  <p className="scenario-text">{s.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2>Elementos (Sol y Luna)</h2>
            <ul className="notes">
              {result.elementNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>

          {result.modalityNotes.length > 0 && (
            <section>
              <h2>Modalidad (ritmo de acción)</h2>
              <p className="subtle">
                Cardinal / fijo / mutable describe cómo cada uno suele arrancar, sostener o adaptar
                cambios — no es "bueno" ni "malo", es estilo.
              </p>
              <ul className="notes">
                {result.modalityNotes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2>Aspectos entre cartas</h2>
            <p className="subtle">
              Longitudes sacadas del pegado (formato LosArcanos). Órbitas aproximadas. Cada fila
              incluye una lectura educativa automática.
            </p>
            <ul className="aspect-list">
              {result.aspects.map((row) => (
                <li key={row.label} className={`aspect-item aspect-${row.type}`}>
                  <div className="aspect-head">
                    <strong>{row.label}</strong>
                    <span className="badge">{row.aspect}</span>
                  </div>
                  <p className="hint-inline">{row.hint}</p>
                  {row.separation != null && <p className="sep">Separación angular: {row.separation}°</p>}
                  {row.narrative && <p className="narrative">{row.narrative}</p>}
                </li>
              ))}
            </ul>
          </section>

          {result.ascCross.length > 0 && (
            <section>
              <h2>Planetas personales y ángulos del otro (Asc / Medio Cielo)</h2>
              <p className="subtle">
                Incluye cruces clásicos Sol–Asc y Luna–Asc (con lectura ampliada) y, si hay MC en el texto, Sol, Luna,
                Mercurio, Venus y Marte respecto al Asc y al MC de cada mapa. Tres matices posibles por contacto (A/B/C
                según la pareja y el aspecto).
              </p>
              <ul className="asc-list">
                {result.ascCross.map((x, i) => (
                  <li key={`${x.title}-${i}`} className={`aspect-item aspect-${x.type}`}>
                    <div className="aspect-head">
                      <strong>{x.title}</strong>
                      <span className="badge">{x.aspect}</span>
                    </div>
                    {x.separation != null && <p className="sep">Separación: {x.separation}°</p>}
                    <p className="narrative">{x.narrative || x.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2>Posiciones leídas del texto</h2>
            <div className="table-wrap">
              <table className="planet-table">
                <thead>
                  <tr>
                    <th>Planeta</th>
                    <th>Persona A</th>
                    <th>Persona B</th>
                  </tr>
                </thead>
                <tbody>
                  {result.planetTable.map((row) => (
                    <tr key={row.key}>
                      <td>{row.label}</td>
                      <td>{row.a}</td>
                      <td>{row.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {advancedSections && (
            <section className="advanced-techniques-section">
              <h2>📊 Técnicas Astrológicas Avanzadas (Profundización)</h2>
              <p className="subtle">
                Para un análisis más completo, astrólogos profesionales utilizan estas técnicas adicionales.
              </p>

              <div className="advanced-grid">
                {advancedSections.map((sec) => (
                  <details key={sec.id} className="advanced-item">
                    <summary className="advanced-summary">
                      <span className="advanced-title">{sec.title}</span>
                      {sec.description && <span className="advanced-desc">{sec.description}</span>}
                    </summary>
                    <div className="advanced-body">
                      {sec.content && <p className="advanced-content">{sec.content}</p>}

                      {sec.details?.definition && (
                        <div className="advanced-subsection">
                          <h4>¿Qué es?</h4>
                          <p>{sec.details.definition}</p>
                        </div>
                      )}

                      {sec.details?.whatItShows && (
                        <div className="advanced-subsection">
                          <h4>Qué muestra</h4>
                          <ul className="advanced-list">
                            {sec.details.whatItShows.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.details?.connections && (
                        <div className="advanced-subsection">
                          <h4>Conexiones en sinastría</h4>
                          <ul className="advanced-list">
                            {Object.entries(sec.details.connections).map(([key, val]) => (
                              <li key={key}>
                                <strong>{key}:</strong> {val}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.details?.asteroidList && (
                        <div className="advanced-subsection">
                          <ul className="asteroid-list">
                            {sec.details.asteroidList.map((ast, i) => (
                              <li key={i} className="asteroid-item">
                                <strong>{ast.name}:</strong> {ast.meaning}
                                {ast.inSynastry && <p className="asteroid-synastry">{ast.inSynastry}</p>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.details?.aspectsList && (
                        <div className="advanced-subsection">
                          <ul className="aspect-minor-list">
                            {sec.details.aspectsList.map((asp, i) => (
                              <li key={i}>
                                <strong>{asp.name}:</strong> {asp.meaning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.details?.inSynastry && (
                        <div className="advanced-subsection">
                          <h4>En sinastría</h4>
                          <ul className="advanced-list">
                            {sec.details.inSynastry.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.details?.recommendation && (
                        <div className="advanced-note">
                          <strong>💡 Recomendación:</strong> {sec.details.recommendation}
                        </div>
                      )}

                      {sec.details?.limitation && (
                        <div className="advanced-note advanced-warning">
                          <strong>⚠️ Limitación:</strong> {sec.details.limitation}
                        </div>
                      )}

                      {sec.details?.limitations && (
                        <div className="advanced-note advanced-warning">
                          <strong>⚠️ Limitación:</strong> {sec.details.limitations}
                        </div>
                      )}

                      {sec.details?.howToExplore && (
                        <div className="advanced-note">
                          <strong>🔍 Cómo explorar:</strong> {sec.details.howToExplore}
                        </div>
                      )}

                      {sec.details?.platforms && (
                        <div className="advanced-note">
                          <strong>🌐 Plataformas:</strong> {sec.details.platforms.join(', ')}
                        </div>
                      )}

                      {sec.details?.orbsNotes && (
                        <div className="advanced-note">
                          <strong>📐 Nota sobre órbitas:</strong> {sec.details.orbsNotes}
                        </div>
                      )}
                    </div>
                  </details>
                ))}
              </div>

              {advancedRecommendations && (
                <section className="advanced-recommendations">
                  <h3>🎯 Próximos Pasos Recomendados</h3>
                  <div className="recommendations-grid">
                    {advancedRecommendations.recommendations.map((rec, i) => (
                      <div key={i} className="recommendation-card">
                        <div className="rec-priority">{rec.priority}</div>
                        <h4>{rec.action}</h4>
                        <p className="rec-why">{rec.why}</p>
                        {rec.where && <p className="rec-meta"><strong>Dónde:</strong> {rec.where}</p>}
                        {rec.platforms && <p className="rec-meta"><strong>Plataformas:</strong> {rec.platforms.join(', ')}</p>}
                        {rec.timing && <p className="rec-meta"><strong>Timing:</strong> {rec.timing}</p>}
                        {rec.complexity && <p className="rec-meta"><strong>Complejidad:</strong> {rec.complexity}</p>}
                      </div>
                    ))}
                  </div>
                  <div className="next-steps">
                    <h4>📌 Siguientes Pasos:</h4>
                    <ul>
                      {advancedRecommendations.nextSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}
            </section>
          )}

          <section className="not-included">
            <h2>Qué no está en este cálculo</h2>
            <ul className="notes">
              {result.notIncluded.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>

          <section className="prompt-section">
            <h2>Prompt para IA (ChatGPT, Claude, etc.)</h2>
            <p className="subtle">
              Copiá este bloque en tu herramienta favorita si querés una charla más larga con contexto
              ya resumido. Revisá siempre el sesgo y las predicciones vacías.
            </p>
            <div className="prompt-actions">
              <button type="button" className="btn-copy" onClick={copyPrompt}>
                {copied ? 'Copiado' : 'Copiar prompt'}
              </button>
            </div>
            <pre className="prompt-pre">{result.promptForAI}</pre>
          </section>

          <footer className="disclaimer">
            <p>
              Herramienta orientativa: interpreta solo lo que el texto permite. Usala para entender
              conceptos y abrir conversación, no como veredicto sobre personas o futuros.
            </p>
          </footer>
        </div>
      )}
    </div>
  );
}
