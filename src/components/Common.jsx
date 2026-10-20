import React from 'react';
import { inr, fmt, has, r2 } from '../utils/formatters';

export function PL({ inc, exp }) {
  if (!has(inc) || !has(exp)) {
    return <span className="text-slate-400 font-bold">-</span>;
  }
  const d = r2(inc - exp);
  return d >= 0 ? (
    <span className="font-extrabold text-green-600">+{inr(d)}</span>
  ) : (
    <span className="font-extrabold text-red-600">-{inr(Math.abs(d))}</span>
  );
}

export function Val({ v, money }) {
  return has(v) ? (money ? inr(v) : fmt(v)) : '-';
}

export function Legend({ items }) {
  return (
    <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-600 mb-2">
      {items.map(([name, color]) => (
        <span key={name} className="flex items-center gap-1.5">
          <i className="inline-block w-3 h-3" style={{ background: color }} />
          {name}
        </span>
      ))}
    </div>
  );
}

export function Panel({ title, children, right }) {
  return (
    <section className="bg-white border-2 border-slate-900 p-4 sm:p-5 shadow-[4px_4px_0_0_#0F172A]">
      <div className="flex items-center justify-between mb-3 gap-2">
        <h2 className="font-black text-slate-900 uppercase tracking-wide text-sm sm:text-base">
          {title}
        </h2>
        {right}
      </div>
      {children}
    </section>
  );
}

export function Empty({ text }) {
  return (
    <div className="border-2 border-dashed border-slate-300 p-8 text-center text-slate-500 font-medium">
      📭 {text}
    </div>
  );
}

export function Arrows({ start, len, onShift, winSize = 6 }) {
  const b = "px-3 py-1 bg-slate-900 text-white font-black disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed";
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className={b}
        disabled={start <= 0}
        onClick={() => onShift(-1)}
      >
        ◀
      </button>
      <button
        type="button"
        className={b}
        disabled={start + winSize >= len}
        onClick={() => onShift(1)}
      >
        ▶
      </button>
    </div>
  );
}

export function Card({ l, children, dark }) {
  return (
    <div className={`border-2 border-slate-900 p-4 ${dark ? 'bg-slate-900 text-white' : 'bg-white'}`}>
      <div className={`text-[11px] font-bold uppercase tracking-wider ${dark ? 'text-blue-200' : 'text-slate-500'}`}>
        {l}
      </div>
      <div className="text-xl sm:text-2xl font-black mt-1 break-words">
        {children}
      </div>
    </div>
  );
}
