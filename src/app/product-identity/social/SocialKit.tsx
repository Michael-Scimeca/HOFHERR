'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import { FLAME_STICKERS } from '../ProductIdentityClient';
import { BIOS, CAPTIONS, HASHTAGS, CADENCE, HANDLE, HOW_TOS, TRIVIA, TRICKS, DONENESS } from './copy';
import { ANIMALS, type Animal } from './animals';
import s from './social.module.css';

type VerifyCtxType = {
    verifier: string;
    verifiedMap: Record<string, { by: string; at: string }>;
    toggleVerify: (name: string) => void;
};

const VerifyCtx = createContext<VerifyCtxType>({
    verifier: 'Sean Hofherr',
    verifiedMap: {},
    toggleVerify: () => { },
});
const KIT_STORAGE_KEY = 'hofherr-social-kit-v1';

/* ── brand ─────────────────────────────────────────── */
const C = { crimson: '#8B0A10', amber: '#F59B1A', charcoal: '#1C1614', cream: '#F3EAD8', kraft: '#D5B88F' };
const HEAD = 'var(--font-heading), "Arial Black", sans-serif';
const BODY = 'var(--font-body), Arial, sans-serif';
const LOGO = '/assets/logo.svg';

const PHOTOS = [
    { label: 'Steak / specials', src: '/assets/specials-bbq.jpg' },
    { label: 'Italian beef', src: '/assets/specials-italian-beef.jpg' },
    { label: 'Pig roast', src: '/assets/specials-pig-roast.jpg' },
    { label: 'Rotisserie chickens', src: '/assets/specials-rotisserie.jpg' },
    { label: 'Catering buffet', src: '/assets/catering-buffet.jpg' },
    { label: 'Shop interior', src: '/assets/shop-interior.jpg' },
    { label: 'Shop exterior', src: '/images/visit/northfield-storefront-front.jpg' },
    { label: 'The Depot', src: '/shops/winnetka.png' },
    { label: 'Butcher at work', src: '/assets/store-butcher-front.jpg' },
    { label: 'Packaging suite', src: '/assets/identity/butcher-complete-packaging-suite-10-icons.jpg' },
];

type Ctx = { photo: string; icon: string };

/** Editable text: click on a template and type before downloading. */
function T({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <span contentEditable suppressContentEditableWarning spellCheck={false} className={s.edit} style={style}>
            {children}
        </span>
    );
}

/* ── canvas: renders at true pixel size, preview is scaled ── */
function Canvas({ name, w, h, preview = 320, svgHref, children }: { name: string; w: number; h: number; preview?: number; svgHref?: string; children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [busy, setBusy] = useState(false);
    const [postMsg, setPostMsg] = useState<string | null>(null);
    const { verifier, verifiedMap, toggleVerify } = useContext(VerifyCtx);
    const vInfo = verifiedMap[name];
    const scale = preview / w;

    const download = async () => {
        if (!ref.current) return;
        setBusy(true);
        try {
            const url = await toPng(ref.current, { width: w, height: h, pixelRatio: 1, cacheBust: true });
            const a = document.createElement('a');
            a.href = url;
            a.download = `hofherr-${name}-${w}x${h}.png`;
            a.click();
        } finally {
            setBusy(false);
        }
    };

    const printAsset = async () => {
        if (!ref.current) return;
        setBusy(true);
        try {
            const url = await toPng(ref.current, { width: w, height: h, pixelRatio: 1, cacheBust: true });
            const win = window.open('', '_blank', 'width=900,height=1050');
            if (!win) {
                window.print();
                return;
            }
            win.document.write(`<!doctype html>
<html>
<head>
    <title>Hofherr Print Proof — ${name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 24px; color: #1C1614; background: #fff; text-align: center; }
        .head { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #8B0A10; padding-bottom: 10px; margin-bottom: 16px; text-align: left; }
        .title { font-size: 20px; font-weight: 900; color: #8B0A10; text-transform: uppercase; }
        img { max-width: 100%; max-height: 8.2in; object-fit: contain; border: 2px solid #1C1614; }
        .foot { margin-top: 14px; border: 2px dashed #8B0A10; padding: 10px 14px; display: flex; justify-content: space-between; font-size: 12px; }
    </style>
</head>
<body>
    <div class="head">
        <div>
            <div class="title">HOFHERR MEAT CO. · 1:1 PRINT &amp; SOCIAL PROOF</div>
            <div style="font-size:12px;color:#555;">Asset: ${name} (${w} × ${h} px)</div>
        </div>
        <div style="font-size:12px;font-weight:700;color:${vInfo ? '#1a7f37' : '#8B0A10'};">
            ${vInfo ? `✓ VERIFIED BY ${vInfo.by.toUpperCase()}` : '⏳ PENDING PERSON VERIFICATION'}
        </div>
    </div>
    <img src="${url}" alt="${name}" />
    <div class="foot">
        <span><b>Verified By:</b> ${vInfo?.by || verifier || '__________________'}</span>
        <span><b>Auto-Post Status:</b> ${vInfo ? '✓ Approved & Queued' : 'Needs Review'}</span>
        <span><b>Hofherr Meat Co. · (847) 441-MEAT</b></span>
    </div>
    <script>window.onload = () => { setTimeout(() => window.print(), 200); };</script>
</body>
</html>`);
            win.document.close();
        } finally {
            setBusy(false);
        }
    };

    const postAsset = () => {
        if (!vInfo) {
            toggleVerify(name);
        }
        setPostMsg(`✓ Verified by ${verifier} & queued for auto-post (IG · FB · X)`);
        setTimeout(() => setPostMsg(null), 4000);
    };

    return (
        <figure className={`${s.asset} ${vInfo ? s.assetVerified : ''}`}>
            <div className={s.previewBox} style={{ width: preview, height: h * scale }}>
                <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: w, height: h }}>
                    <div ref={ref} style={{ width: w, height: h, position: 'relative', overflow: 'hidden', fontFamily: BODY }}>
                        {children}
                    </div>
                </div>
            </div>
            <figcaption className={s.cap}>
                <span className={s.capName}>
                    <span>{name.replace(/-/g, ' ')}</span>
                    {vInfo && <span className={s.badgeVerified}>✓ Verified ({vInfo.by})</span>}
                </span>
                <span className={s.capSize}>{w} × {h}</span>
                {svgHref && (
                    <a href={svgHref} download={`hofherr-${name}.svg`} className={s.dl}>
                        ⬇ SVG
                    </a>
                )}
                <button type="button" className={s.dl} onClick={download} data-download disabled={busy}>
                    {busy ? '…' : '⬇ PNG'}
                </button>
                <button type="button" className={s.dl} onClick={printAsset} disabled={busy}>
                    🖨 Print
                </button>
                <button
                    type="button"
                    className={vInfo ? s.dlVerified : s.dlVerify}
                    onClick={() => toggleVerify(name)}
                >
                    {vInfo ? '✓ Verified' : '✓ Verify'}
                </button>
                <button type="button" className={s.dlPost} onClick={postAsset}>
                    🚀 Post
                </button>
            </figcaption>
            {postMsg && <p className={s.toastMsg}>{postMsg}</p>}
        </figure>
    );
}

/* ── shared pieces ─────────────────────────────────── */
const fill: React.CSSProperties = { position: 'absolute', inset: 0 };
function Photo({ src, dim = 0.55 }: { src: string; dim?: number }) {
    return (
        <>
            <img src={src} alt="" style={{ ...fill, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ ...fill, background: `linear-gradient(180deg, rgba(28,22,20,${dim * 0.5}) 0%, rgba(28,22,20,${dim}) 55%, rgba(28,22,20,0.92) 100%)` }} />
        </>
    );
}
function Logo({ size }: { size: number }) {
    return <img src={LOGO} alt="Hofherr" style={{ height: size, width: 'auto', display: 'block' }} />;
}
function Flame({ src, size }: { src: string; size: number }) {
    return <img src={src} alt="" style={{ width: size, height: size, objectFit: 'contain', display: 'block' }} />;
}
function Kicker({ children, size = 30 }: { children: React.ReactNode; size?: number }) {
    return (
        <div style={{ display: 'inline-block', background: C.amber, color: C.charcoal, fontFamily: HEAD, fontWeight: 700, fontSize: size, letterSpacing: '.12em', padding: `${size * 0.25}px ${size * 0.6}px`, textTransform: 'uppercase' }}>
            {children}
        </div>
    );
}
function Footer({ size = 26, dark = false }: { size?: number; dark?: boolean }) {
    return (
        <div style={{ position: 'absolute', left: 60, right: 60, bottom: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: dark ? C.charcoal : C.cream, fontSize: size, letterSpacing: '.06em' }}>
            {dark ? <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: size * 1.6, color: C.crimson }}>HOFHERR MEAT CO.</span> : <Logo size={size * 3.2} />}
            <span style={{ textAlign: 'right', lineHeight: 1.4 }}>{HANDLE}<br /><span style={{ color: dark ? C.crimson : C.amber }}>Northfield · Winnetka Depot</span></span>
        </div>
    );
}
function Border({ color = C.amber, inset = 28 }: { color?: string; inset?: number }) {
    return <div style={{ position: 'absolute', inset, border: `3px solid ${color}`, pointerEvents: 'none' }} />;
}
function StickerGuide({ top, label, color = 'rgba(245,155,26,.6)' }: { top: number; label: string; color?: string }) {
    return <div style={{ position: 'absolute', left: 140, right: 140, top, height: 200, border: `3px dashed ${color}`, color, display: 'grid', placeItems: 'center', fontSize: 30 }}>{label}</div>;
}

