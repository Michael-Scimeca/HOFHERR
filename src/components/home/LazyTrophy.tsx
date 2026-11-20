'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const TrophyCanvas = dynamic(() => import('@/components/TrophyModel'), { ssr: false });

export default function LazyTrophy({ className }: { className?: string }) {
    const [shouldMount, setShouldMount] = useState(false);

    // Defer Three.js + 3D GLB bundle evaluation until after initial paint / idle so TBT & LCP stay fast
    useEffect(() => {
        const w = window as unknown as {
            requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
            cancelIdleCallback?: (id: number) => void;
        };
        if (w.requestIdleCallback) {
            const id = w.requestIdleCallback(() => setShouldMount(true), { timeout: 1400 });
            return () => w.cancelIdleCallback?.(id);
        }
        const timer = window.setTimeout(() => setShouldMount(true), 800);
        return () => window.clearTimeout(timer);
    }, []);

    if (!shouldMount) return null;
    return <TrophyCanvas className={className} />;
}
