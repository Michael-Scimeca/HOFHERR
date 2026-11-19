/* Printable 12 x 16 in "Recipe on the Paper" parchment parcel sheets for /recipes.
   Every sheet scales its source recipe to 2 servings via scale.ts. */

import { RECIPES, type Recipe } from './recipes';
import { formatEstimate, planBuy, scaleIngredient, type BuyPlan } from './scale';
import { EXTENDED_PARCEL_SHEETS } from './sheets-extended';
import { SAFETY_SEAL_SHEET_CONCEPTS, SAFETY_SEAL_WIDGET_GROUPS } from './sheets-widgets-data';

export { SAFETY_SEAL_SHEET_CONCEPTS, SAFETY_SEAL_WIDGET_GROUPS };

export const SHEET_SERVINGS = 2;

export const PARCEL_OVEN_SAFETY_WARNING =
    'Oven only. Max 425°F. Keep away from the broiler, heating elements and open flame.';

export type ZoneShapeKind =
    | 'oil-ring'
    | 'salmon-pair'
    | 'pork-tenderloin'
    | 'pork-chops-pair'
    | 'sausage-trio'
    | 'chicken-thighs-pair'
    | 'pepper-onion-bed'
    | 'shallot-oil-bed'
    | 'oil-garlic-bed'
    | 'seasoning-pair'
    | 'butter-garlic'
    | 'butter-mustard'
    | 'butter-lemon'
    | 'mustard-honey-garlic'
    | 'lemon-dill'
    | 'cider-thyme'
    | 'thyme-sprigs'
    | 'garlic-pair'
    | 'splash-ring'
    | 'stock-parsley';

export type ZonePartCallout = {
    /** Exact product / ingredient name printed directly on this sub-outline. */
    product: string;
    /** Exact 2-serving amount for THIS sub-outline. */
    amount: string;
    /** Optional cut / prep micro-hint printed inside or under the sub-outline. */
    detail?: string;
    /** Optional custom woodcut cartouche text on primary cut shapes. */
    cartouche?: string;
};

export type SheetZoneSpec = {
    step: number;
    /** Center X in inches within the 11.50 in safe printable width (1.35..10.15 food bed). */
    cxIn: number;
    /** Center Y in inches within the 12.40 in SVG workspace (1.15..11.25 food bed). */
    cyIn: number;
    /** True physical width in inches at 100% print scale. */
    widthIn: number;
    /** True physical height in inches at 100% print scale. */
    heightIn: number;
    shape: ZoneShapeKind;
    /** Physical dimension callout shown beside the outline. */
    scaleNote: string;
    /** Action verb for how the cook places this zone. */
    instruction: string;
    /** Direct per-shape product + quantity callouts rendered inside each individual outline. */
    parts: ZonePartCallout[];
    /** Indices into recipe.ingredients (scaled to 2 servings) that belong to this zone, or 'buy' for primary meat. */
    source:
        | { kind: 'buy'; buyIndex: number; countLabel?: string }
        | { kind: 'ingredients'; indices: number[] };
};

export type ParcelSheetConfig = {
    slug: string;
    sheetTitle: string;
    ovenTemp: string;
    bakeTime: string;
    pullTemp: string;
    parcelTip: string;
    vignetteImage: string;
    foldSteps: [string, string, string];
    zones: SheetZoneSpec[];
};

export type ResolvedSheetZone = {
    step: number;
    cxIn: number;
    cyIn: number;
    widthIn: number;
    heightIn: number;
    shape: ZoneShapeKind;
    label: string;
    scaleNote: string;
    instruction: string;
    parts: ZonePartCallout[];
    isPrimaryCut: boolean;
};

export type ResolvedCookingSheet = {
    slug: string;
    recipe: Recipe;
    sheetTitle: string;
    servings: number;
    ovenTemp: string;
    bakeTime: string;
    pullTemp: string;
    parcelTip: string;
    vignetteImage: string;
    foldSteps: [string, string, string];
    buyPlans: BuyPlan[];
    primaryBuy: BuyPlan;
    estimatedTotal: string;
    onlineOrderPath: string;
    onlineOrderQrUrl: string;
    scaledIngredients: string[];
    zones: ResolvedSheetZone[];
};

export type SkipCategory =
    | 'grilled'
    | 'braised'
    | 'high-heat-sear'
    | 'whole-roast'
    | 'foil-broil'
    | 'stovetop-or-mixed';

export type SkippedRecipeInfo = {
    slug: string;
    title: string;
    cut: string;
    category: SkipCategory;
    reason: string;
};

export const SKIP_CATEGORY_LABELS: Record<SkipCategory, string> = {
    grilled: 'Live-Fire Grill Required',
    braised: 'Long Submerged Collagen Braise',
    'high-heat-sear': 'Dry Cast-Iron Sear or Pan-Fry',
    'whole-roast': 'Dry-Heat Open Roast or Whole Bird',
    'foil-broil': 'Multi-Hour Rib Slab + Broiler Char',
    'stovetop-or-mixed': 'Stovetop Skillet, Mixed Sear-Then-Bake, or Open Dish',
};

