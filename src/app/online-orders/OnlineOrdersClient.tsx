'use client';

import { useState, useCallback, useTransition, useEffect, useRef, useMemo, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useCartCount } from '@/context/CartContext';
import styles from './page.module.css';
import HelpOrdering from '@/components/online-orders/HelpOrdering';
const TAX_RATE = 0.0225; // 2.25% based on reference image

/* ─── Payment Brand Badges ───────────────────────────────────────────── */
const badge = (bg: string, color: string, border?: string) => ({
    display: 'inline-flex' as const, alignItems: 'center' as const, gap: 4,
    background: bg, color, border: border ?? 'none',
    borderRadius: 0, padding: '5px 10px', fontSize: 11, fontWeight: 700,
    whiteSpace: 'nowrap' as const, lineHeight: 1.3,
});

const VisaLogo = () => (
    <span style={{ ...badge('#1a1f71', '#fff'), fontStyle: 'italic', fontFamily: 'Arial Black, sans-serif', letterSpacing: 1, fontSize: 11 }}>VISA</span>
);
const ApplePayLogo = () => (
    <span style={badge('#000', '#fff')}>
        <svg width="11" height="13" viewBox="0 0 14 17" fill="white"><path d="M13.4 12.8c-.4.9-.6 1.3-1.1 2.1-.7 1.1-1.7 2.5-3 2.5-1.1 0-1.4-.7-2.9-.7s-1.9.7-3 .7c-1.2 0-2.2-1.3-2.9-2.4C-1 11.6-.4 6.4 2.3 3.7c1.8-1.8 3.9-1.6 4.7-1.6 1.5 0 2.7.7 3.6.7.8 0 2.1-.7 3.8-.7.9 0 3.1.2 4.6 2.3-.1.1-2.7 1.6-2.7 4.7 0 3.6 3.2 4.9 3.1 4.7zM9.6 1.5C10.3.6 10.8-.3 10.7-1c-1 .1-2.1.7-2.8 1.6-.6.8-1.1 1.8-1 2.7 1 .1 2-.5 2.7-1.5" /></svg>
        Pay
    </span>
);
const GooglePayLogo = () => (
    <span style={badge('#fff', '#3c4043', '1px solid #e0e0e0')}>
        <svg width="14" height="14" viewBox="0 0 48 48"><path fill="#4285F4" d="M45.12 24.5c0-1.57-.14-3.08-.4-4.53H24v8.57h11.87c-.52 2.75-2.07 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.53-9.47 6.53-16.2z" /><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" /><path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" /><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" /></svg>
        Pay
    </span>
);
const PayPalLogo = () => (
    <span style={badge('#003087', '#fff')}>
        <svg width="10" height="12" viewBox="0 0 24 28" fill="#009cde"><path d="M20.5 4C19.2 2.4 17 1.5 14 1.5H5.6C4.9 1.5 4.3 2 4.2 2.7L.8 23c-.1.5.3 1 .8 1h5.3l1.3-8.3c.1-.7.7-1.2 1.4-1.2h2.9c5.8 0 10.3-2.4 11.6-9.2.4-2.7-.1-4.5-1.6-5.3z" fill="#fff" /></svg>
        PayPal
    </span>
);

/* ─── Types ─────────────────────────────────────────────────────────── */
type Item = {
    name: string;
    desc?: string;
    price: string;
    salePrice?: string;
    image?: string;
    inStock?: boolean;
    stockStatus?: string;
    stockQuantity?: number;
    origin?: string;
    grade?: string;
    preparation?: string[];
    allergens?: string[];
    servingSize?: string;
    cookingTip?: string;
    isNew?: boolean;
    isFeatured?: boolean;
};
type Category = { id: string; label: string; sub: string; emoji: string; icon?: string; items: Item[] };
type CartItem = Item & { qty: number; note: string };

