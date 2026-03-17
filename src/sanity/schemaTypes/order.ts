export default {
    name: 'order',
    title: 'Customer Orders',
    type: 'document',
    fields: [
        {
            name: 'customer',
            title: 'Customer',
            type: 'reference',
            to: [{ type: 'customer' }],
        },
        {
            name: 'orderNumber',
            title: 'Order Number',
            type: 'string',
        },
        {
            name: 'items',
            title: 'Order Items',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', type: 'string' },
                        { name: 'price', type: 'string' },
                        { name: 'qty', type: 'number' },
                        { name: 'note', type: 'string' }
                    ]
                }
            ]
        },
        {
            name: 'total',
            title: 'Total Amount ($)',
            type: 'number',
        },
        {
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Pending (Pay at Pickup)', value: 'pending' },
                    { title: 'Paid (Preparing)', value: 'paid' },
                    { title: 'Processing', value: 'processing' },
                    { title: 'Ready (Paid)', value: 'ready_paid' },
                    { title: 'Ready (Pay on Pickup)', value: 'ready_pending' },
                    { title: 'Completed', value: 'completed' },
                    { title: 'Cancelled', value: 'cancelled' }
                ]
            },
            initialValue: 'pending'
        },
        {
            name: 'stripeSessionId',
            title: 'Stripe Session ID',
            type: 'string',
        },
        {
            name: 'couponCode',
            title: 'Coupon Code Used',
            type: 'string',
            description: 'The promo code applied during checkout (if any)'
        },
        {
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }
    ]
}
