import { defineQuery } from 'next-sanity';

/** Fetch all categories with their nested products for a given store */
export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && store == $store] | order(sortOrder asc) {
    "id": id,
    label,
    sub,
    emoji,
    "icon": icon.asset->url,
    "items": *[_type == "product" && references(^._id)] | order(sortOrder asc) {
      name,
      "desc": description,
      price,
      salePrice,
      "image": image.asset->url,
      stockStatus,
      stockQuantity,
      origin,
      grade,
      preparation,
      allergens,
      servingSize,
      cookingTip,
      isNew,
      isFeatured,
      "inStock": select(
        stockStatus == "out-of-stock" => false,
        defined(stockStatus) => true,
        inStock
      )
    }
  }
`);

/** Fetch all FAQs grouped by category */
export const FAQS_QUERY = defineQuery(`
  *[_type == "faq"] | order(sortOrder asc) {
    _id,
    question,
    answer,
    "faqCategory": faqCategory
  }
`);

/** Fetch all cut guide entries by animal */
export const CUT_GUIDE_QUERY = defineQuery(`
  *[_type == "cutGuide"] | order(sortOrder asc) {
    _id,
    name,
    animal,
    subcut,
    bestFor,
    cookingMethod,
    tip,
    "image": image.asset->url
  }
`);

/** Fetch all active specials */
export const SPECIALS_QUERY = defineQuery(`
  *[_type == "special" && isActive == true] | order(sortOrder asc) {
    _id,
    title,
    description,
    regularPrice,
    salePrice,
    savings,
    "image": image.asset->url,
    validFrom,
    validUntil,
    badge,
    "linkedProducts": linkedProducts[]->{ name, price }
  }
`);

/** Fetch all active catering packages */
export const CATERING_QUERY = defineQuery(`
  *[_type == "cateringPackage" && isActive == true] | order(sortOrder asc) {
    _id,
    name,
    description,
    servings,
    price,
    items,
    "image": image.asset->url,
    isPopular
  }
`);

/** Fetch site settings singleton */
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    shopName,
    phone,
    email,
    address,
    butcherHours,
    depotHours,
    instagram,
    facebook,
    yelp,
    googleMaps,
    announcement,
    announcementActive,
    announcementColor,
    seoTitle,
    seoDescription,
    "ogImage": ogImage.asset->url
  }
`);

/** Fetch BBQ menu items grouped by category */
export const BBQ_MENU_QUERY = defineQuery(`
  *[_type == "bbqMenuItem"] | order(sortOrder asc) {
    _id,
    name,
    category
  }
`);

/** Fetch BBQ pricing tiers */
export const BBQ_PRICING_QUERY = defineQuery(`
  *[_type == "bbqPricing"] | order(sortOrder asc) {
    _id,
    tier,
    title,
    subtitle,
    description,
    minimumOrder,
    priceLines,
    isFeatured
  }
`);

/** Fetch BBQ services (Beyond BBQ section) */
export const BBQ_SERVICES_QUERY = defineQuery(`
  *[_type == "bbqService"] | order(sortOrder asc) {
    _id,
    title,
    emoji,
    description,
    linkLabel,
    linkUrl
  }
`);

/** Fetch team members */
export const TEAM_MEMBERS_QUERY = defineQuery(`
  *[_type == "teamMember"] | order(sortOrder asc) {
    _id,
    name,
    role,
    bio,
    "photo": photo.asset->url
  }
`);

/** Fetch timeline events */
export const TIMELINE_QUERY = defineQuery(`
  *[_type == "timelineEvent"] | order(sortOrder asc) {
    _id,
    era,
    title,
    body
  }
`);

/** Fetch accolades */
export const ACCOLADES_QUERY = defineQuery(`
  *[_type == "accolade"] | order(sortOrder asc) {
    _id,
    text
  }
`);

/** Fetch signature products */
export const SIGNATURE_PRODUCTS_QUERY = defineQuery(`
  *[_type == "signatureProduct" && isActive == true] | order(sortOrder asc) {
    _id,
    title,
    sectionLabel,
    emoji,
    description,
    calloutTitle,
    calloutSub,
    calloutColor,
    chips,
    links,
    layout,
    "image": image.asset->url,
    "video": video.asset->url
  }
`);

/** Fetch a legal page by slug */
export const LEGAL_PAGE_QUERY = defineQuery(`
  *[_type == "legalPage" && slug == $slug][0] {
    title,
    effectiveDate,
    content
  }
`);

/** Fetch a customer by email (for login) */
export const CUSTOMER_BY_EMAIL_QUERY = defineQuery(`
  *[_type == "customer" && email == $email][0] {
    _id,
    email,
    password,
    name,
    phone,
    address,
    avatar,
    birthday,
    newsletter,
    preferredPickupTime
  }
`);

/** Fetch order history for a specific customer */
export const ORDER_HISTORY_QUERY = defineQuery(`
  *[_type == "order" && customer._ref == $customerId] | order(createdAt desc) {
    _id,
    orderNumber,
    items,
    total,
    status,
    createdAt,
    metadata
  }
`);

/** Fetch a coupon by code */
export const COUPON_BY_CODE_QUERY = defineQuery(`
  *[_type == "coupon" && code == $code && active == true][0] {
    _id,
    code,
    discountType,
    discountValue,
    expiryDate
  }
`);

/** Fetch upcoming catering events (confirmed + tentative, from today onward) */
export const CATERING_EVENTS_QUERY = defineQuery(`
  *[_type == "cateringEvent" && status != "cancelled" && date >= $today] | order(date asc) {
    _id,
    date,
    eventType,
    status
  }
`);

/** Fetch editable default pricing rows for the catering availability calendar */
export const CATERING_CALENDAR_PRICING_QUERY = defineQuery(`
  *[_type == "cateringCalendarPricing"] | order(sortOrder asc) {
    _id,
    label,
    price
  }
`);

/** Fetch the live rotisserie chicken daily stock status (singleton) */
export const ROTISSERIE_STATUS_QUERY = defineQuery(`
  *[_type == "rotisserieStatus"][0] {
    status,
    birdsLeft,
    nextAvailable,
    note,
    lastUpdated
  }
`);


