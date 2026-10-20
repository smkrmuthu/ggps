import React, { useState } from 'react';
import { Chart } from './Chart';
import { Panel, Legend, Empty, Arrows, Card, PL, Val } from './Common';
import { r2, fmt, inr, total, has, qk, mL } from '../utils/formatters';
import { mlabel, fyOf, CUR, CFY, FYS, fyR, MN, YEARS } from '../utils/dateUtils';

const WIN = 6;

export function Dashboard({ months: all = [] }) {
  const [mode, setMode] = useState('month');
  const [selYm, setSel] = useState(null);
  const [fySel, setFySel] = useState('');
  const [offA, setOffA] = useState(0);
  const [offF, setOffF] = useState(0);
  const [rfm, setRfm] = useState('');
  const [rfy, setRfy] = useState('');
  const [rtm, setRtm] = useState('');
  const [rty, setRty] = useState('');

  if (!all.length) {
    return (
      <div className="space-y-5">
        <Empty text="No data yet. A Master Admin can add GGBS quantities in the GGBS Summary tab and the dashboard will light up here." />
      </div>
    );
  }

  const earliest = all[0].ym;
  const latest = all[all.length - 1].ym;
  const from = rfm && rfy ? `${rfy}-${rfm}` : earliest;
  const to = rtm && rty ? `${rty}-${rtm}` : latest;

  const isM = mode === 'month';
  let idx = all.findIndex((x) => x.ym === selYm);
  if (idx < 0) idx = all.length - 1;
  const curYm = isM ? all[idx].ym : '';

  const scope =
    mode === 'fy'
      ? all.filter((x) => x.ym >= fyR(fySel).f && x.ym <= fyR(fySel).t)
      : mode === 'range'
      ? all.filter((x) => x.ym >= from && x.ym <= to)
      : all;

  const offs = () => {
    setOffA(0);
    setOffF(0);
  };

  const clearR = () => {
    setRfm('');
    setRfy('');
    setRtm('');
    setRty('');
  };

  const pickMonth = (ym) => {
    setMode('month');
    setSel(ym);
    setFySel('');
    clearR();
    offs();
  };

  const pickFy = (x) => {
    if (!x) return;
    setMode('fy');
    setFySel(x);
    setSel(null);
    clearR();
    offs();
  };

  const rangeSet = (fn) => (v) => {
    fn(v);
    setMode('range');
    setFySel('');
    setSel(null);
    offs();
  };

  const goLife = () => {
    setMode('life');
    setSel(null);
    setFySel('');
    clearR();
    offs();
  };

  const goReset = () => {
    setMode('month');
    setSel(null);
    setFySel('');
    clearR();
    offs();
  };

  const yrs = [...new Set(all.map((x) => x.ym.slice(0, 4)))].sort().reverse();
  const mopts = isM
    ? all.filter((x) => x.ym.startsWith(curYm.slice(0, 4))).map((x) => x.ym.slice(5))
    : [...new Set(all.map((x) => x.ym.slice(5)))].sort();

  const onMon = (v) => {
    if (!v) return;
    const c = all.filter((x) => x.ym.slice(5) === v);
    pickMonth(
      isM && c.find((x) => x.ym.startsWith(curYm.slice(0, 4)))
        ? `${curYm.slice(0, 4)}-${v}`
        : c[c.length - 1].ym
    );
  };

  const onYr = (y) => {
    if (!y) return;
    const c = all.filter((x) => x.ym.startsWith(y));
    pickMonth(
      (isM && c.find((x) => x.ym.slice(5) === curYm.slice(5)))?.ym || c[c.length - 1].ym
    );
  };

  const sc = "px-3 py-2 bg-white text-slate-900 font-bold border-2 border-white focus:outline-none";
  const fromOk = Boolean(rfm && rfy);
  const toOk = Boolean(rtm && rty);

  const onF = (kind) => (v) => {
    const nm = kind === 'm' ? v : rfm;
    const ny = kind === 'y' ? v : rfy;
    setRfm(nm);
    setRfy(ny);
    if (nm && ny && rty && (+rty < +ny || (rtm && `${rty}-${rtm}` <= `${ny}-${nm}`))) {
      setRtm('');
      setRty('');
    }
    setMode('range');
    setFySel('');
    setSel(null);
    offs();
  };

  const allMon = MN.map((n, i) => [String(i + 1).padStart(2, '0'), n]);
  const fromMon = allMon.filter((o) => !(toOk && rfy === rty && o[0] >= rtm));
  const fromYrs = YEARS.filter(
    (y) => !toOk || y < +rty || (y === +rty && rtm > '01' && !(rfm && rfm >= rtm))
  );
  const toMon = allMon.filter((o) => !(fromOk && rty === rfy && o[0] <= rfm));
  const toYrs = YEARS.filter(
    (y) => !fromOk || y > +rfy || (y === +rfy && rfm < '12' && !(rtm && rtm <= rfm))
  );

  const rp = [
    ['From', rfm, onF('m'), rfy, onF('y'), fromMon, fromYrs],
    ['To', rtm, rangeSet(setRtm), rty, rangeSet(setRty), toMon, toYrs]
  ];

  const bar = (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 bg-slate-900 text-white p-3 border-2 border-slate-900">
      <div className="flex flex-wrap items-center gap-3 w-full">
        <span className="font-black text-sm uppercase tracking-wide">Select Month</span>
        <select
          value={isM ? curYm.slice(5) : ''}
          onChange={(e) => onMon(e.target.value)}
          className={sc}
        >
          <option value="">Select</option>
          {mopts.map((v) => (
            <option key={v} value={v}>
              {MN[+v - 1]}
            </option>
          ))}
        </select>
        <select
          value={isM ? curYm.slice(0, 4) : ''}
          onChange={(e) => onYr(e.target.value)}
          className={sc}
        >
          <option value="">Select</option>
          {yrs.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <span className="text-[11px] text-blue-200 font-semibold">
          Only months with data are listed
        </span>
        <span className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={goLife}
            className={`px-4 py-2 border-2 border-white font-black text-sm ${
              mode === 'life' ? 'bg-white text-slate-900' : 'hover:bg-blue-900 text-white'
            }`}
          >
            Lifetime
          </button>
          <button
            type="button"
            onClick={goReset}
            className="px-3 py-2 border-2 border-white font-bold text-sm hover:bg-blue-900 text-white"
          >
            ↺ Reset
          </button>
        </span>
      </div>

      <div className="w-full flex flex-wrap items-center gap-x-6 gap-y-3 border-t-2 border-blue-800 pt-4">
        <span className="font-black text-sm uppercase tracking-wide">Financial Year</span>
        <select
          className={sc}
          value={mode === 'fy' ? fySel : ''}
          onChange={(e) => pickFy(e.target.value)}
        >
          <option value="">Select</option>
          {[...FYS].reverse().map((x) => (
            <option key={x} value={x}>
              {x}
              {x === CFY ? ' (Current)' : ''}
            </option>
          ))}
        </select>
        <span className="hidden sm:block w-0.5 h-8 bg-blue-700" />
        {rp.map((r) => (
          <div key={r[0]} className="flex items-center gap-2">
            <span className="font-black text-sm uppercase">{r[0]}</span>
            <select
              className={sc}
              value={r[1]}
              onChange={(e) => r[2](e.target.value)}
            >
              <option value="">Select</option>
              {r[5].map((o) => (
                <option key={o[0]} value={o[0]}>
                  {o[1]}
                </option>
              ))}
            </select>
            <select
              className={sc}
              value={r[3]}
              onChange={(e) => r[4](e.target.value)}
            >
              <option value="">Select</option>
              {r[6].map((v) => (
                <option key={v} value={String(v)}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );

  if (!scope.length) {
    return (
      <div className="space-y-5">
        {bar}
        <Empty text="No records for this selection. Pick another Financial Year or date range." />
      </div>
    );
  }

  const cm = mode === 'fy' || mode === 'range' ? scope : all;
  const fin = cm.filter((x) => has(x.inc) && has(x.exp));
  const sum = (l, k) => r2(l.reduce((a, x) => a + (x[k] || 0), 0));
  const sfin = scope.filter((x) => has(x.inc) && has(x.exp));

  const m = isM
    ? all[idx]
    : {
        oem: sum(scope, 'oem'),
        avg: sum(scope, 'avg'),
        oth: sum(scope, 'oth'),
        inc: scope.some((x) => has(x.inc)) ? sum(scope, 'inc') : null,
        exp: scope.some((x) => has(x.exp)) ? sum(scope, 'exp') : null,
        pinc: sfin.length ? sum(sfin, 'inc') : null,
        pexp: sfin.length ? sum(sfin, 'exp') : null
      };

  const pinc = isM ? m.inc : m.pinc;
  const pexp = isM ? m.exp : m.pexp;

  const t = isM
    ? { l: 'Month / Year', v: mlabel(m.ym, true) }
    : mode === 'fy'
    ? { l: 'Financial Year', v: fySel }
    : mode === 'range'
    ? scope[0].ym === scope[scope.length - 1].ym
      ? { l: 'Month / Year', v: mlabel(scope[0].ym, true) }
      : { l: 'Date Range', v: `${mlabel(scope[0].ym)} – ${mlabel(scope[scope.length - 1].ym)}` }
    : { l: 'Period', v: 'Lifetime' };

  const win = (list, si, off) => {
    const mx = Math.max(0, list.length - WIN);
    const b = (si < 0 ? list.length - 1 : si) - 3;
    const st = Math.max(0, Math.min(mx, b + off));
    return { st, b, items: list.slice(st, st + WIN) };
  };

  const wA = win(cm, isM ? idx : -1, offA);
  const wF = win(fin, isM ? fin.findIndex((x) => x.ym === m.ym) : -1, offF);
  const lab = (l) => l.map((x) => ({ ym: x.ym, text: mlabel(x.ym) }));
  const sel = isM ? m.ym : null;

  return (
    <div className="space-y-5">
      {bar}

      <Card l={t.l} dark>
        {t.v}
        {!isM && scope.length > 1 && (
          <span className="ml-3 text-xs font-semibold text-blue-200">
            {scope.length} month{scope.length > 1 ? 's' : ''}
          </span>
        )}
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card l="OEM Qty (MT)">{fmt(m.oem)}</Card>
        <Card l="AVS Qty (MT)">{fmt(m.avg)}</Card>
        <Card l="Others Qty (MT)">{fmt(m.oth)}</Card>
        <Card l="Total Qty (MT)" dark>
          {fmt(total(m))}
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card l="Income">
          <Val v={m.inc} money />
        </Card>
        <Card l="Expense">
          <Val v={m.exp} money />
        </Card>
        <Card l={isM ? 'Profit / Loss' : 'Profit / Loss (months with both)'}>
          <PL inc={pinc} exp={pexp} />
        </Card>
      </div>

      <Panel
        title="Total GGBS Quantity (MT, in k)"
        right={<Arrows start={wA.st} len={cm.length} onShift={(d) => setOffA(wA.st - wA.b + d)} />}
      >
        <Chart
          f={qk}
          labels={lab(wA.items)}
          sel={sel}
          series={[{ name: 'Total', color: '#1E3A8A', vals: wA.items.map(total) }]}
        />
      </Panel>

      <Panel
        title="Customer Wise Breakdown (MT, in k)"
        right={<Arrows start={wA.st} len={cm.length} onShift={(d) => setOffA(wA.st - wA.b + d)} />}
      >
        <Legend
          items={[
            ['OEM', '#1E3A8A'],
            ['AVS', '#3B82F6'],
            ['Others', '#94A3B8']
          ]}
        />
        <Chart
          f={qk}
          labels={lab(wA.items)}
          sel={sel}
          series={[
            { name: 'OEM', color: '#1E3A8A', vals: wA.items.map((x) => x.oem) },
            { name: 'AVS', color: '#3B82F6', vals: wA.items.map((x) => x.avg) },
            { name: 'Others', color: '#94A3B8', vals: wA.items.map((x) => x.oth) }
          ]}
        />
      </Panel>

      <Panel
        title="Financial Overview (₹, in Lakh)"
        right={
          fin.length > 0 && (
            <Arrows start={wF.st} len={fin.length} onShift={(d) => setOffF(wF.st - wF.b + d)} />
          )
        }
      >
        {fin.length ? (
          <>
            <Legend
              items={[
                ['Income', '#16A34A'],
                ['Expense', '#DC2626']
              ]}
            />
            <Chart
              f={mL}
              money
              labels={lab(wF.items)}
              sel={sel}
              series={[
                { name: 'Income', color: '#16A34A', vals: wF.items.map((x) => x.inc) },
                { name: 'Expense', color: '#DC2626', vals: wF.items.map((x) => x.exp) }
              ]}
              extra={wF.items.map((x) => {
                const d = r2(x.inc - x.exp);
                return {
                  t: (d >= 0 ? '+' : '-') + '₹' + mL(Math.abs(d)),
                  c: d >= 0 ? '#16a34a' : '#dc2626'
                };
              })}
            />
          </>
        ) : (
          <Empty text="Income and expense not entered for any month yet. Add them in the GGBS Summary tab to see this chart." />
        )}
      </Panel>
    </div>
  );
}
