import { SourcedEvidence, HeavyMetalsData, PfasData } from '../types/ppwr';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure pdfjs worker (bundled locally, no CDN)
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

export interface ExtractionOutput {
  textContent: string;
  pageCount: number;
  heavyMetals?: HeavyMetalsData;
  pfas?: PfasData;
  recycledPercent?: number;
  polymerCode?: string;
  standardsCited: string[];
  evidences: SourcedEvidence[];
}

/**
 * Deterministically extracts text from a PDF file using pdfjs-dist
 */
export async function extractTextFromPdf(file: File): Promise<{ text: string; pageCount: number; pages: { page: number; text: string }[] }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    const pages: { page: number; text: string }[] = [];
    let fullText = '';

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      pages.push({ page: i, text: pageText });
      fullText += `\n[--- Page ${i} ---]\n` + pageText;
    }

    return { text: fullText, pageCount, pages };
  } catch (error) {
    console.warn('pdfjs parse failed, falling back to basic reader:', error);
    // Fallback for mock or text files
    const text = await file.text();
    return {
      text,
      pageCount: 1,
      pages: [{ page: 1, text }]
    };
  }
}

/**
 * 100% Deterministic Regex & Rule-Based extraction (Zero AI)
 */
export function extractDataDeterministic(
  text: string,
  fileName: string,
  pages: { page: number; text: string }[] = []
): ExtractionOutput {
  const evidences: SourcedEvidence[] = [];
  const standardsCited: string[] = [];

  // 1. Detect European Harmonized Standards (EN 13427, EN 13428, etc.)
  const standardPatterns = [
    /EN\s*13427(:2004)?/gi,
    /EN\s*13428(:2004)?/gi,
    /EN\s*13429(:2004)?/gi,
    /EN\s*13430(:2004)?/gi,
    /EN\s*13431(:2004)?/gi,
    /EN\s*13432(:2000)?/gi,
    /ISO\s*18602/gi,
    /ISO\s*18604/gi,
  ];

  standardPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) {
      const norm = match[0].toUpperCase().replace(/\s+/g, ' ');
      if (!standardsCited.includes(norm)) {
        standardsCited.push(norm);
      }
    }
  });

  // Helper to find page number for a matching substring
  const findPageForSnippet = (snippet: string): number => {
    if (!pages || pages.length === 0) return 1;
    const cleanSnippet = snippet.slice(0, 30).toLowerCase();
    for (const p of pages) {
      if (p.text.toLowerCase().includes(cleanSnippet)) {
        return p.page;
      }
    }
    return 1;
  };

  // 2. Heavy Metals Deterministic Extraction (Lead, Cadmium, Mercury, Cr VI)
  let pb: number | undefined;
  let cd: number | undefined;
  let hg: number | undefined;
  let crVI: number | undefined;
  let totalHeavyMetals: number | undefined;
  let heavyMetalsFound = false;
  let belowLoq = false;

  // Patterns for heavy metals
  const pbMatch = text.match(/(?:Pb|Plomb|Lead)[\s:=<>]*([0-9]+[.,]?[0-9]*)\s*(?:mg\/kg|ppm)?/i);
  if (pbMatch && pbMatch[1]) {
    pb = parseFloat(pbMatch[1].replace(',', '.'));
    heavyMetalsFound = true;
    if (pbMatch[0].includes('<')) belowLoq = true;
  }

  const cdMatch = text.match(/(?:Cd|Cadmium)[\s:=<>]*([0-9]+[.,]?[0-9]*)\s*(?:mg\/kg|ppm)?/i);
  if (cdMatch && cdMatch[1]) {
    cd = parseFloat(cdMatch[1].replace(',', '.'));
    heavyMetalsFound = true;
    if (cdMatch[0].includes('<')) belowLoq = true;
  }

  const hgMatch = text.match(/(?:Hg|Mercure|Mercury)[\s:=<>]*([0-9]+[.,]?[0-9]*)\s*(?:mg\/kg|ppm)?/i);
  if (hgMatch && hgMatch[1]) {
    hg = parseFloat(hgMatch[1].replace(',', '.'));
    heavyMetalsFound = true;
    if (hgMatch[0].includes('<')) belowLoq = true;
  }

  const crMatch = text.match(/(?:Cr\s*VI|Cr\(VI\)|Chrome\s*hexavalent|Hexavalent\s*Chromium)[\s:=<>]*([0-9]+[.,]?[0-9]*)\s*(?:mg\/kg|ppm)?/i);
  if (crMatch && crMatch[1]) {
    crVI = parseFloat(crMatch[1].replace(',', '.'));
    heavyMetalsFound = true;
    if (crMatch[0].includes('<')) belowLoq = true;
  }

  // Check for cumulative sum
  const totalSumMatch = text.match(/(?:Total\s*(?:Heavy\s*Metals|M[eé]taux\s*Lourds|Pb\+Cd\+Hg\+Cr)|Somme\s*(?:des\s*4\s*m[eé]taux)?)[\s:=<>]*([0-9]+[.,]?[0-9]*)\s*(?:mg\/kg|ppm)/i);
  if (totalSumMatch && totalSumMatch[1]) {
    totalHeavyMetals = parseFloat(totalSumMatch[1].replace(',', '.'));
    heavyMetalsFound = true;
    if (totalSumMatch[0].includes('<')) belowLoq = true;
  } else if (pb !== undefined && cd !== undefined && hg !== undefined && crVI !== undefined) {
    totalHeavyMetals = pb + cd + hg + crVI;
  } else {
    totalHeavyMetals = undefined;
  }

  // Check for compliance sentence: "< 100 mg/kg" or "conforme directive 94/62 / PPWR"
  const limitSentenceMatch = text.match(/([^\n.]{0,80}(?:100\s*(?:mg\/kg|ppm)|m[eé]taux\s*lourds\s*inf[eé]rieurs|heavy\s*metals\s*less\s*than)[^\n.]{0,80})/i);
  const snippetHeavyMetals = limitSentenceMatch ? limitSentenceMatch[1].trim() : (totalSumMatch ? totalSumMatch[0] : (pbMatch ? pbMatch[0] : ''));

  let heavyMetalsData: HeavyMetalsData | undefined;
  if (heavyMetalsFound) {
    const isCompliant = totalHeavyMetals !== undefined && totalHeavyMetals <= 100 && pb !== undefined && cd !== undefined && hg !== undefined && crVI !== undefined;
    heavyMetalsData = {
      pb_mg_kg: pb,
      cd_mg_kg: cd,
      hg_mg_kg: hg,
      crVI_mg_kg: crVI,
      total_mg_kg: totalHeavyMetals,
      isCompliant,
      belowLoq,
      labReportNumber: (text.match(/(?:Report|Rapport|Certificate)\s*(?:No|N°|#)?[\s:]*([A-Z0-9\-_]{5,20})/i) || [])[1],
      testedDate: (text.match(/(?:Date|Test\s*Date)[\s:]*([0-9]{2}[\/\-.][0-9]{2}[\/\-.][0-9]{4})/i) || [])[1],
      sourceSnippet: snippetHeavyMetals || undefined,
    };

    if (totalHeavyMetals !== undefined) {
      evidences.push({
        id: 'ev-hm-' + Date.now(),
        field: 'heavy_metals_total',
        value: totalHeavyMetals,
        unit: 'mg/kg',
        documentName: fileName,
        pageNumber: findPageForSnippet(snippetHeavyMetals || 'heavy metals'),
        verbatimSnippet: snippetHeavyMetals || '',
        extractionMethod: 'deterministic',
        isVerifiedByHuman: false,
      });
    }
  }

  // 3. PFAS Deterministic Detection
  let pfasData: PfasData | undefined;
  const pfasMatch = text.match(/([^\n]{0,120}(?:PFAS|PFOA|PFOS|perfluoroalkyl|fluorinated|sans\s*PFAS|PFAS-free)[^\n]{0,120})/i);
  if (pfasMatch) {
    const snippet = pfasMatch[1].trim();
    const phraseFree = /(?:PFAS[-\s]?free|free[-\s]?of[-\s]?PFAS|no\s*PFAS|not\s*intentionally\s*added|sans\s*PFAS|non\s*d[e\u00e9]tect[e\u00e9]|not\s*detected|\bn\.?d\.?|\bND\b|absence\s*de\s*PFAS)/i.test(snippet);
    let declaredFree = phraseFree;

    // Optional numeric PFAS data (sum / total fluorine) when stated
    const sumMatch = text.match(/(?:sum\s*(?:of\s*)?(?:targeted\s*)?PFAS)[\s:=<>]*([0-9]+[.,]?[0-9]*)\s*(ppb|µg\/kg|mg\/kg)/i);
    let pfasSum: number | undefined;
    if (sumMatch && sumMatch[1]) {
      const val = parseFloat(sumMatch[1].replace(',', '.'));
      const unit = sumMatch[2].toLowerCase();
      pfasSum = unit === 'ppb' || unit === 'µg/kg' ? val / 1000 : val;
    }
    const tofMatch = text.match(/(?:total\s*organic\s*fluorine|TOF|fluor\s*total)[\s:=<>]*([0-9]+[.,]?[0-9]*)\s*(ppm|mg\/kg)/i);
    let totalFluorine: number | undefined;
    if (tofMatch && tofMatch[1]) {
      totalFluorine = parseFloat(tofMatch[1].replace(',', '.'));
    }
    // numeric measurement overrides a positive declaration, unless every result is < threshold
    const rePfas = /(PFOA|PFOS|PFAS|perfluoro\w*)\s*(<?)\s*(\d+(?:[.,]\d+)?)\s*(ppb|ppm)/gi;
    let pm;
    let hasResult = false;
    let exceeds = false;
    while ((pm = rePfas.exec(snippet)) !== null) {
      hasResult = true;
      const isLt = pm[2] === '<';
      const val = parseFloat(pm[3].replace(',', '.'));
      const unit = pm[4].toLowerCase();
      const mgkg = unit === 'ppb' ? val / 1000 : val;
      const threshold = 0.025; // 25 ppb individual
      if (mgkg > threshold) exceeds = true;
      // a non-< measurement counts as a real measurement even if below threshold
    }
    if (hasResult) {
      if (exceeds) declaredFree = false;
      else declaredFree = true;
    }
    // keep explicit override rejection for clear exceedances already caught above

    pfasData = {
      declaredFree,
      sum: pfasSum,
      totalFluorine: totalFluorine,
      detectionLimit: (snippet.match(/(<?\s*[0-9]+[.,]?[0-9]*\s*(?:ppb|ppm|µg\/kg|mg\/kg))/i) || [])[1],
      loq: (snippet.match(/(<?\s*[0-9]+[.,]?[0-9]*\s*(?:ppb|ppm|µg\/kg|mg\/kg))/i) || [])[1],
      sourceSnippet: snippet,
    };

    evidences.push({
      id: 'ev-pfas-' + Date.now(),
      field: 'pfas_free',
      value: declaredFree,
      documentName: fileName,
      pageNumber: findPageForSnippet(snippet),
      verbatimSnippet: snippet,
      extractionMethod: 'deterministic',
      isVerifiedByHuman: false,
    });
  }

  // 4. Recycled Plastic Content (% PCR)
  let recycledPercent: number | undefined;
  const pcrMatch = text.match(/(?:PCR|rPET|rHDPE|rPP|recycled\s*content|mati[eè]re\s*recycl[eé]e|taux\s*recycl[eé])[\s:=]*([0-9]{1,3})[\s]*%/i);
  if (pcrMatch && pcrMatch[1]) {
    recycledPercent = parseInt(pcrMatch[1], 10);
    const snippet = pcrMatch[0];

    evidences.push({
      id: 'ev-pcr-' + Date.now(),
      field: 'recycled_plastic_pcr',
      value: recycledPercent,
      unit: '%',
      documentName: fileName,
      pageNumber: findPageForSnippet(snippet),
      verbatimSnippet: snippet,
      extractionMethod: 'deterministic',
      isVerifiedByHuman: false,
    });
  }

  // 5. Polymer & Material Code Detection
  let polymerCode: string | undefined;
  const polymerMatch = text.match(/(?:PET\s*0?1|HDPE\s*0?2|LDPE\s*0?4|PP\s*0?5|PS\s*0?6|PAP\s*20|PAP\s*21|PAP\s*22|GL\s*70|ALU\s*41|FE\s*40)/i);
  if (polymerMatch) {
    polymerCode = polymerMatch[0].toUpperCase().replace(/\s+/, ' ');
    const snippet = text.slice(Math.max(0, polymerMatch.index! - 20), Math.min(text.length, polymerMatch.index! + 40)).trim();

    evidences.push({
      id: 'ev-mat-' + Date.now(),
      field: 'material_code',
      value: polymerCode,
      documentName: fileName,
      pageNumber: findPageForSnippet(snippet),
      verbatimSnippet: snippet,
      extractionMethod: 'deterministic',
      isVerifiedByHuman: false,
    });
  }

  return {
    textContent: text,
    pageCount: pages.length || 1,
    heavyMetals: heavyMetalsData,
    pfas: pfasData,
    recycledPercent,
    polymerCode,
    standardsCited,
    evidences,
  };
}

/**
 * AI-Assisted Extraction calling the server proxy /api/extract-llm
 */
export async function extractDataWithAI(
  text: string,
  fileName: string,
  language: 'fr' | 'en' = 'fr'
): Promise<ExtractionOutput> {
  const response = await fetch('/api/extract-llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      fileName,
      language,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `AI extraction failed: HTTP ${response.status}`);
  }

  const result = await response.json();
  const data = result.data;

  const evidences: SourcedEvidence[] = [];

  let heavyMetalsData: HeavyMetalsData | undefined;
  if (data.heavyMetals && data.heavyMetals.total_mg_kg !== undefined && data.heavyMetals.total_mg_kg !== null) {
    heavyMetalsData = {
      pb_mg_kg: data.heavyMetals.pb_mg_kg,
      cd_mg_kg: data.heavyMetals.cd_mg_kg,
      hg_mg_kg: data.heavyMetals.hg_mg_kg,
      crVI_mg_kg: data.heavyMetals.crVI_mg_kg,
      total_mg_kg: data.heavyMetals.total_mg_kg,
      isCompliant: data.heavyMetals.total_mg_kg !== undefined && data.heavyMetals.total_mg_kg <= 100 && data.heavyMetals.pb_mg_kg !== undefined && data.heavyMetals.cd_mg_kg !== undefined && data.heavyMetals.hg_mg_kg !== undefined && data.heavyMetals.crVI_mg_kg !== undefined,
      labReportNumber: data.heavyMetals.labReportNumber,
      testedDate: data.heavyMetals.testedDate,
      sourceSnippet: data.heavyMetals.snippet,
    };

    evidences.push({
      id: 'ev-ai-hm-' + Date.now(),
      field: 'heavy_metals_total',
      value: heavyMetalsData.total_mg_kg as number,
      unit: 'mg/kg',
      documentName: fileName,
      pageNumber: data.heavyMetals.pageNumber || 1,
      verbatimSnippet: data.heavyMetals.snippet || '',
      extractionMethod: 'ai_assisted',
      isVerifiedByHuman: false,
    });
  }

  let pfasData: PfasData | undefined;
  if (data.pfas) {
    pfasData = {
      declaredFree: data.pfas.declaredFree,
      detectionLimit: data.pfas.detectionLimit,
      sourceSnippet: data.pfas.snippet,
    };

    evidences.push({
      id: 'ev-ai-pfas-' + Date.now(),
      field: 'pfas_free',
      value: pfasData.declaredFree as boolean,
      documentName: fileName,
      pageNumber: data.pfas.pageNumber || 1,
      verbatimSnippet: data.pfas.snippet || '',
      extractionMethod: 'ai_assisted',
      isVerifiedByHuman: false,
    });
  }

  const recycledPercent = data.recycledContent?.postConsumerRecycledPercent;
  if (recycledPercent !== undefined) {
    evidences.push({
      id: 'ev-ai-pcr-' + Date.now(),
      field: 'recycled_plastic_pcr',
      value: recycledPercent,
      unit: '%',
      documentName: fileName,
      pageNumber: data.recycledContent?.pageNumber || 1,
      verbatimSnippet: data.recycledContent.snippet || '',
      extractionMethod: 'ai_assisted',
      isVerifiedByHuman: false,
    });
  }

  let polymerCode: string | undefined;
  if (data.materials && data.materials.length > 0) {
    polymerCode = data.materials[0].polymerCode;
    evidences.push({
      id: 'ev-ai-mat-' + Date.now(),
      field: 'material_code',
      value: polymerCode as string,
      documentName: fileName,
      pageNumber: data.materials[0].pageNumber || 1,
      verbatimSnippet: data.materials[0].snippet || '',
      extractionMethod: 'ai_assisted',
      isVerifiedByHuman: false,
    });
  }

  return {
    textContent: text,
    pageCount: 1,
    heavyMetals: heavyMetalsData,
    pfas: pfasData,
    recycledPercent,
    polymerCode,
    standardsCited: data.standardsCited || [],
    evidences,
  };
}