/* ── profile & covers ─────────────────────────────── */
function ProfileSet({ ctx }: { ctx: Ctx }) {
    return (
        <>
            <Canvas name="fb-profile-set-1-wrapping-paper" w={1080} h={1080} preview={220} svgHref="/assets/identity/apps/fb-profile-wrapping-paper.svg">
                <img src="/assets/identity/apps/fb-profile-wrapping-paper.svg" alt="Facebook Profile Set 1 — Wrapping Paper & Bull Seal" className={s.fullSvgCanvas} />
            </Canvas>
            <Canvas name="fb-profile-set-2-crimson-crest" w={1080} h={1080} preview={220} svgHref="/assets/identity/apps/fb-profile-crimson-badge.svg">
                <img src="/assets/identity/apps/fb-profile-crimson-badge.svg" alt="Facebook Profile Set 2 — Oxblood Crimson Crest" className={s.fullSvgCanvas} />
            </Canvas>
            <Canvas name="fb-profile-set-3-charcoal-seal" w={1080} h={1080} preview={220} svgHref="/assets/identity/apps/fb-profile-charcoal-seal.svg">
                <img src="/assets/identity/apps/fb-profile-charcoal-seal.svg" alt="Facebook Profile Set 3 — Smokehouse Charcoal Seal" className={s.fullSvgCanvas} />
            </Canvas>
            <Canvas name="profile-ig-wrapping-paper" w={1080} h={1080} preview={220} svgHref="/assets/identity/apps/ig-avatar-wrapping-paper.svg">
                <img src="/assets/identity/apps/ig-avatar-wrapping-paper.svg" alt="@hofherrmeatco Wrapping Paper Avatar" className={s.fullSvgCanvas} />
            </Canvas>
            <Canvas name="profile-ios-android-app-icon" w={1024} h={1024} preview={220} svgHref="/assets/identity/hofherr-app-icon.svg">
                <img src="/assets/identity/hofherr-app-icon.svg" alt="Hofherr App Icon" className={s.fullSvgCanvas} />
            </Canvas>
            <Canvas name="profile-logo-charcoal" w={1080} h={1080} preview={220}>
                <div style={{ ...fill, background: C.charcoal, display: 'grid', placeItems: 'center' }}><Logo size={560} /></div>
            </Canvas>
            <Canvas name="profile-logo-crimson" w={1080} h={1080} preview={220}>
                <div style={{ ...fill, background: C.crimson, display: 'grid', placeItems: 'center' }}><Logo size={560} /></div>
            </Canvas>
            <Canvas name="profile-flame" w={1080} h={1080} preview={220}>
                <div style={{ ...fill, background: C.amber, display: 'grid', placeItems: 'center' }}><Flame src={ctx.icon} size={1000} /></div>
            </Canvas>
            <Canvas name="profile-stamp-charcoal" w={1080} h={1080} preview={220} svgHref="/assets/identity/hofherr-stamp-circular-dark.svg">
                <div style={{ ...fill, background: C.charcoal, display: 'grid', placeItems: 'center' }}>
                    <Flame src="/assets/identity/hofherr-stamp-circular-dark.svg" size={960} />
                </div>
            </Canvas>
            <Canvas name="profile-stamp-cream" w={1080} h={1080} preview={220} svgHref="/assets/identity/hofherr-stamp-circular.svg">
                <div style={{ ...fill, background: C.cream, display: 'grid', placeItems: 'center' }}>
                    <Flame src="/assets/identity/hofherr-stamp-circular.svg" size={920} />
                </div>
            </Canvas>
            <Canvas name="profile-stamp-crimson" w={1080} h={1080} preview={220} svgHref="/assets/identity/hofherr-stamp-circular-crimson.svg">
                <div style={{ ...fill, background: C.crimson, display: 'grid', placeItems: 'center' }}>
                    <Flame src="/assets/identity/hofherr-stamp-circular-crimson.svg" size={960} />
                </div>
            </Canvas>
            <Canvas name="profile-stamp-amber" w={1080} h={1080} preview={220} svgHref="/assets/identity/hofherr-stamp-circular.svg">
                <div style={{ ...fill, background: C.amber, display: 'grid', placeItems: 'center' }}>
                    <Flame src="/assets/identity/hofherr-stamp-circular.svg" size={920} />
                </div>
            </Canvas>
            <Canvas name="stamp-option-1-bold-sans" w={1080} h={1080} preview={220} svgHref="/assets/identity/stamp-option-1.svg">
                <div style={{ ...fill, background: C.cream, display: 'grid', placeItems: 'center' }}>
                    <Flame src="/assets/identity/stamp-option-1.svg" size={920} />
                </div>
            </Canvas>
            <Canvas name="stamp-option-2-kraft-press" w={1080} h={1080} preview={220} svgHref="/assets/identity/stamp-option-2.svg">
                <div style={{ ...fill, background: C.kraft, display: 'grid', placeItems: 'center' }}>
                    <Flame src="/assets/identity/stamp-option-2.svg" size={920} />
                </div>
            </Canvas>
            <Canvas name="stamp-option-3-impact-display" w={1080} h={1080} preview={220} svgHref="/assets/identity/stamp-option-3.svg">
                <div style={{ ...fill, background: C.cream, display: 'grid', placeItems: 'center' }}>
                    <Flame src="/assets/identity/stamp-option-3.svg" size={920} />
                </div>
            </Canvas>
            <Canvas name="stamp-option-4-slab-serif" w={1080} h={1080} preview={220} svgHref="/assets/identity/stamp-option-4.svg">
                <div style={{ ...fill, background: C.cream, display: 'grid', placeItems: 'center' }}>
                    <Flame src="/assets/identity/stamp-option-4.svg" size={920} />
                </div>
            </Canvas>
            <Canvas name="stamp-option-5-distressed-ink" w={1080} h={1080} preview={220} svgHref="/assets/identity/stamp-option-5.svg">
                <div style={{ ...fill, background: C.cream, display: 'grid', placeItems: 'center' }}>
                    <Flame src="/assets/identity/stamp-option-5.svg" size={920} />
                </div>
            </Canvas>
        </>
    );
}

function Cover({ name, w, h, ctx }: { name: string; w: number; h: number; ctx: Ctx }) {
    const u = h / 100;
    return (
        <Canvas name={name} w={w} h={h} preview={460}>
            <Photo src={ctx.photo} dim={0.5} />
            <div style={{ ...fill, background: `linear-gradient(90deg, ${C.charcoal} 0%, rgba(28,22,20,.85) 38%, rgba(28,22,20,0) 75%)` }} />
            {/* text kept in the centre-safe band: platforms crop edges and overlay the avatar bottom-left */}
            <div style={{ position: 'absolute', left: w * 0.2, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: u * 4, color: C.cream }}>
                <Logo size={u * 26} />
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: u * 13, lineHeight: 0.95, textTransform: 'uppercase' }}>Cut to order since 2018</T>
                <T style={{ fontSize: u * 4.6, color: C.amber, letterSpacing: '.12em', textTransform: 'uppercase' }}>Butcher Shop · Northfield &nbsp;|&nbsp; The Depot · Winnetka</T>
            </div>
        </Canvas>
    );
}

