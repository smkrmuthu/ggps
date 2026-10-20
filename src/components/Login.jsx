import React, { useState } from 'react';
import { sb } from '../lib/supabase';
import { inCls } from './MonthSel';

export function Login({ onDemoLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [e, setE] = useState('');
  const [b, setB] = useState(false);

  const go = async (evt) => {
    if (evt) evt.preventDefault();
    if (!sb) {
      setE('Supabase client is not configured.');
      return;
    }
    setB(true);
    setE('');
    try {
      const r = await sb.auth.signInWithPassword({ email: u.trim(), password: p });
      if (r.error) {
        setE(r.error.message);
      }
    } catch (err) {
      setE(err.message || 'Network error connecting to Supabase. You can also use Local Demo Login below.');
    } finally {
      setB(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-4 border-blue-900 p-6 sm:p-8 shadow-[8px_8px_0_0_#1E3A8A]">
        <div className="text-4xl mb-2">🏗️</div>
        <h1 className="text-2xl font-black text-slate-900">GGBS Statistics</h1>
        <p className="text-sm text-slate-500 mb-6">Sign in with your company account</p>

        <form onSubmit={go}>
          <div className="mb-4">
            <label className="block text-xs font-black uppercase text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@company.com"
              className={inCls}
              value={u}
              onChange={(x) => setU(x.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-black uppercase text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={inCls}
              value={p}
              onChange={(x) => setP(x.target.value)}
              required
            />
          </div>

          {e && (
            <div className="mt-3 p-3 bg-red-50 border-2 border-red-600 text-red-700 text-xs font-bold">
              ⚠ {e}
            </div>
          )}

          <button
            type="submit"
            disabled={b}
            className="mt-5 w-full py-3 bg-blue-900 text-white font-black hover:bg-slate-900 disabled:opacity-50 cursor-pointer shadow-[3px_3px_0_0_#0F172A] active:translate-x-0.5 active:translate-y-0.5"
          >
            {b ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t-2 border-dashed border-slate-300">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
            Local Demo Access (No Supabase required)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onDemoLogin && onDemoLogin({ name: 'master.admin@ggps.local', role: 'master' })}
              className="px-3 py-2 bg-slate-900 text-white text-xs font-black hover:bg-blue-900 cursor-pointer text-center"
            >
              Master Admin
            </button>
            <button
              type="button"
              onClick={() => onDemoLogin && onDemoLogin({ name: 'viewer.admin@ggps.local', role: 'admin' })}
              className="px-3 py-2 border-2 border-slate-900 text-slate-900 text-xs font-black hover:bg-slate-100 cursor-pointer text-center"
            >
              Admin Viewer
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Master Admin has full access to <b>Dashboard</b> & <b>GGBS Summary</b> tab. Admin Viewer is view-only.
          </p>
        </div>
      </div>
    </div>
  );
}
