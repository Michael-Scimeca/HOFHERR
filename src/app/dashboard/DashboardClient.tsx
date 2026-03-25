'use client';
import React, { useState, useMemo } from 'react';
import { signOut, useSession } from 'next-auth/react';
import styles from './dashboard.module.css';
import { useRouter } from 'next/navigation';

function formatPhone(val: string) {
    const d = (val || '').replace(/\D/g, '');
    if (d.length < 4) return d;
    if (d.length < 7) return `${d.slice(0,3)}-${d.slice(3)}`;
    return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6,10)}`;
}

export default function DashboardClient({
    userName, email, phone, address, initial, initialOrders, specials = [], avatar = '',
    birthday = '', newsletter = false, preferredPickupTime = '',
}: {
    userName: string, email: string, phone: string, address: string, initial: string,
    initialOrders: any[], specials?: any[], avatar?: string,
    birthday?: string, newsletter?: boolean, preferredPickupTime?: string,
}) {
    const router = useRouter();
    const { update: updateSession } = useSession();
    const handleLogout = async () => { await signOut({ callbackUrl: '/' }); };

    // ── Profile state ──
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editName, setEditName] = useState(userName);
    const [editPhone, setEditPhone] = useState(formatPhone(phone));
    const [editAddress, setEditAddress] = useState(address);
    const [editBirthday, setEditBirthday] = useState(birthday);
    const [editNewsletter, setEditNewsletter] = useState(newsletter);
    const [editPickupTime, setEditPickupTime] = useState(preferredPickupTime);
    const [displayName, setDisplayName] = useState(userName);
    const [displayPhone, setDisplayPhone] = useState(formatPhone(phone));
    const [displayAddress, setDisplayAddress] = useState(address);
    const [displayBirthday, setDisplayBirthday] = useState(birthday);
    const [displayNewsletter, setDisplayNewsletter] = useState(newsletter);
    const [displayPickupTime, setDisplayPickupTime] = useState(preferredPickupTime);
    const [avatarUrl, setAvatarUrl] = useState(avatar);
    const [editAvatar, setEditAvatar] = useState(avatar);

    // ── Interaction state ──
    const [storeFilter, setStoreFilter] = useState<'all' | 'butcher' | 'depot'>('all');
    const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

    const AVATAR_OPTIONS = [
        '/avatars/avator-chickin.png',
        '/avatars/avator-cow.png',
        '/avatars/avator-pig.png',
        '/avatars/avator-sheep.png',
    ];

    // ── Computed stats ──
    const lifetimeSpend = initialOrders.reduce((acc, o) => acc + (o.total || 0), 0) / 100;
    const avgOrder = initialOrders.length > 0 ? lifetimeSpend / initialOrders.length : 0;

    const storeCounts = { butcher: 0, depot: 0 };
    initialOrders.forEach(o => { if (o.metadata?.store_id === 'depot') storeCounts.depot++; else storeCounts.butcher++; });
    const favoriteStore = storeCounts.depot > storeCounts.butcher ? 'depot' : 'butcher';

    const itemMap = new Map<string, number>();
    initialOrders.forEach(o => { (o.items || []).forEach((i: any) => { itemMap.set(i.name, (itemMap.get(i.name) || 0) + (i.qty || 1)); }); });
    let favoriteItem = 'First order coming!';
    let favoriteItemData: any = null;
    let maxQty = 0;
    itemMap.forEach((qty, name) => { if (qty > maxQty) { maxQty = qty; favoriteItem = name; } });
    if (favoriteItem !== 'First order coming!') {
        for (const order of initialOrders) {
            const found = (order.items || []).find((i: any) => i.name === favoriteItem);
            if (found) { favoriteItemData = found; break; }
        }
    }

    const lastOrder = initialOrders[0];
    const daysSinceLast = lastOrder
        ? Math.floor((Date.now() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : null;

    let orderFrequency: number | null = null;
    if (initialOrders.length >= 2) {
        const sorted = [...initialOrders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const gaps = sorted.slice(1).map((o, i) => Math.floor((new Date(o.createdAt).getTime() - new Date(sorted[i].createdAt).getTime()) / (1000 * 60 * 60 * 24)));
        orderFrequency = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
    }

    const filteredOrders = useMemo(() =>
        storeFilter === 'all' ? initialOrders : initialOrders.filter(o => o.metadata?.store_id === storeFilter),
        [initialOrders, storeFilter]);

    // ── Handlers ──
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    };
    const formatDateShort = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleCopyOrderId = (orderNumber: string) => {
        navigator.clipboard.writeText(orderNumber).catch(() => {});
        setCopiedOrderId(orderNumber);
        setTimeout(() => setCopiedOrderId(null), 2000);
    };

    const handleReorder = (order: any) => {
        const cartItems = order.items.map((item: any) => ({
            name: item.name,
            price: typeof item.price === 'number' ? `$${(item.price / 100).toFixed(2)}` : (item.price || '$0.00'),
            qty: item.qty || item.quantity || 1,
            note: item.note || '',
            desc: item.desc || '',
        }));
        const storeId = order.metadata?.store_id;
        if (storeId === 'butcher') localStorage.setItem('hofherr_cart_butcher', JSON.stringify(cartItems));
        else if (storeId === 'depot') localStorage.setItem('hofherr_cart_depot', JSON.stringify(cartItems));
        else localStorage.setItem('hofherr_cart', JSON.stringify(cartItems));
        router.push(`/online-orders?cart=open${storeId ? `&store=${storeId}` : ''}`);
    };

    const handleAddFavoriteToCart = () => {
        if (!favoriteItemData) return;
        const cartItem = {
            name: favoriteItemData.name,
            price: typeof favoriteItemData.price === 'number' ? `$${(favoriteItemData.price / 100).toFixed(2)}` : (favoriteItemData.price || '$0.00'),
            qty: 1, note: '', desc: '',
        };
        localStorage.setItem(`hofherr_cart_${favoriteStore}`, JSON.stringify([cartItem]));
        router.push(`/online-orders?cart=open&store=${favoriteStore}`);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, phone: editPhone, address: editAddress, avatar: editAvatar, birthday: editBirthday, newsletter: editNewsletter, preferredPickupTime: editPickupTime }),
            });
            if (res.ok) {
                setDisplayName(editName); setDisplayPhone(editPhone); setDisplayAddress(editAddress);
                setAvatarUrl(editAvatar); setDisplayBirthday(editBirthday);
                setDisplayNewsletter(editNewsletter); setDisplayPickupTime(editPickupTime);
                await updateSession({ user: { name: editName, phone: editPhone, avatar: editAvatar } });
                window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { avatar: editAvatar } }));
                setIsEditing(false);
            } else { alert('Failed to save. Please try again.'); }
        } catch { alert('Something went wrong.'); }
        finally { setIsSaving(false); }
    };

    const handleCancelEdit = () => {
        setEditName(displayName); setEditPhone(displayPhone); setEditAddress(displayAddress);
        setEditAvatar(avatarUrl); setEditBirthday(displayBirthday);
        setEditNewsletter(displayNewsletter); setEditPickupTime(displayPickupTime);
        setIsEditing(false);
    };

    // Store badge component (shared)
    const StoreBadge = ({ storeId }: { storeId?: string }) => {
        if (!storeId) return null;
        const isDepot = storeId === 'depot';
        return (
            <span style={{
                position: 'absolute', top: '-14px', left: '20px',
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
                padding: '3px 10px', borderRadius: '5px',
                background: isDepot ? '#1e3a5f' : '#7a0000',
                color: '#fff',
                border: `1px solid ${isDepot ? '#2563eb' : '#b91c1c'}`,
                textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const,
            }}>
                {isDepot ? '🏪 The Depot' : '🥩 Butcher Shop'}
            </span>
        );
    };

    return (
        <div className={styles.dashboardContainer}>
            <main className={styles.mainCanvas}>
                {/* ── Header ── */}
                <header className={styles.header}>
                    <div className={styles.headerTop}>
                        <div>
                            {initialOrders.length > 0 ? (
                                <><h1 className={styles.greeting}>Welcome Back, {userName}</h1>
                                <p className={styles.dateSub}>We&apos;ve missed you! Here&apos;s your latest culinary summary.</p></>
                            ) : (
                                <><h1 className={styles.greeting}>Thanks for joining our community!</h1>
                                <p className={styles.dateSub}>Hi there, {userName} — let&apos;s get you set up with your first order.</p></>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button onClick={handleLogout} className={styles.logoutBtn}>Sign Out</button>
                        </div>
                    </div>
                </header>

                {/* ── Stats Bar ── */}
                {initialOrders.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                        {[
                            { label: 'Lifetime Spend', value: `$${lifetimeSpend.toFixed(2)}`, icon: '💰' },
                            { label: 'Total Orders', value: String(initialOrders.length), icon: '📦' },
                            { label: 'Avg Order', value: `$${avgOrder.toFixed(2)}`, icon: '📊' },
                            { label: 'Fave Store', value: favoriteStore === 'depot' ? 'The Depot' : 'Butcher Shop', icon: favoriteStore === 'depot' ? '🏪' : '🥩' },
                        ].map(stat => (
                            <div key={stat.label} className={styles.statCard} style={{ textAlign: 'center', padding: '20px 12px' }}>
                                <div style={{ fontSize: '26px', marginBottom: '6px' }}>{stat.icon}</div>
                                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-heading)', letterSpacing: '0.02em' }}>{stat.value}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Restock Nudge ── */}
                {daysSinceLast !== null && daysSinceLast >= 7 && (
                    <div className={styles.statCard} style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 24px', background: 'rgba(139,0,0,0.08)', border: '1px solid rgba(139,0,0,0.25)' }}>
                        <div>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>⏰ Time to Restock</span>
                            <p style={{ color: 'var(--text)', marginTop: '4px', fontSize: '14px' }}>
                                It&apos;s been <strong>{daysSinceLast} days</strong> since your last order.
                                {orderFrequency && ` You typically order every ${orderFrequency} days.`}
                            </p>
                        </div>
                        {lastOrder && (
                            <button onClick={() => handleReorder(lastOrder)} className={styles.primaryActionBtn} style={{ marginTop: 0, whiteSpace: 'nowrap', flexShrink: 0 }}>
                                Reorder Now
                            </button>
                        )}
                    </div>
                )}

                {/* ── Profile & Order History ── */}
                <div className={styles.contentGrid}>
                    {/* ── Left Column ── */}
                    <div className={styles.sideColumn}>
                        <div className={styles.profileCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Account Profile</h2>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className={styles.editBtn}>Edit</button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={handleCancelEdit} className={styles.editBtn} style={{ color: 'var(--text-secondary)' }}>Cancel</button>
                                        <button onClick={handleSaveProfile} className={styles.saveBtn} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                                    </div>
                                )}
                            </div>
                            <div className={styles.profileAvatar}
                                style={(isEditing ? editAvatar : avatarUrl) ? { backgroundImage: `url(${isEditing ? editAvatar : avatarUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : undefined}>
                                {(isEditing ? editAvatar : avatarUrl) ? '' : initial}
                            </div>

                            {isEditing && (
                                <div className={styles.avatarPicker}>
                                    <p className={styles.infoLabel} style={{ marginBottom: '8px' }}>Choose your avatar</p>
                                    <div className={styles.avatarGrid}>
                                        {AVATAR_OPTIONS.map((src) => (
                                            <button key={src} type="button"
                                                className={`${styles.avatarOption} ${editAvatar === src ? styles.avatarOptionActive : ''}`}
                                                onClick={() => setEditAvatar(src)}>
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
                                        <input className={styles.editInput} value={editName} onChange={e => setEditName(e.target.value)} placeholder="Your name" />
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>Email Address</p>
                                        <p className={styles.infoValue} style={{ opacity: 0.6 }}>{email}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Primary Phone</label>
                                        <input className={styles.editInput} value={editPhone} onChange={e => setEditPhone(formatPhone(e.target.value))} placeholder="555-555-5555" />
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Saved Address</label>
                                        <input className={styles.editInput} value={editAddress} onChange={e => setEditAddress(e.target.value)} placeholder="123 Main St, City" />
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Birthday</label>
                                        <input type="date" className={styles.editInput} value={editBirthday} onChange={e => setEditBirthday(e.target.value)} />
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Preferred Pickup Time</label>
                                        <select className={styles.editInput} value={editPickupTime} onChange={e => setEditPickupTime(e.target.value)}>
                                            <option value="">No preference</option>
                                            <option value="10:00 AM">10:00 AM</option>
                                            <option value="11:00 AM">11:00 AM</option>
                                            <option value="12:00 PM">12:00 PM (Noon)</option>
                                            <option value="1:00 PM">1:00 PM</option>
                                            <option value="2:00 PM">2:00 PM</option>
                                            <option value="3:00 PM">3:00 PM</option>
                                            <option value="4:00 PM">4:00 PM</option>
                                            <option value="5:00 PM">5:00 PM</option>
                                        </select>
                                    </div>
                                    <div className={styles.infoItem} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <label className={styles.infoLabel} style={{ margin: 0 }}>Weekly Specials Emails</label>
                                        <button type="button" onClick={() => setEditNewsletter(!editNewsletter)}
                                            style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: editNewsletter ? 'var(--red)' : '#444', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                                            <span style={{ position: 'absolute', top: '2px', left: editNewsletter ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block' }} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 style={{ fontSize: '22px', marginBottom: '4px', fontWeight: 600 }}>{displayName}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                                        Member since {initialOrders.length > 0 ? formatDateShort(initialOrders[initialOrders.length - 1].createdAt) : '2024'}
                                    </p>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>Email Address</p>
                                        <p className={styles.infoValue}>{email}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>Primary Phone</p>
                                        <p className={styles.infoValue}>{displayPhone ? formatPhone(displayPhone) : 'Not provided'}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>Saved Address</p>
                                        <p className={styles.infoValue}>{displayAddress || 'No address saved'}</p>
                                    </div>
                                    {displayBirthday && (
                                        <div className={styles.infoItem}>
                                            <p className={styles.infoLabel}>Birthday</p>
                                            <p className={styles.infoValue}>{new Date(displayBirthday + 'T00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} 🎂</p>
                                        </div>
                                    )}
                                    {displayPickupTime && (
                                        <div className={styles.infoItem}>
                                            <p className={styles.infoLabel}>Preferred Pickup</p>
                                            <p className={styles.infoValue}>⏱ {displayPickupTime}</p>
                                        </div>
                                    )}
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>Weekly Specials</p>
                                        <p className={styles.infoValue}>{displayNewsletter ? '✅ Subscribed' : '○ Not subscribed'}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ── Your Signature Cut ── */}
                        {initialOrders.length > 0 && (
                            <div className={styles.statCard} style={{ marginTop: '16px' }}>
                                <span className={styles.statLabel}>Your Signature Cut</span>
                                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: '8px 0 4px', fontFamily: 'var(--font-heading)', letterSpacing: '0.02em' }}>
                                    {favoriteItem}
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    Ordered {maxQty}× across all visits
                                </p>
                                {favoriteItemData && (
                                    <button onClick={handleAddFavoriteToCart} className={styles.primaryActionBtn} style={{ width: '100%', marginTop: 0 }}>
                                        🛒 Add to Cart
                                    </button>
                                )}
                            </div>
                        )}

                        {/* ── Gift Card ── */}
                        <div className={styles.giftCardCard} style={{ marginTop: '16px' }}>
                            <span className={styles.statLabel} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>Share the Tradition</span>
                            <div style={{ margin: '8px 0' }}>
                                <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>Hofherr Gift Cards</h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5' }}>Give the gift of premium cuts to friends and family.</p>
                            </div>
                            <a href="https://www.giftly.com/gift-card/hofherr-meat-northfield" target="_blank" rel="noopener noreferrer"
                                className={styles.giftCardBtn} style={{ marginTop: 'auto', textAlign: 'center', width: '100%', display: 'block' }}>
                                Send a Giftly Card
                            </a>
                        </div>
                    </div>

                    {/* ── Right Column ── */}
                    <div className={styles.mainColumn}>
                        {/* Quick Reorder */}
                        {lastOrder && (
                            <div className={styles.statCard} style={{ position: 'relative', background: '#fff', marginBottom: '24px', border: '1px solid #181818', paddingTop: '28px' }}>
                                <StoreBadge storeId={lastOrder.metadata?.store_id} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <div>
                                        <span className={styles.statLabel} style={{ color: '#888' }}>Quick Reorder</span>
                                        <h3 style={{ margin: '8px 0', fontSize: '24px', color: '#1a1a1a' }}>Your Last Purchase</h3>
                                        <p style={{ color: '#666', fontSize: '14px' }}>Order #{lastOrder.orderNumber} • {formatDate(lastOrder.createdAt)}</p>
                                    </div>
                                    <button onClick={() => handleReorder(lastOrder)} className={styles.primaryActionBtn} style={{ marginTop: 0 }}>
                                        Repurchase Now
                                    </button>
                                </div>
                                <div className={styles.orderItems} style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', width: '100%' }}>
                                    {lastOrder.items.map((item: any, i: number) => (
                                        <span key={i} className={styles.orderItemBadge} style={{ color: '#333', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                            {item.qty || item.quantity || 1}x {item.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Order History header + filter */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Order History ({initialOrders.length})</h2>
                            {initialOrders.length > 0 && (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {(['all', 'butcher', 'depot'] as const).map(f => (
                                        <button key={f} onClick={() => setStoreFilter(f)} style={{
                                            padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                                            border: '1px solid #181818', cursor: 'pointer',
                                            background: storeFilter === f ? 'var(--red)' : 'transparent',
                                            color: storeFilter === f ? '#fff' : 'var(--text-muted)',
                                            transition: 'all 0.15s ease', textTransform: 'uppercase', letterSpacing: '0.05em',
                                        }}>
                                            {f === 'all' ? 'All' : f === 'butcher' ? '🥩 Butcher' : '🏪 Depot'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.orderList}>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => {
                                    const isCopied = copiedOrderId === order.orderNumber;
                                    return (
                                        <div key={order._id} className={styles.orderCard} style={{ position: 'relative', paddingTop: '28px' }}>
                                            <StoreBadge storeId={order.metadata?.store_id} />
                                            <div className={styles.orderHeader}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                    <span className={styles.orderId}>Order #{order.orderNumber}</span>
                                                    <button onClick={() => handleCopyOrderId(order.orderNumber)} title="Copy order #"
                                                        style={{ background: 'none', border: '1px solid #333', color: isCopied ? 'var(--red)' : 'var(--text-muted)', borderRadius: '4px', padding: '2px 7px', fontSize: '11px', cursor: 'pointer', transition: 'all 0.15s', fontWeight: 600 }}>
                                                        {isCopied ? '✓ Copied!' : '⎘ Copy'}
                                                    </button>
                                                </div>
                                                <span className={`${styles.orderStatusPill} ${styles['status_' + (order.status || 'pending').toLowerCase().replace('-', '_')]}`}>
                                                    {order.status || 'Processing'}
                                                </span>
                                            </div>
                                            <div className={styles.orderBody}>
                                                <div className={styles.orderItems}>
                                                    {(order.items || []).map((item: any, i: number) => (
                                                        <span key={i} className={styles.orderItemBadge}>{item.qty || item.quantity || 1}x {item.name}</span>
                                                    ))}
                                                </div>
                                                <p className={styles.orderDate}>{formatDate(order.createdAt)}</p>
                                                {order.metadata?.pickup && (
                                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pickup: </span>
                                                        <strong style={{ color: 'var(--text)' }}>{order.metadata.pickup}</strong>
                                                    </p>
                                                )}
                                                {(order.items || []).some((i: any) => i.note) && (
                                                    <div style={{ marginTop: '8px' }}>
                                                        {(order.items || []).filter((i: any) => i.note).map((item: any, i: number) => (
                                                            <p key={i} style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0' }}>
                                                                <strong>{item.name}:</strong> {item.note}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.orderFooter}>
                                                <span className={styles.orderTotal}>${((order.total || 0) / 100).toFixed(2)}</span>
                                                <button onClick={() => handleReorder(order)} className={styles.reorderBtn}>
                                                    Repurchase & Edit
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', border: '1px solid #181818', borderRadius: '12px' }}>
                                    {storeFilter === 'all' ? 'Your culinary journey begins with your first order.' : `No orders from ${storeFilter === 'butcher' ? 'the Butcher Shop' : 'The Depot'} yet.`}
                                    {storeFilter === 'all' && (
                                        <div style={{ marginTop: '16px' }}>
                                            <button onClick={() => router.push('/online-orders')} className={styles.primaryActionBtn}>Shop the Collection</button>
                                        </div>
                                    )}
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
                                    {special.badge && <span className={styles.specialBadge} data-badge={special.badge}>{special.badge.replace('-', ' ').toUpperCase()}</span>}
                                    {special.image && <div className={styles.specialImageWrap}><img src={special.image} alt={special.title} className={styles.specialImage} /></div>}
                                    <div className={styles.specialContent}>
                                        <h3 className={styles.specialTitle}>{special.title}</h3>
                                        {special.description && <p className={styles.specialDesc}>{special.description}</p>}
                                        <div className={styles.specialPricing}>
                                            {special.regularPrice && <span className={styles.specialRegular}>{special.regularPrice}</span>}
                                            <span className={styles.specialSale}>{special.salePrice}</span>
                                        </div>
                                        {special.savings && <span className={styles.specialSavings}>{special.savings}</span>}
                                        <button onClick={() => router.push('/online-orders')} className={styles.primaryActionBtn} style={{ width: '100%', marginTop: '12px' }}>Shop Now</button>
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
