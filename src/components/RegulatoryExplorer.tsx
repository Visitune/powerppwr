import React from 'react';
import { Language } from '../types/ppwr';
import { translations } from '../utils/i18n';
import { BookOpen, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

interface RegulatoryExplorerProps {
  language: Language;
}

export const RegulatoryExplorer: React.FC<RegulatoryExplorerProps> = ({ language }) => {
  const t = translations[language];

  const articles = [
    {
      num: 'Article 5',
      titleFr: 'Exigences relatives aux substances présentes dans les emballages',
      titleEn: 'Requirements for substances in packaging',
      descFr: 'Plafonne la somme des 4 métaux lourds (Plomb, Cadmium, Mercure, Chrome hexavalent) à 100 mg/kg max. Interdit la présence de substances per- et polyfluoroalkylées (PFAS) au-delà des limites de détection.',
      descEn: 'Caps the cumulative sum of 4 heavy metals (Lead, Cadmium, Mercury, Hexavalent Chromium) to 100 mg/kg max. Restricts per- and polyfluoroalkyl substances (PFAS) above threshold detection limits.',
      timing: 'Août 2026',
    },
    {
      num: 'Article 6',
      titleFr: 'Emballages recyclables & Catégories de performance',
      titleEn: 'Recyclable packaging & Performance grades',
      descFr: 'Tout emballage doit être recyclable selon les critères d\'écoconception. Instaure une notation de A à E. À partir de 2030, tout emballage de note D ou E est interdit de mise sur le marché européen.',
      descEn: 'All packaging must be recyclable according to circular design criteria. Establishes Grades A to E. From 2030, any packaging rated Grade D or E is prohibited from being placed on the EU market.',
      timing: '2030 (Grade C min) / 2038 (Grade B min)',
    },
    {
      num: 'Article 7',
      titleFr: 'Teneur minimale en matière plastique recyclée post-consommation (PCR)',
      titleEn: 'Minimum post-consumer recycled plastic content (PCR)',
      descFr: 'Fixe des quotas contraignants d\'incorporation de plastique recyclé : 30% pour PET contact sensible, 10% autres contacts sensibles, 35% autres plastiques d\'ici 2030 (augmentant à 50% et 65% en 2040).',
      descEn: 'Sets binding recycled plastic quotas: 30% for contact-sensitive PET, 10% other contact-sensitive, 35% other plastics by 2030 (escalating to 50% and 65% in 2040).',
      timing: '2030 & 2040',
    },
    {
      num: 'Article 9 & 21',
      titleFr: 'Réduction de l\'emballage & Taux d\'espace vide maximal de 50%',
      titleEn: 'Packaging minimization & Maximum 50% void space ratio',
      descFr: 'Interdit le suremballage. Pour les emballages de regroupement, de transport et de commerce en ligne, le ratio d\'espace vide par rapport au volume net des produits ne doit pas dépasser 50%.',
      descEn: 'Prohibits over-packaging. For grouped packaging, transport packaging, and e-commerce packaging, the void space ratio relative to net product volume cannot exceed 50%.',
      timing: '2026/2030',
    },
    {
      num: 'Article 10 & 26',
      titleFr: 'Emballages réemployables & Systèmes de réemploi',
      titleEn: 'Reusable packaging & Reuse systems',
      descFr: 'Exigences pour les emballages réemployables (rotations minimales, filières de retour, boucle fermée ou ouverte avec incitation financière).',
      descEn: 'Requirements for reusable packaging (minimum rotation cycles, return logistics, closed or open loop with financial incentives).',
      timing: '2030',
    },
    {
      num: 'Article 11',
      titleFr: 'Étiquetage, marquage et informations harmonisés',
      titleEn: 'Harmonised labelling, marking and information requirements',
      descFr: 'Obligation d\'apposer le pictogramme européen harmonisé de tri des déchets et le code d\'identification du matériau selon la décision 97/129/CE (ex. PET 01, PAP 20).',
      descEn: 'Mandatory application of harmonised European waste sorting pictograms and material identification codes per Decision 97/129/EC (e.g. PET 01, PAP 20).',
      timing: '2026 - 2028',
    },
    {
      num: 'Article 13 & Annexe VII',
      titleFr: 'Déclaration UE de Conformité & Dossier Technique',
      titleEn: 'EU Declaration of Conformity & Technical Documentation',
      descFr: 'Oblige les fabricants à rédiger la Déclaration UE selon le modèle officiel de l\'Annexe VII et à conserver les preuves techniques et rapports d\'essais pendant au moins 10 ans.',
      descEn: 'Mandates manufacturers to draw up the EU Declaration conforming to Annex VII template and archive all supporting technical documentation and lab reports for at least 10 years.',
      timing: '12 Août 2026',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b dark:border-slate-800 border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="h-[2px] w-8 bg-[#F97316]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#F97316] font-bold">
            EUROPEAN REGULATORY REPOSITORY
          </span>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-extrabold tracking-tight dark:text-white text-slate-900">
            {t.regulatory.title}
          </h1>
          <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 dark:text-indigo-400 px-2 py-0.5 rounded font-mono">
            Règlement (UE) 2025/40
          </span>
        </div>
        <p className="mt-1 text-sm dark:text-slate-400 text-slate-600 max-w-3xl">
          {t.regulatory.subtitle}
        </p>
      </div>

      {/* Enforcement Timeline */}
      <div className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-6 shadow-xs space-y-4 transition-colors">
        <h2 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#F97316]" />
          <span>{t.regulatory.timelineTitle}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-lg dark:bg-slate-900 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-xs font-mono font-bold text-[#8B5CF6]">12 FÉVRIER 2025</span>
            <h3 className="text-sm font-bold dark:text-slate-200 text-slate-800">
              {language === 'fr' ? 'Entrée en vigueur officielle' : 'Official Entry into Force'}
            </h3>
            <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed">
              {t.regulatory.t2025}
            </p>
          </div>

          <div className="p-4 rounded-lg dark:bg-slate-900 bg-amber-50/70 border dark:border-[#F97316]/50 border-amber-300 space-y-2 relative">
            <span className="text-xs font-mono font-bold text-[#F97316]">12 AOÛT 2026 (Jalon Clé)</span>
            <h3 className="text-sm font-bold dark:text-slate-200 text-slate-800">
              {language === 'fr' ? 'Application Générale' : 'General Application'}
            </h3>
            <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed">
              {t.regulatory.t2026}
            </p>
          </div>

          <div className="p-4 rounded-lg dark:bg-slate-900 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-500">1er JANVIER 2030</span>
            <h3 className="text-sm font-bold dark:text-slate-200 text-slate-800">
              {language === 'fr' ? 'Seuils Contraignants' : 'Binding Quotas'}
            </h3>
            <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed">
              {t.regulatory.t2030}
            </p>
          </div>

          <div className="p-4 rounded-lg dark:bg-slate-900 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-500">1er JANVIER 2040</span>
            <h3 className="text-sm font-bold dark:text-slate-200 text-slate-800">
              {language === 'fr' ? 'Économie Circulaire Avancée' : 'Advanced Circularity'}
            </h3>
            <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed">
              {t.regulatory.t2040}
            </p>
          </div>
        </div>
      </div>

      {/* Official Legal Articles Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#8B5CF6]" />
          <span>{t.regulatory.articlesList}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((art) => (
            <div key={art.num} className="p-5 rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white space-y-2 shadow-xs transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/30 px-2 py-0.5 rounded">
                  {art.num}
                </span>
                <span className="text-[11px] font-mono dark:text-slate-400 text-slate-500">
                  {art.timing}
                </span>
              </div>
              <h3 className="text-sm font-bold dark:text-white text-slate-900">
                {language === 'fr' ? art.titleFr : art.titleEn}
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed">
                {language === 'fr' ? art.descFr : art.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* External Verified Sources & Reference Link */}
      <div className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/60 bg-white p-5 space-y-3 transition-colors shadow-xs">
        <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
          <ExternalLink className="h-4 w-4 text-[#F97316]" />
          <span>{t.regulatory.officialSources}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <a
            href="https://eur-lex.europa.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-slate-50 dark:hover:border-indigo-500/60 hover:border-indigo-300 dark:text-slate-300 text-slate-700 transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="font-bold block dark:text-slate-200 text-slate-900">Journal Officiel de l'UE — EUR-Lex</span>
              <span className="text-[11px] dark:text-slate-400 text-slate-500">Règlement (UE) 2025/40 du Parlement Européen</span>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </a>

          <a
            href="https://visitune.github.io/PPWR/#/fr/home"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-slate-50 dark:hover:border-indigo-500/60 hover:border-indigo-300 dark:text-slate-300 text-slate-700 transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="font-bold block dark:text-slate-200 text-slate-900">Visitune PPWR Reference</span>
              <span className="text-[11px] dark:text-slate-400 text-slate-500">visitune.github.io/PPWR/#/fr/home</span>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </a>
        </div>
      </div>

    </div>
  );
};
