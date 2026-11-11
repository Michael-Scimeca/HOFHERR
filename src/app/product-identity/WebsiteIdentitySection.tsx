'use client';

import React, { useState } from 'react';
import styles from './WebsiteIdentitySection.module.css';

type AssetCategory =
    | 'all'
    | 'favicons'
    | 'social-cards'
    | 'hero-media'
    | 'product-photos'
    | 'locations'
    | 'people'
    | 'textures'
    | 'copy'
    | 'trust';

interface MediaAsset {
    id: string;
    category: AssetCategory;
    title: string;
    spec: string;
    ratio: string;
    description: string;
    nanoBananaPrompt: string;
    technicalRequirements: string;
}

const MEDIA_ASSETS: MediaAsset[] = [
    // 01. Favicons
    {
        id: 'favicon-set',
        category: 'favicons',
        title: 'Favicon & Web App Icon Suite',
        spec: '32 × 32 (standard) · 180 × 180 (Apple touch) · 512 × 512 (PWA / Android)',
        ratio: '1:1',
        description: 'Crisp vector silhouette of the signature Hofherr cleaver with cut-out H monogram and oxblood fire emblem, optimized for light and dark browser tabs.',
        nanoBananaPrompt:
            'A flat, minimalist vector app icon on an oxblood crimson (#8B0A10) square canvas with soft rounded corners. Centered is a bold ivory-cream silhouette of a classic butcher cleaver with an engraved letter "H" inside the blade, enveloped by subtle linocut woodblock flame accents in warm golden amber (#DDA74F). Clean vector edges, high contrast, pixel-perfect at small scale, zero gradients, pure butcher guild heraldry.',
        technicalRequirements:
            'Export as multi-resolution /favicon.ico (16px, 32px, 48px), apple-touch-icon.png (180×180), and android-chrome-512x512.png. Keep clear padding of 15% around the central glyph.',
    },
    // 02. Link Preview Image
    {
        id: 'og-preview-card',
        category: 'social-cards',
        title: 'Open Graph & Social Share Link Preview',
        spec: '1200 × 630 px · 1.91:1 ratio · Safe content zone centered (1080 × 566 px)',
        ratio: '1.91:1',
        description: 'Rich preview image displayed in iMessage, WhatsApp, Twitter/X cards, and LinkedIn posts when sharing hofherrmeatco.com.',
        nanoBananaPrompt:
            'Cinematic landscape photo of a master butcher block with a 45-day dry-aged USDA Prime bone-in ribeye steak with exquisite marbling, next to an antique carbon-steel butcher knife and freshly cracked peppercorns. Dark rustic slate background with atmospheric wood smoke. Superimposed with an elegant oxblood banner on the left featuring "HOFHERR MEAT CO." in bold vintage cream woodblock stencil typography, accompanied by the tagline "Quality Meats. No Compromise." and subtext "Craft Butchery Since 1903 · Northfield & Winnetka, IL". High-end editorial food photography, 8k resolution, dramatic rim lighting.',
        technicalRequirements:
            'Saved at /public/images/og-card.jpg or /public/assets/digital/og-link-preview.jpg under 300KB for rapid crawler fetch. Critical typography kept inside the central safe area to prevent edge clipping.',
    },
    // 03. Hero Images & Video
    {
        id: 'hero-counter-wide',
        category: 'hero-media',
        title: 'Hero Shot 1 · The Master Counter & Butcher Block',
        spec: '2400 × 1200 px (or wider) · 2:1 widescreen · Cinematic 4K header background',
        ratio: '2:1',
        description: 'Wide environmental panorama capturing the authentic warmth, brass scale, and wooden butcher blocks at the Northfield shop.',
        nanoBananaPrompt:
            'Ultra-wide commercial photograph of the interior of a premier heritage craft butcher shop. An artisan end-grain maple butcher block in the foreground dusted with coarse sea salt, butcher twine spool, and a hand-forged cleaver. In the background, warm golden incandescent lighting illuminates clean subway tile walls, antique brass hanging scales, and a pristine display case. Warm oxblood and charred oak color tones, shot on 35mm Hasselblad, wide-angle cinematic depth, appetizing atmosphere.',
        technicalRequirements:
            'Export WebP + fallback JPEG at 2400px wide, compressed under 450KB with responsive srcset (1200w, 1800w, 2400w).',
    },
    {
        id: 'hero-cold-case-wide',
        category: 'hero-media',
        title: 'Hero Shot 2 · The Dry-Aging Cabinet & Gleaming Case',
        spec: '2400 × 1200 px · 2:1 ultra-wide · Atmospheric cold-lighting contrast',
        ratio: '2:1',
        description: 'Showcases rows of hand-trimmed prime steaks, house-tied roasts, and salt-brick dry-aging loins.',
        nanoBananaPrompt:
            'Wide cinematic interior view looking into a gleaming custom glass dry-aging locker lined with pink Himalayan salt blocks. Rows of whole bone-in beef loins and prime ribeyes aging to deep mahogany perfection under soft amber glow. Next to the case, pristine refrigerated stainless displays feature hand-tied crown pork roasts, lamb chops with herb garnishes, and artisan charcuterie links. Commercial architectural interior photography, crisp reflections, luxurious foodie appeal.',
        technicalRequirements:
            'Use subtle dark-gradient scrim in UI to ensure navigation and hero typography remain WCAG AAA legible over the image.',
    },
    {
        id: 'hero-smokehouse-fire',
        category: 'hero-media',
        title: 'Hero Shot 3 · Live Fire, Charcoal Grill & Smoker',
        spec: '2400 × 1350 px · 16:9 widescreen · Dynamic embers and rising smoke',
        ratio: '16:9',
        description: 'Captures the craft of barbecue, wood smoke, and searing flame that drives their catering and rotisserie.',
        nanoBananaPrompt:
            'Dramatic wide-angle action photo of pitmaster live-fire cooking: roaring glowing hickory and oak wood embers under heavy cast-iron grill grates, searing thick-cut steaks with golden caramelization. Sparks and delicate wisps of fragrant white smoke rise into a dark moody background. Rich fiery amber, ember glow (#F97316), and deep smokehouse black. Shot at 1/1000s shutter to freeze fire sparks, National Geographic culinary documentary style.',
        technicalRequirements:
            'High-contrast focal point centered or weighted to right third to allow left-aligned brand headlines.',
    },
    {
        id: 'hero-video-loop',
        category: 'hero-media',
        title: 'Hero Video Cinemagraph Loop',
        spec: '1920 × 1080 (or 2560 × 1440) · MP4 (H.264/H.265) · 4–6s seamless loop, muted',
        ratio: '16:9',
        description: 'Hypnotic muted ambient video loop of rising wood smoke or glowing barbecue pit embers.',
        nanoBananaPrompt:
            'Cinematic slow-motion 60fps video frame sequence of gentle smoke swirling above a glowing oak wood ember bed in a stone smokehouse pit. The motion is subtle and hypnotic: red embers pulsing gently with rising micro-sparks, warm mahogany and charcoal palette, zero jerky movement, seamless start and end transition for continuous web playback.',
        technicalRequirements:
            'Muted, playsinline, loop, autoplay attributes; file size capped under 2.5MB; fallback poster image provided.',
    },
    // 04. Product Photos
    {
        id: 'product-steak-ribeye',
        category: 'product-photos',
        title: 'Product Cut · 45-Day Dry-Aged USDA Prime Ribeye',
        spec: '1600 × 1600 px · 1:1 square · Consistent dark slate or butcher parchment background',
        ratio: '1:1',
        description: 'Isolated high-resolution catalog shot for online cut selection, gift boxes, and pre-orders.',
        nanoBananaPrompt:
            'Square top-down 45-degree angle studio food photograph of a single 2-inch thick raw bone-in dry-aged Prime Ribeye steak resting on authentic crinkled butcher kraft paper. Deep ruby-red muscle tone with dense, intricate white intramuscular marbling striations and a clean ivory fat cap. A small sprig of fresh rosemary and three black peppercorns sit near the bone. Soft directional diffused studio key light, crisp focus from corner to corner, ultra-sharp detail.',
        technicalRequirements:
            'Consistent lighting setup across all catalog cuts; neutral color balance with color checker calibration; min 1600px square.',
    },
    {
        id: 'product-heritage-pork',
        category: 'product-photos',
        title: 'Product Cut · Heritage Berkshire Bone-In Pork Chop',
        spec: '1600 × 1600 px · 1:1 square · Consistent background setup',
        ratio: '1:1',
        description: 'Features the rosy heirloom coloring and distinct fat marbling of pasture-raised pork.',
        nanoBananaPrompt:
            'Square studio photograph of an heirloom heritage Berkshire pork chop, double-cut bone-in, placed on a dark basalt slate slab. Deep pinkish-red meat color markedly darker than commercial pork, showcasing lush interior marbling. Clean French-trimmed rib bone. Elegant diffused softbox lighting highlighting moisture and meat density, gourmet butcher catalog aesthetic.',
        technicalRequirements:
            'Consistent slate background matching beef and poultry items for seamless grid alignment.',
    },
    {
        id: 'product-house-sausage',
        category: 'product-photos',
        title: 'Product Cut · Hand-Twisted Chi-Vop & Artisan Sausages',
        spec: '1600 × 1600 px · 1:1 square · Freshly stuffed natural hog casings',
        ratio: '1:1',
        description: 'Displays the coarse grind, visible fresh herbs, and traditional craft of house-made sausage links.',
        nanoBananaPrompt:
            'Square top-down food photograph of four fresh handmade artisan sausage links in natural hog casings, neatly curled on a circular end-grain wood cutting board. Visible flecks of cracked fennel, red chili flake, fresh parsley, and coarse-ground pork. A vintage brass cleaver tip rests in the corner of the frame. Warm rustic culinary lighting, mouthwatering artisanal texture.',
        technicalRequirements:
            'Square aspect ratio with consistent framing margin (10% border padding around subject).',
    },
    // 05. Location Photos
    {
        id: 'location-northfield-exterior',
        category: 'locations',
        title: 'Northfield Flagship · Storefront & Happ Rd Exterior',
        spec: '2000 × 1333 px · 3:2 landscape · Daytime golden hour architectural exterior',
        ratio: '3:2',
        description: 'The iconic 300 S. Happ Rd brick building with gold leaf window lettering and welcoming entry.',
        nanoBananaPrompt:
            'Eye-level exterior architectural photograph of Hofherr Meat Co. butcher shop located in Northfield, Illinois. Warm red brick facade with a classic black awning, gold-leaf window lettering reading "HOFHERR MEAT CO. · QUALITY MEATS NO COMPROMISE". Planter boxes with greenery flank the clean glass entrance doors. Late afternoon golden sunlight casts long warm shadows across the sidewalk. Charming affluent North Shore neighborhood feel, inviting and authentic.',
        technicalRequirements:
            'Straightened perspective verticals; shot during clear afternoon lighting for natural North Shore warmth.',
    },
    {
        id: 'location-depot-winnetka',
        category: 'locations',
        title: 'The Depot · Historic Winnetka Metra Station Satellite',
        spec: '2000 × 1333 px · 3:2 landscape · Historic limestone station & coffee bar',
        ratio: '3:2',
        description: 'The 754 Elm St commuter hub offering espresso, grab-and-go butcher cuts, and famous Italian beef.',
        nanoBananaPrompt:
            'Architectural photograph of The Depot inside the historic stone Winnetka Elm Street Metra train station. Beautiful Richardsonian Romanesque rough-hewn stone walls, high vaulted beamed ceilings, and a sleek contemporary oak coffee and butcher service counter. A glowing brass Hofherr Meat Co. emblem hangs behind the espresso machine, with a refrigerated case of grab-and-go prime steaks, rotisserie chickens, and Italian beef sandwiches. Warm, bustling morning commuter atmosphere.',
        technicalRequirements:
            'Balanced interior dynamic range showing warm station interior and natural platform light through historic windows.',
    },
    // 06. People Photos
    {
        id: 'people-sean-portrait',
        category: 'people',
        title: 'Owner & Pitmaster · Chef Sean Hofherr Portrait',
        spec: '1600 × 2000 px · 4:5 vertical portrait · Authentic craftsman portrait',
        ratio: '4:5',
        description: 'Warm, candid, authoritative portrait of Sean Hofherr in his butcher coat and leather apron.',
        nanoBananaPrompt:
            'Environmental portrait of Chef Sean Hofherr, master butcher and founder, standing proudly in his Northfield shop. He wears a heavy charcoal-grey canvas apron with leather straps over a classic buttoned butcher coat, holding a polished honing steel with confident, welcoming posture. Behind him, butcher block tables, gleaming copper pots, and chalkboard cut lists fill the softly blurred background. Genuine, warm, charismatic smile; documentary style, authentic craftsman character, sharp eyes.',
        technicalRequirements:
            'High dynamic range natural portrait lighting with shallow depth of field (f/2.8) blurring shop background.',
    },
    {
        id: 'people-butchers-at-work',
        category: 'people',
        title: 'Butchers at the Block · Hand Trimming & Breaking Down',
        spec: '2000 × 1333 px · 3:2 action documentary · Movement and knife skills',
        ratio: '3:2',
        description: 'Action shots showing the team slicing roasts, tying crown roasts, and wrapping in kraft paper.',
        nanoBananaPrompt:
            'Dynamic documentary action photograph inside a working craft butcher shop. Two skilled young butchers in matching oxblood aprons and white paper caps working collaboratively over a massive hardwood cutting block. One is expertly Frenching the bones of a prime rack of lamb with a curved boning knife, while the other carefully wraps a finished cut in thick brown kraft butcher paper and ties it with natural jute twine. Action captured with crisp focus on hands and steel, energetic craft storytelling.',
        technicalRequirements:
            'Freeze action at 1/500s or faster to prevent motion blur while maintaining natural warm ambient shop light.',
    },
    // 07. Texture & Detail Shots
    {
        id: 'texture-butcher-paper-twine',
        category: 'textures',
        title: 'Macro Detail · Butcher Paper, Twine & Wax Stamp',
        spec: '1600 × 1600 px · 1:1 macro · Tactile material authenticity',
        ratio: '1:1',
        description: 'Close-up of tightly folded butcher paper parcel tied with twine and sealed with red rubber stamp.',
        nanoBananaPrompt:
            'Macro extreme close-up of a meat package wrapped in textured raw brown kraft butcher paper, secured with coarse natural jute twine tied in a neat butcher’s knot. Stamped directly onto the paper in rich oxblood waterproof ink is the circular Hofherr Meat Co. rubber stamp seal with woodblock cow motif. Tactile fibrous paper texture, razor-sharp focus on the hemp twine fibers, soft shadow depth, artisan unboxing feel.',
        technicalRequirements:
            'Extremely high micro-contrast and tactile texture reproduction for UI section dividers and card backgrounds.',
    },
    {
        id: 'texture-marbling-macro',
        category: 'textures',
        title: 'Macro Detail · Prime Intramuscular Marbling',
        spec: '2000 × 1200 px · Widescreen macro · Culinary quality evidence',
        ratio: '16:9',
        description: 'Extreme close-up of USDA Prime dry-aged beef showcasing snowflake marbling density.',
        nanoBananaPrompt:
            'Extreme macro photograph of the cross-section of a raw USDA Prime dry-aged steak. The deep cherry-red beef fibers are densely interwoven with fine, delicate white snowflake-like intramuscular fat marbling. A scattering of coarse Maldon sea salt flakes glistens on the meat surface. Cinematic shallow depth of field, stunning food macro photography, undeniable testament to grade and breeding.',
        technicalRequirements:
            '100% true-to-life meat color balance; avoid artificial pink saturation; highlights natural dry-aged depth.',
    },
    // 09. Trust Items
    {
        id: 'trust-atb-award',
        category: 'trust',
        title: 'Press & Media · America’s Test Kitchen Feature',
        spec: '1600 × 1000 px · 16:10 graphic lockup · Press accolade badge',
        ratio: '16:10',
        description: 'Celebrates Hofherr’s Italian Beef sandwich acclaimed nationwide by America’s Test Kitchen.',
        nanoBananaPrompt:
            'An elegant editorial graphic presentation on textured slate: in the center, an authentic Chicago Italian Beef sandwich bursting with thinly shaved roast beef, sweet and hot giardiniera peppers, dipped in glossy spiced jus on a crusty roll. To the side is an embossed gold stamp medal reading "AS FEATURED ON AMERICA’S TEST KITCHEN — CHICAGO ITALIAN BEEF EXCELLENCE", flanked by subtle Hofherr crimson linocut filigree. High-end food editorial layout.',
        technicalRequirements:
            'Vector badge assets scalable for press page and social highlights; includes publication citation.',
    },
    {
        id: 'trust-farm-partners-map',
        category: 'trust',
        title: 'Supplier Traceability · Midwest Family Farm Network',
        spec: '1800 × 1000 px · 9:5 landscape · Provenance infographic / map',
        ratio: '9:5',
        description: 'Visual map and roster of local partner farms across Illinois, Wisconsin, and Indiana.',
        nanoBananaPrompt:
            'A beautifully illustrated vintage linocut map of the American Midwest (Illinois, Wisconsin, Indiana) on antiqued cream parchment (#F3EAD8). Elegant oxblood route lines and circular emblem pins mark specific partner family farms: pasture cattle farms in Fairbury, IL, heritage Berkshire hog pastures in LaGrange, IN, and free-range poultry in Wisconsin. Surrounding the map are hand-drawn illustrations of cattle, pigs, and roosters with the header "100% MIDWEST FARM TRACEABLE · ZERO HORMONES · NO EXPEDIENT SHORTCUTS". Master engraver cartography aesthetic.',
        technicalRequirements:
            'Infographic layout detailing partner names: Slagel Family Farm, Gunthorp Farms, Beeler’s, and Rushing Waters.',
    },
];

