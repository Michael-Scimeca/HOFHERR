'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FLAME_STICKERS } from '../ProductIdentityClient';
import { VECTOR_ICON_PATHS } from '../vectorIcons';
import s from './print.module.css';

/**
 * Actual-size 1:1 print sheets (US Letter, 8.5" × 11"). Every dimension is in physical CSS inches (`in`),
 * so printing or "Save as PDF" at 100% scale gives a true-to-size press proof.
 * Includes the full Press-Sheet Registration Frame (CMYK color bars, grayscale step wedges, registration
 * bullseyes, starburst targets, and crop marks), explicit size callouts in inches on every printable item,
 * and a 1.00" physical calibration ruler on every page.
 */

export type SheetId =
    | 'master-suite'
    | 'stickers'
    | 'scale-labels'
    | 'tray-labels'
    | 'vac-labels'
    | 'jar-labels'
    | 'price-tags'
    | 'order-pad'
    | 'cards'
    | 'letterhead'
    | 'patches'
    | 'stamps'
    | 'wrap'
    | 'belly-band'
    | 'social-examples'
    | 'press-sheets';

const SHEETS: { id: SheetId; title: string; note: string }[] = [
    { id: 'master-suite', title: 'Master Emblem, App Icon, Stamp & 10-Dept Vector Suite (.SVG)', note: '100% pure vector (.SVG) · print or plot at any size from 16px to 10-ft signage without pixelation' },
    { id: 'stickers', title: 'Die-Cut Department Stickers (3.00"×3.00")', note: 'Ø 3.00" (3.00" W × 3.00" H) circles · all 10 departments · 2 pages' },
    { id: 'scale-labels', title: 'Counter Deli Scale Labels (4.00"×3.00")', note: '4.00" W × 3.00" H · all 10 departments · 6 per page' },
    { id: 'tray-labels', title: 'Case-Ready Tray Labels (2.50"×3.50")', note: '2.50" W × 3.50" H thermal overwrap labels · 6 per page' },
    { id: 'vac-labels', title: 'Vacuum-Pack Front & Back (4.00"×3.00" & 4.00"×4.00")', note: 'Front 4.00" W × 3.00" H · Back 4.00" W × 4.00" H with USDA Safe Handling & Nutrition' },
    { id: 'jar-labels', title: 'Broth, Tallow, Rub & Sauce Labels (5.00"×2.125")', note: '5.00" W × 2.125" H wraparound labels · 4 per page' },
    { id: 'price-tags', title: 'Meat Case Slate Price Tags (3.50"×2.25")', note: '3.50" W × 2.25" H charcoal case cards · 6 per page' },
    { id: 'order-pad', title: 'Custom-Cut Order Ticket (5.50"×8.50")', note: '5.50" W × 8.50" H Half-Letter ticket · 10 department checkboxes' },
    { id: 'cards', title: 'Business, Gift & Loyalty Cards (3.50"×2.00")', note: 'Business & Loyalty 3.50" W × 2.00" H · CR80 Gift Card 3.375" W × 2.125" H' },
    { id: 'letterhead', title: 'Official 8.50"×11.00" Letterhead', note: 'Full 8.50" W × 11.00" H stationery sheet · Ø 1.15" top seal + 10-icon footer bar' },
    { id: 'patches', title: 'Embroidered Patches (Ø 3.50" & Ø 3.00")', note: 'Ø 3.50" scalloped chest patch + all 10 Ø 3.00" department patches' },
    { id: 'stamps', title: 'Rubber Stamp Dies (Ø 2.00", Ø 3.00" & 2.50"×1.10")', note: 'Ø 2.00" & Ø 3.00" circular scalloped seals + 2.50" W × 1.10" H USDA Prime stamp' },
    { id: 'wrap', title: 'Freezer Bundle Plate (7.50"×4.40") & Wrap Swatch', note: '7.50" W × 4.40" H freezer paper plate + 7.50" W × 4.75" H true-scale wrap swatch' },
    { id: 'belly-band', title: 'Catering Foil-Pan Belly-Band Straps (3.25"×9.50")', note: '2-up Smokehouse Amber 10-icon cross-wrap straps (3.25" W × 9.50" H each)' },
    { id: 'social-examples', title: 'Instagram Feed & Story Templates (3 Printable Examples)', note: '01 This Week\'s Specials (3.60"×4.50"), 02 New Cut: Picanha (3.60"×4.50") & 03 Behind The Block Story (3.60"×6.40")' },
    { id: 'press-sheets', title: '300 DPI Press Registration & Dieline Sheets', note: 'Flat press-ready dieline sheets with CMYK bars, registration marks & size in inches' },
];

const PRESS_DIELINE_SHEETS = [
    { slug: 'cryovac-label-front-back', title: 'Vacuum-Pack Front (4.00"×3.00") & Back (4.00"×4.00") Press Sheet', itemSize: 'FRONT: 4.00" W × 3.00" H · BACK: 4.00" W × 4.00" H', w: '7.5', h: '5.6' },
    { slug: 'case-ready-tray-labels', title: 'Case-Ready Tray Overwrap Labels (2.50"×3.50" Each)', itemSize: '3× LABELS: 2.50" W × 3.50" H EACH', w: '7.5', h: '5.6' },
    { slug: 'freezer-paper-bulk-order', title: 'Bulk Freezer Paper Stamp Plate (8.00"×2.75") & Box Plate (8.00"×5.25")', itemSize: 'TOP PLATE: 8.00" W × 2.75" H · BOX PLATE: 8.00" W × 5.25" H', w: '7.5', h: '5.6' },
    { slug: 'jar-tub-labels', title: 'Broth, Tallow, Rub & Sauce Wraparound Labels (5.00"×2.125" Each)', itemSize: '4× LABELS: 5.00" W × 2.125" H EACH', w: '7.5', h: '4.18' },
    { slug: 'insulated-tote', title: 'Insulated Cooler Tote Screen-Print Master (8.50"×8.50")', itemSize: 'IMPRINT: 8.50" W × 8.50" H · CENTER SEAL: Ø 5.25"', w: '7.5', h: '7.5' },
    { slug: 'catering-box', title: 'Catering Box Lid Plate (10.00"×7.00") & Tray Sleeve (11.00"×3.50")', itemSize: 'LID: 10.00" W × 7.00" H · SLEEVE: 11.00" W × 3.50" H', w: '7.5', h: '4.18' },
    { slug: 'steak-gift-box', title: 'Steak Gift Box Belly Band (10.00"×2.75") & Gift Card (5.00"×3.50")', itemSize: 'BAND: 10.00" W × 2.75" H · CARDS: 5.00" W × 3.50" H', w: '7.5', h: '5.6' },
    { slug: 'gift-cards', title: 'CR80 Gift Cards (3.375"×2.125") & Kraft Sleeve (4.00"×2.75")', itemSize: 'CR80 CARD: 3.375" W × 2.125" H · SLEEVE: 4.00" W × 2.75" H', w: '7.5', h: '5.6' },
    { slug: 'case-price-tags', title: 'Meat Case Slate Price Tags (3.50"×2.25" Each · 6-Up)', itemSize: '6× TAGS: 3.50" W × 2.25" H EACH', w: '7.5', h: '4.18' },
    { slug: 'cut-chart-poster', title: 'Butcher Cut Chart & 10-Department Poster (24.00"×36.00")', itemSize: 'FULL POSTER: 24.00" W × 36.00" H · 10× Ø 3.00" EMBLEMS', w: '6.4', h: '9.6' },
    { slug: 'menu-board-aframe', title: 'Oxblood Crimson Wall Menu (36.00"×36.00") & Sidewalk A-Frame (24.00"×36.00")', itemSize: 'WALL MENU: 36.00" × 36.00" · A-FRAME: 24.00" × 36.00"', w: '7.5', h: '5.6' },
    { slug: 'door-decal-hours', title: 'Storefront Die-Cut Window Vinyl Decal & Hours (18.00"×24.00")', itemSize: 'VINYL DECAL: 18.00" W × 24.00" H · BULL EMBLEM: 9.00" W × 10.50" H', w: '7.0', h: '9.3' },
    { slug: 'farm-source-sign', title: 'Farm Source & 10-Department Story Sign (48.00"×27.00")', itemSize: 'WALL PANEL: 48.00" W × 27.00" H · 10× Ø 4.00" EMBLEMS', w: '7.5', h: '4.18' },
    { slug: 'apron-coat-cap', title: 'Embroidered Chest Patch (Ø 3.50") & 10 Dept Patches (Ø 3.00" Each)', itemSize: 'CHEST PATCH: Ø 3.50" · 10× DEPT PATCHES: Ø 3.00" EACH', w: '7.0', h: '9.3' },
    { slug: 'business-cards-letterhead', title: 'Letterhead (8.50"×11.00"), Business Card (3.50"×2.00") & #10 Envelope', itemSize: 'LETTERHEAD: 8.50"×11.00" · CARD: 3.50"×2.00" · ENV: 9.50"×4.125"', w: '7.5', h: '5.6' },
    { slug: 'custom-cut-order-pad', title: '10-Department Custom-Cut Order Pad (5.50"×8.50" Half-Letter)', itemSize: 'ORDER PAD: 5.50" W × 8.50" H HALF-LETTER', w: '7.0', h: '9.3' },
    { slug: 'loyalty-punch-card', title: '10-Department Kraft Loyalty Stamp Card (3.50"×2.00" Front & Back)', itemSize: 'FRONT & BACK: 3.50" W × 2.00" H · STAMP TARGETS: Ø 0.48"', w: '7.5', h: '5.6' },
];

