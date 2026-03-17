import { defineField, defineType } from 'sanity';

export const categoryType = defineType({
    name: 'category',
    title: 'Category',
    type: 'document',
    groups: [
        { name: 'info', title: 'Info', default: true },
        { name: 'inventory', title: 'Inventory' },
    ],
    fields: [
        defineField({
            name: 'id',
            title: 'Slug / ID',
            type: 'string',
            group: 'info',
            description: 'URL-safe identifier (e.g. "beef", "pork"). Must be unique.',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            group: 'info',
            description: 'Display name shown in headers and sidebar (e.g. "Premium Beef").',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'sub',
            title: 'Subtitle',
            type: 'string',
            group: 'info',
            description: 'Short description shown below the label.',
        }),
        defineField({
            name: 'emoji',
            title: 'Emoji',
            type: 'string',
            group: 'info',
            description: 'Emoji shown in category headers (e.g. "🥩").',
        }),
        defineField({
            name: 'icon',
            title: 'Icon Image',
            type: 'image',
            group: 'info',
            description: 'PNG icon shown in category headers and sidebar.',
            options: { hotspot: true },
        }),
        defineField({
            name: 'store',
            title: 'Store',
            type: 'string',
            group: 'info',
            options: {
                list: [
                    { title: 'The Butcher Shop', value: 'butcher' },
                    { title: 'The Depot', value: 'depot' },
                ],
                layout: 'radio',
            },
            initialValue: 'butcher',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'sortOrder',
            title: 'Sort Order',
            type: 'number',
            group: 'info',
            description: 'Lower numbers appear first.',
            initialValue: 0,
        }),

        /* ── Inventory ────────────────────────────────────────────────── */
        defineField({
            name: 'priceRange',
            title: 'Price Range',
            type: 'string',
            group: 'inventory',
            description: 'e.g. "$6.99 – $42.99/lb"',
        }),
        defineField({
            name: 'itemCount',
            title: 'Item Count',
            type: 'number',
            group: 'inventory',
            description: 'Total number of products in this category.',
            initialValue: 0,
        }),
    ],
    orderings: [
        { title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
    ],
    preview: {
        select: { title: 'label', subtitle: 'store', emoji: 'emoji', media: 'icon', priceRange: 'priceRange', itemCount: 'itemCount' },
        prepare({ title, subtitle, emoji, media, priceRange, itemCount }) {
            const store = subtitle === 'depot' ? '🏪 The Depot' : '🥩 Butcher Shop';
            const parts = [store];
            if (priceRange) parts.push(priceRange);
            if (itemCount) parts.push(`${itemCount} items`);
            return {
                title: `${emoji ?? ''} ${title}`,
                subtitle: parts.join(' · '),
                media,
            };
        },
    },
});
