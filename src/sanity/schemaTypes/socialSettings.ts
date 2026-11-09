import { defineArrayMember, defineField, defineType } from 'sanity';

/** Singleton (_id "socialSettings") — controls how often posts go out and where. */
export const socialSettingsType = defineType({
    name: 'socialSettings',
    title: 'Social Posting Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'frequency',
            title: 'How often to post',
            type: 'string',
            options: {
                list: [
                    { title: 'Every day', value: 'daily' },
                    { title: 'Every other day (Mon · Wed · Fri · Sun)', value: 'alternate' },
                    { title: 'Weekdays only', value: 'weekdays' },
                    { title: 'Custom days', value: 'custom' },
                ],
                layout: 'radio',
            },
            initialValue: 'alternate',
        }),
        defineField({
            name: 'customDays',
            title: 'Custom days',
            type: 'array',
            of: [defineArrayMember({ type: 'string' })],
            options: { list: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
            hidden: ({ parent }) => parent?.frequency !== 'custom',
        }),
        defineField({ name: 'postTime', title: 'Post time (Chicago)', type: 'string', initialValue: '11:00', description: '24-hour HH:MM' }),
        defineField({
            name: 'platforms',
            title: 'Post to',
            type: 'array',
            of: [defineArrayMember({ type: 'string' })],
            options: { list: [{ title: 'Instagram', value: 'instagram' }, { title: 'Facebook', value: 'facebook' }, { title: 'X (Twitter)', value: 'x' }] },
            initialValue: ['instagram', 'facebook', 'x'],
        }),
        defineField({
            name: 'notifyEmails',
            title: 'Send review notifications to',
            type: 'array',
            of: [defineArrayMember({ type: 'string', validation: (r) => r.email() })],
        }),
        defineField({
            name: 'requireApproval',
            title: 'Require approval before posting',
            type: 'boolean',
            initialValue: true,
            description: 'When on, nothing posts until someone clicks Approve. Spelling must be clean to approve.',
        }),
        defineField({ name: 'customWords', title: 'Spell-check dictionary additions', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    ],
    preview: { prepare: () => ({ title: 'Social Posting Settings' }) },
});
