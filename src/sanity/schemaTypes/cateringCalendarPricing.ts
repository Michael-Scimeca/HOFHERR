import { defineField, defineType } from 'sanity';

export const cateringCalendarPricingType = defineType({
    name: 'cateringCalendarPricing',
    title: 'Catering Calendar Pricing',
    type: 'document',
    fields: [
        defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            description: 'e.g. "Pig Roast (50+ guests)"',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'string',
            description: 'e.g. "From $30/pp" or "Contact us"',
            validation: (r) => r.required(),
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
        select: { label: 'label', price: 'price' },
        prepare({ label, price }) {
            return { title: label, subtitle: price };
        },
    },
});
