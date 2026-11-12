'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import styles from './dashboard.module.css';
import { usePageTransition } from '@/components/PageTransition';
import CutCollector from '@/components/dashboard/CutCollector';
import { ANIMAL_IDS, CUT_MAP_DATA, type AnimalId } from '@/data/cutMap';
import {
    calculateCutProgress,
    evaluateTangibleRewards,
    resolveOrderCutPieces,
} from '@/lib/cutCollector';
import { useCartCount } from '@/context/CartContext';
import { Toggle } from '@/components/Toggle';

const ANIMAL_REWARD_META: Record<AnimalId, { emoji: string; short: string }> = {
    beef: { emoji: '🐄', short: 'Beef' },
    pork: { emoji: '🐖', short: 'Pork' },
    chicken: { emoji: '🐓', short: 'Chicken' },
    lamb: { emoji: '🐑', short: 'Lamb' },
    veal: { emoji: '🐂', short: 'Veal' },
    turkey: { emoji: '🦃', short: 'Turkey' },
    duck: { emoji: '🦆', short: 'Duck' },
};

const ORDER_REWARD_MILESTONES = [1, 3, 5, 10, 25] as const;

interface OrderRewardTier {
    minOrders: number;
    title: string;
    badge: string;
    nextAt: number | null;
    perk: string;
}

const ORDER_REWARD_TIERS: readonly OrderRewardTier[] = [
    {
        minOrders: 0,
        title: 'Guild Initiate',
        badge: '🥩',
        nextAt: 1,
        perk: 'Place your 1st order to earn the Apprentice Butcher Seal',
    },
    {
        minOrders: 1,
        title: 'Apprentice',
        badge: '🔪',
        nextAt: 3,
        perk: 'Priority Counter Cut Queue Unlocked',
    },
    {
        minOrders: 3,
        title: 'Journeyman',
        badge: '🔥',
        nextAt: 5,
        perk: 'Early Access to Weekend Smokehouse Drops',
    },
    {
        minOrders: 5,
        title: 'Artisan Cutter',
        badge: '🏅',
        nextAt: 10,
        perk: 'Custom Thickness & Dry-Age Locker Priority',
    },
    {
        minOrders: 10,
        title: 'Pitmaster',
        badge: '👑',
        nextAt: 25,
        perk: 'VIP Holiday Roast Reservation & Reserve Cuts',
    },
    {
        minOrders: 25,
        title: 'Grand Butcher',
        badge: '🏆',
        nextAt: null,
        perk: 'Lifetime Hofherr Master Guild Honor',
    },
];

function getOrderRewardTier(orderCount: number): OrderRewardTier {
    let activeTier = ORDER_REWARD_TIERS[0];
    for (const tier of ORDER_REWARD_TIERS) {
        if (orderCount >= tier.minOrders) {
            activeTier = tier;
        }
    }
    return activeTier;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    };
}

