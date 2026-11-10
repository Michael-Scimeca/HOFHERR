'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import FireBorder from '@/components/TestimonialWall/FireBorder';
import styles from './page.module.css';

type TrackerStageKey = 'placed' | 'prep' | 'ready' | 'done';

const TRACKER_STAGES: {
    key: TrackerStageKey;
    stepNum: string;
    short: string;
    title: string;
    statusCode: string;
    message: string;
}[] = [
    {
        key: 'placed',
        stepNum: '01',
        short: 'Ticket Verified',
        title: 'Order Placed · In Butcher Queue',
        statusCode: 'paid / pending',
        message: 'Your ticket is verified and printed at the counter. A butcher will start trimming your cuts shortly.',
    },
    {
        key: 'prep',
        stepNum: '02',
        short: 'On the Block',
        title: 'Hand-Cutting & Wrapping',
        statusCode: 'processing',
        message: 'Your order is on the butcher block — being hand-cut, weighed on our certified scale, and wrapped in kraft paper.',
    },
    {
        key: 'ready',
        stepNum: '03',
        short: 'Ready for Pickup',
        title: 'Wrapped & Waiting at Counter',
        statusCode: 'ready_paid',
        message: 'Your kraft-wrapped parcel is twine-tied and waiting in the cold case. Give your name at the butcher counter.',
    },
    {
        key: 'done',
        stepNum: '04',
        short: 'Picked Up',
        title: 'Picked Up · Complete',
        statusCode: 'completed',
        message: 'Order picked up and logged in your Hofherr Meat Co. account order history.',
    },
];

