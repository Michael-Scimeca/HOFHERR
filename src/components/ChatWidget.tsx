'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './ChatWidget.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const SCHEDULE: Record<number, [number, number] | null> = {
    0: [600, 960],
    1: null,
    2: [600, 1080],
    3: [600, 1080],
    4: [600, 1080],
    5: [600, 1080],
    6: [600, 1020],
};

function getResponseLabel(): { open: boolean } {
    const now = new Date();
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const h = SCHEDULE[day];
    if (h && mins >= h[0] && mins < h[1]) return { open: true };
    return { open: false };
}

function getSameDayCutoff(): string | null {
    const day = new Date().getDay();
    const h = SCHEDULE[day];
    if (!h) return null; // closed today
    const cutoffMins = h[1] - 120; // 2hrs before close
    const hour = Math.floor(cutoffMins / 60);
    const suffix = hour >= 12 ? 'pm' : 'am';
    const display = hour > 12 ? hour - 12 : hour;
    return `${display}${suffix}`;
}

const QUICK_REPLIES = [
    { emoji: '🍗', label: 'Reserve Chicken Dinner', starter: "Hi! I'd like to reserve a Rotisserie Chicken Dinner. Pickup date: ___, pickup time: ___, number of birds: ___." },
    { emoji: '🥩', label: 'Order Italian Beef', starter: "Hi! I'd like to order Italian beef by the pound. Pounds needed: ___, pickup date: ___, pickup time: ___." },
    { emoji: '🚗', label: 'Curbside Pickup', starter: "Hi! I'd like to order for curbside pickup — " },
    { emoji: '📦', label: 'Place an Order', starter: "Hi! I'd like to place an order — " },
    { emoji: '🎉', label: 'Catering Quote', starter: "Hi! I'm interested in a catering quote. We're expecting about " },
    { emoji: '📞', label: 'Call Shop', url: 'tel:8474416328' },
    { emoji: '💬', label: 'Text Shop', url: 'sms:8474416328&body=Hi%20Hofherr!%20' },
];