export const PARCEL_SHEET_CONFIGS: ParcelSheetConfig[] = [
    {
        slug: 'salmon-parcel',
        sheetTitle: 'Salmon Fillets with Lemon-Dill Butter',
        ovenTemp: '400°F',
        bakeTime: '12–15 min',
        pullTemp: '145°F (USDA Fish)',
        parcelTip: 'Lay fillets skin-side down on the oiled ring so the flesh steams gently in lemon-dill butter.',
        vignetteImage: '/assets/recipes/sheets/salmon-parcel-vignette.jpg',
        foldSteps: [
            'Bring left & right long edges together above the fillets and double-fold 1/2 in twice.',
            'Tuck top corners inward along angled dashes and roll the top end tight toward the fish.',
            'Tuck bottom corners inward, crease hard underneath to trap steam, and bake on a half-sheet pan.',
        ],
        zones: [
            {
                step: 1,
                cxIn: 5.75,
                cyIn: 2.62,
                widthIn: 1.8,
                heightIn: 1.8,
                shape: 'oil-ring',
                scaleNote: 'Ø 1.80 in brush zone',
                instruction: 'Brush across center bed first',
                parts: [{ product: 'HIGH-HEAT OIL', amount: '1/2 TBSP', detail: 'AVOCADO OR OLIVE' }],
                source: { kind: 'ingredients', indices: [2] },
            },
            {
                step: 2,
                cxIn: 5.75,
                cyIn: 5.35,
                widthIn: 5.75,
                heightIn: 5.2,
                shape: 'salmon-pair',
                scaleNote: '2 fillets · 5.20 × 2.15 in each',
                instruction: 'Set skin-side down on outlines',
                parts: [
                    { product: 'HOFHERR SALMON FILLET', amount: '6 OZ CENTER-CUT', detail: 'SKIN-SIDE DOWN' },
                    { product: 'HOFHERR SALMON FILLET', amount: '6 OZ CENTER-CUT', detail: 'SKIN-SIDE DOWN' },
                ],
                source: { kind: 'buy', buyIndex: 0, countLabel: '2 salmon fillets (6 oz each)' },
            },
            {
                step: 3,
                cxIn: 2.55,
                cyIn: 9.25,
                widthIn: 1.85,
                heightIn: 1.1,
                shape: 'seasoning-pair',
                scaleNote: 'Ø 0.85 + Ø 0.65 in',
                instruction: 'Season both fillets',
                parts: [
                    { product: 'KOSHER SALT', amount: '1/2 TSP', detail: 'COARSE FLAKE' },
                    { product: 'BLACK PEPPER', amount: '1/4 TSP', detail: 'CRACKED' },
                ],
                source: { kind: 'ingredients', indices: [0, 1] },
            },
            {
                step: 4,
                cxIn: 5.65,
                cyIn: 9.25,
                widthIn: 2.85,
                heightIn: 1.35,
                shape: 'butter-garlic',
                scaleNote: 'Ø 1.25 + Ø 0.90 in pats',
                instruction: 'Dot butter & garlic on fish',
                parts: [
                    { product: 'UNSALTED BUTTER', amount: '1 TBSP', detail: '1/2" STICK SLICE' },
                    { product: 'UNSALTED BUTTER', amount: '1/2 TBSP', detail: '1/4" SLICE' },
                    { product: 'FRESH GARLIC', amount: '1/2 CLOVE', detail: 'MINCED' },
                ],
                source: { kind: 'ingredients', indices: [3, 4] },
            },
            {
                step: 5,
                cxIn: 8.75,
                cyIn: 9.2,
                widthIn: 2.4,
                heightIn: 2.15,
                shape: 'lemon-dill',
                scaleNote: 'Ø 2.15 in lemon + dill',
                instruction: 'Squeeze lemon & scatter dill',
                parts: [
                    { product: 'FRESH LEMON', amount: '1/2 LEMON', detail: 'SQUEEZE JUICE' },
                    { product: 'FRESH DILL', amount: '1 TBSP CHOPPED' },
                ],
                source: { kind: 'ingredients', indices: [5, 6] },
            },
        ],
    },
    {
        slug: 'pork-tenderloin-parcel',
        sheetTitle: 'Honey-Mustard Pork Tenderloin',
        ovenTemp: '400°F',
        bakeTime: '20–24 min',
        pullTemp: '145°F (USDA Pork)',
        parcelTip: 'Tuck the thin tail end under by 1.5 inches so the tenderloin cooks evenly from end to end.',
        vignetteImage: '/assets/recipes/sheets/pork-tenderloin-parcel-vignette.jpg',
        foldSteps: [
            'Bring left & right long edges up above the tenderloin and crease tightly in two 1/2 in folds.',
            'Fold top gusset corners inward and roll the top edge snug against the roast.',
            'Fold bottom corners in, crimp underneath to seal the glaze steam, and bake at 400°F.',
        ],
        zones: [
            {
                step: 1,
                cxIn: 5.75,
                cyIn: 2.62,
                widthIn: 1.8,
                heightIn: 1.8,
                shape: 'oil-ring',
                scaleNote: 'Ø 1.80 in coat ring',
                instruction: 'Coat center parchment bed',
                parts: [{ product: 'OLIVE OIL', amount: '1/2 TBSP', detail: 'EXTRA-VIRGIN' }],
                source: { kind: 'ingredients', indices: [2] },
            },
            {
                step: 2,
                cxIn: 5.75,
                cyIn: 5.1,
                widthIn: 7.2,
                heightIn: 2.25,
                shape: 'pork-tenderloin',
                scaleNote: '7.20 × 2.25 in trimmed roast',
                instruction: 'Lay trimmed tenderloin on contour',
                parts: [
                    {
                        product: 'HOFHERR PORK TENDERLOIN',
                        amount: '1 ROAST (~0.75 LB)',
                        detail: 'SILVERSKIN TRIMMED · 7.20" × 2.25"',
                    },
                ],
                source: { kind: 'buy', buyIndex: 0 },
            },
            {
                step: 3,
                cxIn: 2.65,
                cyIn: 7.65,
                widthIn: 1.85,
                heightIn: 1.1,
                shape: 'seasoning-pair',
                scaleNote: 'Ø 0.85 in + Ø 0.65 in pinches',
                instruction: 'Season all sides of pork',
                parts: [
                    { product: 'KOSHER SALT', amount: '1/2 TSP', detail: 'COARSE FLAKE' },
                    { product: 'BLACK PEPPER', amount: '1/4 TSP', detail: 'CRACKED' },
                ],
                source: { kind: 'ingredients', indices: [0, 1] },
            },
            {
                step: 4,
                cxIn: 6.85,
                cyIn: 7.65,
                widthIn: 3.6,
                heightIn: 1.4,
                shape: 'mustard-honey-garlic',
                scaleNote: 'Two Ø 1.35 in tbsp circles + clove',
                instruction: 'Stir & brush glaze over top',
                parts: [
                    { product: 'DIJON MUSTARD', amount: '1 TBSP', detail: 'SMOOTH DIJON' },
                    { product: 'RAW HONEY', amount: '1 TBSP', detail: 'STIR INTO GLAZE' },
                    { product: 'FRESH GARLIC', amount: '1 CLOVE', detail: 'MINCED' },
                ],
                source: { kind: 'ingredients', indices: [3, 4, 5] },
            },
            {
                step: 5,
                cxIn: 5.75,
                cyIn: 9.75,
                widthIn: 4.2,
                heightIn: 1.15,
                shape: 'thyme-sprigs',
                scaleNote: '3.60 in fresh thyme sprigs',
                instruction: 'Strip leaves & lay over glaze',
                parts: [{ product: 'FRESH THYME LEAVES', amount: '1/2 TBSP STRIPPED' }],
                source: { kind: 'ingredients', indices: [6] },
            },
        ],
    },
    {
        slug: 'pork-chops-parcel',
        sheetTitle: 'Bone-In Pork Chops with Cider Mustard Jus',
        ovenTemp: '400°F',
        bakeTime: '22–25 min',
        pullTemp: '145°F (USDA Pork)',
        parcelTip: 'Cup the bottom end slightly before the final crimp so the apple cider stays around the shallots.',
        vignetteImage: '/assets/recipes/sheets/pork-chops-parcel-vignette.jpg',
        foldSteps: [
            'Bring long side flaps up to meet above the chops and fold down twice in crisp 1/2 in creases.',
            'Fold top corners in and roll the top end closed first so the parcel forms a pocket.',
            'Pour apple cider into Zone 5, then crimp the bottom end tight and set flat on a sheet pan.',
        ],
        zones: [
            {
                step: 1,
                cxIn: 5.75,
                cyIn: 2.48,
                widthIn: 3.4,
                heightIn: 1.35,
                shape: 'shallot-oil-bed',
                scaleNote: '1.85 × 1.15 in shallot + oil',
                instruction: 'Scatter chopped shallot & oil on bed',
                parts: [
                    { product: 'SHALLOT', amount: '1/2 BULB', detail: 'FINELY CHOPPED' },
                    { product: 'HIGH-HEAT OIL', amount: '1/2 TBSP', detail: 'COAT BED' },
                ],
                source: { kind: 'ingredients', indices: [2, 4] },
            },
            {
                step: 2,
                cxIn: 5.75,
                cyIn: 5.5,
                widthIn: 7.45,
                heightIn: 4.55,
                shape: 'pork-chops-pair',
                scaleNote: '2 bone-in chops · 4.55 × 3.55 in each',
                instruction: 'Set bone-in chops over shallots',
                parts: [
                    { product: 'HOFHERR BONE-IN CHOP', amount: '~12 OZ RIB CHOP', detail: 'THICK-CUT LOIN' },
                    { product: 'HOFHERR BONE-IN CHOP', amount: '~12 OZ RIB CHOP', detail: 'THICK-CUT LOIN' },
                ],
                source: { kind: 'buy', buyIndex: 0, countLabel: '2 bone-in pork chops (about 1.5 lb)' },
            },
            {
                step: 3,
                cxIn: 2.55,
                cyIn: 9.4,
                widthIn: 1.95,
                heightIn: 1.1,
                shape: 'seasoning-pair',
                scaleNote: 'Ø 1.05 in + Ø 0.80 in pinches',
                instruction: 'Season both sides generously',
                parts: [
                    { product: 'KOSHER SALT', amount: '1 TSP', detail: 'COARSE FLAKE' },
                    { product: 'BLACK PEPPER', amount: '1/2 TSP', detail: 'CRACKED' },
                ],
                source: { kind: 'ingredients', indices: [0, 1] },
            },
            {
                step: 4,
                cxIn: 5.6,
                cyIn: 9.4,
                widthIn: 2.5,
                heightIn: 1.3,
                shape: 'butter-mustard',
                scaleNote: 'Ø 1.25 in butter + Ø 0.95 in mustard',
                instruction: 'Dot butter & smear grain mustard',
                parts: [
                    { product: 'UNSALTED BUTTER', amount: '1 TBSP', detail: '1/2" STICK SLICE' },
                    { product: 'GRAIN MUSTARD', amount: '1/2 TBSP', detail: 'WHOLE-GRAIN' },
                ],
                source: { kind: 'ingredients', indices: [3, 6] },
            },
            {
                step: 5,
                cxIn: 8.65,
                cyIn: 9.4,
                widthIn: 2.55,
                heightIn: 2.1,
                shape: 'cider-thyme',
                scaleNote: 'Ø 2.10 in splash + 3.10 in sprig',
                instruction: 'Add thyme & splash cider before Fold 3',
                parts: [
                    { product: 'APPLE CIDER', amount: '1/3 CUP', detail: 'UNFILTERED' },
                    { product: 'FRESH THYME', amount: '1 WHOLE SPRIG' },
                ],
                source: { kind: 'ingredients', indices: [5, 7] },
            },
        ],
    },
    {
        slug: 'sausage-peppers-parcel',
        sheetTitle: 'Sweet Italian Sausage & Sweet Bell Peppers',
        ovenTemp: '400°F',
        bakeTime: '26–30 min',
        pullTemp: '160°F (USDA Sausage)',
        parcelTip: 'Slice peppers 1/2 inch wide so they soften right as the natural-casing links hit 160°F.',
        vignetteImage: '/assets/recipes/sheets/sausage-peppers-parcel-vignette.jpg',
        foldSteps: [
            'Bring left & right long edges up over the sausages and peppers; double-crease 1/2 in twice.',
            'Tuck top corners along the diagonal dashes and roll closed to lock one end.',
            'Add the wine & vinegar splash, crimp the bottom end shut, and bake 28–32 min.',
        ],
        zones: [
            {
                step: 1,
                cxIn: 5.75,
                cyIn: 3.08,
                widthIn: 6.5,
                heightIn: 2.2,
                shape: 'pepper-onion-bed',
                scaleNote: '6.50 × 2.20 in pepper & onion bed',
                instruction: 'Toss sliced peppers & onion in oil on bed',
                parts: [
                    { product: '2 BELL PEPPERS', amount: '1/2" SLICED STRIPS' },
                    { product: '1 YELLOW ONION', amount: 'THINLY SLICED' },
                    { product: 'OLIVE OIL', amount: '1 TBSP', detail: 'TOSS ON BED' },
                ],
                source: { kind: 'ingredients', indices: [0, 1, 2] },
            },
            {
                step: 2,
                cxIn: 5.75,
                cyIn: 6.32,
                widthIn: 5.2,
                heightIn: 3.9,
                shape: 'sausage-trio',
                scaleNote: '3 links · 5.20 × 1.20 in each',
                instruction: 'Nestle links atop pepper ribbons',
                parts: [
                    { product: 'HOFHERR SWEET ITALIAN SAUSAGE', amount: 'LINK I (~4 OZ)', detail: '5.20" × 1.20"' },
                    { product: 'HOFHERR SWEET ITALIAN SAUSAGE', amount: 'LINK II (~4 OZ)', detail: '5.20" × 1.20"' },
                    { product: 'HOFHERR SWEET ITALIAN SAUSAGE', amount: 'LINK III (~4 OZ)', detail: '5.20" × 1.20"' },
                ],
                source: { kind: 'buy', buyIndex: 0, countLabel: '3 Italian sausage links (about 0.75 lb)' },
            },
            {
                step: 3,
                cxIn: 2.65,
                cyIn: 9.5,
                widthIn: 2.1,
                heightIn: 1.0,
                shape: 'garlic-pair',
                scaleNote: '2 cloves · 0.95 × 0.55 in each',
                instruction: 'Scatter sliced garlic over links',
                parts: [
                    { product: 'GARLIC CLOVE I', amount: 'THINLY SLICED' },
                    { product: 'GARLIC CLOVE II', amount: 'THINLY SLICED' },
                ],
                source: { kind: 'ingredients', indices: [3] },
            },
            {
                step: 4,
                cxIn: 5.65,
                cyIn: 9.5,
                widthIn: 1.9,
                heightIn: 1.05,
                shape: 'seasoning-pair',
                scaleNote: 'Ø 0.85 in + Ø 0.65 in pinches',
                instruction: 'Sprinkle oregano, flakes, salt & pepper',
                parts: [
                    { product: 'DRIED OREGANO', amount: '1/2 TSP', detail: '+ PINCH SALT' },
                    { product: 'CHILI FLAKES', amount: '1/4 TSP', detail: 'RED PEPPER' },
                ],
                source: { kind: 'ingredients', indices: [4, 5] },
            },
            {
                step: 5,
                cxIn: 8.65,
                cyIn: 9.16,
                widthIn: 2.15,
                heightIn: 2.1,
                shape: 'splash-ring',
                scaleNote: 'Ø 2.10 in wine & vinegar target',
                instruction: 'Splash in right before sealing Fold 3',
                parts: [
                    { product: 'DRY WHITE WINE', amount: '1/4 CUP', detail: '+ 1/2 TBSP VINEGAR' },
                ],
                source: { kind: 'ingredients', indices: [6, 7] },
            },
        ],
    },
    {
        slug: 'chicken-thighs-parcel',
        sheetTitle: 'Bone-In Chicken Thighs with Garlic, Lemon & Butter',
        ovenTemp: '425°F',
        bakeTime: '30–35 min',
        pullTemp: '165°F (USDA Poultry)',
        parcelTip: 'For extra color on the skin, open the top seam carefully for the final 4 minutes at 425°F.',
        vignetteImage: '/assets/recipes/sheets/chicken-thighs-parcel-vignette.jpg',
        foldSteps: [
            'Draw both long sides up above the thighs and fold down twice in tight 1/2 in creases.',
            'Crease top diagonal corners inward and roll the top flap snug.',
            'Splash in stock, crimp bottom corners underneath to seal, and bake at 425°F.',
        ],
        zones: [
            {
                step: 1,
                cxIn: 5.75,
                cyIn: 2.55,
                widthIn: 3.1,
                heightIn: 1.35,
                shape: 'oil-garlic-bed',
                scaleNote: 'Ø 1.60 in oil + 2 smashed cloves',
                instruction: 'Rub oil & set smashed garlic on bed',
                parts: [
                    { product: 'OLIVE OIL', amount: '1 1/2 TSP', detail: 'RUB ON BED' },
                    { product: '2 GARLIC CLOVES', amount: 'SMASHED FLAT' },
                ],
                source: { kind: 'ingredients', indices: [2, 3] },
            },
            {
                step: 2,
                cxIn: 5.75,
                cyIn: 5.5,
                widthIn: 7.45,
                heightIn: 4.35,
                shape: 'chicken-thighs-pair',
                scaleNote: '2 chicken thighs · 4.35 × 3.55 in each',
                instruction: 'Place 2 bone-in thighs skin-side up',
                parts: [
                    { product: 'HOFHERR CHICKEN THIGH', amount: 'BONE-IN · ~10 OZ', detail: 'SKIN-SIDE UP' },
                    { product: 'HOFHERR CHICKEN THIGH', amount: 'BONE-IN · ~10 OZ', detail: 'SKIN-SIDE UP' },
                ],
                source: { kind: 'buy', buyIndex: 0, countLabel: '2 bone-in chicken thighs (about 1.25 lb)' },
            },
            {
                step: 3,
                cxIn: 2.55,
                cyIn: 9.4,
                widthIn: 1.95,
                heightIn: 1.1,
                shape: 'seasoning-pair',
                scaleNote: 'Ø 1.05 in + Ø 0.80 in pinches',
                instruction: 'Season skin & underside well',
                parts: [
                    { product: 'KOSHER SALT', amount: '1 TSP', detail: 'COARSE FLAKE' },
                    { product: 'BLACK PEPPER', amount: '1/2 TSP', detail: 'CRACKED' },
                ],
                source: { kind: 'ingredients', indices: [0, 1] },
            },
            {
                step: 4,
                cxIn: 5.6,
                cyIn: 9.4,
                widthIn: 3.2,
                heightIn: 2.15,
                shape: 'butter-lemon',
                scaleNote: 'Ø 0.90 in butter + Ø 2.15 in lemon',
                instruction: 'Dot butter & squeeze half lemon over',
                parts: [
                    { product: 'UNSALTED BUTTER', amount: '1/2 TBSP', detail: '1/4" SLICE' },
                    { product: 'FRESH LEMON', amount: '1/2 LEMON', detail: 'SQUEEZE JUICE' },
                ],
                source: { kind: 'ingredients', indices: [6, 5] },
            },
            {
                step: 5,
                cxIn: 8.75,
                cyIn: 9.4,
                widthIn: 2.45,
                heightIn: 2.0,
                shape: 'stock-parsley',
                scaleNote: 'Ø 2.00 in stock + parsley leaves',
                instruction: 'Splash stock & scatter parsley',
                parts: [
                    { product: 'CHICKEN STOCK', amount: '1/4 CUP', detail: 'POUR IN PACKET' },
                    { product: 'FRESH PARSLEY', amount: '1 TBSP CHOPPED' },
                ],
                source: { kind: 'ingredients', indices: [4, 7] },
            },
        ],
    },
];

