'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistrar() {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') return;
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

        const register = () => {
            navigator.serviceWorker
                .register('/sw.js', { scope: '/', updateViaCache: 'none' })
                .catch(() => {
                    // Ignore registration errors in restricted/private contexts
                });
        };

        if (document.readyState === 'complete') {
            register();
            return;
        }

        window.addEventListener('load', register, { once: true });
        return () => window.removeEventListener('load', register);
    }, []);

    return null;
}

