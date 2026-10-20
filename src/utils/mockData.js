import { r2 } from './formatters';
import { CY, CM } from './dateUtils';

let uid = 1;

export function getMockData() {
  const out = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  let y = CY - 3;
  let m = 4;

  while (y < CY || (y === CY && m <= CM)) {
    const ym = `${y}-${String(m).padStart(2, '0')}`;
    const oem = r2(800 + rnd() * 900);
    const avg = r2(400 + rnd() * 600);
    const oth = r2(150 + rnd() * 400);
    const q = oem + avg + oth;
    const inc = r2(q * (2800 + rnd() * 500));
    const exp = r2(q * (2500 + rnd() * 600));
    const k = out.length;

    out.push({
      mock: true,
      id: uid++,
      ts: Date.now() + k,
      ym,
      oem,
      avg,
      oth,
      inc: k % 5 === 4 ? null : inc,
      exp: k % 5 === 4 ? null : exp
    });

    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }

  return out;
}
