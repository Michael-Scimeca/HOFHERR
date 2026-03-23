'use client';

import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // The body starts at opacity: 0 in globals.css to prevent a flash of
        // unstyled content. Once the client has hydrated, we fade it in.
        document.body.style.opacity = '1';
    }, []);

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
