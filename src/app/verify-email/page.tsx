'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const token = searchParams.get('token');

    // If there's a token but no status, redirect to the API route to process it
    if (token && !status) {
        if (typeof window !== 'undefined') {
            window.location.href = `/api/auth/verify-email?token=${token}`;
        }
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.icon}>⏳</div>
                    <h1 style={styles.title}>Verifying...</h1>
                    <p style={styles.desc}>Please wait while we confirm your email.</p>
                </div>
            </div>
        );
    }

    const states: Record<string, { icon: string; title: string; desc: string; cta?: { label: string; href: string } }> = {
        success: {
            icon: '✅',
            title: 'Email Verified!',
            desc: 'Your account is now active. You can sign in and start ordering.',
            cta: { label: 'Sign In', href: '/auth/signin' },
        },
        already: {
            icon: '👍',
            title: 'Already Verified',
            desc: 'This email has already been verified. You\'re good to go!',
            cta: { label: 'Sign In', href: '/auth/signin' },
        },
        expired: {
            icon: '⏰',
            title: 'Link Expired',
            desc: 'This verification link has expired. Please register again or contact us for help.',
            cta: { label: 'Sign Up Again', href: '/auth/signin' },
        },
        invalid: {
            icon: '❌',
            title: 'Invalid Link',
            desc: 'This verification link is invalid or has already been used.',
            cta: { label: 'Go Home', href: '/' },
        },
        error: {
            icon: '⚠️',
            title: 'Something Went Wrong',
            desc: 'We couldn\'t verify your email. Please try again or contact us.',
            cta: { label: 'Go Home', href: '/' },
        },
    };

    // Default: show "check your email" message (no status param = just registered)
    const state = status ? states[status] : null;

    if (!state) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.icon}>📧</div>
                    <h1 style={styles.title}>Check Your Email</h1>
                    <p style={styles.desc}>
                        We sent a verification link to your email address.<br />
                        Click the link to activate your account.
                    </p>
                    <div style={styles.hint}>
                        <strong>Didn't get it?</strong> Check your spam folder or try registering again.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.icon}>{state.icon}</div>
                <h1 style={styles.title}>{state.title}</h1>
                <p style={styles.desc}>{state.desc}</p>
                {state.cta && (
                    <Link href={state.cta.href} style={styles.button}>
                        {state.cta.label}
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.icon}>⏳</div>
                    <h1 style={styles.title}>Loading...</h1>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        padding: '20px',
    },
    card: {
        background: '#111',
        border: '1px solid #2a2a2a',
        borderRadius: 16,
        padding: '48px 40px',
        maxWidth: 480,
        width: '100%',
        textAlign: 'center' as const,
    },
    icon: {
        fontSize: 48,
        marginBottom: 16,
    },
    title: {
        fontFamily: "'Yanone Kaffeesatz', Georgia, serif",
        fontSize: 28,
        fontWeight: 700,
        color: '#fff',
        margin: '0 0 12px',
        letterSpacing: 1,
    },
    desc: {
        fontSize: 15,
        color: '#aaa',
        lineHeight: 1.6,
        margin: '0 0 24px',
    },
    hint: {
        fontSize: 13,
        color: '#666',
        marginTop: 8,
        lineHeight: 1.5,
    },
    button: {
        display: 'inline-block',
        background: '#800020',
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: 15,
        padding: '14px 40px',
        borderRadius: 8,
        letterSpacing: 0.5,
    },
};