/* ── cooking content 1080 × 1350 ──────────────────── */
function HowToCover({ h, ctx }: { h: (typeof HOW_TOS)[number]; ctx: Ctx }) {
    return (
        <Canvas name={`howto-${h.slug}-1-cover`} w={1080} h={1350}>
            <Photo src={ctx.photo} />
            <Border />
            <div style={{ position: 'absolute', left: 80, right: 80, top: 100 }}><Kicker>{h.kicker}</Kicker></div>
            <div style={{ position: 'absolute', left: 80, right: 80, bottom: 260, color: C.cream, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 150, lineHeight: 0.88, textTransform: 'uppercase' }}>{h.title}</T>
                <T style={{ fontSize: 38, color: C.amber, letterSpacing: '.08em' }}>{h.steps.length} STEPS · SWIPE →</T>
            </div>
            <Footer />
        </Canvas>
    );
}

function HowToSteps({ h, ctx }: { h: (typeof HOW_TOS)[number]; ctx: Ctx }) {
    return (
        <Canvas name={`howto-${h.slug}-2-steps`} w={1080} h={1350}>
            <div style={{ ...fill, background: C.cream }} />
            <div style={{ ...fill, borderTop: `36px solid ${C.crimson}` }} />
            <div style={{ position: 'absolute', left: 80, right: 80, top: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 30 }}>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 88, lineHeight: 0.92, color: C.crimson, textTransform: 'uppercase' }}>{h.title}</T>
                <Flame src={ctx.icon} size={190} />
            </div>
            <div style={{ position: 'absolute', left: 80, right: 80, top: 360, display: 'flex', flexDirection: 'column', gap: 30 }}>
                {h.steps.map((step, i) => (
                    <div key={step} style={{ display: 'flex', gap: 30, alignItems: 'flex-start' }}>
                        <span style={{ flex: 'none', width: 86, height: 86, borderRadius: '50%', background: C.crimson, color: C.cream, fontFamily: HEAD, fontWeight: 700, fontSize: 54, display: 'grid', placeItems: 'center' }}>{i + 1}</span>
                        <T style={{ fontSize: 40, lineHeight: 1.3, color: C.charcoal, paddingTop: 10 }}>{step}</T>
                    </div>
                ))}
            </div>
            <Footer dark />
        </Canvas>
    );
}

function TriviaQ({ t, ctx }: { t: (typeof TRIVIA)[number]; ctx: Ctx }) {
    return (
        <Canvas name={`trivia-${t.slug}-1-question`} w={1080} h={1350}>
            <div style={{ ...fill, background: C.crimson }} />
            <Border color={C.cream} />
            <div style={{ position: 'absolute', left: 100, right: 100, top: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50, color: C.cream, textAlign: 'center' }}>
                <Kicker size={36}>Butcher trivia</Kicker>
                <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 260, lineHeight: 0.8, color: C.amber }}>?</span>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 104, lineHeight: 0.98, textTransform: 'uppercase' }}>{t.q}</T>
                <T style={{ fontSize: 36, color: '#f0c9a0' }}>Comment your answer · swipe to find out →</T>
            </div>
            <Footer />
        </Canvas>
    );
}

function TriviaA({ t, ctx }: { t: (typeof TRIVIA)[number]; ctx: Ctx }) {
    return (
        <Canvas name={`trivia-${t.slug}-2-answer`} w={1080} h={1350}>
            <div style={{ ...fill, background: C.charcoal }} />
            <div style={{ position: 'absolute', left: 100, right: 100, top: 130, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 44, color: C.cream }}>
                <Flame src={ctx.icon} size={220} />
                <Kicker size={36}>The answer</Kicker>
                <T style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 82, lineHeight: 1.04, textTransform: 'uppercase' }}>{t.a}</T>
            </div>
            <Footer />
        </Canvas>
    );
}

function TrickPost({ t, ctx }: { t: (typeof TRICKS)[number]; ctx: Ctx }) {
    return (
        <Canvas name={`trick-${t.slug}`} w={1080} h={1350}>
            <div style={{ ...fill, background: C.amber }} />
            <div style={{ position: 'absolute', left: 90, right: 90, top: 110, display: 'flex', flexDirection: 'column', gap: 40, color: C.charcoal }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'inline-block', background: C.charcoal, color: C.amber, fontFamily: HEAD, fontWeight: 700, fontSize: 36, letterSpacing: '.12em', padding: '9px 22px', textTransform: 'uppercase' }}>Kitchen trick</span>
                    <Flame src={ctx.icon} size={200} />
                </div>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 132, lineHeight: 0.88, color: C.crimson, textTransform: 'uppercase' }}>{t.title}</T>
                <T style={{ fontSize: 46, lineHeight: 1.4 }}>{t.body}</T>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 170, background: C.charcoal }} />
            <Footer />
        </Canvas>
    );
}

function DonenessChart() {
    return (
        <Canvas name="doneness-temp-chart" w={1080} h={1350}>
            <div style={{ ...fill, background: C.charcoal }} />
            <div style={{ position: 'absolute', left: 80, right: 80, top: 90, color: C.cream, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
                <Kicker>Save this</Kicker>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 116, lineHeight: 0.9, textTransform: 'uppercase' }}>Steak doneness<br />by temperature</T>
            </div>
            <div style={{ position: 'absolute', left: 80, right: 80, top: 420, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {DONENESS.map((d) => (
                    <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 28, background: 'rgba(243,234,216,.06)', padding: '12px 24px', borderLeft: `18px solid ${d.color}` }}>
                        <span style={{ flex: 1, fontFamily: HEAD, fontWeight: 600, fontSize: 60, color: C.cream, textTransform: 'uppercase' }}>{d.label}</span>
                        <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 60, color: C.amber }}>{d.temp}</span>
                    </div>
                ))}
            </div>
            <div style={{ position: 'absolute', left: 80, right: 80, top: 1075, color: '#cdbfa8', fontSize: 27, lineHeight: 1.45 }}>
                Pull 5°F early — it keeps cooking while it rests. USDA safe minimum for whole cuts: 145°F + 3-min rest.
            </div>
            <Footer />
        </Canvas>
    );
}

/* ── feed posts 1080 × 1350 ───────────────────────── */
function PostSpecials({ ctx }: { ctx: Ctx }) {
    return (
        <Canvas name="post-weekly-specials" w={1080} h={1350}>
            <Photo src={ctx.photo} />
            <Border />
            <div style={{ position: 'absolute', left: 80, right: 80, top: 90 }}><Kicker>This week at the block</Kicker></div>
            <div style={{ position: 'absolute', left: 80, right: 80, bottom: 230, color: C.cream, display: 'flex', flexDirection: 'column', gap: 18 }}>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 150, lineHeight: 0.9, textTransform: 'uppercase' }}>Dry-aged ribeye</T>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
                    <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 110, color: C.amber }}>$29.99</T>
                    <T style={{ fontSize: 36, letterSpacing: '.1em' }}>/ LB · THRU SUNDAY</T>
                </div>
            </div>
            <Footer />
        </Canvas>
    );
}

function PostMenu({ ctx }: { ctx: Ctx }) {
    const rows = [['Dry-aged ribeye', '$29.99/lb'], ['Berkshire pork chops', '$12.99/lb'], ['Rotisserie chicken', '$14.99 ea'], ['Italian beef sandwich', '$13.50'], ['24-hr bone broth (qt)', '$11.00']];
    return (
        <Canvas name="post-specials-menu" w={1080} h={1350}>
            <div style={{ ...fill, background: C.cream }} />
            <div style={{ ...fill, borderTop: `40px solid ${C.crimson}` }} />
            <div style={{ position: 'absolute', left: 90, right: 90, top: 120, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 120, lineHeight: 0.9, color: C.crimson, textTransform: 'uppercase' }}>Weekly<br />Specials</T>
                <Flame src={ctx.icon} size={260} />
            </div>
            <div style={{ position: 'absolute', left: 90, right: 90, top: 470, display: 'flex', flexDirection: 'column' }}>
                {rows.map(([a, b]) => (
                    <div key={a} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `3px dashed ${C.crimson}`, padding: '26px 0', color: C.charcoal }}>
                        <T style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 62, textTransform: 'uppercase' }}>{a}</T>
                        <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 58, color: C.crimson }}>{b}</T>
                    </div>
                ))}
            </div>
            <Footer dark />
        </Canvas>
    );
}

