'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';

interface GreenSwatch {
  id: string;
  name: string;
  hex: string;
  token: string;
  files: string;
}

interface GreenGroup {
  id: string;
  title: string;
  swatches: GreenSwatch[];
}

const GREEN_GROUPS: GreenGroup[] = [
  {
    id: 'brand-heritage',
    title: '1. Official Brand & Winnetka Depot Heritage Forest Greens',
    swatches: [
      {
        id: 'depot-dark',
        name: 'Winnetka Depot Deep Forest',
        hex: '#0d1b13',
        token: '--green-depot-dark',
        files: 'globals.css',
      },
      {
        id: 'depot-base',
        name: 'Winnetka Depot Heritage Green (PMS 5535 C)',
        hex: '#142a1e',
        token: '--green-depot / --green-depot-surface',
        files: 'globals.css, ExtendedIdentityBoards.tsx, order/success, dashboard, admin',
      },
      {
        id: 'depot-light',
        name: 'Winnetka Depot Forest Highlight',
        hex: '#1e3d2c',
        token: '--green-depot-light',
        files: 'globals.css',
      },
      {
        id: 'admin-obsidian-emerald',
        name: 'Dark Emerald Surface',
        hex: '#0b1914',
        token: 'admin card surface',
        files: 'admin/admin.module.css',
      },
      {
        id: 'map-foliage',
        name: 'Dark Map Park & Foliage Green',
        hex: '#1e2e1e',
        token: 'CustomMap style JSON',
        files: 'components/shared/CustomMap.tsx',
      },
    ],
  },
  {
    id: 'storefront-status',
    title: '2. Customer Storefront, Order Ready & Live Status Greens',
    swatches: [
      {
        id: 'green-ready',
        name: 'Unified Storefront Status & Ready Green (--green-ready)',
        hex: '#16a34a',
        token: '--green-ready',
        files: 'globals.css, order/success, Navbar, checkout, online-orders, specials, BBQHub, CateringHub, SeasonalBanner, SourcingStrip, dashboard, admin, email-templates',
      },
      {
        id: 'sync-pulse',
        name: 'Live Sync Dot / Coupon Applied / Active Step',
        hex: '#22c55e',
        token: 'status emerald-500',
        files: 'order/success, checkout, dashboard, verify-email, HiringChatbox',
      },
      {
        id: 'tag-green-utility',
        name: 'Global Tag Green Pill Background',
        hex: '#2d6e2d',
        token: '.tag-green',
        files: 'globals.css',
      },
      {
        id: 'seasonal-clover',
        name: 'Seasonal Banner Bright Leaf',
        hex: '#a8d890',
        token: 'seasonal highlight',
        files: 'SeasonalBanner.module.css',
      },
      {
        id: 'auth-success',
        name: 'Auth Modal Verified Message',
        hex: '#6ee7a0',
        token: 'auth success text',
        files: 'AuthModal.module.css',
      },
      {
        id: 'chat-online-dot',
        name: 'Butcher Chat Online Indicator',
        hex: '#7dff7d',
        token: 'chat live dot',
        files: 'ChatWidget.module.css',
      },
      {
        id: 'mint-surface-tint',
        name: 'Light Mint Confirmation Tint',
        hex: '#e8f5e9',
        token: 'light confirmation fill',
        files: 'online-orders/page.module.css, api/catering',
      },
      {
        id: 'google-pay-green',
        name: 'Google Pay / OAuth Brand Mark',
        hex: '#34a853',
        token: 'Google SVG mark',
        files: 'CheckoutClient.tsx, OnlineOrdersClient.tsx, AuthModal.tsx',
      },
    ],
  },
  {
    id: 'cut-guide-culinary',
    title: '3. Cut Guide, Recipe & Print Registration Greens',
    swatches: [
      {
        id: 'cut-guide-emerald',
        name: 'Cut Guide Prime / Method Tag',
        hex: '#059669',
        token: 'cut-guide emerald',
        files: 'cut-guide/CutGuideClient.tsx, components/home/CutGuide.tsx',
      },
      {
        id: 'cut-guide-herb',
        name: 'Cut Guide Herb / Braise Tag',
        hex: '#2e7d6e',
        token: 'cut-guide herb teal',
        files: 'cut-guide/CutGuideClient.tsx, components/home/CutGuide.tsx',
      },
      {
        id: 'recipe-herb',
        name: 'Recipe Teasers Fresh Herb Badge',
        hex: '#3a7a3a',
        token: 'recipe badge',
        files: 'components/home/RecipeTeasers.tsx',
      },
      {
        id: 'lockup-mint',
        name: 'Chicago Lockup Mint Highlight',
        hex: '#a5d6a7',
        token: 'lockup accent',
        files: 'product-identity/ChicagoLockupsSection.module.css',
      },
      {
        id: 'print-safe-zone',
        name: 'Print Kit Safe-Zone Guide Ink',
        hex: '#00a651',
        token: 'print safe-zone',
        files: 'product-identity/print/PrintKit.tsx',
      },
    ],
  },
  {
    id: 'dashboard-admin-dev',
    title: '4. Dashboard, Admin, Inventory, Social Kit & Dev Greens',
    swatches: [
      {
        id: 'dash-emerald-500',
        name: 'Dashboard & Admin Emerald Core',
        hex: '#10b981',
        token: 'admin emerald-500',
        files: 'AdminDashboardClient.tsx, admin.module.css, dashboard.module.css',
      },
      {
        id: 'dash-emerald-400',
        name: 'Dashboard & Admin Emerald Bright',
        hex: '#34d399',
        token: 'admin emerald-400',
        files: 'admin.module.css, dashboard.module.css',
      },
      {
        id: 'dash-emerald-300',
        name: 'Dashboard Mint Pill Text',
        hex: '#6ee7b7',
        token: 'admin emerald-300',
        files: 'admin.module.css, dashboard.module.css',
      },
      {
        id: 'inventory-in-stock',
        name: 'Inventory Manager In-Stock Text',
        hex: '#86efac',
        token: 'inventory green-300',
        files: 'inventory/inventory.module.css, admin.module.css',
      },
      {
        id: 'dash-emerald-200',
        name: 'Dashboard Soft Mint Text',
        hex: '#a7f3d0',
        token: 'dashboard emerald-200',
        files: 'dashboard/dashboard.module.css',
      },
      {
        id: 'tracker-test-mint',
        name: 'Order Tracker Test Badge Text',
        hex: '#a7f3bc',
        token: 'tracker test mint',
        files: 'order-tracker-test/OrderTrackerClient.tsx',
      },
      {
        id: 'admin-pastel-200',
        name: 'Admin Light Badge Tint',
        hex: '#bbf7d0',
        token: 'admin green-200',
        files: 'admin/admin.module.css',
      },
      {
        id: 'social-published-dark',
        name: 'Social Kit Published Fill',
        hex: '#1a7f37',
        token: 'social published dark',
        files: 'admin/social/page.tsx, product-identity/social/SocialKit.tsx',
      },
      {
        id: 'social-ready-btn',
        name: 'Social Kit & Sitemap Active',
        hex: '#2ea043',
        token: 'social / sitemap green',
        files: 'product-identity/social/social.module.css, sitemap-page/page.module.css',
      },
      {
        id: 'social-muted-forest',
        name: 'Admin Social Muted Border',
        hex: '#3f8f4f',
        token: 'social border green',
        files: 'admin/social/social.module.css',
      },
      {
        id: 'social-live-dot',
        name: 'Social Kit Live Status',
        hex: '#3fb950',
        token: 'social status green',
        files: 'admin/social/social.module.css, product-identity/social/social.module.css',
      },
      {
        id: 'social-soft-leaf',
        name: 'Admin Social Soft Label',
        hex: '#7fd18f',
        token: 'social soft green',
        files: 'admin/social/social.module.css',
      },
      {
        id: 'social-neon-mint',
        name: 'Social Kit Metric Positive',
        hex: '#7ee787',
        token: 'social metric up',
        files: 'admin/social/social.module.css, product-identity/social/social.module.css',
      },
      {
        id: 'social-pale-mint',
        name: 'Admin Social Pale Highlight',
        hex: '#9be9a8',
        token: 'social pale green',
        files: 'admin/social/social.module.css',
      },
      {
        id: 'showcase-macos-dot',
        name: 'Showcase Window Traffic-Light Dot',
        hex: '#28c841',
        token: 'window dot green',
        files: 'showcase/page.module.css',
      },
      {
        id: 'roadmap-complete',
        name: 'Roadmap & Showcase Check',
        hex: '#4caf50',
        token: 'milestone complete',
        files: 'roadmap/page.module.css, showcase/page.module.css',
      },
      {
        id: 'gizmo-forest-1',
        name: 'Hero Editor Gizmo Deep',
        hex: '#1a5e2e',
        token: 'dev gizmo',
        files: 'components/home/HeroAssetEditor.tsx',
      },
      {
        id: 'gizmo-forest-2',
        name: 'Hero Editor Gizmo Mid',
        hex: '#1a6e3a',
        token: 'dev gizmo',
        files: 'components/home/HeroAssetEditor.tsx',
      },
      {
        id: 'gizmo-forest-3',
        name: 'Hero Editor Gizmo Accent',
        hex: '#2a9e5e',
        token: 'dev gizmo',
        files: 'components/home/HeroAssetEditor.tsx',
      },
      {
        id: 'gizmo-y-axis',
        name: 'Hero Editor Y-Axis Pure Green',
        hex: '#00ff00',
        token: 'dev axis Y',
        files: 'components/home/HeroAssetEditor.tsx',
      },
      {
        id: 'gizmo-highlight',
        name: 'Hero Editor Active Handle',
        hex: '#4eff9e',
        token: 'dev handle',
        files: 'components/home/HeroAssetEditor.tsx',
      },
    ],
  },
];

