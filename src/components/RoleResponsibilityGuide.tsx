import React from 'react';
import { Language, PackagingItem, SupplyChainRole } from '../types/ppwr';
import { translations } from '../utils/i18n';
import { ShieldCheck, UserCheck, Factory, Ship, Store, Tag, Truck, CheckCircle2 } from 'lucide-react';

interface RoleResponsibilityGuideProps {
  item: PackagingItem;
  setItem: React.Dispatch<React.SetStateAction<PackagingItem>>;
  language: Language;
}

export const RoleResponsibilityGuide: React.FC<RoleResponsibilityGuideProps> = ({
  item,
  setItem,
  language,
}) => {
  const t = translations[language];

  const rolesList: {
    id: SupplyChainRole;
    name: string;
    desc: string;
    icon: React.ElementType;
    articles: string;
    liabilityNotice: string;
  }[] = [
    {
      id: 'manufacturer',
      name: t.roles.manufacturer,
      desc: t.roles.manufacturerDesc,
      icon: Factory,
      articles: 'Articles 5, 6, 7, 9, 10, 11, 13 & Annexe VII',
      liabilityNotice: language === 'fr' 
        ? 'Responsabilité légale totale. Vous devez établir et signer la Déclaration UE de Conformité.'
        : 'Full legal liability. You must draw up and sign the official EU Declaration of Conformity.',
    },
    {
      id: 'brand_owner',
      name: t.roles.brandOwner,
      desc: t.roles.brandOwnerDesc,
      icon: Tag,
      articles: 'Articles 5 à 13 (Assimilé Fabricant)',
      liabilityNotice: language === 'fr'
        ? 'Si votre marque est apposée sur l\'emballage, vous êtes juridiquement réputé fabricant.'
        : 'If packaging bears your trademark or trade name, you are deemed the manufacturer under EU law.',
    },
    {
      id: 'importer',
      name: t.roles.importer,
      desc: t.roles.importerDesc,
      icon: Ship,
      articles: 'Article 14 & Article 13',
      liabilityNotice: language === 'fr'
        ? 'Vous devez vous assurer que le fabricant hors UE a réalisé l\'évaluation et détenir le dossier 10 ans.'
        : 'You must ensure the non-EU supplier drew up technical documentation and hold copy for 10 years.',
    },
    {
      id: 'distributor',
      name: t.roles.distributor,
      desc: t.roles.distributorDesc,
      icon: Store,
      articles: 'Article 15 & Article 11',
      liabilityNotice: language === 'fr'
        ? 'Vérification du marquage de tri et de la conformité formelle avant mise à disposition.'
        : 'Verification of sorting pictograms and formal traceability marks prior to distribution.',
    },
    {
      id: 'fulfilment',
      name: t.roles.fulfilment,
      desc: t.roles.fulfilmentDesc,
      icon: Truck,
      articles: 'Article 21 & Article 16',
      liabilityNotice: language === 'fr'
        ? 'Obligation de respecter le plafond de 50% de vide pour le calage et transport e-commerce.'
        : 'Mandatory compliance with 50% max void space ratio for shipping and e-commerce packaging.',
    },
  ];

  const handleSelectRole = (role: SupplyChainRole) => {
    setItem(prev => ({
      ...prev,
      userRole: role,
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header and VisiPilot Style Accent */}
      <div className="border-b dark:border-slate-800 border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="h-[2px] w-8 bg-[#F97316]" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#F97316] font-bold">
            PPWR VALUE CHAIN MAPPING
          </span>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-extrabold tracking-tight dark:text-white text-slate-900">
            {t.roles.title}
          </h1>
          <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 dark:text-indigo-400 px-2 py-0.5 rounded font-mono font-bold">
            Chapitre III · Art. 13-17
          </span>
        </div>
        <p className="mt-1 text-sm dark:text-slate-400 text-slate-600 max-w-3xl">
          {t.roles.subtitle}
        </p>
      </div>

      {/* Role Selection Banner */}
      <div className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6]">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wide block">
              {t.roles.yourRole}
            </span>
            <span className="text-lg font-extrabold dark:text-white text-slate-900 capitalize">
              {rolesList.find(r => r.id === item.userRole)?.name || item.userRole}
            </span>
          </div>
        </div>

        <div className="text-xs font-mono text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/30 px-3 py-1.5 rounded-lg font-bold">
          {language === 'fr' ? 'Déclaration liée au rôle sélectionné' : 'Declaration configured for this role'}
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rolesList.map((r) => {
          const Icon = r.icon;
          const isSelected = item.userRole === r.id;

          return (
            <div
              key={r.id}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
                isSelected
                  ? 'dark:border-[#F97316] border-[#F97316] dark:bg-slate-900 bg-orange-50/50 shadow-md ring-1 ring-[#F97316]'
                  : 'dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected 
                      ? 'bg-[#F97316] text-white' 
                      : 'dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-700'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#F97316]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{language === 'fr' ? 'Rôle Actif' : 'Active Role'}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold dark:text-white text-slate-900">
                  {r.name}
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-600 mt-2 leading-relaxed">
                  {r.desc}
                </p>

                <div className="mt-3 pt-2 border-t dark:border-slate-800 border-slate-100 text-[11px]">
                  <span className="dark:text-slate-400 text-slate-500 font-medium block">Articles Clés :</span>
                  <span className="font-mono text-[#8B5CF6] font-bold">{r.articles}</span>
                </div>

                <div className="mt-2 text-[11px] text-slate-500 italic">
                  {r.liabilityNotice}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t dark:border-slate-800 border-slate-100">
                <button
                  onClick={() => handleSelectRole(r.id)}
                  disabled={isSelected}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#F97316] text-white cursor-default'
                      : 'dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-slate-200 text-slate-800'
                  }`}
                >
                  {isSelected 
                    ? (language === 'fr' ? 'Sélectionné pour ce produit' : 'Selected for this product') 
                    : (language === 'fr' ? 'Définir comme mon rôle' : 'Set as my role')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
