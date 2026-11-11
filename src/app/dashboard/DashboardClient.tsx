'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import styles from './dashboard.module.css';
import { usePageTransition } from '@/components/PageTransition';
import CutCollector from '@/components/dashboard/CutCollector';

type TrackerStatus =
    | 'pending'
    | 'paid'
    | 'processing'
    | 'ready_paid'
    | 'ready_pending'
    | 'completed'
    | 'cancelled';

type TrackerStoreId = 'butcher' | 'depot';

const TRACKER_STATUS_OPTIONS: { value: TrackerStatus; label: string }[] = [
    { value: 'pending', label: 'Pending (pay at pickup)' },
    { value: 'paid', label: 'Order Placed (preparing)' },
    { value: 'processing', label: 'Cutting (On the Block)' },
    { value: 'ready_paid', label: 'Ready for Pickup' },
    { value: 'ready_pending', label: 'Ready (pickup counter)' },
    { value: 'completed', label: 'Picked Up (Completed)' },
    { value: 'cancelled', label: 'Cancelled' },
];

const TRACKER_STAGES = [
    {
        key: 'placed',
        short: 'Placed',
        title: 'Order Placed',
        statuses: ['pending', 'paid'],
        etaText: '~25 mins · 2:28 PM',
        defaultStatus: 'paid' as TrackerStatus,
    },
    {
        key: 'prep',
        short: 'Cutting',
        title: 'On the Block',
        statuses: ['processing'],
        etaText: '~12 mins · 2:15 PM',
        defaultStatus: 'processing' as TrackerStatus,
    },
    {
        key: 'ready',
        short: 'Ready',
        title: 'Ready for Pickup',
        statuses: ['ready_paid', 'ready_pending'],
        etaText: 'Ready now',
        defaultStatus: 'ready_paid' as TrackerStatus,
    },
    {
        key: 'done',
        short: 'Picked Up',
        title: 'Picked Up',
        statuses: ['completed'],
        etaText: 'Complete',
        defaultStatus: 'completed' as TrackerStatus,
    },
] as const;

const TRACKER_DEMO_SEQUENCE: TrackerStatus[] = ['paid', 'processing', 'ready_paid', 'completed'];

const TRACKER_STORES: Record<TrackerStoreId, { name: string; address: string; mapsUrl: string }> = {
    butcher: {
        name: 'The Butcher Shop',
        address: '300 Happ Rd, Northfield, IL 60093',
        mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=300+Happ+Rd,+Northfield,+IL+60093',
    },
    depot: {
        name: 'The Depot',
        address: '754 Elm St, Winnetka, IL 60093',
        mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=754+Elm+St,+Winnetka,+IL+60093',
    },
};

const FAKE_ACTIVE_ORDER_ITEMS = [
    { name: 'USDA Prime Dry-Aged Bone-In Ribeye (16 oz)', qty: 2, note: 'Cut 1.75" thick, extra marbled' },
    { name: 'House-Smoked Applewood Slab Bacon (1.5 lb)', qty: 1, note: 'Thick cut' },
    { name: 'Fresh Hot Italian Sausage (1 lb)', qty: 2 },
];

function getTrackerStageIndex(status: TrackerStatus): number {
    return TRACKER_STAGES.findIndex(s => (s.statuses as readonly string[]).includes(status));
}

function getTrackerStageMessage(status: TrackerStatus, storeName: string): string {
    switch (status) {
        case 'pending':
            return 'We have your ticket. A butcher will start on it shortly — see you at pickup.';
        case 'paid':
            return 'Order confirmed and your ticket is in the queue. A master butcher will start trimming shortly.';
        case 'processing':
            return 'Your order is on the block — being custom-cut, trimmed, and wrapped in butcher paper to order.';
        case 'ready_paid':
            return `Wrapped and waiting for you at ${storeName}. Just give your name at the counter.`;
        case 'ready_pending':
            return `Wrapped and waiting for you at ${storeName}. Ready at the pickup counter.`;
        case 'completed':
            return 'Picked up. Thanks for shopping with Hofherr Meat Co. — enjoy!';
        case 'cancelled':
            return 'This order was cancelled. Call the shop if you need assistance.';
    }
}

interface OrderItemData {
    name: string;
    price?: number | string;
    qty?: number;
    quantity?: number;
    note?: string;
    desc?: string;
}

interface OrderData {
    _id: string;
    orderNumber: string;
    status?: string;
    total?: number;
    createdAt: string;
    metadata?: {
        store_id?: string;
        pickup?: string;
    };
    items: OrderItemData[];
}

interface SpecialData {
    _id: string;
    badge?: string;
    image?: string;
    title: string;
    description?: string;
    regularPrice?: string;
    salePrice?: string;
    savings?: string;
}

interface PreviousPurchaseItem {
    name: string;
    priceCents: number;
    priceFormatted: string;
    totalQty: number;
    lastOrderedAt: string;
    storeId: 'butcher' | 'depot';
    desc: string;
}

const CART_KEYS = {
    butcher: 'hofherr_cart_butcher',
    depot: 'hofherr_cart_depot',
    default: 'hofherr_cart',
} as const;

function writeStorage(key: string, value: unknown) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore storage quota errors
    }
}

