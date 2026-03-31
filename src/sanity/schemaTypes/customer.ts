export default {
    name: 'customer',
    title: 'Registered Customers',
    type: 'document',
    fields: [
        {
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (Rule: any) => Rule.required().email(),
        },
        {
            name: 'password',
            title: 'Hashed Password',
            type: 'string',
            hidden: true,
        },
        {
            name: 'name',
            title: 'Display Name',
            type: 'string',
        },
        {
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
        },
        {
            name: 'isAdmin',
            title: 'Is Administrator',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'avatar',
            title: 'Avatar URL',
            type: 'string',
        },
        {
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        },
        {
            name: 'resetToken',
            title: 'Password Reset Token',
            type: 'string',
            hidden: true,
        },
        {
            name: 'resetTokenExpiry',
            title: 'Password Reset Token Expiry',
            type: 'datetime',
            hidden: true,
        },
        {
            name: 'emailVerified',
            title: 'Email Verified',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'verifyToken',
            title: 'Email Verification Token',
            type: 'string',
            hidden: true,
        },
        {
            name: 'verifyTokenExpiry',
            title: 'Verification Token Expiry',
            type: 'datetime',
            hidden: true,
        }
    ],
    indexes: [
        {
            name: 'customerEmailIndex',
            fields: ['email'],
            unique: true
        }
    ]
}
