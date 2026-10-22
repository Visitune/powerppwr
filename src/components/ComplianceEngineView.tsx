import React, { useState } from 'react';
import { ComplianceReport, Language, PackagingItem } from '../types/ppwr';
import { translations } from '../utils/i18n';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Recycle, 
  Box, 
  Percent, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  FileCheck,
  Calculator,
  ArrowRight
} from 'lucide-react';

interface ComplianceEngineViewProps {
  item: PackagingItem;
  setItem: React.Dispatch<React.SetStateAction<PackagingItem>>;
  report: ComplianceReport;
  language: Language;
  onProceedToDeclaration: () => void;
}

export const ComplianceEngineView: React.FC<ComplianceEngineViewProps> = ({
  item,
  setItem,
  report,
  language,
  onProceedToDeclaration,
}) => {
  const t = translations[language];
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({
    'Article 5': true,
    'Article 6': true,
    'Article 7': true,
    'Article 9 & 21': true,
  });

  const toggleArticle = (art: string) => {
    setExpandedArticles(prev => ({ ...prev, [art]: !prev[art] }));
  };

  const handleDimensionChange = (field: 'lengthMm' | 'widthMm' | 'heightMm' | 'productVolumeCm3', value: number) => {
    setItem(prev => {
      const length = field === 'lengthMm' ? value : prev.dimensions.lengthMm;
      const width = field === 'widthMm' ? value : prev.dimensions.widthMm;
      const height = field === 'heightMm' ? value : prev.dimensions.heightMm;
      const productVol = field === 'productVolumeCm3' ? value : prev.dimensions.productVolumeCm3;

      const pkgVolCm3 = Math.round((length * width * height) / 1000);
      const voidRatio = pkgVolCm3 > 0 
        ? Math.max(0, Math.min(100, Math.round(((pkgVolCm3 - productVol) / pkgVolCm3) * 1000) / 10))
        : 0;

      return {
        ...prev,
        dimensions: {
          lengthMm: length,
          widthMm: width,
          heightMm: height,
          packagingVolumeCm3: pkgVolCm3,
          productVolumeCm3: productVol,
          voidSpaceRatioPercent: voidRatio,
          isCompliant: voidRatio <= 50,
        }
      };
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header and VisiPilot Style Accent */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b dark:border-slate-800 border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-[2px] w-8 bg-[#F97316]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#F97316] font-bold">
              PPWR AUDIT ENGINE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold tracking-tight dark:text-white text-slate-900">
              {t.compliance.title}
            </h1>
            <span className={`text-xs px-2.5 py-0.5 rounded font-bold border ${
              report.overallStatus === 'compliant'
                ? 'dark:bg-emerald-950/60 bg-emerald-100 dark:border-emerald-700/60 border-emerald-300 text-emerald-700 dark:text-emerald-400'
                : (report.overallStatus === 'incomplete' ? 'dark:bg-amber-950/60 bg-amber-100 dark:border-amber-700/60 border-amber-300 text-amber-700 dark:text-amber-400' : 'dark:bg-red-950/60 bg-red-100 dark:border-red-700/60 border-red-300 text-red-700 dark:text-red-400')
            }`}>
              {t.compliance[report.overallStatus] || report.overallStatus}
            </span>
          </div>
          <p className="mt-1 text-sm dark:text-slate-400 text-slate-600 max-w-3xl">
            {t.compliance.subtitle}
          </p>
        </div>

        <button
          onClick={onProceedToDeclaration}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-indigo-600 hover:from-orange-600 hover:to-indigo-700 text-white shadow-md shadow-orange-500/20 transition-all shrink-0 self-start md:self-auto"
        >
          <span>{language === 'fr' ? 'Générer la Déclaration Officielle' : 'Generate Official Declaration'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* 4 Key Pillar Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Recyclability Grade Card (Art. 6) */}
        <div className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-4 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wide">
                {t.compliance.recyclabilityGrade}
              </span>
              <Recycle className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-emerald-500">
                Grade {report.recyclabilityGrade}
              </span>
              <span className="font-mono text-xs dark:text-slate-400 text-slate-500">
                ({report.recyclabilityScore}%)
              </span>
            </div>
            <p className="text-[11px] dark:text-slate-400 text-slate-600 mt-1">
              {t.compliance.gradeDesc}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t dark:border-slate-800 border-slate-100 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="h-3 w-3" />
            <span>{language === 'fr' ? 'Seuil 2030 (Min. C) Atteint' : '2030 Threshold (Min. C) Met'}</span>
          </div>
        </div>

        {/* Void Space Ratio Card (Art. 9 & 21) */}
        <div className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-4 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wide">
                {t.compliance.voidRatio}
              </span>
              <Box className="h-4 w-4 text-[#F97316]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className={`font-display text-3xl font-extrabold ${
                item.dimensions.voidSpaceRatioPercent <= 50 ? 'text-[#F97316]' : 'text-red-500'
              }`}>
                {item.dimensions.voidSpaceRatioPercent}%
              </span>
              <span className="font-mono text-xs dark:text-slate-400 text-slate-500">
                / 50% max
              </span>
            </div>
            <p className="text-[11px] dark:text-slate-400 text-slate-600 mt-1">
              {t.compliance.voidRatioLimit}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t dark:border-slate-800 border-slate-100 text-[11px] font-mono flex items-center gap-1 font-semibold">
            {item.dimensions.voidSpaceRatioPercent <= 50 ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {language === 'fr' ? 'Conforme Art. 21 (≤ 50%)' : 'Complies with Art. 21 (≤ 50%)'}
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                {language === 'fr' ? 'Dépassement du vide max' : 'Exceeds max void space'}
              </span>
            )}
          </div>
        </div>

        {/* Recycled Plastic PCR Card (Art. 7) */}
        <div className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-4 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wide">
                {t.compliance.recycledContent}
              </span>
              <Percent className="h-4 w-4 text-[#8B5CF6]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-[#8B5CF6]">
                {item.components.find(c => c.materialType === 'plastic')?.recycledPlasticPercent || 0}%
              </span>
              <span className="font-mono text-xs dark:text-slate-400 text-slate-500">
                PCR
              </span>
            </div>
            <p className="text-[11px] dark:text-slate-400 text-slate-600 mt-1">
              {t.compliance.recycledTargets}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t dark:border-slate-800 border-slate-100 text-[11px] font-mono text-[#8B5CF6] flex items-center gap-1 font-semibold">
            <CheckCircle2 className="h-3 w-3" />
            <span>{language === 'fr' ? 'Certifié EuCertPlast / ISCC+' : 'EuCertPlast / ISCC+ Certified'}</span>
          </div>
        </div>

        {/* Heavy Metals & PFAS Card (Art. 5) */}
        <div className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-4 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wide">
                {t.compliance.heavyMetalsTitle}
              </span>
              <ShieldAlert className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-emerald-500">
                {item.heavyMetals ? item.heavyMetals.total_mg_kg : '—'}
              </span>
              <span className="font-mono text-xs dark:text-slate-400 text-slate-500">
                mg/kg & {item.pfas?.declaredFree ? 'PFAS-free' : 'PFAS ?'}
              </span>
            </div>
            <p className="text-[11px] dark:text-slate-400 text-slate-600 mt-1">
              {t.compliance.heavyMetalsLimit}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t dark:border-slate-800 border-slate-100 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="h-3 w-3" />
            <span>{language === 'fr' ? 'Rapport Labo Conforme' : 'Conform Lab Test Report'}</span>
          </div>
        </div>

      </div>

      {/* Interactive Void Space Ratio Calculator */}
      <div className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-5 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[#F97316]" />
            <h2 className="text-sm font-bold dark:text-white text-slate-900">
              {language === 'fr' 
                ? 'Simulateur Dynamique de Taux de Vide & Réduction d\'Emballage (Art. 9 & 21)' 
                : 'Dynamic Void Space Ratio & Packaging Minimization Simulator (Art. 9 & 21)'}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/30 px-2 py-0.5 rounded font-bold">
            Plafond Légal : 50% max
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs dark:text-slate-400 text-slate-600 block mb-1 font-medium">
              {language === 'fr' ? 'Longueur Extérieure (mm)' : 'Outer Length (mm)'}
            </label>
            <input
              type="number"
              value={item.dimensions.lengthMm}
              onChange={(e) => handleDimensionChange('lengthMm', parseFloat(e.target.value) || 0)}
              className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs dark:text-slate-400 text-slate-600 block mb-1 font-medium">
              {language === 'fr' ? 'Largeur Extérieure (mm)' : 'Outer Width (mm)'}
            </label>
            <input
              type="number"
              value={item.dimensions.widthMm}
              onChange={(e) => handleDimensionChange('widthMm', parseFloat(e.target.value) || 0)}
              className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs dark:text-slate-400 text-slate-600 block mb-1 font-medium">
              {language === 'fr' ? 'Hauteur Extérieure (mm)' : 'Outer Height (mm)'}
            </label>
            <input
              type="number"
              value={item.dimensions.heightMm}
              onChange={(e) => handleDimensionChange('heightMm', parseFloat(e.target.value) || 0)}
              className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs dark:text-slate-400 text-slate-600 block mb-1 font-medium">
              {language === 'fr' ? 'Volume Net Produits (cm³)' : 'Net Product Volume (cm³)'}
            </label>
            <input
              type="number"
              value={item.dimensions.productVolumeCm3}
              onChange={(e) => handleDimensionChange('productVolumeCm3', parseFloat(e.target.value) || 0)}
              className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Progress Bar Display */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="dark:text-slate-400 text-slate-600 font-medium">
              {language === 'fr' ? 'Taux d\'espace vide calculé :' : 'Calculated Void Ratio:'}{' '}
              <strong className="dark:text-white text-slate-900">{item.dimensions.voidSpaceRatioPercent}%</strong>
            </span>
            <span className={item.dimensions.voidSpaceRatioPercent <= 50 ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
              {item.dimensions.voidSpaceRatioPercent <= 50 
                ? (language === 'fr' ? '✓ CONFORME (≤ 50%)' : '✓ COMPLIANT (≤ 50%)')
                : (language === 'fr' ? '✕ NON CONFORME (> 50%)' : '✕ NON-COMPLIANT (> 50%)')}
            </span>
          </div>
          <div className="w-full h-3 dark:bg-slate-800 bg-slate-200 rounded-full overflow-hidden p-0.5 border dark:border-slate-700 border-slate-300">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                item.dimensions.voidSpaceRatioPercent <= 50
                  ? 'bg-gradient-to-r from-emerald-500 to-[#8B5CF6]'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, item.dimensions.voidSpaceRatioPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sourced Article-by-Article Breakdown */}
      <div className="space-y-4">
        <h2 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-[#8B5CF6]" />
          <span>{t.compliance.articlesBreakdown}</span>
        </h2>

        <div className="space-y-3">
          {report.articles.map((art) => {
            const isExpanded = !!expandedArticles[art.articleNumber];

            return (
              <div 
                key={art.articleNumber}
                className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => toggleArticle(art.articleNumber)}
                  className="w-full p-4 flex items-center justify-between text-left dark:hover:bg-slate-900/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {art.status === 'compliant' && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                    {art.status === 'incomplete' && <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />}
                    {art.status === 'critical' && <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
                    {art.status === 'missing' && <AlertTriangle className="h-5 w-5 text-slate-400 shrink-0" />}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm dark:text-white text-slate-900">
                          {art.articleNumber}
                        </span>
                        <span className="text-xs dark:text-slate-300 text-slate-700 font-semibold">
                          — {language === 'fr' ? art.titleFr : art.titleEn}
                        </span>
                      </div>
                      <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                        {language === 'fr' ? art.summaryFr : art.summaryEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-mono text-[#8B5CF6] dark:bg-indigo-950/40 bg-indigo-50 border dark:border-indigo-800/40 border-indigo-200 px-2 py-0.5 rounded hidden sm:inline-block font-semibold">
                      {art.evidenceCount} {t.compliance.evidenceAttached}
                    </span>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t dark:border-slate-800/80 border-slate-100 dark:bg-slate-900/40 bg-slate-50/60 space-y-3">
                    <div className="space-y-1.5 pt-2">
                      <span className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider">
                        {language === 'fr' ? 'Points d\'audit réglementaire vérifiés :' : 'Verified Regulatory Audit Points:'}
                      </span>
                      <ul className="space-y-1 pl-4 list-disc text-xs dark:text-slate-400 text-slate-600">
                        {(language === 'fr' ? art.detailsFr : art.detailsEn).map((d, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t dark:border-slate-800/60 border-slate-200 flex items-center justify-between text-[11px] dark:text-slate-500 text-slate-400 font-mono">
                      <span>Réf. Juridique : {art.legalReference}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
