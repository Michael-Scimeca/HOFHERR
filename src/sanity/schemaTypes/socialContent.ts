import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Social content bank. The weekly generator picks the least-recently-used active item
 * of each kind, so the team only has to keep adding ideas here.
 */
export const socialContentType = defineType({
    name: 'socialContent',
    title: 'Social Content Bank',
    type: 'document',
    fields: [
        defineField({
            name: 'kind',
            title: 'Kind',
            type: 'string',
            options: {
                list: [
                    { title: 'Recipe (cover + ingredients + method)', value: 'recipe' },
                    { title: 'How-to (cover + steps carousel)', value: 'howto' },
                    { title: 'Know your cuts (animal guide)', value: 'cuts' },
                    { title: 'Did you know? fact', value: 'fact' },
                    { title: 'Trivia (question + answer)', value: 'trivia' },
                    { title: 'Kitchen trick / tip', value: 'tip' },
                ],
                layout: 'radio',
            },
            validation: (r) => r.required(),
        }),
        defineField({ name: 'title', title: 'Title / Question', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'body', title: 'Body / Answer', type: 'text', rows: 3, description: 'Tip text, fact text, the trivia answer — or for recipes, the time & servings (e.g. "25 min · serves 2").' }),
        defineField({
            name: 'ingredients',
            title: 'Ingredients (recipes)',
            type: 'array',
            of: [defineArrayMember({ type: 'string' })],
            hidden: ({ parent }) => parent?.kind !== 'recipe',
        }),
        defineField({ name: 'photo', title: 'Photo path (recipes)', type: 'string', description: 'e.g. /assets/specials-bbq.jpg', hidden: ({ parent }) => parent?.kind !== 'recipe' }),
        defineField({
            name: 'items',
            title: 'Steps or cut rows',
            type: 'array',
            of: [defineArrayMember({ type: 'string' })],
            description: 'How-to or recipe method steps, one per line. For cut guides use "Cut | Where | Best for".',
        }),
        defineField({
            name: 'animal',
            title: 'Animal',
            type: 'string',
            options: { list: ['beef', 'pork', 'lamb', 'chicken', 'general'] },
            initialValue: 'general',
        }),
        defineField({
            name: 'iconId',
            title: 'Department icon',
            type: 'string',
            options: { list: ['cow', 'pig', 'chicken', 'lamb', 'cheese', 'soup', 'fish', 'seafood', 'duck', 'truck'] },
            initialValue: 'cow',
        }),
        defineField({ name: 'active', title: 'Active', type: 'boolean', initialValue: true }),
        defineField({ name: 'lastUsed', title: 'Last used', type: 'date', readOnly: true }),
        defineField({ name: 'seedKey', title: 'Seed key', type: 'string', hidden: true }),
    ],
    preview: {
        select: { title: 'title', kind: 'kind', animal: 'animal', lastUsed: 'lastUsed' },
        prepare: ({ title, kind, animal, lastUsed }) => ({
            title,
            subtitle: `${kind}${animal && animal !== 'general' ? ` · ${animal}` : ''} · ${lastUsed ? `used ${lastUsed}` : 'never used'}`,
        }),
    },
    orderings: [{ title: 'Least recently used', name: 'lastUsedAsc', by: [{ field: 'lastUsed', direction: 'asc' }] }],
});
