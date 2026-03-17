'use client';
import React from 'react';
import { signOut } from 'next-auth/react';
import styles from './dashboard.module.css';
import { useRouter } from 'next/navigation';

export default function DashboardClient({ userName, email, phone, address, initial, initialOrders }: { userName: string, email: string, phone: string, address: string, initial: string, initialOrders: any[] }) {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleReorder = (order: any) => {
        // Format items for the cart
        const cartItems = order.items.map((item: any) => ({
            name: item.name,
            price: item.price,
            qty: item.qty || item.quantity || 1,
            note: item.note || '',
            desc: item.desc || '',
            metadata: order.metadata || {}
        }));

        // Determine which cart to load based on order metadata
        const storeId = order.metadata?.store_id;
        if (storeId === 'butcher') {
            localStorage.setItem('hofherr_cart_butcher', JSON.stringify(cartItems));
        } else if (storeId === 'depot') {
            localStorage.setItem('hofherr_cart_depot', JSON.stringify(cartItems));
        } else {
            localStorage.setItem('hofherr_cart', JSON.stringify(cartItems));
        }
        
        // Redirect to online orders with cart open
        // Passing store parameter if available
        const storeParam = storeId ? `&store=${storeId}` : '';
        router.push(`/online-orders?cart=open${storeParam}`);
    };

    const lifetimeSpend = initialOrders.reduce((acc, o) => acc + (o.total || 0), 0) / 100;
    const points = lifetimeSpend + 50; // Starting bonus
    
    let tierName = 'Sausage';
    let tierColor = '#94a3b8';
    if (points >= 1000) { tierName = 'Master'; tierColor = '#ef4444'; }
    else if (points >= 500) { tierName = 'Ribeye'; tierColor = '#f59e0b'; }
    else if (points >= 200) { tierName = 'Chop'; tierColor = '#c5a059'; }

    const lastOrder = initialOrders[0];

    return (
        <div className={styles.dashboardContainer}>
            <main className={styles.mainCanvas}>
                <header className={styles.header}>
                    <div className={styles.headerTop}>
                        <div>
                            <h1 className={styles.greeting}>Collector's Account</h1>
                            <p className={styles.dateSub}>Welcome back, {userName}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button onClick={handleLogout} className={styles.logoutBtn}>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </header>

                {/* ── Spotlight Section ── */}
                {lastOrder && (
                    <div className={styles.statsHero}>
                        <div className={styles.statCard} style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(142, 21, 38, 0.2) 0%, rgba(15, 17, 21, 0.8) 100%)', borderColor: 'rgba(142, 21, 38, 0.3)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span className={styles.statLabel}>Quick Reorder</span>
                                    <h3 style={{ margin: '8px 0', fontSize: '24px' }}>Your Last Purchase</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Order #{lastOrder.orderNumber} • {formatDate(lastOrder.createdAt)}</p>
                                </div>
                                <button onClick={() => handleReorder(lastOrder)} className={styles.primaryActionBtn} style={{ marginTop: 0 }}>
                                    Repurchase Now
                                </button>
                            </div>
                            <div className={styles.orderItems} style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                                {lastOrder.items.map((item: any, i: number) => (
                                    <span key={i} className={styles.orderItemBadge} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}>
                                        {item.qty || item.quantity || 1}x {item.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Loyalty Tier</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span className={styles.statValue} style={{ color: tierColor }}>{tierName}</span>
                            </div>
                            <span className={styles.statTrend}>{points.toFixed(0)} points earned</span>
                        </div>
                    </div>
                )}

                <div className={styles.contentGrid}>
                    {/* ── Left Column: Profile Bio ── */}
                    <div className={styles.sideColumn}>
                        <h2 className={styles.sectionTitle}>Account Profile</h2>
                        <div className={styles.profileCard}>
                            <div className={styles.profileAvatar}>{initial}</div>
                            <h3 style={{ fontSize: '22px', marginBottom: '4px', fontWeight: 600 }}>{userName}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Member since {initialOrders.length > 0 ? formatDate(initialOrders[initialOrders.length - 1].createdAt) : '2024'}</p>
                            
                            <div className={styles.infoItem}>
                                <p className={styles.infoLabel}>Email Address</p>
                                <p className={styles.infoValue}>{email}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <p className={styles.infoLabel}>Primary Phone</p>
                                <p className={styles.infoValue}>{phone || 'Not provided'}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <p className={styles.infoLabel}>Delivery Address</p>
                                <p className={styles.infoValue}>{address || 'No address saved'}</p>
                            </div>

                            <button onClick={() => router.push('/profile/edit')} className={styles.reorderBtn} style={{ width: '100%', marginTop: '12px' }}>
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* ── Right Column: Order History ── */}
                    <div className={styles.mainColumn}>
                        <h2 className={styles.sectionTitle}>Order History ({initialOrders.length})</h2>
                        <div className={styles.orderList}>
                            {initialOrders.length > 0 ? (
                                initialOrders.map((order) => (
                                    <div key={order._id} className={styles.orderCard}>
                                        <div className={styles.orderHeader}>
                                            <span className={styles.orderId}>Order #{order.orderNumber}</span>
                                            <span className={`${styles.orderStatusPill} ${styles['status_' + (order.status || 'pending').toLowerCase().replace('-', '_')]}`}>
                                                {order.status || 'Processing'}
                                            </span>
                                        </div>
                                        <div className={styles.orderBody}>
                                            <div className={styles.orderItems}>
                                                {(order.items || []).map((item: any, i: number) => (
                                                    <span key={i} className={styles.orderItemBadge}>
                                                        {item.qty || item.quantity || 1}x {item.name}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className={styles.orderDate}>{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div className={styles.orderFooter}>
                                            <span className={styles.orderTotal}>${((order.total || 0) / 100).toFixed(2)}</span>
                                            <button onClick={() => handleReorder(order)} className={styles.reorderBtn}>
                                                Repurchase & Edit
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.emptyOrders}>
                                    <p>Your culinary journey begins with your first order.</p>
                                    <button onClick={() => router.push('/online-orders')} className={styles.primaryActionBtn}>
                                        Shop the Collection
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
