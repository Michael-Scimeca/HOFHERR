// Press coverage for Hofherr Meat Co.
// Summaries are written in our own words. Quotes are short and attributed.
// Add new coverage to the top of PRESS_ITEMS; the first item is the featured story.

export type PressItem = {
    outlet: string;
    kind: 'Article' | 'TV' | 'Podcast';
    title: string;
    date: string; // display date
    isoDate: string; // YYYY-MM-DD, for structured data
    author?: string;
    url: string;
    cta: string;
    summary: string;
    quote?: { text: string; by: string };
};

export const PRESS_ITEMS: PressItem[] = [
    {
        outlet: 'WTTW',
        kind: 'Article',
        title: "A Butcher Shop Has Roots in Chicago's Meatpacking Heyday – And Crafted an Exceptional Italian Beef",
        date: 'July 2026',
        isoDate: '2026-07-02',
        author: 'Daniel Hautzinger',
        url: 'https://www.wttw.com/playlist/2026/07/02/hofherr-meat-co',
        cta: 'Read on WTTW',
        summary:
            "Chicago's public television station traces the Hofherr name from a nineteenth-century meatpacking company to the Northfield shop Sean and Arielle opened in 2014, with stops at the sausage kitchen, the dry-aging case, and the Italian beef that led to the Depot.",
        quote: { text: 'Passing on techniques that are kind of a dying thing.', by: 'Arielle Hofherr' },
    },
    {
        outlet: 'NBC Chicago',
        kind: 'TV',
        title: "Is the world's greatest Italian beef hiding in a butcher shop in suburban Northfield?",
        date: 'September 2025',
        isoDate: '2025-09-23',
        author: 'Kevin Pang',
        url: 'https://www.nbcchicago.com/news/local/is-the-worlds-greatest-italian-beef-hiding-in-a-butcher-shop-in-suburban-northfield/3828305/',
        cta: 'Watch on NBC Chicago',
        summary:
            'Food writer Kevin Pang returns to the shop to revisit the sandwich he helped develop: chuck roll, a deeply concentrated jus, and a giardiniera aged for three years from a family recipe.',
    },
    {
        outlet: "Cook's Country",
        kind: 'Article',
        title: 'Is This the Best Italian Beef Sandwich Ever Made?',
        date: 'March 2025',
        isoDate: '2025-03-03',
        url: 'https://www.americastestkitchen.com/cookscountry/articles/8574-is-this-the-best-italian-beef-sandwich-ever-made',
        cta: "Read on Cook's Country",
        summary:
            "America's Test Kitchen's Cook's Country visits Northfield for its On the Road series, then builds its own Chicago Italian beef recipe inspired by ours.",
    },
    {
        outlet: 'The Record North Shore',
        kind: 'Article',
        title: "With New Location, Northfield Business Will 'Meat' Customers at Winnetka Train Station",
        date: 'November 2024',
        isoDate: '2024-11-21',
        author: 'Martin Carlino',
        url: 'https://www.therecordnorthshore.org/2024/11/21/with-new-location-northfield-business-will-meat-customers-at-winnetka-train-station/',
        cta: 'Read on The Record',
        summary:
            'Winnetka trustees unanimously approve our second location inside the Elm Street Metra station: a commuter stop for coffee, sandwiches, and same-day pickup of orders from the butcher shop.',
        quote: { text: 'This was the perfect opportunity for us to expand our footprint.', by: 'Sean Hofherr' },
    },
    {
        outlet: "America's Test Kitchen · Proof",
        kind: 'Podcast',
        title: "The World's Greatest Italian Beef",
        date: 'January 2023',
        isoDate: '2023-01-12',
        author: 'Kevin Pang',
        url: 'https://chicago.citycast.fm/podcasts/kevin-pangs-proof-the-worlds-best-italian-beef',
        cta: 'Listen to the episode',
        summary:
            "Inspired by The Bear, the Proof podcast follows a month in our kitchen as host Kevin Pang and the Hofherr team set out to engineer the best Italian beef they can.",
    },
    {
        outlet: 'The Record North Shore',
        kind: 'Article',
        title: "Did North Shore food experts just create the world's best Italian beef?",
        date: 'December 2022',
        isoDate: '2022-12-02',
        author: 'Joe Coughlin',
        url: 'https://www.therecordnorthshore.org/2022/12/02/did-north-shore-food-experts-just-create-the-worlds-best-italian-beef-see-for-yourself-this-saturday/',
        cta: 'Read on The Record',
        summary:
            'The story behind the first one-day-only sale: 100 sandwiches, half in the shop and half by preorder, and a kitchen that rallied around getting every component right.',
        quote: { text: 'This was never meant to be something to make a million dollars.', by: 'Sean Hofherr' },
    },
    {
        outlet: 'ABC7 Chicago',
        kind: 'TV',
        title: 'Hofherr Meat Company in Northfield carries on family legacy more than a century later',
        date: 'March 2020',
        isoDate: '2020-03-08',
        author: 'Steve Dolinsky',
        url: 'https://abc7chicago.com/hofherr-meat-company-co-northfield-butcher/5994418/',
        cta: 'Watch on ABC7',
        summary:
            "Steve Dolinsky tours the shop: dry-aged beef cut to order, more than 40 handmade sausages, rotisserie chickens, housemade soups, and the family history behind the name.",
    },
];

