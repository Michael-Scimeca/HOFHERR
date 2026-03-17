import { defineField, defineType } from 'sanity';

export const faqType = defineType({
    name: 'faq',
    title: 'FAQ',
    type: 'document',
    fields: [
        defineField({
            name: 'question',
            title: 'Question',
            type: 'string',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'answer',
            title: 'Answer',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [{ title: 'Normal', value: 'normal' }],
                    marks: {
                        decorators: [
                            { title: 'Bold', value: 'strong' },
                            { title: 'Italic', value: 'em' },
                        ],
                        annotations: [
                            {
                                name: 'link',
                                type: 'object',
                                title: 'Link',
                                fields: [{ name: 'href', type: 'url', title: 'URL' }],
                            },
                        ],
                    },
                },
            ],
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'faqCategory',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Ordering', value: 'ordering' },
                    { title: 'Delivery & Pickup', value: 'delivery' },
                    { title: 'Products', value: 'products' },
                    { title: 'Catering', value: 'catering' },
                    { title: 'General', value: 'general' },
                ],
            },
            initialValue: 'general',
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
        { title: 'Category', name: 'faqCategory', by: [{ field: 'faqCategory', direction: 'asc' }] },
    ],
    preview: {
        select: { title: 'question', subtitle: 'faqCategory' },
        prepare({ title, subtitle }) {
            const catLabels: Record<string, string> = {
                ordering: '🛒 Ordering',
                delivery: '🚚 Delivery & Pickup',
                products: '🥩 Products',
                catering: '🍖 Catering',
                general: '❓ General',
            };
            return { title, subtitle: catLabels[subtitle ?? 'general'] ?? subtitle };
        },
    },
});
