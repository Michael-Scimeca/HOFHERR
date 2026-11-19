'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Toggle from '@/components/Toggle';
import { SITE_PAGES, SITE_PROBLEMS, type SitePageNode } from './siteMapData';
import styles from './page.module.css';

type TabId = 'hierarchy' | 'cards' | 'graph' | 'problems';

const PAGE_MAP: Record<string, SitePageNode> = Object.fromEntries(
    SITE_PAGES.map((p) => [p.id, p])
);

const GRAPH_POS: Record<string, { x: number; y: number }> = {
    '/': { x: 410, y: 62 },
    '/specials': { x: 92, y: 170 },
    '/catering': { x: 222, y: 170 },
    '/selections': { x: 352, y: 170 },
    '/recipes': { x: 482, y: 170 },
    '/visit': { x: 612, y: 170 },
    '/our-story': { x: 732, y: 170 },
    '/gift-cards': { x: 92, y: 286 },
    '/online-orders': { x: 410, y: 290 },
    '/recipes/sheets': { x: 560, y: 266 },
    '/catering/holidays': { x: 222, y: 286 },
    '/newsletter': { x: 222, y: 386 },
    '/faq': { x: 690, y: 286 },
    '/jobs': { x: 735, y: 372 },
    '/privacy': { x: 690, y: 462 },
    '/terms': { x: 560, y: 462 },
    '/checkout': { x: 410, y: 386 },
    '/order/success': { x: 410, y: 478 },
    '/login': { x: 102, y: 394 },
    '/register': { x: 102, y: 478 },
    '/dashboard': { x: 255, y: 478 },
    '/dashboard/[username]': { x: 255, y: 536 },
    '/verify-email': { x: 560, y: 372 },
    '/reset-password': { x: 690, y: 536 },
    '/bbq': { x: 92, y: 74 },
    '/press': { x: 732, y: 74 },
    '/cut-guide': { x: 250, y: 74 },
    '/burn-transition': { x: 575, y: 74 },
    '/admin-dashbaord': { x: 102, y: 536 },
    '/dashboard/cut-collector': { x: 410, y: 536 },
};

function PageBadges({ page }: { page: SitePageNode }) {
    const isOrphan = page.group === 'public' && page.linksIn.length === 0;
    const isDeadEnd = page.group === 'public' && page.linksOut.length === 0 && !page.redirect;

    return (
        <div className={styles.badgeRow}>
            {page.inNav && <span className={styles.badgeNav}>NAV</span>}
            {page.inFooter && <span className={styles.badgeFooter}>FOOTER</span>}
            {page.redirect && <span className={styles.badgeRedir}>301</span>}
            {isOrphan && <span className={styles.badgeOrphan}>ORPHAN</span>}
            {isDeadEnd && <span className={styles.badgeDead}>DEAD END</span>}
            {page.id === '/verify-email' && <span className={styles.badgeBroken}>404 LINK</span>}
        </div>
    );
}

function PageThumbnail({ page, sizes }: { page: SitePageNode; sizes: string }) {
    return (
        <div className={styles.thumbFrame}>
            {page.thumb ? (
                <Image
                    src={page.thumb}
                    alt={`${page.name} live page preview`}
                    fill
                    sizes={sizes}
                    className={styles.thumbImg}
                />
            ) : (
                <div className={styles.thumbFallback}>{page.url}</div>
            )}
        </div>
    );
}

