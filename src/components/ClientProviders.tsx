'use client';

import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

export default function ClientProviders({
    children,
    session,
}: {
    children: React.ReactNode;
    session: Session | null;
}) {
    useEffect(() => {
        // The body starts at opacity: 0 in globals.css to prevent a flash of
        // unstyled content. Once the client has hydrated, we fade it in.
        document.body.style.opacity = '1';
    }, []);

    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}
