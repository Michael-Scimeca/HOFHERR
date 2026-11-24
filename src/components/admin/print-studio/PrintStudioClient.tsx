'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PageHero from '@/components/PageHero';
import FilterPills, { type FilterPillOption } from '@/components/FilterPills';
import legalStyles from '@/app/(legal)/legal.module.css';
import PrintKit, { PRINT_KIT_SHEETS } from './PrintKit';
import SizeStudio from './SizeStudio';
import PrintAtSize from './PrintAtSize';
import s from './print.module.css';

type StudioTab = 'kit' | 'sizes' | 'print-size';

const STUDIO_TABS: readonly FilterPillOption<StudioTab>[] = [
    { value: 'kit', label: '🖨 1:1 Print Kit' },
    { value: 'sizes', label: '📐 Sizes & Scale' },
    { value: 'print-size', label: '📄 Print at Size' },
];

function parseInitialTab(raw: string | null, hasKey: boolean): StudioTab {
    if (raw === 'sizes' || raw === 'print-size' || raw === 'kit') return raw;
    return hasKey ? 'print-size' : 'kit';
}

function shortSheetLabel(title: string): string {
    return title.replace(/\s*\([^)]*\)/g, '').trim();
}

export default function PrintStudioClient({ embedded = false }: { embedded?: boolean }) {
    const searchParams = useSearchParams();
    const urlKey = searchParams.get('key');
    const tabParamKey = embedded ? 'printView' : 'tab';
    const [tab, setTab] = useState<StudioTab>(() => parseInitialTab(searchParams.get(tabParamKey), Boolean(urlKey)));
    const [selectedPrintKey, setSelectedPrintKey] = useState<string | null>(urlKey);
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setShowBackToTop(window.scrollY > 320);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        if (typeof window === 'undefined') return;
        if (window.location.hash) {
            const url = new URL(window.location.href);
            url.hash = '';
            window.history.replaceState(null, '', url.toString());
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleTabChange = (next: StudioTab) => {
        setTab(next);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set(tabParamKey, next);
            window.history.replaceState(null, '', url.toString());
        }
    };

    const handlePrintAtSize = (key: string) => {
        setSelectedPrintKey(key);
        setTab('print-size');
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set(tabParamKey, 'print-size');
            url.searchParams.set('key', key);
            window.history.replaceState(null, '', url.toString());
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const tocItems =
        tab === 'kit'
            ? PRINT_KIT_SHEETS.map((sh, idx) => ({
                  id: `sheet-${sh.id}`,
                  index: `${idx + 1}.`,
                  label: shortSheetLabel(sh.title),
              }))
            : tab === 'sizes'
              ? [
                    { id: 'print-sizes', index: '1.', label: '96-Item Catalog & Search' },
                    { id: 'print-size-editor', index: '2.', label: 'Dimensions & Calibration' },
                ]
              : [
                    { id: 'size-print-controls', index: '1.', label: 'Sheet, Copies & Crop Marks' },
                    { id: 'size-print-root', index: '2.', label: '1:1 Print Preview' },
                ];

    const workspaceGrid = (
        <div className={legalStyles.legalGrid}>
            <aside
                className={`${legalStyles.sidebar} ${embedded ? s.sidebarEmbedded : ''} ${s.noPrint}`}
                aria-label="Print Studio navigation"
            >
                <nav className={legalStyles.sidebarPanel} aria-label="Studio sections">
                    <div className={s.sidebarHeadRow}>
                        <h2 className={legalStyles.sidebarHeading}>On This Page</h2>
                        <button
                            type="button"
                            onClick={scrollToTop}
                            className={s.sidebarTopBtn}
                            aria-label="Back to top"
                        >
                            ↑ Top
                        </button>
                    </div>
                    <ol className={`${legalStyles.tocList} ${s.tocScroll}`}>
                        {tocItems.map((item) => (
                            <li key={item.id}>
                                <a href={`#${item.id}`} className={legalStyles.tocLink}>
                                    <span className={legalStyles.tocIndex}>{item.index}</span>
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <nav className={legalStyles.sidebarPanel} aria-label="Studio views">
                    <h2 className={legalStyles.sidebarHeading}>Studio Views</h2>
                    <ul className={legalStyles.policyList}>
                        {STUDIO_TABS.map((t) => {
                            const isCurrent = tab === t.value;
                            return (
                                <li key={t.value}>
                                    <button
                                        type="button"
                                        onClick={() => handleTabChange(t.value)}
                                        aria-current={isCurrent ? 'page' : undefined}
                                        className={`${legalStyles.policyLink} ${s.sidebarBtn} ${isCurrent ? legalStyles.policyLinkActive : ''}`}
                                    >
                                        <span>{t.label}</span>
                                        {isCurrent && (
                                            <span className={legalStyles.policyBadge}>Current</span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                        <li>
                            <Link href="/admin-dashboard/admin?tab=identity" className={legalStyles.policyLink}>
                                <span>← Product Identity Hub</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            <div className={s.workspaceMain}>
                {tab === 'kit' && <PrintKit embedded />}
                {tab === 'sizes' && <SizeStudio embedded onPrintAtSize={handlePrintAtSize} />}
                {tab === 'print-size' && (
                    <PrintAtSize
                        embedded
                        itemKey={selectedPrintKey}
                        onBackToSizes={() => handleTabChange('sizes')}
                    />
                )}
            </div>

            <button
                type="button"
                onClick={scrollToTop}
                className={`${s.backToTopBtn} ${s.noPrint} ${showBackToTop ? s.backToTopVisible : ''}`}
                aria-label="Scroll back to top"
                tabIndex={showBackToTop ? 0 : -1}
            >
                <span aria-hidden="true">↑</span>
                <span>Back to Top</span>
            </button>
        </div>
    );

    if (embedded) {
        return <div id="print-studio-workspace">{workspaceGrid}</div>;
    }

    return (
        <main className={legalStyles.pageWrap}>
            <PageHero
                className={s.noPrint}
                title={
                    <>
                        1:1 Print &amp; <em>Sizes Studio</em>
                    </>
                }
                lead="True-size press proofs in physical inches (8.50&quot; × 11.00&quot; US Letter), team-shared dimension specs for all 96 Hofherr printable items, and exact-scale crop-mark print sheets — all in one workspace."
            >
                <FilterPills
                    options={STUDIO_TABS}
                    value={tab}
                    onChange={handleTabChange}
                    ariaLabel="Print and Sizes studio views"
                />
            </PageHero>

            <section id="print-studio-workspace" aria-label="Print and Sizes Studio workspace" className="section">
                <div className="container">{workspaceGrid}</div>
            </section>
        </main>
    );
}