const SAFE_HANDLING = [
    ['1. KEEP REFRIGERATED OR FROZEN.', 'Thaw in refrigerator or microwave.'],
    ['2. SEPARATE RAW MEATS', 'from other foods. Wash working surfaces, utensils & hands.'],
    ['3. COOK THOROUGHLY.', 'Steaks/Roasts to 145°F · Ground meats to 160°F · Poultry to 165°F.'],
    ['4. KEEP HOT FOODS HOT.', 'Refrigerate leftovers immediately or discard.'],
];

const GRAY_10 = ['#0c0a09', '#242120', '#3d3937', '#57524f', '#716b68', '#8b8581', '#a5a09c', '#bfbab7', '#d9d6d3', '#f3f1ef'];
const CMYK_TOP_10 = ['#FEE600', '#EC008C', '#00AEEF', '#2E3192', '#00A651', '#ED1C24', '#1C1614', '#FFF699', '#F799C1', '#7ED3F7', '#939598'];
const CMYK_SIDE_8 = ['#00AEEF', '#EC008C', '#FEE600', '#2E3192', '#ED1C24', '#00A651', '#58595B', '#1C1614'];

function Bullseye({ cx, cy }: { cx: number; cy: number }) {
    return (
        <g stroke="#1c1614" strokeWidth="1" fill="none">
            <circle cx={cx} cy={cy} r="7.5" />
            <circle cx={cx} cy={cy} r="3.5" fill="#1c1614" />
            <line x1={cx - 11.5} y1={cy} x2={cx + 11.5} y2={cy} />
            <line x1={cx} y1={cy - 11.5} x2={cx} y2={cy + 11.5} />
        </g>
    );
}

const STARBURST_DEGREES = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165];
const ORDER_ROWS = ['row-1', 'row-2', 'row-3', 'row-4', 'row-5', 'row-6', 'row-7', 'row-8'];

function Starburst({ cx, cy }: { cx: number; cy: number }) {
    return (
        <g stroke="#1c1614" strokeWidth="0.65" fill="none">
            <circle cx={cx} cy={cy} r="9" />
            {
                STARBURST_DEGREES.map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const x1 = cx + 9 * Math.cos(rad);
                    const y1 = cy + 9 * Math.sin(rad);
                    const x2 = cx - 9 * Math.cos(rad);
                    const y2 = cy - 9 * Math.sin(rad);
                    return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} />;
                })
            }
            <circle cx={cx} cy={cy} r="2" fill="#fff" stroke="#1c1614" />
        </g>
    );
}

/**
 * Full Press-Sheet Registration Frame (816 × 1056 viewBox = 8.5" × 11.0" @ 96 px/in)
 * Renders top/bottom grayscale step wedges, top-right & left/right CMYK color bars,
 * corner registration bullseyes, starburst targets, and corner crop marks.
 */
function PressRegistrationOverlay() {
    return (
        <svg viewBox="0 0 816 1056" className={s.pressFrameSvg} aria-hidden="true">
            {/* Top-left & bottom-right starburst targets */}
            <Starburst cx={16} cy={15} />
            <Starburst cx={800} cy={1041} />

            {/* Top grayscale 10-step wedge */}
            <g>
                {GRAY_10.map((c, i) => (
                    <rect key={c} x={48 + i * 16} y={8} width={16} height={13} fill={c} stroke="#1c1614" strokeWidth="0.6" />
                ))}
            </g>

            {/* Top-center registration bullseye */}
            <Bullseye cx={408} cy={15} />

            {/* Top-right 11-chip CMYK & tint bar */}
            <g>
                {CMYK_TOP_10.map((c, i) => (
                    <rect key={c} x={592 + i * 15} y={8} width={15} height={13} fill={c} stroke="#1c1614" strokeWidth="0.6" />
                ))}
            </g>

            {/* Left & Right vertical 8-chip CMYK bars */}
            <g>
                {CMYK_SIDE_8.map((c, i) => (
                    <React.Fragment key={c}>
                        <rect x={6} y={425 + i * 20} width={12} height={20} fill={c} stroke="#1c1614" strokeWidth="0.6" />
                        <rect x={798} y={425 + i * 20} width={12} height={20} fill={c} stroke="#1c1614" strokeWidth="0.6" />
                    </React.Fragment>
                ))}
            </g>

            {/* Bottom grayscale 10-step wedge */}
            <g>
                {GRAY_10.map((c, i) => (
                    <rect key={c} x={328 + i * 16} y={1036} width={16} height={12} fill={c} stroke="#1c1614" strokeWidth="0.5" />
                ))}
            </g>

            {/* Corner registration bullseyes */}
            <Bullseye cx={16} cy={62} />
            <Bullseye cx={800} cy={62} />
            <Bullseye cx={16} cy={988} />
            <Bullseye cx={800} cy={988} />
            <Bullseye cx={56} cy={1041} />
            <Bullseye cx={760} cy={1041} />

            {/* Corner crop & trim marks */}
            <g stroke="#1c1614" strokeWidth="0.8">
                <line x1={38} y1={4} x2={38} y2={24} />
                <line x1={4} y1={36} x2={24} y2={36} />
                <line x1={778} y1={4} x2={778} y2={24} />
                <line x1={792} y1={36} x2={812} y2={36} />
                <line x1={38} y1={1032} x2={38} y2={1052} />
                <line x1={4} y1={1014} x2={24} y2={1014} />
                <line x1={778} y1={1032} x2={778} y2={1052} />
                <line x1={792} y1={1014} x2={812} y2={1014} />
            </g>
        </svg>
    );
}

function InnerWoodcutIcon({ iconId, className }: { iconId: string; className?: string }) {
    const paths = VECTOR_ICON_PATHS[iconId] || VECTOR_ICON_PATHS.cow;
    return (
        <svg viewBox="0 0 1024 1024" className={className} aria-hidden="true">
            <path d={paths.coralPath} fill="#F59B1A" />
            <path d={paths.crimsonPath} fill="#8B0A10" />
        </svg>
    );
}

function PageFoot({ label, itemSize }: { label: string; itemSize?: string }) {
    return (
        <>
            <PressRegistrationOverlay />
            <div className={s.pageFoot}>
                <div className={s.pageFootLeft}>
                    <span className={s.sheetDimPill}>SHEET: 8.50&quot; W × 11.00&quot; H</span>
                    {Boolean(itemSize) && <span className={s.sheetDimPill}>ITEM SIZE: {itemSize}</span>}
                    <span>{label}</span>
                </div>
                <div className={s.rulerBox} title="Measure this bar after printing — it must equal exactly 1.00 inch">
                    <div className={s.rulerBar} />
                    <span className={s.rulerText}>1.00&quot; INCH SCALE CHECK</span>
                </div>
            </div>
        </>
    );
}

