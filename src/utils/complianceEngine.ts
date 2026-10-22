import { PackagingItem, ComplianceReport, ArticleEvaluation, RecyclabilityGrade, ComplianceStatus } from '../types/ppwr';
import { THRESHOLDS, RULES_VERSION } from '../data/rules2025-40';

export { RULES_VERSION };

const HM_LIMIT = THRESHOLDS.heavyMetalsTotal.value;
const VOID_LIMIT = THRESHOLDS.voidSpaceMax.value;

function gradeFromScore(score: number): RecyclabilityGrade {
  if (score >= 95) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 50) return 'D';
  return 'E';
}

const MATERIAL_POINTS: Record<string, number> = {
  'PAP 20': 25, 'PAP 21': 25, 'PAP 22': 25,
  'GL 70': 25, 'ALU 41': 25, 'FE 40': 22,
  'PET 01': 22, 'HDPE 02': 22, 'PP 05': 22,
  'LDPE 04': 18, 'PS 06': 12,
};

function componentRecyclabilityScore(c: any): number {
  let score = 0;
  score += c.isMonoMaterial ? 40 : 15;
  score += c.separableWithoutTools ? 20 : 5;
  score += MATERIAL_POINTS[c.materialCode] ?? 10;
  const barrier = String(c.barrierOrCoatings || '').toLowerCase();
  if (barrier && barrier !== 'none' && /barrier|coating|pellicul|lamination|pe\b|pvdc|barrière/.test(barrier)) {
    score -= 15;
  }
  return Math.max(0, Math.min(100, score));
}

