'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './extended.module.css';

/**
 * Sections 05–10 of the product identity system.
 * Images live in /public/assets/identity/extended/<slug>.jpg — generate each with
 * Gemini (Nano Banana) using the prompt on its card, then save it under that filename.
 * Until a file exists, the card shows a placeholder with the target filename.
 */

const BRAND_STYLE =
    'Photorealistic commercial product photography for Hofherr Meat Co., a premium Midwest butcher shop in Northfield, Illinois. ' +
    'Brand style: distressed woodblock / linocut illustration featuring the 10 official Hofherr department flame emblems (1. Prime Beef Flaming Cow, 2. Heritage Pork Flaming Pig, 3. Poultry & Rotisserie Flaming Rooster, 4. Pasture Lamb Flaming Sheep Head, 5. Artisanal Cheese Flaming Wedge, 6. Stocks & Soups Flaming Bowl, 7. Fresh Catch Flaming Leaping Fish, 8. Shellfish & Crab Flaming Maine Lobster, 9. Specialty Duck Flaming Duck Head, 10. Catering & Delivery Flaming Vintage Truck), bold stencil wordmark "HOFHERR MEAT CO.", ' +
    'two-color print in oxblood crimson (#8B0A10) and smokehouse amber (#F59B1A) on natural kraft and warm cream stock, charcoal (#1C1614) accents. ' +
    'Moody warm side lighting, dark walnut butcher block and slate surfaces, shallow depth of field. ' +
    'All printed text crisp, legible and spelled exactly as written. No extra logos, no watermarks.';

type IdentityItem = {
    slug: string;
    title: string;
    spec: string;
    ratio: string; // Nano Banana aspect ratio, also used for the card frame
    prompt: string;
    printPrompt: string;
};

type IdentitySection = {
    id: string;
    index: string;
    title: string;
    desc: string;
    items: IdentityItem[];
};

