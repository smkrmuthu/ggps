import React from 'react';
import { MN, YEARS, CY, CM } from '../utils/dateUtils';

export const inCls = "mt-1 w-full border-2 border-slate-900 px-3 py-2 font-semibold bg-white focus:outline-none focus:ring-4 focus:ring-blue-300";

export function MonthSel({ value, onChange }) {
  const [y, m] = (value || `${CY}-${String(CM).padStart(2, '0')}`).split('-').map(Number);

  const setY = (ny) => {
    const nm = ny === CY && m > CM ? CM : m;
    onChange(ny + '-' + String(nm).padStart(2, '0'));
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <select
        className={inCls}
        value={m || CM}
        onChange={(e) => onChange((y || CY) + '-' + String(e.target.value).padStart(2, '0'))}
      >
        {MN.map((n, i) => (
          <option key={n} value={i + 1} disabled={y === CY && i + 1 > CM}>
            {n}
          </option>
        ))}
      </select>
      <select
        className={inCls}
        value={y || CY}
        onChange={(e) => setY(+e.target.value)}
      >
        {YEARS.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}
