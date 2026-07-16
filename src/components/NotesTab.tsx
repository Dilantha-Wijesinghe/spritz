import type { NoteLayer, Perfume } from '../types';
import Glass from './Glass';

interface NotesTabProps {
  perfumes: Perfume[];
  noteFilter: string | null;
  onFilter: (note: string | null) => void;
  onOpen: (id: string) => void;
}

export default function NotesTab({ perfumes, noteFilter, onFilter, onOpen }: NotesTabProps) {
  const noteMap: Record<string, { count: number; per: Record<string, NoteLayer[]> }> = {};
  perfumes.forEach(p => {
    (['top', 'heart', 'base'] as const).forEach(layer => {
      (p[layer] || []).forEach(n => {
        if (!noteMap[n]) noteMap[n] = { count: 0, per: {} };
        noteMap[n].count++;
        if (!noteMap[n].per[p.id]) noteMap[n].per[p.id] = [];
        noteMap[n].per[p.id].push(layer);
      });
    });
  });

  const chips = Object.keys(noteMap).sort((a, b) => noteMap[b].count - noteMap[a].count || a.localeCompare(b));
  const matches = noteFilter && noteMap[noteFilter]
    ? Object.keys(noteMap[noteFilter].per)
        .map(pid => {
          const p = perfumes.find(x => x.id === pid);
          return p ? { p, layers: noteMap[noteFilter].per[pid].join(' + ') } : null;
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
    : [];

  return (
    <section aria-label="Notes">
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 400, margin: '0 0 6px' }}>Notes explorer</h2>
      <p className="muted" style={{ margin: '0 0 16px', fontSize: 13 }}>Every note across your shelf. Tap one to see where it lives.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {chips.map(n => {
          const active = noteFilter === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onFilter(active ? null : n)}
              style={{
                border: `2px solid ${active ? 'var(--color-accent-2-700)' : 'var(--color-neutral-300)'}`,
                background: active ? 'var(--color-accent-2-700)' : 'var(--color-neutral-100)',
                color: active ? 'var(--color-accent-2-100)' : 'var(--color-neutral-800)',
                borderRadius: 999, padding: '7px 14px', cursor: 'pointer',
                fontSize: 12 + Math.min(noteMap[n].count, 4) * 1.5,
              }}
            >
              {n}
            </button>
          );
        })}
      </div>

      {noteFilter && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div className="kicker">Wearing {noteFilter}</div>
            <button type="button" className="linkbtn" onClick={() => onFilter(null)}>clear</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {matches.map(({ p, layers }) => (
              <Glass key={p.id} as="div" variant="row" corner={14} blurAmount={0.25} displacementScale={20} onClick={() => onOpen(p.id)} contentStyle={{ padding: '12px 14px', gap: 10, justifyContent: 'flex-start', cursor: 'pointer' }}>
                <span style={{ fontSize: 14, flex: 1, minWidth: 0, textAlign: 'left' }}>{p.name} — {p.brand}</span>
                <span style={{ fontSize: 12, color: 'var(--color-accent-2-800)', background: 'var(--color-accent-2-100)', borderRadius: 999, padding: '2px 10px' }}>{layers}</span>
              </Glass>
            ))}
          </div>
        </div>
      )}

      {chips.length === 0 && (
        <div className="muted" style={{ fontSize: 13 }}>Add perfumes with notes to grow this garden.</div>
      )}
    </section>
  );
}
