import { describe, it, expect } from 'vitest';
import {
  buildHeavyMetals,
  buildPfas,
  cloneAsExample,
  computeDimensions,
  createBlankProduct,
  isExampleProduct,
  newComponent,
  normalizeImportedProduct,
  newProductId,
  parseOptionalNumber,
  withComponentStatus,
} from './products';
import { samplePackagingPresets } from '../data/samplePresets';
import { evaluatePackagingCompliance } from './complianceEngine';

describe('example products', () => {
  it('recognises shipped presets, flagged copies and legacy "(exemple)" copies', () => {
    expect(samplePackagingPresets.every(isExampleProduct)).toBe(true);
    expect(isExampleProduct(cloneAsExample(samplePackagingPresets[0]))).toBe(true);
    const legacy = { ...createBlankProduct('Boîte (exemple)') };
    expect(isExampleProduct(legacy)).toBe(true);
  });

  it('does not treat a user product or a duplicate of an example as an example', () => {
    expect(isExampleProduct(createBlankProduct())).toBe(false);
    const dup = { ...cloneAsExample(samplePackagingPresets[0]), isExample: false, name: 'Ma boîte' };
    expect(isExampleProduct(dup)).toBe(false);
  });

  it('generates unique ids even within the same millisecond', () => {
    const ids = new Set(Array.from({ length: 200 }, () => newProductId()));
    expect(ids.size).toBe(200);
  });

  it('example clones are independent copies without a declaration number', () => {
    const src = { ...samplePackagingPresets[0], declarationNumber: 'EU-DOC-1' };
    const c = cloneAsExample(src);
    expect(c.declarationNumber).toBeUndefined();
    c.components[0].name = 'changed';
    expect(src.components[0].name).not.toBe('changed');
  });
});

describe('parseOptionalNumber', () => {
  it('treats empty, invalid and negative values as "not provided"', () => {
    expect(parseOptionalNumber('')).toBeUndefined();
    expect(parseOptionalNumber('  ')).toBeUndefined();
    expect(parseOptionalNumber('abc')).toBeUndefined();
    expect(parseOptionalNumber('-3')).toBeUndefined();
  });
  it('parses decimals with comma or dot and keeps a real zero', () => {
    expect(parseOptionalNumber('1,5')).toBe(1.5);
    expect(parseOptionalNumber('2.25')).toBe(2.25);
    expect(parseOptionalNumber('0')).toBe(0);
  });
});

describe('manual data entry builders', () => {
  it('computes the heavy metals total only when all four metals are provided', () => {
    let hm = buildHeavyMetals(undefined, { cd_mg_kg: 2 });
    expect(hm?.total_mg_kg).toBeUndefined();
    expect(hm?.isCompliant).toBe(false);
    hm = buildHeavyMetals(hm, { pb_mg_kg: 1, hg_mg_kg: 0.5, crVI_mg_kg: 0.5 });
    expect(hm?.total_mg_kg).toBe(4);
    expect(hm?.isCompliant).toBe(true);
  });

  it('removes the section when everything is cleared', () => {
    const hm = buildHeavyMetals(undefined, { pb_mg_kg: 1 });
    expect(buildHeavyMetals(hm, { pb_mg_kg: undefined })).toBeUndefined();
    const p = buildPfas(undefined, { declaredFree: true });
    expect(buildPfas(p, { declaredFree: undefined })).toBeUndefined();
  });

  it('computes packaging volume and void ratio from dimensions', () => {
    const base = createBlankProduct().dimensions;
    const d = computeDimensions(base, { lengthMm: 100, widthMm: 100, heightMm: 100, productVolumeCm3: 250 });
    expect(d.packagingVolumeCm3).toBe(1000);
    expect(d.voidSpaceRatioPercent).toBe(75);
    expect(d.isCompliant).toBe(false);
  });

  it('flags an incomplete component as missing and a complete one as compliant', () => {
    const c = newComponent();
    expect(c.status).toBe('missing');
    expect(c.missingDataPoints).toEqual(expect.arrayContaining(['name', 'materialCode', 'weightGrams']));
    const ok = withComponentStatus({ ...c, name: 'Carton', materialCode: 'PAP 20', weightGrams: 120, materialType: 'paper_cardboard' });
    expect(ok.status).toBe('compliant');
    expect(ok.missingDataPoints).toEqual([]);
  });
});

describe('a product filled by hand', () => {
  it('has no false success and only misses the recyclability certificate', () => {
    const blank = createBlankProduct('Carton test');
    expect(evaluatePackagingCompliance(blank).overallStatus).toBe('missing');

    const item = {
      ...blank,
      category: 'transport' as const,
      components: [withComponentStatus({ ...newComponent(), name: 'Carton', materialType: 'paper_cardboard' as const, materialCode: 'PAP 20', weightGrams: 120 })],
      heavyMetals: buildHeavyMetals(undefined, { pb_mg_kg: 2, cd_mg_kg: 0.5, hg_mg_kg: 0.1, crVI_mg_kg: 0.5 }),
      pfas: buildPfas(undefined, { declaredFree: true }),
      dimensions: computeDimensions(blank.dimensions, { lengthMm: 300, widthMm: 200, heightMm: 100, productVolumeCm3: 4000 }),
      labeling: { materialCode: 'PAP 20', sortingInstructions: 'Bac papier', hasHarmonizedPictogram: true },
    };
    const report = evaluatePackagingCompliance(item);
    const byArt = Object.fromEntries(report.articles.map(a => [a.articleNumber, a.status]));
    expect(byArt['Article 5']).toBe('compliant');
    expect(byArt['Article 9 & 21']).toBe('compliant');
    expect(byArt['Article 11']).toBe('compliant');
    expect(byArt['Article 6']).toBe('incomplete'); // certificate still to attach
    expect(report.overallStatus).toBe('incomplete');
  });
});

describe('normalizeImportedProduct', () => {
  it('rejects things that are not products', () => {
    expect(normalizeImportedProduct(null)).toBeNull();
    expect(normalizeImportedProduct({})).toBeNull();
    expect(normalizeImportedProduct({ name: 'x' })).toBeNull();
    expect(normalizeImportedProduct({ name: '  ', components: [] })).toBeNull();
  });

  it('completes missing sections instead of letting the app crash', () => {
    const p = normalizeImportedProduct({ name: 'Importé', components: [{ name: 'a' }] })!;
    expect(p.manufacturer.companyName).toBe('');
    expect(p.documents).toEqual([]);
    expect(p.dimensions.lengthMm).toBe(0);
    expect(() => evaluatePackagingCompliance(p)).not.toThrow();
    expect(p.components[0].status).toBe('missing');
  });

  it('gives a new id, drops the example flag and the declaration number', () => {
    const src = { ...samplePackagingPresets[0], declarationNumber: 'EU-DOC-1' };
    const p = normalizeImportedProduct(JSON.parse(JSON.stringify(src)))!;
    expect(p.id).not.toBe(src.id);
    expect(isExampleProduct(p)).toBe(false);
    expect(p.declarationNumber).toBeUndefined();
    expect(p.documents.length).toBe(src.documents.length);
  });
});
