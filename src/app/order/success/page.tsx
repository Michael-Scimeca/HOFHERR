'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
function SuccessContent() {
    const params = useSearchParams();
    const sessionId = params.get('session_id');
    const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
    const [orderDetails, setOrderDetails] = useState<{ 
        name: string; 
        summary: string;
        taxAmount?: string;
        totalAmount?: string;
        pickupTime?: string;
        storeId?: string;
    } | null>(null);

    useEffect(() => {
        const isInstore = params.get('instore') === 'true';

        if (isInstore) {
            setStatus('ok');
            setOrderDetails({
                name: params.get('name') || 'Guest',
                summary: params.get('summary') || '',
                pickupTime: params.get('pickupTime') || 'Ready during hours',
                storeId: params.get('storeId') || 'butcher'
            });
            try { localStorage.removeItem('hofherr_cart_butcher'); localStorage.removeItem('hofherr_cart_depot'); localStorage.removeItem('hofherr_cart'); } catch {}
            return;
        }

        if (!sessionId) { 
            if (process.env.NODE_ENV === 'development') {
                setStatus('ok');
                setOrderDetails({
                    name: 'Test Setup',
                    summary: 'Test Order (No Items)',
                    taxAmount: '0.00',
                    totalAmount: '0.00',
                    pickupTime: 'No Date Selected',
                    storeId: params.get('storeId') || 'butcher'
                });
                return;
            }
            setStatus('error'); 
            return; 
        }
        // Verify the session with our API to confirm payment
        fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
            .then(r => r.json())
            .then(d => {
                if (d.paid) {
                    setStatus('ok');
                    setOrderDetails({ 
                        name: d.customerName, 
                        summary: d.orderSummary,
                        taxAmount: d.taxAmount,
                        totalAmount: d.totalAmount,
                        pickupTime: d.pickupTime,
                        storeId: d.storeId
                    });
                } else {
                    setStatus('error');
                }
            })
            .catch(() => setStatus('error'));
        // Clear cart regardless
        try { localStorage.removeItem('hofherr_cart'); } catch { /* ignore */ }
    }, [sessionId]);

    if (status === 'loading') return (
        <div className={styles.splitLayout}>
            <div className={styles.leftPane}>
                <div className={styles.spinner} />
            </div>
            <div className={styles.rightPane}>
                <video autoPlay muted loop className={styles.videoBg}>
                    <source src="/video-clips/A_herd_of_real_cows_grazing_on_short_green.mp4" type="video/mp4" />
                </video>
                <div className={styles.overlay} />
            </div>
        </div>
    );

    if (status === 'error') return (
        <div className={styles.splitLayout}>
            <div className={styles.leftPane}>
                <div className={styles.state}>
                    <div className={styles.icon}>⚠️</div>
                    <h1>Something went wrong</h1>
                    <p className={styles.sub}>We couldn&apos;t verify your order. Please call us at <strong>(847) 441-6328</strong> to confirm.</p>
                    <Link href="/online-orders" className={styles.btn}>Back to Orders</Link>
                </div>
            </div>
            <div className={styles.rightPane}>
                <video autoPlay muted loop className={styles.videoBg}>
                    <source src="/video-clips/A_herd_of_real_cows_grazing_on_short_green.mp4" type="video/mp4" />
                </video>
                <div className={styles.overlay} />
            </div>
        </div>
    );

    const items = orderDetails?.summary?.split(',').map(s => s.trim()) || [];

    return (
        <div className={styles.splitLayout}>
            <div className={styles.leftPane}>
                <div className={styles.contentWrapper}>
                    <div className={styles.state}>
                        <div className={styles.successImgWrapper}>
                            <Image src="/assets/success-roast.jpg" alt="Success Roast" width={140} height={90} className={styles.successImg} />
                        </div>
                        <h1>Order Received!</h1>
                        <p className={styles.sub}>
                            Thank you {orderDetails?.name ? <strong>{orderDetails.name}</strong> : ''} — we&apos;ll have your cuts ready for pickup. A confirmation email has been sent to you and our butchers.
                        </p>

                        {items.length > 0 && (
                            <div className={styles.summarySection}>
                                <span className={styles.summaryTitle}>Your Order Summary</span>
                                <div className={styles.summaryList}>
                                    {items.map((item, i) => {
                                        const [name, details] = item.split(' x');
                                        return (
                                            <div key={i} className={styles.summaryItem}>
                                                <span>{name}</span>
                                                <span>x{details}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {(orderDetails?.taxAmount || orderDetails?.totalAmount) && (
                                    <div className={styles.financials}>
                                        {orderDetails.taxAmount && (
                                            <div className={styles.summaryItem} style={{ marginTop: '12px', opacity: 0.8 }}>
                                                <span>Estimated Tax (2.25%)</span>
                                                <span>${orderDetails.taxAmount}</span>
                                            </div>
                                        )}
                                        {orderDetails.totalAmount && (
                                            <div className={styles.summaryItem} style={{ marginTop: '4px', fontSize: '1.1rem', fontWeight: 700 }}>
                                                <span>Estimated Total</span>
                                                <span>${orderDetails.totalAmount}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={styles.infoBox}>
                            <div className={styles.infoCard}>
                                <span className={styles.infoLabel}>📍 Pickup Location</span>
                                {orderDetails?.storeId === 'depot' ? (
                                    <a href="https://maps.google.com/?q=780+Elm+St,+Winnetka,+IL+60093" target="_blank" rel="noopener noreferrer" className={styles.infoValue}>The Depot<br/>780 Elm St, Winnetka</a>
                                ) : (
                                    <a href="https://maps.google.com/?q=300+Happ+Rd,+Northfield,+IL+60093" target="_blank" rel="noopener noreferrer" className={styles.infoValue}>Hofherr Meat Co.<br/>300 Happ Rd, Northfield</a>
                                )}
                            </div>
                            <div className={styles.infoCard}>
                                <span className={styles.infoLabel}>⏰ Pickup Time</span>
                                <span className={styles.infoValue}>{orderDetails?.pickupTime || 'Ready during hours'}</span>
                            </div>
                            <div className={styles.infoCard}>
                                <span className={styles.infoLabel}>📞 Questions?</span>
                                <span className={styles.infoValue}>
                                    (847) 441-6328
                                </span>
                            </div>
                            <div className={styles.infoCard}>
                                <span className={styles.infoLabel}>📧 Confirmation</span>
                                <span className={styles.infoValue}>We sent you an email. Check your inbox, you should get a confirmation email.</span>
                            </div>
                        </div>

                        <p className={styles.note}>
                            Per-pound items will be finalized at pickup based on exact weight.
                        </p>
                        <Link href="/" className={styles.btn}>Back to Home</Link>
                    </div>
                </div>
            </div>
            <div className={styles.rightPane}>
                <video autoPlay muted loop className={styles.videoBg}>
                    <source src="/video-clips/A_herd_of_real_cows_grazing_on_short_green.mp4" type="video/mp4" />
                </video>
                <div className={styles.overlay} />
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <main className={styles.page}>
            <Suspense fallback={<div className={styles.state}><div className={styles.spinner} /></div>}>
                <SuccessContent />
            </Suspense>
        </main>
    );
}
