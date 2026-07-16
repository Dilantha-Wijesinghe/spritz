import { LOW_PCT } from '../config';
import { capacity, isEmpty, isLow, percentLeft, remaining } from '../lib/perfume';
import type { Perfume, Wear } from '../types';
import BottleGlyph from './BottleGlyph';
import Button from './Button';
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
          return (
            <Glass
              key={p.id}
              as="div"
              variant="card"
              corner={28}
              contentClassName="shelf-card"
            >
              <Button variant="card-action" onClick={() => onOpen(p.id)} aria-label={`View details for ${p.name}`}>
                <BottleGlyph fillPct={pc} hue={p.hue} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17, lineHeight: 1.2 }}>{p.name}</span>
                    <span className="badge badge-conc">{p.conc}</span>
                    {isLow(p, wears) && <span className="badge badge-low">running low</span>}
                    {isEmpty(p, wears) && <span className="badge badge-empty">empty</span>}
                  </div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{p.brand || 'Brand unavailable'}</div>
                  <div className="fill-track" style={{ marginTop: 12 }}>
                    <div className="fill-level" style={{ width: `${pc}%`, background: pc <= LOW_PCT ? 'var(--color-accent)' : 'var(--color-accent-2-500)' }} />
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
                    {rem} of {cap} sprays left
                  </div>
                </div>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onLog(p.id)}
                aria-label={`Log a wear for ${p.name}`}
                className="shelf-spritz"
              >
                Spritz
              </Button>
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
      <Button variant="primary" onClick={onAdd} className="shelf-add-fab" aria-label="Add a perfume" title="Add a perfume">
        <span aria-hidden="true">+</span>
      </Button>
    </section>
  );
}
