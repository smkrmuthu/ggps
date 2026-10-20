export const r2 = (x) => Math.round((Number(x || 0) + Number.EPSILON) * 100) / 100;

export const fmt = (n) => {
  if (n === null || n === undefined || isNaN(n)) return '0.00';
  return Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const inr = (n) => '₹' + fmt(n);

export const has = (v) => v !== null && v !== undefined;

export const qk = (v) => (Number(v || 0) / 1000).toFixed(2) + 'k';

export const mL = (v) => (Number(v || 0) / 1e5).toFixed(2) + 'L';

export const total = (m) => r2((m.oem || 0) + (m.avg || 0) + (m.oth || 0));
