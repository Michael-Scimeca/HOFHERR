import { createClient } from '@sanity/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
    console.error('❌ Missing project ID or token in .env.local');
    process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false });

async function createSimulatedClient() {
    const email = 'simulated.client@gmail.com';
    const password = 'hofherr123';
    const name = 'James Peterson';
    const phone = '(847) 508-1122';

    console.log(`🚀 Creating simulated client: ${name} (${email})...`);

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Create or Update User
    const existingUser = await client.fetch('*[_type == "customer" && email == $email][0]', { email });
    let userId;

    if (existingUser) {
        console.log('   User exists, updating password...');
        await client.patch(existingUser._id).set({ password: hashedPassword, name, phone }).commit();
        userId = existingUser._id;
    } else {
        console.log('   Creating new user...');
        const newUser = await client.create({
            _id: 'customer-simulated',
            _type: 'customer',
            name,
            email,
            password: hashedPassword,
            phone,
            isAdmin: false,
            createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString() // Joined 1 year ago
        });
        userId = newUser._id;
    }

    // 2. Delete old orders for this user to start fresh
    console.log('   Cleaning up old orders...');
    const oldOrders = await client.fetch('*[_type == "order" && customer._ref == $userId]', { userId });
    for (const order of oldOrders) {
        await client.delete(order._id);
    }

    // 3. Create 4 Fake Orders
    const orderData = [
        {
            num: '64A1',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            status: 'paid',
            items: [
                { name: 'NY Strip Steak', price: '$42.99/lb', qty: 2 },
                { name: 'Twice Baked Potato', price: '$6.99 ea', qty: 4 }
            ],
            total: 11394
        },
        {
            num: '59B2',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
            status: 'completed',
            items: [
                { name: 'Double Smash Burger Kit', price: '$24.99', qty: 2 },
                { name: 'Bacon Jam', price: '$12.00', qty: 1 }
            ],
            total: 6198
        },
        {
            num: '12F5',
            date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // Dec/Jan
            status: 'completed',
            items: [
                { name: 'Whole Beef Tenderloin', price: '$44.99/lb', qty: 4 },
                { name: 'Creamed Spinach', price: '$14.00', qty: 2 }
            ],
            total: 20796
        },
        {
            num: '99X1',
            date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 4 months ago
            status: 'completed',
            items: [
                { name: 'Marinated Flank Steak', price: '$22.99/lb', qty: 2 },
                { name: 'Street Corn Salad', price: '$9.00', qty: 1 }
            ],
            total: 5498
        }
    ];

    console.log('   Populating 4 realistic orders...');
    for (const data of orderData) {
        await client.create({
            _type: 'order',
            orderNumber: data.num,
            customer: { _type: 'reference', _ref: userId },
            items: data.items,
            total: data.total,
            status: data.status,
            createdAt: data.date,
            pickupTime: '4pm-6pm'
        });
    }

    console.log('✅ Done! Simulated client is ready.');
}

createSimulatedClient().catch(console.error);