export const EXTENDED_SECTIONS: IdentitySection[] = [
    {
        id: 'retail-packaging',
        index: '05',
        title: 'Retail & Cold-Case Packaging',
        desc: 'Pre-packed product leaving the case needs more than a scale label: vacuum-pack front and back labels with the USDA safe-handling panel, case-ready tray labels, freezer wrap for bulk orders, and labels for broths, tallow, rubs and sauces.',
        items: [
            {
                slug: 'cryovac-label-front-back',
                title: 'Vacuum-Pack Front & Back Labels',
                spec: '4" × 3" front · 4" × 4" back · freezer-grade BOPP, cold-temp adhesive',
                ratio: '4:3',
                prompt: 'Two vacuum-sealed dry-aged ribeye steaks on a slate surface, one showing the front and one flipped to show the back. Front label: cream stock, "HOFHERR MEAT CO." stencil wordmark, small crimson woodcut cow flame emblem, cut name "DRY-AGED RIBEYE", weight and price fields. Back label: a black-bordered "SAFE HANDLING INSTRUCTIONS" panel with the standard four icons, a small nutrition facts panel, "Packed in Northfield, IL".',
                printPrompt: 'Flat 2D print production dieline sheet showing the 4"×3" Front Label and 4"×4" Back Label side by side on a clean studio sheet with crop marks: warm cream stock (#F3EAD8), oxblood crimson (#8B0A10) border, "HOFHERR MEAT CO. · NORTHFIELD, IL" stencil header, Flaming Bull emblem, "USDA PRIME DRY-AGED RIBEYE", weight/price fields, and official USDA "SAFE HANDLING INSTRUCTIONS" + Nutrition Facts panel.',
            },
            {
                slug: 'case-ready-tray-labels',
                title: 'Case-Ready Tray Overwrap Labels',
                spec: '2.5" × 3.5" thermal top-coat · printed brand header + variable scale data',
                ratio: '4:3',
                prompt: 'A row of black foam-free paper trays of ground beef, pork chops and chicken thighs under clear overwrap in a refrigerated butcher case, each with a small rectangular label: crimson top band with "HOFHERR MEAT CO." in cream, amber department flame icon, price per pound, net weight and total price.',
                printPrompt: 'Flat 2D print-ready label sheet displaying 3 vertical thermal scale labels (2.5"×3.5" each) side by side, straight-on orthographic view: Prime Beef (80/20 Ground Chuck, Flaming Cow badge), Heritage Pork (Bone-In Pork Chops, Flaming Pig badge), and Poultry (Pasture-Raised Chicken Thighs, Flaming Rooster badge) with scale data fields and barcodes.',
            },
            {
                slug: 'freezer-paper-bulk-order',
                title: 'Freezer Paper & Bulk-Order Bundles',
                spec: 'Poly-coated freezer paper · 1-color crimson print · write-in cut / date field',
                ratio: '4:3',
                prompt: 'A stack of tightly wrapped white poly-coated freezer paper packages tied with twine, inside an open chest freezer basket. Each package has a printed crimson "HOFHERR MEAT CO." band and a write-in box reading "CUT ____ DATE ____ LBS ____" filled in with black marker. A kraft box labeled "QUARTER BEEF SHARE" sits beside them.',
                printPrompt: 'Flat 2D print-ready flexographic plate on white background showing the 1-color oxblood crimson (#8B0A10) print master for Hofherr bulk freezer paper ("HOFHERR MEAT CO. · NORTHFIELD, IL · EST. 2018", circular scalloped Flaming Bull stamp seals, write-in CUT / DATE / WEIGHT form box) and the "QUARTER BEEF SHARE · KEEP FROZEN" shipping carton plate.',
            },
            {
                slug: 'jar-tub-labels',
                title: 'Broth, Tallow, Rub & Sauce Labels',
                spec: 'Quart deli tub · 8 oz amber jar · 4 oz spice tin · wraparound labels',
                ratio: '16:9',
                prompt: 'A lineup on a walnut butcher block: a clear quart deli tub of golden bone broth, an amber glass jar of rendered beef tallow, a metal tin of steak rub, and a bottle of barbecue sauce. All share wraparound kraft labels with crimson linocut illustration, the "HOFHERR MEAT CO." stencil wordmark, a small product-specific flame emblem and product names "24-HOUR BONE BROTH", "BEEF TALLOW", "PITMASTER RUB", "SMOKEHOUSE BBQ SAUCE".',
                printPrompt: 'Flat 2D print-ready label sheet showing 4 unrolled horizontal wraparound rectangle labels laid out flat in a 2×2 grid with crop marks: "24-HOUR BONE BROTH" (Flaming Soup Bowl), "RENDERED BEEF TALLOW" (Flaming Cow), "PITMASTER STEAK & BRISKET RUB" (Flaming Pig), and "SMOKEHOUSE BOURBON BBQ SAUCE" (Flaming Delivery Truck) with ingredients, net weights, and barcodes.',
            },
        ],
    },
    {
        id: 'carryout-gifting',
        index: '06',
        title: 'Carry-Out, Catering & Gifting',
        desc: 'The pieces that travel furthest from the counter: insulated totes for summer pickups, catering boxes for the whole-hog side of the business, a steak gift box for the holidays, and gift cards.',
        items: [
            {
                slug: 'insulated-tote',
                title: 'Insulated Cooler Tote',
                spec: 'Reusable non-woven insulated tote · 1-color crimson screen print',
                ratio: '1:1',
                prompt: 'A reusable insulated cooler tote bag in warm cream canvas with a large crimson woodcut flame-and-cow illustration and "HOFHERR MEAT CO. · NORTHFIELD, IL" printed on the side, sitting on a butcher counter with wrapped parcels peeking out of the top.',
                printPrompt: 'Flat 2D screen-print production artwork on warm cream background (#F3EAD8) with corner registration marks: large distressed two-color woodcut circular seal and Flaming Bull Head emblem in oxblood crimson (#8B0A10) and smokehouse amber (#F59B1A), bold arched stencil headline "HOFHERR MEAT CO. · PRIME BUTCHER & SMOKEHOUSE · NORTHFIELD, IL · EST. 2018", and a bottom strip of all 10 department icons.',
            },
            {
                slug: 'catering-box',
                title: 'Catering Box & Tray Sleeve',
                spec: 'Corrugated kraft catering box · crimson lid print · amber tray sleeve',
                ratio: '16:9',
                prompt: 'An open corrugated kraft catering box filled with sliced brisket, pulled pork and smoked chicken, plus a full-size aluminum tray wrapped in an amber paper sleeve. The box lid shows a big crimson linocut whole-hog over flames illustration with "HOFHERR CATERING · WHOLE HOG & EVENT BBQ". A rubber-stamped order tag is tied on with twine.',
                printPrompt: 'Flat 2D corrugated box lid print plate + unfolded wrap-around tray belly band dieline on natural kraft stock (#C8A47E): left panel shows the oxblood crimson & amber woodcut whole-hog & catering truck artwork ("HOFHERR CATERING · WHOLE HOG & EVENT BBQ · NORTHFIELD, IL"); right panel shows the unfolded smokehouse amber (#F59B1A) aluminum-pan sleeve with write-in item, servings, and reheating instructions.',
            },
            {
                slug: 'steak-gift-box',
                title: 'Steak Gift Box',
                spec: 'Rigid charcoal box · 10-icon butcher paper liner · department sticker seals',
                ratio: '4:3',
                prompt: 'A premium rigid charcoal gift box, lid off, lined with the authentic 10-icon Hofherr butcher wrapping paper (Flaming Cow, Pig, Rooster, Lamb, Cheese, Soup Bowl, Fish, Maine Lobster, Duck, Delivery Truck), holding four vacuum-sealed steaks with circular amber department sticker seals. A crimson paper belly band with cream "HOFHERR MEAT CO. · THE BUTCHER\'S BOX" printed in stencil type, and a small kraft gift note card tucked in the corner.',
                printPrompt: 'Flat 2D print-ready dieline sheet showing the unfolded oxblood crimson belly band sleeve ("HOFHERR MEAT CO. · THE BUTCHER\'S BOX · HAND-CUT PRIME STEAKS") and the front & back of the Gift Enclosure Card ("FROM THE BLOCK TO YOUR TABLE" with the 10 circular department emblems, To/From message lines, and Steak Cooking & Resting Guide).',
            },
            {
                slug: 'gift-cards',
                title: 'Gift Cards & Certificates',
                spec: 'Card stock 3.375" × 2.125" · kraft sleeve with rubber-stamp seal',
                ratio: '4:3',
                prompt: 'Two plastic gift cards fanned out on a walnut block: one crimson with a cream woodcut flame emblem and "HOFHERR MEAT CO. GIFT CARD", one amber with a crimson linocut cow. A kraft paper sleeve beside them sealed with a crimson rubber-stamp circular seal.',
                printPrompt: 'Flat 2D print production layout showing the front and back of the 3.375"×2.125" CR80 Gift Cards (Crimson & Amber variants with magnetic stripe and barcode back) alongside the unfolded die-cut Kraft Gift Card Sleeve stamped with the circular scalloped "HOFHERR MEAT CO. · NORTHFIELD, IL · EST. 2018" seal.',
            },
        ],
    },
    {
        id: 'signage',
        index: '07',
        title: 'In-Store Signage',
        desc: 'Everything a customer reads while standing at the case: price tags, a butcher cut chart and 10-department emblem poster drawn in the linocut style, menu boards, door graphics and farm-source signage.',
        items: [
            {
                slug: 'case-price-tags',
                title: 'Meat Case Price Tags',
                spec: 'Slate-look tags on brass picks · cut / grade / $ per lb / source farm',
                ratio: '16:9',
                prompt: 'Close-up inside a glass butcher meat case: small charcoal tags on brass picks stuck into cuts of beef, each printed in cream and amber with cut name, "USDA PRIME" grade, price per pound, and "Source: Illinois family farm", topped with a tiny crimson flame emblem and "HOFHERR".',
                printPrompt: 'Flat 2D printable gang-run sheet of 6 charcoal (#1C1614) meat-case price tags (3×2 grid) with die-cut trim marks for Dry-Aged Bone-In Ribeye, Heritage Berkshire Pork Chop, Amish Whole Roasting Chicken, Domestic Rack of Lamb, Fresh Atlantic Salmon Fillet, and Cold-Water Maine Lobster Tail, each with its circular department flame badge, grade, $/LB, and farm origin.',
            },
            {
                slug: 'cut-chart-poster',
                title: 'Butcher Cut Chart & 10-Department Poster',
                spec: '24" × 36" poster · primal cuts + 10 department emblems · 2-color linocut',
                ratio: '2:3',
                prompt: 'A framed vintage-style butcher cut chart poster on a white subway-tile wall. Top half shows a linocut illustration of a steer divided into labeled primal cuts in crimson lines on cream paper with amber fills — top row head to tail CHUCK, RIB, SHORT LOIN, SIRLOIN, ROUND; bottom row BRISKET, PLATE, FLANK; front leg SHANK. Small callouts: Ribeye points into RIB, NY Strip and Porterhouse into SHORT LOIN, Filet Mignon to a dashed tenderloin inside the short loin and sirloin, Skirt Steak into PLATE, Flank Steak into FLANK; bottom half displays a 2×5 grid of circular department emblems, each captioned with one short label spelled exactly: PRIME BEEF, HERITAGE PORK, POULTRY, PASTURE LAMB, CHEESE, STOCKS & SOUPS, FRESH CATCH, SHELLFISH, DUCK, CATERING — no smaller sub-captions, and "HOFHERR MEAT CO. · KNOW YOUR CUTS & DEPARTMENTS" across the top in stencil type.',
                printPrompt: 'Full-bleed flat 2D print-ready 24"×36" poster artwork on warm vintage cream stock (#F3EAD8) with oxblood crimson & amber double border: "HOFHERR MEAT CO. · KNOW YOUR CUTS & DEPARTMENTS", large 2-color woodcut diagram of a steer with primals CHUCK, RIB, SHORT LOIN, SIRLOIN, ROUND, BRISKET, PLATE, FLANK, SHANK (ribeye callout in RIB, strip and porterhouse in SHORT LOIN, filet as a dashed tenderloin inside short loin and sirloin), and a bottom 2×5 grid of circular department emblems with single-line labels only: PRIME BEEF, HERITAGE PORK, POULTRY, PASTURE LAMB, CHEESE, STOCKS & SOUPS, FRESH CATCH, SHELLFISH, DUCK, CATERING. All text spelled exactly.',
            },
            {
                slug: 'menu-board-aframe',
                title: 'Menu Board & Sidewalk A-Frame',
                spec: 'Chalkboard menu template · sandwich-board A-frame with header plaque',
                ratio: '4:3',
                prompt: 'A wooden sidewalk A-frame chalkboard outside a brick butcher shop, with a printed crimson header plaque reading "HOFHERR MEAT CO." and hand-chalked specials below: "FRESH TODAY · DRY-AGED RIBEYE · SMOKED BRISKET SANDWICH". Behind it a large wall menu board inside the shop window in the same style.',
                printPrompt: 'Flat 2D print-ready menu board graphic layout on dark smokehouse charcoal (#1C1614) with an oxblood crimson (#8B0A10) top header plaque reading "HOFHERR MEAT CO. · FROM THE BLOCK & SMOKEHOUSE", two structured columns ("PRIME BUTCHER CUTS" and "DAILY SMOKEHOUSE & DELI") with prices and circular department badges, and Northfield address footer.',
            },
            {
                slug: 'door-decal-hours',
                title: 'Door Decal & Store Hours',
                spec: 'Gold-leaf + crimson window vinyl · hours, phone, address',
                ratio: '3:4',
                prompt: 'A glass shop door with a hand-painted-style window graphic: gold-leaf and crimson "HOFHERR MEAT CO." arched wordmark, a woodcut flame emblem, "THE BUTCHER SHOP · EST. 2018", and store hours listed below with the phone number "(847) 441-MEAT". Warm interior light glowing through the glass at dusk.',
                printPrompt: 'Flat 2D vector-style window vinyl decal production file on a dark charcoal backing sheet showing the die-cut gold-leaf (#F59B1A), cream (#F3EAD8), and oxblood crimson (#8B0A10) graphics straight-on: arched "HOFHERR MEAT CO.", circular scalloped Flaming Bull seal, "THE BUTCHER SHOP · NORTHFIELD, IL", and store hours ("TUE–SAT 10–6 · SUN 10–4 · MON CLOSED · (847) 441-MEAT").',
            },
            {
                slug: 'farm-source-sign',
                title: 'Farm Source & 10-Department Story Sign',
                spec: 'Wall-mounted wood panel · Midwest map + 10 circular department emblems',
                ratio: '16:9',
                prompt: 'A large wall-mounted reclaimed wood sign above a butcher counter titled "WHERE OUR MEAT COMES FROM · HOFHERR MEAT CO.", with a crimson linocut map of the Midwest & Great Lakes flanked by the 10 circular golden-amber and oxblood-crimson department flame emblems (Cow, Pig, Rooster, Lamb, Cheese, Soup Bowl, Fish, Maine Lobster, Duck, Delivery Truck) with partner farm callout lines.',
                printPrompt: 'Flat 2D print-ready wide wall mural graphic on warm cream/kraft stock framed in oxblood crimson: "WHERE OUR MEAT COMES FROM · HOFHERR MEAT CO. · MIDWEST FAMILY FARMS", central 2-color woodcut map of Illinois, Wisconsin, Indiana, Iowa, and Michigan with farm pins, flanked by 5 circular department emblems on the left and 5 on the right.',
            },
        ],
    },
    {
        id: 'uniforms-stationery',
        index: '08',
        title: 'Uniforms & Stationery',
        desc: 'What the team wears and hands over: aprons, caps, butcher coats and the 10 woven department merit patches, plus business cards, letterhead, a 10-department custom-cut order pad and a 10-department loyalty punch card.',
        items: [
            {
                slug: 'apron-coat-cap',
                title: 'Aprons, Butcher Coats & 10 Department Patches',
                spec: 'Waxed canvas apron · white butcher coat · 10 woven department patches',
                ratio: '3:4',
                prompt: 'Flat lay on dark wood: a heavy waxed-canvas brown butcher apron with leather straps and a circular embroidered Flaming Cow patch on the chest, a crisp white butcher coat with embroidered "HOFHERR MEAT CO." lettering, a charcoal cap with the Flaming Pig patch, and a neat collector row of all 10 circular woven Hofherr department patches (Cow, Pig, Rooster, Lamb, Cheese, Soup, Fish, Maine Lobster, Duck, Truck).',
                printPrompt: 'Flat 2D embroidery & woven patch production spec sheet showing the primary circular scalloped "HOFHERR MEAT CO. · NORTHFIELD, IL · EST. 2018" chest patch, coat embroidery lockup with PMS thread color callouts, and the complete 2×5 production grid of all 10 official 3-inch circular merrowed-edge department patches.',
            },
            {
                slug: 'business-cards-letterhead',
                title: 'Business Cards & Letterhead',
                spec: '32pt cotton card, letterpress crimson + amber edge paint · A4/Letter letterhead',
                ratio: '4:3',
                prompt: 'Stationery flat lay on slate: thick cream letterpress business cards with crimson-painted edges and a deep-impression "HOFHERR MEAT CO." wordmark, the back in solid crimson with a cream woodcut flame. Matching letterhead and a kraft envelope with a crimson rubber-stamped return address "300 Happ Rd · Northfield, IL".',
                printPrompt: 'Flat 2D print-ready stationery dieline sheet with crop marks showing the 8.5"×11" Letterhead (top circular scalloped Flaming Bull seal, bottom 10-department icon bar), 3.5"×2" Business Card Front & Back, and #10 Envelope flat layout with crimson return-address stamp.',
            },
            {
                slug: 'custom-cut-order-pad',
                title: '10-Department Custom-Cut Order Pad',
                spec: '5.5" × 8.5" carbonless 2-part pad · 10 department icon checkboxes + cut specs',
                ratio: '3:4',
                prompt: 'A carbonless two-part order pad on a butcher counter next to a brass pen and a cleaver. Header: "HOFHERR MEAT CO. · CUSTOM CUT ORDER" in crimson stencil type. Features a 2×5 grid of the 10 official Hofherr woodcut department icons with printed checkboxes (Prime Beef, Heritage Pork, Poultry, Pasture Lamb, Cheese, Stocks & Soups, Fresh Catch, Shellfish Lobster, Specialty Duck, Catering), plus handwritten fields for Cut, Thickness, Weight and Pickup Date.',
                printPrompt: 'Full-bleed flat 2D print-ready 5.5"×8.5" "CUSTOM CUT & SPECIAL ORDER TICKET" form artwork on warm cream paper (#F3EAD8): oxblood crimson stencil header, Customer/Date/Pickup fields, a 2×5 checkbox grid of all 10 official Hofherr woodcut department icons, a ruled Cut Specifications table (Cut, Grade, Thickness, Bone-In/Boneless, Weight, Instructions), and the circular Hofherr stamp seal.',
            },
            {
                slug: 'loyalty-punch-card',
                title: '10-Department Loyalty Stamp Card',
                spec: 'Kraft card · 10 department emblem stamp slots · walnut & brass stamp',
                ratio: '4:3',
                prompt: 'A natural kraft loyalty card on a walnut butcher block reading "HOFHERR MEAT CO. · TOUR OF THE BLOCK · COLLECT ALL 10 DEPARTMENTS" with a 2×5 grid of the 10 official Hofherr department flame emblems (Cow, Pig, Rooster, Lamb, Cheese, Soup Bowl, Fish, Maine Lobster, Duck, Delivery Truck) stamped in oxblood crimson ink. A turned walnut and brass rubber hand stamp and crimson ink pad sit beside it.',
                printPrompt: 'Flat 2D print-ready front-and-back layout of the 3.5"×2" Kraft Loyalty Stamp Card with bleed and trim marks: Front shows "HOFHERR MEAT CO. · TOUR OF THE BLOCK · COLLECT ALL 10 DEPARTMENTS" with a 2×5 grid of 10 circular department stamp targets; Back shows the circular scalloped "HOFHERR MEAT CO. · NORTHFIELD, IL · EST. 2018" rubber stamp emblem and reward terms.',
            },
        ],
    },
    {
        id: 'digital',
        index: '09',
        title: 'Digital & Social',
        desc: 'The same register on screen: social templates for weekly specials, an email header with the 10-department badge bar, the Google Business cover image, and the app icon / 10-badge suite.',
        items: [
            {
                slug: 'social-templates',
                title: 'Social Post Templates',
                spec: '1080 × 1350 feed · 1080 × 1920 story · weekly specials / new cut / behind the block',
                ratio: '16:9',
                prompt: 'A mockup of three smartphone screens side by side showing Instagram posts for a butcher shop: a "THIS WEEK\'S SPECIALS" post on crimson with cream stencil type and a woodcut flame frame, a "NEW CUT: PICANHA" post with a moody steak photo and amber linocut border, and a "BEHIND THE BLOCK" story showing a butcher breaking down beef. All branded "HOFHERR MEAT CO.".',
                printPrompt: 'Flat 2D design sheet showing 3 side-by-side vertical social media graphic templates (no phone frames): "THIS WEEK\'S BUTCHER SPECIALS" on oxblood crimson, "FEATURED CUT OF THE WEEK: 45-DAY DRY-AGED PRIME RIBEYE" on dark charcoal with amber linocut border, and "TOUR OF THE 10 DEPARTMENTS" on warm cream showing the 2×5 department badge grid.',
            },
            {
                slug: 'email-header',
                title: 'Newsletter Email Header',
                spec: '1200 × 400 email banner · 10-department emblem badge bar',
                ratio: '21:9',
                prompt: 'A wide email newsletter banner: dark charcoal background with a horizontal badge bar along the bottom edge displaying all 10 official circular amber-and-crimson Hofherr department emblems (Cow, Pig, Rooster, Lamb, Cheese, Soup Bowl, Fish, Maine Lobster, Duck, Delivery Truck), a sizzling cast-iron ribeye steak photo on the right, and "HOFHERR MEAT CO. · FROM THE BLOCK" in bold cream stencil type on the left.',
                printPrompt: 'Full-bleed flat 2D 1200×400 newsletter header banner graphic: dark smokehouse charcoal and oxblood crimson background with woodcut linework texture, left-aligned bold cream stencil headline "HOFHERR MEAT CO. · FROM THE BLOCK & SMOKEHOUSE", right-aligned circular scalloped Flaming Bull seal, and a full-width bottom badge bar featuring all 10 official circular golden-amber department emblems.',
            },
            {
                slug: 'google-business-cover',
                title: 'Google Business Cover Photo',
                spec: '1080 × 608 · storefront + counter hero',
                ratio: '16:9',
                prompt: 'Wide photo of the inside of a warm, upscale butcher shop: long glass meat case full of steaks, a butcher in a waxed canvas apron behind the counter, rolls of crimson-printed butcher paper on a cast-iron dispenser, and a "HOFHERR MEAT CO." sign on the back wall. Golden-hour light through the front windows.',
                printPrompt: 'Full-bleed flat 2D 1080×608 brand cover banner graphic: oxblood crimson and charcoal split layout with the large circular scalloped Hofherr rubber stamp emblem and bold stencil typography "HOFHERR MEAT CO. · NORTHFIELD\'S PREMIER CRAFT BUTCHER & PITMASTERS" on the left, and a structured 2×5 showcase grid of all 10 circular department flame badges on the right.',
            },
            {
                slug: 'app-icon-favicon',
                title: 'App Icon & 10-Department Digital Suite',
                spec: '1024 × 1024 master + 2×5 department badge icon set · SVG / PNG exports',
                ratio: '1:1',
                prompt: 'A clean flat design presentation board on warm-grey background showing the hero rounded-square crimson (#8B0A10) Hofherr Meat Co. app icon at top with the circular golden-amber Flaming Cow emblem, and below it a 2×5 grid of all 10 official circular Hofherr department icon badges (Prime Beef, Heritage Pork, Poultry & Rotisserie, Pasture Lamb, Artisanal Cheese, Stocks & Soups, Fresh Catch, Shellfish & Crab Maine Lobster, Specialty Duck, Catering & Delivery).',
                printPrompt: 'Flat 2D master icon production sheet on dark charcoal background (#1C1614) displaying the master circular Prime Beef die-cut favicon emblem, rounded-square iOS/Android app icon, circular scalloped rubber stamp seal, and a crisp 2×5 grid of all 10 circular Hofherr department emblems (DEPT-01 through DEPT-10).',
            },
        ],
    },
];