interface CopySnippet {
    id: string;
    title: string;
    description: string;
    content: string;
}

const COPY_SNIPPETS: CopySnippet[] = [
    {
        id: 'open-graph-tags',
        title: 'Open Graph (OG) & Twitter Card Meta Tags',
        description: 'Drop-in meta tags and Next.js App Router metadata definitions for social cards and rich link sharing.',
        content: `<!-- RAW HTML HEAD TAGS -->
<meta property="og:site_name" content="Hofherr Meat Co." />
<meta property="og:type" content="website" />
<meta property="og:locale" content="en_US" />
<meta property="og:title" content="Hofherr Meat Co. | Quality Meats. No Compromise." />
<meta property="og:description" content="Craft butchery since 1903. Hand-trimmed custom cuts, 45-day dry-aged USDA Prime beef, house-made sausages, rotisserie chicken, and full catering in Northfield & Winnetka, IL." />
<meta property="og:url" content="https://hofherrmeatco.com" />
<meta property="og:image" content="https://hofherrmeatco.com/OG/og-home.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Hofherr Meat Co. — Craft Butcher Shop & Smokehouse" />

<!-- TWITTER CARD TAGS -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@hofherrmeatco" />
<meta name="twitter:title" content="Hofherr Meat Co. | Quality Meats. No Compromise." />
<meta name="twitter:description" content="Craft butchery since 1903. Custom cuts, dry-aged beef & BBQ catering. Northfield & Winnetka, IL." />
<meta name="twitter:image" content="https://hofherrmeatco.com/OG/og-home.jpg" />

// NEXT.JS APP ROUTER METADATA OBJECT (src/app/layout.tsx or page.tsx)
export const metadata: Metadata = {
    metadataBase: new URL('https://hofherrmeatco.com'),
    title: {
        default: 'Hofherr Meat Co. | Quality Meats. No Compromise.',
        template: '%s | Hofherr Meat Co.',
    },
    description: 'Craft butchery since 1903. 100% pasture-raised Midwest farm-traceable cuts, dry-aged steaks, and BBQ catering.',
    openGraph: {
        siteName: 'Hofherr Meat Co.',
        type: 'website',
        locale: 'en_US',
        title: 'Hofherr Meat Co. | Quality Meats. No Compromise.',
        description: 'Craft butchery since 1903. Hand-trimmed custom cuts, dry-aged prime beef & world-class catering.',
        url: 'https://hofherrmeatco.com',
        images: [{ url: '/OG/og-home.jpg', width: 1200, height: 630, alt: 'Hofherr Meat Co.' }],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@hofherrmeatco',
        images: ['/OG/og-home.jpg'],
    },
};`,
    },
    {
        id: 'taglines-voice',
        title: 'Official Taglines & Core Brand Voice',
        description: 'The definitive slogans and tone rules gathered from the original brand launch and live operations.',
        content: `PRIMARY TAGLINE:
"Quality Meats. No Compromise."

HERITAGE LOCKUP:
"Craft Butchery Since 1903 · Re-Established 2014"

SIGNATURE BRAND HOOK:
"An artisanal butcher shop. Combined with a charcuterie. Around a sandwich shop. Inside an event space."

MISSION PROMISE:
"Your neighborhood alternative to the corporate grocery chain meat counter."

TONE PILLARS:
• Authentic & Grounded: Direct, confident, honest. Zero corporate fluff or snobby jargon.
• Warm & Neighborly: Speaks across the counter like a friend who knows your Sunday dinner cuts.
• Culinary Authority: Chef-informed advice on resting meats, smoking ribs, and bone-in roasting.
• Good-Humored Candor: Dry Midwestern wit with genuine pride in the trade.`,
    },
    {
        id: 'story-short-long',
        title: 'The "Since 1903, Restarted 2014" Story',
        description: 'Ready-to-use short and long forms for headers, web bios, and the full About section.',
        content: `[SHORT FORM — 30-Second Elevator Pitch & Hero Text]
Four generations of craft. Zero shortcuts.
The Hofherr butchering lineage began in the 19th century in Germany and took root in 1903 on Chicago’s storied South Side with the original Hofherr Meat Company. After the family spent two generations away from the butcher block, Chef Sean Hofherr revived the family name in March 2014 in Northfield—bringing old-world craftsmanship, 100% pasture-raised Midwest farm traceability, and chef-driven culinary standards back to the North Shore.

[LONG FORM — Official Brand Narrative for About / Our Story]
The Hofherr butchering heritage begins across the Atlantic with Sean Hofherr’s great-great-grandfather, a respected village butcher in Germany who mastered the trade by hand. When his son emigrated to America, he brought those time-tested techniques with him to the bustling meatpacking capital of the world, establishing the original Hofherr Meat Company in 1903 on Chicago’s South Side. For decades, the Hofherr name stood proudly alongside the city's legendary stockyard tradition.

While the family stepped away from commercial butchering for two generations, the craft remained in Sean’s blood. Driven by a single-minded purpose to resurrect his family’s culinary legacy, Sean immersed himself in the food industry. He sharpened his palate in fine-dining kitchens—including Chicago’s acclaimed Keefer’s Restaurant in River North—before committing himself to the cutting board with an intensive four-year traditional apprenticeship at Zier’s Prime Meats in Wilmette. Along the way, he took top honors at the North Shore Chili Cookoff and Lake Bluff Ribfest and ran the kitchen at Northfield’s beloved Stormy’s Tavern.

In March 2014, Sean reopened the doors of Hofherr Meat Co. at 300 Happ Road in Northfield. Rather than running a standard commodity meat counter, Sean built a neighborhood destination rooted in integrity: meats directly traceable to family-owned Midwest farms, zero hormones or routine antibiotics, scratch-made charcuterie and sausages, slow-smoked rotisserie poultry, and house-made soups and sandwiches.

Today—alongside its commuter satellite, The Depot at the historic Winnetka Train Station—Hofherr Meat Co. honors over 120 years of family history by proving every day that when you respect the animal, the farmer, and the craft, you never have to compromise.`,
    },
    {
        id: 'contact-hours-locations',
        title: 'Locations, Store Hours & Contact Details',
        description: 'Canonical operational info for footer, contact cards, and Google Business profiles.',
        content: `FLAGSHIP BUTCHER SHOP (Northfield, IL)
Address: 300 S. Happ Rd., Northfield, IL 60093
Phone: (847) 881-MEAT (6328)
Hours:
• Tuesday – Friday: 10:00 AM – 6:00 PM
• Saturday: 9:00 AM – 5:00 PM
• Sunday: 10:00 AM – 4:00 PM
• Monday: Closed for whole-animal breakdown & kitchen prep

THE DEPOT (Winnetka Satellite · Historic Metra Station)
Address: 754 Elm St., Winnetka, IL 60093
Phone: (847) 881-6328
Hours:
• Monday – Friday: 6:00 AM – 2:00 PM (Espresso, Scratch Pastries, Lunch & Grab-and-Go Meats)
• Saturday: 7:00 AM – 1:00 PM
• Sunday: Closed

DIGITAL CHANNELS:
Website: https://hofherrmeatco.com
General Inquiries: info@hofherrmeatco.com
Catering & Event BBQ: catering@hofherrmeatco.com
Instagram: @hofherrmeatco`,
    },
    {
        id: 'menu-pricing-guide',
        title: 'Core Cuts, Delicatessen & Sandwiches Price Guide',
        description: 'Menu copy for the website cuts selection, counter boards, and takeout guides.',
        content: `SIGNATURE BUTCHER CUTS (Traceable Midwest Family Farms):
• USDA Prime Dry-Aged Ribeye (45-Day Salt Cave Aged) — Market Price / lb
• Center-Cut New York Strip (USDA Prime Pasture-Raised) — Market Price / lb
• Prime Tenderloin / Filet Mignon (Center Barrel Cut) — Market Price / lb
• Heritage Berkshire Pork Chops (Bone-In, Double-Cut) — $14.99 / lb
• Colorado Pasture-Raised Rack of Lamb (Frenched) — Market Price / lb
• House Chi-Vop & Artisan Italian Sausage Links — $11.99 / lb
• Whole Rotisserie Chicken & Drippings Potatoes — $18.99

CHEF-CRAFTED SANDWICHES (Served on Crusty Baguettes with Deli Pickle & Chips):
• The Hofherr Italian Beef — Thin-sliced roast beef, spicy house giardiniera, rich pan au jus dip
• The Mark Cuban — Tavern ham, Swiss cheese, chorizo mustard, cured lonza, house pickles
• Good Afternoon, Vietnam — Country pâté, smoked pork shoulder, tavern ham, kimchi, rooster mayo
• Buffalo Bill — Oven-roasted turkey breast, muenster cheese, wing sauce aioli, scallions
• The Beast — Roast beef, melted cheddar, horseradish cream, crispy onions on artisan bun`,
    },
    {
        id: 'catering-custom-orders',
        title: 'Catering & Custom Processing Ordering Protocol',
        description: 'Clear client instructions for private events, pig roasts, and holiday reserves.',
        content: `CATERING & PRIVATE EVENTS:
From backyard whole-hog pig roasts and tailgates to Ravinia concert picnic baskets and corporate luncheons, every event is custom-tailored by Chef Sean Hofherr.
• Minimum Lead Time: 72 hours for party platters; 2 weeks for on-site whole-pig roasts.
• Custom Inquiries: Email catering@hofherrmeatco.com with guest count, date, and preferred menu direction.

CUSTOM CUTS & SPECIAL REQUESTS:
• Custom Thickness: Steaks cut to exact customer thickness (1", 1.5", 2", or custom roast sizing) at no surcharge.
• Specialty Game: Venison, rabbit, duck, and wild boar sourced seasonally upon 48-hour request.
• Holiday Reserves: Fresh pasture-raised Thanksgiving turkeys and prime rib roasts open for pre-order 4 weeks prior to major holidays.`,
    },
    {
        id: 'faqs-suite',
        title: 'High-Intent Frequently Asked Questions',
        description: 'Direct, clear answers resolving customer hesitations before buying.',
        content: `Q: Where do your meats come from?
A: 100% of our beef, pork, poultry, and lamb is sourced directly from independent family farms across Illinois, Wisconsin, and Indiana. We personally visit our farm partners and verify humane animal welfare standards, pasture grazing, and zero subtherapeutic antibiotics or growth hormones.

Q: What makes your dry-aged beef different from supermarket meat?
A: Supermarket beef is typically wet-aged in vacuum plastic bags for shipping. Our prime loins are open-air aged for 30 to 45+ days in a dedicated humidity- and temperature-controlled salt-brick room. Natural enzymes break down muscle fibers for unmatched tenderness, while evaporation concentrates rich, nutty, umami beef flavor.

Q: Can I phone in an order for curbside pickup?
A: Absolutely. Call our Northfield counter directly at (847) 881-MEAT (6328). We will hand-cut and wrap your order so it’s ready when you pull up.

Q: Do you offer gluten-free and allergen-conscious options?
A: All of our raw prime steaks, chops, and pure ground meats are naturally 100% gluten-free. We also formulate our signature fresh sausages and stocks without gluten fillers. Please alert our butcher team to any allergies when ordering.`,
    },
];

