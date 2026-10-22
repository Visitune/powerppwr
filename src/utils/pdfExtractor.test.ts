import { describe, it, expect } from 'vitest';
import { extractDataDeterministic } from './pdfExtractor';
import fs from 'node:fs';
import path from 'node:path';

describe('pdfExtractor', () => {
  it('returns no heavyMetals when absent', () => {
    const out = extractDataDeterministic('This document has no metals.', 'test.pdf', [{ page: 1, text: 'This document has no metals.' }]);
    expect(out.heavyMetals).toBeUndefined();
  });

  it('returns no pfas when absent', () => {
    const out = extractDataDeterministic('Nothing here.', 'test.pdf', [{ page: 1, text: 'Nothing here.' }]);
    expect(out.pfas).toBeUndefined();
  });

  it('does not invent lab report number when metals present but no report', () => {
    const text = 'Pb: 10 mg/kg Cd: 5 mg/kg Hg: 1 mg/kg Cr VI: 2 mg/kg Total: 18 mg/kg';
    const out = extractDataDeterministic(text, 'test.pdf', [{ page: 1, text }]);
    expect(out.heavyMetals).toBeDefined();
    expect(out.heavyMetals!.labReportNumber).toBeUndefined();
  });

  it('fails if an invented fallback value reappears in source', () => {
    const src = fs.readFileSync(path.resolve(__dirname, 'pdfExtractor.ts'), 'utf-8');
    expect(src).not.toContain("LAB-EU-2025-091");
    expect(src).not.toContain("2025-08-15");
    expect(src).not.toContain("< 25 ppb");
  });

  it('parses a detection limit without inventing one', () => {
    const text = 'PFAS free, detection limit < 5 ppb';
    const out = extractDataDeterministic(text, 'test.pdf', [{ page: 1, text }]);
    expect(out.pfas).toBeDefined();
    expect(out.pfas!.detectionLimit).toBe('< 5 ppb');
  });

  it('No PFAS intentionally added yields true', () => {
    const text = 'No PFAS intentionally added in this packaging.';
    const out = extractDataDeterministic(text, 'test.pdf', [{ page: 1, text }]);
    expect(out.pfas).toBeDefined();
    expect(out.pfas!.declaredFree).toBe(true);
  });

  it('PFAS n.d. with LQ is not treated as a measurement', () => {
    const text = 'PFAS : n.d. (LQ 10 µg/kg)';
    const out = extractDataDeterministic(text, 'test.pdf', [{ page: 1, text }]);
    expect(out.pfas).toBeDefined();
    expect(out.pfas!.declaredFree).toBe(true);
  });

  it('PFAS results below 25 ppb count as compliant', () => {
    const text = 'PFOA < 25 ppb, PFOS < 25 ppb';
    const out = extractDataDeterministic(text, 'test.pdf', [{ page: 1, text }]);
    expect(out.pfas).toBeDefined();
    expect(out.pfas!.declaredFree).toBe(true);
  });

  it('PFAS ND with LOQ is not treated as a measurement', () => {
    const text = 'PFAS : ND (LOQ 10 ppb)';
    const out = extractDataDeterministic(text, 'test.pdf', [{ page: 1, text }]);
    expect(out.pfas).toBeDefined();
    expect(out.pfas!.declaredFree).toBe(true);
  });

  it('a numeric measurement overrides the declaration', () => {
    const text = 'Sans PFAS ajouté, PFOA 120 ppb mesuré';
    const out = extractDataDeterministic(text, 'test.pdf', [{ page: 1, text }]);
    expect(out.pfas).toBeDefined();
    expect(out.pfas!.declaredFree).toBe(false);
  });

  it('does not fabricate a citation', () => {
    const text = 'PFAS free';
    const out = extractDataDeterministic(text, 'test.pdf', [{ page: 2, text }]);
    // no fabricated verbatim snippet like "PFAS free declaration confirmed"
    for (const ev of out.evidences) {
      expect(ev.verbatimSnippet).not.toContain('declaration confirmed');
      expect(ev.verbatimSnippet).not.toContain('Total heavy metals:');
    }
  });

  it('leaves detectionLimit undefined when not stated', () => {
    const text = 'PFAS free statement only';
    const out = extractDataDeterministic(text, 'test.pdf', [{ page: 1, text }]);
    expect(out.pfas).toBeDefined();
    expect(out.pfas!.detectionLimit).toBeUndefined();
  });

  it('does not mark PFAS as free when merely detected', () => {
    const text = 'PFAS and PFOA detected at 800 ppb';
    const out = extractDataDeterministic(text, 'test.pdf', [{ page: 1, text }]);
    expect(out.pfas).toBeDefined();
    expect(out.pfas!.declaredFree).toBe(false);
  });

  it('does not mark PFAS as free for a less-than limit', () => {
    const text = 'Total PFAS < 500 ppb';
    const out = extractDataDeterministic(text, 'test.pdf', [{ page: 1, text }]);
    // no explicit free statement -> either undefined or false, never true
    expect(out.pfas?.declaredFree).not.toBe(true);
  });

  it('reads the lab report number even when the word "Report" appears twice', () => {
    const text = 'SGS Laboratory Test Report Report No: SGS-TEST-2026-001 Pb: 2 mg/kg Cd: 0.5 mg/kg Hg: 0.1 mg/kg Cr VI: 0.5 mg/kg';
    const out = extractDataDeterministic(text, 'r.pdf', [{ page: 1, text }]);
    expect(out.heavyMetals?.labReportNumber).toBe('SGS-TEST-2026-001');
  });

  it('never returns a plain word as report number', () => {
    const text = 'Test Report on packaging. Pb: 2 mg/kg Cd: 0.5 mg/kg Hg: 0.1 mg/kg Cr VI: 0.5 mg/kg';
    const out = extractDataDeterministic(text, 'r.pdf', [{ page: 1, text }]);
    expect(out.heavyMetals?.labReportNumber).toBeUndefined();
  });

  it('reads French report numbers', () => {
    const text = 'Rapport N° EUROFINS-2025-FR-7128. Plomb 1.5 mg/kg Cadmium 0.2 mg/kg Mercure 0.05 mg/kg Chrome hexavalent 0.5 mg/kg';
    const out = extractDataDeterministic(text, 'r.pdf', [{ page: 1, text }]);
    expect(out.heavyMetals?.labReportNumber).toBe('EUROFINS-2025-FR-7128');
  });
});
