'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import styles from './page.module.css';

interface VerifyStateConfig {
    titleFirst: string;
    titleAccent: string;
    tag: string;
    desc: string;
    isSuccess?: boolean;
    cta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
}

const VERIFY_STATES: Record<string, VerifyStateConfig> = {
    success: {
        titleFirst: 'Email',
        titleAccent: 'Verified!',
        tag: 'ACCOUNT ACTIVE',
        desc: 'Your Hofherr Meat Co. account is now active. Sign in to place custom butcher orders, reserve holiday roasts, and track pickups.',
        isSuccess: true,
        cta: { label: 'Sign In to Account', href: '/auth/signin' },
        secondaryCta: { label: 'Browse Online Orders', href: '/online-orders' },
    },
    already: {
        titleFirst: 'Already',
        titleAccent: 'Verified',
        tag: 'VERIFIED MEMBER',
        desc: 'This email address has already been verified. Your account is ready whenever you are.',
        isSuccess: true,
        cta: { label: 'Sign In to Account', href: '/auth/signin' },
        secondaryCta: { label: 'Back to Home', href: '/' },
    },
    expired: {
        titleFirst: 'Link',
        titleAccent: 'Expired',
        tag: 'TOKEN EXPIRED',
        desc: 'This verification link has expired. Please sign up again or reach out to our butcher counter for assistance.',
        cta: { label: 'Sign Up Again', href: '/auth/signin' },
        secondaryCta: { label: 'Back to Home', href: '/' },
    },
    invalid: {
        titleFirst: 'Invalid',
        titleAccent: 'Link',
        tag: 'INVALID TOKEN',
        desc: 'This verification link is invalid or has already been used.',
        cta: { label: 'Sign In', href: '/auth/signin' },
        secondaryCta: { label: 'Back to Home', href: '/' },
    },
    error: {
        titleFirst: 'Verification',
        titleAccent: 'Error',
        tag: 'SYSTEM NOTICE',
        desc: 'We could not verify your email right now. Please try again or contact the shop.',
        cta: { label: 'Try Sign In', href: '/auth/signin' },
        secondaryCta: { label: 'Back to Home', href: '/' },
    },
};

function StatusIcon({ status }: { status: string | null }) {
    if (status === 'success' || status === 'already') {
        return (
            <svg className={styles.statusIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
            </svg>
        );
    }
    if (status === 'expired') {
        return (
            <svg className={styles.statusIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </svg>
        );
    }
    if (status === 'invalid' || status === 'error') {
        return (
            <svg className={styles.statusIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
        );
    }
    return (
        <svg className={styles.statusIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const token = searchParams.get('token');

    useEffect(() => {
        if (token && !status) {
            window.location.href = `/api/auth/verify-email?token=${encodeURIComponent(token)}`;
        }
    }, [token, status]);

    if (token && !status) {
        return (
            <div className={styles.cardWrapper}>
                <div className={styles.card}>
                    <FireBorder active radius={20} />
                    <div className={styles.spinner} />
                    <div className={styles.headerGroup}>
                        <h1 className={styles.title}>
                            Verifying <em>Email…</em>
                        </h1>
                        <p className={styles.desc}>Please wait while we confirm your Hofherr Meat Co. account.</p>
                    </div>
                </div>
            </div>
        );
    }

    const state = status ? VERIFY_STATES[status] : null;

    if (!state) {
        return (
            <div className={styles.cardWrapper}>
                <div className={styles.card}>
                    <FireBorder active radius={20} />

                    <div className={styles.sealCluster}>
                        <Image
                            src="/assets/identity/hofherr-stamp-circular-crimson.svg"
                            alt="Hofherr Meat Co. Northfield Provenance Seal"
                            width={88}
                            height={88}
                            priority
                            className={styles.sealImg}
                        />
                        <div className={styles.statusBadge}>
                            <StatusIcon status={null} />
                        </div>
                    </div>

                    <div className={styles.headerGroup}>
                        <h1 className={styles.title}>
                            Check Your <em>Email</em>
                        </h1>
                        <p className={styles.desc}>
                            We sent a verification link to your email address. Click the link inside to activate your Hofherr Meat Co. account.
                        </p>
                    </div>

                    <div className={styles.dispatchTicket}>
                        <div className={styles.dispatchTicketInner}>
                            <div className={styles.dispatchTopRow}>
                                <span className={styles.dispatchBrand}>HOFHERR&apos;S MEATS · ACCOUNT DISPATCH</span>
                                <span className={styles.dispatchTag}>ACTION REQUIRED</span>
                            </div>
                            <ul className={styles.dispatchSteps}>
                                <li>
                                    <span className={styles.stepBadge}>1</span>
                                    <span>Open the email from Hofherr Meat Co. in your inbox.</span>
                                </li>
                                <li>
                                    <span className={styles.stepBadge}>2</span>
                                    <span>Click the verification button to activate online ordering.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className={styles.hintBox}>
                        <strong>Didn&apos;t get it?</strong> Check your spam or promotions folder, or try registering again.
                    </div>

                    <div className={styles.actionsRow}>
                        <Link href="/auth/signin" className={`btn btn-primary ${styles.primaryBtn}`}>
                            Back to Sign In
                        </Link>
                        <Link href="/" className={`btn btn-secondary ${styles.secondaryBtn}`}>
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.cardWrapper}>
            <div className={styles.card}>
                <FireBorder active radius={20} />

                <div className={styles.sealCluster}>
                    <Image
                        src="/assets/identity/hofherr-stamp-circular-crimson.svg"
                        alt="Hofherr Meat Co. Northfield Provenance Seal"
                        width={88}
                        height={88}
                        priority
                        className={styles.sealImg}
                    />
                    <div className={`${styles.statusBadge} ${state.isSuccess ? styles.statusBadgeSuccess : ''}`}>
                        <StatusIcon status={status} />
                    </div>
                </div>

                <div className={styles.headerGroup}>
                    <h1 className={styles.title}>
                        {state.titleFirst} <em>{state.titleAccent}</em>
                    </h1>
                    <p className={styles.desc}>{state.desc}</p>
                </div>

                <div className={styles.dispatchTicket}>
                    <div className={styles.dispatchTicketInner}>
                        <div className={styles.dispatchTopRow}>
                            <span className={styles.dispatchBrand}>HOFHERR&apos;S MEATS · MEMBER STATUS</span>
                            <span className={styles.dispatchTag}>{state.tag}</span>
                        </div>
                        <ul className={styles.dispatchSteps}>
                            <li>
                                <span className={styles.stepBadge}>✓</span>
                                <span>300 Happ Rd · Northfield &amp; 780 Elm St · Winnetka Depot</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.actionsRow}>
                    <Link href={state.cta.href} className={`btn btn-primary ${styles.primaryBtn}`}>
                        {state.cta.label}
                    </Link>
                    {state.secondaryCta && (
                        <Link href={state.secondaryCta.href} className={`btn btn-secondary ${styles.secondaryBtn}`}>
                            {state.secondaryCta.label}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <main className={styles.page}>
            <Suspense
                fallback={
                    <div className={styles.cardWrapper}>
                        <div className={styles.card}>
                            <div className={styles.spinner} />
                        </div>
                    </div>
                }
            >
                <VerifyEmailContent />
            </Suspense>
        </main>
    );
}