function PostNewCut({ ctx }: { ctx: Ctx }) {
    return (
        <Canvas name="post-new-cut" w={1080} h={1350}>
            <div style={{ ...fill, background: C.charcoal }} />
            <img src={ctx.photo} alt="" style={{ position: 'absolute', left: 0, right: 0, top: 0, width: '100%', height: 820, objectFit: 'cover' }} />
            <div style={{ position: 'absolute', left: 60, top: 60 }}><Kicker>New on the block</Kicker></div>
            <div style={{ position: 'absolute', right: 50, top: 700 }}><Flame src={ctx.icon} size={230} /></div>
            <div style={{ position: 'absolute', left: 70, right: 300, top: 880, color: C.cream, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 120, lineHeight: 0.9, textTransform: 'uppercase' }}>Picanha</T>
                <T style={{ fontSize: 34, lineHeight: 1.4, color: '#d9cdb8' }}>The top sirloin cap — fat on, cut thick, made for the grill.</T>
            </div>
            <Footer />
        </Canvas>
    );
}

function PostEvent({ ctx }: { ctx: Ctx }) {
    return (
        <Canvas name="post-event-catering" w={1080} h={1350}>
            <Photo src={ctx.photo} dim={0.65} />
            <Border />
            <div style={{ position: 'absolute', left: 80, right: 80, top: 110, color: C.cream, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 30 }}>
                <Kicker>Catering · Whole hog</Kicker>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 140, lineHeight: 0.88, textTransform: 'uppercase' }}>We bring<br />the fire.</T>
            </div>
            <div style={{ position: 'absolute', left: 80, right: 80, bottom: 220, display: 'flex', gap: 30 }}>
                {['Pig roasts', 'BBQ trays', 'Grad parties'].map((t) => (
                    <T key={t} style={{ flex: 1, border: `3px solid ${C.amber}`, color: C.cream, fontFamily: HEAD, fontSize: 44, textAlign: 'center', padding: '20px 0', textTransform: 'uppercase' }}>{t}</T>
                ))}
            </div>
            <Footer />
        </Canvas>
    );
}

function PostHoliday({ ctx }: { ctx: Ctx }) {
    return (
        <Canvas name="post-holiday-preorder" w={1080} h={1350}>
            <div style={{ ...fill, background: C.charcoal }} />
            <div style={{ position: 'absolute', left: 90, right: 90, top: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, color: C.cream, textAlign: 'center' }}>
                <Flame src={ctx.icon} size={280} />
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: C.amber, letterSpacing: '.14em', textTransform: 'uppercase' }}>Holiday pre-orders open</T>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 130, lineHeight: 0.9, textTransform: 'uppercase' }}>Prime rib.<br />Turkeys. Hams.</T>
                <T style={{ fontSize: 36, lineHeight: 1.4 }}>Reserve by [date] · Pick up [dates]<br />Order in store or call (847) 441-MEAT</T>
            </div>
            <Footer />
        </Canvas>
    );
}

function PostReview() {
    return (
        <Canvas name="post-customer-review" w={1080} h={1350}>
            <div style={{ ...fill, background: C.charcoal }} />
            <div style={{ position: 'absolute', left: 100, right: 100, top: 150, color: C.cream, display: 'flex', flexDirection: 'column', gap: 40 }}>
                <span style={{ fontSize: 90, color: C.amber, letterSpacing: '.1em' }}>★★★★★</span>
                <T style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 96, lineHeight: 1.02, textTransform: 'uppercase' }}>&ldquo;Paste a real customer review here.&rdquo;</T>
                <T style={{ fontSize: 36, color: C.amber }}>— Customer name, Google review</T>
            </div>
            <Footer />
        </Canvas>
    );
}

function PostHiring() {
    return (
        <Canvas name="post-now-hiring" w={1080} h={1350}>
            <div style={{ ...fill, background: C.amber }} />
            <div style={{ position: 'absolute', left: 90, right: 90, top: 120, color: C.charcoal, display: 'flex', flexDirection: 'column', gap: 34 }}>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 190, lineHeight: 0.85, color: C.crimson, textTransform: 'uppercase' }}>Now<br />hiring</T>
                <T style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 70, textTransform: 'uppercase' }}>Butchers · Counter staff · BBQ crew</T>
                <T style={{ fontSize: 38, lineHeight: 1.45 }}>Learn the trade from people who still break down whole animals. Full & part time, Northfield and Winnetka.</T>
                <T style={{ fontFamily: HEAD, fontSize: 52, color: C.crimson, textTransform: 'uppercase' }}>Apply: hofherrmeatco.com/jobs</T>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 170, background: C.charcoal }} />
            <Footer />
        </Canvas>
    );
}

function PostNotice() {
    return (
        <Canvas name="post-hours-notice" w={1080} h={1350}>
            <div style={{ ...fill, background: C.cream }} />
            <Border color={C.crimson} />
            <div style={{ position: 'absolute', left: 100, right: 100, top: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, textAlign: 'center', color: C.charcoal }}>
                <Kicker>Heads up</Kicker>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 140, lineHeight: 0.9, color: C.crimson, textTransform: 'uppercase' }}>Closed Thanksgiving Day</T>
                <T style={{ fontSize: 40, lineHeight: 1.5 }}>Open Wednesday [hours]<br />Back Friday at [time]</T>
            </div>
            <Footer dark />
        </Canvas>
    );
}

/* ── stories 1080 × 1920 ──────────────────────────── */
function StorySpecial({ ctx }: { ctx: Ctx }) {
    return (
        <Canvas name="story-fresh-today" w={1080} h={1920} preview={220}>
            <Photo src={ctx.photo} />
            <div style={{ position: 'absolute', left: 80, right: 80, top: 260 }}><Kicker size={40}>Fresh today</Kicker></div>
            <div style={{ position: 'absolute', left: 80, right: 80, bottom: 560, color: C.cream, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 170, lineHeight: 0.88, textTransform: 'uppercase' }}>Smoked brisket</T>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 120, color: C.amber }}>$24.99/lb</T>
            </div>
            <StickerGuide top={1420} label="LINK STICKER HERE" />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 130, display: 'flex', justifyContent: 'center' }}><Logo size={110} /></div>
        </Canvas>
    );
}

function StoryPoll({ ctx }: { ctx: Ctx }) {
    return (
        <Canvas name="story-this-or-that" w={1080} h={1920} preview={220}>
            <div style={{ ...fill, background: C.crimson }} />
            <div style={{ position: 'absolute', left: 80, right: 80, top: 260, color: C.cream, textAlign: 'center' }}>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 150, lineHeight: 0.9, textTransform: 'uppercase' }}>This<br />or that?</T>
            </div>
            <div style={{ position: 'absolute', left: 80, right: 80, top: 700, display: 'flex', gap: 40 }}>
                {[
                    { src: ctx.icon, label: 'Ribeye' },
                    { src: FLAME_STICKERS[1].src, label: 'Pork chop' },
                ].map((choice) => (
                    <div key={choice.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                        <Flame src={choice.src} size={380} />
                        <T style={{ fontFamily: HEAD, fontSize: 70, color: C.cream, textTransform: 'uppercase' }}>{choice.label}</T>
                    </div>
                ))}
            </div>
            <StickerGuide top={1340} label="POLL STICKER HERE" color="rgba(243,234,216,.6)" />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 130, display: 'flex', justifyContent: 'center' }}><Logo size={110} /></div>
        </Canvas>
    );
}

function StoryQuiz({ ctx }: { ctx: Ctx }) {
    return (
        <Canvas name="story-trivia-quiz" w={1080} h={1920} preview={220}>
            <div style={{ ...fill, background: C.charcoal }} />
            <div style={{ position: 'absolute', left: 80, right: 80, top: 260, color: C.cream, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44, textAlign: 'center' }}>
                <Flame src={ctx.icon} size={300} />
                <Kicker size={40}>Butcher trivia</Kicker>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 120, lineHeight: 0.92, textTransform: 'uppercase' }}>{TRIVIA[0].q}</T>
            </div>
            <StickerGuide top={1300} label="QUIZ STICKER HERE" />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 130, display: 'flex', justifyContent: 'center' }}><Logo size={110} /></div>
        </Canvas>
    );
}

function StoryDeadline({ ctx }: { ctx: Ctx }) {
    return (
        <Canvas name="story-order-deadline" w={1080} h={1920} preview={220}>
            <div style={{ ...fill, background: C.charcoal }} />
            <div style={{ position: 'absolute', left: 80, right: 80, top: 300, color: C.cream, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50, textAlign: 'center' }}>
                <Flame src={ctx.icon} size={360} />
                <Kicker size={40}>Last call</Kicker>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 150, lineHeight: 0.9, textTransform: 'uppercase' }}>Order by Thursday</T>
                <T style={{ fontSize: 46, lineHeight: 1.4, color: C.amber }}>Weekend pick-up · Northfield & The Depot</T>
            </div>
            <StickerGuide top={1360} label="COUNTDOWN STICKER HERE" />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 130, display: 'flex', justifyContent: 'center' }}><Logo size={110} /></div>
        </Canvas>
    );
}

