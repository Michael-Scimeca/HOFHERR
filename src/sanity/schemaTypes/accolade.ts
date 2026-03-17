import { defineField, defineType } from 'sanity';

export const accoladeType = defineType({
    name: 'accolade',
    title: 'Award / Accolade',
    type: 'document',
    fields: [
        defineField({ name: 'text', title: 'Award Text', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 0 }),
    ],
    orderings: [
        { title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
    ],
    preview: {
        select: { title: 'text' },
    },
});
