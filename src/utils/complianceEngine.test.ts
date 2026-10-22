import { describe, it, expect } from 'vitest';
import { evaluatePackagingCompliance } from './complianceEngine';
import { samplePackagingPresets } from '../data/samplePresets';
import { RULES_VERSION } from '../data/rules2025-40';

describe('complianceEngine', () => {
  it('marks heavy metals >100 as critical', () => {
    const item = JSON.parse(JSON.stringify(samplePackagingPresets[0]));
    item.heavyMetals.total_mg_kg = 150;
    item.heavyMetals.pb_mg_kg = 150;
    const report = evaluatePackagingCompliance(item);
    const art5 = report.articles.find(a => a.articleNumber === 'Article 5')!;
    expect(art5.status).toBe('critical');
  });

  it('marks missing heavy metals as missing', () => {
    const item = JSON.parse(JSON.stringify(samplePackagingPresets[0]));
    item.heavyMetals = undefined;
    const report = evaluatePackagingCompliance(item);
    expect(report.overallStatus).toBe('missing');
  });

  it('does not mark EN 13427/13428 as referenced by default', () => {
    const item = JSON.parse(JSON.stringify(samplePackagingPresets[0]));
    item.documents = [];
    const report = evaluatePackagingCompliance(item);
    const en13427 = report.harmonizedStandards.find(s => s.code === 'EN 13427:2004')!;
    const en13428 = report.harmonizedStandards.find(s => s.code === 'EN 13428:2004')!;
    expect(en13427.isReferenced).toBe(false);
    expect(en13428.isReferenced).toBe(false);
  });

  it('computes void space from volumes', () => {
    const item = JSON.parse(JSON.stringify(samplePackagingPresets[0]));
    item.category = 'transport';
    item.dimensions.packagingVolumeCm3 = 1000;
    item.dimensions.productVolumeCm3 = 400;
    item.dimensions.voidSpaceRatioPercent = 999; // should be ignored
    const report = evaluatePackagingCompliance(item);
    const art = report.articles.find(a => a.articleNumber === 'Article 9 & 21')!;
    expect(art.summaryFr).toContain('60.0%');
  });

  it('uses mass-weighted PCR', () => {
    const item = JSON.parse(JSON.stringify(samplePackagingPresets[0]));
    item.components = [
      { ...item.components[0], materialType: 'plastic', materialCode: 'PET 01', weightGrams: 10, recycledPlasticPercent: 0, foodContact: true },
      { ...item.components[0], id: 'c2', materialType: 'plastic', materialCode: 'PET 01', weightGrams: 90, recycledPlasticPercent: 100, foodContact: true, name: 'c2' },
    ];
    const report = evaluatePackagingCompliance(item);
    const art7 = report.articles.find(a => a.articleNumber === 'Article 7')!;
    // weighted ~90%, should be compliant
    expect(art7.status).toBe('compliant');
  });

  it('marks void space as missing when no dimensions', () => {
    const item = JSON.parse(JSON.stringify(samplePackagingPresets[0]));
    item.category = 'transport';
    item.dimensions = undefined as any;
    const report = evaluatePackagingCompliance(item);
    const art = report.articles.find(a => a.articleNumber === 'Article 9 & 21')!;
    expect(art.status).toBe('missing');
  });

  it('does not mutate input item', () => {
    const item = JSON.parse(JSON.stringify(samplePackagingPresets[0]));
    const before = JSON.stringify(item);
    evaluatePackagingCompliance(item);
    const after = JSON.stringify(item);
    expect(after).toBe(before);
  });

  it('at least one preset is fully compliant', () => {
    const reports = samplePackagingPresets.map(p => evaluatePackagingCompliance(p));
    expect(reports.some(r => r.overallStatus === 'compliant')).toBe(true);
  });

  it('PFAS measured exceedance is critical', () => {
    const item = JSON.parse(JSON.stringify(samplePackagingPresets[0]));
    item.pfas = { declaredFree: true, sum: 0.5 };
    const report = evaluatePackagingCompliance(item);
    const art5 = report.articles.find(a => a.articleNumber === 'Article 5')!;
    expect(art5.status).toBe('critical');
  });

  it('Cd alone does not yield compliant', () => {
    const item = JSON.parse(JSON.stringify(samplePackagingPresets[0]));
    item.heavyMetals = { cd_mg_kg: 2, isCompliant: true };
    const report = evaluatePackagingCompliance(item);
    const art5 = report.articles.find(a => a.articleNumber === 'Article 5')!;
    expect(art5.status).not.toBe('compliant');
  });

  it('grades recyclability by worst component', () => {
    const item = JSON.parse(JSON.stringify(samplePackagingPresets[0]));
    item.components = [
      { ...item.components[0], materialCode: 'PET 01', isMonoMaterial: true, separableWithoutTools: true, barrierOrCoatings: '' },
      { ...item.components[0], id: 'c2', materialCode: 'PS 06', isMonoMaterial: false, separableWithoutTools: false, barrierOrCoatings: 'barrier', name: 'c2' },
    ];
    const report = evaluatePackagingCompliance(item);
    expect(report.recyclabilityScore).toBeLessThan(50);
  });
});