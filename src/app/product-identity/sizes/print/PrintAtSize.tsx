'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SHEETS, fitOnSheet, fmt, type PrintSpec } from '../specs';
import s from '../sizes.module.css';

const GUTTER = 0.125, MARK = 0.18; // inches

/** Hide site chrome (nav, footer, widgets) only for the print job. */
function isolateAndPrint() {
    const root = document.getElementById('size-print-root');
    if (!root) return window.print();
    const touched: { el: HTMLElement; css: string }[] = [];
    let node: HTMLElement | null = root;
    while (node && node !== document.body) {
        const parent: HTMLElement | null = node.parentElement;
        if (!parent) break;
        Array.from(parent.children).forEach((sib) => {
            if (sib !== node && sib instanceof HTMLElement) { touched.push({ el: sib, css: sib.style.cssText }); sib.style.setProperty('display', 'none', 'important'); }
        });
        touched.push({ el: parent, css: parent.style.cssText });
        ['margin', 'padding', 'transform'].forEach((p) => parent.style.setProperty(p, p === 'transform' ? 'none' : '0', 'important'));
        parent.style.setProperty('background', '#fff', 'important');
        node = parent;
    }
    const restore = () => { touched.forEach(({ el, css }) => (el.style.cssText = css)); window.removeEventListener('afterprint', restore); };
    window.addEventListener('afterprint', restore);
    window.print();
}

function CropMarks({ w, h }: { w: number; h: number }) {
    const line = (cx: string, cy: string, cw: string, ch: string) => (
        <span
            className={s.printCropLine}
            style={{ '--cx': cx, '--cy': cy, '--cw': cw, '--ch': ch } as React.CSSProperties}
        />
    );
    const t = '0.5pt';
    return (
        <>
            {[0, w].map((x) => [0, h].map((y) => (
                <React.Fragment key={`${x}-${y}`}>
                    {line(`${x}in`, y === 0 ? `-${MARK + 0.04}in` : `${h + 0.04}in`, t, `${MARK}in`)}
                    {line(x === 0 ? `-${MARK + 0.04}in` : `${w + 0.04}in`, `${y}in`, `${MARK}in`, t)}
                </React.Fragment>
            )))}
        </>
    );
}

