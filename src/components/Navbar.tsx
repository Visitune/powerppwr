import React from 'react';
import { Language, PackagingItem } from '../types/ppwr';
import { translations } from '../utils/i18n';
import { 
  Home,
  Package,
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  BookOpen, 
  Download, 
  Globe, 
  Sun, 
  Moon, 
  Mail, 
  UserCheck, 
  Zap,
  Calculator,
  Settings
} from 'lucide-react';

export type ActiveTab = 'home' | 'products' | 'workflow' | 'vault' | 'compliance' | 'gaps' | 'declaration' | 'roles' | 'pricing' | 'regulatory' | 'settings' | 'guide';

interface NavbarProps {
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  presets: PackagingItem[];
  selectedPresetId: string;
  onSelectPreset: (id: string) => void;
  onExportPdf: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  theme,
  setTheme,
  presets,
  selectedPresetId,
  onSelectPreset,
  onExportPdf,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b dark:border-slate-800/80 border-slate-200/90 dark:bg-[#0B1120]/95 bg-white/95 backdrop-blur-md transition-colors shadow-xs">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8 gap-3">
        
        {/* Zone 1: Authentic VisiPilot Logo & powerPPWR Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setCurrentTab('workflow'); }} 
            className="flex items-center gap-2.5 group"
          >
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#0B1120] border border-slate-800/80 shadow-xs group-hover:border-[#F97316]/50 transition-colors">
              <img
                src="/logovisipilot-300x81-1.png"
                alt="VisiPilot Logo"
                className="h-6 sm:h-7 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div className="hidden sm:flex flex-col border-l dark:border-slate-700 border-slate-300 pl-2.5">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-sm font-extrabold tracking-tight dark:text-white text-slate-900">powerPPWR</span>
                <span className="text-[10px] font-mono font-bold bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 px-1 py-0.2 rounded">
                  UE 2025/40
                </span>
              </div>
              <span className="text-[10px] font-mono dark:text-slate-400 text-slate-500">
                Operational Excellence
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Navigation Links with Power PPWR feature coverage */}
        <nav className="hidden xl:flex items-center gap-1">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 relative ${
              currentTab === 'home'
                ? 'dark:bg-indigo-600/20 bg-indigo-50 dark:text-indigo-300 text-indigo-700 border dark:border-indigo-500/40 border-indigo-300'
                : 'dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800/50 hover:bg-slate-100'
            }`}
          >
            <Home className="h-3.5 w-3.5 text-[#F97316]" />
            <span>{language === 'fr' ? 'Accueil' : 'Home'}</span>
          </button>

          <button
            onClick={() => setCurrentTab('products')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 relative ${
              currentTab === 'products'
                ? 'dark:bg-indigo-600/20 bg-indigo-50 dark:text-indigo-300 text-indigo-700 border dark:border-indigo-500/40 border-indigo-300'
                : 'dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800/50 hover:bg-slate-100'
            }`}
          >
            <Package className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>{language === 'fr' ? 'Mes produits' : 'My products'}</span>
          </button>

