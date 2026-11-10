import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const cowSvg = fs.readFileSync(path.join(ROOT, 'public/icons/cow.svg'), 'utf8');
// Extract the <g transform="translate(64, 64) scale(0.875)">...</g> block from cow.svg
const gMatch = cowSvg.match(/<g transform="translate\(64, 64\) scale\(0\.875\)">[\s\S]*?<\/g>/);
if (!gMatch) {
  throw new Error('Could not find cow vector <g> in public/icons/cow.svg');
}
const cowGroup = gMatch[0];

const outDir = path.join(ROOT, 'public/assets/gift-cards');
fs.mkdirSync(outDir, { recursive: true });

// 1. Oxblood Crimson CR80 Card (675 x 425 -> 3.375" x 2.125" aspect ratio)
const crimsonSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 675 425" width="675" height="425">
  <defs>
    <linearGradient id="crimson-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9A0F16" />
      <stop offset="55%" stop-color="#8B0A10" />
      <stop offset="100%" stop-color="#64060A" />
    </linearGradient>
    <path id="arch-top-crimson" d="M 145,152 A 235,145 0 0,1 530,152" />
    <path id="arch-bot-crimson" d="M 195,358 A 230,140 0 0,0 480,358" />
  </defs>

  <!-- Card Base -->
  <rect x="0" y="0" width="675" height="425" rx="28" fill="url(#crimson-bg)" />

  <!-- Outer & Inner Hairline Frame -->
  <rect x="16" y="16" width="643" height="393" rx="18" fill="none" stroke="#F59B1A" stroke-width="2.5" stroke-opacity="0.85" />
  <rect x="23" y="23" width="629" height="379" rx="13" fill="none" stroke="#F59B1A" stroke-width="1" stroke-opacity="0.45" />

  <!-- Arched HOFHERR Headline -->
  <text fill="#F3EAD8" font-family="Georgia, 'Times New Roman', serif" font-weight="900" font-size="64" letter-spacing="4">
    <textPath href="#arch-top-crimson" startOffset="50%" text-anchor="middle">HOFHERR</textPath>
  </text>

  <!-- MEAT CO. Subheader -->
  <text x="337.5" y="156" text-anchor="middle" fill="#F3EAD8" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="24" letter-spacing="3.5">MEAT CO.</text>

  <!-- Central Gold Flame Steer Medallion -->
  <g transform="translate(263.5, 174) scale(0.1445)">
    <circle cx="512" cy="512" r="496" fill="#F59B1A" stroke="#F3EAD8" stroke-width="26" />
    <circle cx="512" cy="512" r="462" fill="none" stroke="#8B0A10" stroke-width="14" stroke-opacity="0.45" />
    ${cowGroup}
  </g>

  <!-- Curved · GIFT CARD · Footer -->
  <text fill="#F3EAD8" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="26" letter-spacing="4">
    <textPath href="#arch-bot-crimson" startOffset="50%" text-anchor="middle">· GIFT CARD ·</textPath>
  </text>

  <!-- Dollar Value Write-In Box -->
  <g transform="translate(524, 336)">
    <rect x="0" y="0" width="110" height="52" rx="7" fill="#F3EAD8" stroke="#F59B1A" stroke-width="1.5" />
    <text x="12" y="35" fill="#8B0A10" font-family="Georgia, 'Times New Roman', serif" font-weight="900" font-size="25">$</text>
    <line x1="30" y1="37" x2="98" y2="37" stroke="#8B0A10" stroke-width="2" stroke-opacity="0.7" />
  </g>
</svg>`;

// 2. Smokehouse Amber CR80 Card
const amberSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 675 425" width="675" height="425">
  <defs>
    <linearGradient id="amber-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAA82C" />
      <stop offset="55%" stop-color="#F59B1A" />
      <stop offset="100%" stop-color="#DC820E" />
    </linearGradient>
    <path id="arch-top-amber" d="M 145,152 A 235,145 0 0,1 530,152" />
    <path id="arch-bot-amber" d="M 195,358 A 230,140 0 0,0 480,358" />
  </defs>

  <!-- Card Base -->
  <rect x="0" y="0" width="675" height="425" rx="28" fill="url(#amber-bg)" />

  <!-- Outer & Inner Hairline Frame -->
  <rect x="16" y="16" width="643" height="393" rx="18" fill="none" stroke="#8B0A10" stroke-width="2.5" stroke-opacity="0.85" />
  <rect x="23" y="23" width="629" height="379" rx="13" fill="none" stroke="#8B0A10" stroke-width="1" stroke-opacity="0.4" />

  <!-- Arched HOFHERR Headline -->
  <text fill="#8B0A10" font-family="Georgia, 'Times New Roman', serif" font-weight="900" font-size="64" letter-spacing="4">
    <textPath href="#arch-top-amber" startOffset="50%" text-anchor="middle">HOFHERR</textPath>
  </text>

  <!-- MEAT CO. Subheader -->
  <text x="337.5" y="156" text-anchor="middle" fill="#8B0A10" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="24" letter-spacing="3.5">MEAT CO.</text>

  <!-- Central Woodcut Flame Steer -->
  <g transform="translate(263.5, 174) scale(0.1445)">
    ${cowGroup}
  </g>

  <!-- Curved · GIFT CARD · Footer -->
  <text fill="#8B0A10" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="26" letter-spacing="4">
    <textPath href="#arch-bot-amber" startOffset="50%" text-anchor="middle">· GIFT CARD ·</textPath>
  </text>
</svg>`;