interface SingleEmblem {
  code: string;
  title: string;
  src: string;
  wide?: boolean;
  avatar?: boolean;
}

interface PairedEmblem {
  code: string;
  title: string;
  vectorSrc: string;
  stickerSrc: string;
}

const PRIMARY_STAMPS: SingleEmblem[] = [
  { code: 'MARK-01', title: 'Hofherr Primary Wordmark', src: '/assets/logo.svg', wide: true },
  { code: 'MARK-02', title: 'Hofherr Flame App Crest', src: '/assets/identity/hofherr-app-icon.svg' },
  { code: 'MARK-03', title: 'Cleaver "H" Monogram Emblem', src: '/assets/selections/hofherr-cleaver-h-emblem.png' },
  { code: 'STAMP-01', title: 'Circular Stamp — Kraft / Cream', src: '/assets/identity/hofherr-stamp-circular.svg' },
  { code: 'STAMP-02', title: 'Northfield Provenance Seal — Crimson', src: '/assets/identity/hofherr-stamp-circular-crimson.svg' },
  { code: 'STAMP-03', title: 'Circular Stamp — Dark Charcoal', src: '/assets/identity/hofherr-stamp-circular-dark.svg' },
  { code: 'STAMP-04', title: 'USDA Prime Shield Stamp', src: '/assets/identity/hofherr-stamp-usda-prime.svg' },
  { code: 'STAMP-05', title: 'Butcher Guild Heritage Stamp', src: '/assets/identity/vector/hofherr-butcher-guild-stamp.svg' },
  { code: 'STAMP-06', title: 'Isolated Heritage Steer Stamp', src: '/assets/identity/vector/hofherr-steer-stamp-isolated.svg' },
  { code: 'OPT-01', title: 'Stamp Lockup Option 01', src: '/assets/identity/stamp-option-1.svg' },
  { code: 'OPT-02', title: 'Stamp Lockup Option 02', src: '/assets/identity/stamp-option-2.svg' },
  { code: 'OPT-03', title: 'Stamp Lockup Option 03', src: '/assets/identity/stamp-option-3.svg' },
  { code: 'OPT-04', title: 'Stamp Lockup Option 04', src: '/assets/identity/stamp-option-4.svg' },
  { code: 'OPT-05', title: 'Stamp Lockup Option 05', src: '/assets/identity/stamp-option-5.svg' },
  { code: 'CREST-01', title: 'Whole Hog Catering Lid Crest', src: '/assets/catering/catering-box-lid-whole-hog.svg', wide: true },
  { code: 'SOC-01', title: 'Social Profile — Crimson Badge', src: '/assets/identity/apps/fb-profile-crimson-badge.svg' },
  { code: 'SOC-02', title: 'Social Profile — Charcoal Seal', src: '/assets/identity/apps/fb-profile-charcoal-seal.svg' },
  { code: 'PIN-01', title: 'Northfield Butcher Map Pin', src: '/icons/butcher-pin.svg' },
  { code: 'PIN-02', title: 'Winnetka Depot Map Pin', src: '/icons/depot-pin.svg' },
];

