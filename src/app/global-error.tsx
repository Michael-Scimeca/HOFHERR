'use client';

/**
 * global-error.tsx — Last-resort error boundary.
 * Catches errors that occur in the root layout itself.
 * Must include its own <html> and <body> since the layout has failed.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang="en">
            <body style={{
                margin: 0,
                fontFamily: '"Inter", -apple-system, sans-serif',
                background: '#000',
                color: '#f2f2f2',
            }}>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 24px',
                    textAlign: 'center',
                }}>
                    <div style={{ maxWidth: 480 }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🥩</div>
                        <h1 style={{
                            fontFamily: '"Yanone Kaffeesatz", sans-serif',
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            lineHeight: 1.1,
                            textTransform: 'uppercase',
                            margin: '0 0 16px',
                        }}>
                            Something broke.
                        </h1>
                        <p style={{
                            fontSize: 15,
                            color: '#888',
                            lineHeight: 1.8,
                            margin: '0 0 32px',
                        }}>
                            We ran into a serious error loading the site. This is rare — try refreshing, or call us directly.
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => reset()}
                                style={{
                                    padding: '13px 28px',
                                    background: '#CC0E1D',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: '1.5px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                }}
                            >
                                ↻ Try Again
                            </button>
                            <a
                                href="/"
                                style={{
                                    padding: '13px 28px',
                                    border: '1.5px solid #ffffff1a',
                                    color: '#ccc',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    letterSpacing: '1.5px',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                }}
                            >
                                ← Home
                            </a>
                        </div>
                        <p style={{
                            fontSize: 13,
                            color: '#666',
                            marginTop: 32,
                            borderTop: '1px solid #ffffff1a',
                            paddingTop: 16,
                        }}>
                            Need help? Call{' '}
                            <a href="tel:8474416328" style={{ color: '#CC0E1D', fontWeight: 700, textDecoration: 'none' }}>
                                (847) 441-MEAT
                            </a>
                        </p>
                    </div>
                </div>
            </body>
        </html>
    );
}
