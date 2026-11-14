'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import styles from './BorderColorsOverlay.module.css';

type Tag = { key: string; x: number; y: number; hex: string; css: string };

/** Only boxes near the viewport are labelled (refreshed as you scroll) to keep big pages light. */
const RANGE = 300;
const MAX_TAGS = 160;
const SIDES = ['Top', 'Left', 'Right', 'Bottom'] as const;

const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');

/** Computed colour -> #rrggbbaa (null when fully transparent or unreadable). */
function hex8(color: string): string | null {
    const rgb = color.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
    const srgb = color.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\)$/);
    const m = rgb ?? srgb;
    if (!m) return null;
    const scale = rgb ? 1 : 255;
    const rawAlpha = m[4];
    const alpha = rawAlpha === undefined ? 1 : rawAlpha.endsWith('%') ? parseFloat(rawAlpha) / 100 : parseFloat(rawAlpha);
    if (alpha <= 0) return null;
    return `#${toHex(parseFloat(m[1]) * scale)}${toHex(parseFloat(m[2]) * scale)}${toHex(parseFloat(m[3]) * scale)}${toHex(alpha * 255)}`;
}

function measure(): Tag[] {
    const tags: Tag[] = [];
    const seen = new Set<string>();
    const viewH = window.innerHeight;
    const all = document.body.querySelectorAll('*');
    for (let i = 0; i < all.length && tags.length < MAX_TAGS; i += 1) {
        const el = all[i];
        if (el.closest('[data-dev-overlay], [class*="dev-nav-module"]')) continue; // skip the dev tools themselves
        const r = el.getBoundingClientRect();
        if (r.width < 40 || r.height < 20) continue;
        if (r.bottom < -RANGE || r.top > viewH + RANGE) continue;
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) continue;
        let css = '';
        let hex: string | null = null;
        let side: (typeof SIDES)[number] | null = null;
        for (const name of SIDES) {
            if (parseFloat(s.getPropertyValue(`border-${name.toLowerCase()}-width`)) <= 0) continue;
            if (s.getPropertyValue(`border-${name.toLowerCase()}-style`) === 'none') continue;
            const c = s.getPropertyValue(`border-${name.toLowerCase()}-color`);
            const h = hex8(c);
            if (!h) continue;
            css = c;
            hex = h;
            side = name;
            break;
        }
        if (!hex || !side) continue;
        // Sit the label on the border it describes.
        const x = side === 'Right' ? r.right - 96 : r.left + 14;
        const y = side === 'Bottom' ? r.bottom : side === 'Top' ? r.top : r.top + Math.min(r.height / 2, 40);
        const spot = `${Math.round(x / 24)}:${Math.round(y / 12)}`;
        if (seen.has(spot)) continue; // two borders on the same spot: one label is enough
        seen.add(spot);
        tags.push({ key: `${i}-${spot}`, x: x + window.scrollX, y: y + window.scrollY, hex, css });
    }
    return tags;
}

/** Dev-only: shows the colour of every visible border on the page. */
export default function BorderColorsOverlay() {
    const pathname = usePathname();
    const [tags, setTags] = useState<Tag[]>([]);

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
                setTags(next);
            });
        };
        let scrollTimer = 0;
        const onScroll = () => {
            window.clearTimeout(scrollTimer);
            scrollTimer = window.setTimeout(run, 150);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', run);
        const timer = window.setInterval(run, 1500);
        run();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', run);
            window.clearTimeout(scrollTimer);
            window.clearInterval(timer);
        };
    }, [pathname]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className={styles.host} aria-hidden="true" data-dev-overlay="borders">
            {tags.map(tag => (
                <div
                    key={tag.key}
                    className={styles.tag}
                    style={{ '--x': `${tag.x}px`, '--y': `${tag.y}px`, '--c': tag.css } as CSSProperties}
                >
                    <span className={styles.swatch} />
                    {tag.hex}
                </div>
            ))}
            <div className={styles.legend}>Border colours · #rrggbbaa (last two digits = opacity) · Alt+B</div>
        </div>,
        document.body,
    );
}
