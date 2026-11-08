'use client';

import { createContext, useContext, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { waitForPageAssets } from '@/lib/waitForPageAssets';
import {
    PRELOADER_STEPS,
    PRESETS,
    SLIDERS,
    POSITION_SLIDERS,
    FLARE_PRESETS,
    FLARE_SLIDERS,
    FIVE_FLAME_DEFAULTS,
    DEFAULT_FLAME_SETTINGS,
    FLAME_STORAGE_KEY,
    type FlameSettings,
    type FlameSlot,
} from '@/app/fire-test/FireTestClient';
import styles from './PageTransition.module.css';

/* ─── Context ─── */
interface TransitionContextType {
    navigateTo: (href: string) => void;
    isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
    navigateTo: () => { },
    isTransitioning: false,
});

export const usePageTransition = () => useContext(TransitionContext);

export const MELT_TIMELINE_STEPS = [
    {
        id: 1,
        num: '01',
        label: 'Melt Out (Exit)',
        timing: '0 → 380ms',
        desc: 'Current page & modals blur (0.9rem), spike contrast (12×), scale (1.02), and dissolve to 0% with ember burst.',
    },
    {
        id: 2,
        num: '02',
        label: 'Asset Decode Gate',
        timing: '380ms',
        desc: 'Scroll resets to 0px, route swaps, and all <img>, CSS backgrounds, fonts & maps GPU-decode before reveal.',
    },
    {
        id: 3,
        num: '03',
        label: 'Melt In (Enter)',
        timing: '380 → 1060ms',
        desc: 'New page, Navbar & any modal melt together from molten blur(0.9rem) contrast(12×) into crisp focus.',
    },
    {
        id: 4,
        num: '04',
        label: 'Crisp & Live',
        timing: '1060ms (100%)',
        desc: 'All filters and transforms clear (blur 0, contrast 1, scale 1); page is 100% crisp and interactive.',
    },
] as const;

const PRELOADER_SKIP_ROUTES = ['/studio', '/admin', '/fire-test'];
const MELT_STORAGE_KEY = 'hofherr_melt_settings_v1';

interface MeltConfig {
    exitMs: number;
    enterMs: number;
    meltAmount: number; // 0..200 (%)
    meltY: number;      // -80..80 (px)
    meltScale: number;  // 0..10 (%)
    maxBlur: number;    // 0..2.5 (rem)
    maxContrast: number;// 1..24 (×)
}

const DEFAULT_MELT_CONFIG: MeltConfig = {
    exitMs: 380,
    enterMs: 680,
    meltAmount: 100,
    meltY: 12,
    meltScale: 2,
    maxBlur: 0.9,
    maxContrast: 12,
};

const QUICK_ROUTES = [
    { label: 'Home', href: '/' },
    { label: 'Specials', href: '/specials' },
    { label: 'BBQ', href: '/bbq' },
    { label: 'Catering', href: '/catering' },
    { label: 'Visit', href: '/visit' },
    { label: 'Order Online', href: '/online-orders' },
    { label: 'Sign In (?login=true)', href: '/online-orders?login=true' },
] as const;

/* ─── Provider: wraps the entire layout (including Navbar) ─── */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const isTransitioningRef = useRef(false);
    const pendingHref = useRef<string | null>(null);
    const prevPathnameRef = useRef<string>(pathname);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const safetyRef = useRef<NodeJS.Timeout | null>(null);
    const exitDoneHandlerRef = useRef<(() => void) | null>(null);
    const exitMsRef = useRef(380);
    const enterMsRef = useRef(680);

    // Sync custom durations from HUD sliders
    useEffect(() => {
        const onTimingUpdate = (e: Event) => {
            const detail = (e as CustomEvent<{ exitMs?: number; enterMs?: number }>).detail;
            if (typeof detail?.exitMs === 'number') exitMsRef.current = detail.exitMs;
            if (typeof detail?.enterMs === 'number') enterMsRef.current = detail.enterMs;
        };
        window.addEventListener('pt-timing-update', onTimingUpdate);
        return () => window.removeEventListener('pt-timing-update', onTimingUpdate);
    }, []);

    // Aggressively reset scroll — hits Lenis, native, and raw DOM
    const forceScrollTop = useCallback(() => {
        const lenis = (window as unknown as { lenis?: { scrollTo?: (y: number, opts: { immediate: boolean; force: boolean }) => void } }).lenis;
        if (lenis?.scrollTo) {
            lenis.scrollTo(0, { immediate: true, force: true });
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, []);

    const enterTimersRef = useRef<{
        t1: ReturnType<typeof setTimeout> | null;
        t2: ReturnType<typeof setTimeout> | null;
        tDone: ReturnType<typeof setTimeout> | null;
        rafId1: number | null;
        rafId2: number | null;
    }>({ t1: null, t2: null, tDone: null, rafId1: null, rafId2: null });

    const clearRevealSequence = useCallback(() => {
        const timers = enterTimersRef.current;
        if (timers.rafId1 !== null) cancelAnimationFrame(timers.rafId1);
        if (timers.rafId2 !== null) cancelAnimationFrame(timers.rafId2);
        if (timers.t1) clearTimeout(timers.t1);
        if (timers.t2) clearTimeout(timers.t2);
        if (timers.tDone) clearTimeout(timers.tDone);
    }, []);

    const runRevealSequence = useCallback(() => {
        if (safetyRef.current) {
            clearTimeout(safetyRef.current);
            safetyRef.current = null;
        }
        clearRevealSequence();
        const timers = enterTimersRef.current;
        forceScrollTop();

        // Wait 2 animation frames while held in .pt-waiting (opacity: 0) so the browser
        // finishes laying out and rasterizing the newly mounted route BEFORE frame 1 of Melt In!
        timers.rafId1 = requestAnimationFrame(() => {
            forceScrollTop();
            timers.rafId2 = requestAnimationFrame(() => {
                forceScrollTop();
                window.dispatchEvent(new CustomEvent('page-transition-enter'));
                timers.tDone = setTimeout(() => {
                    isTransitioningRef.current = false;
                    setIsTransitioning(false);
                }, enterMsRef.current + 120);
            });
        });
    }, [forceScrollTop, clearRevealSequence]);

    // Navigate: run frame-clamped exit first, THEN push route
    const navigateTo = useCallback((href: string) => {
        if (typeof window === 'undefined') return;
        if (isTransitioningRef.current) return;

        let targetUrl: URL;
        try {
            targetUrl = new URL(href, window.location.origin);
        } catch {
            return;
        }

        const samePath = targetUrl.pathname === window.location.pathname;
        const sameSearch = targetUrl.search === window.location.search;

        if (samePath && sameSearch) return;

        isTransitioningRef.current = true;
        setIsTransitioning(true);
        const dest = targetUrl.pathname + targetUrl.search + targetUrl.hash;
        pendingHref.current = dest;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (exitDoneHandlerRef.current) {
            window.removeEventListener('page-transition-exit-done', exitDoneHandlerRef.current);
            exitDoneHandlerRef.current = null;
        }

        let pushed = false;
        const proceedAfterExit = () => {
            if (pushed) return;
            pushed = true;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (exitDoneHandlerRef.current) {
                window.removeEventListener('page-transition-exit-done', exitDoneHandlerRef.current);
                exitDoneHandlerRef.current = null;
            }

            window.dispatchEvent(new CustomEvent('page-transition-waiting'));
            forceScrollTop();
            router.push(dest);

            if (samePath) {
                pendingHref.current = null;
                // Allow searchParams / portaled modal to mount before decoding & revealing
                setTimeout(() => {
                    void waitForPageAssets(600).then(() => {
                        runRevealSequence();
                    });
                }, 40);
            } else {
                if (safetyRef.current) clearTimeout(safetyRef.current);
                safetyRef.current = setTimeout(() => {
                    pendingHref.current = null;
                    runRevealSequence();
                }, 2000);
            }
        };

        exitDoneHandlerRef.current = proceedAfterExit;
        window.addEventListener('page-transition-exit-done', proceedAfterExit, { once: true });
        timeoutRef.current = setTimeout(proceedAfterExit, exitMsRef.current + 280);

        window.dispatchEvent(new CustomEvent('page-transition-exit'));
    }, [router, forceScrollTop, runRevealSequence]);

    useEffect(() => {
        (window as unknown as { __hofherrNavigate?: (href: string) => void }).__hofherrNavigate = navigateTo;
        return () => {
            delete (window as unknown as { __hofherrNavigate?: (href: string) => void }).__hofherrNavigate;
        };
    }, [navigateTo]);

    // Globally intercept all internal <a> / <Link> clicks so every page link melts out & in
    useEffect(() => {
        const handleDocumentClick = (e: MouseEvent) => {
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const target = e.target as HTMLElement | null;
            const anchor = target?.closest?.('a');
            if (!anchor) return;

            if (anchor.target && anchor.target !== '_self') return;
            if (anchor.hasAttribute('download') || anchor.hasAttribute('data-no-transition')) return;

            const rawHref = anchor.getAttribute('href');
            if (!rawHref) return;
            if (
                rawHref.startsWith('#') ||
                rawHref.startsWith('mailto:') ||
                rawHref.startsWith('tel:') ||
                rawHref.startsWith('sms:') ||
                rawHref.startsWith('javascript:')
            ) {
                return;
            }

            let url: URL;
            try {
                url = new URL(rawHref, window.location.origin);
            } catch {
                return;
            }

            if (url.origin !== window.location.origin) return;

            if (url.pathname === window.location.pathname && url.search === window.location.search) {
                return;
            }

            e.preventDefault();
            navigateTo(url.pathname + url.search + url.hash);
        };

        window.addEventListener('click', handleDocumentClick, true);
        return () => window.removeEventListener('click', handleDocumentClick, true);
    }, [navigateTo]);

    // When pathname changes, trigger enter animation once all images, assets, and map are ready
    useEffect(() => {
        if (prevPathnameRef.current === pathname && !pendingHref.current) return;
        prevPathnameRef.current = pathname;

        const targetHref = pendingHref.current ?? pathname;
        pendingHref.current = null;

        let cancelled = false;
        let revealed = false;

        const revealPage = () => {
            if (revealed || cancelled) return;
            revealed = true;
            clearTimeout(tFallback);
            runRevealSequence();
        };

        const mapAlreadyWarm = Boolean((window as unknown as { __hofherrMapReady?: boolean }).__hofherrMapReady);
        const needsMap = targetHref.startsWith('/visit') && !mapAlreadyWarm;

        const mapPromise = needsMap
            ? new Promise<void>(res => {
                window.addEventListener('visit-map-ready', () => res(), { once: true });
            })
            : Promise.resolve();

        void Promise.all([waitForPageAssets(1500), mapPromise]).then(() => {
            revealPage();
        });

        const tFallback = setTimeout(revealPage, 1600);

        return () => {
            cancelled = true;
            clearTimeout(tFallback);
            clearRevealSequence();
        };
    }, [pathname, runRevealSequence, clearRevealSequence]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (safetyRef.current) clearTimeout(safetyRef.current);
            if (exitDoneHandlerRef.current) {
                window.removeEventListener('page-transition-exit-done', exitDoneHandlerRef.current);
            }
        };
    }, []);

    const contextValue = useMemo(() => ({ navigateTo, isTransitioning }), [navigateTo, isTransitioning]);

    return (
        <TransitionContext.Provider value={contextValue}>
            {children}
        </TransitionContext.Provider>
    );
}

