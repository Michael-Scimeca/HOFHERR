import { defineField, defineType } from 'sanity';

export const cutGuideType = defineType({
    name: 'cutGuide',
    title: 'Cut Guide',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Cut Name',
            type: 'string',
            description: 'e.g. "Ribeye", "Tenderloin".',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'animal',
            title: 'Animal',
            type: 'string',
            options: {
                list: [
                    { title: '🐄 Beef', value: 'beef' },
                    { title: '🐖 Pork', value: 'pork' },
                    { title: '🐑 Lamb', value: 'lamb' },
                    { title: '🐔 Chicken', value: 'chicken' },
                    { title: '🦃 Turkey', value: 'turkey' },
                ],
                layout: 'dropdown',
            },
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'subcut',
            title: 'Sub-Cut / Section',
            type: 'string',
            description: 'e.g. "Rib Section", "Loin".',
        }),
        defineField({
            name: 'bestFor',
            title: 'Best For',
            type: 'string',
            description: 'e.g. "Grilling, Pan-Searing".',
        }),
        defineField({
            name: 'cookingMethod',
            title: 'Cooking Method',
            type: 'string',
            description: 'e.g. "High heat, quick sear".',
        }),
        defineField({
            name: 'tip',
            title: 'Butcher\'s Tip',
            type: 'text',
            rows: 2,
            description: 'Pro tip from the butcher.',
        }),
        defineField({
            name: 'image',
            title: 'Cut Image',
            type: 'image',
            options: { hotspot: true },
            description: 'Photo or diagram of the cut.',
        }),
        defineField({
            name: 'linkedProduct',
            title: 'Linked Product',
            type: 'reference',
            to: [{ type: 'product' }],
            description: 'Link to the product in the shop.',
        }),
        defineField({
            name: 'sortOrder',
            title: 'Sort Order',
            type: 'number',
            initialValue: 0,
        }),
    ],
    orderings: [
        { title: 'Animal', name: 'animal', by: [{ field: 'animal', direction: 'asc' }] },
        { title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
    ],
    preview: {
        select: { title: 'name', subtitle: 'animal', bestFor: 'bestFor', media: 'image' },
        prepare({ title, subtitle, bestFor, media }) {
            const animalEmoji: Record<string, string> = {
                beef: '🐄', pork: '🐖', lamb: '🐑', chicken: '🐔', turkey: '🦃',
            };
            return {
                title: `${animalEmoji[subtitle ?? ''] ?? ''} ${title}`,
                subtitle: bestFor ?? subtitle ?? '',
                media,
            };
        },
    },
});
