import React, { useState, useMemo, useEffect } from 'react';
import { Language, PackagingItem } from './types/ppwr';
import { samplePackagingPresets } from './data/samplePresets';
import { evaluatePackagingCompliance } from './utils/complianceEngine';
import { loadProducts, saveProduct, deleteProduct } from './utils/storage';
import { HomeView } from './components/HomeView';
import { ProductsView } from './components/ProductsView';
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

export default function App() {
  const [language, setLanguage] = useState<Language>('fr');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [showExamples, setShowExamples] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<ActiveTab>('home');
  const [products, setProducts] = useState<PackagingItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Load products from IndexedDB on mount
  useEffect(() => {
    (async () => {
      let list = await loadProducts();
      if (!list || list.length === 0) {
        list = samplePackagingPresets.map(p => JSON.parse(JSON.stringify(p)));
        for (const p of list) await saveProduct(p);
      }
      setProducts(list);
      // Restore the last active product (IndexedDB returns records sorted by key, not by use)
      let lastId = '';
      try { lastId = localStorage.getItem('powerppwr_selected') || ''; } catch { /* storage unavailable */ }
      setSelectedProductId(list.some(p => p.id === lastId) ? lastId : list[0].id);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded || !selectedProductId) return;
    try { localStorage.setItem('powerppwr_selected', selectedProductId); } catch { /* storage unavailable */ }
  }, [selectedProductId, loaded]);

  const packagingItem = products.find(p => p.id === selectedProductId) || products[0] || samplePackagingPresets[0];

  const setPackagingItem = (updater: any) => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === selectedProductId);
      if (idx < 0) return prev;
      const next = [...prev];
      const current = next[idx];
      const updated = typeof updater === 'function' ? updater(current) : updater;
      next[idx] = updated;
      return next;
    });
  };

  // Persist the selected product whenever it changes
  useEffect(() => {
    if (!loaded) return;
    const item = products.find(p => p.id === selectedProductId);
    if (!item) return;
    saveProduct(item).catch((e) => setSaveError(String(e?.message || e)));
  }, [products, selectedProductId, loaded]);

  const handleSelectPreset = (id: string) => {
    const found = samplePackagingPresets.find(p => p.id === id);
    if (found) {
      const clone = JSON.parse(JSON.stringify(found));
      clone.id = 'prod-' + Date.now();
      clone.name = found.name + ' (exemple)';
      saveProduct(clone).then(() => {
        setProducts(prev => [...prev, clone]);
        setSelectedProductId(clone.id);
      }).catch((e) => setSaveError(String(e?.message || e)));
    }
  };

  const handleCreateProduct = () => {
    const id = 'prod-' + Date.now();
    const newItem: PackagingItem = {
      id,
      name: 'Nouveau produit',
      sku: 'SKU-' + Date.now(),
      brand: '',
      category: 'primary',
      userRole: 'manufacturer',
      manufacturer: { companyName: '', address: '', country: '', vatNumber: '', signatoryName: '', signatoryRole: '' },
      components: [],
      dimensions: { lengthMm: 0, widthMm: 0, heightMm: 0, packagingVolumeCm3: 0, productVolumeCm3: 0, voidSpaceRatioPercent: 0, isCompliant: false },
      reusability: { isReusable: false, intendedRotations: 0, systemForReuse: 'none' },
      labeling: { materialCode: '', sortingInstructions: '', hasHarmonizedPictogram: false },
      documents: [],
    };
    saveProduct(newItem).then(() => {
      setProducts(prev => [...prev, newItem]);
      setSelectedProductId(id);
    }).catch((e) => setSaveError(String(e?.message || e)));
  };

  const handleDuplicate = (id: string) => {
    const src = products.find(p => p.id === id);
    if (!src) return;
    const clone = JSON.parse(JSON.stringify(src));
    clone.id = 'prod-' + Date.now();
    clone.name = src.name + ' (copie)';
    delete clone.declarationNumber;
    saveProduct(clone).then(() => {
      setProducts(prev => [...prev, clone]);
      setSelectedProductId(clone.id);
    }).catch((e) => setSaveError(String(e?.message || e)));
  };

  const handleDelete = (id: string) => {
    if (products.length <= 1) return;
    deleteProduct(id).then(() => {
      setProducts(prev => {
        const next = prev.filter(p => p.id !== id);
        if (selectedProductId === id && next.length) setSelectedProductId(next[0].id);
        return next;
      });
    }).catch((e) => setSaveError(String(e?.message || e)));
  };

  const handleImport = (item: PackagingItem) => {
    if (!item || !item.name || !Array.isArray(item.components) || !item.manufacturer) {
      setSaveError('Import invalide : structure manquante');
      return;
    }
    const clone = JSON.parse(JSON.stringify(item));
    clone.id = 'prod-' + Date.now();
    clone.documents = Array.isArray(clone.documents) ? clone.documents : [];
    clone.components = Array.isArray(clone.components) ? clone.components : [];
    if (!clone.dimensions) clone.dimensions = { lengthMm: 0, widthMm: 0, heightMm: 0, packagingVolumeCm3: 0, productVolumeCm3: 0, voidSpaceRatioPercent: 0, isCompliant: false };
    if (!clone.reusability) clone.reusability = { isReusable: false, intendedRotations: 0, systemForReuse: 'none' };
    if (!clone.labeling) clone.labeling = { materialCode: '', sortingInstructions: '', hasHarmonizedPictogram: false };
    delete clone.declarationNumber;
    saveProduct(clone).then(() => {
      setProducts(prev => [...prev, clone]);
      setSelectedProductId(clone.id);
    }).catch((e) => setSaveError(String(e?.message || e)));
  };

  // Synchronize HTML element class and body background with selected theme
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

  // Real-time compliance report recalculation
  const complianceReport = useMemo(() => {
    return evaluatePackagingCompliance(packagingItem);
  }, [packagingItem]);

  const handleExportPdf = () => {
    setCurrentTab('declaration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#0B1120] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white`}>
      {/* Left sidebar (collapsible) + slim top bar; content uses the full remaining width */}
      <AppShell
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        products={products.length ? products : [packagingItem]}
        selectedProductId={packagingItem.id}
        onSelectProduct={setSelectedProductId}
        presets={showExamples ? samplePackagingPresets : []}
        onAddExample={handleSelectPreset}
        status={complianceReport.overallStatus}
        onExportPdf={handleExportPdf}
      >

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 2xl:px-14 py-6 lg:py-8">
        {!loaded && <div className="text-center py-10">Chargement...</div>}
        {loaded && saveError && <div className="text-red-500 text-sm mb-2">{saveError}</div>}
        {loaded && (<>
        {currentTab === 'home' && (
          <HomeView
            item={packagingItem}
            report={complianceReport}
            productCount={products.length}
            language={language}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'products' && (
          <ProductsView
            products={products}
            selectedId={selectedProductId}
            onSelect={(id) => setSelectedProductId(id)}
            onCreate={handleCreateProduct}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onImport={handleImport}
            language={language}
          />
        )}

        {currentTab === 'workflow' && (
          <Quick5MinWorkflow
            item={packagingItem}
            report={complianceReport}
            language={language}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'vault' && (
          <DocumentVault
            item={packagingItem}
            setItem={setPackagingItem}
            language={language}
            onProceedToCompliance={() => setCurrentTab('compliance')}
          />
        )}

        {currentTab === 'compliance' && (
          <ComplianceEngineView
            item={packagingItem}
            setItem={setPackagingItem}
            report={complianceReport}
            language={language}
            onProceedToDeclaration={() => setCurrentTab('declaration')}
          />
        )}

        {currentTab === 'gaps' && (
          <SupplierGapGenerator
            item={packagingItem}
            language={language}
            onProceedToVault={() => setCurrentTab('vault')}
          />
        )}

        {currentTab === 'declaration' && (
          <DeclarationBuilder
            key={packagingItem.id}
            item={packagingItem}
            setItem={setPackagingItem}
            report={complianceReport}
            language={language}
          />
        )}

        {currentTab === 'roles' && (
          <RoleResponsibilityGuide
            item={packagingItem}
            setItem={setPackagingItem}
            language={language}
          />
        )}

        {currentTab === 'pricing' && (
          <PricingCalculator
            language={language}
            onNavigateToWorkflow={() => setCurrentTab('workflow')}
            onNavigateToVault={() => setCurrentTab('vault')}
          />
        )}

        {currentTab === 'regulatory' && (
          <RegulatoryExplorer
            language={language}
          />
        )}
        {currentTab === 'settings' && (
          <SettingsView
            showExamples={showExamples}
            setShowExamples={setShowExamples}
            language={language}
          />
        )}
        {currentTab === 'guide' && (
          <UserGuideView
            language={language}
          />
        )}
        </>)}
      </main>

      {/* Footer with VisiPilot logo and EUR-Lex references */}
      <Footer language={language} />
      </AppShell>
    </div>
  );
}
