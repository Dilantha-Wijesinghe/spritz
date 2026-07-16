import { fmtDate, todayIso } from '../lib/dates';
import type { Perfume, Wear } from '../types';
import Button from './Button';
import Glass from './Glass';

interface HistoryTabProps {
  perfumes: Perfume[];
  wears: Wear[];
  calOff: number;
  daySel: string | null;
  onCalOff: (n: number) => void;
  onDaySel: (iso: string | null) => void;
  onDeleteWear: (w: Wear) => void;
}

interface DayCell {
  key: string;
  n: number | '';
  iso?: string;
  worn: boolean;
  sel: boolean;
  isToday: boolean;
}

export default function HistoryTab({ perfumes, wears, calOff, daySel, onCalOff, onDaySel, onDeleteWear }: HistoryTabProps) {
  const today = todayIso();
  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + calOff);
  const y = base.getFullYear();
  const m = base.getMonth();
  const calLabel = base.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const startDow = (new Date(y, m, 1).getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const wearByDate: Record<string, number> = {};
  wears.forEach(w => { wearByDate[w.date] = (wearByDate[w.date] || 0) + w.sprays; });

  const cells: DayCell[] = [];
  for (let i = 0; i < startDow; i++) cells.push({ key: `pad-${i}`, n: '', worn: false, sel: false, isToday: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ key: iso, n: d, iso, worn: !!wearByDate[iso], sel: daySel === iso, isToday: iso === today });
  }
  while (cells.length % 7) cells.push({ key: `tail-${cells.length}`, n: '', worn: false, sel: false, isToday: false });

  const dayEntries = daySel ? wears.filter(w => w.date === daySel) : [];
  const pname = (pid: string) => perfumes.find(x => x.id === pid)?.name ?? 'Unknown';

  const arrowProps = { variant: 'chrome' as const, style: { width: 38 }, contentStyle: { height: 38, fontSize: 16 } };

  return (
    <section aria-label="History">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <Glass {...arrowProps} label="Previous month" onClick={() => { onCalOff(calOff - 1); onDaySel(null); }}>←</Glass>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 400, margin: 0 }}>{calLabel}</h2>
        <Glass {...arrowProps} label="Next month" onClick={() => { onCalOff(calOff + 1); onDaySel(null); }}>→</Glass>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 6 }}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="muted" style={{ textAlign: 'center', fontSize: 11, fontWeight: 700 }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
        {cells.map(c => c.iso ? (
          <Button
            key={c.key}
            variant="day"
            active={c.sel}
            aria-pressed={c.sel}
            aria-current={c.isToday ? 'date' : undefined}
            aria-label={`${c.iso}${c.worn ? ', perfume worn' : ''}`}
            onClick={() => onDaySel(c.sel ? null : c.iso!)}
            className={`${c.isToday && !c.sel ? 'is-today' : ''} ${c.worn ? 'is-worn' : ''}`}
          >
            <span style={{ fontSize: 14 }}>{c.n}</span>
            {c.worn && !c.sel && <span className="day-dot" />}
          </Button>
        ) : <div key={c.key} aria-hidden="true" />)}
      </div>

      {daySel && (
        <div style={{ marginTop: 18 }}>
          <div className="kicker" style={{ marginBottom: 10 }}>{fmtDate(daySel)}</div>
          {dayEntries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dayEntries.map(w => (
                <Glass key={w.id} as="div" variant="row" corner={14} blurAmount={0.25} displacementScale={20} contentStyle={{ padding: '11px 14px', gap: 10, justifyContent: 'flex-start' }}>
                  <span style={{ fontSize: 14, flex: 1, minWidth: 0, textAlign: 'left' }}>{pname(w.pid)}</span>
                  <span className="muted" style={{ fontSize: 12 }}>{w.sprays} sprays</span>
                  <Button
                    variant="danger"
                    size="sm"
                    title="Remove entry"
                    aria-label="Remove entry"
                    onClick={() => onDeleteWear(w)}
                    className="button-icon-danger"
                  >
                    ✕
                  </Button>
                </Glass>
              ))}
            </div>
          ) : (
            <div className="muted" style={{ fontSize: 13 }}>No sprays logged this day.</div>
          )}
        </div>
      )}
    </section>
  );
}
