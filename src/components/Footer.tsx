import React from 'react';
import { Language } from '../types/ppwr';
import { translations } from '../utils/i18n';
import { ExternalLink } from 'lucide-react';
import { RULES_VERSION, DISCLAIMER } from '../data/rules2025-40';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  return (
    <footer className="border-t dark:border-slate-800/80 border-slate-200 dark:bg-[#0B1120] bg-white py-8 text-xs dark:text-slate-400 text-slate-500 no-print mt-12 transition-colors">
      <div className="flex w-full flex-col md:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Legal basis with VisiPilot logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center px-2 py-1 rounded-lg bg-[#0B1120] border border-slate-800 shadow-xs">
            <img
              src="/logovisipilot-300x81-1.png"
              alt="VisiPilot Logo"
              className="h-5 w-auto object-contain"
            />
          </div>
          <div>
            <span className="font-bold dark:text-slate-200 text-slate-800">powerPPWR</span>
            <span className="mx-1.5 text-slate-400">·</span>
            <span>
              {language === 'fr' 
                ? 'Outil d\'aide logicielle mis à disposition par VisiPilot' 
                : 'Software assistance tool provided by VisiPilot'}
            </span>
            <span className="mx-1.5 text-slate-400">·</span>
            <span className="dark:text-amber-400/90 text-amber-700 font-medium">
              {language === 'fr'
                ? 'Déclarations sous la responsabilité exclusive du client'
                : 'Declarations under sole liability of client'}
            </span>
          </div>
        </div>

        {/* VisiPilot Portal reference */}
        <div className="flex flex-col items-end gap-1 text-[11px] font-medium">
          <a
            href="https://visitune.github.io/PPWR/#/fr/home"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors"
          >
            {language === 'fr' ? 'Wiki VisiPilot & Portail Réglementaire' : 'VisiPilot Wiki & Regulatory Portal'}
          </a>
          <span className="text-slate-500">
            {language === 'fr' ? 'Mis à jour régulièrement pour une conformité totale.' : 'Regularly updated for full compliance.'}
          </span>
        </div>

      </div>
      <div className="px-4 sm:px-6 lg:px-8 mt-4 text-[10px] text-slate-500">
        <div>{RULES_VERSION}</div>
        <div>{DISCLAIMER}</div>
      </div>
    </footer>
  );
};
