import { useReducer } from 'react';
import type { ChangeEvent, MutableRefObject } from 'react';
import type { Draft, Season } from '../types';
import Glass from './Glass';

interface PerfumeFormProps {
  draftRef: MutableRefObject<Draft>;
  editing: boolean;
  error: string;
  onSave: () => void;
  onClose: () => void;
}

const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter'];

/** Uncontrolled form over a mutable draft (the parent remounts it per open via a key). */
export default function PerfumeForm({ draftRef, editing, error, onSave, onClose }: PerfumeFormProps) {
  const [, force] = useReducer((x: number) => x + 1, 0);
  const draft = draftRef.current;

  const onField = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof Draft;
    (draft as unknown as Record<string, unknown>)[name] = e.target.value;
    if (name === 'fill') force();
  };

  const pickPhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 512;
        const sc = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * sc);
        c.height = Math.round(img.height * sc);
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        draft.photo = c.toDataURL('image/jpeg', 0.82);
        force();
      };
      img.src = r.result as string;
    };
    r.readAsDataURL(f);
  };

  return (
    <div className="overlay" style={{ zIndex: 60 }} role="dialog" aria-label={editing ? 'Edit perfume' : 'New perfume'}>
      <div className="overlay-col">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 400, margin: 0 }}>{editing ? 'Edit perfume' : 'New perfume'}</h2>
          <Glass variant="chrome" label="Close" onClick={onClose} style={{ width: 38 }} contentStyle={{ height: 38, fontSize: 15 }}>✕</Glass>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="lbl">Name *</label>
            <input name="name" className="inp" defaultValue={draft.name} onChange={onField} placeholder="e.g. Lion" />
          </div>
          <div>
            <label className="lbl">Brand</label>
            <input name="brand" className="inp" defaultValue={draft.brand} onChange={onField} placeholder="e.g. Rayhaan" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <label className="lbl">Type</label>
              <select name="conc" className="inp" defaultValue={draft.conc} onChange={onField}>
                <option value="EDC">EDC</option>
                <option value="EDT">EDT</option>
                <option value="EDP">EDP</option>
                <option value="Parfum">Parfum</option>
                <option value="Oil">Oil</option>
              </select>
            </div>
            <div>
              <label className="lbl">Size (ml) *</label>
              <input name="ml" type="number" inputMode="numeric" className="inp" defaultValue={draft.ml} onChange={onField} style={{ paddingInline: 14 }} />
            </div>
            <div>
              <label className="lbl">Price</label>
              <input name="price" type="number" inputMode="decimal" className="inp" defaultValue={draft.price} onChange={onField} placeholder="$" style={{ paddingInline: 14 }} />
            </div>
          </div>

          <div>
            <label className="lbl">
              How full is it? <span style={{ color: 'var(--color-accent-700)' }}>{draft.fill || 100}% full</span>
            </label>
            <input name="fill" type="range" min={5} max={100} step={5} defaultValue={draft.fill} onChange={onField} style={{ width: '100%' }} />
          </div>

          <div>
            <label className="lbl" style={{ marginBottom: 6 }}>Best seasons</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SEASONS.map(s => {
                const on = (draft.seasons || []).includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    className={`chip ${on ? 'chip-on' : ''}`}
                    style={{ fontSize: 13, fontWeight: 700 }}
                    onClick={() => {
                      const ss = draft.seasons || [];
                      draft.seasons = on ? ss.filter(x => x !== s) : [...ss, s];
                      force();
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="lbl">Top notes <span style={{ fontWeight: 400 }}>(comma separated)</span></label>
            <input name="top" className="inp" defaultValue={draft.top} onChange={onField} placeholder="Bergamot, Pineapple" />
          </div>
          <div>
            <label className="lbl">Heart notes</label>
            <input name="heart" className="inp" defaultValue={draft.heart} onChange={onField} placeholder="Jasmine, Patchouli" />
          </div>
          <div>
            <label className="lbl">Base notes</label>
            <input name="base" className="inp" defaultValue={draft.base} onChange={onField} placeholder="Musk, Vanilla" />
          </div>
          <div>
            <label className="lbl">Description</label>
            <textarea name="desc" className="inp" defaultValue={draft.desc} onChange={onField} rows={3} placeholder="How it smells, when you reach for it…" style={{ padding: '12px 16px' }} />
          </div>

          <div>
            <label className="lbl" style={{ marginBottom: 6 }}>Bottle photo <span style={{ fontWeight: 400 }}>(optional)</span></label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {draft.photo && (
                <div className="washed" style={{ width: 56, height: 56, borderRadius: 999, flex: 'none', backgroundImage: `url('${draft.photo}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              )}
              <label className="gc-chrome" style={{ fontWeight: 700, fontSize: 13, borderRadius: 999, padding: '10px 16px', cursor: 'pointer', backdropFilter: 'blur(4px) saturate(1.5)', boxShadow: '0 4px 12px rgba(32,30,29,.12), inset 0 1.5px 1px rgba(255,255,255,.8), inset 0 -1.5px 3px rgba(32,30,29,.08)' }}>
                Choose photo
                <input type="file" accept="image/*" onChange={pickPhoto} style={{ display: 'none' }} />
              </label>
              {draft.photo && (
                <button type="button" className="linkbtn" onClick={() => { draft.photo = null; force(); }}>remove</button>
              )}
            </div>
          </div>

          {error && (
            <div style={{ background: 'var(--color-accent-100)', color: 'var(--color-accent-900)', borderRadius: 'var(--radius-md, 14px)', padding: '11px 14px', fontSize: 13 }}>{error}</div>
          )}

          <Glass variant="primary" onClick={onSave} style={{ marginTop: 4 }} contentStyle={{ height: 51, fontSize: 15 }}>
            {editing ? 'Save changes' : 'Add to shelf'}
          </Glass>
        </div>
      </div>
    </div>
  );
}
