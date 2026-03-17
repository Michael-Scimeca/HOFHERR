import { defineField, defineType } from 'sanity';

export const specialType = defineType({
    name: 'special',
    title: 'Special',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'e.g. "Weekend Grill Pack"',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
            description: 'What is included in this special.',
        }),
        defineField({
            name: 'regularPrice',
            title: 'Regular Price',
            type: 'string',
            description: 'Original price (e.g. "$45.99").',
        }),
        defineField({
            name: 'salePrice',
            title: 'Sale Price',
            type: 'string',
            description: 'Promo price (e.g. "$33.99").',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'savings',
            title: 'Savings',
            type: 'string',
            description: 'e.g. "Save $12!"',
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'validFrom',
            title: 'Valid From',
            type: 'date',
        }),
        defineField({
            name: 'validUntil',
            title: 'Valid Until',
            type: 'date',
        }),
        defineField({
            name: 'isActive',
            title: 'Active',
            type: 'boolean',
            description: 'Quick on/off toggle.',
            initialValue: true,
        }),
        defineField({
            name: 'badge',
            title: 'Badge',
            type: 'string',
            options: {
                list: [
                    { title: 'NEW', value: 'new' },
                    { title: 'HOT DEAL', value: 'hot-deal' },
                    { title: 'LIMITED', value: 'limited' },
                    { title: 'BEST VALUE', value: 'best-value' },
                    { title: 'STAFF PICK', value: 'staff-pick' },
                ],
            },
        }),
        defineField({
            name: 'linkedProducts',
            title: 'Linked Products',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'product' }] }],
            description: 'Products included in this special.',
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
        select: { title: 'title', subtitle: 'salePrice', isActive: 'isActive', media: 'image' },
        prepare({ title, subtitle, isActive, media }) {
            return {
                title: `${isActive === false ? '⏸️ ' : ''}${title}`,
                subtitle: subtitle ?? '',
                media,
            };
        },
    },
});
