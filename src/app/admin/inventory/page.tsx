'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Toggle from '@/components/Toggle';
import BurnModalShell from '@/components/BurnModalShell';
import { usePageTransition } from '@/components/PageTransition';
import styles from './inventory.module.css';

type SalesData = {
    totalSold: number;
    last30Days: number;
    last7Days: number;
    lastSoldDate: string | null;
    revenue: number;
};

type Product = {
    _id: string;
    name: string;
    price: string;
    salePrice?: string | null;
    stockStatus: string;
    stockQuantity: number;
    isFeatured?: boolean;
    isNew?: boolean;
    hiddenFromShop?: boolean;
    adminNotes?: string | null;
    expiryDate?: string | null;
    categoryName: string;
    categoryId: string;
    store?: string;
    sales: SalesData;
};

type Activity = { product: string; qty: number; date: string; status: string };
type PurchaseItem = { name: string; qty: number; price: string | null };
type Purchase = {
    _id: string;
    orderNumber: string | null;
    customerName: string;
    customerEmail: string | null;
    items: PurchaseItem[];
    total: number;
    status: string;
    date: string;
    pickedUpAt?: string;
    archivedAt?: string;
    archivedFromQueue?: boolean;
    storeName?: string;
};

type Summary = {
    totalOrders: number;
    totalRevenue: number;
    ordersLast7Days: number;
    ordersLast30Days: number;
};

type SavingState = 'idle' | 'saving' | 'saved';
type ViewTab = 'stock' | 'sales' | 'purchases' | 'activity';
type CategoryInfo = { _id: string; label: string; id: string; store: string };
type SortOption =
    | 'name-asc'
    | 'name-desc'
    | 'qty-asc'
    | 'qty-desc'
    | 'price-asc'
    | 'price-desc'
    | 'category';

const LOW_STOCK_ALERT_THRESHOLD = 10;
const INITIAL_OOS_ALERT_LIMIT = 12;
const ARCHIVED_INVENTORY_ORDERS_STORAGE_KEY = 'hofherr_archived_inventory_orders_v1';

const VIEW_TAB_ORDER: ViewTab[] = ['stock', 'sales', 'purchases', 'activity'];

const VIEW_TAB_LABELS: Record<ViewTab, string> = {
    stock: 'Stock & Status',
    sales: 'Sales Analytics',
    purchases: 'Purchases',
    activity: 'Activity',
};

const SEED_ARCHIVED_PICKED_UP_PURCHASES: Purchase[] = [
    {
        _id: 'demo-completed-1',
        orderNumber: 'HM-4829',
        customerName: 'Hofherr Master Admin',
        customerEmail: 'admin@hofherrmeats.com',
        storeName: 'The Butcher Shop',
        items: [
            { name: 'USDA Prime Dry-Aged Bone-In Ribeye', qty: 2, price: '$42.00' },
            { name: 'House-Smoked Applewood Thick-Cut Bacon', qty: 2, price: '$16.50' },
            { name: 'Hofherr Signature Steakhouse Rub', qty: 1, price: '$12.50' },
        ],
        total: 168.5,
        status: 'completed',
        pickedUpAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        archivedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        archivedFromQueue: true,
    },
    {
        _id: 'demo-completed-archived-2',
        orderNumber: 'HM-4812',
        customerName: 'Eleanor Sterling',
        customerEmail: 'eleanor.sterling@winnetka.org',
        storeName: 'The Butcher Shop',
        items: [
            { name: 'Australian Wagyu BMS 8+ NY Strip', qty: 2, price: '$68.00' },
            { name: 'Roasted Bone Marrow Canoes', qty: 2, price: '$18.00' },
        ],
        total: 172.0,
        status: 'completed',
        pickedUpAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        archivedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        archivedFromQueue: true,
    },
];

const STATUS_LABELS: Record<string, string> = {
    'in-stock': 'In Stock',
    'low-stock': 'Low Stock',
    'out-of-stock': 'Out of Stock',
    'pre-order': 'Pre-Order',
    seasonal: 'Seasonal',
};

const STATUS_STYLES: Record<string, string> = {
    'in-stock': 'statusInStock',
    'low-stock': 'statusLowStock',
    'out-of-stock': 'statusOutOfStock',
    'pre-order': 'statusPreOrder',
    seasonal: 'statusSeasonal',
};

