/**
 * Shared "is the preloader still covering the page?" state.
 *
 * The fire preloader runs three.js on a solid black overlay for the first seconds of every full
 * page load. Anything animated underneath it is invisible, yet still competes with it for the
 * main thread and the GPU. Heavy effects read this gate so they only start once they can be seen:
 *
 *  - revealed: the black overlay has dropped away and the page is melting in.
 *  - done:     the preloader has finished and unmounted (also set on routes that skip it).
 */

let revealed = false;
let done = false;
let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

/** Safety net: never hold effects back forever if the preloader never reports in. */
const FALLBACK_MS = 30000;

function emit() {
    listeners.forEach(listener => listener());
}

export function isPreloaderRevealed(): boolean {
    return revealed;
}

export function isPreloaderDone(): boolean {
    return done;
}

export function markPreloaderRevealed(): void {
    if (revealed) return;
    revealed = true;
    emit();
}

export function markPreloaderDone(): void {
    if (done) return;
    revealed = true;
    done = true;
    if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
    }
    emit();
}

/** Calls `listener` whenever the preloader reaches a new stage. Returns an unsubscribe function. */
export function subscribePreloader(listener: () => void): () => void {
    listeners.add(listener);
    if (!done && !fallbackTimer && typeof window !== 'undefined') {
        fallbackTimer = setTimeout(markPreloaderDone, FALLBACK_MS);
    }
    return () => {
        listeners.delete(listener);
    };
}

/* ───────────── Once-per-session playback ───────────── */

const SEEN_STORAGE_KEY = 'hofherr_preloader_seen_v1';
let seenAtLoad: boolean | null = null;

/**
 * True when the preloader already played earlier in this browser tab's session, so this page
 * load (a refresh or a return visit in the same tab) should skip it. The answer is captured once
 * per page load, so finishing the preloader doesn't flip it mid-visit.
 */
export function hasSeenPreloaderThisSession(): boolean {
    if (typeof window === 'undefined') return false;
    if (seenAtLoad === null) {
        try {
            seenAtLoad = window.sessionStorage.getItem(SEEN_STORAGE_KEY) === '1';
        } catch {
            seenAtLoad = false;
        }
    }
    return seenAtLoad;
}

/**
 * True when the preloader should be skipped on the current client (already seen this tab session,
 * mobile/tablet touch device, narrow viewport, or prefers-reduced-motion). Shared by Preloader
 * and PageTransition so they never disagree about holding `.pt-wrap` in `.pt-waiting`.
 */
export function isLowPowerPreloaderSkip(): boolean {
    if (typeof window === 'undefined') return false;
    return (
        window.innerWidth <= 768 ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
}

export function shouldSkipPreloaderOnClient(): boolean {
    return hasSeenPreloaderThisSession() || isLowPowerPreloaderSkip();
}

/** Records that the preloader has played, so later page loads in this tab skip it. */
export function rememberPreloaderSeen(): void {
    if (typeof window === 'undefined') return;
    hasSeenPreloaderThisSession(); // capture this page load's answer before changing storage
    try {
        window.sessionStorage.setItem(SEEN_STORAGE_KEY, '1');
    } catch { /* storage unavailable (private mode): the preloader simply plays again */ }
}
