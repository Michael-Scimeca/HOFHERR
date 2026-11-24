'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const TrophyCanvas = dynamic(() => import('@/components/TrophyModel'), { ssr: false });

export default function LazyTrophy({ className }: { className?: string }) {
    const [shouldMount, setShouldMount] = useState(false);

    // Defer Three.js + 3D GLB bundle evaluation until after initial paint & TBT window
    useEffect(() => {
        let mounted = false;
        const mount = () => {
            if (mounted) return;
            mounted = true;
            setShouldMount(true);
        };
        const timer = window.setTimeout(mount, 2600);
        const onInteract = () => mount();
        window.addEventListener('pointerdown', onInteract, { once: true, passive: true });
        window.addEventListener('scroll', onInteract, { once: true, passive: true });
        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('pointerdown', onInteract);
            window.removeEventListener('scroll', onInteract);
        };
    }, []);

    if (!shouldMount) return null;
    return <TrophyCanvas className={className} />;
}