interface TrustQuote {
    name: string;
    source: string;
    quote: string;
}

const TRUST_QUOTES: TrustQuote[] = [
    {
        name: "America's Test Kitchen",
        source: 'Editorial Feature · National TV & Digital',
        quote: 'Hofherr Meat Co. stands as a beacon of Chicago Italian beef craftsmanship. Thinly shaved, perfectly seasoned roast beef swimming in intensely spiced au jus, topped with proper crunchy giardiniera—truly exceptional.',
    },
    {
        name: 'Dave C.',
        source: 'Winnetka, IL · Verified Yelp Review',
        quote: 'Proprietors Sean and Arielle Hofherr present a spectacular array of exquisitely delicious prime meats, soups and chili. They were tremendous in barbecuing for the VIP Tent at the Winnetka Music Festival and provide phenomenal catering.',
    },
    {
        name: 'Liz K.',
        source: 'Winnetka, IL · Verified Yelp Review',
        quote: 'We ordered a BBQ dinner for a post-wedding party. Everything was delicious - especially the brisket and the delicious baked beans. The food was packaged well and was easy to heat. Glad to have this local business!',
    },
    {
        name: 'Marianne V.',
        source: 'Riverwoods, IL · Verified Yelp Review',
        quote: "This place is the best!!! Skirt steak - AMAZING - bone-in pork chop - BEYOND AMAZING! Chi vops sausages wow, apple bratwurst, you won't forget them EVER. And the owners are beyond nice and accommodating.",
    },
];

