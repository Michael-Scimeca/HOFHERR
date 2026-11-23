'use client';

import { useState } from 'react';
import styles from './preview.module.css';

interface SendTestBarProps {
    activeTemplate: string;
}

export default function SendTestBar({ activeTemplate }: SendTestBarProps) {
    const [to, setTo] = useState('mikeyscimeca.dev@gmail.com');
    const [sending, setSending] = useState<'all' | 'one' | null>(null);
    const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

    const triggerSend = async (target: 'all' | 'one') => {
        if (!to.trim()) return;
        setSending(target);
        setStatus(null);
        try {
            const templateKey = target === 'all' ? 'all' : activeTemplate === 'all' ? 'all' : activeTemplate;
            const res = await fetch('/api/debug-email/send-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: to.trim(), template: templateKey }),
            });
            const data = (await res.json()) as {
                ok?: boolean;
                sentCount?: number;
                total?: number;
                error?: string;
            };
            if (!res.ok) {
                setStatus({ ok: false, text: data.error || 'Failed to send test email.' });
                return;
            }
            setStatus({
                ok: Boolean(data.ok),
                text: data.ok
                    ? `Sent ${data.sentCount}/${data.total} real Resend test email${data.total === 1 ? '' : 's'} to ${to.trim()}.`
                    : `Sent ${data.sentCount}/${data.total} — some failed (check Resend key / domain).`,
            });
        } catch {
            setStatus({ ok: false, text: 'Network error while sending Resend test.' });
        } finally {
            setSending(null);
        }
    };

    return (
        <div className={styles.sendBar}>
            <div className={styles.sendRow}>
                <input
                    type="email"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    placeholder="Recipient email for Resend test…"
                    aria-label="Recipient email for Resend test"
                    className={styles.sendInput}
                />
                {activeTemplate !== 'all' && (
                    <button
                        type="button"
                        disabled={sending !== null || !to.trim()}
                        onClick={() => void triggerSend('one')}
                        className={styles.sendBtnSecondary}
                    >
                        {sending === 'one' ? 'Sending…' : '✉️ Send This Template'}
                    </button>
                )}
                <button
                    type="button"
                    disabled={sending !== null || !to.trim()}
                    onClick={() => void triggerSend('all')}
                    className={styles.sendBtnPrimary}
                >
                    {sending === 'all' ? 'Sending All 6…' : '🚀 Send All 6 via Resend'}
                </button>
            </div>
            {status && (
                <div className={status.ok ? styles.sendOk : styles.sendErr} role="status">
                    {status.text}
                </div>
            )}
        </div>
    );
}