function SuccessContent() {
    const params = useSearchParams();
    const { data: session } = useSession();
    const sessionId = params.get('session_id');
    const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
    const [stageIdx, setStageIdx] = useState<number>(0);
    const [autoPlay, setAutoPlay] = useState<boolean>(false);
    const [orderDetails, setOrderDetails] = useState<{
        name: string;
        summary: string;
        taxAmount?: string;
        totalAmount?: string;
        pickupTime?: string;
        storeId?: string;
    } | null>(null);

    useEffect(() => {
        if (!autoPlay) return;
        if (stageIdx >= TRACKER_STAGES.length - 1) {
            setAutoPlay(false);
            return;
        }
        const timer = window.setTimeout(() => {
            setStageIdx((prev) => Math.min(prev + 1, TRACKER_STAGES.length - 1));
        }, 2800);
        return () => window.clearTimeout(timer);
    }, [autoPlay, stageIdx]);

    useEffect(() => {
        const isInstore = params.get('instore') === 'true';

        if (isInstore) {
            setStatus('ok');
            setOrderDetails({
                name: params.get('name') || 'Guest',
                summary: params.get('summary') || '',
                pickupTime: params.get('pickupTime') || 'Ready during hours',
                storeId: params.get('storeId') || 'butcher',
            });
            try {
                localStorage.removeItem('hofherr_cart_butcher');
                localStorage.removeItem('hofherr_cart_depot');
                localStorage.removeItem('hofherr_cart');
            } catch {
                /* ignore */
            }
            return;
        }

        if (!sessionId) {
            if (process.env.NODE_ENV === 'development') {
                setStatus('ok');
                setOrderDetails({
                    name: 'Test Setup',
                    summary: 'USDA Prime Bone-In Ribeye x2, House Smoked Brisket (1.5 lb) x1',
                    taxAmount: '3.15',
                    totalAmount: '143.15',
                    pickupTime: 'Ready during shop hours',
                    storeId: params.get('storeId') || 'butcher',
                });
                return;
            }
            setStatus('error');
            return;
        }

        fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
            .then((r) => {
                if (!r.ok) throw new Error('Verification request failed');
                return r.json();
            })
            .then((d) => {
                if (d.paid) {
                    setStatus('ok');
                    setOrderDetails({
                        name: d.customerName,
                        summary: d.orderSummary,
                        taxAmount: d.taxAmount,
                        totalAmount: d.totalAmount,
                        pickupTime: d.pickupTime,
                        storeId: d.storeId,
                    });
                } else {
                    setStatus('error');
                }
            })
            .catch(() => setStatus('error'));

        try {
            localStorage.removeItem('hofherr_cart');
        } catch {
            /* ignore */
        }
    }, [sessionId, params]);

    if (status === 'loading') {
        return (
            <div className={styles.splitLayout}>
                <div className={styles.leftPane}>
                    <div className={styles.loadingState}>
                        <div className={styles.spinner} />
                        <p className={styles.loadingText}>Verifying your butcher counter ticket…</p>
                    </div>
                </div>
                <div className={styles.rightPane}>
                    <div className={styles.imageSticky}>
                        <Image
                            src="/assets/identity/butcher-complete-packaging-suite-10-icons.jpg"
                            alt="Hofherr Meat Co. kraft butcher paper parcel and packaging suite"
                            fill
                            sizes="(max-width: 1000px) 100vw, 48vw"
                            className={styles.heroImg}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className={styles.splitLayout}>
                <div className={styles.leftPane}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.ticketCard}>
                            <FireBorder active radius={20} />
                            <div className={styles.sealHeader}>
                                <Image
                                    src="/assets/identity/hofherr-stamp-circular-crimson.svg"
                                    alt="Hofherr Meat Co. Northfield Seal"
                                    width={72}
                                    height={72}
                                    className={styles.sealImg}
                                />
                            </div>
                            <h1 className={styles.headline}>We Couldn&apos;t Verify Your Ticket</h1>
                            <p className={styles.sub}>
                                Please call our butcher counter directly at <strong>(847) 441-6328</strong> so we can confirm your order right away.
                            </p>
                            <div className={styles.actionsRow}>
                                <Link href="/online-orders" className={`btn btn-primary ${styles.primaryBtn}`}>
                                    Back to Online Orders
                                </Link>
                                <a href="tel:8474416328" className={`btn btn-secondary ${styles.secondaryBtn}`}>
                                    Call (847) 441-MEAT
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.rightPane}>
                    <div className={styles.imageSticky}>
                        <Image
                            src="/assets/identity/butcher-complete-packaging-suite-10-icons.jpg"
                            alt="Hofherr Meat Co. kraft butcher paper parcel and packaging suite"
                            fill
                            sizes="(max-width: 1000px) 100vw, 48vw"
                            className={styles.heroImg}
                        />
                    </div>
                </div>
            </div>
        );
    }

    const items = orderDetails?.summary
        ? orderDetails.summary
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
        : [];

    const isDepot = orderDetails?.storeId === 'depot';
    const currentStage = TRACKER_STAGES[stageIdx] ?? TRACKER_STAGES[0];
    const linkedEmail = session?.user?.email || 'Customer Account';

    const handlePlayDemo = () => {
        if (autoPlay) {
            setAutoPlay(false);
            return;
        }
        setStageIdx(0);
        setAutoPlay(true);
    };

    return (
        <div className={styles.splitLayout}>
            {/* Ticket Pane (Right Side via row-reverse) */}
            <div className={styles.leftPane}>
                <div className={styles.contentWrapper}>
                    <div className={styles.ticketCard}>
                        <FireBorder active radius={20} />

                        <div className={styles.ticketTopBar}>
                            <div className={styles.sealGroup}>
                                <Image
                                    src="/assets/identity/hofherr-stamp-circular-crimson.svg"
                                    alt="Hofherr Meat Co. Northfield Provenance Seal"
                                    width={64}
                                    height={64}
                                    className={styles.sealImg}
                                />
                                <div className={styles.sealMeta}>
                                    <span className={styles.ticketSerial}>CUSTOM CUT TICKET · VERIFIED</span>
                                    <span className={styles.ticketSub}>HOFHERR MEAT CO. · EST. 2018</span>
                                </div>
                            </div>
                            <div className={styles.stampBadge}>
                                <Image
                                    src="/assets/identity/stickers/sticker-cow.svg"
                                    alt=""
                                    width={24}
                                    height={24}
                                    className={styles.miniSticker}
                                />
                                <span>CUT TO ORDER</span>
                            </div>
                        </div>

                        <h1 className={styles.headline}>
                            Order <em>Received!</em>
                        </h1>
                        <p className={styles.sub}>
                            Thank you{orderDetails?.name ? <> <strong>{orderDetails.name}</strong></> : ''} — our butchers have your ticket and will hand-cut and wrap your order in kraft butcher paper for pickup. <strong>Please check your email</strong> for your order confirmation and receipt.
                        </p>

                        {/* ── Live Order Progress Tracker (4 Stages) ── */}
                        <div className={styles.liveTrackerBox}>
                            <div className={styles.liveTrackerHeader}>
                                <div>
                                    <span className={styles.liveTrackerKicker}>
                                        LIVE ORDER PROGRESS · STEP {stageIdx + 1} OF {TRACKER_STAGES.length}
                                    </span>
                                    <div className={styles.liveTrackerTitle}>{currentStage.title}</div>
                                </div>
                                <div className={styles.liveTrackerControls}>
                                    <button
                                        type="button"
                                        onClick={handlePlayDemo}
                                        className={styles.demoPlayBtn}
                                    >
                                        {autoPlay ? '⏸ Pause Progress' : '▶ Simulate Progress'}
                                    </button>
                                    <Link href="/order-tracker-test" className={styles.trackerTestLink}>
                                        Open Tracker Test Page →
                                    </Link>
                                </div>
                            </div>

                            <ol className={styles.progressBar} aria-label="Order progress stages">
                                {TRACKER_STAGES.map((stage, i) => {
                                    const isDone = i < stageIdx || stageIdx === TRACKER_STAGES.length - 1;
                                    const isActive = i === stageIdx && stageIdx < TRACKER_STAGES.length - 1;
                                    const segState = isDone
                                        ? styles.segDone
                                        : isActive
                                          ? styles.segActive
                                          : styles.segTodo;
                                    return (
                                        <li key={stage.key} className={styles.progressItem}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setAutoPlay(false);
                                                    setStageIdx(i);
                                                }}
                                                className={`${styles.segBtn} ${segState}`}
                                                aria-current={i === stageIdx ? 'step' : undefined}
                                            >
                                                <span className={styles.segFill} aria-hidden="true" />
                                                <span className={styles.segNum} aria-hidden="true">
                                                    {isDone ? '✓' : stage.stepNum}
                                                </span>
                                                <span className={styles.segLabel}>{stage.short}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ol>

                            <p className={styles.liveTrackerMessage} aria-live="polite">
                                {currentStage.message}
                            </p>

                            <div className={styles.accountSyncRow}>
                                <div className={styles.accountSyncLeft}>
                                    <span className={styles.accountSyncDot} aria-hidden="true" />
                                    <span>
                                        <strong>Attached to Account:</strong> Linked via Sanity <code>order.customer</code> ({linkedEmail}) · Status: <code>{currentStage.statusCode}</code>
                                    </span>
                                </div>
                                <Link href="/dashboard" className={styles.accountDashLink}>
                                    View in My Account →
                                </Link>
                            </div>
                        </div>

                        {items.length > 0 && (
                            <div className={styles.scaleTicket}>
                                <div className={styles.scaleTicketInner}>
                                    <div className={styles.scaleHeader}>
                                        <span className={styles.scaleBrand}>HOFHERR&apos;S MEATS · SCALE TICKET</span>
                                        <span className={styles.scaleDept}>
                                            {isDepot ? 'WINNETKA DEPOT' : 'NORTHFIELD SHOP'}
                                        </span>
                                    </div>

                                    <div className={styles.summaryList}>
                                        {items.map((item) => {
                                            const lastSplit = item.lastIndexOf(' x');
                                            const name = lastSplit !== -1 ? item.slice(0, lastSplit) : item;
                                            const qty = lastSplit !== -1 ? `×${item.slice(lastSplit + 2)}` : '1 pk';
                                            return (
                                                <div key={item} className={styles.summaryItem}>
                                                    <span className={styles.itemName}>{name}</span>
                                                    <span className={styles.itemQty}>{qty}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {(orderDetails?.taxAmount || orderDetails?.totalAmount) && (
                                        <div className={styles.financials}>
                                            {orderDetails.taxAmount && (
                                                <div className={styles.taxRow}>
                                                    <span>Estimated Tax (2.25%)</span>
                                                    <span>${orderDetails.taxAmount}</span>
                                                </div>
                                            )}
                                            {orderDetails.totalAmount && (
                                                <div className={styles.totalRow}>
                                                    <span>Estimated Total</span>
                                                    <span>${orderDetails.totalAmount}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className={styles.scaleFooter}>
                                        <span>PACKED IN UNBLEACHED KRAFT · TWINE TIED</span>
                                        <span>USDA PRIME &amp; HERITAGE FARMS</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.infoBox}>
                            <div className={styles.infoCard}>
                                <div className={styles.infoHeader}>
                                    <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z" />
                                        <circle cx="12" cy="9" r="2.5" />
                                    </svg>
                                    <span className={styles.infoLabel}>Pickup Location</span>
                                </div>
                                {isDepot ? (
                                    <a
                                        href="https://maps.google.com/?q=780+Elm+St,+Winnetka,+IL+60093"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.infoValue}
                                    >
                                        The Depot · Winnetka<br />780 Elm St, Winnetka, IL
                                    </a>
                                ) : (
                                    <a
                                        href="https://maps.google.com/?q=300+Happ+Rd,+Northfield,+IL+60093"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.infoValue}
                                    >
                                        Hofherr Meat Co. · Butcher Shop<br />300 Happ Rd, Northfield, IL
                                    </a>
                                )}
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.infoHeader}>
                                    <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9" />
                                        <path d="M12 7v5l3 2" />
                                    </svg>
                                    <span className={styles.infoLabel}>Pickup Window</span>
                                </div>
                                <span className={styles.infoValue}>
                                    {orderDetails?.pickupTime || 'Ready during shop hours'}
                                </span>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.infoHeader}>
                                    <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <span className={styles.infoLabel}>Butcher Counter</span>
                                </div>
                                <a href="tel:8474416328" className={styles.infoValue}>
                                    (847) 441-MEAT · (847) 441-6328
                                </a>
                            </div>

                            <div className={`${styles.infoCard} ${styles.infoCardHighlight}`}>
                                <div className={styles.infoHeader}>
                                    <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <rect x="3" y="5" width="18" height="14" rx="2" />
                                        <path d="m3 7 9 6 9-6" />
                                    </svg>
                                    <span className={styles.infoLabel}>Check Your Email</span>
                                </div>
                                <span className={styles.infoValue}>
                                    Check your email inbox for your order confirmation &amp; butcher counter receipt.
                                </span>
                            </div>
                        </div>

                        <p className={styles.note}>
                            Per-pound cuts are weighed on our certified butcher scale at pickup for exact final pricing.
                        </p>

                        <div className={styles.actionsRow}>
                            <Link href="/online-orders" className={`btn btn-primary ${styles.primaryBtn}`}>
                                Continue Shopping
                            </Link>
                            <Link href="/dashboard" className={`btn btn-secondary ${styles.secondaryBtn}`}>
                                My Account · Orders
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Pane (Left Side via row-reverse): Hofherr Butcher Packaging Suite */}
            <div className={styles.rightPane}>
                <div className={styles.imageSticky}>
                    <Image
                        src="/assets/identity/butcher-complete-packaging-suite-10-icons.jpg"
                        alt="Hofherr Meat Co. kraft butcher paper parcel, twine wrap, and stamped carry-out bag"
                        fill
                        priority
                        sizes="(max-width: 1000px) 100vw, 48vw"
                        className={styles.heroImg}
                    />
                    <div className={styles.overlayText}>
                        <h2>
                            Hand-cut.<br />
                            Wrapped in kraft.<br />
                            Ready for pickup.
                        </h2>
                        <p>300 Happ Rd · Northfield &amp; 780 Elm St · Winnetka Depot</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <main className={styles.page}>
            <Suspense
                fallback={
                    <div className={styles.loadingState}>
                        <div className={styles.spinner} />
                    </div>
                }
            >
                <SuccessContent />
            </Suspense>
        </main>
    );
}