type DepartmentEmblem = {
    code: string;
    name: string;
    scope: string;
    svg: string;
};

const DEPARTMENT_EMBLEMS: DepartmentEmblem[] = [
    { code: 'DEPT-01 · COW', name: 'Prime Beef', scope: 'Dry-Aged & Steaks', svg: '/assets/identity/stickers/sticker-cow.svg' },
    { code: 'DEPT-02 · PIG', name: 'Heritage Pork', scope: 'Chops, Belly & Roast', svg: '/assets/identity/stickers/sticker-pig.svg' },
    { code: 'DEPT-03 · CHICKEN', name: 'Poultry & Rotisserie', scope: 'Whole Birds & Wings', svg: '/assets/identity/stickers/sticker-chicken.svg' },
    { code: 'DEPT-04 · LAMB', name: 'Pasture Lamb', scope: 'Chops, Rack & Leg', svg: '/assets/identity/stickers/sticker-lamb.svg' },
    { code: 'DEPT-05 · CHEESE', name: 'Artisanal Cheese', scope: 'Cave-Aged & Deli', svg: '/assets/identity/stickers/sticker-cheese.svg' },
    { code: 'DEPT-06 · SOUP', name: 'Stocks & Soups', scope: 'Kettle Broth & Chili', svg: '/assets/identity/stickers/sticker-soup.svg' },
    { code: 'DEPT-07 · FISH', name: 'Fresh Catch', scope: 'Fillets & Steaks', svg: '/assets/identity/stickers/sticker-fish.svg' },
    { code: 'DEPT-08 · SEAFOOD', name: 'Shellfish & Crab', scope: 'Shrimp, Crab & Lobster', svg: '/assets/identity/stickers/sticker-seafood-lobster.svg' },
    { code: 'DEPT-09 · DUCK', name: 'Specialty Duck', scope: 'Magret Breast & Confit', svg: '/assets/identity/stickers/sticker-duck.svg' },
    { code: 'DEPT-10 · TRUCK', name: 'Catering & Delivery', scope: 'Whole Hog & Event BBQ', svg: '/assets/identity/stickers/sticker-truck.svg' },
];