export const IN_PRINT = ["Cook's Country Magazine", 'Northfield Neighbors', 'Northfield Living'];

export type PressMediaAsset = {
    id: string;
    title: string;
    caption: string;
    context: string;
    credit: string;
    alt: string;
    src: string;
    downloadName: string;
    width: number;
    height: number;
    wide?: boolean;
    objectPosition?: 'shop';
};

export const PRESS_MEDIA_ASSETS: PressMediaAsset[] = [
    {
        id: 'sean-and-arielle-shop',
        title: 'Sean & Arielle Hofherr Inside the Butcher Shop',
        caption: 'Proprietors Sean and Arielle Hofherr inside the Northfield butcher shop at 300 Happ Rd.',
        context: 'Founders · Northfield',
        credit: 'Courtesy of Hofherr Meat Co.',
        alt: 'Proprietors Sean and Arielle Hofherr standing together inside Hofherr Meat Co. in Northfield, Illinois',
        src: '/assets/press/sean-and-arielle-hofherr-northfield-shop.webp',
        downloadName: 'sean-and-arielle-hofherr-northfield-shop.webp',
        width: 1024,
        height: 768,
        wide: true,
        objectPosition: 'shop',
    },
    {
        id: 'kevin-pang-sean-proof',
        title: "Recording America's Test Kitchen's Proof Podcast",
        caption: "Host Kevin Pang interviews Chef Sean Hofherr in the kitchen while developing the shop's signature Italian beef.",
        context: 'Proof Podcast · Kitchen',
        credit: 'Courtesy of Hofherr Meat Co.',
        alt: 'Kevin Pang holding a shotgun microphone interviewing Chef Sean Hofherr in the Hofherr Meat Co. kitchen',
        src: '/assets/press/kevin-pang-sean-hofherr-proof-podcast.webp',
        downloadName: 'kevin-pang-sean-hofherr-proof-podcast.webp',
        width: 1024,
        height: 683,
        wide: true,
    },
    {
        id: 'kevin-pang-arielle-proof',
        title: 'Arielle Hofherr with Kevin Pang in the Kitchen',
        caption: "Arielle Hofherr speaks with America's Test Kitchen host Kevin Pang during the month-long Italian beef project.",
        context: 'Proof Podcast · Kitchen',
        credit: 'Courtesy of Hofherr Meat Co.',
        alt: 'Arielle Hofherr speaking into a microphone held by Kevin Pang inside the Hofherr Meat Co. kitchen',
        src: '/assets/press/kevin-pang-arielle-hofherr-proof-podcast.webp',
        downloadName: 'kevin-pang-arielle-hofherr-proof-podcast.webp',
        width: 1024,
        height: 683,
    },
    {
        id: 'arielle-butcher-counter',
        title: 'Behind the Northfield Meat Counter',
        caption: 'Co-owner Arielle Hofherr at the custom-cut butcher case and specialty provisions counter.',
        context: 'The Butcher Shop · Counter',
        credit: 'Courtesy of Hofherr Meat Co.',
        alt: 'Arielle Hofherr gesturing toward the fresh meat display case inside Hofherr Meat Co.',
        src: '/assets/press/arielle-hofherr-northfield-butcher-counter.webp',
        downloadName: 'arielle-hofherr-northfield-butcher-counter.webp',
        width: 800,
        height: 533,
    },
    {
        id: 'hofherr-stay-smoking-smoker',
        title: '"Hofherrs Stay Smoking" Offset Smoker',
        caption: 'The custom Hofherr Meat Co. mobile offset smoker fired up outside the shop for whole-hog and BBQ service.',
        context: 'Smokehouse & Catering',
        credit: 'Courtesy of Hofherr Meat Co.',
        alt: 'Hofherr Meat Co. crew tending the custom painted Hofherrs Stay Smoking BBQ smoker trailer outdoors',
        src: '/assets/press/hofherr-stay-smoking-bbq-smoker.webp',
        downloadName: 'hofherr-stay-smoking-bbq-smoker.webp',
        width: 800,
        height: 533,
    },
];