/* 0. Master Emblem, App Icon, Circular Stamp & 10-Department Pure Vector Suite (.SVG) */
function MasterSuiteSheet() {
    return (
        <div className={`${s.page} ${s.masterPage}`}>
            <img
                src="/assets/identity/print/app-icon-favicon-print.svg"
                alt="Master Emblem, App Icon, Circular Rubber Stamp & 10-Department Vector Emblem Suite (.SVG)"
                className={s.masterImg}
                style={{ '--master-w': '7.5in', '--master-h': '7.5in' } as React.CSSProperties}
            />
            <div className={s.vectorSpecBanner}>
                <b>100% PURE VECTOR (.SVG) MASTER SUITE — INFINITE SCALE:</b> Master Emblem (Favicon), App Icon (iOS/Android),
                76-Tooth Scalloped Circular Rubber Stamp, 4-Color Swatch Bar &amp; All 10 Department Flame Emblems (DEPT-01..DEPT-10)
                are built with mathematical Bézier vector paths. Print at 1:1 proof scale above or scale up to 24&quot;×24&quot;+ signage with zero pixelation.
            </div>
            <PageFoot
                label="Master Vector Emblem Suite (.SVG — Infinite Scale)"
                itemSize='Ø 3.41" MASTER + Ø 3.00" STAMP + 10× Ø 3.00" DEPT EMBLEMS (ANY SIZE)'
            />
        </div>
    );
}

/* 1. Die-Cut Department Stickers (3.00" × 3.00" circles, all 10 departments across 2 pages) */
function StickersSheet() {
    const pages = [FLAME_STICKERS.slice(0, 6), FLAME_STICKERS.slice(6, 10)];
    return (
        <>
            {pages.map((group, i) => (
                <div key={`sticker-page-${group[0].id}`} className={`${s.page} ${s.stickerGrid}`}>
                    {group.map((st) => (
                        <div key={st.id} className={s.stickerCut}>
                            <img src={st.src} alt={st.name} className={s.stickerArt} />
                            <span className={s.stickerDimTag}>Ø 3.00&quot; DIA (3.00&quot; W × 3.00&quot; H)</span>
                        </div>
                    ))}
                    <PageFoot
                        label={`Die-Cut Stickers ${i + 1}/${pages.length}`}
                        itemSize='Ø 3.00" CIRCLE (3.00" W × 3.00" H)'
                    />
                </div>
            ))}
        </>
    );
}

/* 2. Counter Deli Scale Labels (4.00" × 3.00", all 10 departments across 2 pages) */
function ScaleLabelsSheet() {
    const pages = [FLAME_STICKERS.slice(0, 6), FLAME_STICKERS.slice(6, 10)];
    return (
        <>
            {pages.map((group, i) => (
                <div key={`scale-page-${group[0].id}`} className={`${s.page} ${s.labelGrid}`}>
                    {group.map((st) => (
                        <div key={st.id} className={`${s.cut} ${s.scaleLabel}`}>
                            <div className={s.scaleHead}>
                                <div>
                                    <span className={s.wordmarkSm}>HOFHERR MEAT CO.</span>
                                    <div className={s.micro}>THE BUTCHER SHOP · 300 HAPP RD · NORTHFIELD, IL</div>
                                </div>
                                <img src={st.src} alt="" className={s.scaleSeal} />
                            </div>
                            <div className={s.fieldFull}>
                                <span>CUT / SELECTION</span>
                                <b>{st.sampleCut}</b>
                            </div>
                            <div className={s.fieldRow}>
                                <div><span>DEPARTMENT</span><b>{st.name}</b></div>
                                <div><span>NET WT</span><b>{st.sampleWeight}</b></div>
                                <div><span>PACKED ON</span><b>__/__/__</b></div>
                            </div>
                            <div className={s.scaleFoot}>
                                <span>{st.storageNote}</span>
                                <span className={s.dimPillInline}>SIZE: 4.00&quot; W × 3.00&quot; H</span>
                            </div>
                        </div>
                    ))}
                    <PageFoot
                        label={`Deli Scale Labels ${i + 1}/${pages.length} (6-Up)`}
                        itemSize='4.00" W × 3.00" H EACH'
                    />
                </div>
            ))}
        </>
    );
}

/* 3. Case-Ready Tray Overwrap Labels (2.50" × 3.50", 6-up on 8.5" × 11") */
const TRAY_ITEMS = [
    { stickerIdx: 0, cut: '80/20 GROUND CHUCK', wt: '1.50 LB', rate: '$9.99', total: '$14.99' },
    { stickerIdx: 1, cut: 'HERITAGE BONE-IN PORK CHOPS', wt: '2.15 LB', rate: '$13.99', total: '$30.08' },
    { stickerIdx: 2, cut: 'PASTURE-RAISED CHICKEN THIGHS', wt: '1.80 LB', rate: '$8.49', total: '$15.28' },
    { stickerIdx: 3, cut: 'DOMESTIC LAMB LOIN CHOPS', wt: '1.25 LB', rate: '$24.99', total: '$31.24' },
    { stickerIdx: 6, cut: 'FAROE ISLAND SALMON FILLET', wt: '1.10 LB', rate: '$24.99', total: '$27.49' },
    { stickerIdx: 7, cut: 'WILD GULF JUMBO SHRIMP', wt: '1.00 LB', rate: '$22.99', total: '$22.99' },
];

function TrayLabelsSheet() {
    return (
        <div className={`${s.page} ${s.trayGrid}`}>
            {TRAY_ITEMS.map((item) => {
                const st = FLAME_STICKERS[item.stickerIdx];
                return (
                    <div key={item.cut} className={`${s.cut} ${s.trayLabel}`}>
                        <div className={s.trayHeader}>HOFHERR<br />MEAT CO.</div>
                        <img src={st.src} alt="" className={s.traySticker} />
                        <div className={s.trayCutName}>{item.cut}</div>
                        <div className={s.trayDataBox}>
                            <div className={s.trayDataRow}>
                                <div className={s.trayDataCell}><span>NET WT:</span><b>{item.wt}</b></div>
                                <div className={s.trayDataCell}><span>PRICE/LB:</span><b>{item.rate}</b></div>
                                <div className={s.trayDataCell}><span>TOTAL:</span><b>{item.total}</b></div>
                            </div>
                            <div className={s.trayPackedRow}>
                                <span>PACKED ON: __/__/__</span>
                                <span>KEEP BELOW 38°F</span>
                            </div>
                        </div>
                        <div className={s.barcodeBars} />
                        <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>SIZE: 2.50&quot; W × 3.50&quot; H</span>
                    </div>
                );
            })}
            <PageFoot label="Case-Ready Tray Labels (6-Up)" itemSize='2.50" W × 3.50" H EACH' />
        </div>
    );
}