function StoryBehind({ ctx }: { ctx: Ctx }) {
    return (
        <Canvas name="story-behind-the-block" w={1080} h={1920} preview={220}>
            <Photo src={ctx.photo} dim={0.4} />
            <div style={{ position: 'absolute', left: 80, right: 80, top: 250, color: C.cream, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 30 }}>
                <Kicker size={40}>Behind the block</Kicker>
                <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 130, lineHeight: 0.9, textTransform: 'uppercase' }}>Breaking down a whole steer</T>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 130, display: 'flex', justifyContent: 'center' }}><Logo size={110} /></div>
        </Canvas>
    );
}

/* ── highlight covers ─────────────────────────────── */
const HIGHLIGHTS = [
    { name: 'specials', label: 'Specials', icon: 0 },
    { name: 'how-to', label: 'How-to', icon: 1 },
    { name: 'trivia', label: 'Trivia', icon: 2 },
    { name: 'catering', label: 'Catering', icon: 10 },
    { name: 'cuts', label: 'Cuts', icon: 3 },
    { name: 'reviews', label: 'Reviews', icon: 4 },
    { name: 'visit', label: 'Visit', icon: 5 },
];
function Highlights() {
    return (
        <>
            {HIGHLIGHTS.map((h) => (
                <Canvas key={h.name} name={`highlight-${h.name}`} w={1080} h={1920} preview={130}>
                    <div style={{ ...fill, background: C.charcoal, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 60 }}>
                        <div style={{ width: 760, height: 760, borderRadius: '50%', background: C.crimson, display: 'grid', placeItems: 'center' }}>
                            <Flame src={FLAME_STICKERS[h.icon % FLAME_STICKERS.length].src} size={640} />
                        </div>
                        <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 110, color: C.cream, textTransform: 'uppercase', letterSpacing: '.08em' }}>{h.label}</span>
                    </div>
                </Canvas>
            ))}
        </>
    );
}

/* ── copy library ─────────────────────────────────── */
function CopyBlock({ title, text, limit }: { title: string; text: string; limit?: number }) {
    const [done, setDone] = useState(false);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setDone(true);
            setTimeout(() => setDone(false), 1400);
        } catch {
            /* clipboard blocked — text is still selectable */
        }
    };
    return (
        <div className={s.copyCard}>
            <div className={s.copyHead}>
                <b>{title}</b>
                {limit && <span className={text.length > limit ? s.over : s.count}>{text.length}/{limit}</span>}
                <button type="button" className={s.dl} onClick={copy}>{done ? '✓ Copied' : 'Copy'}</button>
            </div>
            <pre className={s.copyText}>{text}</pre>
        </div>
    );
}


/* ── know your cuts (per animal) ──────────────────── */
function ChartImage({ a }: { a: Animal }) {
    const [missing, setMissing] = useState(false);
    if (missing) {
        return (
            <div style={{ ...fill, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 80, textAlign: 'center', border: `6px dashed ${C.crimson}`, color: C.crimson }}>
                <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 70, textTransform: 'uppercase' }}>{a.name} cut chart</span>
                <span style={{ fontSize: 30, color: C.charcoal }}>Generate with Nano Banana (copy the prompt below) and save as</span>
                <code style={{ fontSize: 28, color: C.charcoal }}>public{a.chartSrc}</code>
            </div>
        );
    }
    return <img src={`${a.chartSrc}?v=woodcut`} alt={`${a.name} cut chart`} onError={() => setMissing(true)} style={{ ...fill, width: '100%', height: '100%', objectFit: 'contain' }} />;
}

function CutChartPost({ a }: { a: Animal }) {
    return (
        <Canvas name={`cuts-${a.slug}-1-chart`} w={1080} h={1350} svgHref={a.chartSrc}>
            <div style={{ ...fill, background: C.cream }} />
            <div style={{ position: 'absolute', left: 40, right: 40, top: 40, bottom: 150 }}><ChartImage a={a} /></div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, background: C.charcoal }} />
            <Footer />
        </Canvas>
    );
}

function CutGuidePost({ a, icon }: { a: Animal; icon: string }) {
    return (
        <Canvas name={`cuts-${a.slug}-2-guide`} w={1080} h={1350}>
            <div style={{ ...fill, background: C.charcoal }} />
            <div style={{ position: 'absolute', left: 80, right: 80, top: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
                    <Kicker>Know your cuts</Kicker>
                    <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 130, lineHeight: 0.88, color: C.cream, textTransform: 'uppercase' }}>{a.name}</T>
                </div>
                <Flame src={icon} size={210} />
            </div>
            <div style={{ position: 'absolute', left: 80, right: 80, top: 390, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {a.primals.map((p) => (
                    <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 24, alignItems: 'baseline', borderBottom: '2px solid rgba(245,155,26,.35)', paddingBottom: 14 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <T style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 52, color: C.amber, textTransform: 'uppercase', lineHeight: 1 }}>{p.name}</T>
                            <T style={{ fontSize: 24, color: '#cdbfa8', letterSpacing: '.06em', textTransform: 'uppercase' }}>{p.where}</T>
                        </div>
                        <T style={{ fontSize: 34, color: C.cream, lineHeight: 1.3 }}>{p.bestFor}</T>
                    </div>
                ))}
            </div>
            <Footer />
        </Canvas>
    );
}

function CutFactPost({ a, fact, i, icon }: { a: Animal; fact: string; i: number; icon: string }) {
    return (
        <Canvas name={`cuts-${a.slug}-fact-${i + 1}`} w={1080} h={1350}>
            <div style={{ ...fill, background: i % 2 ? C.cream : C.crimson }} />
            <Border color={i % 2 ? C.crimson : C.cream} />
            <div style={{ position: 'absolute', left: 100, right: 100, top: 130, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 44, color: i % 2 ? C.charcoal : C.cream }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                    <Flame src={icon} size={170} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
                        <Kicker>Did you know?</Kicker>
                        <span style={{ fontFamily: HEAD, fontSize: 40, letterSpacing: '.1em', textTransform: 'uppercase' }}>{a.name} fact {i + 1} / {a.facts.length}</span>
                    </div>
                </div>
                <T style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 92, lineHeight: 1.02, textTransform: 'uppercase', color: i % 2 ? C.crimson : C.cream }}>{fact}</T>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 170, background: C.charcoal }} />
            <Footer />
        </Canvas>
    );
}

function PromptCopy({ a }: { a: Animal }) {
    return <CopyBlock title={`${a.name} cut chart — Nano Banana prompt`} text={a.chartPrompt} />;
}

/* ── page ─────────────────────────────────────────── */
const GROUPS = [
    { id: 'cuts', title: 'Know your cuts · beef, pork, lamb & chicken', note: 'A carousel per animal: cut chart → cut guide → "Did you know?" facts. Chart images are generated with Nano Banana — prompts with the correct label placement are under each set.' },
    { id: 'cooking', title: 'Cooking content · how-to, trivia & tricks', note: 'Your everyday posts. How-tos and trivia come as 2-slide carousels (cover/question first, steps/answer second). Click any text to rewrite it.' },
    { id: 'posts', title: 'Promo posts · 1080 × 1350 (4:5)', note: 'Specials, new cuts, catering, holidays, reviews, hiring and notices. Works on Instagram, Facebook, LinkedIn and X.' },
    { id: 'stories', title: 'Stories & Reels covers · 1080 × 1920 (9:16)', note: 'Dashed boxes show where to drop the platform sticker (link, poll, quiz, countdown) — place the sticker over the box.' },
    { id: 'highlights', title: 'Instagram highlight covers', note: 'Post as a story, then set as the highlight cover. Icons are centred to survive the circle crop.' },
    { id: 'profile', title: 'Profile pictures', note: 'Use the same one everywhere. Platforms crop to a circle — the mark stays inside the safe zone.' },
    { id: 'covers', title: 'Cover & banner images', note: 'Text sits in the centre-safe band so avatars and mobile crops do not cover it.' },
];

