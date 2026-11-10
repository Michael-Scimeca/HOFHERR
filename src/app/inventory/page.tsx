'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Toggle from '@/components/Toggle';
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

const LOW_STOCK_ALERT_THRESHOLD = 10;

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
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
    const [deadStockLimit, setDeadStockLimit] = useState(12);
    const noteInputRef = useRef<HTMLTextAreaElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { data: session } = useSession();

    // Keep sticky category headers positioned right under the sticky toolbar
    useEffect(() => {
        const el = toolbarRef.current;
        if (!el) return;
        const update = () => {
            const rect = el.getBoundingClientRect();
            const topStr = window.getComputedStyle(el).top;
            const topNum = parseFloat(topStr) || 88;
            const bottomWhenStuck = topNum + rect.height;
            document.documentElement.style.setProperty('--inventory-toolbar-bottom', `${bottomWhenStuck}px`);
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        window.addEventListener('resize', update);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', update);
        };
    }, [viewTab]);

    // Scroll directly to a product row and highlight it
    const scrollToProduct = useCallback((productId: string, categoryName?: string) => {
        // Switch to stock view if not already
        if (viewTab !== 'stock' && viewTab !== 'sales') {
            setViewTab('stock');
        }
        // If there's an active category filter blocking this product, reset to all
        if (categoryFilter !== 'all' && categoryName && categoryFilter !== categoryName) {
            setCategoryFilter('all');
        }
        if (searchQuery) {
            setSearchQuery('');
        }

        setHighlightedProductId(productId);

        setTimeout(() => {
            const el = document.getElementById(`product-row-${productId}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);

        setTimeout(() => {
            setHighlightedProductId(null);
        }, 3000);
    }, [viewTab, categoryFilter, searchQuery]);

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
            const body: Record<string, any> = { productId, ...patch };
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
            setToastMessage(`Updated ${data.updated} products to "${stockStatus}"`);
        } catch {
            setToastMessage('Failed to update category products. Please try again.');
        }
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
            setToastMessage('Product successfully created');
            await fetchInventory();
        } catch {
            setAddError('Failed to create product');
        } finally {
            setAddSaving(false);
        }
    };

    const deleteProduct = async (productId: string) => {
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId }),
            });
            if (!res.ok) throw new Error('Delete failed');
            setProducts(prev => prev.filter(p => p._id !== productId));
            setToastMessage('Product deleted');
            setDeletingId(null);
        } catch {
            setToastMessage('Failed to delete product. Please try again.');
            setDeletingId(null);
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
            const matchesStatus = statusFilter === 'all'
                || (statusFilter === 'hidden' ? p.hiddenFromShop
                : statusFilter === 'featured' ? Boolean(p.isFeatured)
                : p.stockStatus === statusFilter);
            const matchesCategory = categoryFilter === 'all' || p.categoryName === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });

        // Sort
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
            .sort((a, b) => (b.sales?.totalSold || 0) - (a.sales?.totalSold || 0)).slice(0, 5),
        [products]);

    const allDeadStock = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return products.filter(p => {
            const s = p.sales;
            if (!s) return true;
            if (s.last30Days > 0) return false;
            if (s.lastSoldDate && new Date(s.lastSoldDate) >= thirtyDaysAgo) return false;
            return p.stockQuantity > 0; // only flag items that are in stock but not moving
        }).sort((a, b) => {
            // Sort by last sold date (oldest first), never-sold at top
            const aDate = a.sales?.lastSoldDate ? new Date(a.sales.lastSoldDate).getTime() : 0;
            const bDate = b.sales?.lastSoldDate ? new Date(b.sales.lastSoldDate).getTime() : 0;
            return aDate - bDate;
        });
    }, [products]);

    const deadStock = useMemo(() => {
        return allDeadStock.slice(0, deadStockLimit);
    }, [allDeadStock, deadStockLimit]);

    const totalProducts = products.length;
    const inStock = products.filter(p => p.stockStatus === 'in-stock').length;
    const lowStock = products.filter(p => p.stockStatus === 'low-stock').length;
    const outOfStock = products.filter(p => p.stockStatus === 'out-of-stock').length;
    const featuredCount = products.filter(p => p.isFeatured).length;
    const hiddenCount = products.filter(p => p.hiddenFromShop).length;

    // Products at or below the alert threshold (10 units)
    const lowAlertItems = useMemo(() =>
        products.filter(p => p.stockQuantity <= LOW_STOCK_ALERT_THRESHOLD && p.stockQuantity > 0)
            .sort((a, b) => a.stockQuantity - b.stockQuantity),
        [products]);

    const outOfStockItems = useMemo(() =>
        products.filter(p => p.stockQuantity === 0 || p.stockStatus === 'out-of-stock'),
        [products]);

    const criticalItems = useMemo(() =>
        lowAlertItems.filter(p => p.stockQuantity <= 3),
        [lowAlertItems]);

    const hasAlerts = lowAlertItems.length > 0 || outOfStockItems.length > 0;

    const getTrend = (p: Product) => {
        const s = p.sales;
        if (!s || s.totalSold === 0) return { label: 'No Sales', style: styles.trendSlow };
        if (s.last7Days >= 3) return { label: '🔥 Hot', style: styles.trendHot };
        if (s.last30Days >= 5) return { label: 'Steady', style: styles.trendSteady };
        return { label: 'Slow', style: styles.trendSlow };
    };

    if (loading) {
        return (
            <main className={styles.page}>
                <div className={`container ${styles.loading}`}>Loading Inventory...</div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            {/* ── Hero Header ── */}
            <header className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <div className={styles.heroTitleGroup}>
                        <h1 className={styles.headline}>
                            Inventory <em>Manager</em>
                        </h1>
                        <p className={styles.lastUpdated}>
                            {lastFetched ? `Last synced: ${lastFetched.toLocaleTimeString()} · Threshold: ${threshold} units` : ''}
                            {session?.user?.name ? ` · Admin: ${session.user.name}` : ''}
                        </p>
                    </div>
                    <div className={styles.headerActions}>
                        <button className={styles.addProductBtn} onClick={() => setShowAddModal(true)}>+ Add Product</button>
                        <button className={styles.backBtn} onClick={fetchInventory}>↻ Refresh</button>
                        <button className={styles.backBtn} onClick={() => router.push('/admin')}>← Dashboard</button>
                    </div>
                </div>
            </header>

            {/* ── Main Inventory Workspace ── */}
            <section className="section-sm" aria-labelledby="inventory-controls-heading">
                <h2 id="inventory-controls-heading" className={styles.srOnly}>Inventory Workspace Controls</h2>
                <div className={`container ${styles.workspaceWrap}`}>
                    {/* Toast */}
                    {toastMessage && (
                        <div className={styles.toastBanner}>
                            <span>{toastMessage}</span>
                            <button className={styles.toastDismiss} onClick={() => setToastMessage(null)} aria-label="Dismiss toast">×</button>
                        </div>
                    )}

                    {/* ── View Tabs ── */}
                    <div className={styles.controlsRow}>
                        <div className={styles.viewTabs}>
                            {(['stock', 'sales', 'purchases', 'activity'] as ViewTab[]).map(t => (
                                <button key={t} className={`${styles.viewTab} ${viewTab === t ? styles.viewTabActive : ''}`} onClick={() => setViewTab(t)}>
                                    {t === 'stock' ? '📦 Stock & Status' : t === 'sales' ? '📊 Sales Data' : t === 'purchases' ? '🧾 Purchases' : '🕐 Activity'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Stats Bar ── */}
                    <div className={styles.statsBar}>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Total Products</span>
                            <span className={styles.statValue}>{totalProducts}</span>
                        </div>
                        <div className={`${styles.statCard} ${styles.statCardGold}`}>
                            <span className={styles.statLabel}>In Stock</span>
                            <span className={`${styles.statValue} ${styles.statValueGold}`}>{inStock}</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Low Stock</span>
                            <span className={`${styles.statValue} ${styles.statValueMuted}`}>{lowStock}</span>
                        </div>
                        <div className={`${styles.statCard} ${styles.statCardAlert}`}>
                            <span className={styles.statLabel}>Out of Stock</span>
                            <span className={`${styles.statValue} ${styles.statValueRed}`}>{outOfStock}</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Hidden Cuts</span>
                            <span className={`${styles.statValue} ${styles.statValueMuted}`}>{hiddenCount}</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Below 10 Units</span>
                            <span className={`${styles.statValue} ${styles.statValueGold}`}>{lowAlertItems.length}</span>
                        </div>
                        {viewTab === 'sales' && (
                            <>
                                <div className={styles.statCard}>
                                    <span className={styles.statLabel}>Orders (7 Days)</span>
                                    <span className={`${styles.statValue} ${styles.statValueGold}`}>{summary.ordersLast7Days}</span>
                                </div>
                                <div className={`${styles.statCard} ${styles.statCardGold}`}>
                                    <span className={styles.statLabel}>Revenue (All Time)</span>
                                    <span className={`${styles.statValue} ${styles.statValueGold}`}>${summary.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                            </>
                        )}
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

                            {/* Critical (≤3 units) */}
                            {criticalItems.length > 0 && (
                                <div className={styles.alertSection}>
                                    <span className={styles.alertSectionTitle}>Critical — Restock Immediately</span>
                                    <div className={styles.alertList}>
                                        {criticalItems.map(p => (
                                            <div
                                                key={p._id}
                                                className={styles.alertItem}
                                                onClick={() => scrollToProduct(p._id, p.categoryName)}
                                                title={`Click to edit ${p.name} in table`}
                                            >
                                                <span className={styles.alertItemName}>{p.name}</span>
                                                <span className={styles.alertItemCategory}>{p.categoryName}</span>
                                                <span className={`${styles.alertItemQty} ${styles.alertCritical}`}>{p.stockQuantity} left</span>
                                                <button
                                                    className={styles.alertRestockBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateProduct(p._id, { stockQuantity: 10 });
                                                    }}
                                                    title="Quick restock to 10"
                                                >
                                                    ↻ 10
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Out of Stock */}
                            {outOfStockItems.length > 0 && (
                                <div className={styles.alertSection}>
                                    <span className={styles.alertSectionTitle}>Out of Stock ({outOfStockItems.length})</span>
                                    <div className={styles.alertList}>
                                        {outOfStockItems.map(p => (
                                            <div
                                                key={p._id}
                                                className={styles.alertItem}
                                                onClick={() => scrollToProduct(p._id, p.categoryName)}
                                                title={`Click to edit ${p.name} in table`}
                                            >
                                                <span className={styles.alertItemName}>{p.name}</span>
                                                <span className={styles.alertItemCategory}>{p.categoryName}</span>
                                                <span className={`${styles.alertItemQty} ${styles.alertCritical}`}>0 left</span>
                                                <button
                                                    className={styles.alertRestockBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateProduct(p._id, { stockQuantity: 5 });
                                                    }}
                                                    title="Quick restock to 5"
                                                >
                                                    ↻ 5
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Low Stock (4-10 units) */}
                            {lowAlertItems.filter(p => p.stockQuantity > 3).length > 0 && (
                                <div className={styles.alertSection}>
                                    <span className={styles.alertSectionTitle}>Low Stock (≤{LOW_STOCK_ALERT_THRESHOLD} units) ({lowAlertItems.filter(p => p.stockQuantity > 3).length})</span>
                                    <div className={styles.alertList}>
                                        {lowAlertItems.filter(p => p.stockQuantity > 3).map(p => (
                                            <div
                                                key={p._id}
                                                className={styles.alertItem}
                                                onClick={() => scrollToProduct(p._id, p.categoryName)}
                                                title={`Click to edit ${p.name} in table`}
                                            >
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

                    {/* Collapsed alert indicator when dismissed */}
                    {hasAlerts && alertDismissed && (
                        <button className={styles.alertCollapsed} onClick={() => setAlertDismissed(false)}>
                            {outOfStockItems.length > 0 && <span className={styles.alertCollapsedBadgeRed}>🔴 {outOfStockItems.length}</span>}
                            {lowAlertItems.length > 0 && <span className={styles.alertCollapsedBadgeGold}>⚠️ {lowAlertItems.length}</span>}
                            <span className={styles.alertCollapsedHint}>Show Alerts</span>
                        </button>
                    )}

                    {/* ═══════════════ PURCHASES TAB ═══════════════ */}
                    {viewTab === 'purchases' && (
                        <div className={styles.purchasesPanel}>
                            <div className={styles.panelHeader}>
                                <h3 className={styles.purchasesTitle}>🧾 Purchase History</h3>
                                <p className={styles.purchasesSubtext}>Last 50 orders · {summary.totalOrders} total · ${summary.totalRevenue?.toLocaleString(undefined, { maximumFractionDigits: 0 })} all-time revenue</p>
                            </div>
                            {purchases.length === 0 ? (
                                <div className={styles.empty}>No purchase records found.</div>
                            ) : (
                                <div className={styles.purchasesTable}>
                                    <table className={styles.productTable}>
                                        <thead>
                                            <tr>
                                                <th>Order</th>
                                                <th>Customer</th>
                                                <th>Items</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
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
                                                                <span key={i} className={styles.purchaseItem}>
                                                                    {item.name} ×{item.qty}
                                                                    {item.price && <span className={styles.purchaseItemPrice}>{item.price}</span>}
                                                                </span>
                                                            ))}
                                                            {p.items.length > 3 && <span className={styles.purchaseItemMore}>+{p.items.length - 3} more</span>}
                                                        </div>
                                                    </td>
                                                    <td><span className={styles.purchaseTotal}>${p.total.toFixed(2)}</span></td>
                                                    <td>
                                                        <span className={`${styles.purchaseStatus} ${styles['purchaseStatus_' + p.status.replace(/[^a-z]/g, '')]}`}>
                                                            {p.status === 'completed' ? '✅' : p.status === 'paid' ? '💳' : p.status === 'pending' ? '⏳' : p.status === 'ready_paid' ? '📦' : p.status === 'ready_pending' ? '📦' : '🔄'} {p.status.replace(/_/g, ' ')}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={styles.purchaseDate}>
                                                            {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </span>
                                                        <span className={styles.purchaseTime}>
                                                            {new Date(p.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                        </span>
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
                            <div className={styles.panelHeader}>
                                <h3 className={styles.purchasesTitle}>🕐 Recent Sales Activity (Last 7 Days)</h3>
                            </div>
                            {activity.length === 0 ? (
                                <div className={styles.empty}>No recent activity</div>
                            ) : (
                                <div className={styles.activityList}>
                                    {activity.map((a) => (
                                        <div key={`${a.date}-${a.product}-${a.qty}`} className={styles.activityItem}>
                                            <span className={`${styles.activityDot} ${a.status === 'completed' ? styles.activityDotGold : a.status === 'paid' ? styles.activityDotGold : styles.activityDotRed}`} />
                                            <span className={styles.activityProduct}>{a.product}</span>
                                            <span className={styles.activityQty}>×{a.qty}</span>
                                            <span className={`${styles.activityStatus} ${a.status === 'completed' ? styles.activityStatusCompleted : styles.activityStatusDefault}`}>
                                                {a.status}
                                            </span>
                                            <span className={styles.activityDate}>
                                                {new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {new Date(a.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══════════════ INSIGHTS PANEL — Top Sellers & Dead Stock ═══════════════ */}
                    {(viewTab === 'stock' || viewTab === 'sales') && (topSellers.length > 0 || deadStock.length > 0) && (
                        <div className={styles.insightsPanel}>
                            {/* Top Sellers */}
                            {topSellers.length > 0 && (
                                <div className={styles.insightsSection}>
                                    <h3 className={styles.insightsSectionTitle}>🏆 Top Sellers</h3>
                                    <div className={styles.topSellersGrid}>
                                        {topSellers.map((p, i) => (
                                            <div
                                                key={p._id}
                                                className={`${styles.insightCard} ${i < 3 ? styles.insightCardGold : ''}`}
                                                onClick={() => scrollToProduct(p._id, p.categoryName)}
                                                title={`Click to edit ${p.name} in table`}
                                            >
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

                            {/* Dead Stock — No Movement in 30 Days */}
                            {deadStock.length > 0 && (
                                <div className={styles.insightsSection}>
                                    <div className={styles.insightsSectionHeaderRow}>
                                        <h3 className={styles.insightsSectionTitle}>💤 Slow Moving Inventory (30+ Days)</h3>
                                        <span className={styles.insightCountBadge}>
                                            Showing {deadStock.length} of {allDeadStock.length}
                                        </span>
                                    </div>
                                    <p className={styles.insightsSubtext}>These in-stock items haven&apos;t moved in over a month. Consider featuring them or adjusting case pricing.</p>
                                    <div className={styles.insightsGrid}>
                                        {deadStock.map(p => {
                                            const lastSold = p.sales?.lastSoldDate
                                                ? new Date(p.sales.lastSoldDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                : 'Never sold';
                                            return (
                                                <div
                                                    key={p._id}
                                                    className={`${styles.insightCard} ${styles.insightCardDead}`}
                                                    onClick={() => scrollToProduct(p._id, p.categoryName)}
                                                    title={`Click to edit ${p.name} in table`}
                                                >
                                                    <div className={styles.insightCardHeader}>
                                                        <span className={styles.insightName}>{p.name}</span>
                                                        <span className={styles.slowBadgeOxblood}>STAGNANT</span>
                                                    </div>
                                                    <div className={styles.insightMeta}>
                                                        <span className={styles.insightCategory}>{p.categoryName}</span>
                                                        <span className={styles.insightStat}>{p.stockQuantity} in stock</span>
                                                    </div>
                                                    <div className={styles.insightFooter}>
                                                        <span className={styles.insightLastSold}>Last sold: {lastSold}</span>
                                                        <div className={styles.insightFooterActions}>
                                                            <span className={styles.insightRevenue}>{p.price}</span>
                                                            <button
                                                                type="button"
                                                                className={styles.quickRestockBtn}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateProduct(p._id, { stockQuantity: p.stockQuantity + 5 });
                                                                }}
                                                                title="Add +5 units to stock"
                                                            >
                                                                +5 Stock
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {allDeadStock.length > 12 && (
                                        <div className={styles.insightsFooterRow}>
                                            {deadStockLimit < allDeadStock.length && (
                                                <button
                                                    type="button"
                                                    className={styles.insightsMoreBtn}
                                                    onClick={() => setDeadStockLimit(l => l + 12)}
                                                >
                                                    + Show 12 More ({allDeadStock.length - deadStockLimit} remaining)
                                                </button>
                                            )}
                                            {deadStockLimit < allDeadStock.length && (
                                                <button
                                                    type="button"
                                                    className={styles.insightsAllBtn}
                                                    onClick={() => setDeadStockLimit(allDeadStock.length)}
                                                >
                                                    Show All ({allDeadStock.length})
                                                </button>
                                            )}
                                            {deadStockLimit > 12 && (
                                                <button
                                                    type="button"
                                                    className={styles.insightsLessBtn}
                                                    onClick={() => setDeadStockLimit(12)}
                                                >
                                                    Collapse to 12
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Toolbar (stock & sales views) ── */}
                    {(viewTab === 'stock' || viewTab === 'sales') && (
                        <div ref={toolbarRef} className={styles.toolbar}>
                            <input
                                type="text"
                                placeholder="Search products or categories..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                            <select
                                value={categoryFilter}
                                onChange={e => setCategoryFilter(e.target.value)}
                                className={styles.filterSelect}
                                aria-label="Filter by category"
                            >
                                <option value="all">All Categories</option>
                                {uniqueCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as SortOption)}
                                className={styles.filterSelect}
                                aria-label="Sort products by"
                            >
                                <option value="category">Sort: Category</option>
                                <option value="name-asc">Sort: Name A–Z</option>
                                <option value="name-desc">Sort: Name Z–A</option>
                                <option value="qty-asc">Sort: Stock Low → High</option>
                                <option value="qty-desc">Sort: Stock High → Low</option>
                                <option value="price-asc">Sort: Price Low → High</option>
                                <option value="price-desc">Sort: Price High → Low</option>
                            </select>
                            <div className={styles.filterBtnGroup}>
                                {['all', 'in-stock', 'low-stock', 'out-of-stock', 'featured', 'hidden'].map(f => (
                                    <button
                                        key={f}
                                        className={`${styles.filterBtn} ${statusFilter === f ? styles.filterBtnActive : ''}`}
                                        onClick={() => setStatusFilter(f)}
                                    >
                                        {f === 'all' ? `All (${totalProducts})` : f === 'in-stock' ? `In Stock (${inStock})` : f === 'low-stock' ? `Low (${lowStock})` : f === 'out-of-stock' ? `Out (${outOfStock})` : f === 'featured' ? `Featured (${featuredCount})` : `Hidden (${hiddenCount})`}
                                    </button>
                                ))}
                            </div>
                            {(categoryFilter !== 'all' || sortBy !== 'category' || statusFilter !== 'all' || searchQuery) && (
                                <button
                                    className={styles.clearFiltersBtn}
                                    onClick={() => { setCategoryFilter('all'); setSortBy('category'); setStatusFilter('all'); setSearchQuery(''); }}
                                >
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
                            <div className={styles.categoriesStack}>
                                {Object.entries(categories).sort(([a], [b]) => a.localeCompare(b)).map(([catName, { id: catId, items, revenue }]) => {
                                    const isAllInStock = items.length > 0 && items.every(p => p.stockStatus === 'in-stock');
                                    const isAllOut = items.length > 0 && items.every(p => p.stockStatus === 'out-of-stock');
                                    return (
                                        <div key={catName} className={styles.categoryGroup}>
                                            <div className={styles.categoryHeader}>
                                                <span className={styles.categoryName}>
                                                    {catName}
                                                    <span className={styles.categoryCount}>{items.length}</span>
                                                    {viewTab === 'sales' && revenue > 0 && <span className={styles.categoryRevenue}>${revenue.toFixed(0)}</span>}
                                                </span>
                                                <div className={styles.categoryActions}>
                                                    <button
                                                        type="button"
                                                        className={`${styles.catBtn} ${styles.catBtnGold} ${isAllInStock ? styles.catBtnGoldActive : ''}`}
                                                        onClick={() => bulkUpdate(catId, 'in-stock', 10)}
                                                        title={isAllInStock ? 'Currently all in stock' : 'Set all items in this category to In Stock (10 units)'}
                                                    >
                                                        {isAllInStock ? '✓ All In Stock' : '✅ All In Stock'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`${styles.catBtn} ${styles.catBtnRed} ${isAllOut ? styles.catBtnRedActive : ''}`}
                                                        onClick={() => bulkUpdate(catId, 'out-of-stock', 0)}
                                                        title={isAllOut ? 'Currently all out of stock' : 'Set all items in this category to Out of Stock (0 units)'}
                                                    >
                                                        {isAllOut ? '● All Out' : '🔴 All Out'}
                                                    </button>
                                                </div>
                                            </div>
                                        <div className={styles.tableWrap}>
                                            <table className={styles.productTable}>
                                                    <thead>
                                                        <tr>
                                                            <th>Product</th>
                                                            <th>Price</th>
                                                            <th>Quantity</th>
                                                            <th>Status</th>
                                                            {viewTab === 'sales' && <th>Sold</th>}
                                                            {viewTab === 'sales' && <th>Trend</th>}
                                                            {viewTab === 'stock' && (
                                                                <th>
                                                                    <span className={styles.thWithInfo}>
                                                                        Flags
                                                                        <span className={styles.thInfoBadge} title="Flags explain how products appear in the storefront">
                                                                            <span className={styles.thInfoIcon}>i</span>
                                                                            <span className={styles.thInfoTooltip}>
                                                                                <strong className={styles.thInfoTooltipTitle}>Storefront Merchandising Flags</strong>
                                                                                <span><strong>Visible</strong>: Customer visibility in online shop and search.</span>
                                                                                <span><strong>Featured</strong>: Showcase in Butcher&apos;s Specials &amp; hero sections.</span>
                                                                                <span><strong>New</strong>: Emerald arrival badge on customer cards.</span>
                                                                            </span>
                                                                        </span>
                                                                    </span>
                                                                </th>
                                                            )}
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map(p => {
                                                            const trend = getTrend(p);
                                                            const isHighlighted = highlightedProductId === p._id;
                                                            const isOOS = p.stockQuantity === 0;
                                                            const isLow = p.stockQuantity > 0 && p.stockQuantity <= LOW_STOCK_ALERT_THRESHOLD;
                                                            return (
                                                                <tr
                                                                    key={p._id}
                                                                    id={`product-row-${p._id}`}
                                                                    className={`${p.hiddenFromShop ? styles.rowHidden : ''} ${isOOS ? styles.rowOOS : ''} ${isLow ? styles.rowLowStock : ''} ${isHighlighted ? styles.highlightRow : ''}`}
                                                                >
                                                                <td>
                                                                    <div className={styles.productCellStack}>
                                                                        <span className={`${styles.productName} ${p.hiddenFromShop ? styles.productNameHidden : ''}`}>
                                                                            {p.name}
                                                                        </span>
                                                                        <div className={styles.productTags}>
                                                                            {p.hiddenFromShop && <span className={`${styles.badge} ${styles.badgeSale}`}>Hidden</span>}
                                                                            {p.isFeatured && <span className={`${styles.badge} ${styles.badgeFeatured}`}>Featured</span>}
                                                                            {p.isNew && <span className={`${styles.badge} ${styles.badgeNew}`}>New</span>}
                                                                            {p.salePrice && <span className={`${styles.badge} ${styles.badgeSale}`}>Sale</span>}
                                                                            {(() => {
                                                                                if (!p.expiryDate) return null;
                                                                                const exp = new Date(p.expiryDate);
                                                                                return (
                                                                                    <span className={`${styles.badge} ${styles.badgeExpiry}`}>
                                                                                        📅 {exp.toISOString().slice(0, 10)}
                                                                                    </span>
                                                                                );
                                                                            })()}
                                                                        </div>
                                                                        <div className={styles.metaToolsRow}>
                                                                            <input
                                                                                type="date"
                                                                                className={styles.expiryInput}
                                                                                value={p.expiryDate || ''}
                                                                                onChange={e => updateProduct(p._id, { expiryDate: e.target.value || null })}
                                                                                title={p.expiryDate ? `Expires: ${new Date(p.expiryDate).toLocaleDateString()}` : 'Set expiry date'}
                                                                            />
                                                                            {editingNote === p._id ? (
                                                                                <textarea
                                                                                    ref={noteInputRef}
                                                                                    className={styles.noteInput}
                                                                                    value={noteValue}
                                                                                    onChange={e => setNoteValue(e.target.value)}
                                                                                    onKeyDown={e => {
                                                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                                                            e.preventDefault();
                                                                                            const trimmed = noteValue.trim();
                                                                                            if (trimmed !== (p.adminNotes || '').trim()) {
                                                                                                updateProduct(p._id, { adminNotes: trimmed || null });
                                                                                            }
                                                                                            setEditingNote(null);
                                                                                        } else if (e.key === 'Escape') {
                                                                                            setEditingNote(null);
                                                                                        }
                                                                                    }}
                                                                                    onBlur={() => {
                                                                                        const trimmed = noteValue.trim();
                                                                                        if (trimmed !== (p.adminNotes || '').trim()) {
                                                                                            updateProduct(p._id, { adminNotes: trimmed || null });
                                                                                        }
                                                                                        setEditingNote(null);
                                                                                    }}
                                                                                    placeholder="Add a note..."
                                                                                    rows={2}
                                                                                />
                                                                            ) : (
                                                                                <button
                                                                                    className={`${styles.noteDisplay} ${p.adminNotes ? styles.noteHasContent : ''}`}
                                                                                    onClick={() => {
                                                                                        setEditingNote(p._id);
                                                                                        setNoteValue(p.adminNotes || '');
                                                                                    }}
                                                                                    title={p.adminNotes || 'Click to add a note'}
                                                                                >
                                                                                    {p.adminNotes ? `📝 ${p.adminNotes.length > 40 ? p.adminNotes.slice(0, 40) + '…' : p.adminNotes}` : '📝 Add note'}
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
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
                                                                            <button
                                                                                type="button"
                                                                                className={styles.priceEditable}
                                                                                onClick={() => {
                                                                                    setEditingPrice({ id: p._id, field: 'price' });
                                                                                    setEditPriceValue(p.price);
                                                                                }}
                                                                                title="Click to edit price"
                                                                            >
                                                                                {p.price}
                                                                            </button>
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
                                                                                    {p.salePrice ? '✏️' : '🏷️ Sale'}
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className={styles.qtyControl}>
                                                                        <button
                                                                            className={styles.qtyBtn}
                                                                            onClick={() => updateProduct(p._id, { stockQuantity: p.stockQuantity - 1 })}
                                                                            disabled={p.stockQuantity <= 0}
                                                                            aria-label="Decrease quantity"
                                                                        >
                                                                            −
                                                                        </button>
                                                                        <span className={`${styles.qtyValue} ${p.stockQuantity <= LOW_STOCK_ALERT_THRESHOLD && p.stockQuantity > 0 ? styles.qtyWarning : ''} ${p.stockQuantity === 0 ? styles.qtyDanger : ''}`}>
                                                                            {p.stockQuantity ?? 0}
                                                                        </span>
                                                                        <button
                                                                            className={styles.qtyBtn}
                                                                            onClick={() => updateProduct(p._id, { stockQuantity: p.stockQuantity + 1 })}
                                                                            aria-label="Increase quantity"
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span className={`${styles.statusBadge} ${styles[STATUS_STYLES[p.stockStatus] || 'statusInStock']}`}>
                                                                        {STATUS_LABELS[p.stockStatus] || p.stockStatus}
                                                                    </span>
                                                                </td>
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
                                                                            <Toggle
                                                                                size="sm"
                                                                                checked={!p.hiddenFromShop}
                                                                                onChange={val => updateProduct(p._id, { hiddenFromShop: !val })}
                                                                                label={p.hiddenFromShop ? 'Hidden' : 'Visible'}
                                                                                variant="gold"
                                                                                title={p.hiddenFromShop ? 'Product is hidden from shop' : 'Product is visible on shop'}
                                                                                infoSnippet={p.hiddenFromShop
                                                                                    ? 'Controls storefront visibility. Currently HIDDEN. Toggle ON to show in shop.'
                                                                                    : 'Controls storefront visibility. Currently VISIBLE in online shop and search.'}
                                                                            />
                                                                            <Toggle
                                                                                size="sm"
                                                                                checked={Boolean(p.isFeatured)}
                                                                                onChange={val => updateProduct(p._id, { isFeatured: val })}
                                                                                label="Featured"
                                                                                variant="gold"
                                                                                title="Feature on store showcases"
                                                                                infoSnippet="Spotlights product in Butcher's Specials, signature cut carousels, and homepage showcases."
                                                                            />
                                                                            <Toggle
                                                                                size="sm"
                                                                                checked={Boolean(p.isNew)}
                                                                                onChange={val => updateProduct(p._id, { isNew: val })}
                                                                                label="New"
                                                                                variant="red"
                                                                                title="Mark as new arrival"
                                                                                infoSnippet="Displays an emerald 'NEW' arrival badge on customer storefront cards."
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                )}
                                                                <td>
                                                                    <div className={styles.rowActions}>
                                                                        {savingStates[p._id] === 'saving' && <span className={styles.saving}>Saving…</span>}
                                                                        {savingStates[p._id] === 'saved' && <span className={styles.saved}>✓ Saved</span>}
                                                                        {deletingId === p._id ? (
                                                                            <div className={styles.confirmDeleteGroup}>
                                                                                <button
                                                                                    className={styles.confirmDeleteBtn}
                                                                                    onClick={() => deleteProduct(p._id)}
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                                <button
                                                                                    className={styles.cancelDeleteBtn}
                                                                                    onClick={() => setDeletingId(null)}
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <button
                                                                                className={styles.deleteBtn}
                                                                                onClick={() => setDeletingId(p._id)}
                                                                                title="Delete product"
                                                                                aria-label={`Delete ${p.name}`}
                                                                            >
                                                                                🗑️
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                            </div>
                        )
                    )}

                    {/* ═══════════════ ADD PRODUCT MODAL ═══════════════ */}
                    {showAddModal && (
                        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                                <div className={styles.modalHeader}>
                                    <h2>Add New Product</h2>
                                    <button className={styles.modalClose} onClick={() => setShowAddModal(false)} aria-label="Close modal">×</button>
                                </div>
                                {addError && <div className={styles.modalError}>{addError}</div>}
                                <div className={styles.modalForm}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="prod-name">Product Name *</label>
                                        <input
                                            id="prod-name"
                                            type="text"
                                            placeholder="e.g. Wagyu Ribeye"
                                            value={addForm.name}
                                            onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                                            className={styles.formInput}
                                            autoFocus
                                        />
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="prod-price">Price *</label>
                                            <input
                                                id="prod-price"
                                                type="text"
                                                placeholder="$42.99/lb"
                                                value={addForm.price}
                                                onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))}
                                                className={styles.formInput}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label htmlFor="prod-qty">Starting Quantity</label>
                                            <input
                                                id="prod-qty"
                                                type="number"
                                                min="0"
                                                max="99"
                                                value={addForm.stockQuantity}
                                                onChange={e => setAddForm(f => ({ ...f, stockQuantity: parseInt(e.target.value) || 0 }))}
                                                className={styles.formInput}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="prod-category">Category *</label>
                                        <select
                                            id="prod-category"
                                            value={addForm.categoryId}
                                            onChange={e => setAddForm(f => ({ ...f, categoryId: e.target.value }))}
                                            className={styles.formInput}
                                        >
                                            <option value="">Select a category...</option>
                                            {availableCategories.map(cat => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat.label} ({cat.store})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="prod-desc">Description (optional)</label>
                                        <input
                                            id="prod-desc"
                                            type="text"
                                            placeholder="Short description..."
                                            value={addForm.description}
                                            onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                                            className={styles.formInput}
                                        />
                                    </div>
                                </div>
                                <div className={styles.modalActions}>
                                    <button className={styles.modalCancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
                                    <button className={styles.modalSaveBtn} onClick={createProduct} disabled={addSaving}>
                                        {addSaving ? 'Creating...' : '✓ Create Product'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
                                                );
}