/* ─── Animation Wrapper + Live Page Melt & Flame Editor HUD ─── */
export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { navigateTo } = usePageTransition();
    const wrapRef = useRef<HTMLDivElement>(null);
    const scrubberInputRef = useRef<HTMLInputElement>(null);
    const timelineReadoutRef = useRef<HTMLSpanElement>(null);

    // Left HUD State (Page Melt & Preloader Timeline)
    const [minimized, setMinimized] = useState(true);
    const [tab, setTab] = useState<'melt' | 'preloader'>('melt');
    const [meltStep, setMeltStep] = useState<number>(4);
    const [phaseLabel, setPhaseLabel] = useState<string>('READY');
    const [scrubPct, setScrubPct] = useState<number>(100);
    const [exitMs, setExitMs] = useState<number>(DEFAULT_MELT_CONFIG.exitMs);
    const [enterMs, setEnterMs] = useState<number>(DEFAULT_MELT_CONFIG.enterMs);
    const [meltAmount, setMeltAmount] = useState<number>(DEFAULT_MELT_CONFIG.meltAmount);
    const [meltY, setMeltY] = useState<number>(DEFAULT_MELT_CONFIG.meltY);
    const [meltScale, setMeltScale] = useState<number>(DEFAULT_MELT_CONFIG.meltScale);
    const [maxBlur, setMaxBlur] = useState<number>(DEFAULT_MELT_CONFIG.maxBlur);
    const [maxContrast, setMaxContrast] = useState<number>(DEFAULT_MELT_CONFIG.maxContrast);

    // Standalone Flame Studio UI State (in its own dedicated right-hand UI)
    const [flameHudMinimized, setFlameHudMinimized] = useState<boolean>(false);
    const [flameSubTab, setFlameSubTab] = useState<'all' | 'burst' | 'shape' | 'pos'>('all');
    const [flameSettings, setFlameSettings] = useState<FlameSettings>(DEFAULT_FLAME_SETTINGS);
    const [flamePreset, setFlamePreset] = useState<string | null>('campfire');
    const [flarePreset, setFlarePreset] = useState<string | null>('custom');
    const [flameVisibleOnPage, setFlameVisibleOnPage] = useState<boolean>(false);
    const [flameDragOnPage, setFlameDragOnPage] = useState<boolean>(false);
    const [flameOrbitMode, setFlameOrbitMode] = useState<boolean>(false);
    const [flameDarkStage, setFlameDarkStage] = useState<boolean>(false);

    // Preloader state mirrored into Tab 2
    const [preloaderStep, setPreloaderStep] = useState<number>(6);
    const [preloaderPct, setPreloaderPct] = useState<number>(100);
    const [preloaderPaused, setPreloaderPaused] = useState<boolean>(false);

    const animRafRef = useRef<number | null>(null);
    const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const paramsRef = useRef<MeltConfig>(DEFAULT_MELT_CONFIG);

    // Load saved flame & melt settings on mount, and sync canvas drag events
    useEffect(() => {
        try {
            const rawFlame = localStorage.getItem(FLAME_STORAGE_KEY);
            if (rawFlame) {
                const parsed = JSON.parse(rawFlame) as Partial<FlameSettings>;
                const validFlames = Array.isArray(parsed.flames) && parsed.flames.length === 5
                    ? parsed.flames
                    : FIVE_FLAME_DEFAULTS.map(f => ({ ...f }));
                const selIdx = typeof parsed.selectedIndex === 'number' ? parsed.selectedIndex : 0;
                setFlameSettings(prev => ({
                    ...prev,
                    ...parsed,
                    ...(validFlames[selIdx] ?? validFlames[0]),
                    showAll5: false,
                    selectedIndex: selIdx,
                    flames: validFlames,
                }));
            }
            const rawMelt = localStorage.getItem(MELT_STORAGE_KEY);
            if (rawMelt) {
                const parsedMelt = JSON.parse(rawMelt) as Partial<MeltConfig>;
                if (typeof parsedMelt.exitMs === 'number') setExitMs(parsedMelt.exitMs);
                if (typeof parsedMelt.enterMs === 'number') setEnterMs(parsedMelt.enterMs);
                if (typeof parsedMelt.meltAmount === 'number') setMeltAmount(parsedMelt.meltAmount);
                if (typeof parsedMelt.meltY === 'number') setMeltY(parsedMelt.meltY);
                if (typeof parsedMelt.meltScale === 'number') setMeltScale(parsedMelt.meltScale);
                if (typeof parsedMelt.maxBlur === 'number') setMaxBlur(parsedMelt.maxBlur);
                if (typeof parsedMelt.maxContrast === 'number') setMaxContrast(parsedMelt.maxContrast);
            }
        } catch { /* ignore */ }

        const onCanvasDrag = (e: Event) => {
            const detail = (e as CustomEvent<FlameSettings>).detail;
            if (detail) {
                setFlameSettings(detail);
            }
        };
        window.addEventListener('flame-settings-from-canvas', onCanvasDrag);
        return () => window.removeEventListener('flame-settings-from-canvas', onCanvasDrag);
    }, []);

    // Broadcast flame settings whenever adjusted in the standalone Flame Studio UI
    const updateFlame = useCallback((
        patch: Partial<FlameSlot> & Partial<Pick<FlameSettings, 'showAll5' | 'selectedIndex' | 'autoLoopBurst'>>,
        presetId?: string | null,
        triggerFlare = false,
        cancelFlare = false
    ) => {
        const curSlots = flameSettings.flames ?? FIVE_FLAME_DEFAULTS;
        const nextSelIdx = typeof patch.selectedIndex === 'number' ? patch.selectedIndex : (flameSettings.selectedIndex ?? 0);
        const nextAutoLoop = typeof patch.autoLoopBurst === 'boolean' ? patch.autoLoopBurst : Boolean(flameSettings.autoLoopBurst);

        const { showAll5: _s, selectedIndex: _i, autoLoopBurst: _a, ...slotPatch } = patch;
        const hasSlotPatch = Object.keys(slotPatch).length > 0;

        const nextSlots = curSlots.map((slot, idx) =>
            hasSlotPatch && idx === nextSelIdx ? { ...slot, ...slotPatch } : slot
        );

        const activeSlot = nextSlots[nextSelIdx] ?? curSlots[0];
        const next: FlameSettings = {
            ...flameSettings,
            ...activeSlot,
            showAll5: false,
            selectedIndex: nextSelIdx,
            autoLoopBurst: nextAutoLoop,
            flames: nextSlots,
        };
        setFlameSettings(next);
        try {
            localStorage.setItem(FLAME_STORAGE_KEY, JSON.stringify(next));
        } catch { /* ignore */ }
        window.dispatchEvent(new CustomEvent('flame-settings-external', {
            detail: {
                settings: next,
                alwaysShow: true,
                ...(triggerFlare ? { flare: true } : {}),
                ...(cancelFlare ? { cancelFlare: true } : {}),
            },
        }));
        if (presetId !== undefined) setFlamePreset(presetId);
    }, [flameSettings]);

    const showFlameForEditing = useCallback((show: boolean, dark = flameDarkStage) => {
        setFlameVisibleOnPage(show);
        if (show) {
            window.dispatchEvent(new CustomEvent('preloader-hud-command', { detail: { editFlame: true, darkStage: dark } }));
        } else {
            setFlameDragOnPage(false);
            window.dispatchEvent(new CustomEvent('preloader-hud-command', { detail: { hideFlame: true } }));
        }
    }, [flameDarkStage]);

    // Keep CSS custom variables & localStorage synced on documentElement so both .pt-wrap and [data-pt-portal] use them
    useEffect(() => {
        const cfg: MeltConfig = { exitMs, enterMs, meltAmount, meltY, meltScale, maxBlur, maxContrast };
        paramsRef.current = cfg;
        try {
            localStorage.setItem(MELT_STORAGE_KEY, JSON.stringify(cfg));
        } catch { /* ignore */ }
        const amt = meltAmount / 100;
        const effBlur = +(maxBlur * amt).toFixed(3);
        const effContrast = Math.max(1, +(1 + (maxContrast - 1) * amt).toFixed(2));
        const root = document.documentElement;
        root.style.setProperty('--pt-exit-ms', `${exitMs}ms`);
        root.style.setProperty('--pt-enter-ms', `${enterMs}ms`);
        root.style.setProperty('--pt-max-blur', `${effBlur}rem`);
        root.style.setProperty('--pt-mid-blur', `${(effBlur * 0.5).toFixed(2)}rem`);
        root.style.setProperty('--pt-max-contrast', `${effContrast}`);
        root.style.setProperty('--pt-mid-contrast', `${Math.max(1, Math.round(effContrast * 0.6))}`);
        window.dispatchEvent(new CustomEvent('pt-timing-update', { detail: { exitMs, enterMs } }));
    }, [exitMs, enterMs, meltAmount, meltY, meltScale, maxBlur, maxContrast]);

    // Listen to Preloader step reports
    useEffect(() => {
        const onReport = (e: Event) => {
            const detail = (e as CustomEvent<{ step: number; pct: number }>).detail;
            if (detail) {
                setPreloaderStep(detail.step);
                setPreloaderPct(detail.pct);
            }
        };
        window.addEventListener('preloader-step-report', onReport);
        return () => window.removeEventListener('preloader-step-report', onReport);
    }, []);

    // Updates HUD scrubber DOM nodes directly without triggering React re-renders during 60fps animation
    const syncScrubberDom = useCallback((pct: number) => {
        const { exitMs: ex, enterMs: en } = paramsRef.current;
        const tot = ex + en;
        const curMs = Math.round((pct / 100) * tot);
        if (scrubberInputRef.current) {
            scrubberInputRef.current.value = String(pct);
        }
        if (timelineReadoutRef.current) {
            timelineReadoutRef.current.textContent = `${curMs}ms / ${tot}ms (${pct}%)`;
        }
    }, []);

    // Applies exact filter/opacity/transform styles for a given phase and progress (0..1)
    const paintMeltStyle = useCallback((
        phase: 'exit' | 'enter' | 'clear',
        progress01: number,
        includeHeader = false,
        overrideCfg?: Partial<MeltConfig>
    ) => {
        const el = wrapRef.current;
        if (!el) return;
        const cfg = { ...paramsRef.current, ...overrideCfg };
        const amt = cfg.meltAmount / 100;
        const mBlur = cfg.maxBlur * amt;
        const mCon = 1 + (cfg.maxContrast - 1) * amt;
        const yPx = cfg.meltY * amt;
        const scaleDelta = (cfg.meltScale / 100) * amt;

        const portals = document.querySelectorAll<HTMLElement>('[data-pt-portal]');
        const siteHeader = includeHeader ? document.querySelector<HTMLElement>('header') : null;

        if (phase === 'clear') {
            el.style.filter = '';
            el.style.opacity = '';
            el.style.transform = '';
            portals.forEach(p => {
                p.style.filter = '';
                p.style.opacity = '';
                p.style.transform = '';
            });
            if (siteHeader) {
                siteHeader.style.filter = '';
                siteHeader.style.opacity = '1';
                siteHeader.style.transform = '';
                siteHeader.style.animation = '';
            }
            return;
        }

        let blurRem = 0;
        let contrastVal = 1;
        let opacityVal = 1;
        let scaleVal = 1;
        let translateY = 0;

        if (phase === 'exit') {
            // Melt Out: blur & contrast ramp up quickly while still visible, then dissolve to 0
            const p = Math.min(1, Math.max(0, progress01));
            const blurCurve = Math.pow(p, 0.72);
            const conCurve = Math.pow(p, 0.82);
            blurRem = blurCurve * mBlur;
            contrastVal = 1 + conCurve * (mCon - 1);
            opacityVal = Math.max(0, 1 - Math.pow(p, 1.55));
            scaleVal = 1 + scaleDelta * (p * p);
            translateY = -yPx * (p * p);
        } else {
            // Melt In: opacity rises quickly in first 40% while blur & contrast remain rich & molten,
            // then blur & contrast smoothly coalesce into crisp 100% focus
            const p = Math.min(1, Math.max(0, progress01));
            const easeOut = 1 - Math.pow(1 - p, 2.5);
            const meltRem = Math.pow(1 - p, 1.65);
            blurRem = meltRem * mBlur;
            contrastVal = 1 + meltRem * (mCon - 1);
            opacityVal = Math.min(1, Math.pow(p, 0.5));
            scaleVal = (1 - scaleDelta) + scaleDelta * easeOut;
            translateY = (1 - easeOut) * yPx;
        }

        const filterStr = blurRem <= 0.004 && contrastVal <= 1.02
            ? 'none'
            : `blur(${blurRem.toFixed(3)}rem) contrast(${contrastVal.toFixed(2)})`;
        const opacityStr = opacityVal.toFixed(3);
        const transformStr = Math.abs(scaleVal - 1) <= 0.0005 && Math.abs(translateY) <= 0.05
            ? 'none'
            : `scale(${scaleVal.toFixed(4)}) translateY(${translateY.toFixed(2)}px)`;

        el.style.filter = filterStr;
        el.style.opacity = opacityStr;
        el.style.transform = transformStr;

        portals.forEach(p => {
            p.style.filter = filterStr;
            p.style.opacity = opacityStr;
            p.style.transform = transformStr;
        });

        if (siteHeader) {
            siteHeader.style.filter = filterStr === 'none' ? '' : filterStr;
            siteHeader.style.opacity = opacityStr;
            siteHeader.style.transform = transformStr === 'none' ? '' : transformStr;
        }
    }, []);

    // Helper to apply manual scrub state (0..100 across Exit and Enter)
    const applyScrubVisual = useCallback((pct: number, overrideCfg?: Partial<MeltConfig>) => {
        const el = wrapRef.current;
        if (!el) return;
        if (animRafRef.current) {
            cancelAnimationFrame(animRafRef.current);
            animRafRef.current = null;
        }
        el.classList.remove('pt-exit', 'pt-waiting', 'pt-enter');

        const split = (exitMs / (exitMs + enterMs)) * 100;
        if (pct < split) {
            const p = split > 0 ? pct / split : 1;
            setMeltStep(p < 0.9 ? 1 : 2);
            setPhaseLabel('SCRUB EXIT');
            paintMeltStyle('exit', p, false, overrideCfg);
        } else if (pct < 100) {
            const p = (pct - split) / Math.max(1, 100 - split);
            setMeltStep(3);
            setPhaseLabel('SCRUB ENTER');
            paintMeltStyle('enter', p, false, overrideCfg);
        } else {
            setMeltStep(4);
            setPhaseLabel('READY');
            paintMeltStyle('clear', 1, true, overrideCfg);
        }
        syncScrubberDom(pct);
    }, [exitMs, enterMs, paintMeltStyle, syncScrubberDom]);

    // Live preview when dragging a Melt parameter slider so the user sees the change immediately
    const previewMeltAdjustment = useCallback((overrideCfg: Partial<MeltConfig>) => {
        if (scrubPct < 100) {
            applyScrubVisual(scrubPct, overrideCfg);
            return;
        }
        if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
        setPhaseLabel('PREVIEW MELT');
        paintMeltStyle('enter', 0.32, false, overrideCfg);
        previewTimerRef.current = setTimeout(() => {
            paintMeltStyle('clear', 1, false, overrideCfg);
            setPhaseLabel('READY');
        }, 550);
    }, [scrubPct, applyScrubVisual, paintMeltStyle]);

    const clearInlineScrub = useCallback(() => {
        paintMeltStyle('clear', 1, true);
    }, [paintMeltStyle]);

    // Initial mount: hold .pt-wrap in .pt-waiting when Preloader is active so it melts in at Step 5;
    // on routes that skip Preloader, run the frame-clamped melt-in immediately.
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const skipsPreloader = PRELOADER_SKIP_ROUTES.some(p => pathname?.startsWith(p));
        if (!skipsPreloader) {
            el.classList.add('pt-waiting');
            setMeltStep(2);
            setPhaseLabel('PRELOADER');
        } else {
            window.dispatchEvent(new CustomEvent('page-transition-enter'));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const cancelLoop = () => {
            if (animRafRef.current !== null) {
                cancelAnimationFrame(animRafRef.current);
                animRafRef.current = null;
            }
        };

        const handleExit = () => {
            cancelLoop();
            const { exitMs: dur, enterMs: en } = paramsRef.current;
            const split = Math.round((dur / (dur + en)) * 100);

            el.classList.remove('pt-enter', 'pt-waiting');
            el.classList.add('pt-exit');
            setMeltStep(1);
            setPhaseLabel('MELTING OUT');
            setScrubPct(0);
            syncScrubberDom(0);
            paintMeltStyle('exit', 0, false);

            let elapsed = 0;
            let lastNow = 0;

            const tick = (now: number) => {
                // Clamp delta to max 28ms per frame so layout/paint spikes never skip frames
                const dt = lastNow === 0 ? 0 : Math.min(now - lastNow, 28);
                lastNow = now;
                elapsed += dt;
                const p = Math.min(1, elapsed / Math.max(1, dur));

                paintMeltStyle('exit', p, false);
                syncScrubberDom(Math.round(p * split));

                if (p < 1) {
                    animRafRef.current = requestAnimationFrame(tick);
                } else {
                    animRafRef.current = null;
                    setScrubPct(split);
                    window.dispatchEvent(new CustomEvent('page-transition-exit-done'));
                }
            };

            animRafRef.current = requestAnimationFrame(tick);
        };

        const handleWaiting = () => {
            cancelLoop();
            const { exitMs: ex, enterMs: en } = paramsRef.current;
            const split = Math.round((ex / (ex + en)) * 100);
            el.classList.remove('pt-exit', 'pt-enter');
            el.classList.add('pt-waiting');
            paintMeltStyle('enter', 0, false);
            setMeltStep(2);
            setPhaseLabel('DECODING ASSETS');
            setScrubPct(split);
            syncScrubberDom(split);
        };

        const handleEnter = (e: Event) => {
            cancelLoop();
            const detail = (e as CustomEvent<{ includeHeader?: boolean }>).detail;
            const includeHeader = Boolean(detail?.includeHeader);
            const { exitMs: ex, enterMs: dur } = paramsRef.current;
            const split = Math.round((ex / (ex + dur)) * 100);

            // Apply initial 0% melted styles BEFORE removing .pt-waiting so there is zero flash
            paintMeltStyle('enter', 0, includeHeader);
            el.classList.remove('pt-exit', 'pt-waiting');
            el.classList.add('pt-enter');
            setMeltStep(3);
            setPhaseLabel('MELTING IN');
            setScrubPct(split);
            syncScrubberDom(split);

            let elapsed = 0;
            let lastNow = 0;

            const tick = (now: number) => {
                // Frame-clamped delta (max 28ms per frame) guarantees every visual frame of
                // the melt-in renders smoothly even if frame 1 after route mount was heavy
                const dt = lastNow === 0 ? 0 : Math.min(now - lastNow, 28);
                lastNow = now;
                elapsed += dt;
                const p = Math.min(1, elapsed / Math.max(1, dur));

                paintMeltStyle('enter', p, includeHeader);
                syncScrubberDom(Math.round(split + p * (100 - split)));

                if (p < 1) {
                    animRafRef.current = requestAnimationFrame(tick);
                } else {
                    animRafRef.current = null;
                    el.classList.remove('pt-enter');
                    paintMeltStyle('clear', 1, includeHeader);
                    setMeltStep(4);
                    setPhaseLabel('READY');
                    setScrubPct(100);
                    syncScrubberDom(100);
                    window.dispatchEvent(new CustomEvent('page-transition-enter-done'));
                }
            };

            animRafRef.current = requestAnimationFrame(tick);
        };

        window.addEventListener('page-transition-exit', handleExit);
        window.addEventListener('page-transition-waiting', handleWaiting);
        window.addEventListener('page-transition-enter', handleEnter);

        return () => {
            cancelLoop();
            window.removeEventListener('page-transition-exit', handleExit);
            window.removeEventListener('page-transition-waiting', handleWaiting);
            window.removeEventListener('page-transition-enter', handleEnter);
        };
    }, [paintMeltStyle, syncScrubberDom]);

    // Manual triggers from HUD buttons
    const playFullMeltOnPage = () => {
        const onExitDone = () => {
            window.dispatchEvent(new CustomEvent('page-transition-waiting'));
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    window.dispatchEvent(new CustomEvent('page-transition-enter'));
                });
            });
        };
        window.addEventListener('page-transition-exit-done', onExitDone, { once: true });
        window.dispatchEvent(new CustomEvent('page-transition-exit'));
    };

    const triggerMeltOutOnly = () => {
        const split = Math.round((exitMs / (exitMs + enterMs)) * 100);
        setScrubPct(split);
        applyScrubVisual(split);
    };

    const triggerMeltInOnly = () => {
        window.dispatchEvent(new CustomEvent('page-transition-enter'));
    };

    const jumpToMeltStep = (stepId: number) => {
        const split = Math.round((exitMs / (exitMs + enterMs)) * 100);
        if (stepId === 1) {
            const p = Math.round(split * 0.55);
            setScrubPct(p);
            applyScrubVisual(p);
        } else if (stepId === 2) {
            setScrubPct(split);
            applyScrubVisual(split);
        } else if (stepId === 3) {
            const p = Math.round(split + (100 - split) * 0.45);
            setScrubPct(p);
            applyScrubVisual(p);
        } else {
            setScrubPct(100);
            applyScrubVisual(100);
        }
    };

    const resetMeltDefaults = () => {
        setExitMs(DEFAULT_MELT_CONFIG.exitMs);
        setEnterMs(DEFAULT_MELT_CONFIG.enterMs);
        setMeltAmount(DEFAULT_MELT_CONFIG.meltAmount);
        setMeltY(DEFAULT_MELT_CONFIG.meltY);
        setMeltScale(DEFAULT_MELT_CONFIG.meltScale);
        setMaxBlur(DEFAULT_MELT_CONFIG.maxBlur);
        setMaxContrast(DEFAULT_MELT_CONFIG.maxContrast);
        setScrubPct(100);
        clearInlineScrub();
        wrapRef.current?.classList.remove('pt-exit', 'pt-waiting', 'pt-enter');
        setMeltStep(4);
        setPhaseLabel('READY');
    };

    const currentMeltStepObj = MELT_TIMELINE_STEPS.find(s => s.id === meltStep) ?? MELT_TIMELINE_STEPS[3];
    const currentPreloaderObj = PRELOADER_STEPS.find(s => s.id === preloaderStep) ?? PRELOADER_STEPS[5];
    const totalMs = exitMs + enterMs;
    const currentMs = Math.round((scrubPct / 100) * totalMs);

    return (
        <>
            <div ref={wrapRef} className="pt-wrap">
                {children}
            </div>

                {/* Left HUD: Dedicated Page Melt & Preloader Timeline UI */}
                <aside className={styles.hud} aria-label="Page transition and preloader timeline controls">
                    {minimized ? (
                        <button
                            type="button"
                            className={styles.minimizedPill}
                            onClick={() => setMinimized(false)}
                        >
                            <span className={styles.pillBadge}>{currentMeltStepObj.num}</span>
                            <span className={styles.pillText}>💧 Page Melt UI · {phaseLabel}</span>
                        </button>
                    ) : (
                    <div className={styles.card}>
                        <div className={styles.header}>
                            <div className={styles.titleWrap}>
                                <span className={styles.title}>Page Melt UI</span>
                                <span className={styles.phaseBadge}>{phaseLabel}</span>
                            </div>
                            <div className={styles.headerActions}>
                                <span className={styles.routeTag} title={pathname || '/'}>{pathname || '/'}</span>
                                <button
                                    type="button"
                                    className={styles.iconBtn}
                                    onClick={() => setMinimized(true)}
                                    aria-label="Minimize melt controls"
                                >
                                    −
                                </button>
                            </div>
                        </div>

                        <div className={styles.tabs} role="tablist" aria-label="Transition control mode">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={tab === 'melt'}
                                className={`${styles.tabBtn} ${tab === 'melt' ? styles.tabBtnActive : ''}`}
                                onClick={() => setTab('melt')}
                            >
                                💧 Melt UI
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={tab === 'preloader'}
                                className={`${styles.tabBtn} ${tab === 'preloader' ? styles.tabBtnActive : ''}`}
                                onClick={() => setTab('preloader')}
                            >
                                Preloader
                            </button>
                        </div>

                        {tab === 'melt' ? (
                            <>
                                {/* Live Timeline Scrubber */}
                                <div className={styles.timelineBox}>
                                    <div className={styles.timelineLabels}>
                                        <span>0ms (Exit)</span>
                                        <span ref={timelineReadoutRef} className={styles.timelineReadout}>{currentMs}ms / {totalMs}ms ({scrubPct}%)</span>
                                        <span>{totalMs}ms (Live)</span>
                                    </div>
                                    <div className={styles.trackBar} aria-hidden="true">
                                        <div className={styles.zoneExit} />
                                        <div className={styles.zoneEnter} />
                                    </div>
                                    <input
                                        ref={scrubberInputRef}
                                        type="range"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={scrubPct}
                                        aria-label="Scrub page melt transition timeline"
                                        className={styles.scrubberInput}
                                        onChange={e => {
                                            const val = parseInt(e.target.value, 10);
                                            setScrubPct(val);
                                            applyScrubVisual(val);
                                        }}
                                    />
                                </div>

                                {/* 4-Step Melt Timeline Pills */}
                                <div className={styles.stepsGrid} role="group" aria-label="Page melt timeline steps">
                                    {MELT_TIMELINE_STEPS.map(step => {
                                        const isCurrent = meltStep === step.id;
                                        const isDone = meltStep > step.id;
                                        return (
                                            <button
                                                key={step.id}
                                                type="button"
                                                className={`${styles.stepPill} ${isCurrent ? styles.stepPillActive : ''} ${isDone ? styles.stepPillDone : ''}`}
                                                aria-pressed={isCurrent}
                                                onClick={() => jumpToMeltStep(step.id)}
                                            >
                                                <span className={styles.stepNum}>{step.num}</span>
                                                <span className={styles.stepName}>{step.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Playback Controls */}
                                <div className={styles.actionsRow}>
                                    <button
                                        type="button"
                                        className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                        onClick={playFullMeltOnPage}
                                    >
                                        🔥 Melt Out → In
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.actionBtn}
                                        onClick={triggerMeltOutOnly}
                                    >
                                        ↘ Hold Out
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.actionBtn}
                                        onClick={triggerMeltInOnly}
                                    >
                                        ↗ Melt In
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.actionBtn}
                                        onClick={resetMeltDefaults}
                                        aria-label="Reset melt settings"
                                    >
                                        ↺
                                    </button>
                                </div>

                                {/* Live Melt Amount, Translate Y, Scale, Blur, Contrast & Timing Sliders */}
                                <div className={styles.slidersGrid}>
                                    <div className={styles.sliderCtl}>
                                        <label htmlFor="pt-melt-amount">
                                            Melt Amount <output>{meltAmount}%</output>
                                        </label>
                                        <input
                                            id="pt-melt-amount"
                                            type="range"
                                            min={0}
                                            max={200}
                                            step={5}
                                            value={meltAmount}
                                            onChange={e => {
                                                const v = parseInt(e.target.value, 10);
                                                setMeltAmount(v);
                                                previewMeltAdjustment({ meltAmount: v });
                                            }}
                                        />
                                    </div>
                                    <div className={styles.sliderCtl}>
                                        <label htmlFor="pt-melt-y">
                                            Translate Y <output>{meltY > 0 ? `+${meltY}px` : `${meltY}px`}</output>
                                        </label>
                                        <input
                                            id="pt-melt-y"
                                            type="range"
                                            min={-80}
                                            max={80}
                                            step={2}
                                            value={meltY}
                                            onChange={e => {
                                                const v = parseInt(e.target.value, 10);
                                                setMeltY(v);
                                                previewMeltAdjustment({ meltY: v });
                                            }}
                                        />
                                    </div>
                                    <div className={styles.sliderCtl}>
                                        <label htmlFor="pt-blur">
                                            Melt Blur <output>{maxBlur.toFixed(1)}rem</output>
                                        </label>
                                        <input
                                            id="pt-blur"
                                            type="range"
                                            min={0}
                                            max={2.5}
                                            step={0.1}
                                            value={maxBlur}
                                            onChange={e => {
                                                const v = parseFloat(e.target.value);
                                                setMaxBlur(v);
                                                previewMeltAdjustment({ maxBlur: v });
                                            }}
                                        />
                                    </div>
                                    <div className={styles.sliderCtl}>
                                        <label htmlFor="pt-contrast">
                                            Contrast <output>{maxContrast}×</output>
                                        </label>
                                        <input
                                            id="pt-contrast"
                                            type="range"
                                            min={1}
                                            max={24}
                                            step={1}
                                            value={maxContrast}
                                            onChange={e => {
                                                const v = parseInt(e.target.value, 10);
                                                setMaxContrast(v);
                                                previewMeltAdjustment({ maxContrast: v });
                                            }}
                                        />
                                    </div>
                                    <div className={styles.sliderCtl}>
                                        <label htmlFor="pt-melt-scale">
                                            Melt Scale <output>{meltScale}%</output>
                                        </label>
                                        <input
                                            id="pt-melt-scale"
                                            type="range"
                                            min={0}
                                            max={10}
                                            step={0.5}
                                            value={meltScale}
                                            onChange={e => {
                                                const v = parseFloat(e.target.value);
                                                setMeltScale(v);
                                                previewMeltAdjustment({ meltScale: v });
                                            }}
                                        />
                                    </div>
                                    <div className={styles.sliderCtl}>
                                        <label htmlFor="pt-exit-ms">
                                            Melt Out <output>{exitMs}ms</output>
                                        </label>
                                        <input
                                            id="pt-exit-ms"
                                            type="range"
                                            min={80}
                                            max={1000}
                                            step={20}
                                            value={exitMs}
                                            onChange={e => setExitMs(parseInt(e.target.value, 10))}
                                        />
                                    </div>
                                    <div className={styles.sliderCtl}>
                                        <label htmlFor="pt-enter-ms">
                                            Melt In <output>{enterMs}ms</output>
                                        </label>
                                        <input
                                            id="pt-enter-ms"
                                            type="range"
                                            min={120}
                                            max={1400}
                                            step={20}
                                            value={enterMs}
                                            onChange={e => setEnterMs(parseInt(e.target.value, 10))}
                                        />
                                    </div>
                                </div>

                                {/* Quick Page Melt Navigation Tester */}
                                <div className={styles.quickJumpWrap}>
                                    <span className={styles.quickJumpTitle}>Test Melt Across Pages:</span>
                                    <div className={styles.quickJumpRow}>
                                        {QUICK_ROUTES.map(r => (
                                            <button
                                                key={r.href}
                                                type="button"
                                                className={`${styles.jumpPill} ${pathname === r.href ? styles.jumpPillActive : ''}`}
                                                onClick={() => navigateTo(r.href)}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <p className={styles.descLine}>
                                    <strong>{currentMeltStepObj.num} {currentMeltStepObj.label}:</strong> {currentMeltStepObj.desc}
                                </p>
                            </>
                        ) : (
                            <>
                                {/* Tab 3: 6-Stage Initial Preloader Controls */}
                                <div className={styles.timelineBox}>
                                    <div className={styles.timelineLabels}>
                                        <span>0% (Curtain)</span>
                                        <span className={styles.timelineReadout}>Preloader {preloaderPct}% · Step 0{preloaderStep}</span>
                                        <span>100% (Live)</span>
                                    </div>
                                </div>

                                <div className={styles.stepsGrid} role="group" aria-label="Preloader sequence steps">
                                    {PRELOADER_STEPS.map(step => {
                                        const isCurrent = preloaderStep === step.id;
                                        const isDone = preloaderStep > step.id;
                                        return (
                                            <button
                                                key={step.id}
                                                type="button"
                                                className={`${styles.stepPill} ${isCurrent ? styles.stepPillActive : ''} ${isDone ? styles.stepPillDone : ''}`}
                                                aria-pressed={isCurrent}
                                                onClick={() => {
                                                    setPreloaderStep(step.id);
                                                    window.dispatchEvent(new CustomEvent('preloader-hud-command', { detail: { step: step.id } }));
                                                }}
                                            >
                                                <span className={styles.stepNum}>{step.num}</span>
                                                <span className={styles.stepName}>{step.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className={styles.actionsRow}>
                                    <button
                                        type="button"
                                        className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                        onClick={() => {
                                            setPreloaderPaused(false);
                                            setPreloaderStep(1);
                                            window.dispatchEvent(new CustomEvent('preloader-hud-command', { detail: { replay: true } }));
                                        }}
                                    >
                                        ↻ Replay Preloader
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.actionBtn}
                                        onClick={() => {
                                            const next = !preloaderPaused;
                                            setPreloaderPaused(next);
                                            window.dispatchEvent(new CustomEvent('preloader-hud-command', { detail: { togglePause: next } }));
                                        }}
                                    >
                                        {preloaderPaused ? '▶ Play' : '⏸ Pause'}
                                    </button>
                                </div>

                                <p className={styles.descLine}>
                                    <strong>{currentPreloaderObj.num} {currentPreloaderObj.label}:</strong> {currentPreloaderObj.desc}
                                </p>
                            </>
                        )}
                    </div>
                )}
            </aside>

            {/* Right HUD: Standalone Flame Control Studio UI (In Its Own Dedicated Window) */}
            <aside className={styles.flameHud} aria-label="Flame Studio Controls">
                {flameHudMinimized ? (
                    <button
                        type="button"
                        className={styles.minimizedPill}
                        onClick={() => {
                            setFlameHudMinimized(false);
                            if (!flameVisibleOnPage && pathname !== '/fire-test') showFlameForEditing(true);
                        }}
                    >
                        <span className={styles.pillBadge}>🔥 0{(flameSettings.selectedIndex ?? 0) + 1}</span>
                        <span className={styles.pillText}>
                            Flame Studio · {(flameSettings.flames ?? FIVE_FLAME_DEFAULTS)[flameSettings.selectedIndex ?? 0]?.label ?? '01 Gas Whoosh'}
                        </span>
                    </button>
                ) : (
                    <div className={styles.flameCard}>
                        {/* Header */}
                        <div className={styles.header}>
                            <div className={styles.titleWrap}>
                                <span className={styles.title}>🔥 Flame Studio</span>
                                <span className={styles.phaseBadge}>
                                    {flameSettings.autoLoopBurst
                                        ? 'AUTO-BURST'
                                        : ((flameSettings.flames ?? FIVE_FLAME_DEFAULTS)[flameSettings.selectedIndex ?? 0]?.label ?? '01 GAS WHOOSH')}
                                </span>
                            </div>
                            <div className={styles.headerActions}>
                                <button
                                    type="button"
                                    className={`${styles.jumpPill} ${flameVisibleOnPage ? styles.jumpPillActive : ''}`}
                                    onClick={() => showFlameForEditing(!flameVisibleOnPage)}
                                    title="Show or hide the 3D flame stage on screen"
                                >
                                    {flameVisibleOnPage ? '🔥 Flame On' : '🚫 Flame Off'}
                                </button>
                                <button
                                    type="button"
                                    className={styles.iconBtn}
                                    onClick={() => setFlameHudMinimized(true)}
                                    aria-label="Minimize Flame Studio"
                                >
                                    −
                                </button>
                            </div>
                        </div>

                        {/* Gas-on-Fire Burst & Preloader Build Hero Bar */}
                        <div className={styles.burstHeroRow}>
                            <button
                                type="button"
                                className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                onClick={() => {
                                    setFlameVisibleOnPage(false);
                                    setPreloaderPaused(false);
                                    setPreloaderStep(1);
                                    window.dispatchEvent(new CustomEvent('preloader-hud-command', { detail: { replay: true } }));
                                }}
                                title="Replay the 0% → 100% preloader: flame builds as it loads, then flames out"
                            >
                                🔥 Build 0→100% &amp; Flame Out
                            </button>
                            <button
                                type="button"
                                className={`${styles.actionBtn} ${flameSettings.autoLoopBurst ? styles.actionBtnPrimary : ''}`}
                                onClick={() => {
                                    if (!flameVisibleOnPage && pathname !== '/fire-test') showFlameForEditing(true);
                                    const nextLoop = !flameSettings.autoLoopBurst;
                                    updateFlame({ autoLoopBurst: nextLoop }, undefined, nextLoop, !nextLoop);
                                }}
                                title="Automatically repeat the gas-on-fire burst every ~1.6s while you tune sliders"
                            >
                                {flameSettings.autoLoopBurst ? '🔄 Auto-Loop: ON' : '⛽ Gas Burst / Loop'}
                            </button>
                        </div>

                        {/* Stage Environment & Interaction Tools */}
                        <div className={styles.stageToolsRow}>
                            <button
                                type="button"
                                className={`${styles.actionBtn} ${flameDarkStage ? styles.actionBtnPrimary : ''}`}
                                onClick={() => {
                                    const next = !flameDarkStage;
                                    setFlameDarkStage(next);
                                    if (!flameVisibleOnPage && pathname !== '/fire-test') {
                                        showFlameForEditing(true, next);
                                    } else {
                                        window.dispatchEvent(new CustomEvent('preloader-hud-command', { detail: { darkStage: next } }));
                                    }
                                }}
                                title="Toggle solid black stage backdrop vs transparent live page backdrop"
                            >
                                {flameDarkStage ? '🌑 Black BG' : '🪟 Page BG'}
                            </button>
                            <button
                                type="button"
                                className={`${styles.actionBtn} ${flameDragOnPage && !flameOrbitMode ? styles.actionBtnPrimary : ''}`}
                                onClick={() => {
                                    const next = !(flameDragOnPage && !flameOrbitMode);
                                    if (next && !flameVisibleOnPage && pathname !== '/fire-test') showFlameForEditing(true);
                                    setFlameDragOnPage(next);
                                    setFlameOrbitMode(false);
                                    window.dispatchEvent(new CustomEvent('preloader-hud-command', { detail: { dragFlame: next } }));
                                    window.dispatchEvent(new CustomEvent('flame-settings-external', { detail: { dragMode: 'move' } }));
                                }}
                                title="Click and drag the flame directly on screen"
                            >
                                {flameDragOnPage && !flameOrbitMode ? '✋ Dragging' : '✋ Drag Pos'}
                            </button>
                            <button
                                type="button"
                                className={`${styles.actionBtn} ${flameOrbitMode ? styles.actionBtnPrimary : ''}`}
                                onClick={() => {
                                    const next = !flameOrbitMode;
                                    if (next && !flameVisibleOnPage && pathname !== '/fire-test') showFlameForEditing(true);
                                    setFlameOrbitMode(next);
                                    setFlameDragOnPage(next);
                                    window.dispatchEvent(new CustomEvent('preloader-hud-command', { detail: { dragFlame: next } }));
                                    window.dispatchEvent(new CustomEvent('flame-settings-external', { detail: { dragMode: next ? 'orbit' : 'move' } }));
                                }}
                                title="Orbit and zoom the 3D camera around the flame"
                            >
                                {flameOrbitMode ? '🎥 3D Orbiting' : '🎥 3D Orbit'}
                            </button>
                            <button
                                type="button"
                                className={styles.actionBtn}
                                onClick={() => {
                                    if (!flameVisibleOnPage && pathname !== '/fire-test') showFlameForEditing(true);
                                    const selIdx = flameSettings.selectedIndex ?? 0;
                                    const def = FIVE_FLAME_DEFAULTS[selIdx] ?? FIVE_FLAME_DEFAULTS[0];
                                    updateFlame({ ...def, posX: 0, posY: -1.54 }, def.presetId, true, false);
                                }}
                                title="Reset active flame to factory default"
                            >
                                ↺ Reset
                            </button>
                        </div>

                        {/* 5 Different Flame Options Selector (Switches the Single Flame) */}
                        <div className={styles.quickJumpWrap}>
                            <span className={styles.quickJumpTitle}>
                                Choose 1 of 5 Flame Styles (Click to Switch &amp; Burst):
                            </span>
                            <div className={styles.flameSlotsGrid} role="group" aria-label="Choose one of the 5 flame styles">
                                {(flameSettings.flames ?? FIVE_FLAME_DEFAULTS).map((slot, idx) => {
                                    const isSelected = (flameSettings.selectedIndex ?? 0) === idx;
                                    const shortName = slot.label.replace(/^0\d\s+/, '');
                                    return (
                                        <button
                                            key={slot.label}
                                            type="button"
                                            className={`${styles.flameSlotBtn} ${isSelected ? styles.flameSlotBtnActive : ''}`}
                                            aria-pressed={isSelected}
                                            onClick={() => {
                                                if (!flameVisibleOnPage && pathname !== '/fire-test') showFlameForEditing(true);
                                                updateFlame({ selectedIndex: idx, showAll5: false }, slot.presetId, true, false);
                                            }}
                                        >
                                            <span className={styles.flameSlotNum}>🔥 0{idx + 1}</span>
                                            <span className={styles.flameSlotName}>{shortName}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Primary Preloader Build Control: Height at 100% */}
                        <div className={styles.sliderCtl}>
                            <label htmlFor="studio-top-height-100">
                                🔥 Height at 100% (0% → 100% Growth Peak){' '}
                                <output>{Math.round(Number(flameSettings.idle ?? 0.48) * 100)}%</output>
                            </label>
                            <input
                                id="studio-top-height-100"
                                type="range"
                                min={0.1}
                                max={2.0}
                                step={0.02}
                                value={Number(flameSettings.idle ?? 0.48)}
                                onChange={e => {
                                    if (!flameVisibleOnPage && pathname !== '/fire-test') showFlameForEditing(true);
                                    const val = parseFloat(e.target.value);
                                    updateFlame({ idle: val }, null, false, true);
                                }}
                            />
                        </div>

                        {/* Category Filter Sub-Tabs inside the 5-Flame Studio */}
                        <div className={styles.subTabs} role="tablist" aria-label="Flame parameter categories">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={flameSubTab === 'all'}
                                className={`${styles.tabBtn} ${flameSubTab === 'all' ? styles.tabBtnActive : ''}`}
                                onClick={() => setFlameSubTab('all')}
                            >
                                All (23)
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={flameSubTab === 'burst'}
                                className={`${styles.tabBtn} ${flameSubTab === 'burst' ? styles.tabBtnActive : ''}`}
                                onClick={() => setFlameSubTab('burst')}
                            >
                                💥 Burst
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={flameSubTab === 'shape'}
                                className={`${styles.tabBtn} ${flameSubTab === 'shape' ? styles.tabBtnActive : ''}`}
                                onClick={() => setFlameSubTab('shape')}
                            >
                                🔥 Shape
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={flameSubTab === 'pos'}
                                className={`${styles.tabBtn} ${flameSubTab === 'pos' ? styles.tabBtnActive : ''}`}
                                onClick={() => setFlameSubTab('pos')}
                            >
                                📐 Pos
                            </button>
                        </div>

                        {/* SECTION 1: Gas-on-Fire Burst & Die-Down Controls */}
                        {(flameSubTab === 'all' || flameSubTab === 'burst') && (
                            <>
                                <div className={styles.quickJumpWrap}>
                                    <span className={styles.quickJumpTitle}>Gas-on-Fire Burst Presets (Click to Fire):</span>
                                    <div className={styles.presetsGrid} role="group" aria-label="Flare-up and die-down presets">
                                        {FLARE_PRESETS.map(fp => (
                                            <button
                                                key={fp.id}
                                                type="button"
                                                className={`${styles.presetBtn} ${flarePreset === fp.id ? styles.presetBtnActive : ''}`}
                                                aria-pressed={flarePreset === fp.id}
                                                title={fp.desc}
                                                onClick={() => {
                                                    if (!flameVisibleOnPage && pathname !== '/fire-test') showFlameForEditing(true);
                                                    setFlarePreset(fp.id);
                                                    updateFlame(
                                                        {
                                                            flareRise: fp.flareRise,
                                                            flareHold: fp.flareHold,
                                                            flareDecay: fp.flareDecay,
                                                            flareEndHeight: fp.flareEndHeight,
                                                            flarePeakHeight: fp.flarePeakHeight,
                                                            flareBelly: fp.flareBelly,
                                                            flareSpeedBoost: fp.flareSpeedBoost,
                                                        },
                                                        undefined,
                                                        true,
                                                        false
                                                    );
                                                }}
                                            >
                                                {fp.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.slidersGrid}>
                                    {FLARE_SLIDERS.map(sl => {
                                        const numVal = Number(flameSettings[sl.key] ?? 0);
                                        return (
                                            <div className={styles.sliderCtl} key={sl.key}>
                                                <label htmlFor={`studio-flare-${sl.key}`}>
                                                    {sl.label} <output>{sl.fmt(numVal)}</output>
                                                </label>
                                                <input
                                                    id={`studio-flare-${sl.key}`}
                                                    type="range"
                                                    min={sl.min}
                                                    max={sl.max}
                                                    step={sl.step}
                                                    value={numVal}
                                                    onChange={e => {
                                                        if (!flameVisibleOnPage && pathname !== '/fire-test') showFlameForEditing(true);
                                                        setFlarePreset(null);
                                                        const val = parseFloat(e.target.value);
                                                        updateFlame({ [sl.key]: val }, undefined, true, false);
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* SECTION 2: Flame Character Presets + Shape, Turbulence & Color Sliders */}
                        {(flameSubTab === 'all' || flameSubTab === 'shape') && (
                            <>
                                <div className={styles.quickJumpWrap}>
                                    <span className={styles.quickJumpTitle}>10 Flame Character Presets (Instant Live Look):</span>
                                    <div className={styles.presetsGrid} role="group" aria-label="Flame character presets">
                                        {PRESETS.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                className={`${styles.presetBtn} ${flamePreset === p.id ? styles.presetBtnActive : ''}`}
                                                aria-pressed={flamePreset === p.id}
                                                onClick={() => {
                                                    if (!flameVisibleOnPage && pathname !== '/fire-test') showFlameForEditing(true);
                                                    updateFlame(
                                                        {
                                                            presetId: p.id,
                                                            magnitude: p.magnitude,
                                                            lacunarity: p.lacunarity,
                                                            gain: p.gain,
                                                            hue: p.hue,
                                                            intensity: p.intensity,
                                                            width: p.width,
                                                            speed: p.speed,
                                                            hueBase: p.hueBase,
                                                            idle: p.idle,
                                                        },
                                                        p.id,
                                                        false,
                                                        true
                                                    );
                                                }}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.slidersGrid}>
                                    {SLIDERS.slice(0, 9).map(sl => {
                                        const numVal = Number(flameSettings[sl.key] ?? 0);
                                        return (
                                            <div className={styles.sliderCtl} key={sl.key}>
                                                <label htmlFor={`studio-shape-${sl.key}`}>
                                                    {sl.label} <output>{sl.fmt(numVal)}</output>
                                                </label>
                                                <input
                                                    id={`studio-shape-${sl.key}`}
                                                    type="range"
                                                    min={sl.min}
                                                    max={sl.max}
                                                    step={sl.step}
                                                    value={numVal}
                                                    onChange={e => {
                                                        if (!flameVisibleOnPage && pathname !== '/fire-test') showFlameForEditing(true);
                                                        updateFlame({ [sl.key]: parseFloat(e.target.value) }, null, false, true);
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* SECTION 3: Position, Scale & Rising Ember Sliders */}
                        {(flameSubTab === 'all' || flameSubTab === 'pos') && (
                            <div className={styles.slidersGrid}>
                                {POSITION_SLIDERS.map(sl => {
                                    const numVal = Number(flameSettings[sl.key] ?? 0);
                                    return (
                                        <div className={styles.sliderCtl} key={sl.key}>
                                            <label htmlFor={`studio-pos-${sl.key}`}>
                                                {sl.label} <output>{sl.fmt(numVal)}</output>
                                            </label>
                                            <input
                                                id={`studio-pos-${sl.key}`}
                                                type="range"
                                                min={sl.min}
                                                max={sl.max}
                                                step={sl.step}
                                                value={numVal}
                                                onChange={e => {
                                                    if (!flameVisibleOnPage && pathname !== '/fire-test') showFlameForEditing(true);
                                                    updateFlame({ [sl.key]: parseFloat(e.target.value) }, undefined, false, true);
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                                {SLIDERS.slice(9).map(sl => {
                                    const numVal = Number(flameSettings[sl.key] ?? 0);
                                    return (
                                        <div className={styles.sliderCtl} key={sl.key}>
                                            <label htmlFor={`studio-ember-${sl.key}`}>
                                                {sl.label} <output>{sl.fmt(numVal)}</output>
                                            </label>
                                            <input
                                                id={`studio-ember-${sl.key}`}
                                                type="range"
                                                min={sl.min}
                                                max={sl.max}
                                                step={sl.step}
                                                value={numVal}
                                                onChange={e => {
                                                    if (!flameVisibleOnPage && pathname !== '/fire-test') showFlameForEditing(true);
                                                    updateFlame({ [sl.key]: parseFloat(e.target.value) }, undefined, false, true);
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </aside>
        </>
    );
}