export default function PrintAtSize() {
    const params = useSearchParams();
    const key = params.get('key');
    const [spec, setSpec] = useState<PrintSpec | null>(null);
    const [sheetKey, setSheetKey] = useState<string>('auto');
    const [copies, setCopies] = useState<number | null>(null);
    const [marks, setMarks] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function fetchSpecs() {
            try {
                const r = await fetch('/api/print-specs', { cache: 'no-store' });
                if (!r.ok) return;
                const d = (await r.json()) as { items?: PrintSpec[] };
                if (!cancelled) {
                    setSpec(d.items?.find((i) => i.key === key) ?? null);
                }
            } catch {
                /* ignore */
            }
        }
        void fetchSpecs();
        return () => {
            cancelled = true;
        };
    }, [key]);

    if (!spec) return <main className={s.printEmpty}>{key ? 'Loading…' : 'No item selected.'}</main>;

    const bw = spec.w + spec.bleed * 2, bh = spec.h + spec.bleed * 2;
    const autoSheet = SHEETS.find((sh) => fitOnSheet(spec, sh).count > 0);
    const chosen = sheetKey === 'auto' ? autoSheet : SHEETS.find((sh) => sh.key === sheetKey);
    const custom = !chosen || fitOnSheet(spec, chosen).count === 0;
    const page = custom ? { w: +(bw + 1).toFixed(3), h: +(bh + 1).toFixed(3), name: 'Custom (large format)' } : chosen;
    const fit = custom ? { count: 1, cols: 1, rows: 1, rotated: false } : fitOnSheet(spec, page);
    const n = Math.min(copies ?? fit.count, fit.count);
    const iw = fit.rotated ? bh : bw, ih = fit.rotated ? bw : bh;
    const gridW = fit.cols * iw + (fit.cols - 1) * GUTTER, gridH = fit.rows * ih + (fit.rows - 1) * GUTTER;
    const radius = spec.shape === 'circle' ? '50%' : spec.shape === 'rounded' ? '0.125in' : '0';
    const copyKeys = Array.from({ length: n }, (_, idx) => `${spec.key}-copy-${idx + 1}`);
    const sheetVars = {
        '--page-w': `${page.w}in`,
        '--page-h': `${page.h}in`,
        '--grid-left': `${(page.w - gridW) / 2}in`,
        '--grid-top': `${(page.h - gridH) / 2}in`,
        '--grid-cols': String(fit.cols),
        '--item-w': `${iw}in`,
        '--item-h': `${ih}in`,
        '--grid-gap': `${GUTTER}in`,
        '--bleed': `${spec.bleed}in`,
        '--neg-bleed': `-${spec.bleed}in`,
        '--bleed-2x': `${spec.bleed * 2}in`,
        '--radius': radius,
    } as React.CSSProperties;

    return (
            <main className={s.printMain}>
                <style>{`@media print { @page { size: ${page.w}in ${page.h}in; margin: 0; } .no-print { display: none !important; } #size-print-root { padding: 0 !important; } #size-print-root > div { box-shadow: none !important; } }`}</style>

                        <header className={`no-print ${s.printHeader}`}>
                            <Link href="/product-identity/sizes" className={s.back}>← Print sizes</Link>
                            <h1 className={s.printTitle}>{spec.name}</h1>
                            <p className={s.printSub}>
                                Finished size <b>{fmt(spec.w, 'in')} × {fmt(spec.h, 'in')}</b>{spec.bleed > 0 && <> + {fmt(spec.bleed, 'in')} bleed</>} · {n} on a {page.name} sheet ({page.w}&quot; × {page.h}&quot;){fit.rotated && ' · rotated to fit more'}
                                {spec.note && <><br />Printer notes: {spec.note}</>}
                            </p>
                                <div className={s.printControls}>
                                    <label>Sheet{' '}
                                            <select value={sheetKey} onChange={(e) => setSheetKey(e.target.value)} className={s.printSelect}>
                                                <option value="auto">Smallest that fits</option>
                                                {SHEETS.map((sh) => <option key={sh.key} value={sh.key}>{sh.name}{fitOnSheet(spec, sh).count === 0 ? ' (too small)' : ''}</option>)}
                                            </select>
                                    </label>
                                    {fit.count > 1 && (
                                        <label>Copies{' '}
                                            <input
                                                type="number"
                                                min={1}
                                                max={fit.count}
                                                value={n}
                                                onChange={(e) => {
                                                    const raw = e.target.value;
                                                    const v = raw ? Number(raw) : undefined;
                                                    if (v !== undefined && !Number.isNaN(v)) setCopies(v);
                                                }}
                                                className={s.printInput}
                                            />
                                        </label>
                                    )}
                                    <label><input type="checkbox" checked={marks} onChange={(e) => setMarks(e.target.checked)} /> Crop marks</label>
                                    <button type="button" onClick={isolateAndPrint} className={s.printBtn}>🖨 Print / Save as PDF</button>
                                </div>
                            <small className={s.printHint}>In the print dialog set Scale to <b>100% / Actual size</b> and Margins to <b>None</b>. Measure the result to confirm.</small>
                        </header>

                                                <section id="size-print-root" aria-label="Print sheet preview" className={s.printStage}>
                                                    <div className={s.printSheet} style={sheetVars}>
                                                        <div className={s.printGrid}>
                                                            {copyKeys.map((copyKey) => (
                                                                <div key={copyKey} className={s.printCell}>
                                                                    <div className={`${s.printTrimBox} ${marks ? s.printTrimMarks : ''}`}>
                                                                        {spec.art
                                                                        ? <img src={spec.art} alt="" className={`${s.printArtImg} ${fit.rotated ? s.printArtRotated : ''}`} />
                                                                        : <div className={s.printDielineBox}>{spec.name}<br />{fmt(spec.w, 'in')} × {fmt(spec.h, 'in')}</div>}
                                                                    </div>
                                                                    {marks && <div className={s.printMarksWrap}><CropMarks w={fit.rotated ? spec.h : spec.w} h={fit.rotated ? spec.w : spec.h} /></div>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                            <div className={s.printSlug}>
                                                                HOFHERR MEAT CO. · {spec.name} · trim {fmt(spec.w, 'in')} × {fmt(spec.h, 'in')} · print at 100%
                                                            </div>
                                                        </div>
                                                </section>
                                            </main>
                                            );
}
