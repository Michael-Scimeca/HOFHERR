'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './inventory.module.css';

type SalesData = { totalSold: number; last30Days: number; last7Days: number; lastSoldDate: string | null; revenue: number; };
type Product = {
    _id: string; name: string; price: string; salePrice?: string | null;
    stockStatus: string; stockQuantity: number; isFeatured?: boolean; isNew?: boolean;
    hiddenFromShop?: boolean; adminNotes?: string | null; expiryDate?: string | null;
    categoryName: string; categoryId: string; sales: SalesData;
};
type Activity = { product: string; qty: number; date: string; status: string; };
type PurchaseItem = { name: string; qty: number; price: string | null; };
type Purchase = { _id: string; orderNumber: string | null; customerName: string; customerEmail: string | null; items: PurchaseItem[]; total: number; status: string; date: string; };
type Summary = { totalOrders: number; totalRevenue: number; ordersLast7Days: number; ordersLast30Days: number; };
type SavingState = 'idle' | 'saving' | 'saved';
type ViewTab = 'stock' | 'sales' | 'activity' | 'purchases';
type CategoryInfo = { _id: string; label: string; id: string; store: string; };
type SortOption = 'name-asc' | 'name-desc' | 'qty-asc' | 'qty-desc' | 'price-asc' | 'price-desc' | 'category';