const CTA_PHRASES = [
    "How can I help you today?",
    "Order fresh cuts — fast!",
    "Need a custom cut? Ask me!",
    "Catering? Let's talk!",
    "Questions? I'm right here.",
];

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
    const [count, setCount] = useState(32);
    const [responseInfo] = useState(getResponseLabel);
    const [bubbleIdx, setBubbleIdx] = useState(0);
    const [bubbleDismissed, setBubbleDismissed] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const fabRef = useRef<HTMLButtonElement>(null);

    // Listen for external "open-chat" events (e.g. from Get a Quote buttons)
    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setOpen(true);
            setStatus('idle');
            if (detail?.subject === 'quote') {
                setMessage("Hi! I'm interested in a catering quote. We're expecting about ");
            }
        };
        window.addEventListener('open-chat', handler);
        return () => window.removeEventListener('open-chat', handler);
    }, []);

    // Close on outside click
    useEffect(() => {
        const onPointerDown = (e: PointerEvent) => {
            if (!open) return;
            const target = e.target as Node;
            if (panelRef.current?.contains(target)) return;
            if (fabRef.current?.contains(target)) return;
            setOpen(false);
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        if (inputRef.current) inputRef.current.focus();
        fetch('/api/chat')
            .then(r => r.json())
            .then(d => { if (d.count) setCount(d.count); })
            .catch(() => { });
    }, [open]);

    const bubbleRef = useRef<HTMLDivElement>(null);
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scrollHidden = useRef(false);
    const rotationVis = useRef(true);

    const updateOpacity = () => {
        if (!bubbleRef.current) return;
        const show = rotationVis.current && !scrollHidden.current;
        bubbleRef.current.style.animation = 'none'; // clears animation fill-mode lock
        bubbleRef.current.style.opacity = show ? '1' : '0';
        bubbleRef.current.style.pointerEvents = show ? 'auto' : 'none';
    };

    useEffect(() => {
        if (open) return;
        const interval = setInterval(() => {
            rotationVis.current = false;
            updateOpacity();
            setTimeout(() => {
                setBubbleIdx(i => (i + 1) % CTA_PHRASES.length);
                rotationVis.current = true;
                updateOpacity();
            }, 400);
        }, 14000);
        return () => clearInterval(interval);
    }, [open]);

    useEffect(() => {
        const onScroll = () => {
            scrollHidden.current = true;
            updateOpacity();
            if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
            scrollTimerRef.current = setTimeout(() => {
                scrollHidden.current = false;
                updateOpacity();
            }, 3000);
        };
        window.addEventListener('scroll', onScroll, { passive: true, capture: true });
        document.addEventListener('scroll', onScroll, { passive: true, capture: true });
        return () => {
            window.removeEventListener('scroll', onScroll, { capture: true });
            document.removeEventListener('scroll', onScroll, { capture: true });
            if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        };
    }, []);

    const send = async () => {
        if (!canSend || status === 'sending') return;
        setStatus('sending');
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, message }),
            });
            if (!res.ok) throw new Error('failed');
            const data = await res.json();
            if (data.count) setCount(data.count);
            setStatus('sent');
            setMessage('');
            setName('');
            setPhone('');
        } catch {
            setStatus('error');
        }
    };

    const canSend = name.trim() && phone.trim() && message.trim();

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    };

    return (
        <>
            {/* ── Speech bubble ── */}
            {!open && !bubbleDismissed && (
                <div
                    ref={bubbleRef}
                    className={styles.speechBubble}
                    onClick={() => { setOpen(true); setStatus('idle'); }}
                >
                    {CTA_PHRASES[bubbleIdx]}
                    <button
                        className={styles.bubbleClose}
                        onClick={(e) => { e.stopPropagation(); setBubbleDismissed(true); }}
                        aria-label="Close message"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* ── Floating button ── */}
            <button
                ref={fabRef}
                className={`${styles.fab} ${open ? styles.fabOpen : ''}`}
                onClick={() => { setOpen(o => !o); setStatus('idle'); }}
                aria-label="Chat with us"
            >
                {open ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <Image src="/assets/sean-avatar.jpg" alt="Sean" width={56} height={56} className={styles.fabAvatar} />
                )}
            </button>

            {/* ── Chat panel ── */}
            <div ref={panelRef} className={`${styles.panel} ${open ? styles.panelOpen : ''}`}>

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerInfo}>
                        <Image src="/assets/sean-avatar.jpg" alt="Shop" width={40} height={40} className={styles.avatarImg} />
                        <div>
                            <div className={styles.headerName}>Hofherr Meat Co.</div>
                            <div className={styles.headerSub}>
                                <span className={responseInfo.open ? styles.onlineBadge : styles.offlineBadge}>
                                    {responseInfo.open ? '● Online' : '● Offline'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.fontToggle}>
                        <button
                            className={`${styles.fontBtn} ${styles.fontBtnSm} ${fontSize === 'normal' ? styles.fontBtnActive : ''}`}
                            onClick={() => setFontSize('normal')}
                            aria-label="Normal text size"
                        >A</button>
                        <button
                            className={`${styles.fontBtn} ${styles.fontBtnLg} ${fontSize === 'large' ? styles.fontBtnActive : ''}`}
                            onClick={() => setFontSize('large')}
                            aria-label="Large text size"
                        >A</button>
                    </div>
                </div>

                {/* Body */}
                <div className={`${styles.body} ${fontSize === 'large' ? styles.textLarge : ''}`}>
                    {status !== 'sent' ? (
                        <>
                            {/* Social proof */}
                            <div className={styles.socialProof}>
                                🔥 <strong>{count}</strong> people messaged this week
                            </div>

                            {/* Response hours — both locations */}
                            <div className={styles.hoursBlock}>
                                <div className={styles.hoursTitle}>🕐 Hours &amp; Locations</div>
                                <div className={styles.locationLabel}>🥩 The Butcher Shop</div>
                                <div className={styles.hoursAddr}>300 Happ Rd, Northfield</div>
                                <div className={styles.hoursGrid}>
                                    <span>Tue – Fri</span><span>10am – 6pm</span>
                                    <span>Saturday</span><span>10am – 5pm</span>
                                    <span>Sunday</span><span>10am – 4pm</span>
                                    <span>Monday</span><span className={styles.closed}>Closed</span>
                                </div>
                                <div className={styles.locationLabel} style={{ marginTop: 10 }}>🏪 The Depot</div>
                                <div className={styles.hoursAddr}>780 Elm St, Winnetka</div>
                                <div className={styles.hoursGrid}>
                                    <span>Mon – Fri</span><span>10:30am – 6pm</span>
                                    <span>Sat – Sun</span><span className={styles.closed}>Closed</span>
                                </div>
                            </div>

                            <p className={styles.note}>
                                Leave a message anytime — Sean may respond outside these hours, but you&apos;re most likely to hear back during response hours.
                            </p>

                            {/* Quick-reply chips */}
                            <div className={styles.quickSection}>
                                <div className={styles.sectionLabel}>Quick questions</div>
                                <div className={styles.chips}>
                                    {QUICK_REPLIES.map(q => (
                                        q.url ? (
                                            <a
                                                key={q.label}
                                                href={q.url}
                                                className={styles.chip}
                                            >
                                                {q.emoji} {q.label}
                                            </a>
                                        ) : (
                                            <button
                                                key={q.label}
                                                className={`${styles.chip} ${message === q.starter ? styles.chipActive : ''}`}
                                                onClick={() => {
                                                    if (q.starter) {
                                                        setMessage(prev => prev === q.starter ? '' : q.starter!);
                                                    }
                                                }}
                                            >
                                                {q.emoji} {q.label}
                                            </button>
                                        )
                                    ))}
                                </div>
                            </div>

                            {/* Pickup time */}
                            {(() => {
                                const cutoff = getSameDayCutoff();
                                return cutoff ? (
                                    <div className={styles.pickupNote}>
                                        ⏱ Orders placed before {cutoff} are typically ready same day
                                    </div>
                                ) : null;
                            })()}

                            {/* Form */}
                            <div className={styles.fields}>
                                <input
                                    className={styles.input}
                                    type="text"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                                <input
                                    className={styles.input}
                                    type="tel"
                                    placeholder="Your phone number (so I can reply)"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                />
                                <textarea
                                    ref={inputRef}
                                    className={styles.textarea}
                                    placeholder="Orders, questions, anything..."
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    onKeyDown={handleKey}
                                    rows={2}
                                />
                            </div>

                            {status === 'error' && (
                                <div className={styles.errorMsg}>Something went wrong — try calling us directly.</div>
                            )}

                            <button
                                className={styles.sendBtn}
                                onClick={send}
                                disabled={!canSend || status === 'sending'}
                            >
                                {status === 'sending' ? 'Sending' : 'Send Message'}
                            </button>

                            {/* Click-to-call */}
                            <a href="tel:+18474416328" className={styles.callLink}>
                                📞 Prefer to talk? Call (847) 441-MEAT
                            </a>
                        </>
                    ) : (
                        <div className={styles.success}>
                            <div className={styles.successIcon}>✓</div>
                            <div className={styles.successTitle}>Message sent!</div>
                            <div className={styles.successSub}>Sean will get back to you during response hours.</div>
                            <a href="tel:+18474416328" className={styles.callLinkSuccess}>
                                📞 Need it faster? Call (847) 441-MEAT
                            </a>
                            <button className={styles.resetBtn} onClick={() => setStatus('idle')}>Send another</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
