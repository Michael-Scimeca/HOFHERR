import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    groups: [
        { name: 'general', title: 'General', default: true },
        { name: 'seo', title: 'SEO & Metadata' },
        { name: 'hours', title: 'Store Hours' },
        { name: 'social', title: 'Social & Links' },
        { name: 'announcements', title: 'Announcements' },
        { name: 'inventory', title: 'Inventory Alerts' },
    ],
    fields: [
        /* ── General ──────────────────────────────────────────────────── */
        defineField({
            name: 'shopName',
            title: 'Shop Name',
            type: 'string',
            group: 'general',
            initialValue: 'Hofherr Meat Co.',
        }),
        defineField({
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
            group: 'general',
            initialValue: '(847) 441-MEAT',
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            group: 'general',
        }),
        defineField({
            name: 'address',
            title: 'Address',
            type: 'object',
            group: 'general',
            fields: [
                defineField({ name: 'street', title: 'Street', type: 'string' }),
                defineField({ name: 'city', title: 'City', type: 'string' }),
                defineField({ name: 'state', title: 'State', type: 'string' }),
                defineField({ name: 'zip', title: 'ZIP', type: 'string' }),
            ],
        }),

        /* ── SEO & Metadata ───────────────────────────────────────────── */
        defineField({
            name: 'seoTitle',
            title: 'Global SEO Title',
            type: 'string',
            group: 'seo',
            description: 'Default title tag for the whole site (e.g., "Hofherr Meat Co. | Northfield, IL").',
            initialValue: 'Hofherr Meat Co. | Northfield, IL',
        }),
        defineField({
            name: 'seoDescription',
            title: 'Global SEO Description',
            type: 'text',
            group: 'seo',
            rows: 3,
            description: 'Default meta description for search engines.',
            initialValue: 'Premium, traceable meats. Custom cuts, rotisserie chicken, seasonal specials, and world-class catering — all from our shop in Northfield, IL.',
        }),
        defineField({
            name: 'ogImage',
            title: 'Default Open Graph Image (Social Sharing)',
            type: 'image',
            group: 'seo',
            options: { hotspot: true },
            description: 'The image that appears when the link is shared on social media.',
        }),

        /* ── Store Hours ──────────────────────────────────────────────── */
        defineField({
            name: 'butcherHours',
            title: 'Butcher Shop Hours',
            type: 'array',
            group: 'hours',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'day',
                            title: 'Day',
                            type: 'string',
                            options: {
                                list: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                            },
                        }),
                        defineField({ name: 'open', title: 'Open', type: 'string', description: 'e.g. "10:00 AM"' }),
                        defineField({ name: 'close', title: 'Close', type: 'string', description: 'e.g. "6:00 PM"' }),
                        defineField({ name: 'isClosed', title: 'Closed', type: 'boolean', initialValue: false }),
                    ],
                    preview: {
                        select: { day: 'day', open: 'open', close: 'close', isClosed: 'isClosed' },
                        prepare({ day, open, close, isClosed }) {
                            return {
                                title: day ?? '',
                                subtitle: isClosed ? '🔴 Closed' : `${open ?? ''} – ${close ?? ''}`,
                            };
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'depotHours',
            title: 'Depot Hours',
            type: 'array',
            group: 'hours',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'day',
                            title: 'Day',
                            type: 'string',
                            options: {
                                list: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                            },
                        }),
                        defineField({ name: 'open', title: 'Open', type: 'string', description: 'e.g. "10:30 AM"' }),
                        defineField({ name: 'close', title: 'Close', type: 'string', description: 'e.g. "6:00 PM"' }),
                        defineField({ name: 'isClosed', title: 'Closed', type: 'boolean', initialValue: false }),
                    ],
                    preview: {
                        select: { day: 'day', open: 'open', close: 'close', isClosed: 'isClosed' },
                        prepare({ day, open, close, isClosed }) {
                            return {
                                title: day ?? '',
                                subtitle: isClosed ? '🔴 Closed' : `${open ?? ''} – ${close ?? ''}`,
                            };
                        },
                    },
                },
            ],
        }),

        /* ── Social & Links ───────────────────────────────────────────── */
        defineField({
            name: 'instagram',
            title: 'Instagram URL',
            type: 'url',
            group: 'social',
        }),
        defineField({
            name: 'facebook',
            title: 'Facebook URL',
            type: 'url',
            group: 'social',
        }),
        defineField({
            name: 'yelp',
            title: 'Yelp URL',
            type: 'url',
            group: 'social',
        }),
        defineField({
            name: 'googleMaps',
            title: 'Google Maps URL',
            type: 'url',
            group: 'social',
        }),

        /* ── Announcements ────────────────────────────────────────────── */
        defineField({
            name: 'announcement',
            title: 'Announcement Banner',
            type: 'text',
            group: 'announcements',
            rows: 2,
            description: 'Site-wide banner message (e.g. "Holiday hours in effect!").',
        }),
        defineField({
            name: 'announcementActive',
            title: 'Show Announcement',
            type: 'boolean',
            group: 'announcements',
            initialValue: false,
        }),
        defineField({
            name: 'announcementColor',
            title: 'Banner Color',
            type: 'string',
            group: 'announcements',
            options: {
                list: [
                    { title: '🔴 Red (Urgent)', value: 'red' },
                    { title: '🟡 Yellow (Info)', value: 'yellow' },
                    { title: '🟢 Green (Good News)', value: 'green' },
                    { title: '🔵 Blue (Neutral)', value: 'blue' },
                ],
            },
            initialValue: 'blue',
        }),

        /* ── Inventory Alerts ────────────────────────────────────────── */
        defineField({
            name: 'lowStockThreshold',
            title: 'Low Stock Threshold',
            type: 'number',
            group: 'inventory',
            description: 'Alert when a product drops to this many units or below.',
            initialValue: 3,
            validation: (r) => r.min(0).max(20),
        }),
        defineField({
            name: 'stockAlertEmail',
            title: 'Stock Alert Email',
            type: 'string',
            group: 'inventory',
            description: 'Email address to receive low-stock notifications.',
        }),
        defineField({
            name: 'stockAlertsEnabled',
            title: 'Enable Stock Alerts',
            type: 'boolean',
            group: 'inventory',
            description: 'Send email notifications when products hit the low-stock threshold.',
            initialValue: true,
        }),
    ],
    preview: {
        prepare() {
            return { title: '⚙️ Site Settings' };
        },
    },
});
