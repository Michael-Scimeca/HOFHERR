/* Recipes — one per cut on the beef map, plus holiday centerpieces. Test content for /recipes-test.
   Thirty more (beef, pork, poultry, lamb, veal, fish) live in recipes-more.ts and are appended to RECIPES below. */

import { MORE_RECIPES } from './recipes-more';

export type OccasionId = 'sunday-dinner' | 'date-night' | 'game-day' | 'feeding-a-crowd' | 'weeknight';

export const OCCASIONS: { id: OccasionId; label: string }[] = [
    { id: 'sunday-dinner', label: 'Sunday dinner' },
    { id: 'date-night', label: 'Date night' },
    { id: 'game-day', label: 'Game day' },
    { id: 'feeding-a-crowd', label: 'Feeding a crowd' },
    { id: 'weeknight', label: 'Weeknight in 30 minutes' },
];

export type Collection = {
    id: string;
    label: string;
    season: string;
    blurb: string;
    /** Months (0 = January) when this collection is featured at the top of the page. */
    months: number[];
    recipes: string[];
};

/* Seasonal collections. The banner at the top of the page features the first
   collection whose months include the current month. */
export const COLLECTIONS: Collection[] = [
    {
        id: 'thanksgiving',
        label: 'Thanksgiving',
        season: 'The fourth Thursday of November',
        blurb: 'A herb-butter turkey for the center of the table, a faster spatchcocked bird, gravy and stuffing to make ahead, and roasts for a bigger crowd.',
        months: [10],
        recipes: [
            'turkey',
            'spatchcock-turkey',
            'turkey-breast',
            'turkey-gravy',
            'sausage-stuffing',
            'beef-tenderloin',
            'crown-roast',
            'glazed-ham',
            'roast-duck',
            'round',
            'brisket',
        ],
    },
    {
        id: 'christmas',
        label: 'Christmas prime rib',
        season: 'Christmas Eve through New Year',
        blurb: 'A standing rib roast is the showpiece of the season, with tenderloin, crown roast, ham and duck as alternatives and slow braises for the days around it.',
        months: [11],
        recipes: ['prime-rib', 'beef-tenderloin', 'crown-roast', 'glazed-ham', 'roast-duck', 'rack-of-lamb', 'rib', 'short-ribs', 'shank', 'round'],
    },
    {
        id: 'easter',
        label: 'Easter lamb',
        season: 'Easter and spring gatherings',
        blurb: 'Roast leg of lamb with garlic and rosemary, a rack or shanks for a smaller table, a glazed ham, and two roasts for guests who prefer beef.',
        months: [2, 3],
        recipes: ['lamb', 'rack-of-lamb', 'lamb-shanks', 'glazed-ham', 'round', 'chuck'],
    },
    {
        id: 'super-bowl',
        label: 'Super Bowl',
        season: 'The big game in February',
        blurb: 'Food for a full living room: wings, ribs and pulled pork, tacos to pass around, brisket for sandwiches, and tri-tip off the grill.',
        months: [0, 1],
        recipes: ['wings', 'pulled-pork', 'baby-back-ribs', 'beef-back-ribs', 'smash-burgers', 'beer-brats', 'plate', 'brisket', 'sirloin'],
    },
    {
        id: 'summer-grilling',
        label: 'Fourth of July grilling',
        season: 'Memorial Day through Labor Day',
        blurb: 'Fast, hot cooking for the backyard: steaks that marinate while you set up, plus burgers, brats and ribs.',
        months: [4, 5, 6, 7],
        recipes: ['sirloin', 'flank', 'plate', 'picanha', 'smash-burgers', 'beer-brats', 'baby-back-ribs'],
    },
];

/** A Hofherr product a recipe needs. Names and prices match the online order menu. */
export type BuyItem = {
    name: string;
    /** Menu price as shown on /online-orders, e.g. "$12.99/lb". */
    price: string;
    unitPrice: number;
    unit: 'lb' | 'each';
    /** Pounds (unit "lb") or count (unit "each") needed at baseServings. */
    baseAmount: number;
    /** Typical weight of one piece, used to work out how many to order. */
    pieceLb: number;
    pieceLabel: string;
    /** One piece whatever the weight: a bird, a rib roast, a leg. */
    single?: boolean;
};

export type MenuPick = { name: string; price: string; why: string };

/* Menu prices were copied from /online-orders on 2026-11-12. Re-sync them when the menu changes. */
export const PRICES_AS_OF = 'November 12, 2026';

export type Bundle = {
    id: string;
    name: string;
    serves: number;
    blurb: string;
    recipe: string;
    items: { name: string; price: string; unitPrice: number; qty: number; lb?: number; label: string }[];
};

