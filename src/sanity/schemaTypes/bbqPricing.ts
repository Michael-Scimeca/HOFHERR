import { defineField, defineType } from 'sanity';

export const bbqPricingType = defineType({
    name: 'bbqPricing',
    title: 'BBQ Pricing',
    type: 'document',
    fields: [
        defineField({
            name: 'tier',
            title: 'Tier',
            type: 'string',
            options: {
                list: [
                    { title: 'Under 20 Guests', value: 'under20' },
                    { title: '20+ Guests', value: 'over20' },
                ],
                layout: 'radio',
            },
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'title',
            title: 'Display Title',
            type: 'string',
            description: 'e.g. "Under 20 Guests", "20+ Guests — Pickup"',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'subtitle',
            title: 'Subtitle',
            type: 'text',
            rows: 2,
            description: 'e.g. "Includes paperware, cutlery, serving utensils..."',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
            description: 'Extra info for the under-20 tier.',
        }),
        defineField({
            name: 'minimumOrder',
            title: 'Minimum Order',
            type: 'string',
            description: 'e.g. "$200"',
        }),
        defineField({
            name: 'priceLines',
            title: 'Price Lines',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string' }),
                    defineField({ name: 'price', title: 'Price', type: 'string' }),
                ],
                preview: {
                    select: { label: 'label', price: 'price' },
                    prepare({ label, price }) {
                        return { title: label, subtitle: price };
                    },
                },
            }],
            description: 'Price breakdown rows for the 20+ tier.',
        }),
        defineField({
            name: 'isFeatured',
            title: 'Featured (highlighted card)',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'sortOrder',
            title: 'Sort Order',
            type: 'number',
            initialValue: 0,
        }),
    ],
    orderings: [
        { title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
    ],
    preview: {
        select: { title: 'title', tier: 'tier', isFeatured: 'isFeatured' },
        prepare({ title, isFeatured }) {
            return {
                title: `${isFeatured ? '⭐ ' : ''}${title}`,
                subtitle: isFeatured ? 'Featured' : '',
            };
        },
    },
});