/* ─── Product Data ───────────────────────────────────────────────────── */
// Main butcher shop categories
const MAIN_CATEGORIES: Category[] = [
    {
        id: 'beef', label: 'Beef', sub: 'Carefully Sourced from Midwest Farms', emoji: '🥩', icon: '/icons/cow.png',
        items: [
            { name: 'New York Strip', desc: 'Prime, dry-aged, cut to order. Standard cut is 1.25".', price: '$42.99/lb' },
            { name: 'Boneless Ribeye', desc: 'Standard 1.25" cut, approx. 1 lb.', price: '$40.99/lb' },
            { name: 'Bone-In Ribeye', desc: 'Prime, dry-aged. Tomahawk cut available frozen.', price: '$38.99/lb' },
            { name: 'Filet Mignon', desc: 'Standard Prime Filet is 8oz.', price: '$46.99/lb' },
            { name: 'T-Bone', desc: 'Prime, dry-aged, 1.25" cut.', price: '$36.99/lb' },
            { name: 'Porterhouse', desc: 'Standard 1.25" cut, approx. 2 lbs.', price: '$40.99/lb' },
            { name: 'Prime Rib', desc: 'Sold by the bone or rib. One rib feeds two people.', price: '$38.99/lb' },
            { name: 'Prime Beef Tenderloin', desc: 'Trimmed and tied, 3.5–5 lbs.', price: '$44.99/lb' },
            { name: 'Choice Tenderloin', price: '$34.99/lb', inStock: false },
            { name: 'Flat Iron Steak', desc: 'Second most tender cut, approx. 1 lb.', price: '$20.99/lb' },
            { name: 'Hanger Steak', desc: 'Packs between 1 and 2 lbs.', price: '$19.99/lb' },
            { name: 'Marinated Hanger Steak', price: '$21.99/lb' },
            { name: 'Skirt Steak', desc: 'All outer skirt, 1–1.5 lb packages.', price: '$28.99/lb' },
            { name: 'Center Cut Skirt Steak', desc: 'All outer skirt, 1–1.5 lb packages.', price: '$29.99/lb', inStock: false },
            { name: 'Marinated Skirt Steak', desc: 'Sesame Teriyaki marinade, approx. 1.5 lb.', price: '$30.99/lb' },
            { name: 'Marinated Center Cut Skirt Steak', price: '$31.99/lb', inStock: false },
            { name: 'Marinated Flank Steak', desc: 'Approx. 1.25–2 lbs.', price: '$22.99/lb' },
            { name: 'Flank Steak', desc: 'Approx. 1.25–2 lbs.', price: '$20.99/lb', inStock: false },
            { name: 'Kalbi', desc: 'Marinated, 1 lb ≈ 3–4 strips.', price: '$16.99/lb' },
            { name: 'Marinated Tri Tip', price: '$22.99/lb' },
            { name: 'Tri-Tip', desc: 'Also known as top sirloin roast, 1.5–2 lbs.', price: '$21.99/lb', inStock: false },
            { name: 'Picanha', desc: 'Approx. 2–3 lbs, great on the grill.', price: '$16.99/lb', inStock: false },
            { name: 'Sirloin Flap', desc: 'Each steak is about 3 lbs. Great for steak frites.', price: '$19.99/lb', inStock: false },
            { name: 'Sirloin Steak', desc: 'Standard 1.5" cut.', price: '$14.99/lb', inStock: false },
            { name: 'Kansas City Strip', desc: 'Bone-In NY Strip, 1.25" cut, sold frozen.', price: '$40.99/lb', inStock: false },
            { name: 'Butt Steak', price: '$15.99/lb', inStock: false },
            { name: 'Steak Kabob', desc: 'Pre-marinated and grill-ready.', price: '$19.99/lb', inStock: false },
            { name: 'Prime Strip Steak Kabob', price: '$24.99/lb', inStock: false },
            { name: 'Steak Fajita Mix', desc: 'Bell peppers, onions, and sauce. Ready to cook.', price: '$15.99/lb', inStock: false },
            { name: 'Steak Stir Fry Mix', desc: 'Frozen, 1.5 lbs beef + peppers + onions.', price: '$15.99/lb', inStock: false },
            { name: 'Bone In Short Ribs', desc: 'Specify braising or plate cut.', price: '$14.99/lb' },
            { name: 'Boneless Short Ribs', price: '$16.99/lb' },
            { name: 'Beef Back Ribs', desc: '7-rib slab, sold frozen.', price: '$9.99/lb', inStock: false },
            { name: 'Beef Stew Meat', desc: 'Chuck cubed for stew.', price: '$13.99/lb' },
            { name: 'Beef Shank', desc: 'Between 1.5–2 lbs each.', price: '$10.99/lb', inStock: false },
            { name: 'Beef Cheek', desc: 'Frozen 2 lb packages. Great in pasta sauce.', price: '$14.99/lb', inStock: false },
            { name: 'Whole Brisket', desc: 'For the smoker, 10–16 lbs.', price: '$10.99/lb' },
            { name: 'Brisket Deckle', desc: 'Great for smoking and burnt ends, approx. 5 lbs.', price: '$10.99/lb' },
            { name: 'First Cut Brisket', desc: 'Ideal for oven/slow cooker, 5–7 lbs.', price: '$13.99/lb' },
            { name: 'Fresh Corned Beef', desc: 'Made in house.', price: '$12.99/lb', inStock: false },
            { name: 'Pot Roast', desc: 'Approx. 2.5–3 lbs.', price: '$12.99/lb', inStock: false },
            { name: 'Rump Roast', desc: 'Approx. 5 lbs.', price: '$8.99/lb', inStock: false },
            { name: 'Eye Of Round', desc: 'Approx. 3–4 lbs.', price: '$14.99/lb', inStock: false },
            { name: 'Top Sirloin Roast', desc: 'Trimmed and tied, approx. 5–7 lbs.', price: '$13.99/lb', inStock: false },
            { name: 'Sirloin Tip Roast', price: '$14.99/lb', inStock: false },
            { name: 'Wagyu Tomahawk Ribeye', desc: 'Approx. 2.5 lbs, sold frozen.', price: '$45.99/lb', inStock: false },
            { name: 'Prime Tomahawk Ribeye', price: '$39.99/lb', inStock: false },
            { name: 'A5 Miyazaki Wagyu New York Strip', desc: 'Ultra-premium Japanese wagyu.', price: '$180.00/lb', inStock: false },
            { name: 'Kilgus Flat Iron', desc: 'Local farm-sourced.', price: '$34.99', inStock: false },
            { name: 'Kilgus Tri Tip', price: '$29.99/lb', inStock: false },
            { name: 'Kilgus Sirloin Steak', price: '$21.99/lb', inStock: false },
            { name: 'Beef Knuckle Bones', desc: 'Great for soup or stock.', price: '$5.99/lb' },
            { name: 'Marrow Bones', desc: 'Large chunks, great for dogs too.', price: '$5.99/lb', inStock: false },
            { name: 'Ox Tails', desc: 'Packaged with 5–8 pieces.', price: '$14.99/lb', inStock: false },
            { name: 'Calves Liver', desc: 'Frozen 1 lb packages.', price: '$19.99/lb', inStock: false },
            { name: 'Honeycomb Tripe', price: '$8.99/lb', inStock: false },
            { name: 'Ground Sirloin', desc: 'Blend of short rib, brisket, and prime trimmings.', price: '$10.99/lb' },
            { name: 'Ground Chuck', desc: 'Available by the pound.', price: '$9.99/lb' },
            { name: 'Sirloin Burger', desc: '1/3 lb burgers, house sirloin blend.', price: '$11.99/lb' },
            { name: 'Hatch Chile Cheeseburger', desc: '1/3 lb with cheddar and Hatch chiles, frozen.', price: '$15.99/lb' },
            { name: 'Burger Box', desc: '12 frozen 1/3 lb sirloin burgers.', price: '$11.99/lb', inStock: false },
            { name: 'Pizza Burger Sliders', price: '$12.99/lb' },
            { name: 'Meatloaf Mix', desc: 'Frozen 1 lb packs — equal beef, pork, veal.', price: '$10.99/lb', inStock: false },
            { name: 'Maple Jalapeño Jerky', desc: 'Made in house, sold in packs of 2.', price: '$25.99/lb', inStock: false },
            { name: 'Northfield Slimjim', desc: 'Great snack, made in house.', price: '$14.99/lb', inStock: false },
            { name: 'Northfield Slim Jim Bites', desc: 'Sold in ½ lb packages.', price: '$14.99/lb', inStock: false },
            { name: 'Beef Stock', desc: 'Housemade.', price: '$10.99' },
        ]
    },
    {
        id: 'pork', label: 'Pork', sub: 'Local Berkshire Breeds', emoji: '🐷', icon: '/icons/pig.png',
        items: [
            { name: 'Bacon', desc: 'Smoked in house. Specify thickness.', price: '$14.99/lb' },
            { name: 'Pork Chops', desc: 'Standard 1.25" cut.', price: '$13.99/lb' },
            { name: 'Boneless Pork Chops', price: '$14.99/lb' },
            { name: 'Smoked Pork Chops', price: '$16.99/lb', inStock: false },
            { name: 'Marinated Pork Chops', price: '$13.99/lb', inStock: false },
            { name: 'Baby Back Ribs', desc: 'Approx. 2.5 lb rack.', price: '$11.99/lb' },
            { name: 'St. Louis Ribs', price: '$10.99/lb', inStock: false },
            { name: 'Spare Ribs', price: '$8.99/lb', inStock: false },
            { name: 'Rib Tips', price: '$8.99/lb', inStock: false },
            { name: 'Country Style Ribs', price: '$6.99/lb' },
            { name: 'Boneless Country Style Ribs', price: '$4.99/lb' },
            { name: 'Bone-In Pork Shoulder', desc: 'Whole or cubed.', price: '$7.99/lb' },
            { name: 'Boneless Pork Shoulder', price: '$8.99/lb' },
            { name: 'Bone-In Pork Roast', price: '$12.99/lb' },
            { name: 'Boneless Pork Roast', price: '$12.99/lb' },
            { name: 'Crown Roast of Pork', price: '$250.00', inStock: false },
            { name: 'Porchetta', price: '$28.99/lb', inStock: false },
            { name: 'Pork Tenderloin', price: '$14.99/lb', inStock: false },
            { name: 'Pork Belly', price: '$10.99/lb', inStock: false },
            { name: 'Skin-On Pork Belly', price: '$10.99/lb', inStock: false },
            { name: 'Pancetta', price: '$20.99/lb', inStock: false },
            { name: 'Fresh Ham', price: '$9.99/lb', inStock: false },
            { name: 'Smoked Ham Hock', price: '$9.99/lb', inStock: false },
            { name: 'Smoked Pork Jowl', price: '$12.99/lb', inStock: false },
            { name: 'Smoked Pig Ears', price: '$4.00', inStock: false },
            { name: 'Pork Neck Bones', price: '$3.99/lb', inStock: false },
            { name: 'Pork Shanks', price: '$7.99/lb', inStock: false },
            { name: 'Trotter', price: '$4.99/lb', inStock: false },
            { name: 'Ground Pork', desc: 'Frozen 1 lb packages.', price: '$8.99/lb' },
            { name: 'Salt Pork', price: '$6.99/lb', inStock: false },
            { name: 'Pure Lard', price: '$3.99/lb', inStock: false },
            { name: 'Pork Skin', price: '$1.99/lb' },
        ]
    },
    {
        id: 'chicken', label: 'Chicken', sub: 'Pasture Raised, Hand-Trimmed', emoji: '🐓', icon: '/icons/chicken.png',
        items: [
            { name: 'Boneless Skinless Chicken Breast', desc: 'Hand-trimmed.', price: '$9.99/lb' },
            { name: 'Boneless Skin-On Breasts', price: '$12.99/lb', inStock: false },
            { name: 'Bone-In Chicken Breast', price: '$8.99/lb' },
            { name: 'Bone-In Chicken Thighs', price: '$6.99/lb', inStock: false },
            { name: 'Boneless Skinless Chicken Thighs', price: '$8.99/lb', inStock: false },
            { name: 'Split Chicken', desc: 'Half bird, bone-in.', price: '$5.99/lb' },
            { name: 'Whole Fryer', price: '$4.99/lb', inStock: false },
            { name: 'Whole Roaster', price: '$4.99/lb', inStock: false },
            { name: 'Chicken Legs', price: '$5.99/lb', inStock: false },
            { name: 'Chicken Drumsticks', price: '$6.99/lb' },
            { name: 'Chicken Wings', desc: 'Frozen packages of a dozen.', price: '$5.99/lb' },
            { name: 'Split Chicken Wings', price: '$6.99/lb' },
            { name: 'Chicken Kabob', price: '$18.99/lb', inStock: false },
            { name: 'Chicken Fajita Mix', price: '$14.99/lb', inStock: false },
            { name: 'Chicken Stir Fry Mix', price: '$9.99/lb', inStock: false },
            { name: 'Chicken Livers', price: '$6.99/lb' },
            { name: 'Chicken Feet', price: '$4.99/lb' },
            { name: 'Chicken Backs', price: '$3.99/lb', inStock: false },
            { name: 'Smoked Chicken Breast', price: '$16.99/lb', inStock: false },
            { name: 'Ground Chicken', price: '$8.99/lb', inStock: false },
            { name: 'Schmaltz', desc: 'Rendered chicken fat.', price: '$12.99' },
            { name: 'Chicken Stock', price: '$10.99', inStock: false },
        ]
    },
    {
        id: 'sausage', label: 'Sausage', sub: 'All Housemade', emoji: '🌭', icon: '/icons/suage.png',
        items: [
            { name: 'Fresh Breakfast Sausage', desc: 'Frozen 4-pack.', price: '$10.99/lb' },
            { name: 'Maple Sage Breakfast', price: '$12.99/lb' },
            { name: 'Smoked Breakfast Sausage', price: '$12.99/lb', inStock: false },
            { name: 'Andouille Sausage', desc: 'Smoked in house.', price: '$11.99/lb' },
            { name: 'Chicago Hot Links', desc: 'Smoked in house.', price: '$10.99/lb' },
            { name: 'Hot Dog', desc: 'Skinless, all-beef.', price: '$9.99/lb', inStock: false },
            { name: 'Natural Casing Hot Dog', price: '$12.99/lb', inStock: false },
            { name: 'Blue Cheese Steakhouse Sausage', desc: 'Black pepper and blue cheese beef sausage.', price: '$11.99/lb' },
            { name: 'Smoked Jalapeño Cheddar Brat', price: '$13.99/lb' },
            { name: 'Smoked Cherry Cheddar Brats', desc: 'Smoked in house.', price: '$13.99/lb' },
            { name: 'Sheboygan Bratwurst', price: '$10.99/lb', inStock: false },
            { name: 'Smokefield Bratwurst', price: '$11.99/lb', inStock: false },
            { name: 'White Bratwurst', price: '$11.99/lb', inStock: false },
            { name: 'Turkey Bratwurst', price: '$8.99/lb', inStock: false },
            { name: 'Merquez Sausage', desc: 'Moroccan lamb sausage.', price: '$12.99/lb' },
            { name: 'Hot Italian Sausage', price: '$10.99/lb', inStock: false },
            { name: 'Sweet Italian Sausage', price: '$10.99/lb', inStock: false },
            { name: 'Hot Hungarian Sausage', price: '$9.99/lb', inStock: false },
            { name: 'Toulouse', price: '$12.99/lb', inStock: false },
            { name: 'Bangers', price: '$11.99/lb', inStock: false },
            { name: 'Loukonikos', desc: 'Greek-style sausage.', price: '$14.99/lb', inStock: false },
            { name: 'Boerwors', desc: 'South African sausage.', price: '$7.99/lb' },
            { name: 'Colombian Chorizo', price: '$11.99/lb' },
            { name: 'Chorizo Verde', price: '$8.99/lb', inStock: false },
            { name: 'Dried Spanish Chorizo', desc: '½ lb packages.', price: '$19.99/lb' },
            { name: 'Fresh Polish Sausage', price: '$10.99/lb', inStock: false },
            { name: 'Polish Kielbasa', price: '$12.99/lb', inStock: false },
            { name: 'Dried Polish Sausage', price: '$19.99/lb', inStock: false },
            { name: 'Cajun Boudin', price: '$12.99/lb', inStock: false },
            { name: 'Thuringer Sausage', price: '$9.99/lb', inStock: false },
            { name: 'Lanjager', price: '$30.99/lb' },
            { name: 'Peking Duck Sausage', price: '$14.99/lb', inStock: false },
            { name: 'Al Pastor Sausage', price: '$13.99/lb', inStock: false },
            { name: 'Philly Cheesesteak Sausage', price: '$12.99/lb', inStock: false },
            { name: 'Swedish Potato Sausage', price: '$11.99/lb', inStock: false },
            { name: 'Reuben Sausage', price: '$14.99/lb', inStock: false },
            { name: 'Best In Show', price: '$12.99/lb', inStock: false },
            { name: 'Red White And Blue Sausages', price: '$12.99/lb', inStock: false },
        ]
    },
    {
        id: 'deli', label: 'Deli Meat & Cheese', sub: 'Cut to Order', emoji: '🧀', icon: '/icons/hamcheese.png',
        items: [
            { name: 'Bacon', desc: 'Smoked in house. Specify thickness.', price: '$14.99/lb' },
            { name: 'Genoa Salami', price: '$16.99/lb' },
            { name: 'Hard Salami', price: '$14.99/lb', inStock: false },
            { name: 'Hot Sopressata', desc: 'Italian dry-cured salami with heat.', price: '$28.99/lb' },
            { name: 'Dodge City Salami', price: '$29.99/lb' },
            { name: 'Pepperoni', price: '$19.99/lb', inStock: false },
            { name: 'Braseola', desc: 'Italian air-dried beef.', price: '$30.99/lb' },
            { name: 'Prosciutto', price: '$28.99/lb', inStock: false },
            { name: 'Lonza', price: '$18.99/lb', inStock: false },
            { name: 'Serrano Ham', price: '$32.99/lb', inStock: false },
            { name: 'Hot Pastrami', price: '$18.99/lb' },
            { name: 'Corned Beef', price: '$17.99/lb', inStock: false },
            { name: 'Roast Beef', price: '$18.99/lb', inStock: false },
            { name: 'Tasso Ham', desc: 'Cajun-style smoked cured pork.', price: '$16.99/lb' },
            { name: 'Tavern Ham', price: '$18.99/lb', inStock: false },
            { name: 'Irish Bacon', price: '$13.99/lb', inStock: false },
            { name: 'Canadian Bacon', price: '$16.99/lb' },
            { name: 'Pancetta', price: '$20.99/lb', inStock: false },
            { name: 'Spiral Glazed Ham', price: '$11.99/lb', inStock: false },
            { name: 'Taylor Pork Roll', price: '$18.99/lb', inStock: false },
            { name: 'Smoked Turkey', price: '$17.99/lb', inStock: false },
            { name: 'Roasted Turkey', price: '$16.99/lb', inStock: false },
            { name: 'Liver Sausage', price: '$10.99/lb' },
            { name: 'Mortadella', price: '$14.99/lb', inStock: false },
            { name: 'American Cheese', price: '$11.99/lb' },
            { name: 'Cooper\'s Sharp White American Cheese', price: '$19.99/lb', inStock: false },
            { name: 'Organic Cheddar', price: '$16.99/lb' },
            { name: 'White Cheddar', price: '$16.99/lb' },
            { name: 'Organic Pepperjack Cheese', price: '$16.99/lb', inStock: false },
            { name: 'Organic Muenster', price: '$16.99/lb', inStock: false },
            { name: 'Dill Havarti Cheese', price: '$16.99/lb' },
            { name: 'Provolone Cheese', price: '$16.99/lb', inStock: false },
            { name: 'Deli Kraut', price: '$6.99/lb' },
            { name: 'Deli Pickle', price: '$4.99/lb', inStock: false },
            { name: 'Marinated Portobello', price: '$14.99/lb', inStock: false },
            { name: 'Chicken Salad', price: '$12.99/lb', inStock: false },
        ]
    },
    {
        id: 'prepared', label: 'Prepared Foods', sub: 'Prepared In-House', emoji: '🍲', icon: '/icons/prepared.png',
        items: [
            { name: 'Beef Wellington', desc: 'Serves 4–6. Order in advance.', price: '$250.00' },
            { name: 'Duck Confit', desc: 'Housemade, ready to finish.', price: '$26.99/lb' },
            { name: 'Rotisserie Chicken', price: '$22.99', inStock: false },
            { name: 'BBQ Pulled Pork', desc: 'Frozen in quarts, sauced.', price: '$22.99/lb', inStock: false },
            { name: 'Pulled Pork', price: '$14.99' },
            { name: 'Smoked Brisket (Prepared)', desc: 'Ready to heat.', price: '$28.99/lb', inStock: false },
            { name: 'Rib Tips with Mild Sauce', price: '$14.99', inStock: false },
            { name: 'HMCo. BBQ Ribs', price: '$29.99', inStock: false },
            { name: 'Memphis-Style BBQ Spare Ribs', price: '$15.99', inStock: false },
            { name: 'North Shore BBQ Baby Ribs', price: '$15.99', inStock: false },
            { name: 'Collard Greens', desc: 'Ready to heat.', price: '$16.99' },
            { name: 'Small Collard Greens', price: '$8.99', inStock: false },
            { name: 'Taylor Street Ragu', desc: 'Housemade meat sauce.', price: '$12.99' },
            { name: 'Sunday Gravy', price: '$19.99', inStock: false },
            { name: 'Nduja Marinara', price: '$14.99', inStock: false },
            { name: 'Spaghetti Meat Sauce', price: '$16.99', inStock: false },
            { name: 'Bolognese Sauce', price: '$15.99', inStock: false },
            { name: 'Italian Meatballs', price: '$11.99/lb', inStock: false },
            { name: 'Chicago Style Meatballs', price: '$18.99', inStock: false },
            { name: 'Small Queso Fundito', desc: 'Ready to heat.', price: '$10.99' },
            { name: 'Queso Fundito (Large)', price: '$16.99' },
            { name: 'Beef Stroganoff', desc: 'Frozen quarts, serves 2–3.', price: '$14.99', inStock: false },
            { name: 'Beef Bourguignon', price: '$15.99', inStock: false },
            { name: 'Shepherd\'s Pie', price: '$18.99', inStock: false },
            { name: 'Vesuvio', desc: 'Chicago classic chicken and potatoes.', price: '$24.99', inStock: false },
            { name: 'Sausage n Peppers', price: '$15.99', inStock: false },
            { name: 'Large Chicken Pot Pie', desc: 'Frozen, serves 3–4.', price: '$18.99', inStock: false },
            { name: 'Small Chicken Pot Pie', price: '$12.99', inStock: false },
            { name: 'Large Turkey Pot Pie', price: '$18.99', inStock: false },
            { name: 'Small Turkey Pot Pie', price: '$9.99' },
            { name: 'HMC Turkey Tetrazzini (Small)', price: '$12.99' },
            { name: 'HMC Smoked Turkey Tetrazzini', price: '$18.99', inStock: false },
            { name: 'HMC Smoked Turkey', desc: 'Whole smoked turkey.', price: '$175.00', inStock: false },
            { name: 'HMC Smoked Turkey Breast', price: '$125.00', inStock: false },
            { name: 'Andouille Cornbread Stuffing', price: '$12.99/lb', inStock: false },
            { name: 'Wild Rice And Pecan Stuffing', price: '$12.99/lb', inStock: false },
            { name: 'Large Baked Beans', price: '$12.99', inStock: false },
            { name: 'Small Baked Beans', price: '$9.99', inStock: false },
            { name: 'Large Pimento Mac n Cheese', price: '$14.99', inStock: false },
            { name: 'Small Pimento Mac n Cheese', price: '$8.99', inStock: false },
            { name: 'Twice Baked Potatoes', price: '$4.99', inStock: false },
            { name: 'Potato Salad', price: '$9.99/lb', inStock: false },
            { name: 'Coleslaw', price: '$7.99/lb', inStock: false },
            { name: 'Creamed Spinach', price: '$14.99/lb', inStock: false },
            { name: 'Spinach Artichoke Dip', price: '$16.99', inStock: false },
            { name: 'Buffalo Blue Cheese Chicken Dip', price: '$16.99', inStock: false },
            { name: 'Bacon-Wrapped Chorizo Stuffed Dates', desc: '1 dozen.', price: '$24.99', inStock: false },
            { name: 'Shrimp De Jonghe', price: '$23.99', inStock: false },
            { name: 'Deviled Egg', price: '$2.00', inStock: false },
            { name: 'Bubbe\'s Brisket', price: '$24.99', inStock: false },
            { name: 'Smoked Duck Breast', price: '$35.99/lb', inStock: false },
            { name: 'Pork Rillettes', price: '$19.99/lb', inStock: false },
            { name: 'Salmon Spread', price: '$18.99/lb', inStock: false },
            { name: 'Thick Cut Beef Jerky', price: '$25.99/lb' },
            { name: 'Teriyaki Beef Jerky', price: '$25.99/lb', inStock: false },
            { name: 'Gazpacho', desc: 'Housemade chilled soup.', price: '$10.99' },
            { name: 'Pretty Cool Ice Cream', desc: 'Local Chicago ice cream.', price: '$7.00' },
        ]
    },
    {
        id: 'lamb', label: 'Lamb', sub: 'Pasture Raised, All Natural', emoji: '🐑', icon: '/icons/lamb.png',
        items: [
            { name: 'Rack of Lamb', desc: 'French-trimmed.', price: '$39.99/lb', inStock: false },
            { name: 'Domestic Rack of Lamb', desc: 'USDA Choice, French trimmed.', price: '$49.99/lb', inStock: false },
            { name: 'Lamb Chops', desc: 'Loin or rib chops.', price: '$32.99/lb' },
            { name: 'Lamb Ribs', price: '$14.99/lb', inStock: false },
            { name: 'Lamb Shank', desc: 'Perfect for slow braising.', price: '$18.99/lb' },
            { name: 'Butterflied Leg of Lamb', price: '$26.99/lb', inStock: false },
            { name: 'Boneless Leg of Lamb', price: '$24.99/lb', inStock: false },
            { name: 'Bone-In Leg Of Lamb', price: '$20.99/lb', inStock: false },
            { name: 'Lamb Shoulder Roast', price: '$15.99/lb', inStock: false },
            { name: 'Boneless Lamb Shoulder', price: '$17.99/lb' },
            { name: 'Lamb Stew Meat', price: '$21.99/lb', inStock: false },
            { name: 'Ground Lamb', price: '$11.99/lb', inStock: false },
        ]
    },
    {
        id: 'seafood', label: 'Seafood', sub: 'Fresh & Frozen', emoji: '🦞', icon: '/icons/fish.png',
        items: [
            { name: 'Nova Scotia Lobster Tails', desc: '7oz tails.', price: '$42.99/lb' },
            { name: 'Small Seafood Platter', desc: 'Assorted fresh and prepared seafood. Great for entertaining.', price: '$75.00', inStock: false },
            { name: 'Soft Shell Crabs', desc: 'Fresh, seasonal.', price: '$11.99', inStock: false },
            { name: '2 Soft Shell Crabs', desc: 'Fresh, seasonal.', price: '$12.00' },
            { name: 'Kushi Oyster', desc: 'Single oyster, Pacific Northwest.', price: '$3.00', inStock: false },
            { name: 'Smoked Salmon', desc: 'Atlantic Salmon Filets, frozen 6oz.', price: '$25.99/lb', inStock: false },
            { name: 'Salmon', desc: 'Atlantic Salmon Filets, frozen 6oz.', price: '$22.99/lb', inStock: false },
        ]
    },
    {
        id: 'veal', label: 'Veal', sub: 'Carefully Sourced from Midwest Farms', emoji: '🫀', icon: '/icons/veal.png',
        items: [
            { name: 'Veal Chop', desc: 'Veal Loin Chops — Cut to Order. Standard cut is 1.25".', price: '$32.99/lb', inStock: false },
            { name: 'Veal Shank', desc: 'Frozen, approx. ¾ lb each.', price: '$33.99/lb' },
            { name: 'Veal Scallopini', desc: 'Cut to order, by the pound or person.', price: '$39.99/lb', inStock: false },
            { name: 'Veal Stew Meat', desc: '1.5–2" cubes of veal shoulder, sold by the pound.', price: '$21.99/lb', inStock: false },
            { name: 'Veal Rib Chop', desc: 'Long bone with a meaty chop. Sold frozen individually.', price: '$39.99/lb', inStock: false },
            { name: 'Veal Stock', price: '$10.99' },
            { name: 'Veal Bones', desc: 'For sauces and stocks, frozen.', price: '$7.99/lb', inStock: false },
        ]
    },
    {
        id: 'turkey', label: 'Turkey', sub: 'Ferndale Market All-Natural', emoji: '🦃', icon: '/icons/turkey.png',
        items: [
            { name: 'Ferndale Turkey', desc: 'Whole bird, all-natural.', price: '$6.59/lb', inStock: false },
            { name: 'Fresh Ferndale Split Turkey', price: '$7.29/lb', inStock: false },
            { name: 'Ferndale Boneless Turkey Breast', price: '$12.99/lb', inStock: false },
            { name: 'Ferndale Bone-In Turkey Breast', price: '$10.99/lb' },
            { name: 'Marinated Boneless Turkey Breast', price: '$14.99/lb', inStock: false },
            { name: 'Turkey Wings', price: '$5.99/lb', inStock: false },
            { name: 'Turkey Legs', price: '$5.99/lb', inStock: false },
            { name: 'Turkey Thighs', price: '$5.99/lb', inStock: false },
            { name: 'Smoked Turkey Thighs', price: '$9.99/lb', inStock: false },
            { name: 'Smoked Turkey Legs', price: '$9.99/lb', inStock: false },
            { name: 'Smoked Turkey Wings', price: '$9.99/lb', inStock: false },
            { name: 'Ground Turkey', desc: 'Fresh ground, 1 lb packages.', price: '$9.99/lb' },
            { name: 'All White Ground Turkey', price: '$14.99/lb', inStock: false },
            { name: 'Turkey Giblets', price: '$4.99' },
            { name: 'Turkey Gravy', price: '$14.99' },
            { name: 'Turkey Stock', price: '$10.99', inStock: false },
        ]
    },
    {
        id: 'duck', label: 'Duck', sub: 'Premium Sourced', emoji: '🦆', icon: '/icons/duck.png',
        items: [
            { name: 'Duck Legs', desc: 'Great for braising or confit.', price: '$14.99/lb' },
            { name: 'Whole Duck', price: '$29.99' },
            { name: 'Duck Confit', desc: 'Housemade, ready to finish.', price: '$26.99/lb' },
            { name: 'Duck Rillettes', price: '$29.99/lb' },
            { name: 'Duck Breast', desc: 'Rich and flavorful.', price: '$18.99/lb', inStock: false },
            { name: 'Smoked Duck Breast', desc: 'Housemade smoked.', price: '$35.99/lb', inStock: false },
            { name: 'Duck Stock', price: '$10.99' },
            { name: 'Duck Fat', desc: 'Perfect for roasting potatoes.', price: '$10.99', inStock: false },
        ]
    },
    {
        id: 'game', label: 'Game', sub: 'Wild & Exotic Proteins', emoji: '🦬', icon: '/icons/game.png',
        items: [
            { name: 'Bison Ribeye', price: '$45.99/lb' },
            { name: 'Bison Tenderloin', price: '$49.99/lb' },
            { name: 'Ground Bison', desc: 'Sold frozen in 1 pound packages.', price: '$16.99/lb' },
            { name: 'Whole Rabbit', price: '$24.99' },
            { name: 'Cornish Game Hen', desc: 'Sold frozen and individually sealed. 1.5–2 lbs each.', price: '$6.99/lb' },
            { name: 'Wild Boar', desc: 'Special order — call for pricing & availability.', price: 'Call', inStock: false },
            { name: 'Elk', desc: 'Special order — call for pricing & availability.', price: 'Call', inStock: false },
            { name: 'Venison', desc: 'Special order — call for pricing & availability.', price: 'Call', inStock: false },
            { name: 'Goat', desc: 'Special order — call for pricing & availability.', price: 'Call', inStock: false },
            { name: 'Alligator', desc: 'Special order — call for pricing & availability.', price: 'Call', inStock: false },
            { name: 'Kangaroo', desc: 'Special order — call for pricing & availability.', price: 'Call', inStock: false },
            { name: 'Ostrich', desc: 'Special order — call for pricing & availability.', price: 'Call', inStock: false },
            { name: 'Quail', desc: 'Special order — call for pricing & availability.', price: 'Call', inStock: false },
            { name: 'Pheasant', desc: 'Special order — call for pricing & availability.', price: 'Call', inStock: false },
            { name: 'Partridge', desc: 'Special order — call for pricing & availability.', price: 'Call', inStock: false },
            { name: 'Goose', desc: 'Special order — call for pricing & availability.', price: 'Call', inStock: false },
        ]
    },
    {
        id: 'soups', label: 'Soups & Stocks', sub: 'Housemade, Frozen in Quarts', emoji: '🍲', icon: '/icons/stocksoup.png',
        items: [
            { name: 'Beef Stock', price: '$10.99' },
            { name: 'Veal Stock', price: '$10.99' },
            { name: 'Duck Stock', price: '$10.99' },
            { name: 'Pork Stock', price: '$10.99', inStock: false },
            { name: 'Vegetable Stock', price: '$10.99' },
            { name: 'Chicken Stock', price: '$10.99', inStock: false },
            { name: 'Turkey Stock', price: '$10.99', inStock: false },
            { name: 'Turkey Gravy', price: '$14.99' },
            { name: 'White Bean With Ham', price: '$14.99' },
            { name: 'Southwestern Chicken Corn Chowder', price: '$16.99' },
            { name: 'Minestrone', price: '$14.99' },
            { name: 'Shrimp and Tasso Ham Gumbo', price: '$18.99' },
            { name: 'Turkey and Andouille Gumbo', price: '$18.99' },
            { name: 'Smoked Duck And Tasso Gumbo', price: '$16.99', inStock: false },
            { name: 'Italian Wedding Soup', price: '$16.99' },
            { name: 'French Onion Soup', price: '$16.99' },
            { name: 'New England Clam Chowder', price: '$18.99' },
            { name: 'Manhattan Clam Chowder', price: '$14.99' },
            { name: 'Curried Snapper Stew', price: '$14.99' },
            { name: 'Chicken Tortilla Soup', price: '$16.99' },
            { name: 'Thai Coconut Chicken Curry', price: '$14.99', inStock: false },
            { name: 'Ribolitta', desc: 'Tuscan bread soup.', price: '$14.99' },
            { name: 'Posole Rojo', price: '$14.99' },
            { name: 'Posole Verde', price: '$14.99', inStock: false },
            { name: 'Pork Hatch Chili Verde', price: '$14.99', inStock: false },
            { name: 'Black Bean Turkey Chili', price: '$14.99' },
            { name: 'White Chicken Chili', price: '$16.99', inStock: false },
            { name: 'Chili Con Carne', price: '$12.99', inStock: false },
            { name: 'Cincinatti Chili', price: '$14.99' },
            { name: 'Caldo de Pollo', price: '$14.99', inStock: false },
            { name: 'Chicken Noodle Soup', price: '$14.99', inStock: false },
            { name: 'Chicken and Rice Soup', price: '$14.99', inStock: false },
            { name: 'Matzo Ball Soup', price: '$14.99', inStock: false },
            { name: 'Split Pea Soup', price: '$14.99' },
            { name: 'Mushroom Barley', price: '$14.99', inStock: false },
            { name: 'Brunswick Stew', price: '$16.99' },
            { name: 'Polish Bigos', price: '$10.99', inStock: false },
            { name: 'Vegetable Beef Barley', price: '$14.99', inStock: false },
            { name: 'Smoked Turkey And Wild Rice Soup', price: '$14.99', inStock: false },
            { name: 'Gazpacho', price: '$10.99' },
        ]
    },
    {
        id: 'catering', label: 'Catering', sub: 'Events of Any Size', emoji: '🎉', icon: '/icons/catering.png',
        items: [
            { name: 'BBQ Pulled Chicken', desc: 'Smoked and pulled. By the pound.', price: '$19.99/lb', inStock: false },
            { name: 'Smoked Brisket', desc: 'Housemade smoked brisket. By the pound.', price: '$28.99/lb', inStock: false },
            { name: 'Cooked Beef Tenderloin', desc: 'Perfect for events, sliced to order.', price: '$74.99/lb', inStock: false },
            { name: 'BBQ Catering — 20+ Guests', desc: 'From $16/person. Brisket, pulled pork, ribs, sides. Min. 4 days notice.', price: 'From $16/pp' },
            { name: 'Pig Roast Package', desc: 'Whole pig roast, source to serve. Min. 2 weeks notice.', price: 'Call for Quote' },
            { name: 'Rotisserie Chicken Dinner', desc: 'Whole birds with sides.', price: 'Call for Quote' },
            { name: 'Italian Beef Bar', desc: 'Build-your-own Italian beef station.', price: 'Call for Quote' },
        ]
    },
];

