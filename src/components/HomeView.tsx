import React from 'react';
import { ComplianceReport, ComplianceStatus, Language, PackagingItem } from '../types/ppwr';
import { translations } from '../utils/i18n';
import { RULES_VERSION, DISCLAIMER } from '../data/rules2025-40';
import { ActiveTab } from './Navbar';
import { ArrowRight, CheckCircle2, FileText, Mail, Package, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  item: PackagingItem;
  report: ComplianceReport;
  productCount: number;
  language: Language;
  onNavigate: (tab: ActiveTab) => void;
}

const STATUS_STYLES: Record<ComplianceStatus, { dot: string; badge: string; border: string }> = {
  compliant: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30', border: 'border-l-emerald-500' },
  incomplete: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30', border: 'border-l-amber-500' },
  critical: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30', border: 'border-l-red-500' },
  missing: { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/30', border: 'border-l-slate-400' },
};

export const HomeView: React.FC<Props> = ({ item, report, productCount, language, onNavigate }) => {
  const fr = language === 'fr';
  const t = translations[language];
  const statusLabel = (s: ComplianceStatus) => (t.compliance as Record<string, string>)[s] || s;
  const overall = STATUS_STYLES[report.overallStatus];

  const steps: { tab: ActiveTab; icon: React.ComponentType<{ className?: string }>; title: string; text: string }[] = [
    {
      tab: 'workflow', icon: Zap, title: t.nav.workflow,
      text: fr ? 'Parcours guidé et état du dossier en un coup d\'œil.' : 'Guided path and dossier status at a glance.',
    },
    {
      tab: 'vault', icon: ShieldCheck, title: t.nav.vault,
      text: fr ? 'Chargez les PDF fournisseurs, validez chaque preuve extraite.' : 'Upload supplier PDFs and validate each extracted proof.',
    },
    {
      tab: 'compliance', icon: CheckCircle2, title: t.nav.compliance,
      text: fr ? 'Évaluation article par article du règlement 2025/40.' : 'Article-by-article assessment of Regulation 2025/40.',
    },
    {
      tab: 'gaps', icon: Mail, title: t.nav.gaps,
      text: fr ? 'Générez les demandes de pièces manquantes aux fournisseurs.' : 'Generate requests for missing supplier documents.',
    },
    {
      tab: 'declaration', icon: FileText, title: t.nav.declaration,
      text: fr ? 'Déclaration de conformité (Annexe VII) en PDF.' : 'Declaration of conformity (Annex VII) as PDF.',
    },
  ];

  return (
    <div className="w-full space-y-6 lg:space-y-8">
      {/* Hero + current product */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        <div className="xl:col-span-2 rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-6 lg:p-8 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-block text-[11px] font-mono font-bold bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 px-2 py-0.5 rounded">
              {fr ? 'Règlement (UE) 2025/40' : 'Regulation (EU) 2025/40'}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight dark:text-white text-slate-900">
              {fr ? 'Conformité emballage PPWR, du dossier à la déclaration' : 'PPWR packaging compliance, from dossier to declaration'}
            </h1>
            <p className="text-sm lg:text-base dark:text-slate-300 text-slate-600 max-w-3xl leading-relaxed">
              {fr
                ? 'Évaluez la conformité d\'un emballage, sourcez chaque donnée dans les documents fournisseurs et générez la déclaration (Annexe VII). Vos données restent dans votre navigateur.'
                : 'Assess a packaging\'s compliance, source every data point in supplier documents and generate the declaration (Annex VII). Your data stays in your browser.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => onNavigate('products')} className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
              {fr ? 'Mes produits' : 'My products'}
            </button>
            <button type="button" onClick={() => onNavigate('workflow')} className="px-4 py-2 text-sm font-semibold rounded-lg border dark:border-slate-700 border-slate-300 dark:text-slate-200 text-slate-800 dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors">
              {fr ? 'Parcours guidé' : 'Guided workflow'}
            </button>
          </div>
        </div>

        <div className={`rounded-2xl border border-l-4 ${overall.border} dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-6 flex flex-col gap-4`}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">{fr ? 'Produit en cours' : 'Current product'}</span>
            <span className="flex items-center gap-1.5 text-xs dark:text-slate-400 text-slate-500">
              <Package className="h-3.5 w-3.5" />
              {productCount} {fr ? (productCount > 1 ? 'produits' : 'produit') : (productCount > 1 ? 'products' : 'product')}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-lg font-bold dark:text-white text-slate-900 break-words">{item.name}</div>
            <div className="text-xs font-mono dark:text-slate-400 text-slate-500 mt-0.5">{item.sku}</div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border ${overall.badge}`}>
              <span className={`h-2 w-2 rounded-full ${overall.dot}`} aria-hidden="true" />
              {statusLabel(report.overallStatus)}
            </span>
            <span className="text-xs font-mono dark:text-slate-300 text-slate-700">
              {fr ? 'Recyclabilité' : 'Recyclability'} <strong>{report.recyclabilityGrade}</strong> · {report.recyclabilityScore}%
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('compliance')}
            className="mt-auto self-start inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-300 hover:underline"
          >
            {fr ? 'Voir l\'audit détaillé' : 'View detailed audit'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Steps */}
      <section aria-labelledby="home-steps">
        <h2 id="home-steps" className="text-sm font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500 mb-3">
          {fr ? 'Les 5 étapes du dossier' : 'The 5 dossier steps'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-3 lg:gap-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.tab}
                type="button"
                onClick={() => onNavigate(s.tab)}
                className="text-left rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-4 hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg dark:bg-slate-800 bg-slate-100">
                    <Icon className="h-4 w-4 text-[#F97316]" />
                  </span>
                  <span className="text-xs font-mono font-bold dark:text-slate-500 text-slate-400">0{i + 1}</span>
                </div>
                <div className="mt-3 text-sm font-bold dark:text-white text-slate-900">{s.title}</div>
                <p className="mt-1 text-xs dark:text-slate-400 text-slate-600 leading-relaxed">{s.text}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Article status */}
      <section aria-labelledby="home-articles">
        <h2 id="home-articles" className="text-sm font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500 mb-3">
          {fr ? 'État par article' : 'Status by article'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
          {report.articles.map(a => {
            const st = STATUS_STYLES[a.status];
            return (
              <button
                key={a.articleNumber}
                type="button"
                onClick={() => onNavigate('compliance')}
                className={`text-left rounded-xl border border-l-4 ${st.border} dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-4 hover:shadow-sm transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-bold dark:text-white text-slate-900">{a.articleNumber}</div>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${st.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} aria-hidden="true" />
                    {statusLabel(a.status)}
                  </span>
                </div>
                <div className="mt-1 text-xs font-medium dark:text-slate-300 text-slate-700">{fr ? a.titleFr : a.titleEn}</div>
                <p className="mt-2 text-xs dark:text-slate-400 text-slate-600 leading-relaxed line-clamp-3">{fr ? a.summaryFr : a.summaryEn}</p>
              </button>
            );
          })}
        </div>
      </section>

      <div className="text-[11px] dark:text-slate-500 text-slate-500 space-y-1 pt-2">
        <div>{RULES_VERSION}</div>
        <div>{DISCLAIMER}</div>
      </div>
    </div>
  );
};