function describeHaloArc(cx: number, cy: number, r: number, startAngleDeg: number, endAngleDeg: number): string {
    const start = polarToCartesian(cx, cy, r, startAngleDeg);
    const end = polarToCartesian(cx, cy, r, endAngleDeg);
    const largeArcFlag = endAngleDeg - startAngleDeg <= 180 ? '0' : '1';
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

const HALO_ARC_SEGMENTS: { animalId: AnimalId; d: string; index: number }[] = (() => {
    const startBase = 135;
    const totalSpan = 270;
    const gapDeg = 5;
    const count = ANIMAL_IDS.length; // 7
    const arcSpan = (totalSpan - gapDeg * (count - 1)) / count;
    return ANIMAL_IDS.map((animalId, index) => {
        const segStart = startBase + index * (arcSpan + gapDeg);
        const segEnd = segStart + arcSpan;
        return {
            animalId,
            index,
            d: describeHaloArc(110, 110, 80, segStart, segEnd),
        };
    });
})();

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
        stepNum: '01',
        short: 'Placed',
        stepName: 'Ticket Verified',
        stepDetail: 'Ticket printed at counter & queued for trimming.',
        title: 'Order Placed · In Butcher Queue',
        statuses: ['pending', 'paid'],
        etaText: '~25 mins · 2:28 PM',
        defaultStatus: 'paid' as TrackerStatus,
    },
    {
        key: 'prep',
        stepNum: '02',
        short: 'Cutting',
        stepName: 'On the Block',
        stepDetail: 'Hand-cut, weighed on scale & wrapped in kraft paper.',
        title: 'On the Block · Hand-Cutting & Wrapping',
        statuses: ['processing'],
        etaText: '~12 mins · 2:15 PM',
        defaultStatus: 'processing' as TrackerStatus,
    },
    {
        key: 'ready',
        stepNum: '03',
        short: 'Ready',
        stepName: 'Ready for Pickup',
        stepDetail: 'Twine-tied parcel waiting in the cold case.',
        title: 'Ready for Pickup · Wrapped at Counter',
        statuses: ['ready_paid', 'ready_pending'],
        etaText: 'Ready now',
        defaultStatus: 'ready_paid' as TrackerStatus,
    },
    {
        key: 'done',
        stepNum: '04',
        short: 'Picked Up',
        stepName: 'Picked Up',
        stepDetail: 'Picked up & logged in your Butcher Guide history.',
        title: 'Picked Up · Complete',
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

// Shop line customers call to change or cancel once an order is on the block.
const TRACKER_SHOP_PHONE = { label: '(847) 441-6328', href: 'tel:+18474416328' };

const FAKE_ACTIVE_ORDER_ITEMS = [
    { name: 'USDA Prime Dry-Aged Bone-In Ribeye (16 oz)', qty: 2, note: 'Cut 1.75" thick, extra marbled' },
    { name: 'House-Smoked Applewood Slab Bacon (1.5 lb)', qty: 1, note: 'Thick cut' },
    { name: 'Fresh Hot Italian Sausage (1 lb)', qty: 2 },
];

const ACTIVE_TRACKER_CUT_PIECES = resolveOrderCutPieces(FAKE_ACTIVE_ORDER_ITEMS);

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

interface RestockRequestData {
    _id: string;
    customerName?: string;
    customerEmail?: string;
    contactType?: 'phone' | 'email' | string;
    contactValue?: string;
    contact?: string;
    item: string;
    price?: number | string;
    qty: number;
    store: 'butcher' | 'depot' | string;
    status?: 'pending' | 'notified' | string;
    createdAt?: string;
    timestamp?: string;
    notifiedAt?: string;
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

const EMPTY_RESTOCK_REQUESTS: RestockRequestData[] = [];

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
    initialRestockRequests = EMPTY_RESTOCK_REQUESTS,
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
    initialRestockRequests?: RestockRequestData[];
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

    // ── Restock Requests & Back-in-Stock Notifications ──
    const [restockRequests, setRestockRequests] = useState<RestockRequestData[]>(initialRestockRequests);
    const [restockNoticeBanner, setRestockNoticeBanner] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const syncRestockRequests = async () => {
            let localItems: RestockRequestData[] = [];
            try {
                const raw = window.localStorage.getItem('hofherr_restock_requests');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        localItems = parsed.map((r: RestockRequestData, idx: number) => ({
                            _id: r._id || `local-${r.item}-${r.store || 'butcher'}-${idx}`,
                            customerName: r.customerName || userName,
                            customerEmail: r.customerEmail || email,
                            contactType: r.contactType || 'email',
                            contactValue: r.contactValue || r.contact || email,
                            item: r.item,
                            price: r.price,
                            qty: r.qty || 1,
                            store: r.store || 'butcher',
                            status: r.status || 'pending',
                            createdAt: r.createdAt || r.timestamp || new Date().toISOString(),
                            notifiedAt: r.notifiedAt,
                        }));
                    }
                }
            } catch {
                // ignore storage read error
            }

            let serverItems: RestockRequestData[] = initialRestockRequests;
            try {
                const res = await fetch(
                    `/api/restock-request?email=${encodeURIComponent(email)}&name=${encodeURIComponent(userName)}`
                );
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data.requests)) {
                        serverItems = data.requests;
                    }
                }
            } catch {
                // fallback to initialRestockRequests + localItems
            }

            if (cancelled) return;

            const mergedMap = new Map<string, RestockRequestData>();
            for (const s of serverItems) {
                const key = `${s.item.toLowerCase()}__${s.store || 'butcher'}`;
                mergedMap.set(key, s);
            }
            for (const l of localItems) {
                const key = `${l.item.toLowerCase()}__${l.store || 'butcher'}`;
                const existing = mergedMap.get(key);
                if (!existing) {
                    mergedMap.set(key, l);
                } else if (l.status === 'notified' && existing.status !== 'notified') {
                    mergedMap.set(key, { ...existing, status: 'notified', notifiedAt: l.notifiedAt });
                } else if (existing.status === 'notified' && l.status !== 'notified') {
                    // Sync server's filled state back to localStorage
                    l.status = 'notified';
                    l.notifiedAt = existing.notifiedAt;
                }
            }

            const mergedList = Array.from(mergedMap.values()).sort((a, b) => {
                if (a.status === 'notified' && b.status !== 'notified') return -1;
                if (b.status === 'notified' && a.status !== 'notified') return 1;
                return (
                    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                );
            });

            setRestockRequests(mergedList);
            try {
                window.localStorage.setItem('hofherr_restock_requests', JSON.stringify(mergedList));
            } catch {}
        };

        syncRestockRequests();
        return () => {
            cancelled = true;
        };
    }, [email, userName, initialRestockRequests]);

    const handleSimulateRestockFilled = async (reqItem: RestockRequestData) => {
        const notifiedAt = new Date().toISOString();
        const updatedList = restockRequests.map(r =>
            r._id === reqItem._id || (r.item === reqItem.item && r.store === reqItem.store)
                ? { ...r, status: 'notified', notifiedAt }
                : r
        );
        setRestockRequests(updatedList);
        try {
            window.localStorage.setItem('hofherr_restock_requests', JSON.stringify(updatedList));
        } catch {}

        setRestockNoticeBanner(
            `🔔 "${reqItem.item}" marked Back in Stock! Restock confirmation email sent to ${email} and profile notification activated.`
        );
        setTimeout(() => setRestockNoticeBanner(null), 6000);

        try {
            const res = await fetch('/api/restock-request', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: reqItem._id,
                    item: reqItem.item,
                    customerName: displayName || userName,
                    customerEmail: email,
                    qty: reqItem.qty,
                    store: reqItem.store,
                }),
            });
            if (!res.ok) {
                console.error('Failed to trigger restock filled email');
            }
        } catch {
            // keep optimistic state
        }
    };

    const handleDismissRestockRequest = async (reqItem: RestockRequestData) => {
        const nextList = restockRequests.filter(
            r => !(r._id === reqItem._id || (r.item === reqItem.item && r.store === reqItem.store))
        );
        setRestockRequests(nextList);
        try {
            window.localStorage.setItem('hofherr_restock_requests', JSON.stringify(nextList));
        } catch {}

        if (reqItem._id && !reqItem._id.startsWith('local-')) {
            try {
                const res = await fetch(
                    `/api/restock-request?id=${encodeURIComponent(reqItem._id)}`,
                    { method: 'DELETE' }
                );
                if (!res.ok) {
                    console.error('Failed to delete restock request on server');
                }
            } catch {}
        }
    };

    // ── Live Order Tracker (Test Order #HM-4892) ──
    const [trackerStatus, setTrackerStatus] = useState<TrackerStatus>('processing');
    const [trackerStore, setTrackerStore] = useState<TrackerStoreId>('butcher');
    const [trackerAutoPlay, setTrackerAutoPlay] = useState(false);
    // Holds the status the customer was at when they asked to cancel, so the
    // confirm prompt closes by itself if the order moves on to another step.
    const [trackerCancelConfirmFor, setTrackerCancelConfirmFor] = useState<TrackerStatus | null>(null);

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

    const trackerCanSelfCancel = !trackerCancelled && trackerActiveStage?.key === 'placed';
    const trackerCancelConfirmOpen = trackerCanSelfCancel && trackerCancelConfirmFor === trackerStatus;

    const handleCancelTrackerOrder = () => {
        setTrackerAutoPlay(false);
        setTrackerCancelConfirmFor(null);
        setTrackerStatus('cancelled');
    };

    const handleStartTrackerDemo = () => {
        setTrackerCancelConfirmFor(null);
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

    const { items: liveCartItems, setCount: setGlobalCartCount, openCart } = useCartCount();

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
        if (storeId) {
            try {
                window.localStorage.setItem('hofherr_active_store', storeId);
            } catch {}
        }
        writeStorage(CART_KEYS.default, cartItems);
        setGlobalCartCount(cartItems.reduce((sum, i) => sum + i.qty, 0));
        openCart();
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
        try {
            window.localStorage.setItem('hofherr_active_store', storeId);
        } catch {}
        setGlobalCartCount(1);
        openCart();
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

    const effectiveOrdersForRewards = useMemo(() => {
        const merged = [...initialOrders];
        if (liveCartItems.length > 0) {
            merged.push({
                _id: 'live-cart-reward-preview',
                orderNumber: 'LIVE-CART-BAG',
                status: 'completed',
                createdAt: new Date().toISOString(),
                items: liveCartItems.map(item => ({ name: item.name, qty: item.qty })),
            });
        }
        return merged;
    }, [initialOrders, liveCartItems]);

    const cutProgress = useMemo(
        () => calculateCutProgress(effectiveOrdersForRewards),
        [effectiveOrdersForRewards]
    );

    const tangibleRewards = useMemo(
        () => evaluateTangibleRewards(cutProgress),
        [cutProgress]
    );

    const completedAnimalsCount = useMemo(
        () => ANIMAL_IDS.filter(id => cutProgress.animals[id]?.isComplete).length,
        [cutProgress]
    );

    const totalRewardOrders = Math.max(initialOrders.length, cutProgress.qualifyingOrderCount);
    const activeOrderTier = getOrderRewardTier(totalRewardOrders);
    const orderMilestoneProgressPct = activeOrderTier.nextAt
        ? Math.min(100, Math.round((totalRewardOrders / activeOrderTier.nextAt) * 100))
        : 100;

    const handleSelectAnimalFromProfile = (animalId: AnimalId) => {
        window.dispatchEvent(new CustomEvent('select-cut-animal', { detail: { animalId } }));
        const chartEl = document.getElementById('cut-collection');
        if (chartEl) {
            chartEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const activeAvatar = isEditing ? editAvatar : avatarUrl;

    return (
        <div className={styles.dashboardContainer}>
            <main className={`container ${styles.mainCanvas}`}>
                {/* ── Profile & Order History (At the Top of the Page) ── */}
                <div className={styles.contentGrid}>
                    {/* ── Left Column ── */}
                    <div className={styles.sideColumn}>
                        {/* ── Profile Hero Card ── */}
                        <div className={styles.dashProfileCard}>
                            <div
                                className={`${styles.dashAvatarShowcase} ${
                                    completedAnimalsCount === ANIMAL_IDS.length
                                        ? styles.dashAvatarShowcaseAllComplete
                                        : ''
                                }`}
                            >
                                {/* 7-Animal Segmented Mastery Halo Ring */}
                                <svg
                                    className={styles.dashAvatarHaloSvg}
                                    viewBox="0 0 220 220"
                                    aria-hidden="true"
                                >
                                    {HALO_ARC_SEGMENTS.map(({ animalId, d }) => {
                                        const animalProg = cutProgress.animals[animalId];
                                        const isComplete = animalProg?.isComplete;
                                        const hasParts = (animalProg?.collectedCount || 0) > 0;
                                        return (
                                            <g key={animalId}>
                                                <path
                                                    d={d}
                                                    className={styles.dashHaloTrackArc}
                                                />
                                                {hasParts && (
                                                    <path
                                                        d={d}
                                                        pathLength={100}
                                                        strokeDasharray={`${animalProg.percent} 100`}
                                                        className={`${styles.dashHaloFillArc} ${
                                                            isComplete
                                                                ? styles.dashHaloFillArcComplete
                                                                : styles.dashHaloFillArcPartial
                                                        }`}
                                                    />
                                                )}
                                            </g>
                                        );
                                    })}
                                </svg>

                                {/* 7 Orbital Animal Part Completion Badges */}
                                {HALO_ARC_SEGMENTS.map(({ animalId, index }) => {
                                    const animalProg = cutProgress.animals[animalId];
                                    const animalDef = CUT_MAP_DATA[animalId];
                                    const meta = ANIMAL_REWARD_META[animalId];
                                    const isComplete = animalProg.isComplete;
                                    const hasParts = animalProg.collectedCount > 0;
                                    const posClass = styles[`dashOrbitalPos${index}`] || '';
                                    const stateClass = isComplete
                                        ? styles.dashOrbitalComplete
                                        : hasParts
                                          ? styles.dashOrbitalPartial
                                          : styles.dashOrbitalEmpty;

                                    return (
                                        <button
                                            key={animalId}
                                            type="button"
                                            className={`${styles.dashOrbitalBadge} ${posClass} ${stateClass}`}
                                            onClick={() => handleSelectAnimalFromProfile(animalId)}
                                            aria-label={`${animalDef.name}: ${animalProg.collectedCount} of ${animalProg.totalCount} parts collected (${animalProg.percent}%). Click to view chart.`}
                                            title={`${animalDef.name}: ${animalProg.collectedCount}/${animalProg.totalCount} parts (${animalProg.percent}%)`}
                                        >
                                            <span className={styles.dashOrbitalEmoji} aria-hidden="true">
                                                {meta.emoji}
                                            </span>
                                            <span className={styles.dashOrbitalCount}>
                                                {isComplete
                                                    ? '✓'
                                                    : `${animalProg.collectedCount}/${animalProg.totalCount}`}
                                            </span>
                                            <span className={styles.dashOrbitalTooltip} role="tooltip">
                                                <strong>{animalDef.name}</strong> ·{' '}
                                                {isComplete
                                                    ? 'All Parts Mastered! ★'
                                                    : `${animalProg.collectedCount}/${animalProg.totalCount} Parts (${animalProg.percent}%)`}
                                            </span>
                                        </button>
                                    );
                                })}

                                {/* Inner Circular Avatar Frame */}
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

                                {/* Bottom Order Count & Rank Crest on Avatar */}
                                <div
                                    className={styles.dashAvatarOrderCrest}
                                    title={`${totalRewardOrders} completed orders · ${activeOrderTier.title} Rank (${activeOrderTier.perk})`}
                                >
                                    <span className={styles.dashOrderCrestIcon} aria-hidden="true">
                                        {activeOrderTier.badge}
                                    </span>
                                    <span className={styles.dashOrderCrestCount}>
                                        {totalRewardOrders} {totalRewardOrders === 1 ? 'Order' : 'Orders'}
                                    </span>
                                    <span className={styles.dashOrderCrestDivider} aria-hidden="true">
                                        •
                                    </span>
                                    <span className={styles.dashOrderCrestRank}>
                                        {activeOrderTier.title}
                                    </span>
                                </div>
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
                                <span className={styles.dashGuildBadge}>
                                    {activeOrderTier.badge} {activeOrderTier.title}
                                </span>
                                {isAdmin && <span className={styles.dashAdminBadge}>👑 Master Admin</span>}
                            </div>

                            <p className={styles.dashMemberSinceText}>
                                Hofherr Meat Co. Member Since {memberSince}
                            </p>

                            {/* ── Profile Reward System: Order Milestones & 7-Animal Completion ── */}
                            <div className={styles.dashRewardPanel} aria-label="Butcher Guild Reward Progress">
                                {/* Order Count Milestone Track */}
                                <div className={styles.dashOrderRewardSection}>
                                    <div className={styles.dashRewardHeaderRow}>
                                        <span className={styles.dashRewardSectionLabel}>
                                            {activeOrderTier.badge} Order Rewards ({totalRewardOrders}{' '}
                                            {totalRewardOrders === 1 ? 'Order' : 'Orders'})
                                        </span>
                                        <span className={styles.dashRewardNextText}>
                                            {activeOrderTier.nextAt
                                                ? `${activeOrderTier.nextAt - totalRewardOrders} more to unlock next rank`
                                                : 'Max Guild Rank Unlocked ★'}
                                        </span>
                                    </div>
                                    <div
                                        className={styles.dashOrderProgressTrack}
                                        role="progressbar"
                                        aria-valuenow={orderMilestoneProgressPct}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                        aria-label="Order tier milestone progress"
                                    >
                                        <div
                                            className={styles.dashOrderProgressFill}
                                            style={
                                                {
                                                    '--reward-pct': `${orderMilestoneProgressPct}%`,
                                                } as React.CSSProperties
                                            }
                                        />
                                    </div>
                                    <div className={styles.dashOrderMilestonesRow}>
                                        {ORDER_REWARD_MILESTONES.map(milestone => {
                                            const unlocked = totalRewardOrders >= milestone;
                                            return (
                                                <span
                                                    key={milestone}
                                                    className={`${styles.dashMilestonePill} ${
                                                        unlocked ? styles.dashMilestonePillUnlocked : ''
                                                    }`}
                                                >
                                                    {unlocked ? '✓' : '○'} {milestone}{' '}
                                                    {milestone === 1 ? 'Order' : 'Orders'}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <p className={styles.dashRewardPerkNote}>{activeOrderTier.perk}</p>
                                </div>

                                {/* 7-Animal Parts Mastery Strip */}
                                <div className={styles.dashAnimalMasterySection}>
                                    <div className={styles.dashRewardHeaderRow}>
                                        <span className={styles.dashRewardSectionLabel}>
                                            🏆 7-Animal Mastery ({completedAnimalsCount}/{ANIMAL_IDS.length} Animals)
                                        </span>
                                        <span className={styles.dashRewardNextText}>
                                            {cutProgress.totalCollected}/{cutProgress.totalPossible} Total Parts
                                        </span>
                                    </div>
                                    <div className={styles.dashAnimalMasteryGrid}>
                                        {ANIMAL_IDS.map(animalId => {
                                            const prog = cutProgress.animals[animalId];
                                            const meta = ANIMAL_REWARD_META[animalId];
                                            return (
                                                <button
                                                    key={animalId}
                                                    type="button"
                                                    onClick={() => handleSelectAnimalFromProfile(animalId)}
                                                    className={`${styles.dashAnimalMiniCard} ${
                                                        prog.isComplete
                                                            ? styles.dashAnimalMiniCardComplete
                                                            : prog.collectedCount > 0
                                                              ? styles.dashAnimalMiniCardPartial
                                                              : ''
                                                    }`}
                                                    title={`View ${meta.short} chart (${prog.collectedCount}/${prog.totalCount} parts collected)`}
                                                >
                                                    <div className={styles.dashAnimalMiniTop}>
                                                        <span className={styles.dashAnimalMiniEmoji} aria-hidden="true">
                                                            {meta.emoji}
                                                        </span>
                                                        {prog.isComplete && (
                                                            <span className={styles.dashAnimalMiniCheck} aria-hidden="true">
                                                                ★
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className={styles.dashAnimalMiniName}>{meta.short}</span>
                                                    <span className={styles.dashAnimalMiniParts}>
                                                        {prog.collectedCount}/{prog.totalCount}
                                                    </span>
                                                     <div className={styles.dashAnimalMiniBarTrack} aria-hidden="true">
                                                        <div
                                                            className={styles.dashAnimalMiniBarFill}
                                                            style={
                                                                {
                                                                    '--animal-pct': `${prog.percent}%`,
                                                                } as React.CSSProperties
                                                            }
                                                        />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Real Completion Payoffs Locker on Profile Card */}
                                <div className={styles.dashTangibleLockerSection}>
                                    <div className={styles.dashRewardHeaderRow}>
                                        <span className={styles.dashRewardSectionLabel}>
                                            🎁 Real Completion Payoffs
                                        </span>
                                        <span className={styles.dashRewardNextText}>
                                            {tangibleRewards.filter(r => r.unlocked).length}/4 Earned
                                        </span>
                                    </div>
                                    <div className={styles.dashTangibleMiniList}>
                                        {tangibleRewards.map(reward => (
                                            <div
                                                key={reward.id}
                                                className={`${styles.dashTangibleMiniRow} ${
                                                    reward.unlocked
                                                        ? styles.dashTangibleMiniRowUnlocked
                                                        : styles.dashTangibleMiniRowLocked
                                                }`}
                                            >
                                                <span className={styles.dashTangibleMiniIcon} aria-hidden="true">
                                                    {reward.icon}
                                                </span>
                                                <div className={styles.dashTangibleMiniBody}>
                                                    <div className={styles.dashTangibleMiniTop}>
                                                        <span className={styles.dashTangibleMiniTitle}>
                                                            {reward.title}
                                                        </span>
                                                        <span
                                                            className={
                                                                reward.unlocked
                                                                    ? styles.dashTangibleBadgeEarned
                                                                    : styles.dashTangibleBadgeLocked
                                                            }
                                                        >
                                                            {reward.unlocked ? `✓ ${reward.claimCode}` : `${reward.progressPct}%`}
                                                        </span>
                                                    </div>
                                                    <span className={styles.dashTangibleMiniSub}>
                                                        {reward.remainingText}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Member Contact & Delivery Details (Merged inside Unified Profile Card) */}
                                <div className={styles.dashContactDetailsSection}>
                                    <div className={styles.dashRewardHeaderRow}>
                                        <span className={styles.dashRewardSectionLabel}>
                                            📋 Contact &amp; Delivery Details
                                        </span>
                                        <a
                                            href={`/dashboard/${displayUsername}`}
                                            className={styles.publicProfileLink}
                                            title="Open your guild dashboard profile"
                                        >
                                            Guild Dashboard ↗
                                        </a>
                                    </div>

                                    {isEditing ? (
                                        <div className={styles.dashMergedDetailsStack}>
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
                                                <span id="dash-edit-newsletter-label" className={`${styles.infoLabel} ${styles.noMarginTitle}`}>
                                                    Weekly Specials Emails
                                                </span>
                                                <Toggle
                                                    checked={editNewsletter}
                                                    onChange={setEditNewsletter}
                                                    aria-labelledby="dash-edit-newsletter-label"
                                                    size="md"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles.dashMergedDetailsStack}>
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
                                        </div>
                                    )}
                                </div>
                            </div>

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
                                        onClick={() => navigateTo('/admin-dashboard/admin')}
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
                            <img
                                src="/assets/packaging/hofherr-gift-cards-duo.png"
                                alt="Hofherr Meat Co. physical gift cards"
                                className={styles.giftCardFloatingImg}
                            />
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
                        {/* ── Restock Notifications & Watchlist ── */}
                        {restockRequests.length > 0 && (
                            <section
                                className={styles.restockNotificationsSection}
                                aria-labelledby="restock-notifications-heading"
                            >
                                <div className={styles.restockSectionHeader}>
                                    <div>
                                        <h2
                                            id="restock-notifications-heading"
                                            className={`${styles.sectionTitle} ${styles.noMarginTitle}`}
                                        >
                                            🔔 Restock Alerts &amp; Requested Cuts ({restockRequests.length})
                                        </h2>
                                        <p className={styles.restockSectionSub}>
                                            When a cut you requested is restocked, we email{' '}
                                            <strong>{email}</strong> and post an instant alert here on your profile.
                                        </p>
                                    </div>
                                    {restockRequests.some(r => r.status === 'notified') && (
                                        <span className={styles.restockFilledPillCount}>
                                            {restockRequests.filter(r => r.status === 'notified').length} Back in Stock!
                                        </span>
                                    )}
                                </div>

                                {restockNoticeBanner && (
                                    <div className={styles.restockToastAlert} role="status">
                                        {restockNoticeBanner}
                                    </div>
                                )}

                                <div className={styles.restockCardsStack}>
                                    {restockRequests.map(reqItem => {
                                        const isFilled = reqItem.status === 'notified';
                                        const storeLabel =
                                            reqItem.store === 'depot'
                                                ? 'The Depot (Winnetka)'
                                                : 'The Butcher Shop (Northfield)';
                                        return (
                                            <div
                                                key={`${reqItem._id}-${reqItem.item}`}
                                                className={`${styles.restockAlertCard} ${
                                                    isFilled
                                                        ? styles.restockAlertCardFilled
                                                        : styles.restockAlertCardPending
                                                }`}
                                            >
                                                <div className={styles.restockAlertMain}>
                                                    <div className={styles.restockAlertBadgeRow}>
                                                        <span
                                                            className={
                                                                isFilled
                                                                    ? styles.restockBadgeFilled
                                                                    : styles.restockBadgePending
                                                            }
                                                        >
                                                            {isFilled
                                                                ? '✓ Filled · Back in Stock!'
                                                                : '⏳ Waiting on Butcher Restock'}
                                                        </span>
                                                        <span className={styles.restockStoreTag}>
                                                            {reqItem.store === 'depot'
                                                                ? '🏪 The Depot'
                                                                : '🥩 Butcher Shop'}
                                                        </span>
                                                        {isFilled && (
                                                            <span className={styles.restockEmailSentTag}>
                                                                ✉ Email Sent to {email}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className={styles.restockItemHeading}>
                                                        {reqItem.qty}× {reqItem.item}
                                                    </h3>

                                                    <p className={styles.restockItemMeta}>
                                                        {isFilled ? (
                                                            <>
                                                                Your requested cut has been filled at{' '}
                                                                <strong>{storeLabel}</strong> and is ready to order now!
                                                            </>
                                                        ) : (
                                                            <>
                                                                Requested for <strong>{storeLabel}</strong> • We will
                                                                email <strong>{email}</strong> and notify your profile as
                                                                soon as it&apos;s back on the block.
                                                            </>
                                                        )}
                                                    </p>
                                                </div>

                                                <div className={styles.restockAlertActions}>
                                                    {isFilled ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    handleBuySingleItemAgain(
                                                                        {
                                                                            name: reqItem.item,
                                                                            price: reqItem.price || 1299,
                                                                        },
                                                                        reqItem.store === 'depot'
                                                                            ? 'depot'
                                                                            : 'butcher'
                                                                    );
                                                                }}
                                                                className={styles.restockOrderNowBtn}
                                                            >
                                                                🛒 Add to Order
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDismissRestockRequest(reqItem)
                                                                }
                                                                className={styles.restockDismissBtn}
                                                            >
                                                                Dismiss
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSimulateRestockFilled(reqItem)
                                                                }
                                                                className={styles.restockSimulateFillBtn}
                                                                title="Simulate the butcher filling this restock request (sends email & activates notification)"
                                                            >
                                                                ⚡ Mark Filled (Test Alert &amp; Email)
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDismissRestockRequest(reqItem)
                                                                }
                                                                className={styles.restockDismissBtn}
                                                            >
                                                                Cancel Request
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* ── Active Order Tracker (Test Mode) ── */}
                        <section
                            className={`${styles.liveTrackerCard} ${
                                trackerCancelled ? styles.liveTrackerCancelled : ''
                            } ${
                                trackerStatus === 'ready_paid' ||
                                trackerStatus === 'ready_pending' ||
                                trackerStatus === 'completed'
                                    ? styles.liveTrackerCardGreen
                                    : ''
                            }`}
                            aria-labelledby="live-tracker-heading"
                        >
                            <div className={styles.liveTrackerTop}>
                                <div>
                                    <div className={styles.liveTrackerKickerRow}>
                                        <span
                                            className={`${styles.liveTrackerPulseDot} ${
                                                trackerStatus === 'ready_paid' ||
                                                trackerStatus === 'ready_pending' ||
                                                trackerStatus === 'completed'
                                                    ? styles.liveTrackerPulseDotGreen
                                                    : ''
                                            }`}
                                            aria-hidden="true"
                                        />
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
                                    <div
                                        className={`${styles.liveTrackerEtaValue} ${
                                            trackerStatus === 'ready_paid' ||
                                            trackerStatus === 'ready_pending' ||
                                            trackerStatus === 'completed'
                                                ? styles.liveTrackerEtaValueGreen
                                                : ''
                                        }`}
                                    >
                                        {trackerEtaValue}
                                    </div>
                                </div>
                            </div>

                            <ol
                                className={`${styles.liveTrackerBar} ${
                                    trackerStatus === 'completed' ? styles.liveTrackerBarPickedUp : ''
                                }`}
                                aria-label="Order tracking progress"
                            >
                                {TRACKER_STAGES.map((stage, i) => {
                                    const finished = trackerStatus === 'completed';
                                    const done = !trackerCancelled && (i < trackerActiveIndex || finished);
                                    const active =
                                        !trackerCancelled && !finished && i === trackerActiveIndex;
                                    const stateClass = finished
                                        ? styles.liveSegPickedUp
                                        : done
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
                                                    setTrackerCancelConfirmFor(null);
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

                            {/* ── 4-Step Order Tracking Process Breakdown Cards ── */}
                            <div className={styles.trackerStepsGrid} role="group" aria-label="4-step order tracking process details">
                                {TRACKER_STAGES.map((stage, i) => {
                                    const finished = trackerStatus === 'completed';
                                    const done = !trackerCancelled && (i < trackerActiveIndex || finished);
                                    const active = !trackerCancelled && !finished && i === trackerActiveIndex;
                                    return (
                                        <button
                                            key={`acct-step-${stage.key}`}
                                            type="button"
                                            onClick={() => {
                                                setTrackerAutoPlay(false);
                                                setTrackerCancelConfirmFor(null);
                                                setTrackerStatus(stage.defaultStatus);
                                            }}
                                            className={`${styles.trackerStepCard} ${
                                                done
                                                    ? styles.trackerStepCardDone
                                                    : active
                                                      ? styles.trackerStepCardActive
                                                      : ''
                                            }`}
                                        >
                                            <div className={styles.trackerStepTop}>
                                                <span className={styles.trackerStepNum}>
                                                    Step {stage.stepNum}
                                                </span>
                                                <span className={styles.trackerStepStatus}>
                                                    {done ? '✓ Done' : active ? '● Active' : 'Pending'}
                                                </span>
                                            </div>
                                            <div className={styles.trackerStepName}>{stage.stepName}</div>
                                            <div className={styles.trackerStepDesc}>{stage.stepDetail}</div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ── Butcher's Guide to Cuts — Pieces Unlocked in Active Order ── */}
                            {ACTIVE_TRACKER_CUT_PIECES.length > 0 && (
                                <div className={styles.trackerCutsShowcase}>
                                    <div className={styles.trackerCutsHeader}>
                                        <span className={styles.liveTrackerKicker}>
                                            🥩 Butcher&apos;s Guide to Cuts — Primal Pieces in Order #HM-4892 ({ACTIVE_TRACKER_CUT_PIECES.length})
                                        </span>
                                    </div>
                                    <div className={styles.trackerCutsGrid}>
                                        {ACTIVE_TRACKER_CUT_PIECES.map(piece => (
                                            <div key={piece.key} className={styles.trackerCutCard}>
                                                <div className={styles.trackerCutStage}>
                                                    <svg
                                                        viewBox={piece.pieceViewBox}
                                                        className={styles.trackerCutSvg}
                                                        role="img"
                                                        aria-label={`${piece.animalName} — ${piece.cutName} piece`}
                                                    >
                                                        <image
                                                            href={piece.cleanChartImage}
                                                            x="0"
                                                            y="0"
                                                            width="1200"
                                                            height="896"
                                                            preserveAspectRatio="xMidYMid meet"
                                                        />
                                                        <path
                                                            d={piece.svgPath}
                                                            className={styles.trackerCutHighlight}
                                                        />
                                                        {piece.woodcutPath && (
                                                            <path
                                                                d={piece.woodcutPath}
                                                                className={styles.trackerCutWoodcut}
                                                            />
                                                        )}
                                                        <text
                                                            x={piece.labelX}
                                                            y={piece.labelY}
                                                            className={styles.trackerCutLabel}
                                                        >
                                                            {piece.cutName.toUpperCase()}
                                                        </text>
                                                    </svg>
                                                </div>
                                                <div className={styles.trackerCutMeta}>
                                                    <span className={styles.trackerCutBadge}>
                                                        ★ {piece.animalName} Guide · Cut #{piece.cutOrderIndex}/{piece.totalAnimalCuts}
                                                    </span>
                                                    <span className={styles.trackerCutTitle}>
                                                        {piece.animalName}: {piece.cutName} Section
                                                    </span>
                                                    <span className={styles.trackerCutProduct}>
                                                        {piece.matchedItems.map(m => `${m.orderedName} ×${m.qty}`).join(', ')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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

                            {/* ── Change or Cancel ── */}
                            <div className={styles.liveTrackerHelp}>
                                {trackerCancelled ? (
                                    <p className={styles.liveTrackerHelpText}>
                                        Cancelled by mistake? Call the shop at{' '}
                                        <a className={styles.liveTrackerDetailLink} href={TRACKER_SHOP_PHONE.href}>
                                            {TRACKER_SHOP_PHONE.label}
                                        </a>{' '}
                                        and we&apos;ll sort it out.
                                    </p>
                                ) : trackerCancelConfirmOpen ? (
                                    <div
                                        className={styles.liveTrackerHelpRow}
                                        role="group"
                                        aria-label="Confirm order cancellation"
                                    >
                                        <p className={styles.liveTrackerHelpText}>
                                            <strong>Cancel order #HM-4892?</strong> This can&apos;t be undone.
                                        </p>
                                        <div className={styles.liveTrackerHelpActions}>
                                            <button
                                                type="button"
                                                className={styles.liveTrackerCancelBtn}
                                                onClick={() => setTrackerCancelConfirmFor(null)}
                                            >
                                                Keep order
                                            </button>
                                            <button
                                                type="button"
                                                className={`${styles.liveTrackerCancelBtn} ${styles.liveTrackerCancelBtnDanger}`}
                                                onClick={handleCancelTrackerOrder}
                                            >
                                                Yes, cancel order
                                            </button>
                                        </div>
                                    </div>
                                ) : trackerCanSelfCancel ? (
                                    <div className={styles.liveTrackerHelpRow}>
                                        <p className={styles.liveTrackerHelpText}>
                                            Need to cancel? You can cancel online until we start cutting.
                                        </p>
                                        <button
                                            type="button"
                                            className={styles.liveTrackerCancelBtn}
                                            onClick={() => setTrackerCancelConfirmFor(trackerStatus)}
                                        >
                                            Cancel order
                                        </button>
                                    </div>
                                ) : trackerActiveStage?.key === 'done' ? (
                                    <p className={styles.liveTrackerHelpText}>
                                        Problem with your order? Call the shop at{' '}
                                        <a className={styles.liveTrackerDetailLink} href={TRACKER_SHOP_PHONE.href}>
                                            {TRACKER_SHOP_PHONE.label}
                                        </a>
                                        .
                                    </p>
                                ) : (
                                    <p className={styles.liveTrackerHelpText}>
                                        {trackerActiveStage?.key === 'ready'
                                            ? 'Your order is cut and wrapped, so it can no longer be cancelled online.'
                                            : 'Your order is on the block, so it can no longer be cancelled online.'}{' '}
                                        To change or cancel, call the shop at{' '}
                                        <a className={styles.liveTrackerDetailLink} href={TRACKER_SHOP_PHONE.href}>
                                            {TRACKER_SHOP_PHONE.label}
                                        </a>
                                        .
                                    </p>
                                )}
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
                                                setTrackerCancelConfirmFor(null);
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

                        {/* ── Member Specials (Placed High Up on Profile) ── */}
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

                {/* ── Cut Collection Gamified Butcher Chart ── */}
                <CutCollector
                    orders={initialOrders}
                    userName={displayName}
                    isAuthenticated={true}
                />
            </main>
        </div>
    );
}
