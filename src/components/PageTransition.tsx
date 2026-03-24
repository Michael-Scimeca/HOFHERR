'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const wrapRef = useRef<HTMLDivElement>(null);
    const isFirst = useRef(true);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        if (isFirst.current) {
            // First load — just fade in gently
            isFirst.current = false;
            el.style.opacity = '0';
            el.style.transform = 'translateY(12px)';
            requestAnimationFrame(() => requestAnimationFrame(() => {
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }));
            return;
        }

        // Subsequent navigations — fade out then in
        el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px)';

        const t = setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';

            // Handle hash scroll
            setTimeout(() => {
                const hash = window.location.hash;
                if (!hash) return;
                const target = document.getElementById(hash.replace('#', ''));
                if (target) {
                    const y = target.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 100);
        }, 220);

        return () => clearTimeout(t);
    }, [pathname]);

    // Hash-change mid-session
    useEffect(() => {
        const onHashChange = () => {
            const hash = window.location.hash;
            if (!hash) return;
            const target = document.getElementById(hash.replace('#', ''));
            if (target) {
                const y = target.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    return (
        <div ref={wrapRef} style={{ willChange: 'opacity, transform' }}>
            {children}
        </div>
    );
}
