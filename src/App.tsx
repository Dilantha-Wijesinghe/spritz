import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { DEFAULT_SPRAYS } from './config';
import { todayIso } from './lib/dates';
import { parseNotes } from './lib/perfume';
import { loadState, saveState, seed, uid } from './lib/store';
import type { Draft, Perfume, Tab, Wear } from './types';
import DetailOverlay from './components/DetailOverlay';
import Header from './components/Header';
import HistoryTab from './components/HistoryTab';
import LogSheet from './components/LogSheet';
import NotesTab from './components/NotesTab';
import PerfumeForm from './components/PerfumeForm';
import ShelfTab from './components/ShelfTab';
import TabBar from './components/TabBar';
import TodayTab from './components/TodayTab';

const emptyDraft = (): Draft => ({
  name: '', brand: '', conc: 'EDP', ml: 100, price: '', fill: 100,
  seasons: [], top: '', heart: '', base: '', desc: '', photo: null,
});

export default function App() {
  const [perfumes, setPerfumes] = useState<Perfume[] | null>(null);
  const [wears, setWears] = useState<Wear[]>([]);
  const [tab, setTab] = useState<Tab>('shelf');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [formError, setFormError] = useState('');
  const [logId, setLogId] = useState<string | null>(null);
  const [logSprays, setLogSprays] = useState(DEFAULT_SPRAYS);
  const [logDate, setLogDate] = useState('');
  const [noteFilter, setNoteFilter] = useState<string | null>(null);
  const [calOff, setCalOff] = useState(0);
  const [daySel, setDaySel] = useState<string | null>(null);
  const draftRef = useRef<Draft>(emptyDraft());

  useEffect(() => {
    const d = loadState();
    if (d) {
      setPerfumes(d.perfumes);
      setWears(d.wears);
    } else {
      setPerfumes(seed());
    }
  }, []);

  useEffect(() => {
    if (perfumes !== null) saveState(perfumes, wears);
  }, [perfumes, wears]);

  const ps = perfumes ?? [];
  const detail = ps.find(p => p.id === detailId) ?? null;
  const logPerfume = ps.find(p => p.id === logId) ?? null;

  const openLog = (id: string) => {
    setLogId(id);
    setLogSprays(DEFAULT_SPRAYS);
    setLogDate(todayIso());
  };

  const openAdd = () => {
    draftRef.current = emptyDraft();
    setEditId(null);
    setFormError('');
    setFormKey(k => k + 1);
    setFormOpen(true);
  };

  const openEdit = (p: Perfume) => {
    draftRef.current = {
      name: p.name, brand: p.brand, conc: p.conc, ml: p.ml, price: p.price || '',
      fill: Math.round((p.fill ?? 1) * 100), seasons: [...(p.seasons || [])],
      top: (p.top || []).join(', '), heart: (p.heart || []).join(', '), base: (p.base || []).join(', '),
      desc: p.desc || '', photo: p.photo || null,
    };
    setEditId(p.id);
    setFormError('');
    setFormKey(k => k + 1);
    setFormOpen(true);
  };

  const saveForm = () => {
    const d = draftRef.current;
    if (!String(d.name).trim()) {
      setFormError('Give it a name.');
      return;
    }
    const ml = parseFloat(String(d.ml));
    if (!ml || ml <= 0) {
      setFormError('Size needs to be a number of ml.');
      return;
    }
    const rec = {
      name: String(d.name).trim(),
      brand: String(d.brand).trim(),
      conc: d.conc || 'EDP',
      ml,
      price: parseFloat(String(d.price)) || 0,
      fill: Math.min(100, Math.max(5, Math.round(Number(d.fill)) || 100)) / 100,
      seasons: d.seasons || [],
      top: parseNotes(d.top),
      heart: parseNotes(d.heart),
      base: parseNotes(d.base),
      desc: String(d.desc || '').trim(),
      photo: d.photo || null,
    };
    setPerfumes(prev => {
      const cur = prev ?? [];
      return editId
        ? cur.map(p => (p.id === editId ? { ...p, ...rec } : p))
        : [...cur, { id: uid(), hue: cur.length, added: Date.now(), ...rec }];
    });
    setFormOpen(false);
  };

  const saveLog = () => {
    if (!logId) return;
    setWears(prev => [...prev, { id: uid(), pid: logId, date: logDate || todayIso(), sprays: logSprays, ts: Date.now() }]);
    setLogId(null);
  };

  const deleteWear = (w: Wear) => setWears(prev => prev.filter(x => x.id !== w.id));

  const deletePerfume = (p: Perfume) => {
    if (window.confirm(`Remove ${p.name} and its wear history?`)) {
      setPerfumes(prev => (prev ?? []).filter(x => x.id !== p.id));
      setWears(prev => prev.filter(w => w.pid !== p.id));
      setDetailId(null);
    }
  };

  const doExport = () => {
    const blob = new Blob(
      [JSON.stringify({ app: 'spritz', exported: new Date().toISOString(), perfumes: ps, wears }, null, 2)],
      { type: 'application/json' },
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'spritz-backup.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  };

  const doImport = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result as string);
        if (!Array.isArray(d.perfumes)) throw new Error('bad');
        setPerfumes(d.perfumes);
        setWears(Array.isArray(d.wears) ? d.wears : []);
        alert(`Imported ${d.perfumes.length} perfumes.`);
      } catch {
        alert("That file doesn't look like a Spritz backup.");
      }
    };
    r.readAsText(f);
  };

  return (
    <div className="app">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="grain" />

      <div className="col">
        <Header onExport={doExport} onImport={doImport} />

        {tab === 'shelf' && (
          <ShelfTab perfumes={ps} wears={wears} loaded={perfumes !== null} onOpen={setDetailId} onLog={openLog} onAdd={openAdd} />
        )}
        {tab === 'today' && <TodayTab perfumes={ps} wears={wears} onLog={openLog} />}
        {tab === 'history' && (
          <HistoryTab
            perfumes={ps}
            wears={wears}
            calOff={calOff}
            daySel={daySel}
            onCalOff={setCalOff}
            onDaySel={setDaySel}
            onDeleteWear={deleteWear}
          />
        )}
        {tab === 'notes' && (
          <NotesTab
            perfumes={ps}
            noteFilter={noteFilter}
            onFilter={setNoteFilter}
            onOpen={id => { setDetailId(id); setTab('shelf'); }}
          />
        )}

        <TabBar tab={tab} onSelect={t => { setTab(t); setDaySel(null); }} />

        {detail && (
          <DetailOverlay
            perfume={detail}
            wears={wears}
            onClose={() => setDetailId(null)}
            onWear={() => openLog(detail.id)}
            onEdit={() => openEdit(detail)}
            onDelete={() => deletePerfume(detail)}
          />
        )}

        {formOpen && (
          <PerfumeForm
            key={formKey}
            draftRef={draftRef}
            editing={!!editId}
            error={formError}
            onSave={saveForm}
            onClose={() => setFormOpen(false)}
          />
        )}

        {logPerfume && (
          <LogSheet
            perfume={logPerfume}
            wears={wears}
            sprays={logSprays}
            date={logDate}
            onSprays={setLogSprays}
            onDate={setLogDate}
            onSave={saveLog}
            onClose={() => setLogId(null)}
          />
        )}
      </div>
    </div>
  );
}