// 3. CR80 Card Back (Mag Stripe + Barcode + Northfield Provenance)
const barcodeBars = [
  [0, 5], [8, 2], [13, 4], [20, 2], [26, 6], [35, 2], [40, 4], [47, 3], [53, 2], [58, 6],
  [67, 3], [73, 2], [78, 5], [86, 2], [91, 4], [98, 6], [107, 2], [112, 3], [118, 5], [126, 2],
  [131, 4], [138, 2], [143, 6], [152, 3], [158, 2], [163, 5], [171, 2], [176, 4], [183, 3], [189, 6],
  [198, 2], [203, 4], [210, 2], [215, 5], [223, 3], [229, 2], [234, 6], [243, 2], [248, 4], [255, 5],
]
  .map(([x, w]) => `<rect x="${x}" y="0" width="${w}" height="68" fill="#181512" />`)
  .join('\n      ');

const backSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 675 425" width="675" height="425">
  <!-- Bone Cream Card Base -->
  <rect x="0" y="0" width="675" height="425" rx="28" fill="#EFE7D6" />
  <rect x="16" y="16" width="643" height="393" rx="18" fill="none" stroke="#8B0A10" stroke-width="2" stroke-opacity="0.55" />

  <!-- Magnetic Stripe -->
  <rect x="0" y="48" width="675" height="68" fill="#231F20" />

  <!-- Barcode Box -->
  <g transform="translate(177.5, 166)">
    <rect x="0" y="0" width="320" height="114" rx="8" fill="#FFFFFF" stroke="#D8CEBE" stroke-width="1.5" />
    <g transform="translate(30, 14)">
      ${barcodeBars}
    </g>
    <text x="160" y="102" text-anchor="middle" fill="#231F20" font-family="'Courier New', monospace" font-weight="700" font-size="16" letter-spacing="2">000135672008</text>
  </g>

  <!-- Provenance Footer -->
  <text x="337.5" y="346" text-anchor="middle" fill="#8B0A10" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="12" letter-spacing="2.2">NEVER EXPIRES · CUSTOM LOADED TO ANY AMOUNT</text>
  <text x="337.5" y="372" text-anchor="middle" fill="#231F20" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="12.5" letter-spacing="0.8">REDEEMABLE AT HOFHERR MEAT CO. · 300 HAPP RD, NORTHFIELD, IL · (847) 441-MEAT</text>
</svg>`;

// 4. Kraft Presentation Envelope Sleeve with Crimson Wax Seal
const kraftSleeveSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 675 425" width="675" height="425">
  <defs>
    <linearGradient id="kraft-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D2B08C" />
      <stop offset="50%" stop-color="#C8A47E" />
      <stop offset="100%" stop-color="#B38E68" />
    </linearGradient>
    <radialGradient id="wax-seal-grad" cx="38%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#B0151D" />
      <stop offset="55%" stop-color="#8B0A10" />
      <stop offset="100%" stop-color="#520408" />
    </radialGradient>
    <filter id="flap-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#2A1B0E" flood-opacity="0.32" />
    </filter>
    <filter id="wax-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#1E0E06" flood-opacity="0.48" />
    </filter>
  </defs>

  <!-- Envelope Base -->
  <rect x="0" y="0" width="675" height="425" rx="22" fill="url(#kraft-grad)" stroke="#9C7A56" stroke-width="2" />

  <!-- Subtle Butcher Stitch / Dieline Crease -->
  <rect x="18" y="18" width="639" height="389" rx="14" fill="none" stroke="#8B0A10" stroke-width="1.5" stroke-dasharray="6 5" stroke-opacity="0.35" />

  <!-- Bottom & Side Envelope Folds -->
  <path d="M 10,415 L 337.5,205 L 665,415 Z" fill="#C19C75" stroke="#9A7652" stroke-width="1.5" />
  <path d="M 8,12 L 265,212 L 8,412 Z" fill="#C6A27B" stroke="#9A7652" stroke-width="1.2" opacity="0.85" />
  <path d="M 667,12 L 410,212 L 667,412 Z" fill="#BF9A73" stroke="#9A7652" stroke-width="1.2" opacity="0.85" />

  <!-- Top Triangular Flap -->
  <path d="M 8,8 L 337.5,244 L 667,8 Z" fill="url(#kraft-grad)" stroke="#95724E" stroke-width="1.5" filter="url(#flap-shadow)" />

  <!-- Crimson Wax Seal with Flaming Steer Stamp -->
  <g filter="url(#wax-shadow)">
    <circle cx="337.5" cy="232" r="78" fill="url(#wax-seal-grad)" stroke="#68050A" stroke-width="3" />
    <circle cx="337.5" cy="232" r="64" fill="none" stroke="#F59B1A" stroke-width="2" stroke-opacity="0.65" />
    <circle cx="337.5" cy="232" r="58" fill="none" stroke="#F3EAD8" stroke-width="1" stroke-dasharray="4 3" stroke-opacity="0.45" />
    <g transform="translate(279.5, 174) scale(0.113)">
      ${cowGroup}
    </g>
  </g>

  <!-- Corner Provenance Label -->
  <text x="337.5" y="388" text-anchor="middle" fill="#5A3E28" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="800" font-size="12" letter-spacing="3">UNBLEACHED KRAFT SLEEVE · WAX SEALED · MAILED FREE</text>
</svg>`;

fs.writeFileSync(path.join(outDir, 'gift-card-crimson.svg'), crimsonSvg);
fs.writeFileSync(path.join(outDir, 'gift-card-amber.svg'), amberSvg);
fs.writeFileSync(path.join(outDir, 'gift-card-back.svg'), backSvg);
fs.writeFileSync(path.join(outDir, 'gift-card-kraft-sleeve.svg'), kraftSleeveSvg);

console.log('Generated 4 Gift Card SVGs in public/assets/gift-cards/');

