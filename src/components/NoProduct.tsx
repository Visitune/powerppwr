import React from 'react';
import { Language } from '../types/ppwr';
import { Package } from 'lucide-react';

interface Props {
  language: Language;
  examplesHidden: boolean;
  onCreate: () => void;
  onGoToProducts: () => void;
}

/** Shown on product-dependent pages when there is no product to work on. */
export const NoProduct: React.FC<Props> = ({ language, examplesHidden, onCreate, onGoToProducts }) => {
  const fr = language === 'fr';
  return (
    <div className="max-w-xl mx-auto text-center py-16 space-y-4">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl dark:bg-slate-800 bg-slate-100">
        <Package className="h-7 w-7 text-[#C2410C] dark:text-[#FB923C]" aria-hidden="true" />
      </span>
      <h1 className="text-xl font-extrabold dark:text-white text-slate-900">{fr ? 'Aucun produit sélectionné' : 'No product selected'}</h1>
      <p className="text-sm dark:text-slate-300 text-slate-600">
        {fr
          ? 'Créez un produit pour commencer son dossier de conformité.'
          : 'Create a product to start its compliance dossier.'}
        {examplesHidden && (fr
          ? ' Les exemples sont masqués (voir Paramètres).'
          : ' Examples are hidden (see Settings).')}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onCreate} className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
          {fr ? 'Créer un produit' : 'Create a product'}
        </button>
        <button type="button" onClick={onGoToProducts} className="px-4 py-2 text-sm font-semibold rounded-lg border dark:border-slate-700 border-slate-300 dark:text-slate-200 text-slate-800 dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors">
          {fr ? 'Mes produits' : 'My products'}
        </button>
      </div>
    </div>
  );
};
