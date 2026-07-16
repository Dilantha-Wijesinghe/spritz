import { liquidColor } from '../lib/perfume';

interface BottleGlyphProps {
  /** Remaining percentage 0..100 shown as the liquid level. */
  fillPct: number;
  hue: number;
  size?: 'card' | 'detail';
}

/** The CSS-drawn perfume bottle: cap, neck, body, animated liquid. */
export default function BottleGlyph({ fillPct, hue, size = 'card' }: BottleGlyphProps) {
  const d = size === 'detail';
  const dims = d
    ? { w: 64, h: 100, capW: 22, capH: 15, neckW: 14, neckH: 8, body: 77, radius: '16px 16px 20px 20px', bodyBg: 'var(--color-neutral-100)' }
    : { w: 46, h: 72, capW: 16, capH: 11, neckW: 10, neckH: 6, body: 55, radius: '12px 12px 15px 15px', bodyBg: 'var(--color-bg)' };

  return (
    <div style={{ width: dims.w, height: dims.h, position: 'relative', flex: 'none' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: dims.capW, height: dims.capH, background: 'var(--color-neutral-700)', borderRadius: d ? '6px 6px 3px 3px' : '5px 5px 2px 2px' }} />
      <div style={{ position: 'absolute', top: dims.capH, left: '50%', transform: 'translateX(-50%)', width: dims.neckW, height: dims.neckH, background: 'var(--color-neutral-400)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: dims.body, background: dims.bodyBg, border: '2px solid var(--color-neutral-300)', borderRadius: dims.radius, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${fillPct}%`, background: liquidColor(hue), transition: 'height .6s ease' }} />
      </div>
    </div>
  );
}
