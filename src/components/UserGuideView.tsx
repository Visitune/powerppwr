import React from 'react';
import { BookOpen } from 'lucide-react';

interface UserGuideViewProps {
  language: 'fr' | 'en';
}

export const UserGuideView: React.FC<UserGuideViewProps> = ({ language }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <BookOpen className="w-6 h-6" />
        {language === 'fr' ? 'Guide de navigation' : 'Navigation Guide'}
      </h2>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700 space-y-4">
        <h3 className="text-xl font-semibold">{language === 'fr' ? 'Comment utiliser powerPPWR' : 'How to use powerPPWR'}</h3>
        <ul className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>{language === 'fr' ? 'Workflow rapide' : 'Quick Workflow'}:</strong> {language === 'fr' ? 'Commencez par le flux de travail rapide pour une première évaluation.' : 'Start with the quick workflow for an initial assessment.'}</li>
          <li><strong>{language === 'fr' ? 'Coffre-fort' : 'Document Vault'}:</strong> {language === 'fr' ? 'Gérez vos documents techniques et preuves de conformité.' : 'Manage your technical documents and compliance proofs.'}</li>
          <li><strong>{language === 'fr' ? 'Moteur de conformité' : 'Compliance Engine'}:</strong> {language === 'fr' ? 'Analysez la conformité de vos emballages.' : 'Analyze the compliance of your packaging.'}</li>
          <li><strong>{language === 'fr' ? 'Déclaration' : 'Declaration'}:</strong> {language === 'fr' ? 'Générez et finalisez votre déclaration de conformité officielle.' : 'Generate and finalize your official declaration of conformity.'}</li>
        </ul>
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border dark:border-slate-700">
          <h4 className="font-semibold">{language === 'fr' ? 'Besoin de plus de détails ?' : 'Need more details?'}</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
             {language === 'fr' ? 'Consultez le Wiki VisiPilot & Portail Réglementaire pour une documentation exhaustive, mise à jour régulièrement.' : 'Consult the VisiPilot Wiki & Regulatory Portal for exhaustive, regularly updated documentation.'}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 italic">
             {language === 'fr' ? 'Note : Vos documents peuvent être fournis dans différentes langues, le moteur d\'analyse est conçu pour les traiter.' : 'Note: Your documents can be provided in various languages, the analysis engine is designed to process them.'}
          </p>
          <a href="https://visitune.github.io/PPWR/#/fr/home" target="_blank" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-3 inline-block">
            {language === 'fr' ? 'Accéder au Portail' : 'Access Portal'}
          </a>
        </div>
      </div>
    </div>
  );
};
