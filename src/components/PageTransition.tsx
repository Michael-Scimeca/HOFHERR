'use client';

import { createContext, useContext, useCallback, useRef, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/* ─── Context ─── */
interface TransitionContextType {
    navigateTo: (href: string) => void;
    isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
    navigateTo: () => {},
    isTransitioning: false,
});

export const usePageTransition = () => useContext(TransitionContext);

/* ─── Provider: wraps the entire layout (including Navbar) ─── */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const pendingHref = useRef<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Aggressively reset scroll — hits Lenis, native, and raw DOM
    const forceScrollTop = useCallback(() => {
        // Lenis smooth scroll
        const lenis = (window as any).lenis;
        if (lenis?.scrollTo) {
            lenis.scrollTo(0, { immediate: true, force: true });
        }
        // Native
        window.scrollTo({ top: 0, behavior: 'instant' });
        // Raw DOM
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, []);

    // Navigate: run exit first, THEN push route
    const navigateTo = useCallback((href: string) => {
        if (href === pathname) return;
        if (isTransitioning) return;

        setIsTransitioning(true);
        pendingHref.current = href;

        // Dispatch custom event so PageTransitionWrap can animate
        window.dispatchEvent(new CustomEvent('page-transition-exit'));

        // After exit animation, scroll to top and push route
        timeoutRef.current = setTimeout(() => {
            forceScrollTop();
            router.push(href);
        }, 350);
    }, [pathname, isTransitioning, router]);

    // When pathname changes, trigger enter animation
    useEffect(() => {
        if (!pendingHref.current) return;
        pendingHref.current = null;

        // Ensure we're at the top before revealing new page
        forceScrollTop();
        
        window.dispatchEvent(new CustomEvent('page-transition-enter'));

        // Also force after a tick in case Lenis re-initializes
        requestAnimationFrame(() => forceScrollTop());
        setTimeout(() => forceScrollTop(), 50);
        setTimeout(() => forceScrollTop(), 150);

        const t = setTimeout(() => {
            setIsTransitioning(false);
        }, 600);

        return () => clearTimeout(t);
    }, [pathname]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <TransitionContext.Provider value={{ navigateTo, isTransitioning }}>
            {children}
        </TransitionContext.Provider>
    );
}

/* ─── Animation Wrapper: wraps page content ─── */
export default function PageTransition({ children }: { children: React.ReactNode }) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const isFirst = useRef(true);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        // First load: melt in
        if (isFirst.current) {
            isFirst.current = false;
            el.classList.add('pt-enter');
            const t = setTimeout(() => el.classList.remove('pt-enter'), 600);
            return () => clearTimeout(t);
        }
    }, []);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const handleExit = () => {
            el.classList.remove('pt-enter');
            el.classList.add('pt-exit');
        };

        const handleEnter = () => {
            requestAnimationFrame(() => {
                el.classList.remove('pt-exit');
                el.classList.add('pt-enter');
                setTimeout(() => el.classList.remove('pt-enter'), 600);
            });
        };

        window.addEventListener('page-transition-exit', handleExit);
        window.addEventListener('page-transition-enter', handleEnter);

        return () => {
            window.removeEventListener('page-transition-exit', handleExit);
            window.removeEventListener('page-transition-enter', handleEnter);
        };
    }, []);

    return (
        <>
            <div ref={wrapRef} className="pt-wrap">
                {children}
            </div>
            <style jsx global>{`
                .pt-wrap {
                    filter: blur(0) contrast(1);
                    opacity: 1;
                    transform: scale(1);
                }

                .pt-exit {
                    animation: melt-out 350ms ease-in forwards;
                    pointer-events: none;
                }

                .pt-enter {
                    animation: melt-in 600ms ease-out forwards;
                }

                @keyframes melt-out {
                    0% {
                        filter: blur(0) contrast(1);
                        opacity: 1;
                        transform: scale(1);
                    }
                    60% {
                        filter: blur(0.4rem) contrast(8);
                        opacity: 0.6;
                        transform: scale(1.01);
                    }
                    100% {
                        filter: blur(0.8rem) contrast(12);
                        opacity: 0;
                        transform: scale(1.02);
                    }
                }

                @keyframes melt-in {
                    0% {
                        filter: blur(0.8rem) contrast(12);
                        opacity: 0;
                        transform: scale(0.98);
                    }
                    30% {
                        filter: blur(0.4rem) contrast(6);
                        opacity: 0.5;
                        transform: scale(0.99);
                    }
                    70% {
                        filter: blur(0.1rem) contrast(2);
                        opacity: 0.9;
                        transform: scale(1);
                    }
                    100% {
                        filter: blur(0) contrast(1);
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .pt-exit, .pt-enter {
                        animation: none !important;
                        filter: none !important;
                        opacity: 1 !important;
                        transform: none !important;
                    }
                }
            `}</style>
        </>
    );
}