export const SKIPPED_RECIPES: SkippedRecipeInfo[] = [
    // Grilled (5)
    {
        slug: 'sirloin',
        title: 'Grilled tri-tip with chimichurri',
        cut: 'Sirloin',
        category: 'grilled',
        reason: 'Requires a two-zone charcoal or gas grill sear and raw fresh herb chimichurri spooned after carving.',
    },
    {
        slug: 'plate',
        title: 'Skirt steak tacos',
        cut: 'Plate',
        category: 'grilled',
        reason: 'Thin outer skirt needs blistering live fire or dry cast iron for 2 minutes per side; parchment steams and overcooks it.',
    },
    {
        slug: 'flank',
        title: 'Soy-ginger flank steak',
        cut: 'Flank',
        category: 'grilled',
        reason: 'Relies on high radiant grill or broiler heat to caramelize the soy-honey marinade in 4 minutes per side.',
    },
    {
        slug: 'picanha',
        title: 'Grilled picanha',
        cut: 'Sirloin Cap',
        category: 'grilled',
        reason: 'Built around rendering and crisping a crosshatched fat cap directly over open grill grates.',
    },
    {
        slug: 'beer-brats',
        title: 'Beer brats with onions',
        cut: 'Bratwurst',
        category: 'grilled',
        reason: 'Poached in 24 oz of simmering lager on the stove, then browned over open grill grates.',
    },

    // Long collagen braises & stews (9)
    {
        slug: 'head',
        title: 'Braised beef cheek ragu',
        cut: 'Head',
        category: 'braised',
        reason: 'Dense cheek collagen requires a 3-hour submerged wine-and-tomato Dutch oven braise plus boiled pasta.',
    },
    {
        slug: 'chuck',
        title: 'Sunday pot roast',
        cut: 'Chuck',
        category: 'braised',
        reason: 'Chuck connective tissue needs a hard stovetop sear and 3+ hours submerged in stock inside a lidded Dutch oven.',
    },
    {
        slug: 'brisket',
        title: 'Oven-braised brisket',
        cut: 'Brisket',
        category: 'braised',
        reason: 'Requires browning onions and simmering 3.5 hours in wine and beef stock; parchment cannot hold liquid braise volume.',
    },
    {
        slug: 'shank',
        title: 'Red wine braised beef shank',
        cut: 'Shank',
        category: 'braised',
        reason: 'Tough marrow-bone shank needs 3 hours two-thirds submerged in reduced red wine and beef stock.',
    },
    {
        slug: 'short-ribs',
        title: 'Red wine braised short ribs',
        cut: 'Short Rib',
        category: 'braised',
        reason: 'Bone-in braising short ribs require batch browning, fat skimming, and a 3-hour covered wine braise.',
    },
    {
        slug: 'oxtail',
        title: 'Braised oxtail',
        cut: 'Tail',
        category: 'braised',
        reason: 'Collagen-rich tail joints require 3.5 hours submerged in stock and wine plus fat skimming.',
    },
    {
        slug: 'beef-stew',
        title: 'Classic beef stew',
        cut: 'Chuck',
        category: 'braised',
        reason: 'Flour-dusted chuck cubes simmered in 4 cups of beef stock and wine in a Dutch oven.',
    },
    {
        slug: 'pulled-pork',
        title: 'Oven pulled pork',
        cut: 'Pork Shoulder',
        category: 'braised',
        reason: 'Whole 5 lb bone-in shoulder cooks 6 hours to 200°F internal; exceeds parchment parcel capacity and burn time.',
    },
    {
        slug: 'lamb-shanks',
        title: 'Braised lamb shanks',
        cut: 'Lamb Shank',
        category: 'braised',
        reason: 'Requires a 3-hour Dutch oven braise in wine, crushed tomatoes, and beef stock until meat pulls from the bone.',
    },

    // Foil rib slabs + broiler/grill finish (2)
    {
        slug: 'beef-back-ribs',
        title: 'Oven-barbecued beef back ribs',
        cut: 'Rib',
        category: 'foil-broil',
        reason: 'Full 7-rib slab bakes 3 hours then chars under a broiler; parchment paper ignites under broiler elements.',
    },
    {
        slug: 'baby-back-ribs',
        title: 'Baby back ribs, oven then grill',
        cut: 'Pork Loin Ribs',
        category: 'foil-broil',
        reason: 'Full 19-inch rib rack exceeds a 16-inch half-sheet liner and finishes over live grill or broiler flames.',
    },

    // Dry cast-iron sear / griddle crust / flour sauté (6)
    {
        slug: 'rib',
        title: 'Reverse-seared bone-in ribeye',
        cut: 'Rib',
        category: 'high-heat-sear',
        reason: 'Needs dry circulating air to dehydrate the surface followed by a smoking cast-iron crust sear; steam turns ribeye gray.',
    },
    {
        slug: 'short-loin',
        title: 'Cast-iron New York strip',
        cut: 'Short Loin',
        category: 'high-heat-sear',
        reason: 'Steakhouse strip relies on dry, smoking cast iron for Maillard browning and foaming-butter basting.',
    },
    {
        slug: 'filet-mignon',
        title: 'Filet mignon with peppercorn sauce',
        cut: 'Tenderloin',
        category: 'high-heat-sear',
        reason: 'Requires a hard pan sear plus a stovetop brandy-and-heavy-cream reduction that splits if sealed in parchment.',
    },
    {
        slug: 'hanger-steak',
        title: 'Hanger steak with shallot pan sauce',
        cut: 'Plate',
        category: 'high-heat-sear',
        reason: 'Loose-grained butcher steak needs fast, dry cast-iron heat and a reduced red-wine pan sauce.',
    },
    {
        slug: 'smash-burgers',
        title: 'Double smash burgers',
        cut: 'Ground Chuck',
        category: 'high-heat-sear',
        reason: 'Must be pressed flat onto a dry, smoking griddle with a metal spatula to form a crisp lacy crust.',
    },
    {
        slug: 'veal-piccata',
        title: 'Veal piccata',
        cut: 'Veal Leg',
        category: 'high-heat-sear',
        reason: 'Flour-dredged 1/4-inch scallopini sauté in 90 seconds on the stove; steaming raw flour in a parcel turns pasty.',
    },

    // Dry-heat open roasts, whole birds & holiday centerpieces (13)
    {
        slug: 'round',
        title: 'Herb-crusted eye of round',
        cut: 'Round',
        category: 'whole-roast',
        reason: 'Starts with a dry 450°F blast on an open roasting rack to set an exterior herb-mustard roast-beef crust.',
    },
    {
        slug: 'turkey',
        title: 'Herb-butter roast turkey',
        cut: 'Whole Turkey',
        category: 'whole-roast',
        reason: 'Whole 13 lb holiday bird cannot scale to a 2-serving flat parcel and needs open dry air for crisp skin.',
    },
    {
        slug: 'prime-rib',
        title: 'Garlic-herb prime rib',
        cut: 'Rib',
        category: 'whole-roast',
        reason: 'Standing bone-in rib roast (6.5 lb) requires dry 450°F roasting uncovered on a rack.',
    },
    {
        slug: 'lamb',
        title: 'Roast leg of lamb with garlic and rosemary',
        cut: 'Leg of Lamb',
        category: 'whole-roast',
        reason: 'Whole 6.5 lb bone-in leg roasts uncovered on a rack above potatoes so drippings crisp them.',
    },
    {
        slug: 'beef-tenderloin',
        title: 'Roast beef tenderloin with red wine sauce',
        cut: 'Tenderloin',
        category: 'whole-roast',
        reason: 'Whole 4 lb tied centerpiece roast requires pan-searing, open-rack roasting, and a separate stovetop wine reduction.',
    },
    {
        slug: 'crown-roast',
        title: 'Crown roast of pork',
        cut: 'Pork Rib Roast',
        category: 'whole-roast',
        reason: 'Fixed 12-serving tied two-rack ring showpiece; cannot scale to 2 servings or fold into parchment.',
    },
    {
        slug: 'glazed-ham',
        title: 'Holiday ham with maple-mustard glaze',
        cut: 'Ham',
        category: 'whole-roast',
        reason: 'Whole 9 lb spiral bone-in ham finishes uncovered at 425°F to bubble and set the maple glaze.',
    },
    {
        slug: 'spatchcock-turkey',
        title: 'Dry-brined spatchcock turkey',
        cut: 'Whole Turkey',
        category: 'whole-roast',
        reason: 'Flattened 12 lb bird fills an entire 18 × 13 in pan uncovered so every inch of skin crisps.',
    },
    {
        slug: 'turkey-breast',
        title: 'Roast turkey breast with lemon and thyme',
        cut: 'Turkey Breast',
        category: 'whole-roast',
        reason: 'Whole 6 lb bone-in breast relies on overnight dry-brining and open 425°F roasting for browned skin.',
    },
    {
        slug: 'roast-chicken',
        title: 'Sunday roast chicken',
        cut: 'Whole Chicken',
        category: 'whole-roast',
        reason: 'Whole 4.5 lb trussed roaster bird is too tall to crimp inside a 12 × 16 in flat parcel and needs dry heat for crisp skin.',
    },
    {
        slug: 'wings',
        title: 'Oven-crisp buffalo wings',
        cut: 'Chicken Wings',
        category: 'whole-roast',
        reason: 'Baking-powder wings need dry 425°F airflow on a wire rack to blister like fried wings; steam makes wing skin rubbery.',
    },
    {
        slug: 'roast-duck',
        title: 'Roast duck with orange-honey glaze',
        cut: 'Whole Duck',
        category: 'whole-roast',
        reason: 'Whole duck must be pricked, turned, and drained of rendered fat twice in an open pan.',
    },
    {
        slug: 'rack-of-lamb',
        title: 'Herb-crusted rack of lamb',
        cut: 'Rack of Lamb',
        category: 'whole-roast',
        reason: 'Pan-seared and pressed with buttered breadcrumbs that require dry open oven heat so the crust stays crisp, not soggy.',
    },

    // Stovetop sauces & bowl-mixed bakes (3)
    {
        slug: 'meatloaf',
        title: 'Classic glazed meatloaf',
        cut: 'Beef, Pork and Veal',
        category: 'stovetop-or-mixed',
        reason: 'Requires skillet-softening onions, soaking breadcrumbs in milk, hand-mixing beaten eggs with ground meat, and baking uncovered to set the glaze.',
    },
    {
        slug: 'sausage-stuffing',
        title: 'Sausage and sage stuffing',
        cut: 'Pork Sausage',
        category: 'stovetop-or-mixed',
        reason: 'Requires oven-drying bread cubes, skillet-browning bulk sausage, whisking a 3-cup stock-and-egg custard, and baking uncovered for a crisp top.',
    },
    {
        slug: 'turkey-gravy',
        title: 'Make-ahead turkey gravy',
        cut: 'Turkey Wings',
        category: 'stovetop-or-mixed',
        reason: 'A strained 6-cup stock simmer and stovetop butter-flour roux sauce rather than an oven parcel dish.',
    },
    {
        slug: 'salmon',
        title: 'Pan-roasted salmon with lemon-dill butter',
        cut: 'Salmon Fillet',
        category: 'high-heat-sear',
        reason: 'Pan-seared skin-side down in shimmering oil in a 12-inch stovetop skillet to crisp the skin (not baked in an oven).',
    },
    {
        slug: 'pork-chops',
        title: 'Pan-seared pork chops with cider mustard sauce',
        cut: 'Pork Loin',
        category: 'high-heat-sear',
        reason: 'Pan-seared in a hot cast-iron skillet over medium-high stovetop heat with a reduced skillet pan sauce.',
    },
    {
        slug: 'pork-tenderloin',
        title: 'Honey-mustard pork tenderloin',
        cut: 'Pork Tenderloin',
        category: 'stovetop-or-mixed',
        reason: 'Mixes cooking methods: seared on all sides for 6 minutes in a hot stovetop skillet before transferring to a 400°F oven.',
    },
    {
        slug: 'sausage-and-peppers',
        title: 'Italian sausage and peppers',
        cut: 'Italian Sausage',
        category: 'stovetop-or-mixed',
        reason: 'Browned and simmered covered in a 12-inch skillet over medium stovetop heat rather than baked in an oven.',
    },
    {
        slug: 'chicken-thighs',
        title: 'Crispy skillet chicken thighs',
        cut: 'Chicken Thigh',
        category: 'stovetop-or-mixed',
        reason: 'Mixes cooking methods: rendered skin-side down for 12–15 minutes on a medium stovetop burner before moving to a 425°F oven.',
    },
];

