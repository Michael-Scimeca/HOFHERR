import { defineField, defineType } from 'sanity';

export const cateringLeadType = defineType({
    name: 'cateringLead',
    title: 'Catering Lead',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
        }),
        defineField({
            name: 'phone',
            title: 'Phone',
            type: 'string',
        }),
        defineField({
            name: 'eventDate',
            title: 'Event Date',
            type: 'date',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'eventType',
            title: 'Event Type',
            type: 'string',
            options: {
                list: [
                    { title: '🐷 Pig Roast', value: 'pig-roast' },
                    { title: '🔥 BBQ Catering', value: 'bbq' },
                    { title: '🍗 Rotisserie', value: 'rotisserie' },
                    { title: '✨ Custom Event', value: 'custom' },
                ],
                layout: 'radio',
            },
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'guestCount',
            title: 'Guest Count',
            type: 'number',
        }),
        defineField({
            name: 'notes',
            title: 'Notes / Special Requests',
            type: 'text',
            rows: 4,
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            initialValue: 'new',
            options: {
                list: [
                    { title: '🆕 New', value: 'new' },
                    { title: '📞 Contacted', value: 'contacted' },
                    { title: '✅ Booked', value: 'booked' },
                    { title: '❌ Lost', value: 'lost' },
                ],
                layout: 'radio',
            },
        }),
        defineField({
            name: 'submittedAt',
            title: 'Submitted At',
            type: 'datetime',
            readOnly: true,
        }),
    ],
    orderings: [
        { title: 'Newest First', name: 'submittedAtDesc', by: [{ field: 'submittedAt', direction: 'desc' }] },
        { title: 'Event Date', name: 'eventDate', by: [{ field: 'eventDate', direction: 'asc' }] },
    ],
    preview: {
        select: { name: 'name', eventDate: 'eventDate', eventType: 'eventType', status: 'status' },
        prepare({ name, eventDate, eventType, status }) {
            const emoji = status === 'new' ? '🆕' : status === 'contacted' ? '📞' : status === 'booked' ? '✅' : '❌';
            const typeEmoji = eventType === 'pig-roast' ? '🐷' : eventType === 'bbq' ? '🔥' : eventType === 'rotisserie' ? '🍗' : '✨';
            return {
                title: `${emoji} ${name}`,
                subtitle: `${typeEmoji} ${eventType} · ${eventDate ?? 'No date'}`,
            };
        },
    },
});
