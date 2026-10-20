import React, { useState } from 'react';
import { Panel, Empty, PL, Val } from './Common';
import { FormFields, blank, validate, toEntry } from './FormFields';
import { inCls } from './MonthSel';
import { fmt, total, has } from '../utils/formatters';
import { mlabel, nextYm, CUR, FYS, CFY, fyR, MN, YEARS } from '../utils/dateUtils';

let uid = 1000;

export function QtyTab({ entries = [], setEntries, months = [] }) {
  const [f, setF] = useState(blank);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [rfm, setRfm] = useState('');
  const [rfy, setRfy] = useState('');
  const [rtm, setRtm] = useState('');
  const [rty, setRty] = useState('');
  const [view, setView] = useState('monthly');
  const [ed, setEd] = useState(null);
  const [conf, setConf] = useState(null);
  const [dup, setDup] = useState(null);
  const [eerr, setEerr] = useState('');

  const nx = months.length ? nextYm(months[months.length - 1].ym) : CUR;
  const defYm = nx > CUR ? CUR : nx;
  const effYm = f.ym || defYm;
  const existingM = months.find((x) => x.ym === effYm);

  const shown = existingM
    ? {
        ym: effYm,
        oem: existingM.oem.toFixed(2),
        avg: existingM.avg.toFixed(2),
        oth: existingM.oth.toFixed(2),
        inc: has(existingM.inc) ? existingM.inc.toFixed(2) : '',
        exp: has(existingM.exp) ? existingM.exp.toFixed(2) : ''
      }
    : f;

  const openEdit = (m) => {
    setEerr('');
    setEd({
      orig: m.ym,
      ym: m.ym,
      oem: m.oem.toFixed(2),
      avg: m.avg.toFixed(2),
      oth: m.oth.toFixed(2),
      inc: has(m.inc) ? m.inc.toFixed(2) : '',
      exp: has(m.exp) ? m.exp.toFixed(2) : ''
    });
  };

  const submit = () => {
    const ff = { ...f, ym: f.ym || defYm };
    const e = validate(ff, CUR);
    setErr(e);
    setOk('');
    if (e) return;
    if (months.find((x) => x.ym === ff.ym)) return;

    setEntries([...entries, { ...toEntry(ff), id: uid++, ts: Date.now() }]);
    setOk(`Saved for ${mlabel(ff.ym, true)}. Dashboard updated.`);
    setF(blank);
  };

  const earliest = months.length ? months[0].ym : CUR;
  const latest = months.length ? months[months.length - 1].ym : CUR;
  const from = rfm && rfy ? `${rfy}-${rfm}` : earliest;
  const to = rtm && rty ? `${rty}-${rtm}` : latest;

  const fyVal =
    FYS.find((x) => {
      const r = fyR(x);
      return r.f === from && r.t === to;
    }) || '';

  const setFrom = (ym) => {
    setRfm(ym.slice(5));
    setRfy(ym.slice(0, 4));
    if (ym > to) {
      setRtm(ym.slice(5));
      setRty(ym.slice(0, 4));
    }
  };

  const setTo = (ym) => {
    setRtm(ym.slice(5));
    setRty(ym.slice(0, 4));
  };

  const pickFy = (x) => {
    if (!x) return;
    const r = fyR(x);
    setFrom(r.f);
    setTo(r.t);
  };

  const lifetime = () => {
    setRfm('');
    setRfy('');
    setRtm('');
    setRty('');
    setView('monthly');
  };

  const match = (ym) => ym >= from && ym <= to;
  const fm = months.filter((m) => match(m.ym)).reverse();
  const fe = entries.filter((e) => match(e.ym)).sort((a, b) => b.ts - a.ts);

  const saveEdit = () => {
    const e =
      validate(ed, CUR) ||
      (ed.ym !== ed.orig && months.find((x) => x.ym === ed.ym)
        ? `An entry for ${mlabel(ed.ym, true)} already exists. Edit that month instead.`
        : '');
    setEerr(e);
    if (e) return;

    setEntries([
      ...entries.filter((x) => x.ym !== ed.orig),
      { ...toEntry(ed), id: uid++, ts: Date.now() }
    ]);
    setEd(null);
  };

  const th = "text-left px-3 py-2 text-xs uppercase tracking-wider font-black";
  const td = "px-3 py-2 whitespace-nowrap font-semibold";

  return (
    <div className="space-y-5">
      <Panel title="Add GGBS Entry">
        <FormFields
          f={shown}
          setF={setF}
          defYm={defYm}
          locked={Boolean(existingM)}
          onYm={(v) => months.find((x) => x.ym === v) && setDup(v)}
        />
        {err && <p className="mt-3 text-sm font-bold text-red-600">⚠ {err}</p>}
        {ok && <p className="mt-3 text-sm font-bold text-green-600">✔ {ok}</p>}
        <p className="mt-2 text-xs text-slate-500">
          One entry per month. To change an existing month's values, use Edit in the table below.
        </p>
        {existingM && (
          <p className="mt-3 text-sm font-bold text-red-600">
            🔒 {mlabel(effYm, true)} is already submitted. Values are locked, so use Edit Entry to change them.
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {existingM ? (
            <button
              type="button"
              onClick={() => openEdit(existingM)}
              className="px-6 py-3 bg-blue-900 text-white font-black hover:bg-slate-900 cursor-pointer"
            >
              Edit Entry
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              className="px-6 py-3 bg-slate-900 text-white font-black hover:bg-blue-900 cursor-pointer"
            >
              Submit Entry
            </button>
          )}
        </div>
      </Panel>

      <Panel title="Filter & Manage Data">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <label className="flex items-center gap-2 border-2 border-slate-900 bg-white px-2 py-1">
            <span className="text-xs font-black uppercase">Financial Year</span>
            <select
              className="font-bold bg-white px-2 py-1 focus:outline-none"
              value={fyVal}
              onChange={(e) => pickFy(e.target.value)}
            >
              <option value="">Select FY</option>
              {[...FYS].reverse().map((x) => (
                <option key={x} value={x}>
                  {x}
                  {x === CFY ? ' (Current)' : ''}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={lifetime}
            className={`px-4 py-2 border-2 border-blue-900 font-black text-sm ${
              from === earliest && to === latest
                ? 'bg-blue-900 text-white'
                : 'bg-white text-blue-900'
            }`}
          >
            Lifetime
          </button>
          <button
            type="button"
            onClick={lifetime}
            className="px-3 py-2 border-2 border-red-600 text-red-600 font-bold text-sm hover:bg-red-50"
          >
            ↺ Reset
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end gap-3 mb-3 border-2 border-slate-900 p-3 bg-slate-50">
          {[
            ['From', from, setFrom],
            ['To', to, setTo]
          ].map((r) => {
            const isTo = r[0] === 'To';
            const fy0 = from.slice(0, 4);
            const fm0 = from.slice(5);
            const fy1 = to.slice(0, 4);
            const fm1 = to.slice(5);

            const mons = MN.map((n, i) => [String(i + 1).padStart(2, '0'), n]).filter(
              (o) =>
                o[0] === r[1].slice(5) ||
                !((isTo && r[1].slice(0, 4) === fy0 && o[0] < fm0) ||
                  (!isTo && r[1].slice(0, 4) === fy1 && o[0] > fm1))
            );

            const yrsO = YEARS.filter(
              (y) => String(y) === r[1].slice(0, 4) || (isTo ? y >= +fy0 : y <= +fy1)
            );

            return (
              <div key={r[0]} className="flex items-center gap-2">
                <span className="text-xs font-black uppercase w-10">{r[0]}</span>
                <select
                  className={`${inCls} mt-0`}
                  value={r[1].slice(5)}
                  onChange={(e) => r[2](`${r[1].slice(0, 4)}-${e.target.value}`)}
                >
                  {mons.map((o) => (
                    <option key={o[0]} value={o[0]}>
                      {o[1]}
                    </option>
                  ))}
                </select>
                <select
                  className={`${inCls} mt-0`}
                  value={r[1].slice(0, 4)}
                  onChange={(e) => {
                    const ny = e.target.value;
                    let nm = r[1].slice(5);
                    if (isTo && ny === fy0 && nm < fm0) nm = fm0;
                    if (!isTo && ny === fy1 && nm > fm1) nm = fm1;
                    r[2](`${ny}-${nm}`);
                  }}
                >
                  {yrsO.map((v) => (
                    <option key={v} value={String(v)}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
          <span className="text-[11px] text-slate-500 font-semibold">
            Showing {mlabel(from)} → {mlabel(to)}
          </span>
        </div>

        <div className="flex gap-2 mb-3">
          {[
            ['monthly', 'Monthly Aggregated'],
            ['all', 'All Entries']
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setView(val)}
              className={`px-4 py-2 font-bold text-sm border-2 border-blue-900 ${
                view === val ? 'bg-blue-900 text-white' : 'bg-white text-blue-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {(view === 'monthly' ? fm.length : fe.length) === 0 ? (
          <Empty
            text={
              entries.length
                ? 'No records match your filters.'
                : 'No entries yet. Use the form above to add your first GGBS record.'
            }
          />
        ) : (
          <div className="overflow-x-auto border-2 border-slate-900">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className={th}>Month</th>
                  <th className={th}>OEM</th>
                  <th className={th}>AVS</th>
                  <th className={th}>Others</th>
                  <th className={th}>Total</th>
                  <th className={th}>Income</th>
                  <th className={th}>Expense</th>
                  <th className={th}>P/L</th>
                  <th className={th}>{view === 'monthly' ? 'Actions' : ''}</th>
                </tr>
              </thead>
              <tbody>
                {(view === 'monthly' ? fm : fe).map((m) => (
                  <tr
                    key={view === 'monthly' ? m.ym : m.id}
                    className="border-t border-slate-200 odd:bg-slate-50"
                  >
                    <td className={td}>{mlabel(m.ym)}</td>
                    <td className={td}>{fmt(m.oem)}</td>
                    <td className={td}>{fmt(m.avg)}</td>
                    <td className={td}>{fmt(m.oth)}</td>
                    <td className={`${td} font-black`}>{fmt(total(m))}</td>
                    <td className={td}>
                      <Val v={m.inc} money />
                    </td>
                    <td className={td}>
                      <Val v={m.exp} money />
                    </td>
                    <td className={td}>
                      <PL inc={m.inc} exp={m.exp} />
                    </td>
                    <td className={td}>
                      {view === 'monthly' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => openEdit(m)}
                            className="px-3 py-1 bg-blue-900 text-white font-bold mr-2 hover:bg-slate-900 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setConf({
                                msg: `Delete all entries for ${mlabel(m.ym, true)}?`,
                                fn: () => setEntries(entries.filter((x) => x.ym !== m.ym))
                              })
                            }
                            className="px-3 py-1 bg-red-600 text-white font-bold hover:bg-red-700 cursor-pointer"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEntries(entries.filter((x) => x.id !== m.id))}
                          className="px-3 py-1 bg-red-600 text-white font-bold hover:bg-red-700 cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {dup && (
        <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-slate-900 p-5 w-full max-w-sm shadow-[6px_6px_0_0_#0F172A]">
            <div className="text-2xl mb-1">⚠️</div>
            <p className="font-black mb-1">{mlabel(dup, true)} already has an entry</p>
            <p className="text-sm text-slate-600 mb-4">
              Only one entry is allowed per month. Please change its values in the Edit window instead.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const mm = months.find((x) => x.ym === dup);
                  setDup(null);
                  if (mm) openEdit(mm);
                }}
                className="px-5 py-2 bg-blue-900 text-white font-black hover:bg-slate-900"
              >
                Go to Edit
              </button>
              <button
                type="button"
                onClick={() => setDup(null)}
                className="px-5 py-2 border-2 border-slate-900 font-bold hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {conf && (
        <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-slate-900 p-5 w-full max-w-sm shadow-[6px_6px_0_0_#0F172A]">
            <p className="font-black mb-4">{conf.msg}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  conf.fn();
                  setConf(null);
                }}
                className="px-5 py-2 bg-red-600 text-white font-black hover:bg-red-700"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setConf(null)}
                className="px-5 py-2 border-2 border-slate-900 font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {ed && (
        <div className="fixed inset-0 bg-slate-900/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-slate-900 p-5 w-full max-w-3xl max-h-full overflow-auto shadow-[8px_8px_0_0_#0F172A]">
            <h3 className="font-black text-lg mb-3">Edit {mlabel(ed.orig, true)}</h3>
            <FormFields f={ed} setF={setEd} />
            {eerr && <p className="mt-3 text-sm font-bold text-red-600">⚠ {eerr}</p>}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={saveEdit}
                className="px-5 py-2 bg-slate-900 text-white font-black hover:bg-blue-900"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEd(null)}
                className="px-5 py-2 border-2 border-slate-900 font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
