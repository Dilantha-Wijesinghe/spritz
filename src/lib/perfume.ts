import { LOW_PCT, SPRAYS_PER_ML } from '../config';
import type { Perfume, Wear } from '../types';
import { addDays, currentSeason, dayOfYear, fmtDate, todayIso } from './dates';

/** Total sprays the bottle holds when brand new. */
export const capacity = (p: Perfume) => Math.round(p.ml * SPRAYS_PER_ML);

export const usedSprays = (wears: Wear[], pid: string) =>
  wears.filter(w => w.pid === pid).reduce((a, w) => a + w.sprays, 0);

/** Sprays left: the fill level set on the bottle minus everything logged. */
export const remaining = (p: Perfume, wears: Wear[]) =>
  Math.max(0, Math.round(p.ml * SPRAYS_PER_ML * (p.fill ?? 1)) - usedSprays(wears, p.id));

export const percentLeft = (p: Perfume, wears: Wear[]) => {
  const c = capacity(p);
  return c ? Math.round((remaining(p, wears) / c) * 100) : 0;
};

export const isLow = (p: Perfume, wears: Wear[]) => {
  const pc = percentLeft(p, wears);
  return pc > 0 && pc <= LOW_PCT;
};

export const isEmpty = (p: Perfume, wears: Wear[]) => remaining(p, wears) <= 0;

export const lastWorn = (wears: Wear[], pid: string): string | null => {
  const ws = wears.filter(w => w.pid === pid).sort((a, b) => b.date.localeCompare(a.date));
  return ws[0] ? ws[0].date : null;
};

/** "~Aug 3" estimate based on the last 30 days' spray rate, or null if unused. */
export function emptyEstimate(p: Perfume, wears: Wear[]): string | null {
  const today = todayIso();
  const cut = addDays(today, -30);
  const recent = wears.filter(w => w.pid === p.id && w.date >= cut).reduce((a, w) => a + w.sprays, 0);
  const rem = remaining(p, wears);
  if (!recent || rem <= 0) return null;
  return fmtDate(addDays(today, Math.ceil(rem / (recent / 30))));
}

const LIQUID_COLORS = [
  'var(--color-accent-300)',
  'var(--color-accent-2-400)',
  'var(--color-accent-400)',
  'var(--color-accent-2-300)',
  'var(--color-neutral-300)',
];
export const liquidColor = (hue: number) => LIQUID_COLORS[(hue || 0) % LIQUID_COLORS.length];

export const parseNotes = (s: string) =>
  String(s || '')
    .split(',')
    .map(x => x.trim())
    .filter(Boolean)
    .map(x => x.charAt(0).toUpperCase() + x.slice(1));

const lkrFormatter = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  currencyDisplay: 'code',
});

export const money = (v: number) => lkrFormatter.format(v);

export interface TodaysPick {
  perfume: Perfume;
  reason: string;
}

/** Seasonal candidates first; rotate never-worn picks by day-of-year, else least-recently-worn. */
export function todaysPick(perfumes: Perfume[], wears: Wear[]): TodaysPick | null {
  const season = currentSeason();
  const cands = perfumes.filter(p => remaining(p, wears) > 0);
  const seasonal = cands.filter(p => (p.seasons || []).includes(season));
  const pool = seasonal.length ? seasonal : cands;
  if (!pool.length) return null;

  const never = pool.filter(p => !lastWorn(wears, p.id));
  const pick = never.length
    ? never[dayOfYear() % never.length]
    : [...pool].sort((a, b) => (lastWorn(wears, a.id) || '').localeCompare(lastWorn(wears, b.id) || ''))[0];

  const lw = lastWorn(wears, pick.id);
  const reason =
    (seasonal.length ? `A ${season}-ready pick from your shelf` : 'The bottle that’s been waiting longest') +
    (lw ? ` Last worn ${fmtDate(lw)}.` : ' You haven’t logged it yet.');
  return { perfume: pick, reason };
}
