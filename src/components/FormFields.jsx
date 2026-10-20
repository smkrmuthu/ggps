import React from 'react';
import { MonthSel, inCls } from './MonthSel';
import { PL } from './Common';
import { fmt, r2 } from '../utils/formatters';

export const blank = { ym: '', oem: '', avg: '', oth: '', inc: '', exp: '' };

export const Field = ({ l, req, children }) => (
  <label className="block">
    <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
      {l}
      {req && <b className="text-red-600"> *</b>}
    </span>
    {children}
  </label>
);

export function FormFields({ f, setF, defYm, locked, onYm }) {
  const P = (k) => (f[k] === '' ? 0 : parseFloat(f[k]) || 0);
  const live = r2(P('oem') + P('avg') + P('oth'));
  const both = f.inc !== '' && f.exp !== '';

  const num = (k) => (
    <input
      type="text"
      inputMode="decimal"
      placeholder="0.00"
      className={inCls}
      disabled={locked}
      style={locked ? { background: '#e2e8f0', color: '#475569', cursor: 'not-allowed' } : undefined}
      value={f[k] ?? ''}
      onChange={(e) => {
        const v = e.target.value;
        if (/^\d*\.?\d{0,2}$/.test(v)) {
          setF({ ...f, [k]: v });
        }
      }}
      onBlur={() => {
        if (f[k] !== '' && f[k] !== '.') {
          setF({ ...f, [k]: r2(parseFloat(f[k]) || 0).toFixed(2) });
        }
      }}
    />
  );

  return (
    <div className="space-y-3">
      <div className="max-w-sm">
        <Field l="Month-Year" req>
          <MonthSel
            value={f.ym || defYm}
            onChange={(v) => {
              setF((p) => ({ ...p, ym: v }));
              if (onYm) onYm(v);
            }}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Field l="OEM Qty (MT)" req>
          {num('oem')}
        </Field>
        <Field l="AVS Qty (MT)" req>
          {num('avg')}
        </Field>
        <Field l="Others Qty (MT)" req>
          {num('oth')}
        </Field>
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
            Total Qty (MT)
          </span>
          <div className="mt-1 w-full border-2 border-slate-900 bg-slate-900 text-white px-3 py-2 font-black">
            {fmt(live)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Field l="Income (₹)">{num('inc')}</Field>
        <Field l="Expense (₹)">{num('exp')}</Field>
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-slate-600">
            Profit / Loss
          </span>
          <div className="mt-1 w-full border-2 border-slate-900 bg-white px-3 py-2 text-base">
            <PL inc={both ? P('inc') : null} exp={both ? P('exp') : null} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function validate(f, curYm) {
  if (!f.ym) return 'Select a month.';
  if (f.ym > curYm) return 'Future months are not allowed.';
  if (f.oem === '' || f.avg === '' || f.oth === '') {
    return 'OEM, AVS and Others quantities are required.';
  }
  return '';
}

export const toEntry = (f) => ({
  ym: f.ym,
  oem: r2(parseFloat(f.oem) || 0),
  avg: r2(parseFloat(f.avg) || 0),
  oth: r2(parseFloat(f.oth) || 0),
  inc: f.inc === '' || f.inc === null ? null : r2(parseFloat(f.inc)),
  exp: f.exp === '' || f.exp === null ? null : r2(parseFloat(f.exp)),
});
