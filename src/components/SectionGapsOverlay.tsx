'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import styles from './SectionGapsOverlay.module.css';

type Bar = { key: string; y: number; h: number; px: number; side: 'left' | 'mid' | 'between'; off: boolean };
type Edge = { key: string; y: number; text: string };
type SideBar = { key: string; x: number; y: number; w: number; px: number };
type TallBar = { key: string; x: number; y: number; h: number; px: number };
type Snapshot = { bars: Bar[]; edges: Edge[]; sides: SideBar[]; talls: TallBar[]; base: number };

const EMPTY: Snapshot = { bars: [], edges: [], sides: [], talls: [], base: 0 };
/** Cards further than this from the viewport don't get side-padding markers (keeps big pages light). */
const CARD_RANGE = 600;
const MAX_CARDS = 80;
/** How many levels of card-inside-card get measured. */
const MAX_DEPTH = 3;
const CONTENT =
    'h1,h2,h3,h4,h5,h6,p,a,button,img,video,li,input,textarea,select,label,iframe,table,figure,blockquote';
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK']);

const isShown = (el: Element) => {
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && el.getBoundingClientRect().height > 0;
};
const inFlow = (el: Element) => {
    const p = getComputedStyle(el).position;
    return p !== 'fixed' && p !== 'absolute';
};
const flowKids = (el: Element) =>
    Array.from(el.children).filter(c => !SKIP_TAGS.has(c.tagName) && isShown(c) && inFlow(c));
const hasOwnText = (el: Element) =>
    Array.from(el.childNodes).some(n => n.nodeType === Node.TEXT_NODE && Boolean(n.textContent?.trim()));

const isPainted = (color: string) => color !== 'transparent' && !/,\s*0\)$/.test(color);
/** A box with a visible edge: a real border, or a filled box with rounded corners. */
const isCard = (el: Element) => {
    const s = getComputedStyle(el);
    const bordered =
        (parseFloat(s.borderTopWidth) > 0 && isPainted(s.borderTopColor)) ||
        (parseFloat(s.borderBottomWidth) > 0 && isPainted(s.borderBottomColor));
    const filled = isPainted(s.backgroundColor) && parseFloat(s.borderTopLeftRadius) > 0;
    return bordered || filled;
};

/** A box closed on its sides too. A box with only a top / bottom rule is a divider, not a card. */
const isBox = (el: Element) => {
    const s = getComputedStyle(el);
    const bordered =
        parseFloat(s.borderTopWidth) > 0 &&
        isPainted(s.borderTopColor) &&
        parseFloat(s.borderLeftWidth) > 0 &&
        isPainted(s.borderLeftColor);
    const filled = isPainted(s.backgroundColor) && parseFloat(s.borderTopLeftRadius) > 0;
    return bordered || filled;
};

function findSections(): HTMLElement[] {
    let root: Element = document.querySelector('main') ?? document.body;
    for (;;) {
        const kids = flowKids(root);
        if (kids.length !== 1 || kids[0].tagName === 'SECTION' || flowKids(kids[0]).length <= 1) break;
        root = kids[0];
    }
    const list = flowKids(root) as HTMLElement[];
    const seen = new Set<HTMLElement>(list);
    // Whatever follows the main content further up the tree (a closing banner, the footer)
    // is part of the page rhythm too.
    for (let a: Element | null = root; a && a !== document.body; a = a.parentElement) {
        for (let n = a.nextElementSibling; n; n = n.nextElementSibling) {
            if (SKIP_TAGS.has(n.tagName) || !isShown(n) || !inFlow(n)) continue;
            const candidate = n as HTMLElement;
            if (!seen.has(candidate)) {
                seen.add(candidate);
                list.push(candidate);
            }
        }
    }
    return list;
}

/**
 * Left/right space between a box's inner edges and what sits inside it.
 * Also returns the outermost cards found inside, so their own side padding can be measured next.
 */