          <button
            onClick={() => setCurrentTab('workflow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 relative ${
              currentTab === 'workflow'
                ? 'dark:bg-indigo-600/20 bg-orange-50 dark:text-indigo-300 text-orange-700 border dark:border-indigo-500/40 border-orange-300'
                : 'dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800/50 hover:bg-slate-100'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-[#F97316]" />
            <span>{t.nav.workflow}</span>
            {currentTab === 'workflow' && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#F97316]" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('vault')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 relative ${
              currentTab === 'vault'
                ? 'dark:bg-indigo-600/20 bg-indigo-50 dark:text-indigo-300 text-indigo-800 border dark:border-indigo-500/40 border-indigo-200'
                : 'dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800/50 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>{t.nav.vault}</span>
            {currentTab === 'vault' && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#F97316]" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('compliance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 relative ${
              currentTab === 'compliance'
                ? 'dark:bg-indigo-600/20 bg-emerald-50 dark:text-indigo-300 text-emerald-800 border dark:border-indigo-500/40 border-emerald-200'
                : 'dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800/50 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>{t.nav.compliance}</span>
            {currentTab === 'compliance' && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#F97316]" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('gaps')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 relative ${
              currentTab === 'gaps'
                ? 'dark:bg-indigo-600/20 bg-amber-50 dark:text-indigo-300 text-amber-800 border dark:border-indigo-500/40 border-amber-200'
                : 'dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800/50 hover:bg-slate-100'
            }`}
          >
            <Mail className="h-3.5 w-3.5 text-[#F97316]" />
            <span>{t.nav.gaps}</span>
            {currentTab === 'gaps' && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#F97316]" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('declaration')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 relative ${
              currentTab === 'declaration'
                ? 'dark:bg-indigo-600/20 bg-indigo-50 dark:text-indigo-300 text-indigo-800 border dark:border-indigo-500/40 border-indigo-200'
                : 'dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800/50 hover:bg-slate-100'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            <span>{t.nav.declaration}</span>
            {currentTab === 'declaration' && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#F97316]" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('roles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 relative ${
              currentTab === 'roles'
                ? 'dark:bg-indigo-600/20 bg-indigo-50 dark:text-indigo-300 text-indigo-800 border dark:border-indigo-500/40 border-indigo-200'
                : 'dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800/50 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>{t.nav.roles}</span>
            {currentTab === 'roles' && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#F97316]" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('pricing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 relative ${
              currentTab === 'pricing'
                ? 'dark:bg-orange-500/20 bg-orange-50 dark:text-orange-400 text-[#EA580C] border dark:border-orange-500/40 border-orange-200'
                : 'dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800/50 hover:bg-slate-100'
            }`}
          >
            <Calculator className="h-3.5 w-3.5 text-[#F97316]" />
            <span>{t.nav.pricing}</span>
            {currentTab === 'pricing' && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#F97316]" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('regulatory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 relative ${
              currentTab === 'regulatory'
                ? 'dark:bg-indigo-600/20 bg-indigo-50 dark:text-indigo-300 text-indigo-800 border dark:border-indigo-500/40 border-indigo-200'
                : 'dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800/50 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-[#F97316]" />
            <span>{t.nav.regulatory}</span>
            {currentTab === 'regulatory' && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#F97316]" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 relative ${
              currentTab === 'settings'
                ? 'dark:bg-indigo-600/20 bg-indigo-50 dark:text-indigo-300 text-indigo-800 border dark:border-indigo-500/40 border-indigo-200'
                : 'dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800/50 hover:bg-slate-100'
            }`}
          >
            <Settings className="h-3.5 w-3.5 text-slate-500" />
            <span>{language === 'fr' ? 'Paramètres' : 'Settings'}</span>
            {currentTab === 'settings' && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#F97316]" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('guide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 relative ${
              currentTab === 'guide'
                ? 'dark:bg-indigo-600/20 bg-indigo-50 dark:text-indigo-300 text-indigo-800 border dark:border-indigo-500/40 border-indigo-200'
                : 'dark:text-slate-300 text-slate-700 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-800/50 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-slate-500" />
            <span>{language === 'fr' ? 'Guide' : 'Guide'}</span>
            {currentTab === 'guide' && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#F97316]" />
            )}
          </button>
        </nav>

        {/* Zone 3: Controls (Preset Selector, Theme Toggle, FR/EN Toggle, Primary Action) */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Preset Selector */}
          <div className="hidden lg:flex items-center gap-1.5">
            <select
              value={selectedPresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="text-xs dark:bg-slate-900 bg-slate-50 dark:border-slate-700 border-slate-300 rounded-lg px-2.5 py-1.5 dark:text-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer shadow-xs"
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name.length > 22 ? p.name.substring(0, 22) + '...' : p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Switcher (Dark / Light) */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-center p-2 rounded-lg border dark:border-slate-700 border-slate-300 dark:bg-slate-900 bg-slate-50 dark:text-slate-200 text-slate-700 hover:text-indigo-500 transition-colors shadow-xs"
            title={theme === 'dark' ? 'Passer en mode clair' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600" />
            )}
          </button>

          {/* Bilingual Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border dark:border-slate-700 border-slate-300 dark:bg-slate-900 bg-slate-50 dark:text-slate-200 text-slate-800 hover:text-indigo-500 transition-colors whitespace-nowrap shadow-xs"
            title="Basculer la langue / Switch language"
          >
            <Globe className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-indigo-600 hover:from-orange-600 hover:to-indigo-700 text-white shadow-sm shadow-orange-500/20 transition-all whitespace-nowrap active:scale-[0.98]"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.nav.generateDoc}</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>

      </div>

      {/* Sub-header on smaller screens / mobile scrollable */}
      <div className="flex xl:hidden overflow-x-auto border-t dark:border-slate-800 border-slate-200 dark:bg-[#0B1120] bg-slate-50 px-4 py-2 gap-2 scrollbar-none">
        <button
          onClick={() => setCurrentTab('workflow')}
          className={`px-3 py-1 text-xs font-semibold rounded whitespace-nowrap ${currentTab === 'workflow' ? 'bg-[#F97316] text-white' : 'dark:text-slate-400 text-slate-700'}`}
        >
          {t.nav.workflow}
        </button>
        <button
          onClick={() => setCurrentTab('vault')}
          className={`px-3 py-1 text-xs font-semibold rounded whitespace-nowrap ${currentTab === 'vault' ? 'bg-[#8B5CF6] text-white' : 'dark:text-slate-400 text-slate-700'}`}
        >
          {t.nav.vault}
        </button>
        <button
          onClick={() => setCurrentTab('compliance')}
          className={`px-3 py-1 text-xs font-semibold rounded whitespace-nowrap ${currentTab === 'compliance' ? 'bg-[#8B5CF6] text-white' : 'dark:text-slate-400 text-slate-700'}`}
        >
          {t.nav.compliance}
        </button>
        <button
          onClick={() => setCurrentTab('gaps')}
          className={`px-3 py-1 text-xs font-semibold rounded whitespace-nowrap ${currentTab === 'gaps' ? 'bg-[#F97316] text-white' : 'dark:text-slate-400 text-slate-700'}`}
        >
          {t.nav.gaps}
        </button>
        <button
          onClick={() => setCurrentTab('declaration')}
          className={`px-3 py-1 text-xs font-semibold rounded whitespace-nowrap ${currentTab === 'declaration' ? 'bg-[#8B5CF6] text-white' : 'dark:text-slate-400 text-slate-700'}`}
        >
          {t.nav.declaration}
        </button>
        <button
          onClick={() => setCurrentTab('roles')}
          className={`px-3 py-1 text-xs font-semibold rounded whitespace-nowrap ${currentTab === 'roles' ? 'bg-[#8B5CF6] text-white' : 'dark:text-slate-400 text-slate-700'}`}
        >
          {t.nav.roles}
        </button>
        <button
          onClick={() => setCurrentTab('pricing')}
          className={`px-3 py-1 text-xs font-semibold rounded whitespace-nowrap ${currentTab === 'pricing' ? 'bg-[#F97316] text-white' : 'dark:text-slate-400 text-slate-700'}`}
        >
          {t.nav.pricing}
        </button>
        <button
          onClick={() => setCurrentTab('regulatory')}
          className={`px-3 py-1 text-xs font-semibold rounded whitespace-nowrap ${currentTab === 'regulatory' ? 'bg-[#8B5CF6] text-white' : 'dark:text-slate-400 text-slate-700'}`}
        >
          {t.nav.regulatory}
        </button>
      </div>
    </header>
  );
};
