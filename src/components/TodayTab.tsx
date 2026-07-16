import { LOW_PCT } from '../config';
import { fmtDate } from '../lib/dates';
import { emptyEstimate, percentLeft, remaining, todaysPick } from '../lib/perfume';
import type { Perfume, Wear } from '../types';
import BottleGlyph from './BottleGlyph';
import Button from './Button';
import Glass from './Glass';

interface TodayTabProps {
  perfumes: Perfume[];
  wears: Wear[];
  onLog: (id: string) => void;
}

export default function TodayTab({ perfumes, wears, onLog }: TodayTabProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const pick = todaysPick(perfumes, wears);

  const alerts = perfumes
    .filter(p => percentLeft(p, wears) <= LOW_PCT)
    .map(p => {
      const rem = remaining(p, wears);
      const est = emptyEstimate(p, wears);
      return {
        id: p.id,
        text: rem <= 0
          ? `${p.name} is empty — time for a new bottle.`
          : `${p.name} is running low: ${rem} sprays (${percentLeft(p, wears)}%) left${est ? `, should last until ~${est}` : ''}.`,
      };
    });

  const pname = (pid: string) => perfumes.find(x => x.id === pid)?.name ?? 'Unknown';
  const recent = [...wears]
    .sort((a, b) => b.date.localeCompare(a.date) || (b.ts || 0) - (a.ts || 0))
    .slice(0, 6);

  return (
    <section aria-label="Today">
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 400, margin: 0 }}>{greeting}</h2>
      <p className="muted" style={{ margin: '4px 0 18px', fontSize: 13 }}>{dateLabel}</p>

      {pick && (
        <Glass as="div" variant="pick" corner={28} blurAmount={0.35} displacementScale={28} contentStyle={{ display: 'block', padding: 18, textAlign: 'left' }}>
          <div className="kicker" style={{ color: 'var(--color-accent-2-800)', marginBottom: 12 }}>Today’s pick</div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <BottleGlyph fillPct={percentLeft(pick.perfume, wears)} hue={pick.perfume.hue} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 19 }}>{pick.perfume.name}</div>
              <div className="muted" style={{ fontSize: 13 }}>{pick.perfume.brand}</div>
            </div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.5, margin: '14px 0', color: 'var(--color-accent-2-900)' }}>{pick.reason}</p>
          <Button variant="primary" onClick={() => onLog(pick.perfume.id)} style={{ width: 170 }}>
            Wear this today
          </Button>
        </Glass>
      )}

      {alerts.length > 0 && (
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alerts.map(a => (
            <div key={a.id} style={{ background: 'var(--color-accent-100)', color: 'var(--color-accent-900)', borderRadius: 'var(--radius-md, 14px)', padding: '12px 14px', fontSize: 13, lineHeight: 1.45 }}>
              {a.text}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <div className="kicker" style={{ marginBottom: 10 }}>Recently worn</div>
        {recent.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recent.map(w => (
              <Glass key={w.id} as="div" variant="row" corner={14} blurAmount={0.25} displacementScale={20} contentStyle={{ padding: '11px 14px', gap: 10, justifyContent: 'flex-start' }}>
                <span className="muted" style={{ fontSize: 12, width: 52, flex: 'none', textAlign: 'left' }}>{fmtDate(w.date)}</span>
                <span style={{ fontSize: 14, flex: 1, minWidth: 0, textAlign: 'left' }}>{pname(w.pid)}</span>
                <span className="muted" style={{ fontSize: 12 }}>{w.sprays} sprays</span>
              </Glass>
            ))}
          </div>
        ) : (
          <div className="muted" style={{ fontSize: 13 }}>Nothing logged yet — hit Spritz on a bottle when you wear it.</div>
        )}
      </div>
    </section>
  );
}
