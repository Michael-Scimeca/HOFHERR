import { defineField, defineType } from 'sanity';

export const cateringEventType = defineType({
    name: 'cateringEvent',
    title: 'Catering Event',
    type: 'document',
    fields: [
        defineField({
            name: 'date',
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
                    { title: '🍗 Rotisserie Package', value: 'rotisserie' },
                    { title: '🥩 Custom Event', value: 'custom' },
                ],
                layout: 'dropdown',
            },
            initialValue: 'pig-roast',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: '✅ Confirmed', value: 'confirmed' },
                    { title: '🟡 Tentative / Hold', value: 'tentative' },
                    { title: '❌ Cancelled', value: 'cancelled' },
                ],
                layout: 'radio',
            },
            initialValue: 'confirmed',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'clientName',
            title: 'Client Name (Private)',
            type: 'string',
            description: 'Not displayed publicly — for internal reference only.',
        }),
        defineField({
            name: 'guestCount',
            title: 'Guest Count',
            type: 'number',
            description: 'Approximate number of guests.',
        }),
        defineField({
            name: 'notes',
            title: 'Internal Notes',
            type: 'text',
            rows: 3,
            description: 'Private notes (not shown on website).',
        }),
    ],
    orderings: [
        { title: 'Date', name: 'date', by: [{ field: 'date', direction: 'asc' }] },
    ],
    preview: {
        select: { date: 'date', eventType: 'eventType', status: 'status', clientName: 'clientName' },
        prepare({ date, eventType, status, clientName }) {
            const typeEmoji: Record<string, string> = {
                'pig-roast': '🐷', 'bbq': '🔥', 'rotisserie': '🍗', 'custom': '🥩',
            };
            const statusEmoji: Record<string, string> = {
                'confirmed': '✅', 'tentative': '🟡', 'cancelled': '❌',
            };
            const formatted = date ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date';
            return {
                title: `${typeEmoji[eventType ?? ''] ?? ''} ${formatted}`,
                subtitle: `${statusEmoji[status ?? ''] ?? ''} ${status ?? ''} ${clientName ? `— ${clientName}` : ''}`,
            };
        },
    },
});