function sideInset(box: Element) {
    const rect = box.getBoundingClientRect();
    const cs = getComputedStyle(box);
    const borderLeft = parseFloat(cs.borderLeftWidth) || 0;
    const borderRight = parseFloat(cs.borderRightWidth) || 0;
    let left = Infinity;
    let right = -Infinity;
    let top = Infinity;
    let bottom = -Infinity;
    const cards = new Set<Element>();
    box.querySelectorAll('*').forEach(el => {
        if (!el.matches(CONTENT) && !hasOwnText(el)) return;
        if (!isShown(el)) return;
        let frame: Element | null = null;
        for (let a: Element | null = el; a && a !== box; a = a.parentElement) {
            if (!inFlow(a)) frame = a.parentElement;
        }
        if (frame) {
            if (frame === box || !el.matches('img,video')) return;
            if (getComputedStyle(frame).overflow === 'visible') return;
        }
        const r = (frame ?? el).getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return;
        let elLeft = r.left;
        let elRight = r.right;
        let elTop = r.top;
        let elBottom = r.bottom;
        for (let a = (frame ?? el).parentElement; a && a !== box; a = a.parentElement) {
            const s = getComputedStyle(a);
            if (s.overflowX === 'visible' && s.overflowY === 'visible') continue;
            const ar = a.getBoundingClientRect();
            if (s.overflowX !== 'visible') {
                elLeft = Math.max(elLeft, ar.left);
                elRight = Math.min(elRight, ar.right);
            }
            if (s.overflowY !== 'visible') {
                elTop = Math.max(elTop, ar.top);
                elBottom = Math.min(elBottom, ar.bottom);
            }
        }
        if (elRight - elLeft < 2 || elBottom - elTop < 2) return;
        let outer: Element | null = null;
        for (let a = (frame ?? el).parentElement; a && a !== box; a = a.parentElement) {
            const ar = a.getBoundingClientRect();
            if (ar.height >= rect.height - 2 && ar.width >= rect.width - 2) break; // a wrapper, not a card
            if (!isBox(a)) continue;
            outer = a;
            elLeft = Math.min(elLeft, ar.left);
            elRight = Math.max(elRight, ar.right);
            elTop = Math.min(elTop, ar.top);
            elBottom = Math.max(elBottom, ar.bottom);
        }
        if (outer) cards.add(outer);
        left = Math.min(left, elLeft);
        right = Math.max(right, elRight);
        top = Math.min(top, elTop);
        bottom = Math.max(bottom, elBottom);
    });
    if (!Number.isFinite(left)) return null;
    return {
        innerTop: rect.top + (parseFloat(cs.borderTopWidth) || 0),
        innerBottom: rect.bottom - (parseFloat(cs.borderBottomWidth) || 0),
        centerX: rect.left + rect.width / 2,
        bottom,
        x: rect.left + borderLeft,
        left: left - rect.left - borderLeft,
        rightX: right,
        right: rect.right - borderRight - right,
        top,
        cards: Array.from(cards),
    };
}

/** Space between a section's inner edges (inside its border) and its real content. */
function contentInset(sec: HTMLElement) {
    const rect = sec.getBoundingClientRect();
    const cs = getComputedStyle(sec);
    const borderTop = parseFloat(cs.borderTopWidth) || 0;
    const borderBottom = parseFloat(cs.borderBottomWidth) || 0;
    let top = Infinity;
    let bottom = -Infinity;
    sec.querySelectorAll('*').forEach(el => {
        if (!el.matches(CONTENT) && !hasOwnText(el)) return;
        if (!isShown(el)) return;
        // Absolutely placed layers are ignored, except media that fills a clipped frame
        // (e.g. a parallax photo inside a gallery tile): there the frame is what you see.
        let frame: Element | null = null;
        for (let a: Element | null = el; a && a !== sec; a = a.parentElement) {
            if (!inFlow(a)) frame = a.parentElement;
        }
        if (frame) {
            if (frame === sec || !el.matches('img,video')) return;
            if (getComputedStyle(frame).overflow === 'visible') return;
        }
        const r = (frame ?? el).getBoundingClientRect();
        if (r.width < 2 || r.height < 2 || r.height >= rect.height - 2) return;
        // A card (a box with its own visible edge) is what the eye reads as the content,
        // so measure to the outermost card around the element rather than to the text inside it.
        // Ignore whatever is clipped away by an overflow-hidden parent (e.g. a closed accordion answer).
        let elTop = r.top;
        let elBottom = r.bottom;
        for (let a = (frame ?? el).parentElement; a && a !== sec; a = a.parentElement) {
            if (getComputedStyle(a).overflowY === 'visible') continue;
            const ar = a.getBoundingClientRect();
            elTop = Math.max(elTop, ar.top);
            elBottom = Math.min(elBottom, ar.bottom);
        }
        if (elBottom - elTop < 2) return;
        for (let a = (frame ?? el).parentElement; a && a !== sec; a = a.parentElement) {
            const ar = a.getBoundingClientRect();
            if (ar.height >= rect.height - 2) break; // fills the section: a wrapper, not a card
            // full-bleed band, not a card (a rounded box is a card even at full width)
            if (ar.width >= rect.width - 2 && !(parseFloat(getComputedStyle(a).borderTopLeftRadius) > 0)) continue;
            if (!isCard(a)) continue;
            elTop = Math.min(elTop, ar.top);
            elBottom = Math.max(elBottom, ar.bottom);
        }
        top = Math.min(top, elTop);
        bottom = Math.max(bottom, elBottom);
    });
    if (!Number.isFinite(top)) return null;
    // A section pulled up under the nav (negative top margin): the tucked-away part is not visible space.
    const tucked = Math.max(0, -(parseFloat(cs.marginTop) || 0));
    return {
        tucked,
        top: top - rect.top - borderTop - tucked,
        bottom: rect.bottom - borderBottom - bottom,
        borderTop,
        borderBottom,
    };
}

