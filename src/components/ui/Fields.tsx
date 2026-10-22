import React, { useEffect, useId, useState } from 'react';
import { parseOptionalNumber } from '../../utils/products';

const INPUT_CLASS =
  'w-full text-sm dark:bg-slate-900 bg-white dark:text-slate-100 text-slate-900 border dark:border-slate-700 border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400';
const LABEL_CLASS = 'block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1';
const HINT_CLASS = 'mt-1 text-[11px] dark:text-slate-400 text-slate-500';

export const Card: React.FC<{ title: string; description?: string; children: React.ReactNode; className?: string; headingId?: string }> = ({ title, description, children, className = '', headingId }) => (
  <section aria-labelledby={headingId} className={`rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-[#111827] bg-white p-5 ${className}`}>
    <h2 id={headingId} className="text-sm font-bold dark:text-white text-slate-900">{title}</h2>
    {description && <p className="text-xs dark:text-slate-400 text-slate-600 mt-0.5 mb-3">{description}</p>}
    <div className={description ? '' : 'mt-3'}>{children}</div>
  </section>
);

export const TextField: React.FC<{ label: string; value: string; onChange: (v: string) => void; hint?: string; placeholder?: string; type?: string; list?: string; disabled?: boolean }> = ({ label, value, onChange, hint, placeholder, type = 'text', list, disabled }) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>{label}</label>
      <input id={id} type={type} list={list} disabled={disabled} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} aria-describedby={hint ? `${id}-hint` : undefined} className={INPUT_CLASS} />
      {hint && <p id={`${id}-hint`} className={HINT_CLASS}>{hint}</p>}
    </div>
  );
};

/**
 * Number input that keeps what the user is typing ("1." stays "1.") while exposing a clean
 * `number | undefined` value. Empty means "not provided", never 0.
 */
export const NumberField: React.FC<{ label: string; value: number | undefined; onChange: (v: number | undefined) => void; unit?: string; hint?: string; placeholder?: string; disabled?: boolean }> = ({ label, value, onChange, unit, hint, placeholder, disabled }) => {
  const id = useId();
  const [draft, setDraft] = useState(value === undefined ? '' : String(value));
  useEffect(() => {
    if (parseOptionalNumber(draft) !== value) setDraft(value === undefined ? '' : String(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const invalid = draft.trim() !== '' && parseOptionalNumber(draft) === undefined;
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>{label}{unit ? <span className="font-normal dark:text-slate-400 text-slate-600"> ({unit})</span> : null}</label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        disabled={disabled}
        value={draft}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={hint || invalid ? `${id}-hint` : undefined}
        onChange={e => { setDraft(e.target.value); onChange(parseOptionalNumber(e.target.value)); }}
        className={`${INPUT_CLASS} font-mono ${invalid ? 'border-red-500 dark:border-red-500' : ''}`}
      />
      {(hint || invalid) && <p id={`${id}-hint`} className={`${HINT_CLASS} ${invalid ? '!text-red-500' : ''}`}>{invalid ? 'Nombre positif attendu' : hint}</p>}
    </div>
  );
};

export const SelectField: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; hint?: string; disabled?: boolean }> = ({ label, value, onChange, options, hint, disabled }) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>{label}</label>
      <select id={id} value={value} disabled={disabled} onChange={e => onChange(e.target.value)} aria-describedby={hint ? `${id}-hint` : undefined} className={`${INPUT_CLASS} cursor-pointer`}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <p id={`${id}-hint`} className={HINT_CLASS}>{hint}</p>}
    </div>
  );
};

export const CheckField: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }> = ({ label, checked, onChange, disabled }) => {
  const id = useId();
  return (
    <div className="flex items-center gap-2 py-1">
      <input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={e => onChange(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed" />
      <label htmlFor={id} className="text-sm dark:text-slate-200 text-slate-800 cursor-pointer">{label}</label>
    </div>
  );
};