type BrandColor = { name: string; hex: string; role: string; pantone: string; cmyk: string };

// Pantone / CMYK values are close matches — confirm with a printer drawdown before production.
const BRAND_COLORS: BrandColor[] = [
    { name: 'Oxblood Crimson', hex: '#8B0A10', role: 'Primary ink · wrap, stamps, labels', pantone: '≈ PMS 7622 C', cmyk: '0 / 93 / 88 / 45' },
    { name: 'Hofherr Red', hex: '#CC0E1D', role: 'Digital accent · signage highlights', pantone: '≈ PMS 186 C', cmyk: '0 / 93 / 86 / 20' },
    { name: 'Smokehouse Amber', hex: '#F59B1A', role: 'Second spot colour · flames, fills', pantone: '≈ PMS 1375 C', cmyk: '0 / 37 / 89 / 4' },
    { name: 'Smokehouse Charcoal', hex: '#1C1614', role: 'Type, gift box, dark grounds', pantone: '≈ PMS Black 7 C', cmyk: '0 / 21 / 29 / 89' },
    { name: 'Butcher Counter Cream', hex: '#F3EAD8', role: 'Label stock, light grounds', pantone: '≈ PMS 7527 C (tint)', cmyk: '0 / 4 / 11 / 5' },
    { name: 'Classic Kraft', hex: '#C8A47E', role: 'Natural substrate reference', pantone: 'Unprinted stock', cmyk: '—' },
];

