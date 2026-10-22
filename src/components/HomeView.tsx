import React from 'react';
import { Language } from '../types/ppwr';
import { RULES_VERSION, DISCLAIMER } from '../data/rules2025-40';

export const HomeView: React.FC<{ language: Language; onNavigate: (tab: any) => void }> = ({ language, onNavigate }) => {
  const fr = language === 'fr';
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold">{fr ? 'powerPPWR — Conformité emballage UE 2025/40' : 'powerPPWR — EU 2025/40 Packaging Compliance'}</h1>
        <p className="text-slate-600 dark:text-slate-300">{fr ? 'Évaluez la conformité d\'un emballage et générez une déclaration (Annexe VII). Données local-first.' : 'Assess packaging compliance and generate a declaration (Annex VII). Local-first data.'}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {(fr ? ['1. Créez/importez un produit', '2. Chargez vos documents', '3. Générez la déclaration'] : ['1. Create/import a product', '2. Upload documents', '3. Generate declaration']).map((s, i) => (
          <div key={i} className="rounded-xl border p-4 dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white">{s}</div>
        ))}
      </div>
      <div className="flex gap-3 justify-center">
        <button onClick={() => onNavigate('products')} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">{fr ? 'Mes produits' : 'My products'}</button>
        <button onClick={() => onNavigate('workflow')} className="px-4 py-2 rounded-lg border dark:border-slate-700 border-slate-300">{fr ? 'Parcours guidé' : 'Guided workflow'}</button>
      </div>
      <div className="text-xs text-slate-500 text-center space-y-1">
        <div>{RULES_VERSION}</div>
        <div>{DISCLAIMER}</div>
      </div>
    </div>
  );
};