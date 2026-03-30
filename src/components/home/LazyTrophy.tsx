'use client';

import dynamic from 'next/dynamic';

const TrophyCanvas = dynamic(() => import('@/components/TrophyModel'), { ssr: false });

export default function LazyTrophy({ className }: { className?: string }) {
    return <TrophyCanvas className={className} />;
}
