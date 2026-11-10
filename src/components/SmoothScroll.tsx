'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { isScrollLocked } from '@/lib/scrollLock';

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

        const clampLimitToFooter = () => {
            const footer = document.querySelector('footer');
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
        const ro = new ResizeObserver(() => {
            clampLimitToFooter();
        });
        if (ptWrap) ro.observe(ptWrap);
        window.addEventListener('resize', clampLimitToFooter);

        lenisRef.current = lenis;
        (window as any).lenis = lenis;

        let rafId: number;
        function raf(time: number) {
            clampLimitToFooter();
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        // Scroll to top on route change
        lenis.scrollTo(0, { immediate: true });

        // A modal or the preloader may already be holding the scroll lock (see src/lib/scrollLock.ts)
        if (isScrollLocked()) lenis.stop();

        return () => {
            cancelAnimationFrame(rafId);
            ro.disconnect();
            window.removeEventListener('resize', clampLimitToFooter);
            lenis.destroy();
        };
    }, [pathname]); // reset engine boundaries on path changes

    return null;
}

