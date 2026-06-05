/**
 * Exportación de resultados en distintos formatos
 */

export function generatePlainText(result, chartA, chartB) {
  const lines = [];
  
  // Encabezado
  lines.push('═══════════════════════════════════════════════════════');
  lines.push(`COMPATIBILIDAD ASTRAL — ${chartA.name} & ${chartB.name}`);
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('');
  
  // Cartas detectadas
  lines.push(`Persona A: ${chartA.name}`);
  lines.push(`  Sol: ${chartA.sunSign} | Luna: ${chartA.moonSign} | Ascendente: ${chartA.ascSign}`);
  lines.push('');
  lines.push(`Persona B: ${chartB.name}`);
  lines.push(`  Sol: ${chartB.sunSign} | Luna: ${chartB.moonSign} | Ascendente: ${chartB.ascSign}`);
  lines.push('');
  
  // Índice sintético
  lines.push('───────────────────────────────────────────────────────');
  lines.push(`ÍNDICE SINTÉTICO: ${result.scorePercent}%`);
  lines.push('───────────────────────────────────────────────────────');
  lines.push('');
  
  // Resumen
  result.summaryLines.forEach(line => {
    lines.push(`• ${line}`);
  });
  lines.push('');
  lines.push(`VEREDICTO: ${result.verdict}`);
  lines.push('');
  
  // Dimensiones
  lines.push('───────────────────────────────────────────────────────');
  lines.push('COMPATIBILIDAD POR ÁMBITOS');
  lines.push('───────────────────────────────────────────────────────');
  result.dimensions.forEach(d => {
    lines.push(`${d.emoji} ${d.label}: ${d.percent}%`);
    lines.push(`   ${d.blurb}`);
  });
  lines.push('');
  
  // Aspectos
  lines.push('───────────────────────────────────────────────────────');
  lines.push('ASPECTOS ENTRE CARTAS');
  lines.push('───────────────────────────────────────────────────────');
  result.aspects.forEach(aspect => {
    lines.push(`\n${aspect.label} [${aspect.aspect}]`);
    if (aspect.separation != null) {
      lines.push(`  Separación: ${aspect.separation}°`);
    }
    if (aspect.narrative) {
      lines.push(`  ${aspect.narrative}`);
    } else if (aspect.hint) {
      lines.push(`  ${aspect.hint}`);
    }
  });
  lines.push('');
  
  // Elementos
  lines.push('───────────────────────────────────────────────────────');
  lines.push('ELEMENTOS (SOL Y LUNA)');
  lines.push('───────────────────────────────────────────────────────');
  result.elementNotes.forEach(note => {
    lines.push(`• ${note}`);
  });
  lines.push('');
  
  // Modalidad
  if (result.modalityNotes?.length > 0) {
    lines.push('───────────────────────────────────────────────────────');
    lines.push('MODALIDAD (RITMO DE ACCIÓN)');
    lines.push('───────────────────────────────────────────────────────');
    result.modalityNotes.forEach(note => {
      lines.push(`• ${note}`);
    });
    lines.push('');
  }
  
  // Ángulos
  if (result.ascCross?.length > 0) {
    lines.push('───────────────────────────────────────────────────────');
    lines.push('PLANETAS PERSONALES Y ÁNGULOS');
    lines.push('───────────────────────────────────────────────────────');
    result.ascCross.forEach(item => {
      lines.push(`\n${item.title} [${item.aspect}]`);
      if (item.separation != null) {
        lines.push(`  Separación: ${item.separation}°`);
      }
      lines.push(`  ${item.narrative || item.text}`);
    });
    lines.push('');
  }
  
  // Tabla de planetas
  lines.push('───────────────────────────────────────────────────────');
  lines.push('POSICIONES LEÍDAS DEL TEXTO');
  lines.push('───────────────────────────────────────────────────────');
  lines.push('');
  result.planetTable.forEach(row => {
    lines.push(`${row.label.padEnd(15)} | ${row.a?.padEnd(20) || '—'} | ${row.b || '—'}`);
  });
  lines.push('');
  
  // Qué no está incluido
  lines.push('───────────────────────────────────────────────────────');
  lines.push('QUÉ NO ESTÁ EN ESTE CÁLCULO');
  lines.push('───────────────────────────────────────────────────────');
  result.notIncluded.forEach(item => {
    lines.push(`• ${item}`);
  });
  lines.push('');
  
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('Generado por SomosAstros');
  lines.push(`Fecha: ${new Date().toLocaleString('es-AR')}`);
  lines.push('═══════════════════════════════════════════════════════');
  
  return lines.join('\n');
}

export function generateJSON(result, chartA, chartB) {
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      personA: {
        name: chartA.name,
        sun: chartA.sunSign,
        moon: chartA.moonSign,
        ascendant: chartA.ascSign,
        planets: chartA.planets,
        houseCusps: chartA.houseCusps,
      },
      personB: {
        name: chartB.name,
        sun: chartB.sunSign,
        moon: chartB.moonSign,
        ascendant: chartB.ascSign,
        planets: chartB.planets,
        houseCusps: chartB.houseCusps,
      },
      compatibility: {
        scorePercent: result.scorePercent,
        verdict: result.verdict,
        summaryLines: result.summaryLines,
        dimensions: result.dimensions,
        aspects: result.aspects,
        elementNotes: result.elementNotes,
        modalityNotes: result.modalityNotes,
        ascCross: result.ascCross,
      },
    },
    null,
    2
  );
}

export function downloadFile(content, filename, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
