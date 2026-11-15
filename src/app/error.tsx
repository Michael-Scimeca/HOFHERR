'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import FireBorder from '@/components/TestimonialWall/FireBorder';

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
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="btn-hit"
                    >
                        <span className="btn btn-secondary">↻ Try Again</span>
                    </button>
                    <Link href="/" className="btn-hit">
                        <span className="btn btn-secondary">← Back to Home</span>
                    </Link>
                    <Link href="/online-orders" className="btn-hit">
                        <span className="btn btn-primary">
                            <FireBorder active={true} radius={6} />
                            Order Online
                        </span>
                    </Link>
                </div>

                <div className="notFoundHours">
                    <span>Need help? Call us:</span>
                    <a href="tel:8474416328">(847) 441-MEAT</a>
                </div>
            </div>

            <div className="notFoundBigNum" aria-hidden>!</div>
        </div>
    );
}
