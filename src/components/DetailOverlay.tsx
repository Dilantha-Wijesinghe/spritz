import { capacity, emptyEstimate, lastWorn, money, percentLeft, remaining } from '../lib/perfume';
import { fmtDate } from '../lib/dates';
import type { Perfume, Wear } from '../types';
import BottleGlyph from './BottleGlyph';
import Button from './Button';
import Glass from './Glass';

interface DetailOverlayProps {
  perfume: Perfume;
  wears: Wear[];
  onClose: () => void;
  onWear: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DetailOverlay({ perfume: p, wears, onClose, onWear, onEdit, onDelete }: DetailOverlayProps) {
  const rem = remaining(p, wears);
  const pc = percentLeft(p, wears);
  const worn = wears.filter(w => w.pid === p.id);
  const lw = lastWorn(wears, p.id);
  const est = emptyEstimate(p, wears);

  const stats: Array<[string, string]> = [
    ['Sprays left', `${rem} / ${capacity(p)}`],
    ['Bottle', `${pc}% full`],
    ['Times worn', String(worn.length)],
    ['Cost per wear', p.price > 0 && worn.length ? money(p.price / worn.length) : '—'],
    ['Last worn', lw ? fmtDate(lw) : 'never'],
    ['Empty around', est ? `~${est}` : '—'],
  ];

  const noteRows = ([['Top', p.top], ['Heart', p.heart], ['Base', p.base]] as Array<[string, string[]]>)
    .filter(([, list]) => list && list.length);

  return (
    <div className="overlay" role="dialog" aria-label="Perfume detail">
      <div className="overlay-col">
        <Glass variant="chrome" label="Back to shelf" onClick={onClose} style={{ width: 40, marginBottom: 18 }} contentStyle={{ height: 40, fontSize: 19 }}>
          ←
        </Glass>

        <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 16 }}>
          <BottleGlyph fillPct={pc} hue={p.hue} size="detail" />
          {p.photo && (
            <div className="washed" style={{ width: 96, height: 96, borderRadius: 999, flex: 'none', backgroundImage: `url('${p.photo}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 400, margin: 0, lineHeight: 1.15 }}>{p.name}</h2>
            <div className="muted" style={{ fontSize: 14, marginTop: 3 }}>{p.brand || '—'}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              <span className="badge badge-conc" style={{ padding: '3px 10px' }}>{p.conc}</span>
              <span className="badge badge-empty" style={{ padding: '3px 10px' }}>{p.ml} ml</span>
              {p.seasons.length > 0 && <span className="badge badge-low" style={{ padding: '3px 10px' }}>{p.seasons.join(' · ')}</span>}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          {stats.map(([k, v]) => (
            <Glass key={k} as="div" variant="row" corner={14} blurAmount={0.25} displacementScale={20} contentStyle={{ display: 'block', padding: '12px 14px', textAlign: 'left' }}>
              <div className="kicker" style={{ letterSpacing: '.06em' }}>{k}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, marginTop: 3 }}>{v}</div>
            </Glass>
          ))}
        </div>

        {noteRows.length > 0 && (
          <div style={{ marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {noteRows.map(([layer, list]) => (
              <div key={layer} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span className="kicker" style={{ color: 'var(--color-accent-2-800)', letterSpacing: '.06em', width: 44, flex: 'none' }}>{layer}</span>
                <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--color-neutral-800)' }}>{list.join(' · ')}</span>
              </div>
            ))}
          </div>
        )}

        {p.desc && <p className="muted" style={{ fontSize: 14, lineHeight: 1.6, margin: '0 0 22px' }}>{p.desc}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="primary" size="lg" block onClick={onWear}>Log a wear</Button>
          <Button variant="secondary" size="lg" block onClick={onEdit}>Edit details</Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            style={{ alignSelf: 'center' }}
          >
            Remove from shelf
          </Button>
        </div>
      </div>
    </div>
  );
}
