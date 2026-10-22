import {
  DimensionsData,
  HeavyMetalsData,
  PackagingComponent,
  PackagingItem,
  PfasData,
} from '../types/ppwr';
import { samplePackagingPresets } from '../data/samplePresets';

const PRESET_IDS = new Set(samplePackagingPresets.map(p => p.id));

/** Material codes known by the compliance engine (Decision 97/129/EC style). */
export const MATERIAL_CODES = [
  'PET 01', 'HDPE 02', 'LDPE 04', 'PP 05', 'PS 06',
  'PAP 20', 'PAP 21', 'PAP 22', 'GL 70', 'ALU 41', 'FE 40', 'FOR 50',
];

/** True for shipped presets, copies made from them, and legacy copies named "(exemple)". */
export function isExampleProduct(p: PackagingItem): boolean {
  if (p.isExample === false) return false;
  return !!p.isExample || PRESET_IDS.has(p.id) || /\((exemple|example)\)\s*$/i.test(p.name || '');
}

let idCounter = 0;
export function newProductId(): string {
  idCounter += 1;
  return `prod-${Date.now()}-${idCounter}-${Math.random().toString(36).slice(2, 6)}`;
}

export function createBlankProduct(name = 'Nouveau produit'): PackagingItem {
  const id = newProductId();
  return {
    id,
    name,
    sku: 'SKU-' + id.slice(5, 18),
    brand: '',
    category: 'primary',
    userRole: 'manufacturer',
    manufacturer: { companyName: '', address: '', country: '', vatNumber: '', signatoryName: '', signatoryRole: '' },
    components: [],
    dimensions: { lengthMm: 0, widthMm: 0, heightMm: 0, packagingVolumeCm3: 0, productVolumeCm3: 0, voidSpaceRatioPercent: 0, isCompliant: false },
    reusability: { isReusable: false, intendedRotations: 0, systemForReuse: 'none' },
    labeling: { materialCode: '', sortingInstructions: '', hasHarmonizedPictogram: false },
    documents: [],
  };
}

/** Independent copy of a shipped preset, flagged as an example. */
export function cloneAsExample(preset: PackagingItem, keepId = false): PackagingItem {
  const clone: PackagingItem = JSON.parse(JSON.stringify(preset));
  clone.isExample = true;
  if (!keepId) {
    clone.id = newProductId();
    clone.name = `${preset.name} (exemple)`;
  }
  delete clone.declarationNumber;
  return clone;
}

/** "" or invalid or negative -> undefined (data not provided). Accepts "1,5". */
export function parseOptionalNumber(raw: string): number | undefined {
  const s = String(raw ?? '').trim().replace(',', '.');
  if (s === '') return undefined;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}

export function computeDimensions(prev: DimensionsData, patch: Partial<Pick<DimensionsData, 'lengthMm' | 'widthMm' | 'heightMm' | 'productVolumeCm3'>>): DimensionsData {
  const lengthMm = patch.lengthMm ?? prev.lengthMm ?? 0;
  const widthMm = patch.widthMm ?? prev.widthMm ?? 0;
  const heightMm = patch.heightMm ?? prev.heightMm ?? 0;
  const productVolumeCm3 = patch.productVolumeCm3 ?? prev.productVolumeCm3 ?? 0;
  const packagingVolumeCm3 = Math.round((lengthMm * widthMm * heightMm) / 1000);
  const voidSpaceRatioPercent = packagingVolumeCm3 > 0
    ? Math.max(0, Math.min(100, Math.round(((packagingVolumeCm3 - productVolumeCm3) / packagingVolumeCm3) * 1000) / 10))
    : 0;
  return {
    lengthMm,
    widthMm,
    heightMm,
    packagingVolumeCm3,
    productVolumeCm3,
    voidSpaceRatioPercent,
    isCompliant: voidSpaceRatioPercent <= 50,
  };
}

export function newComponent(): PackagingComponent {
  return withComponentStatus({
    id: 'c-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    name: '',
    supplierName: '',
    materialType: 'plastic',
    materialCode: '',
    weightGrams: 0,
    isMonoMaterial: true,
    recycledPlasticPercent: 0,
    foodContact: false,
    separableWithoutTools: true,
    barrierOrCoatings: '',
    status: 'missing',
    missingDataPoints: [],
  });
}

/** Required data points of a component; any gap makes it "missing". */
export function componentMissingPoints(c: PackagingComponent): string[] {
  const missing: string[] = [];
  if (!c.name?.trim()) missing.push('name');
  if (!c.materialCode?.trim()) missing.push('materialCode');
  if (!(c.weightGrams > 0)) missing.push('weightGrams');
  return missing;
}

