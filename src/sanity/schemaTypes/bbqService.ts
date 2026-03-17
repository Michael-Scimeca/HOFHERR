import { defineField, defineType } from 'sanity';

export const bbqServiceType = defineType({
    name: 'bbqService',
    title: 'BBQ Service',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'emoji', title: 'Emoji', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
        defineField({ name: 'linkLabel', title: 'Button Label', type: 'string' }),
        defineField({ name: 'linkUrl', title: 'Button URL', type: 'string' }),
        defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 0 }),
    ],
    orderings: [
        { title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
    ],
    preview: {
        select: { title: 'title', emoji: 'emoji' },
        prepare({ title, emoji }) {
            return { title: `${emoji ?? ''} ${title}`.trim() };
        },
    },
});
