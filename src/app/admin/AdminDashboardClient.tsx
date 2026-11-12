'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import type * as RechartsModule from 'recharts';
import styles from './admin.module.css';
import Pagination from '@/components/shared/Pagination';
import { resolveOrderCutPieces } from '@/lib/cutCollector';

interface OrderItem {
    name: string;
    qty?: number;
    quantity?: number;
    price?: number | string;
    note?: string;
}

interface Order {
    _id: string;
    orderNumber: string;
    customer: { name: string; email: string; phone?: string };
    total: number;
    status: string;
    createdAt: string;
    pickedUpAt?: string;
    items: OrderItem[];
    pickupTime?: string;
    couponCode?: string;
    minutesBehind?: number;
    behindReason?: string;
    metadata?: {
        store_id?: string;
        customer_name?: string;
        customer_email?: string;
        customer_phone?: string;
        order_note?: string;
    };
}

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isAdmin: boolean;
    createdAt: string;
    address?: string;
    hasPassword?: boolean;
}

interface ProductItem {
    _id: string;
    name: string;
    category?: { name?: string };
}

interface RestockRequestItem {
    _id: string;
    createdAt: string;
    item: string;
    qty: number;
    store: string;
    customerName: string;
    customerEmail?: string;
    contactType: string;
    contactValue?: string;
    status?: string;
    notifiedAt?: string;
}

const SEED_ADMIN_ORDERS: Order[] = [
    {
        _id: 'demo-behind-1',
        orderNumber: 'HM-4887',
        customer: {
            name: 'Marcus Vance',
            email: 'mvance@northshore.io',
            phone: '847-555-0142',
        },
        total: 18400,
        status: 'processing',
        createdAt: '2026-11-10T19:05:00.000Z',
        pickupTime: '1:45 PM',
        minutesBehind: 22,
        behindReason: 'Promised 1:45 PM pickup • On the block for 38 mins (custom Frenching)',
        metadata: {
            store_id: 'butcher',
            customer_name: 'Marcus Vance',
            customer_email: 'mvance@northshore.io',
            customer_phone: '847-555-0142',
            order_note: 'French the rib bones clean and wrap each steak individually in heavy butcher paper.',
        },
        items: [
            { name: '45-Day Dry-Aged Tomahawk Ribeye (36 oz)', qty: 2, price: 78, note: '2.25" thick cut' },
            { name: 'Split Roasted Bone Marrow Canoe Cut', qty: 2, price: 14 },
        ],
    },
    {
        _id: 'demo-behind-2',
        orderNumber: 'HM-4889',
        customer: {
            name: 'Eleanor Sterling',
            email: 'eleanor.sterling@winnetka.org',
            phone: '847-555-0198',
        },
        total: 21800,
        status: 'paid',
        createdAt: '2026-11-10T19:18:00.000Z',
        pickupTime: '2:00 PM',
        minutesBehind: 15,
        behindReason: 'Promised 2:00 PM pickup • Ticket still in Placed queue, not yet on the block',
        metadata: {
            store_id: 'butcher',
            customer_name: 'Eleanor Sterling',
            customer_email: 'eleanor.sterling@winnetka.org',
            customer_phone: '847-555-0198',
            order_note: 'Silver skin fully removed and tied with butcher twine at 1.5-inch intervals.',
        },
        items: [
            { name: 'Whole Trimmed USDA Prime Beef Tenderloin (5 lb)', qty: 1, price: 194, note: 'Chateaubriand center cut' },
            { name: 'Black Truffle & Roasted Garlic Butter', qty: 2, price: 12 },
        ],
    },
    {
        _id: 'demo-behind-3',
        orderNumber: 'HM-4890',
        customer: {
            name: 'David Kovacs',
            email: 'dkovacs@kovacspartners.com',
            phone: '847-555-0274',
        },
        total: 9650,
        status: 'processing',
        createdAt: '2026-11-10T19:26:00.000Z',
        pickupTime: '2:05 PM',
        minutesBehind: 9,
        behindReason: 'Promised 2:05 PM pickup • Large hot lunch order running behind at The Depot',
        metadata: {
            store_id: 'depot',
            customer_name: 'David Kovacs',
            customer_email: 'dkovacs@kovacspartners.com',
            customer_phone: '847-555-0274',
            order_note: 'Pack hot au jus and giardiniera in separate side containers.',
        },
        items: [
            { name: 'Smoked Prime Brisket French Dip', qty: 3, price: 22, note: 'Extra provolone' },
            { name: 'Tallow-Fried Crispy Potatoes', qty: 2, price: 9.5 },
            { name: 'House Hot Giardiniera Pint', qty: 1, price: 11.5 },
        ],
    },
    {
        _id: 'demo-active-1',
        orderNumber: 'HM-4892',
        customer: {
            name: 'Hofherr Master Admin',
            email: 'admin@hofherrmeats.com',
            phone: '847-441-6328',
        },
        total: 12450,
        status: 'processing',
        createdAt: '2026-11-10T19:42:00.000Z',
        pickupTime: '2:15 PM',
        metadata: {
            store_id: 'butcher',
            customer_name: 'Hofherr Master Admin',
            customer_email: 'admin@hofherrmeats.com',
            customer_phone: '847-441-6328',
            order_note: 'Cut 1.75" thick, extra marbled.',
        },
        items: [
            { name: 'USDA Prime Dry-Aged Bone-In Ribeye (16 oz)', qty: 2, price: 42, note: 'Cut 1.75" thick' },
            { name: 'House-Smoked Applewood Slab Bacon (1.5 lb)', qty: 1, price: 18.5, note: 'Thick cut' },
            { name: 'Fresh Hot Italian Sausage (1 lb)', qty: 2, price: 11 },
        ],
    },
    {
        _id: 'demo-active-2',
        orderNumber: 'HM-4893',
        customer: {
            name: 'Claire Bennett',
            email: 'claire.bennett@glencoe.net',
            phone: '847-555-0319',
        },
        total: 14200,
        status: 'paid',
        createdAt: '2026-11-10T19:50:00.000Z',
        pickupTime: '2:30 PM',
        metadata: {
            store_id: 'butcher',
            customer_name: 'Claire Bennett',
            customer_email: 'claire.bennett@glencoe.net',
            customer_phone: '847-555-0319',
        },
        items: [
            { name: 'Heritage Berkshire Pork Crown Roast', qty: 1, price: 98 },
            { name: 'Sage & Roasted Chestnut Stuffing Mix', qty: 2, price: 22 },
        ],
    },
    {
        _id: 'demo-active-3',
        orderNumber: 'HM-4891',
        customer: {
            name: 'Robert Halstead',
            email: 'rhalstead@halsteadlaw.com',
            phone: '847-555-0411',
        },
        total: 8800,
        status: 'ready_paid',
        createdAt: '2026-11-10T19:30:00.000Z',
        pickupTime: '2:10 PM',
        metadata: {
            store_id: 'butcher',
            customer_name: 'Robert Halstead',
            customer_email: 'rhalstead@halsteadlaw.com',
            customer_phone: '847-555-0411',
        },
        items: [
            { name: 'USDA Prime New York Strip Steak (14 oz)', qty: 2, price: 34 },
            { name: 'House Chimichurri Sauce (8 oz)', qty: 1, price: 10 },
            { name: 'Smoked Cheddar Bratwurst (4-Pack)', qty: 1, price: 10 },
        ],
    },
    {
        _id: 'demo-active-4',
        orderNumber: 'HM-4894',
        customer: {
            name: 'Hannah Lindqvist',
            email: 'hannah@lindqvistdesign.com',
            phone: '847-555-0582',
        },
        total: 6400,
        status: 'ready_pending',
        createdAt: '2026-11-10T19:35:00.000Z',
        pickupTime: '2:15 PM',
        metadata: {
            store_id: 'depot',
            customer_name: 'Hannah Lindqvist',
            customer_email: 'hannah@lindqvistdesign.com',
            customer_phone: '847-555-0582',
        },
        items: [
            { name: 'Rotisserie Chicken', qty: 2, price: 24 },
            { name: 'Charred Broccolini with Chili & Lemon', qty: 2, price: 8 },
        ],
    },
    {
        _id: 'demo-picked-up-fresh',
        orderNumber: 'HM-4895',
        customer: {
            name: 'Michael Scimeca',
            email: 'mikeyscimeca@gmail.com',
            phone: '847-441-6328',
        },
        total: 18600,
        status: 'completed',
        createdAt: '2026-11-11T18:10:00.000Z',
        pickedUpAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Picked up 2 hours ago (22h left before 24h auto-archive)
        pickupTime: '1:30 PM',
        metadata: {
            store_id: 'butcher',
            customer_name: 'Michael Scimeca',
            customer_email: 'mikeyscimeca@gmail.com',
            customer_phone: '847-441-6328',
            order_note: 'Picked up at Northfield counter • Auto-archives to Inventory History in 24h.',
        },
        items: [
            { name: 'USDA Prime Dry-Aged Bone-In Ribeye', qty: 2, price: 44, note: '1.75" thick cut' },
            { name: 'Whole Brisket', qty: 1, price: 98, note: 'Full packer brisket' },
        ],
    },
    {
        _id: 'demo-completed-1',
        orderNumber: 'HM-4829',
        customer: {
            name: 'Hofherr Master Admin',
            email: 'admin@hofherrmeats.com',
            phone: '847-441-6328',
        },
        total: 16850,
        status: 'completed',
        createdAt: '2026-11-06T18:30:00.000Z',
        pickedUpAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Picked up 5 days ago (Expired > 24h -> Archived to Inventory History)
        pickupTime: '4:00 PM',
        couponCode: 'BUTCHER10',
        metadata: {
            store_id: 'butcher',
            customer_name: 'Hofherr Master Admin',
            customer_email: 'admin@hofherrmeats.com',
            customer_phone: '847-441-6328',
        },
        items: [
            { name: 'USDA Prime Dry-Aged Bone-In Ribeye', qty: 2, price: 42 },
            { name: 'House-Smoked Applewood Thick-Cut Bacon', qty: 2, price: 16.5 },
            { name: 'Hofherr Signature Steakhouse Rub', qty: 1, price: 12.5 },
        ],
    },
];

const SEED_HISTORICAL_SPEND_CENTS: Record<string, { spendCents: number; extraOrders: number }> = {
    'mvance@northshore.io': { spendCents: 112500, extraOrders: 8 },
    'eleanor.sterling@winnetka.org': { spendCents: 148000, extraOrders: 11 },
    'dkovacs@kovacspartners.com': { spendCents: 46500, extraOrders: 5 },
    'admin@hofherrmeats.com': { spendCents: 185000, extraOrders: 14 },
    'mikeyscimeca@gmail.com': { spendCents: 142000, extraOrders: 9 },
    'claire.bennett@glencoe.net': { spendCents: 62000, extraOrders: 4 },
    'rhalstead@halsteadlaw.com': { spendCents: 24500, extraOrders: 2 },
};

export interface CustomerSpendBadge {
    tierKey: 'vip' | 'gold' | 'regular' | 'first';
    stars: string;
    hasGoldStar: boolean;
    label: string;
    shortLabel: string;
    lifetimeDollars: number;
    orderCount: number;
}

