'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import type * as RechartsModule from 'recharts';
import styles from './admin.module.css';
import Pagination from '@/components/shared/Pagination';

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
    contactType: string;
    contactValue?: string;
    status?: string;
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
            name: 'claire.bennett@glencoe.net',
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
            { name: 'Rotisserie Heritage Half Chicken Meal', qty: 2, price: 24 },
            { name: 'Charred Broccolini with Chili & Lemon', qty: 2, price: 8 },
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
    { key: 'placed', short: 'Placed', title: 'Order Placed', targetStatus: 'paid' },
    { key: 'cutting', short: 'Cutting', title: 'On the Block', targetStatus: 'processing' },
    { key: 'ready', short: 'Ready', title: 'Ready for Pickup', targetStatus: 'ready_paid' },
    { key: 'done', short: 'Picked Up', title: 'Picked Up', targetStatus: 'completed' },
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
    const [inProgressStageFilter, setInProgressStageFilter] = useState<'all' | 'placed' | 'cutting' | 'ready'>('all');
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

    const [sortField, setSortField] = useState<'orderNumber' | 'customer' | 'createdAt' | 'items' | 'total' | 'status'>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
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

    const handleResetDemoQueue = () => {
        setRawOrders(prev => {
            const nonDemo = prev.filter(o => !o._id.startsWith('demo-'));
            return [...SEED_ADMIN_ORDERS, ...nonDemo];
        });
    };

    const handleDeleteRestock = async (id: string) => {
        if (!confirm('Mark this restock request as resolved and remove it from the list?')) return;
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

    const activeInProgressOrders = useMemo(() => {
        const list = orders.filter(o => isOrderInProgress(o.status));
        if (inProgressStageFilter === 'placed') {
            return list.filter(o => o.status === 'pending' || o.status === 'paid');
        }
        if (inProgressStageFilter === 'cutting') {
            return list.filter(o => o.status === 'processing');
        }
        if (inProgressStageFilter === 'ready') {
            return list.filter(o => o.status === 'ready_paid' || o.status === 'ready_pending');
        }
        return list;
    }, [orders, inProgressStageFilter]);

    const allInProgressCount = orders.filter(o => isOrderInProgress(o.status)).length;
    const onTheBlockCount = orders.filter(o => o.status === 'processing').length;
    const readyForPickupCount = orders.filter(
        o => o.status === 'ready_paid' || o.status === 'ready_pending'
    ).length;

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

    const filteredOrders = orders.filter(o => {
        let matchesStatus = true;
        if (orderFilter !== 'all') {
            if (orderFilter === 'behind') {
                matchesStatus = isOrderInProgress(o.status) && (o.minutesBehind || 0) > 0;
            } else if (orderFilter === 'in_progress') {
                matchesStatus = isOrderInProgress(o.status);
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
                valA = (a.status || 'pending').toLowerCase();
                valB = (b.status || 'pending').toLowerCase();
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
            const points = c.lifetimeSpend + 50;
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
            return { ...c, points, tierName, itemStrings };
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

    const renderOrderTrackerCard = (order: Order, isUrgentCard = false) => {
        const stageIdx = getStageIndex(order.status);
        const stageObj = ADMIN_TRACKER_STAGES[stageIdx] || ADMIN_TRACKER_STAGES[0];
        const storeKey = order.metadata?.store_id === 'depot' ? 'depot' : 'butcher';
        const storeInfo = ADMIN_STORE_INFO[storeKey];
        const isBehind = (order.minutesBehind || 0) > 0;
        const phoneStr = order.customer?.phone || order.metadata?.customer_phone || '';
        const customerName = order.customer?.name || order.metadata?.customer_name || 'Guest';

        let etaText = order.pickupTime ? `Pickup · ${order.pickupTime}` : 'In Queue';
        if (stageIdx === 1 && order.pickupTime) {
            etaText = `~12 MINS · ${order.pickupTime}`;
        } else if (stageIdx === 0 && order.pickupTime) {
            etaText = `~25 MINS · ${order.pickupTime}`;
        } else if (stageIdx === 2) {
            etaText = 'READY NOW';
        }

        return (
            <article
                key={`${isUrgentCard ? 'urgent' : 'active'}-${order._id}`}
                className={`${styles.trackerCard} ${isBehind ? styles.trackerCardBehind : ''}`}
            >
                <div className={styles.trackerTop}>
                    <div>
                        <div className={styles.trackerKickerRow}>
                            <span
                                className={`${styles.trackerDot} ${
                                    isBehind ? styles.trackerDotUrgent : ''
                                }`}
                                aria-hidden="true"
                            />
                            <span className={styles.trackerKicker}>
                                ACTIVE ORDER #{order.orderNumber} • STEP {stageIdx + 1} OF 4
                            </span>
                            {isBehind && (
                                <span className={styles.overduePill}>
                                    ⚠ +{order.minutesBehind}M BEHIND
                                </span>
                            )}
                        </div>
                        <h3 className={styles.trackerStageTitle}>{stageObj.title}</h3>
                    </div>
                    <div className={styles.trackerEtaBox}>
                        <div className={styles.trackerKicker}>
                            {isBehind ? 'SLA OVERDUE TARGET' : 'ESTIMATED READY TIME'}
                        </div>
                        <div
                            className={`${styles.trackerEtaValue} ${
                                isBehind ? styles.trackerEtaUrgent : ''
                            }`}
                        >
                            {etaText}
                        </div>
                    </div>
                </div>

                {/* 4-Stage Interactive Pill Progress Bar (matches /dashboard tracker) */}
                <ol className={styles.trackerBar} aria-label={`Order ${order.orderNumber} progress`}>
                    {ADMIN_TRACKER_STAGES.map((stage, i) => {
                        const finished = order.status === 'completed';
                        const done = i < stageIdx || finished;
                        const active = !finished && i === stageIdx;
                        const stateClass = done
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
                            <strong>👤 {customerName}</strong>
                            {phoneStr && (
                                <a
                                    href={`tel:${phoneStr.replace(/\D/g, '')}`}
                                    className={styles.urgentCustomerPhone}
                                >
                                    📞 {phoneStr}
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
                        onClick={() => router.push('/dashboard')}
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

            {/* ── KPI Summary Row ── */}
            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${runningBehindOrders.length > 0 ? styles.statCardAlert : ''}`}>
                    <span className={styles.statLabel}>🚨 Running Behind SLA</span>
                    <span className={`${styles.statValue} ${runningBehindOrders.length > 0 ? styles.statValueDanger : ''}`}>
                        {runningBehindOrders.length} {runningBehindOrders.length === 1 ? 'Order' : 'Orders'}
                    </span>
                    <span className={styles.statSub}>Needs immediate butcher / counter action</span>
                </div>
                <div className={`${styles.statCard} ${styles.statCardActive}`}>
                    <span className={styles.statLabel}>🔪 Active In-Progress</span>
                    <span className={`${styles.statValue} ${styles.statValueGold}`}>
                        {allInProgressCount} Orders
                    </span>
                    <span className={styles.statSub}>
                        {onTheBlockCount} on the block • {readyForPickupCount} ready at counter
                    </span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>📦 Ready for Pickup</span>
                    <span className={styles.statValue}>{readyForPickupCount} Orders</span>
                    <span className={styles.statSub}>Wrapped &amp; waiting for customer arrival</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>💰 Active &amp; Recent Volume</span>
                    <span className={styles.statValue}>{formatCurrency(totalRevenue)}</span>
                    <span className={styles.statSub}>Across {orders.length} tracked orders</span>
                </div>
            </div>

            {activeTab === 'orders' && (
                <>
                    {/* ── 🚨 1. ORDERS RUNNING BEHIND & NEEDING IMMEDIATE ATTENTION ── */}
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

                    {/* ── 🔪 2. ALL ORDERS CURRENTLY IN PROGRESS ── */}
                    <section className={styles.inProgressSection} aria-labelledby="in-progress-heading">
                        <div className={styles.sectionHeaderRow}>
                            <div className={styles.sectionTitleWrap}>
                                <h2 id="in-progress-heading" className={styles.sectionHeading}>
                                    🔪 All Orders Currently In Progress ({activeInProgressOrders.length})
                                </h2>
                                <p className={styles.sectionSubtext}>
                                    Live 4-stage progress trackers for every order currently placed, on the block, or waiting for pickup. Click any step on a bar to update its stage.
                                </p>
                            </div>
                            <div className={styles.stageFilterRow}>
                                {[
                                    { key: 'all', label: `All In Progress (${allInProgressCount})` },
                                    {
                                        key: 'placed',
                                        label: `1 · Placed (${orders.filter(o => o.status === 'pending' || o.status === 'paid').length})`,
                                    },
                                    { key: 'cutting', label: `2 · Cutting (${onTheBlockCount})` },
                                    { key: 'ready', label: `3 · Ready (${readyForPickupCount})` },
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() =>
                                            setInProgressStageFilter(
                                                tab.key as 'all' | 'placed' | 'cutting' | 'ready'
                                            )
                                        }
                                        className={`${styles.stageFilterBtn} ${
                                            inProgressStageFilter === tab.key
                                                ? styles.stageFilterBtnActive
                                                : ''
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.trackerCardsGrid}>
                            {activeInProgressOrders.map(order => renderOrderTrackerCard(order, false))}
                        </div>
                    </section>
                </>
            )}

            {/* ── 3. MASTER ORDERS / CUSTOMERS / RESTOCKS TABLE ── */}
            <div className={styles.tableContainer}>
                {activeTab === 'orders' ? (
                    <>
                        <div className={styles.tableSectionHeader}>
                            <h2 className={styles.sectionHeading}>All Orders Log ({filteredOrders.length})</h2>
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
                                    { key: 'all', label: `All (${orders.length})` },
                                    { key: 'behind', label: `🚨 Running Behind (${runningBehindOrders.length})` },
                                    { key: 'in_progress', label: `🔪 In Progress (${allInProgressCount})` },
                                    { key: 'processing', label: `On the Block (${onTheBlockCount})` },
                                    { key: 'ready', label: `Ready (${readyForPickupCount})` },
                                    {
                                        key: 'completed',
                                        label: `Completed (${orders.filter(o => o.status === 'completed').length})`,
                                    },
                                ].map(f => (
                                    <button
                                        key={f.key}
                                        type="button"
                                        onClick={() => {
                                            setOrderFilter(f.key);
                                            setOrderPage(1);
                                        }}
                                        className={`${styles.filterPillBtn} ${
                                            orderFilter === f.key ? styles.filterPillBtnActive : ''
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
                                                    <div>
                                                        {order.customer?.name ||
                                                            order.metadata?.customer_name ||
                                                            'Guest'}
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
                                                        <div className={styles.customerNameCell}>
                                                            {customer.name}
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
                                        <th className={styles.alignRight}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {restocks.length > 0 ? (
                                        restocks.map(r => (
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
                                                    </div>
                                                </td>
                                                <td className={styles.alignRight}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteRestock(r._id)}
                                                        className={styles.deleteRestockBtn}
                                                    >
                                                        ✕ Resolve
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className={styles.emptyTableCell}>
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
