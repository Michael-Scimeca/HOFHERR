'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { AuthMode } from './AuthModal';

const AuthModal = dynamic(() => import('./AuthModal'), { ssr: false });

const OPEN_EVENT = 'hofherr-open-auth-modal';

/**
 * Defers downloading AuthModal, AuthModal.module.css (7.4 KB), and BurnModalShell
 * until a visitor actually clicks Sign In / Sign Up.
 */
export default function LazyAuthModal() {
    const [initialRequest, setInitialRequest] = useState<{ mode?: AuthMode; force?: boolean } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (mounted) return;
        const onOpen = (e: Event) => {
            const detail = (e as CustomEvent<{ mode?: AuthMode; force?: boolean }>).detail ?? {};
            setInitialRequest(detail);
            setMounted(true);
        };
        window.addEventListener(OPEN_EVENT, onOpen, { once: true });
        return () => window.removeEventListener(OPEN_EVENT, onOpen);
    }, [mounted]);

    if (!mounted) return null;
    return <AuthModal initialRequest={initialRequest} />;
}

