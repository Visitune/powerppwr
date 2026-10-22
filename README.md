# powerPPWR

Démo de conformité au règlement européen **PPWR (UE) 2025/40** sur les emballages : évaluation article par article, coffre de documents fournisseurs avec extraction sourcée, déclaration de conformité (Annexe VII) en PDF, bilingue FR/EN.

> Aide à la décision, ne constitue pas un avis juridique. Les seuils marqués « à vérifier » dans [src/data/rules2025-40.ts](src/data/rules2025-40.ts) doivent être confirmés sur EUR-Lex avant tout usage réel.

## Principes

- **Local-first** : les produits sont stockés dans le navigateur (IndexedDB). Aucune donnée n'est envoyée à un serveur, sauf si vous choisissez le mode IA.
- **Fiche produit** : saisie manuelle complète (composants, métaux lourds, PFAS, dimensions, réemploi, étiquetage). Un champ vide reste « non renseigné », jamais compté comme 0.
- **Exemples** : 3 produits de démonstration, masquables ou supprimables dans *Paramètres*. Le choix est mémorisé.
- **Extraction déterministe par défaut** (regex sur le texte du PDF, lecteur pdf.js embarqué). Le mode IA (Gemini) est optionnel.
- **Rien d'inventé** : une donnée absente du document reste « manquante » ; aucune valeur de repli, aucune citation fabriquée.
- **Validation humaine** : une valeur extraite n'entre dans le dossier qu'après validation de ses preuves.
- La déclaration officielle est bloquée tant que le dossier n'est pas conforme ; un PDF « BROUILLON » liste les écarts.

## Lancer en local

```bash
npm install
cp .env.example .env.local   # optionnel : GEMINI_API_KEY pour le mode IA
npm run dev                  # http://localhost:3000
```

Scripts : `npm test` (Vitest), `npm run lint` (`tsc --noEmit`), `npm run build`, `npm start` (serveur de production Express).

## Déploiement Vercel

Le dépôt est prêt pour Vercel : le front est construit par Vite (`dist/`) et l'API IA est une fonction serverless (`api/extract-llm.ts`). La logique est partagée avec le serveur Express local (`lib/extractLlm.ts`).

Pour activer le mode IA en ligne, ajouter `GEMINI_API_KEY` (et éventuellement `GEMINI_MODEL`) dans *Project Settings → Environment Variables*. Sans clé, l'application fonctionne normalement.

## Structure

| Dossier | Contenu |
|---|---|
| `src/utils/complianceEngine.ts` | Moteur d'évaluation des articles 5, 6, 7, 9/21, 10/26, 11 |
| `src/utils/pdfExtractor.ts` | Extraction déterministe et appel du mode IA |
| `src/utils/storage.ts` | Stockage IndexedDB des produits |
| `src/utils/products.ts` | Création, import, exemples, calculs de saisie manuelle |
| `src/components/ProductEditor.tsx` | Fiche produit (saisie manuelle) |
| `src/data/rules2025-40.ts` | Table versionnée des seuils réglementaires |
| `lib/`, `api/`, `server.ts` | Extraction IA : module partagé, fonction Vercel, serveur local |