function measure(): Snapshot {
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const sides: SideBar[] = [];
    const talls: TallBar[] = [];
    let cardCount = 0;
    // One pair of markers per box: left edge -> content, content -> right edge.
    const addSides = (key: string, box: Element, scale: number, depth: number) => {
        const side = sideInset(box);
        if (!side) return;
        const y = side.top + scrollY + (depth === 0 ? 14 : -14);
        const push = (tag: string, x: number, w: number) => {
            if (w < 1) return;
            sides.push({ key: `${key}-${tag}`, x: x + scrollX, y, w, px: Math.round(w / scale) });
        };
        if (depth > 0) {
            // inside a card: its own side padding
            push('l', side.x, side.left);
            push('r', side.rightX, side.right);
            // ...and its top / bottom padding
            const tall = (tag: string, top: number, h: number) => {
                if (h < 1) return;
                talls.push({ key: `${key}-${tag}`, x: side.centerX + scrollX, y: top + scrollY, h, px: Math.round(h / scale) });
            };
            tall('t', side.innerTop, side.top - side.innerTop);
            tall('b', side.bottom, side.innerBottom - side.bottom);
        } else {
            // a page section: the gutter from the edge of the page to the content
            const pageWidth = document.documentElement.clientWidth;
            push('l', 0, side.x + side.left);
            push('r', side.rightX, pageWidth - side.rightX);
        }
        const nearby = side.cards
            .map(card => ({ card, r: card.getBoundingClientRect() }))
            .filter(v => v.r.bottom > -CARD_RANGE && v.r.top < window.innerHeight + CARD_RANGE)
            .slice(0, MAX_CARDS * 2);
        nearby.forEach((a, n) => {
            // the gap to the next card in the same row
            let next: (typeof nearby)[number] | null = null;
            // the gap to the next card stacked underneath
            let below: (typeof nearby)[number] | null = null;
            for (const b of nearby) {
                if (b === a) continue;
                if (b.r.left >= a.r.right - 1) {
                    const overlap = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
                    if (overlap >= Math.min(a.r.height, b.r.height) * 0.3 && (!next || b.r.left < next.r.left)) next = b;
                }
                if (b.r.top >= a.r.bottom - 1) {
                    const overlap = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
                    if (overlap >= Math.min(a.r.width, b.r.width) * 0.3 && (!below || b.r.top < below.r.top)) below = b;
                }
            }
            if (next) {
                const w = next.r.left - a.r.right;
                if (w >= 1 && w <= 400) {
                    sides.push({
                        key: `${key}-g${n}`,
                        x: a.r.right + scrollX,
                        y: Math.max(a.r.top, next.r.top) + scrollY + 28,
                        w,
                        px: Math.round(w / scale),
                    });
                }
            }
            if (below) {
                const h = below.r.top - a.r.bottom;
                if (h >= 1 && h <= 400) {
                    const from = Math.max(a.r.left, below.r.left);
                    const to = Math.min(a.r.right, below.r.right);
                    talls.push({
                        key: `${key}-v${n}`,
                        x: (from + to) / 2 + scrollX,
                        y: a.r.bottom + scrollY,
                        h,
                        px: Math.round(h / scale),
                    });
                }
            }
        });
        if (depth >= MAX_DEPTH) return;
        nearby.forEach(({ card }, n) => {
            if (cardCount >= MAX_CARDS) return;
            cardCount += 1;
            addSides(`${key}-c${n}`, card, scale, depth + 1);
        });
    };
    const rows = findSections().map((sec, i) => {
        const rect = sec.getBoundingClientRect();
        // Page transitions scale the page slightly; report real CSS px, not the scaled size.
        const scale = sec.offsetHeight > 0 ? rect.height / sec.offsetHeight : 1;
        const inset = contentInset(sec);
        addSides(`${i}-${sec.id || sec.tagName}`, sec, scale || 1, 0);
        return {
            key: `${i}-${sec.id || sec.tagName}`,
            name: sec.id ? `#${sec.id}` : sec.tagName.toLowerCase(),
            outerTop: rect.top + scrollY,
            outerBottom: rect.bottom + scrollY,
            top: rect.top + scrollY + (inset?.borderTop ?? 0) + (inset?.tucked ?? 0),
            bottom: rect.bottom + scrollY - (inset?.borderBottom ?? 0),
            scale: scale || 1,
            inset,
        };
    });

    // Space the parent puts between two sections (flex gap / margins), outside either section.
    const between = (i: number) => (i > 0 ? Math.max(0, rows[i].outerTop - rows[i - 1].outerBottom) : 0);

    const gaps: number[] = [];
    rows.forEach((r, i) => {
        const space = Math.round(between(i) / r.scale);
        if (space > 0) gaps.push(space);
        if (!r.inset) return;
        [r.inset.top, r.inset.bottom].forEach(v => {
            const px = Math.round(v / r.scale);
            if (px > 0) gaps.push(px);
        });
    });
    const near = (v: number) => gaps.filter(g => Math.abs(g - v) <= 2).length;
    const base = [...gaps].sort((a, b) => near(b) - near(a) || b - a)[0] ?? 0;

    const bars: Bar[] = [];
    const edges: Edge[] = [];
    rows.forEach((r, i) => {
        const prev = rows[i - 1];
        let text = r.name;
        if (prev?.inset && r.inset) {
            const total = Math.round(prev.inset.bottom / prev.scale + between(i) / r.scale + r.inset.top / r.scale);
            text += `  |  ${total}px content to content`;
        }
        edges.push({ key: r.key, y: r.top, text });
        const add = (side: Bar['side'], y: number, h: number) => {
            if (h < 1) return;
            const px = Math.round(h / r.scale);
            bars.push({ key: `${r.key}-${side}`, y, h, px, side, off: Math.abs(px - base) > 2 });
        };
        if (prev) add('between', prev.outerBottom, between(i));
        if (!r.inset) return;
        add('mid', r.top, r.inset.top);
        add('left', r.bottom - r.inset.bottom, r.inset.bottom);
    });
    return { bars, edges, sides, talls, base };
}