// The Depot — grocery, produce, pantry & lifestyle
const DEPOT_CATEGORIES: Category[] = [
    {
        id: 'pastries', label: 'Pastries', sub: 'Fresh Baked Daily', emoji: '🥐', icon: '/icons/pastries.png',
        items: [
            { name: 'Apple Fritter', price: '$6.00' },
            { name: 'Almond Croissant', price: '$7.00' },
            { name: 'Croissant', price: '$4.00' },
            { name: 'Kougn Amman', price: '$5.00' },
            { name: 'Savory Danish', desc: 'Rotating seasonal filling.', price: '$5.00' },
            { name: 'Fruit Muffin', price: '$5.00' },
        ]
    },
    {
        id: 'hot-beverages', label: 'Hot Beverages', sub: 'Sparrow Coffee & More', emoji: '☕', icon: '/icons/hotbeverage.png',
        items: [
            { name: 'Sparrow Coffee 10oz', desc: 'Regular or Decaf.', price: '$3.42' },
            { name: 'Sparrow Coffee 16oz', desc: 'Regular or Decaf.', price: '$3.91' },
            { name: 'Rare Tea', price: '$3.50' },
            { name: 'Hot Chocolate', price: '$3.50' },
        ]
    },
    {
        id: 'grab-go', label: 'Grab + Go Hot Foods', sub: 'Ready Now', emoji: '🍗', icon: '/icons/grabgo.png',
        items: [
            { name: 'Rotisserie Chicken', price: '$22.99' },
        ]
    },
    {
        id: 'soups-stocks', label: 'Soups & Stocks', sub: 'House-Made, Frozen Quarts', emoji: '🍲', icon: '/icons/stocksoup.png',
        items: [
            { name: 'Posole Rojo', desc: 'Frozen quart.', price: '$14.99' },
            { name: 'Chicken Tortilla Soup', desc: 'Frozen quart.', price: '$16.99' },
            { name: 'House Turkey Stock', desc: 'Frozen quart.', price: '$10.99' },
            { name: 'House Veal Stock', desc: 'Frozen quart.', price: '$10.99' },
            { name: 'House Duck Stock', desc: 'Frozen quart.', price: '$10.99' },
            { name: 'House Veggie Stock', desc: 'Frozen quart.', price: '$10.99' },
        ]
    },
    {
        id: 'prepared', label: 'Prepared Foods', sub: 'Heat & Serve', emoji: '🍱', icon: '/icons/prepared.png',
        items: [
            { name: 'Duck Confit', price: '$26.99/lb' },
            { name: 'Pulled Pork', price: '$14.99' },
            { name: 'Smoked Turkey', price: '$125.00' },
            { name: 'Deli Salads', desc: 'Rotating selection.', price: '$8.99/lb' },
            { name: 'House Demi-Glace', price: '$14.99' },
            { name: 'Bacon Fat Dijonnaise', price: '$10.99' },
        ]
    },
    {
        id: 'produce', label: 'Produce', sub: 'Locally & Seasonally Sourced', emoji: '🥦', icon: '/icons/produce.png',
        items: [
            { name: 'Heirloom Tomatoes', desc: 'Locally sourced, seasonal varieties.', price: '$4.99/lb' },
            { name: 'Baby Arugula', desc: 'Fresh-cut, 5oz bag.', price: '$4.99' },
            { name: 'Shallots', desc: 'French-style, sold per pound.', price: '$3.99/lb' },
            { name: 'Garlic', desc: 'Whole heads, 3-pack.', price: '$3.99' },
            { name: 'Fresh Herbs Bundle', desc: 'Rosemary, thyme, and sage.', price: '$4.99' },
            { name: 'Fingerling Potatoes', desc: 'Perfect for roasting.', price: '$4.99/lb' },
            { name: 'Wild Mushrooms', desc: 'Seasonal mix — chanterelle, hen-of-the-woods.', price: '$12.99/lb' },
            { name: 'Hatch Green Chiles', desc: 'Roasted or raw, seasonal.', price: '$5.99/lb', inStock: false },
        ]
    },
    {
        id: 'dairy', label: 'Dairy, Eggs & Cheese', sub: 'Local & Artisan', emoji: '🥛', icon: '/icons/dairy.png',
        items: [
            { name: 'Raw Goat Milk Sharp Cheddar', price: '$9.99', inStock: false },
            { name: 'Point Reyes Blue Cheese', price: '$9.99', inStock: false },
            { name: 'Point Reyes Blue Cheese Crumbles', price: '$15.99/lb', inStock: false },
            { name: 'Hook\'s Sharp Cheddar Cheese', price: '$9.99', inStock: false },
            { name: 'LaClare Farms Goat Cheddar', price: '$9.99' },
            { name: 'Rush Creek Reserve Cheese', desc: 'Seasonal cave-aged.', price: '$38.99' },
            { name: 'Brunkow Baked Cheese', desc: 'Wisconsin bread cheese.', price: '$11.99', inStock: false },
            { name: 'Horseradish Cheddar', price: '$6.99', inStock: false },
            { name: 'Organic Swiss', price: '$16.99/lb' },
            { name: 'Cooper\'s Sharp White American Cheese', price: '$19.99/lb', inStock: false },
            { name: 'Mushroom Umami Butter', price: '$14.99', inStock: false },
            { name: 'Citrus Ramp Butter', desc: 'Seasonal compound butter.', price: '$16.99', inStock: false },
            { name: 'Grasslands Butter', price: '$8.99', inStock: false },
            { name: 'Organic Valley European-Style Cultured Butter', price: '$8.99', inStock: false },
            { name: 'Kerrygold Butter', price: '$8.99', inStock: false },
            { name: 'Bellwether Farms Creme Fraiche', price: '$4.99', inStock: false },
            { name: 'Finn\'s Farm Fresh Eggs', price: '$8.99', inStock: false },
            { name: 'Kilgus 2% Milk', price: '$4.99', inStock: false },
            { name: 'Kilgus Whole Milk', price: '$4.99', inStock: false },
            { name: 'Kilgus Fat Free Skim Milk', price: '$4.99', inStock: false },
            { name: 'Small Pimento Cheese Dip', price: '$10.99', inStock: false },
            { name: 'Large Pimento Dip', price: '$14.99', inStock: false },
        ]
    },
    {
        id: 'pantry', label: 'Pantry & More', sub: 'BBQ Sauces, Rubs, Condiments, Snacks', emoji: '🫙', icon: '/icons/pantry.png',
        items: [
            { name: 'Kewpie Mayo', price: '$12.99' },
            { name: 'Blue Plate Mayo', price: '$10.99' },
            { name: "Duke's Mayo 18oz", price: '$10.99', inStock: false },
            { name: "Lillie's Q Carolina BBQ Sauce", price: '$11.99' },
            { name: "Lillie's Q Smoky BBQ Sauce", price: '$11.99', inStock: false },
            { name: "Lillie's Q Hot Smoky BBQ Sauce", price: '$11.99', inStock: false },
            { name: "Lillie's Q Carolina Gold BBQ Sauce", price: '$11.99', inStock: false },
            { name: "Lillie's Q Ivory BBQ Sauce", price: '$11.99', inStock: false },
            { name: "Lillie's Q ENC BBQ Sauce", price: '$11.99', inStock: false },
            { name: "Lillie's Q Q-Rub", price: '$8.99', inStock: false },
            { name: "Lillie's Q Carolina Dirt Rub", price: '$9.99', inStock: false },
            { name: 'HMC Rub', desc: 'House BBQ rub.', price: '$9.99', inStock: false },
            { name: 'HMC Steak Hit Beef Spice Blend', price: '$9.99', inStock: false },
            { name: 'HMC Fiesta Blend', price: '$9.99', inStock: false },
            { name: 'Spice House Steakhouse Seasoning', price: '$8.99', inStock: false },
            { name: 'Spice House Rib Rub', price: '$8.99', inStock: false },
            { name: 'Spice House Bronzeville Rib Rub', price: '$8.99', inStock: false },
            { name: 'Spice House Brisket Of Love', price: '$8.99', inStock: false },
            { name: 'Spice House Back Of The Yards', price: '$8.99', inStock: false },
            { name: 'Two Fat Guys BBQ Sauce Mild', price: '$6.99', inStock: false },
            { name: 'Two Fat Guys BBQ Spicy', price: '$6.99' },
            { name: 'Two Fat Guys Cherry BBQ', price: '$6.99', inStock: false },
            { name: 'Two Fat Guys BBQ Sauce Smoky', price: '$6.99', inStock: false },
            { name: 'Two Fat Guys BBQ Sauce Lava', price: '$6.99' },
            { name: 'Two Fat Guys Mustard', price: '$6.99' },
            { name: '17th St. BBQ Sauce Original', price: '$9.99', inStock: false },
            { name: '17th Street Apple City Red', price: '$9.99', inStock: false },
            { name: '17th St. Sauce Little Kick', price: '$9.99', inStock: false },
            { name: '17th St. Magic Dust Rub', price: '$10.99', inStock: false },
            { name: '17th Street Hog Warsh', price: '$9.99', inStock: false },
            { name: 'Crystal Hot Sauce', price: '$9.99' },
            { name: 'Sriracha Chili Sauce', price: '$16.99', inStock: false },
            { name: 'Chicago Fire Sauce', price: '$9.99' },
            { name: 'Chicago Sauce', price: '$9.99', inStock: false },
            { name: 'Blis Soy Sauce', price: '$16.99' },
            { name: 'Blis Fish Sauce', price: '$29.99' },
            { name: 'Blis Steak Sauce', price: '$12.99', inStock: false },
            { name: 'Blis Bourbon Barrel Maple Syrup', price: '$27.99', inStock: false },
            { name: 'Red Boat Fish Sauce', price: '$9.99', inStock: false },
            { name: 'Red Boat Fish Salt', price: '$24.99', inStock: false },
            { name: 'JR Kelly Horseradish Sauce', price: '$6.99', inStock: false },
            { name: 'JR Kelly Horseradish Mustard', price: '$6.99' },
            { name: 'JR Kelly Prepared Horseradish', price: '$6.99' },
            { name: 'Prepared Horseradish', price: '$5.99', inStock: false },
            { name: 'St. Elmo\'s Cocktail Sauce', price: '$9.99', inStock: false },
            { name: 'Maille Dijon', price: '$9.99', inStock: false },
            { name: 'Local Folks Stone Ground Mustard', price: '$6.99' },
            { name: 'Laoganma Chili Crisp', price: '$16.99', inStock: false },
            { name: 'Black Garlic Sauce', price: '$14.99' },
            { name: 'Habanero Pepper Jelly', price: '$8.99' },
            { name: 'Cranberry Sauce', price: '$11.99' },
            { name: 'Sunny Hill Honey', price: '$8.99', inStock: false },
            { name: 'Maple Syrup', price: '$24.99', inStock: false },
            { name: 'Enzo Fig Balsamic Vinegar', price: '$22.99', inStock: false },
            { name: 'Enzo Crushed Lemon Olive Oil', price: '$22.99', inStock: false },
            { name: 'Truffle Hunter Oil', price: '$26.99', inStock: false },
            { name: 'Mother In Law Kimchi', price: '$11.99' },
            { name: 'Vegan Napa Cabbage Kimchi', price: '$11.99', inStock: false },
            { name: 'McClure\'s Garlic Dill Spears', price: '$11.99', inStock: false },
            { name: 'McClure\'s Spicy Pickles', price: '$11.99', inStock: false },
            { name: 'McClure\'s Sweet And Spicy Pickles', price: '$11.99', inStock: false },
            { name: 'Joe Chips 5oz Classic Potato Chips', price: '$4.99', inStock: false },
            { name: 'Joe Chips Sour Cream & Toasted Onion', price: '$4.99', inStock: false },
            { name: 'Joe Chips Sweet Potato', price: '$4.99', inStock: false },
            { name: 'Great Lakes Potato Chips Large - BBQ', price: '$5.99' },
            { name: 'Great Lakes Original Large', price: '$5.99', inStock: false },
            { name: 'Pop Daddy Maple & Brown Butter Pretzels', price: '$5.99', inStock: false },
            { name: 'Pop Daddy Yellow Mustard Pretzels', price: '$5.99', inStock: false },
            { name: 'Pop Daddy Beer Cheese Pretzels', price: '$5.99', inStock: false },
            { name: 'Mojobricks Bar-B-Qubes Competition Oak', price: '$10.99' },
            { name: 'Mojobricks Bar-B-Qubes Happle', price: '$10.99' },
            { name: 'Rockwood 20lb Bag of Charcoal', price: '$40.99', inStock: false },
        ]
    },
    {
        id: 'bread', label: 'Bread & Bakery', sub: 'Fresh Baked', emoji: '🍞', icon: '/icons/bread.png',
        items: [
            { name: 'Publican Oat Porridge Bread', price: '$9.99' },
            { name: 'Publican 1979 Multigrain Bread Loaf', price: '$10.00', inStock: false },
            { name: 'Demi Baguette', price: '$2.00', inStock: false },
            { name: 'Turano Brioche Burger Buns', price: '$5.99', inStock: false },
            { name: 'Turano Brat Buns', price: '$5.99', inStock: false },
            { name: '12 Pack Golden Slider Buns', price: '$7.99', inStock: false },
            { name: 'Buns', price: '$6.99', inStock: false },
            { name: 'Hot Dog Buns', desc: 'Fresh baked, pack of 6.', price: '$5.99', inStock: false },
        ]
    },
    {
        id: 'beverages', label: 'Cold Beverages', sub: 'Craft & Locally Sourced', emoji: '🥤', icon: '/icons/coldbeverage.png',
        items: [
            { name: 'Joe Tea Peach Glass Bottle', price: '$4.00' },
            { name: 'Joe Tea Raspberry Tea Glass Bottle', price: '$4.00' },
            { name: 'Joe Tea Strawberry Lemonade Glass Bottle', price: '$4.00' },
            { name: 'Filbert\'s Regular Root Beer', price: '$1.99' },
            { name: 'Filbert\'s Ginger Ale', price: '$1.99' },
            { name: 'Filbert\'s Lime Soda', price: '$1.99', inStock: false },
            { name: 'Filbert\'s Orange Cream Soda', price: '$1.99', inStock: false },
            { name: 'Filbert\'s Diet Root Beer', price: '$1.99', inStock: false },
            { name: 'Ginger Ale Can', price: '$1.50' },
            { name: 'Coke', price: '$1.50' },
            { name: 'Sprite', price: '$1.50', inStock: false },
            { name: 'Faygo', price: '$1.50', inStock: false },
            { name: 'Wisco Pop', price: '$2.99', inStock: false },
            { name: 'Sparkle Ginger Water', price: '$2.99', inStock: false },
            { name: 'Topo Chico Glass', price: '$2.99', inStock: false },
            { name: 'Nirvana Water', price: '$1.50' },
            { name: 'McClure\'s Bloody Mary Mixer', price: '$9.99', inStock: false },
        ]
    },
    {
        id: 'swag', label: 'HMC Swag', sub: 'Hofherr Meat Co. Merch', emoji: '🛍️', icon: '/icons/swag.png',
        items: [
            { name: 'Hofherr Meat Co. Hat', desc: 'Classic logo snapback.', price: '$30.00' },
            { name: 'Hofherr Meat Co. Shirt', desc: 'Soft cotton tee.', price: '$25.00' },
            { name: 'HMC Koozie', desc: 'Keep your drinks cold.', price: '$2.00' },
        ]
    },
    {
        id: 'festival', label: 'Festival', sub: 'Seasonal Event Menu', emoji: '🎦', icon: '/icons/festival.png',
        items: [
            { name: 'Burnt End Sandwich', price: '$17.00' },
            { name: 'Burnt Ends Sandwich', price: '$5.00' },
            { name: 'Pulled Pork Sandwich', price: '$16.00' },
            { name: 'Chicago-Style Rib Tip & Hot Link Combo', price: '$15.00' },
            { name: 'Rib Tips and Hot Link Combo', price: '$10.00', inStock: false },
            { name: 'BBQ Portobello Sandwich', price: '$16.00' },
            { name: 'Portobello Mushroom Sandwich', price: '$5.00', inStock: false },
            { name: 'Side of House Pickles', price: '$5.00', inStock: false },
            { name: 'Extra Side of House Pickles', price: '$2.00' },
            { name: 'Gatorade', price: '$2.00' },
            { name: 'Festival Water', price: '$1.00', inStock: false },
            { name: 'Chips', price: '$15.00', inStock: false },
        ]
    },
];