/* Dinner party bundles. Totals are the sum of menu prices; a bundle price or discount is not set. */
export const BUNDLES: Bundle[] = [
    {
        id: 'steakhouse-night',
        name: 'Steakhouse night for four',
        serves: 4,
        blurb: 'Four strip steaks, the two classic sides and dessert.',
        recipe: 'short-loin',
        items: [
            { name: 'New York Strip', price: '$42.99/lb', unitPrice: 42.99, qty: 4, lb: 4, label: '4 steaks, about 4 lb' },
            { name: 'Twice Baked Potatoes', price: '$4.99', unitPrice: 4.99, qty: 4, label: '4 potatoes' },
            { name: 'Creamed Spinach', price: '$14.99/lb', unitPrice: 14.99, qty: 1, lb: 1, label: '1 lb' },
            { name: 'Pretty Cool Ice Cream', price: '$7.00', unitPrice: 7, qty: 2, label: '2 ice creams' },
        ],
    },
    {
        id: 'sunday-roast',
        name: 'Sunday roast for six',
        serves: 6,
        blurb: 'A pot roast with stock for the braise, a starter and a green side.',
        recipe: 'chuck',
        items: [
            { name: 'Pot Roast', price: '$12.99/lb', unitPrice: 12.99, qty: 1, lb: 2.75, label: '1 roast, about 2.75 lb' },
            { name: 'Beef Stock', price: '$10.99', unitPrice: 10.99, qty: 1, label: '1 quart' },
            { name: 'French Onion Soup', price: '$16.99', unitPrice: 16.99, qty: 2, label: '2 quarts' },
            { name: 'Creamed Spinach', price: '$14.99/lb', unitPrice: 14.99, qty: 1, lb: 1.5, label: '1.5 lb' },
        ],
    },
    {
        id: 'brisket-feast',
        name: 'Brisket feast for eight',
        serves: 8,
        blurb: 'A first cut brisket with three sides that only need heating.',
        recipe: 'brisket',
        items: [
            { name: 'First Cut Brisket', price: '$13.99/lb', unitPrice: 13.99, qty: 1, lb: 5, label: '1 brisket, about 5 lb' },
            { name: 'Beef Stock', price: '$10.99', unitPrice: 10.99, qty: 1, label: '1 quart' },
            { name: 'Collard Greens', price: '$16.99', unitPrice: 16.99, qty: 1, label: '1 container' },
            { name: 'Large Pimento Mac n Cheese', price: '$14.99', unitPrice: 14.99, qty: 2, label: '2 large' },
            { name: 'Coleslaw', price: '$7.99/lb', unitPrice: 7.99, qty: 1, lb: 2, label: '2 lb' },
        ],
    },
];

export type Recipe = {
    slug: string;
    baseServings: number;
    servingOptions?: number[];
    difficulty: 'Easy' | 'Medium';
    handsOn: string;
    /** Days of notice assumed between ordering and pickup. Placeholder until the shop confirms. */
    leadDays: number;
    butcherTip: string;
    buy: BuyItem[];
    sides: MenuPick[];
    upgrades: MenuPick[];
    /** Finished-dish photo, e.g. "/assets/recipes/pot-roast.jpg". A placeholder shows until one is set. */
    image?: string;
    perfectFor: string;
    occasions: OccasionId[];
    cut: string;
    title: string;
    intro: string;
    serves: string;
    prep: string;
    cook: string;
    total: string;
    /** Everything except the Hofherr products. Numbers in {braces} scale with servings. */
    ingredients: string[];
    extraIngredients?: { title: string; items: string[] };
    tools: string[];
    steps: string[];
    note?: string;
};

export const TEMPERATURE_NOTE =
    'Temperatures are for an instant-read thermometer in the thickest part. The USDA guideline for whole cuts of beef, lamb, veal and pork is 145°F with a 3-minute rest; the lower pull temperatures given for beef and lamb give medium-rare. Ground meat and fresh sausage must reach 160°F, chicken, turkey and duck 165°F, and the guideline for fish is 145°F.';