const QUALITY_SEALS: PairedEmblem[] = [
  { code: 'SEAL-01', title: 'Boneless Trim', vectorSrc: '/icons/boneless.svg', stickerSrc: '/assets/identity/stickers/sticker-boneless.svg' },
  { code: 'SEAL-02', title: 'Safety & Quality Seal', vectorSrc: '/icons/safetyseal.svg', stickerSrc: '/assets/identity/stickers/sticker-safetyseal.svg' },
  { code: 'SEAL-03', title: 'Bone-In Primal', vectorSrc: '/icons/bonein.svg', stickerSrc: '/assets/identity/stickers/sticker-bonein.svg' },
  { code: 'SEAL-04', title: 'Thick Cut Steakhouse Spec', vectorSrc: '/icons/thickcut.svg', stickerSrc: '/assets/identity/stickers/sticker-thickcut.svg' },
  { code: 'SEAL-05', title: 'Dry Aged In-House', vectorSrc: '/icons/dryaged.svg', stickerSrc: '/assets/identity/stickers/sticker-dryaged.svg' },
  { code: 'SEAL-06', title: 'Hardwood Smoked', vectorSrc: '/icons/smoked.svg', stickerSrc: '/assets/identity/stickers/sticker-smoked.svg' },
  { code: 'SEAL-07', title: 'Ground Fresh Daily', vectorSrc: '/icons/groundfresh.svg', stickerSrc: '/assets/identity/stickers/sticker-groundfresh.svg' },
  { code: 'SEAL-08', title: 'Grill Tonight Ready', vectorSrc: '/icons/grilltonight.svg', stickerSrc: '/assets/identity/stickers/sticker-grilltonight.svg' },
  { code: 'SEAL-09', title: '100% Grass-Fed Pasture', vectorSrc: '/icons/grassfed.svg', stickerSrc: '/assets/identity/stickers/sticker-grassfed.svg' },
  { code: 'SEAL-10', title: 'House Seasoned & Marinated', vectorSrc: '/icons/seasoned.svg', stickerSrc: '/assets/identity/stickers/sticker-seasoned.svg' },
  { code: 'SEAL-11', title: 'Oven Ready Prep', vectorSrc: '/icons/ovenready.svg', stickerSrc: '/assets/identity/stickers/sticker-ovenready.svg' },
  { code: 'SEAL-12', title: 'Counter Special / On Sale', vectorSrc: '/icons/onsale.svg', stickerSrc: '/assets/identity/stickers/sticker-onsale.svg' },
];

