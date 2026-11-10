export const DEMO_ORDERS = [
    {
        _id: 'demo-order-4829',
        orderNumber: 'HM-4829',
        status: 'Ready-Paid',
        total: 18600,
        createdAt: '2026-11-01T18:30:00.000Z',
        metadata: {
            store_id: 'butcher',
            pickup: 'Northfield Butcher Shop • 2:00 PM Window',
        },
        items: [
            {
                name: 'USDA Prime Dry-Aged Bone-In Ribeye',
                price: 4400,
                qty: 2,
                note: '1.75" thick cut, butcher-twine tied & wax-paper wrapped',
                desc: '35-day dry-aged Midwest Prime ribeye',
            },
            {
                name: 'House-Smoked Applewood Slab Bacon',
                price: 1800,
                qty: 1,
                note: '',
                desc: 'Thick-sliced heritage pork belly',
            },
            {
                name: 'Roasted Bone Marrow & Veal Demi-Glace',
                price: 4000,
                qty: 2,
                note: '',
                desc: 'Small-batch 24-hour kettle reduction',
            },
        ],
    },
    {
        _id: 'demo-order-4791',
        orderNumber: 'HM-4791',
        status: 'Completed',
        total: 12450,
        createdAt: '2026-10-21T16:15:00.000Z',
        metadata: {
            store_id: 'depot',
            pickup: 'Winnetka Depot • 12:30 PM Hot Lunch Pickup',
        },
        items: [
            {
                name: 'Reserve Pitmaster Smoked Brisket Box',
                price: 8800,
                qty: 1,
                note: 'Extra house espresso bark rub & warm jus on the side',
                desc: '14-hour oak-smoked USDA Prime brisket',
            },
            {
                name: 'Italian Beef & Hot Giardiniera Kit',
                price: 1825,
                qty: 2,
                note: '',
                desc: 'Shaved prime roast beef, Turano rolls & house giardiniera',
            },
        ],
    },
    {
        _id: 'demo-order-4714',
        orderNumber: 'HM-4714',
        status: 'Completed',
        total: 19800,
        createdAt: '2026-10-09T15:00:00.000Z',
        metadata: {
            store_id: 'butcher',
            pickup: 'Northfield Butcher Shop • 11:00 AM Window',
        },
        items: [
            {
                name: 'USDA Prime Dry-Aged Bone-In Ribeye',
                price: 4400,
                qty: 3,
                note: 'Vacuum-sealed individually for weekend grill',
                desc: '35-day dry-aged Midwest Prime ribeye',
            },
            {
                name: 'Artisanal Charcuterie & Farmhouse Cheese Parcel',
                price: 6600,
                qty: 1,
                note: '',
                desc: 'Prosciutto di Parma, soppressata, aged cheddar & honeycomb',
            },
        ],
    },
    {
        _id: 'demo-order-4638',
        orderNumber: 'HM-4638',
        status: 'Completed',
        total: 13400,
        createdAt: '2026-09-27T19:45:00.000Z',
        metadata: {
            store_id: 'butcher',
            pickup: 'Northfield Butcher Shop • 3:00 PM Window',
        },
        items: [
            {
                name: 'Heritage Berkshire Pork Crown Roast',
                price: 9600,
                qty: 1,
                note: 'Frenched bones with rosemary-garlic herb crust',
                desc: 'Pasture-raised heritage Berkshire loin roast',
            },
            {
                name: 'Duck Confit & Country Terrine Duo',
                price: 1900,
                qty: 2,
                note: '',
                desc: 'Classic French bistro charcuterie parcel',
            },
        ],
    },
];

export const DEMO_SPECIALS = [
    {
        _id: 'demo-special-tomahawk',
        badge: 'hot-deal',
        image: '/assets/cuts/beef-prime-cuts-packaged.jpg',
        title: '45-Day Dry-Aged Prime Tomahawk',
        description: 'Hand-selected 38oz long-bone ribeye aged in our Northfield salt-brick vault, wrapped in signature crimson butcher paper.',
        regularPrice: '$135.00',
        salePrice: '$108.00',
        savings: 'Save $27.00 (20% Member Cut)',
    },
    {
        _id: 'demo-special-pitmaster',
        badge: 'best-value',
        image: '/assets/cuts/bbq-reserve-pitmaster-box-packaged.jpg',
        title: 'Reserve Pitmaster Brisket & Rib Feast',
        description: 'Oak-smoked USDA Prime whole brisket flat, full rack of St. Louis ribs, smoked tallow, and two pint sides.',
        regularPrice: '$165.00',
        salePrice: '$139.00',
        savings: 'Save $26.00 + Complimentary Smoked Tallow',
    },
    {
        _id: 'demo-special-charcuterie',
        badge: 'staff-pick',
        image: '/assets/cuts/charcuterie-board-deli-parcels-packaged.jpg',
        title: "Butcher's Reserve Charcuterie Parcel",
        description: 'House-cured duck prosciutto, country pâté, 24-month Parmigiano, cornichons, and grainy mustard.',
        regularPrice: '$78.00',
        salePrice: '$64.00',
        savings: 'Save $14.00 This Weekend',
    },
];

