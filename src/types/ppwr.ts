export type Language = 'fr' | 'en';
export type Theme = 'dark' | 'light';

export type PackagingCategory = 
  | 'primary'          // Emballage primaire (contact direct)
  | 'secondary'        // Emballage secondaire (regroupement)
  | 'transport'        // Emballage de transport / e-commerce
  | 'service';         // Emballage de service

export type SupplyChainRole = 
  | 'manufacturer'     // Fabricant
  | 'importer'         // Importateur
  | 'distributor'      // Distributeur / Händler
  | 'brand_owner'      // Marque propre
  | 'fulfilment';      // Prestataire de services d'exécution / Logistique

export type ComplianceStatus = 
  | 'compliant'        // Conforme (Vert)
  | 'incomplete'       // Incomplet (Jaune / Attention)
  | 'critical'         // Critique / Non conforme (Rouge)
  | 'missing';         // Manquant (Gris / Preuve absente)

export interface PackagingComponent {
  id: string;
  name: string;
  supplierName: string;
  supplierContactEmail?: string;
  materialType: 'plastic' | 'paper_cardboard' | 'glass' | 'metal' | 'wood' | 'composite';
  materialCode: string;          // e.g. PET 01, HDPE 02, PP 05, PAP 20, GL 70, ALU 41
  weightGrams: number;
  isMonoMaterial: boolean;
  recycledPlasticPercent: number; // For plastics (Art. 7)
  foodContact: boolean;
  separableWithoutTools: boolean;
  barrierOrCoatings?: string;
  status: ComplianceStatus;
  missingDataPoints: string[];
}

export interface HeavyMetalsData {
  pb_mg_kg?: number;
  cd_mg_kg?: number;
  hg_mg_kg?: number;
  crVI_mg_kg?: number;
  total_mg_kg?: number;
  isCompliant: boolean;          // Total <= 100 mg/kg (Art. 5)
  belowLoq?: boolean;
  labReportNumber?: string;
  testedDate?: string;
  sourceDocumentId?: string;
  sourceSnippet?: string;
}

export interface PfasSubstance {
  name: string;
  value?: number;
  unit?: string;
  limit?: number;
  compliant?: boolean;
}

export interface PfasData {
  declaredFree?: boolean;
  substances?: PfasSubstance[];
  sum?: number;
  totalFluorine?: number;
  loq?: string;
  detectionLimit?: string;
  labCertificateNumber?: string;
  sourceSnippet?: string;
}

export interface DimensionsData {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  packagingVolumeCm3: number;
  productVolumeCm3: number;
  voidSpaceRatioPercent: number; // Must be <= 50% for grouped/transport/ecommerce (Art. 9 & 21)
  isCompliant: boolean;
}

export interface ReusabilityData {
  isReusable: boolean;
  intendedRotations: number;
  systemForReuse: 'closed_loop' | 'open_loop' | 'deposit_return' | 'none';
  incentiveMechanism?: string;
}

export interface LabelingData {
  materialCode: string;
  sortingInstructions: string;
  qrCodeUrl?: string;
  hasHarmonizedPictogram: boolean;
}

export interface SourcedEvidence {
  id: string;
  field: string;
  value: string | number | boolean;
  unit?: string;
  documentName: string;
  pageNumber: number;
  verbatimSnippet: string;
  extractionMethod: 'deterministic' | 'ai_assisted';
  isVerifiedByHuman: boolean;
  verifiedAt?: string;
}

export interface DossierDocument {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  documentType: 'lab_test_report' | 'technical_data_sheet' | 'recyclability_certificate' | 'supplier_declaration';
  targetComponentId?: string;
  textContent?: string;
  extractionStatus: 'idle' | 'extracting' | 'extracted' | 'error';
  extractionEngine: 'deterministic' | 'ai_assisted';
  status: ComplianceStatus;
  extractedData?: {
    heavyMetals?: HeavyMetalsData;
    pfas?: PfasData;
    recycledContentPercent?: number;
    polymerCode?: string;
    standardsCited?: string[];
    confidenceScore?: number;
  };
  evidences: SourcedEvidence[];
}

export interface PackagingItem {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: PackagingCategory;
  userRole: SupplyChainRole;
  manufacturer: {
    companyName: string;
    address: string;
    country: string;
    vatNumber: string;
    signatoryName: string;
    signatoryRole: string;
  };
  components: PackagingComponent[];
  heavyMetals?: HeavyMetalsData;
  pfas?: PfasData;
  dimensions: DimensionsData;
  reusability: ReusabilityData;
  labeling: LabelingData;
  documents: DossierDocument[];
  declarationNumber?: string;
}

export type RecyclabilityGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface ArticleEvaluation {
  articleNumber: string;
  titleFr: string;
  titleEn: string;
  status: ComplianceStatus;
  scorePercent?: number;
  summaryFr: string;
  summaryEn: string;
  detailsFr: string[];
  detailsEn: string[];
  legalReference: string;
  evidenceCount: number;
}

export interface ComplianceReport {
  overallStatus: ComplianceStatus;
  recyclabilityGrade: RecyclabilityGrade;
  recyclabilityScore: number;
  articles: ArticleEvaluation[];
  harmonizedStandards: {
    code: string;
    titleFr: string;
    titleEn: string;
    isReferenced: boolean;
  }[];
}
