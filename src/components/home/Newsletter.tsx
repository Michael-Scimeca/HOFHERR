'use client';
import { useState } from 'react';
import styles from './Newsletter.module.css';

type Tab = 'email' | 'sms';

export default function Newsletter() {
    const [tab, setTab] = useState<Tab>('sms');

    // ── Email state ──────────────────────────────────────────────
    const [emailName, setEmailName] = useState('');
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    // ── SMS state ────────────────────────────────────────────────
    const [smsName, setSmsName] = useState('');
    const [phone, setPhone] = useState('');
    const [smsStatus, setSmsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [smsError, setSmsError] = useState('');

    // ── Handlers ─────────────────────────────────────────────────
    const handleEmail = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setEmailSent(true);
    };

    const handleSms = async (e: React.FormEvent) => {
        e.preventDefault();
        setSmsStatus('loading');
        setSmsError('');

        try {
            const res = await fetch('/api/sms-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, name: smsName }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                setSmsError(data.error || 'Something went wrong.');
                setSmsStatus('error');
            } else {
                setSmsStatus('success');
            }
        } catch {
            setSmsError('Network error — please try again.');
            setSmsStatus('error');
        }
    };

    // ── Phone formatting ──────────────────────────────────────────
    const formatPhone = (val: string) => {
        const digits = val.replace(/\D/g, '').slice(0, 10);
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    };

    return (
        <section className={styles.section}>
            {/* ── Background video ── */}
            <video
                className={styles.bgVideo}
                src="/video-clips/cows.mp4"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
            />
            <div className={styles.videoOverlay} />
            <div className={styles.overlay} />
            <div className={`container ${styles.inner}`}>

                {/* ── Left copy ── */}
                <div className={styles.left}>
                    <div className="section-label">Stay in the Loop</div>
                    <h2 className={styles.title}>
                        Get Specials <em>Before</em><br />Anyone Else
                    </h2>
                    <p className={styles.sub}>
                        Weekly picks, limited-time deals, holiday pre-order alerts, and seasonal specials —
                        delivered straight to your phone or inbox. No spam. Unsubscribe anytime.
                    </p>
                    <div className={styles.perks}>
                        {[
                            '🥩 Weekly cut specials',
                            '🎉 Holiday pre-order access',
                            '⭐ Butcher\'s picks first',
                            '🎁 Member-only deals',
                        ].map(p => (
                            <div key={p} className={styles.perk}>{p}</div>
                        ))}
                    </div>
                </div>

                {/* ── Right form ── */}
                <div className={styles.right}>

                    {/* Tab switcher */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tabBtn} ${tab === 'sms' ? styles.tabActive : ''}`}
                            onClick={() => setTab('sms')}
                            type="button"
                        >
                            📱 Text Alerts
                        </button>
                        <button
                            className={`${styles.tabBtn} ${tab === 'email' ? styles.tabActive : ''}`}
                            onClick={() => setTab('email')}
                            type="button"
                        >
                            ✉️ Email List
                        </button>
                    </div>

                    {/* ── SMS form ── */}
                    {tab === 'sms' && (
                        <>
                            {smsStatus === 'success' ? (
                                <div className={styles.success}>
                                    <div className={styles.successIcon}>📱</div>
                                    <h3>You&apos;re in!</h3>
                                    <p>
                                        Check your phone — a welcome text is on its way from Sean.
                                        You&apos;ll get weekly specials & pre-order alerts first.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSms} className={styles.form}>
                                    <div className={styles.formLabel}>Join 1,200+ Northshore meat lovers</div>

                                    <input
                                        type="text"
                                        placeholder="Your first name (optional)"
                                        value={smsName}
                                        onChange={e => setSmsName(e.target.value)}
                                        className={styles.input}
                                        autoComplete="given-name"
                                    />

                                    <div className={styles.phoneRow}>
                                        <span className={styles.phoneFlag}>🇺🇸 +1</span>
                                        <input
                                            type="tel"
                                            placeholder="(847) 555-0100"
                                            value={phone}
                                            onChange={e => setPhone(formatPhone(e.target.value))}
                                            required
                                            className={`${styles.input} ${styles.phoneInput}`}
                                            autoComplete="tel"
                                            inputMode="tel"
                                        />
                                    </div>

                                    {smsStatus === 'error' && (
                                        <div className={styles.errorMsg}>⚠️ {smsError}</div>
                                    )}

                                    <button
                                        type="submit"
                                        className={`btn btn-primary ${styles.submit}`}
                                        disabled={smsStatus === 'loading'}
                                    >
                                        {smsStatus === 'loading' ? 'Sending…' : 'Text Me Weekly Specials'}
                                    </button>

                                    <p className={styles.privacy}>
                                        By signing up you agree to receive recurring marketing texts. Reply{' '}
                                        <strong>STOP</strong> to cancel, <strong>HELP</strong> for help.
                                        Msg & data rates may apply.
                                    </p>
                                </form>
                            )}
                        </>
                    )}

                    {/* ── Email form ── */}
                    {tab === 'email' && (
                        <>
                            {emailSent ? (
                                <div className={styles.success}>
                                    <div className={styles.successIcon}>✅</div>
                                    <h3>You&apos;re in!</h3>
                                    <p>Check your inbox for a welcome email from Sean. First picks go out this Friday.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleEmail} className={styles.form}>
                                    <div className={styles.formLabel}>Join 1,200+ Northshore meat lovers</div>
                                    <input
                                        type="text"
                                        placeholder="Your first name"
                                        value={emailName}
                                        onChange={e => setEmailName(e.target.value)}
                                        className={styles.input}
                                        autoComplete="given-name"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className={styles.input}
                                        autoComplete="email"
                                    />
                                    <button type="submit" className={`btn btn-primary ${styles.submit}`}>
                                        Get Weekly Specials
                                    </button>
                                    <p className={styles.privacy}>No spam. Unsubscribe anytime. Sent every Friday.</p>
                                </form>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
