'use client';
import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import styles from './dashboard.module.css';
import { useRouter } from 'next/navigation';

export default function DashboardClient({ userName, email, phone, address, initial, initialOrders, specials = [], avatar = '' }: { userName: string, email: string, phone: string, address: string, initial: string, initialOrders: any[], specials?: any[], avatar?: string }) {
    const router = useRouter();
    const { update: updateSession } = useSession();

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    // ── Editable profile state ──
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editName, setEditName] = useState(userName);
    const [editPhone, setEditPhone] = useState(phone);
    const [editAddress, setEditAddress] = useState(address);
    const [displayName, setDisplayName] = useState(userName);
    const [displayPhone, setDisplayPhone] = useState(phone);
    const [displayAddress, setDisplayAddress] = useState(address);
    const [avatarUrl, setAvatarUrl] = useState(avatar);
    const [editAvatar, setEditAvatar] = useState(avatar);

    const AVATAR_OPTIONS = [
        '/avatars/calf.jpg',
        '/avatars/cow.png',
        '/avatars/cheese.jpg',
        '/avatars/deer.jpg',
        '/avatars/fish.jpg',
        '/avatars/pig.jpg',
        '/avatars/rooster.jpg',
        '/avatars/turkey.jpg',
    ];

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, phone: editPhone, address: editAddress, avatar: editAvatar }),
            });
            if (res.ok) {
                setDisplayName(editName);
                setDisplayPhone(editPhone);
                setDisplayAddress(editAddress);
                setAvatarUrl(editAvatar);
                // Update the NextAuth session so navbar gets the new avatar
                await updateSession({ user: { name: editName, phone: editPhone, avatar: editAvatar } });
                // Also notify the navbar immediately via custom event
                window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { avatar: editAvatar } }));
                setIsEditing(false);
            } else {
                alert('Failed to save. Please try again.');
            }
        } catch {
            alert('Something went wrong.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditName(displayName);
        setEditPhone(displayPhone);
        setEditAddress(displayAddress);
        setEditAvatar(avatarUrl);
        setIsEditing(false);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const date = d.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        const time = d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        return `${date} at ${time}`;
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

    // Logic for new insights
    const itemMap = new Map();
    (initialOrders || []).forEach(o => {
        (o.items || []).forEach((i: any) => {
            itemMap.set(i.name, (itemMap.get(i.name) || 0) + (i.qty || 1));
        });
    });
    
    let favoriteCut = 'Starting Journey';
    let maxQty = 0;
    itemMap.forEach((qty, name) => {
        if (qty > maxQty) {
            maxQty = qty;
            favoriteCut = name;
        }
    });

    const lifetimeSpend = initialOrders.reduce((acc, o) => acc + (o.total || 0), 0) / 100;
    const points = lifetimeSpend + 50; // Starting bonus
    
    let tierName = 'Sausage';
    let tierColor = 'var(--text-muted)';
    if (points >= 1000) { tierName = 'Master'; tierColor = 'var(--red)'; }
    else if (points >= 500) { tierName = 'Ribeye'; tierColor = 'var(--red-light)'; }
    else if (points >= 200) { tierName = 'Chop'; tierColor = 'var(--red)'; }

    const lastOrder = initialOrders[0];

    return (
        <div className={styles.dashboardContainer}>
            <main className={styles.mainCanvas}>
                <header className={styles.header}>
                    <div className={styles.headerTop}>
                        <div>
                            {initialOrders.length > 0 ? (
                                <>
                                    <h1 className={styles.greeting}>Welcome Back, {userName}</h1>
                                    <p className={styles.dateSub}>We've missed you! Here's your latest culinary summary.</p>
                                </>
                            ) : (
                                <>
                                    <h1 className={styles.greeting}>Thanks for joining our community!</h1>
                                    <p className={styles.dateSub}>Hi there, {userName} — let's get you set up with your first order.</p>
                                </>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button onClick={handleLogout} className={styles.logoutBtn}>
                                Sign Out
                            </button>
                        </div>
                    </div>
                </header>

                {/* ── Profile & Order History (top) ── */}
                <div className={styles.contentGrid}>
                    {/* ── Left Column: Profile Bio ── */}
                    <div className={styles.sideColumn}>
                        <div className={styles.profileCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Account Profile</h2>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className={styles.editBtn}>Edit</button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={handleCancelEdit} className={styles.editBtn} style={{ color: 'var(--text-secondary)' }}>Cancel</button>
                                        <button onClick={handleSaveProfile} className={styles.saveBtn} disabled={isSaving}>
                                            {isSaving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div
                                className={styles.profileAvatar}
                                style={(isEditing ? editAvatar : avatarUrl) ? { backgroundImage: `url(${isEditing ? editAvatar : avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : undefined}
                            >
                                {(isEditing ? editAvatar : avatarUrl) ? '' : initial}
                            </div>

                            {isEditing && (
                                <div className={styles.avatarPicker}>
                                    <p className={styles.infoLabel} style={{ marginBottom: '8px' }}>Choose your avatar</p>
                                    <div className={styles.avatarGrid}>
                                        {AVATAR_OPTIONS.map((src) => (
                                            <button
                                                key={src}
                                                type="button"
                                                className={`${styles.avatarOption} ${editAvatar === src ? styles.avatarOptionActive : ''}`}
                                                onClick={() => setEditAvatar(src)}
                                            >
                                                <img src={src} alt="" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isEditing ? (
                                <>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Full Name</label>
                                        <input className={styles.editInput} value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your name" />
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>Email Address</p>
                                        <p className={styles.infoValue} style={{ opacity: 0.6 }}>{email}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Primary Phone</label>
                                        <input className={styles.editInput} value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="555-555-5555" />
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Saved Address</label>
                                        <input className={styles.editInput} value={editAddress} onChange={(e) => setEditAddress(e.target.value)} placeholder="123 Main St, City" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 style={{ fontSize: '22px', marginBottom: '4px', fontWeight: 600 }}>{displayName}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Member since {initialOrders.length > 0 ? formatDate(initialOrders[initialOrders.length - 1].createdAt) : '2024'}</p>
                                    
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>Email Address</p>
                                        <p className={styles.infoValue}>{email}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>Primary Phone</p>
                                        <p className={styles.infoValue}>{displayPhone || 'Not provided'}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>Saved Address</p>
                                        <p className={styles.infoValue}>{displayAddress || 'No address saved'}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Gift Card */}
                        <div className={styles.giftCardCard} style={{ marginTop: '16px' }}>
                            <span className={styles.statLabel} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>Share the Tradition</span>
                            <div style={{ margin: '8px 0' }}>
                                <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>Hofherr Gift Cards</h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>Give the gift of premium cuts to friends and family.</p>
                            </div>
                            <a 
                                href="https://www.giftly.com/gift-card/hofherr-meat-northfield" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.giftCardBtn}
                                style={{ marginTop: 'auto', textAlign: 'center', width: '100%', display: 'block' }}
                            >
                                Send a Giftly Card
                            </a>
                        </div>
                    </div>

                    {/* ── Right Column: Order History ── */}
                    <div className={styles.mainColumn}>
                        {/* Quick Reorder */}
                        {lastOrder && (
                            <div className={styles.statCard} style={{ background: '#fff', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <div>
                                        <span className={styles.statLabel}>Quick Reorder</span>
                                        <h3 style={{ margin: '8px 0', fontSize: '24px', color: 'var(--text-primary)' }}>Your Last Purchase</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Order #{lastOrder.orderNumber} • {formatDate(lastOrder.createdAt)}</p>
                                    </div>
                                    <button onClick={() => handleReorder(lastOrder)} className={styles.primaryActionBtn} style={{ marginTop: 0 }}>
                                        Repurchase Now
                                    </button>
                                </div>
                                <div className={styles.orderItems} style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', width: '100%' }}>
                                    {lastOrder.items.map((item: any, i: number) => (
                                        <span key={i} className={styles.orderItemBadge}>
                                            {item.qty || item.quantity || 1}x {item.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

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

                {/* ── Member Specials ── */}
                {specials.length > 0 && (
                    <section className={styles.specialsSection}>
                        <h2 className={styles.sectionTitle}>🔥 Member Specials</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Exclusive deals for logged-in members. Don&apos;t miss out!</p>
                        <div className={styles.specialsGrid}>
                            {specials.map((special: any) => (
                                <div key={special._id} className={styles.specialCard}>
                                    {special.badge && (
                                        <span className={styles.specialBadge} data-badge={special.badge}>
                                            {special.badge.replace('-', ' ').toUpperCase()}
                                        </span>
                                    )}
                                    {special.image && (
                                        <div className={styles.specialImageWrap}>
                                            <img src={special.image} alt={special.title} className={styles.specialImage} />
                                        </div>
                                    )}
                                    <div className={styles.specialContent}>
                                        <h3 className={styles.specialTitle}>{special.title}</h3>
                                        {special.description && (
                                            <p className={styles.specialDesc}>{special.description}</p>
                                        )}
                                        <div className={styles.specialPricing}>
                                            {special.regularPrice && (
                                                <span className={styles.specialRegular}>{special.regularPrice}</span>
                                            )}
                                            <span className={styles.specialSale}>{special.salePrice}</span>
                                        </div>
                                        {special.savings && (
                                            <span className={styles.specialSavings}>{special.savings}</span>
                                        )}
                                        <button onClick={() => router.push('/online-orders')} className={styles.primaryActionBtn} style={{ width: '100%', marginTop: '12px' }}>
                                            Order Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
