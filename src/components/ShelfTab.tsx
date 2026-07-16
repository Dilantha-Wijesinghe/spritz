import { LOW_PCT } from '../config';
import { capacity, emptyEstimate, isEmpty, isLow, percentLeft, remaining } from '../lib/perfume';
import type { Perfume, Wear } from '../types';
import BottleGlyph from './BottleGlyph';
import Glass from './Glass';

interface ShelfTabProps {
  perfumes: Perfume[];
  wears: Wear[];
  loaded: boolean;
  onOpen: (id: string) => void;
  onLog: (id: string) => void;
  onAdd: () => void;
}

export default function ShelfTab({ perfumes, wears, loaded, onOpen, onLog, onAdd }: ShelfTabProps) {
  return (
    <section aria-label="Shelf">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {perfumes.map(p => {
          const rem = remaining(p, wears);
          const cap = capacity(p);
          const pc = percentLeft(p, wears);
          const est = emptyEstimate(p, wears);
          return (
            <Glass
              key={p.id}
              as="div"
              variant="card"
              corner={28}
              blurAmount={0.35}
              displacementScale={28}
              onClick={() => onOpen(p.id)}
              contentClassName=""
              contentStyle={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer', justifyContent: 'flex-start', textAlign: 'left' }}
            >
              <BottleGlyph fillPct={pc} hue={p.hue} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17, lineHeight: 1.2 }}>{p.name}</span>
                  <span className="badge badge-conc">{p.conc}</span>
                  {isLow(p, wears) && <span className="badge badge-low">running low</span>}
                  {isEmpty(p, wears) && <span className="badge badge-empty">empty</span>}
                </div>
                <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{p.brand || '—'}</div>
                <div style={{ height: 8, background: 'var(--color-neutral-200)', borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pc}%`, background: pc <= LOW_PCT ? 'var(--color-accent)' : 'var(--color-accent-2-500)', borderRadius: 999, transition: 'width .6s ease' }} />
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                  {rem} of {cap} sprays left{est ? ` · empty ~${est}` : ''}
                </div>
              </div>
              <Glass
                variant="primary"
                onClick={e => { e.stopPropagation(); onLog(p.id); }}
                style={{ width: 76, flex: 'none' }}
                contentStyle={{ height: 38, fontSize: 13 }}
              >
                Spritz
              </Glass>
            </Glass>
          );
        })}
      </div>
      {loaded && perfumes.length === 0 && (
        <div className="muted" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, color: 'var(--color-text)', marginBottom: 8 }}>An empty shelf</div>
          <div style={{ fontSize: 14 }}>Add your first bottle below and start logging your sprays.</div>
        </div>
      )}
      <Glass variant="primary" onClick={onAdd} className="" style={{ marginTop: 16 }} contentStyle={{ height: 51, fontSize: 15 }}>
        + Add a perfume
      </Glass>
    </section>
  );
}