function getCustomerSpendBadge(lifetimeDollars: number, orderCount: number): CustomerSpendBadge {
    if (lifetimeDollars >= 1000 || orderCount >= 10) {
        return {
            tierKey: 'vip',
            stars: '★★★',
            hasGoldStar: true,
            label: '★ Gold Star VIP · Master Patron',
            shortLabel: '★ VIP Master',
            lifetimeDollars,
            orderCount,
        };
    }
    if (lifetimeDollars >= 400 || orderCount >= 4) {
        return {
            tierKey: 'gold',
            stars: '★★',
            hasGoldStar: true,
            label: '★ Gold Star · Prime Regular',
            shortLabel: '★ Gold Star Customer',
            lifetimeDollars,
            orderCount,
        };
    }
    if (lifetimeDollars >= 150 || orderCount >= 2) {
        return {
            tierKey: 'regular',
            stars: '★',
            hasGoldStar: true,
            label: '★ Valued Repeat Customer',
            shortLabel: '★ Good Customer',
            lifetimeDollars,
            orderCount,
        };
    }
    return {
        tierKey: 'first',
        stars: '✦',
        hasGoldStar: false,
        label: 'New / First-Time Customer',
        shortLabel: 'New Customer',
        lifetimeDollars,
        orderCount,
    };
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatAdminDate(isoStr: string): string {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    if (Number.isNaN(d.getTime())) return '—';
    return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function formatAdminTime(isoStr: string): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    if (Number.isNaN(d.getTime())) return '';
    const hours24 = d.getUTCHours();
    const mins = String(d.getUTCMinutes()).padStart(2, '0');
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    return `${hours12}:${mins} ${period}`;
}

function formatCurrency(amountDollars: number): string {
    return `$${amountDollars.toFixed(2)}`;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const INITIAL_ADMIN_NOW_MS = Date.now();
export const ARCHIVED_INVENTORY_ORDERS_STORAGE_KEY = 'hofherr_archived_inventory_orders_v1';

export interface ArchivedInventoryOrderRecord {
    _id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    storeName: string;
    items: Array<{ name: string; qty: number; price: string | null }>;
    totalDollars: number;
    pickedUpAt: string;
    archivedAt: string;
}

function getOrderPickedUpTimestamp(order: Order): number {
    const raw = order.pickedUpAt || order.createdAt;
    const ts = new Date(raw).getTime();
    return Number.isNaN(ts) ? INITIAL_ADMIN_NOW_MS : ts;
}

function isOrderExpiredToInventoryHistory(order: Order): boolean {
    if (order.status !== 'completed') return false;
    return INITIAL_ADMIN_NOW_MS - getOrderPickedUpTimestamp(order) >= ONE_DAY_MS;
}

function getHoursUntilArchive(order: Order): number {
    const elapsed = INITIAL_ADMIN_NOW_MS - getOrderPickedUpTimestamp(order);
    const remainingMs = Math.max(0, ONE_DAY_MS - elapsed);
    return Math.max(1, Math.ceil(remainingMs / (60 * 60 * 1000)));
}

function getHoursSincePickedUp(order: Order): number {
    const elapsed = Math.max(0, INITIAL_ADMIN_NOW_MS - getOrderPickedUpTimestamp(order));
    return Math.max(0, Math.floor(elapsed / (60 * 60 * 1000)));
}

function toArchivedInventoryRecord(order: Order): ArchivedInventoryOrderRecord {
    const storeKey = order.metadata?.store_id === 'depot' ? 'depot' : 'butcher';
    return {
        _id: order._id,
        orderNumber: order.orderNumber || 'HM-0000',
        customerName: order.customer?.name || order.metadata?.customer_name || 'Guest',
        customerEmail: order.customer?.email || order.metadata?.customer_email || '',
        customerPhone: order.customer?.phone || order.metadata?.customer_phone || '',
        storeName: ADMIN_STORE_INFO[storeKey]?.name || 'The Butcher Shop',
        items: (order.items || []).map(item => ({
            name: item.name || 'Butcher Cut',
            qty: item.qty || item.quantity || 1,
            price:
                typeof item.price === 'number'
                    ? `$${item.price.toFixed(2)}`
                    : item.price || null,
        })),
        totalDollars: (order.total || 0) / 100,
        pickedUpAt: order.pickedUpAt || order.createdAt,
        archivedAt: new Date(getOrderPickedUpTimestamp(order) + ONE_DAY_MS).toISOString(),
    };
}

function isOrderInProgress(status: string): boolean {
    return (
        status === 'pending' ||
        status === 'paid' ||
        status === 'processing' ||
        status === 'ready_paid' ||
        status === 'ready_pending'
    );
}

function getStageIndex(status: string): number {
    if (status === 'pending' || status === 'paid') return 0;
    if (status === 'processing') return 1;
    if (status === 'ready_paid' || status === 'ready_pending') return 2;
    if (status === 'completed') return 3;
    return 0;
}

const ADMIN_TRACKER_STAGES = [
    {
        key: 'placed',
        stepNum: '01',
        short: 'Placed',
        title: 'Order Placed',
        stepName: 'Ticket Verified',
        stepDetail: 'Ticket printed at counter & queued for trimming.',
        targetStatus: 'paid',
    },
    {
        key: 'cutting',
        stepNum: '02',
        short: 'Cutting',
        title: 'On the Block',
        stepName: 'On the Block',
        stepDetail: 'Hand-cut, weighed on scale & wrapped in kraft paper.',
        targetStatus: 'processing',
    },
    {
        key: 'ready',
        stepNum: '03',
        short: 'Ready',
        title: 'Ready for Pickup',
        stepName: 'Ready for Pickup',
        stepDetail: 'Twine-tied parcel waiting in the cold case.',
        targetStatus: 'ready_paid',
    },
    {
        key: 'done',
        stepNum: '04',
        short: 'Picked Up',
        title: 'Picked Up',
        stepName: 'Picked Up',
        stepDetail: 'Picked up & logged in customer Butcher Guide.',
        targetStatus: 'completed',
    },
] as const;

const ADMIN_STORE_INFO: Record<string, { name: string; address: string; mapsUrl: string }> = {
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

export default function AdminDashboard({ username }: { username?: string } = {}) {
    const [loading, setLoading] = useState(true);
    const [rechartsMod, setRechartsMod] = useState<typeof RechartsModule | null>(null);
    const [rawOrders, setRawOrders] = useState<Order[]>(SEED_ADMIN_ORDERS);
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [restocks, setRestocks] = useState<RestockRequestItem[]>([]);
    const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'restocks'>('orders');
    const [orderFilter, setOrderFilter] = useState<string>('all');
    const [inProgressStageFilter, setInProgressStageFilter] = useState<'all' | 'behind' | 'placed' | 'cutting' | 'ready' | 'done'>('all');
    const [progressSortBy, setProgressSortBy] = useState<'stage_asc' | 'stage_desc' | 'urgent_first' | 'total_desc' | 'newest'>('stage_asc');
    const [storeFilter, setStoreFilter] = useState<'all' | 'butcher' | 'depot'>('all');
    const { data: session } = useSession();
    const isRestrictedAdmin =
        session?.user?.email === 'butcher@hofherrmeats.com' ||
        session?.user?.email === 'depot@hofherrmeats.com';

    useEffect(() => {
        let cancelled = false;
        import('recharts')
            .then(mod => {
                if (!cancelled) setRechartsMod(mod);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (session?.user?.email === 'butcher@hofherrmeats.com') setStoreFilter('butcher');
        else if (session?.user?.email === 'depot@hofherrmeats.com') setStoreFilter('depot');
    }, [session]);

    const orders = useMemo(() => {
        if (storeFilter === 'all') return rawOrders;
        return rawOrders.filter(o => (o.metadata?.store_id || 'butcher') === storeFilter);
    }, [rawOrders, storeFilter]);

    const [sortField, setSortField] = useState<'orderNumber' | 'customer' | 'createdAt' | 'items' | 'total' | 'status'>('status');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedCustomerMeta, setSelectedCustomerMeta] = useState<{
        user: { name: string; email: string; phone?: string };
        orders: Order[];
        lifetimeSpend: number;
        tierName: string;
        points: number;
    } | null>(null);
    const [customerSearchQuery, setCustomerSearchQuery] = useState('');
    const [customerSearchPage, setCustomerSearchPage] = useState(1);
    const [orderPage, setOrderPage] = useState(1);
    const [orderSearchQuery, setOrderSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/admin/data');
                if (cancelled) return;
                if (!res.ok) {
                    window.location.replace('/admin/login');
                    return;
                }
                const data = await res.json();
                if (cancelled) return;
                const apiOrders: Order[] = Array.isArray(data.orders) ? data.orders : [];
                const existingNums = new Set(apiOrders.map(o => o.orderNumber));
                const mergedOrders = [
                    ...SEED_ADMIN_ORDERS.filter(seed => !existingNums.has(seed.orderNumber)),
                    ...apiOrders,
                ];
                setRawOrders(mergedOrders);
                setProducts(data.products || []);
                setRestocks(data.restocks || []);
            } catch (err) {
                console.error('Admin init error:', err);
                if (!cancelled) window.location.replace('/admin/login');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        checkAuth();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;
        const fetchCustomers = async () => {
            try {
                const res = await fetch(
                    `/api/admin/customers?page=${customerSearchPage}&limit=50&query=${encodeURIComponent(customerSearchQuery)}`
                );
                if (res.ok && !cancelled) {
                    const data = await res.json();
                    if (cancelled) return;
                    setUsers(data.users || []);
                }
            } catch (err) {
                console.error('Customer fetch error:', err);
            }
        };
        fetchCustomers();
        return () => {
            cancelled = true;
        };
    }, [customerSearchPage, customerSearchQuery]);

    const handleStatusChange = async (orderId: string, newStatus: string, clearBehind = false) => {
        setRawOrders(prev =>
            prev.map(o => {
                if (o._id !== orderId) return o;
                const shouldClearBehind =
                    clearBehind ||
                    newStatus === 'ready_paid' ||
                    newStatus === 'ready_pending' ||
                    newStatus === 'completed' ||
                    newStatus === 'cancelled';
                return {
                    ...o,
                    status: newStatus,
                    pickedUpAt:
                        newStatus === 'completed'
                            ? new Date(INITIAL_ADMIN_NOW_MS - 60 * 60 * 1000).toISOString()
                            : undefined,
                    minutesBehind: shouldClearBehind ? undefined : o.minutesBehind,
                };
            })
        );

        if (orderId.startsWith('demo-')) {
            return;
        }

        try {
            const res = await fetch('/api/admin/order-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus }),
            });
            if (!res.ok) {
                console.error('Failed to persist order status to Sanity');
            }
        } catch (err) {
            console.error('Update status error:', err);
        }
    };

    const handleExpireOrderToInventory = (orderId: string) => {
        const expiredTimestamp = new Date(INITIAL_ADMIN_NOW_MS - 26 * 60 * 60 * 1000).toISOString();
        const nextOrders = rawOrders.map(o => {
            if (o._id !== orderId) return o;
            return {
                ...o,
                status: 'completed',
                pickedUpAt: expiredTimestamp,
                minutesBehind: undefined,
            };
        });
        try {
            const expiredRecords = nextOrders
                .filter(o => isOrderExpiredToInventoryHistory(o))
                .map(toArchivedInventoryRecord);
            window.localStorage.setItem(
                ARCHIVED_INVENTORY_ORDERS_STORAGE_KEY,
                JSON.stringify(expiredRecords)
            );
        } catch {
            // ignore storage write failures
        }
        setRawOrders(nextOrders);
    };

    const handleResetDemoQueue = () => {
        try {
            window.localStorage.removeItem(ARCHIVED_INVENTORY_ORDERS_STORAGE_KEY);
        } catch {
            // ignore
        }
        setRawOrders(prev => {
            const nonDemo = prev.filter(o => !o._id.startsWith('demo-'));
            return [...SEED_ADMIN_ORDERS, ...nonDemo];
        });
    };

    const handleFillRestock = async (reqItem: RestockRequestItem) => {
        try {
            const res = await fetch('/api/restock-request', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: reqItem._id,
                    item: reqItem.item,
                    customerName: reqItem.customerName,
                    customerEmail: reqItem.customerEmail,
                    qty: reqItem.qty,
                    store: reqItem.store,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setRestocks(prev =>
                    prev.map(r =>
                        r._id === reqItem._id
                            ? { ...r, status: 'notified', notifiedAt: data.notifiedAt || new Date().toISOString() }
                            : r
                    )
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteRestock = async (id: string) => {
        if (!confirm('Remove this restock request from the list?')) return;
        try {
            const res = await fetch(`/api/restock-request?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setRestocks(prev => prev.filter(r => r._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    // ── Active In-Progress & Running Behind Queues ──
    const runningBehindOrders = useMemo(
        () =>
            orders
                .filter(o => isOrderInProgress(o.status) && (o.minutesBehind || 0) > 0)
                .sort((a, b) => (b.minutesBehind || 0) - (a.minutesBehind || 0)),
        [orders]
    );

    const recentPickedUpOrders = useMemo(
        () => orders.filter(o => o.status === 'completed' && !isOrderExpiredToInventoryHistory(o)),
        [orders]
    );

    const expiredToInventoryOrders = useMemo(
        () => orders.filter(o => isOrderExpiredToInventoryHistory(o)),
        [orders]
    );

    const activeBoardOrders = useMemo(
        () => orders.filter(o => !isOrderExpiredToInventoryHistory(o)),
        [orders]
    );

    const placedCount = orders.filter(o => o.status === 'pending' || o.status === 'paid').length;
    const allInProgressCount = orders.filter(o => isOrderInProgress(o.status)).length;
    const onTheBlockCount = orders.filter(o => o.status === 'processing').length;
    const readyForPickupCount = orders.filter(
        o => o.status === 'ready_paid' || o.status === 'ready_pending'
    ).length;
    const pickedUpCount = recentPickedUpOrders.length;

    const handleSelectProgressFilter = (
        stageKey: 'all' | 'behind' | 'placed' | 'cutting' | 'ready' | 'done'
    ) => {
        setInProgressStageFilter(stageKey);
        if (stageKey === 'all') setOrderFilter('all');
        else if (stageKey === 'behind') setOrderFilter('behind');
        else if (stageKey === 'placed') setOrderFilter('placed');
        else if (stageKey === 'cutting') setOrderFilter('processing');
        else if (stageKey === 'ready') setOrderFilter('ready');
        else if (stageKey === 'done') setOrderFilter('completed');
        setOrderPage(1);
    };

    const activeInProgressOrders = useMemo(() => {
        let baseList: Order[] = activeBoardOrders;
        if (inProgressStageFilter === 'behind') {
            baseList = runningBehindOrders;
        } else if (inProgressStageFilter === 'placed') {
            baseList = activeBoardOrders.filter(o => o.status === 'pending' || o.status === 'paid');
        } else if (inProgressStageFilter === 'cutting') {
            baseList = activeBoardOrders.filter(o => o.status === 'processing');
        } else if (inProgressStageFilter === 'ready') {
            baseList = activeBoardOrders.filter(
                o => o.status === 'ready_paid' || o.status === 'ready_pending'
            );
        } else if (inProgressStageFilter === 'done') {
            baseList = recentPickedUpOrders;
        }

        return [...baseList].sort((a, b) => {
            if (progressSortBy === 'stage_asc') {
                const diff = getStageIndex(a.status) - getStageIndex(b.status);
                if (diff !== 0) return diff;
                return (b.minutesBehind || 0) - (a.minutesBehind || 0);
            }
            if (progressSortBy === 'stage_desc') {
                const diff = getStageIndex(b.status) - getStageIndex(a.status);
                if (diff !== 0) return diff;
                return (b.minutesBehind || 0) - (a.minutesBehind || 0);
            }
            if (progressSortBy === 'urgent_first') {
                const behindDiff = (b.minutesBehind || 0) - (a.minutesBehind || 0);
                if (behindDiff !== 0) return behindDiff;
                return getStageIndex(a.status) - getStageIndex(b.status);
            }
            if (progressSortBy === 'total_desc') {
                return (b.total || 0) - (a.total || 0);
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [activeBoardOrders, inProgressStageFilter, progressSortBy, recentPickedUpOrders, runningBehindOrders]);

    const groupedStageSections = useMemo(() => {
        const stageDefs = [
            {
                stageIndex: 0,
                key: 'placed' as const,
                stepBadge: 'STEP 01 OF 04',
                title: '1 · Order Placed — Ticket Verified & In Queue',
                subtitle: 'Tickets printed at counter waiting for a butcher to bring to the block.',
                accent: 'placed',
                orders: activeInProgressOrders.filter(o => getStageIndex(o.status) === 0),
            },
            {
                stageIndex: 1,
                key: 'cutting' as const,
                stepBadge: 'STEP 02 OF 04',
                title: '2 · Cutting — On the Block',
                subtitle: 'Being hand-cut, trimmed, weighed on the scale, and wrapped in kraft butcher paper.',
                accent: 'cutting',
                orders: activeInProgressOrders.filter(o => getStageIndex(o.status) === 1),
            },
            {
                stageIndex: 2,
                key: 'ready' as const,
                stepBadge: 'STEP 03 OF 04',
                title: '3 · Ready for Pickup — Cold Case Counter',
                subtitle: 'Twine-tied parcels tagged and waiting in the cold case for customer arrival.',
                accent: 'ready',
                orders: activeInProgressOrders.filter(o => getStageIndex(o.status) === 2),
            },
            {
                stageIndex: 3,
                key: 'done' as const,
                stepBadge: 'STEP 04 OF 04 • THEME GREEN',
                title: '4 · Picked Up (<24h Retention Before Inventory Archive)',
                subtitle: 'Completed pickups stay visible in green for 24 hours before auto-archiving to Inventory History.',
                accent: 'done',
                orders: activeInProgressOrders.filter(o => getStageIndex(o.status) === 3),
            },
        ];
        if (progressSortBy === 'stage_desc') {
            return [...stageDefs].reverse().filter(g => g.orders.length > 0);
        }
        return stageDefs.filter(g => g.orders.length > 0);
    }, [activeInProgressOrders, progressSortBy]);

    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0) / 100;

    // Process data for Pie Chart (Order Status)
    const statusCounts = orders.reduce((acc, order) => {
        const s = order.status || 'pending';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const STATUS_COLORS: Record<string, string> = {
        pending: '#f59e0b',
        paid: '#d97706',
        processing: '#cc0e1d',
        ready_paid: '#10b981',
        ready_pending: '#10b981',
        completed: '#737373',
        cancelled: '#ef4444',
    };

    const pieData = Object.keys(statusCounts).map(k => {
        let name = k.charAt(0).toUpperCase() + k.slice(1);
        if (k === 'ready_paid') name = 'Ready (Paid)';
        if (k === 'ready_pending') name = 'Ready (Pickup)';
        if (k === 'processing') name = 'On the Block';
        return {
            name,
            value: statusCounts[k],
            color: STATUS_COLORS[k.toLowerCase()] || '#a3a3a3',
        };
    });

    const COLORS = ['#cc0e1d', '#a8905f', '#10b981', '#f59e0b', '#e11d48', '#d97706'];

    const revenueByDate = orders.reduce((acc, order) => {
        const dateStr = (order.createdAt || '').slice(5, 10);
        acc[dateStr] = (acc[dateStr] || 0) + (order.total || 0) / 100;
        return acc;
    }, {} as Record<string, number>);

    const barData = Object.keys(revenueByDate)
        .map(date => ({
            date,
            revenue: revenueByDate[date],
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-7);

    const customerStats = orders.reduce((acc, order) => {
        const identifier = order.customer?.email || 'guest';
        if (identifier !== 'guest') {
            if (!acc[identifier]) acc[identifier] = { count: 0, spend: 0 };
            acc[identifier].count += 1;
            acc[identifier].spend += (order.total || 0) / 100;
        }
        return acc;
    }, {} as Record<string, { count: number; spend: number }>);

    let newCustCount = 0;
    let retCustCount = 0;
    let newCustSpend = 0;
    let retCustSpend = 0;

    Object.values(customerStats).forEach(stat => {
        if (stat.count > 1) {
            retCustCount++;
            retCustSpend += stat.spend;
        } else {
            newCustCount++;
            newCustSpend += stat.spend;
        }
    });

    const customerTypesData = [
        { name: 'New Customers', value: newCustCount },
        { name: 'Returning', value: retCustCount },
    ];

    const newAOV = newCustCount > 0 ? newCustSpend / newCustCount : 0;
    const retAOV = retCustCount > 0 ? retCustSpend / retCustCount : 0;

    const itemCounts = orders.reduce((acc, order) => {
        if (Array.isArray(order.items)) {
            order.items.forEach(item => {
                const name = item.name || 'Unknown Item';
                const qty = item.qty || item.quantity || 1;
                acc[name] = (acc[name] || 0) + qty;
            });
        }
        return acc;
    }, {} as Record<string, number>);

    const topItemsData = Object.keys(itemCounts)
        .map(name => ({ name, quantity: itemCounts[name] }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    const categoryRevenue = orders.reduce((acc, order) => {
        if (Array.isArray(order.items)) {
            order.items.forEach(item => {
                const product = products.find(p => p.name === item.name);
                let categoryName = product?.category?.name;
                if (!categoryName) {
                    const lcName = (item.name || '').toLowerCase();
                    if (lcName.match(/beef|ribeye|steak|brisket|strip|filet|tenderloin|chuck|sirloin|burger|marrow/))
                        categoryName = 'Beef';
                    else if (lcName.match(/pork|ribs|bacon|belly/)) categoryName = 'Pork';
                    else if (lcName.match(/chicken|poultry|turkey/)) categoryName = 'Poultry';
                    else if (lcName.match(/sausage|brat|chorizo|kielbasa/)) categoryName = 'Sausages';
                    else if (lcName.match(/lamb/)) categoryName = 'Lamb';
                    else categoryName = 'Prepared & Sides';
                }
                let itemPrice = 0;
                if (typeof item.price === 'string') {
                    const match = item.price.match(/\d+(?:\.\d+)?/);
                    itemPrice = match ? parseFloat(match[0]) : 0;
                } else if (typeof item.price === 'number') {
                    itemPrice = item.price;
                }
                const itemTotal = itemPrice * (item.qty || item.quantity || 1);
                acc[categoryName] = (acc[categoryName] || 0) + itemTotal;
            });
        }
        return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryRevenue)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const vipData = useMemo(() => {
        const spendByName = new Map<string, number>();
        orders.forEach(o => {
            const name = o.customer?.name || o.metadata?.customer_name || 'Guest';
            spendByName.set(name, (spendByName.get(name) || 0) + (o.total || 0) / 100);
        });
        return Array.from(spendByName.entries())
            .map(([name, spend]) => ({ name, spend }))
            .sort((a, b) => b.spend - a.spend)
            .slice(0, 5);
    }, [orders]);

    const handleSort = (field: 'orderNumber' | 'customer' | 'createdAt' | 'items' | 'total' | 'status') => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
        setOrderPage(1);
    };

    const filteredOrders = activeBoardOrders.filter(o => {
        let matchesStatus = true;
        if (orderFilter !== 'all') {
            if (orderFilter === 'behind') {
                matchesStatus = isOrderInProgress(o.status) && (o.minutesBehind || 0) > 0;
            } else if (orderFilter === 'in_progress') {
                matchesStatus = isOrderInProgress(o.status);
            } else if (orderFilter === 'placed') {
                matchesStatus = o.status === 'pending' || o.status === 'paid';
            } else if (orderFilter === 'ready') {
                matchesStatus = o.status === 'ready_paid' || o.status === 'ready_pending';
            } else {
                matchesStatus = o.status === orderFilter;
            }
        }
        let matchesSearch = true;
        if (orderSearchQuery) {
            const query = orderSearchQuery.toLowerCase();
            const nameMatches = (o.customer?.name || o.metadata?.customer_name || '')
                .toLowerCase()
                .includes(query);
            const emailMatches = (o.customer?.email || o.metadata?.customer_email || '')
                .toLowerCase()
                .includes(query);
            const orderNumMatches = (o.orderNumber || '').toString().toLowerCase().includes(query);
            matchesSearch = nameMatches || emailMatches || orderNumMatches;
        }
        return matchesStatus && matchesSearch;
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        let valA: string | number;
        let valB: string | number;
        switch (sortField) {
            case 'orderNumber':
                valA = a.orderNumber?.toString() || '';
                valB = b.orderNumber?.toString() || '';
                break;
            case 'customer':
                valA = (a.customer?.name || 'Guest').toLowerCase();
                valB = (b.customer?.name || 'Guest').toLowerCase();
                break;
            case 'createdAt':
                valA = new Date(a.createdAt).getTime();
                valB = new Date(b.createdAt).getTime();
                break;
            case 'items':
                valA = a.items?.length || 0;
                valB = b.items?.length || 0;
                break;
            case 'total':
                valA = a.total || 0;
                valB = b.total || 0;
                break;
            case 'status':
                valA = getStageIndex(a.status || 'pending');
                valB = getStageIndex(b.status || 'pending');
                if (valA === valB) {
                    return (b.minutesBehind || 0) - (a.minutesBehind || 0);
                }
                break;
            default:
                valA = new Date(a.createdAt).getTime();
                valB = new Date(b.createdAt).getTime();
                break;
        }
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const handleOrderRowClick = (order: Order) => {
        const orderEmail =
            order.customer?.email?.toLowerCase() || order.metadata?.customer_email?.toLowerCase();
        if (!orderEmail) return;
        const foundUser = users.find(u => u.email?.toLowerCase() === orderEmail);
        const userObj = foundUser || {
            name: order.customer?.name || order.metadata?.customer_name || 'Guest Checkout',
            email: orderEmail,
            phone: order.customer?.phone || order.metadata?.customer_phone || '',
        };
        const userOrders = orders.filter(
            o => (o.customer?.email || o.metadata?.customer_email || '').toLowerCase() === orderEmail
        );
        let lifetimeSpend = 0;
        userOrders.forEach(o => {
            lifetimeSpend += (o.total || 0) / 100;
        });
        const points = lifetimeSpend + 50;
        let tierName = 'Sausage';
        if (points >= 1000) tierName = 'Master';
        else if (points >= 500) tierName = 'Ribeye';
        else if (points >= 200) tierName = 'Chop';
        setSelectedCustomerMeta({ user: userObj, orders: userOrders, lifetimeSpend, tierName, points });
    };

    const searchableCustomers = useMemo(() => {
        const customerMap = new Map<
            string,
            {
                email: string;
                name: string;
                phone: string;
                orders: Order[];
                lifetimeSpend: number;
                lastOrderDate: string;
                isRegistered: boolean;
                _id: string;
                firstDate: string;
                hasPassword?: boolean;
            }
        >();
        orders.forEach(o => {
            const email = (o.customer?.email || o.metadata?.customer_email || '').toLowerCase();
            if (!email) return;
            let c = customerMap.get(email);
            if (!c) {
                c = {
                    email,
                    name: o.customer?.name || o.metadata?.customer_name || 'Guest',
                    phone: o.customer?.phone || o.metadata?.customer_phone || '',
                    orders: [],
                    lifetimeSpend: 0,
                    lastOrderDate: o.createdAt,
                    isRegistered: false,
                    _id: 'guest-' + email,
                    firstDate: o.createdAt,
                };
                customerMap.set(email, c);
            }
            c.orders.push(o);
            c.lifetimeSpend += (o.total || 0) / 100;
            if (new Date(o.createdAt) > new Date(c.lastOrderDate)) {
                c.lastOrderDate = o.createdAt;
            }
            if (new Date(o.createdAt) < new Date(c.firstDate || o.createdAt)) {
                c.firstDate = o.createdAt;
            }
        });
        users.forEach(u => {
            const email = u.email?.toLowerCase();
            if (!email) return;
            let c = customerMap.get(email);
            if (!c) {
                c = {
                    email,
                    name: u.name,
                    phone: u.phone || '',
                    orders: [],
                    lifetimeSpend: 0,
                    lastOrderDate: u.createdAt || '',
                    isRegistered: true,
                    _id: u._id,
                    firstDate: u.createdAt,
                    hasPassword: u.hasPassword,
                };
                customerMap.set(email, c);
            } else {
                c.isRegistered = true;
                c._id = u._id;
                c.phone = u.phone || c.phone;
                c.hasPassword = u.hasPassword;
                if (u.createdAt && new Date(u.createdAt) < new Date(c.firstDate)) {
                    c.firstDate = u.createdAt;
                }
            }
        });
        const result = Array.from(customerMap.values()).map(c => {
            const hist = SEED_HISTORICAL_SPEND_CENTS[c.email] || { spendCents: 0, extraOrders: 0 };
            const totalLifetimeSpend = c.lifetimeSpend + hist.spendCents / 100;
            const totalOrderCount = c.orders.length + hist.extraOrders;
            const spendBadge = getCustomerSpendBadge(totalLifetimeSpend, totalOrderCount);
            const points = totalLifetimeSpend + 50;
            let tierName = 'Sausage';
            if (points >= 1000) tierName = 'Master';
            else if (points >= 500) tierName = 'Ribeye';
            else if (points >= 200) tierName = 'Chop';
            const itemAggregation = c.orders.reduce((acc, order) => {
                (order.items || []).forEach(item => {
                    const name = item.name || 'Unknown';
                    const qty = item.qty || item.quantity || 1;
                    acc[name] = (acc[name] || 0) + qty;
                });
                return acc;
            }, {} as Record<string, number>);
            const itemStrings = Object.entries(itemAggregation).map(([name, qty]) => `${qty}x ${name}`);
            return {
                ...c,
                lifetimeSpend: totalLifetimeSpend,
                totalOrderCount,
                spendBadge,
                points,
                tierName,
                itemStrings,
            };
        });

        let finalResult = result;
        if (customerSearchQuery) {
            const q = customerSearchQuery.toLowerCase();
            finalResult = finalResult.filter(
                c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
            );
        } else {
            finalResult = finalResult.filter(c => c.orders.length > 0);
        }
        return finalResult.sort((a, b) => b.lifetimeSpend - a.lifetimeSpend);
    }, [orders, users, customerSearchQuery]);

    const totalPages = Math.max(1, Math.ceil(searchableCustomers.length / 50));
    const paginatedCustomers = searchableCustomers.slice(
        (customerSearchPage - 1) * 50,
        customerSearchPage * 50
    );

    const totalOrderPages = Math.max(1, Math.ceil(sortedOrders.length / 50));
    const paginatedOrders = sortedOrders.slice((orderPage - 1) * 50, orderPage * 50);

    const customerSpendByEmail = useMemo(() => {
        const map = new Map<string, CustomerSpendBadge>();
        const agg = new Map<string, { spendCents: number; count: number }>();
        rawOrders.forEach(o => {
            const em = (o.customer?.email || o.metadata?.customer_email || '').toLowerCase();
            if (!em) return;
            const prev = agg.get(em) || { spendCents: 0, count: 0 };
            prev.spendCents += o.total || 0;
            prev.count += 1;
            agg.set(em, prev);
        });
        agg.forEach((val, em) => {
            const hist = SEED_HISTORICAL_SPEND_CENTS[em] || { spendCents: 0, extraOrders: 0 };
            const lifetimeDollars = (val.spendCents + hist.spendCents) / 100;
            const orderCount = val.count + hist.extraOrders;
            map.set(em, getCustomerSpendBadge(lifetimeDollars, orderCount));
        });
        return map;
    }, [rawOrders]);

    const getOrderCustomerBadge = (order: Order): CustomerSpendBadge => {
        const em = (order.customer?.email || order.metadata?.customer_email || '').toLowerCase();
        if (em && customerSpendByEmail.has(em)) {
            return customerSpendByEmail.get(em)!;
        }
        return getCustomerSpendBadge((order.total || 0) / 100, 1);
    };

    const renderOrderTrackerCard = (order: Order, isUrgentCard = false) => {
        const stageIdx = getStageIndex(order.status);
        const stageObj = ADMIN_TRACKER_STAGES[stageIdx] || ADMIN_TRACKER_STAGES[0];
        const storeKey = order.metadata?.store_id === 'depot' ? 'depot' : 'butcher';
        const storeInfo = ADMIN_STORE_INFO[storeKey];
        const isBehind = (order.minutesBehind || 0) > 0;
        const phoneStr = order.customer?.phone || order.metadata?.customer_phone || '';
        const emailStr = order.customer?.email || order.metadata?.customer_email || '';
        const customerName = order.customer?.name || order.metadata?.customer_name || 'Guest';
        const customerBadge = getOrderCustomerBadge(order);
        const ticketCutPieces = resolveOrderCutPieces(order.items || []);

        let etaText = order.pickupTime ? `Pickup · ${order.pickupTime}` : 'In Queue';
        if (stageIdx === 1 && order.pickupTime) {
            etaText = `~12 MINS · ${order.pickupTime}`;
        } else if (stageIdx === 0 && order.pickupTime) {
            etaText = `~25 MINS · ${order.pickupTime}`;
        } else if (stageIdx === 2) {
            etaText = 'READY NOW';
        } else if (stageIdx === 3) {
            etaText = 'PICKED UP ✓';
        }

        return (
            <article
                key={`${isUrgentCard ? 'urgent' : 'active'}-${order._id}`}
                className={`${styles.trackerCard} ${isBehind ? styles.trackerCardBehind : ''} ${
                    stageIdx === 2 ? styles.trackerCardReady : ''
                } ${stageIdx === 3 ? styles.trackerCardCompleted : ''}`}
            >
                <div className={styles.trackerTop}>
                    <div>
                        <div className={styles.trackerKickerRow}>
                            <span
                                className={`${styles.trackerDot} ${
                                    isBehind
                                        ? styles.trackerDotUrgent
                                        : stageIdx === 2 || stageIdx === 3
                                          ? styles.trackerDotReady
                                          : ''
                                }`}
                                aria-hidden="true"
                            />
                            <span className={styles.trackerKicker}>
                                {stageIdx === 3 ? 'COMPLETED' : 'ACTIVE'} ORDER #{order.orderNumber} • STEP {stageIdx + 1} OF 4
                            </span>
                            {isBehind && (
                                <span className={styles.overduePill}>
                                    ⚠ +{order.minutesBehind}M BEHIND
                                </span>
                            )}
                            {stageIdx === 2 && !isBehind && (
                                <span className={styles.readyPickupBadge}>
                                    📦 WRAPPED &amp; READY AT COUNTER
                                </span>
                            )}
                            {stageIdx === 3 && (
                                <span className={styles.pickedUpBadge}>
                                    ✓ HANDED OFF &amp; LOGGED IN BUTCHER GUIDE
                                </span>
                            )}
                        </div>
                        <h3 className={styles.trackerStageTitle}>{stageObj.title}</h3>
                    </div>
                    <div className={styles.trackerEtaBox}>
                        <div className={styles.trackerKicker}>
                            {isBehind
                                ? 'SLA OVERDUE TARGET'
                                : stageIdx === 2
                                  ? 'PICKUP STATUS'
                                  : stageIdx === 3
                                    ? 'HANDOFF STATUS'
                                    : 'ESTIMATED READY TIME'}
                        </div>
                        <div
                            className={`${styles.trackerEtaValue} ${
                                isBehind
                                    ? styles.trackerEtaUrgent
                                    : stageIdx === 2 || stageIdx === 3
                                      ? styles.trackerEtaReady
                                      : ''
                            }`}
                        >
                            {etaText}
                        </div>
                    </div>
                </div>

                {/* ── Ordered By: Customer Name, Gold Star Spend Tier, Phone & Email Strip ── */}
                <div className={styles.trackerCustomerStrip}>
                    <div className={styles.trackerCustomerIdentity}>
                        <div className={styles.trackerCustomerTopRow}>
                            <span className={styles.trackerCustomerLabel}>ORDERED BY</span>
                            <span
                                className={`${styles.customerTierPill} ${
                                    styles[`customerTier_${customerBadge.tierKey}`]
                                }`}
                                title={`${customerBadge.label} • ${formatCurrency(customerBadge.lifetimeDollars)} lifetime spend across ${customerBadge.orderCount} orders`}
                            >
                                <span className={styles.goldStarIcon} aria-hidden="true">
                                    {customerBadge.stars}
                                </span>{' '}
                                {customerBadge.label}
                            </span>
                        </div>
                        <div className={styles.trackerCustomerNameRow}>
                            <span className={styles.trackerCustomerName}>
                                {customerBadge.hasGoldStar && (
                                    <span className={styles.customerNameGoldStar} title="Gold Star Valued Customer">
                                        ★
                                    </span>
                                )}{' '}
                                {customerName}
                            </span>
                            <span className={styles.trackerCustomerSpendMeta}>
                                {formatCurrency(customerBadge.lifetimeDollars)} spent • {customerBadge.orderCount}{' '}
                                {customerBadge.orderCount === 1 ? 'order' : 'orders'}
                            </span>
                        </div>
                    </div>
                    <div className={styles.trackerCustomerContacts}>
                        {phoneStr && (
                            <a
                                href={`tel:${phoneStr.replace(/\D/g, '')}`}
                                className={styles.trackerContactPill}
                                title={`Call ${customerName} at ${phoneStr}`}
                            >
                                📞 {phoneStr}
                            </a>
                        )}
                        {emailStr && (
                            <a
                                href={`mailto:${emailStr}`}
                                className={styles.trackerContactPill}
                                title={`Email ${customerName} at ${emailStr}`}
                            >
                                ✉️ {emailStr}
                            </a>
                        )}
                    </div>
                </div>

                {/* 4-Stage Interactive Pill Progress Bar (matches /dashboard tracker) */}
                <ol
                    className={`${styles.trackerBar} ${
                        order.status === 'completed' ? styles.trackerBarPickedUp : ''
                    }`}
                    aria-label={`Order ${order.orderNumber} progress`}
                >
                    {ADMIN_TRACKER_STAGES.map((stage, i) => {
                        const finished = order.status === 'completed';
                        const done = i < stageIdx || finished;
                        const active = !finished && i === stageIdx;
                        const stateClass = finished
                            ? styles.trackerSegPickedUp
                            : done
                              ? styles.trackerSegDone
                              : active
                                ? styles.trackerSegActive
                                : styles.trackerSegTodo;
                        return (
                            <li key={stage.key} className={styles.trackerSegItem}>
                                <button
                                    type="button"
                                    className={`${styles.trackerSeg} ${stateClass}`}
                                    onClick={() =>
                                        handleStatusChange(order._id, stage.targetStatus, true)
                                    }
                                >
                                    <span className={styles.trackerSegFill} aria-hidden="true" />
                                    <span className={styles.trackerSegNum} aria-hidden="true">
                                        {done ? '✓' : i + 1}
                                    </span>
                                    <span className={styles.trackerSegLabel}>{stage.short}</span>
                                </button>
                            </li>
                        );
                    })}
                </ol>

                {isBehind && order.behindReason && (
                    <div className={styles.urgentReasonBanner}>
                        <strong>⚠ Running Behind:</strong> {order.behindReason}
                    </div>
                )}

                {stageIdx === 2 && !isBehind && (
                    <div className={styles.readyPickupBanner}>
                        <strong>📦 Ready for Pickup:</strong> Twine-tied parcel is wrapped in kraft butcher paper and waiting in the cold case at <strong>{storeInfo.name}</strong>{order.pickupTime ? ` (Scheduled pickup: ${order.pickupTime})` : ''}.
                    </div>
                )}

                {stageIdx === 3 && (
                    <div className={styles.pickedUpLifecycleStack}>
                        <div className={styles.readyPickupBanner}>
                            <strong>✓ Order Picked Up &amp; Complete:</strong> Handed off to <strong>{customerName}</strong> at <strong>{storeInfo.name}</strong>. Primal cuts from this ticket have been unlocked in their Butcher Guide.
                        </div>
                        <div className={styles.expiryCountdownStrip}>
                            <div className={styles.expiryCountdownCopy}>
                                <span className={styles.expiryCountdownBadge}>
                                    ⏳ EXPIRES IN {getHoursUntilArchive(order)}H (1 DAY RETENTION)
                                </span>
                                <span className={styles.expiryCountdownText}>
                                    Picked up {getHoursSincePickedUp(order) <= 1 ? '1h' : `${getHoursSincePickedUp(order)}h`} ago • Automatically expires from this live board after <strong>24 hours</strong> and archives into <strong>Inventory History</strong> so completed orders don&apos;t clutter the counter queue.
                                </span>
                            </div>
                            <button
                                type="button"
                                className={styles.expireNowBtn}
                                onClick={() => handleExpireOrderToInventory(order._id)}
                            >
                                ⚡ Simulate 24h Expiry → Move to Inventory History
                            </button>
                        </div>
                    </div>
                )}

                {/* ── 4-Step Order Tracking Process Cards (Admin / Butcher Control) ── */}
                <div className={styles.adminStepsGrid} role="group" aria-label={`4-step tracking control for order ${order.orderNumber}`}>
                    {ADMIN_TRACKER_STAGES.map((stage, i) => {
                        const finished = order.status === 'completed';
                        const done = i < stageIdx || finished;
                        const active = !finished && i === stageIdx;
                        return (
                            <button
                                key={`admin-step-${order._id}-${stage.key}`}
                                type="button"
                                onClick={() => handleStatusChange(order._id, stage.targetStatus, true)}
                                className={`${styles.adminStepCard} ${
                                    done
                                        ? styles.adminStepCardDone
                                        : active
                                          ? styles.adminStepCardActive
                                          : ''
                                }`}
                            >
                                <div className={styles.adminStepTop}>
                                    <span className={styles.adminStepNum}>Step {stage.stepNum}</span>
                                    <span className={styles.adminStepStatus}>
                                        {done ? '✓ Done' : active ? '● Active' : 'Pending'}
                                    </span>
                                </div>
                                <div className={styles.adminStepName}>{stage.stepName}</div>
                                <div className={styles.adminStepDesc}>{stage.stepDetail}</div>
                            </button>
                        );
                    })}
                </div>

                {/* ── Butcher's Guide to Cuts — Primal Cuts on Ticket ── */}
                {ticketCutPieces.length > 0 && (
                    <div className={styles.adminCutsShowcase}>
                        <div className={styles.trackerKicker}>
                            🥩 BUTCHER&apos;S GUIDE TO CUTS — PRIMAL PIECES ON TICKET ({ticketCutPieces.length})
                        </div>
                        <div className={styles.adminCutsGrid}>
                            {ticketCutPieces.map(piece => (
                                <div key={`${order._id}-${piece.key}`} className={styles.adminCutCard}>
                                    <div className={styles.adminCutStage}>
                                        <svg
                                            viewBox={piece.pieceViewBox}
                                            className={styles.adminCutSvg}
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
                                                className={styles.adminCutHighlight}
                                            />
                                            {piece.woodcutPath && (
                                                <path
                                                    d={piece.woodcutPath}
                                                    className={styles.adminCutWoodcut}
                                                />
                                            )}
                                            <text
                                                x={piece.labelX}
                                                y={piece.labelY}
                                                className={styles.adminCutLabel}
                                            >
                                                {piece.cutName.toUpperCase()}
                                            </text>
                                        </svg>
                                    </div>
                                    <div className={styles.adminCutMeta}>
                                        <span className={styles.adminCutBadge}>
                                            ★ {piece.animalName} Guide · Cut #{piece.cutOrderIndex}/{piece.totalAnimalCuts}
                                        </span>
                                        <span className={styles.adminCutTitle}>
                                            {piece.animalName}: {piece.cutName}
                                        </span>
                                        <span className={styles.adminCutProduct}>
                                            {piece.matchedItems.map(m => `${m.orderedName} ×${m.qty}`).join(', ')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.trackerDetailsGrid}>
                    <div>
                        <div className={styles.trackerKicker}>PICKUP LOCATION &amp; CUSTOMER</div>
                        <div className={styles.trackerDetailMain}>{storeInfo.name}</div>
                        <a
                            className={styles.trackerDetailLink}
                            href={storeInfo.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {storeInfo.address}
                        </a>
                        <div className={styles.trackerCustomerMeta}>
                            <strong>
                                {customerBadge.hasGoldStar && (
                                    <span className={styles.customerNameGoldStar}>★ </span>
                                )}
                                👤 {customerName}{' '}
                                <span className={styles.inlineSpendNote}>
                                    ({customerBadge.shortLabel} · {formatCurrency(customerBadge.lifetimeDollars)})
                                </span>
                            </strong>
                            {phoneStr && (
                                <a
                                    href={`tel:${phoneStr.replace(/\D/g, '')}`}
                                    className={styles.urgentCustomerPhone}
                                >
                                    📞 {phoneStr}
                                </a>
                            )}
                            {emailStr && (
                                <a
                                    href={`mailto:${emailStr}`}
                                    className={styles.urgentCustomerEmail}
                                >
                                    ✉️ {emailStr}
                                </a>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className={styles.trackerKicker}>ORDER ITEMS</div>
                        <ul className={styles.trackerItemsList}>
                            {(order.items || []).map(item => (
                                <li key={`${order._id}-${item.name}`}>
                                    <span className={styles.trackerItemQty}>
                                        {item.qty || item.quantity || 1}×
                                    </span>{' '}
                                    {item.name}
                                    {item.note && (
                                        <span className={styles.trackerItemNote}>
                                            {' '}
                                            — {item.note}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {order.metadata?.order_note && (
                            <div className={styles.orderSpecialNote}>
                                <strong>🔪 Butcher Note:</strong> {order.metadata.order_note}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.urgentActionsRow}>
                    {(order.status === 'pending' || order.status === 'paid') && (
                        <button
                            type="button"
                            className={styles.actionBtnPrimary}
                            onClick={() => handleStatusChange(order._id, 'processing', true)}
                        >
                            🔪 Move to Block (Step 2 · Cutting)
                        </button>
                    )}
                    {order.status === 'processing' && (
                        <button
                            type="button"
                            className={styles.actionBtnPrimary}
                            onClick={() => handleStatusChange(order._id, 'ready_paid', true)}
                        >
                            📦 Mark Ready for Pickup (Step 3 · Ready)
                        </button>
                    )}
                    {(order.status === 'ready_paid' || order.status === 'ready_pending') && (
                        <button
                            type="button"
                            className={styles.actionBtnPrimary}
                            onClick={() => handleStatusChange(order._id, 'completed', true)}
                        >
                            ✓ Confirm Picked Up (Step 4 · Complete)
                        </button>
                    )}
                    {order.status === 'completed' && (
                        <>
                            <button
                                type="button"
                                className={styles.actionBtnCompleted}
                                onClick={() => handleStatusChange(order._id, 'ready_paid', true)}
                            >
                                ✓ Order Picked Up (Click to Reopen Step 3)
                            </button>
                            <button
                                type="button"
                                className={styles.actionBtnArchiveNow}
                                onClick={() => handleExpireOrderToInventory(order._id)}
                            >
                                📦 Expire 1 Day → Archive to Inventory History
                            </button>
                        </>
                    )}
                    <select
                        aria-label={`Change status for order ${order.orderNumber}`}
                        value={order.status || 'pending'}
                        onChange={e => handleStatusChange(order._id, e.target.value, true)}
                        className={`${styles.statusDropdown} ${
                            styles[`status_${order.status || 'pending'}`]
                        }`}
                    >
                        <option value="pending">Pending (Unpaid)</option>
                        <option value="paid">Placed (Paid)</option>
                        <option value="processing">Cutting (On the Block)</option>
                        <option value="ready_paid">Ready for Pickup (Paid)</option>
                        <option value="ready_pending">Ready (Pay at Counter)</option>
                        <option value="completed">Picked Up (Completed)</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </article>
        );
    };

    if (loading) {
        return (
            <div className={styles.adminContainer}>
                <div className={styles.loading}>Loading Butcher Block Command Center...</div>
            </div>
        );
    }

    return (
        <main className={styles.adminContainer}>
            {/* ── Header ── */}
            <header className={styles.header}>
                <div className={styles.headerTitleGroup}>
                    <h1>
                        Hofherr Meat Co. <span className={styles.headerTitleAccent}>| Admin Console</span>
                        {username && <span className={styles.adminUserBadge}>@{username}</span>}
                    </h1>
                    <p className={styles.headerSub}>
                        Live Butcher Block Queue, SLA Overdue Alerts &amp; Store Operations
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button
                        type="button"
                        onClick={handleResetDemoQueue}
                        className={styles.headerBtn}
                    >
                        ↺ Reset Demo Queue
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/inventory')}
                        className={`${styles.headerBtn} ${styles.headerBtnGold}`}
                    >
                        📦 Inventory
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/mikeyscimeca')}
                        className={styles.headerBtn}
                    >
                        👤 Customer View
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className={styles.headerBtn}
                    >
                        View Storefront
                    </button>
                    <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className={`${styles.headerBtn} ${styles.headerBtnDanger}`}
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* ── Store Switcher & Main Navigation Tabs ── */}
            <div className={styles.topBarRow}>
                {!isRestrictedAdmin && (
                    <div className={styles.storeSwitcher}>
                        <button
                            type="button"
                            onClick={() => setStoreFilter('all')}
                            className={`${styles.storeSwitchBtn} ${
                                storeFilter === 'all' ? styles.storeSwitchBtnActiveAll : ''
                            }`}
                        >
                            All Locations
                        </button>
                        <button
                            type="button"
                            onClick={() => setStoreFilter('butcher')}
                            className={`${styles.storeSwitchBtn} ${
                                storeFilter === 'butcher' ? styles.storeSwitchBtnActiveButcher : ''
                            }`}
                        >
                            🥩 The Butcher Shop
                        </button>
                        <button
                            type="button"
                            onClick={() => setStoreFilter('depot')}
                            className={`${styles.storeSwitchBtn} ${
                                storeFilter === 'depot' ? styles.storeSwitchBtnActiveDepot : ''
                            }`}
                        >
                            🏪 The Depot
                        </button>
                    </div>
                )}

                <div className={styles.tabs}>
                    <button
                        type="button"
                        className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Live Orders &amp; Queue
                        {runningBehindOrders.length > 0 && (
                            <span className={styles.tabCountBadgeWarn}>
                                {runningBehindOrders.length} Behind
                            </span>
                        )}
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Customers ({searchableCustomers.length})
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${activeTab === 'restocks' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('restocks')}
                    >
                        Restock Requests
                        <span className={styles.tabCountBadge}>
                            {restocks.filter(r => r.status === 'pending').length}
                        </span>
                    </button>
                </div>
            </div>

            {/* ── KPI Summary Row (Interactive Progress Filters) ── */}
            <div className={styles.statsGrid}>
                <button
                    type="button"
                    onClick={() => handleSelectProgressFilter('behind')}
                    className={`${styles.statCard} ${styles.statCardClickable} ${
                        runningBehindOrders.length > 0 ? styles.statCardAlert : ''
                    } ${inProgressStageFilter === 'behind' ? styles.statCardSelected : ''}`}
                >
                    <span className={styles.statLabel}>🚨 Running Behind SLA</span>
                    <span className={`${styles.statValue} ${runningBehindOrders.length > 0 ? styles.statValueDanger : ''}`}>
                        {runningBehindOrders.length} {runningBehindOrders.length === 1 ? 'Order' : 'Orders'}
                    </span>
                    <span className={styles.statSub}>Click to isolate overdue orders</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleSelectProgressFilter('placed')}
                    className={`${styles.statCard} ${styles.statCardClickable} ${
                        inProgressStageFilter === 'placed' ? styles.statCardSelected : ''
                    }`}
                >
                    <span className={styles.statLabel}>01 · Order Placed</span>
                    <span className={styles.statValue}>{placedCount} Orders</span>
                    <span className={styles.statSub}>Ticket verified &amp; waiting in queue</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleSelectProgressFilter('cutting')}
                    className={`${styles.statCard} ${styles.statCardActive} ${styles.statCardClickable} ${
                        inProgressStageFilter === 'cutting' ? styles.statCardSelected : ''
                    }`}
                >
                    <span className={styles.statLabel}>02 · Cutting (On the Block)</span>
                    <span className={`${styles.statValue} ${styles.statValueGold}`}>
                        {onTheBlockCount} Orders
                    </span>
                    <span className={styles.statSub}>Hand-cutting, weighing &amp; wrapping</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleSelectProgressFilter('ready')}
                    className={`${styles.statCard} ${styles.statCardClickable} ${
                        inProgressStageFilter === 'ready' ? styles.statCardSelected : ''
                    }`}
                >
                    <span className={styles.statLabel}>03 · Ready for Pickup</span>
                    <span className={styles.statValue}>{readyForPickupCount} Orders</span>
                    <span className={styles.statSub}>Wrapped &amp; waiting at cold case</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleSelectProgressFilter('done')}
                    className={`${styles.statCard} ${styles.statCardGreen} ${styles.statCardClickable} ${
                        inProgressStageFilter === 'done' ? styles.statCardSelectedGreen : ''
                    }`}
                >
                    <span className={styles.statLabel}>04 · Picked Up (&lt;24h)</span>
                    <span className={`${styles.statValue} ${styles.statValueGreen}`}>
                        {pickedUpCount} {pickedUpCount === 1 ? 'Order' : 'Orders'}
                    </span>
                    <span className={styles.statSub}>Green bar • Auto-archives after 1 day</span>
                </button>
            </div>

            {activeTab === 'orders' && (
                <>
                    {/* ── 🎛️ MASTER PROGRESS STAGE FILTER & SORT BAR ── */}
                    <section className={styles.progressControlBar} aria-label="Filter and sort orders by progress stage">
                        <div className={styles.progressControlHeaderRow}>
                            <div className={styles.progressControlTitleGroup}>
                                <span className={styles.progressControlKicker}>
                                    4-STAGE ORDER PROGRESS FILTER &amp; STAGE SORTER
                                </span>
                                <h2 className={styles.progressControlTitle}>
                                    Filter &amp; Sort Out Each Progress Stage
                                </h2>
                            </div>
                            <div className={styles.progressSortWrap}>
                                <span className={styles.progressSortLabel}>Sort Progress By:</span>
                                <div className={styles.progressSortBtnGroup}>
                                    {[
                                        { key: 'stage_asc', label: '↑ Stage 1 → 4 (Placed → Picked Up)' },
                                        { key: 'stage_desc', label: '↓ Stage 4 → 1 (Picked Up → Placed)' },
                                        { key: 'urgent_first', label: '🚨 Urgent / Behind First' },
                                        { key: 'total_desc', label: '💰 Highest Total' },
                                    ].map(opt => (
                                        <button
                                            key={opt.key}
                                            type="button"
                                            onClick={() =>
                                                setProgressSortBy(
                                                    opt.key as
                                                        | 'stage_asc'
                                                        | 'stage_desc'
                                                        | 'urgent_first'
                                                        | 'total_desc'
                                                )
                                            }
                                            className={`${styles.progressSortBtn} ${
                                                progressSortBy === opt.key ? styles.progressSortBtnActive : ''
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.progressStagePillGrid}>
                            {[
                                {
                                    key: 'all' as const,
                                    step: 'ALL',
                                    label: 'All Stages (Sorted 1 → 4)',
                                    sub: 'Every active & <24h order grouped by progress',
                                    count: activeBoardOrders.length,
                                    tone: 'neutral',
                                },
                                {
                                    key: 'behind' as const,
                                    step: 'SLA',
                                    label: '🚨 Running Behind',
                                    sub: 'Overdue pickup window',
                                    count: runningBehindOrders.length,
                                    tone: 'danger',
                                },
                                {
                                    key: 'placed' as const,
                                    step: 'STEP 01',
                                    label: 'Order Placed',
                                    sub: 'Ticket Verified • In Queue',
                                    count: placedCount,
                                    tone: 'stage1',
                                },
                                {
                                    key: 'cutting' as const,
                                    step: 'STEP 02',
                                    label: 'Cutting · On the Block',
                                    sub: 'Hand-Cut & Scale Weighed',
                                    count: onTheBlockCount,
                                    tone: 'stage2',
                                },
                                {
                                    key: 'ready' as const,
                                    step: 'STEP 03',
                                    label: 'Ready for Pickup',
                                    sub: 'Waiting in Cold Case',
                                    count: readyForPickupCount,
                                    tone: 'stage3',
                                },
                                {
                                    key: 'done' as const,
                                    step: 'STEP 04',
                                    label: 'Picked Up (<24h)',
                                    sub: 'Theme Green • 1-Day Retention',
                                    count: pickedUpCount,
                                    tone: 'stage4',
                                },
                            ].map(pill => {
                                const isActive = inProgressStageFilter === pill.key;
                                return (
                                    <button
                                        key={pill.key}
                                        type="button"
                                        onClick={() => handleSelectProgressFilter(pill.key)}
                                        className={`${styles.progressStageCardBtn} ${
                                            pill.tone === 'stage4' ? styles.progressStageCardBtnGreen : ''
                                        } ${pill.tone === 'danger' ? styles.progressStageCardBtnDanger : ''} ${
                                            isActive
                                                ? pill.tone === 'stage4'
                                                    ? styles.progressStageCardBtnActiveGreen
                                                    : styles.progressStageCardBtnActive
                                                : ''
                                        }`}
                                    >
                                        <div className={styles.progressStageCardTop}>
                                            <span
                                                className={`${styles.progressStageStepTag} ${
                                                    pill.tone === 'stage4'
                                                        ? styles.progressStageStepTagGreen
                                                        : ''
                                                }`}
                                            >
                                                {pill.step}
                                            </span>
                                            <span className={styles.progressStageCountBadge}>{pill.count}</span>
                                        </div>
                                        <span className={styles.progressStageCardTitle}>{pill.label}</span>
                                        <span className={styles.progressStageCardSub}>{pill.sub}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* ── 🚨 1. ORDERS RUNNING BEHIND & NEEDING IMMEDIATE ATTENTION ── */}
                    {(inProgressStageFilter === 'all' || inProgressStageFilter === 'behind') && (
                    <section className={styles.urgentSection} aria-labelledby="urgent-orders-heading">
                        <div className={styles.sectionHeaderRow}>
                            <div className={styles.sectionTitleWrap}>
                                <div className={styles.urgentKickerRow}>
                                    <span className={styles.urgentPulseDot} aria-hidden="true" />
                                    <span className={styles.urgentKicker}>
                                        SLA Alert Queue • Immediate Action Required
                                    </span>
                                </div>
                                <h2 id="urgent-orders-heading" className={styles.sectionHeading}>
                                    Orders Running Behind ({runningBehindOrders.length})
                                </h2>
                                <p className={styles.sectionSubtext}>
                                    These orders have passed their target prep milestone or have an imminent pickup window.
                                </p>
                            </div>
                        </div>

                        {runningBehindOrders.length > 0 ? (
                            <div className={styles.trackerCardsGrid}>
                                {runningBehindOrders.map(order => renderOrderTrackerCard(order, true))}
                            </div>
                        ) : (
                            <div className={styles.allClearBanner}>
                                <span>
                                    ✅ All caught up! Every active order is currently on schedule.
                                </span>
                                <button
                                    type="button"
                                    className={styles.actionBtnSecondary}
                                    onClick={handleResetDemoQueue}
                                >
                                    ↺ Restore Sample Overdue Orders
                                </button>
                            </div>
                        )}
                    </section>
                    )}

                    {/* ── 🔪 2. ALL ORDERS SORTED BY PROGRESS STAGE ── */}
                    <section className={styles.inProgressSection} aria-labelledby="in-progress-heading">
                        <div className={styles.sectionHeaderRow}>
                            <div className={styles.sectionTitleWrap}>
                                <h2 id="in-progress-heading" className={styles.sectionHeading}>
                                    {inProgressStageFilter === 'all' &&
                                        `🔪 All Orders Sorted by Progress Stage (${activeInProgressOrders.length})`}
                                    {inProgressStageFilter === 'behind' &&
                                        `🚨 Filtered: Orders Running Behind (${activeInProgressOrders.length})`}
                                    {inProgressStageFilter === 'placed' &&
                                        `01 · Filtered: Order Placed — Ticket Verified (${activeInProgressOrders.length})`}
                                    {inProgressStageFilter === 'cutting' &&
                                        `02 · Filtered: Cutting — On the Block (${activeInProgressOrders.length})`}
                                    {inProgressStageFilter === 'ready' &&
                                        `03 · Filtered: Ready for Pickup (${activeInProgressOrders.length})`}
                                    {inProgressStageFilter === 'done' &&
                                        `04 · Filtered: Picked Up <24h — Theme Green (${activeInProgressOrders.length})`}
                                </h2>
                                <p className={styles.sectionSubtext}>
                                    Live 4-stage progress trackers sorted out by stage (Step 1 Placed → Step 2 Cutting → Step 3 Ready → Step 4 Picked Up). Click any filter tab above or step on a bar to update its stage.
                                </p>
                            </div>
                            <div className={styles.stageFilterRow}>
                                {[
                                    { key: 'all', label: `All Stages (${activeBoardOrders.length})` },
                                    { key: 'behind', label: `🚨 Behind (${runningBehindOrders.length})` },
                                    { key: 'placed', label: `1 · Placed (${placedCount})` },
                                    { key: 'cutting', label: `2 · Cutting (${onTheBlockCount})` },
                                    { key: 'ready', label: `3 · Ready (${readyForPickupCount})` },
                                    { key: 'done', label: `4 · Picked Up (${pickedUpCount})` },
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() =>
                                            handleSelectProgressFilter(
                                                tab.key as
                                                    | 'all'
                                                    | 'behind'
                                                    | 'placed'
                                                    | 'cutting'
                                                    | 'ready'
                                                    | 'done'
                                            )
                                        }
                                        className={`${styles.stageFilterBtn} ${
                                            inProgressStageFilter === tab.key
                                                ? tab.key === 'done'
                                                    ? styles.stageFilterBtnActiveGreen
                                                    : styles.stageFilterBtnActive
                                                : ''
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeInProgressOrders.length > 0 ? (
                            inProgressStageFilter === 'all' &&
                            (progressSortBy === 'stage_asc' || progressSortBy === 'stage_desc') ? (
                                <div className={styles.stageGroupsStack}>
                                    {groupedStageSections.map(group => (
                                        <div
                                            key={group.key}
                                            className={`${styles.stageGroupBlock} ${
                                                group.accent === 'done' ? styles.stageGroupBlockGreen : ''
                                            }`}
                                        >
                                            <div className={styles.stageGroupHeader}>
                                                <div className={styles.stageGroupHeaderLeft}>
                                                    <span
                                                        className={`${styles.stageGroupStepPill} ${
                                                            group.accent === 'done'
                                                                ? styles.stageGroupStepPillGreen
                                                                : ''
                                                        }`}
                                                    >
                                                        {group.stepBadge}
                                                    </span>
                                                    <div>
                                                        <h3 className={styles.stageGroupTitle}>
                                                            {group.title}{' '}
                                                            <span className={styles.stageGroupCountInline}>
                                                                ({group.orders.length}{' '}
                                                                {group.orders.length === 1 ? 'Order' : 'Orders'})
                                                            </span>
                                                        </h3>
                                                        <p className={styles.stageGroupSubtitle}>
                                                            {group.subtitle}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={styles.stageGroupIsolateBtn}
                                                    onClick={() => handleSelectProgressFilter(group.key)}
                                                >
                                                    Filter Only {group.stepBadge.slice(0, 7)} →
                                                </button>
                                            </div>
                                            <div className={styles.trackerCardsGrid}>
                                                {group.orders.map(order =>
                                                    renderOrderTrackerCard(order, false)
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.trackerCardsGrid}>
                                    {activeInProgressOrders.map(order =>
                                        renderOrderTrackerCard(order, inProgressStageFilter === 'behind')
                                    )}
                                </div>
                            )
                        ) : (
                            <div className={styles.archivedEmptyQueueBox}>
                                <div className={styles.archivedEmptyQueueCopy}>
                                    <span className={styles.archivedEmptyQueueBadge}>
                                        ✓ LIVE BOARD CLEAR • EXPIRED ORDERS MOVED TO INVENTORY HISTORY
                                    </span>
                                    <h3 className={styles.archivedEmptyQueueTitle}>
                                        No Picked-Up Orders Within the Last 24 Hours
                                    </h3>
                                    <p className={styles.archivedEmptyQueueDesc}>
                                        Completed pickups automatically expire after <strong>1 day (24 hours)</strong> so they no longer appear on this live board, and are permanently logged inside <strong>Inventory History</strong>.
                                    </p>
                                </div>
                                <div className={styles.archivedEmptyQueueActions}>
                                    <button
                                        type="button"
                                        className={styles.archiveGoInventoryBtn}
                                        onClick={() => router.push('/admin/inventory?tab=purchases')}
                                    >
                                        📦 View Archived Orders in Inventory History →
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.actionBtnSecondary}
                                        onClick={handleResetDemoQueue}
                                    >
                                        ↺ Restore Demo Picked-Up Orders
                                    </button>
                                </div>
                            </div>
                        )}

                        {expiredToInventoryOrders.length > 0 && (
                            <div className={styles.inventoryArchiveNotice}>
                                <div className={styles.inventoryArchiveNoticeLeft}>
                                    <span className={styles.inventoryArchivePill}>
                                        📦 AUTO-ARCHIVED TO INVENTORY HISTORY (&gt;24H POST-PICKUP)
                                    </span>
                                    <p className={styles.inventoryArchiveText}>
                                        <strong>
                                            {expiredToInventoryOrders.length}{' '}
                                            {expiredToInventoryOrders.length === 1 ? 'picked-up order' : 'picked-up orders'}
                                        </strong>{' '}
                                        ({expiredToInventoryOrders.map(o => `#${o.orderNumber} ${o.customer?.name || o.metadata?.customer_name || 'Guest'}`).join(' • ')}) expired after 1 day and moved to Inventory History so they are no longer shown on this active board.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className={styles.archiveGoInventoryBtn}
                                    onClick={() => router.push('/admin/inventory?tab=purchases')}
                                >
                                    🧾 Open Inventory History ({expiredToInventoryOrders.length}) →
                                </button>
                            </div>
                        )}
                    </section>
                </>
            )}

            {/* ── 3. MASTER ORDERS / CUSTOMERS / RESTOCKS TABLE ── */}
            <div className={styles.tableContainer}>
                {activeTab === 'orders' ? (
                    <>
                        <div className={styles.tableSectionHeader}>
                            <h2 className={styles.sectionHeading}>All Orders Log ({filteredOrders.length})</h2>
                            {expiredToInventoryOrders.length > 0 && (
                                <button
                                    type="button"
                                    className={styles.archiveHeaderPillBtn}
                                    onClick={() => router.push('/admin/inventory?tab=purchases')}
                                >
                                    📦 {expiredToInventoryOrders.length} Picked-Up {expiredToInventoryOrders.length === 1 ? 'Order' : 'Orders'} Expired (&gt;24h) → Moved to Inventory History
                                </button>
                            )}
                        </div>
                        <div className={styles.filterContainer}>
                            <div className={styles.searchInputWrapper}>
                                <input
                                    type="text"
                                    placeholder="Search order #, customer name, or email..."
                                    value={orderSearchQuery}
                                    onChange={e => {
                                        setOrderSearchQuery(e.target.value);
                                        setOrderPage(1);
                                    }}
                                    className={styles.searchInput}
                                />
                            </div>
                            <div className={styles.filterTabs}>
                                {[
                                    {
                                        key: 'all',
                                        stageKey: 'all' as const,
                                        label: `All Active & Recent (${activeBoardOrders.length})`,
                                    },
                                    {
                                        key: 'behind',
                                        stageKey: 'behind' as const,
                                        label: `🚨 Running Behind (${runningBehindOrders.length})`,
                                    },
                                    {
                                        key: 'placed',
                                        stageKey: 'placed' as const,
                                        label: `1 · Placed (${placedCount})`,
                                    },
                                    {
                                        key: 'processing',
                                        stageKey: 'cutting' as const,
                                        label: `2 · Cutting / Block (${onTheBlockCount})`,
                                    },
                                    {
                                        key: 'ready',
                                        stageKey: 'ready' as const,
                                        label: `3 · Ready (${readyForPickupCount})`,
                                    },
                                    {
                                        key: 'completed',
                                        stageKey: 'done' as const,
                                        label: `4 · Picked Up <24h (${pickedUpCount})`,
                                    },
                                ].map(f => (
                                    <button
                                        key={f.key}
                                        type="button"
                                        onClick={() => {
                                            handleSelectProgressFilter(f.stageKey);
                                        }}
                                        className={`${styles.filterPillBtn} ${
                                            orderFilter === f.key
                                                ? f.key === 'completed'
                                                    ? styles.filterPillBtnActiveGreen
                                                    : styles.filterPillBtnActive
                                                : ''
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={styles.tableScrollArea}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        {(
                                            [
                                                ['orderNumber', 'Order #'],
                                                ['customer', 'Customer'],
                                                ['createdAt', 'Placed / Pickup'],
                                                ['items', 'Items'],
                                                ['total', 'Total'],
                                                ['status', 'Stage / Status'],
                                            ] as const
                                        ).map(([f, label]) => (
                                            <th
                                                key={f}
                                                onClick={() => handleSort(f)}
                                                className={styles.sortableTh}
                                            >
                                                {label} {sortField === f && (sortDirection === 'asc' ? '↑' : '↓')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedOrders.map(order => {
                                        const isBehind =
                                            isOrderInProgress(order.status) && (order.minutesBehind || 0) > 0;
                                        const rowBadge = getOrderCustomerBadge(order);
                                        return (
                                            <tr
                                                key={order._id}
                                                className={`${styles.rowClickable} ${
                                                    isBehind ? styles.rowBehind : ''
                                                }`}
                                                onClick={() => handleOrderRowClick(order)}
                                            >
                                                <td>
                                                    <strong>#{order.orderNumber}</strong>
                                                    {isBehind && (
                                                        <span className={styles.inlineOverdueTag}>
                                                            +{order.minutesBehind}m Behind
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className={styles.tableCustomerRow}>
                                                        <span>
                                                            {rowBadge.hasGoldStar && (
                                                                <span className={styles.customerNameGoldStar}>
                                                                    ★{' '}
                                                                </span>
                                                            )}
                                                            {order.customer?.name ||
                                                                order.metadata?.customer_name ||
                                                                'Guest'}
                                                        </span>
                                                        <span
                                                            className={`${styles.customerTierPillSm} ${
                                                                styles[`customerTier_${rowBadge.tierKey}`]
                                                            }`}
                                                        >
                                                            {rowBadge.shortLabel}
                                                        </span>
                                                    </div>
                                                    <a
                                                        href={`mailto:${order.customer?.email || order.metadata?.customer_email}`}
                                                        className={styles.tableLink}
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        {order.customer?.email || order.metadata?.customer_email}
                                                    </a>
                                                    {(order.customer?.phone || order.metadata?.customer_phone) && (
                                                        <div>
                                                            <a
                                                                href={`tel:${(order.customer?.phone || order.metadata?.customer_phone)?.replace(/\D/g, '')}`}
                                                                className={styles.tableLink}
                                                                onClick={e => e.stopPropagation()}
                                                            >
                                                                📞{' '}
                                                                {order.customer?.phone ||
                                                                    order.metadata?.customer_phone}
                                                            </a>
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className={styles.datePrimary}>
                                                        {formatAdminDate(order.createdAt)}
                                                    </div>
                                                    <div className={styles.dateSecondary}>
                                                        {order.pickupTime
                                                            ? `Pickup: ${order.pickupTime}`
                                                            : formatAdminTime(order.createdAt)}
                                                    </div>
                                                </td>
                                                <td>{order.items?.length || 0} items</td>
                                                <td>{formatCurrency((order.total || 0) / 100)}</td>
                                                <td onClick={e => e.stopPropagation()}>
                                                    <select
                                                        aria-label={`Status for order ${order.orderNumber}`}
                                                        value={order.status || 'pending'}
                                                        onChange={e =>
                                                            handleStatusChange(order._id, e.target.value, true)
                                                        }
                                                        className={`${styles.statusDropdown} ${
                                                            styles[`status_${order.status || 'pending'}`]
                                                        }`}
                                                    >
                                                        <option value="pending">Pending (Unpaid)</option>
                                                        <option value="paid">Placed (Paid)</option>
                                                        <option value="processing">On the Block (Cutting)</option>
                                                        <option value="ready_paid">Ready (Paid)</option>
                                                        <option value="ready_pending">Ready (Unpaid)</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={orderPage}
                            totalPages={totalOrderPages}
                            onPageChange={setOrderPage}
                        />
                    </>
                ) : activeTab === 'users' ? (
                    <div className={styles.tabPanelInner}>
                        <div className={styles.filterContainer}>
                            <div className={styles.searchInputWrapper}>
                                <input
                                    type="text"
                                    placeholder="Search customers by name, email, or phone..."
                                    value={customerSearchQuery}
                                    onChange={e => {
                                        setCustomerSearchQuery(e.target.value);
                                        setCustomerSearchPage(1);
                                    }}
                                    className={styles.searchInput}
                                />
                            </div>
                        </div>
                        <div className={styles.tableScrollArea}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Customer Info</th>
                                        <th>Account Age</th>
                                        <th>Spend to Date</th>
                                        <th>Auth Status</th>
                                        <th>Item History</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCustomers.length > 0 ? (
                                        paginatedCustomers.map(customer => {
                                            const ageStr = customer.firstDate
                                                ? customer.firstDate.slice(0, 10)
                                                : '—';
                                            return (
                                                <tr
                                                    key={customer._id}
                                                    className={styles.rowClickable}
                                                    onClick={() =>
                                                        setSelectedCustomerMeta({
                                                            user: customer,
                                                            orders: customer.orders,
                                                            lifetimeSpend: customer.lifetimeSpend,
                                                            tierName: customer.tierName,
                                                            points: customer.points,
                                                        })
                                                    }
                                                >
                                                    <td>
                                                        <div className={styles.tableCustomerRow}>
                                                            <span className={styles.customerNameCell}>
                                                                {customer.spendBadge?.hasGoldStar && (
                                                                    <span className={styles.customerNameGoldStar}>
                                                                        ★{' '}
                                                                    </span>
                                                                )}
                                                                {customer.name}
                                                            </span>
                                                            {customer.spendBadge && (
                                                                <span
                                                                    className={`${styles.customerTierPillSm} ${
                                                                        styles[`customerTier_${customer.spendBadge.tierKey}`]
                                                                    }`}
                                                                >
                                                                    {customer.spendBadge.shortLabel}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <a
                                                            href={`mailto:${customer.email}`}
                                                            className={styles.tableLink}
                                                            onClick={e => e.stopPropagation()}
                                                        >
                                                            {customer.email}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <span className={styles.customerAgeText}>
                                                            Since {ageStr}
                                                        </span>
                                                    </td>
                                                    <td className={styles.customerSpendCell}>
                                                        {formatCurrency(customer.lifetimeSpend)}
                                                        <div className={styles.customerOrderCountSub}>
                                                            {customer.orders.length} Orders
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {customer.isRegistered ? (
                                                            <div className={styles.authStatusStack}>
                                                                <span className={styles.memberBadge}>MEMBER</span>
                                                                {customer.hasPassword ? (
                                                                    <span className={styles.passwordOkText}>
                                                                        ✓ Password Set
                                                                    </span>
                                                                ) : (
                                                                    <span className={styles.passwordWarnText}>
                                                                        ⚠ No Password
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className={styles.guestBadge}>GUEST</span>
                                                        )}
                                                    </td>
                                                    <td className={styles.itemHistoryCell}>
                                                        {customer.itemStrings?.slice(0, 3).join(', ')}
                                                        {(customer.itemStrings?.length || 0) > 3 ? '...' : ''}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className={styles.emptyTableCell}>
                                                No customers found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={customerSearchPage}
                            totalPages={totalPages}
                            onPageChange={setCustomerSearchPage}
                        />
                    </div>
                ) : (
                    <div className={styles.tabPanelInner}>
                        <div className={styles.tableScrollArea}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Date Submitted</th>
                                        <th>Requested Item</th>
                                        <th>Qty</th>
                                        <th>Store</th>
                                        <th>Customer Contact</th>
                                        <th>Status</th>
                                        <th className={styles.alignRight}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {restocks.length > 0 ? (
                                        restocks.map(r => {
                                            const isNotified = r.status === 'notified';
                                            return (
                                                <tr key={r._id}>
                                                    <td>{formatAdminDate(r.createdAt)}</td>
                                                    <td>
                                                        <strong>{r.item}</strong>
                                                    </td>
                                                    <td>{r.qty}</td>
                                                    <td>
                                                        <span
                                                            className={
                                                                r.store === 'depot'
                                                                    ? styles.storePillDepot
                                                                    : styles.storePillButcher
                                                            }
                                                        >
                                                            {r.store}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className={styles.customerNameCell}>
                                                            {r.customerName}
                                                        </div>
                                                        <div className={styles.dateSecondary}>
                                                            {r.contactType}: {r.contactValue || 'N/A'}
                                                            {r.customerEmail && r.customerEmail !== r.contactValue
                                                                ? ` • ${r.customerEmail}`
                                                                : ''}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={
                                                                isNotified
                                                                    ? styles.restockStatusFilled
                                                                    : styles.restockStatusPending
                                                            }
                                                        >
                                                            {isNotified ? '✓ Filled & Emailed' : '⏳ Pending'}
                                                        </span>
                                                    </td>
                                                    <td className={styles.alignRight}>
                                                        <div className={styles.restockActionGroup}>
                                                            {!isNotified && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleFillRestock(r)}
                                                                    className={styles.fillRestockBtn}
                                                                >
                                                                    ✓ Fill &amp; Notify
                                                                </button>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteRestock(r._id)}
                                                                className={styles.deleteRestockBtn}
                                                            >
                                                                ✕ Remove
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className={styles.emptyTableCell}>
                                                No restock requests yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ── 4. ANALYTICS & STORE METRICS ── */}
            {rechartsMod &&
                (() => {
                    const {
                        PieChart,
                        Pie,
                        Cell,
                        Tooltip: RechartsTooltip,
                        ResponsiveContainer,
                        BarChart,
                        Bar,
                        XAxis,
                        YAxis,
                        CartesianGrid,
                        Legend,
                    } = rechartsMod;
                    return (
                        <div className={styles.metricsContainer}>
                            <div className={styles.chartCard}>
                                <h3>Order Stage Breakdown</h3>
                                <div className={styles.chartWrapper}>
                                    {pieData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={240}>
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={58}
                                                    outerRadius={80}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                >
                                                    {pieData.map(entry => (
                                                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className={styles.emptyChart}>No order data yet</div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.chartCard}>
                                <h3>Recent Revenue</h3>
                                <div className={styles.chartWrapper}>
                                    {barData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={240}>
                                            <BarChart
                                                data={barData}
                                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#222"
                                                    vertical={false}
                                                />
                                                <XAxis
                                                    dataKey="date"
                                                    stroke="#888"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <YAxis
                                                    stroke="#888"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickFormatter={v => `$${v}`}
                                                />
                                                <RechartsTooltip />
                                                <Bar dataKey="revenue" fill="#cc0e1d" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className={styles.emptyChart}>No revenue data yet</div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.chartCard}>
                                <h3>Revenue by Category</h3>
                                <div className={styles.chartWrapper}>
                                    {categoryData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={240}>
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={60}
                                                    dataKey="value"
                                                    stroke="none"
                                                    label={props =>
                                                        `${props.name} ${((props.percent || 0) * 100).toFixed(0)}%`
                                                    }
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${entry.name}`}
                                                            fill={COLORS[index % COLORS.length]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className={styles.emptyChart}>No category data yet</div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.chartCard}>
                                <h3>🔥 Top 5 Cuts Ordered</h3>
                                <div className={styles.chartWrapper}>
                                    {topItemsData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={240}>
                                            <BarChart
                                                data={topItemsData}
                                                layout="vertical"
                                                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#222"
                                                    horizontal={false}
                                                />
                                                <XAxis
                                                    type="number"
                                                    stroke="#888"
                                                    fontSize={12}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    allowDecimals={false}
                                                />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    stroke="#aaa"
                                                    fontSize={11}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    width={130}
                                                />
                                                <RechartsTooltip />
                                                <Bar dataKey="quantity" fill="#cc0e1d" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className={styles.emptyChart}>No item data yet</div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.chartCard}>
                                <h3>🏆 Top Customers</h3>
                                <div className={styles.vipListWrap}>
                                    {vipData.length > 0 ? (
                                        vipData.map((vip, i) => {
                                            const maxSpend = vipData[0]?.spend || 1;
                                            const pct = Math.round((vip.spend / maxSpend) * 100);
                                            const medals = ['🥇', '🥈', '🥉', '4.', '5.'];
                                            const barStyle = {
                                                '--vip-width': `${pct}%`,
                                            } as React.CSSProperties;
                                            return (
                                                <div key={`${vip.name}-${vip.spend}`} className={styles.vipRow}>
                                                    <span className={styles.vipMedal}>{medals[i]}</span>
                                                    <div className={styles.vipBarCol}>
                                                        <div className={styles.vipMetaRow}>
                                                            <span className={styles.vipName}>{vip.name}</span>
                                                            <span className={styles.vipSpend}>
                                                                {formatCurrency(vip.spend)}
                                                            </span>
                                                        </div>
                                                        <div className={styles.vipTrack}>
                                                            <div
                                                                className={styles.vipFill}
                                                                style={barStyle}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className={styles.emptyChart}>No customer data yet</div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.chartCard}>
                                <h3>👥 New vs Returning</h3>
                                <div className={styles.vipBarCol}>
                                    {customerTypesData.some(d => d.value > 0) ? (
                                        <>
                                            <ResponsiveContainer width="100%" height={175}>
                                                <PieChart>
                                                    <Pie
                                                        data={customerTypesData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={48}
                                                        outerRadius={70}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        startAngle={90}
                                                        endAngle={-270}
                                                    >
                                                        <Cell fill="#cc0e1d" />
                                                        <Cell fill="#a8905f" />
                                                    </Pie>
                                                    <RechartsTooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className={styles.customerSplitGrid}>
                                                <div className={styles.splitBoxNew}>
                                                    <div className={styles.splitBoxLabel}>New Customers</div>
                                                    <div className={styles.splitBoxVal}>{newCustCount}</div>
                                                    <div className={styles.splitBoxSub}>
                                                        AOV {formatCurrency(newAOV)}
                                                    </div>
                                                </div>
                                                <div className={styles.splitBoxRet}>
                                                    <div className={styles.splitBoxLabel}>Returning</div>
                                                    <div className={styles.splitBoxVal}>{retCustCount}</div>
                                                    <div className={styles.splitBoxSub}>
                                                        AOV {formatCurrency(retAOV)}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={styles.emptyChart}>No customer data yet</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })()}

            {/* ── Customer Detail Modal ── */}
            {selectedCustomerMeta && (
                <dialog
                    open
                    className={styles.modalOverlay}
                    aria-label="Customer details"
                >
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <div>
                                <h2 className={styles.modalTitle}>{selectedCustomerMeta.user.name}</h2>
                                <div className={styles.modalContactStack}>
                                    <a
                                        href={`mailto:${selectedCustomerMeta.user.email}`}
                                        className={styles.tableLink}
                                    >
                                        ✉️ {selectedCustomerMeta.user.email}
                                    </a>
                                    {selectedCustomerMeta.user.phone && (
                                        <a
                                            href={`tel:${selectedCustomerMeta.user.phone}`}
                                            className={styles.tableLink}
                                        >
                                            📞 {selectedCustomerMeta.user.phone}
                                        </a>
                                    )}
                                </div>
                            </div>
                            <button
                                type="button"
                                className={styles.modalClose}
                                aria-label="Close modal"
                                onClick={() => setSelectedCustomerMeta(null)}
                            >
                                &times;
                            </button>
                        </div>
                        <div className={styles.modalInsightsGrid}>
                            <div className={styles.insightBox}>
                                <div>Spend</div>
                                <strong>{formatCurrency(selectedCustomerMeta.lifetimeSpend)}</strong>
                            </div>
                            <div className={styles.insightBox}>
                                <div>Tier</div>
                                <strong>{selectedCustomerMeta.tierName}</strong>
                            </div>
                            <div className={styles.insightBox}>
                                <div>Orders</div>
                                <strong>{selectedCustomerMeta.orders.length}</strong>
                            </div>
                            <div className={styles.insightBox}>
                                <div>Points</div>
                                <strong>{selectedCustomerMeta.points.toFixed(0)}</strong>
                            </div>
                        </div>
                        <h3 className={styles.modalSectionHeading}>Purchase History</h3>
                        <div className={styles.modalOrderList}>
                            {selectedCustomerMeta.orders.map(order => (
                                <div key={order._id} className={styles.modalOrderCard}>
                                    <div className={styles.modalOrderTop}>
                                        <strong>Order #{order.orderNumber}</strong>
                                        <div className={styles.alignRight}>
                                            <div className={styles.datePrimary}>
                                                {formatAdminDate(order.createdAt)}
                                            </div>
                                            <div className={styles.dateSecondary}>
                                                {formatAdminTime(order.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.modalOrderItems}>
                                        {order.items
                                            ?.map(i => `${i.qty || i.quantity || 1}x ${i.name}`)
                                            .join(', ')}
                                    </div>
                                    <div className={styles.modalOrderBottom}>
                                        <span className={styles.status}>{order.status}</span>
                                        <span className={styles.vipSpend}>
                                            {formatCurrency((order.total || 0) / 100)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </dialog>
            )}
        </main>
    );
}