const CONFIG_BY_SLUG = new Map(PARCEL_SHEET_CONFIGS.map(c => [c.slug, c]));
const RECIPE_BY_SLUG = new Map(RECIPES.map(r => [r.slug, r]));
const EXTENDED_BY_SLUG = new Map(EXTENDED_PARCEL_SHEETS.map(s => [s.slug, s]));

export function hasCookingSheet(slug: string): boolean {
    const recipe = RECIPE_BY_SLUG.get(slug);
    return Boolean(recipe?.parcelFriendly) && CONFIG_BY_SLUG.has(slug);
}

export function resolveCookingSheet(slug: string): ResolvedCookingSheet | null {
    const extended = EXTENDED_BY_SLUG.get(slug);
    if (extended) return extended;

    const cfg = CONFIG_BY_SLUG.get(slug);
    const recipe = RECIPE_BY_SLUG.get(slug);
    if (!cfg || !recipe || !recipe.parcelFriendly) return null;

    const factor = SHEET_SERVINGS / recipe.baseServings;
    const buyPlans = recipe.buy.map(item => planBuy(item, factor));
    const primaryBuy = buyPlans[0];
    const totalCost = buyPlans.reduce((sum, p) => sum + p.cost, 0);
    const scaledIngredients = recipe.ingredients.map(line => scaleIngredient(line, factor));

    const encodedCut = encodeURIComponent(primaryBuy.item.name);
    const onlineOrderPath = `/online-orders?q=${encodedCut}`;
    const onlineOrderQrUrl = 'https://hofherrmeatco.com/';

    const zones: ResolvedSheetZone[] = cfg.zones.map(z => {
        if (z.source.kind === 'buy') {
            const bp = buyPlans[z.source.buyIndex] ?? primaryBuy;
            const label = z.source.countLabel ?? `${bp.item.name} (${bp.label})`;
            return {
                step: z.step,
                cxIn: z.cxIn,
                cyIn: z.cyIn,
                widthIn: z.widthIn,
                heightIn: z.heightIn,
                shape: z.shape,
                label,
                scaleNote: z.scaleNote,
                instruction: z.instruction,
                parts: z.parts,
                isPrimaryCut: true,
            };
        }

        const label = z.source.indices
            .map(idx => scaledIngredients[idx])
            .filter(Boolean)
            .join(' + ');

        return {
            step: z.step,
            cxIn: z.cxIn,
            cyIn: z.cyIn,
            widthIn: z.widthIn,
            heightIn: z.heightIn,
            shape: z.shape,
            label,
            scaleNote: z.scaleNote,
            instruction: z.instruction,
            parts: z.parts,
            isPrimaryCut: false,
        };
    });

    return {
        slug: cfg.slug,
        recipe,
        sheetTitle: cfg.sheetTitle,
        servings: SHEET_SERVINGS,
        ovenTemp: cfg.ovenTemp,
        bakeTime: cfg.bakeTime,
        pullTemp: cfg.pullTemp,
        parcelTip: cfg.parcelTip,
        vignetteImage: cfg.vignetteImage,
        foldSteps: cfg.foldSteps,
        buyPlans,
        primaryBuy,
        estimatedTotal: formatEstimate(totalCost),
        onlineOrderPath,
        onlineOrderQrUrl,
        scaledIngredients,
        zones,
    };
}

