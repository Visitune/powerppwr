import React, { useState } from 'react';
import { Language, PackagingComponent, PackagingItem } from '../types/ppwr';
import { translations } from '../utils/i18n';
import { 
  AlertTriangle, 
  Mail, 
  Copy, 
  Check, 
  Send, 
  FileQuestion, 
  CheckCircle2, 
  Building, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface SupplierGapGeneratorProps {
  item: PackagingItem;
  language: Language;
  onProceedToVault: () => void;
}

export const SupplierGapGenerator: React.FC<SupplierGapGeneratorProps> = ({
  item,
  language,
  onProceedToVault,
}) => {
  const t = translations[language];
  const [selectedComponentId, setSelectedComponentId] = useState<string>(
    item.components.find(c => c.missingDataPoints.length > 0)?.id || item.components[0]?.id || ''
  );
  const [copied, setCopied] = useState(false);

  const selectedComponent = item.components.find(c => c.id === selectedComponentId);
  const componentsWithGaps = item.components.filter(c => c.missingDataPoints.length > 0);

  // Generate formal supplier follow-up letter / email
  const emailDraft = selectedComponent
    ? language === 'fr'
      ? `Objet : DEMANDE URGENTE DE CONFORMITÉ PPWR — Règlement (UE) 2025/40 — Réf. Composant : ${selectedComponent.name} (${selectedComponent.materialCode})

Madame, Monsieur l'équipe Qualité / Réglementaire de ${selectedComponent.supplierName},

Dans le cadre de l'entrée en application du Règlement Européen sur les Emballages et Déchets d'Emballages (PPWR - Règlement (UE) 2025/40), notre société (${item.manufacturer.companyName}) prépare actuellement les Déclarations UE de Conformité et Dossiers Techniques obligatoires (Article 13 & Annexe VII) pour nos produits finis (Réf. SKU : ${item.sku}).

Lors de l'audit de vos pièces techniques pour le composant "${selectedComponent.name}", notre système powerPPWR a identifié les éléments manquants suivants à nous fournir sous 10 jours ouvrés :

${selectedComponent.missingDataPoints.map((pt, idx) => `  ${idx + 1}. ${pt}`).join('\n')}

Pour rappel :
- Article 5 : Les emballages ne doivent pas dépasser 100 mg/kg cumulés pour le Plomb, Cadmium, Mercure et Chrome hexavalent, et doivent faire l'objet d'une attestation d'absence intentionnelle de PFAS.
- Article 6 & 7 : Les taux de recyclabilité et d'incorporation de matières recyclées post-consommation (PCR) doivent être certifiés par un organisme tiers (ex. EuCertPlast, ISCC Plus ou rapport d'essai accrédité ISO 17025).

Merci de nous faire parvenir ces certificats au format PDF par retour d'e-mail afin que nous puissions maintenir la conformité de vos références sur le marché européen.

Dans l'attente de votre retour rapide, nous vous prions d'agréer nos salutations distinguées.

${item.manufacturer.signatoryName}
${item.manufacturer.signatoryRole}
${item.manufacturer.companyName}`
      : `Subject: URGENT PPWR COMPLIANCE REQUEST — EU Regulation 2025/40 — Component Ref: ${selectedComponent.name} (${selectedComponent.materialCode})

Dear Quality & Regulatory Team at ${selectedComponent.supplierName},

In connection with the enforcement of the European Packaging and Packaging Waste Regulation (PPWR - Regulation (EU) 2025/40), our company (${item.manufacturer.companyName}) is currently compiling the mandatory EU Declarations of Conformity and Technical Dossiers (Article 13 & Annex VII) for our finished packaging items (SKU: ${item.sku}).

During our technical compliance audit of your component "${selectedComponent.name}", our powerPPWR system flagged the following missing regulatory evidences that must be provided within 10 business days:

${selectedComponent.missingDataPoints.map((pt, idx) => `  ${idx + 1}. ${pt}`).join('\n')}

As a reminder:
- Article 5: Packaging must not exceed 100 mg/kg cumulative concentration for Lead, Cadmium, Mercury, and Hexavalent Chromium, and must include a formal PFAS-free declaration.
- Articles 6 & 7: Recyclability design and post-consumer recycled plastic (PCR) percentages must be backed by accredited third-party certificates (e.g., EuCertPlast, ISCC Plus, or ISO 17025 lab reports).

Please provide these certified PDF documents at your earliest convenience to maintain the legal eligibility of your supplied components within the European single market.

Best regards,

${item.manufacturer.signatoryName}
${item.manufacturer.signatoryRole}
${item.manufacturer.companyName}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(emailDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleMailto = () => {
    if (!selectedComponent) return;
    const recipient = selectedComponent.supplierContactEmail || '';
    const subject = encodeURIComponent(`URGENT PPWR Compliance: ${selectedComponent.name}`);
    const body = encodeURIComponent(emailDraft);
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header and VisiPilot Style Accent */}
      <div className="border-b dark:border-slate-800 border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="h-[2px] w-8 bg-[#F97316]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C] font-bold">
            POWER PPWR COMPLIANCE FOLLOW-UP
          </span>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-extrabold tracking-tight dark:text-white text-slate-900">
            {t.gaps.title}
          </h1>
          <span className="text-xs bg-orange-500/10 border border-orange-500/30 text-[#9A3412] dark:text-[#FB923C] px-2 py-0.5 rounded font-mono font-bold">
            Art. 13 & Chaîne Fournisseur
          </span>
        </div>
        <p className="mt-1 text-sm dark:text-slate-400 text-slate-600 max-w-3xl">
          {t.gaps.subtitle}
        </p>
      </div>

      {/* Overview Matrix of Components and Their Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {item.components.map((comp) => {
          const isSelected = comp.id === selectedComponentId;
          const hasGaps = comp.missingDataPoints.length > 0;

          return (
            <button
              key={comp.id}
              onClick={() => setSelectedComponentId(comp.id)}
              className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'dark:border-[#F97316] border-[#F97316] dark:bg-slate-900 bg-orange-50/50 shadow-md ring-1 ring-[#F97316]'
                  : 'dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white hover:border-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-700">
                    {comp.materialCode}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                    comp.status === 'compliant'
                      ? 'dark:bg-emerald-950/60 bg-emerald-100 border-emerald-300 text-emerald-700 dark:text-emerald-400'
                      : (comp.status === 'incomplete' 
                          ? 'dark:bg-amber-950/60 bg-amber-100 border-amber-300 text-amber-800 dark:text-amber-400' 
                          : 'dark:bg-red-950/60 bg-red-100 border-red-300 text-red-700 dark:text-red-400')
                  }`}>
                    {t.statuses[comp.status] || comp.status}
                  </span>
                </div>

                <h2 className="text-sm font-bold dark:text-white text-slate-900">
                  {comp.name}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  <span>{comp.supplierName}</span>
                </p>
              </div>

              <div className="mt-3 pt-2 border-t dark:border-slate-800 border-slate-100 text-xs">
                {hasGaps ? (
                  <span className="text-[#C2410C] dark:text-[#FB923C] font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>{comp.missingDataPoints.length} {language === 'fr' ? 'pièces à réclamer' : 'missing items'}</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{language === 'fr' ? 'Dossier complet' : 'Fully verified'}</span>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Component Gap Details & Email Generator */}
      {selectedComponent && (
        <div className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-6 shadow-xs space-y-5 transition-colors">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b dark:border-slate-800 border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#6D28D9] dark:text-[#A78BFA]">COMPOSANT SÉLECTIONNÉ :</span>
                <span className="text-sm font-extrabold dark:text-white text-slate-900">{selectedComponent.name}</span>
              </div>
              <p className="text-xs dark:text-slate-400 text-slate-600 mt-0.5">
                Fournisseur : <strong className="dark:text-slate-200 text-slate-800">{selectedComponent.supplierName}</strong> ({selectedComponent.supplierContactEmail || 'email non renseigné'})
              </p>
            </div>

            {selectedComponent.missingDataPoints.length > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-700 transition-colors shadow-xs"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-[#C2410C] dark:text-[#FB923C]" />}
                  <span>{copied ? t.gaps.copied : t.gaps.copyEmail}</span>
                </button>

                <button
                  onClick={handleMailto}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-[#F97316] hover:from-orange-600 hover:to-orange-700 text-white shadow-xs transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{t.gaps.sendDirect}</span>
                </button>
              </div>
            )}
          </div>

          {/* Missing items list */}
          {selectedComponent.missingDataPoints.length > 0 ? (
            <div className="space-y-3">
              <div className="p-3 rounded-lg dark:bg-amber-950/20 bg-amber-50 border dark:border-amber-700/40 border-amber-300 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-[#C2410C] dark:text-[#FB923C] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold dark:text-amber-300 text-amber-900 uppercase tracking-wide">
                    {language === 'fr' ? 'Données Manquantes Identifiées pour ce Composant :' : 'Identified Missing Regulatory Points:'}
                  </h3>
                  <ul className="mt-1 space-y-1 text-xs dark:text-slate-300 text-slate-700 list-disc pl-4">
                    {selectedComponent.missingDataPoints.map((pt, idx) => (
                      <li key={idx} className="font-medium">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ready to send Email Draft */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-[#6D28D9] dark:text-[#A78BFA]" />
                    <span>{t.gaps.emailDraftTitle}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    {language === 'fr' ? 'Conforme exigences PPWR Art. 13' : 'Conforming to PPWR Art. 13 requirements'}
                  </span>
                </div>

                <div className="rounded-lg dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 p-4 font-mono text-xs dark:text-slate-300 text-slate-800 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {emailDraft}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-lg dark:bg-emerald-950/20 bg-emerald-50 border dark:border-emerald-700/40 border-emerald-300 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-700 dark:text-emerald-400 mx-auto" />
              <h2 className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {t.gaps.noGaps}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                {language === 'fr' 
                  ? 'Tous les rapports d\'essais, métaux lourds et certificats de ce composant sont archivés dans le coffre-fort et prêts pour la Déclaration de Conformité.'
                  : 'All lab test reports, heavy metals limits, and circularity certificates for this component are archived and ready for the Declaration.'}
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