const STATUS_LABELS: Record<string, string> = {
    'in-stock': '✅ In Stock', 'low-stock': '🔥 Low Stock', 'out-of-stock': '🔴 Out of Stock',
    'pre-order': '📦 Pre-Order', 'seasonal': '🌿 Seasonal',
};
const STATUS_STYLES: Record<string, string> = {
    'in-stock': 'statusInStock', 'low-stock': 'statusLowStock', 'out-of-stock': 'statusOutOfStock',
    'pre-order': 'statusPreOrder', 'seasonal': 'statusSeasonal',
};

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [threshold, setThreshold] = useState(3);
    const [activity, setActivity] = useState<Activity[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [summary, setSummary] = useState<Summary>({ totalOrders: 0, totalRevenue: 0, ordersLast7Days: 0, ordersLast30Days: 0 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState<SortOption>('category');
    const [savingStates, setSavingStates] = useState<Record<string, SavingState>>({});
    const [lastFetched, setLastFetched] = useState<Date | null>(null);
    const [viewTab, setViewTab] = useState<ViewTab>('stock');
    const [editingPrice, setEditingPrice] = useState<{ id: string; field: 'price' | 'salePrice' } | null>(null);
    const [editPriceValue, setEditPriceValue] = useState('');
    const priceInputRef = useRef<HTMLInputElement>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ name: '', price: '', categoryId: '', description: '', stockQuantity: 5 });
    const [addError, setAddError] = useState('');
    const [addSaving, setAddSaving] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<CategoryInfo[]>([]);
    const [alertDismissed, setAlertDismissed] = useState(false);
    const [editingNote, setEditingNote] = useState<string | null>(null);
    const [noteValue, setNoteValue] = useState('');
    const noteInputRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();
    const { data: session } = useSession();

    // Focus price input when editing starts
    useEffect(() => {
        if (editingPrice && priceInputRef.current) {
            priceInputRef.current.focus();
            priceInputRef.current.select();
        }
    }, [editingPrice]);

    useEffect(() => {
        if (editingNote && noteInputRef.current) {
            noteInputRef.current.focus();
        }
    }, [editingNote]);

    const fetchInventory = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/inventory');
            if (!res.ok) { if (res.status === 401) { router.push('/admin/login'); return; } throw new Error('Fetch failed'); }
            const data = await res.json();
            setProducts(data.products || []);
            setThreshold(data.threshold ?? 3);
            setActivity(data.activity || []);
            setPurchases(data.purchases || []);
            setSummary(data.summary || {});
            setAvailableCategories(data.categories || []);
            setLastFetched(new Date());
        } catch (err) { console.error('[Inventory] Fetch error:', err); }
        finally { setLoading(false); }
    }, [router]);

    useEffect(() => { fetchInventory(); }, [fetchInventory]);

    const updateProduct = async (productId: string, patch: Record<string, any>) => {
        setProducts(prev => prev.map(p => {
            if (p._id !== productId) return p;
            const updated = { ...p, ...patch };
            if (typeof patch.stockQuantity === 'number') {
                const qty = Math.max(0, Math.min(99, patch.stockQuantity));
                updated.stockQuantity = qty;
                if (qty === 0) updated.stockStatus = 'out-of-stock';
                else if (qty <= threshold) updated.stockStatus = 'low-stock';
                else if (p.stockStatus === 'out-of-stock' || p.stockStatus === 'low-stock') updated.stockStatus = 'in-stock';
            }
            return updated;
        }));
        setSavingStates(prev => ({ ...prev, [productId]: 'saving' }));
        try {
            const body = { productId, ...patch };
            if (typeof patch.stockQuantity === 'number') body.stockQuantity = Math.max(0, Math.min(99, patch.stockQuantity));
            const res = await fetch('/api/admin/inventory', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (!res.ok) throw new Error('Update failed');
            const data = await res.json();
            setProducts(prev => prev.map(p => p._id === productId ? { ...p, ...data } : p));
            setSavingStates(prev => ({ ...prev, [productId]: 'saved' }));
            setTimeout(() => setSavingStates(prev => ({ ...prev, [productId]: 'idle' })), 1500);
        } catch { setSavingStates(prev => ({ ...prev, [productId]: 'idle' })); fetchInventory(); }
    };

    const bulkUpdate = async (categoryId: string, stockStatus: string, stockQuantity?: number) => {
        try {
            const res = await fetch('/api/admin/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ categoryId, stockStatus, stockQuantity }) });
            if (!res.ok) throw new Error('Bulk update failed');
            const data = await res.json();
            await fetchInventory();
            alert(`✅ Updated ${data.updated} products to "${stockStatus}"`);
        } catch { alert('Failed to update. Please try again.'); }
    };

    const createProduct = async () => {
        setAddError('');
        if (!addForm.name.trim()) { setAddError('Product name is required'); return; }
        if (!addForm.price.trim()) { setAddError('Price is required'); return; }
        if (!addForm.categoryId) { setAddError('Category is required'); return; }
        setAddSaving(true);
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addForm),
            });
            if (!res.ok) {
                const err = await res.json();
                setAddError(err.error || 'Failed to create product');
                return;
            }
            setShowAddModal(false);
            setAddForm({ name: '', price: '', categoryId: '', description: '', stockQuantity: 5 });
            await fetchInventory();
        } catch {
            setAddError('Failed to create product');
        } finally {
            setAddSaving(false);
        }
    };

    const deleteProduct = async (productId: string, productName: string) => {
        if (!confirm(`Are you sure you want to permanently delete "${productName}"? This cannot be undone.`)) return;
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });
            if (!res.ok) throw new Error('Delete failed');
            setProducts(prev => prev.filter(p => p._id !== productId));
        } catch {
            alert('Failed to delete product. Please try again.');
        }
    };

    const uniqueCategories = useMemo(() =>
        [...new Set(products.map(p => p.categoryName).filter(Boolean))].sort(),
    [products]);

    const parsePrice = (price: string) => {
        const m = price?.match(/\$(\d+(?:\.\d+)?)/);
        return m ? parseFloat(m[1]) : 0;
    };

    const filtered = useMemo(() => {
        let result = products.filter(p => {
            const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || (statusFilter === 'hidden' ? p.hiddenFromShop : p.stockStatus === statusFilter);
            const matchesCategory = categoryFilter === 'all' || p.categoryName === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });
        result = [...result].sort((a, b) => {
            switch (sortBy) {
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'qty-asc': return a.stockQuantity - b.stockQuantity;
                case 'qty-desc': return b.stockQuantity - a.stockQuantity;
                case 'price-asc': return parsePrice(a.price) - parsePrice(b.price);
                case 'price-desc': return parsePrice(b.price) - parsePrice(a.price);
                case 'category':
                default: return (a.categoryName || '').localeCompare(b.categoryName || '') || a.name.localeCompare(b.name);
            }
        });
        return result;
    }, [products, searchQuery, statusFilter, categoryFilter, sortBy]);

    const categories = useMemo(() => filtered.reduce((acc, p) => {
        const cat = p.categoryName || 'Uncategorized';
        if (!acc[cat]) acc[cat] = { id: p.categoryId, items: [], revenue: 0 };
        acc[cat].items.push(p);
        acc[cat].revenue += p.sales?.revenue || 0;
        return acc;
    }, {} as Record<string, { id: string; items: Product[]; revenue: number }>), [filtered]);

    const topSellers = useMemo(() =>
        [...products].filter(p => (p.sales?.totalSold || 0) > 0)
            .sort((a, b) => (b.sales?.totalSold || 0) - (a.sales?.totalSold || 0)).slice(0, 8),
    [products]);

    const deadStock = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return products.filter(p => {
            const s = p.sales;
            if (!s) return true;
            if (s.last30Days > 0) return false;
            if (s.lastSoldDate && new Date(s.lastSoldDate) >= thirtyDaysAgo) return false;
            return p.stockQuantity > 0;
        }).sort((a, b) => {
            const aDate = a.sales?.lastSoldDate ? new Date(a.sales.lastSoldDate).getTime() : 0;
            const bDate = b.sales?.lastSoldDate ? new Date(b.sales.lastSoldDate).getTime() : 0;
            return aDate - bDate;
        }).slice(0, 12);
    }, [products]);

    const totalProducts = products.length;
    const inStock = products.filter(p => p.stockStatus === 'in-stock').length;
    const lowStock = products.filter(p => p.stockStatus === 'low-stock').length;
    const outOfStock = products.filter(p => p.stockStatus === 'out-of-stock').length;
    const hiddenCount = products.filter(p => p.hiddenFromShop).length;

    const getTrend = (p: Product) => {
        const s = p.sales;
        if (!s || s.totalSold === 0) return { label: 'No Sales', style: styles.trendSlow };
        if (s.last7Days >= 3) return { label: '🔥 Hot', style: styles.trendHot };
        if (s.last30Days >= 5) return { label: 'Steady', style: styles.trendSteady };
        return { label: 'Slow', style: styles.trendSlow };
    };

    const lowAlertItems = useMemo(() =>
        products.filter(p => p.stockQuantity <= 10 && p.stockQuantity > 0)
            .sort((a, b) => a.stockQuantity - b.stockQuantity),
    [products]);
    const outOfStockItems = useMemo(() =>
        products.filter(p => p.stockQuantity === 0 || p.stockStatus === 'out-of-stock'),
    [products]);
    const criticalItems = useMemo(() =>
        lowAlertItems.filter(p => p.stockQuantity <= 3),
    [lowAlertItems]);
    const hasAlerts = lowAlertItems.length > 0 || outOfStockItems.length > 0;

    if (loading) return <main className={styles.container}><div className={styles.loading}>Loading Inventory...</div></main>;

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1>📦 Inventory Manager</h1>
                <div className={styles.headerActions}>
                    <button className={styles.addProductBtn} onClick={() => setShowAddModal(true)}>+ Add Product</button>
                    <button className={styles.backBtn} onClick={fetchInventory}>↻ Refresh</button>
                    <button className={styles.backBtn} onClick={() => router.push('/admin')}>← Dashboard</button>
                </div>
            </div>
            <div className={styles.lastUpdated}>
                {lastFetched ? `Last synced: ${lastFetched.toLocaleTimeString()} — Threshold: ${threshold} units` : ''}
                {session?.user?.name ? ` — ${session.user.name}` : ''}
            </div>

            {/* ── View Tabs ── */}
            <div className={styles.viewTabs}>
                {(['stock', 'sales', 'purchases', 'activity'] as ViewTab[]).map(t => (
                    <button key={t} className={`${styles.viewTab} ${viewTab === t ? styles.viewTabActive : ''}`} onClick={() => setViewTab(t)}>
                        {t === 'stock' ? '📦 Stock & Status' : t === 'sales' ? '📊 Sales Data' : t === 'purchases' ? '🧾 Purchases' : '🕐 Activity'}
                    </button>
                ))}
            </div>

            {/* ── Stats ── */}
            <div className={styles.statsBar}>
                <div className={styles.statCard}><span className={styles.statLabel}>Total Products</span><span className={styles.statValue}>{totalProducts}</span></div>
                <div className={styles.statCard}><span className={styles.statLabel}>In Stock</span><span className={`${styles.statValue} ${styles.statValueGreen}`}>{inStock}</span></div>
                <div className={styles.statCard}><span className={styles.statLabel}>Low Stock</span><span className={`${styles.statValue} ${styles.statValueYellow}`}>{lowStock}</span></div>
                <div className={styles.statCard}><span className={styles.statLabel}>Out of Stock</span><span className={`${styles.statValue} ${styles.statValueRed}`}>{outOfStock}</span></div>
                <div className={styles.statCard}><span className={styles.statLabel}>🚫 Hidden</span><span className={`${styles.statValue} ${styles.statValueRed}`}>{hiddenCount}</span></div>
                {viewTab === 'sales' && (<>
                    <div className={styles.statCard}><span className={styles.statLabel}>Orders (7 Days)</span><span className={`${styles.statValue} ${styles.statValueBlue}`}>{summary.ordersLast7Days}</span></div>
                    <div className={styles.statCard}><span className={styles.statLabel}>Revenue (All Time)</span><span className={`${styles.statValue} ${styles.statValueGreen}`}>${summary.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                </>)}
            </div>

            {/* ── Alert Notification Panel ── */}
            {hasAlerts && !alertDismissed && (
                <div className={styles.alertBanner}>
                    <div className={styles.alertHeader}>
                        <span className={styles.alertTitle}>
                            {outOfStockItems.length > 0 && <>🔴 {outOfStockItems.length} Out of Stock</>}
                            {outOfStockItems.length > 0 && lowAlertItems.length > 0 && ' · '}
                            {lowAlertItems.length > 0 && <>⚠️ {lowAlertItems.length} Low Stock{criticalItems.length > 0 && <> ({criticalItems.length} critical)</>}</>}
                        </span>
                        <button className={styles.alertDismiss} onClick={() => setAlertDismissed(true)} title="Dismiss alerts">×</button>
                    </div>
                    {criticalItems.length > 0 && (
                        <div className={styles.alertSection}>
                            <span className={styles.alertSectionTitle}>🚨 Critical — Restock Immediately</span>
                            <div className={styles.alertList}>
                                {criticalItems.map(p => (
                                    <div key={p._id} className={`${styles.alertItem} ${styles.alertItemCritical}`}>
                                        <span className={styles.alertItemName}>{p.name}</span>
                                        <span className={styles.alertItemCategory}>{p.categoryName}</span>
                                        <span className={`${styles.alertItemQty} ${styles.alertCritical}`}>{p.stockQuantity} left</span>
                                        <button className={styles.alertRestockBtn} onClick={() => updateProduct(p._id, { stockQuantity: 10 })} title="Quick restock to 10">↻ 10</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {outOfStockItems.length > 0 && (
                        <div className={styles.alertSection}>
                            <span className={styles.alertSectionTitle}>🚫 Out of Stock</span>
                            <div className={styles.alertList}>
                                {outOfStockItems.slice(0, 12).map(p => (
                                    <div key={p._id} className={`${styles.alertItem} ${styles.alertItemOOS}`}>
                                        <span className={styles.alertItemName}>{p.name}</span>
                                        <span className={styles.alertItemCategory}>{p.categoryName}</span>
                                        <span className={`${styles.alertItemQty} ${styles.alertCritical}`}>0 left</span>
                                        <button className={styles.alertRestockBtn} onClick={() => updateProduct(p._id, { stockQuantity: 5 })} title="Quick restock to 5">↻ 5</button>
                                    </div>
                                ))}
                                {outOfStockItems.length > 12 && (
                                    <div className={styles.alertItem} style={{ justifyContent: 'center', color: '#64748b' }}>+ {outOfStockItems.length - 12} more…</div>
                                )}
                            </div>
                        </div>
                    )}
                    {lowAlertItems.filter(p => p.stockQuantity > 3).length > 0 && (
                        <div className={styles.alertSection}>
                            <span className={styles.alertSectionTitle}>⚠️ Low Stock (≤10 units)</span>
                            <div className={styles.alertList}>
                                {lowAlertItems.filter(p => p.stockQuantity > 3).map(p => (
                                    <div key={p._id} className={styles.alertItem}>
                                        <span className={styles.alertItemName}>{p.name}</span>
                                        <span className={styles.alertItemCategory}>{p.categoryName}</span>
                                        <span className={styles.alertItemQty}>{p.stockQuantity} left</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {hasAlerts && alertDismissed && (
                <button className={styles.alertCollapsed} onClick={() => setAlertDismissed(false)}>
                    {outOfStockItems.length > 0 && <span className={styles.alertCollapsedBadgeRed}>🔴 {outOfStockItems.length}</span>}
                    {lowAlertItems.length > 0 && <span className={styles.alertCollapsedBadgeYellow}>⚠️ {lowAlertItems.length}</span>}
                    <span style={{ color: '#64748b', fontSize: 11 }}>Show Alerts</span>
                </button>
            )}

            {/* ═══════════════ PURCHASES TAB ═══════════════ */}
            {viewTab === 'purchases' && (
                <div className={styles.purchasesPanel}>
                    <h3 className={styles.purchasesTitle}>🧾 Purchase History</h3>
                    <p className={styles.purchasesSubtext}>Last 50 orders · {summary.totalOrders} total · ${summary.totalRevenue?.toLocaleString(undefined, { maximumFractionDigits: 0 })} all-time revenue</p>
                    {purchases.length === 0 ? (
                        <div className={styles.empty}>No purchase records found.</div>
                    ) : (
                        <div className={styles.purchasesTable}>
                            <table className={styles.productTable}>
                                <thead><tr>
                                    <th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th>
                                </tr></thead>
                                <tbody>
                                    {purchases.map(p => (
                                        <tr key={p._id}>
                                            <td><span className={styles.orderNumber}>{p.orderNumber || '—'}</span></td>
                                            <td>
                                                <span className={styles.customerName}>{p.customerName}</span>
                                                {p.customerEmail && <span className={styles.customerEmail}>{p.customerEmail}</span>}
                                            </td>
                                            <td>
                                                <div className={styles.purchaseItems}>
                                                    {p.items.slice(0, 3).map((item, i) => (
                                                        <span key={i} className={styles.purchaseItem}>{item.name} ×{item.qty}{item.price && <span className={styles.purchaseItemPrice}>{item.price}</span>}</span>
                                                    ))}
                                                    {p.items.length > 3 && <span className={styles.purchaseItemMore}>+{p.items.length - 3} more</span>}
                                                </div>
                                            </td>
                                            <td><span className={styles.purchaseTotal}>${p.total.toFixed(2)}</span></td>
                                            <td>
                                                <span className={`${styles.purchaseStatus} ${styles['purchaseStatus_' + p.status.replace(/[^a-z]/g, '')]}`}>
                                                    {p.status === 'completed' ? '✅' : p.status === 'paid' ? '💳' : p.status === 'pending' ? '⏳' : '🔄'} {p.status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={styles.purchaseDate}>{new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                <span className={styles.purchaseTime}>{new Date(p.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════ ACTIVITY TAB ═══════════════ */}
            {viewTab === 'activity' && (
                <div className={styles.activityPanel}>
                    <h3>🕐 Recent Sales Activity (Last 7 Days)</h3>
                    {activity.length === 0 ? (
                        <div className={styles.empty}>No recent activity</div>
                    ) : (
                        <div className={styles.activityList}>
                            {activity.map((a, i) => (
                                <div key={i} className={styles.activityItem}>
                                    <span className={`${styles.activityDot} ${a.status === 'completed' ? styles.activityDotGreen : a.status === 'paid' ? styles.activityDotBlue : styles.activityDotYellow}`} />
                                    <span className={styles.activityProduct}>{a.product}</span>
                                    <span className={styles.activityQty}>×{a.qty}</span>
                                    <span className={styles.activityStatus} style={{ background: a.status === 'completed' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)', color: a.status === 'completed' ? '#4ade80' : '#60a5fa' }}>{a.status}</span>
                                    <span className={styles.activityDate}>{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {new Date(a.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════ INSIGHTS PANEL — Top Sellers & Dead Stock ═══════════════ */}
            {(viewTab === 'stock' || viewTab === 'sales') && (topSellers.length > 0 || deadStock.length > 0) && (
                <div className={styles.insightsPanel}>
                    {topSellers.length > 0 && (
                        <div className={styles.insightsSection}>
                            <h3 className={styles.insightsSectionTitle}>🏆 Top Sellers</h3>
                            <div className={styles.insightsGrid}>
                                {topSellers.map((p, i) => (
                                    <div key={p._id} className={`${styles.insightCard} ${i < 3 ? styles.insightCardGold : ''}`}>
                                        <div className={styles.insightCardHeader}>
                                            <span className={styles.insightRank}>#{i + 1}</span>
                                            <span className={styles.insightName}>{p.name}</span>
                                        </div>
                                        <div className={styles.insightMeta}>
                                            <span className={styles.insightCategory}>{p.categoryName}</span>
                                            <span className={styles.insightStat}>{p.sales.totalSold} sold</span>
                                        </div>
                                        <div className={styles.insightFooter}>
                                            <span className={styles.insightWeekly}>{p.sales.last7Days} this week · {p.sales.last30Days} this month</span>
                                            {p.sales.revenue > 0 && <span className={styles.insightRevenue}>${p.sales.revenue.toFixed(0)}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {deadStock.length > 0 && (
                        <div className={styles.insightsSection}>
                            <h3 className={styles.insightsSectionTitle}>💤 No Movement (30+ Days)</h3>
                            <p className={styles.insightsSubtext}>These in-stock items haven’t sold in over a month. Consider running a sale or adjusting pricing.</p>
                            <div className={styles.insightsGrid}>
                                {deadStock.map(p => {
                                    const lastSold = p.sales?.lastSoldDate ? new Date(p.sales.lastSoldDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Never sold';
                                    return (
                                        <div key={p._id} className={`${styles.insightCard} ${styles.insightCardDead}`}>
                                            <div className={styles.insightCardHeader}><span className={styles.insightName}>{p.name}</span></div>
                                            <div className={styles.insightMeta}>
                                                <span className={styles.insightCategory}>{p.categoryName}</span>
                                                <span className={styles.insightStat}>{p.stockQuantity} in stock</span>
                                            </div>
                                            <div className={styles.insightFooter}>
                                                <span className={styles.insightLastSold}>Last sold: {lastSold}</span>
                                                <span className={styles.insightPrice}>{p.price}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Toolbar (stock & sales views) ── */}
            {(viewTab === 'stock' || viewTab === 'sales') && (
                <div className={styles.toolbar}>
                    <input type="text" placeholder="Search products or categories..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={styles.searchInput} />
                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className={styles.filterSelect}>
                        <option value="all">All Categories</option>
                        {uniqueCategories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                    </select>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)} className={styles.filterSelect}>
                        <option value="category">Sort: Category</option>
                        <option value="name-asc">Sort: Name A–Z</option>
                        <option value="name-desc">Sort: Name Z–A</option>
                        <option value="qty-asc">Sort: Stock Low → High</option>
                        <option value="qty-desc">Sort: Stock High → Low</option>
                        <option value="price-asc">Sort: Price Low → High</option>
                        <option value="price-desc">Sort: Price High → Low</option>
                    </select>
                    <div className={styles.filterBtnGroup}>
                        {['all', 'in-stock', 'low-stock', 'out-of-stock', 'hidden'].map(f => (
                            <button key={f} className={`${styles.filterBtn} ${statusFilter === f ? styles.filterBtnActive : ''}`} onClick={() => setStatusFilter(f)}>
                                {f === 'all' ? `All (${totalProducts})` : f === 'in-stock' ? `In Stock (${inStock})` : f === 'low-stock' ? `Low (${lowStock})` : f === 'out-of-stock' ? `Out (${outOfStock})` : `Hidden (${hiddenCount})`}
                            </button>
                        ))}
                    </div>
                    {(categoryFilter !== 'all' || sortBy !== 'category' || statusFilter !== 'all' || searchQuery) && (
                        <button className={styles.clearFiltersBtn} onClick={() => { setCategoryFilter('all'); setSortBy('category'); setStatusFilter('all'); setSearchQuery(''); }}>
                            ✕ Clear
                        </button>
                    )}
                </div>
            )}

            {/* ═══════════════ STOCK / SALES TABLE ═══════════════ */}
            {(viewTab === 'stock' || viewTab === 'sales') && (
                Object.keys(categories).length === 0 ? (
                    <div className={styles.empty}>No products match your search.</div>
                ) : (
                    Object.entries(categories).sort(([a], [b]) => a.localeCompare(b)).map(([catName, { id: catId, items, revenue }]) => (
                        <div key={catName} className={styles.categoryGroup}>
                            <div className={styles.categoryHeader}>
                                <span className={styles.categoryName}>
                                    {catName}
                                    <span className={styles.categoryCount}>{items.length}</span>
                                    {viewTab === 'sales' && revenue > 0 && <span className={styles.categoryRevenue}>${revenue.toFixed(0)}</span>}
                                </span>
                                <div className={styles.categoryActions}>
                                    <button className={`${styles.catBtn} ${styles.catBtnGreen}`} onClick={() => bulkUpdate(catId, 'in-stock', 10)}>✅ All In Stock</button>
                                    <button className={`${styles.catBtn} ${styles.catBtnRed}`} onClick={() => bulkUpdate(catId, 'out-of-stock', 0)}>🔴 All Out</button>
                                </div>
                            </div>
                            <table className={styles.productTable}>
                                <thead><tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    {viewTab === 'sales' && <th>Sold</th>}
                                    {viewTab === 'sales' && <th>Trend</th>}
                                    {viewTab === 'stock' && <th>Flags</th>}
                                    <th></th>
                                </tr></thead>
                                <tbody>
                                    {items.map(p => {
                                        const trend = getTrend(p);
                                        return (
                                            <tr key={p._id} style={p.hiddenFromShop ? { opacity: 0.5 } : undefined}>
                                                <td>
                                                    <span className={styles.productName} style={p.hiddenFromShop ? { textDecoration: 'line-through' } : undefined}>{p.name}</span>
                                                    <div className={styles.productTags}>
                                                        {p.hiddenFromShop && <span className={`${styles.badge} ${styles.badgeSale}`} style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>Hidden</span>}
                                                        {p.isFeatured && <span className={`${styles.badge} ${styles.badgeFeatured}`}>Featured</span>}
                                                        {p.isNew && <span className={`${styles.badge} ${styles.badgeNew}`}>New</span>}
                                                        {p.salePrice && <span className={`${styles.badge} ${styles.badgeSale}`}>Sale</span>}
                                                        {(() => {
                                                            if (!p.expiryDate) return null;
                                                            const exp = new Date(p.expiryDate);
                                                            const now = new Date();
                                                            const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                                            const isExpired = daysLeft < 0;
                                                            const isExpiringSoon = daysLeft >= 0 && daysLeft <= 7;
                                                            return (
                                                                <span className={`${styles.badge} ${isExpired ? styles.badgeExpired : isExpiringSoon ? styles.badgeExpiringSoon : styles.badgeExpiry}`}>
                                                                    {isExpired ? `⛔ Expired` : isExpiringSoon ? `⚠️ ${daysLeft}d left` : `📅 ${exp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                    <input
                                                        type="date"
                                                        className={styles.expiryInput}
                                                        value={p.expiryDate || ''}
                                                        onChange={e => updateProduct(p._id, { expiryDate: e.target.value || null })}
                                                        title={p.expiryDate ? `Expires: ${new Date(p.expiryDate).toLocaleDateString()}` : 'Set expiry date'}
                                                    />
                                                    {editingNote === p._id ? (
                                                        <textarea ref={noteInputRef} className={styles.noteInput} value={noteValue}
                                                            onChange={e => setNoteValue(e.target.value)}
                                                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); const t = noteValue.trim(); if (t !== (p.adminNotes || '').trim()) updateProduct(p._id, { adminNotes: t || null }); setEditingNote(null); } else if (e.key === 'Escape') setEditingNote(null); }}
                                                            onBlur={() => { const t = noteValue.trim(); if (t !== (p.adminNotes || '').trim()) updateProduct(p._id, { adminNotes: t || null }); setEditingNote(null); }}
                                                            placeholder="Add a note..." rows={2} />
                                                    ) : (
                                                        <button className={`${styles.noteDisplay} ${p.adminNotes ? styles.noteHasContent : ''}`}
                                                            onClick={() => { setEditingNote(p._id); setNoteValue(p.adminNotes || ''); }}
                                                            title={p.adminNotes || 'Click to add a note'}>
                                                            {p.adminNotes ? `📝 ${p.adminNotes.length > 40 ? p.adminNotes.slice(0, 40) + '…' : p.adminNotes}` : '📝'}
                                                        </button>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className={styles.priceCell}>
                                                        {editingPrice?.id === p._id && editingPrice.field === 'price' ? (
                                                            <input
                                                                ref={priceInputRef}
                                                                className={styles.priceInput}
                                                                value={editPriceValue}
                                                                onChange={e => setEditPriceValue(e.target.value)}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Enter') {
                                                                        if (editPriceValue.trim() && editPriceValue.trim() !== p.price) {
                                                                            updateProduct(p._id, { price: editPriceValue.trim() });
                                                                        }
                                                                        setEditingPrice(null);
                                                                    } else if (e.key === 'Escape') {
                                                                        setEditingPrice(null);
                                                                    }
                                                                }}
                                                                onBlur={() => {
                                                                    if (editPriceValue.trim() && editPriceValue.trim() !== p.price) {
                                                                        updateProduct(p._id, { price: editPriceValue.trim() });
                                                                    }
                                                                    setEditingPrice(null);
                                                                }}
                                                                placeholder="$0.00/lb"
                                                            />
                                                        ) : (
                                                            <span
                                                                className={styles.priceEditable}
                                                                onClick={() => {
                                                                    setEditingPrice({ id: p._id, field: 'price' });
                                                                    setEditPriceValue(p.price);
                                                                }}
                                                                title="Click to edit price"
                                                            >
                                                                {p.price}
                                                            </span>
                                                        )}
                                                        {editingPrice?.id === p._id && editingPrice.field === 'salePrice' ? (
                                                            <input
                                                                ref={priceInputRef}
                                                                className={`${styles.priceInput} ${styles.priceInputSale}`}
                                                                value={editPriceValue}
                                                                onChange={e => setEditPriceValue(e.target.value)}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Enter') {
                                                                        updateProduct(p._id, { salePrice: editPriceValue.trim() || null });
                                                                        setEditingPrice(null);
                                                                    } else if (e.key === 'Escape') {
                                                                        setEditingPrice(null);
                                                                    }
                                                                }}
                                                                onBlur={() => {
                                                                    updateProduct(p._id, { salePrice: editPriceValue.trim() || null });
                                                                    setEditingPrice(null);
                                                                }}
                                                                placeholder="Sale price (blank to remove)"
                                                            />
                                                        ) : (
                                                            <div className={styles.salePriceRow}>
                                                                {p.salePrice && <span className={styles.salePriceTag}>{p.salePrice}</span>}
                                                                <button
                                                                    className={styles.editSaleBtn}
                                                                    onClick={() => {
                                                                        setEditingPrice({ id: p._id, field: 'salePrice' });
                                                                        setEditPriceValue(p.salePrice || '');
                                                                    }}
                                                                    title={p.salePrice ? 'Edit sale price' : 'Add sale price'}
                                                                >
                                                                    {p.salePrice ? '✏️' : '🏷️'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={styles.qtyControl}>
                                                        <button className={styles.qtyBtn} onClick={() => updateProduct(p._id, { stockQuantity: p.stockQuantity - 1 })} disabled={p.stockQuantity <= 0}>−</button>
                                                        <span className={styles.qtyValue}>{p.stockQuantity ?? 0}</span>
                                                        <button className={styles.qtyBtn} onClick={() => updateProduct(p._id, { stockQuantity: p.stockQuantity + 1 })}>+</button>
                                                    </div>
                                                </td>
                                                <td><span className={`${styles.statusBadge} ${styles[STATUS_STYLES[p.stockStatus] || 'statusInStock']}`}>{STATUS_LABELS[p.stockStatus] || p.stockStatus}</span></td>
                                                {viewTab === 'sales' && (
                                                    <td>
                                                        <div className={styles.salesCell}>
                                                            <span className={styles.salesMain}>{p.sales?.totalSold || 0}</span>
                                                            <span className={styles.salesSub}>{p.sales?.last7Days || 0} this week</span>
                                                        </div>
                                                    </td>
                                                )}
                                                {viewTab === 'sales' && (
                                                    <td><span className={`${styles.salesTrend} ${trend.style}`}>{trend.label}</span></td>
                                                )}
                                                {viewTab === 'stock' && (
                                                    <td>
                                                        <div className={styles.toggleRow}>
                                                            <button className={`${styles.toggle} ${p.hiddenFromShop ? styles.toggleOn : styles.toggleOff}`} onClick={() => updateProduct(p._id, { hiddenFromShop: !p.hiddenFromShop })} title={p.hiddenFromShop ? 'Show on Shop' : 'Hide from Shop'} />
                                                            <span className={styles.toggleLabel} style={{ fontSize: 13 }}>{p.hiddenFromShop ? '🚫' : '👁️'}</span>
                                                            <button className={`${styles.toggle} ${p.isFeatured ? styles.toggleOn : styles.toggleOff}`} onClick={() => updateProduct(p._id, { isFeatured: !p.isFeatured })} title="Toggle Featured" />
                                                            <span className={styles.toggleLabel}>★</span>
                                                            <button className={`${styles.toggle} ${p.isNew ? styles.toggleOn : styles.toggleOff}`} onClick={() => updateProduct(p._id, { isNew: !p.isNew })} title="Toggle New badge" />
                                                            <span className={styles.toggleLabel}>New</span>
                                                        </div>
                                                    </td>
                                                )}
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        {savingStates[p._id] === 'saving' && <span className={styles.saving}>Saving…</span>}
                                                        {savingStates[p._id] === 'saved' && <span className={styles.saved}>✓ Saved</span>}
                                                        <button className={styles.deleteBtn} onClick={() => deleteProduct(p._id, p.name)} title="Delete product">🗑️</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ))
                )
            )}

            {/* ═══════════════ ADD PRODUCT MODAL ═══════════════ */}
            {showAddModal && (
                <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Add New Product</h2>
                            <button className={styles.modalClose} onClick={() => setShowAddModal(false)}>×</button>
                        </div>
                        {addError && <div className={styles.modalError}>{addError}</div>}
                        <div className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label>Product Name *</label>
                                <input type="text" placeholder="e.g. Wagyu Ribeye" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} className={styles.formInput} autoFocus />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Price *</label>
                                    <input type="text" placeholder="$42.99/lb" value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))} className={styles.formInput} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Starting Quantity</label>
                                    <input type="number" min="0" max="99" value={addForm.stockQuantity} onChange={e => setAddForm(f => ({ ...f, stockQuantity: parseInt(e.target.value) || 0 }))} className={styles.formInput} />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Category *</label>
                                <select value={addForm.categoryId} onChange={e => setAddForm(f => ({ ...f, categoryId: e.target.value }))} className={styles.formInput}>
                                    <option value="">Select a category...</option>
                                    {availableCategories.map(cat => (<option key={cat._id} value={cat._id}>{cat.label} ({cat.store})</option>))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Description (optional)</label>
                                <input type="text" placeholder="Short description..." value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} className={styles.formInput} />
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className={styles.modalSaveBtn} onClick={createProduct} disabled={addSaving}>{addSaving ? 'Creating...' : '✓ Create Product'}</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
