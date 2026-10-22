# powerPPWR — EU Regulation 2025/40 Compliance Engine & Secure Technical Dossier (DoC)

powerPPWR is an enterprise-grade, fully bilingual (FR/EN) packaging compliance platform designed for manufacturers, importers, and brand owners navigating the EU Packaging and Packaging Waste Regulation (PPWR - Regulation EU 2025/40). It provides an automated EU Declaration of Conformity generator (Article 13, Annex VII) combined with a **Secure Technical Document Vault featuring a Dual Extraction Engine** (100% Deterministic Regex/Parser by default + Optional Gemini AI extraction with mandatory Human-in-the-Loop review).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The plan integrates the dual extraction capability and human audit protocol:

- **Dual Extraction Architecture**:
  1. **Deterministic Mode (Default & Zero-AI)**: In-browser text stream parsing via `pdfjs-dist` with multi-pattern regex matching. Zero latency, 100% reproducible, zero external cloud transmission.
  2. **AI-Assisted Extraction Mode (Optional)**: Triggered at the user's discretion for complex, scanned, or non-standard supplier PDFs via a secure server proxy calling `gemini-3.8-flash` with structured JSON schema output.
- **Mandatory Human-in-the-Loop (HITL) Review Gate**: Every data point extracted (whether deterministic or AI-assisted) presents the exact source page, snippet citation, and confidence status. The compliance officer must verify and click "Approve for Declaration" before values are incorporated into the official legal dossier.
- **Privacy & Secure Document Vault**: Ingestion of supplier technical data sheets, heavy metal / PFAS lab test reports, and recyclability certificates with local confidentiality isolation.
- **VisiPilot Signature Dark Theme**: Deep slate canvas (`#0B0F17` / `#0F172A`), electric indigo accents (`#6366F1`), high-contrast tabular figures (`font-mono tabular-nums`), and official VisiPilot branding.
- **Complete FR/EN Parity**: Instant bilingual switching across all interfaces, legal templates, extraction rules, and generated official PDF declarations.

---

## 1. Overview & Core Concept

- **What It Does**:
  - Ingests supplier technical documentation (PDF format: TDS, RoHS test reports, PFAS statements, PCR certificates) into a secure client vault.
  - Automatically identifies and extracts PPWR compliance metrics:
    - Article 5: Heavy metal limits ($Pb + Cd + Hg + Cr < 100\text{ ppm}$) and PFAS statements.
    - Article 6: Polymer composition, mono-material purity, and Design-for-Recycling grade (A to E).
    - Article 7: Post-consumer recycled plastic percentages (% PCR) and certification standards (EuCertPlast / ISCC Plus).
    - Article 9 & 21: Void space ratio ($\le 50\%$) and dimension/volume optimization.
    - Article 10 & 26: Reusability cycles and return loop specifications.
    - Article 11: EU sorting markings and material identification codes (Decision 97/129/EC).
  - Validates metrics against EU Regulation 2025/40 requirements.
  - Generates the official EU Declaration of Conformity (Annex VII) and Technical Documentation Dossier ready for customs and market surveillance authorities.
- **Target Audience**: Packaging Engineers, Regulatory Affairs Teams, Supply Chain Directors, and Importers placing goods on the European Union market.
- **Key Value**: Replaces weeks of manual cross-referencing and supplier correspondence with a certified, deterministic, auditable workflow backed by optional AI assistance.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Secure Document Vault (Dossier Technique Sécurisé - Art. 13)**:
   - Ingestion zone with drag-and-drop for supplier PDF files.
   - Engine Mode Selector:
     - `Deterministic Parser` *(Recommended · 100% Local & Zero-AI · Instant)*
     - `AI-Assisted (Gemini)` *(For complex or scanned supplier sheets · Requires verification)*
   - Live sample documents included for instant evaluation (e.g. *SGS RoHS/Heavy Metals Test Report*, *Plastics Recyclers Europe Recyclability Certificate*, *Corrugated Packaging Technical Sheet*).
2. **Side-by-Side Sourced Evidence & Human-in-the-Loop Review**:
   - Split-screen workspace: document preview / text inspector on the left, extracted regulatory parameters on the right.
   - For every extracted field:
     - Exact metric value and unit (e.g., $Pb = 2.4\text{ mg/kg}$, $Cr(VI) = < 1\text{ mg/kg}$, Total $= 5.1\text{ mg/kg} \le 100\text{ mg/kg}$).
     - Document source name, page number, and highlighted verbatim citation.
     - "Review & Confirm" checkmark button ensuring formal human validation.
     - Manual override input for rapid adjustments.
3. **Interactive PPWR Compliance Engine**:
   - Scorecard with status badges (Compliant, Non-Compliant, In Review).
   - Recyclability Grade calculation:
     - Grade A: $\ge 95\%$ recyclability.
     - Grade B: $\ge 80\%$ recyclability.
     - Grade C: $\ge 70\%$ recyclability.
     - Grade D/E: Non-compliant design requiring redesign before 2030.
   - Void space calculator with packaging outer dimensions vs. product net volume.
   - Official article citations linking to Regulation (EU) 2025/40 articles and European harmonized standards (EN 13427, EN 13428, EN 13430, EN 13431, EN 13432).
4. **Official EU Declaration of Conformity Generator (Annex VII)**:
   - Complete legal document complying strictly with Annex VII of Regulation (EU) 2025/40.
   - Sourced references to attached supplier test certificates and lab report numbers.
   - Signatory block with name, title, date, place, and digital seal.
   - Downloadable vector PDF and structured JSON export.