const FONTS = [
    { name: 'Yanone Kaffeesatz', role: 'Headlines · labels · stamps · signage', weights: '400 · 500 · 600 · 700', cssVar: 'var(--font-heading)', sample: 'HOFHERR MEAT CO. · CUT TO ORDER', upper: true },
    { name: 'Inter', role: 'Body copy · specs · prices · legal / safe-handling', weights: 'Variable 100–900', cssVar: 'var(--font-body)', sample: 'Pasture-raised Midwest beef, dry-aged 45 days and cut by hand in Northfield.', upper: false },
];

const STANDARDS = [
    { code: 'LOGO', name: 'Lockups & Clear Space', detail: 'Primary stencil wordmark, stacked wordmark + flame, and the 10-department circular emblem system. Keep clear space equal to the height of the "H" on all sides; never set the wordmark below 0.75" in print or 96 px on screen.' },
    { code: 'TYPE', name: 'Typography', detail: 'Yanone Kaffeesatz for headlines, labels and stamps (always uppercase); Inter for body, spec, price and legal copy. Print files fall back to Arial Black / Impact where Yanone is not installed.' },
    { code: 'ILLUS', name: '10-Department Emblem Rules', detail: 'All 10 official department emblems (Cow, Pig, Rooster, Lamb, Cheese, Soup, Fish, Maine Lobster, Duck, Delivery Truck) are open-linework distressed woodcut / linocut in two spot inks (Oxblood Crimson #8B0A10 + Smokehouse Amber #F59B1A) with no gradients or drop shadows.' },
    { code: 'PRINT', name: 'Print Production', detail: 'Flexo wrapping paper and screen jobs use spot inks (crimson + amber); digital and thermal labels use the CMYK builds. Food-contact items require FDA-compliant inks and stock.' },
];

type PrintableExample = {
    id: string;
    title: string;
    spec: string;
    svg: string;
    printHref: string;
};

const PRINT_SPEC_BY_SLUG: Record<
    string,
    {
        href: string;
        scaleLabel: string;
        svgMaster?: string;
        svgPrintMaster?: string;
        svgDownloadName?: string;
        printableExamples?: PrintableExample[];
    }
