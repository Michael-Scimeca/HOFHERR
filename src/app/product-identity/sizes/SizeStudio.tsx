'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { DEFAULT_SPECS, SHEETS, fitOnSheet, fmt, fromUnit, toUnit, type PrintSpec, type Unit } from './specs';
import s from './sizes.module.css';

const CARD_IN = 3.37; // ISO/IEC 7810 ID-1 credit card width — used to calibrate "actual size"
const PPI_KEY = 'hofherr-screen-ppi-v1';

function useScreenPpi() {
    const [ppi, setPpi] = useState(96);
    useEffect(() => {
        try {
            const v = Number(localStorage.getItem(PPI_KEY));
            if (v > 40 && v < 400) setPpi(v);
        } catch {
            /* ignore */
        }
    }, []);
    const save = (v: number) => {
        setPpi(v);
        try {
            localStorage.setItem(PPI_KEY, String(v));
        } catch {
            /* ignore */
        }
    };
    return [ppi, save] as const;
}

/** Item drawn at a given pixels-per-inch: trim line, bleed, safe area, art or dieline. */
function Proof({ spec, ppi, showGuides = true }: { spec: PrintSpec; ppi: number; showGuides?: boolean }) {
    const radius = spec.shape === 'circle' ? '50%' : spec.shape === 'rounded' ? `${0.125 * ppi}px` : '0';
    const b = spec.bleed * ppi;
    const vars = {
        '--proof-w': `${(spec.w + spec.bleed * 2) * ppi}px`,
        '--proof-h': `${(spec.h + spec.bleed * 2) * ppi}px`,
        '--proof-b': `${b}px`,
        '--proof-r': radius,
        '--proof-safe': `${0.125 * ppi}px`,
    } as React.CSSProperties;
    return (
        <div className={s.proof} style={vars}>
            {showGuides && b > 0 && <div className={s.bleed} />}
            <div className={s.trim}>
                {spec.art ? (
                    <img src={spec.art} alt="" className={s.art} />
                ) : (
                    <div className={s.dieline}>
                        <b>{spec.name}</b>
                        <span>
                            {fmt(spec.w, 'in')} × {fmt(spec.h, 'in')}
                        </span>
                    </div>
                )}
                {showGuides && <div className={s.safe} />}
            </div>
        </div>
    );
}