### Visual Identity & Theme (VisiPilot Aesthetics)

- **Canvas & Surfaces**:
  - Dominant Neutral Canvas (60%): Slate `#0B0F17` / `#0F172A` with fine `#1F2937` borders.
  - Structural Panels (30%): Charcoal `#111827` cards with crisp hairline dividers.
  - Accent Budget (10%): VisiPilot Electric Indigo (`#6366F1`), Tech Cyan (`#38BDF8`), and Emerald (`#10B981`) for nominal compliance status.
- **Top Bar Contract**:
  - Left: `powerPPWR` by VisiPilot wordmark lockup.
  - Center: Single-line navigation links (`Document Vault`, `Compliance Engine`, `Declaration Builder`, `Regulatory Legal Text`).
  - Right: Instant FR/EN language switcher and primary action (`Generate Declaration`).
- **Typography**: `Plus Jakarta Sans` for titles, `DM Sans` for body, and `font-mono tabular-nums` for all metrics, test limits, and dimensions.

---

## 3. Key Product Decisions & Trade-Offs

- **Dual-Engine Architecture (Deterministic First, AI-Assisted on Demand)**:
  - *Why*: Regulatory declarations are legally binding under European criminal and civil liability. Deterministic parsing provides 100% reproducible, verifiable extractions. When documents have non-standard layouts or complex phrasing, the engineer can trigger the Gemini AI extractor, with all outputs held in an "Unverified" state until human sign-off.
- **Server-Side Gemini API Integration**:
  - Model: `gemini-3.8-flash` via `@google/genai` TypeScript SDK on Express backend (`server.ts`).
  - API Key safely stored in `process.env.GEMINI_API_KEY`.
  - Structured output using `responseMimeType: "application/json"` and strict JSON schema.
- **Client-Side Vector PDF Generator**:
  - Print-ready and downloadable PDF generator adhering to EU official documentation standards without external network dependencies.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            powerPPWR Web Platform                           │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Top Bar: powerPPWR by VisiPilot · Nav · FR/EN · Export Action       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│        ┌─────────────────────────────┴─────────────────────────────┐        │
│        ▼                                                           ▼        │
│ ┌──────────────────────────────────────┐  ┌──────────────────────────────┐  │
│ │   Secure Document Vault & Sandbox    │  │   Manual Packaging Spec      │  │
│ │ - Drag & drop supplier PDFs          │  │ - Manual overrides & params  │  │
│ │ - Ingest TDS, RoHS, Lab Reports      │  │ - Dimension/volume inputs    │  │
│ └──────────────────┬───────────────────┘  └──────────────┬───────────────┘  │
│                    │                                     │                  │
│          ┌─────────┴─────────┐                           │                  │
│          ▼                   ▼                           │                  │
│ ┌──────────────────┐ ┌───────────────────────┐           │                  │
│ │ Engine 1:        │ │ Engine 2 (Optional):  │           │                  │
│ │ Deterministic    │ │ Gemini AI Extractor   │           │                  │
│ │ Regex/Parser     │ │ Server Proxy Route    │           │                  │
│ │ (Zero-AI, Local) │ │ (/api/extract-llm)    │           │                  │
│ └────────┬─────────┘ └───────────┬───────────┘           │                  │
│          │                       │                       │                  │
│          └───────────┬───────────┘                       │                  │
│                      ▼                                   │                  │
│ ┌────────────────────────────────────────────────────┐   │                  │
│ │      Human-in-the-Loop (HITL) Verification         │   │                  │
│ │  - Sourced snippet highlighting & page citation    │   │                  │
│ │  - Engineer confirmation / approval checkmark      │   │                  │
│ └────────────────────┬───────────────────────────────┘   │                  │
│                      │                                   │                  │
│                      └─────────────────┬─────────────────┘                  │
│                                        ▼                                    │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │                 PPWR Compliance Evaluation Matrix                      │  │
│ │ - Articles 5, 6, 7, 9, 10, 11, 21 automated validation rules           │  │
│ │ - Harmonized standards alignment (EN 13427, EN 13428, EN 13430...)     │  │
│ └──────────────────────────────────────┬─────────────────────────────────┘  │
│                                        ▼                                    │
│ ┌────────────────────────────────────────────────────────────────────────┐  │
│ │            Official EU Declaration of Conformity (Annex VII)           │  │
│ │ - Formal bilingual legal declaration text (FR / EN)                    │  │
│ │ - Evidence Dossier attachments & audit report                          │  │
│ │ - Vector print-ready PDF export & structured JSON export               │  │
│ └────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Full-Stack Server Route: `/api/extract-llm`

- **Endpoint**: `POST /api/extract-llm`
- **Payload**: `{ text: string, documentType: string, language: 'fr' | 'en' }`
- **Handler**: Calls `ai.models.generateContent` with model `gemini-3.8-flash` and strict JSON response schema:
  - `heavyMetals`: `{ pb: number, cd: number, hg: number, crVI: number, total: number, unit: string, snippet: string, pageNumber: number }`
  - `pfas`: `{ declaredFree: boolean, detectionLimit: string, snippet: string }`
  - `material`: `{ polymer: string, recyclingCode: string, monomaterial: boolean, recyclabilityPercent: number, snippet: string }`
  - `recycledContent`: `{ pcrPercentage: number, certScheme: string, snippet: string }`
  - `standards`: string array (e.g. `['EN 13427:2004', 'EN 13428:2004']`)