> = {
    'cryovac-label-front-back': {
        href: '/product-identity/print?sheet=vac-labels&autoprint=1',
        scaleLabel: 'SIZE: 4.00" W × 3.00" H (Front) & 4.00" W × 4.00" H (Back) · 1:1 @ 300 DPI',
    },
    'case-ready-tray-labels': {
        href: '/product-identity/print?sheet=tray-labels&autoprint=1',
        scaleLabel: 'SIZE: 2.50" W × 3.50" H Each (6-Up) · 1:1 @ 300 DPI',
    },
    'freezer-paper-bulk-order': {
        href: '/product-identity/print?sheet=wrap&autoprint=1',
        scaleLabel: 'SIZE: 8.00" W × 2.75" H Wrap Plate & 8.00" W × 5.25" H Carton Plate · 1:1 @ 300 DPI',
        svgMaster: '/assets/identity/hofherr-wrapping-paper-pattern-10-icons.svg',
        svgDownloadName: 'hofherr-wrapping-paper-pattern-10-icons.svg',
    },
    'jar-tub-labels': {
        href: '/product-identity/print?sheet=jar-labels&autoprint=1',
        scaleLabel: 'SIZE: 5.00" W × 2.125" H Each (4-Up Wraparound) · 1:1 @ 300 DPI',
    },
    'insulated-tote': {
        href: '/product-identity/print?master=insulated-tote&w=7.5&h=7.5&autoprint=1',
        scaleLabel: 'SIZE: 8.50" W × 8.50" H Screen Print Master (Ø 5.25" Seal) · 1:1 @ 300 DPI',
        svgMaster: '/assets/identity/hofherr-stamp-circular.svg',
        svgDownloadName: 'hofherr-stamp-circular.svg',
    },
    'catering-box': {
        href: '/product-identity/print?sheet=belly-band&autoprint=1',
        scaleLabel: 'SIZE: 3.25" W × 9.50" H Foil-Pan Belly-Band Straps (2-Up) & 10.00" W × 7.00" H Lid · 1:1 @ 300 DPI',
    },
    'steak-gift-box': {
        href: '/product-identity/print?master=steak-gift-box&w=7.5&h=5.6&autoprint=1',
        scaleLabel: 'SIZE: 10.00" W × 2.75" H Belly Band & 5.00" W × 3.50" H Gift Card · 1:1 @ 300 DPI',
    },
    'gift-cards': {
        href: '/product-identity/print?sheet=cards&autoprint=1',
        scaleLabel: 'SIZE: 3.375" W × 2.125" H CR80 Card & 4.00" W × 2.75" H Sleeve · 1:1 @ 300 DPI',
        svgMaster: '/assets/identity/hofherr-stamp-circular.svg',
        svgDownloadName: 'hofherr-stamp-circular.svg',
    },
    'case-price-tags': {
        href: '/product-identity/print?sheet=price-tags&autoprint=1',
        scaleLabel: 'SIZE: 3.50" W × 2.25" H Each (6-Up Slate Tags) · 1:1 @ 300 DPI',
    },
    'cut-chart-poster': {
        href: '/product-identity/print?master=cut-chart-poster&w=6.5&h=9.75&autoprint=1',
        scaleLabel: 'SIZE: 24.00" W × 36.00" H Poster (10× Ø 3.00" Emblems) · 150 DPI',
        svgMaster: '/assets/identity/hofherr-master-emblem-suite.svg',
        svgDownloadName: 'hofherr-master-emblem-suite.svg',
    },
    'menu-board-aframe': {
        href: '/product-identity/print?master=menu-board-aframe&w=7.5&h=5.6&autoprint=1',
        scaleLabel: 'SIZE: 36.00" × 36.00" Wall Menu Board & 24.00" × 36.00" Sidewalk A-Frame · 300 DPI',
    },
    'door-decal-hours': {
        href: '/product-identity/print?master=door-decal-hours&w=7.2&h=9.6&autoprint=1',
        scaleLabel: 'SIZE: 18.00" W × 24.00" H Die-Cut Window Vinyl (9.00" × 10.50" Bull Emblem) · Vector SVG + 300 DPI',
        svgMaster: '/assets/identity/hofherr-door-decal-hours.svg',
        svgDownloadName: 'hofherr-door-decal-hours.svg',
    },
    'farm-source-sign': {
        href: '/product-identity/print?master=farm-source-sign&w=7.5&h=4.18&autoprint=1',
        scaleLabel: 'SIZE: 48.00" W × 27.00" H Wall Sign (10× Ø 4.00" Emblems) · 300 DPI',
    },
    'apron-coat-cap': {
        href: '/product-identity/print?sheet=patches&autoprint=1',
        scaleLabel: 'SIZE: Ø 3.50" Chest Patch & 10× Ø 3.00" Department Patches · 100% Vector SVG',
        svgMaster: '/assets/identity/hofherr-master-emblem-suite.svg',
        svgDownloadName: 'hofherr-master-emblem-suite.svg',
    },
    'business-cards-letterhead': {
        href: '/product-identity/print?sheet=letterhead&autoprint=1',
        scaleLabel: 'SIZE: 8.50" W × 11.00" H Letterhead & 3.50" W × 2.00" H Card · 1:1 @ 300 DPI',
    },
    'custom-cut-order-pad': {
        href: '/product-identity/print?sheet=order-pad&autoprint=1',
        scaleLabel: 'SIZE: 5.50" W × 8.50" H Half-Letter Ticket · 1:1 @ 300 DPI',
    },
    'loyalty-punch-card': {
        href: '/product-identity/print?sheet=cards&autoprint=1',
        scaleLabel: 'SIZE: 3.50" W × 2.00" H Kraft Stamp Card (Ø 0.48" Targets) · 1:1 @ 300 DPI',
        svgMaster: '/assets/identity/hofherr-stamp-circular.svg',
        svgDownloadName: 'hofherr-stamp-circular.svg',
    },
    'social-templates': {
        href: '/product-identity/print?sheet=social-examples&autoprint=1',
        scaleLabel: 'SIZE: 3.60" W × 4.50" H (1080×1350) & 3.60" W × 6.40" H (1080×1920) · 100% Vector SVG + 300 DPI',
        svgPrintMaster: '/assets/identity/print/social-templates-print.svg',
        printableExamples: [
            {
                id: 'social-example-1',
                title: "01 · This Week's Specials (Woodcut Stencil Feed)",
                spec: '1080 × 1350 px · 3.60" W × 4.50" H @ 300 DPI · Vector SVG',
                svg: '/assets/identity/social/social-example-1-this-weeks-specials.svg',
                printHref: '/product-identity/print?master=social-example-1&w=6.8&h=8.5&autoprint=1',
            },
            {
                id: 'social-example-2',
                title: '02 · New Cut: Picanha (Featured Cut Feed)',
                spec: '1080 × 1350 px · 3.60" W × 4.50" H @ 300 DPI · Vector SVG',
                svg: '/assets/identity/social/social-example-2-new-cut-picanha.svg',
                printHref: '/product-identity/print?master=social-example-2&w=6.8&h=8.5&autoprint=1',
            },
            {
                id: 'social-example-3',
                title: '03 · Behind The Block (9:16 Vertical Story)',
                spec: '1080 × 1920 px · 3.60" W × 6.40" H @ 300 DPI · Vector SVG',
                svg: '/assets/identity/social/social-example-3-behind-the-block.svg',
                printHref: '/product-identity/print?master=social-example-3&w=5.0&h=8.9&autoprint=1',
            },
        ],
    },
    'email-header': {
        href: '/product-identity/print?master=email-header&w=7.5&h=4.18&autoprint=1',
        scaleLabel: 'SIZE: 10.00" W × 3.33" H (1200×400 Banner Master) @ 300 DPI',
    },
    'google-business-cover': {
        href: '/product-identity/print?master=google-business-cover&w=7.5&h=4.18&autoprint=1',
        scaleLabel: 'SIZE: 10.00" W × 5.63" H (1080×608 Cover Master) @ 300 DPI',
    },
    'app-icon-favicon': {
        href: '/product-identity/print?sheet=master-suite&autoprint=1',
        scaleLabel: 'SIZE: 100% VECTOR (.SVG) · Ø 3.41" Master + 10× Ø 3.00" Emblem Suite (Print at Any Size)',
        svgMaster: '/assets/identity/hofherr-master-emblem-suite.svg',
        svgPrintMaster: '/assets/identity/print/app-icon-favicon-print.svg',
        svgDownloadName: 'hofherr-master-emblem-suite.svg',
    },
};