export function getAllCookingSheets(): ResolvedCookingSheet[] {
    return PARCEL_SHEET_CONFIGS.flatMap(c => {
        const resolved = resolveCookingSheet(c.slug);
        return resolved ? [resolved] : [];
    });
}

export function getAllShowcaseCookingSheets(): ResolvedCookingSheet[] {
    return [...getAllCookingSheets(), ...EXTENDED_PARCEL_SHEETS];
}

export function getAllSheetSlugs(): string[] {
    return [...PARCEL_SHEET_CONFIGS.map(c => c.slug), ...EXTENDED_PARCEL_SHEETS.map(s => s.slug)];
}

export type SheetRecipeSidebar = {
    bakeSpec: string;
    ingredients: string[];
    method: string[];
};

export type SheetStyleConcept = {
    number: string;
    slug: string;
    title: string;
    register: string;
    summary: string;
    image: string;
    bwImage?: string;
    recipeSidebar?: SheetRecipeSidebar;
};

export const DEFAULT_SAUSAGE_RECIPE_SIDEBAR: SheetRecipeSidebar = {
    bakeSpec: '400°F · 20–24 MIN · USDA SAFE 160°F · SERVES 2',
    ingredients: [
        '3 Hofherr Sweet Italian Sausages (0.75 lb)',
        '2 sweet bell peppers, seeded & sliced',
        '1 yellow onion, thinly sliced',
        '1 tbsp extra-virgin olive oil',
        '2 garlic cloves, thinly sliced',
        '1/2 tsp dried oregano + pinch salt',
        '1/4 tsp crushed red chili flakes',
        '1/4 cup dry white wine (or stock)',
    ],
    method: [
        'Toss sliced peppers & onion in 1 tbsp olive oil across Zone 01.',
        'Set 3 Italian sausage links onto the 5.20" × 1.20" contours.',
        'Scatter sliced garlic, oregano, and chili flakes over links.',
        'Lift long sides (Fold 01), roll top flap (Fold 02), splash in 1/4 cup wine, crimp Fold 03 tight.',
        'Bake at 400°F for 20–24 min until 160°F internal; vent steam away from face.',
    ],
};

