// Versioned rule table for Regulation (EU) 2025/40 (PPWR).
// Values marked "toVerify" must be confirmed against the official EUR-Lex text before production use.

export const RULES_VERSION = 'EU 2025/40 — ruleset 2025-40.1 (valeurs à vérifier sur EUR-Lex)';

export interface RuleThreshold {
  key: string;
  value: number;
  unit: string;
  appliesFrom: string;
  legalReference: string;
  toVerify?: boolean;
}

export const THRESHOLDS: Record<string, RuleThreshold> = {
  heavyMetalsTotal: { key: 'heavyMetalsTotal', value: 100, unit: 'mg/kg', appliesFrom: '2025-01-01', legalReference: 'Art. 5', toVerify: false },
  voidSpaceMax: { key: 'voidSpaceMax', value: 50, unit: '%', appliesFrom: '2025-01-01', legalReference: 'Art. 21', toVerify: false },
  pcrPetContactSensitive2030: { key: 'pcrPetContactSensitive2030', value: 30, unit: '%', appliesFrom: '2030-01-01', legalReference: 'Art. 7', toVerify: true },
  pcrOtherContactSensitive2030: { key: 'pcrOtherContactSensitive2030', value: 10, unit: '%', appliesFrom: '2030-01-01', legalReference: 'Art. 7', toVerify: true },
  pcrOtherPlastics2030: { key: 'pcrOtherPlastics2030', value: 35, unit: '%', appliesFrom: '2030-01-01', legalReference: 'Art. 7', toVerify: true },
  pfasIndividualLimit: { key: 'pfasIndividualLimit', value: 0.025, unit: 'mg/kg', appliesFrom: '2025-01-01', legalReference: 'Art. 5 (25 ppb)', toVerify: true },
  pfasSumLimit: { key: 'pfasSumLimit', value: 0.25, unit: 'mg/kg', appliesFrom: '2025-01-01', legalReference: 'Art. 5 (250 ppb)', toVerify: true },
  pfasTotalFluorineLimit: { key: 'pfasTotalFluorineLimit', value: 50, unit: 'mg/kg', appliesFrom: '2025-01-01', legalReference: 'Art. 5 (50 ppm F total)', toVerify: true },
};

export const DISCLAIMER = 'Aide à la décision — ne constitue pas un avis juridique. La conformité définitive doit être validée par l\'opérateur économique et, le cas échéant, par un organisme notifié.';
