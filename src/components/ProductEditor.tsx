import React from 'react';
import { ComplianceReport, Language, PackagingComponent, PackagingItem } from '../types/ppwr';
import { THRESHOLDS } from '../data/rules2025-40';
import {
  buildHeavyMetals,
  buildPfas,
  computeDimensions,
  MATERIAL_CODES,
  newComponent,
  withComponentStatus,
} from '../utils/products';
import { Card, CheckField, NumberField, SelectField, TextField } from './ui/Fields';
import { ActiveTab } from './Navbar';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  item: PackagingItem;
  setItem: (updater: (prev: PackagingItem) => PackagingItem) => void;
  report: ComplianceReport;
  language: Language;
  onNavigate: (tab: ActiveTab) => void;
}

export const ProductEditor: React.FC<Props> = ({ item, setItem, report, language, onNavigate }) => {
  const fr = language === 'fr';
  const t = (a: string, b: string) => (fr ? a : b);

  const patch = (p: Partial<PackagingItem>) => setItem(prev => ({ ...prev, ...p }));
  const patchMfr = (p: Partial<PackagingItem['manufacturer']>) => setItem(prev => ({ ...prev, manufacturer: { ...prev.manufacturer, ...p } }));
  const patchComponent = (id: string, p: Partial<PackagingComponent>) =>
    setItem(prev => ({ ...prev, components: prev.components.map(c => (c.id === id ? withComponentStatus({ ...c, ...p }) : c)) }));
  const addComponent = () => setItem(prev => ({ ...prev, components: [...prev.components, newComponent()] }));
  const removeComponent = (id: string) => setItem(prev => ({ ...prev, components: prev.components.filter(c => c.id !== id) }));

  const hm = item.heavyMetals;
  const pfas = item.pfas;
  const dims = item.dimensions;
  const art = (n: string) => report.articles.find(a => a.articleNumber === n);
  const voidArt = art('Article 9 & 21');

  const pfasValue = pfas?.declaredFree === true ? 'free' : pfas?.declaredFree === false ? 'not' : 'unknown';

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold dark:text-white text-slate-900">{t('Fiche produit', 'Product sheet')}</h1>
          <p className="text-sm dark:text-slate-400 text-slate-600 mt-0.5 max-w-3xl">
            {t(
              'Saisissez les données du produit. Un champ laissé vide est « non renseigné » : il n\'est jamais compté comme 0 ni comme conforme. Les valeurs saisies à la main n\'ont pas de preuve : joignez les rapports dans « Documents & Fournisseurs ».',
              'Enter the product data. An empty field means "not provided": it is never counted as 0 nor as compliant. Hand-typed values have no proof: attach the reports in "Documents & Suppliers".'
            )}
          </p>
        </div>
        <button type="button" onClick={() => onNavigate('compliance')} className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
          {t('Voir l\'audit de conformité', 'View compliance audit')}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">
        <Card headingId="ed-identity" title={t('Identification', 'Identification')}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField label={t('Nom du produit', 'Product name')} value={item.name} onChange={v => patch({ name: v })} />
            <TextField label="SKU / GTIN" value={item.sku} onChange={v => patch({ sku: v })} />
            <TextField label={t('Marque', 'Brand')} value={item.brand} onChange={v => patch({ brand: v })} />
            <SelectField
              label={t('Catégorie d\'emballage', 'Packaging category')}
              value={item.category}
              onChange={v => patch({ category: v as PackagingItem['category'] })}
              options={[
                { value: 'primary', label: t('Primaire (contact direct)', 'Primary (direct contact)') },
                { value: 'secondary', label: t('Secondaire (regroupement)', 'Secondary (grouping)') },
                { value: 'transport', label: t('Transport / e-commerce', 'Transport / e-commerce') },
                { value: 'service', label: t('Service', 'Service') },
              ]}
              hint={t('Le plafond de 50 % de vide s\'applique aux catégories secondaire et transport.', 'The 50% void ceiling applies to secondary and transport categories.')}
            />
            <SelectField
              label={t('Votre rôle', 'Your role')}
              value={item.userRole}
              onChange={v => patch({ userRole: v as PackagingItem['userRole'] })}
              options={[
                { value: 'manufacturer', label: t('Fabricant', 'Manufacturer') },
                { value: 'importer', label: t('Importateur', 'Importer') },
                { value: 'distributor', label: t('Distributeur', 'Distributor') },
                { value: 'brand_owner', label: t('Propriétaire de marque', 'Brand owner') },
                { value: 'fulfilment', label: t('Prestataire logistique', 'Fulfilment provider') },
              ]}
            />
          </div>
        </Card>

        <Card headingId="ed-mfr" title={t('Déclarant (fabricant)', 'Declarant (manufacturer)')}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField label={t('Raison sociale', 'Company name')} value={item.manufacturer.companyName} onChange={v => patchMfr({ companyName: v })} />
            <TextField label={t('N° TVA', 'VAT number')} value={item.manufacturer.vatNumber} onChange={v => patchMfr({ vatNumber: v })} />
            <TextField label={t('Adresse', 'Address')} value={item.manufacturer.address} onChange={v => patchMfr({ address: v })} />
            <TextField label={t('Pays', 'Country')} value={item.manufacturer.country} onChange={v => patchMfr({ country: v })} />
            <TextField label={t('Signataire', 'Signatory')} value={item.manufacturer.signatoryName} onChange={v => patchMfr({ signatoryName: v })} />
            <TextField label={t('Fonction du signataire', 'Signatory role')} value={item.manufacturer.signatoryRole} onChange={v => patchMfr({ signatoryRole: v })} />
          </div>
        </Card>
      </div>

      <Card headingId="ed-components" title={t('Composants et matériaux (Art. 6 et 7)', 'Components and materials (Art. 6 and 7)')}
        description={t('Un composant sans nom, code matière ou masse est « manquant » et empêche la conformité du dossier.', 'A component without name, material code or weight is "missing" and prevents dossier compliance.')}>
        <div className="space-y-4">
          {item.components.length === 0 && (
            <p className="text-sm dark:text-slate-400 text-slate-600">{t('Aucun composant. Ajoutez le premier.', 'No component yet. Add the first one.')}</p>
          )}
          {item.components.map((c, idx) => {
            const isPlastic = c.materialType === 'plastic';
            return (
              <fieldset key={c.id} className="rounded-lg border dark:border-slate-700 border-slate-200 p-4">
                <legend className="px-2 text-xs font-bold dark:text-slate-300 text-slate-700">
                  {t('Composant', 'Component')} {idx + 1}
                  {c.status === 'missing' && <span className="ml-2 text-amber-800 dark:text-amber-400 font-semibold">{t('incomplet', 'incomplete')}</span>}
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <TextField label={t('Nom', 'Name')} value={c.name} onChange={v => patchComponent(c.id, { name: v })} />
                  <TextField label={t('Fournisseur', 'Supplier')} value={c.supplierName} onChange={v => patchComponent(c.id, { supplierName: v })} />
                  <SelectField
                    label={t('Famille de matériau', 'Material family')}
                    value={c.materialType}
                    onChange={v => patchComponent(c.id, { materialType: v as PackagingComponent['materialType'], recycledPlasticPercent: v === 'plastic' ? c.recycledPlasticPercent : 0 })}
                    options={[
                      { value: 'plastic', label: t('Plastique', 'Plastic') },
                      { value: 'paper_cardboard', label: t('Papier / carton', 'Paper / cardboard') },
                      { value: 'glass', label: t('Verre', 'Glass') },
                      { value: 'metal', label: t('Métal', 'Metal') },
                      { value: 'wood', label: t('Bois', 'Wood') },
                      { value: 'composite', label: t('Composite', 'Composite') },
                    ]}
                  />
                  <TextField label={t('Code matière', 'Material code')} list="material-codes" value={c.materialCode} onChange={v => patchComponent(c.id, { materialCode: v.toUpperCase() })} placeholder="PET 01" />
                  <NumberField label={t('Masse', 'Weight')} unit="g" value={c.weightGrams > 0 ? c.weightGrams : undefined} onChange={v => patchComponent(c.id, { weightGrams: v ?? 0 })} />
                  <NumberField label={t('Plastique recyclé (PCR)', 'Recycled plastic (PCR)')} unit="%" value={isPlastic ? c.recycledPlasticPercent : undefined} disabled={!isPlastic}
                    onChange={v => patchComponent(c.id, { recycledPlasticPercent: Math.min(100, v ?? 0) })}
                    hint={isPlastic ? undefined : t('Plastiques uniquement', 'Plastics only')} />
                  <TextField label={t('Barrière / revêtement', 'Barrier / coating')} value={c.barrierOrCoatings ?? ''} onChange={v => patchComponent(c.id, { barrierOrCoatings: v })} hint={t('Réduit la note de recyclabilité', 'Lowers the recyclability score')} />
                  <div className="flex flex-col justify-end">
                    <CheckField label={t('Mono-matériau', 'Mono-material')} checked={c.isMonoMaterial} onChange={v => patchComponent(c.id, { isMonoMaterial: v })} />
                    <CheckField label={t('Contact alimentaire', 'Food contact')} checked={c.foodContact} onChange={v => patchComponent(c.id, { foodContact: v })} />
                    <CheckField label={t('Séparable sans outil', 'Separable without tools')} checked={c.separableWithoutTools} onChange={v => patchComponent(c.id, { separableWithoutTools: v })} />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button type="button" onClick={() => removeComponent(c.id)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:underline">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {t('Supprimer ce composant', 'Remove this component')}
                    <span className="sr-only"> {idx + 1}</span>
                  </button>
                </div>
              </fieldset>
            );
          })}
          <datalist id="material-codes">{MATERIAL_CODES.map(m => <option key={m} value={m} />)}</datalist>
          <button type="button" onClick={addComponent} className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg border dark:border-slate-700 border-slate-300 dark:text-slate-200 text-slate-800 dark:hover:bg-slate-800 hover:bg-slate-50 transition-colors">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t('Ajouter un composant', 'Add a component')}
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">
        <Card headingId="ed-metals" title={t('Métaux lourds (Art. 5)', 'Heavy metals (Art. 5)')}
          description={t(`Somme Pb + Cd + Hg + Cr(VI) ≤ ${THRESHOLDS.heavyMetalsTotal.value} mg/kg. Vide = non testé. Le total n'est calculé que si les 4 métaux sont renseignés.`, `Sum of Pb + Cd + Hg + Cr(VI) ≤ ${THRESHOLDS.heavyMetalsTotal.value} mg/kg. Empty = not tested. The total is only computed when all 4 metals are provided.`)}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <NumberField label={t('Plomb (Pb)', 'Lead (Pb)')} unit="mg/kg" value={hm?.pb_mg_kg} onChange={v => patch({ heavyMetals: buildHeavyMetals(item.heavyMetals, { pb_mg_kg: v }) })} />
            <NumberField label={t('Cadmium (Cd)', 'Cadmium (Cd)')} unit="mg/kg" value={hm?.cd_mg_kg} onChange={v => patch({ heavyMetals: buildHeavyMetals(item.heavyMetals, { cd_mg_kg: v }) })} />
            <NumberField label={t('Mercure (Hg)', 'Mercury (Hg)')} unit="mg/kg" value={hm?.hg_mg_kg} onChange={v => patch({ heavyMetals: buildHeavyMetals(item.heavyMetals, { hg_mg_kg: v }) })} />
            <NumberField label="Cr (VI)" unit="mg/kg" value={hm?.crVI_mg_kg} onChange={v => patch({ heavyMetals: buildHeavyMetals(item.heavyMetals, { crVI_mg_kg: v }) })} />
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <TextField label={t('N° du rapport d\'essai', 'Test report number')} value={hm?.labReportNumber ?? ''} onChange={v => patch({ heavyMetals: buildHeavyMetals(item.heavyMetals, { labReportNumber: v }) })} />
            <TextField label={t('Date d\'essai', 'Test date')} type="date" value={hm?.testedDate && /^\d{4}-\d{2}-\d{2}$/.test(hm.testedDate) ? hm.testedDate : ''} onChange={v => patch({ heavyMetals: buildHeavyMetals(item.heavyMetals, { testedDate: v }) })} />
            <p className="text-sm dark:text-slate-300 text-slate-700 pb-2" aria-live="polite">
              {t('Total', 'Total')} : <strong className="font-mono">{hm?.total_mg_kg !== undefined ? `${hm.total_mg_kg} mg/kg` : t('non calculable', 'not computable')}</strong>
            </p>
          </div>
        </Card>

        <Card headingId="ed-pfas" title="PFAS (Art. 5)"
          description={t(`Contact alimentaire : seuils indicatifs ${THRESHOLDS.pfasIndividualLimit.value * 1000} ppb par PFAS, ${THRESHOLDS.pfasSumLimit.value * 1000} ppb pour la somme, ${THRESHOLDS.pfasTotalFluorineLimit.value} ppm de fluor total (à vérifier sur EUR-Lex). Une mesure au-dessus du seuil l'emporte sur une déclaration « sans PFAS ».`, `Food contact: indicative limits ${THRESHOLDS.pfasIndividualLimit.value * 1000} ppb per PFAS, ${THRESHOLDS.pfasSumLimit.value * 1000} ppb for the sum, ${THRESHOLDS.pfasTotalFluorineLimit.value} ppm total fluorine (to verify on EUR-Lex). A measurement above the limit overrides a "PFAS-free" declaration.`)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectField
              label={t('Déclaration du fournisseur', 'Supplier declaration')}
              value={pfasValue}
              onChange={v => patch({ pfas: buildPfas(item.pfas, { declaredFree: v === 'free' ? true : v === 'not' ? false : undefined }) })}
              options={[
                { value: 'unknown', label: t('Non renseigné', 'Not provided') },
                { value: 'free', label: t('Sans PFAS ajouté (déclaré)', 'No PFAS added (declared)') },
                { value: 'not', label: t('Non attesté', 'Not attested') },
              ]}
            />
            <TextField label={t('N° du certificat / rapport', 'Certificate / report number')} value={pfas?.labCertificateNumber ?? ''} onChange={v => patch({ pfas: buildPfas(item.pfas, { labCertificateNumber: v }) })} />
            <NumberField label={t('Somme des PFAS mesurés', 'Sum of measured PFAS')} unit="mg/kg" value={pfas?.sum} onChange={v => patch({ pfas: buildPfas(item.pfas, { sum: v }) })} hint={t('1 ppb = 0,001 mg/kg', '1 ppb = 0.001 mg/kg')} />
            <NumberField label={t('Fluor total', 'Total fluorine')} unit="mg/kg" value={pfas?.totalFluorine} onChange={v => patch({ pfas: buildPfas(item.pfas, { totalFluorine: v }) })} />
          </div>
        </Card>

        <Card headingId="ed-dims" title={t('Dimensions et vide (Art. 9 et 21)', 'Dimensions and void (Art. 9 and 21)')}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <NumberField label={t('Longueur', 'Length')} unit="mm" value={dims.lengthMm > 0 ? dims.lengthMm : undefined} onChange={v => patch({ dimensions: computeDimensions(item.dimensions, { lengthMm: v ?? 0 }) })} />
            <NumberField label={t('Largeur', 'Width')} unit="mm" value={dims.widthMm > 0 ? dims.widthMm : undefined} onChange={v => patch({ dimensions: computeDimensions(item.dimensions, { widthMm: v ?? 0 }) })} />
            <NumberField label={t('Hauteur', 'Height')} unit="mm" value={dims.heightMm > 0 ? dims.heightMm : undefined} onChange={v => patch({ dimensions: computeDimensions(item.dimensions, { heightMm: v ?? 0 }) })} />
            <NumberField label={t('Volume du produit', 'Product volume')} unit="cm³" value={dims.productVolumeCm3 > 0 ? dims.productVolumeCm3 : undefined} onChange={v => patch({ dimensions: computeDimensions(item.dimensions, { productVolumeCm3: v ?? 0 }) })} />
          </div>
          <p className="mt-3 text-sm dark:text-slate-300 text-slate-700" aria-live="polite">
            {t('Volume de l\'emballage', 'Packaging volume')} : <strong className="font-mono">{dims.packagingVolumeCm3} cm³</strong>
            {' · '}{t('Espace vide', 'Void space')} : <strong className="font-mono">{voidArt?.status === 'missing' ? '—' : `${dims.voidSpaceRatioPercent} %`}</strong>
          </p>
        </Card>

        <Card headingId="ed-reuse" title={t('Réemploi (Art. 10 et 26)', 'Reuse (Art. 10 and 26)')}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <CheckField label={t('Emballage conçu pour le réemploi', 'Packaging designed for reuse')} checked={item.reusability.isReusable}
                onChange={v => patch({ reusability: { ...item.reusability, isReusable: v, ...(v ? {} : { intendedRotations: 0, systemForReuse: 'none' as const }) } })} />
            </div>
            <NumberField label={t('Rotations prévues', 'Planned rotations')} value={item.reusability.isReusable ? item.reusability.intendedRotations : undefined} disabled={!item.reusability.isReusable}
              onChange={v => patch({ reusability: { ...item.reusability, intendedRotations: Math.round(v ?? 0) } })} />
            <SelectField label={t('Système de réemploi', 'Reuse system')} value={item.reusability.systemForReuse} disabled={!item.reusability.isReusable}
              onChange={v => patch({ reusability: { ...item.reusability, systemForReuse: v as PackagingItem['reusability']['systemForReuse'] } })}
              options={[
                { value: 'none', label: t('Aucun', 'None') },
                { value: 'closed_loop', label: t('Boucle fermée', 'Closed loop') },
                { value: 'open_loop', label: t('Boucle ouverte', 'Open loop') },
                { value: 'deposit_return', label: t('Consigne', 'Deposit return') },
              ]} />
          </div>
        </Card>

        <Card headingId="ed-labeling" title={t('Étiquetage (Art. 11)', 'Labelling (Art. 11)')} className="xl:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <TextField label={t('Code matière affiché', 'Material code shown')} list="material-codes" value={item.labeling.materialCode} onChange={v => patch({ labeling: { ...item.labeling, materialCode: v.toUpperCase() } })} placeholder="PAP 20" />
            <TextField label={t('Consigne de tri', 'Sorting instruction')} value={item.labeling.sortingInstructions} onChange={v => patch({ labeling: { ...item.labeling, sortingInstructions: v } })} />
            <TextField label={t('QR code (URL)', 'QR code (URL)')} value={item.labeling.qrCodeUrl ?? ''} onChange={v => patch({ labeling: { ...item.labeling, qrCodeUrl: v || undefined } })} />
            <CheckField label={t('Pictogramme de tri harmonisé présent', 'Harmonised sorting pictogram present')} checked={item.labeling.hasHarmonizedPictogram} onChange={v => patch({ labeling: { ...item.labeling, hasHarmonizedPictogram: v } })} />
          </div>
        </Card>
      </div>
    </div>
  );
};