const CATEGORIES = [...MAIN_CATEGORIES, ...DEPOT_CATEGORIES];

/* ─── Helpers ────────────────────────────────────────────────────────── */
const totalItems = (cart: CartItem[]) => cart.reduce((s, i) => s + i.qty, 0);

// ── Price helpers ──────────────────────────────────────────────────────────────
function parseItemPrice(price: string): number {
    const m = price.match(/\$([\d.]+)/);
    return m ? parseFloat(m[1]) : 0;
}
function fmtTotal(n: number): string {
    return '$' + n.toFixed(2);
}

function formatPhoneNumber(value: string) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

// ── Fuzzy match helper ──────────────────────────────────────────────
function fuzzyMatch(text: string, query: string): boolean {
    const tLow = text.toLowerCase();
    const qLow = query.toLowerCase();
    if (tLow.includes(qLow)) return true;
    // Levenshtein-based: allow 1 typo for queries >= 3 chars
    if (qLow.length < 3) return false;
    const words = tLow.split(/\s+/);
    for (const word of words) {
        if (Math.abs(word.length - qLow.length) > 1) continue;
        let dist = 0;
        const len = Math.max(word.length, qLow.length);
        for (let i = 0; i < len; i++) {
            if (word[i] !== qLow[i]) dist++;
            if (dist > 1) break;
        }
        if (dist <= 1) return true;
    }
    return false;
}

// ── Highlight matched text ──────────────────────────────────────────
function HighlightText({ text, query }: { text: string; query: string }) {
    if (!query.trim()) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
        <>
            {text.slice(0, idx)}
            <mark className={styles.searchHighlight}>{text.slice(idx, idx + query.length)}</mark>
            {text.slice(idx + query.length)}
        </>
    );
}

const PLACEHOLDER_TEXTS: Record<string, string[]> = {
    butcher: [
        'Search steaks…',
        'Search sausage…',
        'Search chicken…',
        'Search pork chops…',
        'Search deli meats…',
        'Search seafood…',
    ],
    depot: [
        'Search produce…',
        'Search cheese…',
        'Search pantry items…',
        'Search dairy…',
        'Search bread…',
        'Search snacks…',
    ],
};

