'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * error.tsx — Catches runtime errors in any page (not layout).
 * Matches the visual language of not-found.tsx.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error('[Hofherr Error Boundary]', error);
    }, [error]);

    return (
        <div style={{
            minHeight: 'calc(100vh - 68px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg)',
            position: 'relative',
            overflow: 'hidden',
            padding: '80px 24px',
        }}>
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Tag */}
                <span style={{
                    display: 'inline-block',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--red)',
                    background: 'color-mix(in srgb, var(--red) 10%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--red) 20%, transparent)',
                    padding: '5px 14px',
                    borderRadius: 100,
                    width: 'fit-content',
                }}>
                    Something Went Wrong
                </span>

                {/* Headline */}
                <h1 style={{
                    fontFamily: '"Yanone Kaffeesatz", sans-serif',
                    fontSize: 'clamp(2.4rem, 6vw, 4rem)',
                    color: 'var(--fg)',
                    lineHeight: 1.1,
                    margin: 0,
                    textTransform: 'uppercase',
                }}>
                    We hit a<br />snag.
                </h1>

                {/* Description */}
                <p style={{
                    fontSize: 15,
                    color: 'var(--fg-muted)',
                    lineHeight: 1.8,
                    margin: 0,
                    maxWidth: 460,
                }}>
                    Something unexpected happened while loading this page. Try again — if the problem persists, give us a call and we&apos;ll sort it out.
                </p>

                {/* Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <button
                        onClick={() => reset()}
                        className="btn btn-primary"
                    >
                        ↻ Try Again
                    </button>
                    <Link href="/" className="btn btn-secondary">
                        ← Back to Home
                    </Link>
                    <Link href="/online-orders" className="btn btn-secondary">
                        Order Online
                    </Link>
                </div>

                {/* Contact */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    color: 'var(--fg-muted)',
                    paddingTop: 8,
                    borderTop: '1px solid var(--border)',
                }}>
                    <span>Need help? Call us:</span>
                    <a href="tel:8474416328" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>
                        (847) 441-MEAT
                    </a>
                </div>
            </div>

            {/* Big background text */}
            <div aria-hidden style={{
                position: 'absolute',
                bottom: '-0.15em',
                right: '-0.05em',
                fontFamily: '"Yanone Kaffeesatz", sans-serif',
                fontSize: 'clamp(14rem, 30vw, 28rem)',
                fontWeight: 900,
                color: 'var(--bg-2)',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
                zIndex: 0,
            }}>
                !
            </div>
        </div>
    );
}
