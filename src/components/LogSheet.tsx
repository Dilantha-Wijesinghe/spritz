import { remaining } from '../lib/perfume';
import type { Perfume, Wear } from '../types';
import Button from './Button';
import Glass from './Glass';

interface LogSheetProps {
  perfume: Perfume;
  wears: Wear[];
  sprays: number;
  date: string;
  onSprays: (n: number) => void;
  onDate: (iso: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function LogSheet({ perfume, wears, sprays, date, onSprays, onDate, onSave, onClose }: LogSheetProps) {
  const after = Math.max(0, remaining(perfume, wears) - sprays);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <Glass as="div" variant="sheet" corner={24} className="sheet-slot" contentStyle={{ borderRadius: '24px 24px 0 0' }}>
        <div role="dialog" aria-label="Log a wear" style={{ width: '100%' }}>
          <div className="kicker" style={{ marginBottom: 4 }}>Log a wear</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, marginBottom: 16 }}>
            {perfume.name}{perfume.brand ? `, ${perfume.brand}` : ''}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 14 }}>
            <Button variant="stepper" size="lg" aria-label="Fewer sprays" onClick={() => onSprays(Math.max(1, sprays - 1))}>−</Button>
            <div style={{ textAlign: 'center', minWidth: 80 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 40, lineHeight: 1 }}>{sprays}</div>
              <div className="muted" style={{ fontSize: 12 }}>sprays</div>
            </div>
            <Button variant="stepper" size="lg" aria-label="More sprays" onClick={() => onSprays(Math.min(20, sprays + 1))}>+</Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <label className="lbl" style={{ margin: 0 }}>On</label>
            <input type="date" className="inp" value={date} onChange={e => onDate(e.target.value)} style={{ flex: 1, padding: '9px 14px' }} />
          </div>

          <div className="muted" style={{ fontSize: 12, textAlign: 'center', marginBottom: 14 }}>
            ≈ {after} sprays will remain
          </div>

          <Button variant="primary" size="lg" block onClick={onSave}>Save</Button>
        </div>
      </Glass>
    </>
  );
}
