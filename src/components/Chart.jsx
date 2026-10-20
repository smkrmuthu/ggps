import React from 'react';
import { has, inr, fmt } from '../utils/formatters';

export function Chart({ labels, series, sel, extra, money, f }) {
  const n = labels.length;
  const gw = Math.max(80, 36 + series.length * 30);
  const W = Math.max(n * gw + 60, 520);
  const H = extra ? 270 : 250;
  const base = 210;
  const top = 20;
  const max = Math.max(1, ...series.flatMap(s => s.vals.map(v => v || 0)));
  const bw = Math.min(34, (gw - 24) / series.length);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', minWidth: '460px' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line
              x1="50"
              x2={W - 5}
              y1={base - t * (base - top)}
              y2={base - t * (base - top)}
              stroke="#cbd5e1"
              strokeDasharray="3 3"
            />
            <text
              x="46"
              y={base - t * (base - top) + 4}
              fontSize="10"
              textAnchor="end"
              fill="#64748b"
            >
              {f(max * t)}
            </text>
          </g>
        ))}

        {labels.map((l, i) => {
          const gx = 55 + i * gw + (gw - bw * series.length) / 2;
          return (
            <g key={l.ym}>
              {l.ym === sel && (
                <rect
                  x={55 + i * gw}
                  y={top - 8}
                  width={gw}
                  height={base - top + 40}
                  fill="#1E3A8A"
                  opacity="0.07"
                />
              )}
              {series.map((s, j) => {
                const v = s.vals[i];
                if (!has(v)) return null;
                const bh = (v / max) * (base - top);
                return (
                  <g key={j}>
                    <rect
                      x={gx + j * bw}
                      y={base - bh}
                      width={bw - 3}
                      height={Math.max(bh, 1)}
                      fill={s.color}
                    >
                      <title>{`${s.name} · ${l.text}: ${money ? inr(v) : fmt(v)}`}</title>
                    </rect>
                    <text
                      x={gx + j * bw + (bw - 3) / 2}
                      y={base - bh - 4}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="800"
                      fill="#0f172a"
                    >
                      {f(v)}
                    </text>
                  </g>
                );
              })}
              <text
                x={55 + i * gw + gw / 2}
                y={base + 16}
                textAnchor="middle"
                fontSize="11"
                fontWeight={l.ym === sel ? '800' : '500'}
                fill="#0f172a"
              >
                {l.text}
              </text>
              {extra && extra[i] && (
                <text
                  x={55 + i * gw + gw / 2}
                  y={base + 34}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill={extra[i].c}
                >
                  {extra[i].t}
                </text>
              )}
            </g>
          );
        })}
        <line x1="50" x2={W - 5} y1={base} y2={base} stroke="#0f172a" strokeWidth="2" />
      </svg>
    </div>
  );
}
