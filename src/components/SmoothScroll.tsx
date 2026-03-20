'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll() {
    const lenisRef = useRef<Lenis | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            TouchMultiplier: 2,
            infinite: false,
        } as ConstructorParameters<typeof Lenis>[0]);

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // ── Hash anchor handler ──────────────────────────────────────────────
        // Lenis intercepts native scroll, so we need to manually scroll to
        // hash targets after the page transition clears (~120ms).
        function scrollToHash(hash: string) {
            if (!hash) return;
            const id = hash.replace('#', '');
            // Retry a few times in case the DOM isn't painted yet
            let attempts = 0;
            const tryScroll = () => {
                const el = document.getElementById(id);
                if (el) {
                    const offset = el.getBoundingClientRect().top + window.scrollY - 80; // 80px for sticky nav
                    lenis.scrollTo(offset, { duration: 1.0 });
                } else if (attempts < 10) {
                    attempts++;
                    setTimeout(tryScroll, 80);
                }
            };
            // Wait for page transition to clear before scrolling
            setTimeout(tryScroll, 150);
        }

        // On mount: handle hash already in URL
        if (window.location.hash) {
            scrollToHash(window.location.hash);
        }

        // Handle hash changes mid-session (e.g. clicking a link on the same page)
        const onHashChange = () => scrollToHash(window.location.hash);
        window.addEventListener('hashchange', onHashChange);

        return () => {
            lenis.destroy();
            window.removeEventListener('hashchange', onHashChange);
        };
    }, [pathname]); // re-run on every route change so new page hashes work

    return null;
}