function ItemCard({ item }: { item: IdentityItem }) {
    const [missing, setMissing] = useState(false);
    const [missingPrint, setMissingPrint] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedPrint, setCopiedPrint] = useState(false);
    const printInfo = PRINT_SPEC_BY_SLUG[item.slug] || {
        href: `/product-identity/print?master=${item.slug}&w=7.5&h=5.6&autoprint=1`,
        scaleLabel: '1:1 True Size · 300 DPI Press Master',
    };
    const src = printInfo.svgPrintMaster && printInfo.svgMaster ? printInfo.svgMaster : `/assets/identity/extended/${item.slug}.jpg`;
    const printSrc = printInfo.svgPrintMaster ? printInfo.svgPrintMaster : `/assets/identity/print/${item.slug}-print.jpg`;
    const jpgPrintSrc = `/assets/identity/print/${item.slug}-print.jpg`;
    const fullPrompt = `${item.prompt}\n\n${BRAND_STYLE}\n\nAspect ratio ${item.ratio}.`;
    const fullPrintPrompt = `${item.printPrompt}\n\nFlat 2D orthographic print-ready graphic design production artwork with crop marks and dielines, zero 3D props or camera tilt.\n\nAspect ratio ${item.ratio}.`;
    const [rw, rh] = item.ratio.split(':').map(Number);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(fullPrompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        } catch {
            /* clipboard blocked — prompt is still visible below */
        }
    };

    const copyPrint = async () => {
        try {
            await navigator.clipboard.writeText(fullPrintPrompt);
            setCopiedPrint(true);
            setTimeout(() => setCopiedPrint(false), 1600);
        } catch {
            /* clipboard blocked — prompt is still visible below */
        }
    };

    return (
        <article className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.meta}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <span className={styles.spec}>{item.spec} · {printInfo.scaleLabel}</span>
                </div>
                <div className={styles.cardActions}>
                    <Link href={printInfo.href} className={styles.actionLink}>
                        🖨 Print 1:1 Actual Size
                    </Link>
                    {printInfo.svgMaster && (
                        <a
                            href={printInfo.svgMaster}
                            download={printInfo.svgDownloadName || `${item.slug}.svg`}
                            className={styles.actionLink}
                        >
                            ↓ Download Vector (.SVG — Any Size)
                        </a>
                    )}
                    {printInfo.svgPrintMaster && (
                        <a
                            href={printInfo.svgPrintMaster}
                            download={`${item.slug}-print.svg`}
                            className={styles.actionLinkSecondary}
                        >
                            ↓ Vector Press Sheet (.SVG)
                        </a>
                    )}
                        <a href={`${jpgPrintSrc}?v=13`} download={`${item.slug}-print.jpg`} className={styles.actionLinkSecondary}>
                            ↓ Download 300 DPI Sheet (.JPG)
                        </a>
                            <a href={`${printSrc}?v=13`} target="_blank" rel="noopener noreferrer" className={styles.actionLinkSecondary}>
                                ↗ View Full Print Sheet
                            </a>
                                <a href={`${src}?v=13`} download={printInfo.svgMaster ? (printInfo.svgDownloadName || `${item.slug}.svg`) : `${item.slug}-mockup.jpg`} className={styles.actionLinkSecondary}>
                                    {printInfo.svgMaster ? '↓ Master (.SVG)' : '↓ Mockup (.JPG)'}
                                </a>
                            </div>
                        </div>

                        <div className={styles.mediaPair}>
                            <div className={styles.mediaCol}>
                                <div className={styles.mediaLabelBar}>
                                    <span className={styles.mediaLabel}>
                                        {printInfo.svgMaster ? '01 · Pure Vector Master (.SVG — Infinite Scale)' : '01 · In-Use Mockup'}
                                    </span>
                                    <span className={styles.mediaSubLabel}>
                                        {printInfo.svgMaster ? '100% Vector Paths · Zero Pixelation at Any Size' : '3D Context Preview'}
                                    </span>
                                </div>
                                <div
                                    className={styles.frame}
                                    style={{ '--card-aspect': `${rw} / ${rh}` } as React.CSSProperties}
                                >
                                    {!missing ? (
                                        <img
                                            src={`${src}?v=13`}
                                            alt={`${item.title} — In-Use Mockup`}
                                            className={styles.img}
                                            onError={() => setMissing(true)}
                                        />
                                    ) : (
                                        <div className={styles.placeholder}>
                                            <span className={styles.placeholderTag}>Mockup pending · Nano Banana</span>
                                            <code className={styles.placeholderPath}>public{src}</code>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.mediaCol}>
                                <div className={styles.mediaLabelBar}>
                                    <span className={styles.mediaLabel}>02 · Flat Print-Ready Artwork &amp; Dieline (Size in Inches)</span>
                                    <span className={styles.mediaSubLabel}>{printInfo.scaleLabel}</span>
                                </div>
                                <div
                                    className={styles.frame}
                                    style={{ '--card-aspect': `${rw} / ${rh}` } as React.CSSProperties}
                                >
                                    {!missingPrint ? (
                                        <img
                                            src={`${printSrc}?v=13`}
                                            alt={`${item.title} — Flat Print-Ready Artwork & Dieline`}
                                            className={styles.img}
                                            onError={() => setMissingPrint(true)}
                                        />
                                    ) : (
                                        <div className={styles.placeholder}>
                                            <span className={styles.placeholderTag}>Print sheet pending · Nano Banana</span>
                                            <code className={styles.placeholderPath}>public{printSrc}</code>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {printInfo.printableExamples && (
                            <div className={styles.examplesSection}>
                                <div className={styles.examplesHeader}>
                                    <span className={styles.mediaLabel}>
                                        03 · Individual Printable Examples Shown in Phone Mockups (1:1 Vector SVG &amp; Print Proofs)
                                    </span>
                                    <span className={styles.mediaSubLabel}>
                                        Click any example below to print at 1:1 scale or download as a standalone vector (.SVG)
                                    </span>
                                </div>
                                <div className={styles.examplesGrid}>
                                    {printInfo.printableExamples.map((ex) => (
                                        <div key={ex.id} className={styles.exampleCard}>
                                            <div className={styles.exampleFrame}>
                                                <img src={ex.svg} alt={ex.title} className={styles.exampleImg} />
                                            </div>
                                            <div className={styles.exampleMeta}>
                                                <h4 className={styles.exampleTitle}>{ex.title}</h4>
                                                <span className={styles.exampleSpec}>{ex.spec}</span>
                                            </div>
                                            <div className={styles.exampleActions}>
                                                <Link href={ex.printHref} className={styles.actionLink}>
                                                    🖨 Print 1:1
                                                </Link>
                                                <a href={ex.svg} download={`${ex.id}.svg`} className={styles.actionLinkSecondary}>
                                                    ↓ Vector (.SVG)
                                                </a>
                                                <a href={ex.svg} target="_blank" rel="noopener noreferrer" className={styles.actionLinkSecondary}>
                                                    ↗ Full Size
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={styles.promptRow}>
                            <details className={styles.promptBox}>
                                <summary className={styles.promptSummary}>
                                    Nano Banana Mockup Prompt <span className={styles.ratio}>{item.ratio}</span>
                                </summary>
                                <p className={styles.promptText}>{item.prompt}</p>
                                <button type="button" className={styles.copyBtn} onClick={copy}>
                                    {copied ? '✓ Copied mockup prompt' : 'Copy mockup prompt'}
                                </button>
                            </details>

                            <details className={styles.promptBox}>
                                <summary className={styles.promptSummary}>
                                    Nano Banana Print-Ready Flat Prompt <span className={styles.ratio}>{item.ratio}</span>
                                </summary>
                                <p className={styles.promptText}>{item.printPrompt}</p>
                                <button type="button" className={styles.copyBtn} onClick={copyPrint}>
                                    {copiedPrint ? '✓ Copied print-ready prompt' : 'Copy print-ready prompt'}
                                </button>
                            </details>
                        </div>
                    </article >
                    );
}

export default function ExtendedIdentityBoards() {
    const [allCopied, setAllCopied] = useState(false);

    const copyAll = async () => {
        const text = EXTENDED_SECTIONS.flatMap((s) =>
            s.items.map(
                (i) =>
                    `### ${s.index} · ${i.title}\nMockup: public/assets/identity/extended/${i.slug}.jpg\n${i.prompt}\n\nPrint-Ready Sheet: public/assets/identity/print/${i.slug}-print.jpg\n${i.printPrompt}\n\n${BRAND_STYLE}\n\nAspect ratio ${i.ratio}.`
            )
        ).join('\n\n---\n\n');
        try {
            await navigator.clipboard.writeText(text);
            setAllCopied(true);
            setTimeout(() => setAllCopied(false), 1800);
        } catch {
            /* ignore */
        }
    };

    return (
        <>
            <div className={`container ${styles.toolbar}`}>
                <p className={styles.toolbarText}>
                    Sections 05–10 extend the 10-Department Flame Emblem system across retail packaging, carry-out &amp; gifting,
                    in-store signage, team uniforms, stationery and digital channels.
                </p>
                <button type="button" className={styles.copyAllBtn} onClick={copyAll}>
                    {allCopied ? '✓ All prompts copied' : 'Copy all prompts'}
                </button>
            </div>

            {EXTENDED_SECTIONS.map((section) => (
                <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="section">
                    <div className={`container ${styles.stack}`}>
                        <div className={styles.header}>
                            <h2 id={`${section.id}-heading`} className={styles.sectionTitle}>
                                {section.index} / {section.title}
                            </h2>
                            <p className={styles.sectionDesc}>{section.desc}</p>
                        </div>
                        <div className={styles.grid}>
                            {section.items.map((item) => (
                                <ItemCard key={`${item.slug}-v2`} item={item} />
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            <section id="brand-standards" aria-labelledby="brand-standards-heading" className="section">
                <div className={`container ${styles.stack}`}>
                    <div className={styles.header}>
                        <h2 id="brand-standards-heading" className={styles.sectionTitle}>
                            10 / Brand Standards &amp; 10-Department Emblem Matrix
                        </h2>
                        <p className={styles.sectionDesc}>
                            The master specification that keeps every printer, sign shop and embroiderer on the same register across all
                            10 official Hofherr Meat Co. department emblems. Pantone and CMYK values are close matches to the hex colours —
                            confirm with a printer drawdown before the first production run.
                        </p>
                    </div>

                    <div className={styles.emblemBlock}>
                        <div className={styles.emblemBlockHeader}>
                            <div>
                                <h3 className={styles.emblemBlockTitle}>Official 10-Department Flame Emblem System (100% Vector .SVG)</h3>
                                <p className={styles.emblemBlockSub}>
                                    Pure vector Bézier curves — scale from a 16px favicon to a 10-foot storefront sign or vinyl plotter cut with zero pixelation
                                </p>
                            </div>
                            <div className={styles.cardActions}>
                                <a href="/assets/identity/hofherr-master-emblem-suite.svg" download="hofherr-master-emblem-suite.svg" className={styles.actionLink}>
                                    ↓ Full Master Suite + 10 Emblems (.SVG)
                                </a>
                                <a href="/assets/identity/hofherr-app-icon.svg" download="hofherr-app-icon.svg" className={styles.actionLinkSecondary}>
                                    ↓ App Icon (.SVG)
                                </a>
                                <a href="/assets/identity/hofherr-stamp-circular.svg" download="hofherr-stamp-circular.svg" className={styles.actionLinkSecondary}>
                                    ↓ Circular Stamp (.SVG)
                                </a>
                                <a href="/assets/identity/hofherr-die-cut-stickers-10-icons.svg" download="hofherr-die-cut-stickers-10-icons.svg" className={styles.actionLinkSecondary}>
                                    ↓ 10-Sticker Sheet (.SVG)
                                </a>
                                    <Link href="/product-identity/print?sheet=master-suite&autoprint=1" className={styles.actionLinkSecondary}>
                                        🖨 Print Vector Master Sheet
                            </Link>
                        </div>
                    </div>
                    <div className={styles.emblemGrid}>
                        {DEPARTMENT_EMBLEMS.map((emblem) => (
                            <div key={emblem.code} className={styles.emblemCard}>
                                <img
                                    src={emblem.svg}
                                    alt={`${emblem.name} — ${emblem.scope}`}
                                    className={styles.emblemPreview}
                                />
                                <div className={styles.emblemMeta}>
                                    <span className={styles.emblemCode}>{emblem.code}</span>
                                    <h4 className={styles.emblemName}>{emblem.name}</h4>
                                    <span className={styles.emblemScope}>{emblem.scope}</span>
                                </div>
                                <a
                                    href={emblem.svg}
                                    download
                                    className={styles.emblemDownload}
                                >
                                    ↓ Download Vector (.SVG)
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.colorGrid}>
                    {BRAND_COLORS.map((c) => (
                        <div key={c.hex} className={styles.colorCard}>
                            <div
                                className={styles.colorChip}
                                style={{ '--chip-bg': c.hex } as React.CSSProperties}
                            />
                            <div className={styles.colorBody}>
                                <span className={styles.colorName}>{c.name}</span>
                                <span className={styles.colorRole}>{c.role}</span>
                                <dl className={styles.colorSpecs}>
                                    <dt>HEX</dt><dd>{c.hex}</dd>
                                    <dt>PMS</dt><dd>{c.pantone}</dd>
                                    <dt>CMYK</dt><dd>{c.cmyk}</dd>
                                </dl>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.fontList}>
                    {FONTS.map((f) => (
                        <div
                            key={f.name}
                            className={styles.fontCard}
                            style={
                                {
                                    '--font-var': f.cssVar,
                                    '--font-case': f.upper ? 'uppercase' : 'none',
                                } as React.CSSProperties
                            }
                        >
                            <div className={styles.fontHead}>
                                <span className={styles.fontName}>{f.name}</span>
                                <span className={styles.fontRole}>{f.role}</span>
                            </div>
                            <p className={styles.fontSample}>{f.sample}</p>
                            <div className={styles.fontAlpha}>
                                ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
                            </div>
                            <dl className={styles.colorSpecs}>
                                <dt>WEIGHTS</dt><dd>{f.weights}</dd>
                                <dt>CSS</dt><dd>{f.cssVar}</dd>
                                <dt>SOURCE</dt><dd>Google Fonts (free, open licence)</dd>
                            </dl>
                        </div>
                    ))}
                </div>

                <div className={styles.standardsGrid}>
                    {STANDARDS.map((s) => (
                        <div key={s.code} className={styles.standardCard}>
                            <span className={styles.standardCode}>{s.code}</span>
                            <h3 className={styles.title}>{s.name}</h3>
                            <p className={styles.standardDetail}>{s.detail}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section >
                    </>
                    );
}