/* 4. Vacuum-Pack Front (4.00" × 3.00") & Back (4.00" × 4.00") Labels */
function VacLabelsSheet() {
    const pairs = [
        { iconId: 'cow', title: 'USDA PRIME DRY-AGED RIBEYE', wt: '1.85 LB', rate: '$38.99', total: '$72.13', cals: '290', fat: '22g (28%)', sat: '10g (50%)', prot: '23g (46%)' },
        { iconId: 'pig', title: 'HERITAGE BERKSHIRE PORK CHOP', wt: '1.40 LB', rate: '$16.99', total: '$23.79', cals: '240', fat: '15g (19%)', sat: '5g (25%)', prot: '26g (52%)' },
    ];
    return (
        <div className={`${s.page} ${s.vacGrid}`}>
            {pairs.map((p) => (
                <React.Fragment key={p.title}>
                    <div className={`${s.cut} ${s.vacFront}`}>
                        <div className={s.vacFrontHeader}>HOFHERR MEAT CO. · NORTHFIELD, IL</div>
                        <InnerWoodcutIcon iconId={p.iconId} className={s.vacSeal} />
                        <div className={s.vacCut}>{p.title}</div>
                        <div className={s.vacBottomTable}>
                            <div className={s.vacBottomCell}><span>NET WT (LBS)</span><b>{p.wt}</b></div>
                            <div className={s.vacBottomCell}><span>PRICE / LB</span><b>{p.rate}</b></div>
                            <div className={s.vacBottomCell}><span>TOTAL PRICE</span><b>{p.total}</b></div>
                            <div className={s.vacBottomCell}><span>PACKED ON</span><b>__/__/__</b></div>
                        </div>
                        <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>FRONT LABEL SIZE: 4.00&quot; W × 3.00&quot; H</span>
                    </div>

                    <div className={`${s.cut} ${s.vacBack}`}>
                        <div className={s.safeBox}>
                            <div className={s.safeTitle}>SAFE HANDLING INSTRUCTIONS</div>
                            <p className={s.safeIntro}>
                                THIS PRODUCT WAS PREPARED FROM INSPECTED AND PASSED MEAT. SOME FOOD PRODUCTS MAY CONTAIN BACTERIA THAT COULD CAUSE ILLNESS IF MISHANDLED.
                            </p>
                            {SAFE_HANDLING.map(([boldText, subText]) => (
                                <div key={boldText} className={s.safeRow}>
                                    <b>{boldText}</b>
                                    <span>{subText}</span>
                                </div>
                            ))}
                        </div>

                        <div className={s.nutriBox}>
                            <div className={s.nutriLeft}>
                                <div className={s.nutriHeading}>Nutrition<br />Facts</div>
                                <span>4 servings / container</span>
                                <b>Serving size 4 oz (112g)</b>
                                <div className={s.nutriCals}><span>Calories</span><b>{p.cals}</b></div>
                            </div>
                            <div className={s.nutriRight}>
                                <div className={s.nutriLine}><b>Total Fat</b><span>{p.fat}</span></div>
                                <div className={s.nutriLine}><b>Total Carb.</b><span>0g (0%)</span></div>
                                <div className={s.nutriLine}><span>Sat. Fat</span><span>{p.sat}</span></div>
                                <div className={s.nutriLine}><span>Dietary Fiber</span><span>0g (0%)</span></div>
                                <div className={s.nutriLine}><b>Cholesterol</b><span>80mg (27%)</span></div>
                                <div className={s.nutriLine}><b>Protein</b><span>{p.prot}</span></div>
                            </div>
                        </div>

                        <div className={s.vacBackFoot}>
                            CUT &amp; PACKED BY HOFHERR MEAT CO. · 300 HAPP RD, NORTHFIELD, IL 60093
                        </div>
                        <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>BACK LABEL SIZE: 4.00&quot; W × 4.00&quot; H</span>
                    </div>
                </React.Fragment>
            ))}
            <PageFoot label="Vacuum-Pack Labels" itemSize='FRONT: 4.00" W × 3.00" H · BACK: 4.00" W × 4.00" H' />
        </div>
    );
}

/* 5. Broth, Tallow, Rub & Sauce Wraparound Labels (5.00" × 2.125", 4-up) */
const JAR_ITEMS = [
    { stickerIdx: 5, title: '24-HOUR BONE BROTH', wt: 'NET WT 32 FL OZ (1 QT)', specHead: 'CLEAN INGREDIENT', specBody: 'Slow-simmered grass-fed beef bones, roasted mirepoix, sea salt, fresh herbs' },
    { stickerIdx: 0, title: 'RENDERED BEEF TALLOW', wt: 'NET WT 8 OZ (227g)', specHead: 'CULINARY SPEC PANEL', specBody: 'Pure pasture-raised beef suet, 400°F high smoke point, non-hydrogenated' },
    { stickerIdx: 1, title: 'PITMASTER STEAK & BRISKET RUB', wt: 'NET WT 4 OZ (113g)', specHead: 'RUB INGREDIENT', specBody: 'Coarse Tellicherry black pepper, smoked sea salt, turbinado sugar, garlic, ancho chili' },
    { stickerIdx: 9, title: 'SMOKEHOUSE BOURBON BBQ SAUCE', wt: 'NET WT 12 FL OZ (355ml)', specHead: 'SAUCE SPEC PANEL', specBody: 'Kentucky straight bourbon, apple cider vinegar, blackstrap molasses & hickory smoke' },
];

function JarLabelsSheet() {
    return (
        <div className={`${s.page} ${s.jarGrid}`}>
            {JAR_ITEMS.map((item) => {
                const st = FLAME_STICKERS[item.stickerIdx];
                return (
                    <div key={item.title} className={`${s.cut} ${s.jarLabel}`}>
                        <span className={`${s.dimBadge} ${s.dimBadgeTop}`}>WRAPAROUND SIZE: 5.00&quot; W × 2.125&quot; H</span>
                        <div className={s.jarMain}>
                            <img src={st.src} alt="" className={s.jarEmblem} />
                            <div className={s.jarCenter}>
                                <div className={s.jarTitle}>{item.title}</div>
                            </div>
                            <div className={s.jarSpec}>
                                <span className={s.jarSpecHead}>{item.specHead}</span>
                                {item.specBody}
                            </div>
                        </div>
                        <div className={s.jarFootBand}>
                            <span className={s.jarNetWt}>{item.wt}</span>
                            <div className={s.jarBrand}>HOFHERR<br /><span className={s.micro}>MEAT CO. · NORTHFIELD, IL</span></div>
                            <div className={s.jarBarcodeBox}><div className={s.jarBarcodeBars} /></div>
                        </div>
                    </div>
                );
            })}
            <PageFoot label="Jar & Tub Wraparound Labels (4-Up)" itemSize='5.00" W × 2.125" H EACH' />
        </div>
    );
}

/* 6. Meat Case Slate Price Tags (3.50" × 2.25", 6-up) */
const PRICE_TAG_ITEMS = [
    { stickerIdx: 0, sub: 'DRY-AGED BONE-IN', cut: 'RIBEYE', grade: 'USDA PRIME', price: '$38.99/LB', farm: 'Midwest Heritage Angus' },
    { stickerIdx: 1, sub: 'HERITAGE BERKSHIRE', cut: 'PORK CHOP', grade: 'PASTURE RAISED', price: '$16.99/LB', farm: 'Illinois Family Farm' },
    { stickerIdx: 2, sub: 'AMISH WHOLE', cut: 'ROASTING CHICKEN', grade: 'AIR CHILLED', price: '$6.99/LB', farm: 'Indiana Pastures' },
    { stickerIdx: 3, sub: 'DOMESTIC', cut: 'RACK OF LAMB', grade: 'FRENCHED CUT', price: '$34.99/LB', farm: 'Wisconsin Pastures' },
    { stickerIdx: 6, sub: 'FRESH ATLANTIC', cut: 'SALMON FILLET', grade: 'SUSHI GRADE', price: '$24.99/LB', farm: 'Daily Cold-Chain Catch' },
    { stickerIdx: 7, sub: 'COLD-WATER MAINE', cut: 'LOBSTER TAIL', grade: 'WILD CAUGHT', price: '$39.99/LB', farm: 'Coastal Maine Catch' },
];

function PriceTagsSheet() {
    return (
        <div className={`${s.page} ${s.priceTagGrid}`}>
            {PRICE_TAG_ITEMS.map((t) => {
                const st = FLAME_STICKERS[t.stickerIdx];
                return (
                    <div key={t.cut} className={`${s.cut} ${s.priceTag}`}>
                        <div>
                            <div className={s.priceTagSub}>{t.sub}</div>
                            <div className={s.priceTagCut}>{t.cut}</div>
                        </div>
                        <div className={s.priceTagMid}>
                            <div className={s.priceTagGrade}>{t.grade}</div>
                            <img src={st.src} alt="" className={s.priceTagBadge} />
                            <div className={s.priceTagPrice}>{t.price}</div>
                        </div>
                        <div className={s.priceTagFarm}>{t.farm}</div>
                        <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>TAG SIZE: 3.50&quot; W × 2.25&quot; H</span>
                    </div>
                );
            })}
            <PageFoot label="Meat Case Price Tags (6-Up)" itemSize='3.50" W × 2.25" H EACH' />
        </div>
    );
}

