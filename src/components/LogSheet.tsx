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
      <div className="scrim" aria-hidden="true" onClick={onClose} />
      <Glass as="div" variant="sheet" corner={28} className="sheet-slot">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Log a wear"
          className="log-sheet"
          onKeyDown={event => {
            if (event.key === 'Escape') onClose();
          }}
        >
          <div className="sheet-handle" aria-hidden="true" />

          <div className="log-sheet-header">
            <div>
              <div className="kicker">Log a wear</div>
              <h2 className="log-sheet-title">
                {perfume.name}{perfume.brand ? `, ${perfume.brand}` : ''}
              </h2>
            </div>
            <Button variant="icon" aria-label="Close log drawer" onClick={onClose} autoFocus>✕</Button>
          </div>

          <div className="spray-picker">
            <Button variant="stepper" size="lg" aria-label="Fewer sprays" onClick={() => onSprays(Math.max(1, sprays - 1))}>−</Button>
            <div className="spray-count" aria-live="polite">
              <div className="spray-number">{sprays}</div>
              <div className="muted spray-unit">sprays</div>
            </div>
            <Button variant="stepper" size="lg" aria-label="More sprays" onClick={() => onSprays(Math.min(20, sprays + 1))}>+</Button>
          </div>

          <div className="log-date-row">
            <label className="lbl" htmlFor="log-wear-date">Date</label>
            <input id="log-wear-date" type="date" className="inp" value={date} onChange={e => onDate(e.target.value)} />
          </div>

          <div className="muted sprays-remaining">
            ≈ {after} sprays will remain
          </div>

          <Button variant="primary" size="lg" block onClick={onSave}>Save</Button>
        </div>
      </Glass>
    </>
  );
}