const BASE_RECIPES: Recipe[] = [
    {
        slug: 'head',
        baseServings: 6,
        difficulty: 'Easy',
        handsOn: '30 min',
        leadDays: 1,
        butcherTip: 'Cheeks come with a layer of silverskin. Ask us to trim it at the counter and they go straight into the pot.',
        buy: [
            { name: 'Beef Cheek', price: '$14.99/lb', unitPrice: 14.99, unit: 'lb', baseAmount: 2, pieceLb: 2, pieceLabel: 'package' },
            { name: 'Beef Stock', price: '$10.99', unitPrice: 10.99, unit: 'each', baseAmount: 0.25, pieceLb: 0, pieceLabel: 'quart' },
        ],
        sides: [
            { name: 'Italian Wedding Soup', price: '$16.99', why: 'A light first course before the pasta.' },
            { name: 'Pretty Cool Ice Cream', price: '$7.00', why: 'Dessert, already made.' },
        ],
        upgrades: [
        ],
        image: '/assets/recipes/braised-beef-cheek-ragu.jpg',
        perfectFor: 'A slow Sunday pasta night for six',
        occasions: ['sunday-dinner', 'feeding-a-crowd'],
        cut: 'Head',
        title: 'Braised beef cheek ragu',
        intro: 'Beef cheek turns silky after a long braise and shreds into a rich pasta sauce.',
        serves: '4 to 6',
        prep: '30 min',
        cook: '3 hr',
        total: '3 hr 30 min',
        ingredients: [
            '{2} tbsp olive oil',
            '{1} onion, {1} carrot, {1} celery stalk, finely diced',
            '{4} garlic cloves, sliced',
            '{2} tbsp tomato paste',
            '{1} cup dry red wine',
            '{1} can (28 oz) crushed tomatoes',
            '{1} cup Beef Stock',
            '{2} bay leaves, {1} sprig rosemary',
            '{1} lb pappardelle or rigatoni',
            'Salt, pepper, grated Parmesan',
        ],
        tools: [
            'Dutch oven with lid, 5 quart or larger',
            'Tongs',
            'Wooden spoon',
            'Two forks, for shredding',
            'Large pot and colander, for the pasta',
            "Chef's knife and cutting board",
        ],
        steps: [
            'Heat the oven to 325°F. Season the cheeks well with salt and pepper.',
            'Brown the cheeks in oil in a Dutch oven over medium-high heat, about 4 minutes a side. Set aside.',
            'Cook the onion, carrot and celery in the same pot until soft, 8 minutes. Add garlic and tomato paste and cook 2 minutes.',
            'Pour in the wine and scrape up the browned bits. Simmer until reduced by half.',
            'Add tomatoes, stock, bay and rosemary. Return the cheeks, cover, and braise in the oven for 3 hours, until they fall apart when pressed.',
            'Shred the meat into the sauce with two forks. Remove the bay and rosemary and season to taste.',
            'Toss with cooked pasta and a splash of pasta water. Serve with Parmesan.',
        ],
    },
    {
        slug: 'chuck',
        baseServings: 6,
        difficulty: 'Easy',
        handsOn: '20 min',
        leadDays: 2,
        butcherTip: 'Ask us to tie the roast. It holds its shape through three hours in the oven and slices cleanly.',
        buy: [
            { name: 'Pot Roast', price: '$12.99/lb', unitPrice: 12.99, unit: 'lb', baseAmount: 2.75, pieceLb: 2.75, pieceLabel: 'roast' },
            { name: 'Beef Stock', price: '$10.99', unitPrice: 10.99, unit: 'each', baseAmount: 0.5, pieceLb: 0, pieceLabel: 'quart' },
        ],
        sides: [
            { name: 'Creamed Spinach', price: '$14.99/lb', why: 'Something green and rich next to the roast.' },
            { name: 'French Onion Soup', price: '$16.99', why: 'A starter that suits a slow Sunday.' },
        ],
        upgrades: [
            { name: 'Bone In Short Ribs', price: '$14.99/lb', why: 'A richer braise with the same method. Ask for the braising cut.' },
        ],
        image: '/assets/recipes/sunday-pot-roast.jpg',
        perfectFor: 'Sunday dinner for six',
        occasions: ['sunday-dinner', 'feeding-a-crowd'],
        cut: 'Chuck',
        title: 'Sunday pot roast',
        intro: 'Chuck has the fat and connective tissue that make a pot roast tender and full of flavor.',
        serves: '6',
        prep: '20 min',
        cook: '3 hr 10 min',
        total: '3 hr 30 min',
        ingredients: [
            '{2} tbsp vegetable oil',
            '{2} onions, cut in wedges',
            '{4} garlic cloves, smashed',
            '{2} tbsp tomato paste',
            '{2} cups Beef Stock',
            '{1} tbsp Worcestershire sauce',
            '{3} sprigs thyme, {2} bay leaves',
            '{1} lb carrots, cut in large chunks',
            '{1.5} lb small potatoes, halved',
            'Salt and pepper',
        ],
        tools: [
            'Dutch oven with lid, 5 quart or larger',
            'Tongs',
            'Wooden spoon',
            'Fork, to test tenderness',
            "Chef's knife and cutting board",
        ],
        steps: [
            'Heat the oven to 300°F. Pat the roast dry and season all over with salt and pepper.',
            'Sear the roast in oil in a Dutch oven until deeply browned on every side, about 12 minutes. Set aside.',
            'Soften the onions in the pot for 5 minutes. Stir in garlic and tomato paste for 1 minute.',
            'Add stock, Worcestershire, thyme and bay, and scrape the bottom of the pot. Return the roast.',
            'Cover and cook in the oven for 2 hours.',
            'Add the carrots and potatoes around the roast. Cover and cook 1 hour more, until a fork slides into the meat easily.',
            'Rest the roast 10 minutes, then slice or pull apart. Spoon the pan juices over the top.',
        ],
    },
    {
        slug: 'rib',
        baseServings: 2,
        difficulty: 'Medium',
        handsOn: '15 min',
        leadDays: 1,
        butcherTip: 'For reverse searing, thicker is better. Ask for a 2-inch cut and we will cut it to order.',
        buy: [
            { name: 'Bone-In Ribeye', price: '$38.99/lb', unitPrice: 38.99, unit: 'lb', baseAmount: 2, pieceLb: 2, pieceLabel: 'steak' },
        ],
        sides: [
            { name: 'Twice Baked Potatoes', price: '$4.99', why: 'The steakhouse side, ready to heat.' },
            { name: 'Creamed Spinach', price: '$14.99/lb', why: 'Classic with ribeye.' },
        ],
        upgrades: [
            { name: 'Prime Tomahawk Ribeye', price: '$39.99/lb', why: 'The long-bone showpiece for a special occasion.' },
            { name: 'Wagyu Tomahawk Ribeye', price: '$45.99/lb', why: 'About 2.5 lb, sold frozen. Rich enough to share.' },
        ],
        image: '/assets/recipes/reverse-seared-bone-in-ribeye.jpg',
        perfectFor: 'Date night for two',
        occasions: ['date-night'],
        cut: 'Rib',
        title: 'Reverse-seared bone-in ribeye',
        intro: 'A slow oven followed by a hard sear cooks a thick ribeye evenly from edge to edge.',
        serves: '2',
        prep: '10 min, plus optional overnight salting',
        cook: '50 min',
        total: '1 hr',
        ingredients: [
            '{1.5} tsp kosher salt',
            '{1} tsp coarse black pepper',
            '{1} tbsp high-heat oil',
            '{2} tbsp butter',
            '{2} garlic cloves, smashed',
            '{2} sprigs thyme',
        ],
        tools: [
            'Sheet pan with a wire rack',
            'Cast-iron pan',
            'Instant-read thermometer',
            'Tongs',
            'Large spoon, for basting',
            'Sharp knife and cutting board',
        ],
        steps: [
            'Salt the steak on all sides. For the best crust, do this the night before and leave it uncovered in the refrigerator.',
            'Heat the oven to 250°F. Set the steak on a rack over a sheet pan and season with pepper.',
            'Roast until the center reads 115°F for medium-rare, 35 to 45 minutes.',
            'Heat a cast-iron pan over high heat until it just starts to smoke. Add the oil.',
            'Sear the steak 1 minute a side, then sear the fat edge for 30 seconds.',
            'Lower the heat, add butter, garlic and thyme, and spoon the foaming butter over the steak for 30 seconds.',
            'Rest 5 minutes. The temperature will climb to about 130°F. Slice off the bone and across the grain.',
        ],
    },
    {
        slug: 'short-loin',
        baseServings: 2,
        difficulty: 'Easy',
        handsOn: '15 min',
        leadDays: 1,
        butcherTip: 'Our standard strip is cut 1.25 inches, which is right for a pan. Ask for 1.5 inches if you like a wider band of pink.',
        buy: [
            { name: 'New York Strip', price: '$42.99/lb', unitPrice: 42.99, unit: 'lb', baseAmount: 2, pieceLb: 1, pieceLabel: 'steak' },
        ],
        sides: [
            { name: 'Twice Baked Potatoes', price: '$4.99', why: 'One per person.' },
            { name: 'Creamed Spinach', price: '$14.99/lb', why: 'Classic with strip steak.' },
            { name: 'Shrimp De Jonghe', price: '$23.99', why: 'A Chicago starter for date night.' },
        ],
        upgrades: [
            { name: 'Kansas City Strip', price: '$40.99/lb', why: 'The same steak on the bone, sold frozen.' },
            { name: 'Porterhouse', price: '$40.99/lb', why: 'Strip and filet in one steak, about 2 lb.' },
            { name: 'A5 Miyazaki Wagyu New York Strip', price: '$180.00/lb', why: 'Japanese wagyu for the biggest occasions.' },
        ],
        image: '/assets/recipes/cast-iron-new-york-strip.jpg',
        perfectFor: 'Steakhouse night at home in 20 minutes',
        occasions: ['date-night', 'weeknight'],
        cut: 'Short Loin',
        title: 'Cast-iron New York strip',
        intro: 'A strip steak needs only a hot pan, butter and a few minutes.',
        serves: '2',
        prep: '5 min, plus 30 min at room temperature',
        cook: '15 min',
        total: '20 min',
        ingredients: [
            '{2} tsp kosher salt',
            '{1} tsp coarse black pepper',
            '{1} tbsp high-heat oil',
            '{3} tbsp butter',
            '{3} garlic cloves, smashed',
            '{2} sprigs rosemary or thyme',
        ],
        tools: [
            'Cast-iron pan, 12 inch',
            'Instant-read thermometer',
            'Tongs',
            'Large spoon, for basting',
            'Paper towels',
            'Sharp knife and cutting board',
        ],
        steps: [
            'Take the steaks out of the refrigerator 30 minutes ahead. Pat very dry and season with salt and pepper.',
            'Heat a cast-iron pan over high heat for 5 minutes. Add the oil.',
            'Lay the steaks in the pan away from you. Sear without moving for 3 minutes.',
            'Flip and sear 2 minutes. Stand the steaks on the fat edge for 30 seconds to render it.',
            'Lower the heat to medium. Add butter, garlic and herbs, and baste for 1 to 2 minutes.',
            'Pull at 125°F for medium-rare. Rest 5 minutes before slicing; the steaks will finish near 130°F.',
        ],
        note: 'The same method works for T-Bone and Porterhouse. Add 1 to 2 minutes a side for the larger cut.',
    },
    {
        slug: 'sirloin',
        baseServings: 4,
        difficulty: 'Medium',
        handsOn: '25 min',
        leadDays: 1,
        butcherTip: 'Ask us to leave a thin fat cap on one side. It bastes the meat on the grill.',
        buy: [
            { name: 'Tri-Tip', price: '$21.99/lb', unitPrice: 21.99, unit: 'lb', baseAmount: 1.75, pieceLb: 1.75, pieceLabel: 'roast' },
        ],
        sides: [
            { name: 'Potato Salad', price: '$9.99/lb', why: 'Cookout standard.' },
            { name: 'Coleslaw', price: '$7.99/lb', why: 'Cool and crisp against the chimichurri.' },
        ],
        upgrades: [
            { name: 'Kilgus Tri Tip', price: '$29.99/lb', why: 'Local farm-sourced beef.' },
            { name: 'Marinated Tri Tip', price: '$22.99/lb', why: 'Already marinated, so you can skip the rub.' },
        ],
        image: '/assets/recipes/grilled-tri-tip-chimichurri.jpg',
        perfectFor: 'A backyard cookout for six',
        occasions: ['feeding-a-crowd', 'game-day'],
        cut: 'Sirloin',
        title: 'Grilled tri-tip with chimichurri',
        intro: 'Tri-tip grills like a steak and slices like a roast, and a sharp herb sauce suits its beefy flavor.',
        serves: '4 to 6',
        prep: '15 min',
        cook: '45 min',
        total: '1 hr',
        ingredients: [
            '{1} tbsp kosher salt',
            '{2} tsp black pepper',
            '{2} tsp garlic powder',
            '{1} tbsp olive oil',
        ],
        extraIngredients: {
            title: 'Chimichurri',
            items: [
                '{1} cup parsley leaves, finely chopped',
                '{3} garlic cloves, minced',
                '{2} tbsp fresh oregano, chopped, or {2} tsp dried',
                '{1/2} cup olive oil',
                '{3} tbsp red wine vinegar',
                '{1/2} tsp red pepper flakes',
                '{1/2} tsp salt',
            ],
        },
        tools: [
            'Gas or charcoal grill with a lid',
            'Instant-read thermometer',
            'Tongs',
            'Mixing bowl, for the chimichurri',
            "Chef's knife and cutting board",
        ],
        steps: [
            'Stir the chimichurri ingredients together and let stand while you cook.',
            'Rub the tri-tip with oil, salt, pepper and garlic powder.',
            'Set up a grill with a hot side and a cooler side.',
            'Sear over the hot side for 4 minutes a side.',
            'Move to the cooler side, close the lid, and cook until the thickest part reads 130°F, 20 to 30 minutes.',
            'Rest 10 minutes.',
            'Slice thinly across the grain. The grain changes direction at the bend, so cut the roast in two there and slice each half separately.',
            'Spoon chimichurri over the slices.',
        ],
    },
    {
        slug: 'round',
        baseServings: 8,
        difficulty: 'Easy',
        handsOn: '15 min',
        leadDays: 2,
        butcherTip: 'Ask us to tie it at even intervals so it roasts evenly, and tell us if you want it for sandwiches.',
        buy: [
            { name: 'Eye Of Round', price: '$14.99/lb', unitPrice: 14.99, unit: 'lb', baseAmount: 3.5, pieceLb: 3.5, pieceLabel: 'roast' },
        ],
        sides: [
            { name: 'Twice Baked Potatoes', price: '$4.99', why: 'One per person.' },
            { name: 'Creamed Spinach', price: '$14.99/lb', why: 'A classic roast beef side.' },
        ],
        upgrades: [
            { name: 'Top Sirloin Roast', price: '$13.99/lb', why: 'Trimmed and tied, with a little more marbling.' },
            { name: 'Prime Beef Tenderloin', price: '$44.99/lb', why: 'The most tender roast we sell, for a special occasion.' },
        ],
        image: '/assets/recipes/herb-crusted-eye-of-round.jpg',
        perfectFor: 'A holiday table for eight, with sandwiches the next day',
        occasions: ['feeding-a-crowd', 'sunday-dinner'],
        cut: 'Round',
        title: 'Herb-crusted eye of round',
        intro: 'Eye of round is lean, so it is best roasted to medium-rare and sliced paper-thin for dinner or sandwiches.',
        serves: '6 to 8',
        prep: '10 min, plus 1 hr at room temperature',
        cook: '1 hr 20 min',
        total: '1 hr 30 min',
        ingredients: [
            '{1} tbsp kosher salt',
            '{2} tsp black pepper',
            '{2} tbsp olive oil',
            '{4} garlic cloves, minced',
            '{1} tbsp fresh rosemary, chopped',
            '{1} tbsp fresh thyme leaves',
            '{1} tbsp Dijon mustard',
        ],
        tools: [
            'Roasting pan with a rack',
            'Instant-read thermometer',
            'Small bowl, for the herb paste',
            'Aluminum foil',
            'Long, sharp carving knife and cutting board',
        ],
        steps: [
            'Take the roast out of the refrigerator 1 hour ahead. Heat the oven to 450°F.',
            'Mix the oil, garlic, herbs, mustard, salt and pepper into a paste. Rub it all over the roast.',
            'Set the roast on a rack in a roasting pan. Roast 15 minutes to brown the outside.',
            'Lower the oven to 325°F. Roast until the center reads 125°F, 45 to 60 minutes more.',
            'Tent loosely with foil and rest 15 minutes. The temperature will rise to about 130°F.',
            'Slice as thinly as you can across the grain. Serve with the pan juices or horseradish sauce.',
        ],
        note: 'Leftovers make roast beef sandwiches: chill the roast first and it slices even thinner.',
    },
    {
        slug: 'brisket',
        baseServings: 8,
        difficulty: 'Easy',
        handsOn: '30 min',
        leadDays: 2,
        butcherTip: 'First cut is the leaner half and slices neatly. Ask us to leave a quarter inch of fat on top.',
        buy: [
            { name: 'First Cut Brisket', price: '$13.99/lb', unitPrice: 13.99, unit: 'lb', baseAmount: 5, pieceLb: 5, pieceLabel: 'brisket' },
            { name: 'Beef Stock', price: '$10.99', unitPrice: 10.99, unit: 'each', baseAmount: 0.5, pieceLb: 0, pieceLabel: 'quart' },
        ],
        sides: [
            { name: 'Collard Greens', price: '$16.99', why: 'Ready to heat.' },
            { name: 'Large Pimento Mac n Cheese', price: '$14.99', why: 'For the kids and everyone else.' },
            { name: 'Coleslaw', price: '$7.99/lb', why: 'For brisket sandwiches the next day.' },
        ],
        upgrades: [
            { name: 'Whole Brisket', price: '$10.99/lb', why: '10 to 16 lb with the point, if you want to fire up the smoker.' },
        ],
        image: '/assets/recipes/oven-braised-brisket.jpg',
        perfectFor: 'A make-ahead feast for eight',
        occasions: ['feeding-a-crowd', 'game-day'],
        cut: 'Brisket',
        title: 'Oven-braised brisket',
        intro: 'First cut brisket braised low with onions gives tender slices and its own gravy, with no smoker needed.',
        serves: '8',
        prep: '30 min',
        cook: '3 hr 30 min',
        total: '4 hr',
        ingredients: [
            '{1} tbsp kosher salt',
            '{2} tsp black pepper',
            '{2} tsp paprika',
            '{2} tbsp vegetable oil',
            '{3} large onions, sliced',
            '{6} garlic cloves, smashed',
            '{2} tbsp tomato paste',
            '{2} cups Beef Stock',
            '{1} cup dry red wine',
            '{2} tbsp brown sugar',
            '{2} bay leaves',
        ],
        tools: [
            'Large Dutch oven, or a roasting pan with a lid or foil',
            'Tongs',
            'Wooden spoon',
            'Fork, to test tenderness',
            'Large spoon or ladle, for skimming fat',
            'Carving knife and cutting board',
        ],
        steps: [
            'Heat the oven to 300°F. Season the brisket with salt, pepper and paprika.',
            'Brown the brisket in oil in a large Dutch oven or roasting pan, 5 minutes a side. Set aside.',
            'Cook the onions in the same pan until golden, 12 minutes. Add garlic and tomato paste for 1 minute.',
            'Add stock, wine, brown sugar and bay. Bring to a simmer.',
            'Return the brisket fat side up. Cover tightly and braise 3 hours to 3 hours 30 minutes, until a fork twists easily in the meat.',
            'Rest 20 minutes, then slice across the grain about 1/4 inch thick.',
            'Skim the fat from the sauce and return the slices to it.',
        ],
        note: 'Brisket is better the next day. Chill it whole in the sauce, slice it cold, and reheat covered at 325°F for 30 minutes.',
    },
    {
        slug: 'plate',
        baseServings: 4,
        difficulty: 'Easy',
        handsOn: '25 min',
        leadDays: 1,
        butcherTip: 'Outer skirt is the one to buy, and it is the only skirt we sell. Ask us to trim the membrane.',
        buy: [
            { name: 'Skirt Steak', price: '$28.99/lb', unitPrice: 28.99, unit: 'lb', baseAmount: 1.5, pieceLb: 1.5, pieceLabel: 'package' },
        ],
        sides: [
            { name: 'Queso Fundito (Large)', price: '$16.99', why: 'Ready to heat while the grill warms up.' },
        ],
        upgrades: [
            { name: 'Center Cut Skirt Steak', price: '$29.99/lb', why: 'The most even part of the skirt.' },
            { name: 'Marinated Skirt Steak', price: '$30.99/lb', why: 'In our sesame teriyaki marinade, ready for the grill.' },
        ],
        image: '/assets/recipes/skirt-steak-tacos.jpg',
        perfectFor: 'Taco night for four',
        occasions: ['game-day', 'weeknight'],
        cut: 'Plate',
        title: 'Skirt steak tacos',
        intro: 'Skirt steak takes a marinade well and cooks in minutes over very high heat.',
        serves: '4',
        prep: '15 min, plus 1 to 4 hr marinating',
        cook: '15 min',
        total: '30 min',
        ingredients: [
            'Juice of {2} limes and {1} orange',
            '{3} tbsp olive oil',
            '{4} garlic cloves, minced',
            '{1} jalapeño, finely chopped',
            '{2} tsp ground cumin',
            '{1} tsp chili powder',
            '{1.5} tsp kosher salt',
            '{1/2} cup cilantro, chopped',
            '{12} small corn tortillas',
            'To serve: diced white onion, cilantro, lime wedges, salsa',
        ],
        tools: [
            'Grill or cast-iron pan',
            'Zip-top bag or shallow dish, for marinating',
            'Tongs',
            'Paper towels',
            'Sharp knife and cutting board',
        ],
        steps: [
            'Mix the citrus juice, oil, garlic, jalapeño, cumin, chili powder, salt and cilantro. Marinate the steak in it for 1 to 4 hours in the refrigerator.',
            'Heat a grill or cast-iron pan as hot as it will go.',
            'Pat the steak dry. Cook 2 to 3 minutes a side for medium-rare; skirt is thin and overcooks fast.',
            'Rest 5 minutes.',
            'Cut the steak into 4-inch lengths, then slice each piece thinly across the grain.',
            'Warm the tortillas on the grill or in a dry pan, 20 seconds a side.',
            'Fill with steak, onion and cilantro. Serve with lime and salsa.',
        ],
        note: 'Hanger Steak works the same way. Give it 1 more minute a side.',
    },
    {
        slug: 'flank',
        baseServings: 4,
        difficulty: 'Easy',
        handsOn: '20 min',
        leadDays: 1,
        butcherTip: 'Ask us to score the surface in a shallow crosshatch. The marinade gets in faster and the steak stays flat.',
        buy: [
            { name: 'Flank Steak', price: '$20.99/lb', unitPrice: 20.99, unit: 'lb', baseAmount: 1.75, pieceLb: 1.75, pieceLabel: 'steak' },
        ],
        sides: [
            { name: 'Gazpacho', price: '$10.99', why: 'A cold starter for a warm night.' },
            { name: 'Coleslaw', price: '$7.99/lb', why: 'Crunch next to the rice.' },
        ],
        upgrades: [
            { name: 'Marinated Flank Steak', price: '$22.99/lb', why: 'Already marinated, for a no-prep weeknight.' },
        ],
        image: '/assets/recipes/soy-ginger-flank-steak.jpg',
        perfectFor: 'A weeknight dinner in 30 minutes',
        occasions: ['weeknight'],
        cut: 'Flank',
        title: 'Soy-ginger flank steak',
        intro: 'Flank is lean with a long grain, so it wants a marinade, a quick hot cook, and thin slicing.',
        serves: '4',
        prep: '10 min, plus 2 to 8 hr marinating',
        cook: '20 min',
        total: '30 min',
        ingredients: [
            '{1/3} cup soy sauce',
            '{2} tbsp honey',
            '{2} tbsp rice vinegar',
            '{1} tbsp toasted sesame oil',
            '{1} tbsp fresh ginger, grated',
            '{3} garlic cloves, minced',
            '{2} scallions, sliced',
            '{1} tbsp sesame seeds',
        ],
        tools: [
            'Grill, or a broiler and broiler pan',
            'Instant-read thermometer',
            'Mixing bowl and whisk',
            'Zip-top bag or shallow dish, for marinating',
            'Tongs',
            'Sharp knife and cutting board',
        ],
        steps: [
            'Whisk the soy sauce, honey, vinegar, sesame oil, ginger and garlic. Set aside 3 tablespoons for serving.',
            'Marinate the steak in the rest for 2 to 8 hours in the refrigerator.',
            'Heat a grill or broiler to high. Pat the steak dry.',
            'Cook 4 to 5 minutes a side, until the center reads 130°F.',
            'Rest 10 minutes.',
            'Slice thinly across the grain, holding the knife at an angle.',
            'Drizzle with the reserved sauce and top with scallions and sesame seeds.',
        ],
        note: 'Serve over rice, or cold the next day in a salad.',
    },
    {
        slug: 'shank',
        baseServings: 4,
        difficulty: 'Medium',
        handsOn: '30 min',
        leadDays: 1,
        butcherTip: 'Ask for center-cut pieces about 2 inches thick. They stand up in the pot and each has a good marrow bone.',
        buy: [
            { name: 'Beef Shank', price: '$10.99/lb', unitPrice: 10.99, unit: 'lb', baseAmount: 3.5, pieceLb: 1.75, pieceLabel: 'piece' },
            { name: 'Beef Stock', price: '$10.99', unitPrice: 10.99, unit: 'each', baseAmount: 0.5, pieceLb: 0, pieceLabel: 'quart' },
        ],
        sides: [
            { name: 'Creamed Spinach', price: '$14.99/lb', why: 'Something green beside the polenta.' },
            { name: 'French Onion Soup', price: '$16.99', why: 'A starter for a cold night.' },
        ],
        upgrades: [
            { name: 'Veal Shank', price: '$33.99/lb', why: 'The classic for osso buco. Same method, more delicate.' },
        ],
        image: '/assets/recipes/red-wine-braised-beef-shank.jpg',
        perfectFor: 'A slow-cooked dinner for four',
        occasions: ['sunday-dinner', 'date-night'],
        cut: 'Shank',
        title: 'Red wine braised beef shank',
        intro: 'Shank is tough and full of collagen, and three hours in wine turns it spoon-tender with a glossy sauce.',
        serves: '4',
        prep: '30 min',
        cook: '3 hr',
        total: '3 hr 30 min',
        ingredients: [
            '{1/4} cup flour',
            '{2} tbsp olive oil',
            '{1} onion, {2} carrots, {2} celery stalks, diced',
            '{4} garlic cloves, smashed',
            '{2} tbsp tomato paste',
            '{2} cups dry red wine',
            '{2} cups Beef Stock',
            '{3} sprigs thyme, {2} bay leaves',
            'Salt and pepper',
            'To serve: polenta or mashed potatoes',
        ],
        tools: [
            'Dutch oven with lid, 5 quart or larger',
            'Tongs',
            'Wooden spoon',
            'Shallow dish, for the flour',
            'Fork, to test tenderness',
            "Chef's knife and cutting board",
        ],
        steps: [
            'Heat the oven to 325°F. Season the shanks with salt and pepper and dust with flour.',
            'Brown the shanks in oil in a Dutch oven, 4 to 5 minutes a side. Set aside.',
            'Cook the onion, carrots and celery until soft, 8 minutes. Add garlic and tomato paste for 2 minutes.',
            'Add the wine and simmer until reduced by half, about 10 minutes.',
            'Add stock, thyme and bay. Return the shanks; the liquid should come two-thirds of the way up.',
            'Cover and braise 3 hours, turning the shanks once, until the meat pulls from the bone.',
            'Lift out the shanks. Simmer the sauce on the stove until it coats a spoon, then season.',
            'Serve over polenta with the sauce. Scoop the marrow from the bone into the sauce or onto toast.',
        ],
    },
    {
        slug: 'turkey',
        baseServings: 12,
        servingOptions: [8, 12, 16],
        difficulty: 'Medium',
        handsOn: '40 min',
        leadDays: 5,
        butcherTip: 'Tell us how many you are feeding and we will pick the bird. Order early; holiday turkeys are spoken for fast.',
        buy: [
            { name: 'Ferndale Turkey', price: '$6.59/lb', unitPrice: 6.59, unit: 'lb', baseAmount: 13, pieceLb: 0, pieceLabel: 'bird', single: true },
            { name: 'Turkey Stock', price: '$10.99', unitPrice: 10.99, unit: 'each', baseAmount: 0.5, pieceLb: 0, pieceLabel: 'quart' },
            { name: 'Turkey Gravy', price: '$14.99', unitPrice: 14.99, unit: 'each', baseAmount: 2, pieceLb: 0, pieceLabel: 'container' },
        ],
        sides: [
            { name: 'Andouille Cornbread Stuffing', price: '$12.99/lb', why: 'Made in house.' },
            { name: 'Wild Rice And Pecan Stuffing', price: '$12.99/lb', why: 'A second stuffing for a big table.' },
            { name: 'Creamed Spinach', price: '$14.99/lb', why: 'One side you do not have to cook.' },
        ],
        upgrades: [
            { name: 'HMC Smoked Turkey', price: '$175.00', why: 'A whole turkey, smoked in house.' },
            { name: 'Ferndale Bone-In Turkey Breast', price: '$10.99/lb', why: 'For a smaller table that only wants white meat.' },
        ],
        image: '/assets/recipes/herb-butter-roast-turkey.jpg',
        perfectFor: 'Thanksgiving for ten to twelve',
        occasions: ['feeding-a-crowd'],
        cut: 'Whole Turkey',
        title: 'Herb-butter roast turkey',
        intro: 'Salting the bird a day ahead and roasting it under herb butter gives crisp skin and juicy meat without basting every half hour.',
        serves: '10 to 12',
        prep: '30 min, plus overnight salting',
        cook: '3 hr 30 min',
        total: '4 hr',
        ingredients: [
            '{3} tbsp kosher salt',
            '{8} tbsp butter, softened',
            '{2} tbsp each chopped fresh sage, thyme and rosemary',
            '{4} garlic cloves, minced',
            '{1} tsp black pepper',
            '{1} onion, quartered',
            '{1} lemon, halved',
            '{2} cups Turkey Stock',
            'Turkey Gravy, warmed, to serve',
        ],
        tools: [
            'Roasting pan with a rack',
            'Instant-read thermometer',
            'Kitchen twine',
            'Small bowl, for the herb butter',
            'Aluminum foil',
            'Paper towels',
            'Carving knife and large cutting board',
        ],
        steps: [
            'The day before, remove the giblets and pat the turkey dry. Rub the salt all over and under the breast skin. Refrigerate uncovered overnight.',
            'Take the turkey out 1 hour before roasting. Heat the oven to 425°F.',
            'Mix the butter, herbs, garlic and pepper. Loosen the breast skin and spread half the butter under it. Rub the rest over the outside.',
            'Put the onion and lemon in the cavity. Tie the legs together and tuck the wing tips under.',
            'Set the turkey breast side up on the rack. Pour the stock into the pan. Roast 30 minutes.',
            'Lower the oven to 325°F. Roast 2 to 2 hours 30 minutes more, until the thickest part of the thigh and the breast both read 165°F. Tent the breast with foil if it browns too fast.',
            'Rest 30 minutes, loosely covered, before carving.',
            'Stir the pan juices into the warmed gravy and serve.',
        ],
        note: 'Plan on about 1 to 1.25 lb of turkey per person. A larger bird needs roughly 13 more minutes per pound at 325°F.',
    },
    {
        slug: 'prime-rib',
        baseServings: 6,
        difficulty: 'Medium',
        handsOn: '20 min',
        leadDays: 5,
        butcherTip: 'Order by the bone: one rib feeds two. Ask us to cut the bones off and tie them back on, so carving takes one cut.',
        buy: [
            { name: 'Prime Rib', price: '$38.99/lb', unitPrice: 38.99, unit: 'lb', baseAmount: 6.5, pieceLb: 0, pieceLabel: 'roast', single: true },
        ],
        sides: [
            { name: 'Twice Baked Potatoes', price: '$4.99', why: 'One per person.' },
            { name: 'Creamed Spinach', price: '$14.99/lb', why: 'The steakhouse pairing.' },
            { name: 'Shrimp De Jonghe', price: '$23.99', why: 'A starter worthy of the roast.' },
        ],
        upgrades: [
            { name: 'Prime Beef Tenderloin', price: '$44.99/lb', why: 'Trimmed and tied, 3.5 to 5 lb, for guests who want it lean.' },
        ],
        image: '/assets/recipes/garlic-herb-prime-rib.jpg',
        perfectFor: 'Christmas dinner for six',
        occasions: ['feeding-a-crowd', 'sunday-dinner'],
        cut: 'Rib',
        title: 'Garlic-herb prime rib',
        intro: 'A standing rib roast needs little more than salt, garlic, herbs and a thermometer, and it carves into a slice per guest.',
        serves: '6',
        prep: '15 min, plus overnight salting',
        cook: '2 hr 30 min',
        total: '2 hr 45 min',
        ingredients: [
            '{2} tbsp kosher salt',
            '{1} tbsp coarse black pepper',
            '{6} garlic cloves, minced',
            '{2} tbsp fresh rosemary, chopped',
            '{1} tbsp fresh thyme leaves',
            '{3} tbsp olive oil',
        ],
        extraIngredients: {
            title: 'Horseradish cream',
            items: ['{1} cup sour cream', '{3} tbsp prepared horseradish', '{1} tbsp lemon juice', '{1/2} tsp salt'],
        },
        tools: [
            'Roasting pan with a rack',
            'Instant-read thermometer',
            'Two small bowls',
            'Aluminum foil',
            'Long, sharp carving knife and cutting board',
        ],
        steps: [
            'The night before, salt the roast all over and refrigerate uncovered.',
            'Take the roast out 2 hours before cooking. Heat the oven to 450°F.',
            'Mix the garlic, herbs, pepper and oil. Rub it over the roast and set it bone side down on the rack.',
            'Roast 20 minutes to brown the outside.',
            'Lower the oven to 325°F. Roast until the center reads 120°F for medium-rare, about 1 hour 30 minutes to 1 hour 45 minutes.',
            'Tent with foil and rest 30 minutes. The temperature will rise to about 130°F.',
            'Stir the horseradish cream ingredients together.',
            'Cut the meat off the bones in one piece, then slice it across the grain. Serve with the horseradish cream.',
        ],
        note: 'One rib feeds two people, so order by the bone: 2 bones for four, 4 bones for eight. Allow about 15 minutes per pound at 325°F.',
    },
    {
        slug: 'lamb',
        baseServings: 8,
        difficulty: 'Medium',
        handsOn: '25 min',
        leadDays: 5,
        butcherTip: 'Ask us to remove the hip bone and trim the fat cap. The leg carves far more easily at the table.',
        buy: [
            { name: 'Bone-In Leg Of Lamb', price: '$20.99/lb', unitPrice: 20.99, unit: 'lb', baseAmount: 6.5, pieceLb: 0, pieceLabel: 'leg', single: true },
        ],
        sides: [
            { name: 'Creamed Spinach', price: '$14.99/lb', why: 'Something green beside the potatoes.' },
            { name: 'Spinach Artichoke Dip', price: '$16.99', why: 'For guests while the lamb rests.' },
        ],
        upgrades: [
            { name: 'Domestic Rack of Lamb', price: '$49.99/lb', why: 'French trimmed, for a smaller and fancier table.' },
            { name: 'Butterflied Leg of Lamb', price: '$26.99/lb', why: 'Boned and opened flat, so it grills in under an hour.' },
        ],
        image: '/assets/recipes/roast-leg-of-lamb.jpg',
        perfectFor: 'Easter lunch for eight',
        occasions: ['feeding-a-crowd', 'sunday-dinner'],
        cut: 'Leg of Lamb',
        title: 'Roast leg of lamb with garlic and rosemary',
        intro: 'Garlic pushed into the meat and a lemon-mustard rub season a leg of lamb all the way through.',
        serves: '8',
        prep: '20 min, plus 1 hr at room temperature',
        cook: '2 hr',
        total: '2 hr 20 min',
        ingredients: [
            '{6} garlic cloves, cut in slivers',
            '{2} tbsp fresh rosemary, chopped',
            '{2} tbsp Dijon mustard',
            '{3} tbsp olive oil',
            'Zest and juice of {1} lemon',
            '{1} tbsp kosher salt',
            '{2} tsp black pepper',
            '{2} lb small potatoes, halved',
        ],
        tools: [
            'Roasting pan with a rack',
            'Instant-read thermometer',
            'Paring knife, for the garlic slits',
            'Small bowl',
            'Aluminum foil',
            'Carving knife and cutting board',
        ],
        steps: [
            'Take the lamb out of the refrigerator 1 hour ahead. Heat the oven to 425°F.',
            'Cut small slits all over the lamb with a paring knife and push a sliver of garlic into each.',
            'Mix the rosemary, mustard, oil, lemon zest and juice, salt and pepper. Rub it all over the lamb.',
            'Toss the potatoes with a little oil and salt in the roasting pan. Set the lamb on the rack above them.',
            'Roast 20 minutes, then lower the oven to 350°F.',
            'Roast until the thickest part reads 130°F for medium-rare, about 1 hour 15 minutes to 1 hour 30 minutes more.',
            'Tent with foil and rest 20 minutes. Return the potatoes to the oven if they need more color.',
            'Carve in thin slices parallel to the bone. Serve with the potatoes and pan juices.',
        ],
        note: 'A Boneless Leg of Lamb works too. It cooks about 20 minutes faster and slices like a roast.',
    },
];

/* Cut-map recipes first, then the additions in recipes-more.ts. */
export const RECIPES: Recipe[] = [...BASE_RECIPES, ...MORE_RECIPES];
