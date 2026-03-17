import { defineField, defineType } from 'sanity';

export const cateringPackageType = defineType({
    name: 'cateringPackage',
    title: 'Catering Package',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Package Name',
            type: 'string',
            description: 'e.g. "Backyard BBQ", "Premium Grill Pack".',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
            description: 'What is included and for whom.',
        }),
        defineField({
            name: 'servings',
            title: 'Servings',
            type: 'string',
            description: 'e.g. "Serves 20-30".',
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'string',
            description: 'e.g. "$599", "Starting at $399".',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'items',
            title: 'Menu Items',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'List of items included (one per entry).',
        }),
        defineField({
            name: 'image',
            title: 'Package Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'isPopular',
            title: 'Most Popular',
            type: 'boolean',
            description: 'Show a "Most Popular" badge.',
            initialValue: false,
        }),
        defineField({
            name: 'isActive',
            title: 'Active',
            type: 'boolean',
            description: 'Show this package on the site.',
            initialValue: true,
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
        select: { title: 'name', subtitle: 'price', isPopular: 'isPopular', isActive: 'isActive', media: 'image' },
        prepare({ title, subtitle, isPopular, isActive, media }) {
            const badges = [];
            if (isPopular) badges.push('⭐');
            if (isActive === false) badges.push('⏸️');
            return {
                title: `${badges.join(' ')} ${title}`.trim(),
                subtitle: `${subtitle ?? ''} ${isPopular ? '— Most Popular' : ''}`.trim(),
                media,
            };
        },
    },
});
