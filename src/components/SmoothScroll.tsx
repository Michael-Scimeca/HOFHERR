'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type Lenis from 'lenis';
import { isScrollLocked } from '@/lib/scrollLock';

export default function SmoothScroll() {
    const lenisRef = useRef<Lenis | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        // Mobile/touch devices already have native momentum scrolling; skip Lenis and its 60fps rAF loop.
        if (
            window.innerWidth <= 768 ||
            window.matchMedia('(pointer: coarse)').matches ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return;
        }

        let destroyed = false;
        let rafId = 0;
        let lenis: Lenis | null = null;
        let ro: ResizeObserver | null = null;
        let clampLimitToFooter: (() => void) | null = null;

        const initLenis = async () => {
            if (destroyed || lenis) return;
            const { default: LenisCtor } = await import('lenis');
            if (destroyed) return;

            lenis = new LenisCtor({
                duration: 1.2,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                TouchMultiplier: 2,
                infinite: false,
            } as ConstructorParameters<typeof LenisCtor>[0]);

            clampLimitToFooter = () => {
                if (!lenis) return;
                const footer = document.querySelector('footer[data-site-footer="true"]');
                if (!footer) return;
                const footerBottom = Math.round(footer.getBoundingClientRect().bottom + window.scrollY);
                const maxScroll = Math.max(0, footerBottom - window.innerHeight);
                if (lenis.dimensions.scrollHeight > footerBottom) {
                    lenis.dimensions.scrollHeight = footerBottom;
                }
                if (window.scrollY > maxScroll) {
                    window.scrollTo(0, maxScroll);
                }
            };

            clampLimitToFooter();
            const ptWrap = document.querySelector('.pt-wrap');
            ro = new ResizeObserver(() => {
                clampLimitToFooter?.();
            });
            if (ptWrap) ro.observe(ptWrap);
            window.addEventListener('resize', clampLimitToFooter);

            lenisRef.current = lenis;
            (window as unknown as { lenis?: Lenis }).lenis = lenis;

            function raf(time: number) {
                lenis?.raf(time);
                rafId = requestAnimationFrame(raf);
            }

            rafId = requestAnimationFrame(raf);

            if (isScrollLocked()) lenis.stop();
        };

        // Defer Lenis download + rAF loop until first user interaction so initial load has 0ms Lenis CPU cost.
        const onInteract = () => {
            removeInteractListeners();
            void initLenis();
        };
        const removeInteractListeners = () => {
            window.removeEventListener('wheel', onInteract);
            window.removeEventListener('keydown', onInteract);
            window.removeEventListener('pointerdown', onInteract);
            window.removeEventListener('scroll', onInteract);
        };

        window.addEventListener('wheel', onInteract, { passive: true, once: true });
        window.addEventListener('keydown', onInteract, { passive: true, once: true });
        window.addEventListener('pointerdown', onInteract, { passive: true, once: true });
        window.addEventListener('scroll', onInteract, { passive: true, once: true });

        return () => {
            destroyed = true;
            removeInteractListeners();
            if (rafId) cancelAnimationFrame(rafId);
            ro?.disconnect();
            if (clampLimitToFooter) window.removeEventListener('resize', clampLimitToFooter);
            lenis?.destroy();
            lenisRef.current = null;
        };
    }, [pathname]); // reset engine boundaries on path changes

    return null;
}