const BUTCHER_DEPT_EMBLEMS: PairedEmblem[] = [
  { code: 'BCH-01', title: 'Beef (Prime & Dry-Aged)', vectorSrc: '/icons/cow.svg', stickerSrc: '/assets/identity/stickers/sticker-cow.svg' },
  { code: 'BCH-02', title: 'Heritage Pork', vectorSrc: '/icons/pig.svg', stickerSrc: '/assets/identity/stickers/sticker-pig.svg' },
  { code: 'BCH-03', title: 'Pasture Poultry', vectorSrc: '/icons/chicken.svg', stickerSrc: '/assets/identity/stickers/sticker-chicken.svg' },
  { code: 'BCH-04', title: 'House Sausage', vectorSrc: '/icons/suage.svg', stickerSrc: '/assets/identity/stickers/sticker-suage.svg' },
  { code: 'BCH-05', title: 'Charcuterie & Deli', vectorSrc: '/icons/hamcheese.svg', stickerSrc: '/assets/identity/stickers/sticker-hamcheese.svg' },
  { code: 'BCH-06', title: 'Prepared Meals', vectorSrc: '/icons/prepared.svg', stickerSrc: '/assets/identity/stickers/sticker-prepared.svg' },
  { code: 'BCH-07', title: 'Domestic Lamb', vectorSrc: '/icons/lamb.svg', stickerSrc: '/assets/identity/stickers/sticker-lamb.svg' },
  { code: 'BCH-08', title: 'Fresh Seafood', vectorSrc: '/icons/fish.svg', stickerSrc: '/assets/identity/stickers/sticker-fish.svg' },
  { code: 'BCH-09', title: 'Midwest Veal', vectorSrc: '/icons/veal.svg', stickerSrc: '/assets/identity/stickers/sticker-veal.svg' },
  { code: 'BCH-10', title: 'Heritage Turkey', vectorSrc: '/icons/turkey.svg', stickerSrc: '/assets/identity/stickers/sticker-turkey.svg' },
  { code: 'BCH-11', title: 'Rohan Duck', vectorSrc: '/icons/duck.svg', stickerSrc: '/assets/identity/stickers/sticker-duck.svg' },
  { code: 'BCH-12', title: 'Wild & Exotic Game', vectorSrc: '/icons/game.svg', stickerSrc: '/assets/identity/stickers/sticker-game.svg' },
  { code: 'BCH-13', title: 'House Stocks & Soups', vectorSrc: '/icons/stocksoup.svg', stickerSrc: '/assets/identity/stickers/sticker-stocksoup.svg' },
  { code: 'BCH-14', title: 'Whole-Hog & Event Catering', vectorSrc: '/icons/catering.svg', stickerSrc: '/assets/identity/stickers/sticker-catering.svg' },
];

