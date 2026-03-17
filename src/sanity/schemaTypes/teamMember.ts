import { defineField, defineType } from 'sanity';

export const teamMemberType = defineType({
    name: 'teamMember',
    title: 'Team Member',
    type: 'document',
    fields: [
        defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'role', title: 'Role', type: 'string', validation: (r) => r.required() }),
        defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 3 }),
        defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 0 }),
    ],
    orderings: [
        { title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
    ],
    preview: {
        select: { title: 'name', subtitle: 'role', media: 'photo' },
    },
});
