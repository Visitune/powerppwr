import { PackagingItem } from '../types/ppwr';

export const samplePackagingPresets: PackagingItem[] = [
  {
    id: 'preset-ecommerce-box',
    name: 'Boîte d\'Expédition E-Commerce Kraft Cannelure',
    sku: 'ECO-BOX-M-2026',
    brand: 'PackGreen Solutions EU',
    category: 'transport',
    userRole: 'manufacturer',
    manufacturer: {
      companyName: 'EcoLogistics Packaging SAS',
      address: '28 Rue de la Logistique Durable, 69007 Lyon, France',
      country: 'France',
      vatNumber: 'FR 84 912 345 678',
      signatoryName: 'Alexandre Mercier',
      signatoryRole: 'Directeur Général & Responsable Conformité RSE',
    },
    components: [
      {
        id: 'c1',
        name: 'Carton Double Cannelure Kraftliner',
        supplierName: 'Smurfit Westrock Paper Europe',
        supplierContactEmail: 'compliance@smurfitwestrock.eu',
        materialType: 'paper_cardboard',
        materialCode: 'PAP 20',
        weightGrams: 185,
        isMonoMaterial: true,
        recycledPlasticPercent: 0,
        foodContact: false,
        separableWithoutTools: true,
        barrierOrCoatings: 'Encres à base d\'eau sans solvant (Water-based inks)',
        status: 'compliant',
        missingDataPoints: [],
      },
      {
        id: 'c2',
        name: 'Bande adhésive kraft gommée',
        supplierName: 'Tesa Packaging Tape Division',
        supplierContactEmail: 'regulatory@tesa.com',
        materialType: 'paper_cardboard',
        materialCode: 'PAP 22',
        weightGrams: 12,
        isMonoMaterial: true,
        recycledPlasticPercent: 0,
        foodContact: false,
        separableWithoutTools: true,
        status: 'compliant',
        missingDataPoints: [],
      }
    ],
    heavyMetals: {
      pb_mg_kg: 2.1,
      cd_mg_kg: 0.4,
      hg_mg_kg: 0.1,
      crVI_mg_kg: 0.8,
      total_mg_kg: 3.4,
      isCompliant: true,
      labReportNumber: 'SGS-EU-CH-984210',
      testedDate: '2025-11-14',
      sourceSnippet: 'Total concentration of Lead (Pb), Cadmium (Cd), Mercury (Hg) and Hexavalent Chromium (Cr VI) = 3.4 mg/kg (Limit: 100 mg/kg - 94/62/EC & PPWR Art. 5).',
    },
    pfas: {
      declaredFree: true,
      detectionLimit: '< 10 ppb (LC-MS/MS)',
      labCertificateNumber: 'CERT-PFAS-2025-081',
      sourceSnippet: 'PFAS substances: Not detected. No intentionally added perfluoroalkyl or polyfluoroalkyl substances in substrate or starch adhesive.',
    },
    dimensions: {
      lengthMm: 310,
      widthMm: 220,
      heightMm: 140,
      packagingVolumeCm3: 9548,
      productVolumeCm3: 6100,
      voidSpaceRatioPercent: 36.1,
      isCompliant: true,
    },
    reusability: {
      isReusable: true,
      intendedRotations: 3,
      systemForReuse: 'closed_loop',
      incentiveMechanism: 'Bande adhésive double pour retour client e-commerce sans réemballage',
    },
    labeling: {
      materialCode: 'PAP 20',
      sortingInstructions: 'Bac de tri jaune - Papiers et cartons (France / UE)',
      qrCodeUrl: 'https://powerppwr.app/trace/VP-BOX-M-2026',
      hasHarmonizedPictogram: true,
    },
    documents: [
      {
        id: 'doc-sgs-box',
        fileName: 'SGS_HeavyMetals_TestReport_PAP20.pdf',
        fileSize: 428000,
        uploadDate: '2025-11-20',
        documentType: 'lab_test_report',
        targetComponentId: 'c1',
        extractionStatus: 'extracted',
        extractionEngine: 'deterministic',
        status: 'compliant',
        textContent: `SGS ACCREDITED LABORATORY SERVICES - CERTIFICATE OF ANALYSIS
Report No: SGS-EU-CH-984210
Date of Issue: 14/11/2025
Client: EcoLogistics Packaging SAS
Supplier: Smurfit Westrock Paper Europe
Sample: Corrugated Board PAP 20 (Double flute kraftliner)

ANALYTICAL RESULTS FOR DIRECTIVE 94/62/EC & REGULATION (EU) 2025/40 (PPWR) - ARTICLE 5:
- Lead (Pb): 2.1 mg/kg [Detection Limit: 0.5 mg/kg]
- Cadmium (Cd): 0.4 mg/kg [Detection Limit: 0.2 mg/kg]
- Mercury (Hg): 0.1 mg/kg [Detection Limit: 0.1 mg/kg]
- Hexavalent Chromium Cr(VI): 0.8 mg/kg [Detection Limit: 0.5 mg/kg]
Total Heavy Metals Sum: 3.4 mg/kg
REGULATORY LIMIT: 100 mg/kg (COMPLIANT)

SCREENING FOR PER- AND POLYFLUOROALKYL SUBSTANCES (PFAS):
Total Organic Fluorine (TOF): < 10 mg/kg
Targeted 28 PFAS suite: Not detected (< 10 ppb).
Declared PFAS free: Conforms to EU Packaging and Packaging Waste Regulation substance restrictions.

CONFORMITY TO STANDARDS:
EN 13427:2004 Packaging Requirements
EN 13428:2004 Source Reduction and Minimization
EN 13430:2004 Material Recycling Recyclability Requirements
Conclusion: The sample meets all heavy metals and chemical safety requirements.`,
        extractedData: {
          heavyMetals: {
            pb_mg_kg: 2.1,
            cd_mg_kg: 0.4,
            hg_mg_kg: 0.1,
            crVI_mg_kg: 0.8,
            total_mg_kg: 3.4,
            isCompliant: true,
            labReportNumber: 'SGS-EU-CH-984210',
            testedDate: '2025-11-14',
            sourceSnippet: 'Total Heavy Metals Sum: 3.4 mg/kg (Limit: 100 mg/kg)',
          },
          pfas: {
            declaredFree: true,
            detectionLimit: '< 10 ppb',
            sourceSnippet: 'PFAS suite: Not detected (< 10 ppb). Declared PFAS free.',
          },
          polymerCode: 'PAP 20',
          standardsCited: ['EN 13427:2004', 'EN 13428:2004', 'EN 13430:2004'],
          confidenceScore: 100,
        },
        evidences: [
          {
            id: 'ev-1',
            field: 'heavy_metals_total',
            value: 3.4,
            unit: 'mg/kg',
            documentName: 'SGS_HeavyMetals_TestReport_PAP20.pdf',
            pageNumber: 1,
            verbatimSnippet: 'Total Heavy Metals Sum: 3.4 mg/kg (Limit: 100 mg/kg)',
            extractionMethod: 'deterministic',
            isVerifiedByHuman: true,
            verifiedAt: '2025-11-21',
          },
          {
            id: 'ev-2',
            field: 'pfas_free',
            value: true,
            documentName: 'SGS_HeavyMetals_TestReport_PAP20.pdf',
            pageNumber: 1,
            verbatimSnippet: 'PFAS suite: Not detected (< 10 ppb). Declared PFAS free.',
            extractionMethod: 'deterministic',
            isVerifiedByHuman: true,
            verifiedAt: '2025-11-21',
          }
        ]
      },
      {
        id: 'doc-recyclability-box',
        fileName: 'RecyClass_Recyclability_Certificate_PAP20.pdf',
        fileSize: 120000,
        uploadDate: '2025-11-22',
        documentType: 'recyclability_certificate',
        targetComponentId: 'c1',
        extractionStatus: 'extracted',
        extractionEngine: 'deterministic',
        status: 'compliant',
        textContent: 'RecyClass recyclability certificate for corrugated board PAP 20. Grade B.',
        extractedData: {
          standardsCited: ['EN 13430:2004'],
          confidenceScore: 100,
        },
        evidences: []
      }
    ]
  },
  {
    id: 'preset-beverage-bottle',
    name: 'Bouteille Boisson Transparente PET Contact Alimentaire 500ml',
    sku: 'AQUA-BTL-PET-500',
    brand: 'AquaPure Beverages Europe',
    category: 'primary',
    userRole: 'brand_owner',
    manufacturer: {
      companyName: 'AquaViva Bottling Europe SARL',
      address: '12 Avenue des Eaux Minérales, 74500 Évian-les-Bains, France',
      country: 'France',
      vatNumber: 'FR 55 819 402 119',
      signatoryName: 'Claire Delorme',
      signatoryRole: 'Directrice Qualité & Affaires Réglementaires',
    },
    components: [
      {
        id: 'c1',
        name: 'Corps de Bouteille Clair PET',
        supplierName: 'Alpla Kunststofftechnik GmbH',
        supplierContactEmail: 'regulatory-affairs@alpla.com',
        materialType: 'plastic',
        materialCode: 'PET 01',
        weightGrams: 24.5,
        isMonoMaterial: true,
        recycledPlasticPercent: 35,
        foodContact: true,
        separableWithoutTools: true,
        status: 'compliant',
        missingDataPoints: [],
      },
      {
        id: 'c2',
        name: 'Bouchon Solidaire HDPE Captif',
        supplierName: 'Bericap Closures Europe',
        supplierContactEmail: 'quality.compliance@bericap.com',
        materialType: 'plastic',
        materialCode: 'HDPE 02',
        weightGrams: 2.2,
        isMonoMaterial: true,
        recycledPlasticPercent: 30,
        foodContact: true,
        separableWithoutTools: false,
        status: 'incomplete',
        missingDataPoints: ['Certificat d\'absence intentionnelle de PFAS (Art. 5)', 'Attestation de conformité du mécanisme captif (Dir. 2019/904)'],
      },
      {
        id: 'c3',
        name: 'Étiquette enveloppante PP lavable basse densité',
        supplierName: 'CCL Label Food & Beverage',
        supplierContactEmail: 'compliance@cclind.com',
        materialType: 'plastic',
        materialCode: 'PP 05',
        weightGrams: 0.9,
        isMonoMaterial: true,
        recycledPlasticPercent: 0,
        foodContact: false,
        separableWithoutTools: true,
        status: 'missing',
        missingDataPoints: ['Fiche technique densité polymère (< 1.0 g/cm3)', 'Certificat de désencrage et adhésif hydrosoluble (EN 13430)'],
      }
    ],
    heavyMetals: {
      pb_mg_kg: 1.5,
      cd_mg_kg: 0.2,
      hg_mg_kg: 0.05,
      crVI_mg_kg: 0.5,
      total_mg_kg: 2.25,
      isCompliant: true,
      labReportNumber: 'EUROFINS-2025-FR-7128',
      testedDate: '2025-10-02',
      sourceSnippet: 'Heavy Metals (Pb+Cd+Hg+Cr VI) sum: 2.25 mg/kg (PPWR Art. 5 limit: 100 mg/kg).',
    },
    pfas: {
      declaredFree: true,
      detectionLimit: '< 5 ppb',
      labCertificateNumber: 'CERT-PFAS-EURO-99',
      sourceSnippet: 'Total organic fluorine: Non-detectable (< 5 ppb). Food contact grade conform to Reg (EU) 10/2011 and PPWR.',
    },
    dimensions: {
      lengthMm: 65,
      widthMm: 65,
      heightMm: 215,
      packagingVolumeCm3: 565,
      productVolumeCm3: 500,
      voidSpaceRatioPercent: 11.5,
      isCompliant: true,
    },
    reusability: {
      isReusable: false,
      intendedRotations: 1,
      systemForReuse: 'none',
    },
    labeling: {
      materialCode: 'PET 01',
      sortingInstructions: 'Bouteille et bouchon solidaire à jeter ensemble dans le bac de tri.',
      qrCodeUrl: 'https://powerppwr.app/trace/VP-BTL-PET-500',
      hasHarmonizedPictogram: true,
    },
    documents: [
      {
        id: 'doc-eurofins-bottle',
        fileName: 'Eurofins_FoodContact_PET_Migration_Test.pdf',
        fileSize: 512000,
        uploadDate: '2025-10-15',
        documentType: 'lab_test_report',
        targetComponentId: 'c1',
        extractionStatus: 'extracted',
        extractionEngine: 'deterministic',
        status: 'compliant',
        textContent: `EUROFINS FOOD & PACKAGING TESTING SERVICES
Test Report: EUROFINS-2025-FR-7128
Sample: Contact-Sensitive Clear Beverage Bottle PET 01 with 35% rPET PCR
Client: AquaViva Bottling Europe SARL

TECHNICAL COMPLIANCE TO REGULATION (EU) 2025/40 (PPWR):
- Article 5 Compliance:
  * Lead (Pb): 1.5 mg/kg
  * Cadmium (Cd): 0.2 mg/kg
  * Mercury (Hg): 0.05 mg/kg
  * Chromium VI: 0.5 mg/kg
  * Total Heavy Metals: 2.25 mg/kg (< 100 mg/kg) - PASS
  * PFAS & Perfluorinated Compounds: Not detected (< 5 ppb) - PASS

- Article 7 Compliance (Recycled Content):
  * Post-Consumer Recycled Plastic (PCR) Content: 35.0%
  * Certification Scheme: EuCertPlast Certificate #EUCP-2025-4491
  * Meets 2030 Target of 30% for contact-sensitive PET single-use beverage bottles.`,
        extractedData: {
          heavyMetals: {
            pb_mg_kg: 1.5,
            cd_mg_kg: 0.2,
            hg_mg_kg: 0.05,
            crVI_mg_kg: 0.5,
            total_mg_kg: 2.25,
            isCompliant: true,
            labReportNumber: 'EUROFINS-2025-FR-7128',
            testedDate: '2025-10-02',
            sourceSnippet: 'Total Heavy Metals: 2.25 mg/kg (< 100 mg/kg) - PASS',
          },
          pfas: {
            declaredFree: true,
            detectionLimit: '< 5 ppb',
            sourceSnippet: 'PFAS & Perfluorinated Compounds: Not detected (< 5 ppb) - PASS',
          },
          recycledContentPercent: 35,
          polymerCode: 'PET 01',
          standardsCited: ['EN 13427', 'EN 13428', 'EN 13430'],
          confidenceScore: 98,
        },
        evidences: [
          {
            id: 'ev-btl-1',
            field: 'heavy_metals_total',
            value: 2.25,
            unit: 'mg/kg',
            documentName: 'Eurofins_FoodContact_PET_Migration_Test.pdf',
            pageNumber: 1,
            verbatimSnippet: 'Total Heavy Metals: 2.25 mg/kg (< 100 mg/kg) - PASS',
            extractionMethod: 'deterministic',
            isVerifiedByHuman: true,
            verifiedAt: '2025-10-16',
          }
        ]
      }
    ]
  },
  {
    id: 'preset-cosmetic-jar',
    name: 'Pot Cosmétique Soin Rechargeable PP 50ml',
    sku: 'DERMA-JAR-PP-50ML',
    brand: 'BioSoin Dermocosmétique',
    category: 'primary',
    userRole: 'manufacturer',
    manufacturer: {
      companyName: 'Laboratoires Cosmétiques Provence SAS',
      address: '45 Boulevard des Lavandes, 13100 Aix-en-Provence, France',
      country: 'France',
      vatNumber: 'FR 32 491 823 704',
      signatoryName: 'Dr. Julien Fournier',
      signatoryRole: 'Responsable Réglementaire Europe & Écoconception',
    },
    components: [
      {
        id: 'c1',
        name: 'Pot Extérieur Rechargeable Polypropylène',
        supplierName: 'Albéa Beauty Solutions',
        supplierContactEmail: 'sustainability@albea-group.com',
        materialType: 'plastic',
        materialCode: 'PP 05',
        weightGrams: 38,
        isMonoMaterial: true,
        recycledPlasticPercent: 30,
        foodContact: true,
        separableWithoutTools: true,
        status: 'compliant',
        missingDataPoints: [],
      },
      {
        id: 'c2',
        name: 'Recharge Pod Intérieur PP Thermoformé',
        supplierName: 'Albéa Beauty Solutions',
        supplierContactEmail: 'sustainability@albea-group.com',
        materialType: 'plastic',
        materialCode: 'PP 05',
        weightGrams: 6.5,
        isMonoMaterial: true,
        recycledPlasticPercent: 15,
        foodContact: true,
        separableWithoutTools: true,
        status: 'compliant',
        missingDataPoints: [],
      }
    ],
    heavyMetals: {
      pb_mg_kg: 3.2,
      cd_mg_kg: 0.3,
      hg_mg_kg: 0.1,
      crVI_mg_kg: 1.1,
      total_mg_kg: 4.7,
      isCompliant: true,
      labReportNumber: 'INTERTEK-2025-COS-418',
      testedDate: '2025-09-18',
      sourceSnippet: 'Total heavy metals concentration: 4.7 mg/kg (< 100 mg/kg threshold).',
    },
    pfas: {
      declaredFree: true,
      detectionLimit: '< 20 ppb',
      sourceSnippet: 'Absence of PFAS and fluorinated coatings confirmed by FTIR and combustion ion chromatography.',
    },
    dimensions: {
      lengthMm: 68,
      widthMm: 68,
      heightMm: 55,
      packagingVolumeCm3: 180,
      productVolumeCm3: 50,
      voidSpaceRatioPercent: 28.0,
      isCompliant: true,
    },
    reusability: {
      isReusable: true,
      intendedRotations: 10,
      systemForReuse: 'open_loop',
      incentiveMechanism: 'Système de capsules recharges interchangeables (Refill system)',
    },
    labeling: {
      materialCode: 'PP 05',
      sortingInstructions: 'Pot et couvercle 100% PP : À déposer dans le bac de tri.',
      qrCodeUrl: 'https://powerppwr.app/trace/VP-JAR-PP-50ML',
      hasHarmonizedPictogram: true,
    },
    documents: [
      {
        id: 'doc-intertek-jar',
        fileName: 'Intertek_Cosmetic_PP_Packaging_Audit.pdf',
        fileSize: 388000,
        uploadDate: '2025-09-25',
        documentType: 'lab_test_report',
        targetComponentId: 'c1',
        extractionStatus: 'extracted',
        extractionEngine: 'deterministic',
        status: 'compliant',
        textContent: `INTERTEK TESTING SERVICES - PACKAGING REGULATORY CERTIFICATION
Report No: INTERTEK-2025-COS-418
Client: Laboratoires Cosmétiques Provence SAS
Product: 50ml Refillable Cosmetic Jar 100% Polypropylene PP 05

REGULATORY EVALUATION ACCORDING TO EU REGULATION 2025/40 (PPWR):
- Article 5 Heavy Metals and Substances of Concern:
  * Sum of Pb + Cd + Hg + Cr VI: 4.7 mg/kg (< 100 mg/kg) - PASS
  * PFAS Free Declaration verified - PASS
- Article 7 Post-Consumer Recycled Content:
  * Outer Jar: 30% ISCC Plus certified circular PP
  * Refill Pod: 15% PCR PP
- Article 10 Reusability Criteria:
  * Engineered for minimum 10 refill rotations (EN 13429:2004 validated).
- Article 6 Recyclability Assessment:
  * 100% Monomaterial PP design.
  * Design for Recycling Grade B (88% recyclability rate).`,
        extractedData: {
          heavyMetals: {
            pb_mg_kg: 3.2,
            cd_mg_kg: 0.3,
            hg_mg_kg: 0.1,
            crVI_mg_kg: 1.1,
            total_mg_kg: 4.7,
            isCompliant: true,
            labReportNumber: 'INTERTEK-2025-COS-418',
            testedDate: '2025-09-18',
            sourceSnippet: 'Sum of Pb + Cd + Hg + Cr VI: 4.7 mg/kg (< 100 mg/kg) - PASS',
          },
          pfas: {
            declaredFree: true,
            sourceSnippet: 'PFAS Free Declaration verified - PASS',
          },
          recycledContentPercent: 28,
          polymerCode: 'PP 05',
          standardsCited: ['EN 13427', 'EN 13428', 'EN 13429', 'EN 13430'],
          confidenceScore: 97,
        },
        evidences: [
          {
            id: 'ev-jar-1',
            field: 'heavy_metals_total',
            value: 4.7,
            unit: 'mg/kg',
            documentName: 'Intertek_Cosmetic_PP_Packaging_Audit.pdf',
            pageNumber: 1,
            verbatimSnippet: 'Sum of Pb + Cd + Hg + Cr VI: 4.7 mg/kg (< 100 mg/kg) - PASS',
            extractionMethod: 'deterministic',
            isVerifiedByHuman: true,
            verifiedAt: '2025-09-26',
          }
        ]
      }
    ]
  }
];
