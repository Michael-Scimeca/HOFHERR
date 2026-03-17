import { defineField, defineType } from 'sanity';

export const signatureProductType = defineType({
    name: 'signatureProduct',
    title: 'Signature Product',
    type: 'document',
    fields: [
        defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'sectionLabel', title: 'Section Label', type: 'string', description: 'e.g. "Chicago Classic · Our Flagship"' }),
        defineField({ name: 'emoji', title: 'Emoji (Legacy)', type: 'string', description: 'Used if no image is uploaded' }),
        defineField({ name: 'image', title: 'Feature Image', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 5 }),
        defineField({ name: 'calloutTitle', title: 'Callout Title', type: 'string' }),
        defineField({ name: 'calloutSub', title: 'Callout Subtitle', type: 'text', rows: 3 }),
        defineField({ name: 'calloutColor', title: 'Callout Background Color', type: 'string', description: 'CSS color, e.g. "var(--red)"' }),
        defineField({
            name: 'chips',
            title: 'Feature Chips',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'links',
            title: 'Action Links',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    defineField({ name: 'label', title: 'Label', type: 'string' }),
                    defineField({ name: 'url', title: 'URL', type: 'string' }),
                    defineField({ name: 'isPrimary', title: 'Primary Button', type: 'boolean', initialValue: true }),
                ],
                preview: {
                    select: { title: 'label', subtitle: 'url' },
                },
            }],
        }),
        defineField({
            name: 'layout',
            title: 'Layout',
            type: 'string',
            options: {
                list: [
                    { title: 'Callout Left', value: 'callout-left' },
                    { title: 'Callout Right', value: 'callout-right' },
                ],
                layout: 'radio',
            },
            initialValue: 'callout-left',
        }),
        defineField({ name: 'isActive', title: 'Active', type: 'boolean', initialValue: true }),
        defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 0 }),
    ],
    orderings: [
        { title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
    ],
    preview: {
        select: { title: 'title', subtitle: 'sectionLabel', isActive: 'isActive' },
        prepare({ title, subtitle, isActive }) {
            return {
                title: `${isActive === false ? '⏸️ ' : ''}${title}`,
                subtitle,
            };
        },
    },
});