export function evaluatePackagingCompliance(item: PackagingItem): ComplianceReport {
  const articles: ArticleEvaluation[] = [];

  // ----------------------------------------------------
  // Article 5: substances
  // ----------------------------------------------------
  const hm = item.heavyMetals;
  const hmMissing = !hm;
  const metals = hm ? [hm.pb_mg_kg, hm.cd_mg_kg, hm.hg_mg_kg, hm.crVI_mg_kg] : [];
  const missingMetal = hm ? metals.some(m => m === undefined) : true;
  const hmTotal = hm ? (hm.total_mg_kg ?? (metals.every(m => m !== undefined) ? metals.reduce((a,b)=>(a||0)+(b||0),0) : undefined)) : undefined;
  const hmCompliant = !hmMissing && hmTotal !== undefined && !missingMetal && hmTotal <= HM_LIMIT;

  const pfas = item.pfas;
  const pfasMissing = !pfas;
  let pfasCompliant = false;
  let pfasExceeds = false;
  if (pfas) {
    const individualLimit = THRESHOLDS.pfasIndividualLimit?.value ?? 0.025;
    const sumLimit = THRESHOLDS.pfasSumLimit?.value ?? 0.25;
    const tfLimit = THRESHOLDS.pfasTotalFluorineLimit?.value ?? 50;
    let measuredOk = true;
    if (pfas.substances) {
      for (const s of pfas.substances) {
        if (s.value !== undefined && s.value > (s.limit ?? individualLimit)) { measuredOk = false; pfasExceeds = true; }
      }
    }
    if (pfas.sum !== undefined && pfas.sum > sumLimit) { measuredOk = false; pfasExceeds = true; }
    if (pfas.totalFluorine !== undefined && pfas.totalFluorine > tfLimit) { measuredOk = false; pfasExceeds = true; }

    if (pfas.substances || pfas.sum !== undefined || pfas.totalFluorine !== undefined) {
      pfasCompliant = measuredOk;
    } else {
      pfasCompliant = pfas.declaredFree === true;
    }
    // numeric measurement overrides a positive declaration
    if (pfas.declaredFree === true && !measuredOk) pfasCompliant = false;
  }

  let art5Status: ComplianceStatus = 'compliant';
  if (hmMissing || pfasMissing) {
    art5Status = 'missing';
  } else if (hmTotal !== undefined && hmTotal > HM_LIMIT) {
    art5Status = 'critical';
  } else if (pfasExceeds) {
    art5Status = 'critical';
  } else if (missingMetal || !pfasCompliant) {
    art5Status = 'incomplete';
  } else if (hm.belowLoq) {
    // LOQ is informational, stays compliant
    art5Status = 'compliant';
  }

  articles.push({
    articleNumber: 'Article 5',
    titleFr: 'Exigences relatives aux substances présentes dans les emballages',
    titleEn: 'Requirements for substances in packaging',
    status: art5Status,
    summaryFr: art5Status === 'compliant'
      ? `Conforme : Somme métaux lourds (${hmTotal} mg/kg) ≤ ${HM_LIMIT} mg/kg et PFAS conforme.`
      : (art5Status === 'critical'
          ? `Non conforme : Somme métaux lourds (${hmTotal} mg/kg) dépasse la limite légale de ${HM_LIMIT} mg/kg.`
          : (art5Status === 'missing'
              ? 'Donnée manquante : métaux lourds ou PFAS non renseignés.'
              : 'Dossier incomplet : PFAS non attesté.')),
    summaryEn: art5Status === 'compliant'
      ? `Compliant: Heavy metals sum (${hmTotal} mg/kg) ≤ ${HM_LIMIT} mg/kg and PFAS compliant.`
      : (art5Status === 'critical'
          ? `Non-compliant: Heavy metals sum (${hmTotal} mg/kg) exceeds ${HM_LIMIT} mg/kg legal limit.`
          : (art5Status === 'missing'
              ? 'Missing data: heavy metals or PFAS not provided.'
              : 'Incomplete: PFAS status uncertified.')),
    detailsFr: [
      `Plomb (Pb) : ${hm?.pb_mg_kg ?? 'non testé'} mg/kg${hm?.belowLoq ? ' (< LOQ)' : ''}`,
      `Cadmium (Cd) : ${hm?.cd_mg_kg ?? 'non testé'} mg/kg`,
      `Mercure (Hg) : ${hm?.hg_mg_kg ?? 'non testé'} mg/kg`,
      `Chrome hexavalent (Cr VI) : ${hm?.crVI_mg_kg ?? 'non testé'} mg/kg`,
      `Total cumulé : ${hmTotal ?? 'non testé'} mg/kg (Plafond légal : ${HM_LIMIT} mg/kg)`,
      `Statut PFAS : ${pfas ? (pfasCompliant ? 'Conforme' : 'Non attesté') : 'n.d.'}`,
      `Rapport d'essai accrédité : ${hm?.labReportNumber || 'Non renseigné'}`,
    ],
    detailsEn: [
      `Lead (Pb): ${hm?.pb_mg_kg ?? 'not tested'} mg/kg${hm?.belowLoq ? ' (< LOQ)' : ''}`,
      `Cadmium (Cd): ${hm?.cd_mg_kg ?? 'not tested'} mg/kg`,
      `Mercury (Hg): ${hm?.hg_mg_kg ?? 'not tested'} mg/kg`,
      `Hexavalent Chromium (Cr VI): ${hm?.crVI_mg_kg ?? 'not tested'} mg/kg`,
      `Cumulative Total: ${hmTotal ?? 'not tested'} mg/kg (Legal limit: ${HM_LIMIT} mg/kg)`,
      `PFAS Status: ${pfas ? (pfasCompliant ? 'Compliant' : 'Uncertified') : 'n/a'}`,
      `Accredited Lab Report: ${hm?.labReportNumber || 'Not specified'}`,
    ],
    legalReference: 'Règlement (UE) 2025/40, Article 5, paragraphes 1 à 4',
    evidenceCount: (hm?.sourceSnippet ? 1 : 0) + (pfas?.sourceSnippet ? 1 : 0),
  });

  // ----------------------------------------------------
  // Article 6: recyclability per component
  // ----------------------------------------------------
  const components = item.components || [];
  const isAllMono = components.length > 0 && components.every(c => c.isMonoMaterial);
  const isSeparable = components.length > 0 && components.every(c => c.separableWithoutTools);

  const compScores = components.map(componentRecyclabilityScore);
  const recyclabilityScore = compScores.length ? Math.min(...compScores) : 0;
  // adjust with certificate bonus
  let finalScore = recyclabilityScore;
  finalScore = Math.max(0, Math.min(100, finalScore));

  const recyclabilityGrade = gradeFromScore(finalScore);

  let art6Status: ComplianceStatus = 'compliant';
  if (components.length === 0) art6Status = 'missing';
  else if (recyclabilityGrade === 'D' || recyclabilityGrade === 'E') art6Status = 'critical';
  else if (!item.documents.some(d => d.documentType === 'recyclability_certificate')) art6Status = 'incomplete';

  const worstComponent = components.reduce((w, c, i) => (compScores[i] < (compScores[components.indexOf(w)] ?? 101) ? c : w), components[0]);

  articles.push({
    articleNumber: 'Article 6',
    titleFr: 'Emballages recyclables & Catégories de performance',
    titleEn: 'Recyclable packaging & Recyclability performance grades',
    status: art6Status,
    scorePercent: finalScore,
    summaryFr: `Performance : Note ${recyclabilityGrade} (${finalScore}%). ${art6Status === 'compliant' ? 'Conforme.' : (art6Status === 'incomplete' ? 'Certificat d\'audit à rattacher.' : 'Critique : Grade D/E.')}`,
    summaryEn: `Performance: Grade ${recyclabilityGrade} (${finalScore}%). ${art6Status === 'compliant' ? 'Compliant.' : (art6Status === 'incomplete' ? 'Recyclability certificate pending.' : 'Critical: Grade D/E.')}`,
    detailsFr: [
      `Note de recyclabilité : Grade ${recyclabilityGrade} (Score : ${finalScore}%)`,
      `Conception monomatériau : ${isAllMono ? 'Oui' : 'Multimatériau (pénalité)'}`,
      `Séparabilité manuelle : ${isSeparable ? 'Oui' : 'Non / Outils requis'}`,
      `Composant le plus pénalisant : ${worstComponent?.name || 'n.d.'} (${worstComponent?.materialCode || 'N/A'})`,
      'Exigence 2030 : Note C minimum obligatoire',
      'Exigence 2038 : Note B minimum pour éco-modulation',
    ],
    detailsEn: [
      `Recyclability Grade: Grade ${recyclabilityGrade} (Score: ${finalScore}%)`,
      `Mono-material design: ${isAllMono ? 'Yes' : 'Multi-material (penalty)'}`,
      `Manual component separability: ${isSeparable ? 'Yes' : 'No / Tools required'}`,
      `Most penalising component: ${worstComponent?.name || 'n/a'} (${worstComponent?.materialCode || 'N/A'})`,
      '2030 Requirement: Minimum Grade C',
      '2038 Requirement: Minimum Grade B for eco-modulation',
    ],
    legalReference: 'Règlement (UE) 2025/40, Article 6 & Annexe II',
    evidenceCount: item.documents.filter(d => d.documentType === 'recyclability_certificate').length,
  });

  // ----------------------------------------------------
  // Article 7: PCR weighted by mass per category
  // ----------------------------------------------------
  const plasticComponents = components.filter(c => c.materialType === 'plastic');
  let art7Status: ComplianceStatus = 'compliant';
  let art7SummaryFr = '';
  let art7SummaryEn = '';
  let art7ExtraDetails: string[] = [];

  if (plasticComponents.length === 0) {
    art7SummaryFr = 'Sans objet : cet emballage ne contient pas de plastique.';
    art7SummaryEn = 'Not applicable: no plastic components.';
  } else {
    // group by category
    const groups: { name: string; target: number; items: any[] }[] = [
      { name: 'PET contact sensible', target: THRESHOLDS.pcrPetContactSensitive2030.value, items: plasticComponents.filter(c => c.foodContact && c.materialCode.includes('PET')) },
      { name: 'Autres contacts sensibles', target: THRESHOLDS.pcrOtherContactSensitive2030.value, items: plasticComponents.filter(c => c.foodContact && !c.materialCode.includes('PET')) },
      { name: 'Autres plastiques', target: THRESHOLDS.pcrOtherPlastics2030.value, items: plasticComponents.filter(c => !c.foodContact) },
    ];

    let worstGroup = '';
    let anyBelow = false;
    const details: string[] = [];
    for (const g of groups) {
      if (g.items.length === 0) continue;
      const totalMass = g.items.reduce((a, c) => a + (c.weightGrams || 0), 0);
      const weighted = totalMass > 0
        ? g.items.reduce((a, c) => a + (c.weightGrams || 0) * (c.recycledPlasticPercent || 0), 0) / totalMass
        : g.items.reduce((a, c) => a + (c.recycledPlasticPercent || 0), 0) / g.items.length;
      details.push(`${g.name}: ${weighted.toFixed(1)}% PCR (objectif ${g.target}%)`);
      if (weighted < g.target) { anyBelow = true; worstGroup = g.name; }
    }

    if (anyBelow) {
      art7Status = 'incomplete';
      art7SummaryFr = `Action requise : PCR insuffisant (${worstGroup}).`;
      art7SummaryEn = `Action required: insufficient PCR (${worstGroup}).`;
    } else {
      art7Status = 'compliant';
      art7SummaryFr = 'Conforme : taux PCR pondéré par masse atteint les objectifs 2030.';
      art7SummaryEn = 'Compliant: mass-weighted PCR meets 2030 targets.';
    }

    // store details for article
    art7ExtraDetails = details;
  }

  articles.push({
    articleNumber: 'Article 7',
    titleFr: 'Teneur minimale en matière plastique recyclée',
    titleEn: 'Minimum recycled content in plastic packaging',
    status: art7Status,
    summaryFr: art7SummaryFr,
    summaryEn: art7SummaryEn,
    detailsFr: plasticComponents.map(c =>
      `${c.name} (${c.materialCode}) : ${c.recycledPlasticPercent}% PCR ${c.foodContact ? '(contact sensible)' : ''}`
    ).concat(art7ExtraDetails).concat([
      'Objectifs 2030 : 30% PET contact sensible, 10% autres contacts sensibles, 35% autres plastiques',
      'Objectifs 2040 : 50% PET contact sensible, 25% autres contacts sensibles, 65% autres plastiques',
    ]),
    detailsEn: plasticComponents.map(c =>
      `${c.name} (${c.materialCode}): ${c.recycledPlasticPercent}% PCR ${c.foodContact ? '(contact-sensitive)' : ''}`
    ).concat(art7ExtraDetails).concat([
      '2030 Targets: 30% contact-sensitive PET, 10% other contact-sensitive, 35% other plastics',
      '2040 Targets: 50% contact-sensitive PET, 25% other contact-sensitive, 65% other plastics',
    ]),
    legalReference: 'Règlement (UE) 2025/40, Article 7 & Annexe III',
    evidenceCount: item.documents.filter(d => d.extractedData?.recycledContentPercent !== undefined).length,
  });

  // ----------------------------------------------------
  // Article 9 & 21: void space calculated
  // ----------------------------------------------------
  const isTransportOrEcommerce = item.category === 'transport' || item.category === 'secondary';
  const dims = item.dimensions;
  const hasDims = !!dims && !!dims.packagingVolumeCm3 && dims.packagingVolumeCm3 > 0 && dims.productVolumeCm3 !== undefined && dims.productVolumeCm3 >= 0;
  let voidRatio = 0;
  let voidStatus: ComplianceStatus = 'compliant';
  if (!hasDims) {
    voidStatus = 'missing';
  } else {
    voidRatio = ((dims!.packagingVolumeCm3 - dims!.productVolumeCm3) / dims!.packagingVolumeCm3) * 100;
    if (voidRatio < 0) voidStatus = 'missing';
    else if (isTransportOrEcommerce && voidRatio > VOID_LIMIT) voidStatus = 'critical';
  }

  articles.push({
    articleNumber: 'Article 9 & 21',
    titleFr: 'Réduction de l\'emballage & Taux d\'espace vide maximal',
    titleEn: 'Packaging minimization & Maximum void space ratio',
    status: voidStatus,
    summaryFr: isTransportOrEcommerce
      ? `Taux d'espace vide calculé à ${voidRatio.toFixed(1)}%. ${voidStatus === 'compliant' ? 'Conforme.' : (voidStatus === 'missing' ? 'Donnée manquante.' : 'Critique : dépasse 50%.')}`
      : `Emballage primaire optimisé (${dims?.packagingVolumeCm3 ?? 'n.d.'} cm³).`,
    summaryEn: isTransportOrEcommerce
      ? `Calculated void space ratio is ${voidRatio.toFixed(1)}%. ${voidStatus === 'compliant' ? 'Compliant.' : (voidStatus === 'missing' ? 'Missing data.' : 'Critical: exceeds 50%.')}`
      : `Primary packaging volume optimized (${dims?.packagingVolumeCm3 ?? 'n/a'} cm³).`,
    detailsFr: [
      `Dimensions : ${dims?.lengthMm ?? 'n.d.'} × ${dims?.widthMm ?? 'n.d.'} × ${dims?.heightMm ?? 'n.d.'} mm`,
      `Volume brut : ${dims?.packagingVolumeCm3 ?? 'n.d.'} cm³`,
      `Volume net : ${dims?.productVolumeCm3 ?? 'n.d.'} cm³`,
      `Taux d'espace vide : ${voidRatio.toFixed(1)}%`,
    ],
    detailsEn: [
      `Dimensions: ${dims?.lengthMm ?? 'n/a'} × ${dims?.widthMm ?? 'n/a'} × ${dims?.heightMm ?? 'n/a'} mm`,
      `Gross volume: ${dims?.packagingVolumeCm3 ?? 'n/a'} cm³`,
      `Net volume: ${dims?.productVolumeCm3 ?? 'n/a'} cm³`,
      `Void space ratio: ${voidRatio.toFixed(1)}%`,
    ],
    legalReference: 'Règlement (UE) 2025/40, Article 9 et Article 21, paragraphe 1',
    evidenceCount: 1,
  });

  // ----------------------------------------------------
  // Article 10 & 26: reusable
  // ----------------------------------------------------
  const ru = item.reusability;
  let art10Status: ComplianceStatus = 'compliant';
  if (ru?.isReusable) {
    if (!ru.systemForReuse || ru.systemForReuse === 'none' || !ru.intendedRotations || ru.intendedRotations < 1) {
      art10Status = 'incomplete';
    }
  }
  articles.push({
    articleNumber: 'Article 10 & 26',
    titleFr: 'Emballages réemployables & Systèmes de réemploi',
    titleEn: 'Reusable packaging & Systems for reuse',
    status: art10Status,
    summaryFr: ru?.isReusable
      ? `Emballage conçu pour le réemploi (${ru.intendedRotations} rotations).`
      : 'Emballage à usage unique conforme aux règles de recyclabilité.',
    summaryEn: ru?.isReusable
      ? `Packaging engineered for reuse (${ru.intendedRotations} rotations).`
      : 'Single-use packaging compliant with recyclability design rules.',
    detailsFr: [
      `Conception réemployable : ${ru?.isReusable ? 'Oui' : 'Non'}`,
      ru?.isReusable ? `Rotations : ${ru.intendedRotations}` : 'Usage unique recyclable',
      ru?.isReusable ? `Système : ${ru.systemForReuse}` : 'Filière de collecte',
    ],
    detailsEn: [
      `Reusable design: ${ru?.isReusable ? 'Yes' : 'No'}`,
      ru?.isReusable ? `Rotations: ${ru.intendedRotations}` : 'Single-use recyclable',
      ru?.isReusable ? `System: ${ru.systemForReuse}` : 'Collection stream',
    ],
    legalReference: 'Règlement (UE) 2025/40, Article 10 et Article 26',
    evidenceCount: 1,
  });

  // ----------------------------------------------------
  // Article 11: labeling
  // ----------------------------------------------------
  const hasValidLabeling = !!item.labeling?.hasHarmonizedPictogram && !!item.labeling?.materialCode;
  articles.push({
    articleNumber: 'Article 11',
    titleFr: 'Exigences d\'étiquetage, de marquage et d\'information',
    titleEn: 'Labelling, marking and information requirements',
    status: hasValidLabeling ? 'compliant' : 'incomplete',
    summaryFr: hasValidLabeling
      ? `Marquage harmonisé conforme : ${item.labeling.materialCode}.`
      : 'Information requise : pictogramme de tri harmonisé et code matière.',
    summaryEn: hasValidLabeling
      ? `Harmonised marking compliant: ${item.labeling.materialCode}.`
      : 'Information needed: EU harmonised sorting pictogram and material code.',
    detailsFr: [
      `Code matière : ${item.labeling?.materialCode || 'n.d.'}`,
      `Instructions de tri : ${item.labeling?.sortingInstructions || 'n.d.'}`,
      `QR Code : ${item.labeling?.qrCodeUrl ? 'Configuré' : 'Non'}`,
    ],
    detailsEn: [
      `Material code: ${item.labeling?.materialCode || 'n/a'}`,
      `Sorting instructions: ${item.labeling?.sortingInstructions || 'n/a'}`,
      `QR Code: ${item.labeling?.qrCodeUrl ? 'Configured' : 'No'}`,
    ],
    legalReference: 'Règlement (UE) 2025/40, Article 11',
    evidenceCount: 1,
  });

  // ----------------------------------------------------
  // Overall
  // ----------------------------------------------------
  const hasCritical = articles.some(a => a.status === 'critical');
  const hasIncomplete = articles.some(a => a.status === 'incomplete');
  const hasMissing = articles.some(a => a.status === 'missing') || (item.components || []).some(c => c.status === 'missing') || hmMissing || pfasMissing;

  let overallStatus: ComplianceStatus = 'compliant';
  if (hasCritical) overallStatus = 'critical';
  else if (hasMissing) overallStatus = 'missing';
  else if (hasIncomplete) overallStatus = 'incomplete';

  // Standards
  const citedStandardsInDocs = new Set(item.documents.flatMap(d => d.extractedData?.standardsCited || []));

  const harmonizedStandards = [
    { code: 'EN 13427:2004', titleFr: 'Exigences relatives à l\'utilisation des normes européennes', titleEn: 'Requirements for the use of European Standards', isReferenced: citedStandardsInDocs.has('EN 13427:2004') || citedStandardsInDocs.has('EN 13427') },
    { code: 'EN 13428:2004', titleFr: 'Exigences spécifiques à la fabrication et à la composition', titleEn: 'Packaging - Requirements specific to manufacturing and composition', isReferenced: citedStandardsInDocs.has('EN 13428:2004') || citedStandardsInDocs.has('EN 13428') },
    { code: 'EN 13429:2004', titleFr: 'Emballage - Réutilisation', titleEn: 'Packaging - Reuse', isReferenced: !!item.reusability?.isReusable },
    { code: 'EN 13430:2004', titleFr: 'Exigences pour les emballages valorisables par recyclage matière', titleEn: 'Packaging - Requirements for packaging recoverable by material recycling', isReferenced: finalScore >= 70 },
    { code: 'EN 13431:2004', titleFr: 'Exigences pour les emballages valorisables par récupération d\'énergie', titleEn: 'Packaging - Requirements for packaging recoverable in the form of energy recovery', isReferenced: false },
    { code: 'EN 13432:2000', titleFr: 'Exigences pour les emballages valorisables par compostage et biodégradation', titleEn: 'Packaging - Requirements for packaging recoverable through composting and biodegradation', isReferenced: false },
  ];

  return { overallStatus, recyclabilityGrade, recyclabilityScore: finalScore, articles, harmonizedStandards };
}
