import { defineField, defineType } from 'sanity';

export const bbqMenuItemType = defineType({
    name: 'bbqMenuItem',
    title: 'BBQ Menu Item',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Item Name',
            type: 'string',
            description: 'e.g. "Smoked Brisket", "Pimento Mac and Cheese"',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Appetizer', value: 'appetizer' },
                    { title: 'Meat', value: 'meat' },
                    { title: 'Side', value: 'side' },
                ],
                layout: 'radio',
            },
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
        select: { title: 'name', category: 'category' },
        prepare({ title, category }) {
            const emoji = category === 'appetizer' ? '🧀' : category === 'meat' ? '🔥' : '🥗';
            return {
                title: `${emoji} ${title}`,
                subtitle: category ? category.charAt(0).toUpperCase() + category.slice(1) : '',
            };
        },
    },
});
