'use client';

import { useEffect } from 'react';
import ActionButton from '@/components/ActionButton';
import ContactLink from '@/components/ContactLink';

/**
 * error.tsx — Catches runtime errors in any page (not layout).
 * Matches the visual language of not-found.tsx.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error('[Hofherr Error Boundary]', error);
    }, [error]);

    return (
        <div className="notFoundPage">
            <div className="notFoundInner">
                <h1 className="notFoundHeadline">
                    We hit a<br />snag.
                </h1>

                <p className="notFoundSub">
                    Something unexpected happened while loading this page. Try again — if the problem persists, give us a call and we&apos;ll sort it out.
                </p>

                <div className="notFoundBtns">
                    <ActionButton variant="secondary" onClick={() => reset()}>
                        ↻ Try Again
                    </ActionButton>
                    <ActionButton href="/" variant="secondary">
                        ← Back to Home
                    </ActionButton>
                    <ActionButton href="/online-orders" variant="primary" fire>
                        Order Online
                    </ActionButton>
                </div>

                <div className="notFoundHours">
                    <span>Need help? Call us:</span>
                    <ContactLink kind="phone" />
                </div>
            </div>

            <div className="notFoundBigNum" aria-hidden>!</div>
        </div>
    );
}
