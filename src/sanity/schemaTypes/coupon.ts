export default {
    name: 'coupon',
    title: 'Coupons',
    type: 'document',
    fields: [
        {
            name: 'code',
            title: 'Coupon Code',
            type: 'string',
            validation: (Rule: any) => Rule.required().uppercase(),
        },
        {
            name: 'discountType',
            title: 'Discount Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Percentage (%)', value: 'percentage' },
                    { title: 'Fixed Amount ($)', value: 'fixed' }
                ]
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'discountValue',
            title: 'Discount Value',
            type: 'number',
            validation: (Rule: any) => Rule.required().min(0),
        },
        {
            name: 'active',
            title: 'Active',
            type: 'boolean',
            initialValue: true
        },
        {
            name: 'expiryDate',
            title: 'Expiry Date',
            type: 'datetime'
        }
    ]
}
