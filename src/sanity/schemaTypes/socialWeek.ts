import { defineArrayMember, defineField, defineType } from 'sanity';

/** A generated week of posts. Created by /api/social/generate (Vercel Cron, Mondays). */
export const socialWeekType = defineType({
    name: 'socialWeek',
    title: 'Social Week',
    type: 'document',
    fields: [
        defineField({ name: 'weekOf', title: 'Week of (Monday)', type: 'date', validation: (r) => r.required() }),
        defineField({ name: 'generatedAt', title: 'Generated at', type: 'datetime', readOnly: true }),
        defineField({
            name: 'posts',
            title: 'Posts',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'socialPost',
                    fields: [
                        defineField({ name: 'day', type: 'string' }),
                        defineField({ name: 'kind', type: 'string' }),
                        defineField({ name: 'label', type: 'string' }),
                        defineField({ name: 'contentIds', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
                        defineField({
                            name: 'slides',
                            type: 'array',
                            of: [
                                defineArrayMember({
                                    type: 'object',
                                    name: 'socialSlide',
                                    fields: [
                                        defineField({ name: 'template', type: 'string' }),
                                        defineField({ name: 'kicker', type: 'string' }),
                                        defineField({ name: 'headline', type: 'string' }),
                                        defineField({ name: 'body', type: 'text' }),
                                        defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
                                        defineField({ name: 'iconId', type: 'string' }),
                                        defineField({ name: 'photo', type: 'string' }),
                                        defineField({ name: 'tone', type: 'string' }),
                                    ],
                                }),
                            ],
                        }),
                        defineField({ name: 'caption', type: 'text' }),
                        defineField({ name: 'hashtags', type: 'string' }),
                        defineField({ name: 'approved', type: 'boolean', initialValue: false }),
                        defineField({ name: 'version', type: 'number', initialValue: 1 }),
                    ],
                    preview: { select: { title: 'label', subtitle: 'day' } },
                }),
            ],
        }),
    ],
    preview: { select: { title: 'weekOf' }, prepare: ({ title }) => ({ title: `Week of ${title}` }) },
});
