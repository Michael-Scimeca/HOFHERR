// Auto-synced from https://hofherrmeatco.com/order/hofherr-meat-co
// 21 categories · 403 live Butcher Shop products (300 Happ Rd, Northfield, IL)

export type ButcherCatalogItem = {
    name: string;
    desc?: string;
    price: string;
    inStock?: boolean;
    stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
    image?: string;
    tags?: string[];
    allergens?: string[];
    servingSize?: string;
    cookingTip?: string;
    isNew?: boolean;
    isFeatured?: boolean;
};

export type ButcherCatalogCategory = {
    id: string;
    label: string;
    sub: string;
    emoji: string;
    icon?: string;
    items: ButcherCatalogItem[];
};

export const BUTCHER_SHOP_CATEGORIES: ButcherCatalogCategory[] = [
    {
        "id": "specials",
        "label": "Specials",
        "sub": "Freshly Made, Stocked & Seasonal Offerings",
        "emoji": "🔥",
        "icon": "/icons/onsale.svg",
        "items": [
            {
                "name": "Rush Creek Reserve Cheese",
                "price": "$36.99",
                "tags": [
                    "Freshly Made or Stocked!"
                ]
            },
            {
                "name": "Philly Cheesesteak Sausage",
                "price": "$12.99/lb",
                "desc": "Everything in a Philly Cheesesteak, but in sausage form! Includes beef, Swiss cheese, green pepper, and all the flavor you could imagine. Sold frozen in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Freshly Made or Stocked!"
                ]
            },
            {
                "name": "Best In Show",
                "price": "$12.99/lb",
                "desc": "The Bacon-Jalapeno-Cheddar Cheeseburger Sausage won us BaconFest at Wagner Farms for a good reason. Best paired with Bacon Fat Dijonaisse and our House Pickles. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Freshly Made or Stocked!"
                ]
            },
            {
                "name": "New School American Cheese",
                "price": "$11.99/lb",
                "tags": [
                    "Freshly Made or Stocked!"
                ]
            },
            {
                "name": "Enzo Crushed Lemon Olive Oil",
                "price": "$22.99",
                "desc": "Enzo Crushed Lemon Olive Oil blends premium olives with fresh lemons during the crushing process, creating a zesty and aromatic flavor.",
                "tags": [
                    "Freshly Made or Stocked!"
                ]
            },
            {
                "name": "Glazed Spiral-Sliced Ham",
                "price": "$100.00",
                "desc": "Ready to heat and enjoy! 10-12lb each and serves 10+ adults. (NOV 24 - 25)",
                "tags": [
                    "Thanksgiving",
                    "NOV 24 - 25"
                ]
            },
            {
                "name": "Turkey Stock",
                "price": "$11.99",
                "desc": "Housemade and sold by the Quart.",
                "tags": [
                    "Thanksgiving"
                ]
            },
            {
                "name": "Turkey Gravy",
                "price": "$12.99",
                "desc": "Housemade and sold by the Pint.",
                "tags": [
                    "Thanksgiving"
                ]
            },
            {
                "name": "Smoked Andouille and Cornbread Stuffing",
                "price": "$22.00",
                "desc": "1 quart of our house made stuffing - serves 4-6 people. (NOV 24 - 25)",
                "tags": [
                    "Thanksgiving",
                    "NOV 24 - 25"
                ]
            },
            {
                "name": "Cranberry Sauce",
                "price": "$12.99",
                "desc": "8 ounce container of our house made, citrus spiked Cranberry Sauce - serves 4",
                "tags": [
                    "Thanksgiving"
                ]
            },
            {
                "name": "Brine Kit",
                "price": "$20.00",
                "desc": "The HMCo. Brine Kit includes brine seasoning, a brining bag, and simple instructions for brining a turkey at home.",
                "tags": [
                    "Thanksgiving"
                ]
            },
            {
                "name": "Fresh Cranberries",
                "price": "$4.50",
                "tags": [
                    "Thanksgiving"
                ]
            }
        ]
    },
    {
        "id": "beef",
        "label": "Beef",
        "sub": "Choice and prime beef sourced from midwestern farms raising grass-fed, grain-finished cattle",
        "emoji": "🥩",
        "icon": "/icons/cow.svg",
        "items": [
            {
                "name": "Prime Bone-In Ribeye",
                "price": "$40.99/lb",
                "desc": "Prime, dry-aged, cut to order. The standard cut is 1.25\" and weighs 1.25-1.5lb. Order by the number of steaks and final cost will be calculated at pick up."
            },
            {
                "name": "Prime Boneless Ribeye",
                "price": "$42.99/lb",
                "desc": "Our boneless ribeye is cut to a standard 1.25\" and weighs about 1 lb. Order by the number of steaks and final cost will be calculated at pick up."
            },
            {
                "name": "Prime Beef Tenderloin",
                "price": "$48.99/lb",
                "desc": "Our Prime Tenderloins range from 3.5lbs to 5lbs. They are trimmed and tied, ready for seasoning and the oven or grill. Please indicate how many lbs of tenderloin your would like."
            },
            {
                "name": "Prime Porterhouse",
                "price": "$40.99/lb",
                "desc": "Our standard porterhouse is cut to 1.25\" and weighs around 1.5-2lbs. Order by the steak and final weigh will need to be calculated at pick up."
            },
            {
                "name": "Prime T-Bone",
                "price": "$38.99/lb",
                "desc": "Prime, dry-aged, and cut to order. The standard cut is 1.25\" and about 1lb. Order by the steak and final weigh will need to be calculated at pick up."
            },
            {
                "name": "Filet Mignon",
                "price": "$49.99/lb",
                "desc": "Our standard Prime Filet is 8oz. Order by the number of steaks and final cost will be calculated at pick up."
            },
            {
                "name": "Beef Knuckle Bones",
                "price": "$5.99/lb",
                "desc": "Large beef bones that are perfect for making stock. Kept frozen. Order by the bone and final weigh will need to be calculated at pick up."
            },
            {
                "name": "Beef Stew Meat",
                "price": "$18.99/lb",
                "desc": "1.5\" cubes of chuck roast, trimmed for stew. Order by the lb."
            },
            {
                "name": "Brisket Deckle",
                "price": "$10.99/lb",
                "desc": "Great for smoking and making burnt ends. Indicate how many lbs you would like or mark 1 if you would like one piece, any size."
            },
            {
                "name": "Ground Sirloin",
                "price": "$11.99/lb",
                "desc": "Our ground sirloin blend has short rib, brisket, and trimming from our prime steaks. It is an 80/20 blend. Order by the lb."
            },
            {
                "name": "Flat Iron Steak",
                "price": "$21.99/lb",
                "desc": "Second most tender piece of beef after the tenderloin. Each steak is about 1lb. Order by the steak and final weigh will need to be calculated at pick up."
            },
            {
                "name": "Sirloin Burger",
                "price": "$12.99/lb",
                "desc": "Our 1/3lb burgers are made with our house sirloin blend. Indicate how many burgers you would like and final price will be adjusted at pick up."
            },
            {
                "name": "Hanger Steak",
                "price": "$26.99/lb",
                "desc": "Our hanger steaks come in packs between 1 and 2lbs. Order by the steak and final weigh will need to be calculated at pick up."
            },
            {
                "name": "Eye Of Round",
                "price": "$14.99/lb",
                "desc": "Trimmed and tied for the oven. The eye of round roast comes 3-5lbs. Indicate how many lbs you would like.."
            },
            {
                "name": "Boneless Short Ribs",
                "price": "$18.99/lb",
                "desc": "Our boneless short ribs come in long chunks and are perfect to braise or throw on the grill. Order by the lb and specify if you would like them cubed."
            },
            {
                "name": "Calves Liver",
                "price": "$19.99/lb",
                "desc": "Comes sliced and frozen in 1lb packages."
            },
            {
                "name": "Beef Back Ribs",
                "price": "$9.99/lb",
                "desc": "Each slab has 7 ribs and is sold frozen."
            },
            {
                "name": "First Cut Brisket",
                "price": "$14.99/lb",
                "desc": "First Cut Briskets range from 5 to 7 pounds and are ideal for the oven or slow cooker. Indicate how many lbs you would like."
            },
            {
                "name": "Bone-In Prime Rib",
                "price": "$40.99/lb",
                "desc": "Sold by the bone or rib. One rib feeds two people. We hinge the bone so it is easy to slice at any thickness."
            },
            {
                "name": "Tri-Tip",
                "price": "$21.99/lb",
                "desc": "Each steak weighs 1.5-2.5lb. They are great on the grill."
            },
            {
                "name": "Marrow Bones",
                "price": "$7.99/lb",
                "desc": "Cut in various sizes. Please specify if you are looking for canoes to roast or larger chunks."
            },
            {
                "name": "Pot Roast",
                "price": "$16.99/lb",
                "desc": "Pot Roasts are cut between 2-3lb and are great for the slow cooker. Indicate how many lb you would like."
            },
            {
                "name": "Prime Strip Steak Kabob",
                "price": "$24.99/lb",
                "desc": "Our all beef kabobs are made with New York Strip steak and are marinaded in a house blend. Indicate how many skewers you would like."
            },
            {
                "name": "Skirt Steak",
                "price": "$30.99/lb",
                "desc": "All outer skirt. Order by the lb. Indicate if you prefer individual packaging."
            },
            {
                "name": "Sirloin Flap",
                "price": "$19.99/lb"
            },
            {
                "name": "Whole Brisket",
                "price": "$11.99/lb",
                "desc": "Our Whole Briskets range in size from 10lbs to 16lbs. They are best for the smoker."
            },
            {
                "name": "Kalbi-Cut Short Ribs",
                "price": "$16.99/lb",
                "desc": "These bone-in short ribs are cut across the bone into thin strips that are easy to grill."
            },
            {
                "name": "Old 96'er",
                "price": "$18.99/lb",
                "desc": "The steak of all steaks. This massive cut was made famous in The Great Outdoors, but is actually an amazing bite. We recommend cooking it low and slow, and finishing it with a sear. Stocked frozen, or sold fresh with 72 hours notice."
            },
            {
                "name": "Smoked Marrow Bone",
                "price": "$8.99/lb",
                "desc": "Smoked in-house and perfect for a dog treat or adding flavor to a soup or stock."
            },
            {
                "name": "Beef Fat",
                "price": "$1.99/lb"
            }
        ]
    },
    {
        "id": "pork",
        "label": "Pork",
        "sub": "Berkshire pork sourced from Illinois and Iowa",
        "emoji": "🐖",
        "icon": "/icons/pig.svg",
        "items": [
            {
                "name": "Baby Back Ribs",
                "price": "$12.99/lb",
                "desc": "Each \"slab\" weighs 2.5-3lb with the membrane-removed (as a rule). Indicate number of slabs and final weight will be adjusted at pick up."
            },
            {
                "name": "Bone-In Pork Roast",
                "price": "$12.99/lb"
            },
            {
                "name": "Bone-In Pork Shoulder",
                "price": "$7.99/lb",
                "desc": "Each shoulder (otherwise known as \"butt\") is 5-12lb. Indicate number of pounds desired"
            },
            {
                "name": "Boneless Pork Chops",
                "price": "$15.99/lb"
            },
            {
                "name": "Boneless Pork Roast",
                "price": "$12.99/lb"
            },
            {
                "name": "Boneless Pork Shoulder",
                "price": "$8.99/lb"
            },
            {
                "name": "Country Style Ribs",
                "price": "$6.99/lb"
            },
            {
                "name": "Crown Roast of Pork",
                "price": "$250.00",
                "desc": "12-16 chops per roast - THE elegant, holiday centerpiece"
            },
            {
                "name": "Ground Pork",
                "price": "$8.99/lb",
                "desc": "Freshly, coarse ground pork shoulder sold by the lb"
            },
            {
                "name": "Pork Belly",
                "price": "$10.99/lb"
            },
            {
                "name": "Pork Chops",
                "price": "$14.99/lb"
            },
            {
                "name": "Pork Neck Bones",
                "price": "$3.99/lb"
            },
            {
                "name": "Pork Skin",
                "price": "$2.99/lb",
                "desc": "Sold frozen in packs of 1-2 lb"
            },
            {
                "name": "Pure Lard",
                "price": "$3.99/lb",
                "desc": "Sold frozen in 4-8oz chunks."
            },
            {
                "name": "Rib Tips",
                "price": "$8.99/lb"
            },
            {
                "name": "Smoked Ham Hock",
                "price": "$9.99/lb",
                "desc": "Each smoked hock is about 8oz and perfect for adding to your soup or beans."
            },
            {
                "name": "Smoked Pig Ears",
                "price": "$4.00",
                "desc": "THE Dog Treat"
            },
            {
                "name": "Smoked Pork Chops",
                "price": "$16.99/lb"
            },
            {
                "name": "Trotter",
                "price": "$4.99/lb",
                "desc": "Sold frozen in 1-2lb packages."
            },
            {
                "name": "Pork Fat Back",
                "price": "$2.99/lb"
            },
            {
                "name": "Sesame Teriyaki Marinated Pork Tenderloin",
                "price": "$22.99/lb"
            },
            {
                "name": "Marinated Lemon Ginger Pork Chop",
                "price": "$14.99/lb"
            }
        ]
    },
    {
        "id": "chicken",
        "label": "Chicken",
        "sub": "Pasture-Raised Poultry, Cut Fresh Daily",
        "emoji": "🍗",
        "icon": "/icons/chicken.svg",
        "items": [
            {
                "name": "Boneless Skinless Chicken Breast",
                "price": "$10.99/lb"
            },
            {
                "name": "Chicken Backs",
                "price": "$3.99/lb"
            },
            {
                "name": "Chicken Drumsticks",
                "price": "$6.99/lb"
            },
            {
                "name": "Chicken Legs",
                "price": "$5.99/lb"
            },
            {
                "name": "Chicken Wings",
                "price": "$5.99/lb"
            },
            {
                "name": "Schmaltz",
                "price": "$12.99",
                "desc": "Rendered Chicken Fat in 8oz Containers"
            },
            {
                "name": "Split Chicken",
                "price": "$6.99/lb"
            },
            {
                "name": "Split Chicken Wings",
                "price": "$6.99/lb"
            },
            {
                "name": "Marinated Chicken Breast, Teriyaki",
                "price": "$14.99/lb"
            },
            {
                "name": "Boneless Skinless Chicken Thighs",
                "price": "$8.99/lb"
            },
            {
                "name": "Grecian Marinated Chicken Breast",
                "price": "$14.99/lb"
            }
        ]
    },
    {
        "id": "lamb",
        "label": "Lamb",
        "sub": "Whole Lamb Sourced from Illinois Farms",
        "emoji": "🐑",
        "icon": "/icons/lamb.svg",
        "items": [
            {
                "name": "Bone-In Leg Of Lamb",
                "price": "$21.99/lb"
            },
            {
                "name": "Boneless Lamb Shoulder",
                "price": "$19.99/lb"
            },
            {
                "name": "Butterflied Leg of Lamb",
                "price": "$29.99/lb"
            },
            {
                "name": "Ground Lamb",
                "price": "$16.99/lb"
            },
            {
                "name": "Lamb Chops",
                "price": "$32.99/lb"
            },
            {
                "name": "Lamb Shank",
                "price": "$18.99/lb"
            },
            {
                "name": "Marinated Butterflied Leg of Lamb",
                "price": "$31.99/lb"
            }
        ]
    },
    {
        "id": "veal",
        "label": "Veal",
        "sub": "Prime Cut-to-Order Veal & Stock Bones",
        "emoji": "🥩",
        "icon": "/icons/veal.svg",
        "items": [
            {
                "name": "Ground Veal",
                "price": "$16.99/lb"
            },
            {
                "name": "Veal Bones",
                "price": "$7.99/lb"
            },
            {
                "name": "Veal Chop",
                "price": "$32.99/lb",
                "desc": "Our standard bone-in loin chops are 1\" and weigh .75lb to 1lb each. Order by the number of chops and final weight will be calculated at pick up."
            },
            {
                "name": "Veal Scallopini",
                "price": "$39.99/lb"
            }
        ]
    },
    {
        "id": "sausage",
        "label": "Sausage",
        "sub": "All handmade, in-house.",
        "emoji": "🌭",
        "icon": "/icons/suage.svg",
        "items": [
            {
                "name": "Bangers",
                "price": "$11.99/lb",
                "desc": "Bread crumbs create the iconic pop that give the British sausage its name. Sold frozen in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Fresh (and Freshly Frozen) Sausage"
                ]
            },
            {
                "name": "Best In Show",
                "price": "$12.99/lb",
                "desc": "The Bacon-Jalapeno-Cheddar Cheeseburger Sausage won us BaconFest at Wagner Farms for a good reason. Best paired with Bacon Fat Dijonaisse and our House Pickles. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Fresh (and Freshly Frozen) Sausage"
                ]
            },
            {
                "name": "Blue Cheese Steakhouse Sausage",
                "price": "$12.99/lb",
                "desc": "All the best flavors of a black + blue steak or burger-in sausage form. Sold frozen in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Fresh (and Freshly Frozen) Sausage"
                ]
            },
            {
                "name": "Chicken Italian Sausage",
                "price": "$12.99/lb",
                "desc": "All the classic Italian sausage flavors including fennel. Sold frozen in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Fresh (and Freshly Frozen) Sausage"
                ]
            },
            {
                "name": "Fresh Breakfast Sausage",
                "price": "$10.99/lb",
                "desc": "Classic breakfast sausage. Sold frozen in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Fresh (and Freshly Frozen) Sausage"
                ]
            },
            {
                "name": "Merquez Sausage",
                "price": "$12.99/lb",
                "desc": "This Moroccan lamb sausage features roasted red peppers and fresh garlic. Sold frozen in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Fresh (and Freshly Frozen) Sausage"
                ]
            },
            {
                "name": "Mexican Chorizo",
                "price": "$9.99/lb",
                "desc": "This ground sausage incorporates chiles and red wine. It Is sold frozen in 1-lb packages.",
                "tags": [
                    "Fresh (and Freshly Frozen) Sausage"
                ]
            },
            {
                "name": "Peking Duck Sausage",
                "price": "$14.99/lb",
                "desc": "This unique sausage combines ground duck with Hoisin sauce and green onions. Sold frozen in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Fresh (and Freshly Frozen) Sausage"
                ]
            },
            {
                "name": "Philly Cheesesteak Sausage",
                "price": "$12.99/lb",
                "desc": "Everything in a Philly Cheesesteak, but in sausage form! Includes beef, Swiss cheese, green pepper, and all the flavor you could imagine. Sold frozen in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Fresh (and Freshly Frozen) Sausage"
                ]
            },
            {
                "name": "Sheboygan Bratwurst",
                "price": "$10.99/lb",
                "desc": "THE Brat. When you think \"brat\", this is it. Please indicate how many packs of four sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Fresh (and Freshly Frozen) Sausage"
                ]
            },
            {
                "name": "Sweet Italian Sausage",
                "price": "$10.99/lb",
                "desc": "All the classic flavors including fennel. Sold in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Fresh (and Freshly Frozen) Sausage"
                ]
            },
            {
                "name": "Toulouse",
                "price": "$12.99/lb",
                "desc": "This French garlic and wine sausage is the perfect addition to Cassoulet or a pasta dish. Sold frozen in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Fresh (and Freshly Frozen) Sausage"
                ]
            },
            {
                "name": "Smoked Cheddar Bratwurst",
                "price": "$12.99/lb",
                "desc": "These smoked sausages are loaded with chunks of cheddar cheese. Sold in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Smoked Sausages"
                ]
            },
            {
                "name": "Smoked Cherry Cheddar Brats",
                "price": "$13.99/lb",
                "desc": "These smoked sausages are loaded with chunks of cheddar cheese and dried Door County Cherries. Our most popular sausage for a good reason! Sold in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Smoked Sausages"
                ]
            },
            {
                "name": "Smoked Jalapeño Cheddar Brat",
                "price": "$13.99/lb",
                "desc": "These smoked sausages are loaded with chunks of cheddar cheese and diced jalapeños. Sold in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Smoked Sausages"
                ]
            },
            {
                "name": "Smokefield Bratwurst",
                "price": "$11.99/lb",
                "desc": "Our take on the best smoked brat. It is loaded with traditional flavors, plus a hint of others. Sold in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Smoked Sausages"
                ]
            },
            {
                "name": "Thuringer Sausage",
                "price": "$9.99/lb",
                "desc": "This all-beef, smoked German sausage is loaded with fresh garlic. The long links are sold in packs of 2. Indicate how many packs of 2 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Smoked Sausages"
                ]
            },
            {
                "name": "Polish Kielbasa",
                "price": "$12.99/lb",
                "desc": "This traditional village sausage is smoked and loaded with fresh garlic. The long links are sold in packs of 2. Indicate how many packs of 2 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Smoked Sausages"
                ]
            },
            {
                "name": "Chicago Hot Links",
                "price": "$10.99/lb",
                "desc": "Smoked Chicago BBQ Speciality. Ours are made with beef and are best served with BBQ Sauce or Mild Sauce. Sold in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Smoked Sausages"
                ]
            },
            {
                "name": "Turkey Maxwell",
                "price": "$12.99/lb",
                "desc": "Garlicky, Smoked Turkey Sausages. Served at our neighbor's - UDawgU! Sold in packs of 6. Indicate how many packs of 6 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Smoked Sausages"
                ]
            },
            {
                "name": "Smoked Breakfast Sausage",
                "price": "$12.99/lb",
                "desc": "Our fresh breakfast sausage after its hit the smoker. Sold in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Smoked Sausages"
                ]
            },
            {
                "name": "Andouille Sausage",
                "price": "$11.99/lb",
                "desc": "This classic smoked sausage is made with beef and is the perfect addition to gumbo or red beans. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Smoked Sausages"
                ]
            },
            {
                "name": "Colombian Chorizo",
                "price": "$11.99/lb",
                "desc": "This incredibly flavorful smoked sausage includes green onions, cilantro, + beer. Best served with a squeeze of lime on top. Sold in packs of 4. Indicate how many packs of 4 sausages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Smoked Sausages"
                ]
            },
            {
                "name": "Vienna Natural Casing Hot Dog",
                "price": "$13.99/lb",
                "desc": "Best for a Chicago Dog that delivers the snap! Indicate how many packs of 6 hot dogs and the final weight will be adjusted at pick up.",
                "tags": [
                    "Cooked Sausages"
                ]
            },
            {
                "name": "Vienna Skinless Hot Dog",
                "price": "$11.99/lb",
                "desc": "Classic all-beef hot dog. 8/1 size. Sold in packs of 8. Indicate how many packs and the final weight will be adjusted at pick up.",
                "tags": [
                    "Cooked Sausages"
                ]
            },
            {
                "name": "Dried Spanish Chorizo",
                "price": "$19.99/lb",
                "desc": "Great for Paella, beans, and snacking. Sold in 1/2 pound packages. Indicate how many packages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Dried Sausages"
                ]
            },
            {
                "name": "Dried Polish Sausage",
                "price": "$19.99/lb",
                "desc": "Great for snacking and charcuterie boards. Sold in 1/2 pound packages. Indicate how many packages and the final weight will be adjusted at pick up.",
                "tags": [
                    "Dried Sausages"
                ]
            }
        ]
    },
    {
        "id": "prepared",
        "label": "Prepared Foods",
        "sub": "Housemade Meals, Sides, Jerky & Snack Sticks",
        "emoji": "🍲",
        "icon": "/icons/prepared.svg",
        "items": [
            {
                "name": "Collard Greens",
                "price": "$16.99",
                "desc": "Frozen in 2lb tins for easy reheating"
            },
            {
                "name": "HMTaCo. Meat",
                "price": "$16.99"
            },
            {
                "name": "Large Baked Beans",
                "price": "$16.99",
                "desc": "Frozen in 2lb Trays - Ready to Heat and Serve"
            },
            {
                "name": "Large Chicken Pot Pie",
                "price": "$22.99"
            },
            {
                "name": "Potato Salad",
                "price": "$9.99/lb",
                "desc": "Order by the lb"
            },
            {
                "name": "Pulled Pork",
                "price": "$14.99"
            },
            {
                "name": "Rib Tips with Mild Sauce",
                "price": "$14.99"
            },
            {
                "name": "Rotisserie Chicken",
                "price": "$22.99",
                "desc": "Rotisserie Chicken with Roasted Potatoes - Serves 3-4 (4HR NOTICE)",
                "tags": [
                    "4HR NOTICE"
                ]
            },
            {
                "name": "Sloppy Joes",
                "price": "$14.99"
            },
            {
                "name": "Supreme Beef Tamale",
                "price": "$2.00"
            },
            {
                "name": "BBQ Pulled Chicken -Pint",
                "price": "$14.99"
            },
            {
                "name": "Maque Choux ~ Smokey Corn and Bacon",
                "price": "$9.99",
                "desc": "Smokey Sweet Corn and Bacon Side Dish with Talking Farm Peppers and Hatch Chiles. Sold in 1lb Frozen Trays"
            },
            {
                "name": "Pork Tamale",
                "price": "$3.50"
            },
            {
                "name": "Citrus Marinated Olives",
                "price": "$19.99/lb",
                "desc": "Sold in 8oz Containers - Infused with Fresh Citrus Zest, Rosemary, and Peppers"
            },
            {
                "name": "Roasted Lion's Mane Mushrooms",
                "price": "$12.99"
            },
            {
                "name": "Smoked Andouille and Cornbread Stuffing",
                "price": "$22.00",
                "desc": "1 quart of our house made stuffing - serves 4-6 people. (NOV 24 - 25)",
                "tags": [
                    "NOV 24 - 25"
                ]
            },
            {
                "name": "Cranberry Sauce",
                "price": "$12.99",
                "desc": "8 ounce container of our house made, citrus spiked Cranberry Sauce - serves 4"
            },
            {
                "name": "Glazed Spiral-Sliced Ham",
                "price": "$100.00",
                "desc": "Ready to heat and enjoy! 10-12lb each and serves 10+ adults. (NOV 24 - 25)",
                "tags": [
                    "NOV 24 - 25"
                ]
            },
            {
                "name": "Red Beans and Rice",
                "price": "$18.99"
            },
            {
                "name": "Green Bean Casserole",
                "price": "$22.99",
                "desc": "Frozen in 2lb Foil Containers - Ready to Heat"
            },
            {
                "name": "Bacon-Wrapped Chorizo Stuffed Dates, 1 Dozen",
                "price": "$24.99"
            },
            {
                "name": "Stuffed Melrose Peppers",
                "price": "$12.00",
                "desc": "Sold in packages of 6 ready to cook from frozen. The perfect app or main dish!"
            },
            {
                "name": "Spicy Stuffed Melrose Peppers",
                "price": "$12.00",
                "desc": "Sold in packages of 6 ready to cook from frozen. The perfect app or main dish!"
            },
            {
                "name": "Small Queso Fundito",
                "price": "$10.99"
            },
            {
                "name": "Large Queso Fundito",
                "price": "$16.99"
            },
            {
                "name": "Italian Meatballs",
                "price": "$18.99/lb"
            },
            {
                "name": "Roasted Eggplant Caponata",
                "price": "$9.99"
            },
            {
                "name": "Bolognese Sauce",
                "price": "$15.99"
            },
            {
                "name": "Beef Jerky",
                "price": "$28.99/lb",
                "tags": [
                    "Housemade Beef Jerky + Snack Sticks"
                ]
            },
            {
                "name": "Maple Jalapeño Jerky",
                "price": "$28.99/lb",
                "tags": [
                    "Housemade Beef Jerky + Snack Sticks"
                ]
            },
            {
                "name": "Teriyaki Beef Jerky",
                "price": "$28.99/lb",
                "tags": [
                    "Housemade Beef Jerky + Snack Sticks"
                ]
            },
            {
                "name": "Single Slim Jim",
                "price": "$2.00",
                "tags": [
                    "Housemade Beef Jerky + Snack Sticks"
                ]
            },
            {
                "name": "Single Spicy Slim Jim",
                "price": "$2.00",
                "tags": [
                    "Housemade Beef Jerky + Snack Sticks"
                ]
            }
        ]
    },
    {
        "id": "soups-stocks",
        "label": "Soups and Stocks",
        "sub": "Housemade Rotating Soups & Two-Day Scratch Stocks",
        "emoji": "🥣",
        "icon": "/icons/stocksoup.svg",
        "items": [
            {
                "name": "Brunswick Stew",
                "price": "$16.99",
                "desc": "BBQ Stew loaded with Brisket, Pulled Pork, Green Beans, Tomatoes, Potatoes and Corn",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Chicken and Rice Soup",
                "price": "$14.99",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Chicken Tortilla Soup",
                "price": "$16.99",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Chili",
                "price": "$14.99",
                "desc": "Traditional (and tasty!) Chili with Ground Beef and Beans",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Chicken Noodle Soup",
                "price": "$14.99",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Curried Snapper Stew",
                "price": "$14.99",
                "desc": "**Rich and Deeply-Flavored Stock is Complemented by Chunks of Tender Snapper",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Gazpacho",
                "price": "$10.99",
                "desc": "**Heirloom Tomatoes are balanced with just the right amount of jalapeño heat, citrus, and cucumber",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Italian Wedding Soup",
                "price": "$16.99",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Minestrone",
                "price": "$14.99",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "New England Clam Chowder",
                "price": "$18.99",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Pork Hatch Chili Verde",
                "price": "$14.99",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Posole Rojo",
                "price": "$14.99",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Ribolitta",
                "price": "$14.99",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Shrimp and Tasso Ham Gumbo",
                "price": "$18.99",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Southwestern Chicken Corn Chowder",
                "price": "$16.99",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Turkey and Andouille Gumbo",
                "price": "$18.99",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Beef Ya-Ka-Mein",
                "price": "$16.99",
                "desc": "We recreated a NOLA classic with noodles, chunks of tender beef, and a rich broth.... \"Old Sober\"",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Chicago Bullabaisse",
                "price": "$14.99",
                "desc": "**Rich broth with chunks of shrimp and halibut",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Guiness Beef Stew",
                "price": "$18.99",
                "tags": [
                    "Soups and Stews"
                ]
            },
            {
                "name": "Beef Stock",
                "price": "$10.99",
                "tags": [
                    "Stocks"
                ]
            },
            {
                "name": "Chicken Stock",
                "price": "$10.99",
                "tags": [
                    "Stocks"
                ]
            },
            {
                "name": "Duck Stock",
                "price": "$10.99",
                "tags": [
                    "Stocks"
                ]
            },
            {
                "name": "Turkey Stock",
                "price": "$11.99",
                "desc": "Housemade and sold by the Quart.",
                "tags": [
                    "Stocks"
                ]
            },
            {
                "name": "Veal Stock",
                "price": "$10.99",
                "tags": [
                    "Stocks"
                ]
            },
            {
                "name": "Vegetable Stock",
                "price": "$10.99",
                "tags": [
                    "Stocks"
                ]
            },
            {
                "name": "Roasted Chicken Bone Broth",
                "price": "$12.99",
                "tags": [
                    "Stocks"
                ]
            }
        ]
    },
    {
        "id": "deli",
        "label": "Deli Meat and Cheese",
        "sub": "House-Cured Meats, Sliced-to-Order Cheese & Fresh Salads",
        "emoji": "🧀",
        "icon": "/icons/hamcheese.svg",
        "items": [
            {
                "name": "Deli Kraut",
                "price": "$6.99/lb",
                "desc": "Traditional deli kraut sold by the lb.",
                "tags": [
                    "Deli"
                ]
            },
            {
                "name": "House Pickles",
                "price": "$8.99",
                "desc": "Jalapeño, Garlic, Dill. Perfect on their own or as a condiment.",
                "tags": [
                    "Deli"
                ]
            },
            {
                "name": "Tasso Ham",
                "price": "$16.99/lb",
                "tags": [
                    "Deli"
                ]
            },
            {
                "name": "Bacon",
                "price": "$14.99/lb",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Smoked Turkey",
                "price": "$17.99/lb",
                "desc": "House smoked, Ferndale turkey.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Prosciutto di Parma",
                "price": "$28.99/lb",
                "desc": "Real deal Prosciutto di Parma. It makes the difference. Sliced thin unless otherwise specified.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Tavern Ham",
                "price": "$18.99/lb",
                "desc": "House cured and smoked. Best sliced thin and put directly onto a big 'ol ham and cheese.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Hot Pastrami",
                "price": "$18.99/lb",
                "desc": "House smoked and sliced thin for the perfect deli-style sandwich.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Mortadella",
                "price": "$19.99/lb",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Hard Salami",
                "price": "$14.99/lb",
                "desc": "The ideal sandwich salami. Kid approved.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Braseola",
                "price": "$30.99/lb",
                "desc": "Red wine cured eye of round. Cured in house and sliced thin.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Corned Beef",
                "price": "$17.99/lb",
                "desc": "HMCo. standard, sliced thin for the perfect sandwich.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Dodge City Salami",
                "price": "$29.99/lb",
                "desc": "Smoking Goose makes a killer salami with fennel pollen + pink peppercorns. Sliced thin for tasty perfection.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Housemade Coppa",
                "price": "$33.99/lb",
                "desc": "This meat \"candy\" has insane depth of flavor.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Pancetta",
                "price": "$20.99/lb",
                "desc": "Made in house and best diced up with vegetables or in pasta.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Canadian Bacon",
                "price": "$16.99/lb",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Genoa Salami",
                "price": "$16.99/lb",
                "desc": "Classic salami with all the right funk. Perfect for charcuterie platters and sandwiches, alike.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Serrano Ham",
                "price": "$32.99/lb",
                "desc": "Spanish perfection in thin slices of Jamon. Imported.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Hot Sopressata",
                "price": "$28.99/lb",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Pepperoni",
                "price": "$19.99/lb",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Liver Sausage",
                "price": "$10.99/lb",
                "desc": "Usinger's does it best and we are ready to slice you a chunk.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Taylor Pork Roll",
                "price": "$18.99/lb",
                "desc": "OR Taylor Ham or Pork Roll or IYKYK.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "Guanciale",
                "price": "$30.99/lb",
                "desc": "House cured pork jowl. Perfect for chunking and adding to pasta dishes.",
                "tags": [
                    "Meat"
                ]
            },
            {
                "name": "New School American Cheese",
                "price": "$11.99/lb",
                "tags": [
                    "Cheese"
                ]
            },
            {
                "name": "Cooper's Sharp White American Cheese",
                "price": "$19.99/lb",
                "desc": "A Philly Cheese standard, now available at your local butcher.",
                "tags": [
                    "Cheese"
                ]
            },
            {
                "name": "White Cheddar",
                "price": "$16.99/lb",
                "desc": "Sharp white cheddar. Great for sandwiches and charcuterie.",
                "tags": [
                    "Cheese"
                ]
            },
            {
                "name": "Organic Cheddar",
                "price": "$16.99/lb",
                "tags": [
                    "Cheese"
                ]
            },
            {
                "name": "Provolone Cheese",
                "price": "$16.99/lb",
                "tags": [
                    "Cheese"
                ]
            },
            {
                "name": "Organic Swiss",
                "price": "$16.99/lb",
                "tags": [
                    "Cheese"
                ]
            },
            {
                "name": "Dill Havarti Cheese",
                "price": "$16.99/lb",
                "desc": "Fresh dill flavor makes this a favorite for charcuterie boards.",
                "tags": [
                    "Cheese"
                ]
            },
            {
                "name": "Organic Muenster",
                "price": "$16.99/lb",
                "tags": [
                    "Cheese"
                ]
            },
            {
                "name": "Deli Pimento Mac N Cheese",
                "price": "$9.99/lb",
                "tags": [
                    "Salads"
                ]
            },
            {
                "name": "Chicken Salad",
                "price": "$14.99/lb",
                "desc": "Our chicken salad is made with fresh tarragon, parsley, celery, and citrus to create a light and tasty bite.",
                "tags": [
                    "Salads"
                ]
            }
        ]
    },
    {
        "id": "pantry",
        "label": "Pantry and More",
        "sub": "BBQ Sauces, Rubs, Hot Sauces, Condiments, Snacks & Staples",
        "emoji": "🥫",
        "icon": "/icons/pantry.svg",
        "items": [
            {
                "name": "Two Fat Guys Mild Barbecue Sauce",
                "price": "$7.99",
                "desc": "Two Fat Guys Mild Barbecue Sauce is a tasty sauce that adds a comforting smoky flavor to your grilled dishes without too much heat. It's perfect for those who enjoy a classic barbecue taste with a subtle, mellow kick.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "HMCo. BBQ Rub",
                "price": "$9.99",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Lillies's Q Carolina BBQ Sauce",
                "price": "$11.99",
                "desc": "Lillie's Q Carolina BBQ Sauce is a tangy blend that brings a taste of traditional Carolina barbecue to your meals. It's perfect for adding a zesty kick to pulled pork, chicken, or ribs.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Open Pit Original BBQ Sauce",
                "price": "$5.99",
                "desc": "Open Pit Blue Label Original BBQ Sauce is a classic grilling staple with a bold and tangy flavor. This 18-ounce bottle is perfect for slathering on ribs, chicken, or any other barbecue favorite.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Two Fat Guys Cherry BBQ",
                "price": "$7.99",
                "desc": "Two Fat Guys Cherry BBQ is a barbecue sauce that combines rich, smoky flavors with a hint of cherry sweetness.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Lillie's Q Smoky BBQ Sauce",
                "price": "$11.99",
                "desc": "Lillie's Q Smoky BBQ Sauce is a rich, flavorful barbecue sauce with a hint of smokiness that perfectly complements grilled meats. It's great for adding a savory kick to your burgers, ribs, or chicken wings.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Lillie's Q Zero Sugar Smoky BBQ Sauce",
                "price": "$11.99",
                "desc": "Lillie's Q Zero Sugar Smoky BBQ Sauce is a flavorful barbecue sauce that brings a rich, smoky taste without the added sugar. It's a great option for those who want to enjoy a classic barbecue flavor while keeping their sugar intake in check.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "17th St. Apple City Red BBQ Sauce",
                "price": "$9.99",
                "desc": "Apple City Red BBQ Sauce combines the tangy sweetness of apples with a hint of smokiness for a unique barbecue experience. It's perfect for glazing meats or adding a flavorful kick to your favorite dishes.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "HMCo. Yardbird Rub",
                "price": "$9.99",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Lillie’s Q Creole Dirt All-Purpose Rub",
                "price": "$11.99",
                "desc": "Lillie’s Q Creole Dirt All-Purpose Rub is a versatile dry seasoning perfect for adding a kick to seafood, blackened fish, and more. This 6 oz blend captures the flavors of Creole cooking, making it a great addition to your spice collection.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Lillie's Q Hot Smoky Barbecue Sauce",
                "price": "$11.99",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Two Fat Guys Mustard Barbecue Sauce",
                "price": "$7.99",
                "desc": "Two Fat Guys' Mustard Barbecue Sauce is a tasty sauce that's great for adding flavor to your grilled dishes. Whether you're marinating ribs or brushing it on chicken, it offers a delicious balance of sweet and smoky flavors.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Two Fat Guys Spicy Barbecue Sauce",
                "price": "$7.99",
                "desc": "Two Fat Guys Spicy Barbecue Sauce is a flavorful sauce that adds a kick to your grilled meats and veggies. It's perfect for anyone who loves a bit of spice with their barbecue.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Two Fat Guys Smoky Barbecue Sauce",
                "price": "$7.99",
                "desc": "Two Fat Guys Smoky Barbecue Sauce is a savory blend that adds a rich, smoky flavor to your grilled meats and veggies. Perfect for barbecues or as a marinade, it brings a delicious twist to any meal.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "17th Street Little Kick Barbecue Sauce",
                "price": "$9.99",
                "desc": "17th Street Little Kick Barbecue Sauce is a flavor-packed sauce with a hint of spice, perfect for adding a little extra zest to your grilled favorites. It's great for marinating meats or using as a dipping sauce for a smoky, slightly spicy kick.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Lillie's Q ENC Barbecue Sauce",
                "price": "$11.99",
                "desc": "Lillie's Q ENC Barbecue Sauce is a tangy and vinegar-forward sauce inspired by Eastern North Carolina barbecue traditions. It pairs perfectly with pulled pork, chicken, or as a zesty addition to your favorite dishes.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Lillie's Q Ivory BBQ Sauce",
                "price": "$11.99",
                "desc": "Lillie's Q Ivory BBQ Sauce is a tangy and creamy white barbecue sauce, inspired by Northern Alabama flavors. It's perfect for adding a unique twist to your grilled chicken or pork dishes.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "HMCo. Steak Blend",
                "price": "$9.99",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Spice House Great North Maple Garlic",
                "price": "$10.99",
                "desc": "Spice House Great North Maple Garlic is a flavorful blend that combines the rich sweetness of maple with the savory taste of garlic. It's perfect for adding a unique twist to meats, vegetables, and even roasted nuts. We love it on pork chops!",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Spice House Back Of The Yards",
                "price": "$10.99",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Spice House Lakeshore Shallot & Herb Seasoning",
                "price": "$10.99",
                "desc": "Spice House Lakeshore Shallot & Herb Seasoning is a versatile blend that adds a savory touch to your dishes with a mix of shallots and herbs. It's perfect for enhancing the flavor of meats, vegetables, or any recipe that could use a little extra zest.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Lillies Q Q-Rub",
                "price": "$11.99",
                "desc": "Lillie's Q Q-Rub is a versatile seasoning blend that adds a flavorful kick to your favorite meats and dishes. Perfect for grilling or roasting, it's a great way to enhance the taste of your meals with a hint of spice.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Spice House Steakhouse Smoke Seasoning",
                "price": "$10.99",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "The Spice House Jamaican Jerk Seasoning",
                "price": "$10.99",
                "desc": "The Spice House Jamaican Jerk Seasoning is a flavorful blend that brings a taste of the Caribbean to your kitchen.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Bourbon Barrel Bourbon Smoked Sea Salt",
                "price": "$10.00",
                "desc": "Bourbon Barrel Bourbon Smoked Sea Salt is a unique seasoning crafted by smoking sea salt with bourbon barrel wood. It adds a smoky, rich flavor to dishes, enhancing everything from grilled meats to roasted vegetables.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Maldon Sea Salt",
                "price": "$9.99",
                "desc": "Maldon Sea Salt is renowned for its distinctive flaky texture and pure, clean taste, making it a favorite among chefs and home cooks alike.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Cleetus Heatus Rim Dust",
                "price": "$10.99",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Spice House Brisket Of Love",
                "price": "$10.99",
                "desc": "The \"Spice House Brisket Of Love\" is a flavorful seasoning blend designed to enhance the taste of your brisket. Perfect for barbecue enthusiasts, this mix adds a savory kick to your meat dishes.",
                "tags": [
                    "BBQ Sauces and Rubs"
                ]
            },
            {
                "name": "Ouilmette Spice Haba Mango Tango Hot Sauce",
                "price": "$10.99",
                "tags": [
                    "Hot Sauces"
                ]
            },
            {
                "name": "Soothsayer Chicago Pizza Summit Hot Sauce",
                "price": "$11.99",
                "desc": "Spicy Tomato Hot Sauce",
                "tags": [
                    "Hot Sauces"
                ]
            },
            {
                "name": "Soothsayer 100% Girl Tears Hot Sauce",
                "price": "$11.99",
                "desc": "Tangy Sweet Potato and Habanero Combination.",
                "tags": [
                    "Hot Sauces"
                ]
            },
            {
                "name": "Soothsayer Malort Face Hot Sauce",
                "price": "$11.99",
                "tags": [
                    "Hot Sauces"
                ]
            },
            {
                "name": "SHUUG Zhoug Hot Sauce",
                "price": "$11.99",
                "desc": "The Shuug Original Zhoug Hot Sauce is filled with a unique blend of spices that delivers an authentic Middle Eastern kick. Perfect for adding a spicy twist to your favorite dishes, it offers an aromatic heat that fans of zhoug will love.",
                "tags": [
                    "Hot Sauces"
                ]
            },
            {
                "name": "Soothsayer No Brainer (Dill Pickle) Hot Sauce",
                "price": "$11.99",
                "tags": [
                    "Hot Sauces"
                ]
            },
            {
                "name": "Soothsayer Let's Taco Bout It Hot Sauce",
                "price": "$11.99",
                "desc": "Inspired by famous flavors of Birrieria Zaragoza.",
                "tags": [
                    "Hot Sauces"
                ]
            },
            {
                "name": "Ouilmette Spice Company Electric Lime Hot Sauce",
                "price": "$10.99",
                "tags": [
                    "Hot Sauces"
                ]
            },
            {
                "name": "Cleetus Heatus Roasted Red Chile Hot Sauce",
                "price": "$7.99",
                "desc": "Great for tacos, eggs, or anything that needs a flavorful heat boost.",
                "tags": [
                    "Hot Sauces"
                ]
            },
            {
                "name": "Bacon Fat Dijonaisse",
                "price": "$10.99",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Black Garlic Sauce",
                "price": "$14.99",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "BLiS Barrel Aged Fish Sauce",
                "price": "$29.99",
                "desc": "BLiS Barrel Aged Fish Sauce is a unique seasoning that brings a rich umami flavor to your dishes. Aged in barrels, it offers a complex taste that can enhance everything from stir-fries to marinades.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Blis Steak Sauce",
                "price": "$14.99",
                "desc": "Blis Steak Sauce is a savory sauce designed to enhance the flavor of your steaks with a rich, nuanced taste.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Bok Bok Everything Sauce",
                "price": "$13.95",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Big Fork Brands",
                "price": "$9.99",
                "desc": "Original Chicago Fire Sauce is a flavorful blend that adds a spicy kick to your meals, perfect for those who enjoy a bit of heat. Just drizzle it over your favorite dishes to elevate their taste with a fiery touch.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Enzo Crushed Lemon Olive Oil",
                "price": "$22.99",
                "desc": "Enzo Crushed Lemon Olive Oil blends premium olives with fresh lemons during the crushing process, creating a zesty and aromatic flavor.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Enzo Trebbiano Vinegar",
                "price": "$22.99",
                "desc": "Enzo Trebbiano Vinegar is a tangy and versatile vinegar made from Trebbiano grapes, offering a rich, mild flavor that complements a wide range of dishes. It's perfect for salad dressings, marinades, or adding a splash to sautéed vegetables for a little extra zest.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Gochujang Chili Paste",
                "price": "$11.99",
                "desc": "Gochujang Chili Paste is a spicy and savory Korean condiment made from fermented soybeans, red chili peppers, and sticky rice.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Inglehoffer Stone Ground Mustard",
                "price": "$8.99",
                "desc": "Inglehoffer Stone Ground Mustard is a tangy and robust mustard made with whole mustard seeds for added texture and flavor. It's perfect for adding a spicy kick to sandwiches, sausages, and your favorite recipes.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "JR Kelly Horseradish Mustard",
                "price": "$7.99",
                "desc": "JR Kelly Horseradish Mustard is a flavorful condiment that combines the tangy taste of mustard with the spicy kick of horseradish. It's perfect for adding a bit of zest to your sandwiches, burgers, or pretzels.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "JR Kelly Horseradish Sauce",
                "price": "$7.99",
                "desc": "JR Kelly Horseradish Sauce adds a bold kick to your favorite dishes with its tangy and spicy flavor. It's perfect for sandwiches, marinades, or as a zesty dip alongside meats and veggies.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "JR Kelly Prepared Horseradish",
                "price": "$7.99",
                "desc": "JR Kelly Prepared Horseradish is a zesty condiment that's great for adding a spicy kick to your meals. Use it to liven up sandwiches, sauces, or roast beef for an extra burst of flavor.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "JR Kelly Cocktail Sauce",
                "price": "$7.99",
                "desc": "JR Kelly Cocktail Sauce is a classic condiment perfect for adding a tangy kick to seafood dishes. It's great for pairing with shrimp cocktails, oysters, or any of your favorite seafood treats.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Kewpie Mayo",
                "price": "$12.99",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Localfolks Foods Stoneground Mustard",
                "price": "$6.99",
                "desc": "Localfolks Foods Stoneground Mustard is a flavorful mustard made with coarsely ground mustard seeds, adding a rich texture and taste to your sandwiches and dressings.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Mild Giardonnaise",
                "price": "$12.99",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Premium Flavored Oyster Sayce",
                "price": "$11.99",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Plochmans Classic Original Mild Yellow Mustard",
                "price": "$6.99",
                "desc": "Plochman's Classic Original Mild Yellow Mustard comes in a convenient 10.5 fl oz squeeze bottle, perfect for livening up your sandwiches and burgers. Its mild, tangy flavor adds just the right kick without being overpowering.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "St. Elmo Creamy Horseradish Sauce",
                "price": "$11.99",
                "desc": "St. Elmo Horseradish Creamy is a 12-ounce jar of smooth and tangy horseradish sauce that's perfect for adding a kick to your dishes. Use it as a flavorful condiment for sandwiches, seafood, or roasted meats.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "St. Elmo Cocktail Sauce",
                "price": "$10.99",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Vienna Beef Chicago Style Relish",
                "price": "$7.99",
                "desc": "Vienna Beef Chicago Style Relish is a tangy and flavorful condiment perfect for topping off hot dogs, sausages, and sandwiches.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Bonne Maman Jelly",
                "price": "$2.00",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Homer's Honeybee Creamed Honey",
                "price": "$11.99",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Homer's Honeybee Hot Honey",
                "price": "$13.99",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Malt Vinegar",
                "price": "$8.99",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Heinz Ketchup",
                "price": "$5.99",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Mini Tajin",
                "price": "$2.50",
                "desc": "The Mini Tajin is a compact version of the popular Mexican seasoning blend that combines chili peppers, lime, and salt. It's perfect for adding a tangy, spicy kick to fruits, vegetables, and snacks on the go.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Loveless Cafe Sorghum",
                "price": "$13.00",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Caramel Sauce with Bourbon Smoked Sea Salt & Bourbon",
                "price": "$12.00",
                "desc": "This caramel sauce blends creamy sweetness with a hint of smoky bourbon flavor, enhanced by the subtle crunch of bourbon smoked sea salt. It's perfect for drizzling over ice cream, pancakes, or adding a gourmet touch to your favorite desserts.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "St. Elmo Prepared Coarse-Cut Prepared Horseradish",
                "price": "$11.99",
                "desc": "St. Elmo's Prepared Coarse-Cut Horseradish is a bold and spicy condiment perfect for adding a kick to your dishes.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Tre Foglie Balsamic Vinegar, 100 ml",
                "price": "$14.99",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Tre Foglie Balsamic Vinegar, 250 ml",
                "price": "$18.99",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Aji Amarillo Sauce",
                "price": "$11.99",
                "desc": "Aji Amarillo Sauce is a flavorful condiment made from Peruvian yellow chili peppers, known for its bright and slightly fruity taste. It's a versatile addition to dishes, adding a mild heat and a hint of sweetness.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Homer's Honeybee Raw Honey",
                "price": "$14.99",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Bourbon Barrel Smoked Sugar",
                "price": "$10.00",
                "desc": "This is a 6-ounce tin of sugar that has been smoked with bourbon barrel wood, giving it a unique, smoky flavor. It's great for adding a rich twist to your baking or cocktails.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Vienna Beef Celery Salt Shaker",
                "price": "$6.99",
                "desc": "Vienna Celery Salt is a seasoning blend that combines the savory taste of salt with the unique flavor of celery seeds. It's an essential ingredient for a Chicago Dog!",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Vienna Beef Sport Peppers",
                "price": "$8.00",
                "desc": "Vienna Sport Peppers are tangy and spicy peppers that truly complete the Chicago Hot Dog",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Lowensenf Medium Mustard Tube",
                "price": "$8.99",
                "desc": "Lowensenf Medium Mustard comes in a convenient tube, making it easy to add just the right amount to your favorite meals. It's a classic mustard that's perfect for adding a bit of tangy flavor to sandwiches, sausages, or pretzels.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "A1 Original Steak Sauce",
                "price": "$14.99",
                "desc": "Classic steak sauce and pantry staple.",
                "tags": [
                    "Condiments"
                ]
            },
            {
                "name": "Great Lakes Original Potato Chips",
                "price": "$5.99",
                "desc": "Great Lakes Original Potato Chips are a classic snack made from quality potatoes and cooked to a satisfying crunch.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Great Lakes Large BBQ Chips",
                "price": "$5.99",
                "desc": "Great Lakes Potato Chips Kettle Chips in Barbeque flavor offer a satisfying crunch with a smoky and slightly sweet taste.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Great Lakes Wavvy Cut Potato Chips",
                "price": "$5.99",
                "desc": "Great Lakes Wavvy Cut Potato Chips are crispy, wavy-cut snacks that are perfect for dipping or enjoying on their own. Made from quality potatoes, they offer a satisfying crunch in every bite.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Great Lakes Sea Salt & Vinegar Potato Chips",
                "price": "$5.99",
                "desc": "Great Lakes Sea Salt & Vinegar Potato Chips are a crunchy snack with a tangy and savory kick.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Joe Chips Sour Cream and Toasted Onion",
                "price": "$4.99",
                "desc": "Joe Chips Sour Cream and Toasted Onion offer a tasty twist on the classic potato chip snack. They're packed with a savory blend of sour cream and onion flavors, perfect for satisfying your crunchy cravings.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Joe 5oz Sweet Potato Chips",
                "price": "$4.99",
                "desc": "Joe's Sweet Potato Chips are a crunchy and slightly sweet snack made from real sweet potatoes. This 5oz bag is perfect for sharing or enjoying on your own during a snack craving.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Zingerman's Dill-Icious Deli Pickle Chips",
                "price": "$5.99",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "400 HOT Degreez Chee Wees",
                "price": "$4.99",
                "desc": "400 Hot Degreez Chee Wees are a spicy and crunchy snack that's perfect for when you're craving a little heat.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Rustic Bakery Flatbread with Olive Oil & BaSel Gris",
                "price": "$7.99",
                "desc": "Rustic Bakery Flatbread with Olive Oil & Sel Gris offers a crispy texture that's perfect for snacking or pairing with your favorite dips. The blend of olive oil and sel gris adds a subtle touch of flavor to each bite.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Ritz Original Crackers",
                "price": "$6.99",
                "desc": "RITZ Original Crackers are a versatile snack that can be enjoyed by both kids and adults alike.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Elmer's New Orleans BBQ Chee-wee's",
                "price": "$3.99",
                "desc": "Elmer's New Orleans Chee-wee's are a crunchy snack with a unique BBQ flavor that's inspired by the tastes of New Orleans.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Fine Cheese Company Chive Evoo Crackers",
                "price": "$9.00",
                "desc": "Fine Cheese Company Chive Extra Virgin Olive Oil Crackers are a savory snack featuring the subtle flavors of chives and high-quality olive oil. They're perfect for pairing with your favorite cheeses or enjoying on their own as a tasty treat.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Herdez Ranchera Salsa",
                "price": "$4.99",
                "desc": "Herdez Ranchera Salsa is a flavorful blend of tomatoes, jalapeños, and spices, perfect for adding a mild kick to your favorite dishes. It's great for dipping chips or topping tacos and enchiladas.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Pop Daddy Mexican Street Corn Pretzels",
                "price": "$6.99",
                "desc": "These Pop Daddy pretzels bring the bold flavors of Mexican street corn to a crunchy snack. With a tasty blend of spices and a hint of lime, they make for a fun and flavorful treat.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Pop Daddy Yellow Mustard Pretzels",
                "price": "$6.99",
                "desc": "Pop Daddy Pretzels bring a zesty twist to snack time with their Yellow Mustard Pretzel Sticks.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Pop Daddy Smoked Gouda Pretzels",
                "price": "$6.99",
                "desc": "Pop Daddy Pretzels in Smoked Gouda flavor offer a deliciously cheesy twist on the classic snack.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Pop Daddy Dill Pickle Pretzels",
                "price": "$6.99",
                "desc": "Pop Daddy Dill Pickle Pretzel Sticks are crunchy snacks with a tangy dill pickle flavor.",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "32oz Mateo's Medium Salsa",
                "price": "$12.99",
                "tags": [
                    "Chips and Snacks"
                ]
            },
            {
                "name": "Camelli Dried Red Kidney Beans",
                "price": "$8.99",
                "desc": "Camellia Red Kidney Beans are the key ingredient in amazing red beans and rice.",
                "tags": [
                    "Pasta, Tortillas, + Grains"
                ]
            },
            {
                "name": "Sabinas Corn Tortillas",
                "price": "$1.25",
                "tags": [
                    "Pasta, Tortillas, + Grains"
                ]
            },
            {
                "name": "Tortello Trottole Fresh Pasta",
                "price": "$13.99",
                "tags": [
                    "Pasta, Tortillas, + Grains"
                ]
            },
            {
                "name": "Tortello Spaghetti Pasta",
                "price": "$13.99",
                "tags": [
                    "Pasta, Tortillas, + Grains"
                ]
            },
            {
                "name": "Tortello Bucatini Fresh Pasta",
                "price": "$13.99",
                "tags": [
                    "Pasta, Tortillas, + Grains"
                ]
            },
            {
                "name": "Barilla Orzo Pasta",
                "price": "$4.99",
                "desc": "Barilla's Classic Orzo Pasta is a versatile, rice-shaped pasta that's perfect for soups, salads, or a variety of main dishes.",
                "tags": [
                    "Pasta, Tortillas, + Grains"
                ]
            },
            {
                "name": "Flageolet Beans",
                "price": "$10.99",
                "tags": [
                    "Pasta, Tortillas, + Grains"
                ]
            },
            {
                "name": "Old El Paso Extra Large Super Stuffer Taco Shells",
                "price": "$4.99",
                "desc": "Old El Paso Extra Large Super Stuffer Taco Shells are designed to hold more of your favorite taco fillings without breaking.",
                "tags": [
                    "Pasta, Tortillas, + Grains"
                ]
            },
            {
                "name": "GOYA Organics Chick Peas",
                "price": "$3.99",
                "desc": "Goya Organics Chick Peas are a versatile and nutritious addition to your pantry, perfect for salads, stews, or homemade hummus.",
                "tags": [
                    "Pasta, Tortillas, + Grains"
                ]
            },
            {
                "name": "Rockwood 20lb Bag of Charcoal",
                "price": "$42.99",
                "tags": [
                    "Smoking Wood and Charcoal"
                ]
            },
            {
                "name": "Barrel Proof Bourbon Barrel Blocks Wood Chunks",
                "price": "$18.99",
                "desc": "Barrel Proof Bourbon Barrel Blocks Wood Chunks are pieces of wood repurposed from used bourbon barrels, perfect for adding a rich, smoky flavor to your grill or smoker. These chunks infuse a unique bourbon aroma into your meats or vegetables as they cook.",
                "tags": [
                    "Smoking Wood and Charcoal"
                ]
            },
            {
                "name": "Mojobricks Bar-B-Qubes Hickory",
                "price": "$10.99",
                "tags": [
                    "Smoking Wood and Charcoal"
                ]
            },
            {
                "name": "2 for $12 Firewood Bundle",
                "price": "$12.00",
                "desc": "Local firewood",
                "tags": [
                    "Smoking Wood and Charcoal"
                ]
            },
            {
                "name": "Rainbow Chip Pretty Cool Ice Cream Bar",
                "price": "$7.00",
                "tags": [
                    "Ice Cream + Desserts"
                ]
            },
            {
                "name": "Peanut Butter Potato Chip Pretty Cool Ice Cream Bar",
                "price": "$7.00",
                "tags": [
                    "Ice Cream + Desserts"
                ]
            },
            {
                "name": "Key Lime Pie Pretty Cool Ice Cream Bar",
                "price": "$7.00",
                "tags": [
                    "Ice Cream + Desserts"
                ]
            },
            {
                "name": "Small Mousse",
                "price": "$12.00",
                "tags": [
                    "Ice Cream + Desserts"
                ]
            },
            {
                "name": "Bianco DiNapoli Tomato Sauce",
                "price": "$4.99",
                "desc": "Bianco DiNapoli Tomato Sauce is a rich, flavorful sauce made from organic tomatoes. It's perfect for pasta dishes, pizzas, or as a base for your favorite homemade recipes.",
                "tags": [
                    "Tomatoes"
                ]
            },
            {
                "name": "Bianco DiNapoli Robusto Pizza Sauce",
                "price": "$5.99",
                "desc": "Organic tomatoes, onions, Mediterranean oregano, and cayenne pepper give this pizza sauce its robust flavor.",
                "tags": [
                    "Tomatoes"
                ]
            },
            {
                "name": "Bianco DiNapoli Tomato Juice",
                "price": "$5.99",
                "tags": [
                    "Tomatoes"
                ]
            },
            {
                "name": "Bianco DiNapoli Organic Fire Roasted Diced Tomatoes",
                "price": "$4.99",
                "desc": "These tomatoes are fire roasted to bring out a rich, smoky taste that pairs well with a wide variety of dishes.",
                "tags": [
                    "Tomatoes"
                ]
            },
            {
                "name": "Fahlstrom's Bloody Mary Mix",
                "price": "$11.99",
                "desc": "This local Bloody Mary mix is like no other and features clam juice and fresh horseradish for an extra zing!",
                "tags": [
                    "A Category of Its Own"
                ]
            },
            {
                "name": "Mother In Law's Napa Cabbage Kimchi",
                "price": "$11.99",
                "desc": "Mother In Law's Napa Cabbage Kimchi is a traditional Korean fermented dish made with Napa cabbage and a blend of spices. It's perfect for adding a tangy and spicy kick to your meals.",
                "tags": [
                    "A Category of Its Own"
                ]
            },
            {
                "name": "Kimchi Muu Daikon Radish",
                "price": "$11.99",
                "desc": "Kimchi Muu Daikon Radish is a crunchy, tangy Korean side dish made from fermented daikon radish. It's perfect for adding a spicy kick and probiotic benefits to your meals.",
                "tags": [
                    "A Category of Its Own"
                ]
            },
            {
                "name": "Hog Casing",
                "price": "$25.00",
                "desc": "Enough casing to make 25lb of sausage at home.",
                "tags": [
                    "A Category of Its Own"
                ]
            },
            {
                "name": "Brine Kit",
                "price": "$20.00",
                "desc": "The HMCo. Brine Kit includes brine seasoning, a brining bag, and simple instructions for brining a turkey at home.",
                "tags": [
                    "A Category of Its Own"
                ]
            },
            {
                "name": "TALO Beef Tallow",
                "price": "$19.95",
                "desc": "Talo Beef Tallow is a versatile cooking fat made from rendered beef fat. It's great for frying, sautéing, and adding depth of flavor to your dishes.",
                "tags": [
                    "A Category of Its Own"
                ]
            },
            {
                "name": "Organic Pumpkin",
                "price": "$4.00",
                "tags": [
                    "A Category of Its Own"
                ]
            },
            {
                "name": "Butcher's Pet Food Booster",
                "price": "$8.99/lb",
                "desc": "Loaded with nutritional organ meats, this raw pet food booster is perfect for adding to your dog or cat's dry food. Sold in frozen 1lb packages.",
                "tags": [
                    "A Category of Its Own"
                ]
            },
            {
                "name": "20lb Bagged Ice",
                "price": "$7.00",
                "tags": [
                    "A Category of Its Own"
                ]
            },
            {
                "name": "7lb Bagged Ice",
                "price": "$4.00",
                "tags": [
                    "A Category of Its Own"
                ]
            }
        ]
    },
    {
        "id": "dairy",
        "label": "Dairy, Eggs, and Cheese",
        "sub": "Local Dairy, Farm Eggs & Artisan Cheeses",
        "emoji": "🥚",
        "icon": "/icons/dairy.svg",
        "items": [
            {
                "name": "Grasslands Butter",
                "price": "$8.99"
            },
            {
                "name": "Kerrygold Butter",
                "price": "$10.99"
            },
            {
                "name": "LaClare Farms Goat Cheddar",
                "price": "$9.99",
                "desc": "Slice, shred, cube. This complex cheddar can be used in place of any traditional cheddar. It is great as an ingredient, but with enough legs to stand alone on any artisan cheese board."
            },
            {
                "name": "Point Reyes Blue Cheese",
                "price": "$9.99",
                "desc": "A wedge of the good stuff!"
            },
            {
                "name": "Small Pimento Cheese Dip",
                "price": "$10.99",
                "desc": "We are known for this classic Southern dip. Sold in 8oz Container"
            },
            {
                "name": "Brunkow Baked Cheese",
                "price": "$11.99"
            },
            {
                "name": "Hook's Pepper Jack Cheese",
                "price": "$9.99",
                "desc": "5oz Block of Hook's Pepper Jack"
            },
            {
                "name": "Rush Creek Reserve Cheese",
                "price": "$36.99"
            },
            {
                "name": "Smoked Gouda",
                "price": "$11.99"
            },
            {
                "name": "Caraway Cheddar",
                "price": "$11.99"
            },
            {
                "name": "Horseradish Cheddar",
                "price": "$11.99"
            },
            {
                "name": "Clarified Butter",
                "price": "$8.99",
                "desc": "8oz of Clarified Butter - Perfect for use in cooking and dipping a lobsta roll!"
            },
            {
                "name": "Dill Communication Cheese Dip",
                "price": "$12.00"
            },
            {
                "name": "Egg Nog",
                "price": "$9.99"
            }
        ]
    },
    {
        "id": "bread",
        "label": "Bread",
        "sub": "Delivered Fresh Daily from Turano Bread",
        "emoji": "🍞",
        "icon": "/icons/bread.svg",
        "items": [
            {
                "name": "Turano Brioche Rolls",
                "price": "$5.99",
                "desc": "Turano Brioche Rolls are soft, buttery rolls made with real butter, perfect for sandwiches or as a side for any meal."
            },
            {
                "name": "Deli Style Gluten Free Sourdough Sandwich Bread",
                "price": "$8.99"
            }
        ]
    },
    {
        "id": "produce",
        "label": "Produce",
        "sub": "Fresh Local Produce & Seasonal Herbs",
        "emoji": "🥬",
        "icon": "/icons/produce.svg",
        "items": [
            {
                "name": "Talking Farms Daikon Radish",
                "price": "$2.99/lb"
            },
            {
                "name": "Fresh Lime",
                "price": "$2.00"
            },
            {
                "name": "Fresh Garlic Head",
                "price": "$3.50"
            },
            {
                "name": "Fresh Lemon",
                "price": "$2.00"
            },
            {
                "name": "Fresh Shallot",
                "price": "$3.50"
            },
            {
                "name": "Fresh Red Potatoes",
                "price": "$2.99/lb"
            },
            {
                "name": "Fresh Orange",
                "price": "$2.00"
            },
            {
                "name": "Fresh Peppers",
                "price": "$3.99/lb"
            },
            {
                "name": "Fresh Cranberries",
                "price": "$4.50"
            }
        ]
    },
    {
        "id": "turkey",
        "label": "Turkey",
        "sub": "Ferndale Farms in Cannon Falls, MN",
        "emoji": "🦃",
        "icon": "/icons/turkey.svg",
        "items": [
            {
                "name": "Ferndale Turkey Burgers",
                "price": "$11.99/lb",
                "desc": "1/3lb Turkey Burger patties from our favorite turkey farm, Ferndale Market in Cannon Falls, MN. Indicate how many packs of three burgers you would like to order."
            },
            {
                "name": "Ground Turkey",
                "price": "$9.99/lb",
                "desc": "Ground turkey from our favorite turkey farm, Ferndale Market in Cannon Falls, MN. Indicate how many 1lb tubes you would like to order."
            },
            {
                "name": "Turkey Gravy",
                "price": "$12.99",
                "desc": "Housemade and sold by the Pint."
            },
            {
                "name": "Turkey Stock",
                "price": "$11.99",
                "desc": "Housemade and sold by the Quart."
            },
            {
                "name": "Turkey Giblets",
                "price": "$4.99",
                "desc": "Sold frozen by the lb."
            }
        ]
    },
    {
        "id": "duck",
        "label": "Duck",
        "sub": "Pekin Duck from Culver Duck Farm in Middlebury, IN",
        "emoji": "🦆",
        "icon": "/icons/duck.svg",
        "items": [
            {
                "name": "Duck Breast",
                "price": "$18.99/lb",
                "desc": "Two skin-on breast piece per frozen package. Please specify amount of packages and the final total will be adjusted at pick up."
            },
            {
                "name": "Duck Fat",
                "price": "$10.99",
                "desc": "Sold in 8oz frozen containers."
            },
            {
                "name": "Duck Legs",
                "price": "$14.99/lb",
                "desc": "Sold in frozen packages with two skin-on duck legs quarters."
            }
        ]
    },
    {
        "id": "game",
        "label": "Game",
        "sub": "Specialty Wild & Farmed Game Cuts",
        "emoji": "🦌",
        "icon": "/icons/game.svg",
        "items": [
            {
                "name": "Whole Rabbit",
                "price": "$24.99"
            }
        ]
    },
    {
        "id": "seafood",
        "label": "Seafood",
        "sub": "Fresh & Frozen Specialty Seafood Selections",
        "emoji": "🐟",
        "icon": "/icons/fish.svg",
        "items": [
            {
                "name": "Nova Scotia Lobster Tails",
                "price": "$42.99/lb"
            },
            {
                "name": "Salmon",
                "price": "$22.99/lb"
            },
            {
                "name": "Smoked Salmon",
                "price": "$25.99/lb"
            }
        ]
    },
    {
        "id": "catering",
        "label": "Catering",
        "sub": "Party Trays, Charcuterie & Group Packages",
        "emoji": "🍽️",
        "icon": "/icons/catering.svg",
        "items": [
            {
                "name": "Cooked Beef Tenderloin",
                "price": "$80.00/lb",
                "desc": "48HR NOTICE",
                "tags": [
                    "48HR NOTICE"
                ]
            },
            {
                "name": "BBQ Pulled Chicken",
                "price": "$22.99/lb",
                "desc": "Order by the lb for Reheating. Includes Pickles, BBQ Sauce, and Buns. (48HR NOTICE)",
                "tags": [
                    "48HR NOTICE"
                ]
            },
            {
                "name": "Small Charcuterie Tray",
                "price": "$65.00",
                "desc": "Serves 8-10 people - loaded with 4-5 artisanal meats, 2 cheeses, olives, pickles, sauce and crackers. (24HR NOTICE)",
                "tags": [
                    "24HR NOTICE"
                ]
            },
            {
                "name": "Chafer Set Up",
                "price": "$20.00"
            },
            {
                "name": "Coleslaw",
                "price": "$7.99/lb",
                "desc": "Order by the lb"
            },
            {
                "name": "Potato Salad",
                "price": "$9.99/lb",
                "desc": "Order by the lb"
            },
            {
                "name": "Deli Pimento Mac N Cheese",
                "price": "$9.99/lb"
            },
            {
                "name": "Roasted Potatoes",
                "price": "$8.99/lb"
            },
            {
                "name": "Large Charcuterie Tray",
                "price": "$150.00",
                "desc": "24HR NOTICE",
                "tags": [
                    "24HR NOTICE"
                ]
            }
        ]
    },
    {
        "id": "beverages",
        "label": "Cold Beverages",
        "sub": "Craft Sodas, Teas & Cold Refreshments",
        "emoji": "🥤",
        "icon": "/icons/coldbeverage.svg",
        "items": [
            {
                "name": "Filbert's Diet Root Beer",
                "price": "$2.00"
            },
            {
                "name": "Filbert's Regular Root Beer",
                "price": "$2.00"
            },
            {
                "name": "Filberts Pumpkin Root Beer",
                "price": "$2.00"
            },
            {
                "name": "Filberts Pumpkin Soda",
                "price": "$2.00"
            },
            {
                "name": "Canada Dry Ginger Ale",
                "price": "$2.00",
                "desc": "Canada Dry Ginger Ale is a classic carbonated drink known for its crisp and refreshing ginger flavor."
            },
            {
                "name": "Joe's Black Cherry Lemonade",
                "price": "$4.00",
                "desc": "Joe's Black Cherry Lemonade is a refreshing drink that combines the sweet taste of black cherries with a hint of zesty lemon. It's perfect for those who enjoy a fruity twist on a classic lemonade."
            },
            {
                "name": "Joe's Classic Lemonade",
                "price": "$4.00",
                "desc": "Joe's Classic Lemonade offers a refreshing citrus flavor that's perfect for quenching your thirst."
            },
            {
                "name": "Joe Tea Kiwi Strawberry Iced Tea",
                "price": "$4.00"
            },
            {
                "name": "Joe's Mango Lemonade",
                "price": "$4.00",
                "desc": "Joe's Mango Lemonade is a refreshing drink that blends the tropical sweetness of mango with the tangy zest of lemonade."
            },
            {
                "name": "Joe Tea Peach Iced Tea",
                "price": "$4.00",
                "desc": "Joe Tea Peach is a refreshing peach-flavored iced tea that's perfect for quenching your thirst."
            },
            {
                "name": "Joe Tea Raspberry Tea",
                "price": "$4.00",
                "desc": "Joe Tea RaspberryTea is a refreshing beverage that combines the natural sweetness of ripe raspberries with a hint of brewed tea."
            },
            {
                "name": "Nirvana Water",
                "price": "$1.50"
            },
            {
                "name": "Sparkle Ginger Water",
                "price": "$2.99"
            },
            {
                "name": "Wisco Pop Cherry Soda",
                "price": "$2.99"
            },
            {
                "name": "Wisco Pop Ginger Soda",
                "price": "$2.99"
            },
            {
                "name": "Coke",
                "price": "$2.00"
            },
            {
                "name": "Joe Tea Strawberry Lemonade Glass Bottle",
                "price": "$4.00"
            },
            {
                "name": "Sprite",
                "price": "$2.00"
            },
            {
                "name": "Gatorade",
                "price": "$3.00"
            }
        ]
    },
    {
        "id": "swag",
        "label": "Hofherr Meat Co. Swag",
        "sub": "Official Hofherr Meat Co. Gear & Merch",
        "emoji": "🧢",
        "icon": "/icons/swag.svg",
        "items": [
            {
                "name": "Hofherr Meat Co. Camo Hat",
                "price": "$40.00"
            },
            {
                "name": "Hofherr Meat Co. Grey \"60093\" Shirt - Small",
                "price": "$25.00"
            },
            {
                "name": "Hofherr Meat Co. Grey \"60093\" Shirt - Medium",
                "price": "$25.00"
            },
            {
                "name": "Hofherr Meat Co. Grey \"60093\" Shirt - Large",
                "price": "$25.00"
            },
            {
                "name": "Hofherr Meat Co. Grey \"60093\" Shirt - XL",
                "price": "$25.00"
            },
            {
                "name": "Hofherr Meat Co. Grey \"60093\" Shirt - XXL",
                "price": "$25.00"
            },
            {
                "name": "Hofherr Meat Co. Grey \"60093\" Shirt - XXXL",
                "price": "$25.00"
            }
        ]
    }
];
