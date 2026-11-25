'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const TrophyCanvas = dynamic(() => import('@/components/TrophyModel'), { ssr: false });

export default function LazyTrophy({ className }: { className?: string }) {
    const [shouldMount, setShouldMount] = useState(false);

    // Defer Three.js + 2MB 3D GLB bundle until first real user interaction
    useEffect(() => {
        let mounted = false;
        const mount = () => {
            if (mounted) return;
            mounted = true;
            setShouldMount(true);
        };
        const events = ['pointermove', 'pointerdown', 'touchstart', 'scroll', 'keydown'] as const;
        events.forEach((ev) => window.addEventListener(ev, mount, { once: true, passive: true }));
        return () => {
            events.forEach((ev) => window.removeEventListener(ev, mount));
        };
    }, []);

    if (!shouldMount) return null;
    return <TrophyCanvas className={className} />;
}
