import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Language, PackagingItem } from './types/ppwr';
import { samplePackagingPresets } from './data/samplePresets';
import { evaluatePackagingCompliance } from './utils/complianceEngine';
import { loadProducts, saveProduct, deleteProduct } from './utils/storage';
import { cloneAsExample, createBlankProduct, isExampleProduct, newProductId, normalizeImportedProduct } from './utils/products';
import { usePersistentState } from './utils/usePersistentState';
import { HomeView } from './components/HomeView';
import { ProductsView } from './components/ProductsView';
import { ProductEditor } from './components/ProductEditor';
import { NoProduct } from './components/NoProduct';
import { AppShell, ActiveTab } from './components/Navbar';
import { Quick5MinWorkflow } from './components/Quick5MinWorkflow';
import { DocumentVault } from './components/DocumentVault';
import { ComplianceEngineView } from './components/ComplianceEngineView';
import { SupplierGapGenerator } from './components/SupplierGapGenerator';
import { DeclarationBuilder } from './components/DeclarationBuilder';
import { RoleResponsibilityGuide } from './components/RoleResponsibilityGuide';
import { PricingCalculator } from './components/PricingCalculator';
import { RegulatoryExplorer } from './components/RegulatoryExplorer';
import { SettingsView } from './components/SettingsView';
import { UserGuideView } from './components/UserGuideView';
import { Footer } from './components/Footer';

const SEEDED_KEY = 'powerppwr_seeded';
const SELECTED_KEY = 'powerppwr_selected';
const PRODUCT_TABS: ActiveTab[] = ['editor', 'workflow', 'vault', 'compliance', 'gaps', 'declaration', 'roles'];

const isLanguage = (v: unknown): v is Language => v === 'fr' || v === 'en';
const isTheme = (v: unknown): v is 'dark' | 'light' => v === 'dark' || v === 'light';
const isBool = (v: unknown): v is boolean => typeof v === 'boolean';

function readFlag(key: string): boolean {
  try { return localStorage.getItem(key) === '1'; } catch { return false; }
}
function writeFlag(key: string) {
  try { localStorage.setItem(key, '1'); } catch { /* storage unavailable */ }
}

