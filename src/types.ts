export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type Concentration = 'EDC' | 'EDT' | 'EDP' | 'Parfum' | 'Oil';
export type Tab = 'shelf' | 'today' | 'history' | 'notes';
export type NoteLayer = 'top' | 'heart' | 'base';

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  conc: Concentration;
  ml: number;
  price: number;
  /** 0..1 — fraction of the bottle that was full when added/edited */
  fill: number;
  /** index into the liquid color cycle */
  hue: number;
  /** data-URL of the bottle photo, if any */
  photo: string | null;
  top: string[];
  heart: string[];
  base: string[];
  desc: string;
  seasons: Season[];
  added: number;
}

export interface Wear {
  id: string;
  pid: string;
  /** ISO date yyyy-mm-dd */
  date: string;
  sprays: number;
  ts: number;
}

/** Mutable working copy behind the add/edit form's uncontrolled inputs. */
export interface Draft {
  name: string;
  brand: string;
  conc: Concentration;
  ml: string | number;
  price: string | number;
  /** 5..100 — percent, unlike Perfume.fill */
  fill: number;
  seasons: Season[];
  top: string;
  heart: string;
  base: string;
  desc: string;
  photo: string | null;
}