const SCHEDULE_ITEMS = [
    { key: 'cuts-beef-1-chart', day: 'Mon · Week 1', label: 'Know Your Cuts: Beef (Chart + Guide + Facts)', week: 1 },
    { key: 'post-weekly-specials', day: 'Tue · Week 1', label: 'Weekly Butcher Special: Dry-Aged Ribeye', week: 1 },
    { key: 'howto-reverse-sear-1-cover', day: 'Wed · Week 1', label: 'How-To Carousel: Reverse-Sear a Thick Steak', week: 1 },
    { key: 'trivia-porterhouse-1-question', day: 'Thu · Week 1', label: 'Butcher Trivia: Porterhouse vs. T-Bone', week: 1 },
    { key: 'trick-dry-brine', day: 'Fri · Week 1', label: 'Kitchen Trick: Salt It the Night Before', week: 1 },
    { key: 'story-fresh-today', day: 'Sat · Week 1', label: 'Weekend Story: Fresh Smoked Brisket', week: 1 },
    { key: 'doneness-temp-chart', day: 'Sun · Week 1', label: 'Sunday Saveable: Steak Doneness Temp Chart', week: 1 },
    { key: 'cuts-pork-1-chart', day: 'Mon · Week 2', label: 'Know Your Cuts: Heritage Pork Carousel', week: 2 },
    { key: 'post-specials-menu', day: 'Wed · Week 2', label: 'Weekly Specials Board Menu', week: 2 },
    { key: 'howto-spatchcock-1-cover', day: 'Fri · Week 2', label: 'How-To Carousel: Spatchcock a Chicken', week: 2 },
    { key: 'cuts-lamb-1-chart', day: 'Mon · Week 3', label: 'Know Your Cuts: Pasture Lamb Carousel', week: 3 },
    { key: 'post-new-cut', day: 'Wed · Week 3', label: 'New on the Block: Picanha Cap Steak', week: 3 },
    { key: 'howto-braise-1-cover', day: 'Fri · Week 3', label: 'How-To Carousel: Braise Any Tough Cut', week: 3 },
    { key: 'cuts-chicken-1-chart', day: 'Mon · Week 4', label: 'Know Your Cuts: Pasture Poultry Carousel', week: 4 },
    { key: 'post-event-catering', day: 'Wed · Week 4', label: 'Catering & Whole-Hog BBQ Feature', week: 4 },
    { key: 'trivia-boston-butt-1-question', day: 'Fri · Week 4', label: 'Butcher Trivia: Why Is It Called Boston Butt?', week: 4 },
];