export default function App() {
  const [language, setLanguage] = usePersistentState<Language>('powerppwr_lang', 'fr', isLanguage);
  const [theme, setTheme] = usePersistentState<'dark' | 'light'>('powerppwr_theme', 'light', isTheme);
  const [showExamples, setShowExamples] = usePersistentState<boolean>('powerppwr_show_examples', true, isBool);
  const [currentTab, setCurrentTab] = useState<ActiveTab>('home');
  const [products, setProducts] = useState<PackagingItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState('');

  const reportError = useCallback((e: unknown) => setSaveError(String((e as Error)?.message || e)), []);

  // Load products from IndexedDB on mount; the demo examples are seeded only once
  useEffect(() => {
    (async () => {
      let list: PackagingItem[] = [];
      try {
        list = await loadProducts();
        if (list.length === 0 && !readFlag(SEEDED_KEY)) {
          list = samplePackagingPresets.map(p => cloneAsExample(p, true));
          for (const p of list) await saveProduct(p);
        }
      } catch (e) {
        reportError(e);
      }
      writeFlag(SEEDED_KEY);
      setProducts(list);
      let lastId = '';
      try { lastId = localStorage.getItem(SELECTED_KEY) || ''; } catch { /* storage unavailable */ }
      setSelectedProductId(list.some(p => p.id === lastId) ? lastId : (list[0]?.id ?? ''));
      setLoaded(true);
    })();
  }, [reportError]);

  // Examples are hidden everywhere when the setting is off
  const visibleProducts = useMemo(
    () => (showExamples ? products : products.filter(p => !isExampleProduct(p))),
    [products, showExamples]
  );
  const activeItem: PackagingItem | null = visibleProducts.find(p => p.id === selectedProductId) ?? visibleProducts[0] ?? null;
  const activeId = activeItem?.id ?? '';
  const exampleCount = useMemo(() => products.filter(isExampleProduct).length, [products]);

  useEffect(() => {
    if (!loaded || !activeId) return;
    try { localStorage.setItem(SELECTED_KEY, activeId); } catch { /* storage unavailable */ }
  }, [activeId, loaded]);

  const setPackagingItem = (updater: any) => {
    if (!activeId) return;
    setProducts(prev => prev.map(p => (p.id === activeId ? (typeof updater === 'function' ? updater(p) : updater) : p)));
  };

  // Persist the active product whenever it changes
  useEffect(() => {
    if (!loaded || !activeItem) return;
    saveProduct(activeItem).catch(reportError);
  }, [activeItem, loaded, reportError]);

  const addAndSelect = (item: PackagingItem, tab?: ActiveTab) =>
    saveProduct(item).then(() => {
      setProducts(prev => [...prev, item]);
      setSelectedProductId(item.id);
      if (tab) setCurrentTab(tab);
    }).catch(reportError);

  const handleAddExample = (presetId: string) => {
    const found = samplePackagingPresets.find(p => p.id === presetId);
    if (found) addAndSelect(cloneAsExample(found));
  };

  const handleCreateProduct = () => { addAndSelect(createBlankProduct(), 'editor'); };

  const handleDuplicate = (id: string) => {
    const src = products.find(p => p.id === id);
    if (!src) return;
    const clone: PackagingItem = JSON.parse(JSON.stringify(src));
    clone.id = newProductId();
    clone.name = src.name.replace(/\s*\((exemple|example)\)\s*$/i, '') + ' (copie)';
    clone.isExample = false;
    delete clone.declarationNumber;
    addAndSelect(clone);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id)
      .then(() => setProducts(prev => prev.filter(p => p.id !== id)))
      .catch(reportError);
  };

  const handleImport = (raw: unknown) => {
    const item = normalizeImportedProduct(raw);
    if (!item) {
      setSaveError(language === 'fr' ? 'Import invalide : ce fichier n\'est pas un produit powerPPWR.' : 'Invalid import: this file is not a powerPPWR product.');
      return;
    }
    setSaveError('');
    addAndSelect(item);
  };

  const handleRemoveExamples = async () => {
    const examples = products.filter(isExampleProduct);
    try {
      for (const p of examples) await deleteProduct(p.id);
      setProducts(prev => prev.filter(p => !isExampleProduct(p)));
    } catch (e) {
      reportError(e);
    }
  };

  const handleRestoreExamples = async () => {
    const missing = samplePackagingPresets.filter(p => !products.some(x => x.id === p.id));
    const fresh = missing.map(p => cloneAsExample(p, true));
    try {
      for (const p of fresh) await saveProduct(p);
      if (fresh.length) setProducts(prev => [...prev, ...fresh]);
      setShowExamples(true);
    } catch (e) {
      reportError(e);
    }
  };

  // Synchronize HTML element class, language and body background
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#0B1120';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#F8FAFC';
    }
  }, [theme]);

  useEffect(() => { document.documentElement.lang = language; }, [language]);

  // Real-time compliance report recalculation
  const complianceReport = useMemo(() => (activeItem ? evaluatePackagingCompliance(activeItem) : null), [activeItem]);

  const handleExportPdf = () => {
    setCurrentTab(activeItem ? 'declaration' : 'products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showNoProduct = loaded && !activeItem && PRODUCT_TABS.includes(currentTab);
  const withProduct = loaded && activeItem && complianceReport;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#0B1120] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white`}>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-indigo-600 focus:text-white">
        {language === 'fr' ? 'Aller au contenu' : 'Skip to content'}
      </a>
      {/* Left sidebar (collapsible) + slim top bar; content uses the full remaining width */}
      <AppShell
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        products={visibleProducts}
        selectedProductId={activeId}
        onSelectProduct={setSelectedProductId}
        presets={showExamples ? samplePackagingPresets : []}
        onAddExample={handleAddExample}
        status={complianceReport ? complianceReport.overallStatus : 'missing'}
        onExportPdf={handleExportPdf}
      >
        <main id="contenu" tabIndex={-1} className="flex-1 w-full px-4 sm:px-6 lg:px-10 2xl:px-14 py-6 lg:py-8 focus:outline-none">
          {!loaded && <div role="status" className="text-center py-10">{language === 'fr' ? 'Chargement…' : 'Loading…'}</div>}
          {loaded && saveError && (
            <div role="alert" className="mb-3 flex items-start justify-between gap-3 rounded-lg border border-red-300 dark:border-red-500/50 bg-red-50 dark:bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              <span>{saveError}</span>
              <button type="button" onClick={() => setSaveError('')} className="font-semibold underline shrink-0">{language === 'fr' ? 'Fermer' : 'Dismiss'}</button>
            </div>
          )}

          {loaded && currentTab === 'home' && (
            <HomeView item={activeItem} report={complianceReport} productCount={visibleProducts.length} language={language} onNavigate={setCurrentTab} />
          )}

          {loaded && currentTab === 'products' && (
            <ProductsView
              products={visibleProducts}
              selectedId={activeId}
              onSelect={setSelectedProductId}
              onEdit={(id) => { setSelectedProductId(id); setCurrentTab('editor'); }}
              onCreate={handleCreateProduct}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onImport={handleImport}
              language={language}
            />
          )}

          {showNoProduct && (
            <NoProduct language={language} examplesHidden={!showExamples} onCreate={handleCreateProduct} onGoToProducts={() => setCurrentTab('products')} />
          )}

          {withProduct && currentTab === 'editor' && (
            <ProductEditor key={activeItem.id} item={activeItem} setItem={setPackagingItem} report={complianceReport} language={language} onNavigate={setCurrentTab} />
          )}

          {withProduct && currentTab === 'workflow' && (
            <Quick5MinWorkflow item={activeItem} report={complianceReport} language={language} onNavigate={(tab) => setCurrentTab(tab)} />
          )}

          {withProduct && currentTab === 'vault' && (
            <DocumentVault item={activeItem} setItem={setPackagingItem} language={language} onProceedToCompliance={() => setCurrentTab('compliance')} />
          )}

          {withProduct && currentTab === 'compliance' && (
            <ComplianceEngineView item={activeItem} setItem={setPackagingItem} report={complianceReport} language={language} onProceedToDeclaration={() => setCurrentTab('declaration')} />
          )}

          {withProduct && currentTab === 'gaps' && (
            <SupplierGapGenerator item={activeItem} language={language} onProceedToVault={() => setCurrentTab('vault')} />
          )}

          {withProduct && currentTab === 'declaration' && (
            <DeclarationBuilder key={activeItem.id} item={activeItem} setItem={setPackagingItem} report={complianceReport} language={language} />
          )}

          {withProduct && currentTab === 'roles' && (
            <RoleResponsibilityGuide item={activeItem} setItem={setPackagingItem} language={language} />
          )}

          {loaded && currentTab === 'pricing' && (
            <PricingCalculator language={language} onNavigateToWorkflow={() => setCurrentTab('workflow')} onNavigateToVault={() => setCurrentTab('vault')} />
          )}

          {loaded && currentTab === 'regulatory' && <RegulatoryExplorer language={language} />}

          {loaded && currentTab === 'settings' && (
            <SettingsView
              showExamples={showExamples}
              setShowExamples={setShowExamples}
              exampleCount={exampleCount}
              onRemoveExamples={handleRemoveExamples}
              onRestoreExamples={handleRestoreExamples}
              language={language}
            />
          )}

          {loaded && currentTab === 'guide' && <UserGuideView language={language} />}
        </main>

        {/* Footer with VisiPilot logo and EUR-Lex references */}
        <Footer language={language} />
      </AppShell>
    </div>
  );
}
