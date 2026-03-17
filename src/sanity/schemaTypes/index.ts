import { categoryType } from './category';
import { productType } from './product';
import { specialType } from './special';
import { faqType } from './faq';
import { cutGuideType } from './cutGuide';
import { cateringPackageType } from './cateringPackage';
import { siteSettingsType } from './siteSettings';
import { bbqMenuItemType } from './bbqMenuItem';
import { bbqPricingType } from './bbqPricing';
import { bbqServiceType } from './bbqService';
import { teamMemberType } from './teamMember';
import { timelineEventType } from './timelineEvent';
import { accoladeType } from './accolade';
import { signatureProductType } from './signatureProduct';
import { legalPageType } from './legalPage';
import customer from './customer';
import order from './order';
import coupon from './coupon';

export const schemaTypes = [
    // Site-wide
    siteSettingsType,
    // Online Orders
    categoryType,
    productType,
    // Content pages
    specialType,
    faqType,
    cutGuideType,
    cateringPackageType,
    // BBQ
    bbqMenuItemType,
    bbqPricingType,
    bbqServiceType,
    // Our Story
    teamMemberType,
    timelineEventType,
    accoladeType,
    // Signatures
    signatureProductType,
    // Legal
    legalPageType,
    // Authentication & E-commerce
    customer,
    order,
    coupon,
];
