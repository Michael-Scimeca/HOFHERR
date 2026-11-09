/** Printable items and their default finished sizes (inches). Edited copies are saved to Sanity (`printSpecs`). */
export type Unit = 'in' | 'cm' | 'mm';
export type Shape = 'rect' | 'circle' | 'rounded';

export type PrintSpec = {
    key: string;
    group: string;
    name: string;
    w: number; // inches
    h: number; // inches
    bleed: number; // inches
    shape: Shape;
    art?: string; // single-piece artwork only
    note?: string;
};

export const DEFAULT_SPECS: PrintSpec[] = [
    // Labels & stickers
    { key: 'sticker', group: 'Labels & stickers', name: 'Die-cut department sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-cow.svg' },
    { key: 'scale-label', group: 'Labels & stickers', name: 'Deli scale label', w: 4, h: 3, bleed: 0, shape: 'rounded' },
    { key: 'vac-front', group: 'Labels & stickers', name: 'Vacuum-pack front label', w: 4, h: 3, bleed: 0.0625, shape: 'rounded' },
    { key: 'vac-back', group: 'Labels & stickers', name: 'Vacuum-pack back label (safe handling)', w: 4, h: 4, bleed: 0.0625, shape: 'rounded' },
    { key: 'tray-label', group: 'Labels & stickers', name: 'Case-ready tray label', w: 2.5, h: 3.5, bleed: 0.0625, shape: 'rounded' },
    { key: 'jar-label', group: 'Labels & stickers', name: 'Jar / tub wraparound label', w: 5, h: 2.125, bleed: 0.0625, shape: 'rect' },
    // Packaging
    { key: 'belly-band', group: 'Packaging', name: 'Steak gift box belly band', w: 10, h: 2.75, bleed: 0.125, shape: 'rect' },
    { key: 'catering-lid', group: 'Packaging', name: 'Catering box lid print', w: 10, h: 7, bleed: 0.125, shape: 'rect' },
    { key: 'tray-sleeve', group: 'Packaging', name: 'Catering tray sleeve', w: 11, h: 3.5, bleed: 0.125, shape: 'rect' },
    { key: 'tote', group: 'Packaging', name: 'Insulated tote imprint', w: 8.5, h: 8.5, bleed: 0, shape: 'rect', art: '/assets/identity/vector/insulated-tote.svg' },
    { key: 'wrap-sheet', group: 'Packaging', name: 'Butcher paper sheet', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/hofherr-wrapping-paper-pattern-10-icons.svg' },
    // Cards & stationery
    { key: 'gift-card', group: 'Cards & stationery', name: 'Gift card (CR80)', w: 3.375, h: 2.125, bleed: 0.125, shape: 'rounded' },
    { key: 'business-card', group: 'Cards & stationery', name: 'Business card', w: 3.5, h: 2, bleed: 0.125, shape: 'rect' },
    { key: 'loyalty-card', group: 'Cards & stationery', name: 'Loyalty punch card', w: 3.5, h: 2, bleed: 0.125, shape: 'rect' },
    { key: 'letterhead', group: 'Cards & stationery', name: 'Letterhead', w: 8.5, h: 11, bleed: 0, shape: 'rect' },
    { key: 'envelope', group: 'Cards & stationery', name: '#10 envelope', w: 9.5, h: 4.125, bleed: 0, shape: 'rect' },
    { key: 'order-pad', group: 'Cards & stationery', name: 'Custom-cut order pad', w: 5.5, h: 8.5, bleed: 0, shape: 'rect', art: '/assets/identity/vector/custom-cut-order-pad.svg' },
    { key: 'rubber-stamp', group: 'Cards & stationery', name: 'Rubber stamp die', w: 2, h: 2, bleed: 0, shape: 'circle', art: '/assets/identity/hofherr-stamp-circular.svg' },
    // Signage
    { key: 'price-tag', group: 'Signage', name: 'Meat case price tag', w: 3.5, h: 2.25, bleed: 0.0625, shape: 'rounded' },
    { key: 'cut-chart', group: 'Signage', name: 'Cut chart poster', w: 24, h: 36, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/cut-chart-poster.svg' },
    { key: 'window-decal', group: 'Signage', name: 'Door / window decal', w: 18, h: 24, bleed: 0, shape: 'rect', art: '/assets/identity/vector/door-decal-hours.svg' },
    { key: 'a-frame', group: 'Signage', name: 'Sidewalk A-frame insert', w: 24, h: 36, bleed: 0.125, shape: 'rect' },
    { key: 'wall-menu', group: 'Signage', name: 'Wall menu board', w: 36, h: 36, bleed: 0.125, shape: 'rect' },
    { key: 'app-icon', group: 'Signage', name: 'Master emblem / app icon', w: 6, h: 6, bleed: 0, shape: 'rect', art: '/assets/identity/vector/app-icon-favicon.svg' },
    { key: 'farm-sign', group: 'Signage', name: 'Farm source wall sign', w: 48, h: 27, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/farm-source-sign.svg' },
    // Apparel
    { key: 'chest-patch', group: 'Apparel', name: 'Embroidered chest patch', w: 3.5, h: 3.5, bleed: 0, shape: 'circle' },
    { key: 'dept-patch', group: 'Apparel', name: 'Department patch', w: 3, h: 3, bleed: 0, shape: 'circle', art: '/assets/identity/stickers/sticker-pig.svg' },
];

export const SHEETS = [
    { key: 'letter', name: 'US Letter', w: 8.5, h: 11 },
    { key: 'legal', name: 'US Legal', w: 8.5, h: 14 },
    { key: 'tabloid', name: 'Tabloid 11×17', w: 11, h: 17 },
    { key: 'superb', name: 'Super B 13×19', w: 13, h: 19 },
] as const;

export const toUnit = (inches: number, u: Unit) => (u === 'in' ? inches : u === 'cm' ? inches * 2.54 : inches * 25.4);
export const fromUnit = (v: number, u: Unit) => (u === 'in' ? v : u === 'cm' ? v / 2.54 : v / 25.4);
export const fmt = (inches: number, u: Unit) => {
    const v = toUnit(inches, u);
    return `${u === 'mm' ? v.toFixed(1) : v.toFixed(u === 'cm' ? 2 : 3).replace(/\.?0+$/, '')}${u === 'in' ? '"' : ` ${u}`}`;
};

/** How many of an item (incl. bleed + 0.125" gutter) fit on a sheet with 0.25" printer margins, trying both orientations. */
export function fitOnSheet(spec: PrintSpec, sheet: { w: number; h: number }) {
    const gutter = 0.125, margin = 0.25;
    const iw = spec.w + spec.bleed * 2 + gutter, ih = spec.h + spec.bleed * 2 + gutter;
    const aw = sheet.w - margin * 2 + gutter, ah = sheet.h - margin * 2 + gutter;
    const a = Math.floor(aw / iw) * Math.floor(ah / ih);
    const b = Math.floor(aw / ih) * Math.floor(ah / iw);
    return b > a ? { count: b, cols: Math.floor(aw / ih), rows: Math.floor(ah / iw), rotated: true } : { count: a, cols: Math.floor(aw / iw), rows: Math.floor(ah / ih), rotated: false };
}

/** Every vector master, for the download list (traced from the print artwork — scale to any size). */
export const VECTOR_MASTERS = [
    'app-icon-favicon', 'apron-coat-cap', 'business-cards-letterhead', 'case-price-tags', 'case-ready-tray-labels', 'catering-box',
    'cryovac-label-front-back', 'custom-cut-order-pad', 'cut-chart-poster', 'door-decal-hours', 'email-header', 'farm-source-sign',
    'freezer-paper-bulk-order', 'gift-cards', 'google-business-cover', 'insulated-tote', 'jar-tub-labels', 'loyalty-punch-card',
    'menu-board-aframe', 'social-templates', 'steak-gift-box',
].map((slug) => ({ slug, name: slug.replace(/-/g, ' '), href: `/assets/identity/vector/${slug}.svg` }));
