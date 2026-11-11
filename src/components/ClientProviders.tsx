'use client';

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

// Suppress upstream @react-three/fiber internal THREE.Clock deprecation warning in Three.js r183
if (typeof window !== 'undefined') {
    const origWarn = console.warn;
    console.warn = (...args: unknown[]) => {
        if (typeof args[0] === 'string' && args[0].includes('Clock: This module has been deprecated')) return;
        origWarn.apply(console, args);
    };
}

export default function ClientProviders({
    children,
    session,
}: {
    children: React.ReactNode;
    session: Session | null;
}) {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}
