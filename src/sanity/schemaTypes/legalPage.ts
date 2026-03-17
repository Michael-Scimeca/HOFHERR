import { defineField, defineType } from 'sanity';

export const legalPageType = defineType({
    name: 'legalPage',
    title: 'Legal Page',
    type: 'document',
    fields: [
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'string',
            options: { list: [{ title: 'Terms of Service', value: 'terms' }, { title: 'Privacy Policy', value: 'privacy' }] } as any,
            validation: (r) => r.required(),
        }),
        defineField({ name: 'title', title: 'Page Title', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'effectiveDate', title: 'Effective Date', type: 'date' }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [
                        { title: 'Normal', value: 'normal' },
                        { title: 'H2', value: 'h2' },
                        { title: 'H3', value: 'h3' },
                    ],
                },
            ],
        }),
    ],
    preview: {
        select: { title: 'title', subtitle: 'slug' },
    },
});