export const SHEET_STYLE_CONCEPTS: SheetStyleConcept[] = [
    {
        number: '01',
        slug: 'copperplate-steel-engraving',
        title: 'Old-World Copperplate Steel Engraving',
        register: '19th-Century Burin Cross-Hatching',
        summary:
            'Ornate Victorian corner scrolls, dimensional cross-hatched bell pepper ribbons and sausage casings, and crimson cleaver step tags.',
        image: '/assets/recipes/sheets/styles/copperplate-steel-engraving.jpg',
    },
    {
        number: '02',
        slug: 'flint-and-flame-linocut',
        title: 'Flint & Flame Chunky Linocut Poster',
        register: 'Hand-Carved Block Print & Screenprint',
        summary:
            'Bold uniform monoline contours, hand-gouged linocut borders, stylized flame ticks off the sausage links, and crosshair liquid rings.',
        image: '/assets/recipes/sheets/styles/flint-and-flame-linocut.jpg',
    },
    {
        number: '03',
        slug: 'chicago-stockyards-letterpress',
        title: '1903 Chicago Stockyards Letterpress',
        register: 'Wood-Type Broadside & Rubber Stamp',
        summary:
            'Distressed wood-type headlines, ruled wholesale butcher ledger boxes, meat-scale dial ticks, and turned-wood crimson rubber stamps.',
        image: '/assets/recipes/sheets/styles/chicago-stockyards-letterpress.jpg',
    },
    {
        number: '04',
        slug: 'swiss-architectural-blueprint',
        title: 'Swiss / Bauhaus Culinary Blueprint',
        register: 'Modernist Drafting Schematic',
        summary:
            'Precision dimension extension bars (5.20" × 1.20"), angled CAD cross-sections on sausage ends, modular crimson index tabs, and a title block.',
        image: '/assets/recipes/sheets/styles/swiss-architectural-blueprint.jpg',
    },
    {
        number: '05',
        slug: 'parisian-bistro-en-papillote',
        title: 'Parisian Bistro En Papillote Sketchbook',
        register: 'French Fountain-Pen Culinary Art',
        summary:
            'Classical French script subhead, scalloped wax-seal olive oil medallion, lively pen-and-ink crosshatching, and a brasserie scroll footer.',
        image: '/assets/recipes/sheets/styles/parisian-bistro-en-papillote.jpg',
    },
    {
        number: '06',
        slug: 'botanical-natural-history-plate',
        title: 'Botanical & Natural-History Plate',
        register: '18th-Century Stipple Specimen Sheet',
        summary:
            'Scientific stipple-shaded halved Capsicum bell peppers with seeds, Allium callouts (FIG. I–V), and an engraved vernier caliper scale.',
        image: '/assets/recipes/sheets/styles/botanical-natural-history-plate.jpg',
    },
    {
        number: '07',
        slug: 'midcentury-test-kitchen-print',
        title: '1950s Mid-Century Test-Kitchen Print',
        register: 'Geometric Screenprint & Halftone Dots',
        summary:
            'Charley Harper-inspired geometric pepper silhouettes, Ben-Day halftone dot shadows, crimson pennant flags, and a 1950s 400°F oven badge.',
        image: '/assets/recipes/sheets/styles/midcentury-test-kitchen-print.jpg',
    },
    {
        number: '08',
        slug: 'japanese-woodblock-origami',
        title: 'Japanese Woodblock & Washi Origami',
        register: 'Sumi-Ink Brushwork & Hanko Seals',
        summary:
            'Tapered sumi-e brush contours, seigaiha wave rings for oil and spices, square vermilion hanko chop stamps, and valley/mountain fold arrows.',
        image: '/assets/recipes/sheets/styles/japanese-woodblock-origami.jpg',
    },
    {
        number: '09',
        slug: 'tattoo-flash-butcher-scroll',
        title: 'Traditional Tattoo Flash Butcher Scroll',
        register: 'Whip-Shaded Stipple & Draped Ribbons',
        summary:
            'Heavy outer power-lines with stipple whip-shading, heritage scroll banners draped across each link, and compass-rose spice medallions.',
        image: '/assets/recipes/sheets/styles/tattoo-flash-butcher-scroll.jpg',
    },
    {
        number: '10',
        slug: 'industrial-stencil-crate-spec',
        title: 'Industrial Stencil & Meat-Locker Crate',
        register: 'Bridge-Cut Stencil & Reticle Targets',
        summary:
            'Bridge-cut stenciled crate lettering (SPEC NO. 12x16-PARCH), registration crosshairs on corner gussets, and bullseye reticle liquid targets.',
        image: '/assets/recipes/sheets/styles/industrial-stencil-crate-spec.jpg',
    },
    {
        number: '11',
        slug: 'art-nouveau-mucha',
        title: 'Art Nouveau Alphonse Mucha',
        register: 'Belle Époque Whiplash Line & Floral Frame',
        summary:
            'Sinuous organic whiplash vine borders, stylized lily and pepper flourishes, ribbon-draped sausage links, and Belle Époque display lettering.',
        image: '/assets/recipes/sheets/styles/art-nouveau-mucha.jpg',
    },
    {
        number: '12',
        slug: 'us-patent-office-blueprint',
        title: 'U.S. Patent Office Mechanical Blueprint',
        register: '1890s USPTO Specification Schematic',
        summary:
            'Official USPTO patent drafting with numbered reference lead lines (10, 12a, 14b), FIG. 1–5 cross-sections, crimson ribbon seal, and inventor block.',
        image: '/assets/recipes/sheets/styles/us-patent-office-blueprint.jpg',
    },
    {
        number: '13',
        slug: 'medieval-illuminated-manuscript',
        title: 'Medieval Guild Illuminated Manuscript',
        register: '14th-Century Monastic Codex & Rubrication',
        summary:
            'Gothic Textura Quadrata calligraphy with an illuminated drop capital, Celtic knotwork corners, rubricated red stitch fold lines, and heraldic shields.',
        image: '/assets/recipes/sheets/styles/medieval-illuminated-manuscript.jpg',
    },
    {
        number: '14',
        slug: 'constructivist-agitprop-broadside',
        title: '1920s Constructivist Agitprop Broadside',
        register: 'Avant-Garde Geometric Poster Typography',
        summary:
            'Dynamic diagonal sans-serif headline bars, bold industrial track fold borders, angular faceted sausage contours, and radar-reticle liquid dials.',
        image: '/assets/recipes/sheets/styles/constructivist-agitprop-broadside.jpg',
    },
    {
        number: '15',
        slug: 'victorian-apothecary-formulary',
        title: 'Victorian Pharmacopeia & Apothecary Formulary',
        register: '19th-Century Dispensatory & Wax Seals',
        summary:
            'Latin botanical nomenclature (Oleum Olivarum, Botulus Italicus Dulcis), engraved graduated cylinder scale, apothecary dram balance, and corner wax seals.',
        image: '/assets/recipes/sheets/styles/victorian-apothecary-formulary.jpg',
    },
    {
        number: '16',
        slug: 'art-deco-luxury-streamline',
        title: '1930s Art Deco Luxury Streamline',
        register: 'Cassandre Poster & Stepped Chevrons',
        summary:
            'Stepped skyscraper chevron corner frames, sleek parallel speed-lines, sunburst medallions, and high-contrast 1930s ocean-liner display type.',
        image: '/assets/recipes/sheets/styles/art-deco-luxury-streamline.jpg',
    },
    {
        number: '17',
        slug: 'whole-earth-catalog-diy',
        title: '1970s Whole Earth Catalog DIY Blueprint',
        register: 'Typewriter Paste-Up & Rapidograph Stipple',
        summary:
            'Homestead manual layout combining crisp Courier typewriter callouts, hand-stippled rapidograph pen illustrations, and folk-craft assembly arrows.',
        image: '/assets/recipes/sheets/styles/whole-earth-catalog-diy.jpg',
    },
    {
        number: '18',
        slug: 'chalkboard-bistro-broadside',
        title: 'Hand-Lettered Bistro Sign-Painter Broadside',
        register: 'Dimensional Inline Serifs & Scroll Flourishes',
        summary:
            'Artisan butcher-bistro sign-painting with inline drop-shaded serif lettering, ornamental flourishes, and ribbon dividers in two-color parchment ink.',
        image: '/assets/recipes/sheets/styles/chalkboard-bistro-broadside.jpg',
    },
    {
        number: '19',
        slug: 'renaissance-davinci-codex',
        title: 'Renaissance Leonardo Da Vinci Culinary Codex',
        register: 'Florentine Quill Hatching & Golden Ratio',
        summary:
            '15th-century notebook draftsmanship with fine quill cross-hatching, Vitruvian compass proportion arcs, and Renaissance cursive marginalia.',
        image: '/assets/recipes/sheets/styles/renaissance-davinci-codex.jpg',
    },
    {
        number: '20',
        slug: 'pop-art-benday-comic',
        title: '1960s Pop Art Ben-Day Dot Comic Sheet',
        register: 'Bold Brush Contours & Starburst Callouts',
        summary:
            'Silver-Age graphic comic ink contours, open crimson Ben-Day halftone dot shadows,ruled caption boxes, and punchy starburst step badges.',
        image: '/assets/recipes/sheets/styles/pop-art-benday-comic.jpg',
    },
    {
        number: '21',
        slug: 'nautical-admiralty-chart',
        title: 'Nautical Admiralty Cartographic Chart',
        register: 'Hydrographic Contours & Compass Rose',
        summary:
            '19th-century British Admiralty sea-chart styling with a 32-point compass rose oil ring, bathymetric sausage contours, rhumb lines, and degree ticks.',
        image: '/assets/recipes/sheets/styles/nautical-admiralty-chart.jpg',
    },
    {
        number: '22',
        slug: 'retro-8bit-cyberpunk-terminal',
        title: '1980s 8-Bit Cyberpunk Retro Terminal',
        register: 'Monospace Plotter CAD & Pixel Wireframes',
        summary:
            'Vintage command-prompt header (EXECUTE BAKE_400F.SH), pixel-stepped icons, wireframe CAD sausage meshes, and ASCII box-drawing fold borders.',
        image: '/assets/recipes/sheets/styles/retro-8bit-cyberpunk-terminal.jpg',
    },
    {
        number: '23',
        slug: 'moroccan-zellige-mosaic',
        title: 'Moroccan Zellige Geometric Mosaic',
        register: 'Khatam Star Medallions & Arabesque Strapwork',
        summary:
            'Intricate Moorish tile-drafting linework featuring interlocking 8-pointed Khatam star spice rings, horseshoe arch framing, and arabesque vine borders.',
        image: '/assets/recipes/sheets/styles/moroccan-zellige-mosaic.jpg',
    },
    {
        number: '24',
        slug: 'pioneer-homestead-almanac',
        title: 'Early American Pioneer Homestead Almanac',
        register: '1780s Colonial Woodcut & Caslon Press',
        summary:
            'Early American farmer’s almanac broadsheet with rustic colonial woodcuts, Caslon old-style press type, harvest moon-phase icons, and double rules.',
        image: '/assets/recipes/sheets/styles/pioneer-homestead-almanac.jpg',
    },
    {
        number: '25',
        slug: 'viennese-secession-klimt',
        title: 'Viennese Secession & Gustav Klimt Decorative Plate',
        register: 'Ver Sacrum Tesserae & Wiener Werkstätte Type',
        summary:
            '1900 Vienna Secession poster composition with square-proportioned Koloman Moser lettering, open mosaic tesserae bands, and spiraling tendrils.',
        image: '/assets/recipes/sheets/styles/viennese-secession-klimt.jpg',
    },
    {
        number: '26',
        slug: 'tactical-field-manual-spec',
        title: 'Tactical Military Field Manual & Ration Spec',
        register: 'MIL-STD Stencil & Technical Manual Diagram',
        summary:
            'Vintage field manual spec sheet (FM-12-16) with MIL-STD stencil typography, isometric ration diagrams, NATO stock codes, and chevron step markers.',
        image: '/assets/recipes/sheets/styles/tactical-field-manual-spec.jpg',
    },
    {
        number: '27',
        slug: 'mexican-talavera-folk-plate',
        title: 'Mexican Día de los Muertos Talavera Ceramic',
        register: 'Posada Grabado & Scalloped Tile Brushwork',
        summary:
            'Puebla Talavera ceramic brushwork and Mexican grabado woodcut engraving with marigold garlands, scalloped tile corners, and papel-picado fold borders.',
        image: '/assets/recipes/sheets/styles/mexican-talavera-folk-plate.jpg',
    },
    {
        number: '28',
        slug: 'victorian-circus-vaudeville-playbill',
        title: '19th-Century Circus & Vaudeville Playbill',
        register: 'Ornamental Tuscan Wood Type & Manicules',
        summary:
            'Extravagant 1880s theatrical broadside stacked with bifurcated Tuscan woodblock typefaces, festive bunting banners, and pointing manicule hands (☞).',
        image: '/assets/recipes/sheets/styles/victorian-circus-vaudeville-playbill.jpg',
    },
    {
        number: '29',
        slug: 'zen-enso-sumi-ink-wash',
        title: 'Zen Ensō & Japanese Sumi-E Ink Wash',
        register: 'Single-Stroke Ensō & Dry-Brush Calligraphy',
        summary:
            'Serene Kyoto calligraphy scroll using expressive single-stroke Ensō circles for oil and wine, spontaneous dry-brush sausage strokes, and vermilion chops.',
        image: '/assets/recipes/sheets/styles/zen-enso-sumi-ink-wash.jpg',
    },
    {
        number: '30',
        slug: 'de-stijl-mondrian-grid',
        title: 'De Stijl & Piet Mondrian Neo-Plastic Grid',
        register: 'Orthogonal Black Rules & Asymmetrical Grid',
        summary:
            '1920s Dutch Neo-Plasticist architectural grid dividing all five cooking zones with perpendicular black rules and crisp Hofherr crimson accent bars.',
        image: '/assets/recipes/sheets/styles/de-stijl-mondrian-grid.jpg',
    },
];