const DEPOT_DEPT_EMBLEMS: PairedEmblem[] = [
  { code: 'DPT-01', title: 'Artisanal Cheese', vectorSrc: '/icons/cheese.svg', stickerSrc: '/assets/identity/stickers/sticker-cheese.svg' },
  { code: 'DPT-02', title: 'Shellfish & Crab', vectorSrc: '/icons/seafood.svg', stickerSrc: '/assets/identity/stickers/sticker-seafood.svg' },
  { code: 'DPT-03', title: 'Morning Pastries', vectorSrc: '/icons/pastries.svg', stickerSrc: '/assets/identity/stickers/sticker-pastries.svg' },
  { code: 'DPT-04', title: 'Sparrow Hot Coffee', vectorSrc: '/icons/hotbeverage.svg', stickerSrc: '/assets/identity/stickers/sticker-hotbeverage.svg' },
  { code: 'DPT-05', title: 'Commuter Grab + Go', vectorSrc: '/icons/grabgo.svg', stickerSrc: '/assets/identity/stickers/sticker-grabgo.svg' },
  { code: 'DPT-06', title: 'Farm Produce', vectorSrc: '/icons/produce.svg', stickerSrc: '/assets/identity/stickers/sticker-produce.svg' },
  { code: 'DPT-07', title: 'Dairy & Pasture Eggs', vectorSrc: '/icons/dairy.svg', stickerSrc: '/assets/identity/stickers/sticker-dairy.svg' },
  { code: 'DPT-08', title: 'House Pantry & Rubs', vectorSrc: '/icons/pantry.svg', stickerSrc: '/assets/identity/stickers/sticker-pantry.svg' },
  { code: 'DPT-09', title: 'Artisanal Bread', vectorSrc: '/icons/bread.svg', stickerSrc: '/assets/identity/stickers/sticker-bread.svg' },
  { code: 'DPT-10', title: 'Cold Brew & Sodas', vectorSrc: '/icons/coldbeverage.svg', stickerSrc: '/assets/identity/stickers/sticker-coldbeverage.svg' },
  { code: 'DPT-11', title: 'Official HMC Swag', vectorSrc: '/icons/swag.svg', stickerSrc: '/assets/identity/stickers/sticker-swag.svg' },
  { code: 'DPT-12', title: 'Ribfest & Pop-Ups', vectorSrc: '/icons/festival.svg', stickerSrc: '/assets/identity/stickers/sticker-festival.svg' },
];

const EXTRA_STICKERS_AND_ENGRAVINGS: SingleEmblem[] = [
  { code: 'STK-TRK', title: 'Catering Delivery Truck Sticker', src: '/assets/identity/stickers/sticker-truck.svg' },
  { code: 'STK-LOB', title: 'Maine Lobster Sticker', src: '/assets/identity/stickers/sticker-seafood-lobster.svg' },
  { code: 'STK-SOP', title: 'Kettle Soup Crock Sticker', src: '/assets/identity/stickers/sticker-soup.svg' },
  { code: 'ENG-01', title: 'Woodcut Engraving — Beef Steer', src: '/assets/selections/engraving-beef-cow.png' },
  { code: 'ENG-02', title: 'Woodcut Engraving — Heritage Pig', src: '/assets/selections/engraving-pork-pig.png' },
  { code: 'ENG-03', title: 'Woodcut Engraving — Pasture Rooster', src: '/assets/selections/engraving-poultry-chicken.png' },
  { code: 'ENG-04', title: 'Woodcut Engraving — Domestic Lamb', src: '/assets/selections/engraving-lamb.png' },
  { code: 'ENG-05', title: 'Woodcut Engraving — Wild Stag', src: '/assets/selections/engraving-exotic-game-deer.png' },
  { code: 'ENG-06', title: 'Woodcut Engraving — Field Hare', src: '/assets/selections/engraving-game-rabbit.png' },
  { code: 'WAX-01', title: 'Wax Seal — Pick Cuts', src: '/assets/process/icon-style-seal-cart.png' },
  { code: 'WAX-02', title: 'Wax Seal — Schedule Pickup', src: '/assets/process/icon-style-seal-calendar.png' },
  { code: 'WAX-03', title: 'Wax Seal — Scale Payment', src: '/assets/process/icon-style-seal-payment.png' },
  { code: 'WAX-04', title: 'Wax Seal — Ready Counter', src: '/assets/process/icon-style-seal-pickup.png' },
  { code: 'AVT-01', title: 'Member Crest — Angus Bull', src: '/assets/avatars/avatar-angus-bull.jpg', avatar: true },
  { code: 'AVT-02', title: 'Member Crest — Berkshire Boar', src: '/assets/avatars/avatar-berkshire-boar.jpg', avatar: true },
  { code: 'AVT-03', title: 'Member Crest — Heritage Rooster', src: '/assets/avatars/avatar-heritage-rooster.jpg', avatar: true },
  { code: 'AVT-04', title: 'Member Crest — Suffolk Ram', src: '/assets/avatars/avatar-suffolk-ram.jpg', avatar: true },
  { code: 'AVT-05', title: 'Member Crest — Bronze Turkey', src: '/assets/avatars/avatar-bronze-turkey.jpg', avatar: true },
  { code: 'AVT-06', title: 'Member Crest — Mallard Drake', src: '/assets/avatars/avatar-mallard-drake.jpg', avatar: true },
  { code: 'AVT-07', title: 'Member Crest — Red Stag', src: '/assets/avatars/avatar-red-stag.jpg', avatar: true },
  { code: 'AVT-08', title: 'Member Crest — Alpine Goat', src: '/assets/avatars/avatar-alpine-goat.jpg', avatar: true },
];

type BackdropMode = 'dark' | 'kraft' | 'depot' | 'light';

