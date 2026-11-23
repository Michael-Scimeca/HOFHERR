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
    // ── Labels & core stickers ──
    { key: 'sticker', group: 'Labels & stickers', name: 'Die-cut department sticker (Prime Beef)', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-cow.svg', note: '70# matte waterproof BOPP, freezer-grade adhesive (-20°F)' },
    { key: 'sticker-sheet-10', group: 'Labels & stickers', name: '10-Icon Die-Cut Sticker Sheet', w: 11, h: 8.5, bleed: 0.125, shape: 'rect', art: '/assets/identity/stickers/hofherr-die-cut-stickers-10-icons.svg', note: 'Kiss-cut gang sheet · 10 department stickers' },
    { key: 'master-emblem-suite', group: 'Labels & stickers', name: 'Master 10-Emblem Suite Sheet', w: 11, h: 8.5, bleed: 0.125, shape: 'rect', art: '/assets/identity/hofherr-master-emblem-suite.svg' },
    { key: 'scale-label', group: 'Labels & stickers', name: 'Deli scale label', w: 4, h: 3, bleed: 0, shape: 'rounded', art: '/assets/identity/vector/case-ready-tray-labels.svg', note: 'Direct thermal top-coat' },
    { key: 'vac-front', group: 'Labels & stickers', name: 'Vacuum-pack front label', w: 4, h: 3, bleed: 0.0625, shape: 'rounded', art: '/assets/identity/vector/cryovac-label-front-back.svg', note: 'Freezer-grade BOPP, cold-temp adhesive' },
    { key: 'vac-back', group: 'Labels & stickers', name: 'Vacuum-pack back label (safe handling)', w: 4, h: 4, bleed: 0.0625, shape: 'rounded', art: '/assets/identity/vector/cryovac-label-front-back.svg', note: 'USDA Safe Handling Instructions + Nutrition panel' },
    { key: 'tray-label', group: 'Labels & stickers', name: 'Case-ready tray label', w: 2.5, h: 3.5, bleed: 0.0625, shape: 'rounded', art: '/assets/identity/vector/case-ready-tray-labels.svg' },
    { key: 'jar-label', group: 'Labels & stickers', name: 'Jar / tub wraparound label', w: 5, h: 2.125, bleed: 0.0625, shape: 'rect', art: '/assets/identity/vector/jar-tub-labels.svg', note: 'Quart broth tub, 8 oz tallow jar, 4 oz rub tin' },

    // ── 12 Packaging & Counter Quality Seals ──
    { key: 'seal-boneless', group: 'Quality Seal Stickers (12)', name: 'Boneless Trim Seal', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-boneless.svg' },
    { key: 'seal-safety', group: 'Quality Seal Stickers (12)', name: 'Safety & Quality Seal', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-safetyseal.svg' },
    { key: 'seal-bonein', group: 'Quality Seal Stickers (12)', name: 'Bone-In Primal Seal', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-bonein.svg' },
    { key: 'seal-thickcut', group: 'Quality Seal Stickers (12)', name: 'Thick Cut Steakhouse Seal', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-thickcut.svg' },
    { key: 'seal-dryaged', group: 'Quality Seal Stickers (12)', name: 'Dry Aged In-House Seal', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-dryaged.svg' },
    { key: 'seal-smoked', group: 'Quality Seal Stickers (12)', name: 'Hardwood Smoked Seal', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-smoked.svg' },
    { key: 'seal-groundfresh', group: 'Quality Seal Stickers (12)', name: 'Ground Fresh Daily Seal', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-groundfresh.svg' },
    { key: 'seal-grilltonight', group: 'Quality Seal Stickers (12)', name: 'Grill Tonight Ready Seal', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-grilltonight.svg' },
    { key: 'seal-grassfed', group: 'Quality Seal Stickers (12)', name: '100% Grass-Fed Pasture Seal', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-grassfed.svg' },
    { key: 'seal-seasoned', group: 'Quality Seal Stickers (12)', name: 'House Seasoned & Marinated Seal', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-seasoned.svg' },
    { key: 'seal-ovenready', group: 'Quality Seal Stickers (12)', name: 'Oven Ready Prep Seal', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-ovenready.svg' },
    { key: 'seal-onsale', group: 'Quality Seal Stickers (12)', name: 'Counter Special / On Sale Seal', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-onsale.svg' },

    // ── Northfield Butcher Department Stickers ──
    { key: 'bch-pig', group: 'Butcher Dept Stickers', name: 'Heritage Pork Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-pig.svg' },
    { key: 'bch-chicken', group: 'Butcher Dept Stickers', name: 'Pasture Poultry Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-chicken.svg' },
    { key: 'bch-sausage', group: 'Butcher Dept Stickers', name: 'House Sausage Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-suage.svg' },
    { key: 'bch-charcuterie', group: 'Butcher Dept Stickers', name: 'Charcuterie & Deli Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-hamcheese.svg' },
    { key: 'bch-prepared', group: 'Butcher Dept Stickers', name: 'Prepared Meals Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-prepared.svg' },
    { key: 'bch-lamb', group: 'Butcher Dept Stickers', name: 'Domestic Lamb Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-lamb.svg' },
    { key: 'bch-fish', group: 'Butcher Dept Stickers', name: 'Fresh Seafood Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-fish.svg' },
    { key: 'bch-lobster', group: 'Butcher Dept Stickers', name: 'Maine Lobster Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-seafood-lobster.svg' },
    { key: 'bch-veal', group: 'Butcher Dept Stickers', name: 'Midwest Veal Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-veal.svg' },
    { key: 'bch-turkey', group: 'Butcher Dept Stickers', name: 'Heritage Turkey Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-turkey.svg' },
    { key: 'bch-duck', group: 'Butcher Dept Stickers', name: 'Rohan Duck Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-duck.svg' },
    { key: 'bch-game', group: 'Butcher Dept Stickers', name: 'Wild & Exotic Game Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-game.svg' },
    { key: 'bch-stocksoup', group: 'Butcher Dept Stickers', name: 'House Stocks & Soups Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-stocksoup.svg' },
    { key: 'bch-soup-crock', group: 'Butcher Dept Stickers', name: 'Kettle Soup Crock Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-soup.svg' },
    { key: 'bch-catering', group: 'Butcher Dept Stickers', name: 'Whole-Hog & Event Catering Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-catering.svg' },
    { key: 'bch-truck', group: 'Butcher Dept Stickers', name: 'Catering Delivery Truck Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-truck.svg' },

    // ── Winnetka Depot Specialty Stickers ──
    { key: 'dpt-cheese', group: 'Winnetka Depot Stickers (12)', name: 'Artisanal Cheese Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-cheese.svg' },
    { key: 'dpt-seafood', group: 'Winnetka Depot Stickers (12)', name: 'Shellfish & Crab Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-seafood.svg' },
    { key: 'dpt-pastries', group: 'Winnetka Depot Stickers (12)', name: 'Morning Pastries Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-pastries.svg' },
    { key: 'dpt-coffee', group: 'Winnetka Depot Stickers (12)', name: 'Sparrow Hot Coffee Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-hotbeverage.svg' },
    { key: 'dpt-grabgo', group: 'Winnetka Depot Stickers (12)', name: 'Commuter Grab + Go Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-grabgo.svg' },
    { key: 'dpt-produce', group: 'Winnetka Depot Stickers (12)', name: 'Farm Produce Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-produce.svg' },
    { key: 'dpt-dairy', group: 'Winnetka Depot Stickers (12)', name: 'Dairy & Pasture Eggs Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-dairy.svg' },
    { key: 'dpt-pantry', group: 'Winnetka Depot Stickers (12)', name: 'House Pantry & Rubs Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-pantry.svg' },
    { key: 'dpt-bread', group: 'Winnetka Depot Stickers (12)', name: 'Artisanal Bread Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-bread.svg' },
    { key: 'dpt-coldbrew', group: 'Winnetka Depot Stickers (12)', name: 'Cold Brew & Sodas Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-coldbeverage.svg' },
    { key: 'dpt-swag', group: 'Winnetka Depot Stickers (12)', name: 'Official HMC Swag Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-swag.svg' },
    { key: 'dpt-festival', group: 'Winnetka Depot Stickers (12)', name: 'Ribfest & Pop-Ups Sticker', w: 3, h: 3, bleed: 0.0625, shape: 'circle', art: '/assets/identity/stickers/sticker-festival.svg' },

    // ── Butcher Wrapping Paper & Colorways ──
    { key: 'wrap-sheet', group: 'Wrapping Paper', name: 'Classic Butcher Kraft (10-Icon Sheet)', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/hofherr-wrapping-paper-pattern-10-icons.svg?v=3', note: '40# FDA wet-strength kraft · 24" × 16" seamless repeat' },
    { key: 'wrap-freezer', group: 'Wrapping Paper', name: 'Freezer Paper Bulk-Order Roll', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/vector/freezer-paper-bulk-order.svg', note: 'Poly-coated white freezer paper · 1-color crimson' },
    { key: 'wrap-01', group: 'Wrapping Paper', name: 'Wrap 01 · Red on White', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-01-red-on-white.svg' },
    { key: 'wrap-02', group: 'Wrapping Paper', name: 'Wrap 02 · Red on Dark Crimson', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-02-red-on-dark-red.svg' },
    { key: 'wrap-03', group: 'Wrapping Paper', name: 'Wrap 03 · White Cream on Crimson', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-03-white-cream-on-crimson.svg' },
    { key: 'wrap-04', group: 'Wrapping Paper', name: 'Wrap 04 · Charcoal on White', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-04-charcoal-on-white.svg' },
    { key: 'wrap-05', group: 'Wrapping Paper', name: 'Wrap 05 · Crimson on Amber', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-05-crimson-on-amber.svg' },
    { key: 'wrap-06', group: 'Wrapping Paper', name: 'Wrap 06 · Stealth Black on Charcoal', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-06-stealth-black-on-charcoal.svg' },
    { key: 'wrap-07', group: 'Wrapping Paper', name: 'Wrap 07 · Gold on Obsidian', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-07-gold-on-obsidian.svg' },
    { key: 'wrap-08', group: 'Wrapping Paper', name: 'Wrap 08 · Oxblood Kraft Monochrome', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-08-monochrome-oxblood-kraft.svg' },
    { key: 'wrap-09', group: 'Wrapping Paper', name: 'Wrap 09 · Vintage Newsprint', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-09-vintage-newsprint.svg' },
    { key: 'wrap-10', group: 'Wrapping Paper', name: 'Wrap 10 · Midnight Burgundy Electric', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-10-midnight-burgundy-electric.svg' },
    { key: 'wrap-11', group: 'Wrapping Paper', name: 'Wrap 11 · Depot Heritage Green (Crimson Ink)', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-11-depot-heritage-green.svg' },
    { key: 'wrap-12', group: 'Wrapping Paper', name: 'Wrap 12 · Depot Heritage Green (White Ink)', w: 24, h: 16, bleed: 0, shape: 'rect', art: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-12-depot-green-white-ink.svg' },

    // ── Packaging ──
    { key: 'belly-band', group: 'Packaging', name: 'Steak gift box belly band', w: 10, h: 2.75, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/steak-gift-box.svg' },
    { key: 'catering-lid', group: 'Packaging', name: 'Catering box lid print', w: 10, h: 7, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/catering-box.svg' },
    { key: 'catering-lid-hog', group: 'Packaging', name: 'Whole Hog Catering Lid Crest', w: 10, h: 7, bleed: 0.125, shape: 'rect', art: '/assets/catering/catering-box-lid-whole-hog.svg' },
    { key: 'tray-sleeve', group: 'Packaging', name: 'Catering tray sleeve', w: 11, h: 3.5, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/catering-box.svg' },
    { key: 'tote', group: 'Packaging', name: 'Insulated tote imprint', w: 8.5, h: 8.5, bleed: 0, shape: 'rect', art: '/assets/identity/vector/insulated-tote.svg' },

    // ── Rubber Stamps & Parcel Seals ──
    { key: 'rubber-stamp', group: 'Rubber Stamps & Seals', name: 'Circular Rubber Stamp — Kraft / Cream', w: 2, h: 2, bleed: 0, shape: 'circle', art: '/assets/identity/hofherr-stamp-circular.svg', note: '55-shore laser-cut red rubber · 2.3mm relief' },
    { key: 'stamp-crimson', group: 'Rubber Stamps & Seals', name: 'Northfield Provenance Stamp — Crimson', w: 2, h: 2, bleed: 0, shape: 'circle', art: '/assets/identity/hofherr-stamp-circular-crimson.svg' },
    { key: 'stamp-dark', group: 'Rubber Stamps & Seals', name: 'Circular Rubber Stamp — Dark Charcoal', w: 2, h: 2, bleed: 0, shape: 'circle', art: '/assets/identity/hofherr-stamp-circular-dark.svg' },
    { key: 'stamp-usda', group: 'Rubber Stamps & Seals', name: 'USDA Prime Shield Stamp', w: 2.5, h: 2, bleed: 0, shape: 'rect', art: '/assets/identity/hofherr-stamp-usda-prime.svg' },
    { key: 'stamp-guild', group: 'Rubber Stamps & Seals', name: 'Butcher Guild Heritage Stamp', w: 2.5, h: 2.5, bleed: 0, shape: 'circle', art: '/assets/identity/vector/hofherr-butcher-guild-stamp.svg' },
    { key: 'stamp-steer', group: 'Rubber Stamps & Seals', name: 'Isolated Heritage Steer Stamp', w: 3, h: 2, bleed: 0, shape: 'rect', art: '/assets/identity/vector/hofherr-steer-stamp-isolated.svg' },
    { key: 'parcel-safety-color', group: 'Rubber Stamps & Seals', name: 'Parcel Liner Safety Seal (Color)', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/recipes/sheets/hofherr-safety-seal.svg' },
    { key: 'parcel-safety-bw', group: 'Rubber Stamps & Seals', name: 'Parcel Liner Safety Seal (B&W Thermal)', w: 2.5, h: 2.5, bleed: 0.0625, shape: 'circle', art: '/assets/recipes/sheets/hofherr-safety-seal-bw.svg' },

    // ── Cards & stationery ──
    { key: 'gift-card', group: 'Cards & stationery', name: 'Gift card (CR80)', w: 3.375, h: 2.125, bleed: 0.125, shape: 'rounded', art: '/assets/identity/vector/gift-cards.svg' },
    { key: 'business-card', group: 'Cards & stationery', name: 'Business card', w: 3.5, h: 2, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/business-cards-letterhead.svg' },
    { key: 'loyalty-card', group: 'Cards & stationery', name: 'Loyalty punch card', w: 3.5, h: 2, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/loyalty-punch-card.svg' },
    { key: 'letterhead', group: 'Cards & stationery', name: 'Letterhead', w: 8.5, h: 11, bleed: 0, shape: 'rect', art: '/assets/identity/vector/business-cards-letterhead.svg' },
    { key: 'envelope', group: 'Cards & stationery', name: '#10 envelope', w: 9.5, h: 4.125, bleed: 0, shape: 'rect', art: '/assets/identity/vector/business-cards-letterhead.svg' },
    { key: 'order-pad', group: 'Cards & stationery', name: 'Custom-cut order pad', w: 5.5, h: 8.5, bleed: 0, shape: 'rect', art: '/assets/identity/vector/custom-cut-order-pad.svg' },

    // ── Primal Cut Charts & Posters ──
    { key: 'cut-chart', group: 'Cut Charts & Posters', name: 'Master Cut Chart Poster', w: 24, h: 36, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/cut-chart-poster.svg' },
    { key: 'chart-beef', group: 'Cut Charts & Posters', name: 'Primal Cut Guide — Beef', w: 18, h: 12, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/flint-flame-butcher-guide-beef.svg' },
    { key: 'chart-pork', group: 'Cut Charts & Posters', name: 'Primal Cut Guide — Pork', w: 18, h: 12, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/flint-flame-butcher-guide-pork.svg' },
    { key: 'chart-chicken', group: 'Cut Charts & Posters', name: 'Primal Cut Guide — Chicken', w: 18, h: 12, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/flint-flame-butcher-guide-chicken.svg' },
    { key: 'chart-lamb', group: 'Cut Charts & Posters', name: 'Primal Cut Guide — Lamb', w: 18, h: 12, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/flint-flame-butcher-guide-lamb.svg' },
    { key: 'chart-duck', group: 'Cut Charts & Posters', name: 'Primal Cut Guide — Duck', w: 18, h: 12, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/flint-flame-butcher-guide-duck.svg' },
    { key: 'chart-turkey', group: 'Cut Charts & Posters', name: 'Primal Cut Guide — Turkey', w: 18, h: 12, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/flint-flame-butcher-guide-turkey.svg' },
    { key: 'chart-veal', group: 'Cut Charts & Posters', name: 'Primal Cut Guide — Veal', w: 18, h: 12, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/flint-flame-butcher-guide-veal.svg' },
    { key: 'chart-cow-classic', group: 'Cut Charts & Posters', name: 'Classic Cow Butcher Cuts Diagram', w: 18, h: 12, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/cow-butcher-cuts-900x600.svg' },

    // ── Signage ──
    { key: 'price-tag', group: 'Signage', name: 'Meat case price tag', w: 3.5, h: 2.25, bleed: 0.0625, shape: 'rounded', art: '/assets/identity/vector/case-price-tags.svg' },
    { key: 'window-decal', group: 'Signage', name: 'Door / window decal', w: 18, h: 24, bleed: 0, shape: 'rect', art: '/assets/identity/vector/door-decal-hours.svg' },
    { key: 'a-frame', group: 'Signage', name: 'Sidewalk A-frame insert', w: 24, h: 36, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/menu-board-aframe.svg' },
    { key: 'wall-menu', group: 'Signage', name: 'Wall menu board', w: 36, h: 36, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/menu-board-aframe.svg' },
    { key: 'app-icon', group: 'Signage', name: 'Master emblem / app icon', w: 6, h: 6, bleed: 0, shape: 'rect', art: '/assets/identity/vector/app-icon-favicon.svg' },
    { key: 'farm-sign', group: 'Signage', name: 'Farm source wall sign', w: 48, h: 27, bleed: 0.125, shape: 'rect', art: '/assets/identity/vector/farm-source-sign.svg' },

    // ── Apparel ──
    { key: 'chest-patch', group: 'Apparel', name: 'Embroidered chest patch / Apron', w: 3.5, h: 3.5, bleed: 0, shape: 'circle', art: '/assets/identity/vector/apron-coat-cap.svg' },
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
