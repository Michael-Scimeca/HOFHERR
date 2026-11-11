'use client';

import React, { useState, useMemo } from 'react';
import styles from './MasterVectorLibrary.module.css';

export type VectorAsset = {
    id: string;
    name: string;
    category: 'counter-seals' | 'wrapping-paper' | 'departments' | 'depot-store' | 'stamps-dielines' | 'brand-digital';
    categoryLabel: string;
    desc: string;
    path: string;
    href: string;
    downloadName: string;
    sizeKb: string;
    format: string;
    illustratorVerified: boolean;
};

export const MASTER_VECTOR_ASSETS: VectorAsset[] = [
    // ── 1. Counter Packaging & Specialty Seals (Ø 3.00" Circles) ──
    {
        id: 'boneless-trim',
        name: 'Boneless Trim (Active Boning Knife Cut)',
        category: 'counter-seals',
        categoryLabel: 'Counter Packaging Seal',
        desc: 'Serrated medallion seal with curved typography "• HOFHERR MEAT CO. •" and "• BONELESS TRIM •", EST. 2018, and artisan boning knife.',
        path: 'public/icons/boneless.svg',
        href: '/icons/boneless.svg',
        downloadName: 'hofherr-icon-boneless-trim.svg',
        sizeKb: '87.2 KB',
        format: 'Pure Bézier Curves (1024×1024)',
        illustratorVerified: true,
    },
    {
        id: 'safety-seal',
        name: 'Tamper-Evident Safety Seal',
        category: 'counter-seals',
        categoryLabel: 'Official Certification Seal',
        desc: 'Serrated medallion seal with curved typography "• HOFHERR MEAT CO. •" and "• SAFETY SEAL •", EST. 2018, and Flame Steer Head.',
        path: 'public/icons/safetyseal.svg',
        href: '/icons/safetyseal.svg',
        downloadName: 'hofherr-icon-safetyseal.svg',
        sizeKb: '66.2 KB',
        format: 'Pure Bézier Curves (1024×1024)',
        illustratorVerified: true,
    },
    {
        id: 'bonein-primal',
        name: 'Bone-In Primal (Tomahawk Steak)',
        category: 'counter-seals',
        categoryLabel: 'Counter Packaging Seal',
        desc: 'Serrated medallion seal with curved typography "• HOFHERR MEAT CO. •" and "• BONE-IN PRIMAL •", EST. 2018, and cowboy ribeye steak.',
        path: 'public/icons/bonein.svg',
        href: '/icons/bonein.svg',
        downloadName: 'hofherr-icon-bonein.svg',
        sizeKb: '57.3 KB',
        format: 'Pure Bézier Curves (1024×1024)',
        illustratorVerified: true,
    },
    {
        id: 'thickcut-2in',
        name: 'Thick-Cut 2″ (Porterhouse Master Cut)',
        category: 'counter-seals',
        categoryLabel: 'Counter Packaging Seal',
        desc: 'Serrated medallion seal with curved typography "• HOFHERR MEAT CO. •" and "• THICK-CUT 2\\" •", EST. 2018, and porterhouse master cut.',
        path: 'public/icons/thickcut.svg',
        href: '/icons/thickcut.svg',
        downloadName: 'hofherr-icon-thickcut.svg',
        sizeKb: '64.4 KB',
        format: 'Pure Bézier Curves (1024×1024)',
        illustratorVerified: true,
    },
    {
        id: 'dryaged-vault',
        name: 'Dry-Aged Vault Reserve',
        category: 'counter-seals',
        categoryLabel: 'Cellar Reserve Seal',
        desc: 'Serrated medallion seal with curved typography "• HOFHERR MEAT CO. •" and "• DRY-AGED RESERVE •", EST. 2018, and standing cellar rib roast.',
        path: 'public/icons/dryaged.svg',
        href: '/icons/dryaged.svg',
        downloadName: 'hofherr-icon-dryaged.svg',
        sizeKb: '78.4 KB',
        format: 'Pure Bézier Curves (1024×1024)',
        illustratorVerified: true,
    },
    {
        id: 'smoked-pitmaster',
        name: 'House-Smoked Pitmaster',
        category: 'counter-seals',
        categoryLabel: 'Smokehouse Seal',
        desc: 'Serrated medallion seal with curved typography "• HOFHERR MEAT CO. •" and "• HOUSE-SMOKED •", EST. 2018, and oak campfire logs with rising flames.',
        path: 'public/icons/smoked.svg',
        href: '/icons/smoked.svg',
        downloadName: 'hofherr-icon-smoked.svg',
        sizeKb: '53.3 KB',
        format: 'Pure Bézier Curves (1024×1024)',
        illustratorVerified: true,
    },
    {
        id: 'ground-fresh',
        name: 'Ground Fresh Today',
        category: 'counter-seals',
        categoryLabel: 'Butcher Counter Seal',
        desc: 'Serrated medallion seal with curved typography "• HOFHERR MEAT CO. •" and "• GROUND FRESH •", EST. 2018, and vintage butcher meat grinder.',
        path: 'public/icons/groundfresh.svg',
        href: '/icons/groundfresh.svg',
        downloadName: 'hofherr-icon-groundfresh.svg',
        sizeKb: '64.3 KB',
        format: 'Pure Bézier Curves (1024×1024)',
        illustratorVerified: true,
    },
    {
        id: 'grill-tonight',
        name: 'Grill Tonight / Markdown',
        category: 'counter-seals',
        categoryLabel: 'Butcher Special Seal',
        desc: 'Serrated medallion seal with curved typography "• HOFHERR MEAT CO. •" and "• GRILL TONIGHT •", EST. 2018, and kettle charcoal barbecue grill.',
        path: 'public/icons/grilltonight.svg',
        href: '/icons/grilltonight.svg',
        downloadName: 'hofherr-icon-grilltonight.svg',
        sizeKb: '65.8 KB',
        format: 'Pure Bézier Curves (1024×1024)',
        illustratorVerified: true,
    },
    {
        id: 'grass-fed',
        name: '100% Grass-Fed & Finished',
        category: 'counter-seals',
        categoryLabel: 'Pasture Spec Seal',
        desc: 'Serrated medallion seal with curved typography "• HOFHERR MEAT CO. •" and "• 100% GRASS-FED •", EST. 2018, and Midwest pasture bull emblem.',
        path: 'public/icons/grassfed.svg',
        href: '/icons/grassfed.svg',
        downloadName: 'hofherr-icon-grassfed.svg',
        sizeKb: '29.1 KB',
        format: 'Pure Bézier Curves (1024×1024)',
        illustratorVerified: true,
    },
    {
        id: 'seasoned-ready',
        name: 'Pre-Seasoned Ready to Grill',
        category: 'counter-seals',
        categoryLabel: 'House Prep Seal',
        desc: 'Serrated medallion seal with curved typography "• HOFHERR MEAT CO. •" and "• PRE-SEASONED •", EST. 2018, and herb-rubbed steak cut.',
        path: 'public/icons/seasoned.svg',
        href: '/icons/seasoned.svg',
        downloadName: 'hofherr-icon-seasoned.svg',
        sizeKb: '38.3 KB',
        format: 'Pure Bézier Curves (1024×1024)',
        illustratorVerified: true,
    },
    {
        id: 'oven-ready',
        name: 'Oven-Ready & Tied Roast',
        category: 'counter-seals',
        categoryLabel: 'Kitchen Prep Seal',
        desc: 'Serrated medallion seal with curved typography "• HOFHERR MEAT CO. •" and "• OVEN-READY •", EST. 2018, and butcher twine-tied roast.',
        path: 'public/icons/ovenready.svg',
        href: '/icons/ovenready.svg',
        downloadName: 'hofherr-icon-ovenready.svg',
        sizeKb: '34.2 KB',
        format: 'Pure Bézier Curves (1024×1024)',
        illustratorVerified: true,
    },
    {
        id: 'onsale-special',
        name: 'On Sale / Daily Special',
        category: 'counter-seals',
        categoryLabel: 'Counter Feature Seal',
        desc: 'Serrated medallion seal with curved typography "• HOFHERR MEAT CO. •" and "• DAILY SPECIAL •", EST. 2018, and classic heavy butcher cleaver blade.',
        path: 'public/icons/onsale.svg',
        href: '/icons/onsale.svg',
        downloadName: 'hofherr-icon-onsale.svg',
        sizeKb: '35.3 KB',
        format: 'Pure Bézier Curves (1024×1024)',
        illustratorVerified: true,
    },

    // ── 2. Wrapping Paper Production Plates & Tiles (24"×16" Sheets) ──
    {
        id: 'wrap-white-ink-green',
        name: 'Depot Heritage Green · Crisp White Ink (24"×16")',
        category: 'wrapping-paper',
        categoryLabel: 'Production Paper Plate',
        desc: 'Winnetka Depot reserve wrapping paper featuring all 10 linocuts and wordmark in opaque stark white ink on #142A1E.',
        path: 'public/assets/identity/wrapping-paper/colorways/hofherr-wrap-12-depot-green-white-ink.svg',
        href: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-12-depot-green-white-ink.svg',
        downloadName: 'hofherr-wrap-12-depot-green-white-ink.svg',
        sizeKb: '1,255 KB',
        format: '24.00"×16.00" Pure Vector Plate',
        illustratorVerified: true,
    },
    {
        id: 'wrap-classic-kraft',
        name: 'Classic Butcher Kraft · Oxblood & Amber (24"×16")',
        category: 'wrapping-paper',
        categoryLabel: 'Production Paper Plate',
        desc: 'Full 24"×16" production print sheet on unbleached natural kraft with 10 step-and-repeat department linocuts.',
        path: 'public/assets/identity/hofherr-wrapping-paper-10-icons-24x16.svg',
        href: '/assets/identity/hofherr-wrapping-paper-10-icons-24x16.svg',
        downloadName: 'hofherr-wrapping-paper-kraft-24x16.svg',
        sizeKb: '1,255 KB',
        format: '24.00"×16.00" Pure Vector Plate',
        illustratorVerified: true,
    },
    {
        id: 'wrap-depot-green-crimson',
        name: 'Depot Heritage Green · Crimson & Gold (24"×16")',
        category: 'wrapping-paper',
        categoryLabel: 'Production Paper Plate',
        desc: 'Tone-on-tone reserve plate with oxblood linework and champagne gold highlights on Winnetka Depot green.',
        path: 'public/assets/identity/wrapping-paper/colorways/hofherr-wrap-11-depot-heritage-green.svg',
        href: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-11-depot-heritage-green.svg',
        downloadName: 'hofherr-wrap-11-depot-green-crimson.svg',
        sizeKb: '1,254 KB',
        format: '24.00"×16.00" Pure Vector Plate',
        illustratorVerified: true,
    },
    {
        id: 'wrap-red-dark-crimson',
        name: 'Red on Dark Crimson · Tone-on-Tone Oxblood (24"×16")',
        category: 'wrapping-paper',
        categoryLabel: 'Production Paper Plate',
        desc: 'Tone-on-tone oxblood butcher roll (#3B0508) with vibrant scarlet line art (#E0242B) and warm amber gold embers (#F59B1A).',
        path: 'public/assets/identity/wrapping-paper/colorways/hofherr-wrap-02-red-on-dark-red.svg',
        href: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-02-red-on-dark-red.svg',
        downloadName: 'hofherr-wrap-02-red-on-dark-red.svg',
        sizeKb: '1,254 KB',
        format: '24.00"×16.00" Pure Vector Plate',
        illustratorVerified: true,
    },
    {
        id: 'wrap-spot-ink-only',
        name: 'Flexographic Spot-Color Ink Separation Plates',
        category: 'wrapping-paper',
        categoryLabel: 'Flexo Plate Separations',
        desc: 'Pure ink layer (transparent background) for 2-station rotary flexo roll presses on 18" and 24" butcher rolls.',
        path: 'public/assets/identity/hofherr-wrapping-paper-ink-only-10-icons.svg',
        href: '/assets/identity/hofherr-wrapping-paper-ink-only-10-icons.svg',
        downloadName: 'hofherr-wrapping-paper-ink-only.svg',
        sizeKb: '1,255 KB',
        format: 'Pure Ink-Only Vector Plate',
        illustratorVerified: true,
    },
    {
        id: 'wrap-repeat-tile',
        name: 'Seamless 5.00"×6.00" Step-and-Repeat Tile',
        category: 'wrapping-paper',
        categoryLabel: 'Repeat Tile Master',
        desc: 'Seamless tessellating vector tile unit designed for endless roll printing at 45° diagonal angle.',
        path: 'public/assets/identity/hofherr-wrapping-paper-tile-10-icons.svg',
        href: '/assets/identity/hofherr-wrapping-paper-tile-10-icons.svg',
        downloadName: 'hofherr-wrapping-paper-tile-5x6.svg',
        sizeKb: '1,251 KB',
        format: '5.00"×6.00" Seamless Vector Unit',
        illustratorVerified: true,
    },
    {
        id: 'wrap-red-on-white',
        name: 'Colorway 01: Butcher White & Oxblood Crimson',
        category: 'wrapping-paper',
        categoryLabel: 'Colorway Variant Plate',
        desc: 'High-contrast pure white poly-coated freezer wrap with deep crimson linocuts.',
        path: 'public/assets/identity/wrapping-paper/colorways/hofherr-wrap-01-red-on-white.svg',
        href: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-01-red-on-white.svg',
        downloadName: 'hofherr-wrap-01-red-on-white.svg',
        sizeKb: '1,254 KB',
        format: '24.00"×16.00" Pure Vector Plate',
        illustratorVerified: true,
    },
    {
        id: 'wrap-gold-on-obsidian',
        name: 'Colorway 07: Obsidian & Metallic Gold Foil',
        category: 'wrapping-paper',
        categoryLabel: 'Colorway Variant Plate',
        desc: 'Holiday & cellar reserve black kraft wrapping sheet with metallic gold linocuts.',
        path: 'public/assets/identity/wrapping-paper/colorways/hofherr-wrap-07-gold-on-obsidian.svg',
        href: '/assets/identity/wrapping-paper/colorways/hofherr-wrap-07-gold-on-obsidian.svg',
        downloadName: 'hofherr-wrap-07-gold-on-obsidian.svg',
        sizeKb: '1,254 KB',
        format: '24.00"×16.00" Pure Vector Plate',
        illustratorVerified: true,
    },

    // ── 3. The Butcher Shop Department Medallions (14 Online Sidebar Categories) ──
    {
        id: 'dept-cow',
        name: 'Prime Beef (Flaming Bull Head)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Official master bovine emblem with flame crown; dry-aged steaks and prime cut signature.',
        path: 'public/icons/cow.svg',
        href: '/icons/cow.svg',
        downloadName: 'hofherr-icon-beef.svg',
        sizeKb: '50.9 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-pig',
        name: 'Heritage Pork (Berkshire Hog)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Berkshire breed heritage pork silhouette with flame saddle for chops, belly & roasts.',
        path: 'public/icons/pig.svg',
        href: '/icons/pig.svg',
        downloadName: 'hofherr-icon-pork.svg',
        sizeKb: '37.1 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-chicken',
        name: 'Poultry & Rotisserie (Rooster)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Proud barnyard rooster with flame plume for pasture-raised whole birds and wings.',
        path: 'public/icons/chicken.svg',
        href: '/icons/chicken.svg',
        downloadName: 'hofherr-icon-chicken.svg',
        sizeKb: '27.8 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-suage',
        name: 'Housemade Sausage (Links & Brats)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Natural-casing artisan sausage links with flame halo for fresh housemade brats.',
        path: 'public/icons/suage.svg',
        href: '/icons/suage.svg',
        downloadName: 'hofherr-icon-sausage.svg',
        sizeKb: '34.1 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-hamcheese',
        name: 'Deli Meat & Cheese (Ham & Cheese Wedge)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Sliced house-roasted deli ham and aged Swiss wedge for cold sandwich counter.',
        path: 'public/icons/hamcheese.svg',
        href: '/icons/hamcheese.svg',
        downloadName: 'hofherr-icon-deli.svg',
        sizeKb: '76.6 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-prepared',
        name: 'Prepared Foods (Cast Iron Skillet)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Sizzling cast-iron skillet for scratch kitchen heat-and-serve meals.',
        path: 'public/icons/prepared.svg',
        href: '/icons/prepared.svg',
        downloadName: 'hofherr-icon-prepared.svg',
        sizeKb: '80.2 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-lamb',
        name: 'Pasture Lamb (Domestic Sheep)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Midwest domestic lamb profile with flame fleece for chops, racks and legs.',
        path: 'public/icons/lamb.svg',
        href: '/icons/lamb.svg',
        downloadName: 'hofherr-icon-lamb.svg',
        sizeKb: '56.0 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-fish',
        name: 'Fresh Catch (Atlantic Salmon)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Leaping wild Atlantic fish emblem with flame tail for fresh counter catch.',
        path: 'public/icons/fish.svg',
        href: '/icons/fish.svg',
        downloadName: 'hofherr-icon-fish.svg',
        sizeKb: '40.1 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-seafood',
        name: 'Shellfish & Crab (Maine Lobster)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Cold-water Maine lobster with flame antennae for wild shrimp, crab & shellfish.',
        path: 'public/icons/seafood.svg',
        href: '/icons/seafood.svg',
        downloadName: 'hofherr-icon-lobster.svg',
        sizeKb: '49.5 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-veal',
        name: 'Midwest Veal (Milk-Fed Calf)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Humanely-raised milk-fed calf head with flame brow for chops and cutlets.',
        path: 'public/icons/veal.svg',
        href: '/icons/veal.svg',
        downloadName: 'hofherr-icon-veal.svg',
        sizeKb: '60.7 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-turkey',
        name: 'Ferndale Turkey (Wild Tom Turkey)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Full-fanned Ferndale Market turkey with flaming tail plumage for whole birds.',
        path: 'public/icons/turkey.svg',
        href: '/icons/turkey.svg',
        downloadName: 'hofherr-icon-turkey.svg',
        sizeKb: '80.4 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-duck',
        name: 'Specialty Duck (Mallard / Rohan Duck)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Specialty waterfowl emblem with flame crest for Magret breast & confit.',
        path: 'public/icons/duck.svg',
        href: '/icons/duck.svg',
        downloadName: 'hofherr-icon-duck.svg',
        sizeKb: '22.6 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-game',
        name: 'Wild & Exotic Game (Bison / Boar)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Fierce wild boar and bison head with flaming horns for venison, elk and boar.',
        path: 'public/icons/game.svg',
        href: '/icons/game.svg',
        downloadName: 'hofherr-icon-game.svg',
        sizeKb: '87.4 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-stocksoup',
        name: 'Stocks & Soups (Kettle Broth Bowl)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Simmering stock bowl with ladle and aromatic steam flame for frozen quarts.',
        path: 'public/icons/stocksoup.svg',
        href: '/icons/stocksoup.svg',
        downloadName: 'hofherr-icon-soup.svg',
        sizeKb: '26.2 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-catering',
        name: 'Catering & Events (Delivery Truck)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Vintage delivery truck with smokehouse exhaust for whole-hog catering.',
        path: 'public/icons/catering.svg',
        href: '/icons/catering.svg',
        downloadName: 'hofherr-icon-catering.svg',
        sizeKb: '32.2 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },
    {
        id: 'dept-cheese',
        name: 'Artisanal Cheese (Cave-Aged Wedge)',
        category: 'departments',
        categoryLabel: 'Sidebar Department Icon',
        desc: 'Holey aged Swiss cheese wedge with flame tongue for cave-aged wheels.',
        path: 'public/icons/cheese.svg',
        href: '/icons/cheese.svg',
        downloadName: 'hofherr-icon-cheese.svg',
        sizeKb: '41.5 KB',
        format: 'Pure Bézier Curves',
        illustratorVerified: true,
    },

    // ── 4. Rubber Stamps, Dielines & Brand Assets ──
    {
        id: 'master-emblem-suite',
        name: 'Master Vector Emblem Suite (All Department Marks)',
        category: 'stamps-dielines',
        categoryLabel: 'Master Production Suite',
        desc: 'Comprehensive multi-board vector SVG containing all department and counter emblems on one sheet.',
        path: 'public/assets/identity/hofherr-master-emblem-suite.svg',
        href: '/assets/identity/hofherr-master-emblem-suite.svg',
        downloadName: 'hofherr-master-emblem-suite.svg',
        sizeKb: '568 KB',
        format: 'Multi-Board Vector Production Art',
        illustratorVerified: true,
    },
    {
        id: 'stamp-circular',
        name: 'Turned-Wood Rubber Stamp (Circular Scalloped)',
        category: 'stamps-dielines',
        categoryLabel: 'Rubber Stamp Vector Die',
        desc: 'Laser-engraved rubber rocker stamp artwork with serrated scallop perimeter and Northfield Est. 2018 arcs.',
        path: 'public/assets/identity/hofherr-stamp-circular.svg',
        href: '/assets/identity/hofherr-stamp-circular.svg',
        downloadName: 'hofherr-stamp-circular.svg',
        sizeKb: '70.0 KB',
        format: 'Laser-Engraving Vector Die (.SVG)',
        illustratorVerified: true,
    },
    {
        id: 'door-decal-hours',
        name: 'Storefront Door Decal & Hours Vinyl Production Die',
        category: 'stamps-dielines',
        categoryLabel: 'Signage Vinyl Plotter Die',
        desc: 'Gold-leaf, cream, and crimson arched store hours and phone number for glass window cutting.',
        path: 'public/assets/identity/hofherr-door-decal-hours.svg',
        href: '/assets/identity/hofherr-door-decal-hours.svg',
        downloadName: 'hofherr-door-decal-hours.svg',
        sizeKb: '119 KB',
        format: 'Vinyl Plotter Production Die (.SVG)',
        illustratorVerified: true,
    },
    {
        id: 'gift-card-crimson',
        name: 'CR80 Gift Card Vector Artwork (Crimson Edition)',
        category: 'stamps-dielines',
        categoryLabel: 'Card Production Art',
        desc: 'Standard 3.375"×2.125" CR80 plastic card vector artwork with bleed and magnetic stripe specs.',
        path: 'public/assets/identity/gifting/gift-card-crimson.svg',
        href: '/assets/identity/gifting/gift-card-crimson.svg',
        downloadName: 'hofherr-gift-card-crimson.svg',
        sizeKb: '53.0 KB',
        format: 'CR80 Vector Card Dieline (.SVG)',
        illustratorVerified: true,
    },
    {
        id: 'app-icon-master',
        name: 'Official Master App Icon & Favicon Suite',
        category: 'brand-digital',
        categoryLabel: 'Digital Brand Icon',
        desc: 'Square and squircle icon masters featuring the golden-amber flaming steer on deep crimson ground.',
        path: 'public/assets/identity/hofherr-app-icon.svg',
        href: '/assets/identity/hofherr-app-icon.svg',
        downloadName: 'hofherr-app-icon.svg',
        sizeKb: '51.2 KB',
        format: '1024×1024 Scalable Vector (.SVG)',
        illustratorVerified: true,
    },
    {
        id: 'catering-box-lid',
        name: 'Hofherr Catering Box Lid Plate (Whole Hog & Event BBQ)',
        category: 'stamps-dielines',
        categoryLabel: 'Packaging Print Plate',
        desc: '10"×7" Corrugated kraft catering box lid print plate with bold vintage woodblock lettering and leaping whole hog over roaring fire bed.',
        path: 'public/assets/catering/catering-box-lid-whole-hog.svg',
        href: '/assets/catering/catering-box-lid-whole-hog.svg',
        downloadName: 'hofherr-catering-box-lid-whole-hog.svg',
        sizeKb: '99.0 KB',
        format: '10.00"×7.00" Pure Vector Plate (.SVG)',
        illustratorVerified: true,
    },
];

export default function MasterVectorLibrary() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredAssets = useMemo(() => {
        return MASTER_VECTOR_ASSETS.filter((asset) => {
            const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
            const matchesSearch =
                searchQuery === '' ||
                asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.path.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <section id="vector-library" aria-labelledby="vector-library-heading" className={`container ${styles.section}`}>
            <div className={styles.header}>
                <h2 id="vector-library-heading" className={styles.title}>
                    14 / Master Vector Asset Library &amp; Illustrator Inspection Index (.SVG)
                </h2>
                <p className={styles.desc}>
                    Download and inspect every official production <code>.SVG</code> asset across Hofherr Meat Co. All
                    files are rendered with pure vector Bézier curves (100% path geometry, zero raster pixels, converted
                    typography) engineered for direct separation in Adobe Illustrator, laser-engraved rubber stamps,
                    2-color flexographic paper cylinder engraving, and vinyl plotters.
                </p>
            </div>

            {/* Filter & Search Toolbar */}
            <div className={styles.filterBar}>
                <div className={styles.tabList} role="tablist" aria-label="Filter vector asset categories">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={selectedCategory === 'all'}
                        onClick={() => setSelectedCategory('all')}
                        className={`${styles.tabBtn} ${selectedCategory === 'all' ? styles.tabBtnActive : ''}`}
                    >
                        All Vector SVGs ({MASTER_VECTOR_ASSETS.length})
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={selectedCategory === 'counter-seals'}
                        onClick={() => setSelectedCategory('counter-seals')}
                        className={`${styles.tabBtn} ${selectedCategory === 'counter-seals' ? styles.tabBtnActive : ''}`}
                    >
                        Counter Seals (12)
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={selectedCategory === 'wrapping-paper'}
                        onClick={() => setSelectedCategory('wrapping-paper')}
                        className={`${styles.tabBtn} ${selectedCategory === 'wrapping-paper' ? styles.tabBtnActive : ''}`}
                    >
                        Wrapping Paper Plates (7)
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={selectedCategory === 'departments'}
                        onClick={() => setSelectedCategory('departments')}
                        className={`${styles.tabBtn} ${selectedCategory === 'departments' ? styles.tabBtnActive : ''}`}
                    >
                        Department Emblems (16)
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={selectedCategory === 'stamps-dielines'}
                        onClick={() => setSelectedCategory('stamps-dielines')}
                        className={`${styles.tabBtn} ${selectedCategory === 'stamps-dielines' ? styles.tabBtnActive : ''}`}
                    >
                        Stamps &amp; Dielines (4)
                    </button>
                </div>

                <div className={styles.filterBarRight}>
                    <input
                        type="text"
                        placeholder="Search vector name or path..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                        aria-label="Search vector assets"
                    />
                </div>
            </div>

            <div className={styles.assetCount}>
                Showing {filteredAssets.length} verified production SVG files
            </div>

            {/* Asset Cards Grid */}
            <div className={styles.assetGrid}>
                {filteredAssets.map((asset) => (
                    <div key={asset.id} className={styles.assetCard}>
                        <div className={styles.previewRow}>
                            <div className={styles.thumbWrap}>
                                <img
                                    src={asset.href}
                                    alt={asset.name}
                                    className={styles.thumbImg}
                                    loading="lazy"
                                />
                            </div>
                            <div className={styles.metaCol}>
                                <span className={styles.assetCategory}>{asset.categoryLabel}</span>
                                <h3 className={styles.assetName} title={asset.name}>
                                    {asset.name}
                                </h3>
                                <p className={styles.assetDesc}>{asset.desc}</p>
                            </div>
                        </div>

                        <div className={styles.pathBox}>
                            <code className={styles.pathCode} title={asset.path}>
                                {asset.path}
                            </code>
                            <span className={styles.verifiedTag}>Illustrator Ready ✓</span>
                        </div>

                        <div className={styles.cardFooter}>
                            <span className={styles.fileSize}>
                                {asset.sizeKb} · {asset.format}
                            </span>
                            <a
                                href={asset.href}
                                download={asset.downloadName}
                                className={styles.downloadLink}
                            >
                                ⬇ Download .SVG
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
