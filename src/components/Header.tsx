import type { ChangeEvent } from 'react';
import Glass from './Glass';

interface HeaderProps {
  onExport: () => void;
  onImport: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Header({ onExport, onImport }: HeaderProps) {
  return (
    <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 400, margin: 0, lineHeight: 1.05 }}>Spritz</h1>
        <p className="muted" style={{ margin: '5px 0 0', fontSize: 13 }}>your scent shelf</p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Glass variant="chrome" title="Export backup (JSON)" label="Export backup" onClick={onExport} style={{ width: 40 }} contentStyle={{ height: 40 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </Glass>
        <Glass variant="chrome" title="Import backup (JSON)" label="Import backup" onClick={() => { const el = document.getElementById('spritz-import') as HTMLInputElement | null; if (el) { el.value = ''; el.click(); } }} style={{ width: 40 }} contentStyle={{ height: 40 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </Glass>
        <input type="file" id="spritz-import" accept="application/json,.json" onChange={onImport} style={{ display: 'none' }} />
      </div>
    </header>
  );
}
