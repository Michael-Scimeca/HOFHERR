'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Toggle } from '@/components/Toggle';
import TransactionalEmailsSection from './TransactionalEmailsSection';
import styles from './SubscribersPanel.module.css';

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function formatJoinedDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return `${SHORT_MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

const SocialAdminInline = dynamic(() => import('@/components/admin/social/SocialStudio'), {
    ssr: false,
    loading: () => <div className={styles.embeddedLoading}>Loading Social Studio (IG · FB · X)…</div>,
});

const SocialKitInline = dynamic(() => import('@/components/admin/social-kit/SocialKit'), {
    ssr: false,
    loading: () => <div className={styles.embeddedLoading}>Loading Social Profiles &amp; Brand Kit (IG · FB · X)…</div>,
});

export interface AdminSubscriber {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    favoriteCut?: string;
    createdAt?: string;
    orderCount: number;
}

interface SubscribersPanelProps {
    subscribers: AdminSubscriber[];
    totalCustomers: number;
}

type EmailTheme = 'butcher' | 'depot' | 'gold';

interface EmailHighlight {
    id?: string;
    tag: string;
    title: string;
    note: string;
}

interface EmailTemplate {
    id: string;
    label: string;
    theme: EmailTheme;
    subject: string;
    previewText: string;
    headline: string;
    body: string;
    ctaLabel: string;
    ctaUrl: string;
    psNote: string;
    quickItems: string;
    highlights: EmailHighlight[];
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
    {
        id: 'tuesday-drop',
        label: 'Tue · Butcher Block Drop',
        theme: 'butcher',
        subject: 'Fresh on the Block: Dry-Aged Prime Cuts & House Sausages',
        previewText: 'Hand-trimmed to your thickness in Northfield — reserve before Friday rush clears the case.',
        headline: 'On the Block This Week',
        body: `Hi neighbor,\n\nTuesday morning means fresh primals hitting the block at 300 Happ Rd — and the best thick-cut steaks and house sausages always go first before Friday's rush.\n\nEvery animal is traceable to a named Midwest family farm and hand-trimmed to your exact thickness at no extra charge.`,
        ctaLabel: 'Reserve My Cuts for Pickup →',
        ctaUrl: '/online-orders?store=butcher',
        psNote: 'Tight on time? Pick Curbside Trunk Drop-Off at checkout and call (847) 441-MEAT when you pull up — we’ll bring your order straight to your car.',
        quickItems: 'Bone-In Ribeye, Filet Mignon, Andouille Sausage',
        highlights: [
            { tag: '★ Butcher’s Reserve', title: 'Dry-Aged USDA Prime Ribeye & Porterhouse', note: 'Cut to your exact inch thickness at the block, zero upcharge.' },
            { tag: '🔥 Most Popular', title: 'USDA Prime Filet Mignon & NY Strip', note: 'Hand-trimmed center-cut steaks ready for a hot cast iron or grill.' },
            { tag: '⚡ Easy Add-On', title: 'BaconFest-Winning House Sausages', note: 'Small-batch links made in-house — easy weeknight dinner in 15 minutes.' },
        ],
    },
    {
        id: 'depot-lunch',
        label: 'Wed · Winnetka Depot Lunch',
        theme: 'depot',
        subject: 'Hot at The Depot at 10:30 AM: ATK-Featured Italian Beef',
        previewText: 'Shaved thin to order inside the Winnetka Elm St. Metra Station — served until sold out.',
        headline: 'Hot at The Depot at 10:30 AM',
        body: `Hi neighbor,\n\nAt 10:30 AM sharp, we start shaving our America’s Test Kitchen–featured Italian Beef inside the Winnetka Elm St. Metra Station (754 Elm St) — slow-roasted chuck eye sliced shabu-shabu style to order, piled on Turano bread with sweet peppers, rich jus, and our 3-year-aged house giardiniera.`,
        ctaLabel: 'Reserve My Depot Lunch →',
        ctaUrl: '/online-orders?store=depot',
        psNote: 'Italian Beef and Rotisserie Chickens sell out daily by mid-afternoon — order ahead or scan the code above to skip the lunch line.',
        quickItems: 'Pulled Pork, Chicken Tortilla Soup, Sparrow Coffee 16oz',
        highlights: [
            { tag: '★ Depot Signature', title: 'ATK-Featured Shaved Italian Beef', note: 'Sliced shabu-shabu thin to order on Turano bread with house giardiniera.' },
            { tag: '🔥 Daily Sell-Out', title: 'Herb-Roasted Rotisserie Chicken', note: 'Pull-apart juicy, ready for lunch or an effortless family dinner.' },
            { tag: '⚡ Morning & Grab-and-Go', title: 'Sparrow Coffee, Kettle Soups & Dinner Cuts', note: 'Quick stop right at the Winnetka Metra platform.' },
        ],
    },
    {
        id: 'weekend-grill',
        label: 'Thu · Weekend Grill Push',
        theme: 'butcher',
        subject: 'Weekend Grill Forecast: Lock In Your Cuts Before Saturday Rush',
        previewText: 'Guarantee your 15-minute pickup slot in Northfield + grab our free sear & temp guides.',
        headline: 'Lock In Your Weekend Cuts',
        body: `Hi neighbor,\n\nSaturday morning is our busiest rush at 300 Happ Rd — and the best dry-aged steaks and BaconFest-winning sausages go fast.\n\nOrder online today to lock in a guaranteed 15-minute pickup slot, and pair your cuts with our free printable 12×16" Parcel Sheet cooking guides.`,
        ctaLabel: 'Lock In My Weekend Cuts →',
        ctaUrl: '/online-orders?store=butcher',
        psNote: 'Skip the Saturday parking lot completely — select Curbside Trunk Drop-Off at checkout and call (847) 441-MEAT when you pull up.',
        quickItems: 'Boneless Ribeye, Bone-In Ribeye, Blue Cheese Steakhouse Sausage',
        highlights: [
            { tag: '★ Showstopper', title: 'Thick-Cut Prime Ribeye & Tomahawk Cuts', note: 'Tell us your exact thickness in the order notes — we cut it fresh.' },
            { tag: '🔥 Crowd Favorite', title: 'House-Made Brats & Specialty Sausages', note: 'Throw them on first while the coals get ripping hot for steaks.' },
            { tag: '⚡ Free With Your Order', title: '12×16" Butcher Parcel Cooking Guides', note: 'Exact internal temps, rest times, and sear tricks from Sean.' },
        ],
    },
    {
        id: 'vip-note',
        label: 'VIP · Personal Note from Sean',
        theme: 'gold',
        subject: 'Quick note from Sean at Hofherr Meat Co.',
        previewText: 'A faster way to order ahead in Northfield & Winnetka — plus Curbside Trunk Drop-Off.',
        headline: 'A Quick Note From the Counter',
        body: `Hi neighbor,\n\nSean here from Hofherr Meat Co. — just wanted to share that we upgraded our online ordering so you can add cuts in one tap, pick an exact 15-minute pickup window, and choose Curbside Trunk Drop-Off at 300 Happ Rd if the lot is busy.\n\nPlanning a dinner, weekend grill-out, or holiday roast? Reply directly to this email or call (847) 441-MEAT anytime.\n\nHope to see you soon,\nSean Hofherr`,
        ctaLabel: 'Reserve My Next Pickup →',
        ctaUrl: '/online-orders',
        psNote: 'Have a custom cut request or feeding a big group? Just hit reply — it comes straight to our counter.',
        quickItems: 'Boneless Ribeye, Filet Mignon',
        highlights: [],
    },
];