function parsePrice(price: string): number {
    const match = price?.match(/\$(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
}

function slugifyId(input: string): string {
    return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'group';
}

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [threshold, setThreshold] = useState(3);
    const [activity, setActivity] = useState<Activity[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [summary, setSummary] = useState<Summary>({
        totalOrders: 0,
        totalRevenue: 0,
        ordersLast7Days: 0,
        ordersLast30Days: 0,
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [storeFilter, setStoreFilter] = useState<'all' | 'butcher' | 'depot'>('all');
    const [sortBy, setSortBy] = useState<SortOption>('category');
    const [savingStates, setSavingStates] = useState<Record<string, SavingState>>({});
    const [lastFetched, setLastFetched] = useState<Date | null>(null);
    const [viewTab, setViewTab] = useState<ViewTab>('stock');
    const [editingPrice, setEditingPrice] = useState<{ id: string; field: 'price' | 'salePrice' } | null>(null);
    const [editPriceValue, setEditPriceValue] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [addModalClosing, setAddModalClosing] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
    const [deleteModalClosing, setDeleteModalClosing] = useState(false);
    const [deleteBusy, setDeleteBusy] = useState(false);
    const [addForm, setAddForm] = useState({
        name: '',
        price: '',
        categoryId: '',
        description: '',
        stockQuantity: 5,
    });
    const [addError, setAddError] = useState('');
    const [addSaving, setAddSaving] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<CategoryInfo[]>([]);
    const [alertDismissed, setAlertDismissed] = useState(false);
    const [showAllOOSAlerts, setShowAllOOSAlerts] = useState(false);
    const [deadStockLimit, setDeadStockLimit] = useState(12);
    const [editingNote, setEditingNote] = useState<string | null>(null);
    const [noteValue, setNoteValue] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);

    const priceInputRef = useRef<HTMLInputElement>(null);
    const noteInputRef = useRef<HTMLTextAreaElement>(null);
    const addDialogRef = useRef<HTMLDialogElement>(null);
    const deleteDialogRef = useRef<HTMLDialogElement>(null);
    const addSavingRef = useRef(false);
    const deleteBusyRef = useRef(false);
    const tabRefs = useRef<Record<ViewTab, HTMLButtonElement | null>>({
        stock: null,
        sales: null,
        purchases: null,
        activity: null,
    });

    const router = useRouter();
    const { navigateTo } = usePageTransition();
    const { data: session } = useSession();

    const openAddModal = useCallback(() => {
        setAddModalClosing(false);
        setShowAddModal(true);
    }, []);

    const finalizeCloseAddModal = useCallback(() => {
        setAddModalClosing(false);
        setShowAddModal(false);
        setAddError('');
    }, []);

    const requestCloseAddModal = useCallback(() => {
        if (!addSavingRef.current) {
            setAddModalClosing(true);
        }
    }, []);

    const finalizeCloseDeleteModal = useCallback(() => {
        setDeleteModalClosing(false);
        setPendingDelete(null);
    }, []);

    const requestCloseDeleteModal = useCallback(() => {
        if (!deleteBusyRef.current) {
            setDeleteModalClosing(true);
        }
    }, []);

    // Listen for dev modal trigger event & initial query parameters
    useEffect(() => {
        window.addEventListener('hofherr-dev-add-product-modal', openAddModal);

        const params = new URLSearchParams(window.location.search);
        if (params.get('devModal') === 'add') {
            queueMicrotask(openAddModal);
        }
        const tabParam = params.get('tab');
        if (
            tabParam === 'purchases' ||
            tabParam === 'activity' ||
            tabParam === 'sales' ||
            tabParam === 'stock'
        ) {
            queueMicrotask(() => setViewTab(tabParam));
        }

        return () => window.removeEventListener('hofherr-dev-add-product-modal', openAddModal);
    }, [openAddModal]);

    // Sync native Add Product <dialog> with showAddModal state
    useEffect(() => {
        const dialog = addDialogRef.current;
        if (!dialog) return;
        if (showAddModal && !dialog.open) {
            dialog.showModal();
        } else if (!showAddModal && dialog.open) {
            dialog.close();
        }
    }, [showAddModal]);

    // Light-dismiss outside the BurnModalShell card with reversed flame burn-out
    useEffect(() => {
        const dialog = addDialogRef.current;
        if (!dialog) return;
        let pressedBackdrop = false;
        const onPointerDown = (e: PointerEvent) => {
            pressedBackdrop = e.target === dialog;
        };
        const onPointerUp = (e: PointerEvent) => {
            if (pressedBackdrop && e.target === dialog) {
                requestCloseAddModal();
            }
            pressedBackdrop = false;
        };
        dialog.addEventListener('pointerdown', onPointerDown);
        dialog.addEventListener('pointerup', onPointerUp);
        return () => {
            dialog.removeEventListener('pointerdown', onPointerDown);
            dialog.removeEventListener('pointerup', onPointerUp);
        };
    }, [loading, requestCloseAddModal]);

    // Sync native Delete Confirmation <dialog> with pendingDelete state
    useEffect(() => {
        const dialog = deleteDialogRef.current;
        if (!dialog) return;
        if (pendingDelete && !dialog.open) {
            dialog.showModal();
        } else if (!pendingDelete && dialog.open) {
            dialog.close();
        }
    }, [pendingDelete]);

    // Keep active tab scrolled into view inside single-row horizontal tablist
    useEffect(() => {
        const activeBtn = tabRefs.current[viewTab];
        activeBtn?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }, [viewTab]);

    // Auto-clear toast after 4.5s
    useEffect(() => {
        if (!toastMessage) return;
        const timer = window.setTimeout(() => setToastMessage(null), 4500);
        return () => window.clearTimeout(timer);
    }, [toastMessage]);

    // Auto-clear highlighted row after 3s
    useEffect(() => {
        if (!highlightedProductId) return;
        const timer = window.setTimeout(() => setHighlightedProductId(null), 3000);
        return () => window.clearTimeout(timer);
    }, [highlightedProductId]);

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
            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/admin/login');
                    return;
                }
                throw new Error('Fetch failed');
            }
            const data = await res.json();
            setProducts(data.products || []);
            setThreshold(data.threshold ?? 3);

            let localArchivedOrders: Purchase[] = [];
            try {
                const rawArchived = window.localStorage.getItem(ARCHIVED_INVENTORY_ORDERS_STORAGE_KEY);
                if (rawArchived) {
                    const parsed = JSON.parse(rawArchived);
                    if (Array.isArray(parsed)) {
                        localArchivedOrders = parsed.map((rec: Record<string, unknown>) => ({
                            _id: String(rec._id || `archived-${rec.orderNumber || 'order'}`),
                            orderNumber: typeof rec.orderNumber === 'string' ? rec.orderNumber : 'HM-4895',
                            customerName: typeof rec.customerName === 'string' ? rec.customerName : 'Guest',
                            customerEmail: typeof rec.customerEmail === 'string' ? rec.customerEmail : null,
                            storeName: typeof rec.storeName === 'string' ? rec.storeName : 'The Butcher Shop',
                            items: Array.isArray(rec.items) ? (rec.items as PurchaseItem[]) : [],
                            total: Number(rec.totalDollars || 0),
                            status: 'completed',
                            pickedUpAt:
                                typeof rec.pickedUpAt === 'string'
                                    ? rec.pickedUpAt
                                    : new Date().toISOString(),
                            archivedAt:
                                typeof rec.archivedAt === 'string'
                                    ? rec.archivedAt
                                    : new Date().toISOString(),
                            date:
                                typeof rec.pickedUpAt === 'string'
                                    ? rec.pickedUpAt
                                    : new Date().toISOString(),
                            archivedFromQueue: true,
                        }));
                    }
                }
            } catch {
                // ignore storage parse issues
            }

            const apiPurchases: Purchase[] = Array.isArray(data.purchases) ? data.purchases : [];
            const seenOrderNums = new Set<string>();
            const mergedPurchases: Purchase[] = [];

            [...localArchivedOrders, ...SEED_ARCHIVED_PICKED_UP_PURCHASES, ...apiPurchases].forEach(p => {
                const key = p.orderNumber || p._id;
                if (!seenOrderNums.has(key)) {
                    seenOrderNums.add(key);
                    mergedPurchases.push(p);
                }
            });

            setPurchases(mergedPurchases);

            const archivedActivity: Activity[] = mergedPurchases
                .filter(p => p.archivedFromQueue)
                .flatMap(p =>
                    (p.items || []).map(item => ({
                        product: `${item.name} (Order #${p.orderNumber} · Archived >24h)`,
                        qty: item.qty || 1,
                        date: p.pickedUpAt || p.date,
                        status: 'completed',
                    }))
                );

            setActivity([...archivedActivity, ...(data.activity || [])]);
            setSummary(
                data.summary || {
                    totalOrders: 0,
                    totalRevenue: 0,
                    ordersLast7Days: 0,
                    ordersLast30Days: 0,
                }
            );
            setAvailableCategories(data.categories || []);
            setLastFetched(new Date());
        } catch (err) {
            console.error('[Inventory] Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    const scrollToProduct = useCallback(
        (productId: string, categoryName?: string) => {
            if (viewTab !== 'stock' && viewTab !== 'sales') {
                setViewTab('stock');
            }
            if (categoryFilter !== 'all' && categoryName && categoryFilter !== categoryName) {
                setCategoryFilter('all');
            }
            if (statusFilter !== 'all') {
                setStatusFilter('all');
            }
            if (storeFilter !== 'all') {
                setStoreFilter('all');
            }
            if (searchQuery) {
                setSearchQuery('');
            }
            setHighlightedProductId(productId);
            window.setTimeout(() => {
                const rowEl = document.getElementById(`product-row-${productId}`);
                rowEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 90);
        },
        [viewTab, categoryFilter, statusFilter, storeFilter, searchQuery]
    );

    const updateProduct = async (productId: string, patch: Record<string, unknown>) => {
        setProducts(prev =>
            prev.map(p => {
                if (p._id !== productId) return p;
                const updated = { ...p, ...patch } as Product;
                if (typeof patch.stockQuantity === 'number') {
                    const qty = Math.max(0, Math.min(99, patch.stockQuantity));
                    updated.stockQuantity = qty;
                    if (qty === 0) updated.stockStatus = 'out-of-stock';
                    else if (qty <= threshold) updated.stockStatus = 'low-stock';
                    else if (p.stockStatus === 'out-of-stock' || p.stockStatus === 'low-stock') {
                        updated.stockStatus = 'in-stock';
                    }
                }
                return updated;
            })
        );
        setSavingStates(prev => ({ ...prev, [productId]: 'saving' }));
        try {
            const body: Record<string, unknown> = { productId, ...patch };
            if (typeof patch.stockQuantity === 'number') {
                body.stockQuantity = Math.max(0, Math.min(99, patch.stockQuantity));
            }
            const res = await fetch('/api/admin/inventory', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error('Update failed');
            const data = await res.json();
            setProducts(prev => prev.map(p => (p._id === productId ? { ...p, ...data } : p)));
            setSavingStates(prev => ({ ...prev, [productId]: 'saved' }));
            window.setTimeout(() => {
                setSavingStates(prev => ({ ...prev, [productId]: 'idle' }));
            }, 1500);
        } catch {
            setSavingStates(prev => ({ ...prev, [productId]: 'idle' }));
            setToastMessage('Could not save product update. Refreshing live inventory…');
            fetchInventory();
        }
    };

    const bulkUpdate = async (categoryId: string, stockStatus: string, stockQuantity?: number) => {
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryId, stockStatus, stockQuantity }),
            });
            if (!res.ok) throw new Error('Bulk update failed');
            const data = await res.json();
            await fetchInventory();
            setToastMessage(`Updated ${data.updated} products to "${STATUS_LABELS[stockStatus] || stockStatus}".`);
        } catch {
            setToastMessage('Failed to update category stock status. Please try again.');
        }
    };

    const createProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddError('');
        if (!addForm.name.trim()) {
            setAddError('Product name is required.');
            return;
        }
        if (!addForm.price.trim()) {
            setAddError('Price is required (e.g. $42.99/lb).');
            return;
        }
        if (!addForm.categoryId) {
            setAddError('Please choose a category.');
            return;
        }
        addSavingRef.current = true;
        setAddSaving(true);
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addForm),
            });
            if (!res.ok) {
                const err = await res.json();
                setAddError(err.error || 'Failed to create product.');
                return;
            }
            setAddModalClosing(true);
            setAddForm({ name: '', price: '', categoryId: '', description: '', stockQuantity: 5 });
            setToastMessage(`Added "${addForm.name.trim()}" to inventory.`);
            await fetchInventory();
        } catch {
            setAddError('Failed to create product. Please try again.');
        } finally {
            addSavingRef.current = false;
            setAddSaving(false);
        }
    };

    const confirmDeleteProduct = async () => {
        if (!pendingDelete) return;
        deleteBusyRef.current = true;
        setDeleteBusy(true);
        const { id, name } = pendingDelete;
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: id }),
            });
            if (!res.ok) throw new Error('Delete failed');
            setProducts(prev => prev.filter(p => p._id !== id));
            setToastMessage(`Removed "${name}" from inventory.`);
            setDeleteModalClosing(true);
        } catch {
            setToastMessage(`Could not delete "${name}". Please try again.`);
            setDeleteModalClosing(true);
        } finally {
            deleteBusyRef.current = false;
            setDeleteBusy(false);
        }
    };

    const handleTabListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const currentIndex = VIEW_TAB_ORDER.indexOf(viewTab);
        let nextIndex = -1;
        if (e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % VIEW_TAB_ORDER.length;
        } else if (e.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + VIEW_TAB_ORDER.length) % VIEW_TAB_ORDER.length;
        } else if (e.key === 'Home') {
            nextIndex = 0;
        } else if (e.key === 'End') {
            nextIndex = VIEW_TAB_ORDER.length - 1;
        }
        if (nextIndex >= 0) {
            e.preventDefault();
            const nextTab = VIEW_TAB_ORDER[nextIndex];
            setViewTab(nextTab);
            tabRefs.current[nextTab]?.focus();
        }
    };

    const uniqueCategories = useMemo(
        () => [...new Set(products.map(p => p.categoryName).filter(Boolean))].sort(),
        [products]
    );

    const butcherCount = useMemo(
        () => products.filter(p => (p.store || 'butcher') === 'butcher').length,
        [products]
    );
    const depotCount = useMemo(
        () => products.filter(p => p.store === 'depot').length,
        [products]
    );

    const butcherCategories = useMemo(
        () =>
            [
                ...new Set(
                    products
                        .filter(p => (p.store || 'butcher') === 'butcher')
                        .map(p => p.categoryName)
                        .filter(Boolean)
                ),
            ].sort(),
        [products]
    );

    const depotCategories = useMemo(
        () =>
            [
                ...new Set(
                    products
                        .filter(p => p.store === 'depot')
                        .map(p => p.categoryName)
                        .filter(Boolean)
                ),
            ].sort(),
        [products]
    );

    const filtered = useMemo(() => {
        const result = products.filter(p => {
            const matchesSearch =
                !searchQuery ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'hidden'
                    ? Boolean(p.hiddenFromShop)
                    : statusFilter === 'featured'
                      ? Boolean(p.isFeatured)
                      : p.stockStatus === statusFilter);
            const matchesCategory = categoryFilter === 'all' || p.categoryName === categoryFilter;
            const matchesStore = storeFilter === 'all' || (p.store || 'butcher') === storeFilter;
            return matchesSearch && matchesStatus && matchesCategory && matchesStore;
        });

        return [...result].sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'qty-asc':
                    return a.stockQuantity - b.stockQuantity;
                case 'qty-desc':
                    return b.stockQuantity - a.stockQuantity;
                case 'price-asc':
                    return parsePrice(a.price) - parsePrice(b.price);
                case 'price-desc':
                    return parsePrice(b.price) - parsePrice(a.price);
                case 'category':
                default:
                    return (
                        (a.categoryName || '').localeCompare(b.categoryName || '') ||
                        a.name.localeCompare(b.name)
                    );
            }
        });
    }, [products, searchQuery, statusFilter, categoryFilter, storeFilter, sortBy]);

    const categories = useMemo(
        () =>
            filtered.reduce(
                (acc, p) => {
                    const cat = p.categoryName || 'Uncategorized';
                    if (!acc[cat]) {
                        acc[cat] = { id: p.categoryId, store: p.store || 'butcher', items: [], revenue: 0 };
                    }
                    acc[cat].items.push(p);
                    acc[cat].revenue += p.sales?.revenue || 0;
                    return acc;
                },
                {} as Record<string, { id: string; store: string; items: Product[]; revenue: number }>
            ),
        [filtered]
    );

    const topSellers = useMemo(
        () =>
            [...products]
                .filter(p => (p.sales?.totalSold || 0) > 0)
                .sort((a, b) => (b.sales?.totalSold || 0) - (a.sales?.totalSold || 0))
                .slice(0, 8),
        [products]
    );

    const allDeadStock = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return products
            .filter(p => {
                const s = p.sales;
                if (!s) return p.stockQuantity > 0;
                if (s.last30Days > 0) return false;
                if (s.lastSoldDate && new Date(s.lastSoldDate) >= thirtyDaysAgo) return false;
                return p.stockQuantity > 0;
            })
            .sort((a, b) => {
                const aDate = a.sales?.lastSoldDate ? new Date(a.sales.lastSoldDate).getTime() : 0;
                const bDate = b.sales?.lastSoldDate ? new Date(b.sales.lastSoldDate).getTime() : 0;
                return aDate - bDate;
            });
    }, [products]);

    const deadStock = useMemo(() => allDeadStock.slice(0, deadStockLimit), [allDeadStock, deadStockLimit]);

    const totalProducts = products.length;
    const inStock = products.filter(p => p.stockStatus === 'in-stock').length;
    const lowStock = products.filter(p => p.stockStatus === 'low-stock').length;
    const outOfStock = products.filter(p => p.stockStatus === 'out-of-stock').length;
    const featuredCount = products.filter(p => p.isFeatured).length;
    const hiddenCount = products.filter(p => p.hiddenFromShop).length;

    const getTrend = (p: Product) => {
        const s = p.sales;
        if (!s || s.totalSold === 0) return { label: 'No Sales', style: styles.trendSlow };
        if (s.last7Days >= 3) return { label: 'Hot', style: styles.trendHot };
        if (s.last30Days >= 5) return { label: 'Steady', style: styles.trendSteady };
        return { label: 'Slow', style: styles.trendSlow };
    };

    const lowAlertItems = useMemo(
        () =>
            products
                .filter(p => p.stockQuantity <= LOW_STOCK_ALERT_THRESHOLD && p.stockQuantity > 0)
                .sort((a, b) => a.stockQuantity - b.stockQuantity),
        [products]
    );
    const outOfStockItems = useMemo(
        () => products.filter(p => p.stockQuantity === 0 || p.stockStatus === 'out-of-stock'),
        [products]
    );
    const criticalItems = useMemo(() => lowAlertItems.filter(p => p.stockQuantity <= 3), [lowAlertItems]);
    const nonCriticalLowItems = useMemo(
        () => lowAlertItems.filter(p => p.stockQuantity > 3),
        [lowAlertItems]
    );
    const hasAlerts = lowAlertItems.length > 0 || outOfStockItems.length > 0;

    const visibleOOSItems = showAllOOSAlerts
        ? outOfStockItems
        : outOfStockItems.slice(0, INITIAL_OOS_ALERT_LIMIT);

    const toggleQuickStatusFilter = (target: string) => {
        if (viewTab !== 'stock' && viewTab !== 'sales') {
            setViewTab('stock');
        }
        setStatusFilter(prev => (prev === target ? 'all' : target));
    };

    if (loading) return <div className="route-loading" aria-busy="true" />;

    return (
        <main className={styles.page}>
            {/* ── Open Hero Header ── */}
            <header className={styles.hero}>
                <div className="container">
                    <div className={styles.heroInner}>
                        <div className={styles.heroTitleGroup}>
                            <h1 className={styles.headline}>
                                Inventory <em>Manager</em>
                            </h1>
                            <p className={styles.lastUpdated}>
                                <span className={styles.syncDot} aria-hidden="true" />
                                {lastFetched
                                    ? `Last synced ${lastFetched.toLocaleTimeString()} · Low-stock threshold: ${threshold} units`
                                    : 'Live inventory workspace'}
                                {session?.user?.name ? ` · ${session.user.name}` : ''}
                            </p>
                        </div>
                        <div className={styles.headerActions}>
                            <button
                                type="button"
                                className="btn-hit"
                                onClick={openAddModal}
                            >
                                <span className="btn btn-primary">
                                    <svg
                                        className={styles.btnIcon}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                    Add Product
                                </span>
                            </button>
                            <button type="button" className="btn-hit" onClick={fetchInventory}>
                                <span className="btn btn-secondary">
                                    <svg
                                        className={styles.btnIcon}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                                        <polyline points="21 3 21 9 15 9" />
                                    </svg>
                                    Refresh
                                </span>
                            </button>
                            <button
                                type="button"
                                className="btn-hit"
                                onClick={() => navigateTo('/admin-dashboard/admin')}
                            >
                                <span className="btn btn-secondary">
                                    <svg
                                        className={styles.btnIcon}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                    Dashboard
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main Inventory Section ── */}
            <section
                id="inventory-workspace"
                aria-labelledby="inventory-workspace-heading"
                className="section-sm"
            >
                <h2 id="inventory-workspace-heading" className={styles.srOnly}>
                    Inventory Workspace
                </h2>
                <div className="container">
                    <div className={styles.workspaceStack}>
                        {/* Status Toast */}
                        {toastMessage && (
                            <div className={styles.toastBanner} role="status" aria-live="polite">
                                <span className={styles.toastContent}>
                                    <svg
                                        className={`${styles.btnIcon} ${styles.toastIcon}`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {toastMessage}
                                </span>
                                <button
                                    type="button"
                                    className={styles.toastDismiss}
                                    onClick={() => setToastMessage(null)}
                                    aria-label="Dismiss notification"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {/* ── Accessible Single-Row Tablist ── */}
                        <div
                            className={styles.tabList}
                            role="tablist"
                            aria-label="Inventory workspace views"
                            onKeyDown={handleTabListKeyDown}
                            {...({ focusgroup: 'tablist nomemory' } as Record<string, string>)}
                        >
                            {VIEW_TAB_ORDER.map(t => {
                                const isSelected = viewTab === t;
                                const count =
                                    t === 'stock'
                                        ? totalProducts
                                        : t === 'purchases'
                                          ? purchases.length
                                          : t === 'activity'
                                            ? activity.length
                                            : null;
                                return (
                                    <button
                                        key={t}
                                        ref={el => {
                                            tabRefs.current[t] = el;
                                        }}
                                        type="button"
                                        role="tab"
                                        id={`inventory-tab-${t}`}
                                        aria-selected={isSelected}
                                        tabIndex={isSelected ? 0 : -1}
                                        className={styles.viewTab}
                                        onClick={() => setViewTab(t)}
                                        {...(isSelected
                                            ? ({ focusgroupstart: '' } as Record<string, string>)
                                            : {})}
                                    >
                                        {t === 'stock' && (
                                            <svg
                                                className={styles.btnIcon}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                                <line x1="12" y1="22.08" x2="12" y2="12" />
                                            </svg>
                                        )}
                                        {t === 'sales' && (
                                            <svg
                                                className={styles.btnIcon}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <line x1="18" y1="20" x2="18" y2="10" />
                                                <line x1="12" y1="20" x2="12" y2="4" />
                                                <line x1="6" y1="20" x2="6" y2="14" />
                                            </svg>
                                        )}
                                        {t === 'purchases' && (
                                            <svg
                                                className={styles.btnIcon}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="16" y1="13" x2="8" y2="13" />
                                                <line x1="16" y1="17" x2="8" y2="17" />
                                            </svg>
                                        )}
                                        {t === 'activity' && (
                                            <svg
                                                className={styles.btnIcon}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                        )}
                                        <span>{VIEW_TAB_LABELS[t]}</span>
                                        {count !== null && <span className={styles.tabBadge}>{count}</span>}
                                    </button>
                                );
                            })}
                        </div>

                        {/* ── KPI Summary Grid ── */}
                        <div className={styles.statsBar}>
                            <button
                                type="button"
                                className={`${styles.statCard} ${styles.statCardInteractive} ${statusFilter === 'all' && (viewTab === 'stock' || viewTab === 'sales') ? styles.statCardActiveFilter : ''}`}
                                onClick={() => toggleQuickStatusFilter('all')}
                            >
                                <span className={styles.statLabel}>Total Products</span>
                                <span className={styles.statValue}>{totalProducts}</span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.statCard} ${styles.statCardPositive} ${styles.statCardInteractive} ${statusFilter === 'in-stock' ? styles.statCardActiveFilter : ''}`}
                                onClick={() => toggleQuickStatusFilter('in-stock')}
                            >
                                <span className={styles.statLabel}>In Stock</span>
                                <span className={`${styles.statValue} ${styles.statValueGreen}`}>{inStock}</span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.statCard} ${styles.statCardGold} ${styles.statCardInteractive} ${statusFilter === 'low-stock' ? styles.statCardActiveFilter : ''}`}
                                onClick={() => toggleQuickStatusFilter('low-stock')}
                            >
                                <span className={styles.statLabel}>Low Stock</span>
                                <span className={`${styles.statValue} ${styles.statValueGold}`}>{lowStock}</span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.statCard} ${outOfStock > 0 ? styles.statCardAlert : ''} ${styles.statCardInteractive} ${statusFilter === 'out-of-stock' ? styles.statCardActiveFilter : ''}`}
                                onClick={() => toggleQuickStatusFilter('out-of-stock')}
                            >
                                <span className={styles.statLabel}>Out of Stock</span>
                                <span className={`${styles.statValue} ${styles.statValueRed}`}>{outOfStock}</span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.statCard} ${styles.statCardInteractive} ${statusFilter === 'hidden' ? styles.statCardActiveFilter : ''}`}
                                onClick={() => toggleQuickStatusFilter('hidden')}
                            >
                                <span className={styles.statLabel}>Hidden Cuts</span>
                                <span className={`${styles.statValue} ${styles.statValueMuted}`}>{hiddenCount}</span>
                            </button>
                            {viewTab === 'sales' && (
                                <>
                                    <div className={`${styles.statCard} ${styles.statCardGold}`}>
                                        <span className={styles.statLabel}>Orders (7 Days)</span>
                                        <span className={`${styles.statValue} ${styles.statValueGold}`}>
                                            {summary.ordersLast7Days}
                                        </span>
                                    </div>
                                    <div className={`${styles.statCard} ${styles.statCardPositive}`}>
                                        <span className={styles.statLabel}>Revenue (All Time)</span>
                                        <span className={`${styles.statValue} ${styles.statValueGreen}`}>
                                            ${summary.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ── Restock Alert Notification Panel ── */}
                        {hasAlerts && !alertDismissed && (
                            <div className={styles.alertBanner}>
                                <div className={styles.alertHeader}>
                                    <div className={styles.alertTitleWrap}>
                                        <svg
                                            className={`${styles.btnIcon} ${styles.alertTitleIcon}`}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                            <line x1="12" y1="9" x2="12" y2="13" />
                                            <line x1="12" y1="17" x2="12.01" y2="17" />
                                        </svg>
                                        <h3 className={styles.alertTitle}>
                                            {outOfStockItems.length > 0 && (
                                                <span>{outOfStockItems.length} Out of Stock</span>
                                            )}
                                            {outOfStockItems.length > 0 && lowAlertItems.length > 0 && (
                                                <span className={styles.alertTitleDivider}>·</span>
                                            )}
                                            {lowAlertItems.length > 0 && (
                                                <span className={styles.alertTitleGold}>
                                                    {lowAlertItems.length} Low Stock
                                                    {criticalItems.length > 0
                                                        ? ` (${criticalItems.length} critical)`
                                                        : ''}
                                                </span>
                                            )}
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.alertDismiss}
                                        onClick={() => setAlertDismissed(true)}
                                        aria-label="Dismiss stock alerts"
                                        title="Dismiss stock alerts"
                                    >
                                        ×
                                    </button>
                                </div>

                                {criticalItems.length > 0 && (
                                    <div className={styles.alertSection}>
                                        <span className={styles.alertSectionTitle}>
                                            Critical — Restock Immediately (≤3 units)
                                        </span>
                                        <div className={styles.alertList}>
                                            {criticalItems.map(p => (
                                                <div
                                                    key={p._id}
                                                    className={`${styles.alertItem} ${styles.alertItemCritical}`}
                                                >
                                                    <button
                                                        type="button"
                                                        className={styles.alertJumpBtn}
                                                        onClick={() => scrollToProduct(p._id, p.categoryName)}
                                                        title={`Jump to ${p.name}`}
                                                    >
                                                        <span className={styles.alertItemName}>{p.name}</span>
                                                        <span className={styles.alertItemCategory}>
                                                            {p.categoryName}
                                                        </span>
                                                    </button>
                                                    <div className={styles.alertItemActions}>
                                                        <span
                                                            className={`${styles.alertItemQty} ${styles.alertCritical}`}
                                                        >
                                                            {p.stockQuantity} left
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className={styles.alertRestockBtn}
                                                            onClick={() =>
                                                                updateProduct(p._id, { stockQuantity: 10 })
                                                            }
                                                            title="Quick restock to 10 units"
                                                        >
                                                            +10
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {outOfStockItems.length > 0 && (
                                    <div className={styles.alertSection}>
                                        <div className={styles.alertSectionHeader}>
                                            <span className={styles.alertSectionTitle}>
                                                Out of Stock ({outOfStockItems.length})
                                            </span>
                                            {outOfStockItems.length > INITIAL_OOS_ALERT_LIMIT && (
                                                <button
                                                    type="button"
                                                    className={styles.alertToggleMoreBtn}
                                                    onClick={() => setShowAllOOSAlerts(v => !v)}
                                                >
                                                    {showAllOOSAlerts
                                                        ? `Collapse to ${INITIAL_OOS_ALERT_LIMIT}`
                                                        : `Show All (${outOfStockItems.length})`}
                                                </button>
                                            )}
                                        </div>
                                        <div className={styles.alertList}>
                                            {visibleOOSItems.map(p => (
                                                <div
                                                    key={p._id}
                                                    className={`${styles.alertItem} ${styles.alertItemOOS}`}
                                                >
                                                    <button
                                                        type="button"
                                                        className={styles.alertJumpBtn}
                                                        onClick={() => scrollToProduct(p._id, p.categoryName)}
                                                        title={`Jump to ${p.name}`}
                                                    >
                                                        <span className={styles.alertItemName}>{p.name}</span>
                                                        <span className={styles.alertItemCategory}>
                                                            {p.categoryName}
                                                        </span>
                                                    </button>
                                                    <div className={styles.alertItemActions}>
                                                        <span
                                                            className={`${styles.alertItemQty} ${styles.alertCritical}`}
                                                        >
                                                            0 left
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className={styles.alertRestockBtn}
                                                            onClick={() =>
                                                                updateProduct(p._id, { stockQuantity: 5 })
                                                            }
                                                            title="Quick restock to 5 units"
                                                        >
                                                            +5
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {nonCriticalLowItems.length > 0 && (
                                    <div className={styles.alertSection}>
                                        <span className={styles.alertSectionTitle}>
                                            Low Stock (≤{LOW_STOCK_ALERT_THRESHOLD} units)
                                        </span>
                                        <div className={styles.alertList}>
                                            {nonCriticalLowItems.map(p => (
                                                <div
                                                    key={p._id}
                                                    className={`${styles.alertItem} ${styles.alertItemLow}`}
                                                >
                                                    <button
                                                        type="button"
                                                        className={styles.alertJumpBtn}
                                                        onClick={() => scrollToProduct(p._id, p.categoryName)}
                                                        title={`Jump to ${p.name}`}
                                                    >
                                                        <span className={styles.alertItemName}>{p.name}</span>
                                                        <span className={styles.alertItemCategory}>
                                                            {p.categoryName}
                                                        </span>
                                                    </button>
                                                    <span className={styles.alertItemQty}>
                                                        {p.stockQuantity} left
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {hasAlerts && alertDismissed && (
                            <button
                                type="button"
                                className={styles.alertCollapsed}
                                onClick={() => setAlertDismissed(false)}
                            >
                                {outOfStockItems.length > 0 && (
                                    <span className={styles.alertCollapsedBadgeRed}>
                                        {outOfStockItems.length} Out
                                    </span>
                                )}
                                {lowAlertItems.length > 0 && (
                                    <span className={styles.alertCollapsedBadgeGold}>
                                        {lowAlertItems.length} Low
                                    </span>
                                )}
                                <span className={styles.alertCollapsedText}>Show Stock Alerts</span>
                            </button>
                        )}

                        {/* ═══════════════ PURCHASES TAB PANEL ═══════════════ */}
                        <div
                            role="tabpanel"
                            id="inventory-panel-purchases"
                            aria-labelledby="inventory-tab-purchases"
                            hidden={viewTab !== 'purchases'}
                        >
                            {viewTab === 'purchases' && (
                                <div className={styles.purchasesPanel}>
                                    <div className={styles.purchasesHeaderRow}>
                                        <div className={styles.panelHeaderCopy}>
                                            <h3 id="purchases-panel-heading" className={styles.panelTitle}>
                                                Purchase &amp; Picked-Up Inventory History
                                            </h3>
                                            <p className={styles.purchasesSubtext}>
                                                Includes completed orders auto-archived{' '}
                                                <strong>24 hours (1 day)</strong> after customer pickup ·{' '}
                                                {purchases.length} recorded orders · $
                                                {summary.totalRevenue?.toLocaleString(undefined, {
                                                    maximumFractionDigits: 0,
                                                })}{' '}
                                                all-time revenue
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn-hit"
                                            onClick={() => navigateTo('/admin-dashboard/admin')}
                                        >
                                            <span className="btn btn-secondary">Back to Live Admin Queue</span>
                                        </button>
                                    </div>

                                    {purchases.length === 0 ? (
                                        <div className={styles.emptyState}>
                                            <h3 className={styles.emptyTitle}>No Purchase Records Yet</h3>
                                            <p className={styles.emptySub}>
                                                Completed counter pickups and online orders will appear here
                                                automatically.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className={styles.purchasesTableFrame}>
                                            <div
                                                tabIndex={0}
                                                role="region"
                                                aria-labelledby="purchases-panel-heading"
                                                className={styles.tableRegion}
                                            >
                                                <table
                                                    className={`${styles.productTable} ${styles.purchasesDataTable}`}
                                                >
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">Order</th>
                                                            <th scope="col">Customer</th>
                                                            <th scope="col">Items &amp; Stock Deducted</th>
                                                            <th scope="col">Total</th>
                                                            <th scope="col">Lifecycle &amp; Archive Status</th>
                                                            <th scope="col">Picked Up / Archived</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {purchases.map(p => (
                                                            <tr
                                                                key={p._id}
                                                                className={
                                                                    p.archivedFromQueue
                                                                        ? styles.archivedPurchaseRow
                                                                        : undefined
                                                                }
                                                            >
                                                                <th scope="row">
                                                                    <span className={styles.orderNumber}>
                                                                        #{p.orderNumber || '—'}
                                                                    </span>
                                                                    {p.storeName && (
                                                                        <span className={styles.purchaseStoreSub}>
                                                                            {p.storeName}
                                                                        </span>
                                                                    )}
                                                                </th>
                                                                <td>
                                                                    <div>
                                                                        <span className={styles.customerName}>
                                                                            {p.customerName}
                                                                        </span>
                                                                        {p.customerEmail && (
                                                                            <span className={styles.customerEmail}>
                                                                                {p.customerEmail}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className={styles.purchaseItems}>
                                                                        {p.items.slice(0, 3).map(item => (
                                                                            <span
                                                                                key={`${p._id}-${item.name}-${item.qty}`}
                                                                                className={styles.purchaseItem}
                                                                            >
                                                                                {item.name} ×{item.qty}
                                                                                {item.price && (
                                                                                    <span
                                                                                        className={
                                                                                            styles.purchaseItemPrice
                                                                                        }
                                                                                    >
                                                                                        {' '}
                                                                                        ({item.price})
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        ))}
                                                                        {p.items.length > 3 && (
                                                                            <span className={styles.purchaseItemMore}>
                                                                                +{p.items.length - 3} more
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span className={styles.purchaseTotal}>
                                                                        ${p.total.toFixed(2)}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <div className={styles.purchaseStatusStack}>
                                                                        <span
                                                                            className={`${styles.purchaseStatus} ${styles['purchaseStatus_' + p.status.replace(/[^a-z]/g, '')] || ''}`}
                                                                        >
                                                                            {p.status === 'completed'
                                                                                ? 'Picked Up'
                                                                                : p.status.replace(/_/g, ' ')}
                                                                        </span>
                                                                        {p.archivedFromQueue && (
                                                                            <span className={styles.archivedQueueBadge}>
                                                                                Archived &gt;24h · Inventory Logged
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div>
                                                                        <span className={styles.purchaseDate}>
                                                                            {new Date(
                                                                                p.pickedUpAt || p.date
                                                                            ).toLocaleDateString('en-US', {
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                            })}
                                                                        </span>
                                                                        <span className={styles.purchaseTime}>
                                                                            {p.archivedFromQueue
                                                                                ? 'Picked up & archived >1d'
                                                                                : new Date(
                                                                                      p.date
                                                                                  ).toLocaleTimeString('en-US', {
                                                                                      hour: 'numeric',
                                                                                      minute: '2-digit',
                                                                                  })}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ═══════════════ ACTIVITY TAB PANEL ═══════════════ */}
                        <div
                            role="tabpanel"
                            id="inventory-panel-activity"
                            aria-labelledby="inventory-tab-activity"
                            hidden={viewTab !== 'activity'}
                        >
                            {viewTab === 'activity' && (
                                <div className={styles.activityPanel}>
                                    <div className={styles.panelHeaderCopy}>
                                        <h3 className={styles.panelTitle}>
                                            Recent Sales Activity (Last 7 Days)
                                        </h3>
                                    </div>
                                    {activity.length === 0 ? (
                                        <div className={styles.emptyState}>
                                            <h3 className={styles.emptyTitle}>No Recent Activity</h3>
                                            <p className={styles.emptySub}>
                                                Recent order deductions from the last 7 days will show up here.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className={styles.activityList}>
                                            {activity.map(a => (
                                                <div
                                                    key={`${a.date}-${a.product}-${a.qty}`}
                                                    className={styles.activityItem}
                                                >
                                                    <span
                                                        className={`${styles.activityDot} ${
                                                            a.status === 'completed'
                                                                ? styles.activityDotGreen
                                                                : a.status === 'paid'
                                                                  ? styles.activityDotGold
                                                                  : styles.activityDotRed
                                                        }`}
                                                        aria-hidden="true"
                                                    />
                                                    <span className={styles.activityProduct}>{a.product}</span>
                                                    <span className={styles.activityQty}>×{a.qty}</span>
                                                    <span
                                                        className={`${styles.activityStatus} ${
                                                            a.status === 'completed'
                                                                ? styles.activityStatusCompleted
                                                                : styles.activityStatusPaid
                                                        }`}
                                                    >
                                                        {a.status}
                                                    </span>
                                                    <span className={styles.activityDate}>
                                                        {new Date(a.date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}{' '}
                                                        {new Date(a.date).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ═══════════════ STOCK & SALES TAB PANEL ═══════════════ */}
                        <div
                            role="tabpanel"
                            id={`inventory-panel-${viewTab === 'sales' ? 'sales' : 'stock'}`}
                            aria-labelledby={`inventory-tab-${viewTab === 'sales' ? 'sales' : 'stock'}`}
                            hidden={viewTab !== 'stock' && viewTab !== 'sales'}
                        >
                            {(viewTab === 'stock' || viewTab === 'sales') && (
                                <div className={styles.tabPanelStack}>
                                    {/* Insights Panel */}
                                    {(topSellers.length > 0 || deadStock.length > 0) && (
                                        <div className={styles.insightsPanel}>
                                            {topSellers.length > 0 && (
                                                <div className={styles.insightsSection}>
                                                    <h3 className={styles.insightsSectionTitle}>
                                                        <svg
                                                            className={`${styles.btnIcon} ${styles.sectionTitleIconGold}`}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            aria-hidden="true"
                                                        >
                                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                        </svg>
                                                        Top Sellers
                                                    </h3>
                                                    <div className={styles.topSellersGrid}>
                                                        {topSellers.map((p, i) => (
                                                            <button
                                                                key={p._id}
                                                                type="button"
                                                                className={`${styles.insightCard} ${i < 3 ? styles.insightCardGold : ''}`}
                                                                onClick={() =>
                                                                    scrollToProduct(p._id, p.categoryName)
                                                                }
                                                                title={`Jump to ${p.name} in table`}
                                                            >
                                                                <div className={styles.insightCardHeader}>
                                                                    <span className={styles.insightHeaderLeft}>
                                                                        <span className={styles.insightRank}>
                                                                            #{i + 1}
                                                                        </span>
                                                                        <span className={styles.insightName}>
                                                                            {p.name}
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <div className={styles.insightMeta}>
                                                                    <span className={styles.insightCategory}>
                                                                        {p.categoryName}
                                                                    </span>
                                                                    <span className={styles.insightStat}>
                                                                        {p.sales.totalSold} sold
                                                                    </span>
                                                                </div>
                                                                <div className={styles.insightFooter}>
                                                                    <span className={styles.insightWeekly}>
                                                                        {p.sales.last7Days} this wk ·{' '}
                                                                        {p.sales.last30Days} this mo
                                                                    </span>
                                                                    {p.sales.revenue > 0 && (
                                                                        <span className={styles.insightRevenue}>
                                                                            ${p.sales.revenue.toFixed(0)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {deadStock.length > 0 && (
                                                <div className={styles.insightsSection}>
                                                    <div className={styles.insightsSectionHeaderRow}>
                                                        <h3 className={styles.insightsSectionTitle}>
                                                            <svg
                                                                className={`${styles.btnIcon} ${styles.sectionTitleIconMuted}`}
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                aria-hidden="true"
                                                            >
                                                                <circle cx="12" cy="12" r="10" />
                                                                <polyline points="12 6 12 12 16 14" />
                                                            </svg>
                                                            No Movement (30+ Days)
                                                        </h3>
                                                        <span className={styles.insightCountBadge}>
                                                            Showing {deadStock.length} of {allDeadStock.length}
                                                        </span>
                                                    </div>
                                                    <p className={styles.insightsSubtext}>
                                                        In-stock items with zero recorded sales over the past 30
                                                        days. Consider featuring them or adding a case special.
                                                    </p>
                                                    <div className={styles.insightsGrid}>
                                                        {deadStock.map(p => {
                                                            const lastSold = p.sales?.lastSoldDate
                                                                ? new Date(
                                                                      p.sales.lastSoldDate
                                                                  ).toLocaleDateString('en-US', {
                                                                      month: 'short',
                                                                      day: 'numeric',
                                                                  })
                                                                : 'Never sold';
                                                            return (
                                                                <div
                                                                    key={p._id}
                                                                    role="button"
                                                                    tabIndex={0}
                                                                    className={`${styles.insightCard} ${styles.insightCardDead}`}
                                                                    onClick={() =>
                                                                        scrollToProduct(p._id, p.categoryName)
                                                                    }
                                                                    onKeyDown={e => {
                                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                                            e.preventDefault();
                                                                            scrollToProduct(p._id, p.categoryName);
                                                                        }
                                                                    }}
                                                                    title={`Jump to ${p.name} in table`}
                                                                >
                                                                    <div className={styles.insightCardHeader}>
                                                                        <span className={styles.insightName}>
                                                                            {p.name}
                                                                        </span>
                                                                        <span className={styles.slowBadge}>
                                                                            Stagnant
                                                                        </span>
                                                                    </div>
                                                                    <div className={styles.insightMeta}>
                                                                        <span className={styles.insightCategory}>
                                                                            {p.categoryName}
                                                                        </span>
                                                                        <span className={styles.insightStat}>
                                                                            {p.stockQuantity} in stock
                                                                        </span>
                                                                    </div>
                                                                    <div className={styles.insightFooter}>
                                                                        <span className={styles.insightLastSold}>
                                                                            Last sold: {lastSold}
                                                                        </span>
                                                                        <div className={styles.insightFooterActions}>
                                                                            <span className={styles.insightPrice}>
                                                                                {p.price}
                                                                            </span>
                                                                            <button
                                                                                type="button"
                                                                                className={styles.quickRestockBtn}
                                                                                onClick={e => {
                                                                                    e.stopPropagation();
                                                                                    updateProduct(p._id, {
                                                                                        isFeatured: !p.isFeatured,
                                                                                    });
                                                                                }}
                                                                            >
                                                                                {p.isFeatured
                                                                                    ? 'Featured'
                                                                                    : 'Feature'}
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
                                                                    Show 12 More ({allDeadStock.length - deadStockLimit}{' '}
                                                                    remaining)
                                                                </button>
                                                            )}
                                                            {deadStockLimit < allDeadStock.length && (
                                                                <button
                                                                    type="button"
                                                                    className={styles.insightsSecondaryBtn}
                                                                    onClick={() =>
                                                                        setDeadStockLimit(allDeadStock.length)
                                                                    }
                                                                >
                                                                    Show All ({allDeadStock.length})
                                                                </button>
                                                            )}
                                                            {deadStockLimit > 12 && (
                                                                <button
                                                                    type="button"
                                                                    className={styles.insightsSecondaryBtn}
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

                                    {/* Sticky Filter & Store Toolbar */}
                                    <div className={styles.toolbar}>
                                        <div className={styles.toolbarTopRow}>
                                            <div className={styles.storeFilterRow}>
                                                <button
                                                    type="button"
                                                    className={`${styles.storePill} ${storeFilter === 'all' ? styles.storePillActiveAll : ''}`}
                                                    onClick={() => setStoreFilter('all')}
                                                >
                                                    <span>All Locations</span>
                                                    <span className={styles.storePillBadge}>
                                                        {totalProducts}
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`${styles.storePill} ${storeFilter === 'butcher' ? styles.storePillActiveButcher : ''}`}
                                                    onClick={() => setStoreFilter('butcher')}
                                                >
                                                    <span>Northfield Butcher</span>
                                                    <span className={styles.storePillBadge}>
                                                        {butcherCount}
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`${styles.storePill} ${storeFilter === 'depot' ? styles.storePillActiveDepot : ''}`}
                                                    onClick={() => setStoreFilter('depot')}
                                                >
                                                    <span>Winnetka Depot</span>
                                                    <span className={styles.storePillBadge}>{depotCount}</span>
                                                </button>
                                            </div>

                                            {(categoryFilter !== 'all' ||
                                                storeFilter !== 'all' ||
                                                sortBy !== 'category' ||
                                                statusFilter !== 'all' ||
                                                searchQuery) && (
                                                <button
                                                    type="button"
                                                    className={styles.clearFiltersBtn}
                                                    onClick={() => {
                                                        setCategoryFilter('all');
                                                        setStoreFilter('all');
                                                        setSortBy('category');
                                                        setStatusFilter('all');
                                                        setSearchQuery('');
                                                    }}
                                                >
                                                    Clear Filters
                                                </button>
                                            )}
                                        </div>

                                        <div className={styles.toolbarControlsRow}>
                                            <div className={styles.searchWrap}>
                                                <svg
                                                    className={`${styles.btnIcon} ${styles.searchIcon}`}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden="true"
                                                >
                                                    <circle cx="11" cy="11" r="8" />
                                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                                </svg>
                                                <input
                                                    type="search"
                                                    placeholder="Search cuts or categories…"
                                                    aria-label="Search cuts or categories"
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                    className={styles.searchInput}
                                                />
                                            </div>

                                            <select
                                                value={categoryFilter}
                                                onChange={e => setCategoryFilter(e.target.value)}
                                                className={styles.filterSelect}
                                                aria-label="Filter by category"
                                            >
                                                <option value="all">
                                                    All Categories ({uniqueCategories.length})
                                                </option>
                                                {storeFilter !== 'depot' && butcherCategories.length > 0 && (
                                                    <optgroup label="Northfield Butcher Shop">
                                                        {butcherCategories.map(cat => (
                                                            <option key={cat} value={cat}>
                                                                {cat}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                )}
                                                {storeFilter !== 'butcher' && depotCategories.length > 0 && (
                                                    <optgroup label="Winnetka Depot">
                                                        {depotCategories.map(cat => (
                                                            <option key={cat} value={cat}>
                                                                {cat}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                )}
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
                                                {[
                                                    'all',
                                                    'in-stock',
                                                    'low-stock',
                                                    'out-of-stock',
                                                    'featured',
                                                    'hidden',
                                                ].map(f => (
                                                    <button
                                                        key={f}
                                                        type="button"
                                                        className={`${styles.filterBtn} ${statusFilter === f ? styles.filterBtnActive : ''}`}
                                                        onClick={() => setStatusFilter(f)}
                                                    >
                                                        {f === 'all'
                                                            ? `All (${totalProducts})`
                                                            : f === 'in-stock'
                                                              ? `In Stock (${inStock})`
                                                              : f === 'low-stock'
                                                                ? `Low (${lowStock})`
                                                                : f === 'out-of-stock'
                                                                  ? `Out (${outOfStock})`
                                                                  : f === 'featured'
                                                                    ? `Featured (${featuredCount})`
                                                                    : `Hidden (${hiddenCount})`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category Groups & Responsive Data Tables */}
                                    {Object.keys(categories).length === 0 ? (
                                        <div className={styles.emptyState}>
                                            <h3 className={styles.emptyTitle}>No Matching Cuts Found</h3>
                                            <p className={styles.emptySub}>
                                                Try clearing your active search or status filters, or add a new
                                                product to the shop catalog.
                                            </p>
                                            <button
                                                type="button"
                                                className="btn-hit"
                                                onClick={() => {
                                                    setCategoryFilter('all');
                                                    setStoreFilter('all');
                                                    setSortBy('category');
                                                    setStatusFilter('all');
                                                    setSearchQuery('');
                                                }}
                                            >
                                                <span className="btn btn-secondary">Reset All Filters</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.categoriesStack}>
                                            {Object.entries(categories)
                                                .sort(([a], [b]) => a.localeCompare(b))
                                                .map(([catName, { id: catId, store: catStore, items, revenue }]) => {
                                                    const isDepot = catStore === 'depot';
                                                    const isAllInStock =
                                                        items.length > 0 &&
                                                        items.every(p => p.stockStatus === 'in-stock');
                                                    const isAllOut =
                                                        items.length > 0 &&
                                                        items.every(p => p.stockStatus === 'out-of-stock');
                                                    const catHeadingId = `category-heading-${slugifyId(catName)}`;

                                                    return (
                                                        <div
                                                            key={catName}
                                                            className={`${styles.categoryGroup} ${isDepot ? styles.categoryGroupDepot : styles.categoryGroupButcher}`}
                                                        >
                                                            <div
                                                                className={`${styles.categoryHeader} ${isDepot ? styles.categoryHeaderDepot : styles.categoryHeaderButcher}`}
                                                            >
                                                                <div className={styles.categoryTitleGroup}>
                                                                    <h3
                                                                        id={catHeadingId}
                                                                        className={styles.categoryHeading}
                                                                    >
                                                                        {catName}
                                                                    </h3>
                                                                    <span
                                                                        className={
                                                                            isDepot
                                                                                ? styles.categoryCountDepot
                                                                                : styles.categoryCountButcher
                                                                        }
                                                                    >
                                                                        {items.length}
                                                                    </span>
                                                                    <span
                                                                        className={`${styles.storeBadge} ${isDepot ? styles.storeBadgeDepot : styles.storeBadgeButcher}`}
                                                                    >
                                                                        {isDepot
                                                                            ? 'Winnetka Depot'
                                                                            : 'Northfield Butcher'}
                                                                    </span>
                                                                    {viewTab === 'sales' && revenue > 0 && (
                                                                        <span className={styles.categoryRevenue}>
                                                                            ${revenue.toFixed(0)} rev
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className={styles.categoryActions}>
                                                                    <button
                                                                        type="button"
                                                                        className={`${styles.catBtn} ${isDepot ? styles.catBtnBlue : styles.catBtnGold} ${isAllInStock ? (isDepot ? styles.catBtnBlueActive : styles.catBtnGoldActive) : ''}`}
                                                                        onClick={() =>
                                                                            bulkUpdate(catId, 'in-stock', 10)
                                                                        }
                                                                        title="Set all items in this category to In Stock (10 units)"
                                                                    >
                                                                        All In Stock
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className={`${styles.catBtn} ${styles.catBtnRed} ${isAllOut ? styles.catBtnRedActive : ''}`}
                                                                        onClick={() =>
                                                                            bulkUpdate(catId, 'out-of-stock', 0)
                                                                        }
                                                                        title="Set all items in this category to Out of Stock (0 units)"
                                                                    >
                                                                        All Out
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div
                                                                tabIndex={0}
                                                                role="region"
                                                                aria-labelledby={catHeadingId}
                                                                className={styles.tableRegion}
                                                            >
                                                                <table
                                                                    className={`${styles.productTable} ${viewTab === 'sales' ? styles.productTableSales : ''}`}
                                                                >
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col">Product</th>
                                                                            <th scope="col">Price</th>
                                                                            <th scope="col">Quantity</th>
                                                                            <th scope="col">Status</th>
                                                                            {viewTab === 'sales' && (
                                                                                <th scope="col">Sold</th>
                                                                            )}
                                                                            {viewTab === 'sales' && (
                                                                                <th scope="col">Trend</th>
                                                                            )}
                                                                            {viewTab === 'stock' && (
                                                                                <th scope="col">
                                                                                    Storefront Flags
                                                                                </th>
                                                                            )}
                                                                            <th scope="col">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {items.map(p => {
                                                                            const trend = getTrend(p);
                                                                            const isHighlighted =
                                                                                highlightedProductId === p._id;
                                                                            const isOOS = p.stockQuantity === 0;
                                                                            const isLow =
                                                                                p.stockQuantity > 0 &&
                                                                                p.stockQuantity <=
                                                                                    LOW_STOCK_ALERT_THRESHOLD;

                                                                            return (
                                                                                <tr
                                                                                    key={p._id}
                                                                                    id={`product-row-${p._id}`}
                                                                                    className={`${p.hiddenFromShop ? styles.rowHidden : ''} ${isOOS ? styles.rowOOS : ''} ${isLow ? styles.rowLowStock : ''} ${isHighlighted ? styles.highlightRow : ''}`}
                                                                                >
                                                                                    <th scope="row">
                                                                                        <div
                                                                                            className={
                                                                                                styles.productCellStack
                                                                                            }
                                                                                        >
                                                                                            <span
                                                                                                className={`${styles.productName} ${p.hiddenFromShop ? styles.productNameHidden : ''}`}
                                                                                            >
                                                                                                {p.name}
                                                                                            </span>
                                                                                            <div
                                                                                                className={
                                                                                                    styles.productTags
                                                                                                }
                                                                                            >
                                                                                                {p.hiddenFromShop && (
                                                                                                    <span
                                                                                                        className={`${styles.badge} ${styles.badgeSale}`}
                                                                                                    >
                                                                                                        Hidden
                                                                                                    </span>
                                                                                                )}
                                                                                                {p.isFeatured && (
                                                                                                    <span
                                                                                                        className={`${styles.badge} ${styles.badgeFeatured}`}
                                                                                                    >
                                                                                                        Featured
                                                                                                    </span>
                                                                                                )}
                                                                                                {p.isNew && (
                                                                                                    <span
                                                                                                        className={`${styles.badge} ${styles.badgeNew}`}
                                                                                                    >
                                                                                                        New
                                                                                                    </span>
                                                                                                )}
                                                                                                {p.salePrice && (
                                                                                                    <span
                                                                                                        className={`${styles.badge} ${styles.badgeSale}`}
                                                                                                    >
                                                                                                        Sale
                                                                                                    </span>
                                                                                                )}
                                                                                                {p.expiryDate && (
                                                                                                    <span
                                                                                                        className={`${styles.badge} ${styles.badgeExpiry}`}
                                                                                                    >
                                                                                                        Exp{' '}
                                                                                                        {new Date(
                                                                                                            p.expiryDate
                                                                                                        )
                                                                                                            .toISOString()
                                                                                                            .slice(
                                                                                                                0,
                                                                                                                10
                                                                                                            )}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                            <div
                                                                                                className={
                                                                                                    styles.metaToolsRow
                                                                                                }
                                                                                            >
                                                                                                <input
                                                                                                    type="date"
                                                                                                    aria-label={`Expiry date for ${p.name}`}
                                                                                                    className={
                                                                                                        styles.expiryInput
                                                                                                    }
                                                                                                    value={
                                                                                                        p.expiryDate ||
                                                                                                        ''
                                                                                                    }
                                                                                                    onChange={e =>
                                                                                                        updateProduct(
                                                                                                            p._id,
                                                                                                            {
                                                                                                                expiryDate:
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .value ||
                                                                                                                    null,
                                                                                                            }
                                                                                                        )
                                                                                                    }
                                                                                                    title={
                                                                                                        p.expiryDate
                                                                                                            ? `Expires ${new Date(p.expiryDate).toLocaleDateString()}`
                                                                                                            : 'Set expiry date'
                                                                                                    }
                                                                                                />
                                                                                                {editingNote ===
                                                                                                p._id ? (
                                                                                                    <textarea
                                                                                                        ref={
                                                                                                            noteInputRef
                                                                                                        }
                                                                                                        className={
                                                                                                            styles.noteInput
                                                                                                        }
                                                                                                        value={
                                                                                                            noteValue
                                                                                                        }
                                                                                                        onChange={e =>
                                                                                                            setNoteValue(
                                                                                                                e.target
                                                                                                                    .value
                                                                                                            )
                                                                                                        }
                                                                                                        onKeyDown={e => {
                                                                                                            if (
                                                                                                                e.key ===
                                                                                                                    'Enter' &&
                                                                                                                !e.shiftKey
                                                                                                            ) {
                                                                                                                e.preventDefault();
                                                                                                                const trimmed =
                                                                                                                    noteValue.trim();
                                                                                                                if (
                                                                                                                    trimmed !==
                                                                                                                    (
                                                                                                                        p.adminNotes ||
                                                                                                                        ''
                                                                                                                    ).trim()
                                                                                                                ) {
                                                                                                                    updateProduct(
                                                                                                                        p._id,
                                                                                                                        {
                                                                                                                            adminNotes:
                                                                                                                                trimmed ||
                                                                                                                                null,
                                                                                                                        }
                                                                                                                    );
                                                                                                                }
                                                                                                                setEditingNote(
                                                                                                                    null
                                                                                                                );
                                                                                                            } else if (
                                                                                                                e.key ===
                                                                                                                'Escape'
                                                                                                            ) {
                                                                                                                setEditingNote(
                                                                                                                    null
                                                                                                                );
                                                                                                            }
                                                                                                        }}
                                                                                                        onBlur={() => {
                                                                                                            const trimmed =
                                                                                                                noteValue.trim();
                                                                                                            if (
                                                                                                                trimmed !==
                                                                                                                (
                                                                                                                    p.adminNotes ||
                                                                                                                    ''
                                                                                                                ).trim()
                                                                                                            ) {
                                                                                                                updateProduct(
                                                                                                                    p._id,
                                                                                                                    {
                                                                                                                        adminNotes:
                                                                                                                            trimmed ||
                                                                                                                            null,
                                                                                                                    }
                                                                                                                );
                                                                                                            }
                                                                                                            setEditingNote(
                                                                                                                null
                                                                                                            );
                                                                                                        }}
                                                                                                        placeholder="Add counter note…"
                                                                                                        rows={2}
                                                                                                    />
                                                                                                ) : (
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        className={`${styles.noteDisplay} ${p.adminNotes ? styles.noteHasContent : ''}`}
                                                                                                        onClick={() => {
                                                                                                            setEditingNote(
                                                                                                                p._id
                                                                                                            );
                                                                                                            setNoteValue(
                                                                                                                p.adminNotes ||
                                                                                                                    ''
                                                                                                            );
                                                                                                        }}
                                                                                                        title={
                                                                                                            p.adminNotes ||
                                                                                                            'Add counter note'
                                                                                                        }
                                                                                                    >
                                                                                                        {p.adminNotes
                                                                                                            ? p
                                                                                                                  .adminNotes
                                                                                                                  .length >
                                                                                                              38
                                                                                                                ? `${p.adminNotes.slice(0, 38)}…`
                                                                                                                : p.adminNotes
                                                                                                            : '+ Note'}
                                                                                                    </button>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </th>

                                                                                    <td>
                                                                                        <div
                                                                                            className={
                                                                                                styles.priceCell
                                                                                            }
                                                                                        >
                                                                                            {editingPrice?.id ===
                                                                                                p._id &&
                                                                                            editingPrice.field ===
                                                                                                'price' ? (
                                                                                                <input
                                                                                                    ref={
                                                                                                        priceInputRef
                                                                                                    }
                                                                                                    className={
                                                                                                        styles.priceInput
                                                                                                    }
                                                                                                    value={
                                                                                                        editPriceValue
                                                                                                    }
                                                                                                    onChange={e =>
                                                                                                        setEditPriceValue(
                                                                                                            e.target
                                                                                                                .value
                                                                                                        )
                                                                                                    }
                                                                                                    onKeyDown={e => {
                                                                                                        if (
                                                                                                            e.key ===
                                                                                                            'Enter'
                                                                                                        ) {
                                                                                                            if (
                                                                                                                editPriceValue.trim() &&
                                                                                                                editPriceValue.trim() !==
                                                                                                                    p.price
                                                                                                            ) {
                                                                                                                updateProduct(
                                                                                                                    p._id,
                                                                                                                    {
                                                                                                                        price: editPriceValue.trim(),
                                                                                                                    }
                                                                                                                );
                                                                                                            }
                                                                                                            setEditingPrice(
                                                                                                                null
                                                                                                            );
                                                                                                        } else if (
                                                                                                            e.key ===
                                                                                                            'Escape'
                                                                                                        ) {
                                                                                                            setEditingPrice(
                                                                                                                null
                                                                                                            );
                                                                                                        }
                                                                                                    }}
                                                                                                    onBlur={() => {
                                                                                                        if (
                                                                                                            editPriceValue.trim() &&
                                                                                                            editPriceValue.trim() !==
                                                                                                                p.price
                                                                                                        ) {
                                                                                                            updateProduct(
                                                                                                                p._id,
                                                                                                                {
                                                                                                                    price: editPriceValue.trim(),
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                        setEditingPrice(
                                                                                                            null
                                                                                                        );
                                                                                                    }}
                                                                                                    placeholder="$0.00/lb"
                                                                                                />
                                                                                            ) : (
                                                                                                <button
                                                                                                    type="button"
                                                                                                    className={
                                                                                                        styles.priceEditable
                                                                                                    }
                                                                                                    onClick={() => {
                                                                                                        setEditingPrice(
                                                                                                            {
                                                                                                                id: p._id,
                                                                                                                field: 'price',
                                                                                                            }
                                                                                                        );
                                                                                                        setEditPriceValue(
                                                                                                            p.price
                                                                                                        );
                                                                                                    }}
                                                                                                    title="Click to edit price"
                                                                                                >
                                                                                                    {p.price}
                                                                                                </button>
                                                                                            )}

                                                                                            {editingPrice?.id ===
                                                                                                p._id &&
                                                                                            editingPrice.field ===
                                                                                                'salePrice' ? (
                                                                                                <input
                                                                                                    ref={
                                                                                                        priceInputRef
                                                                                                    }
                                                                                                    className={`${styles.priceInput} ${styles.priceInputSale}`}
                                                                                                    value={
                                                                                                        editPriceValue
                                                                                                    }
                                                                                                    onChange={e =>
                                                                                                        setEditPriceValue(
                                                                                                            e.target
                                                                                                                .value
                                                                                                        )
                                                                                                    }
                                                                                                    onKeyDown={e => {
                                                                                                        if (
                                                                                                            e.key ===
                                                                                                            'Enter'
                                                                                                        ) {
                                                                                                            updateProduct(
                                                                                                                p._id,
                                                                                                                {
                                                                                                                    salePrice:
                                                                                                                        editPriceValue.trim() ||
                                                                                                                        null,
                                                                                                                }
                                                                                                            );
                                                                                                            setEditingPrice(
                                                                                                                null
                                                                                                            );
                                                                                                        } else if (
                                                                                                            e.key ===
                                                                                                            'Escape'
                                                                                                        ) {
                                                                                                            setEditingPrice(
                                                                                                                null
                                                                                                            );
                                                                                                        }
                                                                                                    }}
                                                                                                    onBlur={() => {
                                                                                                        updateProduct(
                                                                                                            p._id,
                                                                                                            {
                                                                                                                salePrice:
                                                                                                                    editPriceValue.trim() ||
                                                                                                                    null,
                                                                                                            }
                                                                                                        );
                                                                                                        setEditingPrice(
                                                                                                            null
                                                                                                        );
                                                                                                    }}
                                                                                                    placeholder="Sale (blank clears)"
                                                                                                />
                                                                                            ) : (
                                                                                                <div
                                                                                                    className={
                                                                                                        styles.salePriceRow
                                                                                                    }
                                                                                                >
                                                                                                    {p.salePrice && (
                                                                                                        <span
                                                                                                            className={
                                                                                                                styles.salePriceTag
                                                                                                            }
                                                                                                        >
                                                                                                            {
                                                                                                                p.salePrice
                                                                                                            }
                                                                                                        </span>
                                                                                                    )}
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        className={
                                                                                                            styles.editSaleBtn
                                                                                                        }
                                                                                                        onClick={() => {
                                                                                                            setEditingPrice(
                                                                                                                {
                                                                                                                    id: p._id,
                                                                                                                    field: 'salePrice',
                                                                                                                }
                                                                                                            );
                                                                                                            setEditPriceValue(
                                                                                                                p.salePrice ||
                                                                                                                    ''
                                                                                                            );
                                                                                                        }}
                                                                                                    >
                                                                                                        {p.salePrice
                                                                                                            ? 'Edit sale'
                                                                                                            : '+ Sale'}
                                                                                                    </button>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </td>

                                                                                    <td>
                                                                                        <div
                                                                                            className={
                                                                                                styles.qtyControl
                                                                                            }
                                                                                        >
                                                                                            <button
                                                                                                type="button"
                                                                                                className={
                                                                                                    styles.qtyBtn
                                                                                                }
                                                                                                onClick={() =>
                                                                                                    updateProduct(
                                                                                                        p._id,
                                                                                                        {
                                                                                                            stockQuantity:
                                                                                                                p.stockQuantity -
                                                                                                                1,
                                                                                                        }
                                                                                                    )
                                                                                                }
                                                                                                disabled={
                                                                                                    p.stockQuantity <=
                                                                                                    0
                                                                                                }
                                                                                                aria-label={`Decrease quantity for ${p.name}`}
                                                                                            >
                                                                                                −
                                                                                            </button>
                                                                                            <span
                                                                                                className={`${styles.qtyValue} ${isLow ? styles.qtyWarning : ''} ${isOOS ? styles.qtyDanger : ''}`}
                                                                                            >
                                                                                                {p.stockQuantity ?? 0}
                                                                                            </span>
                                                                                            <button
                                                                                                type="button"
                                                                                                className={
                                                                                                    styles.qtyBtn
                                                                                                }
                                                                                                onClick={() =>
                                                                                                    updateProduct(
                                                                                                        p._id,
                                                                                                        {
                                                                                                            stockQuantity:
                                                                                                                p.stockQuantity +
                                                                                                                1,
                                                                                                        }
                                                                                                    )
                                                                                                }
                                                                                                aria-label={`Increase quantity for ${p.name}`}
                                                                                            >
                                                                                                +
                                                                                            </button>
                                                                                        </div>
                                                                                    </td>

                                                                                    <td>
                                                                                        <span
                                                                                            className={`${styles.statusBadge} ${styles[STATUS_STYLES[p.stockStatus] || 'statusInStock']}`}
                                                                                        >
                                                                                            <span
                                                                                                className={
                                                                                                    styles.statusDot
                                                                                                }
                                                                                                aria-hidden="true"
                                                                                            />
                                                                                            {STATUS_LABELS[
                                                                                                p.stockStatus
                                                                                            ] || p.stockStatus}
                                                                                        </span>
                                                                                    </td>

                                                                                    {viewTab === 'sales' && (
                                                                                        <td>
                                                                                            <div
                                                                                                className={
                                                                                                    styles.salesCell
                                                                                                }
                                                                                            >
                                                                                                <span
                                                                                                    className={
                                                                                                        styles.salesMain
                                                                                                    }
                                                                                                >
                                                                                                    {p.sales
                                                                                                        ?.totalSold ||
                                                                                                        0}
                                                                                                </span>
                                                                                                <span
                                                                                                    className={
                                                                                                        styles.salesSub
                                                                                                    }
                                                                                                >
                                                                                                    {p.sales
                                                                                                        ?.last7Days ||
                                                                                                        0}{' '}
                                                                                                    this wk
                                                                                                </span>
                                                                                            </div>
                                                                                        </td>
                                                                                    )}

                                                                                    {viewTab === 'sales' && (
                                                                                        <td>
                                                                                            <span
                                                                                                className={`${styles.salesTrend} ${trend.style}`}
                                                                                            >
                                                                                                {trend.label}
                                                                                            </span>
                                                                                        </td>
                                                                                    )}

                                                                                    {viewTab === 'stock' && (
                                                                                        <td>
                                                                                            <div
                                                                                                className={`${styles.toggleRow} ${isDepot ? styles.toggleRowDepot : ''}`}
                                                                                            >
                                                                                                <Toggle
                                                                                                    size="sm"
                                                                                                    checked={
                                                                                                        !p.hiddenFromShop
                                                                                                    }
                                                                                                    onChange={val =>
                                                                                                        updateProduct(
                                                                                                            p._id,
                                                                                                            {
                                                                                                                hiddenFromShop:
                                                                                                                    !val,
                                                                                                            }
                                                                                                        )
                                                                                                    }
                                                                                                    label={
                                                                                                        p.hiddenFromShop
                                                                                                            ? 'Hidden'
                                                                                                            : 'Visible'
                                                                                                    }
                                                                                                    variant={
                                                                                                        isDepot
                                                                                                            ? 'blue'
                                                                                                            : 'gold'
                                                                                                    }
                                                                                                    infoSnippet={
                                                                                                        p.hiddenFromShop
                                                                                                            ? 'Currently hidden from storefront. Toggle ON to publish.'
                                                                                                            : 'Visible to customers in the online shop and search.'
                                                                                                    }
                                                                                                />
                                                                                                <Toggle
                                                                                                    size="sm"
                                                                                                    checked={Boolean(
                                                                                                        p.isFeatured
                                                                                                    )}
                                                                                                    onChange={val =>
                                                                                                        updateProduct(
                                                                                                            p._id,
                                                                                                            {
                                                                                                                isFeatured:
                                                                                                                    val,
                                                                                                            }
                                                                                                        )
                                                                                                    }
                                                                                                    label="Featured"
                                                                                                    variant={
                                                                                                        isDepot
                                                                                                            ? 'blue'
                                                                                                            : 'gold'
                                                                                                    }
                                                                                                    infoSnippet="Spotlights cut in Butcher's Specials and featured carousels."
                                                                                                />
                                                                                                <Toggle
                                                                                                    size="sm"
                                                                                                    checked={Boolean(
                                                                                                        p.isNew
                                                                                                    )}
                                                                                                    onChange={val =>
                                                                                                        updateProduct(
                                                                                                            p._id,
                                                                                                            {
                                                                                                                isNew: val,
                                                                                                            }
                                                                                                        )
                                                                                                    }
                                                                                                    label="New"
                                                                                                    variant={
                                                                                                        isDepot
                                                                                                            ? 'blue'
                                                                                                            : 'red'
                                                                                                    }
                                                                                                    infoSnippet="Adds a New Arrival badge on customer product cards."
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                    )}

                                                                                    <td>
                                                                                        <div
                                                                                            className={
                                                                                                styles.rowActionsCell
                                                                                            }
                                                                                        >
                                                                                            {savingStates[p._id] ===
                                                                                                'saving' && (
                                                                                                <span
                                                                                                    className={
                                                                                                        styles.saving
                                                                                                    }
                                                                                                >
                                                                                                    Saving…
                                                                                                </span>
                                                                                            )}
                                                                                            {savingStates[p._id] ===
                                                                                                'saved' && (
                                                                                                <span
                                                                                                    className={
                                                                                                        styles.saved
                                                                                                    }
                                                                                                >
                                                                                                    Saved
                                                                                                </span>
                                                                                            )}
                                                                                            <button
                                                                                                type="button"
                                                                                                className={
                                                                                                    styles.deleteBtn
                                                                                                }
                                                                                                onClick={() => {
                                                                                                    setDeleteModalClosing(false);
                                                                                                    setPendingDelete({
                                                                                                        id: p._id,
                                                                                                        name: p.name,
                                                                                                    });
                                                                                                }}
                                                                                                title={`Delete ${p.name}`}
                                                                                                aria-label={`Delete ${p.name}`}
                                                                                            >
                                                                                                <svg
                                                                                                    className={
                                                                                                        styles.btnIcon
                                                                                                    }
                                                                                                    viewBox="0 0 24 24"
                                                                                                    fill="none"
                                                                                                    stroke="currentColor"
                                                                                                    strokeWidth="2"
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                    aria-hidden="true"
                                                                                                >
                                                                                                    <polyline points="3 6 5 6 21 6" />
                                                                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                                                                    <path d="M10 11v6M14 11v6" />
                                                                                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                                                                </svg>
                                                                                            </button>
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
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ NATIVE <dialog>: ADD NEW PRODUCT ═══════════════ */}
            <dialog
                ref={addDialogRef}
                aria-labelledby="add-product-dialog-title"
                className={styles.dialog}
                data-pt-portal
                data-closing={addModalClosing ? '' : undefined}
                onCancel={e => {
                    e.preventDefault();
                    requestCloseAddModal();
                }}
                onClose={() => {
                    if (addDialogRef.current) {
                        addDialogRef.current.returnValue = '';
                    }
                    setAddModalClosing(false);
                    setShowAddModal(false);
                    setAddError('');
                }}
                {...({ closedby: 'any' } as Record<string, string>)}
            >
                {showAddModal && (
                    <BurnModalShell
                        className={styles.dialogCard}
                        maxWidth={512}
                        closing={addModalClosing}
                        onCloseComplete={finalizeCloseAddModal}
                    >
                        <div className={styles.dialogInner}>
                            <div className={styles.modalHeader}>
                                <h2 id="add-product-dialog-title" className={styles.modalTitle}>
                                    Add New Product
                                </h2>
                                <button
                                    type="button"
                                    className={styles.modalClose}
                                    onClick={requestCloseAddModal}
                                    aria-label="Close Add Product dialog"
                                >
                                    ×
                                </button>
                            </div>

                            {addError && (
                                <div className={styles.modalError} role="alert">
                                    {addError}
                                </div>
                            )}

                            <form className={styles.modalForm} onSubmit={createProduct}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="add-product-name">
                                        Product Name <span className={styles.requiredMark}>*</span>
                                    </label>
                                    <input
                                        id="add-product-name"
                                        type="text"
                                        placeholder="e.g. USDA Prime Dry-Aged Ribeye"
                                        value={addForm.name}
                                        onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                                        className={styles.formInput}
                                        autoFocus
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="add-product-price">
                                            Price <span className={styles.requiredMark}>*</span>
                                        </label>
                                        <input
                                            id="add-product-price"
                                            type="text"
                                            placeholder="$42.99/lb"
                                            value={addForm.price}
                                            onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))}
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="add-product-qty">Starting Quantity</label>
                                        <input
                                            id="add-product-qty"
                                            type="number"
                                            min="0"
                                            max="99"
                                            value={addForm.stockQuantity}
                                            onChange={e =>
                                                setAddForm(f => ({
                                                    ...f,
                                                    stockQuantity: Number.parseInt(e.target.value, 10) || 0,
                                                }))
                                            }
                                            className={styles.formInput}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="add-product-category">
                                        Category <span className={styles.requiredMark}>*</span>
                                    </label>
                                    <select
                                        id="add-product-category"
                                        value={addForm.categoryId}
                                        onChange={e => setAddForm(f => ({ ...f, categoryId: e.target.value }))}
                                        className={styles.formInput}
                                    >
                                        <option value="">Select a category…</option>
                                        <optgroup label="Northfield Butcher Shop">
                                            {availableCategories
                                                .filter(c => c.store !== 'depot')
                                                .map(cat => (
                                                    <option key={cat._id} value={cat._id}>
                                                        {cat.label}
                                                    </option>
                                                ))}
                                        </optgroup>
                                        <optgroup label="Winnetka Depot">
                                            {availableCategories
                                                .filter(c => c.store === 'depot')
                                                .map(cat => (
                                                    <option key={cat._id} value={cat._id}>
                                                        {cat.label}
                                                    </option>
                                                ))}
                                        </optgroup>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="add-product-description">Description (Optional)</label>
                                    <input
                                        id="add-product-description"
                                        type="text"
                                        placeholder="Cut notes, aging details, or serving suggestion…"
                                        value={addForm.description}
                                        onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
                                        className={styles.formInput}
                                    />
                                </div>

                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        className="btn-hit"
                                        onClick={requestCloseAddModal}
                                    >
                                        <span className="btn btn-secondary">Cancel</span>
                                    </button>
                                    <button type="submit" className="btn-hit" disabled={addSaving}>
                                        <span className="btn btn-primary">
                                            {addSaving ? 'Creating…' : 'Create Product'}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </BurnModalShell>
                )}
            </dialog>

            {/* ═══════════════ NATIVE <dialog>: DELETE PRODUCT CONFIRMATION ═══════════════ */}
            <dialog
                ref={deleteDialogRef}
                aria-labelledby="delete-product-dialog-title"
                className={styles.dialog}
                data-pt-portal
                data-closing={deleteModalClosing ? '' : undefined}
                onCancel={e => {
                    e.preventDefault();
                    requestCloseDeleteModal();
                }}
                onClose={() => {
                    if (deleteDialogRef.current) {
                        deleteDialogRef.current.returnValue = '';
                    }
                    setDeleteModalClosing(false);
                    setPendingDelete(null);
                }}
                {...({ closedby: 'closerequest' } as Record<string, string>)}
            >
                {pendingDelete && (
                    <BurnModalShell
                        className={styles.dialogCard}
                        maxWidth={512}
                        closing={deleteModalClosing}
                        onCloseComplete={finalizeCloseDeleteModal}
                    >
                        <div className={styles.dialogInner}>
                            <div className={styles.modalHeader}>
                                <h2 id="delete-product-dialog-title" className={styles.modalTitle}>
                                    Remove Cut from Inventory?
                                </h2>
                                <button
                                    type="button"
                                    className={styles.modalClose}
                                    onClick={requestCloseDeleteModal}
                                    aria-label="Close confirmation dialog"
                                >
                                    ×
                                </button>
                            </div>

                            <p className={styles.modalDescription}>
                                This will permanently delete <strong>{pendingDelete.name}</strong> from the Hofherr
                                product catalog. This action cannot be undone.
                            </p>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className="btn-hit"
                                    autoFocus
                                    onClick={requestCloseDeleteModal}
                                >
                                    <span className="btn btn-secondary">Keep Product</span>
                                </button>
                                <button
                                    type="button"
                                    className="btn-hit"
                                    disabled={deleteBusy}
                                    onClick={confirmDeleteProduct}
                                >
                                    <span className="btn btn-primary">
                                        {deleteBusy ? 'Deleting…' : 'Delete Product'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </BurnModalShell>
                )}
            </dialog>
        </main>
    );
}
