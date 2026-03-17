'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import styles from './admin.module.css';
import Pagination from '@/components/shared/Pagination';

interface Order {
    _id: string;
    orderNumber: string;
    customer: { name: string; email: string };
    total: number;
    status: string;
    createdAt: string;
    items: any[];
    pickupTime?: string;
    couponCode?: string;
    metadata?: {
        store_id?: string;
        customer_name?: string;
        customer_email?: string;
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

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [rawOrders, setRawOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'orders' | 'users'>('orders');
    const [orderFilter, setOrderFilter] = useState<string>('all');
    const [storeFilter, setStoreFilter] = useState<'all' | 'butcher' | 'depot'>('all');
    const { data: session } = useSession();
    const isRestrictedAdmin = session?.user?.email === 'butcher@hofherrmeats.com' || session?.user?.email === 'depot@hofherrmeats.com';

    useEffect(() => {
        if (session?.user?.email === 'butcher@hofherrmeats.com') setStoreFilter('butcher');
        else if (session?.user?.email === 'depot@hofherrmeats.com') setStoreFilter('depot');
    }, [session]);

    const orders = React.useMemo(() => {
        if (storeFilter === 'all') return rawOrders;
        return rawOrders.filter(o => o.metadata?.store_id === storeFilter);
    }, [rawOrders, storeFilter]);

    const [sortField, setSortField] = useState<'orderNumber'|'customer'|'createdAt'|'items'|'total'|'status'>('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [selectedCustomerMeta, setSelectedCustomerMeta] = useState<{
        user: any;
        orders: Order[];
        lifetimeSpend: number;
        tierName: string;
        points: number;
    } | null>(null);
    const [customerSearchQuery, setCustomerSearchQuery] = useState('');
    const [customerSearchPage, setCustomerSearchPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [orderPage, setOrderPage] = useState(1);
    const [orderSearchQuery, setOrderSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/admin/data');
                if (!res.ok) {
                    router.push('/admin/login');
                    return;
                }
                const data = await res.json();
                setRawOrders(data.orders || []);
                setProducts(data.products || []);
                setCategories(data.categories || []);
            } catch (err) {
                console.error('Admin init error:', err);
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch(`/api/admin/customers?page=${customerSearchPage}&limit=50&query=${encodeURIComponent(customerSearchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data.users || []);
                    setTotalUsers(data.total || 0);
                }
            } catch (err) {
                console.error('Customer fetch error:', err);
            }
        };
        fetchCustomers();
    }, [customerSearchPage, customerSearchQuery]);



    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/order-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            });
            if (res.ok) {
                setRawOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            } else {
                alert('Failed to update status');
            }
        } catch (err) {
            console.error('Update status error:', err);
            alert('Failed to update status');
        }
    };

    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0) / 100;
    const aov = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Process data for Pie Chart (Order Status)
    const statusCounts = orders.reduce((acc, order) => {
        const s = order.status || 'pending';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const STATUS_COLORS: Record<string, string> = {
        pending: '#f59e0b',
        paid: '#3b82f6',
        ready_paid: '#10b981',
        ready_pending: '#10b981',
        processing: '#8b5cf6',
        completed: '#10b981',
        cancelled: '#ef4444'
    };

    const pieData = Object.keys(statusCounts).map(k => {
        let name = k.charAt(0).toUpperCase() + k.slice(1);
        if (k === 'ready_paid') name = 'Ready (Paid)';
        if (k === 'ready_pending') name = 'Ready (Unpaid)';
        return {
            name,
            value: statusCounts[k],
            color: STATUS_COLORS[k.toLowerCase()] || '#94a3b8'
        };
    });

    const COLORS = ['#800020', '#9a1030', '#600018', '#c4302b', '#4E3629']; 

    const revenueByDate = orders.reduce((acc, order) => {
        const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        acc[dateStr] = (acc[dateStr] || 0) + ((order.total || 0) / 100);
        return acc;
    }, {} as Record<string, number>);

    const barData = Object.keys(revenueByDate).map(date => ({
        date,
        revenue: revenueByDate[date]
    })).sort((a, b) => new Date(`${a.date} ${new Date().getFullYear()}`).getTime() - new Date(`${b.date} ${new Date().getFullYear()}`).getTime()).slice(-7);

    const customerStats = orders.reduce((acc, order) => {
        const identifier = order.customer?.email || 'guest';
        if (identifier !== 'guest') {
            if (!acc[identifier]) acc[identifier] = { count: 0, spend: 0 };
            acc[identifier].count += 1;
            acc[identifier].spend += (order.total || 0) / 100;
        }
        return acc;
    }, {} as Record<string, { count: number, spend: number }>);

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
        { name: 'Returning', value: retCustCount }
    ];

    const newAOV = newCustCount > 0 ? newCustSpend / newCustCount : 0;
    const retAOV = retCustCount > 0 ? retCustSpend / retCustCount : 0;
    const returningValueIncrease = newAOV > 0 ? ((retAOV - newAOV) / newAOV * 100).toFixed(0) : 0;

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
                    if (lcName.match(/beef|ribeye|steak|brisket|strip|filet|tenderloin|chuck|sirloin|burger/)) categoryName = 'Beef';
                    else if (lcName.match(/pork|ribs|bacon|belly/)) categoryName = 'Pork';
                    else if (lcName.match(/chicken|poultry|turkey/)) categoryName = 'Poultry';
                    else if (lcName.match(/sausage|brat|chorizo|kielbasa/)) categoryName = 'Sausages';
                    else if (lcName.match(/lamb/)) categoryName = 'Lamb';
                    else categoryName = 'Other';
                }
                let itemPrice = 0;
                if (typeof item.price === 'string') {
                    const match = item.price.match(/\d+(?:\.\d+)?/);
                    itemPrice = match ? parseFloat(match[0]) : 0;
                } else if (typeof item.price === 'number') {
                    itemPrice = item.price;
                }
                const itemTotal = itemPrice * (item.qty || 1);
                acc[categoryName] = (acc[categoryName] || 0) + itemTotal;
            });
        }
        return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryRevenue)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const pickupBins = [
        { name: '10am-12pm', orders: 0 },
        { name: '12pm-2pm', orders: 0 },
        { name: '2pm-4pm', orders: 0 },
        { name: '4pm-6pm', orders: 0 },
        { name: '6pm-Close', orders: 0 }
    ];

    orders.forEach(order => {
        if (!order.pickupTime) return;
        const [time, period] = order.pickupTime.split(' ');
        let hour = parseInt(time.split(':')[0]);
        if (period?.toLowerCase() === 'pm' && hour !== 12) hour += 12;
        if (period?.toLowerCase() === 'am' && hour === 12) hour = 0;
        if (hour < 12) pickupBins[0].orders++;
        else if (hour < 14) pickupBins[1].orders++;
        else if (hour < 16) pickupBins[2].orders++;
        else if (hour < 18) pickupBins[3].orders++;
        else pickupBins[4].orders++;
    });

    const sizeBuckets = [
        { name: 'Light (<$25)', value: 0 },
        { name: 'Standard ($25-$75)', value: 0 },
        { name: 'Premium (>$75)', value: 0 }
    ];

    orders.forEach(o => {
        const amt = (o.total || 0) / 100;
        if (amt < 25) sizeBuckets[0].value++;
        else if (amt < 75) sizeBuckets[1].value++;
        else sizeBuckets[2].value++;
    });

    const vipData = users
        .map(u => {
            const userOrders = orders.filter(o => o.customer?.email?.toLowerCase() === u.email?.toLowerCase());
            const spend = userOrders.reduce((acc, o) => acc + (o.total || 0) / 100, 0);
            return { name: u.name, spend };
        })
        .sort((a, b) => b.spend - a.spend)
        .slice(0, 5);

    const promoDataRaw = orders.reduce((acc, order) => {
        if (order.couponCode) {
            const code = order.couponCode.toUpperCase();
            if (!acc[code]) acc[code] = { uses: 0, revenue: 0 };
            acc[code].uses += 1;
            acc[code].revenue += (order.total || 0) / 100;
        }
        return acc;
    }, {} as Record<string, { uses: number, revenue: number }>);
    
    const promoData = Object.keys(promoDataRaw).map(code => ({
        name: code,
        Uses: promoDataRaw[code].uses,
        Revenue: promoDataRaw[code].revenue
    })).sort((a, b) => b.Uses - a.Uses);

    const pendingPrep = orders.filter(o => o.status === 'pending' || o.status === 'paid').length;

    const dayData = [
        { name: 'Mon', orders: 0 },
        { name: 'Tue', orders: 0 },
        { name: 'Wed', orders: 0 },
        { name: 'Thu', orders: 0 },
        { name: 'Fri', orders: 0 },
        { name: 'Sat', orders: 0 },
        { name: 'Sun', orders: 0 },
    ];

    orders.forEach(order => {
        const day = new Date(order.createdAt).getDay();
        const adjustedIdx = (day + 6) % 7; 
        dayData[adjustedIdx].orders++;
    });

    const handleSort = (field: 'orderNumber'|'customer'|'createdAt'|'items'|'total'|'status') => {
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
            if (orderFilter === 'ready') matchesStatus = o.status === 'ready_paid' || o.status === 'ready_pending';
            else matchesStatus = o.status === orderFilter;
        }
        let matchesSearch = true;
        if (orderSearchQuery) {
            const query = orderSearchQuery.toLowerCase();
            const nameMatches = (o.customer?.name || '').toLowerCase().includes(query);
            const emailMatches = (o.customer?.email || '').toLowerCase().includes(query);
            const orderNumMatches = (o.orderNumber || '').toString().toLowerCase().includes(query);
            matchesSearch = nameMatches || emailMatches || orderNumMatches;
        }
        return matchesStatus && matchesSearch;
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        let valA: string | number;
        let valB: string | number;
        switch (sortField) {
            case 'orderNumber': valA = a.orderNumber?.toString() || ''; valB = b.orderNumber?.toString() || ''; break;
            case 'customer': valA = (a.customer?.name || 'Guest').toLowerCase(); valB = (b.customer?.name || 'Guest').toLowerCase(); break;
            case 'createdAt': valA = new Date(a.createdAt).getTime(); valB = new Date(b.createdAt).getTime(); break;
            case 'items': valA = a.items?.length || 0; valB = b.items?.length || 0; break;
            case 'total': valA = a.total || 0; valB = b.total || 0; break;
            case 'status': valA = (a.status || 'pending').toLowerCase(); valB = (b.status || 'pending').toLowerCase(); break;
            default: valA = new Date(a.createdAt).getTime(); valB = new Date(b.createdAt).getTime(); break;
        }
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const handleOrderRowClick = (order: Order) => {
        const orderEmail = order.customer?.email?.toLowerCase() || order.metadata?.customer_email?.toLowerCase();
        if (!orderEmail) return;
        let user = users.find(u => u.email?.toLowerCase() === orderEmail);
        if (!user) {
            user = {
                _id: 'guest-' + orderEmail,
                name: order.customer?.name || order.metadata?.customer_name || 'Guest Checkout',
                email: orderEmail,
                phone: '',
            } as User;
        }
        const userOrders = orders.filter(o => (o.customer?.email || o.metadata?.customer_email || '').toLowerCase() === orderEmail);
        let lifetimeSpend = 0;
        userOrders.forEach((o) => { lifetimeSpend += (o.total || 0) / 100; });
        const points = lifetimeSpend + 50;
        let tierName = 'Sausage';
        if (points >= 1000) tierName = 'Master';
        else if (points >= 500) tierName = 'Ribeye';
        else if (points >= 200) tierName = 'Chop';
        setSelectedCustomerMeta({ user, orders: userOrders, lifetimeSpend, tierName, points });
    };

    const searchableCustomers = React.useMemo(() => {
        const customerMap = new Map<string, {
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
        }>();
        orders.forEach(o => {
            const email = (o.customer?.email || o.metadata?.customer_email || '').toLowerCase();
            if (!email) return;
            let c = customerMap.get(email);
            if (!c) {
                c = {
                    email,
                    name: o.customer?.name || o.metadata?.customer_name || 'Guest',
                    phone: '',
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
            if (new Date(o.createdAt) > new Date(c.lastOrderDate)) { c.lastOrderDate = o.createdAt; }
            if (new Date(o.createdAt) < new Date(c.firstDate || o.createdAt)) { c.firstDate = o.createdAt; }
        });
        users.forEach(u => {
            const email = u.email?.toLowerCase();
            if (!email) return;
            let c = customerMap.get(email);
            if (!c) {
                if (customerSearchQuery && (u.name?.toLowerCase().includes(customerSearchQuery.toLowerCase()) || u.email?.toLowerCase().includes(customerSearchQuery.toLowerCase()))) {
                    c = { email, name: u.name, phone: u.phone || '', orders: [], lifetimeSpend: 0, lastOrderDate: u.createdAt || '', isRegistered: true, _id: u._id, firstDate: u.createdAt, hasPassword: u.hasPassword };
                    customerMap.set(email, c);
                } else if (!customerSearchQuery) {
                    c = { email, name: u.name, phone: u.phone || '', orders: [], lifetimeSpend: 0, lastOrderDate: u.createdAt || '', isRegistered: true, _id: u._id, firstDate: u.createdAt, hasPassword: u.hasPassword };
                    customerMap.set(email, c);
                }
            } else {
                c.isRegistered = true;
                c._id = u._id;
                c.phone = u.phone || c.phone;
                c.hasPassword = u.hasPassword;
                if (u.createdAt && new Date(u.createdAt) < new Date(c.firstDate)) { c.firstDate = u.createdAt; }
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
            finalResult = finalResult.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
        } else {
            finalResult = finalResult.filter(c => c.orders.length > 0);
        }
        return finalResult.sort((a, b) => b.lifetimeSpend - a.lifetimeSpend);
    }, [orders, users, customerSearchQuery]);

    const totalPages = Math.max(1, Math.ceil(searchableCustomers.length / 50));
    const paginatedCustomers = searchableCustomers.slice((customerSearchPage - 1) * 50, customerSearchPage * 50);

    const totalOrderPages = Math.max(1, Math.ceil(sortedOrders.length / 50));
    const paginatedOrders = sortedOrders.slice((orderPage - 1) * 50, orderPage * 50);

    if (loading) return <div className={styles.adminContainer}><div className={styles.loading}>Loading Dashboard...</div></div>;

    return (
        <main className={styles.adminContainer}>
            <div className={styles.header}>
                <h1>Hofherr Meat Co. | Admin Console</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => router.push('/')} className={styles.tab} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 16px' }}>View Store</button>
                    <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className={styles.tab} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '10px 16px' }}>Logout</button>
                </div>
            </div>

            {!isRestrictedAdmin && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#1e293b', padding: '4px', borderRadius: '12px', width: 'fit-content', border: '1px solid #334155' }}>
                    <button onClick={() => setStoreFilter('all')} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: storeFilter === 'all' ? '#334155' : 'transparent', color: storeFilter === 'all' ? '#fff' : '#94a3b8', fontSize: '13px', fontWeight: 700, transition: 'all 0.2s' }}>Combined View</button>
                    <button onClick={() => setStoreFilter('butcher')} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: storeFilter === 'butcher' ? '#c4302b' : 'transparent', color: storeFilter === 'butcher' ? '#fff' : '#94a3b8', fontSize: '13px', fontWeight: 700, transition: 'all 0.2s' }}>🥩 The Butcher Shop</button>
                    <button onClick={() => setStoreFilter('depot')} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: storeFilter === 'depot' ? '#3b82f6' : 'transparent', color: storeFilter === 'depot' ? '#fff' : '#94a3b8', fontSize: '13px', fontWeight: 700, transition: 'all 0.2s' }}>🥦 The Depot</button>
                </div>
            )}

            <div className={styles.tabs}>
                <button className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
                <button className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`} onClick={() => setActiveTab('users')}>Customers</button>
            </div>

            <div className={styles.statsGrid}>
                <StatCard label="Total Orders" value={orders.length} />
                <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                <StatCard label="Avg Order Value" value={`$${aov.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                <StatCard label="Active Prep Load" value={`${pendingPrep} Orders`} />
            </div>

            <div className={styles.tableContainer}>
                {activeTab === 'orders' ? (
                    <>
                        <div className={styles.filterContainer}>
                            <div className={styles.searchInputWrapper}>
                                <input type="text" placeholder="Search order #, name, or email..." value={orderSearchQuery} onChange={(e) => { setOrderSearchQuery(e.target.value); setOrderPage(1); }} className={styles.searchInput} style={{ width: '100%', maxWidth: '300px' }} />
                            </div>
                            <div className={styles.filterTabs}>
                                {['all', 'pending', 'paid', 'ready', 'completed', 'cancelled'].map(f => (
                                    <button key={f} onClick={() => { setOrderFilter(f); setOrderPage(1); }} className={styles.tab} style={{ fontSize: '12px', padding: '6px 12px', background: orderFilter === f ? 'var(--red)' : 'transparent', color: orderFilter === f ? '#fff' : 'inherit', border: orderFilter === f ? '1px solid var(--red)' : '' }}>
                                        {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? orders.length : f === 'ready' ? orders.filter(o => o.status === 'ready_paid' || o.status === 'ready_pending').length : orders.filter(o => o.status === f).length})
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div id="orderTableScrollArea" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 400px)', minHeight: '300px' }}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        {['orderNumber', 'customer', 'createdAt', 'items', 'total', 'status'].map(f => (
                                            <th key={f} onClick={() => handleSort(f as any)} style={{ cursor: 'pointer' }}>{f === 'orderNumber' ? 'Order #' : f.charAt(0).toUpperCase() + f.slice(1)} {sortField === f && (sortDirection === 'asc' ? '↑' : '↓')}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedOrders.map(order => (
                                        <tr key={order._id} className={styles.rowClickable} onClick={() => handleOrderRowClick(order)}>
                                            <td><strong>#{order.orderNumber}</strong></td>
                                            <td>{order.customer?.name || order.metadata?.customer_name || 'Guest'}<br/><a href={`mailto:${order.customer?.email || order.metadata?.customer_email}`} className={styles.tableLink} style={{fontSize: '11px'}}>{order.customer?.email || order.metadata?.customer_email}</a></td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>{order.items?.length || 0} items</td>
                                            <td>${(order.total / 100).toFixed(2)}</td>
                                            <td onClick={e => e.stopPropagation()}>
                                                <select value={order.status || 'pending'} onChange={e => handleStatusChange(order._id, e.target.value)} className={`${styles.statusDropdown} ${styles[`status_${order.status || 'pending'}`]}`}>
                                                    <option value="pending">Pending (Unpaid)</option>
                                                    <option value="paid">Paid (Preparing)</option>
                                                    <option value="ready_paid">Ready (Paid)</option>
                                                    <option value="ready_pending">Ready (Unpaid)</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination currentPage={orderPage} totalPages={totalOrderPages} onPageChange={setOrderPage} />
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
                        <div className={styles.filterContainer}>
                            <input type="text" placeholder="Search customers by name, email, or phone..." value={customerSearchQuery} onChange={(e) => { setCustomerSearchQuery(e.target.value); setCustomerSearchPage(1); }} className={styles.searchInput} style={{ width: '100%', maxWidth: '400px' }} />
                        </div>
                        <div id="customerTableScrollArea" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 400px)', minHeight: '300px' }}>
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
                                    {paginatedCustomers.length > 0 ? paginatedCustomers.map(customer => {
                                        const days = customer.firstDate ? Math.floor((new Date().getTime() - new Date(customer.firstDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
                                        const ageStr = days < 1 ? 'New Today' : `${days} Days`;
                                        
                                        return (
                                        <tr key={customer._id} className={styles.rowClickable} onClick={() => setSelectedCustomerMeta({ user: customer, orders: customer.orders, lifetimeSpend: customer.lifetimeSpend, tierName: customer.tierName, points: customer.points })}>
                                            <td>
                                                <div style={{fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                    {customer.name}
                                                </div>
                                                <a href={`mailto:${customer.email}`} className={styles.tableLink} style={{fontSize: '11px', color: '#94a3b8'}}>{customer.email}</a>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>{ageStr}</span>
                                                <div style={{ fontSize: '10px', color: '#64748b' }}>Since {customer.firstDate ? new Date(customer.firstDate).toLocaleDateString() : '—'}</div>
                                            </td>
                                            <td style={{fontWeight: '700', color: '#4ade80'}}>
                                                ${customer.lifetimeSpend.toFixed(2)}
                                                <div style={{fontSize: '10px', color: '#94a3b8'}}>{customer.orders.length} Orders</div>
                                            </td>
                                            <td>
                                                {customer.isRegistered ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <span style={{ fontSize: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '2px 6px', borderRadius: '4px', textAlign: 'center' }}>MEMBER</span>
                                                        {customer.hasPassword ? (
                                                            <span style={{ fontSize: '9px', color: '#10b981', textAlign: 'center' }}>✓ Password Set</span>
                                                        ) : (
                                                            <span style={{ fontSize: '9px', color: '#f59e0b', textAlign: 'center' }}>⚠ No Password</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '10px', background: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8', padding: '2px 6px', borderRadius: '4px' }}>GUEST</span>
                                                )}
                                            </td>
                                            <td style={{fontSize: '11px', color: '#94a3b8'}}>{customer.itemStrings?.slice(0, 3).join(', ')}{(customer.itemStrings?.length || 0) > 3 ? '...' : ''}</td>
                                        </tr>
                                        );
                                    }) : (
                                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No customers found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination currentPage={customerSearchPage} totalPages={totalPages} onPageChange={setCustomerSearchPage} />
                    </div>
                )}
            </div>

            <div className={styles.metricsContainer}>
                <div className={styles.chartCard}>
                    <h3>Order Status Distribution</h3>
                    <div className={styles.chartWrapper}>
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <div className={styles.emptyChart}>No order data yet</div>}
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h3>Recent Revenue</h3>
                    <div className={styles.chartWrapper}>
                        {barData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                                    <RechartsTooltip cursor={{fill: '#334155', opacity: 0.4}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                                    <Bar dataKey="revenue" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className={styles.emptyChart}>No revenue data yet</div>}
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h3>Revenue by Category</h3>
                    <div className={styles.chartWrapper}>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={55} dataKey="value" stroke="none" label={(props) => `${props.name} ${((props.percent || 0) * 100).toFixed(0)}%`}>
                                        {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <RechartsTooltip formatter={(v: any) => [`$${Number(v).toFixed(2)}`, 'Revenue']} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <div className={styles.emptyChart}>No category data yet</div>}
                    </div>
                </div>
            </div>

            {selectedCustomerMeta && (
                <div className={styles.modalOverlay} onClick={() => setSelectedCustomerMeta(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div>
                                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '24px', margin: 0, color: '#f8fafc' }}>{selectedCustomerMeta.user.name}</h2>
                                <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '6px' }}>{selectedCustomerMeta.user.email} {selectedCustomerMeta.user.phone && `• ${selectedCustomerMeta.user.phone}`}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button 
                                    className={styles.tab} 
                                    style={{ fontSize: '12px', padding: '6px 12px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)' }}
                                    onClick={async () => {
                                        if (confirm(`Send password reset link to ${selectedCustomerMeta.user.email}?`)) {
                                            try {
                                                const res = await fetch('/api/auth/forgot-password', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ email: selectedCustomerMeta.user.email })
                                                });
                                                if (res.ok) alert('Reset link sent successfully.');
                                                else alert('Failed to send reset link.');
                                            } catch { alert('An error occurred.'); }
                                        }
                                    }}
                                >
                                    Reset Password
                                </button>
                                <button className={styles.modalClose} onClick={() => setSelectedCustomerMeta(null)}>&times;</button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                            <div className={styles.insightBox}><div>Spend</div><strong>${selectedCustomerMeta.lifetimeSpend.toFixed(2)}</strong></div>
                            <div className={styles.insightBox}><div>Tier</div><strong>{selectedCustomerMeta.tierName}</strong></div>
                            <div className={styles.insightBox}><div>Orders</div><strong>{selectedCustomerMeta.orders.length}</strong></div>
                            <div className={styles.insightBox}><div>Points</div><strong>{selectedCustomerMeta.points.toFixed(0)}</strong></div>
                        </div>
                        <h3 style={{ fontSize: '18px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px', color: '#f8fafc' }}>Purchase History</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                            {selectedCustomerMeta.orders.map(order => (
                                <div key={order._id} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <strong>Order #{order.orderNumber}</strong>
                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#cbd5e1' }}>{order.items?.map((i: any) => `${i.qty || 1}x ${i.name}`).join(', ')}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                        <span className={styles.status} style={{ fontSize: '10px' }}>{order.status}</span>
                                        <span style={{ fontWeight: 'bold', color: '#4ade80' }}>${((order.total || 0) / 100).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

function StatCard({ label, value }: { label: string, value: string | number }) {
    return (
        <div className={styles.statCard}>
            <span className={styles.statLabel}>{label}</span>
            <span className={styles.statValue}>{value}</span>
        </div>
    );
}
