import { defineField, defineType } from 'sanity';

export const timelineEventType = defineType({
    name: 'timelineEvent',
    title: 'Timeline Event',
    type: 'document',
    fields: [
        defineField({ name: 'era', title: 'Era / Year', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'body', title: 'Description', type: 'text', rows: 3 }),
        defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 0 }),
    ],
    orderings: [
        { title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
    ],
    preview: {
        select: { title: 'title', subtitle: 'era' },
    },
});