export const FEATURED_FUSION_CONCEPTS: SheetStyleConcept[] = [
    {
        number: 'F1',
        slug: 'hofherr-flame-vector-apothecary',
        title: 'Hofherr Bold Flame-Vector × Halved-Pepper Sheet',
        register: 'Halved-Pepper Layout + Chunky Monoline Flame Vector',
        summary:
            'Pairs Style 15’s halved bell peppers, onion crescents, 5.20" × 1.20" sausages, and spice scale with smooth, thick crimson-and-gold monoline vector linework and chunky Hofherr block lettering.',
        image: '/assets/recipes/sheets/styles/hofherr-flame-vector-apothecary.jpg',
    },
    {
        number: 'F2',
        slug: 'hofherr-crimson-gold-monoline',
        title: 'Hofherr Crimson & Gold Flame-Scroll Monoline',
        register: 'Zero-Stipple Bold Vector Contours & Beaded Frame',
        summary:
            'Rebuilds every ingredient contour in thick, rounded crimson and warm butcher-gold vector curves with swirling flame-scroll accents, beaded vertical margins, and clear English callouts.',
        image: '/assets/recipes/sheets/styles/hofherr-crimson-gold-monoline.jpg',
    },
    {
        number: 'F3',
        slug: 'botanical-flame-crest-hybrid',
        title: 'Botanical Apothecary × Flame-Crest Hybrid',
        register: 'Stipple Pepper Etching + Flame-Licked Sausages',
        summary:
            'Combines stipple-engraved halved bell peppers, natural-casing sausage cross-hatching, and an apothecary balance scale with bold block display type and rising flame tongues.',
        image: '/assets/recipes/sheets/styles/botanical-flame-crest-hybrid.jpg',
    },
    {
        number: 'F4',
        slug: 'botanical-filigree-flame-edition',
        title: 'Botanical Filigree × Flame-Crest Edition',
        register: 'Bead-and-Diamond Margins + Apothecary Cartouches',
        summary:
            'Adds Style 15’s vertical bead-and-diamond filigree borders, engraved beaker medallion, and ornamental sausage cartouches alongside flame-crested emblems and crimson wax step seals.',
        image: '/assets/recipes/sheets/styles/botanical-filigree-flame-edition.jpg',
    },
];

export const ALL_STYLE_CONCEPTS: SheetStyleConcept[] = [
    ...SAFETY_SEAL_SHEET_CONCEPTS,
    ...FEATURED_FUSION_CONCEPTS,
    ...SHEET_STYLE_CONCEPTS,
];

export function getSheetStyleConcept(styleSlug: string): SheetStyleConcept | null {
    return ALL_STYLE_CONCEPTS.find(s => s.slug === styleSlug) ?? null;
}


