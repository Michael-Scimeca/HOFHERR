import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_API_WRITE_TOKEN!;

if (!projectId || !token) {
    console.error("Missing Sanity credentials in .env.local");
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
});

async function run() {
    console.log("Creating fake customer...");
    
    // 1. Create a fake customer
    const newCustomer = {
        _type: 'customer',
        name: 'John Doe Testing',
        email: `johndoe-${Date.now()}@example.com`,
        phone: '555-010-9999',
        isAdmin: false
    };
    
    const createdCustomer = await client.create(newCustomer);
    console.log(`Created customer: ${createdCustomer._id}`);
    
    console.log("Creating fake order for this customer...");
    
    // 2. Create a fake order
    const fakeOrder = {
        _type: 'order',
        customer: {
            _type: 'reference',
            _ref: createdCustomer._id
        },
        orderNumber: `ORD-${Math.floor(Math.random() * 100000)}`,
        items: [
            {
                _key: 'item1',
                name: 'Bone-In Ribeye',
                price: '38.99/lb',
                qty: 2,
                note: 'Thick cut'
            },
            {
                _key: 'item2',
                name: 'Chicken Breast',
                price: '8.99/lb',
                qty: 4,
                note: ''
            }
        ],
        total: 113.94,
        status: 'pending',
        stripeSessionId: `cs_test_${Math.floor(Math.random() * 10000000)}`
    };
    
    const createdOrder = await client.create(fakeOrder);
    console.log(`Created order: ${createdOrder._id} (Order #: ${createdOrder.orderNumber})`);
    
    console.log("Done! Check your admin dashboard.");
}

run().catch(err => {
    console.error("Error seeding data:", err);
});
