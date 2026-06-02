import 'dotenv/config';
import { createClient } from '@sanity/client';
import bcrypt from 'bcryptjs';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('❌ SANITY_API_WRITE_TOKEN not set. Run: cp .env.local.example .env.local');
    process.exit(1);
}

const email = process.argv[2] || 'mikeyscimeca@gmail.com';
const result = await client.fetch(`*[_type == "customer" && email == $email]{_id, name, email, isAdmin}`, { email });
console.log('Found:', JSON.stringify(result, null, 2));

if (result.length > 0) {
    const id = result[0]._id;
    await client.patch(id).set({ isAdmin: true }).commit();
    console.log(`✅ Set isAdmin=true for ${email} (${id})`);
} else {
    console.log(`❌ No customer found with email: ${email}`);
    console.log('Creating admin account...');
    const hash = await bcrypt.hash('ChangeMe123!', 10);
    const doc = await client.create({
        _type: 'customer',
        name: 'Admin',
        email,
        password: hash,
        isAdmin: true,
        avatar: '/avatars/avator-pig.png',
    });
    console.log(`✅ Created admin account: ${doc._id}`);
    console.log(`⚠️  Default password is "ChangeMe123!" — change it immediately!`);
}
