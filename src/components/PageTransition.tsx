'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [opacity, setOpacity] = useState(1);
    const isFirst = useRef(true);

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }

        // Fade out
        setOpacity(0);

        const t = setTimeout(() => {
            // Fade back in
            setOpacity(1);

            // Handle hash scroll
            setTimeout(() => {
                const rawHash = window.location.hash;
                if (!rawHash) return;
                const id = rawHash.replace('#', '');
                const el = document.getElementById(id);
                if (el) {
                    const paddingTop = parseFloat(window.getComputedStyle(el).paddingTop) || 0;
                    const absoluteY = el.getBoundingClientRect().top + window.scrollY - 100 + paddingTop;
                    window.scrollTo({ top: absoluteY, behavior: 'smooth' });
                }
            }, 100);
        }, 200);

        return () => clearTimeout(t);
    }, [pathname]);

    // Hash-change mid-session
    useEffect(() => {
        const onHashChange = () => {
            const rawHash = window.location.hash;
            if (!rawHash) return;
            const id = rawHash.replace('#', '');
            const el = document.getElementById(id);
            if (el) {
                const paddingTop = parseFloat(window.getComputedStyle(el).paddingTop) || 0;
                const absoluteY = el.getBoundingClientRect().top + window.scrollY - 100 + paddingTop;
                window.scrollTo({ top: absoluteY, behavior: 'smooth' });
            }
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    return (
        <div
            style={{
                opacity,
                transition: 'opacity 0.25s ease',
                willChange: 'opacity',
            }}
        >
            {children}
        </div>
    );
}
