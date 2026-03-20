import { defineField, defineType } from 'sanity';

/**
 * A singleton document — there should only ever be ONE of these.
 * Staff updates it each morning (or when birds sell out) from Studio.
 */
export const rotisserieStatusType = defineType({
    name: 'rotisserieStatus',
    title: '🍗 Rotisserie Chicken Status',
    type: 'document',
    fields: [
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: '✅ Available — birds in stock', value: 'available' },
                    { title: '⚠️ Low Stock — almost gone', value: 'low' },
                    { title: '❌ Sold Out Today', value: 'sold_out' },
                    { title: '🔒 Not Available Today (day off)', value: 'unavailable' },
                ],
                layout: 'radio',
            },
            initialValue: 'available',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'birdsLeft',
            title: 'Birds Left Today',
            type: 'number',
            description: 'Optional — shows "X birds left!" badge on the website. Leave blank to hide the count.',
        }),
        defineField({
            name: 'nextAvailable',
            title: 'Next Available',
            type: 'string',
            description: 'Shows when status is Sold Out or Unavailable. e.g. "Back tomorrow, Tue 3/21" or "Back this Saturday"',
            placeholder: 'e.g. Back tomorrow, Tuesday',
        }),
        defineField({
            name: 'note',
            title: 'Custom Note (Optional)',
            type: 'string',
            description: 'Override the default message on the website. e.g. "Special order this week — call us!"',
        }),
        defineField({
            name: 'lastUpdated',
            title: 'Last Updated At',
            type: 'datetime',
            description: 'Staff: update this to the current time each time you save, so customers see a "last updated" timestamp.',
        }),
    ],
    preview: {
        select: { status: 'status', birdsLeft: 'birdsLeft' },
        prepare({ status, birdsLeft }) {
            const label =
                status === 'available' ? '✅ Available'
                : status === 'low' ? '⚠️ Low Stock'
                : status === 'sold_out' ? '❌ Sold Out'
                : '🔒 Not Available';
            return {
                title: '🍗 Rotisserie Chicken Status',
                subtitle: `${label}${birdsLeft ? ` — ${birdsLeft} birds left` : ''}`,
            };
        },
    },
});