export default function CustomOrdersPage({
    sanityButcher,
    sanityDepot,
}: {
    sanityButcher?: Category[];
    sanityDepot?: Category[];
} = {}) {
    const butcherCategories = sanityButcher && sanityButcher.length > 0 ? sanityButcher : MAIN_CATEGORIES;
    const depotCategories = sanityDepot && sanityDepot.length > 0 ? sanityDepot : DEPOT_CATEGORIES;
    const router = useRouter();
    const searchParams = useSearchParams();
    const storeParam = searchParams.get('store');
    
    const [activeStore, setActiveStore] = useState<'butcher' | 'depot'>(
        storeParam === 'depot' ? 'depot' : 'butcher'
    );

    useEffect(() => {
        const store = searchParams.get('store');
        if (store === 'depot' || store === 'butcher') {
            setActiveStore(store);
            const categories = store === 'butcher' ? butcherCategories : depotCategories;
            setActiveCategory(categories[0]?.id ?? 'beef');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [searchParams, butcherCategories, depotCategories]);

    const [activeCategory, setActiveCategory] = useState(
        activeStore === 'butcher' ? (butcherCategories[0]?.id ?? 'beef') : (depotCategories[0]?.id ?? 'beef')
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [hideOutOfStock, setHideOutOfStock] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [placeholderIdx, setPlaceholderIdx] = useState(0);
    const [restockOpen, setRestockOpen] = useState<string | null>(null);
    const [restockQty, setRestockQty] = useState(1);
    const [restockName, setRestockName] = useState('');
    const [restockContactType, setRestockContactType] = useState<'phone' | 'email'>('phone');
    const [restockContact, setRestockContact] = useState('');
    const [restockSubmitted, setRestockSubmitted] = useState<Set<string>>(new Set());
    const searchRef = useRef<HTMLInputElement>(null);
    const [modal, setModal] = useState<Item | null>(null);
    const [modalQty, setModalQty] = useState(1);
    const [modalNote, setModalNote] = useState('');
    const [orderNote, setOrderNote] = useState('');
    const [restockToast, setRestockToast] = useState(false);

    const switchStore = (store: 'butcher' | 'depot') => {
        const audio = new Audio('/togglesound.mp3');
        audio.volume = 0.04;
        audio.play().catch(() => {});
        // Save current cart before switching
        try {
            const currentKey = activeStore === 'butcher' ? 'hofherr_cart_butcher' : 'hofherr_cart_depot';
            localStorage.setItem(currentKey, JSON.stringify(cart));
        } catch { }
        // Load the other store's cart
        try {
            const nextKey = store === 'butcher' ? 'hofherr_cart_butcher' : 'hofherr_cart_depot';
            const saved = localStorage.getItem(nextKey);
            const nextCart: CartItem[] = saved ? JSON.parse(saved) : [];
            setCart(nextCart);
        } catch {
            setCart([]);
        }
        setActiveStore(store);
        setSearchQuery('');
        const firstCat = store === 'butcher' ? butcherCategories[0].id : depotCategories[0].id;
        setActiveCategory(firstCat);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState<'choice' | 'form'>('choice');
    const [form, setForm] = useState({ name: '', phone: '', email: '', pickup: '' });
    const [contactPref, setContactPref] = useState<'phone' | 'email'>('phone');
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'instore'>('stripe');
    const [stripeError, setStripeError] = useState('');
    const [isPending, startTransition] = useTransition();

    // ── Auth & Customer States ────────────────────────────────────────────────
    const [user, setUser] = useState<{ id: string, name: string, email: string } | null>(null);
    const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | null>(null);
    const [authIntent, setAuthIntent] = useState<'checkout' | 'browse' | null>(null);
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', address: '', password: '' });
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState(false);

    // ── Coupon States ────────────────────────────────────────────────────────
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, type: 'percent' | 'fixed', value: number } | null>(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const getAvailablePickupDates = useCallback(() => {
        const dates = [];
        const now = new Date();
        
        for (let i = 0; i < 14; i++) {
            const d = new Date();
            d.setDate(now.getDate() + i);
            const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
            
            let isPast = false;
            // If it's today, check if we're past the last pickup slot
            if (i === 0) {
                let lastH = 18;
                if (activeStore === 'butcher') {
                    if (day === 6) lastH = 17;
                    if (day === 0) lastH = 16;
                } else {
                    lastH = 18;
                }
                // If current hour is >= last pickup hour, skip today
                if (now.getHours() >= lastH) isPast = true;
            }

            if (isPast) continue;

            if (activeStore === 'butcher') {
                if (day !== 1) dates.push(d); // No Mondays for Butcher
            } else {
                if (day !== 0 && day !== 6) dates.push(d); // Mon-Fri only for Depot
            }
        }
        return dates;
    }, [activeStore]);

    const getAvailableTimeSlots = useCallback((date: Date | null) => {
        if (!date) return [];
        const slots: { label: string, value: string, disabled: boolean }[] = [];
        const day = date.getDay();
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        if (activeStore === 'butcher' || activeStore === 'depot') {
            let start = 10;
            let startMin = 0; // starting minutes (0 = :00, 30 = :30)
            let end = 18; // 6pm
            if (activeStore === 'butcher') {
                if (day === 6) end = 17; // Sat 5pm
                if (day === 0) end = 16; // Sun 4pm
            } else {
                // Depot opens at 10:30am
                startMin = 30;
                end = 18; 
            }
            
            for (let h = start; h < end; h++) {
                // Add :00 slot (skip if start is :30 and this is the first hour)
                if (!(h === start && startMin === 30)) {
                    const disabled00 = isToday && (h < now.getHours() || (h === now.getHours() && now.getMinutes() + 15 > 0));
                    slots.push({ label: '', value: `${h}:00`, disabled: disabled00 });
                }
                // Add :30 slot
                const disabled30 = isToday && (h < now.getHours() || (h === now.getHours() && now.getMinutes() + 15 > 30));
                slots.push({ label: '', value: `${h}:30`, disabled: disabled30 });
            }
            
            // Format to AM/PM
            let foundFirst = false;
            return slots.map((s) => {
                const [h, m] = s.value.split(':');
                const hh = parseInt(h);
                const period = hh >= 12 ? 'PM' : 'AM';
                let dispH = hh > 12 ? hh - 12 : hh;
                if (dispH === 0) dispH = 12;
                const timeStr = `${dispH}:${m} ${period}`;
                
                let label = timeStr;
                // If it's the first available slot today, and it's soon, mark it as ASAP
                if (isToday && !s.disabled && !foundFirst) {
                    label = `${timeStr} (ASAP)`;
                    foundFirst = true;
                }
                
                return { value: timeStr, label, disabled: s.disabled };
            });
        }
        return [];
    }, [activeStore]);

    const availableDates = useMemo(() => getAvailablePickupDates(), [getAvailablePickupDates]);
    const [selectedDateIdx, setSelectedDateIdx] = useState(0);
    const availableSlots = useMemo(() => getAvailableTimeSlots(availableDates[selectedDateIdx]), [getAvailableTimeSlots, availableDates, selectedDateIdx]);

    useEffect(() => {
        // Update the form's pickup string whenever date or time selection changes
        const date = availableDates[selectedDateIdx];
        if (date) {
            const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            if (!form.pickup.startsWith(dateStr)) {
                setForm(f => ({ ...f, pickup: `${dateStr} at ${f.pickup.split(' at ')[1] || ''}` }));
            }
        }
    }, [selectedDateIdx, availableDates]);

    // ── Session Sync ─────────────────────────────────────────────────────────
    const { data: session } = useSession();
    const authUser = session?.user;

    useEffect(() => {
        if (authUser) {
            setUser(authUser as any);
            setForm(f => ({ ...f, name: authUser.name!, email: authUser.email!, phone: authUser.phone || f.phone }));
        } else {
            setUser(null);
        }
    }, [authUser]);

    useEffect(() => {
        const login = searchParams.get('login') === 'true';
        const signup = searchParams.get('signup') === 'true';
        const openCart = searchParams.get('cart') === 'open';
        
        if ((login || signup) && !user) {
            setCheckoutOpen(true);
            setAuthMode(signup ? 'register' : 'login');
            setAuthIntent('browse');
        }
        
        if (openCart) {
            setDrawerOpen(true);
        }
    }, [searchParams, user]);

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setForgotSuccess(false);

        if (!forgotEmail) {
            setAuthError('Email is required.');
            return;
        }

        setAuthLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });

            const data = await res.json();
            if (!res.ok) {
                setAuthError(data.error || 'Failed to send reset link.');
            } else {
                setForgotSuccess(true);
                setAuthError('');
            }
        } catch (err) {
            setAuthError('An unexpected error occurred. Please try again.');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);
        try {
            const res = await signIn('credentials', {
                email: loginData.email,
                password: loginData.password,
                redirect: false,
            });
            if (res?.error) throw new Error("Invalid email or password");
            
            if (authIntent === 'browse' || cart.length === 0) {
                window.location.href = '/dashboard';
                setCheckoutOpen(false);
            } else {
                setCheckoutStep('form');
            }
        } catch (err: any) {
            setAuthError(err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);
        try {
            // Create user in backend
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');
            
            // Sign in immediately via NextAuth
            const signInRes = await signIn('credentials', {
                email: registerData.email,
                password: registerData.password,
                redirect: false,
            });
            
            if (signInRes?.error) throw new Error("Could not automatically log in");
            
            if (authIntent === 'browse' || cart.length === 0) {
                window.location.href = '/dashboard';
                setCheckoutOpen(false);
            } else {
                setCheckoutStep('form');
            }
        } catch (err: any) {
            setAuthError(err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut({ redirect: false });
        setForm({ name: '', phone: '', email: '', pickup: '' });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponError('');
        setCouponLoading(true);
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Invalid coupon');
            
            setAppliedCoupon({
                code: couponCode.toUpperCase(),
                type: data.discountType,
                value: data.discountValue
            });
            setCouponCode('');
        } catch (err: any) {
            setCouponError(err.message);
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponError('');
    };

    // ── Custom scrollbar state ──────────────────────────────────────────────
    const summaryRowsRef = useRef<HTMLDivElement>(null);
    const [thumbTop, setThumbTop] = useState(0);
    const [thumbHeight, setThumbHeight] = useState(0);

    const updateThumb = useCallback(() => {
        const el = summaryRowsRef.current;
        if (!el) return;
        const { scrollTop, scrollHeight, clientHeight } = el;
        if (scrollHeight <= clientHeight) { setThumbHeight(0); return; }
        const ratio = clientHeight / scrollHeight;
        setThumbHeight(Math.max(ratio * clientHeight, 24));
        setThumbTop((scrollTop / (scrollHeight - clientHeight)) * (clientHeight - Math.max(ratio * clientHeight, 24)));
    }, []);

    // ── Sidebar custom scrollbar state ──
    const sidebarScrollRef = useRef<HTMLDivElement>(null);
    const sideThumbRef = useRef<HTMLDivElement>(null);

    const updateSideThumb = useCallback(() => {
        const el = sidebarScrollRef.current;
        const thumb = sideThumbRef.current;
        if (!el || !thumb) return;
        const { scrollTop, scrollHeight, clientHeight } = el;
        if (scrollHeight <= clientHeight) {
            thumb.style.display = 'none';
            return;
        }
        thumb.style.display = 'block';
        const ratio = clientHeight / scrollHeight;
        const thumbH = Math.max(ratio * clientHeight, 24);
        const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - thumbH);
        thumb.style.height = thumbH + 'px';
        thumb.style.top = thumbTop + 'px';
    }, []);

    // ── Horizontal custom scrollbar state (mobile category nav) ──
    const hScrollRef = useRef<HTMLDivElement>(null);
    const [hThumbLeft, setHThumbLeft] = useState(0);
    const [hThumbWidth, setHThumbWidth] = useState(0);

    // ── Horizontal custom scrollbar state (pickup dates in modal) ──
    const dateScrollRef = useRef<HTMLDivElement>(null);
    const dateThumbRef = useRef<HTMLDivElement>(null);
    const [dateThumbLeft, setDateThumbLeft] = useState(0);
    const [dateThumbWidth, setDateThumbWidth] = useState(0);
    const [isCatSticky, setIsCatSticky] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [stickyOffset, setStickyOffset] = useState(0);
    const catSentinelRef = useRef<HTMLDivElement>(null);
    const searchRowRef = useRef<HTMLDivElement>(null);
    const mobileHeaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sentinel = catSentinelRef.current;
        if (!sentinel) return;
        // Measure navbar height
        const nav = document.querySelector('header');
        const navH = nav ? nav.getBoundingClientRect().height : 0;
        setNavbarHeight(navH);
        // Measure search row height for category bar offset
        const searchEl = searchRowRef.current;
        const searchH = searchEl ? searchEl.getBoundingClientRect().height + 16 : 52; // 16px for padding
        setStickyOffset(navH + searchH);
        // Measure mobileHeader height for spacer
        const headerEl = mobileHeaderRef.current;
        if (headerEl) setHeaderHeight(headerEl.getBoundingClientRect().height);
        const observer = new IntersectionObserver(
            ([entry]) => setIsCatSticky(!entry.isIntersecting),
            { threshold: 0, rootMargin: `-${navH}px 0px 0px 0px` }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, []);

    const updateHThumb = useCallback(() => {
        const el = hScrollRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        if (scrollWidth <= clientWidth) { setHThumbWidth(0); return; }
        const ratio = clientWidth / scrollWidth;
        const thumbW = Math.max(ratio * clientWidth, 30);
        setHThumbWidth(thumbW);
        setHThumbLeft((scrollLeft / (scrollWidth - clientWidth)) * (clientWidth - thumbW));
    }, []);

    const updateDateThumb = useCallback(() => {
        const el = dateScrollRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        if (scrollWidth <= clientWidth) { setDateThumbWidth(0); return; }
        const ratio = clientWidth / scrollWidth;
        const thumbW = Math.max(ratio * clientWidth, 30);
        setDateThumbWidth(thumbW);
        setDateThumbLeft((scrollLeft / (scrollWidth - clientWidth)) * (clientWidth - thumbW));
    }, []);

    // Update horizontal thumb on mount & resize
    useEffect(() => {
        updateHThumb();
        updateDateThumb();
        window.addEventListener('resize', updateHThumb);
        window.addEventListener('resize', updateDateThumb);
        return () => {
            window.removeEventListener('resize', updateHThumb);
            window.removeEventListener('resize', updateDateThumb);
        };
    }, [updateHThumb, updateDateThumb]);

    const { setCount, registerCartOpener, triggerFlyAnimation } = useCartCount();


    // ── Load cart from localStorage on first render (per-store) ──
    const [cart, setCart] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            // Use storeParam from top level of component
            const targetStore = storeParam === 'depot' ? 'depot' : 'butcher';
            const key = targetStore === 'butcher' ? 'hofherr_cart_butcher' : 'hofherr_cart_depot';
            const saved = localStorage.getItem(key);
            if (!saved) {
                const legacy = localStorage.getItem('hofherr_cart');
                if (legacy && targetStore === 'butcher') return JSON.parse(legacy);
            }
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // ── Save cart to localStorage whenever it changes (per-store) ──
    useEffect(() => {
        try {
            const key = activeStore === 'butcher' ? 'hofherr_cart_butcher' : 'hofherr_cart_depot';
            localStorage.setItem(key, JSON.stringify(cart));
            // Keep legacy key in sync for the global count context
            localStorage.setItem('hofherr_cart', JSON.stringify(cart));
        } catch { /* storage full or unavailable */ }
    }, [cart, activeStore]);

    // ── Load restock submissions from localStorage after hydration ──
    useEffect(() => {
        try {
            const saved = localStorage.getItem('hofherr_restock_requests');
            if (saved) {
                const parsed = JSON.parse(saved) as { item: string }[];
                setRestockSubmitted(new Set(parsed.map(r => r.item)));
            }
        } catch { }
    }, []);

    // ── Register drawer opener so navbar cart icon can open it ──
    useEffect(() => {
        registerCartOpener(() => setDrawerOpen(true));
        return () => registerCartOpener(() => { window.location.href = '/online-orders'; });
    }, [registerCartOpener]);

    useEffect(() => {
        setCount(cart.reduce((s, i) => s + i.qty, 0));
    }, [cart, setCount]);

    // Recompute custom scrollbar whenever modal opens or cart changes
    useEffect(() => {
        if (checkoutOpen) {
            // Retry a few times to ensure DOM is laid out
            [100, 300, 600].forEach(ms => setTimeout(updateThumb, ms));
        }
    }, [checkoutOpen, cart, updateThumb]);

    // ── Scroll-synced sidebar via IntersectionObserver ──
    const isScrollingTo = useRef(false);
    const categories = activeStore === 'butcher' ? butcherCategories : depotCategories;

    const activeCatRef = useRef(activeCategory);

    useEffect(() => {
        const ids = categories.map(c => c.id);

        const handleScroll = () => {
            if (isScrollingTo.current) return;

            const sections = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
            if (!sections.length) return;

            // Calculate top offset: navbar + sticky mobile header
            const navEl = document.querySelector('header');
            const navH = navEl?.getBoundingClientRect().height ?? 0;
            const mobileH = mobileHeaderRef.current?.getBoundingClientRect().height ?? 0;
            const topOffset = navH + mobileH + 40;

            // Find the last section whose top has scrolled past the offset
            let active = ids[0];
            for (let i = 0; i < sections.length; i++) {
                const rect = sections[i].getBoundingClientRect();
                if (rect.top <= topOffset) {
                    active = sections[i].id;
                }
            }
            // Only update if changed
            if (active !== activeCatRef.current) {
                activeCatRef.current = active;
                setActiveCategory(active);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // set initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, [categories, activeStore, searchQuery]);

    // Auto-scroll active category button into view (horizontal bar on mobile)
    useEffect(() => {
        const wrap = hScrollRef.current;
        if (!wrap) return;
        const btn = wrap.querySelector(`.${styles.sideLinkActive}`) as HTMLElement;
        if (btn) {
            // Only scroll the horizontal bar, not the page
            const btnLeft = btn.offsetLeft;
            const btnWidth = btn.offsetWidth;
            const wrapWidth = wrap.offsetWidth;
            const scrollTarget = btnLeft - (wrapWidth / 2) + (btnWidth / 2);
            wrap.scrollTo({ left: scrollTarget, behavior: 'smooth' });
        }
    }, [activeCategory]);

    const scrollTo = (id: string) => {
        activeCatRef.current = id;
        setActiveCategory(id);
        isScrollingTo.current = true;
        const el = document.getElementById(id);
        if (el) {
            const navEl = document.querySelector('header');
            const navH = navEl?.getBoundingClientRect().height ?? 0;
            const isMobile = window.innerWidth < 769;
            const headerEl = mobileHeaderRef.current;
            const mobileH = isMobile && headerEl ? headerEl.getBoundingClientRect().height : 0;
            const offset = navH + mobileH + 24;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
        // Re-enable observer after scroll completes
        const onEnd = () => { isScrollingTo.current = false; window.removeEventListener('scrollend', onEnd); };
        window.addEventListener('scrollend', onEnd, { once: true });
        // Fallback timeout in case scrollend isn't supported
        setTimeout(() => { isScrollingTo.current = false; }, 1500);
    };

    const openModal = (item: Item) => {
        setModal(item);
        setModalQty(1);
        setModalNote('');
    };

    const confirmAdd = useCallback((e?: React.MouseEvent) => {
        if (!modal) return;
        setCart(prev => {
            const existing = prev.findIndex(i => i.name === modal.name);
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = { ...updated[existing], qty: updated[existing].qty + modalQty, note: modalNote || updated[existing].note };
                return updated;
            }
            return [...prev, { ...modal, qty: modalQty, note: modalNote }];
        });
        setModal(null);
        // Fire fly-to-cart animation from the button position
        if (e) {
            const btn = e.currentTarget as HTMLElement;
            const rect = btn.getBoundingClientRect();
            triggerFlyAnimation({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        }
    }, [modal, modalQty, modalNote, triggerFlyAnimation]);

    const removeItem = (name: string) => setCart(prev => prev.filter(i => i.name !== name));
    const changeQty = (name: string, delta: number) => setCart(prev =>
        prev.map(i => i.name === name ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStripeError('');
        startTransition(async () => {
            try {
                const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        items: cart, 
                        contact: form, 
                        orderNote, 
                        customerId: user?.id,
                        coupon: appliedCoupon,
                        storeId: activeStore,
                        paymentMethod
                    }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error ?? 'Checkout failed');
                // Clear cart from localStorage on successful checkout
                try {
                    const cartKey = activeStore === 'butcher' ? 'hofherr_cart_butcher' : 'hofherr_cart_depot';
                    localStorage.removeItem(cartKey);
                    localStorage.removeItem('hofherr_cart');
                } catch { /* ignore */ }
                
                if (data.url) {
                    window.location.href = data.url; // redirect to Stripe or success
                } else {
                    window.location.href = `/order/success?instore=true&pickupTime=${encodeURIComponent(form.pickup)}&name=${encodeURIComponent(form.name)}&storeId=${activeStore}&summary=${encodeURIComponent(cart.map(i => `${i.name} x${i.qty}`).join(', '))}`;
                }
            } catch (err) {
                setStripeError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
            }
        });
    };

    const baseCategories = activeStore === 'butcher' ? butcherCategories : depotCategories;
    const filteredBySearch = searchQuery.trim()
        ? baseCategories
            .map(cat => ({
                ...cat,
                items: cat.items.filter(item =>
                    fuzzyMatch(item.name, searchQuery)
                ),
            }))
            .filter(cat => cat.items.length > 0)
        : baseCategories;

    const hiddenCount = filteredBySearch.reduce((sum, cat) => 
        sum + cat.items.filter(item => item.inStock === false).length, 0
    );

    const visibleCategories = filteredBySearch.map(cat => hideOutOfStock
        ? { ...cat, items: cat.items.filter(item => item.inStock !== false) }
        : cat
    ).filter(cat => cat.items.length > 0);

    // Total result count
    const totalResults = visibleCategories.reduce((sum, cat) => sum + cat.items.length, 0);

    // Autocomplete suggestions (top 5 matches)
    const suggestions = useMemo(() => {
        if (!searchQuery.trim() || searchQuery.length < 2) return [];
        const matches: string[] = [];
        for (const cat of baseCategories) {
            for (const item of cat.items) {
                if (fuzzyMatch(item.name, searchQuery)) matches.push(item.name);
                if (matches.length >= 5) break;
            }
            if (matches.length >= 5) break;
        }
        return matches;
    }, [searchQuery, baseCategories]);

    // Save to recent searches when user clears or blurs with a query
    const saveRecentSearch = useCallback((q: string) => {
        if (!q.trim()) return;
        setRecentSearches(prev => {
            const updated = [q, ...prev.filter(s => s !== q)].slice(0, 5);
            try { localStorage.setItem('hofherr-recent-searches', JSON.stringify(updated)); } catch { }
            return updated;
        });
    }, []);

    // Load recent searches from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('hofherr-recent-searches');
            if (saved) setRecentSearches(JSON.parse(saved));
        } catch { }
    }, []);

    // ⌘K / Ctrl+K keyboard shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
            }
            if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Animated placeholder rotation
    useEffect(() => {
        if (searchFocused || searchQuery) return;
        const interval = setInterval(() => {
            setPlaceholderIdx(i => (i + 1) % PLACEHOLDER_TEXTS[activeStore].length);
        }, 2500);
        return () => clearInterval(interval);
    }, [searchFocused, searchQuery, activeStore]);

    // Recalculate sidebar scrollbar when categories change
    useEffect(() => {
        setTimeout(updateSideThumb, 50);
    }, [activeStore, updateSideThumb]);

    // ── Capture mouse-wheel on the sidebar and redirect it to the inner list ──
    useEffect(() => {
        const el = sidebarScrollRef.current;
        if (!el) return;
        const handler = (e: WheelEvent) => {
            const { scrollTop, scrollHeight, clientHeight } = el;
            // Normalize delta across deltaMode (pixel=0, line=1, page=2)
            let delta = e.deltaY;
            if (e.deltaMode === 1) delta *= 24;  // line mode
            if (e.deltaMode === 2) delta *= clientHeight; // page mode
            const atTop = scrollTop <= 0 && delta < 0;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && delta > 0;
            if (!atTop && !atBottom) {
                e.preventDefault();
                el.scrollBy({ top: delta, behavior: 'instant' });
            }
        };
        el.addEventListener('wheel', handler, { passive: false });
        return () => el.removeEventListener('wheel', handler);
    }, []);


    // ── JSON-LD structured data for Google rich results ──
    const menuJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: 'Hofherr Meat Co.',
        url: 'https://hofherrmeatco.com',
        telephone: '+1-847-441-6328',
        address: [
            {
                '@type': 'PostalAddress',
                streetAddress: '300 Happ Rd',
                addressLocality: 'Northfield',
                addressRegion: 'IL',
                postalCode: '60093',
                addressCountry: 'US',
            },
            {
                '@type': 'PostalAddress',
                streetAddress: '754 Elm St',
                addressLocality: 'Winnetka',
                addressRegion: 'IL',
                postalCode: '60093',
                addressCountry: 'US',
            },
        ],
        hasMenu: [
            {
                '@type': 'Menu',
                name: 'The Butcher Shop',
                hasMenuSection: butcherCategories.map(cat => ({
                    '@type': 'MenuSection',
                    name: cat.label,
                    description: cat.sub,
                    hasMenuItem: cat.items.map(item => ({
                        '@type': 'MenuItem',
                        name: item.name,
                        ...(item.desc ? { description: item.desc } : {}),
                        offers: {
                            '@type': 'Offer',
                            price: item.price.replace(/[^0-9.]/g, ''),
                            priceCurrency: 'USD',
                            availability: item.inStock === false
                                ? 'https://schema.org/OutOfStock'
                                : 'https://schema.org/InStock',
                        },
                    })),
                })),
            },
            {
                '@type': 'Menu',
                name: 'The Depot',
                hasMenuSection: depotCategories.map(cat => ({
                    '@type': 'MenuSection',
                    name: cat.label,
                    description: cat.sub,
                    hasMenuItem: cat.items.map(item => ({
                        '@type': 'MenuItem',
                        name: item.name,
                        ...(item.desc ? { description: item.desc } : {}),
                        offers: {
                            '@type': 'Offer',
                            price: item.price.replace(/[^0-9.]/g, ''),
                            priceCurrency: 'USD',
                            availability: item.inStock === false
                                ? 'https://schema.org/OutOfStock'
                                : 'https://schema.org/InStock',
                        },
                    })),
                })),
            },
        ],
    };

    return (
        <div className={styles.page}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
            />


            {/* Location Hero Banner */}
            <div className={styles.locationHero}>
                <img
                    src={activeStore === 'butcher' ? '/assets/shop-exterior.jpg' : '/assets/shop-exterior.jpg'}
                    alt={activeStore === 'butcher' ? 'The Butcher Shop — Northfield' : 'The Depot — Winnetka'}
                    className={styles.locationHeroImg}
                />
                <div className={styles.locationHeroOverlay}>
                    <h2 className={styles.locationHeroTitle}>
                        {activeStore === 'butcher' ? 'The Butcher Shop' : 'The Depot'}
                    </h2>
                    <span className={styles.locationHeroSub}>
                        {activeStore === 'butcher' ? '300 Happ Rd · Northfield, IL' : '754 Elm St · Winnetka Metra Station'}
                    </span>
                </div>
            </div>

            {/* ── Online Ordering Hours Banner ── */}
            <div className={styles.hoursNotice}>
                <div className={styles.hoursNoticeInner}>
                    {activeStore === 'butcher' ? (
                        <>
                            <div className={styles.hoursNoticeLeft}>
                                <span className={styles.hoursNoticeIcon}>🕙</span>
                                <div>
                                    <div className={styles.hoursNoticeTitle}>Today's Online Ordering Hours</div>
                                    <div className={styles.hoursNoticeTime}>10:00am – 6:00pm</div>
                                </div>
                            </div>
                            <div className={styles.hoursNoticeDivider} />
                            <div className={styles.hoursNoticeRight}>
                                <span className={styles.hoursNoticeBadge}>Online Ordering Currently Closed</span>
                                <span className={styles.hoursNoticeSchedule}>You may schedule your order in advance</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.hoursNoticeLeft}>
                                <span className={styles.hoursNoticeIcon}>🕙</span>
                                <div>
                                    <div className={styles.hoursNoticeTitle}>Depot Pickup Hours</div>
                                    <div className={styles.hoursNoticeTime}>Pickup: 3:30pm – 6:30pm</div>
                                </div>
                            </div>
                            <div className={styles.hoursNoticeDivider} />
                            <div className={styles.hoursNoticeRight}>
                                <span className={styles.hoursNoticeBadge}>Order by 1:30pm for same-day pickup</span>
                                <span className={styles.hoursNoticeSchedule}>Indicate weight in item's special instructions · Final total may vary by weight</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className={styles.layout}>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div ref={catSentinelRef} style={{ height: 0 }} />
                    <div ref={mobileHeaderRef} className={`${styles.mobileHeader} ${isCatSticky ? styles.stickyHeader : ''}`} style={{ top: navbarHeight + 10 }}>


                    <div className={styles.storeSwitch}>
                        <span className={`${styles.storeSwitchLabel} ${activeStore === 'butcher' ? styles.storeSwitchLabelActive : ''}`}>🥩 Butcher</span>
                        <button
                            className={`${styles.storeSwitchTrack} ${activeStore === 'depot' ? styles.storeSwitchTrackOn : ''}`}
                            onClick={() => switchStore(activeStore === 'butcher' ? 'depot' : 'butcher')}
                            aria-label="Toggle store"
                        >
                            <span className={styles.storeSwitchKnob} />
                        </button>
                        <span className={`${styles.storeSwitchLabel} ${activeStore === 'depot' ? styles.storeSwitchLabelActive : ''}`}>Depot 🏪</span>
                    </div>

                    {/* Unified Search Row */}
                    <div className={styles.searchRow} ref={searchRowRef}>
                        <div className={`${styles.searchWrap} ${searchFocused ? styles.searchWrapFocused : ''}`}>
                            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder={PLACEHOLDER_TEXTS[activeStore][placeholderIdx % PLACEHOLDER_TEXTS[activeStore].length]}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => { setTimeout(() => setSearchFocused(false), 200); saveRecentSearch(searchQuery); }}
                                onKeyDown={e => {
                                    if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestions[0] && searchQuery) {
                                        const s = suggestions[0];
                                        if (s.toLowerCase().startsWith(searchQuery.toLowerCase())) {
                                            e.preventDefault();
                                            setSearchQuery(s);
                                        }
                                    }
                                }}
                                className={styles.searchInput}
                            />
                            {/* Inline ghost autocomplete */}
                            {searchQuery && suggestions[0] && suggestions[0].toLowerCase().startsWith(searchQuery.toLowerCase()) && (
                                <span className={styles.searchGhost} aria-hidden="true">
                                    <span className={styles.searchGhostHidden}>{searchQuery}</span>{suggestions[0].slice(searchQuery.length)}
                                </span>
                            )}
                            {!searchQuery && !searchFocused && (
                                <span className={styles.searchKbd}>⌘K</span>
                            )}
                            {searchQuery && (
                                <>
                                    <span className={styles.searchCount}>{totalResults}</span>
                                    <button className={styles.searchClear} onClick={() => { saveRecentSearch(searchQuery); setSearchQuery(''); setActiveCategory(baseCategories[0].id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} type="button" aria-label="Clear search">
                                        ✕
                                    </button>
                                </>
                            )}
                            {/* Dropdown */}
                            {searchFocused && (suggestions.length > 0 || (!searchQuery && recentSearches.length > 0)) && (
                                <div className={styles.searchDropdown}>
                                    {!searchQuery && recentSearches.length > 0 && (
                                        <>
                                            <div className={styles.searchDropLabel}>Recent</div>
                                            {recentSearches.map(s => (
                                                <button key={s} className={styles.searchDropItem} onMouseDown={() => setSearchQuery(s)}>
                                                    <span className={styles.searchDropRecent}>🕑</span> {s}
                                                </button>
                                            ))}
                                        </>
                                    )}
                                    {searchQuery && suggestions.length > 0 && (
                                        <>
                                            <div className={styles.searchDropLabel}>Suggestions</div>
                                            {suggestions.map(s => (
                                                <button key={s} className={styles.searchDropItem} onMouseDown={() => setSearchQuery(s)}>
                                                    <HighlightText text={s} query={searchQuery} />
                                                </button>
                                            ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <button
                            className={`${styles.hideOosBtn} ${hideOutOfStock ? styles.hideOosBtnActive : ''}`}
                            onClick={() => setHideOutOfStock(h => !h)}
                            type="button"
                        >
                            {hideOutOfStock ? `SHOW ALL (${hiddenCount})` : 'HIDE OUT OF STOCK'}
                        </button>
                    </div>

                    {/* Horizontal custom scrollbar (mobile) */}
                    <div className={styles.hScrollTrack}>
                        {hThumbWidth > 0 && (
                            <div
                                className={styles.hScrollThumb}
                                style={{ width: hThumbWidth, left: hThumbLeft }}
                            />
                        )}
                    </div>
                    <div className={styles.sidebarScrollWrap} ref={hScrollRef} onScroll={updateHThumb}>
                        <div
                            className={styles.sidebarInner}
                            ref={sidebarScrollRef}
                            onScroll={updateSideThumb}
                        >
                            {baseCategories.map(cat => (
                                <button key={cat.id} className={`${styles.sideLink} ${activeCategory === cat.id ? styles.sideLinkActive : ''}`} onClick={() => scrollTo(cat.id)}>
                                    {cat.icon
                                        ? <img src={cat.icon} alt={cat.label} className={styles.sideIcon} />
                                        : <span>{cat.emoji}</span>
                                    } {cat.label}
                                </button>
                            ))}
                        </div>
                        <div className={styles.customScrollTrack}>
                            <div
                                ref={sideThumbRef}
                                className={styles.customScrollThumb}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                    </div>
                </aside>

                {/* Main */}
                <main className={styles.main}>

                    {/* ── Depot Ordering Info ── */}
                    {activeStore === 'depot' && (
                        <div className={styles.depotInfoNotice}>
                            <div className={styles.depotInfoIcon}>🏪</div>
                            <div className={styles.depotInfoBody}>
                                <div className={styles.depotInfoTitle}>Depot Ordering Instructions</div>
                                <p className={styles.depotInfoText}>
                                    Order by <strong>1:30pm</strong> for pick up between <strong>3:30pm – 6:30pm</strong>. Please indicate the quantity of each item desired. If you have a specific weight you would like, please indicate the amount in the item&apos;s special instructions. The total amount given at the end of checkout may not reflect the actual total due because it does not factor in the weight of the products. Thank you!
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Butcher Ordering Info ── */}
                    {activeStore === 'butcher' && (
                        <div className={styles.butcherInfoNotice}>
                            <div className={styles.depotInfoIcon}>🥩</div>
                            <div className={styles.depotInfoBody}>
                                <div className={styles.butcherInfoTitle}>Ordering Instructions</div>
                                <p className={styles.depotInfoText}>
                                    Indicate <strong>quantity</strong>, not weight. For a specific weight, note it in the item&apos;s <strong>special instructions</strong> — checkout totals may not reflect final weight-based pricing.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className={styles.productsWrap}>
                    {searchQuery.trim() && visibleCategories.length === 0 && (
                        <div className={styles.noResults}>
                            <span className={styles.noResultsIcon}>🥩</span>
                            <p className={styles.noResultsTitle}>No meat found. Not even the mystery cuts.</p>
                            <p className={styles.noResultsHint}>Try searching something else!</p>
                            <button className={styles.noResultsClear} onClick={() => { setSearchQuery(''); setActiveCategory(baseCategories[0].id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Clear Search</button>
                        </div>
                    )}
                    {visibleCategories.map(cat => (
                        <section key={cat.id} id={cat.id} className={styles.catSection}>
                            <div className={styles.catHeader}>
                                {cat.icon
                                    ? <img src={cat.icon} alt={cat.label} className={styles.catIcon} />
                                    : <span className={styles.catEmoji}>{cat.emoji}</span>
                                }
                                <div>
                                    <h2 className={styles.catTitle}>{cat.label}</h2>
                                    {cat.sub && <p className={styles.catSub}>{cat.sub}</p>}
                                </div>
                            </div>
                            <div className={styles.itemList}>
                                {cat.items.map(item => (
                                    <div key={item.name} className={`${styles.item} ${item.inStock === false ? styles.itemOut : ''}`}>
                                        {item.image && <img src={item.image} alt={item.name} className={styles.itemThumb} />}
                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemName}>
                                                <HighlightText text={item.name} query={searchQuery} />
                                                {item.isNew && <span className={styles.stockBadge} data-status="new">✨ NEW</span>}
                                                {item.stockStatus === 'low-stock' && <span className={styles.stockBadge} data-status="low">🔥 Almost Gone</span>}
                                                {item.stockStatus === 'pre-order' && <span className={styles.stockBadge} data-status="preorder">📦 Pre-Order</span>}
                                                {item.stockStatus === 'seasonal' && <span className={styles.stockBadge} data-status="seasonal">🌿 Seasonal</span>}
                                            </div>
                                            {item.desc && <div className={styles.itemDesc}><HighlightText text={item.desc} query={searchQuery} /></div>}
                                            {item.origin && <div className={styles.itemOrigin}>{item.origin}</div>}
                                        </div>
                                        <div className={styles.itemRight}>
                                            {item.salePrice ? (
                                                <div className={styles.itemPriceWrap}>
                                                    <span className={styles.itemPriceOld}>{item.price}</span>
                                                    <span className={styles.itemPriceSale}>{item.salePrice}</span>
                                                </div>
                                            ) : (
                                                <span className={styles.itemPrice}>{item.price}</span>
                                            )}
                                            {item.inStock === false ? (
                                                <div className={styles.restockWrap}>
                                                    {restockSubmitted.has(item.name) ? (
                                                        <span className={styles.restockDone}>Requested ✓</span>
                                                    ) : restockOpen === item.name ? (
                                                        <div className={styles.restockForm}>
                                                            <button className={styles.restockClose} onClick={() => setRestockOpen(null)} aria-label="Close">×</button>
                                                            <div className={styles.restockItemName}>{item.name}</div>
                                                            <input
                                                                type="text"
                                                                placeholder="Your name"
                                                                value={restockName}
                                                                onChange={e => setRestockName(e.target.value)}
                                                                className={styles.restockInput}
                                                            />
                                                            <div className={styles.restockContactRow}>
                                                                <button
                                                                    type="button"
                                                                    className={`${styles.restockContactToggle} ${restockContactType === 'phone' ? styles.restockContactToggleActive : ''}`}
                                                                    onClick={() => { setRestockContactType('phone'); setRestockContact(''); }}
                                                                >📱</button>
                                                                <button
                                                                    type="button"
                                                                    className={`${styles.restockContactToggle} ${restockContactType === 'email' ? styles.restockContactToggleActive : ''}`}
                                                                    onClick={() => { setRestockContactType('email'); setRestockContact(''); }}
                                                                >✉️</button>
                                                                <input
                                                                    type={restockContactType === 'phone' ? 'tel' : 'email'}
                                                                    placeholder={restockContactType === 'phone' ? 'Phone number' : 'Email address'}
                                                                    value={restockContact}
                                                                    onChange={e => setRestockContact(e.target.value)}
                                                                    className={styles.restockInput}
                                                                    style={{ flex: 1 }}
                                                                />
                                                            </div>
                                                            <div className={styles.restockQtyRow}>
                                                                <span className={styles.restockQtyLabel}>Qty:</span>
                                                                <button className={styles.restockQtyBtn} onClick={() => setRestockQty(q => Math.max(1, q - 1))}>−</button>
                                                                <span className={styles.restockQtyVal}>{restockQty}</span>
                                                                <button className={styles.restockQtyBtn} onClick={() => setRestockQty(q => q + 1)}>+</button>
                                                            </div>
                                                            <button
                                                                className={styles.restockSubmit}
                                                                disabled={!restockName.trim() || !restockContact.trim()}
                                                                onClick={() => {
                                                                    // Save to localStorage
                                                                    const request = { name: restockName.trim(), contactType: restockContactType, contact: restockContact.trim(), item: item.name, qty: restockQty, store: activeStore, timestamp: new Date().toISOString() };
                                                                    try {
                                                                        const saved = localStorage.getItem('hofherr_restock_requests');
                                                                        const existing = saved ? JSON.parse(saved) : [];
                                                                        existing.push(request);
                                                                        localStorage.setItem('hofherr_restock_requests', JSON.stringify(existing));
                                                                    } catch { }

                                                                    // Send email notification
                                                                    fetch('/api/restock-request', {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify(request),
                                                                    }).catch(() => { });

                                                                    setRestockSubmitted(prev => new Set(prev).add(item.name));
                                                                    setRestockOpen(null);
                                                                    setRestockName('');
                                                                    setRestockContact('');
                                                                    setRestockQty(1);
                                                                    setRestockToast(true);
                                                                    setTimeout(() => setRestockToast(false), 3000);
                                                                }}
                                                            >
                                                                Submit Request
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button className={styles.restockBtn} onClick={() => { setRestockOpen(item.name); setRestockQty(1); setRestockName(''); setRestockContact(''); }}>
                                                            Request Restock
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <button className={styles.addBtn} onClick={() => openModal(item)}>
                                                    Add to Cart
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                    </div>
                </main>
            </div>

            {/* ── Add to Cart Modal ── */}
            {modal && typeof document !== 'undefined' && createPortal((
                <div className={styles.overlay} onClick={() => setModal(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalTitle}>{modal.name}</div>
                        <div className={styles.modalPrice}>{modal.price}</div>
                        {modal.desc && <p className={styles.modalDesc}>{modal.desc}</p>}

                        <div className={styles.qtyRow}>
                            <button className={styles.qtyBtn} onClick={() => setModalQty(q => Math.max(1, q - 1))}>−</button>
                            <span className={styles.qtyNum}>{modalQty}</span>
                            <button className={styles.qtyBtn} onClick={() => setModalQty(q => q + 1)}>+</button>
                        </div>

                        <textarea
                            className={styles.noteInput}
                            placeholder="Special instructions (e.g. thickness, quantity in lbs, trim preferences)…"
                            value={modalNote}
                            onChange={e => setModalNote(e.target.value)}
                            maxLength={250}
                            rows={3}
                        />

                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => setModal(null)}>Cancel</button>
                            <button className={styles.confirmBtn} onClick={(e) => confirmAdd(e)}>Add to Order</button>
                        </div>
                    </div>
                </div>
            ), document.body)}

            {/* ── Cart Drawer ── */}
            {drawerOpen && typeof document !== 'undefined' && createPortal((
                <div className={styles.overlay} onClick={() => setDrawerOpen(false)}>
                    <div className={styles.drawer} onClick={e => e.stopPropagation()}>
                        <div style={{ borderTopLeftRadius: '18px', backgroundColor: 'var(--red)', color: 'white', padding: '8px 16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            📍 Pickup at {activeStore === 'butcher' ? 'The Butcher Shop' : 'The Depot'}
                        </div>
                        <div className={styles.drawerHead}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src="/assets/item.png" alt="" width={80} height={80} style={{ objectFit: 'contain' }} />
                                <div>
                                    <h3>Your Order</h3>
                                    {user && (
                                        <div className={styles.drawerUser}>
                                            <span>Logged in as <strong>{user.name}</strong></span>
                                            <div className={styles.drawerUserLinks}>
                                                <a href="/dashboard">My Dashboard</a>
                                                <button onClick={handleLogout}>Log Out</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setDrawerOpen(false)}>✕</button>
                        </div>

                        {cart.length === 0 ? (
                            <p className={styles.emptyCart}>Your cart is empty.</p>
                        ) : (
                            <>
                                {/* ── Scrollable body ── */}
                                <div className={styles.drawerBody}>
                                    {/* Items */}
                                    <div className={styles.cartItems}>
                                        <div className={styles.drawerSectionLabel} style={{ marginTop: '12px' }}>Your Basket</div>
                                        {cart.map(item => {
                                            const unit = parseItemPrice(item.price);
                                            const isPerLb = item.price.includes('/lb');
                                            const lineEst = unit * item.qty;
                                            return (
                                                <div key={item.name} className={styles.cartItem}>
                                                    <div className={styles.cartItemInfo}>
                                                        <div className={styles.cartItemName}>{item.name}</div>
                                                        <div className={styles.cartItemPrice}>
                                                            {item.price} × {item.qty}
                                                            {unit > 0 && (
                                                                <span style={{ color: '#aaa', marginLeft: 6, fontSize: 11 }}>
                                                                    = {fmtTotal(lineEst)}{isPerLb ? '/lb est.' : ''}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {item.note && <div className={styles.cartItemNote}>📝 {item.note}</div>}
                                                    </div>
                                                    <div className={styles.cartItemControls}>
                                                        <button className={styles.qtyBtn} onClick={() => changeQty(item.name, -1)}>−</button>
                                                        <span className={styles.qtyNum}>{item.qty}</span>
                                                        <button className={styles.qtyBtn} onClick={() => changeQty(item.name, 1)}>+</button>
                                                        <button className={styles.removeBtn} onClick={() => removeItem(item.name)}>✕</button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Order Note */}
                                    <div className={styles.drawerSection}>
                                        <div className={styles.drawerSectionLabel}>📝 Order Note</div>
                                        <textarea
                                            className={styles.drawerNote_input}
                                            placeholder="Any instructions for the whole order? (e.g. call before cutting, vacuum seal, etc.)"
                                            value={orderNote}
                                            onChange={e => setOrderNote(e.target.value)}
                                            rows={2}
                                            maxLength={300}
                                        />
                                    </div>

                                    {/* Upsell strip */}
                                    {(() => {
                                        const cartNames = new Set(cart.map(i => i.name));
                                        const popular = [
                                            { name: 'Dry-Aged Ribeye', price: '$44.99/lb' },
                                            { name: 'House Bratwurst', price: '$8.99/lb' },
                                            { name: 'Beef Tallow', price: '$6.99/lb' },
                                            { name: 'Wagyu Beef Patties', price: '$18.99/lb' },
                                            { name: 'Pork Belly', price: '$9.99/lb' },
                                        ].filter(p => !cartNames.has(p.name)).slice(0, 3);
                                        if (popular.length === 0) return null;
                                        return (
                                            <div className={styles.drawerSection}>
                                                <div className={styles.drawerSectionLabel} style={{ color: '#800020', borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '10px' }}>✨ Recommended Add-ons</div>
                                                <div className={styles.upsellList}>
                                                    {popular.map(p => (
                                                        <div key={p.name} className={styles.upsellItem}>
                                                            <div>
                                                                <div className={styles.upsellName}>{p.name}</div>
                                                                <div className={styles.upsellPrice}>{p.price}</div>
                                                            </div>
                                                            <button
                                                                className={styles.upsellAdd}
                                                                onClick={(e) => {
                                                                    const btn = e.currentTarget;
                                                                    const rect = btn.getBoundingClientRect();
                                                                    triggerFlyAnimation({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
                                                                    setCart(prev => {
                                                                        const exists = prev.find(i => i.name === p.name);
                                                                        if (exists) return prev.map(i => i.name === p.name ? { ...i, qty: i.qty + 1 } : i);
                                                                        return [...prev, { name: p.name, price: p.price, qty: 1, note: '' }];
                                                                    });
                                                                }}
                                                            >+ Add</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* ── Pinned Footer ── */}
                                <div className={styles.drawerFoot}>
                                    <div className={styles.drawerStats}>
                                        <span>🥩 {cart.reduce((s, i) => s + i.qty, 0)} item{cart.reduce((s, i) => s + i.qty, 0) !== 1 ? 's' : ''}</span>
                                        <span>⚖️ ~{cart.filter(i => i.price.includes('/lb')).reduce((s, i) => s + i.qty, 0)} lbs est.</span>
                                    </div>
                                    <div className={styles.drawerTotalRow}>
                                        <span>Estimated Subtotal</span>
                                        <strong>{fmtTotal(cart.reduce((s, i) => s + parseItemPrice(i.price) * i.qty, 0))}</strong>
                                    </div>
                                    <div className={styles.drawerTotalRow}>
                                        <span>Estimated Tax</span>
                                        <strong>{fmtTotal(cart.reduce((s, i) => s + parseItemPrice(i.price) * i.qty, 0) * TAX_RATE)}</strong>
                                    </div>
                                    <div className={`${styles.drawerTotalRow} ${styles.drawerFinalTotal}`}>
                                        <span>Estimated Total</span>
                                        <strong>{fmtTotal(cart.reduce((s, i) => s + parseItemPrice(i.price) * i.qty, 0) * (1 + TAX_RATE))}</strong>
                                    </div>
                                    <p className={styles.drawerPriceNote}>
                                        *Final total is determined by exact scale weight at pickup.<br/>
                                        Prices are estimates. Final adjustment may occur based on actual weight.
                                    </p>
                                    <p className={styles.drawerNote}>Secure checkout · Visa, Apple Pay, Google Pay, PayPal</p>
                                    <button className={styles.checkoutBtn} onClick={() => { 
                                        setDrawerOpen(false); 
                                        if (user) {
                                            setCheckoutStep('form');
                                        } else {
                                            setAuthMode('login'); 
                                            setAuthIntent('checkout'); 
                                            setCheckoutStep('choice');
                                        }
                                        setCheckoutOpen(true); 
                                    }}>
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ), document.body)}

            {/* ── Checkout Modal ── */}
            {checkoutOpen && typeof document !== 'undefined' && createPortal((
                <div className={styles.overlay} onClick={() => !isPending && setCheckoutOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: 480, position: 'relative' }}>

                        <>
                            {checkoutStep === 'choice' ? (
                                <div className={styles.choiceView}>
                                    <div className={styles.choiceSocialHeader} style={{ textAlign: 'center', marginBottom: '4px' }}>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--red)', fontSize: '20px', marginBottom: '0px' }}>
                                            {authMode === 'forgot' ? 'Reset Password' : authMode === 'register' ? 'Create An Account' : 'Welcome Back'}
                                        </h3>
                                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 6px' }}>
                                            {authMode === 'forgot' ? 'We will send you a reset link' : authMode === 'register' ? 'Join for faster checkout & rewards' : 'Sign in to continue to checkout'}
                                        </p>
                                    </div>

                                    <div className={`${styles.choiceLayout} ${styles.choiceFocused}`}>
                                        {(authMode === 'register') && (
                                            <div className={styles.choiceColGuest}>
                                                {authMode === 'register' ? (
                                                    <div className={styles.guestContent}>
                                                        <form className={styles.loginFields} onSubmit={handleRegister}>
                                                            <div className={styles.authRow}>
                                                                <div className={styles.authField}><label htmlFor="reg-name">Full Name</label><input required type="text" id="reg-name" name="name" autoComplete="name" className={styles.authInput} placeholder="John Doe" value={registerData.name} onChange={e => setRegisterData(d => ({ ...d, name: e.target.value }))} /></div>
                                                                <div className={styles.authField}><label htmlFor="reg-phone">Phone</label><input required type="tel" id="reg-phone" name="tel" autoComplete="tel" className={styles.authInput} placeholder="555-555-5555" value={registerData.phone} onChange={e => setRegisterData(d => ({ ...d, phone: formatPhoneNumber(e.target.value) }))} /></div>
                                                            </div>
                                                            <div className={styles.authRow}>
                                                                <div className={styles.authField}><label htmlFor="reg-email">Email</label><input required type="email" id="reg-email" name="email" autoComplete="email" className={styles.authInput} placeholder="your@email.com" value={registerData.email} onChange={e => setRegisterData(d => ({ ...d, email: e.target.value }))} /></div>
                                                                <div className={styles.authField}><label htmlFor="reg-password">Password</label><input required type="password" id="reg-password" name="new-password" autoComplete="new-password" className={styles.authInput} placeholder="••••••••" value={registerData.password} onChange={e => setRegisterData(d => ({ ...d, password: e.target.value }))} /></div>
                                                            </div>
                                                            <div className={styles.authField}><label htmlFor="reg-address">Address</label><input required type="text" id="reg-address" name="address" autoComplete="street-address" className={styles.authInput} placeholder="123 Meat St, Northfield, IL" value={registerData.address} onChange={e => setRegisterData(d => ({ ...d, address: e.target.value }))} /></div>
                                                            
                                                            {authError && authMode === 'register' && <p className={styles.authErrorLine}>⚠️ {authError}</p>}
                                                            <button type="submit" className={styles.loginBtn} style={{ marginTop: '4px', padding: '12px' }} disabled={authLoading}>{authLoading ? 'Creating...' : 'Create Account'}</button>
                                                        </form>
                                                        
                                                        <div className={styles.dividerOr}><span>or sign up with</span></div>
                                                        
                                                        <div className={styles.socialGrid}>
                                                            <button type="button" className={styles.socialBtnFlat} onClick={() => signIn('google', { callbackUrl: '/online-orders' })}>
                                                                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                                                Google
                                                            </button>
                                                            <button type="button" className={styles.socialBtnFlat} onClick={() => signIn('apple', { callbackUrl: '/online-orders' })}>
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.92 14c-.03-2.93 2.4-4.34 2.5-4.4-1.36-2-3.48-2.26-4.22-2.3-1.8-.18-3.52 1.05-4.44 1.05-.9 0-2.32-1-3.8-1-1.92 0-3.68 1.1-4.66 2.82C.3 13.62 1.55 19.38 3.5 22.18c1 1.44 2.18 3.03 3.75 3 1.5-.04 2.1-.96 3.9-.96 1.8 0 2.34.96 3.9.92 1.6-.04 2.6-1.46 3.56-2.88 1.12-1.62 1.58-3.2 1.6-3.28-.02-.02-2.3-1.02-2.3-3.98zm-3.3-8.8c.84-1 1.4-2.4 1.25-3.8-1.2.05-2.65.8-3.5 1.8-.75.86-1.4 2.3-1.2 3.66 1.34.1 2.6-.66 3.45-1.66z"/></svg>
                                                                Apple
                                                            </button>
                                                            <button type="button" className={styles.socialBtnFlat} onClick={() => signIn('azure-ad', { callbackUrl: '/online-orders' })}>
                                                                <svg width="18" height="18" viewBox="0 0 20 20"><rect x="1" y="1" width="8.5" height="8.5" fill="#f25022"/><rect x="10.5" y="1" width="8.5" height="8.5" fill="#7fbb00"/><rect x="1" y="10.5" width="8.5" height="8.5" fill="#00a1f1"/><rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#ffbb00"/></svg>
                                                                Microsoft
                                                            </button>
                                                            <button type="button" className={styles.socialBtnFlat} onClick={() => signIn('facebook', { callbackUrl: '/online-orders' })}>
                                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                                                Facebook
                                                            </button>
                                                        </div>

                                                        <div className={styles.switchAuth} style={{ textAlign: 'center' }}>
                                                            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('login'); }}>Log In</a>
                                                        </div>
                                                        {!user && (
                                                            <button 
                                                                type="button" 
                                                                className={styles.secondaryBtn}
                                                                onClick={() => { setCheckoutStep('form'); setAuthMode(null); }}
                                                            >
                                                                Checkout as Guest instead
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className={styles.guestContent}>
                                                        <h3>Guest Checkout</h3>
                                                        <p>Proceed without an account</p>
                                                        <button type="button" className={styles.guestBtn} onClick={() => setCheckoutStep('form')}>Continue As Guest</button>
                                                        <div className={styles.dividerOr}><span>or</span></div>
                                                        <button type="button" className={styles.createBtn} onClick={() => { setAuthMode('register'); setAuthError(''); }}>Create An Account</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}



                                        {(authMode === 'forgot') && (
                                            <div className={styles.choiceColLogin}>
                                                {forgotSuccess ? (
                                                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                                        <h4 style={{ color: 'var(--red)', marginBottom: '8px' }}>Check Your Email</h4>
                                                        <p style={{ color: 'var(--text-muted)' }}>If an account exists for that email, we've sent a password reset link.</p>
                                                        <button 
                                                            type="button" 
                                                            className={styles.loginBtn} 
                                                            onClick={() => setAuthMode('login')} 
                                                            style={{ marginTop: '24px' }}>
                                                            Back to Login
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <form className={styles.loginFields} onSubmit={handleForgotSubmit}>
                                                        <div className={styles.authField}>
                                                            <label htmlFor="forgot-email">Email Address</label>
                                                            <input type="email" id="forgot-email" className={styles.authInput} placeholder="your@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                                                        </div>
                                                        {authError && authMode === 'forgot' && <p className={styles.authErrorLine}>⚠️ {authError}</p>}
                                                        <button type="submit" className={styles.loginBtn} disabled={authLoading}>{authLoading ? 'Sending...' : 'Send Reset Link'}</button>
                                                        <div className={styles.forgotPass} style={{ marginTop: '12px', textAlign: 'center' }}>
                                                            <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('login'); setAuthError(''); }}>Nevermind, I remember it</a>
                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        )}

                                        {(authMode === 'login') && (
                                            <div className={styles.choiceColLogin}>
                                                <form className={styles.loginFields} onSubmit={handleLogin}>
                                                    <div className={styles.authField}><label htmlFor="login-email">Email Address</label><input type="email" id="login-email" name="email" autoComplete="email" className={styles.authInput} placeholder="your@email.com" value={loginData.email} onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))} /></div>
                                                    <div className={styles.authField}><label htmlFor="login-password">Password</label><input type="password" id="login-password" name="password" autoComplete="current-password" className={styles.authInput} placeholder="••••••••" value={loginData.password} onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))} /></div>
                                                    <div className={styles.forgotPass}><a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('forgot'); setAuthError(''); }}>Forgot password?</a></div>
                                                    {authError && authMode === 'login' && <p className={styles.authErrorLine}>⚠️ {authError}</p>}
                                                    <button type="submit" className={styles.loginBtn} disabled={authLoading}>{authLoading ? 'Logging in...' : 'Log In'}</button>
                                                </form>

                                                <div className={styles.dividerOr}><span>or sign in with</span></div>

                                                <div className={styles.socialGrid}>
                                                    <button type="button" className={styles.socialBtnFlat} onClick={() => signIn('google', { callbackUrl: '/online-orders' })}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                                        Google
                                                    </button>
                                                    <button type="button" className={styles.socialBtnFlat} onClick={() => signIn('apple', { callbackUrl: '/online-orders' })}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.92 14c-.03-2.93 2.4-4.34 2.5-4.4-1.36-2-3.48-2.26-4.22-2.3-1.8-.18-3.52 1.05-4.44 1.05-.9 0-2.32-1-3.8-1-1.92 0-3.68 1.1-4.66 2.82C.3 13.62 1.55 19.38 3.5 22.18c1 1.44 2.18 3.03 3.75 3 1.5-.04 2.1-.96 3.9-.96 1.8 0 2.34.96 3.9.92 1.6-.04 2.6-1.46 3.56-2.88 1.12-1.62 1.58-3.2 1.6-3.28-.02-.02-2.3-1.02-2.3-3.98zm-3.3-8.8c.84-1 1.4-2.4 1.25-3.8-1.2.05-2.65.8-3.5 1.8-.75.86-1.4 2.3-1.2 3.66 1.34.1 2.6-.66 3.45-1.66z"/></svg>
                                                        Apple
                                                    </button>
                                                    <button type="button" className={styles.socialBtnFlat} onClick={() => signIn('azure-ad', { callbackUrl: '/online-orders' })}>
                                                        <svg width="18" height="18" viewBox="0 0 20 20"><rect x="1" y="1" width="8.5" height="8.5" fill="#f25022"/><rect x="10.5" y="1" width="8.5" height="8.5" fill="#7fbb00"/><rect x="1" y="10.5" width="8.5" height="8.5" fill="#00a1f1"/><rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#ffbb00"/></svg>
                                                        Microsoft
                                                    </button>
                                                    <button type="button" className={styles.socialBtnFlat} onClick={() => signIn('facebook', { callbackUrl: '/online-orders' })}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                                        Facebook
                                                    </button>
                                                </div>

                                                <div className={styles.switchAuth} style={{ textAlign: 'center' }}>
                                                    Don&apos;t have an account? <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('register'); setAuthError(''); }}>Sign Up</a>
                                                </div>
                                                {!user && (
                                                    <button 
                                                        type="button" 
                                                        className={styles.secondaryBtn}
                                                        onClick={() => { setCheckoutStep('form'); setAuthMode(null); }}
                                                    >
                                                        Checkout as Guest instead
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className={styles.modalTitle} style={{ letterSpacing: '-0.02em', marginBottom: '8px' }}>
                                        Complete Your Order
                                    </div>
                                    <div style={{ fontSize: '18px', fontWeight: 700, backgroundColor: 'rgba(128,0,32,0.1)', color: 'var(--red)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid rgba(128,0,32,0.2)' }}>
                                        {activeStore === 'butcher' ? '📍 Pickup at: The Butcher Shop (Northfield)' : '📍 Pickup at: The Depot (Winnetka)'}
                                    </div>
                                    <p className={styles.modalDesc}>
                                        {activeStore === 'butcher' 
                                            ? "Just a few final details to get your prime cuts ready for pickup." 
                                            : "Just a few final details to get your order ready for pickup."}
                                    </p>

                                    <div className={styles.formGroup}>
                                        <div className={styles.formFields}>
                                            {/* Two-column contact layout */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'start' }}>
                                                {/* Left col: Name + phone/email input */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <input
                                                        required
                                                        name="name"
                                                        id="checkout-name"
                                                        autoComplete="name"
                                                        className={styles.formInput}
                                                        placeholder="John Smith"
                                                        value={form.name}
                                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                                        style={{ margin: 0 }}
                                                    />
                                                    {contactPref === 'phone' ? (
                                                        <input
                                                            required
                                                            name="tel"
                                                            id="checkout-phone"
                                                            autoComplete="tel"
                                                            className={styles.formInput}
                                                            placeholder="(847) 555-0100"
                                                            type="tel"
                                                            value={form.phone}
                                                            onChange={e => {
                                                                const formatted = formatPhoneNumber(e.target.value);
                                                                setForm(f => ({ ...f, phone: formatted }));
                                                            }}
                                                            style={{ margin: 0 }}
                                                        />
                                                    ) : (
                                                        <input
                                                            required
                                                            name="email"
                                                            id="checkout-email"
                                                            autoComplete="email"
                                                            className={styles.formInput}
                                                            placeholder="Email Address"
                                                            type="email"
                                                            value={form.email}
                                                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                                            style={{ margin: 0 }}
                                                        />
                                                    )}
                                                </div>
                                                {/* Right col: label + toggle */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <span className={styles.contactPrefLabel}>How should we reach you?</span>
                                                    <div className={styles.contactPrefToggle}>
                                                        <button
                                                            type="button"
                                                            className={`${styles.contactPrefBtn} ${contactPref === 'phone' ? styles.contactPrefBtnActive : ''}`}
                                                            onClick={() => { setContactPref('phone'); setForm(f => ({ ...f, email: '' })); }}
                                                        >📞 Call Me</button>
                                                        <button
                                                            type="button"
                                                            className={`${styles.contactPrefBtn} ${contactPref === 'email' ? styles.contactPrefBtnActive : ''}`}
                                                            onClick={() => { setContactPref('email'); setForm(f => ({ ...f, phone: '' })); }}
                                                        >✉️ Email Me</button>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className={styles.pickupScheduler}>
                                                <label className={styles.pickupLabel}>Select Pickup Day & Time</label>
                                                <p className={styles.prepTimeNote}>⚡ Orders generally take 20-40 minutes to prepare.</p>
                                                <div className={styles.dateSelectorContainer}>
                                                    <div className={styles.dateScrollTrack}>
                                                        {dateThumbWidth > 0 && (
                                                            <div 
                                                                ref={dateThumbRef}
                                                                className={styles.dateScrollThumb}
                                                                style={{ left: dateThumbLeft, width: dateThumbWidth }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className={styles.dateSelector} ref={dateScrollRef} onScroll={updateDateThumb}>
                                                        {availableDates.map((date, idx) => (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                className={`${styles.dateBtn} ${selectedDateIdx === idx ? styles.dateBtnActive : ''}`}
                                                                onClick={() => setSelectedDateIdx(idx)}
                                                            >
                                                                <span className={styles.dateDay}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                                <span className={styles.dateNum}>{date.toLocaleDateString('en-US', { day: 'numeric' })}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className={styles.timeSelector}>
                                                    <div className={styles.timeGrid}>
                                                         {(() => {
                                                            const currentDateStr = availableDates[selectedDateIdx]?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                                                            return availableSlots.length > 0 ? (
                                                                availableSlots.map(slot => {
                                                                    const fullSlotStr = `${currentDateStr} at ${slot.value}`;
                                                                    const isActive = form.pickup === fullSlotStr;
                                                                    return (
                                                                        <button
                                                                            key={slot.value}
                                                                            type="button"
                                                                            disabled={slot.disabled}
                                                                            className={`${styles.timeSlotBtn} ${isActive ? styles.timeSlotBtnActive : ''} ${slot.disabled ? styles.timeSlotBtnDisabled : ''}`}
                                                                            onClick={() => {
                                                                                if (slot.disabled) return;
                                                                                setForm(f => ({ ...f, pickup: fullSlotStr }));
                                                                            }}
                                                                        >
                                                                            {slot.label === slot.value + ' (ASAP)' ? (
                                                                                <>
                                                                                    <span style={{ display: 'block' }}>{slot.value}</span>
                                                                                    <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, opacity: 0.8 }}>(ASAP)</span>
                                                                                </>
                                                                            ) : (
                                                                                slot.label
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })
                                                            ) : (
                                                                <p className={styles.noSlots}>No pickup times available for this date. Please select another day.</p>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>

                                        <div className={styles.orderSummary}>
                                            <div className={styles.summaryTitle}>Order Summary</div>
                                            {/* Custom scrollbar wrapper */}
                                            <div className={styles.summaryScrollWrap}>
                                                <div
                                                    ref={el => {
                                                        (summaryRowsRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                                                        if (el) setTimeout(updateThumb, 50);
                                                    }}
                                                    className={styles.summaryRows}
                                                    onScroll={updateThumb}
                                                >
                                                    {cart.map(i => (
                                                        <div key={i.name} className={styles.summaryRow}>
                                                            <span>{i.name} ×{i.qty}{i.note ? ` · ${i.note}` : ''}</span>
                                                            <span>{i.price}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Custom always-visible scrollbar track */}
                                                <div className={styles.customScrollTrack}>
                                                    {thumbHeight > 0 && (
                                                        <div
                                                            className={styles.customScrollThumb}
                                                            style={{ height: thumbHeight, top: thumbTop }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            {/* Pinned stats footer */}
                                            <div className={styles.summaryStats}>
                                                <div className={styles.statRow}>
                                                    <span>
                                                        {cart.reduce((s, i) => s + i.qty, 0)} item{cart.reduce((s, i) => s + i.qty, 0) !== 1 ? 's' : ''}
                                                    </span>
                                                    <span>
                                                        ~{cart.filter(i => i.price.includes('/lb')).reduce((s, i) => s + i.qty, 0)} lbs
                                                    </span>
                                                </div>

                                                {form.pickup && (
                                                    <div className={styles.pickupSummaryRow}>
                                                        <span>Your Scheduled Pickup</span>
                                                        <span>{form.pickup}</span>
                                                    </div>
                                                )}
                                                
                                                <div className={styles.discountRow}>
                                                    <span>Estimated Tax (2.25%)</span>
                                                    <span>{fmtTotal(cart.reduce((s, i) => s + parseItemPrice(i.price) * i.qty, 0) * TAX_RATE)}</span>
                                                </div>

                                                <span className={styles.summaryEstTotal}>
                                                    Est. Total {(() => {
                                                        const subtotal = cart.reduce((s, i) => s + parseItemPrice(i.price) * i.qty, 0);
                                                        let discounted = subtotal;
                                                        if (appliedCoupon) {
                                                            if (appliedCoupon.type === 'percent') {
                                                                discounted = subtotal * (1 - appliedCoupon.value / 100);
                                                            } else {
                                                                discounted = Math.max(0, subtotal - appliedCoupon.value);
                                                            }
                                                        }
                                                        const total = discounted * (1 + TAX_RATE);
                                                        return fmtTotal(total);
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {stripeError && <p className={styles.stripeError}>⚠️ {stripeError}</p>}

                                    <div className={styles.payBadgesWrap}>
                                        <div className={styles.paymentMethodToggle}>
                                            <label className={`${styles.payToggleBtn} ${paymentMethod === 'stripe' ? styles.payToggleBtnActive : ''}`}>
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    value="stripe"
                                                    checked={paymentMethod === 'stripe'}
                                                    onChange={() => setPaymentMethod('stripe')}
                                                    style={{ display: 'none' }}
                                                />
                                                <span className={styles.payToggleLabel}>💳 Pay Online</span>
                                            </label>
                                            <label className={`${styles.payToggleBtn} ${paymentMethod === 'instore' ? styles.payToggleBtnActive : ''}`}>
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    value="instore"
                                                    checked={paymentMethod === 'instore'}
                                                    onChange={() => setPaymentMethod('instore')}
                                                    style={{ display: 'none' }}
                                                />
                                                <span className={styles.payToggleLabel}>🏪 Pay In-Store</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className={styles.modalActions}>
                                        <button type="button" className={styles.cancelBtn} onClick={() => setCheckoutStep('choice')} disabled={isPending}>Back</button>
                                        <button type="submit" className={styles.confirmBtn} disabled={isPending}>
                                            {isPending ? 'Processing…' : (paymentMethod === 'stripe' ? 'Continue to Payment' : 'Place Order')}
                                        </button>
                                    </div>

                                    <p className={styles.stripeNote}>🔒 Powered by Stripe · 256-bit SSL</p>
                                </form>
                            )}
                        </>
                    </div>
                </div>
            ), document.body)}
            <HelpOrdering />
            {/* Restock success toast */}
            <div className={`${styles.restockToast} ${restockToast ? styles.restockToastShow : ''}`}>
                Restock request sent ✓
            </div>
        </div>
    );
}
