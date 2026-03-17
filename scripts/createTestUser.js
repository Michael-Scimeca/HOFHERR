import { createClient } from '@sanity/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
});

async function main() {
    const email = 'test@example.com';
    const password = 'password123';
    
    // Check if exists
    const existing = await client.fetch(`*[_type == "customer" && email == $email][0]`, { email });
    if (existing) {
        console.log('User already exists. Logging credentials:');
        console.log('Email:', email);
        console.log('Password:', password);
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await client.create({
        _type: 'customer',
        email,
        password: hashedPassword,
        name: 'Test Customer',
        phone: '555-0100',
        isAdmin: false
    });
    
    console.log('Created test user!');
    console.log('Email:', email);
    console.log('Password:', password);
}

main().catch(console.error);
