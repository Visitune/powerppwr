import React, { useEffect, useState } from 'react';
import { ComplianceStatus, Language, PackagingItem } from '../types/ppwr';
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
  Settings,
  LifeBuoy,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export type ActiveTab = 'home' | 'products' | 'workflow' | 'vault' | 'compliance' | 'gaps' | 'declaration' | 'roles' | 'pricing' | 'regulatory' | 'settings' | 'guide';

interface AppShellProps {
  currentTab: ActiveTab;
  setCurrentTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  products: PackagingItem[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  presets: PackagingItem[];
  onAddExample: (id: string) => void;
  status: ComplianceStatus;
  onExportPdf: () => void;
  children: React.ReactNode;
}

interface NavEntry {
  tab: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  step?: number;
}

const STATUS_STYLES: Record<ComplianceStatus, { dot: string; text: string }> = {
  compliant: { dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
  incomplete: { dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400' },
  critical: { dot: 'bg-red-500', text: 'text-red-700 dark:text-red-400' },
  missing: { dot: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-400' },
};

const COLLAPSE_KEY = 'powerppwr_sidebar_collapsed';

function readCollapsed(): boolean {
  try { return localStorage.getItem(COLLAPSE_KEY) === '1'; } catch { return false; }
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  theme,
  setTheme,
  products,
  selectedProductId,
  onSelectProduct,
  presets,
  onAddExample,
  status,
  onExportPdf,
  children,
}) => {
  const t = translations[language];
  const fr = language === 'fr';
  const [collapsed, setCollapsed] = useState<boolean>(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0'); } catch { /* storage unavailable */ }
  }, [collapsed]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const groups: { title: string; items: NavEntry[] }[] = [
    {
      title: fr ? 'Pilotage' : 'Overview',
      items: [
        { tab: 'home', label: fr ? 'Accueil' : 'Home', icon: Home },
        { tab: 'products', label: fr ? 'Mes produits' : 'My products', icon: Package },
      ],
    },
    {
      title: fr ? 'Dossier de conformité' : 'Compliance dossier',
      items: [
        { tab: 'workflow', label: t.nav.workflow, icon: Zap, step: 1 },
        { tab: 'vault', label: t.nav.vault, icon: ShieldCheck, step: 2 },
        { tab: 'compliance', label: t.nav.compliance, icon: CheckCircle2, step: 3 },
        { tab: 'gaps', label: t.nav.gaps, icon: Mail, step: 4 },
        { tab: 'declaration', label: t.nav.declaration, icon: FileText, step: 5 },
      ],
    },
    {
      title: fr ? 'Ressources' : 'Resources',
      items: [
        { tab: 'roles', label: t.nav.roles, icon: UserCheck },
        { tab: 'regulatory', label: t.nav.regulatory, icon: BookOpen },
        { tab: 'guide', label: 'Guide', icon: LifeBuoy },
        { tab: 'pricing', label: t.nav.pricing, icon: Calculator },
        { tab: 'settings', label: fr ? 'Paramètres' : 'Settings', icon: Settings },
      ],
    },
  ];

  const currentLabel = groups.flatMap(g => g.items).find(i => i.tab === currentTab)?.label || '';
  const currentGroup = groups.find(g => g.items.some(i => i.tab === currentTab))?.title || '';
  const statusLabel = (t.compliance as Record<string, string>)[status] || status;
  const statusStyle = STATUS_STYLES[status];

  const go = (tab: ActiveTab) => {
    setCurrentTab(tab);
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  };

  // `rail` = icon-only desktop mode. The mobile drawer is always expanded.
  const renderSidebar = (rail: boolean) => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className={`flex items-center ${rail ? 'justify-center px-2' : 'gap-2.5 px-4'} h-16 shrink-0 border-b dark:border-slate-800 border-slate-200`}>
        <button
          type="button"
          onClick={() => go('home')}
          className="flex items-center gap-2.5 min-w-0 group"
          aria-label={fr ? 'powerPPWR, retour à l\'accueil' : 'powerPPWR, back to home'}
        >
          <span className="flex items-center rounded-lg bg-[#0B1120] border border-slate-800/80 px-2 py-1.5 group-hover:border-[#F97316]/50 transition-colors shrink-0">
            <img src="/logovisipilot-300x81-1.png" alt="VisiPilot" className={`${rail ? 'h-4' : 'h-5'} w-auto object-contain`} />
          </span>
          {!rail && (
            <span className="flex flex-col items-start min-w-0 leading-tight">
              <span className="font-display text-sm font-extrabold tracking-tight dark:text-white text-slate-900 whitespace-nowrap">powerPPWR</span>
              <span className="text-[10px] font-mono font-bold text-[#F97316] whitespace-nowrap">UE 2025/40</span>
            </span>
          )}
        </button>
      </div>

      {/* Current product */}
      {!rail ? (
        <div className="px-3 pt-3 pb-1 shrink-0 space-y-2">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider dark:text-slate-500 text-slate-500">
              {fr ? 'Produit en cours' : 'Current product'}
            </span>
            <select
              value={selectedProductId}
              onChange={(e) => onSelectProduct(e.target.value)}
              className="mt-1 w-full text-xs font-semibold dark:bg-slate-900 bg-slate-50 dark:text-slate-100 text-slate-800 border dark:border-slate-700 border-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-2 px-0.5">
            <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} aria-hidden="true" />
            <span className={`text-xs font-semibold ${statusStyle.text}`}>{statusLabel}</span>
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-3 shrink-0" title={`${statusLabel}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${statusStyle.dot}`} role="img" aria-label={statusLabel} />
        </div>
      )}

      {/* Navigation */}
      <nav aria-label={fr ? 'Navigation principale' : 'Main navigation'} className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
        {groups.map(group => (
          <div key={group.title}>
            {!rail ? (
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider dark:text-slate-500 text-slate-500">{group.title}</div>
            ) : (
              <div className="mx-3 mb-1 border-t dark:border-slate-800 border-slate-200" />
            )}
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const active = currentTab === item.tab;
                const Icon = item.icon;
                return (
                  <li key={item.tab}>
                    <button
                      type="button"
                      onClick={() => go(item.tab)}
                      aria-current={active ? 'page' : undefined}
                      title={rail ? item.label : undefined}
                      className={`w-full flex items-center ${rail ? 'justify-center px-0 py-2.5' : 'gap-2.5 px-2.5 py-2'} rounded-lg text-[13px] font-semibold transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        active
                          ? 'dark:bg-indigo-500/15 bg-indigo-50 dark:text-indigo-200 text-indigo-700'
                          : 'dark:text-slate-300 text-slate-700 dark:hover:bg-slate-800/60 hover:bg-slate-100'
                      }`}
                    >
                      {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-[#F97316]" aria-hidden="true" />}
                      <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-[#F97316]' : 'dark:text-slate-400 text-slate-500'}`} />
                      {!rail && <span className="truncate text-left flex-1">{item.label}</span>}
                      {!rail && item.step && (
                        <span className={`text-[10px] font-mono font-bold h-4 min-w-4 px-1 rounded flex items-center justify-center ${active ? 'bg-[#F97316]/15 text-[#F97316]' : 'dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-500'}`}>
                          {item.step}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer controls */}
      <div className={`shrink-0 border-t dark:border-slate-800 border-slate-200 ${rail ? 'p-2' : 'p-3'} space-y-2`}>
        {!rail && presets.length > 0 && (
          <select
            value=""
            onChange={(e) => { if (e.target.value) onAddExample(e.target.value); }}
            aria-label={fr ? 'Ajouter un exemple' : 'Add an example'}
            className="w-full text-xs dark:bg-slate-900 bg-slate-50 dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">{fr ? '+ Ajouter un exemple…' : '+ Add an example…'}</option>
            {presets.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
        <div className={`flex ${rail ? 'flex-col' : 'flex-row'} items-center gap-1.5`}>
          <button
            type="button"
            onClick={() => setLanguage(fr ? 'en' : 'fr')}
            className={`flex items-center justify-center gap-1.5 ${rail ? 'w-full' : 'flex-1'} px-2.5 py-1.5 text-xs font-semibold rounded-lg border dark:border-slate-700 border-slate-300 dark:bg-slate-900 bg-slate-50 dark:text-slate-200 text-slate-800 hover:text-indigo-500 transition-colors`}
            aria-label={fr ? 'Passer en anglais' : 'Switch to French'}
          >
            <Globe className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>{language.toUpperCase()}</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`flex items-center justify-center ${rail ? 'w-full' : ''} p-2 rounded-lg border dark:border-slate-700 border-slate-300 dark:bg-slate-900 bg-slate-50 hover:text-indigo-500 transition-colors`}
            aria-label={theme === 'dark' ? (fr ? 'Passer en mode clair' : 'Switch to light mode') : (fr ? 'Passer en mode sombre' : 'Switch to dark mode')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside
        className={`no-print print:hidden hidden lg:block fixed inset-y-0 left-0 z-40 ${collapsed ? 'w-[68px]' : 'w-64'} border-r dark:border-slate-800/80 border-slate-200 dark:bg-[#0B1120] bg-white transition-[width] duration-200`}
      >
        {renderSidebar(collapsed)}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 no-print print:hidden" role="dialog" aria-modal="true" aria-label={fr ? 'Menu' : 'Menu'}>
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] dark:bg-[#0B1120] bg-white border-r dark:border-slate-800 border-slate-200 shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-2 top-3 p-1.5 rounded-lg dark:text-slate-300 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 z-10"
              aria-label={fr ? 'Fermer le menu' : 'Close menu'}
            >
              <X className="h-4 w-4" />
            </button>
            {renderSidebar(false)}
          </aside>
        </div>
      )}

      {/* Content column */}
      <div className={`${collapsed ? 'lg:pl-[68px]' : 'lg:pl-64'} print:pl-0 flex min-h-screen flex-col transition-[padding] duration-200`}>
        {/* Top bar */}
        <header className="no-print print:hidden sticky top-0 z-30 h-14 flex items-center gap-3 px-4 sm:px-6 lg:px-8 border-b dark:border-slate-800/80 border-slate-200/90 dark:bg-[#0B1120]/95 bg-white/95 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg dark:text-slate-200 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={fr ? 'Ouvrir le menu' : 'Open menu'}
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(c => !c)}
            className="hidden lg:flex p-2 -ml-2 rounded-lg dark:text-slate-300 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={collapsed ? (fr ? 'Déplier le menu' : 'Expand menu') : (fr ? 'Replier le menu' : 'Collapse menu')}
            aria-pressed={collapsed}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>

          <div className="min-w-0 flex items-center gap-2 text-sm">
            <span className="hidden sm:inline dark:text-slate-500 text-slate-500 truncate">{currentGroup}</span>
            <span className="hidden sm:inline dark:text-slate-600 text-slate-400" aria-hidden="true">/</span>
            <span className="font-semibold dark:text-white text-slate-900 truncate">{currentLabel}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className={`hidden md:flex items-center gap-1.5 text-xs font-semibold ${statusStyle.text}`}>
              <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} aria-hidden="true" />
              {statusLabel}
            </span>
            <button
              type="button"
              onClick={onExportPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-orange-500 to-indigo-600 hover:from-orange-600 hover:to-indigo-700 text-white shadow-sm shadow-orange-500/20 transition-all whitespace-nowrap active:scale-[0.98]"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t.nav.generateDoc}</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
};