export function withComponentStatus(c: PackagingComponent): PackagingComponent {
  const missingDataPoints = componentMissingPoints(c);
  return { ...c, missingDataPoints, status: missingDataPoints.length ? 'missing' : 'compliant' };
}

/**
 * Heavy metals from manual entry. The total is only computed when the four metals are all
 * provided (an untested metal is never counted as 0). Returns undefined when nothing is entered.
 */
export function buildHeavyMetals(prev: HeavyMetalsData | undefined, patch: Partial<HeavyMetalsData>): HeavyMetalsData | undefined {
  const next: HeavyMetalsData = { ...(prev ?? { isCompliant: false }), ...patch };
  const metals = [next.pb_mg_kg, next.cd_mg_kg, next.hg_mg_kg, next.crVI_mg_kg];
  const allKnown = metals.every(m => m !== undefined);
  next.total_mg_kg = allKnown ? Math.round(metals.reduce((a, b) => a + (b as number), 0) * 1000) / 1000 : undefined;
  next.isCompliant = next.total_mg_kg !== undefined && next.total_mg_kg <= 100;
  if (next.labReportNumber !== undefined && next.labReportNumber.trim() === '') next.labReportNumber = undefined;
  if (next.testedDate !== undefined && next.testedDate.trim() === '') next.testedDate = undefined;
  const hasAnything = metals.some(m => m !== undefined) || next.labReportNumber || next.testedDate;
  return hasAnything ? next : undefined;
}

/** PFAS from manual entry. Returns undefined when nothing is entered. */
export function buildPfas(prev: PfasData | undefined, patch: Partial<PfasData>): PfasData | undefined {
  const next: PfasData = { ...(prev ?? {}), ...patch };
  if (next.labCertificateNumber !== undefined && next.labCertificateNumber.trim() === '') next.labCertificateNumber = undefined;
  const hasAnything = next.declaredFree !== undefined || next.sum !== undefined
    || next.totalFluorine !== undefined || next.labCertificateNumber !== undefined
    || (next.substances && next.substances.length > 0);
  return hasAnything ? next : undefined;
}

/**
 * Turns an imported JSON object into a safe, complete product (new id, no example flag, no declaration
 * number, every section present). Returns null when it does not look like a product at all.
 */
export function normalizeImportedProduct(raw: unknown): PackagingItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, any>;
  if (typeof r.name !== 'string' || !r.name.trim() || !Array.isArray(r.components)) return null;
  const blank = createBlankProduct(r.name);
  const component = newComponent();
  const item: PackagingItem = {
    ...blank,
    ...r,
    id: blank.id,
    name: r.name,
    sku: typeof r.sku === 'string' && r.sku ? r.sku : blank.sku,
    brand: typeof r.brand === 'string' ? r.brand : '',
    manufacturer: { ...blank.manufacturer, ...(r.manufacturer && typeof r.manufacturer === 'object' ? r.manufacturer : {}) },
    dimensions: { ...blank.dimensions, ...(r.dimensions && typeof r.dimensions === 'object' ? r.dimensions : {}) },
    reusability: { ...blank.reusability, ...(r.reusability && typeof r.reusability === 'object' ? r.reusability : {}) },
    labeling: { ...blank.labeling, ...(r.labeling && typeof r.labeling === 'object' ? r.labeling : {}) },
    components: r.components
      .filter((c: unknown) => c && typeof c === 'object')
      .map((c: Record<string, any>, i: number) => ({
        ...component,
        ...c,
        id: typeof c.id === 'string' && c.id ? c.id : `c-imp-${i}`,
        status: ['compliant', 'incomplete', 'critical', 'missing'].includes(c.status) ? c.status : 'missing',
        missingDataPoints: Array.isArray(c.missingDataPoints) ? c.missingDataPoints : [],
      })),
    documents: (Array.isArray(r.documents) ? r.documents : [])
      .filter((d: unknown) => d && typeof d === 'object')
      .map((d: Record<string, any>, i: number) => ({
        id: `doc-imp-${i}`,
        fileName: 'document.pdf',
        fileSize: 0,
        uploadDate: '',
        documentType: 'supplier_declaration',
        extractionStatus: 'idle',
        extractionEngine: 'deterministic',
        status: 'missing',
        ...d,
        evidences: Array.isArray(d.evidences) ? d.evidences : [],
      })) as PackagingItem['documents'],
    isExample: false,
  };
  delete item.declarationNumber;
  return item;
}