export default function SubscribersPanel({ subscribers, totalCustomers }: SubscribersPanelProps) {
    const [testSubscribers, setTestSubscribers] = useState<AdminSubscriber[]>(() => {
        const alreadyInSanity = subscribers.some(
            s => s.email.toLowerCase() === 'mikeyscimeca.dev@gmail.com'
        );
        if (alreadyInSanity) return [];
        return [
            {
                _id: 'test-sub-mikey',
                name: 'Michael Scimeca (Test)',
                email: 'mikeyscimeca.dev@gmail.com',
                phone: '(847) 441-6328',
                favoriteCut: '45-Day Dry-Aged Prime Ribeye',
                createdAt: new Date().toISOString(),
                orderCount: 3,
            },
        ];
    });
    const [customTestEmail, setCustomTestEmail] = useState('');
    const [search, setSearch] = useState('');
    const [segment, setSegment] = useState<'all' | 'repeat' | 'withCut'>('all');

    const allSubscribers = useMemo(
        () => [...testSubscribers, ...subscribers],
        [testSubscribers, subscribers]
    );

    const handleAddTestSubscriber = () => {
        const typedEmail = customTestEmail.trim();
        if (typedEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(typedEmail)) {
            setTestSubscribers(prev => [
                {
                    _id: `test-sub-${Date.now()}`,
                    name: `${typedEmail.split('@')[0]} (Test)`,
                    email: typedEmail,
                    phone: '(847) 441-6328',
                    favoriteCut: '45-Day Dry-Aged Prime Ribeye',
                    createdAt: new Date().toISOString(),
                    orderCount: 2,
                },
                ...prev.filter(p => p.email.toLowerCase() !== typedEmail.toLowerCase()),
            ]);
            setCustomTestEmail('');
            return;
        }
        const samples: AdminSubscriber[] = [
            {
                _id: 'test-sub-1',
                name: 'Marcus Vance (Test)',
                email: 'marcus.test@northshore.example',
                phone: '(847) 555-0142',
                favoriteCut: '45-Day Dry-Aged Prime Ribeye',
                createdAt: new Date().toISOString(),
                orderCount: 6,
            },
            {
                _id: 'test-sub-2',
                name: 'Claire Bennett (Test)',
                email: 'claire.test@winnetka.example',
                phone: '(847) 555-0198',
                favoriteCut: 'Italian Beef (Winnetka Depot)',
                createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
                orderCount: 3,
            },
            {
                _id: 'test-sub-3',
                name: 'David Kowalski (Test)',
                email: 'david.test@northfield.example',
                phone: '(847) 555-0164',
                favoriteCut: undefined,
                createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
                orderCount: 1,
            },
        ];
        setTestSubscribers(prev => {
            const existingIds = new Set(prev.map(p => p._id));
            const nextSample = samples.find(s => !existingIds.has(s._id));
            if (nextSample) return [nextSample, ...prev];
            const n = prev.length + 1;
            return [
                {
                    _id: `test-sub-${Date.now()}`,
                    name: `Test Subscriber #${n}`,
                    email: `test${n}@hofherrmeatco.example`,
                    phone: `(847) 555-01${String(10 + (n % 89)).padStart(2, '0')}`,
                    favoriteCut: 'Prime Filet Mignon',
                    createdAt: new Date().toISOString(),
                    orderCount: 2,
                },
                ...prev,
            ];
        });
    };

    const handleRemoveTestSubscriber = (id: string) => {
        setTestSubscribers(prev => prev.filter(s => s._id !== id));
    };

    // Toggle Email Builder visibility (Social Studio renders directly below this section)
    const [showEmailBuilder, setShowEmailBuilder] = useState(true);
    const [theme, setTheme] = useState<EmailTheme>(EMAIL_TEMPLATES[0].theme);
    const [subject, setSubject] = useState(EMAIL_TEMPLATES[0].subject);
    const [previewText, setPreviewText] = useState(EMAIL_TEMPLATES[0].previewText);
    const [headline, setHeadline] = useState(EMAIL_TEMPLATES[0].headline);
    const [body, setBody] = useState(EMAIL_TEMPLATES[0].body);
    const [ctaLabel, setCtaLabel] = useState(EMAIL_TEMPLATES[0].ctaLabel);
    const [ctaUrl, setCtaUrl] = useState(EMAIL_TEMPLATES[0].ctaUrl);
    const [psNote, setPsNote] = useState(EMAIL_TEMPLATES[0].psNote);
    const [quickItems, setQuickItems] = useState(EMAIL_TEMPLATES[0].quickItems);
    const [highlights, setHighlights] = useState<EmailHighlight[]>(() =>
        EMAIL_TEMPLATES[0].highlights.map((h, i) => ({ ...h, id: `hl-init-${i}` }))
    );

    const handleUpdateHighlight = (id: string, field: 'tag' | 'title' | 'note', value: string) => {
        setHighlights(prev => prev.map(h => (h.id === id ? { ...h, [field]: value } : h)));
    };

    const handleAddHighlight = () => {
        const nextNum = highlights.length + 1;
        setShowHighlights(true);
        setHighlights(prev => [
            ...prev,
            {
                id: `hl-${Date.now()}-${nextNum}`,
                tag: nextNum === 1 ? '★ Butcher’s Reserve' : nextNum === 2 ? '🔥 Most Popular' : '⚡ Easy Add-On',
                title: '',
                note: '',
            },
        ]);
    };

    const handleRemoveHighlight = (id: string) => {
        setHighlights(prev => prev.filter(h => h.id !== id));
    };
    const [showHighlights, setShowHighlights] = useState(true);
    const [showQr, setShowQr] = useState(true);
    const [autoSchedule, setAutoSchedule] = useState(true);
    const [testEmail, setTestEmail] = useState('mikeyscimeca.dev@gmail.com');
    const [sending, setSending] = useState<'test' | 'broadcast' | null>(null);
    const [confirmBroadcast, setConfirmBroadcast] = useState(false);
    const [sendFeedback, setSendFeedback] = useState<{ ok: boolean; text: string } | null>(null);

    const filteredSubscribers = useMemo(() => {
        const q = search.trim().toLowerCase();
        return allSubscribers.filter(sub => {
            if (segment === 'repeat' && sub.orderCount < 2) return false;
            if (segment === 'withCut' && !sub.favoriteCut) return false;
            if (!q) return true;
            return (
                sub.name.toLowerCase().includes(q) ||
                sub.email.toLowerCase().includes(q) ||
                (sub.favoriteCut?.toLowerCase().includes(q) ?? false) ||
                (sub.phone?.toLowerCase().includes(q) ?? false)
            );
        });
    }, [allSubscribers, search, segment]);

    const applyTemplate = (tpl: EmailTemplate) => {
        setTheme(tpl.theme);
        setSubject(tpl.subject);
        setPreviewText(tpl.previewText);
        setHeadline(tpl.headline);
        setBody(tpl.body);
        setCtaLabel(tpl.ctaLabel);
        setCtaUrl(tpl.ctaUrl);
        setPsNote(tpl.psNote);
        setQuickItems(tpl.quickItems);
        setHighlights(tpl.highlights.map((h, i) => ({ ...h, id: `hl-${tpl.id}-${i}` })));
        setShowHighlights(tpl.highlights.length > 0);
        setSendFeedback(null);
        setConfirmBroadcast(false);
    };

    const handleThemeChange = (nextTheme: EmailTheme) => {
        setTheme(nextTheme);
        if (nextTheme === 'depot') {
            setCtaUrl(prev =>
                prev.includes('store=butcher')
                    ? prev.replace('store=butcher', 'store=depot')
                    : prev.includes('/online-orders') && !prev.includes('store=')
                      ? `${prev}${prev.includes('?') ? '&' : '?'}store=depot`
                      : prev
            );
        } else if (nextTheme === 'butcher') {
            setCtaUrl(prev =>
                prev.includes('store=depot')
                    ? prev.replace('store=depot', 'store=butcher')
                    : prev
            );
        }
    };

    const quickItemsList = quickItems
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    const quickItemsLabel =
        quickItemsList.length === 0
            ? ''
            : quickItemsList.length === 1
              ? quickItemsList[0]
              : quickItemsList.length === 2
                ? `${quickItemsList[0]} & ${quickItemsList[1]}`
                : `${quickItemsList.slice(0, -1).join(', ')} & ${quickItemsList[quickItemsList.length - 1]}`;
    const rawBaseCtaUrl = /^https?:\/\//i.test(ctaUrl.trim())
        ? ctaUrl.trim()
        : `https://hofherrmeatco.com${ctaUrl.trim().startsWith('/') ? ctaUrl.trim() : `/${ctaUrl.trim() || 'online-orders'}`}`;
    const baseCtaUrl =
        theme === 'depot' && rawBaseCtaUrl.includes('/online-orders')
            ? rawBaseCtaUrl.includes('store=butcher')
                ? rawBaseCtaUrl.replace('store=butcher', 'store=depot')
                : rawBaseCtaUrl.includes('store=')
                  ? rawBaseCtaUrl
                  : `${rawBaseCtaUrl}${rawBaseCtaUrl.includes('?') ? '&' : '?'}store=depot`
            : rawBaseCtaUrl;
    const resolvedCtaUrl =
        quickItemsList.length > 0 && !baseCtaUrl.includes('quickOrder=')
            ? `${baseCtaUrl}${baseCtaUrl.includes('?') ? '&' : '?'}quickOrder=${encodeURIComponent(quickItemsList.join(','))}`
            : baseCtaUrl;
    const previewQrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&bgcolor=ffffff&color=111111&data=${encodeURIComponent(resolvedCtaUrl)}`;

    const handleSend = async (mode: 'test' | 'broadcast') => {
        setSendFeedback(null);
        setSending(mode);
        try {
            const res = await fetch('/api/admin/newsletter/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode,
                    testEmail: mode === 'test' ? testEmail.trim() : undefined,
                    recipients: mode === 'broadcast' ? filteredSubscribers.map(s => s.email) : undefined,
                    subject,
                    previewText,
                    headline,
                    body,
                    ctaLabel,
                    ctaUrl,
                    theme,
                    psNote,
                    showQr,
                    quickItems,
                    autoSchedule,
                    highlights: showHighlights ? highlights : [],
                }),
            });
            const data = (await res.json()) as {
                ok?: boolean;
                sentCount?: number;
                provider?: string;
                scheduledFor?: string | null;
                error?: string;
            };
            if (!res.ok || !data.ok) {
                setSendFeedback({ ok: false, text: data.error || 'Could not send email.' });
            } else {
                setSendFeedback({
                    ok: true,
                    text:
                        mode === 'test'
                            ? `✓ Real test email sent to ${testEmail.trim()} via ${data.provider || 'email'}.`
                            : data.scheduledFor
                              ? `✓ Scheduled for ${data.scheduledFor} (peak open window) to ${data.sentCount} subscriber${data.sentCount === 1 ? '' : 's'} via ${data.provider || 'email'}.`
                              : `✓ Sent to ${data.sentCount} subscriber${data.sentCount === 1 ? '' : 's'} via ${data.provider || 'email'}.`,
                });
                setConfirmBroadcast(false);
            }
        } catch {
            setSendFeedback({ ok: false, text: 'Network error while sending email.' });
        } finally {
            setSending(null);
        }
    };

    const effectiveTotal = totalCustomers + testSubscribers.length;
    const optInRate =
        effectiveTotal > 0 ? Math.round((allSubscribers.length / effectiveTotal) * 100) : 0;

    return (
        <div className={styles.wrap}>
            {/* ── Header ── */}
            <div className={styles.headerRow}>
                <div>
                    <h2 className={styles.title}>Who&apos;s Subscribed ({allSubscribers.length})</h2>
                    <p className={styles.sub}>
                        Live newsletter opt-ins synced from Sanity customer profiles (<strong>{optInRate}%</strong> of{' '}
                        {effectiveTotal} registered customer{effectiveTotal === 1 ? '' : 's'}).
                    </p>
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={handleAddTestSubscriber}
                    >
                        + Add Test Subscriber
                    </button>
                    <button
                        type="button"
                        className={showEmailBuilder ? styles.copyBtn : styles.secondaryBtn}
                        onClick={() => setShowEmailBuilder(v => !v)}
                    >
                        {showEmailBuilder ? '✉️ Email Builder ✓' : '✉️ Email Builder'}
                    </button>
                    <a
                        href="#automated-emails-section"
                        className={styles.secondaryBtn}
                    >
                        📧 Automated Emails ↓
                    </a>
                    <a
                        href="#social-studio-section"
                        className={styles.secondaryBtn}
                    >
                        📣 Post to IG · FB · X ↓
                    </a>
                </div>
            </div>

            {/* ── Email Builder & Real Test Sender ── */}
            {showEmailBuilder && (
                <div className={styles.builderCard}>
                    <div className={styles.builderTop}>
                        <div>
                            <h3 className={styles.builderTitle}>Email Builder &amp; Real Test Sender</h3>
                            <p className={styles.builderSub}>
                                Pick a weekly template or write from scratch, preview it live, and send a real test straight to your inbox.
                            </p>
                        </div>
                        <div className={styles.themePills} role="group" aria-label="Email color theme">
                            <button
                                type="button"
                                className={`${styles.segBtn} ${theme === 'butcher' ? styles.segBtnActive : ''}`}
                                onClick={() => handleThemeChange('butcher')}
                            >
                                🥩 Butcher Red
                            </button>
                            <button
                                type="button"
                                className={`${styles.segBtn} ${theme === 'depot' ? styles.segBtnDepot : ''}`}
                                onClick={() => handleThemeChange('depot')}
                            >
                                🚂 Depot Blue
                            </button>
                            <button
                                type="button"
                                className={`${styles.segBtn} ${theme === 'gold' ? styles.segBtnGold : ''}`}
                                onClick={() => handleThemeChange('gold')}
                            >
                                🏛️ Heritage Gold
                            </button>
                        </div>
                    </div>

                    {/* Starter Templates */}
                    <div className={styles.templateRow}>
                        <span className={styles.templateLabel}>Quick Templates:</span>
                        {EMAIL_TEMPLATES.map(tpl => (
                            <button
                                key={tpl.id}
                                type="button"
                                className={styles.templateBtn}
                                onClick={() => applyTemplate(tpl)}
                            >
                                {tpl.label}
                            </button>
                        ))}
                    </div>

                    {/* Split: Editor Left | Live Branded Preview Right */}
                    <div className={styles.builderGrid}>
                        <div className={styles.editorCol}>
                            <label className={styles.fieldLabel}>
                                Subject Line
                                <input
                                    type="text"
                                    className={styles.fieldInput}
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="Subject line…"
                                />
                            </label>
                            <label className={styles.fieldLabel}>
                                Inbox Preview Text
                                <input
                                    type="text"
                                    className={styles.fieldInput}
                                    value={previewText}
                                    onChange={e => setPreviewText(e.target.value)}
                                    placeholder="Short teaser shown next to subject in Gmail…"
                                />
                            </label>
                            <label className={styles.fieldLabel}>
                                Email Header Headline
                                <input
                                    type="text"
                                    className={styles.fieldInput}
                                    value={headline}
                                    onChange={e => setHeadline(e.target.value)}
                                    placeholder="Big bold header inside the email…"
                                />
                            </label>
                            <label className={styles.fieldLabel}>
                                Message Body
                                <textarea
                                    className={styles.fieldTextarea}
                                    rows={7}
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                    placeholder="Write your newsletter message…"
                                />
                            </label>
                            <div className={styles.ctaRow}>
                                <label className={styles.fieldLabel}>
                                    Button Text
                                    <input
                                        type="text"
                                        className={styles.fieldInput}
                                        value={ctaLabel}
                                        onChange={e => setCtaLabel(e.target.value)}
                                        placeholder="Shop This Week's Cuts →"
                                    />
                                </label>
                                <label className={styles.fieldLabel}>
                                    Button Link
                                    <input
                                        type="text"
                                        className={styles.fieldInput}
                                        value={ctaUrl}
                                        onChange={e => setCtaUrl(e.target.value)}
                                        placeholder="/online-orders?store=butcher"
                                    />
                                </label>
                            </div>
                            <label className={styles.fieldLabel}>
                                QR Quick-Order Items (pre-loaded when scanned)
                                <input
                                    type="text"
                                    className={styles.fieldInput}
                                    value={quickItems}
                                    onChange={e => setQuickItems(e.target.value)}
                                    placeholder="Bone-In Ribeye, Filet Mignon, Andouille Sausage"
                                />
                            </label>
                            <label className={styles.fieldLabel}>
                                P.S. Line (Skimmer Hook)
                                <input
                                    type="text"
                                    className={styles.fieldInput}
                                    value={psNote}
                                    onChange={e => setPsNote(e.target.value)}
                                    placeholder="Curbside Trunk Drop-Off tip or urgency reminder…"
                                />
                            </label>
                            <div className={styles.toggleRow}>
                                <Toggle
                                    size="sm"
                                    checked={showQr}
                                    onChange={setShowQr}
                                    label="Scan-to-Order QR Code"
                                />
                                <Toggle
                                    size="sm"
                                    checked={showHighlights}
                                    onChange={checked => {
                                        setShowHighlights(checked);
                                        if (checked && highlights.length === 0) {
                                            handleAddHighlight();
                                        }
                                    }}
                                    label="3-Cut Spotlight Strip"
                                />
                                <Toggle
                                    size="sm"
                                    variant="gold"
                                    checked={autoSchedule}
                                    onChange={setAutoSchedule}
                                    label="Auto-Optimal Send Time (Tue–Thu 10 AM CT)"
                                />
                            </div>

                            {showHighlights && (
                                <div className={styles.highlightEditor}>
                                    <div className={styles.highlightEditorHead}>
                                        <span className={styles.highlightEditorTitle}>
                                            Spotlight Cuts ({highlights.length})
                                        </span>
                                        <button
                                            type="button"
                                            className={styles.highlightAddBtn}
                                            onClick={handleAddHighlight}
                                        >
                                            + Add Cut
                                        </button>
                                    </div>
                                    {highlights.map(item => (
                                        <div key={item.id ?? item.title} className={styles.highlightEditorRow}>
                                            <div className={styles.highlightEditorTop}>
                                                <input
                                                    type="text"
                                                    className={styles.highlightTagInput}
                                                    value={item.tag}
                                                    onChange={e =>
                                                        handleUpdateHighlight(item.id ?? '', 'tag', e.target.value)
                                                    }
                                                    placeholder="★ Butcher's Reserve"
                                                    aria-label="Spotlight badge tag"
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.highlightRemoveBtn}
                                                    onClick={() => handleRemoveHighlight(item.id ?? '')}
                                                    aria-label="Remove spotlight cut"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                className={styles.fieldInput}
                                                value={item.title}
                                                onChange={e =>
                                                    handleUpdateHighlight(item.id ?? '', 'title', e.target.value)
                                                }
                                                placeholder="Cut or item title (e.g. Dry-Aged Prime Ribeye)…"
                                                aria-label="Spotlight cut title"
                                            />
                                            <input
                                                type="text"
                                                className={styles.fieldInput}
                                                value={item.note}
                                                onChange={e =>
                                                    handleUpdateHighlight(item.id ?? '', 'note', e.target.value)
                                                }
                                                placeholder="Short description line…"
                                                aria-label="Spotlight cut description"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Live Branded Email Preview */}
                        <div className={styles.previewCol}>
                            <div className={styles.previewShell}>
                                <div
                                    className={`${styles.previewHead} ${
                                        theme === 'depot'
                                            ? styles.previewHeadDepot
                                            : theme === 'gold'
                                              ? styles.previewHeadGold
                                              : styles.previewHeadButcher
                                    }`}
                                >
                                    <span className={styles.previewBadge}>
                                        {theme === 'depot'
                                            ? 'THE DEPOT · WINNETKA METRA STATION'
                                            : theme === 'gold'
                                              ? 'HOFHERR MEAT CO. · EST. 1903'
                                              : 'HOFHERR MEAT CO. · NORTHFIELD, IL'}
                                    </span>
                                    <h4 className={styles.previewHeadline}>{headline || 'Your Headline'}</h4>
                                </div>
                                <div className={styles.previewBody}>
                                    {body
                                        .split(/\n{2,}/)
                                        .filter(Boolean)
                                        .map(para => (
                                            <p key={para} className={styles.previewPara}>
                                                {para}
                                            </p>
                                        ))}
                                    {showHighlights && highlights.some(h => h.title.trim()) && (
                                        <div className={styles.previewHighlights}>
                                            {highlights
                                                .filter(h => h.title.trim())
                                                .map(item => (
                                                    <div key={item.id ?? item.title} className={styles.previewHighlightRow}>
                                                        <span className={styles.previewHighlightTag}>{item.tag}</span>
                                                        <strong className={styles.previewHighlightTitle}>{item.title}</strong>
                                                        <span className={styles.previewHighlightNote}>{item.note}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                    {ctaLabel && (
                                        <>
                                            <span
                                                className={`${styles.previewCta} ${
                                                    theme === 'depot'
                                                        ? styles.previewCtaDepot
                                                        : theme === 'gold'
                                                          ? styles.previewCtaGold
                                                          : styles.previewCtaButcher
                                                }`}
                                            >
                                                {ctaLabel}
                                            </span>
                                            <p className={styles.previewTrustLine}>
                                                Custom hand-trimming free · Exact 15-min pickup windows · Curbside trunk drop-off
                                            </p>
                                        </>
                                    )}
                                    {showQr && (
                                        <div className={styles.previewQrCard}>
                                            <div className={styles.previewQrFrame}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={previewQrSrc}
                                                    alt="Scan to order from Hofherr Meat Co."
                                                    width={84}
                                                    height={84}
                                                    className={styles.previewQrImg}
                                                />
                                            </div>
                                            <div className={styles.previewQrCopy}>
                                                <span className={styles.previewQrKicker}>
                                                    {quickItemsLabel ? 'SCAN TO QUICK-ORDER THIS EMAIL’S CUTS' : 'QUICK PHONE ORDER'}
                                                </span>
                                                <strong className={styles.previewQrTitle}>
                                                    {quickItemsLabel || 'Scan to Order in Seconds'}
                                                </strong>
                                                <span className={styles.previewQrDesc}>
                                                    {quickItemsLabel
                                                        ? 'Point your phone camera at this code to pull up these exact cuts pre-loaded for 1-tap pickup ordering.'
                                                        : 'Reading on desktop? Point your phone camera at the code to jump straight to pickup ordering.'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {psNote.trim() && (
                                        <div
                                            className={`${styles.previewPs} ${
                                                theme === 'depot'
                                                    ? styles.previewPsDepot
                                                    : theme === 'gold'
                                                      ? styles.previewPsGold
                                                      : ''
                                            }`}
                                        >
                                            <strong>P.S.</strong> {psNote}
                                        </div>
                                    )}
                                </div>
                                <div className={styles.previewFoot}>
                                    <strong>Hofherr Meat Co.</strong> · 300 Happ Rd, Northfield · 754 Elm St, Winnetka · (847) 441-MEAT
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Real Test Send + Broadcast Bar */}
                    <div className={styles.sendBar}>
                        <div className={styles.testGroup}>
                            <input
                                type="email"
                                className={styles.testInput}
                                placeholder="Enter your email to send a real test (e.g. sean@hofherrmeatco.com)…"
                                value={testEmail}
                                onChange={e => setTestEmail(e.target.value)}
                                aria-label="Test recipient email address"
                            />
                            <button
                                type="button"
                                className={styles.copyBtn}
                                disabled={sending !== null || !testEmail.trim() || !subject.trim() || !body.trim()}
                                onClick={() => void handleSend('test')}
                            >
                                {sending === 'test' ? 'Sending Test…' : '✉️ Send Real Test Email'}
                            </button>
                        </div>

                        <div className={styles.broadcastGroup}>
                            {!confirmBroadcast ? (
                                <button
                                    type="button"
                                    className={styles.secondaryBtn}
                                    disabled={sending !== null || filteredSubscribers.length === 0 || !subject.trim() || !body.trim()}
                                    onClick={() => setConfirmBroadcast(true)}
                                >
                                    📣 Send to {filteredSubscribers.length} Subscriber{filteredSubscribers.length === 1 ? '' : 's'}
                                </button>
                            ) : (
                                <div className={styles.confirmRow}>
                                    <span className={styles.confirmText}>
                                        Send live to {filteredSubscribers.length} subscriber{filteredSubscribers.length === 1 ? '' : 's'}?
                                    </span>
                                    <button
                                        type="button"
                                        className={styles.copyBtn}
                                        disabled={sending !== null}
                                        onClick={() => void handleSend('broadcast')}
                                    >
                                        {sending === 'broadcast' ? 'Sending…' : 'Confirm Send'}
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.secondaryBtn}
                                        onClick={() => setConfirmBroadcast(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {sendFeedback && (
                        <div
                            className={sendFeedback.ok ? styles.feedbackOk : styles.feedbackErr}
                            role="status"
                        >
                            {sendFeedback.text}
                        </div>
                    )}
                </div>
            )}

            {/* ── Subscriber Search & Filters ── */}
            <div className={styles.controls}>
                <input
                    type="search"
                    className={styles.searchInput}
                    placeholder="Search subscribers by name, email, phone, or favorite cut…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    aria-label="Search newsletter subscribers"
                />
                <div className={styles.segPills} role="group" aria-label="Filter subscribers">
                    <button
                        type="button"
                        className={`${styles.segBtn} ${segment === 'all' ? styles.segBtnActive : ''}`}
                        onClick={() => setSegment('all')}
                    >
                        All ({allSubscribers.length})
                    </button>
                    <button
                        type="button"
                        className={`${styles.segBtn} ${segment === 'repeat' ? styles.segBtnActive : ''}`}
                        onClick={() => setSegment('repeat')}
                    >
                        Repeat Buyers ({allSubscribers.filter(s => s.orderCount >= 2).length})
                    </button>
                    <button
                        type="button"
                        className={`${styles.segBtn} ${segment === 'withCut' ? styles.segBtnActive : ''}`}
                        onClick={() => setSegment('withCut')}
                    >
                        Has Favorite Cut ({allSubscribers.filter(s => Boolean(s.favoriteCut)).length})
                    </button>
                </div>
            </div>

            {filteredSubscribers.length === 0 ? (
                <div className={styles.emptyBox}>
                    <p className={styles.emptyTitle}>No matching newsletter subscribers found.</p>
                    <p className={styles.emptySub}>
                        Customers who toggle &ldquo;Weekly Specials&rdquo; in their profile or sign up on{' '}
                        <Link href="/newsletter">/newsletter</Link> appear here automatically and sync to Mailchimp.
                    </p>
                    <div className={styles.emptyTestRow}>
                        <input
                            type="email"
                            className={styles.testInput}
                            placeholder="Type a test email (or leave blank for sample)…"
                            value={customTestEmail}
                            onChange={e => setCustomTestEmail(e.target.value)}
                            aria-label="Test subscriber email"
                        />
                        <button
                            type="button"
                            className={styles.addTestBtn}
                            onClick={handleAddTestSubscriber}
                        >
                            + Add Test Email
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Favorite Cut</th>
                                <th>Orders</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubscribers.map(sub => {
                                const isTest = sub._id.startsWith('test-sub-');
                                return (
                                    <tr key={sub._id}>
                                        <td className={styles.cellName}>
                                            <span>{sub.name || 'Hofherr Customer'}</span>
                                            {isTest && (
                                                <button
                                                    type="button"
                                                    className={styles.removeTestBtn}
                                                    onClick={() => handleRemoveTestSubscriber(sub._id)}
                                                    aria-label={`Remove ${sub.name}`}
                                                    title="Remove test subscriber"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </td>
                                    <td className={styles.cellEmail}>
                                        <a href={`mailto:${sub.email}`}>{sub.email}</a>
                                    </td>
                                    <td className={styles.cellMuted}>{sub.phone || '—'}</td>
                                    <td className={styles.cellGold}>{sub.favoriteCut || '—'}</td>
                                    <td className={styles.cellNum}>{sub.orderCount}</td>
                                    <td className={styles.cellMuted}>
                                        {sub.createdAt ? formatJoinedDate(sub.createdAt) : '—'}
                                    </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Social & Print Automation Studio (IG · FB · X) ── */}
            <section
                id="social-studio-section"
                aria-label="Social and Print Automation Studio"
                className={styles.embeddedPanel}
            >
                <SocialAdminInline />
            </section>

            {/* ── Social Profiles, Cut Charts, Bios & Captions Kit (from /product-identity/social) ── */}
            <section
                id="social-profiles-kit-section"
                aria-label="Social Profiles, Cut Charts, Bios and Captions Kit"
                className={styles.embeddedPanel}
            >
                <SocialKitInline embedded />
            </section>

            {/* ── Automated Transactional Emails (Welcome, Verify, Reset, Order, Restock, Newsletter) ── */}
            <TransactionalEmailsSection />
        </div>
    );
}