export default function SocialKit({ embedded = false }: { embedded?: boolean }) {
    const [photo, setPhoto] = useState(PHOTOS[0].src);
    const [icon, setIcon] = useState(FLAME_STICKERS[0].src);
    const [animalsData, setAnimalsData] = useState<Animal[]>(ANIMALS);
    const [editingAnimalSlug, setEditingAnimalSlug] = useState<string>('beef');
    const [showCutEditor, setShowCutEditor] = useState<boolean>(true);
    const [verifier, setVerifier] = useState<string>('Sean Hofherr');
    const [horizon, setHorizon] = useState<'day' | 'week' | 'month'>('week');
    const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
    const [selectedWeekNum, setSelectedWeekNum] = useState<number>(1);
    const [verifiedMap, setVerifiedMap] = useState<Record<string, { by: string; at: string }>>({});
    const [statusBanner, setStatusBanner] = useState<string | null>(null);
    const ctx: Ctx = { photo, icon };

    useEffect(() => {
        try {
            const raw = localStorage.getItem(KIT_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed.animalsData) && parsed.animalsData.length > 0) setAnimalsData(parsed.animalsData);
                if (parsed.verifiedMap) setVerifiedMap(parsed.verifiedMap);
                if (parsed.verifier) setVerifier(parsed.verifier);
            }
        } catch {
            /* ignore */
        }
    }, []);

        const saveLocal = useCallback((nextAnimals: Animal[], nextVerified: Record<string, { by: string; at: string }>, nextVerifier: string) => {
            try {
                localStorage.setItem(
                    KIT_STORAGE_KEY,
                    JSON.stringify({ animalsData: nextAnimals, verifiedMap: nextVerified, verifier: nextVerifier })
                );
            } catch {
                /* ignore */
            }
    }, []);

        const toggleVerify = useCallback((name: string) => {
            const next = { ...verifiedMap };
            if (next[name]) {
                delete next[name];
            } else {
                next[name] = { by: verifier || 'Sean Hofherr', at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            }
            setVerifiedMap(next);
            saveLocal(animalsData, next, verifier);
    }, [animalsData, saveLocal, verifiedMap, verifier]);

    const verifyCtxValue = useMemo(
        () => ({ verifier, verifiedMap, toggleVerify }),
        [verifier, verifiedMap, toggleVerify]
    );

    const verifyBatch = (keys: string[], label: string) => {
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const next = { ...verifiedMap };
        keys.forEach((k) => {
            next[k] = { by: verifier || 'Sean Hofherr', at: nowStr };
        });
        setVerifiedMap(next);
        saveLocal(animalsData, next, verifier);
        setStatusBanner(`✓ Verified ${label} (${keys.length} posts) by ${verifier || 'Sean Hofherr'} — Armed for Automatic Posting!`);
    };

    const verifyByHorizon = () => {
        if (horizon === 'day') {
            const item = SCHEDULE_ITEMS[selectedDayIdx] ?? SCHEDULE_ITEMS[0];
            verifyBatch([item.key], `Day Post (${item.day})`);
        } else if (horizon === 'week') {
            const items = SCHEDULE_ITEMS.filter((x) => x.week === selectedWeekNum);
            verifyBatch(items.map((x) => x.key), `Week ${selectedWeekNum}`);
        } else {
            const allKeys = [
                ...SCHEDULE_ITEMS.map((x) => x.key),
                ...animalsData.flatMap((a) => [
                    `cuts-${a.slug}-1-chart`,
                    `cuts-${a.slug}-2-guide`,
                    ...a.facts.map((_, i) => `cuts-${a.slug}-fact-${i + 1}`),
                ]),
            ];
            verifyBatch(Array.from(new Set(allKeys)), 'Entire Month Schedule & Cut Guides');
        }
    };

        const downloadGroup = (id: string) => {
            const btns = document.querySelectorAll<HTMLButtonElement>(`#${id} [data-download]`);
            Array.from(btns).forEach((b, idx) => {
                setTimeout(() => b.click(), idx * 900);
            });
        };

        const activeEditAnimal = animalsData.find((a) => a.slug === editingAnimalSlug) ?? animalsData[0];

        const updateAnimalPrimals = (slug: string, rawLines: string) => {
            const primals = rawLines
                .split('\n')
                .filter((line) => line.trim())
                .map((line) => {
                    const [name = '', where = '', bestFor = ''] = line.split('|').map((s) => s.trim());
                    return { name, where, bestFor };
                });
            const next = animalsData.map((a) => (a.slug === slug ? { ...a, primals } : a));
            setAnimalsData(next);
            saveLocal(next, verifiedMap, verifier);
        };

        const updateAnimalFacts = (slug: string, rawLines: string) => {
            const facts = rawLines
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean);
            const next = animalsData.map((a) => (a.slug === slug ? { ...a, facts } : a));
            setAnimalsData(next);
            saveLocal(next, verifiedMap, verifier);
        };

        const visibleScheduleItems =
            horizon === 'day'
                ? [SCHEDULE_ITEMS[selectedDayIdx] ?? SCHEDULE_ITEMS[0]]
                : horizon === 'week'
                    ? SCHEDULE_ITEMS.filter((x) => x.week === selectedWeekNum)
                    : SCHEDULE_ITEMS;

        const Wrapper = embedded ? 'div' : 'main';

        return (
                <VerifyCtx.Provider value={verifyCtxValue}>
                    <Wrapper id="social-kit" className={embedded ? s.embeddedShell : s.shell}>
                        <header className={`container ${s.top}`}>
                            {embedded ? (
                                <h2 className={s.h1}>11 / Social Media, Cut Charts &amp; Auto-Post Studio</h2>
                            ) : (
                                <h1 className={s.h1}>Social Media &amp; Print Kit</h1>
                            )}
                            <p className={s.lead}>
                                Ready-to-post and ready-to-print templates for every platform. <b>Click any text on a template to rewrite it</b>,
                                use the <b>Admin Studio</b> below to edit cut guides/facts, print 1:1 proofs, or verify automatic posts by{' '}
                                <b>Day</b>, <b>Weekly</b>, or <b>Month</b>.
                            </p>

                            {/* ── Embedded Admin & Auto-Post Verification Bar (Day / Weekly / Month) ── */}
                            <div className={s.adminPanel}>
                                <div className={s.adminHead}>
                                    <div>
                                        <h2 className={s.adminTitle}>
                                            🛡️ Admin Auto-Post &amp; Person Verification Studio ({horizon.toUpperCase()} MODE)
                                        </h2>
                                        <p className={s.adminSub}>
                                            Automatic posts require human verification before publishing to Instagram, Facebook &amp; X. Verify by{' '}
                                            <b>Day</b>, <b>Weekly</b>, or <b>Month</b>, or open the dedicated Admin Console.
                                        </p>
                                    </div>
                                    <div className={s.adminControlsRow}>
                                            <Link href="/admin/social" className={s.dlAll}>
                                                ⚙ Open Full Admin Console (/admin/social) →
                                    </Link>
                                    <button type="button" className={s.dl} onClick={() => window.print()}>
                                        🖨 Print Page / Proofs
                                    </button>
                                </div>
                            </div>

                            <div className={s.adminControlsRow}>
                                <label className={s.ctl}>
                                    Person Verifying (Required for Auto-Post)
                                    <input
                                        type="text"
                                        value={verifier}
                                        placeholder="Sean Hofherr"
                                        onChange={(e) => {
                                            setVerifier(e.target.value);
                                            saveLocal(animalsData, verifiedMap, e.target.value);
                                        }}
                                    />
                                </label>

                                <div className={s.ctl}>
                                    Verification Horizon
                                    <div className={s.horizonTabs}>
                                        <button
                                            type="button"
                                            className={horizon === 'day' ? s.horizonBtnOn : s.horizonBtn}
                                            onClick={() => setHorizon('day')}
                                        >
                                            📅 By Day
                                        </button>
                                        <button
                                            type="button"
                                            className={horizon === 'week' ? s.horizonBtnOn : s.horizonBtn}
                                            onClick={() => setHorizon('week')}
                                        >
                                            🗓 Weekly
                                        </button>
                                        <button
                                            type="button"
                                            className={horizon === 'month' ? s.horizonBtnOn : s.horizonBtn}
                                            onClick={() => setHorizon('month')}
                                        >
                                            📆 Monthly
                                        </button>
                                    </div>
                                </div>

                                {horizon === 'day' && (
                                    <label className={s.ctl}>
                                        Select Day
                                        <select
                                            value={selectedDayIdx}
                                            onChange={(e) => setSelectedDayIdx(Number(e.target.value))}
                                        >
                                            {SCHEDULE_ITEMS.map((it, idx) => (
                                                <option key={it.key} value={idx}>
                                                    {it.day} — {it.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                )}

                                {horizon === 'week' && (
                                    <label className={s.ctl}>
                                        Select Week
                                        <select
                                            value={selectedWeekNum}
                                            onChange={(e) => setSelectedWeekNum(Number(e.target.value))}
                                        >
                                            {[1, 2, 3, 4].map((w) => (
                                                <option key={w} value={w}>
                                                    Week {w} Schedule
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                )}

                                <div className={s.ctl}>
                                    One-Click Verification
                                    <button type="button" className={s.dlVerified} onClick={verifyByHorizon}>
                                        {horizon === 'day'
                                            ? '✓ Verify Selected Day Post'
                                            : horizon === 'week'
                                                ? `✓ Verify All Week ${selectedWeekNum} Posts`
                                                : '✓ Verify Entire Month Schedule'}
                                    </button>
                                </div>
                            </div>

                            {statusBanner && <p className={s.toastMsg}>{statusBanner}</p>}

                            <div className={s.scheduleStrip}>
                                {visibleScheduleItems.map((item) => {
                                    const isVer = Boolean(verifiedMap[item.key]);
                                    return (
                                        <div
                                            key={item.key}
                                            className={`${s.scheduleCard} ${isVer ? s.scheduleCardVerified : ''}`}
                                        >
                                            <div className={s.scheduleTop}>
                                                <span className={s.scheduleDay}>{item.day}</span>
                                                <span className={isVer ? s.badgeVerified : s.badgePending}>
                                                    {isVer ? `✓ ${verifiedMap[item.key].by}` : '⏳ Needs Verify'}
                                                </span>
                                            </div>
                                            <div>{item.label}</div>
                                            <div className={s.adminControlsRow}>
                                                <button
                                                    type="button"
                                                    className={isVer ? s.dlVerified : s.dlVerify}
                                                    onClick={() => toggleVerify(item.key)}
                                                >
                                                    {isVer ? '✓ Verified' : '✓ Verify'}
                                                </button>
                                                    <Link href="/admin/social" className={s.dl}>
                                                        ✎ Edit / Schedule
                                            </Link>
                                        </div>
                                    </div>
                            );
                            })}
                        </div>
                    </div>

                    <div className={s.controls}>
                        <label className={s.ctl}>
                            Photo
                            <select value={photo} onChange={(e) => setPhoto(e.target.value)}>
                                {PHOTOS.map((p) => (
                                    <option key={p.src} value={p.src}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className={s.ctl}>
                            Department icon
                            <div className={s.iconRow}>
                                {FLAME_STICKERS.map((f) => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        title={f.name}
                                        onClick={() => setIcon(f.src)}
                                        className={`${s.iconBtn} ${icon === f.src ? s.iconOn : ''}`}
                                    >
                                        <img src={f.src} alt={f.name} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                        <nav className={s.jump} aria-label="Social media kit sections">
                            {GROUPS.map((g) => (
                                <a key={g.id} href={`#${g.id}`}>
                                    {g.title.split(' ·')[0]}
                                </a>
                            ))}
                            <a href="#copy">Bios &amp; captions</a>
                                <Link href="/admin/social" className={s.jumpAdmin}>
                                    ⚙ Admin Auto-Post &amp; Print Studio →
                        </Link>
                        <Link href="/product-identity">← Identity system</Link>
                    </nav>
                </header>

                {GROUPS.map((g) => (
                        <section key={g.id} id={g.id} aria-labelledby={`${g.id}-heading`} className={`container ${s.group}`}>
                            <div className={s.groupHead}>
                                <div>
                                    <h2 id={`${g.id}-heading`} className={s.h2}>{g.title}</h2>
                                    <p className={s.note}>{g.note}</p>
                                </div>
                                <div className={s.groupActions}>
                                    {g.id === 'cuts' && (
                                        <button
                                            type="button"
                                            className={s.dl}
                                            onClick={() => setShowCutEditor((v) => !v)}
                                        >
                                            {showCutEditor ? '▾ Hide Admin Cut Editor' : '✎ Open Admin Cut Editor'}
                                        </button>
                                    )}
                                    <button type="button" className={s.dl} onClick={() => window.print()}>
                                        🖨 Print Section
                                    </button>
                                    <button type="button" className={s.dlAll} onClick={() => downloadGroup(g.id)}>
                                        ⬇ Download all
                                    </button>
                                </div>
                            </div>

                            {g.id === 'cuts' && showCutEditor && activeEditAnimal && (
                                <div className={s.cutEditorBox}>
                                    <div className={s.cutEditorTabs}>
                                        <b>✎ Admin Cut Guide &amp; Fact Editor:</b>
                                        {animalsData.map((a) => (
                                            <button
                                                key={a.slug}
                                                type="button"
                                                className={editingAnimalSlug === a.slug ? s.dlAll : s.dl}
                                                onClick={() => setEditingAnimalSlug(a.slug)}
                                            >
                                                {a.name}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            className={s.dlVerify}
                                            onClick={() => {
                                                const keys = [
                                                    `cuts-${activeEditAnimal.slug}-1-chart`,
                                                    `cuts-${activeEditAnimal.slug}-2-guide`,
                                                    ...activeEditAnimal.facts.map(
                                                        (_, idx) => `cuts-${activeEditAnimal.slug}-fact-${idx + 1}`
                                                    ),
                                                ];
                                                verifyBatch(keys, `${activeEditAnimal.name} Cut Carousel`);
                                            }}
                                        >
                                            ✓ Verify All {activeEditAnimal.name} Slides
                                        </button>
                                        <button
                                            type="button"
                                            className={s.dl}
                                            onClick={() => {
                                                setAnimalsData(ANIMALS);
                                                saveLocal(ANIMALS, verifiedMap, verifier);
                                                setStatusBanner('Reset all animal cut guides & facts to factory defaults.');
                                            }}
                                        >
                                            ↺ Reset Defaults
                                        </button>
                                    </div>
                                    <div className={s.cutEditorGrid}>
                                        <div className={s.cutEditorCol}>
                                            <label>
                                                {activeEditAnimal.name} Primal Cuts (Format: Cut Name | Where | Best For — one per line)
                                            </label>
                                            <textarea
                                                rows={6}
                                                value={activeEditAnimal.primals
                                                    .map((p) => `${p.name} | ${p.where} | ${p.bestFor}`)
                                                    .join('\n')}
                                                onChange={(e) =>
                                                    updateAnimalPrimals(activeEditAnimal.slug, e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className={s.cutEditorCol}>
                                            <label>
                                                {activeEditAnimal.name} &ldquo;Did You Know?&rdquo; Facts (one slide per line)
                                            </label>
                                            <textarea
                                                rows={6}
                                                value={activeEditAnimal.facts.join('\n')}
                                                onChange={(e) => updateAnimalFacts(activeEditAnimal.slug, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className={s.grid}>
                                {g.id === 'cuts' &&
                                    animalsData.map((a) => {
                                        const aIcon = FLAME_STICKERS.find((f) => f.id === a.iconId)?.src ?? icon;
                                        return (
                                            <React.Fragment key={a.slug}>
                                                <CutChartPost a={a} />
                                                <CutGuidePost a={a} icon={aIcon} />
                                                {a.facts.map((f, i) => (
                                                <CutFactPost key={f} a={a} fact={f} i={i} icon={aIcon} />
                                                ))}
                                                <div style={{ flexBasis: '100%' }}>
                                                    <PromptCopy a={a} />
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}
                                {g.id === 'cooking' && (
                                    <>
                                        {HOW_TOS.map((h) => (
                                            <React.Fragment key={h.slug}>
                                                <HowToCover h={h} ctx={ctx} />
                                                <HowToSteps h={h} ctx={ctx} />
                                            </React.Fragment>
                                        ))}
                                        <DonenessChart />
                                        {TRIVIA.map((t) => (
                                            <React.Fragment key={t.slug}>
                                                <TriviaQ t={t} ctx={ctx} />
                                                <TriviaA t={t} ctx={ctx} />
                                            </React.Fragment>
                                        ))}
                                        {TRICKS.map((t) => <TrickPost key={t.slug} t={t} ctx={ctx} />)}
                                    </>
                                )}
                                {g.id === 'posts' && (
                                    <>
                                        <Canvas
                                            name="phone-example-1-this-weeks-specials"
                                            w={1080}
                                            h={1350}
                                            svgHref="/assets/identity/social/social-example-1-this-weeks-specials.svg"
                                        >
                                            <img
                                                src="/assets/identity/social/social-example-1-this-weeks-specials.svg"
                                                alt="This Week's Specials Feed Template"
                                                className={s.fullSvgCanvas}
                                            />
                                        </Canvas>
                                        <Canvas
                                            name="phone-example-2-new-cut-picanha"
                                            w={1080}
                                            h={1350}
                                            svgHref="/assets/identity/social/social-example-2-new-cut-picanha.svg"
                                        >
                                            <img
                                                src="/assets/identity/social/social-example-2-new-cut-picanha.svg"
                                                alt="New Cut: Picanha Feed Template"
                                                className={s.fullSvgCanvas}
                                            />
                                        </Canvas>
                                        <PostSpecials ctx={ctx} />
                                        <PostMenu ctx={ctx} />
                                        <PostNewCut ctx={ctx} />
                                        <PostEvent ctx={ctx} />
                                        <PostHoliday ctx={ctx} />
                                        <PostReview />
                                        <PostHiring />
                                        <PostNotice />
                                    </>
                                )}
                                {g.id === 'stories' && (
                                    <>
                                        <Canvas
                                            name="phone-example-3-behind-the-block"
                                            w={1080}
                                            h={1920}
                                            preview={260}
                                            svgHref="/assets/identity/social/social-example-3-behind-the-block.svg"
                                        >
                                            <img
                                                src="/assets/identity/social/social-example-3-behind-the-block.svg"
                                                alt="Behind The Block 9:16 Story Template"
                                                className={s.fullSvgCanvas}
                                            />
                                        </Canvas>
                                        <Canvas
                                            name="ig-link-in-bio-screen"
                                            w={1080}
                                            h={1920}
                                            preview={260}
                                            svgHref="/assets/identity/apps/ig-link-in-bio-screen.svg"
                                        >
                                            <img
                                                src="/assets/identity/apps/ig-link-in-bio-screen.svg"
                                                alt="Instagram Link-in-Bio Screen"
                                                className={s.fullSvgCanvas}
                                            />
                                        </Canvas>
                                        <StorySpecial ctx={ctx} />
                                        <StoryQuiz ctx={ctx} />
                                        <StoryPoll ctx={ctx} />
                                        <StoryDeadline ctx={ctx} />
                                        <StoryBehind ctx={ctx} />
                                    </>
                                )}
                                {g.id === 'highlights' && <Highlights />}
                                {g.id === 'profile' && <ProfileSet ctx={ctx} />}
                                {g.id === 'covers' && (
                                    <>
                                        <Canvas
                                            name="fb-hero-set-1-wrapping-paper"
                                            w={1640}
                                            h={624}
                                            preview={460}
                                            svgHref="/assets/identity/apps/fb-hero-cover-wrapping-paper.svg"
                                        >
                                            <img
                                                src="/assets/identity/apps/fb-hero-cover-wrapping-paper.svg"
                                                alt="Facebook Hero Cover Set 1 — Wrapping Paper & 10-Dept Suite"
                                                className={s.fullSvgCanvas}
                                            />
                                        </Canvas>
                                        <Canvas
                                            name="fb-hero-set-2-crimson-smokehouse"
                                            w={1640}
                                            h={624}
                                            preview={460}
                                            svgHref="/assets/identity/apps/fb-hero-cover-crimson-smokehouse.svg"
                                        >
                                            <img
                                                src="/assets/identity/apps/fb-hero-cover-crimson-smokehouse.svg"
                                                alt="Facebook Hero Cover Set 2 — Crimson & Charcoal Split"
                                                className={s.fullSvgCanvas}
                                            />
                                        </Canvas>
                                        <Canvas
                                            name="fb-hero-set-3-two-locations"
                                            w={1640}
                                            h={624}
                                            preview={460}
                                            svgHref="/assets/identity/apps/fb-hero-cover-two-locations.svg"
                                        >
                                            <img
                                                src="/assets/identity/apps/fb-hero-cover-two-locations.svg"
                                                alt="Facebook Hero Cover Set 3 — Two Locations Showcase"
                                                className={s.fullSvgCanvas}
                                            />
                                        </Canvas>
                                        <Canvas
                                            name="ordering-app-storefront-banner"
                                            w={1600}
                                            h={900}
                                            preview={460}
                                            svgHref="/assets/identity/apps/ordering-app-storefront-banner.svg"
                                        >
                                            <img
                                                src="/assets/identity/apps/ordering-app-storefront-banner.svg"
                                                alt="Ordering App Storefront Banner (16:9)"
                                                className={s.fullSvgCanvas}
                                            />
                                        </Canvas>
                                        <Cover name="facebook-cover" w={1640} h={624} ctx={ctx} />
                                        <Cover name="x-twitter-header" w={1500} h={500} ctx={ctx} />
                                        <Cover name="linkedin-banner" w={1584} h={396} ctx={ctx} />
                                        <Cover name="youtube-channel-art" w={2560} h={1440} ctx={ctx} />
                                        <Cover name="google-business-cover" w={1080} h={608} ctx={ctx} />
                                        <Cover name="email-newsletter-header" w={1200} h={400} ctx={ctx} />
                                    </>
                                )}
                            </div>
                        </section>
            ))}

                            <section id="copy" aria-labelledby="copy-heading" className={`container ${s.group}`}>
                                <h2 id="copy-heading" className={s.h2}>Caption templates</h2>
                                <p className={s.note}>Swap anything in [brackets]. Each pairs with a template above.</p>
                                <div className={s.copyGrid}>{CAPTIONS.map((c) => <CopyBlock key={c.title} {...c} />)}</div>
                                <h2 className={s.h2}>Hashtag sets</h2>
                                <div className={s.copyGrid}>{HASHTAGS.map((h) => <CopyBlock key={h.title} {...h} />)}</div>
                                <h2 className={s.h2}>Bios</h2>
                                <div className={s.copyGrid}>{BIOS.map((b) => <CopyBlock key={b.title} {...b} />)}</div>
                                <h2 className={s.h2}>Weekly posting rhythm</h2>
                                <div className={s.cadence}>
                                    {CADENCE.map((d) => (
                                        <div key={d.day} className={s.day}><b>{d.day}</b><span>{d.what}</span><em>{d.template}</em></div>
                                    ))}
                                </div>
                            </section>
                        </Wrapper>
                    </VerifyCtx.Provider>
                );
}
