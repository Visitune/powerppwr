import React, { useState } from 'react';
import { ComplianceStatus, Language, PackagingItem } from '../types/ppwr';
import { evaluatePackagingCompliance } from '../utils/complianceEngine';
import { translations } from '../utils/i18n';

const STATUS_STYLES: Record<ComplianceStatus, { dot: string; badge: string }> = {
  compliant: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30' },
  incomplete: { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30' },
  critical: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30' },
  missing: { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/30' },
};

interface Props {
  products: PackagingItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onImport: (item: PackagingItem) => void;
  language: Language;
}

export const ProductsView: React.FC<Props> = ({ products, selectedId, onSelect, onCreate, onDuplicate, onDelete, onImport, language }) => {
  const fr = language === 'fr';
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState('');

  const exportJson = (item: PackagingItem) => {
    const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.sku || item.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed?.id || !parsed?.name || !Array.isArray(parsed?.components)) throw new Error('invalid');
        onImport(parsed);
        setImportError('');
      } catch {
        setImportError(fr ? 'Fichier invalide' : 'Invalid file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold dark:text-white text-slate-900">{fr ? 'Mes produits' : 'My products'}</h1>
          <p className="text-sm dark:text-slate-400 text-slate-600 mt-0.5">
            {fr ? 'Cliquez sur un produit pour travailler dessus. Les données restent dans votre navigateur.' : 'Click a product to work on it. Data stays in your browser.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onCreate} className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">{fr ? 'Nouveau produit' : 'New product'}</button>
          <button type="button" onClick={() => fileRef.current?.click()} className="px-3.5 py-2 text-xs font-semibold rounded-lg border dark:border-slate-700 border-slate-300 dark:text-slate-200 dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors">{fr ? 'Importer JSON' : 'Import JSON'}</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
        </div>
      </div>
      {importError && <div role="alert" className="text-red-500 text-sm">{importError}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3 lg:gap-4">
        {products.map(p => {
          const rep = evaluatePackagingCompliance(p);
          const st = STATUS_STYLES[rep.overallStatus];
          const selected = p.id === selectedId;
          return (
            <div key={p.id} className={`rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-4 flex flex-col gap-3 ${selected ? 'ring-2 ring-indigo-500' : ''}`}>
              <button type="button" onClick={() => onSelect(p.id)} aria-pressed={selected} className="text-left min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold dark:text-white text-slate-900 break-words">{p.name}</div>
                  {selected && <span className="shrink-0 text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-300">{fr ? 'En cours' : 'Active'}</span>}
                </div>
                <div className="text-xs font-mono text-slate-500 mt-0.5">{p.sku}</div>
              </button>
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 font-semibold rounded-full border ${st.badge}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} aria-hidden="true" />
                  {(translations[language].compliance as Record<string, string>)[rep.overallStatus] || rep.overallStatus}
                </span>
                <span className="font-mono dark:text-slate-400 text-slate-600">{fr ? 'Recyclabilité' : 'Recyclability'} {rep.recyclabilityGrade} · {rep.recyclabilityScore}%</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto pt-1">
                <button type="button" onClick={() => exportJson(p)} className="text-xs px-2.5 py-1.5 border rounded-md dark:border-slate-700 border-slate-300 dark:text-slate-200 dark:hover:bg-slate-800 hover:bg-slate-50">{fr ? 'Exporter' : 'Export'}</button>
                <button type="button" onClick={() => onDuplicate(p.id)} className="text-xs px-2.5 py-1.5 border rounded-md dark:border-slate-700 border-slate-300 dark:text-slate-200 dark:hover:bg-slate-800 hover:bg-slate-50">{fr ? 'Dupliquer' : 'Duplicate'}</button>
                <button type="button" onClick={() => onDelete(p.id)} disabled={products.length <= 1} title={products.length <= 1 ? (fr ? 'Impossible de supprimer le dernier produit' : 'Cannot delete the last product') : ''} className="text-xs px-2.5 py-1.5 border rounded-md border-red-300 text-red-600 disabled:opacity-40 disabled:cursor-not-allowed">{fr ? 'Supprimer' : 'Delete'}</button>
              </div>
            </div>
          );
        })}
        {products.length === 0 && <div className="text-slate-500 text-sm">{fr ? 'Aucun produit' : 'No products'}</div>}
      </div>
    </div>
  );
};