function formatPhone(val: string) {
    const d = (val || '').replace(/\D/g, '');
    if (d.length < 4) return d;
    if (d.length < 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

function parsePriceToCents(price: number | string | undefined): number {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
        const cleaned = parseFloat(price.replace(/[^0-9.]/g, ''));
        return Number.isNaN(cleaned) ? 0 : Math.round(cleaned * 100);
    }
    return 0;
}

function formatCents(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
}

function StoreBadge({ storeId }: { storeId?: string }) {
    if (!storeId) return null;
    const isDepot = storeId === 'depot';
    return (
        <span
            className={`${styles.storeBadgeFloating} ${
                isDepot ? styles.storeTagDepot : styles.storeTagButcher
            }`}
        >
            {isDepot ? '🏪 The Depot' : '🥩 Butcher Shop'}
        </span>
    );
}

const AVATAR_OPTIONS = [
    '/assets/avatars/avatar-angus-bull.jpg',
    '/assets/avatars/avatar-berkshire-boar.jpg',
    '/assets/avatars/avatar-suffolk-ram.jpg',
    '/assets/avatars/avatar-heritage-rooster.jpg',
    '/assets/avatars/avatar-mallard-drake.jpg',
    '/assets/avatars/avatar-bronze-turkey.jpg',
    '/assets/avatars/avatar-red-stag.jpg',
    '/assets/avatars/avatar-alpine-goat.jpg',
    '/avatars/avator-cow.png',
    '/avatars/avator-pig.png',
    '/avatars/avator-chickin.png',
    '/avatars/avator-sheep.png',
];

const INITIAL_NOW_MS = Date.now();

export default function DashboardClient({
    userName,
    username = '',
    email,
    phone,
    address,
    initial,
    initialOrders,
    specials = [],
    avatar = '',
    birthday = '',
    newsletter = false,
    preferredPickupTime = '',
    bio = '',
    favoriteCut = '',
    memberSince = '2024',
}: {
    userName: string;
    username?: string;
    email: string;
    phone: string;
    address: string;
    initial: string;
    initialOrders: OrderData[];
    specials?: SpecialData[];
    avatar?: string;
    birthday?: string;
    newsletter?: boolean;
    preferredPickupTime?: string;
    bio?: string;
    favoriteCut?: string;
    memberSince?: string;
}) {
    const { navigateTo } = usePageTransition();
    const { data: sessionData, update: updateSession } = useSession();
    const isAdmin = Boolean(sessionData?.user?.isAdmin);
    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    // ── Profile state ──
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [editName, setEditName] = useState(userName);
    const [editUsername, setEditUsername] = useState(username || '');
    const [displayUsername, setDisplayUsername] = useState(username || '');
    const [editBio, setEditBio] = useState(bio || '');
    const [displayBio, setDisplayBio] = useState(bio || '');
    const [editFavoriteCut, setEditFavoriteCut] = useState(favoriteCut || '');
    const [displayFavoriteCut, setDisplayFavoriteCut] = useState(favoriteCut || '');
    const [copiedProfileLink, setCopiedProfileLink] = useState(false);
    const [editPhone, setEditPhone] = useState(() => formatPhone(phone));
    const [editAddress, setEditAddress] = useState(address);
    const [editBirthday, setEditBirthday] = useState(birthday);
    const [editNewsletter, setEditNewsletter] = useState(newsletter);
    const [editPickupTime, setEditPickupTime] = useState(preferredPickupTime);
    const [displayName, setDisplayName] = useState(userName);
    const [displayPhone, setDisplayPhone] = useState(() => formatPhone(phone));
    const [displayAddress, setDisplayAddress] = useState(address);
    const [displayBirthday, setDisplayBirthday] = useState(birthday);
    const [displayNewsletter, setDisplayNewsletter] = useState(newsletter);
    const [displayPickupTime, setDisplayPickupTime] = useState(preferredPickupTime);
    const [avatarUrl, setAvatarUrl] = useState(avatar);
    const [editAvatar, setEditAvatar] = useState(avatar);
    const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

    useEffect(() => {
        try {
            const savedAvatar = window.localStorage.getItem('hofherr_user_avatar_v1');
            if (savedAvatar) {
                setAvatarUrl(savedAvatar);
                setEditAvatar(savedAvatar);
                window.dispatchEvent(
                    new CustomEvent('avatar-updated', { detail: { avatar: savedAvatar } })
                );
            } else if (avatar) {
                window.localStorage.setItem('hofherr_user_avatar_v1', avatar);
                window.dispatchEvent(
                    new CustomEvent('avatar-updated', { detail: { avatar } })
                );
            }
        } catch {
            // ignore storage errors
        }
    }, [avatar]);

    // ── Interaction state ──
    const [storeFilter, setStoreFilter] = useState<'all' | 'butcher' | 'depot'>('all');
    const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

    // ── Live Order Tracker (Test Order #HM-4892) ──
    const [trackerStatus, setTrackerStatus] = useState<TrackerStatus>('processing');
    const [trackerStore, setTrackerStore] = useState<TrackerStoreId>('butcher');
    const [trackerAutoPlay, setTrackerAutoPlay] = useState(false);

    useEffect(() => {
        if (!trackerAutoPlay) return;
        const idx = TRACKER_DEMO_SEQUENCE.indexOf(trackerStatus);
        const nextStatus = idx >= 0 ? TRACKER_DEMO_SEQUENCE[idx + 1] : undefined;
        if (!nextStatus) {
            const stopId = window.setTimeout(() => setTrackerAutoPlay(false), 0);
            return () => window.clearTimeout(stopId);
        }
        const timerId = window.setTimeout(() => {
            setTrackerStatus(nextStatus);
        }, 3000);
        return () => window.clearTimeout(timerId);
    }, [trackerAutoPlay, trackerStatus]);

    const trackerCancelled = trackerStatus === 'cancelled';
    const trackerActiveIndex = getTrackerStageIndex(trackerStatus);
    const trackerActiveStage = trackerActiveIndex >= 0 ? TRACKER_STAGES[trackerActiveIndex] : null;
    const trackerStoreInfo = TRACKER_STORES[trackerStore];
    const trackerEtaLabel =
        trackerCancelled || trackerActiveStage?.key === 'ready' || trackerActiveStage?.key === 'done'
            ? 'Status'
            : 'Estimated ready time';
    const trackerEtaValue = trackerCancelled
        ? 'Cancelled'
        : trackerActiveStage?.etaText || '—';

    const handleStartTrackerDemo = () => {
        setTrackerStatus(TRACKER_DEMO_SEQUENCE[0]);
        setTrackerAutoPlay(true);
    };

    // ── Computed stats & Previous Purchases catalog ──
    const totalCutsOrdered = initialOrders.reduce(
        (acc, o) => acc + (o.items || []).reduce((sum, i) => sum + (i.qty || i.quantity || 1), 0),
        0
    );

    const storeCounts = { butcher: 0, depot: 0 };
    initialOrders.forEach(o => {
        if (o.metadata?.store_id === 'depot') storeCounts.depot++;
        else storeCounts.butcher++;
    });
    const favoriteStore = storeCounts.depot > storeCounts.butcher ? 'depot' : 'butcher';

    const previousPurchases = useMemo<PreviousPurchaseItem[]>(() => {
        const map = new Map<string, PreviousPurchaseItem>();
        for (const order of initialOrders) {
            const storeId: 'butcher' | 'depot' =
                order.metadata?.store_id === 'depot' ? 'depot' : 'butcher';
            for (const item of order.items || []) {
                const qty = item.qty || item.quantity || 1;
                const priceCents = parsePriceToCents(item.price);
                const existing = map.get(item.name);
                if (existing) {
                    existing.totalQty += qty;
                    if (new Date(order.createdAt).getTime() > new Date(existing.lastOrderedAt).getTime()) {
                        existing.lastOrderedAt = order.createdAt;
                    }
                } else {
                    map.set(item.name, {
                        name: item.name,
                        priceCents,
                        priceFormatted: formatCents(priceCents),
                        totalQty: qty,
                        lastOrderedAt: order.createdAt,
                        storeId,
                        desc: item.desc || '',
                    });
                }
            }
        }
        return Array.from(map.values()).sort((a, b) => b.totalQty - a.totalQty);
    }, [initialOrders]);

    const signatureCut = previousPurchases[0] || null;
    const lastOrder = initialOrders[0] || null;
    const daysSinceLast = lastOrder
        ? Math.floor((INITIAL_NOW_MS - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : null;

    let orderFrequency: number | null = null;
    if (initialOrders.length >= 2) {
        const sorted = [...initialOrders].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        const gaps = sorted
            .slice(1)
            .map((o, i) =>
                Math.floor(
                    (new Date(o.createdAt).getTime() - new Date(sorted[i].createdAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                )
            );
        orderFrequency = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
    }

    const filteredOrders = useMemo(
        () =>
            storeFilter === 'all'
                ? initialOrders
                : initialOrders.filter(o => o.metadata?.store_id === storeFilter),
        [initialOrders, storeFilter]
    );

    // ── Handlers ──
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const iso = d.toISOString();
        return `${iso.slice(0, 10)} at ${iso.slice(11, 16)} UTC`;
    };
    const formatDateShort = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toISOString().slice(0, 10);
    };

    const handleCopyOrderId = (orderNumber: string) => {
        navigator.clipboard.writeText(orderNumber).catch(() => {});
        setCopiedOrderId(orderNumber);
        setTimeout(() => setCopiedOrderId(null), 2000);
    };

    const handleReorder = (order: OrderData) => {
        const cartItems = (order.items || []).map(item => ({
            name: item.name,
            price: formatCents(parsePriceToCents(item.price)),
            qty: item.qty || item.quantity || 1,
            note: item.note || '',
            desc: item.desc || '',
        }));
        const storeId = order.metadata?.store_id;
        if (storeId === 'butcher') writeStorage(CART_KEYS.butcher, cartItems);
        else if (storeId === 'depot') writeStorage(CART_KEYS.depot, cartItems);
        writeStorage(CART_KEYS.default, cartItems);
        navigateTo(`/online-orders?cart=open${storeId ? `&store=${storeId}` : ''}`);
    };

    const handleBuySingleItemAgain = (
        item: { name: string; price?: number | string; desc?: string; note?: string },
        storeId: 'butcher' | 'depot' = favoriteStore
    ) => {
        const cartItem = {
            name: item.name,
            price: formatCents(parsePriceToCents(item.price)),
            qty: 1,
            note: item.note || '',
            desc: item.desc || '',
        };
        const targetKey = storeId === 'depot' ? CART_KEYS.depot : CART_KEYS.butcher;
        writeStorage(targetKey, [cartItem]);
        writeStorage(CART_KEYS.default, [cartItem]);
        navigateTo(`/online-orders?cart=open&store=${storeId}`);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setSaveMessage('');
        try {
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editName,
                    username: editUsername,
                    bio: editBio,
                    favoriteCut: editFavoriteCut,
                    phone: editPhone,
                    address: editAddress,
                    avatar: editAvatar,
                    birthday: editBirthday,
                    newsletter: editNewsletter,
                    preferredPickupTime: editPickupTime,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setDisplayName(editName);
                if (data.updated?.username) {
                    setDisplayUsername(data.updated.username);
                    setEditUsername(data.updated.username);
                }
                setDisplayBio(editBio);
                setDisplayFavoriteCut(editFavoriteCut);
                setDisplayPhone(editPhone);
                setDisplayAddress(editAddress);
                setAvatarUrl(editAvatar);
                setDisplayBirthday(editBirthday);
                setDisplayNewsletter(editNewsletter);
                setDisplayPickupTime(editPickupTime);
                await updateSession({ user: { name: editName, phone: editPhone, avatar: editAvatar } });
                window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { avatar: editAvatar } }));
                setIsEditing(false);
                setSaveMessage('Profile saved successfully');
                setTimeout(() => setSaveMessage(''), 3000);
            } else {
                setSaveMessage(data.error || 'Failed to save profile. Please try again.');
            }
        } catch {
            setSaveMessage('Something went wrong while saving.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleNewsletterDirect = async () => {
        const nextVal = !displayNewsletter;
        setDisplayNewsletter(nextVal);
        setEditNewsletter(nextVal);
        try {
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newsletter: nextVal }),
            });
            if (!res.ok) {
                console.error('Failed to update newsletter preference');
            }
        } catch {
            // Keep optimistic state in demo mode
        }
    };

    const handleCancelEdit = () => {
        setEditName(displayName);
        setEditUsername(displayUsername);
        setEditBio(displayBio);
        setEditFavoriteCut(displayFavoriteCut);
        setEditPhone(displayPhone);
        setEditAddress(displayAddress);
        setEditAvatar(avatarUrl);
        setEditBirthday(displayBirthday);
        setEditNewsletter(displayNewsletter);
        setEditPickupTime(displayPickupTime);
        setSaveMessage('');
        setIsEditing(false);
    };

    const activeAvatar = isEditing ? editAvatar : avatarUrl;
    const avatarStyle = activeAvatar
        ? ({ '--avatar-url': `url(${activeAvatar})` } as React.CSSProperties)
        : undefined;

    return (
        <div className={styles.dashboardContainer}>
            <main className={`container ${styles.mainCanvas}`}>
                {/* ── Cut Collection Gamified Butcher Chart ── */}
                <CutCollector
                    orders={initialOrders}
                    userName={displayName}
                    isAuthenticated={true}
                />

                {/* ── Profile & Order History ── */}
                <div className={styles.contentGrid}>
                    {/* ── Left Column ── */}
                    <div className={styles.sideColumn}>
                        {/* ── Profile Hero Card ── */}
                        <div className={styles.dashProfileCard}>
                            <div className={styles.dashAvatarFrame}>
                                {activeAvatar ? (
                                    <img
                                        src={activeAvatar}
                                        alt={displayName}
                                        className={styles.dashAvatarImg}
                                    />
                                ) : (
                                    <div className={styles.dashAvatarFallback}>{initial}</div>
                                )}
                                <button
                                    type="button"
                                    className={styles.dashAvatarEditBtn}
                                    aria-expanded={isAvatarPickerOpen}
                                    aria-label={isAvatarPickerOpen ? 'Close avatar picker' : 'Change avatar'}
                                    title={isAvatarPickerOpen ? 'Close avatar picker' : 'Change avatar'}
                                    onClick={() => setIsAvatarPickerOpen(prev => !prev)}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                    </svg>
                                </button>
                            </div>

                            {isAvatarPickerOpen && (
                                <div className={styles.avatarPicker}>
                                    <p className={`${styles.infoLabel} ${styles.avatarPickerLabel}`}>
                                        Choose your butcher avatar
                                    </p>
                                    <div className={styles.avatarGrid}>
                                        {AVATAR_OPTIONS.map(src => (
                                            <button
                                                key={src}
                                                type="button"
                                                className={`${styles.avatarOption} ${activeAvatar === src ? styles.avatarOptionActive : ''}`}
                                                onClick={() => {
                                                    setEditAvatar(src);
                                                    setAvatarUrl(src);
                                                    try {
                                                        window.localStorage.setItem('hofherr_user_avatar_v1', src);
                                                    } catch {}
                                                    window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { avatar: src } }));
                                                    updateSession({ user: { avatar: src } }).catch(() => {});
                                                    fetch('/api/profile', {
                                                        method: 'PATCH',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ avatar: src }),
                                                    }).catch(() => {});
                                                }}
                                            >
                                                <img src={src} alt="" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <h1 className={styles.dashProfileName}>{displayName}</h1>

                            <div className={styles.dashHandleRow}>
                                <span className={styles.dashHandleBadge}>@{displayUsername}</span>
                                <span className={styles.dashGuildBadge}>🥩 Guild Member</span>
                                {isAdmin && <span className={styles.dashAdminBadge}>👑 Master Admin</span>}
                            </div>

                            <p className={styles.dashMemberSinceText}>
                                Hofherr Meat Co. Member Since {memberSince}
                            </p>

                            <div className={styles.dashActionRow}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const url = `${window.location.origin}/dashboard/${displayUsername}`;
                                        navigator.clipboard.writeText(url);
                                        setCopiedProfileLink(true);
                                        setTimeout(() => setCopiedProfileLink(false), 2500);
                                    }}
                                    className={styles.dashShareBtn}
                                >
                                    {copiedProfileLink ? '✓ Link Copied!' : 'Share Profile'}
                                </button>

                                {!isEditing ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className={styles.dashEditBtn}
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className={styles.dashCancelBtn}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSaveProfile}
                                            className={styles.dashSaveBtn}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? 'Saving…' : 'Save Changes'}
                                        </button>
                                    </>
                                )}

                                {isAdmin && (
                                    <button
                                        type="button"
                                        onClick={() => navigateTo('/admin')}
                                        className={styles.dashAdminLinkBtn}
                                    >
                                        ⚡ Admin Console
                                    </button>
                                )}

                                <button type="button" onClick={handleLogout} className={styles.dashLogoutBtn}>
                                    Sign Out
                                </button>
                            </div>

                            {saveMessage && <p className={styles.statTrend}>{saveMessage}</p>}
                        </div>

                        {/* ── Contact & Delivery Details Card ── */}
                        <div className={styles.profileCard}>
                            <div className={styles.profileHeaderRow}>
                                <h2 className={styles.contactDetailsTitle}>
                                    CONTACT &amp; DELIVERY DETAILS
                                </h2>
                            </div>

                            {saveMessage && <p className={styles.statTrend}>{saveMessage}</p>}

                            {isEditing ? (
                                <>
                                    <div className={styles.infoItem}>
                                        <label htmlFor="dash-edit-name" className={styles.infoLabel}>
                                            Full Name
                                        </label>
                                        <input
                                            id="dash-edit-name"
                                            className={styles.editInput}
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label htmlFor="dash-edit-username" className={styles.infoLabel}>
                                            Public Username / Handle
                                        </label>
                                        <div className={styles.usernameInputWrap}>
                                            <span className={styles.usernamePrefix}>@</span>
                                            <input
                                                id="dash-edit-username"
                                                className={`${styles.editInput} ${styles.usernameInput}`}
                                                value={editUsername}
                                                onChange={e => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                                                placeholder="yourhandle"
                                                maxLength={30}
                                            />
                                        </div>
                                        <span className={styles.fieldHelpText}>
                                            Your profile link: /dashboard/{editUsername || 'yourhandle'}
                                        </span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label htmlFor="dash-edit-favcut" className={styles.infoLabel}>
                                            Favorite Butcher Cut
                                        </label>
                                        <input
                                            id="dash-edit-favcut"
                                            className={styles.editInput}
                                            value={editFavoriteCut}
                                            onChange={e => setEditFavoriteCut(e.target.value)}
                                            placeholder="e.g. USDA Prime Dry-Aged Ribeye"
                                        />
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label htmlFor="dash-edit-bio" className={styles.infoLabel}>
                                            Butcher Bio / Cooking Style
                                        </label>
                                        <textarea
                                            id="dash-edit-bio"
                                            className={styles.editTextarea}
                                            value={editBio}
                                            onChange={e => setEditBio(e.target.value)}
                                            placeholder="Share your favorite cuts or smoking style..."
                                            rows={2}
                                            maxLength={250}
                                        />
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>Email Address</p>
                                        <p className={`${styles.infoValue} ${styles.mutedEmailValue}`}>
                                            {email}
                                        </p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label htmlFor="dash-edit-phone" className={styles.infoLabel}>
                                            Primary Phone
                                        </label>
                                        <input
                                            id="dash-edit-phone"
                                            className={styles.editInput}
                                            value={editPhone}
                                            onChange={e => setEditPhone(formatPhone(e.target.value))}
                                            placeholder="555-555-5555"
                                        />
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label htmlFor="dash-edit-address" className={styles.infoLabel}>
                                            Saved Address
                                        </label>
                                        <input
                                            id="dash-edit-address"
                                            className={styles.editInput}
                                            value={editAddress}
                                            onChange={e => setEditAddress(e.target.value)}
                                            placeholder="123 Main St, City"
                                        />
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label htmlFor="dash-edit-birthday" className={styles.infoLabel}>
                                            Birthday
                                        </label>
                                        <input
                                            id="dash-edit-birthday"
                                            type="date"
                                            className={styles.editInput}
                                            value={editBirthday}
                                            onChange={e => setEditBirthday(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label htmlFor="dash-edit-pickup" className={styles.infoLabel}>
                                            Preferred Pickup Time
                                        </label>
                                        <select
                                            id="dash-edit-pickup"
                                            className={styles.editInput}
                                            value={editPickupTime}
                                            onChange={e => setEditPickupTime(e.target.value)}
                                        >
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
                                    <div className={`${styles.infoItem} ${styles.newsletterRow}`}>
                                        <label className={`${styles.infoLabel} ${styles.noMarginTitle}`}>
                                            Weekly Specials Emails
                                        </label>
                                        <button
                                            type="button"
                                            aria-label="Toggle Weekly Specials Emails"
                                            onClick={() => setEditNewsletter(!editNewsletter)}
                                            className={`${styles.toggleSwitch} ${
                                                editNewsletter ? styles.toggleSwitchActive : ''
                                            }`}
                                        >
                                            <span
                                                className={`${styles.toggleKnob} ${
                                                    editNewsletter ? styles.toggleKnobActive : ''
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className={styles.profileNameHeading}>{displayName}</h3>
                                    {displayUsername && (
                                        <div className={styles.profileHandleRow}>
                                            <span className={styles.profileHandleBadge}>@{displayUsername}</span>
                                            <a
                                                href={`/dashboard/${displayUsername}`}
                                                className={styles.publicProfileLink}
                                                title="Open your guild dashboard profile"
                                            >
                                                Guild Dashboard ↗
                                            </a>
                                            <button
                                                type="button"
                                                className={styles.copyHandleBtn}
                                                onClick={() => {
                                                    const url = `${window.location.origin}/dashboard/${displayUsername}`;
                                                    navigator.clipboard.writeText(url);
                                                    setCopiedProfileLink(true);
                                                    setTimeout(() => setCopiedProfileLink(false), 2000);
                                                }}
                                                title="Copy shareable link to your guild dashboard"
                                            >
                                                {copiedProfileLink ? '✓ Copied' : 'Share Link'}
                                            </button>
                                        </div>
                                    )}
                                    <p className={styles.memberSinceSub}>
                                        Guild Member since{' '}
                                        {initialOrders.length > 0
                                            ? formatDateShort(initialOrders[initialOrders.length - 1].createdAt)
                                            : memberSince}
                                    </p>
                                    {displayFavoriteCut && (
                                        <div className={styles.infoItem}>
                                            <p className={styles.infoLabel}>Favorite Butcher Cut</p>
                                            <p className={styles.infoValue}>🥩 {displayFavoriteCut}</p>
                                        </div>
                                    )}
                                    {displayBio && (
                                        <div className={styles.infoItem}>
                                            <p className={styles.infoLabel}>Butcher Bio</p>
                                            <p className={styles.infoValue}>{displayBio}</p>
                                        </div>
                                    )}
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>Email Address</p>
                                        <p className={styles.infoValue}>{email}</p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>Primary Phone</p>
                                        <p className={styles.infoValue}>
                                            {displayPhone ? formatPhone(displayPhone) : 'Not provided'}
                                        </p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>Saved Address</p>
                                        <p className={styles.infoValue}>
                                            {displayAddress || 'No address saved'}
                                        </p>
                                    </div>
                                    {displayBirthday && (
                                        <div className={styles.infoItem}>
                                            <p className={styles.infoLabel}>Birthday</p>
                                            <p className={styles.infoValue}>{displayBirthday} 🎂</p>
                                        </div>
                                    )}
                                    {displayPickupTime && (
                                        <div className={styles.infoItem}>
                                            <p className={styles.infoLabel}>Preferred Pickup</p>
                                            <p className={styles.infoValue}>⏱ {displayPickupTime}</p>
                                        </div>
                                    )}
                                    <div className={styles.infoItem}>
                                        <div className={styles.newsletterLabelWithInfo}>
                                            <p className={`${styles.infoLabel} ${styles.noMarginTitle}`}>
                                                Weekly Specials
                                            </p>
                                            <span className={styles.infoTooltipWrap}>
                                                <button
                                                    type="button"
                                                    className={styles.infoIconBtn}
                                                    aria-label="What does subscribing to Weekly Specials mean?"
                                                >
                                                    i
                                                </button>
                                                <span role="tooltip" className={styles.infoTooltipPopup}>
                                                    <strong>What you get:</strong> Weekly butcher&apos;s
                                                    cut drops, dry-aged steak releases, weekend BBQ
                                                    smokehouse specials, and early holiday roast
                                                    reservations. No spam — unsubscribe anytime.
                                                </span>
                                            </span>
                                        </div>
                                        <div className={styles.newsletterStatusRow}>
                                            <span className={styles.infoValue}>
                                                {displayNewsletter ? '✅ Subscribed' : '○ Not subscribed'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={handleToggleNewsletterDirect}
                                                className={
                                                    displayNewsletter
                                                        ? styles.unsubscribeInlineBtn
                                                        : styles.subscribeInlineBtn
                                                }
                                            >
                                                {displayNewsletter ? 'Unsubscribe' : 'Subscribe'}
                                            </button>
                                        </div>
                                    </div>

                                    {initialOrders.length > 0 && (
                                        <div className={styles.statsBarGrid}>
                                            {[
                                                {
                                                    label: 'Total Orders',
                                                    value: String(initialOrders.length),
                                                    icon: '📦',
                                                },
                                                {
                                                    label: 'Cuts Ordered',
                                                    value: String(totalCutsOrdered),
                                                    icon: '🔪',
                                                },
                                                {
                                                    label: 'Fave Store',
                                                    value:
                                                        favoriteStore === 'depot'
                                                            ? 'The Depot'
                                                            : 'Butcher Shop',
                                                    icon: favoriteStore === 'depot' ? '🏪' : '🥩',
                                                },
                                                {
                                                    label: 'Preferred Pickup',
                                                    value: displayPickupTime || 'In-Store',
                                                    icon: '⏱',
                                                },
                                            ].map(stat => (
                                                <div
                                                    key={stat.label}
                                                    className={`${styles.statCard} ${styles.statBarItem}`}
                                                >
                                                    <div className={styles.statBarIcon}>{stat.icon}</div>
                                                    <div className={styles.statBarValue}>{stat.value}</div>
                                                    <div className={styles.statBarLabel}>{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* ── Your Signature Cut ── */}
                        {signatureCut && (
                            <div className={`${styles.statCard} ${styles.signatureCutCard}`}>
                                <span className={styles.statLabel}>Your Signature Cut</span>
                                <div className={styles.signatureCutName}>{signatureCut.name}</div>
                                <p className={styles.signatureCutSub}>
                                    Ordered {signatureCut.totalQty}× across all visits
                                </p>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleBuySingleItemAgain(
                                            {
                                                name: signatureCut.name,
                                                price: signatureCut.priceCents,
                                                desc: signatureCut.desc,
                                            },
                                            signatureCut.storeId
                                        )
                                    }
                                    className={`${styles.primaryActionBtn} ${styles.fullWidthActionBtn}`}
                                >
                                    🛒 Buy Signature Cut Again
                                </button>
                            </div>
                        )}

                        {/* ── Gift Card ── */}
                        <div className={`${styles.giftCardCard} ${styles.giftCardTopOffset}`}>
                            <span className={`${styles.statLabel} ${styles.giftCardLabel}`}>
                                Share the Tradition
                            </span>
                            <div className={styles.giftCardBody}>
                                <h3 className={styles.giftCardHeading}>Hofherr Gift Cards</h3>
                                <p className={styles.giftCardDesc}>
                                    Give the gift of premium cuts to friends and family.
                                </p>
                            </div>
                            <a
                                href="https://www.giftly.com/gift-card/hofherr-meat-northfield"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.giftCardBtn} ${styles.giftCardLinkBlock}`}
                            >
                                Send a Giftly Card
                            </a>
                        </div>
                    </div>

                    {/* ── Right Column ── */}
                    <div className={styles.mainColumn}>
                        {/* ── Restock Nudge ── */}
                        {daysSinceLast !== null && daysSinceLast >= 7 && (
                            <div className={`${styles.statCard} ${styles.restockBanner}`}>
                                <div>
                                    <span className={styles.restockTitle}>⏰ Time to Restock</span>
                                    <p className={styles.restockText}>
                                        It&apos;s been <strong>{daysSinceLast} days</strong> since your last order.
                                        {orderFrequency && ` You typically order every ${orderFrequency} days.`}
                                    </p>
                                </div>
                                {lastOrder && (
                                    <button
                                        type="button"
                                        onClick={() => handleReorder(lastOrder)}
                                        className={`${styles.primaryActionBtn} ${styles.noTopMarginBtn}`}
                                    >
                                        Reorder Now
                                    </button>
                                )}
                            </div>
                        )}

                        {/* ── Active Order Tracker (Test Mode) ── */}
                        <section
                            className={`${styles.liveTrackerCard} ${
                                trackerCancelled ? styles.liveTrackerCancelled : ''
                            }`}
                            aria-labelledby="live-tracker-heading"
                        >
                            <div className={styles.liveTrackerTop}>
                                <div>
                                    <div className={styles.liveTrackerKickerRow}>
                                        <span className={styles.liveTrackerPulseDot} aria-hidden="true" />
                                        <span className={styles.liveTrackerKicker}>
                                            {trackerCancelled
                                                ? 'Active Order #HM-4892 • Order Update'
                                                : `Active Order #HM-4892 • Step ${trackerActiveIndex + 1} of ${TRACKER_STAGES.length}`}
                                        </span>
                                    </div>
                                    <h2 id="live-tracker-heading" className={styles.liveTrackerStageTitle}>
                                        {trackerCancelled ? 'Order Cancelled' : trackerActiveStage?.title}
                                    </h2>
                                </div>
                                <div className={styles.liveTrackerEta}>
                                    <div className={styles.liveTrackerKicker}>{trackerEtaLabel}</div>
                                    <div className={styles.liveTrackerEtaValue}>{trackerEtaValue}</div>
                                </div>
                            </div>

                            <ol className={styles.liveTrackerBar} aria-label="Order tracking progress">
                                {TRACKER_STAGES.map((stage, i) => {
                                    const finished = trackerStatus === 'completed';
                                    const done = !trackerCancelled && (i < trackerActiveIndex || finished);
                                    const active =
                                        !trackerCancelled && !finished && i === trackerActiveIndex;
                                    const stateClass = done
                                        ? styles.liveSegDone
                                        : active
                                          ? styles.liveSegActive
                                          : styles.liveSegTodo;
                                    return (
                                        <li
                                            key={stage.key}
                                            className={styles.liveSegItem}
                                            aria-current={
                                                active || (finished && i === trackerActiveIndex)
                                                    ? 'step'
                                                    : undefined
                                            }
                                        >
                                            <button
                                                type="button"
                                                className={`${styles.liveSeg} ${stateClass}`}
                                                onClick={() => {
                                                    setTrackerAutoPlay(false);
                                                    setTrackerStatus(stage.defaultStatus);
                                                }}
                                            >
                                                <span className={styles.liveSegFill} aria-hidden="true" />
                                                <span className={styles.liveSegNum} aria-hidden="true">
                                                    {done ? '✓' : i + 1}
                                                </span>
                                                <span className={styles.liveSegLabel}>{stage.short}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ol>

                            <p className={styles.liveTrackerMessage} aria-live="polite">
                                {getTrackerStageMessage(trackerStatus, trackerStoreInfo.name)}
                            </p>

                            <div className={styles.liveTrackerDetails}>
                                <div>
                                    <div className={styles.liveTrackerKicker}>Pickup Location</div>
                                    <div className={styles.liveTrackerDetailMain}>
                                        {trackerStoreInfo.name}
                                    </div>
                                    <a
                                        className={styles.liveTrackerDetailLink}
                                        href={trackerStoreInfo.mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {trackerStoreInfo.address}
                                    </a>
                                </div>
                                <div>
                                    <div className={styles.liveTrackerKicker}>Order Items</div>
                                    <ul className={styles.liveTrackerItemsList}>
                                        {FAKE_ACTIVE_ORDER_ITEMS.map(item => (
                                            <li key={item.name}>
                                                <span className={styles.liveTrackerItemQty}>
                                                    {item.qty}×
                                                </span>{' '}
                                                {item.name}
                                                {item.note && (
                                                    <span className={styles.liveTrackerItemNote}>
                                                        {' '}
                                                        — {item.note}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* ── Test Controls ── */}
                            <div className={styles.liveTrackerControls}>
                                <div className={styles.liveTrackerControlsHeader}>
                                    <span className={styles.liveTrackerTestBadge}>Test Mode</span>
                                    <span className={styles.liveTrackerControlsSub}>
                                        Click any step above or use the controls below to test order progress
                                    </span>
                                </div>
                                <div className={styles.liveTrackerControlRow}>
                                    <label className={styles.liveTrackerField}>
                                        <span>Order Status</span>
                                        <select
                                            value={trackerStatus}
                                            onChange={e => {
                                                setTrackerAutoPlay(false);
                                                setTrackerStatus(e.target.value as TrackerStatus);
                                            }}
                                        >
                                            {TRACKER_STATUS_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className={styles.liveTrackerField}>
                                        <span>Pickup Location</span>
                                        <select
                                            value={trackerStore}
                                            onChange={e =>
                                                setTrackerStore(e.target.value as TrackerStoreId)
                                            }
                                        >
                                            <option value="butcher">The Butcher Shop (Northfield)</option>
                                            <option value="depot">The Depot (Winnetka)</option>
                                        </select>
                                    </label>
                                    <button
                                        type="button"
                                        className={styles.liveTrackerDemoBtn}
                                        onClick={
                                            trackerAutoPlay
                                                ? () => setTrackerAutoPlay(false)
                                                : handleStartTrackerDemo
                                        }
                                    >
                                        {trackerAutoPlay ? '■ Stop Demo' : '▶ Play Demo'}
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* ── Buy It Again: Previous Purchases Shelf ── */}
                        {previousPurchases.length > 0 && (
                            <section className={styles.buyAgainSection} aria-labelledby="buy-again-heading">
                                <div className={styles.buyAgainHeader}>
                                    <h2
                                        id="buy-again-heading"
                                        className={`${styles.sectionTitle} ${styles.noMarginTitle}`}
                                    >
                                        🥩 Buy It Again ({previousPurchases.length})
                                    </h2>
                                    <p className={styles.buyAgainSubtitle}>
                                        Your previously purchased cuts — add any item back to your cart in one click
                                    </p>
                                </div>
                                <div className={styles.buyAgainGrid}>
                                    {previousPurchases.map(item => (
                                        <div key={item.name} className={styles.buyAgainCard}>
                                            <div className={styles.buyAgainCardTop}>
                                                <div className={styles.buyAgainMetaRow}>
                                                    <span
                                                        className={`${styles.storeTag} ${
                                                            item.storeId === 'depot'
                                                                ? styles.storeTagDepot
                                                                : styles.storeTagButcher
                                                        }`}
                                                    >
                                                        {item.storeId === 'depot'
                                                            ? '🏪 The Depot'
                                                            : '🥩 Butcher Shop'}
                                                    </span>
                                                    <span className={styles.buyAgainCountBadge}>
                                                        Ordered {item.totalQty}×
                                                    </span>
                                                </div>
                                                <h3 className={styles.buyAgainItemName}>{item.name}</h3>
                                                {item.desc && (
                                                    <p className={styles.buyAgainItemDesc}>{item.desc}</p>
                                                )}
                                            </div>
                                            <div className={styles.buyAgainFooter}>
                                                <span className={styles.buyAgainLastDate}>
                                                    Last ordered {formatDateShort(item.lastOrderedAt)}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleBuySingleItemAgain(
                                                            {
                                                                name: item.name,
                                                                price: item.priceCents,
                                                                desc: item.desc,
                                                            },
                                                            item.storeId
                                                        )
                                                    }
                                                    className={styles.buyAgainBtn}
                                                >
                                                    + Buy Again
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ── Quick Reorder (Last Order) ── */}
                        {lastOrder && (
                            <div className={`${styles.statCard} ${styles.quickReorderCard}`}>
                                <StoreBadge storeId={lastOrder.metadata?.store_id} />
                                <div className={styles.quickReorderTop}>
                                    <div>
                                        <span className={styles.statLabel}>Quick Reorder</span>
                                        <h3 className={styles.quickReorderTitle}>Your Last Purchase</h3>
                                        <p className={styles.quickReorderMeta}>
                                            Order #{lastOrder.orderNumber} • {formatDate(lastOrder.createdAt)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleReorder(lastOrder)}
                                        className={`${styles.primaryActionBtn} ${styles.noTopMarginBtn}`}
                                    >
                                        Repurchase Entire Order
                                    </button>
                                </div>
                                <div className={styles.quickReorderItems}>
                                    {lastOrder.items.map(item => (
                                        <div
                                            key={`${item.name}-${item.note || ''}`}
                                            className={styles.orderItemActionPill}
                                        >
                                            <span>
                                                {item.qty || item.quantity || 1}x {item.name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleBuySingleItemAgain(
                                                        item,
                                                        lastOrder.metadata?.store_id === 'depot'
                                                            ? 'depot'
                                                            : 'butcher'
                                                    )
                                                }
                                                className={styles.orderItemBuyBtn}
                                            >
                                                + Buy Again
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Order History Header + Filter ── */}
                        <div className={styles.orderHistoryHeader}>
                            <h2 className={`${styles.sectionTitle} ${styles.noMarginTitle}`}>
                                Order History ({initialOrders.length})
                            </h2>
                            {initialOrders.length > 0 && (
                                <div className={styles.filterGroup}>
                                    {(['all', 'butcher', 'depot'] as const).map(f => (
                                        <button
                                            key={f}
                                            type="button"
                                            onClick={() => setStoreFilter(f)}
                                            className={`${styles.filterBtn} ${
                                                storeFilter === f ? styles.filterBtnActive : ''
                                            }`}
                                        >
                                            {f === 'all'
                                                ? 'All'
                                                : f === 'butcher'
                                                  ? '🥩 Butcher'
                                                  : '🏪 Depot'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.orderList}>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => {
                                    const isCopied = copiedOrderId === order.orderNumber;
                                    const orderStoreId: 'butcher' | 'depot' =
                                        order.metadata?.store_id === 'depot' ? 'depot' : 'butcher';
                                    return (
                                        <div
                                            key={order._id}
                                            className={`${styles.orderCard} ${styles.orderCardRelative}`}
                                        >
                                            <StoreBadge storeId={order.metadata?.store_id} />
                                            <div className={styles.orderHeader}>
                                                <div className={styles.orderIdRow}>
                                                    <span className={styles.orderId}>
                                                        Order #{order.orderNumber}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyOrderId(order.orderNumber)}
                                                        title="Copy order #"
                                                        className={`${styles.copyOrderBtn} ${
                                                            isCopied ? styles.copyOrderBtnActive : ''
                                                        }`}
                                                    >
                                                        {isCopied ? '✓ Copied!' : '⎘ Copy'}
                                                    </button>
                                                </div>
                                                <span
                                                    className={`${styles.orderStatusPill} ${
                                                        styles[
                                                            'status_' +
                                                                (order.status || 'pending')
                                                                    .toLowerCase()
                                                                    .replace('-', '_')
                                                        ]
                                                    }`}
                                                >
                                                    {order.status || 'Processing'}
                                                </span>
                                            </div>
                                            <div className={styles.orderBody}>
                                                <div className={styles.orderItemsWrap}>
                                                    {(order.items || []).map(item => (
                                                        <div
                                                            key={`${item.name}-${item.note || ''}`}
                                                            className={styles.orderItemActionPill}
                                                        >
                                                            <span>
                                                                {item.qty || item.quantity || 1}x {item.name}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleBuySingleItemAgain(
                                                                        item,
                                                                        orderStoreId
                                                                    )
                                                                }
                                                                className={styles.orderItemBuyBtn}
                                                            >
                                                                + Buy Again
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className={styles.orderDate}>
                                                    {formatDate(order.createdAt)}
                                                </p>
                                                {order.metadata?.pickup && (
                                                    <p className={styles.pickupMeta}>
                                                        <span className={styles.pickupMetaLabel}>
                                                            Pickup:{' '}
                                                        </span>
                                                        <strong className={styles.pickupMetaStrong}>
                                                            {order.metadata.pickup}
                                                        </strong>
                                                    </p>
                                                )}
                                                {(order.items || []).some(i => i.note) && (
                                                    <div className={styles.orderNotesList}>
                                                        {(order.items || [])
                                                            .filter(i => i.note)
                                                            .map(item => (
                                                                <p
                                                                    key={`${item.name}-${item.note}`}
                                                                    className={styles.orderNoteItem}
                                                                >
                                                                    <strong>{item.name}:</strong> {item.note}
                                                                </p>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className={styles.orderFooter}>
                                                <span className={styles.orderDate}>
                                                    {(order.items || []).reduce(
                                                        (sum, i) => sum + (i.qty || i.quantity || 1),
                                                        0
                                                    )}{' '}
                                                    items
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleReorder(order)}
                                                    className={styles.reorderBtn}
                                                >
                                                    Repurchase Entire Order
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className={styles.emptyOrdersBox}>
                                    {storeFilter === 'all'
                                        ? 'Your culinary journey begins with your first order.'
                                        : `No orders from ${
                                              storeFilter === 'butcher' ? 'the Butcher Shop' : 'The Depot'
                                          } yet.`}
                                    {storeFilter === 'all' && (
                                        <div className={styles.emptyOrdersActionWrap}>
                                            <button
                                                type="button"
                                                onClick={() => navigateTo('/online-orders')}
                                                className={styles.primaryActionBtn}
                                            >
                                                Shop the Collection
                                            </button>
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
                        <p className={styles.specialsIntro}>
                            Exclusive deals for logged-in members. Don&apos;t miss out!
                        </p>
                        <div className={styles.specialsGrid}>
                            {specials.map(special => (
                                <div key={special._id} className={styles.specialCard}>
                                    {special.badge && (
                                        <span
                                            className={styles.specialBadge}
                                            data-badge={special.badge}
                                        >
                                            {special.badge.replace('-', ' ').toUpperCase()}
                                        </span>
                                    )}
                                    {special.image && (
                                        <div className={styles.specialImageWrap}>
                                            <img
                                                src={special.image}
                                                alt={special.title}
                                                className={styles.specialImage}
                                            />
                                        </div>
                                    )}
                                    <div className={styles.specialContent}>
                                        <h3 className={styles.specialTitle}>{special.title}</h3>
                                        {special.description && (
                                            <p className={styles.specialDesc}>{special.description}</p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => navigateTo('/online-orders')}
                                            className={`${styles.primaryActionBtn} ${styles.specialActionBtn}`}
                                        >
                                            Shop Now
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
