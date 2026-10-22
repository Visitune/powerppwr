import React, { useState } from 'react';
import { Language, PackagingItem } from '../types/ppwr';
import { saveProduct, deleteProduct } from '../utils/storage';

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
    <div className="max-w-4xl mx-auto space-y-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">{fr ? 'Mes produits' : 'My products'}</h1>
        <div className="flex gap-2">
          <button onClick={onCreate} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white">{fr ? 'Nouveau' : 'New'}</button>
          <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 text-xs font-semibold rounded-lg border dark:border-slate-700 border-slate-300">{fr ? 'Importer JSON' : 'Import JSON'}</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
        </div>
      </div>
      {importError && <div className="text-red-500 text-sm">{importError}</div>}
      <div className="space-y-2">
        {products.map(p => (
          <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg border dark:border-slate-800 border-slate-200 ${p.id === selectedId ? 'ring-2 ring-indigo-500' : ''}`}>
            <button onClick={() => onSelect(p.id)} className="text-left flex-1">
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs text-slate-500">{p.sku}</div>
            </button>
            <div className="flex gap-2">
              <button onClick={() => exportJson(p)} className="text-xs px-2 py-1 border rounded dark:border-slate-700 border-slate-300">{fr ? 'Exporter' : 'Export'}</button>
              <button onClick={() => onDuplicate(p.id)} className="text-xs px-2 py-1 border rounded dark:border-slate-700 border-slate-300">{fr ? 'Dupliquer' : 'Duplicate'}</button>
              <button onClick={() => onDelete(p.id)} disabled={products.length <= 1} title={products.length <= 1 ? (fr ? 'Impossible de supprimer le dernier produit' : 'Cannot delete the last product') : ''} className="text-xs px-2 py-1 border rounded border-red-300 text-red-600 disabled:opacity-40 disabled:cursor-not-allowed">{fr ? 'Supprimer' : 'Delete'}</button>
            </div>
          </div>
        ))}
        {products.length === 0 && <div className="text-slate-500 text-sm">{fr ? 'Aucun produit' : 'No products'}</div>}
      </div>
    </div>
  );
};