const sidePos = (bar: SideBar) =>
    ({ '--x': `${bar.x}px`, '--y': `${bar.y}px`, '--w': `${bar.w}px` }) as CSSProperties;

const tallPos = (bar: TallBar) =>
    ({ '--x': `${bar.x}px`, '--y': `${bar.y}px`, '--h': `${bar.h}px` }) as CSSProperties;

const pos = (y: number, h?: number) =>
    ({ '--y': `${y}px`, ...(h === undefined ? {} : { '--h': `${h}px` }) }) as CSSProperties;

/** Dev-only: draws the spacing between sections on whatever page is open. */
export default function SectionGapsOverlay() {
    const pathname = usePathname();
    const [snap, setSnap] = useState<Snapshot>(EMPTY);

    useEffect(() => {
        let raf = 0;
        let last = '';
        const run = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const next = measure();
                const sig = JSON.stringify(next);
                if (sig === last) return;
                last = sig;
                setSnap(next);
            });
        };
        // Card markers are only drawn near the viewport, so refresh after scrolling settles.
        let scrollTimer = 0;
        const onScroll = () => {
            window.clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(run, 180);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        const observer = new ResizeObserver(run);
        observer.observe(document.body);
        window.addEventListener('resize', run);
        // Reveal animations and page transitions move content without resizing the body.
        const timer = window.setInterval(run, 1200);
        run();
        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
            window.removeEventListener('resize', run);
            window.removeEventListener('scroll', onScroll);
            window.clearTimeout(scrollTimer);
            window.clearInterval(timer);
        };
    }, [pathname]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className={styles.host} aria-hidden="true" data-dev-overlay="gaps">
            {snap.edges.map(edge => (
                <div key={edge.key} className={styles.edge} style={pos(edge.y)}>
                    <span className={`${styles.chip} ${styles.edgeLabel}`}>{edge.text}</span>
                </div>
            ))}
            {snap.bars.map(bar => (
                <div
                    key={bar.key}
                    className={`${styles.bar} ${bar.side === 'mid' ? styles.barMid : bar.side === 'between' ? styles.barBetween : styles.barLeft} ${bar.off ? styles.off : ''}`}
                    style={pos(bar.y, bar.h)}
                >
                    <span className={`${styles.chip} ${styles.barLabel}`}>{bar.px}px</span>
                </div>
            ))}
            {snap.sides.map(side => (
                <div key={side.key} className={styles.sideBar} style={sidePos(side)}>
                    <span className={`${styles.chip} ${styles.sideLabel}`}>{side.px}px</span>
                </div>
            ))}
            {snap.talls.map(tall => (
                <div key={tall.key} className={styles.tallBar} style={tallPos(tall)}>
                    <span className={`${styles.chip} ${styles.tallLabel}`}>{tall.px}px</span>
                </div>
            ))}
            <div className={styles.legend}>
                <span>Section gaps</span>
                <span className={styles.swatchOk}>■ {snap.base}px (most common)</span>
                <span className={styles.swatchOff}>■ differs</span>
                <span className={styles.swatchSide}>■ card padding / gaps</span>
                <span>Alt+G</span>
            </div>
        </div>,
        document.body,
    );
}