export default function WebsiteIdentitySection() {
    const [activeCategory, setActiveCategory] = useState<AssetCategory>('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = async (id: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            /* ignore clipboard error */
        }
    };

    const filteredAssets =
        activeCategory === 'all'
            ? MEDIA_ASSETS
            : MEDIA_ASSETS.filter((item) => item.category === activeCategory);

    return (
        <section id="website-assets" aria-labelledby="website-assets-heading" className="section">
            <div className={`container ${styles.stack}`}>
                <div className={styles.header}>
                    <h2 id="website-assets-heading" className={styles.sectionTitle}>
                        09C / Website Media &amp; Digital Production Kit
                    </h2>
                    <p className={styles.sectionDesc}>
                        Comprehensive digital media specifications, live website copy blocks, and production-ready Gemini
                        Nano Banana prompts for Hofherr Meat Co. Every visual asset is engineered to maintain old-world
                        butcher guild craftsmanship across responsive web layouts, social cards, high-density retina displays,
                        and press kits.
                    </p>
                </div>

                {/* Filter Navigation */}
                <div className={styles.filterBar}>
                    {(
                        [
                            ['all', 'All Specs'],
                            ['favicons', 'Favicon Suite'],
                            ['social-cards', 'Link Preview (OG)'],
                            ['hero-media', 'Hero Media & Video'],
                            ['product-photos', 'Product Cuts'],
                            ['locations', 'Locations'],
                            ['people', 'People & Butchers'],
                            ['textures', 'Textures & Details'],
                            ['copy', 'Live Web Copy'],
                            ['trust', 'Trust & Press'],
                        ] as const
                    ).map(([catKey, catLabel]) => (
                        <button
                            key={catKey}
                            type="button"
                            onClick={() => setActiveCategory(catKey as AssetCategory)}
                            className={`${styles.filterBtn} ${activeCategory === catKey ? styles.filterBtnActive : ''}`}
                        >
                            {catLabel}
                        </button>
                    ))}
                </div>

                {/* Media Generation Prompts (Nano Banana) */}
                {(activeCategory === 'all' || (activeCategory !== 'copy' && activeCategory !== 'trust')) && (
                    <div className={styles.assetGrid}>
                        {filteredAssets.map((asset) => (
                            <div key={asset.id} className={styles.assetCard}>
                                <div className={styles.cardHead}>
                                    <span className={styles.cardCategory}>{asset.category}</span>
                                    <span className={styles.cardRatioBadge}>{asset.ratio}</span>
                                </div>
                                <h3 className={styles.cardTitle}>{asset.title}</h3>
                                <div className={styles.cardSpec}>{asset.spec}</div>
                                <p className={styles.sectionDesc}>{asset.description}</p>

                                <div className={styles.promptBlock}>
                                    <div className={styles.promptLabelRow}>
                                        <span className={styles.promptLabel}>Gemini Nano Banana Prompt</span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(asset.id, asset.nanoBananaPrompt)}
                                            className={styles.copyPromptBtn}
                                        >
                                            {copiedId === asset.id ? '✓ Copied' : 'Copy Prompt'}
                                        </button>
                                    </div>
                                    <pre className={styles.promptText}>{asset.nanoBananaPrompt}</pre>
                                </div>

                                <div className={styles.cardSpec}>
                                    <strong>Production Spec:</strong> {asset.technicalRequirements}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Copy Suite */}
                {(activeCategory === 'all' || activeCategory === 'copy') && (
                    <div className={styles.stack}>
                        <div className={styles.header}>
                            <h3 className={styles.cardTitle}>Complete Website &amp; Editorial Copy Suite</h3>
                            <p className={styles.sectionDesc}>
                                One-click copyable brand statements, historical story modules, store hours, menus, catering
                                protocols, and high-conversion FAQs.
                            </p>
                        </div>
                        <div className={styles.copySuiteGrid}>
                            {COPY_SNIPPETS.map((snippet) => (
                                <div key={snippet.id} className={styles.copyCard}>
                                    <div className={styles.copyHeader}>
                                        <h4 className={styles.copyTitle}>{snippet.title}</h4>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(snippet.id, snippet.content)}
                                            className={styles.copyPromptBtn}
                                        >
                                            {copiedId === snippet.id ? '✓ Copied Content' : 'Copy Text'}
                                        </button>
                                    </div>
                                    <p className={styles.sectionDesc}>{snippet.description}</p>
                                    <pre className={styles.copyContent}>{snippet.content}</pre>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trust & Authority Items */}
                {(activeCategory === 'all' || activeCategory === 'trust') && (
                    <div className={styles.stack}>
                        <div className={styles.header}>
                            <h3 className={styles.cardTitle}>Trust Items, Farm Provenance &amp; Verified Reviews</h3>
                            <p className={styles.sectionDesc}>
                                Third-party editorial acclaim, accredited customer testimonials, and direct partner farm
                                credentials.
                            </p>
                        </div>
                        <div className={styles.trustGrid}>
                            {TRUST_QUOTES.map((item, idx) => (
                                <div key={idx} className={styles.trustCard}>
                                    <span className={styles.trustTag}>Verified Editorial / Customer Quote</span>
                                    <h4 className={styles.trustTitle}>{item.name}</h4>
                                    <p className={styles.trustQuote}>&ldquo;{item.quote}&rdquo;</p>
                                    <span className={styles.trustSource}>{item.source}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
