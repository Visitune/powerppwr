import React, { useState } from 'react';
import { Settings, Trash2, RotateCcw } from 'lucide-react';

interface SettingsViewProps {
  showExamples: boolean;
  setShowExamples: (show: boolean) => void;
  exampleCount: number;
  onRemoveExamples: () => void;
  onRestoreExamples: () => void;
  language: 'fr' | 'en';
}

export const SettingsView: React.FC<SettingsViewProps> = ({ showExamples, setShowExamples, exampleCount, onRemoveExamples, onRestoreExamples, language }) => {
  const fr = language === 'fr';
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <div className="w-full max-w-3xl space-y-6">
      <h1 className="text-2xl font-extrabold flex items-center gap-2 dark:text-white text-slate-900">
        <Settings className="w-6 h-6" aria-hidden="true" />
        {fr ? 'Paramètres' : 'Settings'}
      </h1>

      <section aria-labelledby="settings-examples" className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-6 space-y-5">
        <h2 id="settings-examples" className="text-base font-bold dark:text-white text-slate-900">
          {fr ? 'Exemples de démonstration' : 'Demo examples'}
        </h2>

        <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
          <div>
            <p id="examples-switch-label" className="font-medium dark:text-slate-100 text-slate-900">{fr ? 'Afficher les exemples' : 'Show examples'}</p>
            <p className="text-sm dark:text-slate-400 text-slate-600">
              {fr
                ? 'Désactivé : les produits d\'exemple disparaissent de toute l\'application (menu, liste, accueil). Vos propres produits ne sont pas touchés.'
                : 'Off: example products disappear from the whole app (menu, list, home). Your own products are untouched.'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={showExamples}
            aria-labelledby="examples-switch-label"
            onClick={() => setShowExamples(!showExamples)}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${showExamples ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
          >
            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${showExamples ? 'translate-x-6' : 'translate-x-1'}`} />
            <span className="sr-only">{showExamples ? (fr ? 'Activé' : 'On') : (fr ? 'Désactivé' : 'Off')}</span>
          </button>
        </div>

        <div className="border-t dark:border-slate-800 border-slate-200 pt-4 space-y-3">
          <p className="text-sm dark:text-slate-300 text-slate-700">
            {fr
              ? `${exampleCount} exemple(s) enregistré(s) dans ce navigateur.`
              : `${exampleCount} example(s) stored in this browser.`}
          </p>
          <div className="flex flex-wrap gap-3">
            {!confirmRemove ? (
              <button
                type="button"
                onClick={() => setConfirmRemove(true)}
                disabled={exampleCount === 0}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg border border-red-300 text-red-600 dark:border-red-500/50 dark:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                {fr ? 'Supprimer définitivement les exemples' : 'Delete examples permanently'}
              </button>
            ) : (
              <div role="alert" className="flex flex-wrap items-center gap-3 rounded-lg border border-red-300 dark:border-red-500/50 bg-red-50 dark:bg-red-500/10 px-3 py-2">
                <span className="text-sm text-red-700 dark:text-red-300">{fr ? 'Supprimer les exemples et leurs modifications ?' : 'Delete the examples and their changes?'}</span>
                <button type="button" onClick={() => { onRemoveExamples(); setConfirmRemove(false); }} className="px-3 py-1 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-700">
                  {fr ? 'Oui, supprimer' : 'Yes, delete'}
                </button>
                <button type="button" onClick={() => setConfirmRemove(false)} className="px-3 py-1 text-sm font-semibold rounded-md border dark:border-slate-600 border-slate-300 dark:text-slate-200">
                  {fr ? 'Annuler' : 'Cancel'}
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={onRestoreExamples}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg border dark:border-slate-700 border-slate-300 dark:text-slate-200 text-slate-800 dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {fr ? 'Recharger les exemples d\'origine' : 'Reload original examples'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
