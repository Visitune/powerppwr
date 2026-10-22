import React, { useState } from 'react';
import { Language } from '../types/ppwr';
import { translations } from '../utils/i18n';
import { 
  Calculator, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Euro, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Quote, 
  Building2, 
  Users, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

interface PricingCalculatorProps {
  language: Language;
  onNavigateToWorkflow: () => void;
  onNavigateToVault: () => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  language,
  onNavigateToWorkflow,
  onNavigateToVault,
}) => {
  const t = translations[language];
  const p = t.pricing;

  // Simulator State
  const [skuCount, setSkuCount] = useState<number>(35);
  const [componentsPerSku, setComponentsPerSku] = useState<number>(3);
  const [consultantRate, setConsultantRate] = useState<number>(1800); // Euros per manual declaration
  const [internalHours, setInternalHours] = useState<number>(14); // Hours spent per declaration
  const hourlyInternalRate = 65; // EUR/h internal engineering cost

  // Calculated economics
  const totalManualCost = Math.round(skuCount * consultantRate);
  const totalManualHours = Math.round(skuCount * internalHours);
  const totalManualInternalCost = Math.round(totalManualHours * hourlyInternalRate);
  const grandTotalManualCost = totalManualCost + totalManualInternalCost;

  // powerPPWR cost estimate based on tiers
  let powerPPWRCost = 299 * 12;
  if (skuCount > 25 && skuCount <= 100) {
    powerPPWRCost = 599 * 12;
  } else if (skuCount > 100) {
    powerPPWRCost = 990 * 12;
  }

  const netSavings = Math.max(0, grandTotalManualCost - powerPPWRCost);
  const hoursSaved = Math.max(0, Math.round(totalManualHours * 0.95));
  const savingsPercent = Math.min(95, Math.round((netSavings / grandTotalManualCost) * 100));

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
    3: false,
  });

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const faqs = language === 'fr' ? [
    {
      q: 'Comment powerPPWR garantit-il la conformité légale face aux douanes et auditeurs de l\'UE ?',
      a: 'powerPPWR génère les Déclarations UE de Conformité rigoureusement basées sur la structure officielle de l\'Annexe VII du Règlement (UE) 2025/40. Chaque paramètre (métaux lourds Art. 5, recyclabilité Art. 6, PCR Art. 7, taux de vide Art. 21) est directement relié au rapport d\'essai du sous-traitant (RoHS, SGS, EuCertPlast) archivé dans le dossier technique opposable pendant 10 ans.'
    },
    {
      q: 'Que se passe-t-il si un fournisseur refuse de partager la composition exacte de son emballage ?',
      a: 'Le secret industriel est protégé : le fournisseur n\'a pas besoin de dévoiler sa formulation brevetée. Il lui suffit de transmettre une attestation certifiant le respect des seuils limites PPWR (< 100 ppm métaux lourds, conformité PFAS, note de recyclabilité). powerPPWR génère automatiquement en 1 clic les courriers types de demande de preuves conformes au PPWR.'
    },
    {
      q: 'Quelle est la différence entre le moteur déterministe et l\'option IA ?',
      a: 'Le moteur déterministe fonctionne 100% en local dans votre navigateur par analyse de flux textuel PDF sans aucun envoi vers des serveurs externes : confidentialité bancaire absolue. L\'option IA (Gemini 3.8 Flash) est réservée aux documents scannés ou manuscrits complexes, toujours accompagnée d\'une revue humaine obligatoire (HITL) avec citation du passage exact.'
    },
    {
      q: 'Quelles sont les échéances clés à respecter pour les entreprises ?',
      a: 'Le Règlement est entré en vigueur le 12 février 2025. Les obligations de Déclaration de Conformité et de dossier technique entrent en vigueur générale le 12 août 2026. Les seuils de recyclabilité minimale (Grade C) et les quotas de plastique recyclé s\'appliqueront dès le 1er janvier 2030.'
    }
  ] : [
    {
      q: 'How does powerPPWR ensure legal compliance for EU customs and market surveillance authorities?',
      a: 'powerPPWR generates EU Declarations of Conformity strictly aligned with the mandatory template in Annex VII of EU Regulation 2025/40. Every audited data point (heavy metals Art. 5, recyclability Art. 6, PCR Art. 7, void ratio Art. 21) is directly bound to a verifiable supplier test report (RoHS, SGS, EuCertPlast) preserved in the 10-year audit technical file.'
    },
    {
      q: 'What if a supplier refuses to disclose their proprietary packaging formulation?',
      a: 'Trade secrets remain fully protected: suppliers are not required to disclose confidential recipes. They only need to provide standardized test certificates verifying compliance with PPWR thresholds (< 100 ppm heavy metals, PFAS restrictions, recyclability rating). powerPPWR provides 1-click compliant follow-up templates.'
    },
    {
      q: 'What is the distinction between the Deterministic Engine and optional AI?',
      a: 'The deterministic engine operates 100% locally in your browser via rule-based regex parsing of PDF text streams with zero external data transmission. The optional AI engine (Gemini 3.8 Flash) helps parse scanned or non-standard PDFs, always pairing extracted figures with verbatim quotations for mandatory Human-in-the-Loop approval.'
    },
    {
      q: 'What are the critical compliance enforcement dates?',
      a: 'Regulation 2025/40 entered into force on February 12, 2025. General obligations for Declaration of Conformity and technical documentation take effect on August 12, 2026. Mandatory circular design thresholds (Grade C minimum) and recycled plastic content targets apply starting January 1, 2030.'
    }
  ];

  const testimonials = [
    {
      name: 'Ulrich M.',
      roleFr: 'Directeur Packaging & Qualité, Coopérative Laitière',
      roleEn: 'Packaging & Quality Director, Dairy Cooperative',
      quoteFr: 'Le concept est d\'une logique implacable. Nous gérons plus de 120 SKUs de yaourts et briques : powerPPWR a transformé 3 mois de collecte de fiches fournisseurs en un dossier technique prêt pour l\'audit en 2 jours.',
      quoteEn: 'The concept is brilliantly logical. We manage over 120 SKUs of dairy packaging: powerPPWR turned 3 months of supplier paperwork into an audit-ready technical file in just 2 days.',
      metricsFr: '-92% de temps passé · 124 Déclarations UE émises',
      metricsEn: '-92% time spent · 124 EU Declarations generated',
    },
    {
      name: 'Katharina B.',
      roleFr: 'Responsable RSE & Écoconception, Transformation Fruitière',
      roleEn: 'CSR & Ecodesign Lead, Fruit Processing Group',
      quoteFr: 'Le contrôle déterministe en local sans fuite de données vers des serveurs tiers nous a immédiatement convaincus. Le calcul automatique du ratio de vide à 50% sur nos barquettes est redoutable.',
      quoteEn: 'The local deterministic extraction without cloud data leakage immediately sold our board. The automated 50% void space ratio check for our produce trays is indispensable.',
      metricsFr: '100% conformité Art. 21 · Dossier technique opposable',
      metricsEn: '100% Art. 21 compliance · 10-year audit safe',
    },
    {
      name: 'Bart V.',
      roleFr: 'Directeur Supply Chain & Achats, Industrie Agroalimentaire',
      roleEn: 'Supply Chain & Procurement VP, Meat & Prepared Foods',
      quoteFr: 'La fonction de relance automatique des fournisseurs pour les certificats PFAS et métaux lourds manquants nous a évité de payer des dizaines de milliers d\'euros d\'audits externes.',
      quoteEn: 'The automated 1-click supplier follow-up for missing PFAS and heavy metal test reports saved us tens of thousands of euros in external consultancy fees.',
      metricsFr: '48 000 € d\'économies annuelles réalisées',
      metricsEn: '€48,000 annual net savings realized',
    },
  ];

  return (
    <div className="space-y-12">
      
      {/* Header Banner */}
      <div className="border-b dark:border-slate-800 border-slate-200 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-[2px] w-8 bg-[#F97316]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C] font-bold">
            POWER PPWR ROI CALCULATOR & TIERS
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight dark:text-white text-slate-900">
          {p.title}
        </h1>
        <p className="mt-2 text-sm dark:text-slate-400 text-slate-600 max-w-3xl leading-relaxed">
          {p.subtitle}
        </p>
      </div>

      {/* Interactive ROI & Savings Simulator */}
      <div className="rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-6 sm:p-8 shadow-sm transition-colors space-y-8">
        <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F97316]/10 text-[#9A3412] dark:text-[#FB923C]">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold dark:text-white text-slate-900">
                {p.calcTitle}
              </h2>
              <span className="text-xs dark:text-slate-400 text-slate-600 font-mono">
                {language === 'fr' ? 'Modélisation basée sur les coûts observés en Europe (Règlement UE 2025/40)' : 'Modeled from average EU packaging compliance costs (EU 2025/40)'}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-slate-100 text-xs font-mono font-bold dark:text-slate-300 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{p.speedUp}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Slider 1: SKU Count */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <label className="dark:text-slate-300 text-slate-700">
                  {p.skuCount}
                </label>
                <span className="font-mono text-base font-bold text-[#C2410C] dark:text-[#FB923C] dark:bg-slate-800 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200 dark:border-slate-700">
                  {skuCount} SKUs
                </span>
              </div>
              <input
                type="range"
                aria-label={p.skuCount}
                min="5"
                max="250"
                step="5"
                value={skuCount}
                onChange={(e) => setSkuCount(Number(e.target.value))}
                className="w-full accent-[#F97316] cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                <span>5 SKUs (Atelier)</span>
                <span>50 SKUs (PME)</span>
                <span>250+ SKUs (Industrie)</span>
              </div>
            </div>

            {/* Slider 2: Components Per SKU */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <label className="dark:text-slate-300 text-slate-700">
                  {p.componentsCount}
                </label>
                <span className="font-mono text-sm font-bold text-[#6D28D9] dark:text-[#A78BFA] dark:bg-slate-800 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200 dark:border-slate-700">
                  {componentsPerSku} {language === 'fr' ? 'composants' : 'components'}
                </span>
              </div>
              <input
                type="range"
                aria-label={language === 'fr' ? 'Composants par SKU' : 'Components per SKU'}
                min="1"
                max="8"
                step="1"
                value={componentsPerSku}
                onChange={(e) => setComponentsPerSku(Number(e.target.value))}
                className="w-full accent-[#8B5CF6] cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                <span>1 (Monoproduit)</span>
                <span>3 (Bouteille + Bouchon + Étiquette)</span>
                <span>8 (Emballage complexe)</span>
              </div>
            </div>

            {/* Parameter Inputs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/60 bg-slate-50 space-y-1">
                <label className="text-[11px] font-semibold dark:text-slate-400 text-slate-600 block">
                  {p.consultantCostPerDoC}
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    aria-label={p.consultantCostPerDoC}
                    value={consultantRate}
                    onChange={(e) => setConsultantRate(Math.max(100, Number(e.target.value)))}
                    className="w-24 text-sm font-mono font-bold px-2 py-1 rounded border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white dark:text-white text-slate-900 focus:outline-none focus:border-[#F97316]"
                  />
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400">€ / SKU</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/60 bg-slate-50 space-y-1">
                <label className="text-[11px] font-semibold dark:text-slate-400 text-slate-600 block">
                  {p.internalHoursPerDoC}
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    aria-label={p.internalHoursPerDoC}
                    value={internalHours}
                    onChange={(e) => setInternalHours(Math.max(1, Number(e.target.value)))}
                    className="w-24 text-sm font-mono font-bold px-2 py-1 rounded border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white dark:text-white text-slate-900 focus:outline-none focus:border-[#F97316]"
                  />
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{language === 'fr' ? 'heures / SKU' : 'hours / SKU'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-5 rounded-2xl border dark:border-slate-800 border-slate-200 bg-gradient-to-br dark:from-[#0B1120] dark:to-[#1E293B] from-orange-50/50 to-indigo-50/40 p-6 shadow-md space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#C2410C] dark:text-[#FB923C] font-bold">
                {p.resultsTitle}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#C2410C] dark:text-[#FB923C]">
                  {netSavings.toLocaleString()} €
                </span>
                <span className="text-xs font-mono font-semibold dark:text-slate-400 text-slate-600">
                  {language === 'fr' ? '/ an net' : '/ year net'}
                </span>
              </div>
              <p className="text-xs dark:text-slate-300 text-slate-700 mt-1">
                {language === 'fr' 
                  ? `Soit une rentabilité immédiate avec ${savingsPercent}% de réduction des coûts de mise en conformité.`
                  : `Delivering instant ROI with a ${savingsPercent}% net reduction in compliance operational expenses.`}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t dark:border-slate-700/60 border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="dark:text-slate-400 text-slate-600 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-[#6D28D9] dark:text-[#A78BFA]" />
                  <span>{p.totalHoursSaved} :</span>
                </span>
                <span className="font-mono font-bold text-[#6D28D9] dark:text-[#A78BFA] text-sm">
                  {hoursSaved.toLocaleString()} {language === 'fr' ? 'heures' : 'hours'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="dark:text-slate-400 text-slate-600 flex items-center gap-1.5">
                  <Euro className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  <span>{language === 'fr' ? 'Coût méthode traditionnelle :' : 'Traditional manual cost:'}</span>
                </span>
                <span className="font-mono font-semibold text-slate-600 dark:text-slate-400 line-through">
                  {grandTotalManualCost.toLocaleString()} €
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="dark:text-slate-400 text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#C2410C] dark:text-[#FB923C]" />
                  <span>{language === 'fr' ? 'Abonnement powerPPWR :' : 'powerPPWR subscription:'}</span>
                </span>
                <span className="font-mono font-bold dark:text-white text-slate-900">
                  {powerPPWRCost.toLocaleString()} € / an
                </span>
              </div>
            </div>

            <button
              onClick={onNavigateToWorkflow}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-orange-500 to-[#F97316] hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>{language === 'fr' ? 'Tester sur votre Produit (5 min)' : 'Test on your Packaging (5 min)'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Power PPWR Pricing Tiers */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-display text-2xl font-extrabold tracking-tight dark:text-white text-slate-900">
            {p.tiersTitle}
          </h2>
          <p className="text-sm dark:text-slate-400 text-slate-600">
            {language === 'fr' ? 'Une tarification prévisible et sans surprise, dimensionnée selon votre parc d\'emballages.' : 'Predictable pricing aligned with your packaging portfolio scale.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Plan 1: Starter */}
          <div className="rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-6 shadow-sm flex flex-col justify-between transition-all hover:border-slate-400 dark:hover:border-slate-600">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase">
                  STARTER
                </span>
                <h3 className="text-xl font-extrabold dark:text-white text-slate-900 mt-1">
                  {p.starterTitle}
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-600 mt-1.5 leading-relaxed">
                  {p.starterDesc}
                </p>
              </div>

              <div className="pt-2">
                <span className="font-display text-3xl font-extrabold dark:text-white text-slate-900">
                  {p.starterPrice}
                </span>
                <span className="text-xs dark:text-slate-400 text-slate-600 ml-1">
                  {p.starterPeriod}
                </span>
              </div>

              <div className="space-y-2.5 pt-4 border-t dark:border-slate-800 border-slate-100 text-xs">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="dark:text-slate-300 text-slate-700">
                    {language === 'fr' ? 'Jusqu\'à 25 Déclarations UE de Conformité' : 'Up to 25 EU Declarations of Conformity'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="dark:text-slate-300 text-slate-700">
                    {language === 'fr' ? 'Moteur d\'extraction déterministe (zéro-IA)' : 'Deterministic PDF extraction (zero-AI)'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="dark:text-slate-300 text-slate-700">
                    {language === 'fr' ? 'Archivage opposable 10 ans (Art. 13)' : '10-year audit-ready dossier storage'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="dark:text-slate-300 text-slate-700">
                    {language === 'fr' ? 'Export Déclaration PDF certifiée & JSON' : 'Export vector PDF & machine-readable JSON'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateToWorkflow}
              className="mt-6 w-full py-2.5 px-4 rounded-xl font-bold text-xs border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-white text-slate-800 transition-colors"
            >
              {language === 'fr' ? 'Sélectionner Starter' : 'Choose Starter'}
            </button>
          </div>

          {/* Plan 2: Growth (Recommended) */}
          <div className="rounded-2xl border-2 border-[#F97316] dark:bg-[#111827] bg-white p-6 shadow-xl shadow-orange-500/10 flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#F97316] text-white text-[10px] font-mono font-bold tracking-widest uppercase shadow-sm">
              {language === 'fr' ? 'PLÉBISCITÉ PAR LES INDUSTRIELS' : 'MOST POPULAR'}
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#C2410C] dark:text-[#FB923C] uppercase">
                  GROWTH INDUSTRIAL
                </span>
                <h3 className="text-xl font-extrabold dark:text-white text-slate-900 mt-1">
                  {p.growthTitle}
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-600 mt-1.5 leading-relaxed">
                  {p.growthDesc}
                </p>
              </div>

              <div className="pt-2">
                <span className="font-display text-3xl font-extrabold text-[#C2410C] dark:text-[#FB923C]">
                  {p.growthPrice}
                </span>
                <span className="text-xs dark:text-slate-400 text-slate-600 ml-1">
                  {p.growthPeriod}
                </span>
              </div>

              <div className="space-y-2.5 pt-4 border-t dark:border-slate-800 border-slate-100 text-xs">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#C2410C] dark:text-[#FB923C] shrink-0 mt-0.5" />
                  <span className="font-semibold dark:text-white text-slate-900">
                    {language === 'fr' ? 'Jusqu\'à 100 Déclarations UE de Conformité' : 'Up to 100 EU Declarations of Conformity'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#C2410C] dark:text-[#FB923C] shrink-0 mt-0.5" />
                  <span className="dark:text-slate-300 text-slate-700">
                    {language === 'fr' ? 'Extraction Double Moteur : Zéro-IA + Gemini Flash' : 'Dual Extraction: Zero-AI + Gemini Flash'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#C2410C] dark:text-[#FB923C] shrink-0 mt-0.5" />
                  <span className="dark:text-slate-300 text-slate-700">
                    {language === 'fr' ? 'Générateur de relances fournisseurs 1-clic' : '1-click automated supplier gap emails'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#C2410C] dark:text-[#FB923C] shrink-0 mt-0.5" />
                  <span className="dark:text-slate-300 text-slate-700">
                    {language === 'fr' ? 'Matrice des 5 rôles UE (Art. 13 à 17)' : '5 EU Supply Chain Roles matrix (Art. 13-17)'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#C2410C] dark:text-[#FB923C] shrink-0 mt-0.5" />
                  <span className="dark:text-slate-300 text-slate-700">
                    {language === 'fr' ? 'Revue Humaine intégrée (HITL) avec preuves citées' : 'Integrated Human-in-the-Loop review citations'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateToVault}
              className="mt-6 w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-[#C2410C] hover:bg-[#9A3412] text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer"
            >
              {language === 'fr' ? 'Démarrer avec Growth' : 'Start with Growth'}
            </button>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-6 shadow-sm flex flex-col justify-between transition-all hover:border-[#8B5CF6]">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#6D28D9] dark:text-[#A78BFA] uppercase">
                  ENTERPRISE
                </span>
                <h3 className="text-xl font-extrabold dark:text-white text-slate-900 mt-1">
                  {p.enterpriseTitle}
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-600 mt-1.5 leading-relaxed">
                  {p.enterpriseDesc}
                </p>
              </div>

              <div className="pt-2">
                <span className="font-display text-3xl font-extrabold text-[#6D28D9] dark:text-[#A78BFA]">
                  {p.enterprisePrice}
                </span>
                <span className="text-xs dark:text-slate-400 text-slate-600 ml-1">
                  {p.enterprisePeriod}
                </span>
              </div>

              <div className="space-y-2.5 pt-4 border-t dark:border-slate-800 border-slate-100 text-xs">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#6D28D9] dark:text-[#A78BFA] shrink-0 mt-0.5" />
                  <span className="font-semibold dark:text-white text-slate-900">
                    {language === 'fr' ? 'Portefeuilles illimités 500+ SKUs' : 'Unlimited 500+ SKU packaging lines'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#6D28D9] dark:text-[#A78BFA] shrink-0 mt-0.5" />
                  <span className="dark:text-slate-300 text-slate-700">
                    {language === 'fr' ? 'Intégration directe VisiPLM & ERP industriel' : 'Direct VisiPLM & ERP enterprise API'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#6D28D9] dark:text-[#A78BFA] shrink-0 mt-0.5" />
                  <span className="dark:text-slate-300 text-slate-700">
                    {language === 'fr' ? 'Conseil d\'excellence sur site par VisiPilot' : 'On-site industrial advisory by VisiPilot'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-[#6D28D9] dark:text-[#A78BFA] shrink-0 mt-0.5" />
                  <span className="dark:text-slate-300 text-slate-700">
                    {language === 'fr' ? 'Accompagnement audit douanier dédié' : 'Dedicated market surveillance audit defense'}
                  </span>
                </div>
              </div>
            </div>

            <a
              href="mailto:contact@visipilot.com?subject=Demande%20powerPPWR%20Enterprise"
              className="mt-6 w-full py-2.5 px-4 rounded-xl font-bold text-xs border border-[#8B5CF6]/40 dark:bg-purple-950/20 bg-purple-50 text-[#6D28D9] dark:text-[#A78BFA] hover:bg-purple-100 dark:hover:bg-purple-950/40 transition-colors text-center block"
            >
              {language === 'fr' ? 'Contacter VisiPilot' : 'Contact VisiPilot'}
            </a>
          </div>

        </div>
      </div>

      {/* Comparison Table: Spreadsheets vs Consultants vs powerPPWR */}
      <div className="rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-6 sm:p-8 shadow-sm transition-colors space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-[2px] w-6 bg-[#F97316]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C] font-bold">
              BENCHMARK
            </span>
          </div>
          <h2 className="text-xl font-extrabold dark:text-white text-slate-900">
            {p.comparisonTitle}
          </h2>
          <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">
            {language === 'fr'
              ? 'L\'approche traditionnelle face aux exigences contraignantes du Règlement UE 2025/40.'
              : 'How traditional approaches fail under the strict enforcement rules of EU 2025/40.'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b dark:border-slate-800 border-slate-200 text-slate-600 dark:text-slate-400 font-mono">
                <th className="py-3 px-4 font-semibold">{language === 'fr' ? 'Critère de Conformité' : 'Compliance Criterion'}</th>
                <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">{p.colSpreadsheet}</th>
                <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">{p.colConsultant}</th>
                <th className="py-3 px-4 font-bold text-[#C2410C] dark:text-[#FB923C] dark:bg-orange-950/20 bg-orange-50/80 rounded-t-lg">
                  {p.colPowerPPWR}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800 divide-slate-100">
              <tr>
                <td className="py-3.5 px-4 font-semibold dark:text-white text-slate-900">{p.criteriaSpeed}</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">2 à 4 semaines par produit</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">3 à 6 semaines par lot</td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-400 dark:bg-orange-950/20 bg-orange-50/80">
                  ⚡ 5 minutes par SKU
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold dark:text-white text-slate-900">{p.criteriaCost}</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">800 € en temps interne non tracé</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">1 500 € à 3 000 € / SKU</td>
                <td className="py-3.5 px-4 font-bold text-[#C2410C] dark:text-[#FB923C] dark:bg-orange-950/20 bg-orange-50/80">
                  À partir de 12 € / SKU
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold dark:text-white text-slate-900">{p.criteriaAudit}</td>
                <td className="py-3.5 px-4 text-red-600 dark:text-red-400 flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Non conforme (liens cassés, pas de traçabilité)</span>
                </td>
                <td className="py-3.5 px-4 text-amber-800 dark:text-amber-400">Rapport ponctuel figé dans le temps</td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-400 dark:bg-orange-950/20 bg-orange-50/80">
                  ✔ Coffre-fort numérique opposable 10 ans
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold dark:text-white text-slate-900">{p.criteriaSuppliers}</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">Emails manuels perdus et sans suivi</td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">Facturé en supplément par le cabinet</td>
                <td className="py-3.5 px-4 font-bold text-[#6D28D9] dark:text-[#A78BFA] dark:bg-orange-950/20 bg-orange-50/80">
                  ✔ Relances automatiques en 1 clic
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold dark:text-white text-slate-900">{p.criteriaEngine}</td>
                <td className="py-3.5 px-4 text-red-600 dark:text-red-400 flex items-center gap-1">
                  <XCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Risque élevé d'erreur humaine</span>
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">Évaluation manuelle dépendante de l'auditeur</td>
                <td className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-400 dark:bg-orange-950/20 bg-orange-50/80">
                  ✔ 100% Déterministe & Zéro hallucination
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Regulatory FAQ Accordion */}
      <div className="rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-6 sm:p-8 shadow-sm transition-colors space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-[2px] w-6 bg-[#F97316]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C] font-bold">
              FAQ PPWR
            </span>
          </div>
          <h2 className="text-xl font-extrabold dark:text-white text-slate-900">
            {p.faqTitle}
          </h2>
        </div>

        <div className="divide-y dark:divide-slate-800 divide-slate-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between text-left text-xs font-bold dark:text-white text-slate-900 gap-4 hover:text-[#F97316] transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq[idx] ? (
                  <ChevronUp className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq[idx] && (
                <p className="mt-2 text-xs dark:text-slate-400 text-slate-600 leading-relaxed pr-8">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