export default function GreensAndEmblemsClient() {
  const allSwatches = GREEN_GROUPS.flatMap((g) => g.swatches);
  const [selectedGreen, setSelectedGreen] = useState<GreenSwatch>(allSwatches[5]); // defaults to #16a34a (--green-ready)
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [backdrop, setBackdrop] = useState<BackdropMode>('dark');

  useEffect(() => {
    if (!copiedKey) return;
    const timer = setTimeout(() => setCopiedKey(null), 1800);
    return () => clearTimeout(timer);
  }, [copiedKey]);

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
    } catch {
      setCopiedKey(key);
    }
  };

  const stageClass =
    backdrop === 'kraft'
      ? styles.stageKraft
      : backdrop === 'depot'
        ? styles.stageDepot
        : backdrop === 'light'
          ? styles.stageLight
          : styles.stageDark;

  return (
    <main className={styles.page}>
      <header className={styles.heroHeader}>
        <div className="container">
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>
              Site Greens &amp; <span className={styles.heroTitleAccent}>Emblems</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Complete visual inventory of all 46 green values used across Hofherr Meat Co. (with live
              &ldquo;Ready for pickup.&rdquo; headline preview) alongside every stamp, seal, die-cut
              sticker, department icon, woodcut engraving, and crest on the site.
            </p>
            <nav aria-label="Catalog sections" className={styles.anchorRow}>
              <a href="#site-greens" className={styles.anchorLink}>46 Site Greens</a>
              <a href="#primary-stamps" className={styles.anchorLink}>19 Stamps &amp; Marks</a>
              <a href="#quality-seals" className={styles.anchorLink}>12 Quality Seals</a>
              <a href="#butcher-emblems" className={styles.anchorLink}>14 Butcher Dept Emblems</a>
              <a href="#depot-emblems" className={styles.anchorLink}>12 Winnetka Depot Emblems</a>
              <a href="#engravings-avatars" className={styles.anchorLink}>21 Engravings, Wax Seals &amp; Crests</a>
            </nav>
          </div>
        </div>
      </header>

      {/* ─── SECTION 1: ALL SITE GREENS ─── */}
      <section id="site-greens" aria-labelledby="site-greens-heading" className="section">
        <div className="container">
          <div className={styles.sectionStack}>
            <div className={styles.sectionHeader}>
              <h2 id="site-greens-heading" className={styles.sectionTitle}>
                All 46 Green Colors On The Site
              </h2>
              <p className={styles.sectionDesc}>
                Click any swatch card below to preview how that exact green looks on the pulsing
                &ldquo;READY FOR PICKUP.&rdquo; headline on dark butcher paper, or copy its hex/token.
              </p>
            </div>

            {/* Live Headline Tester */}
            <div
              className={styles.liveTester}
              style={{ '--active-green': selectedGreen.hex } as React.CSSProperties}
            >
              <div className={styles.testerPreviewStage}>
                <span className={styles.testerHeadlineLine}>HAND-CUT.</span>
                <span className={styles.testerHeadlineLine}>WRAPPED IN KRAFT.</span>
                <span className={styles.testerReadyLine}>READY FOR PICKUP.</span>
              </div>

              <div className={styles.testerMetaPanel}>
                <div className={styles.testerMetaTop}>
                  <div className={styles.testerSwatchRow}>
                    <div className={styles.testerLargeChip} />
                    <div className={styles.testerSwatchDetails}>
                      <span className={styles.testerActiveName}>{selectedGreen.name}</span>
                      <span className={styles.testerActiveCode}>
                        {selectedGreen.hex.toUpperCase()} · {selectedGreen.token}
                      </span>
                    </div>
                  </div>
                  <p className={styles.testerUsageNote}>
                    <strong>Used in:</strong> {selectedGreen.files}
                  </p>
                </div>

                <div className={styles.testerActionRow}>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopy(selectedGreen.hex, 'active-hex')}
                  >
                    {copiedKey === 'active-hex' ? '✓ Copied Hex' : `Copy ${selectedGreen.hex.toUpperCase()}`}
                  </button>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopy(selectedGreen.token, 'active-token')}
                  >
                    {copiedKey === 'active-token' ? '✓ Copied Token' : 'Copy Token / Ref'}
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Categorized Green Swatch Grids */}
            <div className={styles.greenGroupList}>
              {GREEN_GROUPS.map((group) => (
                <div key={group.id} className={styles.greenGroup}>
                  <div className={styles.subGroupHeader}>
                    <h3 className={styles.subGroupTitle}>{group.title}</h3>
                    <span className={styles.subGroupCount}>{group.swatches.length} Swatches</span>
                  </div>

                  <div className={styles.swatchGrid}>
                    {group.swatches.map((swatch) => {
                      const isSelected = selectedGreen.id === swatch.id;
                      return (
                        <button
                          key={swatch.id}
                          type="button"
                          onClick={() => {
                            setSelectedGreen(swatch);
                            handleCopy(swatch.hex, swatch.id);
                          }}
                          className={`${styles.swatchCard} ${isSelected ? styles.swatchCardActive : ''}`}
                          style={{ '--swatch': swatch.hex } as React.CSSProperties}
                        >
                          <div className={styles.swatchFillBand}>
                            <span className={styles.swatchHexPill}>
                              {copiedKey === swatch.id ? '✓ COPIED' : swatch.hex.toUpperCase()}
                            </span>
                          </div>
                          <div className={styles.swatchTextSampleBar}>
                            <span className={styles.swatchSampleReady}>READY FOR PICKUP.</span>
                            <span className={styles.swatchSampleTag}>Text sample</span>
                          </div>
                          <div className={styles.swatchBody}>
                            <span className={styles.swatchName}>{swatch.name}</span>
                            <span className={styles.swatchToken}>{swatch.token}</span>
                            <span className={styles.swatchFiles}>{swatch.files}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: PRIMARY BRAND MARKS, STAMPS & PROVENANCE SEALS ─── */}
      <section id="primary-stamps" aria-labelledby="primary-stamps-heading" className="section">
        <div className="container">
          <div className={styles.sectionStack}>
            <div className={styles.toolbarRow}>
              <div className={styles.sectionHeader}>
                <h2 id="primary-stamps-heading" className={styles.sectionTitle}>
                  Brand Marks, Rubber Stamps &amp; Provenance Seals
                </h2>
                <p className={styles.sectionDesc}>
                  Toggle the surface backdrop on the right to inspect every stamp and emblem on Dark
                  Obsidian, Kraft Butcher Paper, Winnetka Depot Green, or Bleached White.
                </p>
              </div>

              <div className={styles.backdropBar} role="group" aria-label="Emblem surface backdrop">
                {(['dark', 'kraft', 'depot', 'light'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setBackdrop(mode)}
                    className={`${styles.backdropBtn} ${backdrop === mode ? styles.backdropBtnActive : ''}`}
                  >
                    {mode === 'dark'
                      ? 'Dark'
                      : mode === 'kraft'
                        ? 'Kraft Paper'
                        : mode === 'depot'
                          ? 'Depot Green'
                          : 'White'}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.emblemGridLarge}>
              {PRIMARY_STAMPS.map((item) => (
                <article key={item.code} className={styles.emblemCard}>
                  <div className={`${styles.emblemStage} ${stageClass}`}>
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      className={item.wide ? styles.emblemImgWide : styles.emblemImg}
                    />
                  </div>
                  <div className={styles.emblemMeta}>
                    <div className={styles.emblemCodeRow}>
                      <span className={styles.emblemBadgeCode}>{item.code}</span>
                    </div>
                    <h3 className={styles.emblemTitle}>{item.title}</h3>
                    <span className={styles.emblemPath}>{item.src}</span>
                  </div>
                </article>
              ))}
            </div>

            {/* Master 10-Emblem Suite Sheet */}
            <article className={styles.masterSheetWrap}>
              <div className={`${styles.masterSheetStage} ${stageClass}`}>
                <img
                  src="/assets/identity/hofherr-master-emblem-suite.svg"
                  alt="Hofherr Master 10-Emblem Suite Sheet"
                  loading="lazy"
                  className={styles.masterSheetImg}
                />
              </div>
              <div className={styles.emblemMeta}>
                <span className={styles.emblemBadgeCode}>SUITE-MASTER</span>
                <h3 className={styles.emblemTitle}>Master 10-Emblem Packaging &amp; Wrapping Suite</h3>
                <span className={styles.emblemPath}>/assets/identity/hofherr-master-emblem-suite.svg</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: 12 PACKAGING QUALITY SEALS ─── */}
      <section id="quality-seals" aria-labelledby="quality-seals-heading" className="section">
        <div className="container">
          <div className={styles.sectionStack}>
            <div className={styles.sectionHeader}>
              <h2 id="quality-seals-heading" className={styles.sectionTitle}>
                12 Butcher Counter &amp; Packaging Quality Seals
              </h2>
              <p className={styles.sectionDesc}>
                Each counter spec emblem shown side-by-side in both its clean vector seal (`/icons/*.svg`)
                and its die-cut parcel sticker (`/assets/identity/stickers/sticker-*.svg`).
              </p>
            </div>

            <div className={styles.emblemGridCompact}>
              {QUALITY_SEALS.map((seal) => (
                <article key={seal.code} className={styles.emblemCard}>
                  <div className={`${styles.emblemStage} ${stageClass}`}>
                    <div className={styles.emblemDualPair}>
                      <div className={styles.emblemPairCol}>
                        <img src={seal.vectorSrc} alt={`${seal.title} vector`} loading="lazy" className={styles.emblemPairImg} />
                        <span className={styles.emblemPairCaption}>Vector</span>
                      </div>
                      <div className={styles.emblemPairCol}>
                        <img src={seal.stickerSrc} alt={`${seal.title} sticker`} loading="lazy" className={styles.emblemPairImg} />
                        <span className={styles.emblemPairCaption}>Sticker</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.emblemMeta}>
                    <span className={styles.emblemBadgeCode}>{seal.code}</span>
                    <h3 className={styles.emblemTitle}>{seal.title}</h3>
                    <span className={styles.emblemPath}>{seal.vectorSrc}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: 14 NORTHFIELD BUTCHER DEPARTMENT EMBLEMS ─── */}
      <section id="butcher-emblems" aria-labelledby="butcher-emblems-heading" className="section">
        <div className="container">
          <div className={styles.sectionStack}>
            <div className={styles.sectionHeader}>
              <h2 id="butcher-emblems-heading" className={styles.sectionTitle}>
                14 Northfield Butcher Department Emblems
              </h2>
              <p className={styles.sectionDesc}>
                Department emblems powering shop navigation, wrapping paper patterns, and Cut Collector
                badges for 300 Happ Rd, Northfield.
              </p>
            </div>

            <div className={styles.emblemGridCompact}>
              {BUTCHER_DEPT_EMBLEMS.map((dept) => (
                <article key={dept.code} className={styles.emblemCard}>
                  <div className={`${styles.emblemStage} ${stageClass}`}>
                    <div className={styles.emblemDualPair}>
                      <div className={styles.emblemPairCol}>
                        <img src={dept.vectorSrc} alt={`${dept.title} vector`} loading="lazy" className={styles.emblemPairImg} />
                        <span className={styles.emblemPairCaption}>Vector</span>
                      </div>
                      <div className={styles.emblemPairCol}>
                        <img src={dept.stickerSrc} alt={`${dept.title} sticker`} loading="lazy" className={styles.emblemPairImg} />
                        <span className={styles.emblemPairCaption}>Sticker</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.emblemMeta}>
                    <span className={styles.emblemBadgeCode}>{dept.code}</span>
                    <h3 className={styles.emblemTitle}>{dept.title}</h3>
                    <span className={styles.emblemPath}>{dept.vectorSrc}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: 12 WINNETKA DEPOT EMBLEMS ─── */}
      <section id="depot-emblems" aria-labelledby="depot-emblems-heading" className="section">
        <div className="container">
          <div className={styles.sectionStack}>
            <div className={styles.sectionHeader}>
              <h2 id="depot-emblems-heading" className={styles.sectionTitle}>
                12 Winnetka Depot Specialty Emblems
              </h2>
              <p className={styles.sectionDesc}>
                Counter, espresso, commuter hot-case, and provisions emblems for 754 Elm St, Winnetka.
              </p>
            </div>

            <div className={styles.emblemGridCompact}>
              {DEPOT_DEPT_EMBLEMS.map((dept) => (
                <article key={dept.code} className={styles.emblemCard}>
                  <div className={`${styles.emblemStage} ${stageClass}`}>
                    <div className={styles.emblemDualPair}>
                      <div className={styles.emblemPairCol}>
                        <img src={dept.vectorSrc} alt={`${dept.title} vector`} loading="lazy" className={styles.emblemPairImg} />
                        <span className={styles.emblemPairCaption}>Vector</span>
                      </div>
                      <div className={styles.emblemPairCol}>
                        <img src={dept.stickerSrc} alt={`${dept.title} sticker`} loading="lazy" className={styles.emblemPairImg} />
                        <span className={styles.emblemPairCaption}>Sticker</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.emblemMeta}>
                    <span className={styles.emblemBadgeCode}>{dept.code}</span>
                    <h3 className={styles.emblemTitle}>{dept.title}</h3>
                    <span className={styles.emblemPath}>{dept.vectorSrc}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: WOODCUT ENGRAVINGS, WAX SEALS & HERITAGE AVATAR CRESTS ─── */}
      <section id="engravings-avatars" aria-labelledby="engravings-avatars-heading" className="section">
        <div className="container">
          <div className={styles.sectionStack}>
            <div className={styles.sectionHeader}>
              <h2 id="engravings-avatars-heading" className={styles.sectionTitle}>
                Woodcut Engravings, Wax Seals &amp; Member Crests
              </h2>
              <p className={styles.sectionDesc}>
                Additional die-cut stickers, vintage animal woodcut engravings, crimson wax-seal process
                medallions, and customer profile heritage crests.
              </p>
            </div>

            <div className={styles.emblemGridCompact}>
              {EXTRA_STICKERS_AND_ENGRAVINGS.map((item) => (
                <article key={item.code} className={styles.emblemCard}>
                  <div className={`${styles.emblemStage} ${stageClass}`}>
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      className={item.avatar ? styles.avatarImg : styles.emblemImg}
                    />
                  </div>
                  <div className={styles.emblemMeta}>
                    <span className={styles.emblemBadgeCode}>{item.code}</span>
                    <h3 className={styles.emblemTitle}>{item.title}</h3>
                    <span className={styles.emblemPath}>{item.src}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
