import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@sanity/client';
import bcrypt from 'bcryptjs';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
    console.error('Missing env vars! Check .env.local');
    process.exit(1);
}

const adminClient = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
});

async function setAdmin() {
    const email = 'mikeyscimeca@gmail.com';
    const password = 'asdfghjkl';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Setting admin: ${email}...`);

    try {
        const existing = await adminClient.fetch(`*[_type == "customer" && email == $email][0]`, { email });

        if (existing) {
            console.log('User exists, updating password and admin status...');
            await adminClient.patch(existing._id).set({
                password: hashedPassword,
                isAdmin: true
            }).commit();
            console.log('Done!');
        } else {
            console.log('User not found, creating new admin...');
            await adminClient.create({
                _type: 'customer',
                name: 'Michael Scimeca',
                email: email,
                password: hashedPassword,
                isAdmin: true,
                createdAt: new Date().toISOString(),
                phone: '---'
            });
            console.log('Created!');
        }
    } catch (err) {
        console.error('Error setting admin:', err);
    }
}

setAdmin();
