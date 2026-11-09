/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import type { Slide } from './types';

/**
 * Server-side renderer for weekly social slides (1080 × 1350, Instagram 4:5).
 * Satori rules: every element with more than one child must be display:flex.
 */

export const W = 1080;
export const H = 1350;

const C = { crimson: '#8B0A10', amber: '#F59B1A', charcoal: '#1C1614', cream: '#F3EAD8', tan: '#cdbfa8' };
const HANDLE = '@hofherrmeatco';

const PUBLIC = path.join(process.cwd(), 'public');
const FONTS = path.join(process.cwd(), 'src/lib/social/fonts');

const ICONS: Record<string, string> = {
    cow: 'sticker-cow.svg', pig: 'sticker-pig.svg', chicken: 'sticker-chicken.svg', lamb: 'sticker-lamb.svg',
    cheese: 'sticker-cheese.svg', soup: 'sticker-soup.svg', fish: 'sticker-fish.svg', seafood: 'sticker-seafood.svg',
    duck: 'sticker-duck.svg', truck: 'sticker-truck.svg',
};

const cache = new Map<string, string>();
async function dataUri(rel: string): Promise<string> {
    if (/^https?:/.test(rel)) return rel; // remote (e.g. Sanity CDN) — Satori fetches it
    const hit = cache.get(rel);
    if (hit) return hit;
    const buf = await readFile(path.join(PUBLIC, rel.replace(/^\//, '')));
    const ext = path.extname(rel).slice(1).toLowerCase();
    const mime = ext === 'svg' ? 'image/svg+xml' : ext === 'png' ? 'image/png' : 'image/jpeg';
    const uri = `data:${mime};base64,${buf.toString('base64')}`;
    cache.set(rel, uri);
    return uri;
}

let fontsP: Promise<{ name: string; data: Buffer; weight: 400 | 700; style: 'normal' }[]> | null = null;
function fonts() {
    fontsP ??= Promise.all([
        readFile(path.join(FONTS, 'Yanone-Bold.ttf')).then((data) => ({ name: 'Yanone', data, weight: 700 as const, style: 'normal' as const })),
        readFile(path.join(FONTS, 'Inter-Regular.ttf')).then((data) => ({ name: 'Inter', data, weight: 400 as const, style: 'normal' as const })),
        readFile(path.join(FONTS, 'Inter-Bold.ttf')).then((data) => ({ name: 'Inter', data, weight: 700 as const, style: 'normal' as const })),
    ]);
    return fontsP;
}

/* ── pieces ─────────────────────────────────────────────── */
const head = (size: number, color: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
    fontFamily: 'Yanone', fontWeight: 700, fontSize: size, lineHeight: 0.95, color, textTransform: 'uppercase', ...extra,
});

function Kicker({ text, bg = C.amber, color = C.charcoal }: { text?: string; bg?: string; color?: string }) {
    if (!text) return null;
    return (
        <div style={{ display: 'flex', alignSelf: 'flex-start', background: bg, color, padding: '8px 20px', ...head(34, color, { letterSpacing: 4, lineHeight: 1 }) }}>
            {text}
        </div>
    );
}

function Footer({ logo, dark = true }: { logo: string; dark?: boolean }) {
    return (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 160, background: C.charcoal, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 64px' }}>
            <img src={logo} alt="Hofherr Meat Co." height={86} style={{ height: 86 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontFamily: 'Inter', fontSize: 26, color: C.cream, letterSpacing: 1 }}>
                <span>{HANDLE}</span>
                <span style={{ color: dark ? C.amber : C.amber }}>Northfield · Winnetka Depot</span>
            </div>
        </div>
    );
}

function Frame({ color }: { color: string }) {
    return <div style={{ position: 'absolute', left: 28, top: 28, right: 28, bottom: 188, border: `3px solid ${color}`, display: 'flex' }} />;
}

/* ── templates ──────────────────────────────────────────── */
async function SlideView({ s }: { s: Slide }) {
    const [logo, icon, photo] = await Promise.all([
        dataUri('/assets/logo.svg'),
        dataUri(`/assets/identity/stickers/${ICONS[s.iconId ?? 'cow'] ?? ICONS.cow}`),
        s.photo ? dataUri(s.photo) : Promise.resolve(null),
    ]);
    const base: React.CSSProperties = { width: W, height: H, position: 'relative', display: 'flex', fontFamily: 'Inter' };

    switch (s.template) {
        case 'specials':
        case 'recipe-cover':
        case 'howto-cover':
            return (
                <div style={{ ...base, background: C.charcoal }}>
                    {photo && <img src={photo} alt={s.headline || 'Hofherr Meat Co.'} width={W} height={H - 160} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H - 160, objectFit: 'cover' }} />}
                    <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H - 160, display: 'flex', backgroundImage: 'linear-gradient(180deg, rgba(28,22,20,0.25) 0%, rgba(28,22,20,0.55) 50%, rgba(28,22,20,0.95) 100%)' }} />
                    <Frame color={C.amber} />
                    <div style={{ position: 'absolute', left: 80, top: 90, display: 'flex' }}><Kicker text={s.kicker} /></div>
                    <div style={{ position: 'absolute', left: 80, right: 80, bottom: 230, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', ...head(150, C.cream, { lineHeight: 0.88 }) }}>{s.headline}</div>
                        {s.body && <div style={{ display: 'flex', marginTop: 20, ...head(s.template === 'specials' ? 96 : 42, C.amber, { letterSpacing: s.template === 'specials' ? 0 : 3 }) }}>{s.body}</div>}
                    </div>
                    <Footer logo={logo} />
                </div>
            );

        case 'howto-steps':
            return (
                <div style={{ ...base, background: C.cream, flexDirection: 'column' }}>
                    <div style={{ display: 'flex', height: 36, background: C.crimson }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '60px 80px 20px' }}>
                        <div style={{ display: 'flex', maxWidth: 680, ...head(92, C.crimson) }}>{s.headline}</div>
                        <img src={icon} alt="Department emblem" width={190} height={190} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px 80px', gap: 28 }}>
                        {(s.items ?? []).map((step, i) => (
                            <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: 30 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 84, height: 84, borderRadius: 42, background: C.crimson, flexShrink: 0, ...head(52, C.cream, { lineHeight: 1 }) }}>{String(i + 1)}</div>
                                <div style={{ display: 'flex', flex: 1, paddingTop: 10, fontSize: 40, lineHeight: 1.3, color: C.charcoal }}>{step}</div>
                            </div>
                        ))}
                    </div>
                    <Footer logo={logo} />
                </div>
                    );

                    case 'recipe-ingredients':
                    return (
                    <div style={{ ...base, background: C.cream, flexDirection: 'column' }}>
                        <div style={{ display: 'flex', height: 36, background: C.crimson }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '56px 80px 10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>
                                <Kicker text={s.kicker} />
                                <div style={{ display: 'flex', ...head(84, C.crimson) }}>{s.headline}</div>
                            </div>
                            <img src={icon} alt="Department emblem" width={180} height={180} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', padding: '24px 80px', gap: 4 }}>
                        {(s.items ?? []).map((it) => (
                            <div key={it} style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '14px 0', borderBottom: `2px dashed rgba(139,10,16,0.35)` }}>
                                <div style={{ display: 'flex', width: 18, height: 18, borderRadius: 9, background: C.amber, flexShrink: 0 }} />
                                <div style={{ display: 'flex', flex: 1, fontSize: 40, lineHeight: 1.25, color: C.charcoal }}>{it}</div>
                            </div>
                        ))}
                    </div>
                    <Footer logo={logo} />
                </div>
                        );

                        case 'chart':
                        return (
                        <div style={{ ...base, background: C.cream, flexDirection: 'column' }}>
                            {photo ? (
                        <img src={photo} alt={s.headline || 'Butcher cut chart'} width={W - 80} height={H - 220} style={{ position: 'absolute', left: 40, top: 30, width: W - 80, height: H - 220, objectFit: 'contain' }} />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: 80 }}>
                                    <Kicker text={s.kicker} />
                                    <div style={{ display: 'flex', marginTop: 24, ...head(120, C.crimson) }}>{s.headline}</div>
                                </div>
                            )}
                            <Footer logo={logo} />
                        </div>
                        );

                        case 'guide':
                        return (
                        <div style={{ ...base, background: C.charcoal, flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '80px 80px 40px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                    <Kicker text={s.kicker} />
                                    <div style={{ display: 'flex', ...head(140, C.cream) }}>{s.headline}</div>
                                </div>
                                <img src={icon} alt="Department emblem" width={210} height={210} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 80px', gap: 14 }}>
                                    {
                                        (s.items ?? []).map((row) => {
                                            const [name, where, best] = row.split('|').map((x) => x.trim());
                                            return (
                                <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 24, borderBottom: '2px solid rgba(245,155,26,0.35)', paddingBottom: 14 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', width: 400 }}>
                                        <div style={{ display: 'flex', ...head(52, C.amber, { lineHeight: 1 }) }}>{name}</div>
                                        <div style={{ display: 'flex', fontSize: 22, color: C.tan, letterSpacing: 2, textTransform: 'uppercase' }}>{where ?? ''}</div>
                                    </div>
                                    <div style={{ display: 'flex', flex: 1, fontSize: 34, lineHeight: 1.25, color: C.cream }}>{best ?? ''}</div>
                                </div>
                            );
                        })}
                    </div>
                    <Footer logo={logo} />
                </div>
                            );

                            case 'fact': {
            const cream = s.tone === 'cream';
                            const fg = cream ? C.crimson : C.cream;
                            return (
                            <div style={{ ...base, background: cream ? C.cream : C.crimson, flexDirection: 'column' }}>
                                <Frame color={cream ? C.crimson : C.cream} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: 30, padding: '130px 100px 50px' }}>
                                    <img src={icon} alt="Department emblem" width={170} height={170} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <Kicker text={s.kicker} />
                                        <div style={{ display: 'flex', ...head(40, cream ? C.charcoal : C.cream, { letterSpacing: 4 }) }}>{s.headline}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', padding: '0 100px', ...head(90, fg, { lineHeight: 1.02 }) }}>{s.body}</div>
                                <Footer logo={logo} />
                            </div>
                            );
        }

                            case 'trivia-q':
                            return (
                            <div style={{ ...base, background: C.crimson, flexDirection: 'column', alignItems: 'center' }}>
                                <Frame color={C.cream} />
                                <div style={{ display: 'flex', marginTop: 130 }}><Kicker text={s.kicker} /></div>
                                <div style={{ display: 'flex', marginTop: 30, ...head(260, C.amber, { lineHeight: 0.8 }) }}>?</div>
                                <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', padding: '50px 110px 0', ...head(100, C.cream, { lineHeight: 0.98 }) }}>{s.headline}</div>
                                <div style={{ display: 'flex', marginTop: 40, fontSize: 34, color: '#f0c9a0' }}>{s.body}</div>
                                <Footer logo={logo} />
                            </div>
                            );

                            case 'trivia-a':
                            return (
                            <div style={{ ...base, background: C.charcoal, flexDirection: 'column', padding: '130px 100px 0' }}>
                                <img src={icon} alt="Department emblem" width={220} height={220} />
                                <div style={{ display: 'flex', marginTop: 40 }}><Kicker text={s.kicker} /></div>
                                <div style={{ display: 'flex', marginTop: 40, ...head(80, C.cream, { lineHeight: 1.04 }) }}>{s.body}</div>
                                <Footer logo={logo} />
                            </div>
                            );

                            case 'tip':
                            default:
                            return (
                            <div style={{ ...base, background: C.amber, flexDirection: 'column', padding: '110px 90px 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Kicker text={s.kicker} bg={C.charcoal} color={C.amber} />
                                    <img src={icon} alt="Department emblem" width={200} height={200} />
                                </div>
                                <div style={{ display: 'flex', marginTop: 40, ...head(128, C.crimson, { lineHeight: 0.9 }) }}>{s.headline}</div>
                                <div style={{ display: 'flex', marginTop: 40, fontSize: 46, lineHeight: 1.4, color: C.charcoal }}>{s.body}</div>
                                <Footer logo={logo} />
                            </div>
                            );
    }
}

                            /** X / Twitter native 16:9 card: text on the left, photo or big department icon on the right. */
                            async function LandscapeView({s}: {s: Slide }) {
    const LW = 1600, LH = 900, RIGHT = 640;
                            const [logo, icon, photo] = await Promise.all([
                            dataUri('/assets/logo.svg'),
                            dataUri(`/assets/identity/stickers/${ICONS[s.iconId ?? 'cow'] ?? ICONS.cow}`),
                            s.photo ? dataUri(s.photo) : Promise.resolve(null),
                            ]);
                            const accent = s.template === 'tip' ? C.amber : s.template === 'fact' && s.tone === 'cream' ? C.cream : C.crimson;
                            const title = s.template === 'trivia-a' ? '' : s.headline ?? '';
    const isList = (s.template === 'howto-steps' || s.template === 'guide' || s.template === 'recipe-ingredients') && (s.items?.length ?? 0) > 0;
                            const body = s.template === 'trivia-q' ? 'Reply with your answer below' : s.body ?? '';
                            return (
                            <div style={{ width: LW, height: LH, display: 'flex', background: C.charcoal, fontFamily: 'Inter' }}>
                                <div style={{ width: LW - RIGHT, height: LH, display: 'flex', flexDirection: 'column', padding: '64px 70px 56px', borderRight: `8px solid ${C.amber}` }}>
                                    <img src={logo} alt="Hofherr Meat Co." height={92} style={{ height: 92, alignSelf: 'flex-start' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 'auto', marginBottom: 'auto' }}>
                                        <Kicker text={s.kicker} />
                                        {title && <div style={{ display: 'flex', ...head(title.length > 48 ? 70 : title.length > 26 ? 86 : 104, C.cream) }}>{title}</div>}
                                        {isList ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {(s.items ?? []).slice(0, 6).map((it, i) => {
                                const [a, , c] = it.split('|').map((x) => x.trim());
                                return (
                                    <div key={it} style={{ display: 'flex', gap: 14, fontSize: 26, color: C.cream, lineHeight: 1.3 }}>
                                        <span style={{ color: C.amber, fontWeight: 700, minWidth: s.template === 'guide' ? 220 : 30 }}>{s.template === 'guide' ? a : s.template === 'recipe-ingredients' ? '•' : `${i + 1}.`}</span>
                                        <span style={{ display: 'flex', flex: 1 }}>{s.template === 'guide' ? c ?? '' : a}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : body ? (
                        <div style={{ display: 'flex', fontSize: s.template === 'trivia-a' || s.template === 'fact' ? 40 : 34, lineHeight: 1.35, color: s.template === 'specials' ? C.amber : C.cream, fontWeight: s.template === 'specials' ? 700 : 400 }}>{body}</div>
                    ) : null}
                </div>
                <div style={{ display: 'flex', fontSize: 26, color: C.tan }}>
                    {HANDLE}&nbsp;·&nbsp;<span style={{ color: C.amber }}>Northfield · Winnetka Depot</span>
                </div>
            </div>
                                    <div style={{ width: RIGHT, height: LH, display: 'flex', alignItems: 'center', justifyContent: 'center', background: accent, position: 'relative' }}>
                                        {photo
                                        ? <img src={photo} alt={s.headline || 'Hofherr Meat Co.'} width={RIGHT} height={LH} style={{ width: RIGHT, height: LH, objectFit: 'cover' }} />
                                        : <img src={icon} alt="Department emblem" width={460} height={460} />}
                                    </div>
                                </div>
                                );
}

                                export async function renderSlide(slide: Slide, format: 'portrait' | 'landscape' = 'portrait') {
    if (format === 'landscape') {
                                const [el, fontData] = await Promise.all([LandscapeView({s: slide }), fonts()]);
                                return new ImageResponse(el, {width: 1600, height: 900, fonts: fontData });
    }
                                const [el, fontData] = await Promise.all([SlideView({s: slide }), fonts()]);
                                return new ImageResponse(el, {width: W, height: H, fonts: fontData });
}
