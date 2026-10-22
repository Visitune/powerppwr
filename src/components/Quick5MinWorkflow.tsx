import React from 'react';
import { ComplianceReport, Language, PackagingItem } from '../types/ppwr';
import { translations } from '../utils/i18n';
import { 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck2, 
  AlertTriangle, 
  FileText, 
  Mail, 
  Sparkles,
  Layers,
  Calculator
} from 'lucide-react';

interface Quick5MinWorkflowProps {
  item: PackagingItem;
  report: ComplianceReport;
  language: Language;
  onNavigate: (tab: 'vault' | 'compliance' | 'declaration' | 'regulatory' | 'gaps' | 'roles' | 'pricing') => void;
}

export const Quick5MinWorkflow: React.FC<Quick5MinWorkflowProps> = ({
  item,
  report,
  language,
  onNavigate,
}) => {
  const t = translations[language];

  const steps = [
    {
      num: 1,
      titleFr: 'Configuration du Produit & Composants',
      titleEn: 'Product & Components Configuration',
      descFr: `${item.components.length} composants configurés (${item.name})`,
      descEn: `${item.components.length} components specified (${item.name})`,
      isDone: item.components.length > 0,
      tab: 'vault' as const,
    },
    {
      num: 2,
      titleFr: 'Coffre-fort des Documents Fournisseurs',
      titleEn: 'Supplier Document Vault',
      descFr: `${item.documents.length} document(s) technique(s) archivé(s)`,
      descEn: `${item.documents.length} technical document(s) archived`,
      isDone: item.documents.length > 0,
      tab: 'vault' as const,
    },
    {
      num: 3,
      titleFr: 'Extraction Déterministe (Zéro-IA)',
      titleEn: 'Deterministic Extraction (Zero-AI)',
      descFr: 'Contrôle automatique du flux textuel PDF contre les seuils UE',
      descEn: 'Automated parsing of PDF text streams against EU legal limits',
      isDone: item.documents.some(d => d.extractionStatus === 'extracted'),
      tab: 'vault' as const,
    },
    {
      num: 4,
      titleFr: 'Revue Humaine & Validation (HITL)',
      titleEn: 'Human-in-the-Loop Verification',
      descFr: `${item.documents.flatMap(d => d.evidences).filter(e => e.isVerifiedByHuman).length} preuve(s) formellement validée(s)`,
      descEn: `${item.documents.flatMap(d => d.evidences).filter(e => e.isVerifiedByHuman).length} evidence(s) formally approved`,
      isDone: item.documents.flatMap(d => d.evidences).some(e => e.isVerifiedByHuman),
      tab: 'vault' as const,
    },
    {
      num: 5,
      titleFr: 'Audit des Écarts & Relances Fournisseurs',
      titleEn: 'Gap Audit & Supplier Follow-up',
      descFr: item.components.some(c => c.missingDataPoints.length > 0)
        ? 'Relance fournisseur disponible en 1 clic'
        : 'Toutes les preuves fournisseurs sont au complet',
      descEn: item.components.some(c => c.missingDataPoints.length > 0)
        ? '1-click automated supplier request ready'
        : 'All supplier evidence fully accounted for',
      isDone: !item.components.some(c => c.missingDataPoints.length > 0),
      tab: 'gaps' as const,
    },
    {
      num: 6,
      titleFr: 'Déclaration UE de Conformité (Annexe VII)',
      titleEn: 'Official EU Declaration (Annex VII)',
      descFr: 'Prête pour le téléchargement PDF certifié et export JSON',
      descEn: 'Ready for certified vector PDF download and JSON export',
      isDone: report.overallStatus === 'compliant',
      tab: 'declaration' as const,
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Hero 5-Minute Banner inspired by Power PPWR */}
      <div className="rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-[#8B5CF6] to-indigo-600" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-[2px] w-8 bg-[#F97316]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#F97316] font-bold">
                POWER PPWR WORKFLOW · 5 MINUTES
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight dark:text-white text-slate-900">
              {language === 'fr' 
                ? 'Du document fournisseur à la Déclaration UE. En 5 minutes.'
                : 'From supplier document to ready EU Declaration. In 5 minutes.'}
            </h1>
            <p className="text-sm dark:text-slate-400 text-slate-600 max-w-2xl leading-relaxed">
              {language === 'fr'
                ? 'powerPPWR audite automatiquement vos fiches techniques et rapports de laboratoire contre le Règlement (UE) 2025/40 et génère votre Déclaration officielle prête pour l\'audit.'
                : 'powerPPWR automatically audits your supplier technical data sheets and lab reports against EU Regulation 2025/40 and compiles your audit-ready official Declaration.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('vault')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg bg-gradient-to-r from-orange-500 to-[#F97316] hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/20 transition-all"
            >
              <span>{language === 'fr' ? 'Déposer des Fichiers' : 'Upload Supplier Files'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('declaration')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-white text-slate-800 transition-colors shadow-xs"
            >
              <span>{language === 'fr' ? 'Voir la Déclaration' : 'View Declaration'}</span>
            </button>
          </div>
        </div>

        {/* 6-Step Visual Roadmap */}
        <div className="pt-6 border-t dark:border-slate-800 border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {steps.map((step) => (
              <button
                key={step.num}
                onClick={() => onNavigate(step.tab)}
                className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  step.isDone
                    ? 'dark:border-emerald-800/40 border-emerald-300 dark:bg-emerald-950/10 bg-emerald-50/50 hover:border-emerald-500'
                    : 'dark:border-slate-800 border-slate-200 dark:bg-slate-900/60 bg-slate-50 hover:border-[#F97316]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono font-bold dark:bg-slate-800 bg-white dark:text-slate-200 text-slate-800 border dark:border-slate-700 border-slate-300">
                      {step.num}
                    </span>
                    {step.isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">À faire</span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold dark:text-white text-slate-900 leading-snug">
                    {language === 'fr' ? step.titleFr : step.titleEn}
                  </h4>
                  <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-1 line-clamp-2">
                    {language === 'fr' ? step.descFr : step.descEn}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Power PPWR 4-Status Assessment Strip */}
      <div className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-5 shadow-xs transition-colors space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#8B5CF6]" />
            <span>{language === 'fr' ? 'Matrice Power PPWR de Qualification des Composants' : 'Power PPWR Component Qualification Matrix'}</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">SKU: {item.sku}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg dark:bg-emerald-950/20 bg-emerald-50 border border-emerald-300 dark:border-emerald-800/40 space-y-1">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>{t.statuses.compliant}</span>
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {t.statuses.compliantDesc}
            </p>
          </div>

          <div className="p-3 rounded-lg dark:bg-amber-950/20 bg-amber-50 border border-amber-300 dark:border-amber-800/40 space-y-1">
            <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>{t.statuses.incomplete}</span>
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {t.statuses.incompleteDesc}
            </p>
          </div>

          <div className="p-3 rounded-lg dark:bg-red-950/20 bg-red-50 border border-red-300 dark:border-red-800/40 space-y-1">
            <span className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span>{t.statuses.critical}</span>
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {t.statuses.criticalDesc}
            </p>
          </div>

          <div className="p-3 rounded-lg dark:bg-slate-900 bg-slate-100 border border-slate-300 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>{t.statuses.missing}</span>
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {t.statuses.missingDesc}
            </p>
          </div>
        </div>
      </div>

      {/* ROI & Savings Link Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white gap-4 shadow-xs transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#F97316]/10 text-[#F97316] shrink-0">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold dark:text-white text-slate-900">
              {language === 'fr' ? 'Calculez le ROI et les économies de votre portefeuille emballage' : 'Calculate ROI & savings for your packaging portfolio'}
            </h4>
            <p className="text-[11px] sm:text-xs dark:text-slate-400 text-slate-600 mt-0.5">
              {language === 'fr' ? 'Comparez les coûts de saisie manuelle et des cabinets externes avec les forfaits transparents Power PPWR.' : 'Compare traditional manual audit and consultant expenses against transparent Power PPWR plans.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('pricing')}
          className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-orange-500 to-[#F97316] text-white hover:from-orange-600 hover:to-orange-700 transition-all shrink-0 shadow-sm cursor-pointer whitespace-nowrap active:scale-[0.98]"
        >
          {language === 'fr' ? 'Ouvrir le Simulateur' : 'Open ROI Simulator'}
        </button>
      </div>

    </div>
  );
};