/* 7. Custom-Cut Order Ticket (5.50" × 8.50" Half-Letter centered on 8.5" × 11") */
function OrderPadSheet() {
    return (
        <div className={`${s.page} ${s.orderPadPage}`}>
            <div className={`${s.cut} ${s.orderTicket}`}>
                <div className={s.orderHeader}>HOFHERR MEAT CO. · CUSTOM CUT &amp; SPECIAL ORDER TICKET</div>
                <div className={s.orderMetaRow}>
                    <div className={s.orderMetaBox}>Customer Name:</div>
                    <div className={s.orderMetaBox}>Phone:</div>
                </div>
                <div className={s.orderMetaRow}>
                    <div className={s.orderMetaBox}>Order Date:</div>
                    <div className={s.orderMetaBox}>Pickup Date / Time:</div>
                </div>

                <div className={s.orderSecTitle}>SELECT DEPARTMENT</div>
                <div className={s.orderDeptGrid}>
                    {FLAME_STICKERS.map((st) => (
                        <div key={st.id} className={s.orderDeptCell}>
                            <span className={s.orderCheck} />
                            <InnerWoodcutIcon iconId={st.id} className={s.orderDeptIcon} />
                            <span className={s.orderDeptName}>{st.name}</span>
                        </div>
                    ))}
                </div>

                <div className={s.orderSecTitle}>CUT SPECIFICATIONS</div>
                <table className={s.orderTable}>
                    <thead>
                        <tr>
                            <th>Cut Name</th>
                            <th>Grade</th>
                            <th>Thickness</th>
                            <th>Bone-In / Boneless</th>
                            <th>Qty</th>
                            <th>Weight (lbs)</th>
                            <th>Trim / Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ORDER_ROWS.map((rowKey) => (
                            <tr key={rowKey}>
                                <td /><td /><td /><td /><td /><td /><td />
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={s.orderFootRow}>
                    <div className={s.orderNotes}>
                        <b>HOFHERR MEAT CO.</b> · 300 Happ Rd, Northfield, IL 60093 · (847) 441-MEAT<br />
                        All custom cuts are hand-trimmed to order from whole sub-primals.
                    </div>
                    <img src="/assets/identity/stamp-option-2.svg" alt="" className={s.orderStamp} />
                </div>
                <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>HALF-LETTER TICKET SIZE: 5.50&quot; W × 8.50&quot; H</span>
            </div>
            <PageFoot label="Custom-Cut Order Ticket" itemSize='5.50" W × 8.50" H HALF-LETTER TRIM' />
        </div>
    );
}

/* 8. Business (3.50" × 2.00"), CR80 Gift (3.375" × 2.125"), & 10-Department Loyalty Cards (3.50" × 2.00") */
function CardsSheet() {
    return (
        <div className={`${s.page} ${s.cardGrid}`}>
            {/* Business Card Front & Back (3.50" × 2.00") */}
            <div className={`${s.cut} ${s.bizFront}`}>
                <div className={s.bizLeft}>
                    <div className={s.bizName}>SEAN HOFHERR</div>
                    <div className={s.bizRole}>MASTER BUTCHER &amp; OWNER</div>
                    <div className={s.bizContact}>
                        (847) 441-MEAT<br />
                        300 HAPP RD · NORTHFIELD, IL 60093<br />
                        HOFHERRMEATCO.COM
                    </div>
                </div>
                <img src="/assets/identity/hofherr-stamp-circular.svg" alt="" className={s.bizSeal} />
                <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>BUSINESS CARD FRONT: 3.50&quot; W × 2.00&quot; H</span>
            </div>

            <div className={`${s.cut} ${s.bizBack}`}>
                <img src={FLAME_STICKERS[0].src} alt="" className={s.bizBackSticker} />
                <span className={s.bizLine}>CUT TO ORDER · EST. 2018</span>
                <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>BUSINESS CARD BACK: 3.50&quot; W × 2.00&quot; H</span>
            </div>

            {/* CR80 Gift Card Front & Back (3.375" × 2.125") */}
            <div className={`${s.cut} ${s.giftFront}`}>
                <div className={s.giftHeader}>HOFHERR<br />MEAT CO.</div>
                <img src={FLAME_STICKERS[0].src} alt="" className={s.giftSeal} />
                <div className={s.giftFootRow}>
                    <span>· GIFT CARD ·</span>
                    <span className={s.giftValBox}>$_______</span>
                </div>
                <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>CR80 GIFT CARD FRONT: 3.375&quot; W × 2.125&quot; H</span>
            </div>

            <div className={`${s.cut} ${s.giftBack}`}>
                <div className={s.magStripe} />
                <div className={s.giftBackBody}>
                    <div className={s.barcodeBars} />
                    <span>REDEEMABLE AT HOFHERR MEAT CO. · 300 HAPP RD, NORTHFIELD, IL · (847) 441-MEAT</span>
                </div>
                <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>CR80 GIFT CARD BACK: 3.375&quot; W × 2.125&quot; H</span>
            </div>

            {/* 10-Department Loyalty Stamp Card Front & Back (3.50" × 2.00") */}
            <div className={`${s.cut} ${s.loyaltyFront}`}>
                <div className={s.loyaltyHeader}>HOFHERR MEAT CO. · TOUR OF THE BLOCK · COLLECT ALL 10 DEPARTMENTS</div>
                <div className={s.punchGrid}>
                    {FLAME_STICKERS.map((st) => (
                        <div key={st.id} className={s.punch}>
                            <InnerWoodcutIcon iconId={st.id} className={s.punchIcon} />
                        </div>
                    ))}
                </div>
                <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>LOYALTY CARD FRONT: 3.50&quot; W × 2.00&quot; H (Ø 0.48&quot; STAMPS)</span>
            </div>

            <div className={`${s.cut} ${s.loyaltyBack}`}>
                <div className={s.loyaltyBackTop}>
                    <img src="/assets/identity/stamp-option-2.svg" alt="" className={s.loyaltyStamp} />
                    <div className={s.loyaltyMember}>MEMBER NAME:</div>
                </div>
                <div className={s.loyaltyReward}>
                    COMPLETE ALL 10 DEPARTMENT STAMPS<br />
                    &amp; RECEIVE A $25 BUTCHER&apos;S BLOCK CREDIT
                </div>
                <div className={s.loyaltyTerms}>
                    EARN ONE STAMP WITH EVERY $25 PURCHASE AT THE COUNTER · 300 HAPP RD, NORTHFIELD, IL
                </div>
                <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>LOYALTY CARD BACK: 3.50&quot; W × 2.00&quot; H</span>
            </div>

            <PageFoot
                label="Business, Gift & Loyalty Cards"
                itemSize='BIZ & LOYALTY: 3.50"×2.00" · CR80 GIFT: 3.375"×2.125"'
            />
        </div>
    );
}

/* 9. Official 8.50" × 11.00" Letterhead */
function LetterheadSheet() {
    return (
        <div className={`${s.page} ${s.letterheadPage}`}>
            <div className={s.lhTop}>
                <img src="/assets/identity/hofherr-stamp-circular.svg" alt="" className={s.lhSeal} />
                <div className={s.lhAddr}>HOFHERR MEAT CO. · 300 HAPP RD, NORTHFIELD, IL 60093 · (847) 441-MEAT · HOFHERRMEATCO.COM</div>
                <span className={s.dimBadge}>TOP SEAL: Ø 1.15&quot; DIA · HEADER WIDTH: 7.20&quot; W</span>
            </div>

            <div>
                <div className={s.lhBottom}>
                    {FLAME_STICKERS.map((st) => (
                        <img key={st.id} src={st.src} alt={st.name} className={s.lhMiniIcon} />
                    ))}
                    <span className={`${s.dimBadge} ${s.dimBadgeTop}`}>10-DEPARTMENT FOOTER BAR: 7.20&quot; W × 0.64&quot; H (Ø 0.48&quot; BADGES)</span>
                </div>
            </div>
            <PageFoot label="Official Stationery Letterhead" itemSize='8.50" W × 11.00" H FULL US LETTER' />
        </div>
    );
}

/* 10. 3.00" Embroidered Department Patches & 3.50" Primary Chest Patch */
function PatchesSheet() {
    const page1 = FLAME_STICKERS.slice(0, 4);
    const page2 = FLAME_STICKERS.slice(4, 10);
    return (
        <>
            <div className={`${s.page} ${s.patchPage}`}>
                <div className={s.primaryPatchRow}>
                    <div className={s.primaryPatchCut}>
                        <img src="/assets/identity/hofherr-stamp-circular.svg" alt="" className={s.primaryPatchImg} />
                        <span className={s.stickerDimTag}>Ø 3.50&quot; DIA (3.50&quot; W × 3.50&quot; H)</span>
                    </div>
                    <div className={s.patchSpecText}>
                        <div className={s.patchSpecTitle}>3.50&quot; Primary Chest Patch</div>
                        <b>Exact Size:</b> 3.50&quot; W × 3.50&quot; H circular scalloped merrowed-edge embroidered chest patch.<br />
                        <b>Department Patches:</b> 3.00&quot; W × 3.00&quot; H circular merrowed-edge patches.<br />
                        <b>Threads:</b> PMS 7622 C Oxblood Crimson (#8B0A10), PMS 1375 C Smokehouse Amber (#F59B1A), Natural Cream Twill (#F3EAD8).
                    </div>
                </div>

                <div className={s.patchGrid4}>
                    {page1.map((st, idx) => (
                        <div key={st.id} className={s.patchCell}>
                            <div className={s.patchCircle3}>
                                <img src={st.src} alt={st.name} className={s.stickerArt} />
                            </div>
                            <span className={s.patchLabel}>0{idx + 1}. {st.name} · SIZE: Ø 3.00&quot; (3.00&quot; W × 3.00&quot; H)</span>
                        </div>
                    ))}
                </div>
                <PageFoot
                    label="Embroidered Patches 1/2"
                    itemSize='CHEST: Ø 3.50" (3.50"×3.50") · DEPT: Ø 3.00" (3.00"×3.00")'
                />
            </div>

            <div className={`${s.page} ${s.stickerGrid}`}>
                {page2.map((st, idx) => (
                    <div key={st.id} className={s.stickerCut}>
                        <img src={st.src} alt={st.name} className={s.stickerArt} />
                        <span className={s.stickerDimTag}>
                            {String(idx + 5).padStart(2, '0')}. {st.name} · Ø 3.00&quot; (3.00&quot; W × 3.00&quot; H)
                        </span>
                    </div>
                ))}
                <PageFoot
                    label="Embroidered Patches 2/2 (Depts 05–10)"
                    itemSize='Ø 3.00" DIA (3.00" W × 3.00" H EACH)'
                />
            </div>
        </>
    );
}

/* 11. Rubber Stamp Dies (Exact 3.00", 2.00", and 2.50" × 1.10" sizes in Crimson Proof & 100% Black Engraving Master) */
function StampsSheet() {
    return (
        <div className={`${s.page} ${s.stampGrid}`}>
            <div className={s.stampCell}>
                <img src="/assets/identity/hofherr-stamp-circular.svg" alt="" className={s.stampSvg3} />
                <span className={s.stampLabel}>Ø 3.00&quot; (3.00&quot; W × 3.00&quot; H) Bag Seal · Crimson Proof</span>
            </div>
            <div className={s.stampCell}>
                <img src="/assets/identity/hofherr-stamp-circular.svg" alt="" className={`${s.stampSvg3} ${s.stampBlack}`} />
                <span className={s.stampLabel}>Ø 3.00&quot; (3.00&quot; W × 3.00&quot; H) Bag Seal · 100% Black Laser Master</span>
            </div>
            <div className={s.stampCell}>
                <img src="/assets/identity/stamp-option-2.svg" alt="" className={s.stampSvg2} />
                <span className={s.stampLabel}>Ø 2.00&quot; (2.00&quot; W × 2.00&quot; H) Counter Stamp · Crimson Proof</span>
            </div>
            <div className={s.stampCell}>
                <img src="/assets/identity/hofherr-stamp-circular.svg" alt="" className={`${s.stampSvg2} ${s.stampBlack}`} />
                <span className={s.stampLabel}>Ø 2.00&quot; (2.00&quot; W × 2.00&quot; H) Counter Stamp · 100% Black Laser Master</span>
            </div>
            <div className={s.stampCell}>
                <img src="/assets/identity/hofherr-stamp-usda-prime.svg" alt="" className={s.stampSvgRect} />
                <span className={s.stampLabel}>2.50&quot; W × 1.10&quot; H USDA Prime Stamp · Crimson Proof</span>
            </div>
            <div className={s.stampCell}>
                <img src="/assets/identity/hofherr-stamp-usda-prime.svg" alt="" className={`${s.stampSvgRect} ${s.stampBlack}`} />
                <span className={s.stampLabel}>2.50&quot; W × 1.10&quot; H USDA Prime Stamp · 100% Black Laser Master</span>
            </div>
            <PageFoot
                label="Rubber Stamp Engraving Masters"
                itemSize='Ø 3.00" SEAL · Ø 2.00" STAMP · 2.50" W × 1.10" H RECT'
            />
        </div>
    );
}

/* 12. Freezer Paper Bundle Plate (7.50" × 4.40") + Wrapping Paper 1:1 Swatch (7.50" × 4.75") */
function WrapSheet() {
    return (
        <div className={`${s.page} ${s.wrapPage}`}>
            <div className={`${s.cut} ${s.freezerPlate}`}>
                <div className={s.freezerTop}>
                    <img src="/assets/identity/hofherr-stamp-circular.svg" alt="" className={s.freezerSeal} />
                    <div className={s.freezerBrand}>HOFHERR MEAT CO. · NORTHFIELD, IL · EST. 2018</div>
                    <img src="/assets/identity/hofherr-stamp-circular.svg" alt="" className={s.freezerSeal} />
                </div>
                <div className={s.freezerChecks}>
                    <span>□ BEEF</span>
                    <span>□ PORK</span>
                    <span>□ POULTRY</span>
                    <span>□ LAMB</span>
                    <span>□ SAUSAGE</span>
                </div>
                <div className={s.freezerWriteRow}>
                    <span>CUT: ____________________________</span>
                    <span>DATE: ____________</span>
                    <span>WEIGHT: _______ LBS</span>
                </div>
                <div>
                    <div className={s.freezerHero}>QUARTER BEEF SHARE</div>
                    <div className={s.freezerSub}>PASTURE-RAISED MIDWEST BEEF · KEEP FROZEN AT 0°F OR BELOW</div>
                </div>
                <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>FREEZER BUNDLE PLATE SIZE: 7.50&quot; W × 4.40&quot; H (Ø 0.90&quot; SEALS)</span>
            </div>

            <div className={s.wrapSwatch}>
                <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>
                    WRAPPING PAPER SWATCH: 7.50&quot; W × 4.75&quot; H (REPEAT TILE: 5.00&quot; W × 6.00&quot; H)
                </span>
            </div>
            <PageFoot
                label="Freezer Bundle Plate & Wrapping Paper Swatch"
                itemSize='PLATE: 7.50" W × 4.40" H · SWATCH: 7.50" W × 4.75" H'
            />
        </div>
    );
}

/* 12b. Catering Foil-Pan Belly-Band Straps (3.25" W × 9.50" H, 2-Up Cross-Wrap) */
function BellyBandSheet() {
    const topIconsA = ['cow', 'cheese', 'pig', 'chicken'];
    const botIconsA = ['pig', 'cheese', 'soup', 'truck'];
    const iconsB = ['duck', 'seafood', 'lamb', 'soup', 'pig', 'cheese', 'fish', 'truck'];

    return (
        <div className={`${s.page} ${s.bellyBandPage}`}>
            {/* Strap A: Top-to-Bottom Lengthwise Band with Center Crest & Write-In Panel */}
            <div className={`${s.cut} ${s.bellyStrap}`}>
                <div className={s.bellyTab}>GLUE / TAPE TAB · FOLD UNDER PAN (0.55&quot; H)</div>

                <div className={s.bellyIconZone}>
                    {
                        topIconsA.map((id) => (
                            <InnerWoodcutIcon key={`top-a-${id}`} iconId={id} className={s.bellyPatternIcon} />
                        ))
                    }
                </div>

                <div className={s.bellyCenterBox}>
                    <InnerWoodcutIcon iconId="cow" className={s.bellyCrestIcon} />
                    <div className={s.bellyTitle}>HOFHERR MEAT CO.</div>
                    <div className={s.bellySub}>CATERING · NORTHFIELD, IL</div>
                    <div className={s.bellyWriteBox}>
                        PAN ITEM: ___________________________<br />
                        SERVINGS: ______ · REHEAT 325°F (COVERED)
                    </div>
                </div>

                <div className={s.bellyIconZone}>
                    {
                        botIconsA.map((id) => (
                            <InnerWoodcutIcon key={`bot-a-${id}`} iconId={id} className={s.bellyPatternIcon} />
                        ))
                    }
                </div>

                <div className={`${s.bellyTab} ${s.bellyTabBottom}`}>
                    STRAP A (TOP BAND): 3.25&quot; W × 9.50&quot; H
                </div>
                <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>STRAP A SIZE: 3.25&quot; W × 9.50&quot; H</span>
            </div>

            {/* Strap B: Side-to-Side Cross-Wrap Band with All 10 Woodcut Icons */}
            <div className={`${s.cut} ${s.bellyStrap}`}>
                <div className={s.bellyTab}>CROSS-WRAP GLUE TAB · FOLD UNDER PAN (0.55&quot; H)</div>

                <div className={s.bellyIconZone}>
                    {
                        iconsB.slice(0, 4).map((id) => (
                            <InnerWoodcutIcon key={`top-b-${id}`} iconId={id} className={s.bellyPatternIcon} />
                        ))
                    }
                </div>

                <div className={s.bellyCenterBox}>
                    <InnerWoodcutIcon iconId="truck" className={s.bellyCrestIcon} />
                    <div className={s.bellyTitle}>HOFHERR CATERING</div>
                    <div className={s.bellySub}>WHOLE HOG &amp; EVENT BBQ · (847) 441-MEAT</div>
                </div>

                <div className={s.bellyIconZone}>
                    {
                        iconsB.slice(4, 8).map((id) => (
                            <InnerWoodcutIcon key={`bot-b-${id}`} iconId={id} className={s.bellyPatternIcon} />
                        ))
                    }
                </div>

                <div className={`${s.bellyTab} ${s.bellyTabBottom}`}>
                    STRAP B (CROSS BAND): 3.25&quot; W × 9.50&quot; H
                </div>
                <span className={`${s.dimBadge} ${s.dimBadgeCenter}`}>STRAP B SIZE: 3.25&quot; W × 9.50&quot; H</span>
            </div>

            <PageFoot
                label="Catering Foil-Pan Belly-Band Straps (2-Up Cross-Wrap)"
                itemSize='2× STRAPS: 3.25" W × 9.50" H EACH (JOIN FOR 18.00" CROSS-WRAP)'
            />
        </div>
    );
}

/* 13. Instagram Feed & Story Templates — 3 Printable Examples (3.60"×4.50" & 3.60"×6.40") */
function SocialExamplesSheet() {
    return (
        <>
            <div className={`${s.page} ${s.masterPage}`}>
                <div className={s.vectorSpecBanner}>
                    <b>INSTAGRAM FEED TEMPLATES (1:1 @ 300 DPI) ·</b> Exact printable artwork for the 2 Feed posts shown in the Section 09 phone mockup (<b>3.60&quot; W × 4.50&quot; H</b> = 1080 × 1350 px each).
                </div>
                <div className={s.socialExamplesGrid}>
                    <div className={s.socialExampleCell}>
                        <img
                            src="/assets/identity/social/social-example-1-this-weeks-specials.svg"
                            alt="01 · This Week's Specials Feed Template"
                            className={s.socialFeedImg}
                        />
                        <span className={s.stampLabel}>01 · This Week&apos;s Specials · 3.60&quot; W × 4.50&quot; H (1080×1350)</span>
                    </div>
                    <div className={s.socialExampleCell}>
                        <img
                            src="/assets/identity/social/social-example-2-new-cut-picanha.svg"
                            alt="02 · New Cut: Picanha Feed Template"
                            className={s.socialFeedImg}
                        />
                        <span className={s.stampLabel}>02 · New Cut: Picanha · 3.60&quot; W × 4.50&quot; H (1080×1350)</span>
                    </div>
                </div>
                <PageFoot
                    label="Social Feed Templates 1/2 (01 Specials & 02 Picanha)"
                    itemSize='2× FEED CARDS: 3.60" W × 4.50" H EACH (1080×1350 @ 300 DPI)'
                />
            </div>

            <div className={`${s.page} ${s.masterPage}`}>
                <div className={s.vectorSpecBanner}>
                    <b>INSTAGRAM 9:16 VERTICAL STORY TEMPLATE (1:1 @ 300 DPI) ·</b> Exact printable artwork for the Story shown in the Section 09 phone mockup (<b>3.60&quot; W × 6.40&quot; H</b> = 1080 × 1920 px).
                </div>
                <div className={s.socialExampleCell}>
                    <img
                        src="/assets/identity/social/social-example-3-behind-the-block.svg"
                        alt="03 · Behind The Block 9:16 Story Template"
                        className={s.socialStoryImg}
                    />
                    <span className={s.stampLabel}>03 · Behind The Block Story · 3.60&quot; W × 6.40&quot; H (1080×1920)</span>
                </div>
                <PageFoot
                    label="Social Story Template 2/2 (03 Behind The Block)"
                    itemSize='9:16 STORY: 3.60" W × 6.40" H (1080×1920 @ 300 DPI)'
                />
            </div>
        </>
    );
}

/* 14. All 17 Flat 300 DPI Press Registration & Dieline Sheets with Size in Inches */
function PressDielineSheets() {
    return (
        <>
            {PRESS_DIELINE_SHEETS.map((item, idx) => (
                <div key={item.slug} className={`${s.page} ${s.masterPage}`}>
                    <img
                        src={`/assets/identity/print/${item.slug}-print.jpg?v=9`}
                        alt={item.title}
                        className={s.masterImg}
                        style={{ '--master-w': `${item.w}in`, '--master-h': `${item.h}in` } as React.CSSProperties}
                    />
                    <PageFoot
                        label={`Press Dieline ${idx + 1}/${PRESS_DIELINE_SHEETS.length} · ${item.slug}`}
                        itemSize={item.itemSize}
                    />
                </div>
            ))}
        </>
    );
}

const MASTER_SVG_BY_SLUG: Record<string, string> = {
    'social-templates': '/assets/identity/print/social-templates-print.svg',
    'social-example-1': '/assets/identity/social/social-example-1-this-weeks-specials.svg',
    'social-example-2': '/assets/identity/social/social-example-2-new-cut-picanha.svg',
    'social-example-3': '/assets/identity/social/social-example-3-behind-the-block.svg',
    'ig-kit-board': '/assets/identity/apps/instagram-profile-kit-board.svg',
    'ig-avatar-wrap': '/assets/identity/apps/ig-avatar-wrapping-paper.svg',
    'ig-link-bio': '/assets/identity/apps/ig-link-in-bio-screen.svg',
    'ordering-app-banner': '/assets/identity/apps/ordering-app-storefront-banner.svg',
    'fb-profile-1': '/assets/identity/apps/fb-profile-wrapping-paper.svg',
    'fb-profile-2': '/assets/identity/apps/fb-profile-crimson-badge.svg',
    'fb-profile-3': '/assets/identity/apps/fb-profile-charcoal-seal.svg',
    'fb-hero-1': '/assets/identity/apps/fb-hero-cover-wrapping-paper.svg',
    'fb-hero-2': '/assets/identity/apps/fb-hero-cover-crimson-smokehouse.svg',
    'fb-hero-3': '/assets/identity/apps/fb-hero-cover-two-locations.svg',
};

const RENDER: Record<SheetId, () => React.ReactElement> = {
    'master-suite': MasterSuiteSheet,
    stickers: StickersSheet,
    'scale-labels': ScaleLabelsSheet,
    'tray-labels': TrayLabelsSheet,
    'vac-labels': VacLabelsSheet,
    'jar-labels': JarLabelsSheet,
    'price-tags': PriceTagsSheet,
    'order-pad': OrderPadSheet,
    cards: CardsSheet,
    letterhead: LetterheadSheet,
    patches: PatchesSheet,
    stamps: StampsSheet,
    wrap: WrapSheet,
    'belly-band': BellyBandSheet,
    'social-examples': SocialExamplesSheet,
    'press-sheets': PressDielineSheets,
};

/** Hide everything except the print root (site navbar, footer, preloader, widgets) for the print job. */
function isolateAndPrint() {
    const root = document.getElementById('print-root');
    if (!root) return window.print();
    const touched: { el: HTMLElement; css: string }[] = [];
    let node: HTMLElement | null = root;
    while (node && node !== document.body) {
        const parent: HTMLElement | null = node.parentElement;
        if (!parent) break;
        Array.from(parent.children).forEach((sib) => {
            if (sib !== node && sib instanceof HTMLElement) {
                touched.push({ el: sib, css: sib.style.cssText });
                sib.style.setProperty('display', 'none', 'important');
            }
        });
        touched.push({ el: parent, css: parent.style.cssText });
        parent.style.setProperty('margin', '0', 'important');
        parent.style.setProperty('padding', '0', 'important');
        parent.style.setProperty('transform', 'none', 'important');
        parent.style.setProperty('background', '#fff', 'important');
        node = parent;
    }
    const restore = () => {
        touched.forEach(({ el, css }) => (el.style.cssText = css));
        window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    window.print();
}

export default function PrintKit() {
    const [active, setActive] = useState<SheetId | 'all' | 'master'>('all');
    const [masterSpec, setMasterSpec] = useState<{ slug: string; w: string; h: string } | null>(null);

    const printSheet = useCallback((id: SheetId | 'all' | 'master') => {
        setActive(id);
        setTimeout(isolateAndPrint, 150);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('master');
        if (slug) {
            setActive('master');
            setMasterSpec({
                slug,
                w: params.get('w') || '7.5',
                h: params.get('h') || '9.5',
            });
        } else {
            const sh = params.get('sheet') as SheetId | null;
            if (sh && sh in RENDER) setActive(sh);
        }
        if (params.get('autoprint') === '1') {
            const timer = setTimeout(isolateAndPrint, 350);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <main className={s.shell}>
            <header className={`container ${s.toolbar} ${s.noPrint}`}>
                <h1 className={s.h1}>1:1 True-Size Print Production Kit (Size in Inches)</h1>
                <p className={s.lead}>
                    Every label, sticker, card, patch, ticket, letterhead, and rubber stamp below is engineered in
                    <b> exact physical inches (in)</b> on standard <b>8.50&quot; W × 11.00&quot; H US Letter</b> with a full
                    <b> Press-Sheet Registration Frame</b> (CMYK color bars, grayscale step wedges, registration bullseyes,
                    crop marks, and explicit size callouts in inches on every printable item). Click any sheet to print or
                    Save as PDF with <b>Scale: 100% / Actual Size</b>, <b>Margins: None</b>, and{' '}
                    <b>Background Graphics: On</b>.
                </p>
                <div className={s.btnRow}>
                    <button
                        type="button"
                        className={s.btnPrimary}
                        onClick={() => printSheet('all')}
                    >
                        🖨 Print / Save Full 1:1 Kit (PDF)
                    </button>
                    {SHEETS.map((sh) => (
                        <button
                            key={sh.id}
                            type="button"
                            className={`${s.btn} ${active === sh.id ? s.btnActive : ''}`}
                            onClick={() => printSheet(sh.id)}
                        >
                            🖨 {sh.title}
                        </button>
                    ))}
                </div>
                <div className={s.btnRow}>
                    <a className={s.btn} href="/assets/identity/hofherr-master-emblem-suite.svg" download="hofherr-master-emblem-suite.svg">
                        ⬇ Master Emblem + Stamp + 10-Dept Suite Vector (.SVG — Any Size)
                    </a>
                    <a className={s.btn} href="/assets/identity/hofherr-app-icon.svg" download="hofherr-app-icon.svg">
                        ⬇ App Icon Vector (.SVG)
                    </a>
                    <a className={s.btn} href="/assets/identity/hofherr-stamp-circular.svg" download="hofherr-stamp-circular.svg">
                        ⬇ 3.00&quot; Circular Stamp Vector (.SVG)
                    </a>
                    <a className={s.btn} href="/assets/identity/hofherr-die-cut-stickers-10-icons.svg" download="hofherr-die-cut-stickers-10-icons.svg">
                        ⬇ 10-Sticker Sheet Vector (.SVG)
                    </a>
                    <a className={s.btn} href="/assets/identity/hofherr-wrapping-paper-pattern-10-icons.svg" download="hofherr-wrapping-paper-pattern-10-icons.svg">
                        ⬇ Wrapping Paper 24&quot;×16&quot; Vector (.SVG)
                    </a>
                    <a className={s.btn} href="/assets/identity/hofherr-door-decal-hours.svg" download="hofherr-door-decal-hours.svg">
                        ⬇ Storefront Window Decal Vector (.SVG)
                    </a>
                    <Link className={s.btn} href="/product-identity">
                        ← Back to Identity System
                    </Link>
                </div>
            </header>

            <div id="print-root" className={s.root}>
                {masterSpec && (
                    <section
                        id="sheet-master"
                        aria-labelledby="sheet-master-heading"
                        className={`${s.sheetBlock} ${active !== 'master' && active !== 'all' ? s.printHidden : ''}`}
                    >
                        <div className={`${s.sheetHead} ${s.noPrint}`}>
                            <h2 id="sheet-master-heading">300 DPI Print Master · {masterSpec.slug}</h2>
                            <span>Scaled to {masterSpec.w}&quot; W × {masterSpec.h}&quot; H on 8.50&quot; × 11.00&quot; US Letter</span>
                            <button type="button" className={s.btn} onClick={() => printSheet('master')}>
                                🖨 Print 1:1 Master Proof
                            </button>
                        </div>
                        <div className={`${s.page} ${s.masterPage}`}>
                            <img
                                src={MASTER_SVG_BY_SLUG[masterSpec.slug] || `/assets/identity/print/${masterSpec.slug}-print.jpg?v=9`}
                                alt={masterSpec.slug}
                                className={s.masterImg}
                                style={{ '--master-w': `${masterSpec.w}in`, '--master-h': `${masterSpec.h}in` } as React.CSSProperties}
                            />
                            <PageFoot
                                label={`300 DPI Press Master (${masterSpec.slug})`}
                                itemSize={`${masterSpec.w}" W × ${masterSpec.h}" H`}
                            />
                        </div>
                    </section>
                )}
                {SHEETS.map((sh) => {
                    const Sheet = RENDER[sh.id];
                    const hidden = active !== 'all' && active !== sh.id;
                    return (
                        <section
                            key={sh.id}
                            id={`sheet-${sh.id}`}
                            aria-labelledby={`sheet-${sh.id}-heading`}
                            className={`${s.sheetBlock} ${hidden ? s.printHidden : ''}`}
                        >
                            <div className={`${s.sheetHead} ${s.noPrint}`}>
                                <h2 id={`sheet-${sh.id}-heading`}>{sh.title}</h2>
                                <span>{sh.note}</span>
                                <button type="button" className={s.btn} onClick={() => printSheet(sh.id)}>
                                    🖨 Print 1:1 Actual Size
                                </button>
                            </div>
                            <Sheet />
                        </section>
                    );
                })}
            </div>
        </main>
    );
}