export default function SizeStudio({ embedded = false }: { embedded?: boolean }) {
    const [items, setItems] = useState<PrintSpec[]>(DEFAULT_SPECS);
    const [saved, setSaved] = useState<string>('');
    const [dirty, setDirty] = useState(false);
    const [selKey, setSelKey] = useState(DEFAULT_SPECS[0].key);
    const [unit, setUnit] = useState<Unit>('in');
    const [view, setView] = useState<'compare' | 'actual'>('compare');
    const [lock, setLock] = useState(true);
    const [ppi, setPpi] = useScreenPpi();
    const [calibrating, setCalibrating] = useState(false);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    const load = useCallback(async () => {
        const r = await fetch('/api/print-specs', { cache: 'no-store' });
        if (r.ok) {
            const d = await r.json();
            setItems(d.items);
            setSaved(JSON.stringify(d.items));
            setDirty(false);
        }
    }, []);
    useEffect(() => {
        void load();
    }, [load]);

    const sel = items.find((i) => i.key === selKey) ?? items[0];
    const groups = useMemo(() => Array.from(new Set(items.map((i) => i.group))), [items]);

    const update = (patch: Partial<PrintSpec>) => {
        setItems((list) => list.map((i) => (i.key === sel.key ? { ...i, ...patch } : i)));
        setDirty(true);
    };
    const setDim = (dim: 'w' | 'h', value: number) => {
        if (!(value > 0)) return;
        const inches = fromUnit(value, unit);
        if (lock) {
            const ratio = sel.h / sel.w;
            update(dim === 'w' ? { w: inches, h: inches * ratio } : { h: inches, w: inches / ratio });
        } else update({ [dim]: inches });
    };
    const resetItem = () => {
        const d = DEFAULT_SPECS.find((x) => x.key === sel.key);
        if (d) update(d);
    };
    const addCustom = () => {
        const key = `custom-${Date.now().toString(36)}`;
        setItems((l) => [
            ...l,
            { key, group: 'Custom', name: 'New printable item', w: 4, h: 6, bleed: 0.125, shape: 'rect' },
        ]);
        setSelKey(key);
        setDirty(true);
    };
    const removeCustom = () => {
        if (!sel.key.startsWith('custom-')) return;
        setItems((l) => l.filter((i) => i.key !== sel.key));
        setSelKey(items[0].key);
        setDirty(true);
    };
    const save = async () => {
        setBusy(true);
        setMsg(null);
        try {
            const r = await fetch('/api/print-specs', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
            });
            const d = await r.json();
            if (r.ok) {
                setItems(d.items);
                setSaved(JSON.stringify(d.items));
                setDirty(false);
                setMsg('Saved ✓ — everyone now sees these sizes.');
            } else {
                setMsg(d.error ?? 'Could not save.');
            }
        } finally {
            setBusy(false);
        }
    };

    const dpi300 = { w: Math.round((sel.w + sel.bleed * 2) * 300), h: Math.round((sel.h + sel.bleed * 2) * 300) };

    // compare view: everything drawn at one shared scale so the size relationship is honest
    const refs = [
        { name: 'Credit card', w: 3.37, h: 2.125 },
        { name: 'US Letter', w: 8.5, h: 11 },
    ];
    const tallest = Math.max(sel.h + sel.bleed * 2, 11);
    const compareScale = Math.min(380 / tallest, 760 / (sel.w + 8.5 + 3.37 + 4));

    const Wrapper = embedded ? 'section' : 'main';

    return (
        <Wrapper
            id={embedded ? 'print-sizes' : undefined}
            aria-labelledby={embedded ? 'print-sizes-heading' : undefined}
            className={s.page}
        >
            <header className={s.top}>
                <div>
                    {!embedded && (
                        <Link href="/product-identity" className={s.back}>
                            ← Product identity
                        </Link>
                    )}
                    {embedded ? (
                        <h2 id="print-sizes-heading" className={s.h1}>
                            Print Sizes &amp; Scale Studio
                        </h2>
                    ) : (
                        <h1 className={s.h1}>Print Sizes</h1>
                    )}
                    <p className={s.lead}>
                        Pick a printable item, set its finished size, and see it true to scale. Saved sizes are shared
                        with the whole team and used by <b>Print at this size</b>.
                    </p>
                </div>
                <div className={s.topActions}>
                    <div className={s.seg} role="group" aria-label="Units">
                        {(['in', 'cm', 'mm'] as Unit[]).map((u) => (
                            <button
                                key={u}
                                type="button"
                                className={unit === u ? s.segOn : ''}
                                onClick={() => setUnit(u)}
                            >
                                {u}
                            </button>
                        ))}
                    </div>
                    <button type="button" className={s.btnPrimary} disabled={!dirty || busy} onClick={save}>
                        {busy ? 'Saving…' : dirty ? 'Save sizes' : 'Saved'}
                    </button>
                </div>
            </header>
            {msg && <p className={s.msg}>{msg}</p>}

            <div className={s.layout}>
                {/* item list */}
                <nav className={s.list} aria-label="Printable items">
                    {groups.map((g) => (
                        <div key={g} className={s.group}>
                            <h2>{g}</h2>
                            {items
                                .filter((i) => i.group === g)
                                .map((i) => (
                                    <button
                                        key={i.key}
                                        type="button"
                                        className={i.key === sel.key ? s.itemOn : s.item}
                                        onClick={() => setSelKey(i.key)}
                                    >
                                        <span>{i.name}</span>
                                        <small>
                                            {fmt(i.w, unit)} × {fmt(i.h, unit)}
                                        </small>
                                    </button>
                                ))}
                        </div>
                    ))}
                    <button type="button" className={s.add} onClick={addCustom}>
                        + Add an item
                    </button>
                </nav>

                {/* editor */}
                <section id="print-size-editor" aria-label="Print size editor" className={s.editor}>
                    <div className={s.fields}>
                        <label className={s.wide}>
                            Name
                            <input value={sel.name} onChange={(e) => update({ name: e.target.value })} />
                        </label>
                        <label>
                            Width ({unit})
                            <input
                                type="number"
                                step={unit === 'mm' ? 1 : 0.0625}
                                min={0.1}
                                value={+toUnit(sel.w, unit).toFixed(4)}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    const v = raw ? Number(raw) : undefined;
                                    if (v !== undefined && !Number.isNaN(v)) setDim('w', v);
                                }}
                            />
                        </label>
                        <button
                            type="button"
                            className={lock ? s.lockOn : s.lock}
                            onClick={() => setLock(!lock)}
                            title="Keep proportions"
                        >
                            {lock ? '🔒' : '🔓'}
                        </button>
                        <label>
                            Height ({unit})
                            <input
                                type="number"
                                step={unit === 'mm' ? 1 : 0.0625}
                                min={0.1}
                                value={+toUnit(sel.h, unit).toFixed(4)}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    const v = raw ? Number(raw) : undefined;
                                    if (v !== undefined && !Number.isNaN(v)) setDim('h', v);
                                }}
                            />
                        </label>
                        <label>
                            Bleed ({unit})
                            <input
                                type="number"
                                step={unit === 'mm' ? 0.5 : 0.0625}
                                min={0}
                                value={+toUnit(sel.bleed, unit).toFixed(4)}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    const v = raw ? Number(raw) : undefined;
                                    if (v !== undefined && !Number.isNaN(v)) update({ bleed: fromUnit(Math.max(0, v), unit) });
                                }}
                            />
                        </label>
                        <label>
                            Shape
                            <select
                                value={sel.shape}
                                onChange={(e) => update({ shape: e.target.value as PrintSpec['shape'] })}
                            >
                                <option value="rect">Rectangle</option>
                                <option value="rounded">Rounded corners</option>
                                <option value="circle">Circle / oval</option>
                            </select>
                        </label>
                        <label className={s.wide}>
                            Notes for the printer
                            <input
                                value={sel.note ?? ''}
                                placeholder="e.g. 70# matte, freezer-grade adhesive"
                                onChange={(e) => update({ note: e.target.value })}
                            />
                        </label>
                    </div>
                    <div className={s.rowBtns}>
                        <button type="button" className={s.btn} onClick={() => update({ w: sel.h, h: sel.w })}>
                            ↻ Rotate
                        </button>
                        {DEFAULT_SPECS.some((d) => d.key === sel.key) && (
                            <button type="button" className={s.btn} onClick={resetItem}>
                                Reset to default
                            </button>
                        )}
                        {sel.key.startsWith('custom-') && (
                            <button type="button" className={s.btn} onClick={removeCustom}>
                                Remove item
                            </button>
                        )}
                        <Link
                            className={s.btnPrimary}
                            href={`/product-identity/sizes/print?key=${encodeURIComponent(sel.key)}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => {
                                if (dirty) {
                                    e.preventDefault();
                                    setMsg('Save your changes first so the print uses them.');
                                }
                            }}
                        >
                            🖨 Print at this size
                        </Link>
                    </div>

                    {/* facts */}
                    <div className={s.facts}>
                        <div>
                            <b>
                                {fmt(sel.w, unit)} × {fmt(sel.h, unit)}
                            </b>
                            <span>finished (trim) size</span>
                        </div>
                        <div>
                            <b>
                                {fmt(sel.w + sel.bleed * 2, unit)} × {fmt(sel.h + sel.bleed * 2, unit)}
                            </b>
                            <span>with bleed</span>
                        </div>
                        <div>
                            <b>
                                {dpi300.w.toLocaleString()} × {dpi300.h.toLocaleString()} px
                            </b>
                            <span>artwork needed at 300 DPI</span>
                        </div>
                        {SHEETS.map((sh) => {
                            const f = fitOnSheet(sel, sh);
                            return (
                                <div key={sh.key}>
                                    <b>{f.count > 0 ? `${f.count} per sheet` : 'Too big'}</b>
                                    <span>
                                        {sh.name}
                                        {f.rotated && f.count ? ' (rotated)' : ''}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* views */}
                    <div className={s.viewTabs}>
                        <button
                            type="button"
                            className={view === 'compare' ? s.tabOn : s.tab}
                            onClick={() => setView('compare')}
                        >
                            Compare to everyday sizes
                        </button>
                        <button
                            type="button"
                            className={view === 'actual' ? s.tabOn : s.tab}
                            onClick={() => setView('actual')}
                        >
                            Actual size on screen
                        </button>
                        {view === 'actual' && (
                            <button type="button" className={s.link} onClick={() => setCalibrating(!calibrating)}>
                                {calibrating ? 'Done calibrating' : 'Calibrate screen'}
                            </button>
                        )}
                    </div>

                    {view === 'compare' ? (
                        <div className={s.stage}>
                            <figure>
                                <Proof spec={sel} ppi={compareScale} />
                                <figcaption>{sel.name}</figcaption>
                            </figure>
                            {refs.map((r) => (
                                <figure key={r.name}>
                                    <div
                                        className={s.ref}
                                        style={
                                            {
                                                '--ref-w': `${r.w * compareScale}px`,
                                                '--ref-h': `${r.h * compareScale}px`,
                                            } as React.CSSProperties
                                        }
                                    />
                                    <figcaption>
                                        {r.name} · {fmt(r.w, unit)} × {fmt(r.h, unit)}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    ) : (
                        <div className={s.actualWrap}>
                            {calibrating ? (
                                <div className={s.calib}>
                                    <p>
                                        Hold a credit card (or any bank / ID card) against the screen and drag the
                                        slider until the outline matches it exactly.
                                    </p>
                                    <div
                                        className={s.card}
                                        style={
                                            {
                                                '--card-w': `${CARD_IN * ppi}px`,
                                                '--card-h': `${2.125 * ppi}px`,
                                            } as React.CSSProperties
                                        }
                                    >
                                        credit card
                                    </div>
                                    <input
                                        type="range"
                                        min={60}
                                        max={260}
                                        step={0.5}
                                        value={ppi}
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            const v = raw ? Number(raw) : undefined;
                                            if (v !== undefined && !Number.isNaN(v)) setPpi(v);
                                        }}
                                    />
                                    <small>{ppi.toFixed(1)} pixels per inch on this screen · saved in this browser</small>
                                </div>
                            ) : (
                                <>
                                    <p className={s.small}>
                                        Shown at real size
                                        {ppi === 96 ? ' (not calibrated yet — click “Calibrate screen” for accuracy)' : ''}
                                        . Big items scroll.
                                    </p>
                                    <div className={s.actual}>
                                        <Proof spec={sel} ppi={ppi} />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    <p className={s.legend}>
                        <i className={s.lgTrim} /> trim (cut) line <i className={s.lgBleed} /> bleed — art extends here{' '}
                        <i className={s.lgSafe} /> safe area — keep text inside
                    </p>
                </section>
            </div>
            {saved === '' && <p className={s.small}>Loading saved sizes…</p>}
        </Wrapper>
    );
}
