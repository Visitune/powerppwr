import React from 'react';
import { Settings, Trash2, Eye, EyeOff } from 'lucide-react';

interface SettingsViewProps {
  showExamples: boolean;
  setShowExamples: (show: boolean) => void;
  language: 'fr' | 'en';
}

export const SettingsView: React.FC<SettingsViewProps> = ({ showExamples, setShowExamples, language }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="w-6 h-6" />
        {language === 'fr' ? 'Paramètres' : 'Settings'}
      </h2>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4">
          {language === 'fr' ? 'Configuration de l\'application' : 'Application Configuration'}
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{language === 'fr' ? 'Afficher les exemples' : 'Show example presets'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {language === 'fr' ? 'Masquer ou afficher les modèles de démonstration' : 'Hide or show demo presets'}
            </p>
          </div>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showExamples 
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200' 
                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {showExamples ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            {showExamples ? (language === 'fr' ? 'Activé' : 'Enabled') : (language === 'fr' ? 'Désactivé' : 'Disabled')}
          </button>
        </div>
      </div>
    </div>
  );
};
