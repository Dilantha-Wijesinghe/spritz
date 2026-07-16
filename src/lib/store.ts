import { STORAGE_KEY } from '../config';
import type { Perfume, Wear } from '../types';

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function loadState(): { perfumes: Perfume[]; wears: Wear[] } | null {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (d && Array.isArray(d.perfumes)) {
      return { perfumes: d.perfumes, wears: Array.isArray(d.wears) ? d.wears : [] };
    }
  } catch {
    /* corrupted storage — fall through to seed */
  }
  return null;
}

export function saveState(perfumes: Perfume[], wears: Wear[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ perfumes, wears }));
  } catch {
    /* quota exceeded — keep running in memory */
  }
}

export function seed(): Perfume[] {
  return [
    {
      id: 'p1', name: 'Lion', brand: 'Rayhaan', conc: 'EDP', ml: 100, price: 0, fill: 1, hue: 0, photo: null,
      top: ['Bergamot', 'Pineapple', 'Blackcurrant'], heart: ['Birch', 'Patchouli', 'Jasmine'], base: ['Musk', 'Oakmoss', 'Vanilla'],
      desc: 'Bold and smoky-fruity, with bright pineapple over dark birch and moss. A statement scent for cooler days.',
      seasons: ['fall', 'winter'], added: Date.now(),
    },
    {
      id: 'p2', name: 'Ice Dive', brand: 'Adidas', conc: 'EDT', ml: 100, price: 0, fill: 1, hue: 1, photo: null,
      top: ['Kiwi', 'Mint', 'Bergamot'], heart: ['Anise', 'Geranium', 'Patchouli'], base: ['Sandalwood', 'Musk', 'Vanilla'],
      desc: 'Cool aquatic freshness with icy mint and kiwi, made for hot days.',
      seasons: ['spring', 'summer'], added: Date.now(),
    },
  ];
}
