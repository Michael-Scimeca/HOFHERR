/**
 * Starter recipes for the social content bank. Kept short enough to fit one ingredients slide
 * (≤ 8 lines) and one method slide (≤ 5 steps). Safe-temperature notes follow USDA guidance.
 */
export type Recipe = {
    slug: string;
    title: string;
    meta: string; // time · serves
    iconId: string;
    photo: string;
    ingredients: string[];
    steps: string[];
};

export const RECIPES: Recipe[] = [
    {
        slug: 'garlic-butter-ribeye',
        title: 'Garlic butter ribeye',
        meta: '25 min · serves 2',
        iconId: 'cow',
        photo: '/assets/specials-bbq.jpg',
        ingredients: [
            '1 bone-in ribeye, 1½" thick',
            '1 tsp kosher salt + black pepper',
            '1 tbsp high-heat oil',
            '3 tbsp butter',
            '4 garlic cloves, smashed',
            '3 sprigs fresh thyme',
        ],
        steps: [
            'Salt the steak 40 minutes ahead and let it come off the chill.',
            'Heat cast iron until smoking, add oil, sear 3 minutes a side.',
            'Lower the heat, add butter, garlic and thyme. Baste for 2 minutes.',
            'Pull at 125°F for medium rare. Rest 10 minutes.',
            'Slice against the grain and spoon the butter over.',
        ],
    },
    {
        slug: 'smash-burgers',
        title: 'Diner smash burgers',
        meta: '20 min · serves 4',
        iconId: 'cow',
        photo: '/assets/specials-bbq.jpg',
        ingredients: [
            '1 lb fresh-ground chuck (80/20)',
            '4 potato buns, buttered',
            '4 slices American cheese',
            '1 small onion, sliced paper thin',
            'Salt and pepper',
            'Pickles and burger sauce',
        ],
        steps: [
            'Roll the beef into four loose balls. Keep them cold.',
            'Toast the buns in a ripping-hot skillet, then set aside.',
            'Add a ball, top with onion, smash flat hard. Season.',
            'Cook 2 minutes until crusty, flip, add cheese for 1 minute.',
            'Cook to 160°F, stack on buns with pickles and sauce.',
        ],
    },
    {
        slug: 'lemon-herb-roast-chicken',
        title: 'Lemon herb roast chicken',
        meta: '1 hr 30 min · serves 4',
        iconId: 'chicken',
        photo: '/assets/specials-rotisserie.jpg',
        ingredients: [
            '1 whole chicken, about 4 lb',
            '2 tsp kosher salt',
            '3 tbsp soft butter',
            '1 lemon, halved',
            '1 head garlic, halved',
            'Rosemary and thyme',
        ],
        steps: [
            'Pat the bird dry and salt it all over, inside and out.',
            'Rub butter under and over the skin. Stuff with lemon, garlic and herbs.',
            'Roast at 425°F for 60–75 minutes.',
            'Done at 165°F in the thickest part of the thigh.',
            'Rest 15 minutes before carving.',
        ],
    },
    {
        slug: 'pork-chops-apple',
        title: 'Pork chops with apple pan sauce',
        meta: '30 min · serves 2',
        iconId: 'pig',
        photo: '/assets/shop-interior.jpg',
        ingredients: [
            '2 bone-in pork chops, 1¼" thick',
            'Salt and pepper',
            '1 tbsp oil + 2 tbsp butter',
            '1 apple, sliced',
            '1 shallot, minced',
            '½ cup apple cider',
            '1 tsp Dijon mustard',
        ],
        steps: [
            'Season the chops and sear in oil, 4 minutes a side.',
            'Cook to 145°F, then rest on a plate.',
            'In the same pan, brown the apple and shallot in butter.',
            'Add cider and mustard, simmer until glossy.',
            'Spoon the sauce over the chops and serve.',
        ],
    },
    {
        slug: 'braised-short-ribs',
        title: 'Red wine braised short ribs',
        meta: '3 hr 30 min · serves 4',
        iconId: 'cow',
        photo: '/assets/specials-italian-beef.jpg',
        ingredients: [
            '4 lb bone-in beef short ribs',
            'Salt and pepper',
            '1 onion, 2 carrots, 2 celery ribs, chopped',
            '2 tbsp tomato paste',
            '2 cups dry red wine',
            '2 cups beef stock',
            'Thyme and bay leaves',
        ],
        steps: [
            'Season and brown the ribs well on all sides. Set aside.',
            'Soften the vegetables, stir in tomato paste for 1 minute.',
            'Add wine and reduce by half, then stock and herbs.',
            'Return the ribs, cover, braise at 325°F for about 3 hours.',
            'Skim the fat and reduce the sauce. Serve over mash.',
        ],
    },
    {
        slug: 'rosemary-lamb-chops',
        title: 'Rosemary garlic lamb chops',
        meta: '20 min · serves 2',
        iconId: 'lamb',
        photo: '/assets/shop-interior.jpg',
        ingredients: [
            '6 lamb rib chops, Frenched',
            '2 tbsp olive oil',
            '2 garlic cloves, grated',
            '1 tbsp chopped rosemary',
            'Salt and pepper',
            'Lemon wedges',
        ],
        steps: [
            'Rub the chops with oil, garlic, rosemary, salt and pepper.',
            'Rest 20 minutes while a pan or grill gets very hot.',
            'Sear 2–3 minutes a side for medium rare.',
            'Rest 5 minutes.',
            'Serve with lemon and a pinch of flaky salt.',
        ],
    },
];
