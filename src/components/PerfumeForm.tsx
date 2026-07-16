import { useReducer, useRef } from 'react';
import type { ChangeEvent, MutableRefObject } from 'react';
import type { Draft, Season } from '../types';
import Button from './Button';

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
  const photoInputRef = useRef<HTMLInputElement>(null);
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
          <Button variant="icon" aria-label="Close" onClick={onClose}>✕</Button>
        </div>

        <div className="perfume-form-fields" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
              <input name="price" type="number" inputMode="decimal" className="inp" defaultValue={draft.price} onChange={onField} placeholder="LKR" style={{ paddingInline: 14 }} />
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
                  <Button
                    key={s}
                    variant="chip"
                    size="sm"
                    active={on}
                    aria-pressed={on}
                    onClick={() => {
                      const ss = draft.seasons || [];
                      draft.seasons = on ? ss.filter(x => x !== s) : [...ss, s];
                      force();
                    }}
                  >
                    {s}
                  </Button>
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
              <Button
                variant="secondary"
                onClick={() => {
                  if (photoInputRef.current) {
                    photoInputRef.current.value = '';
                    photoInputRef.current.click();
                  }
                }}
              >
                Choose photo
              </Button>
              <input ref={photoInputRef} type="file" accept="image/*" onChange={pickPhoto} style={{ display: 'none' }} />
              {draft.photo && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => { draft.photo = null; force(); }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div style={{ background: 'var(--color-accent-100)', color: 'var(--color-accent-900)', borderRadius: 'var(--radius-md, 14px)', padding: '11px 14px', fontSize: 13 }}>{error}</div>
          )}

          <Button variant="primary" size="lg" block onClick={onSave} style={{ marginTop: 4 }}>
            {editing ? 'Save changes' : 'Add to shelf'}
          </Button>
        </div>
      </div>
    </div>
  );
}
