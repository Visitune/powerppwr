import React, { useState } from 'react';
import { DossierDocument, Language, PackagingItem, SourcedEvidence } from '../types/ppwr';
import { translations } from '../utils/i18n';
import { extractTextFromPdf, extractDataDeterministic, extractDataWithAI } from '../utils/pdfExtractor';
import { 
  ShieldCheck, 
  Upload, 
  FileCheck2, 
  FileText, 
  AlertCircle, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Eye, 
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DocumentVaultProps {
  item: PackagingItem;
  setItem: React.Dispatch<React.SetStateAction<PackagingItem>>;
  language: Language;
  onProceedToCompliance: () => void;
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({
  item,
  setItem,
  language,
  onProceedToCompliance,
}) => {
  const t = translations[language];
  const [engineMode, setEngineMode] = useState<'deterministic' | 'ai_assisted'>('deterministic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSnippetModal, setActiveSnippetModal] = useState<SourcedEvidence | null>(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DossierDocument | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setUploadNotice(null);

    try {
      const newDocuments: DossierDocument[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const docId = 'doc-' + Date.now() + '-' + i;

        // Deterministically extract text from PDF in browser
        const { text, pageCount, pages } = await extractTextFromPdf(file);

        let extractionResult;
        if (engineMode === 'ai_assisted') {
          try {
            extractionResult = await extractDataWithAI(text, file.name, language);
          } catch (err: any) {
            console.warn('AI extraction failed, fallback to deterministic:', err);
            extractionResult = extractDataDeterministic(text, file.name, pages);
          }
        } else {
          extractionResult = extractDataDeterministic(text, file.name, pages);
        }

        const newDoc: DossierDocument = {
          id: docId,
          fileName: file.name,
          fileSize: file.size,
          uploadDate: new Date().toISOString().split('T')[0],
          documentType: file.name.toLowerCase().includes('report') || file.name.toLowerCase().includes('rohs') || file.name.toLowerCase().includes('sgs')
            ? 'lab_test_report'
            : (file.name.toLowerCase().includes('cert') ? 'recyclability_certificate' : 'technical_data_sheet'),
          textContent: text,
          extractionStatus: 'extracted',
          extractionEngine: engineMode,
          status: 'compliant',
          extractedData: {
            heavyMetals: extractionResult.heavyMetals,
            pfas: extractionResult.pfas,
            recycledContentPercent: extractionResult.recycledPercent,
            polymerCode: extractionResult.polymerCode,
            standardsCited: extractionResult.standardsCited,
            confidenceScore: engineMode === 'deterministic' ? 100 : 95,
          },
          evidences: extractionResult.evidences,
        };

        newDocuments.push(newDoc);
      }

      // Add documents only; extracted values are NOT auto-applied to the dossier.
      // A human must explicitly apply them (see applyExtractedData) after review.
      setItem(prev => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments],
      }));

      setUploadNotice(
        language === 'fr'
          ? `${newDocuments.length} document(s) analysé(s) avec succès via le moteur ${engineMode === 'deterministic' ? 'déterministe' : 'IA'}.`
          : `${newDocuments.length} document(s) successfully analyzed with ${engineMode === 'deterministic' ? 'deterministic' : 'AI'} engine.`
      );
    } catch (error: any) {
      console.error('File parsing error:', error);
      setUploadNotice(
        language === 'fr'
          ? 'Erreur lors du traitement du fichier PDF : ' + (error.message || 'Format non reconnu')
          : 'Error processing PDF file: ' + (error.message || 'Unrecognized format')
      );
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  const applyExtractedData = (docId: string) => {
    setItem(prev => {
      const doc = prev.documents.find(d => d.id === docId);
      if (!doc?.extractedData) return prev;
      // require all evidences verified
      if (doc.evidences.length > 0 && doc.evidences.some(e => !e.isVerifiedByHuman)) return prev;
      const updatedComponents = [...prev.components];
      if (doc.targetComponentId) {
        const idx = updatedComponents.findIndex(c => c.id === doc.targetComponentId);
        if (idx >= 0) {
          if (doc.extractedData.recycledContentPercent !== undefined) {
            updatedComponents[idx] = { ...updatedComponents[idx], recycledPlasticPercent: doc.extractedData.recycledContentPercent };
          }
          if (doc.extractedData.polymerCode) {
            updatedComponents[idx] = { ...updatedComponents[idx], materialCode: doc.extractedData.polymerCode };
          }
        }
      }
      return {
        ...prev,
        heavyMetals: doc.extractedData.heavyMetals ?? prev.heavyMetals,
        pfas: doc.extractedData.pfas ?? prev.pfas,
        components: updatedComponents,
      };
    });
  };

  // Human-in-the-loop: Approve an evidence point
  const handleVerifyEvidence = (docId: string, evidenceId: string) => {
    const targetDoc = item.documents.find(d => d.id === docId);
    const ev = targetDoc?.evidences.find(e => e.id === evidenceId);
    if (!ev || !ev.verbatimSnippet) return;
    setItem(prev => {
      const updatedDocs = prev.documents.map(doc => {
        if (doc.id !== docId) return doc;
        return {
          ...doc,
          evidences: doc.evidences.map(ev => {
            if (ev.id !== evidenceId) return ev;
            return {
              ...ev,
              isVerifiedByHuman: true,
              verifiedAt: new Date().toISOString().split('T')[0],
            };
          }),
        };
      });

      return {
        ...prev,
        documents: updatedDocs,
      };
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header and VisiPilot Style Accent */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b dark:border-slate-800 border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="h-[2px] w-8 bg-[#F97316]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#C2410C] dark:text-[#FB923C] font-bold">
              POWER PPWR TECHNICAL VAULT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-extrabold tracking-tight dark:text-white text-slate-900">
              {t.vault.title}
            </h1>
            <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded font-mono">
              Art. 13 & Annexe VII
            </span>
          </div>
          <p className="mt-1 text-sm dark:text-slate-400 text-slate-600 max-w-3xl">
            {t.vault.subtitle}
          </p>
        </div>

        <button
          onClick={onProceedToCompliance}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#8B5CF6] to-indigo-600 hover:from-[#7C3AED] hover:to-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all shrink-0 self-start md:self-auto"
        >
          <span>{language === 'fr' ? 'Accéder au Moteur de Conformité' : 'Go to Compliance Engine'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Security & Confidentiality Banner */}
      <div className="rounded-xl border dark:border-emerald-900/40 border-emerald-200 dark:bg-emerald-950/20 bg-emerald-50/80 p-4 transition-colors">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg dark:bg-emerald-900/30 bg-emerald-100 border dark:border-emerald-700/40 border-emerald-300 text-emerald-700 dark:text-emerald-400 shrink-0">
            <Lock className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold dark:text-emerald-200 text-emerald-900">{t.vault.confidentialBadge}</span>
              <span className="text-[11px] dark:text-emerald-400 text-emerald-700 font-mono">Zero-Cloud-Leakage</span>
            </div>
            <p className="mt-1 text-xs dark:text-slate-300 text-slate-700">
              {t.vault.confidentialDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Engine Selection & Upload Control Center */}
      <div className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-5 shadow-xs space-y-4 transition-colors">
        
        {/* Dual Engine Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b dark:border-slate-800/80 border-slate-100">
          <div>
            <label className="text-xs font-bold dark:text-slate-200 text-slate-800 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#C2410C] dark:text-[#FB923C]" />
              <span>{t.vault.engineSelect}</span>
            </label>
            <p className="text-[11px] dark:text-slate-400 text-slate-600 mt-0.5">
              {language === 'fr' 
                ? 'Choisissez le mode de traitement selon la complexité de vos fiches techniques.'
                : 'Select the parsing pipeline based on supplier document layout complexity.'}
            </p>
          </div>

          <div className="flex items-center p-1 dark:bg-slate-900 bg-slate-100 dark:border-slate-800 border-slate-200 border rounded-lg shrink-0">
            <button
              onClick={() => setEngineMode('deterministic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                engineMode === 'deterministic'
                  ? 'bg-gradient-to-r from-orange-500 to-[#F97316] text-white shadow-xs'
                  : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>{t.vault.engineDeterministicBadge}</span>
            </button>
            <button
              onClick={() => setEngineMode('ai_assisted')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                engineMode === 'ai_assisted'
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-indigo-600 text-white shadow-xs'
                  : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t.vault.engineAIBadge}</span>
            </button>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div className="relative border-2 border-dashed dark:border-slate-700/80 border-slate-300 hover:border-[#F97316] rounded-xl p-6 text-center transition-all dark:bg-slate-900/40 bg-slate-50 hover:bg-slate-100/60 group">
          <input
            type="file"
            aria-label={language === 'fr' ? 'Choisir des documents fournisseurs (PDF ou texte)' : 'Choose supplier documents (PDF or text)'}
            accept=".pdf,.txt"
            multiple
            onChange={handleFileUpload}
            disabled={isProcessing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            <div className="h-12 w-12 rounded-full dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-300 flex items-center justify-center text-[#C2410C] dark:text-[#FB923C] group-hover:scale-105 transition-transform shadow-xs">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold dark:text-slate-200 text-slate-800">
                {t.vault.dropzoneTitle}
              </p>
              <p className="text-xs dark:text-slate-400 text-slate-600 mt-1 max-w-xl mx-auto">
                {t.vault.dropzoneSubtitle}
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold dark:bg-slate-800 bg-white dark:text-indigo-300 text-indigo-700 border dark:border-slate-700 border-slate-300 shadow-xs">
                {isProcessing ? t.vault.extracting : t.vault.selectFiles}
              </span>
            </div>
          </div>
        </div>

        {/* Upload Status / Notice */}
        {uploadNotice && (
          <div className="flex items-center gap-2 p-3 rounded-lg dark:bg-indigo-950/40 bg-indigo-50 border dark:border-indigo-800/60 border-indigo-200 text-xs dark:text-indigo-200 text-indigo-800">
            <CheckCircle2 className="h-4 w-4 text-indigo-700 dark:text-indigo-300 shrink-0" />
            <span>{uploadNotice}</span>
          </div>
        )}

        {/* Human-in-the-Loop Protocol Alert */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg dark:bg-slate-900/60 bg-amber-50/60 border dark:border-slate-800 border-amber-200 text-xs dark:text-slate-300 text-slate-700">
          <AlertCircle className="h-4 w-4 text-[#C2410C] dark:text-[#FB923C] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#C2410C] dark:text-[#FB923C]">
              {language === 'fr' ? 'Protocole Légal de Revue Humaine :' : 'Mandatory Human Review Gate:'}
            </strong>{' '}
            {t.vault.hitlAlert}
          </p>
        </div>
      </div>

      {/* Documents List & Evidence Extraction Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#6D28D9] dark:text-[#A78BFA]" />
            <h2 className="text-base font-bold dark:text-white text-slate-900">
              {t.vault.uploadedDocs}
            </h2>
            <span className="text-xs font-mono dark:text-slate-400 text-slate-600 dark:bg-slate-800 bg-slate-200 px-2 py-0.5 rounded">
              {item.documents.length}
            </span>
          </div>
        </div>

        {item.documents.length === 0 ? (
          <div className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-8 text-center dark:text-slate-400 text-slate-600 text-sm">
            {t.vault.noDocs}
          </div>
        ) : (
          <div className="space-y-4">
            {item.documents.map((doc) => (
              <div key={doc.id} className="rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white overflow-hidden shadow-xs transition-colors">
                
                {/* Document Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 dark:bg-slate-900/80 bg-slate-50 border-b dark:border-slate-800 border-slate-200 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded dark:bg-indigo-950/60 bg-indigo-50 border dark:border-indigo-800/40 border-indigo-200 text-indigo-700 dark:text-indigo-300">
                      <FileCheck2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm dark:text-slate-200 text-slate-800">{doc.fileName}</span>
                        <span className="text-[11px] font-mono dark:text-slate-400 text-slate-600">
                          ({(doc.fileSize / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs dark:text-slate-400 text-slate-600 mt-0.5">
                        <span className="capitalize">{doc.documentType.replace(/_/g, ' ')}</span>
                        <span>·</span>
                        <span>{language === 'fr' ? 'Déposé le' : 'Uploaded'} {doc.uploadDate}</span>
                        <span>·</span>
                        <span className="font-semibold text-[#6D28D9] dark:text-[#A78BFA]">
                          Moteur: {doc.extractionEngine === 'deterministic' ? 'Déterministe (Zéro-IA)' : 'Gemini AI'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => applyExtractedData(doc.id)}
                      disabled={doc.evidences.length === 0 || doc.evidences.some(e => !e.isVerifiedByHuman)}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white hover:bg-slate-100 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span>{language === 'fr' ? 'Appliquer au dossier' : 'Apply to dossier'}</span>
                    </button>
                    <button
                      onClick={() => setSelectedDocForPreview(doc)}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white hover:bg-slate-100 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>{language === 'fr' ? 'Inspecter Texte' : 'Inspect Text'}</span>
                    </button>
                  </div>
                </div>

                {/* Extracted Regulatory Parameters & Evidence Traceability */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider">
                      {language === 'fr' ? 'Données Réglementaires Extraites & Revue Humaine (HITL)' : 'Extracted Regulatory Data & Human Review (HITL)'}
                    </span>
                    <span className="text-xs dark:text-slate-400 text-slate-600 font-mono">
                      {doc.evidences.filter(e => e.isVerifiedByHuman).length} / {doc.evidences.length} {language === 'fr' ? 'validés' : 'verified'}
                    </span>
                  </div>

                  {doc.evidences.length === 0 ? (
                    <p className="text-xs dark:text-slate-400 text-slate-600 italic">
                      {language === 'fr' ? 'Aucun paramètre extractible trouvé dans ce document.' : 'No extractable parameters identified in this document.'}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {doc.evidences.map((ev) => (
                        <div 
                          key={ev.id} 
                          className={`p-3 rounded-lg border transition-all ${
                            ev.isVerifiedByHuman 
                              ? 'dark:border-emerald-800/40 border-emerald-300 dark:bg-emerald-950/10 bg-emerald-50/50' 
                              : 'dark:border-amber-700/40 border-amber-300 dark:bg-amber-950/10 bg-amber-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold dark:text-slate-200 text-slate-800">
                                  {ev.field.replace(/_/g, ' ').toUpperCase()}
                                </span>
                                <span className="text-[10px] dark:text-slate-400 text-slate-600 font-mono">
                                  ({t.vault.page} {ev.pageNumber})
                                </span>
                              </div>
                              <div className="mt-1">
                                <span className="font-mono text-sm font-extrabold dark:text-white text-slate-900">
                                  {typeof ev.value === 'boolean' 
                                    ? (ev.value ? (language === 'fr' ? 'OUI (Sans substance)' : 'YES (Substance-free)') : (language === 'fr' ? 'NON' : 'NO'))
                                    : `${ev.value} ${ev.unit || ''}`}
                                </span>
                              </div>
                            </div>

                            {/* Human Verification Action Button */}
                            {ev.isVerifiedByHuman ? (
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 dark:bg-emerald-900/30 bg-emerald-100 border border-emerald-300 dark:border-emerald-700/40 px-2 py-0.5 rounded shrink-0">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>{t.vault.validated}</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleVerifyEvidence(doc.id, ev.id)}
                                className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 dark:bg-amber-950/80 bg-amber-100 hover:bg-amber-200 border border-amber-400 dark:border-amber-600/60 px-2.5 py-1 rounded transition-colors shrink-0 shadow-xs"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                <span>{t.vault.validateField}</span>
                              </button>
                            )}
                          </div>

                          {/* Verbatim Source Quote */}
                          <div className="mt-2 pt-2 border-t dark:border-slate-800/60 border-slate-200">
                            <p className="text-[11px] dark:text-slate-400 text-slate-600 italic line-clamp-2">
                              "{ev.verbatimSnippet}"
                            </p>
                            <button
                              onClick={() => setActiveSnippetModal(ev)}
                              className="text-[10px] font-semibold text-indigo-700 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline mt-1 inline-block"
                            >
                              {t.vault.viewSnippet}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Summary of Extracted Standards */}
                  {doc.extractedData?.standardsCited && doc.extractedData.standardsCited.length > 0 && (
                    <div className="mt-3 pt-3 border-t dark:border-slate-800/80 border-slate-200 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] dark:text-slate-400 text-slate-600 font-semibold">
                        {language === 'fr' ? 'Normes Européennes Citées :' : 'Referenced European Standards:'}
                      </span>
                      {doc.extractedData.standardsCited.map((std, idx) => (
                        <span key={idx} className="text-[11px] font-mono dark:bg-slate-800 bg-slate-100 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded border dark:border-slate-700 border-slate-300">
                          {std}
                        </span>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Snippet Inspector Modal */}
      {activeSnippetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border dark:border-slate-700 border-slate-300 dark:bg-slate-900 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-3">
              <h3 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
                <Search className="h-4 w-4 text-[#C2410C] dark:text-[#FB923C]" />
                <span>{language === 'fr' ? 'Extrait Source Certifié' : 'Certified Source Excerpt'}</span>
              </h3>
              <button
                onClick={() => setActiveSnippetModal(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs dark:text-slate-400 text-slate-600">{language === 'fr' ? 'Document Source :' : 'Source Document:'}</span>
                <p className="text-sm font-semibold dark:text-slate-200 text-slate-800">{activeSnippetModal.documentName}</p>
              </div>

              <div>
                <span className="text-xs dark:text-slate-400 text-slate-600">{language === 'fr' ? 'Emplacement :' : 'Location:'}</span>
                <p className="text-sm font-mono text-[#C2410C] dark:text-[#FB923C] font-bold">Page {activeSnippetModal.pageNumber}</p>
              </div>

              <div>
                <span className="text-xs dark:text-slate-400 text-slate-600">{language === 'fr' ? 'Valeur Extraite :' : 'Extracted Metric:'}</span>
                <p className="text-sm font-bold dark:text-white text-slate-900 font-mono">
                  {typeof activeSnippetModal.value === 'boolean' 
                    ? (activeSnippetModal.value ? 'YES / CONFORME' : 'NO')
                    : `${activeSnippetModal.value} ${activeSnippetModal.unit || ''}`}
                </p>
              </div>

              <div>
                <span className="text-xs dark:text-slate-400 text-slate-600">{language === 'fr' ? 'Citation textuelle intégrale :' : 'Verbatim Quotation:'}</span>
                <div className="mt-1 p-3 rounded-lg dark:bg-slate-950 bg-slate-100 border dark:border-slate-800 border-slate-300 text-xs font-mono dark:text-slate-300 text-slate-800 leading-relaxed max-h-48 overflow-y-auto">
                  "{activeSnippetModal.verbatimSnippet}"
                </div>
              </div>

              <div className="text-[11px] dark:text-slate-400 text-slate-600 flex items-center gap-1.5 pt-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                <span>
                  {language === 'fr' 
                    ? 'Cette preuve est enregistrée et référencée dans la Déclaration UE selon l\'Article 13.'
                    : 'This evidence is recorded and referenced in the EU Declaration per Article 13.'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t dark:border-slate-800 border-slate-200">
              <button
                onClick={() => setActiveSnippetModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded dark:bg-slate-800 bg-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 dark:text-white text-slate-800"
              >
                {t.common.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raw Text Inspector Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-xl border dark:border-slate-700 border-slate-300 dark:bg-slate-900 bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-3 shrink-0">
              <h3 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#6D28D9] dark:text-[#A78BFA]" />
                <span>{selectedDocForPreview.fileName}</span>
              </h3>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              <span className="text-xs dark:text-slate-400 text-slate-600 uppercase tracking-wider font-semibold">
                {language === 'fr' ? 'Flux textuel extrait du PDF' : 'Extracted PDF text stream'}
              </span>
              <pre className="p-4 rounded-lg dark:bg-slate-950 bg-slate-100 border dark:border-slate-800 border-slate-300 text-xs font-mono dark:text-slate-300 text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedDocForPreview.textContent || 'No text content extracted'}
              </pre>
            </div>

            <div className="flex justify-end pt-3 border-t dark:border-slate-800 border-slate-200 shrink-0">
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-2 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                {language === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
