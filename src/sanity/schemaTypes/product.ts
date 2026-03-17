import { defineField, defineType } from 'sanity';

export const productType = defineType({
    name: 'product',
    title: 'Product',
    type: 'document',
    groups: [
        { name: 'basic', title: 'Basic Info', default: true },
        { name: 'pricing', title: 'Pricing' },
        { name: 'inventory', title: 'Inventory' },
        { name: 'media', title: 'Media' },
        { name: 'details', title: 'Details' },
        { name: 'organization', title: 'Organization' },
    ],
    fields: [
        /* ── Basic Info ───────────────────────────────────────────────── */
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            group: 'basic',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'sku',
            title: 'SKU',
            type: 'string',
            group: 'basic',
            description: 'Unique product identifier (e.g. HMC-BEEF-001).',
        }),
        defineField({
            name: 'description',
            title: 'Short Description',
            type: 'text',
            group: 'basic',
            rows: 2,
        }),

        /* ── Pricing ──────────────────────────────────────────────────── */
        defineField({
            name: 'price',
            title: 'Regular Price',
            type: 'string',
            group: 'pricing',
            description: 'Display price (e.g. "$24.99/lb", "$12.99 ea", "Market Price").',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'salePrice',
            title: 'Sale Price',
            type: 'string',
            group: 'pricing',
            description: 'Optional promotional price. Leave blank for no sale.',
        }),
        defineField({
            name: 'unit',
            title: 'Pricing Unit',
            type: 'string',
            group: 'pricing',
            options: {
                list: [
                    { title: 'Per Pound (/lb)', value: 'lb' },
                    { title: 'Each (ea)', value: 'ea' },
                    { title: 'Per Pack', value: 'pack' },
                    { title: 'Flat Price', value: 'flat' },
                    { title: 'Call for Quote', value: 'call' },
                ],
            },
            description: 'How this product is priced.',
        }),
        defineField({
            name: 'weight',
            title: 'Weight (lbs)',
            type: 'number',
            group: 'pricing',
            description: 'Approximate weight per unit, in pounds.',
        }),

        /* ── Inventory ────────────────────────────────────────────────── */
        defineField({
            name: 'stockStatus',
            title: 'Stock Status',
            type: 'string',
            group: 'inventory',
            options: {
                list: [
                    { title: '✅ In Stock', value: 'in-stock' },
                    { title: '🔥 Low Stock — Almost Gone', value: 'low-stock' },
                    { title: '🔴 Out of Stock', value: 'out-of-stock' },
                    { title: '📦 Pre-Order', value: 'pre-order' },
                    { title: '🌿 Seasonal — Limited', value: 'seasonal' },
                ],
                layout: 'dropdown',
            },
            initialValue: 'in-stock',
            validation: (r) => r.required(),
        }),
        defineField({
            name: 'stockQuantity',
            title: 'Stock Quantity',
            type: 'number',
            group: 'inventory',
            description: 'Approximate units available.',
            initialValue: 5,
            options: {
                list: Array.from({ length: 21 }, (_, i) => ({ title: `${i}`, value: i })),
            },
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'reference',
            group: 'inventory',
            to: [{ type: 'category' }],
            validation: (r) => r.required(),
        }),

        /* ── Media ────────────────────────────────────────────────────── */
        defineField({
            name: 'image',
            title: 'Product Image',
            type: 'image',
            group: 'media',
            options: { hotspot: true },
            description: 'Main product photo.',
        }),
        defineField({
            name: 'gallery',
            title: 'Gallery Images',
            type: 'array',
            group: 'media',
            of: [{ type: 'image', options: { hotspot: true } }],
            description: 'Additional product photos.',
        }),

        /* ── Details ──────────────────────────────────────────────────── */
        defineField({
            name: 'origin',
            title: 'Origin / Source',
            type: 'string',
            group: 'details',
            description: 'e.g. "Local Farm, IL", "USDA Certified", "Australian Wagyu".',
        }),
        defineField({
            name: 'grade',
            title: 'Grade',
            type: 'string',
            group: 'details',
            options: {
                list: [
                    { title: 'USDA Prime', value: 'prime' },
                    { title: 'USDA Choice', value: 'choice' },
                    { title: 'USDA Select', value: 'select' },
                    { title: 'Wagyu', value: 'wagyu' },
                    { title: 'Grass-Fed', value: 'grass-fed' },
                    { title: 'Organic', value: 'organic' },
                    { title: 'N/A', value: 'na' },
                ],
            },
        }),
        defineField({
            name: 'preparation',
            title: 'Preparation Options',
            type: 'array',
            group: 'details',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Bone-In', value: 'bone-in' },
                    { title: 'Boneless', value: 'boneless' },
                    { title: 'Trimmed', value: 'trimmed' },
                    { title: 'Marinated', value: 'marinated' },
                    { title: 'Ground', value: 'ground' },
                    { title: 'Sliced', value: 'sliced' },
                    { title: 'Cubed', value: 'cubed' },
                    { title: 'Whole', value: 'whole' },
                ],
            },
            description: 'Available preparation styles.',
        }),
        defineField({
            name: 'servingSize',
            title: 'Serving Size',
            type: 'string',
            group: 'details',
            description: 'e.g. "Serves 2-3", "4 oz portion".',
        }),
        defineField({
            name: 'cookingTip',
            title: 'Cooking Tip',
            type: 'text',
            group: 'details',
            rows: 2,
            description: 'Quick suggestion from the butcher.',
        }),
        defineField({
            name: 'allergens',
            title: 'Allergens',
            type: 'array',
            group: 'details',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Dairy', value: 'dairy' },
                    { title: 'Gluten', value: 'gluten' },
                    { title: 'Soy', value: 'soy' },
                    { title: 'Nuts', value: 'nuts' },
                    { title: 'Eggs', value: 'eggs' },
                    { title: 'Shellfish', value: 'shellfish' },
                ],
            },
        }),
        defineField({
            name: 'isNew',
            title: 'New Product',
            type: 'boolean',
            group: 'details',
            description: 'Show a "NEW" badge on the product.',
            initialValue: false,
        }),
        defineField({
            name: 'isFeatured',
            title: 'Featured',
            type: 'boolean',
            group: 'details',
            description: 'Display on homepage featured section.',
            initialValue: false,
        }),

        /* ── Organization ─────────────────────────────────────────────── */
        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            group: 'organization',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
            description: 'e.g. "bestseller", "seasonal", "dry-aged", "grill-ready".',
        }),
        defineField({
            name: 'sortOrder',
            title: 'Sort Order',
            type: 'number',
            group: 'organization',
            description: 'Lower numbers appear first within the category.',
            initialValue: 0,
        }),
    ],
    orderings: [
        { title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] },
        { title: 'Name', name: 'name', by: [{ field: 'name', direction: 'asc' }] },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'price',
            stockStatus: 'stockStatus',
            categoryLabel: 'category.label',
            salePrice: 'salePrice',
            media: 'image',
            categoryIcon: 'category.icon',
        },
        prepare({ title, subtitle, stockStatus, categoryLabel, salePrice, media, categoryIcon }) {
            const statusIcon: Record<string, string> = {
                'in-stock': '',
                'low-stock': '🔥 ',
                'out-of-stock': '🔴 ',
                'pre-order': '📦 ',
                'seasonal': '🌿 ',
            };
            const icon = statusIcon[stockStatus ?? 'in-stock'] ?? '';
            const priceDisplay = salePrice ? `${salePrice} (was ${subtitle})` : subtitle;
            return {
                title: `${icon}${title}`,
                subtitle: `${priceDisplay} — ${categoryLabel ?? ''}`,
                media: media || categoryIcon,
            };
        },
    },
});
