export const MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const now = new Date();
export const CY = now.getFullYear();
export const CM = now.getMonth() + 1;
export const CUR = CY + '-' + String(CM).padStart(2, '0');

export const YEARS = Array.from({ length: CY - 2019 }, (_, i) => CY - i);

export const mlabel = (ym, long) => {
  if (!ym) return '';
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('en-US', {
    month: long ? 'long' : 'short',
    year: 'numeric'
  });
};

export const fyOf = (ym) => {
  if (!ym) return '';
  const [y, m] = ym.split('-').map(Number);
  const s = m >= 4 ? y : y - 1;
  return 'FY ' + s + '-' + String((s + 1) % 100).padStart(2, '0');
};

export const CFY = fyOf(CUR);

export const FYS = Array.from({ length: (+CFY.slice(3, 7)) - 2021 }, (_, i) => {
  const y = 2022 + i;
  return 'FY ' + y + '-' + String((y + 1) % 100).padStart(2, '0');
});

export const fyR = (x) => {
  if (!x) return { f: '', t: '' };
  const y = +x.slice(3, 7);
  const e = (y + 1) + '-03';
  return { f: y + '-04', t: e > CUR ? CUR : e };
};

export const nextYm = (ym) => {
  let [y, m] = ym.split('-').map(Number);
  m++;
  if (m > 12) {
    m = 1;
    y++;
  }
  return y + '-' + String(m).padStart(2, '0');
};
