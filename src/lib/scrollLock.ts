/**
 * Page scroll lock shared by modals and the preloader.
 *
 * Setting `overflow: hidden` alone isn't enough on this site: Lenis (smooth scroll) moves the
 * page from script, which ignores overflow. So a lock also stops Lenis, and SmoothScroll checks
 * `isScrollLocked()` when it creates a new Lenis instance on route change.
 *
 * Locks are counted, so overlapping lockers (e.g. the preloader and a modal) don't release each
 * other early. Scrollable areas that must keep working while locked (a tall modal's overlay, the
 * cart drawer) need the `data-lenis-prevent` attribute, or Lenis will swallow their wheel/touch.
 */

type LenisLike = { stop?: () => void; start?: () => void };
const getLenis = () => (window as unknown as { lenis?: LenisLike }).lenis;

let locks = 0;

export function isScrollLocked(): boolean {
    return locks > 0;
}

/** Locks page scrolling. Call the returned function to release this lock. */
export function lockScroll(): () => void {
    if (typeof window === 'undefined') return () => {};
    const root = document.documentElement;

    if (locks === 0) {
        // The page doesn't jump sideways when the scrollbar goes: globals.css keeps its space
        // reserved at all times with `scrollbar-gutter: stable`.
        root.classList.add('scroll-locked');
        getLenis()?.stop?.();
    }
    locks += 1;

    let released = false;
    return () => {
        if (released) return;
        released = true;
        locks = Math.max(0, locks - 1);
        if (locks === 0) {
            root.classList.remove('scroll-locked');
            getLenis()?.start?.();
        }
    };
}
