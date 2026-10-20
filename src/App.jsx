import React, { useState, useMemo, useEffect } from 'react';
import { sb } from './lib/supabase';
import { r2, has } from './utils/formatters';
import { getMockData } from './utils/mockData';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { QtyTab } from './components/QtyTab';

const toRow = (e) => ({
  ym: e.ym,
  oem: e.oem,
  avs: e.avg,
  oth: e.oth,
  inc: e.inc,
  exp: e.exp
});

const fromRow = (r) => ({
  id: r.id,
  ym: r.ym,
  oem: +r.oem,
  avg: +r.avs,
  oth: +r.oth,
  inc: r.inc == null ? null : +r.inc,
  exp: r.exp == null ? null : +r.exp,
  ts: Date.parse(r.created_at) || Date.now()
});

function aggregate(entries) {
  const map = {};
  entries.forEach((e) => {
    const m =
      map[e.ym] ||
      (map[e.ym] = { ym: e.ym, oem: 0, avg: 0, oth: 0, inc: null, exp: null, n: 0 });
    m.oem = r2(m.oem + e.oem);
    m.avg = r2(m.avg + e.avg);
    m.oth = r2(m.oth + e.oth);
    m.n++;
    if (has(e.inc)) m.inc = r2((m.inc || 0) + e.inc);
    if (has(e.exp)) m.exp = r2((m.exp || 0) + e.exp);
  });
  return Object.values(map).sort((a, b) => a.ym.localeCompare(b.ym));
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ggps_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState('dash');
  const [entries, setLocal] = useState(() => {
    const saved = localStorage.getItem('ggps_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [msg, setMsg] = useState('');

  const months = useMemo(() => aggregate(entries), [entries]);

  const load = async () => {
    if (!sb) {
      if (!entries.length) {
        setLocal(getMockData());
      }
      return;
    }
    try {
      const r = await sb.from('entries').select('*').order('ym');
      if (r.error) {
        if (!entries.length) setLocal(getMockData());
        return;
      }
      if (r.data && r.data.length > 0) {
        setLocal(r.data.map(fromRow));
      } else if (!entries.length) {
        setLocal(getMockData());
      }
    } catch {
      if (!entries.length) setLocal(getMockData());
    }
  };

  const loadUser = async (ses) => {
    if (!ses) {
      setUser(null);
      localStorage.removeItem('ggps_user');
      setReady(true);
      return;
    }
    try {
      const r = await sb
        .from('profiles')
        .select('role')
        .eq('id', ses.user.id)
        .maybeSingle();

      const u = {
        name: ses.user.email,
        role: r.data && r.data.role === 'master' ? 'master' : 'admin'
      };
      setUser(u);
      localStorage.setItem('ggps_user', JSON.stringify(u));
    } catch {
      const u = {
        name: ses.user.email,
        role: 'admin'
      };
      setUser(u);
      localStorage.setItem('ggps_user', JSON.stringify(u));
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    if (!sb) {
      setReady(true);
      return;
    }
    let dataSub;
    try {
      const { data } = sb.auth.onAuthStateChange((_ev, ses) => {
        setTimeout(() => loadUser(ses), 0);
      });
      dataSub = data;
    } catch {
      setReady(true);
    }
    return () => dataSub?.subscription?.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    load();
    if (!sb) return;

    try {
      const ch = sb
        .channel('entries-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'entries' }, load)
        .subscribe();

      return () => {
        sb.removeChannel(ch);
      };
    } catch {
      // offline / local fallback
    }
  }, [user?.name]);

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('ggps_entries', JSON.stringify(entries));
    }
  }, [entries]);

  const setEntries = async (next) => {
    const nx = new Set(next.map((e) => e.id));
    const cx = new Set(entries.map((e) => e.id));
    const del = entries.filter((e) => !nx.has(e.id));
    const add = next.filter((e) => !cx.has(e.id));

    setLocal(next);

    if (sb) {
      try {
        if (del.length) {
          const r = await sb.from('entries').delete().in('id', del.map((e) => e.id));
          if (r.error) throw r.error;
        }
        if (add.length) {
          const r = await sb.from('entries').insert(add.map(toRow));
          if (r.error) throw r.error;
        }
        setMsg('');
      } catch (e) {
        setMsg('Saved locally (' + e.message + ')');
      }
    }
  };

  const handleDemoLogin = (demoUser) => {
    setUser(demoUser);
    localStorage.setItem('ggps_user', JSON.stringify(demoUser));
    if (!entries.length) {
      setLocal(getMockData());
    }
    setReady(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ggps_user');
    if (sb) {
      sb.auth.signOut().catch(() => {});
    }
  };

  if (!ready && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 bg-slate-50">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Login onDemoLogin={handleDemoLogin} />;
  }

  const tabs = [
    ['dash', '📊 Dashboard'],
    ['qty', '📝 Data Entry']
  ];

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <header
        className="bg-slate-900 text-white border-b-4 border-blue-700 sticky top-0 z-40"
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="font-black text-lg mr-auto tracking-wide">
            GGBS Statistics
          </div>
          <nav className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t[0]}
                type="button"
                onClick={() => setTab(t[0])}
                className={`px-4 py-2 font-bold text-sm cursor-pointer transition-colors ${
                  tab === t[0]
                    ? 'bg-white text-slate-900'
                    : 'bg-blue-900 text-white hover:bg-blue-800'
                }`}
              >
                {t[1]}
              </button>
            ))}
          </nav>
          <span className="text-xs text-blue-200 font-semibold hidden sm:inline">
            {user.name} · {user.role === 'master' ? 'Master Admin' : 'Admin'}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm cursor-pointer shadow-[2px_2px_0_0_#991B1B]"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {msg && (
          <div className="mb-4 border-2 border-red-600 bg-red-50 text-red-700 font-bold p-3 flex justify-between items-center shadow-[4px_4px_0_0_#DC2626]">
            <span>⚠ {msg}</span>
            <button
              type="button"
              onClick={() => setMsg('')}
              className="text-lg font-bold px-2 hover:bg-red-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {tab === 'qty' ? (
          <QtyTab entries={entries} setEntries={setEntries} months={months} />
        ) : (
          <Dashboard months={months} />
        )}
      </main>
    </div>
  );
}