export default function SiteMapClient() {
    const [tab, setTab] = useState<TabId>('hierarchy');
    const [selectedId, setSelectedId] = useState<string>('/');
    const [query, setQuery] = useState('');
    const [showInternal, setShowInternal] = useState(false);

    const selectedPage = PAGE_MAP[selectedId] ?? SITE_PAGES[0];

    const filteredPages = useMemo(() => {
        const q = query.trim().toLowerCase();
        return SITE_PAGES.filter((p) => {
            if (!showInternal && p.group === 'internal') return false;
            if (!q) return true;
            return (
                p.name.toLowerCase().includes(q) ||
                p.url.toLowerCase().includes(q) ||
                p.job.toLowerCase().includes(q)
            );
        });
    }, [query, showInternal]);

    const kpis = useMemo(() => {
        const inNav = SITE_PAGES.filter((p) => p.inNav).length;
        const pub = SITE_PAGES.filter((p) => p.group === 'public').length;
        const flows = SITE_PAGES.filter((p) => p.group === 'flow').length;
        const redirs = SITE_PAGES.filter((p) => p.redirect).length;
        const internal = SITE_PAGES.filter((p) => p.group === 'internal').length;
        return { total: SITE_PAGES.length, inNav, pub, flows, redirs, internal };
    }, []);

    const graphData = useMemo(() => {
        const nodes = SITE_PAGES.filter((p) => Boolean(GRAPH_POS[p.id]));
        const edges: { from: string; to: string }[] = [];
        for (const src of nodes) {
            for (const link of src.linksOut) {
                if (GRAPH_POS[link.to]) {
                    edges.push({ from: src.id, to: link.to });
                }
            }
        }
        const connected = new Set<string>([selectedId]);
        for (const e of edges) {
            if (e.from === selectedId) connected.add(e.to);
            if (e.to === selectedId) connected.add(e.from);
        }
        return { nodes, edges, connected };
    }, [selectedId]);

    const rootPage = filteredPages.find((p) => p.id === '/');
    const navLevel = filteredPages.filter((p) => p.level === 1 && p.inNav);
    const otherPublic = filteredPages.filter(
        (p) => p.group === 'public' && !p.inNav && p.id !== '/' && !navLevel.some((n) => n.id === p.parent)
    );
    const flowPages = filteredPages.filter((p) => p.group === 'flow');
    const redirectPages = filteredPages.filter((p) => p.group === 'redirect');
    const internalPages = filteredPages.filter((p) => p.group === 'internal');

    const renderTreeCard = (p: SitePageNode) => {
        const isSelected = p.id === selectedId;
        return (
            <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={`${styles.nodeCard} ${p.inNav ? styles.nodeCardNav : ''} ${isSelected ? styles.nodeCardSelected : ''}`}
            >
                <PageThumbnail page={p} sizes="(max-width: 760px) 100vw, 280px" />
                <div className={styles.nodeHeader}>
                    <div>
                        <div className={styles.nodeName}>{p.name}</div>
                        <div className={styles.nodeUrl}>{p.url}</div>
                    </div>
                    <PageBadges page={p} />
                </div>
            </button>
        );
    };

    const canVisitLive = !selectedPage.url.includes('[') && !selectedPage.redirect;

    return (
        <main className={styles.page}>
            <header className={styles.hero}>
                <div className={`container ${styles.heroInner}`}>
                    <div>
                        <h1 className={styles.title}>
                            Visual <em>Site Map</em>
                        </h1>
                        <p className={styles.sub}>
                            Audited directly from the Hofherr Meat Co. codebase with live page thumbnails. Click any
                            page to inspect its sections, Links IN/OUT, and nav status.
                        </p>
                    </div>
                    <div className={styles.kpiStrip}>
                        <div className={styles.kpiPill}>
                            <span className={styles.kpiVal}>{kpis.total}</span> Total Routes
                        </div>
                        <div className={styles.kpiPill}>
                            <span className={`${styles.kpiVal} ${styles.kpiValRed}`}>{kpis.inNav}</span> In Top Nav
                        </div>
                        <div className={styles.kpiPill}>
                            <span className={`${styles.kpiVal} ${styles.kpiValGold}`}>{kpis.pub}</span> Public Pages
                        </div>
                        <div className={styles.kpiPill}>
                            <span className={styles.kpiVal}>{kpis.flows}</span> Auth / Checkout
                        </div>
                        <div className={styles.kpiPill}>
                            <span className={styles.kpiVal}>{kpis.redirs}</span> Redirects
                        </div>
                    </div>
                </div>
            </header>

            <section id="visual-site-map" aria-label="Interactive site map explorer" className={styles.bodySection}>
                <div className="container">
                    <div className={styles.toolbar}>
                        <div className={styles.tabRow} role="tablist" aria-label="Site map views">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={tab === 'hierarchy'}
                                className={`${styles.tabBtn} ${tab === 'hierarchy' ? styles.tabBtnActive : ''}`}
                                onClick={() => setTab('hierarchy')}
                            >
                                1. Hierarchy Tree
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={tab === 'cards'}
                                className={`${styles.tabBtn} ${tab === 'cards' ? styles.tabBtnActive : ''}`}
                                onClick={() => setTab('cards')}
                            >
                                2. Page-by-Page Cards
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={tab === 'graph'}
                                className={`${styles.tabBtn} ${tab === 'graph' ? styles.tabBtnActive : ''}`}
                                onClick={() => setTab('graph')}
                            >
                                3. Link Map
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={tab === 'problems'}
                                className={`${styles.tabBtn} ${tab === 'problems' ? styles.tabBtnActive : ''}`}
                                onClick={() => setTab('problems')}
                            >
                                4. Problems List
                            </button>
                        </div>

                        <div className={styles.filterTools}>
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Filter pages or /path…"
                                aria-label="Filter pages"
                                className={styles.searchInput}
                            />
                            <Toggle
                                size="sm"
                                label={`Internal / Dev Labs (${kpis.internal})`}
                                checked={showInternal}
                                onChange={setShowInternal}
                            />
                        </div>
                    </div>

                    <div className={styles.legend}>
                        <span className={styles.legendTitle}>Legend:</span>
                        <span className={styles.legendItem}>
                            <span className={styles.dotNav} /> In Top Navbar
                        </span>
                        <span className={styles.legendItem}>
                            <span className={styles.dotFooter} /> Footer Linked
                        </span>
                        <span className={styles.legendItem}>
                            <span className={styles.dotDead} /> Dead End (0 body links out)
                        </span>
                        <span className={styles.legendItem}>
                            <span className={styles.dotOrphan} /> Orphan / Broken
                        </span>
                        <span className={styles.legendItem}>
                            <span className={styles.dotRedir} /> Redirect Route
                        </span>
                    </div>

                    <div className={styles.workspace}>
                        <div className={styles.mainView}>
                            {/* ── 1. Hierarchy Tree ── */}
                            {tab === 'hierarchy' && (
                                <>
                                    {rootPage && (
                                        <div className={`${styles.treeSection} ${styles.treeSectionRoot}`}>
                                            <h2 className={styles.treeHeading}>Level 0 · Root Landing Page</h2>
                                            <div className={styles.rootWrap}>{renderTreeCard(rootPage)}</div>
                                        </div>
                                    )}

                                    {navLevel.length > 0 && (
                                        <div className={`${styles.treeSection} ${styles.treeSectionNav}`}>
                                            <h2 className={styles.treeHeading}>
                                                Level 1 · Primary Navbar Sections ({navLevel.length})
                                            </h2>
                                            <div className={styles.treeGrid}>
                                                {navLevel.map((parent) => {
                                                    const children = filteredPages.filter(
                                                        (k) => k.parent === parent.id
                                                    );
                                                    return (
                                                        <div key={parent.id} className={styles.treeBranch}>
                                                            {renderTreeCard(parent)}
                                                            {children.length > 0 && (
                                                                <div className={styles.treeChildren}>
                                                                    {children.map(renderTreeCard)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {otherPublic.length > 0 && (
                                        <div className={styles.treeSection}>
                                            <h2 className={styles.treeHeading}>
                                                Level 2 · Secondary &amp; Footer Pages ({otherPublic.length})
                                            </h2>
                                            <div className={styles.treeGrid}>{otherPublic.map(renderTreeCard)}</div>
                                        </div>
                                    )}

                                    {flowPages.length > 0 && (
                                        <div className={styles.treeSection}>
                                            <h2 className={styles.treeHeading}>
                                                Account, Auth &amp; Checkout Flows ({flowPages.length})
                                            </h2>
                                            <div className={styles.treeGrid}>{flowPages.map(renderTreeCard)}</div>
                                        </div>
                                    )}

                                    {redirectPages.length > 0 && (
                                        <div className={styles.treeSection}>
                                            <h2 className={styles.treeHeading}>
                                                Redirects &amp; Legacy Aliases ({redirectPages.length})
                                            </h2>
                                            <div className={styles.treeGrid}>{redirectPages.map(renderTreeCard)}</div>
                                        </div>
                                    )}

                                    {internalPages.length > 0 && (
                                        <div className={styles.treeSection}>
                                            <h2 className={styles.treeHeading}>
                                                Admin, Sanity Studio &amp; Dev Labs ({internalPages.length})
                                            </h2>
                                            <div className={styles.treeGrid}>{internalPages.map(renderTreeCard)}</div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* ── 2. Page-by-Page Cards ── */}
                            {tab === 'cards' && (
                                <div className={styles.cardsGrid}>
                                    {filteredPages.map((p) => {
                                        const isSelected = p.id === selectedId;
                                        return (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setSelectedId(p.id)}
                                                className={`${styles.pageCard} ${p.inNav ? styles.pageCardNav : ''} ${isSelected ? styles.pageCardSelected : ''}`}
                                            >
                                                <PageThumbnail page={p} sizes="(max-width: 760px) 100vw, 440px" />
                                                <div className={styles.cardTop}>
                                                    <div>
                                                        <div className={styles.nodeUrl}>{p.url}</div>
                                                        <h2 className={styles.cardTitle}>{p.name}</h2>
                                                    </div>
                                                    <PageBadges page={p} />
                                                </div>
                                                <p className={styles.cardJob}>{p.job}</p>
                                                <div className={styles.cardSections}>
                                                    <strong>Sections:</strong> {p.sections.slice(0, 4).join(' · ')}
                                                    {p.sections.length > 4 ? ` +${p.sections.length - 4} more` : ''}
                                                </div>
                                                <div className={styles.cardFoot}>
                                                    <span
                                                        className={
                                                            p.linksOut.length === 0 && !p.redirect ? styles.countWarn : ''
                                                        }
                                                    >
                                                        OUT: {p.linksOut.length}
                                                    </span>
                                                    <span
                                                        className={
                                                            p.linksIn.length === 0 && p.group === 'public'
                                                                ? styles.countErr
                                                                : ''
                                                        }
                                                    >
                                                        IN: {p.linksIn.length}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ── 3. Interactive Link Map ── */}
                            {tab === 'graph' && (
                                <div className={styles.graphCard}>
                                    <div className={styles.graphHead}>
                                        <div>
                                            <strong>Interactive Content Link Graph</strong> — Click any page to
                                            highlight <span className={styles.outAccent}>Outgoing →</span> and{' '}
                                            <span className={styles.inAccent}>← Incoming</span> links.
                                        </div>
                                        <span>Hubs: / (7 out) · /online-orders (11 in)</span>
                                    </div>
                                    <div className={styles.svgWrap}>
                                        <svg viewBox="0 0 820 568" className={styles.graphSvg}>
                                            <defs>
                                                <marker
                                                    id="smArrowMuted"
                                                    viewBox="0 0 10 10"
                                                    refX="26"
                                                    refY="5"
                                                    markerWidth="6"
                                                    markerHeight="6"
                                                    orient="auto-start-reverse"
                                                >
                                                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#555" />
                                                </marker>
                                                <marker
                                                    id="smArrowOut"
                                                    viewBox="0 0 10 10"
                                                    refX="26"
                                                    refY="5"
                                                    markerWidth="7"
                                                    markerHeight="7"
                                                    orient="auto-start-reverse"
                                                >
                                                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#cc0e1d" />
                                                </marker>
                                                <marker
                                                    id="smArrowIn"
                                                    viewBox="0 0 10 10"
                                                    refX="26"
                                                    refY="5"
                                                    markerWidth="7"
                                                    markerHeight="7"
                                                    orient="auto-start-reverse"
                                                >
                                                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#c8a47e" />
                                                </marker>
                                            </defs>

                                            {graphData.edges.map((e) => {
                                                const a = GRAPH_POS[e.from];
                                                const b = GRAPH_POS[e.to];
                                                const mx = (a.x + b.x) / 2;
                                                const my = (a.y + b.y) / 2 - 14;
                                                const isOut = e.from === selectedId;
                                                const isIn = e.to === selectedId;
                                                const stroke = isOut ? '#cc0e1d' : isIn ? '#c8a47e' : '#333';
                                                const marker = isOut
                                                    ? 'url(#smArrowOut)'
                                                    : isIn
                                                      ? 'url(#smArrowIn)'
                                                      : 'url(#smArrowMuted)';
                                                return (
                                                    <path
                                                        key={`${e.from}->${e.to}`}
                                                        d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                                                        fill="none"
                                                        stroke={stroke}
                                                        strokeWidth={isOut || isIn ? 2.2 : 1.1}
                                                        opacity={isOut || isIn ? 0.95 : 0.25}
                                                        markerEnd={marker}
                                                    />
                                                );
                                            })}

                                            {graphData.nodes.map((n) => {
                                                const pos = GRAPH_POS[n.id];
                                                const sel = n.id === selectedId;
                                                const dimmed = !graphData.connected.has(n.id);
                                                const isOrphan = n.group === 'public' && n.linksIn.length === 0;
                                                const isDead =
                                                    n.group === 'public' && n.linksOut.length === 0 && !n.redirect;
                                                const stroke = sel
                                                    ? '#cc0e1d'
                                                    : isOrphan
                                                      ? '#ef4444'
                                                      : isDead
                                                        ? '#f59e0b'
                                                        : n.redirect
                                                          ? '#60a5fa'
                                                          : n.inNav
                                                            ? '#cc0e1d'
                                                            : '#333';
                                                return (
                                                    <g
                                                        key={n.id}
                                                        className={`${styles.graphNode} ${dimmed ? styles.graphNodeDim : ''}`}
                                                        onClick={() => setSelectedId(n.id)}
                                                    >
                                                        <rect
                                                            x={pos.x - 58}
                                                            y={pos.y - 17}
                                                            width={116}
                                                            height={34}
                                                            rx={7}
                                                            fill="#141414"
                                                            stroke={stroke}
                                                            strokeWidth={sel ? 2.4 : n.inNav ? 1.7 : 1}
                                                        />
                                                        <text
                                                            x={pos.x}
                                                            y={pos.y - 2}
                                                            textAnchor="middle"
                                                            fontSize="10"
                                                            fontWeight="700"
                                                            fill="#f2f2f2"
                                                        >
                                                            {n.name.slice(0, 18)}
                                                        </text>
                                                        <text
                                                            x={pos.x}
                                                            y={pos.y + 10}
                                                            textAnchor="middle"
                                                            fontSize="8.5"
                                                            fontFamily="monospace"
                                                            fill="#999"
                                                        >
                                                            {n.url.slice(0, 19)}
                                                        </text>
                                                    </g>
                                                );
                                            })}
                                        </svg>
                                    </div>
                                </div>
                            )}

                            {/* ── 4. Problems List ── */}
                            {tab === 'problems' &&
                                SITE_PROBLEMS.map((group) => (
                                    <section key={group.category} className={styles.problemGroup}>
                                        <div className={styles.problemHead}>
                                            <h2 className={styles.problemTitle}>{group.category}</h2>
                                            <span
                                                className={
                                                    group.severity === 'error'
                                                        ? styles.badgeOrphan
                                                        : group.severity === 'warning'
                                                          ? styles.badgeDead
                                                          : styles.badgeFooter
                                                }
                                            >
                                                {group.items.length} found
                                            </span>
                                        </div>
                                        <div className={styles.problemList}>
                                            {group.items.map((item) => (
                                                <div key={`${item.route}-${item.target}`} className={styles.problemItem}>
                                                    <div className={styles.problemItemTop}>
                                                        {PAGE_MAP[item.route] ? (
                                                            <button
                                                                type="button"
                                                                className={styles.problemRouteBtn}
                                                                onClick={() => setSelectedId(item.route)}
                                                            >
                                                                {item.route}
                                                            </button>
                                                        ) : (
                                                            <span className={styles.problemRouteBtn}>{item.route}</span>
                                                        )}
                                                        <span className={styles.problemTarget}>{item.target}</span>
                                                    </div>
                                                    <p className={styles.problemDetail}>{item.detail}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                ))}
                        </div>

                        {/* ── Persistent Right-Hand Inspector ── */}
                        <aside className={styles.inspector} aria-label="Selected page inspector">
                            <PageThumbnail page={selectedPage} sizes="360px" />

                            <div className={styles.inspectorTop}>
                                <div>
                                    <div className={styles.inspectorUrl}>{selectedPage.url}</div>
                                    <h2 className={styles.inspectorName}>{selectedPage.name}</h2>
                                </div>
                                <PageBadges page={selectedPage} />
                            </div>

                            <p className={styles.cardJob}>{selectedPage.job}</p>

                            {canVisitLive && (
                                <Link href={selectedPage.url} className={styles.openLiveLink}>
                                    Open Live Page ↗
                                </Link>
                            )}

                            {selectedPage.note && (
                                <div className={styles.inspectorNote}>
                                    <strong>Audit Note:</strong> {selectedPage.note}
                                </div>
                            )}

                            <div className={styles.inspectorBlock}>
                                <div className={styles.inspectorLabel}>
                                    Main Sections ({selectedPage.sections.length})
                                </div>
                                <ol className={styles.sectionList}>
                                    {selectedPage.sections.map((sec) => (
                                        <li key={sec}>{sec}</li>
                                    ))}
                                </ol>
                            </div>

                            <div className={styles.inspectorBlock}>
                                <div className={styles.inspectorLabel}>
                                    Links OUT ({selectedPage.linksOut.length})
                                </div>
                                {selectedPage.linksOut.length === 0 ? (
                                    <div className={styles.emptyText}>
                                        No outgoing content links (Navbar/Footer chrome only).
                                    </div>
                                ) : (
                                    <ul className={styles.outList}>
                                        {selectedPage.linksOut.map((l) => (
                                            <li key={`${l.to}-${l.from}`} className={styles.outItem}>
                                                {PAGE_MAP[l.to] ? (
                                                    <button
                                                        type="button"
                                                        className={styles.outBtn}
                                                        onClick={() => setSelectedId(l.to)}
                                                    >
                                                        {l.to} →
                                                    </button>
                                                ) : (
                                                    <span className={styles.outBroken}>{l.to} (404)</span>
                                                )}
                                                <span className={styles.outFrom}>via {l.from}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className={styles.inspectorBlock}>
                                <div className={styles.inspectorLabel}>
                                    Links IN ({selectedPage.linksIn.length})
                                </div>
                                {selectedPage.linksIn.length === 0 ? (
                                    <div className={styles.outBroken}>
                                        Orphan — no public page, Navbar, or Footer links here.
                                    </div>
                                ) : (
                                    <div className={styles.inWrap}>
                                        {selectedPage.linksIn.map((src) => {
                                            const clean = src.split(' ')[0];
                                            return PAGE_MAP[clean] ? (
                                                <button
                                                    key={src}
                                                    type="button"
                                                    className={styles.inChip}
                                                    onClick={() => setSelectedId(clean)}
                                                >
                                                    {src}
                                                </button>
                                            ) : (
                                                <span key={src} className={styles.inChipStatic}>
                                                    {src}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}

